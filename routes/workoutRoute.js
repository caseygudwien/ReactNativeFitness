import express from "express";
import { sql } from "../config/db.js";
import { getWorkoutsByUserId } from "../controllers/workoutController.js";
import { postWorkout } from "../controllers/workoutController.js";
import { deleteWorkoutByWorkoutId } from "../controllers/workoutController.js";
import { getSummaryByWorkoutId } from "../controllers/workoutController.js";
import { getTotalSummaryByUserId } from "../controllers/workoutController.js";

const router = express.Router();

//X
router.post("/workout/", postWorkout);

//X
router.get("/summary/:workoutId", getSummaryByWorkoutId);

//X
router.get("/totalSummary/:userId", getTotalSummaryByUserId);

//X
router.get("/:userId", getWorkoutsByUserId);

//X
router.delete("/:id", deleteWorkoutByWorkoutId);

export default router;
