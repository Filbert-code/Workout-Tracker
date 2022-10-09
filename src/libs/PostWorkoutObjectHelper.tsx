import { PostWorkoutObject } from "../components/workout-form/PostWorkoutFormComponent";

// PostWorkoutObject
// username: string;
// timestamp: string;
// workoutType: string;
// totalTime: string;
// exercises: string;
// exercisesRepsSetsWeight: string;
// notes: string;

function postWorkoutObjectValidationChecks(postWorkoutObj: PostWorkoutObject) {
  const { workoutType, totalTime, exercises, exercisesRepsSetsWeight, notes } =
    postWorkoutObj;

  if (checkWorkoutType(workoutType) === false) {
    return "Invalid Workout Type";
  }
  if (checkTotalTime(totalTime) === false) {
    return "Invalid Total Time";
  }
  if (checkExercises(exercises) === false) {
    return "One of the exercise names is invalid";
  }
  if (checkExercisesRepsSetsWeight(exercisesRepsSetsWeight) === false) {
    return "One of the exercise parameters was invalid";
  }
  return "";
}

function checkWorkoutType(workoutType: string) {
  const re = /^[a-zA-Z]*$/;
  return re.test(workoutType);
}

function checkTotalTime(totalTime: string) {
  const re = /^[0-9]*$/;
  return re.test(totalTime);
}

function checkExercises(exercises: string) {
  const re = /^(?:\w| |\(|\)|,|-|:)*$/;
  return re.test(exercises);
}

function checkExercisesRepsSetsWeight(exercisesRepsSetsWeight: string) {
  const re = /^(?:[0-9]| |,|:)*$/;
  return re.test(exercisesRepsSetsWeight);
}

export default postWorkoutObjectValidationChecks;
