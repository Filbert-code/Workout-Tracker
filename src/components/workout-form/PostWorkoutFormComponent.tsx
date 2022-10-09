import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  Fab,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SimpleDialog from "@mui/material/Dialog";
import { CloseRounded } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import PostWorkoutCardComponent from "./PostWorkoutCardComponent";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import {
  convertWorkoutToCardStates,
  Workout,
  WorkoutCardState,
} from "../../libs/Workout";
import { timeStamp } from "console";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Moment } from "moment";
import moment from "moment";
import { hasTokenExpired, refreshTokens } from "../../libs/AuthHelper";
import postWorkoutObjectValidationChecks from "../../libs/PostWorkoutObjectHelper";

export interface PostWorkoutObject {
  username: string;
  timestamp: string;
  workoutType: string;
  totalTime: string;
  exercises: string;
  exercisesRepsSetsWeight: string;
  notes: string;
}

type PostWorkoutFormComponentProps = {
  showPostWorkoutForm: boolean;
  setShowPostWorkoutForm: React.Dispatch<React.SetStateAction<boolean>>;
  workout: Workout;
  isUpdating: boolean;
  setTriggerFetchWorkouts: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerRefreshTokenExpired: React.Dispatch<React.SetStateAction<boolean>>;
};

function PostWorkoutFormComponent(props: PostWorkoutFormComponentProps) {
  const { workout } = props;
  const [workoutCards, setWorkoutCards] = useState(
    convertWorkoutToCardStates(workout)
  );
  const [workoutType, setWorkoutType] = useState(workout.workoutType);
  const [totalTime, setTotalTime] = useState(workout.totalTime);
  const [notes, setNotes] = useState(workout.notes);
  const [timestamp, setTimestamp] = useState(workout.timestamp);
  const [cardCount, setCardCount] = useState(workout.exercises.length);
  const [showValidationErrorMessage, setShowValidationErrorMessage] =
    useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  useEffect(() => {
    if (timestamp.length == 0) {
      console.log("updated Timestamp");
      setTimestamp(moment().unix().toString());
    }
  }, []);

  const createNewExercise = () => {
    setWorkoutCards([
      ...workoutCards,
      {
        id: cardCount,
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
      },
    ]);
    setCardCount(cardCount + 1);
  };

  const removeExercise = (cardId: number) => {
    const newCards = workoutCards.filter((card) => card.id !== cardId);

    setWorkoutCards(newCards);
  };

  // useEffect(() => {
  //   if (workoutCards.length > 0) {
  //     workoutCards.forEach((ele) => {
  //       console.log(
  //         `{ I: ${ele.id}, E: ${ele.exercise}, S: ${ele.sets}, R: ${ele.reps}, W: ${ele.weight} }`
  //       );
  //     });
  //     console.log("======================================");
  //   }
  // }, [workoutCards]);

  // either update or post a new workout
  function handleSubmitWorkout() {
    if (props.isUpdating) {
      updateWorkout();
    } else {
      postWorkout();
    }
  }

  const updateWorkout = async () => {
    if (hasTokenExpired()) {
      const ableToRefreshTokens = await refreshTokens();
      if (ableToRefreshTokens === "false") {
        props.setTriggerRefreshTokenExpired(true);
      }
    }
    const workoutObj: PostWorkoutObject = {
      username: localStorage.getItem("username")!!,
      timestamp: timestamp,
      workoutType: workoutType,
      totalTime: totalTime,
      exercises: workoutCards
        .map((ele) => {
          return ele.exercise;
        })
        .join(", "),
      exercisesRepsSetsWeight: workoutCards
        .map((ele) => {
          return [ele.reps, ele.sets, ele.weight].join(":");
        })
        .join(", "),
      notes: notes,
    };
    const validationErrorMessage =
      postWorkoutObjectValidationChecks(workoutObj);
    if (validationErrorMessage.length !== 0) {
      // an error message was returned from the validation checks, that's not good.
      setShowValidationErrorMessage(true);
      setValidationErrorMessage(validationErrorMessage);
      return;
    }
    const endpoint =
      "https://lgm3h1q06a.execute-api.us-west-2.amazonaws.com/dev";
    const route = "/workouts";
    try {
      const response = await fetch(endpoint + route, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("idToken")!!,
          type: "UPDATE",
        },
        body: JSON.stringify(workoutObj),
      });
      console.log(await response.json());
      props.setShowPostWorkoutForm(false);
      props.setTriggerFetchWorkouts(true);
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  const postWorkout = async () => {
    if (hasTokenExpired()) {
      const ableToRefreshTokens = await refreshTokens();
      if (ableToRefreshTokens === "false") {
        props.setTriggerRefreshTokenExpired(true);
      }
    }
    const workoutObj: PostWorkoutObject = {
      username: localStorage.getItem("username")!!,
      timestamp: timestamp,
      workoutType: workoutType,
      totalTime: totalTime,
      exercises: workoutCards
        .map((ele) => {
          return ele.exercise;
        })
        .join(", "),
      exercisesRepsSetsWeight: workoutCards
        .map((ele) => {
          return [ele.reps, ele.sets, ele.weight].join(":");
        })
        .join(", "),
      notes: notes,
    };
    const validationErrorMessage =
      postWorkoutObjectValidationChecks(workoutObj);
    if (validationErrorMessage.length !== 0) {
      // an error message was returned from the validation checks, that's not good.
      setShowValidationErrorMessage(true);
      setValidationErrorMessage(validationErrorMessage);
      return;
    }
    const endpoint =
      "https://lgm3h1q06a.execute-api.us-west-2.amazonaws.com/dev";
    const route = "/workouts";
    try {
      const response = await fetch(endpoint + route, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("idToken")!!,
          type: "POST",
        },
        body: JSON.stringify(workoutObj),
      });
      props.setShowPostWorkoutForm(false);
      props.setTriggerFetchWorkouts(true);
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  const handleDateTimeChange = (newDateTime: Moment | null) => {
    setTimestamp(newDateTime?.unix().toString()!!);
  };

  useEffect(() => {
    console.log(`timestamp: ${timestamp}`);
  });

  return (
    <SimpleDialog
      open={true}
      children={
        <Box sx={{ margin: 5 }}>
          <Box
            sx={{
              position: "sticky",
              top: 8,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {props.showPostWorkoutForm ? (
              <IconButton
                color="primary"
                aria-label="close"
                size="large"
                onClick={() => props.setShowPostWorkoutForm(false)}
              >
                <CloseRounded />
              </IconButton>
            ) : null}
          </Box>
          <Stack direction="column" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                disabled={props.isUpdating}
                label="Date & Time"
                value={
                  timestamp.length > 0
                    ? moment.unix(parseInt(timestamp))
                    : moment()
                }
                onChange={handleDateTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <Autocomplete
              disablePortal
              id="workout-type-input"
              options={["PUSH", "PULL", "SHOVE", "LEGS"]}
              onChange={(
                event: React.SyntheticEvent,
                value: string | { label: string } | null
              ) => {
                if (typeof value === "string") {
                  setWorkoutType(value);
                }
              }}
              freeSolo
              autoSelect
              value={workout.workoutType}
              renderInput={(params) => (
                <TextField {...params} label="Workout Type" />
              )}
            />
            <Autocomplete
              disablePortal
              id="total-time-input"
              options={["15", "30", "45", "60", "90"]}
              onChange={(
                event: React.SyntheticEvent,
                value: string | { label: string } | null
              ) => {
                if (typeof value === "string") {
                  setTotalTime(value);
                }
              }}
              freeSolo
              autoSelect
              value={workout.totalTime}
              renderInput={(params) => (
                <TextField {...params} label="Total Time" />
              )}
            />
            <Divider />
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography>Add Exercises</Typography>
            </Box>
            <Stack
              display="flex"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              {workoutCards.map((cardState, index) => (
                <PostWorkoutCardComponent
                  id={cardState.id}
                  workoutCards={workoutCards}
                  setWorkoutCards={setWorkoutCards}
                  onClose={() => removeExercise(cardState.id)}
                  key={index}
                />
              ))}
              <Fab color="primary" aria-label="add" onClick={createNewExercise}>
                <AddIcon />
              </Fab>
            </Stack>

            <TextField
              label="Notes"
              onChange={(event) => {
                setNotes(event.target.value);
              }}
              value={notes}
            />
            <Stack>
              <Button variant="contained" onClick={handleSubmitWorkout}>
                {props.isUpdating ? "Update Workout" : "Post Workout"}
              </Button>
            </Stack>
          </Stack>
          {showValidationErrorMessage && (
            <Alert
              variant="filled"
              severity="error"
              onClose={() => setShowValidationErrorMessage(false)}
            >
              {validationErrorMessage}
            </Alert>
          )}
        </Box>
      }
    />
  );
}

export default PostWorkoutFormComponent;
