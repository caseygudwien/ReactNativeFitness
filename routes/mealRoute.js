import express from "express";
import { sql } from "../config/db.js";
import { getMealByMealId } from "../controllers/mealController.js";
import { getMealsByUserId } from "../controllers/mealController.js";
import { deleteMealByMealId } from "../controllers/mealController.js";
import { postMeal } from "../controllers/mealController.js";

const router = express.Router();

//X
router.post("/meal/", postMeal);

//X
router.get("/:mealId", getMealByMealId);

//X
router.get("/user/:userId", getMealsByUserId);

//X
router.delete("/:id", deleteMealByMealId);

export default router;
