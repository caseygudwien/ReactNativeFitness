import { sql } from "../config/db.js";

export async function getWorkoutsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const workouts = await sql`
    SELECT * FROM workouts WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(workouts);
  } catch (e) {
    console.log("Error getting workout", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function postWorkout(req, res) {
  try {
    const { user_id, workout_name, exercises } = req.body;

    if (!user_id || !Array.isArray(exercises)) {
      return res.status(400).json({ message: "Invalid input structure" });
    }

    const [workout] = await sql`
      INSERT INTO workouts(user_id, workout_type, created_at)
      VALUES (${user_id}, ${workout_name || "General"}, NOW())
      RETURNING *
    `;

    for (const exercise of exercises) {
      if (!exercise.name || !Array.isArray(exercise.sets)) {
        continue; // or throw an error if this is required
      }

      for (const set of exercise.sets) {
        await sql`
          INSERT INTO workout_entries(workout_id, exercise, reps, weight)
          VALUES (
            ${workout.workout_id},
            ${exercise.name},
            ${set.reps},
            ${set.weight}
          )
        `;
      }
    }

    res.status(201).json(workout);
  } catch (e) {
    console.log("Error creating workout", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function deleteWorkoutByWorkoutId(req, res) {
  try {
    const { id } = req.params;

    //if (isNaN(parseInt(workout_id))) {
    // return res.status(400).json({ message: "invalid id" });
    // }

    const result =
      await sql` DELETE FROM workouts WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (e) {
    console.log("Error deleting workout", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function getSummaryByWorkoutId(req, res) {
  try {
    const { workoutId } = req.params;

    const volumeResult = await sql`
      SELECT COALESCE(SUM(we.weight*we.reps),0) as volume 
      FROM workout_entries we   
      WHERE we.workout_id = ${workoutId};
    `;

    const repsResult = await sql`
      SELECT COALESCE(SUM(we.reps),0) as reps 
      FROM workout_entries we
      WHERE we.workout_id= ${workoutId};
    `;

    const setsResult = await sql`
      SELECT COUNT(we.workout_id) as sets
      FROM workout_entries we
      WHERE we.workout_id = ${workoutId};
    `;

    res.status(200).json({
      volume: Number(volumeResult[0].volume),
      reps: Number(repsResult[0].reps),
      sets: Number(setsResult[0].sets),
    });
  } catch (e) {
    console.log("Error creating summary", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}

export async function getTotalSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const summaryResult = await sql`
     SELECT 
        COALESCE(SUM(we.weight * we.reps), 0) as volume,
        COALESCE(SUM(we.reps), 0) as total_reps,
        COUNT(we.entry_id) as total_sets,
        COUNT(DISTINCT w.workout_id) as total_workouts,
        EXTRACT(EPOCH FROM COALESCE(SUM(w.workout_time), INTERVAL '0 seconds')) AS total_time
      FROM workout_entries we
      JOIN workouts w ON we.workout_id = w.workout_id
      WHERE w.user_id = ${userId}
    `;

    res.status(200).json({
      volume: Number(summaryResult[0].volume),
      reps: Number(summaryResult[0].total_reps),
      sets: Number(summaryResult[0].total_sets),
      workouts: Number(summaryResult[0].total_workouts),
      time: Number(summaryResult[0].total_time),
    });
  } catch (e) {
    console.log("Error creating summary", e);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: e.message });
  }
}
