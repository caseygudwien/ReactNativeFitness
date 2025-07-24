import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import workoutRoute from "./routes/workoutRoute.js";
import mealRoute from "./routes/mealRoute.js";
import job from "./config/cron.js";

//bla
dotenv.config();

if (process.env.NODE_ENV === "production") job.start();

const app = express();
const port = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(rateLimiter);
app.use(express.json());

app.use("/api/workouts", workoutRoute);
app.use("/api/meals", mealRoute);
//make another route section for food

initDB().then(() => {
  app.listen(port, () => {
    console.log("server up port:", port);
  });
});
