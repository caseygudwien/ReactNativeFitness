import { neon } from "@neondatabase/serverless";
import "dotenv/config";
//creates sql connection
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            goalCalories INT,
            goalProtein INT
        )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS workouts(
        workout_id SERIAL PRIMARY KEY,
        user_id VARCHAR REFERENCES users(user_id),
        workout_type VARCHAR(255) NOT NULL,
        workout_time TIME(0),
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS workout_entries (
        entry_id SERIAL PRIMARY KEY,
        workout_id INT REFERENCES workouts(workout_id) ON DELETE CASCADE,
        exercise TEXT NOT NULL,
        reps DECIMAL(10,2),
        weight DECIMAL(10,2)
      )
    `;

    await sql`
    CREATE TABLE IF NOT EXISTS meals (
        user_id VARCHAR REFERENCES users(user_id) ON DELETE CASCADE,
        meal_id SERIAL PRIMARY KEY,
        meal_type VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )
    `;

    await sql`
    CREATE TABLE IF NOT EXISTS meal_entries (
        entry_id SERIAL PRIMARY KEY,
        meal_id INT REFERENCES meals(meal_id) ON DELETE CASCADE,
        meal_name VARCHAR(255) NOT NULL,
        calories DECIMAL(10,1),
        protein DECIMAL(10,1),
        fats DECIMAL(10,1),
        carbs DECIMAL(10,1)
    )
    `;
  } catch (e) {
    console.log("DB init error:", e);
    process.exit(1); // failure = 1, success = 0
  }
}
