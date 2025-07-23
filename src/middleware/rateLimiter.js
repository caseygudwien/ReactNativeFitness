import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //change to userId or Ip address later

    const identifier = req.ip || req.connection.remoteAddress || "anonymous";

    const { success } = await rateLimit.limit(identifier);
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (e) {
    console.log("Rate Limiter error", e);
    next(e);
  }
};

export default rateLimiter;
