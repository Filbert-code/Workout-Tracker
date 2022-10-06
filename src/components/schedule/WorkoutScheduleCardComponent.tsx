import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { WorkoutCardData } from "./WorkoutScheduleComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import NoteIcon from "@mui/icons-material/Note";
import { COLUMN_DEFINITIONS } from "../../constants";
import { DataGrid } from "@mui/x-data-grid";
import PostWorkoutFormComponent, {
  PostWorkoutObject,
} from "../workout-form/PostWorkoutFormComponent";
import { SetStateAction, useEffect, useState } from "react";
import { EMPTY_WORKOUT } from "../../libs/Workout";
import moment from "moment";
import { CloseRounded } from "@mui/icons-material";

type WorkoutScheduleCardComponentProps = {
  workoutCardData: WorkoutCardData;
  key: string;
  setTriggerFetchWorkouts: React.Dispatch<React.SetStateAction<boolean>>;
};

function WorkoutScheduleCardComponent(
  props: WorkoutScheduleCardComponentProps
) {
  const { dayOfTheWeek, date, workout } = props.workoutCardData;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const deleteWorkout = async () => {
    const workoutObj = {
      username: localStorage.getItem("username")!!,
      timestamp: workout?.timestamp,
    };
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
          type: "DELETE",
        },
        body: JSON.stringify(workoutObj),
      });
      console.log(await response.json());
      setIsDeleting(false);
      props.setTriggerFetchWorkouts(true);
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  return (
    <Grid xs={4} item>
      <Card sx={{ overflow: "visible", marginY: 1, marginX: 1 }}>
        <CardContent>
          <Stack
            direction="row"
            sx={{ background: "#fff", justifyContent: "space-between" }}
          >
            <Box sx={{ background: "#fff" }}>
              <Typography variant="h4">{dayOfTheWeek}</Typography>
              <Typography variant="h6">{`${date.format(
                "MMMM, Do"
              )}`}</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  background: "#fff",
                  border: 1,
                  padding: 1,
                }}
                variant="h6"
              >
                {workout ? workout?.workoutType : "NONE"}
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 1,
            }}
          >
            <Box>
              {workout && (
                <Typography variant="h6">{`${moment
                  .unix(parseInt(workout?.timestamp!!))
                  .format("h:mm:ss a")}`}</Typography>
              )}
            </Box>
            <Box>
              {workout?.notes && workout?.notes.length!! > 0 ? (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setShowNote(true)}
                >
                  <NoteIcon />
                </Button>
              ) : (
                <Button size="small" variant="contained" disabled>
                  <NoteIcon />
                </Button>
              )}
            </Box>
          </Box>
          <Dialog open={showNote} onClose={() => setShowNote(false)}>
            <DialogTitle id="notes-dialog-title">Notes:</DialogTitle>
            <DialogContent>
              <DialogContentText id="notes-dialog-description">
                {workout?.notes}
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Box height={300}>
            {workout ? (
              <DataGrid
                hideFooter
                rows={
                  workout?.exercises.map((exercise, index) => {
                    return {
                      id: index,
                      exercise: exercise,
                      sets: workout?.exercisesDetails[index].sets,
                      reps: workout?.exercisesDetails[index].reps,
                      weight: workout?.exercisesDetails[index].weight,
                    };
                  })!!
                }
                columns={COLUMN_DEFINITIONS}
              />
            ) : (
              <Box sx={{ background: "#fff" }}>
                {date.dayOfYear() < moment().dayOfYear() ? (
                  <Typography variant="h6">
                    Post a workout from the past!
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    Plan an upcoming workout!
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
        {workout ? (
          <Box
            sx={{
              display: "flex",
              background: "#fff",
              justifyContent: "space-evenly",
              paddingBottom: 1,
            }}
          >
            <Fab
              onClick={() => {
                setIsUpdating(true);
              }}
            >
              <EditIcon />
            </Fab>
            {!isDeleting ? (
              <Fab
                onClick={() => {
                  setIsDeleting(true);
                }}
              >
                <DeleteIcon />
              </Fab>
            ) : (
              <Box>
                <Fab onClick={deleteWorkout}>
                  <CheckIcon />
                </Fab>
                <Fab
                  onClick={() => {
                    setIsDeleting(false);
                  }}
                >
                  <CloseIcon />
                </Fab>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              background: "#fff",
              justifyContent: "space-evenly",
              paddingBottom: 1,
            }}
          >
            <Fab
              onClick={() => {
                setIsPosting(true);
              }}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}
        <Box>
          {isUpdating && (
            <PostWorkoutFormComponent
              isUpdating={true}
              workout={workout != null ? workout : EMPTY_WORKOUT}
              showPostWorkoutForm={isUpdating}
              setShowPostWorkoutForm={setIsUpdating}
              setTriggerFetchWorkouts={props.setTriggerFetchWorkouts}
            />
          )}
          {isPosting && (
            <PostWorkoutFormComponent
              isUpdating={false}
              workout={
                workout != null
                  ? workout
                  : {
                      timestamp: date.unix().toString(),
                      workoutType: "",
                      totalTime: "",
                      exercises: [],
                      exercisesDetails: [],
                      notes: "",
                      id: "",
                    }
              }
              showPostWorkoutForm={isPosting}
              setShowPostWorkoutForm={setIsPosting}
              setTriggerFetchWorkouts={props.setTriggerFetchWorkouts}
            />
          )}
        </Box>
      </Card>
    </Grid>
  );
}

export default WorkoutScheduleCardComponent;
