import express from "express";
import { sql } from "../config/db.js";
import {
  getGoalsByUserId,
  getMealByMealId,
  updateGoalsByUserId,
} from "../controllers/mealController.js";
import { getMealsByUserId } from "../controllers/mealController.js";
import { deleteMealByMealId } from "../controllers/mealController.js";
import { postMeal } from "../controllers/mealController.js";

const router = express.Router();

router.post("/meal/", postMeal);
router.get("/:mealId", getMealByMealId);
router.delete("/:id", deleteMealByMealId);

router.get("/meal/:userId", getMealsByUserId);
router.get("/user/:userId", getGoalsByUserId);
router.put("/update/userId", updateGoalsByUserId);

export default router;
