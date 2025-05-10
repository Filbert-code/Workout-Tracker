import { WorkoutUnformatted } from "../libs/WorkoutUnformatted";

export interface WorkoutDetails {
  sets: string;
  reps: string;
  weight: string;
}


export interface Workout {
  timestamp: string;
  workoutType: string;
  totalTime: string;
  exercises: string[];
  exercisesDetails: WorkoutDetails[];
  notes: string;
  id: string;
}

export const EMPTY_WORKOUT: Workout = {
  timestamp: "",
  workoutType: "",
  totalTime: "",
  exercises: [],
  exercisesDetails: [],
  notes: "",
  id: "",
};

export interface WorkoutCardState {
  id: number;
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
}

export const convertWorkoutToCardStates = (workout: Workout) => {
  let workoutCardStates: WorkoutCardState[] = [];
  for (let i = 0; i < workout.exercises.length; i++) {
    workoutCardStates.push({
      id: i,
      exercise: workout.exercises[i],
      sets: workout.exercisesDetails[i].sets,
      reps: workout.exercisesDetails[i].reps,
      weight: workout.exercisesDetails[i].weight,
    });
  }
  return workoutCardStates;
};

export const convertToWorkout = (workoutList: WorkoutUnformatted[]) => {
  let fetchedWorkoutArray: Workout[] = [];
  workoutList.forEach((rawWorkout: WorkoutUnformatted) => {
    const newWorkout: Workout = {
      timestamp: rawWorkout.timestamp,
      workoutType: rawWorkout.workoutType,
      totalTime: rawWorkout.totalTime,
      exercises: rawWorkout.exercises.split(", "),
      exercisesDetails: convertToWorkoutDetails(
        rawWorkout.exercisesRepsSetsWeight
      ),
      notes: rawWorkout.notes,
      id: rawWorkout.username + rawWorkout.timestamp,
    };
    fetchedWorkoutArray.push(newWorkout);
  });
  return fetchedWorkoutArray;
};

const convertToWorkoutDetails = (rawWorkoutDetailsString: string) => {
  let workoutDetailsList: WorkoutDetails[] = [];
  const individualWorkoutDetails = rawWorkoutDetailsString.split(", ");
  individualWorkoutDetails.forEach((workout) => {
    const details = workout.split(":");
    workoutDetailsList.push({
      sets: details[0],
      reps: details[1],
      weight: details[2],
    });
  });
  return workoutDetailsList;
};
