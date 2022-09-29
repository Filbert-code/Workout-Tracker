import { WorkoutUnformatted } from "./WorkoutUnformatted";

export interface Workout {
  workoutType: string;
  exercises: string;
  exercisesDetails: string;
  date: string;
  notes: string;
  id: string;
}

export const convertToWorkout = (workoutList: WorkoutUnformatted[]) => {
  let fetchedWorkoutArray: Workout[] = [];
  workoutList.forEach((rawWorkout: WorkoutUnformatted) => {
    const newWorkout: Workout = {
      workoutType: rawWorkout.WorkoutType_TotalTime.split(",")[0],
      exercises: rawWorkout.Exercises,
      exercisesDetails: rawWorkout.ExercisesRepsSetsWeight,
      date: rawWorkout.Timestamp,
      notes: rawWorkout.Notes,
      id: rawWorkout.WorkoutType_TotalTime + rawWorkout.Timestamp,
    };
    fetchedWorkoutArray.push(newWorkout);
  });
  return fetchedWorkoutArray;
};
