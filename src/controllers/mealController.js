import { sql } from "../config/db.js";

export async function getMealsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const meals = await sql`
    SELECT * FROM meals WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(meals);
  } catch (e) {
    console.log("Error getting meal", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function postMeal(req, res) {
  try {
    const { user_id, meal_type, meal_name, calories, protein, fats, carbs } =
      req.body;

    const [meal] = await sql`
      INSERT INTO meals(user_id, meal_type)
      VALUES(${user_id}, ${meal_type})
      RETURNING meal_id
    `;

    await sql`
    INSERT INTO meal_entries(meal_id, meal_name, calories, protein, fats, carbs)
    VALUES(
        ${meal.meal_id},
        ${meal_name},
        ${calories},
        ${protein},
        ${fats},
        ${carbs}
    )
    `;

    res.status(201).json(meal);
  } catch (e) {
    onsole.log("Error creating meal", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function getMealByMealId(req, res) {
  try {
    const { mealId } = req.params;

    const calsResult = await sql`
      SELECT me.calories as cals From meal_entries me WHERE me.meal_id = ${mealId};
    `;

    const proteinResult = await sql`
      SELECT me.protein as pro From meal_entries me WHERE me.meal_id = ${mealId};
    `;

    const carbsResult = await sql`
      SELECT me.carbs as carbs From meal_entries me WHERE me.meal_id = ${mealId};
    `;

    const fatsResult = await sql`
      SELECT me.fats as fats From meal_entries me WHERE me.meal_id = ${mealId};
    `;

    res.status(200).json({
      calories: calsResult[0].cals,
      protein: proteinResult[0].pro,
      carbs: carbsResult[0].carbs,
      fats: fatsResult[0].fats,
    });
  } catch (e) {
    console.log("Error creating summary", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function deleteMealByMealId(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "invalid id" });
    }

    const result =
      await sql` DELETE FROM meals WHERE meal_id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (e) {
    console.log("Error deleting meal", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function getGoalsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const user = await sql`SELECT * FROM users WHERE user_id = ${userId};`;
    res.status(200).json(user);
  } catch (e) {
    console.log("Error getting goals: ", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}
