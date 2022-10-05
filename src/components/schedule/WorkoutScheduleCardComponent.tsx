import {
  Box,
  Card,
  CardActionArea,
  CardContent,
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
import { COLUMN_DEFINITIONS } from "../../constants";
import { DataGrid } from "@mui/x-data-grid";
import PostWorkoutFormComponent from "../workout-form/PostWorkoutFormComponent";
import { SetStateAction, useState } from "react";
import { EMPTY_WORKOUT } from "../../libs/Workout";

type WorkoutScheduleCardComponentProps = {
  workoutCardData: WorkoutCardData;
};

function WorkoutScheduleCardComponent(
  props: WorkoutScheduleCardComponentProps
) {
  const { dayOfTheWeek, date, workout } = props.workoutCardData;
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Grid xs={4}>
      <Card sx={{ overflow: "visible", marginY: 1, marginX: 1 }}>
        <CardContent>
          <Stack
            direction="row"
            sx={{ background: "#fff", justifyContent: "space-between" }}
          >
            <Box sx={{ background: "#fff" }}>
              <Typography variant="h4">{dayOfTheWeek}</Typography>
              <Typography variant="h6">{`${
                date.getMonth() + 1
              } / ${date.getDate()}`}</Typography>
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
          <Box height={300}>
            {workout ? (
              <DataGrid
                hideFooter
                rows={
                  workout?.exercises.map((exercise, index) => {
                    return {
                      id: index,
                      exercise: exercise,
                      sets: workout.exercisesDetails[index].sets,
                      reps: workout.exercisesDetails[index].reps,
                      weight: workout.exercisesDetails[index].weight,
                    };
                  })!!
                }
                columns={COLUMN_DEFINITIONS}
              />
            ) : (
              <Box sx={{ background: "#fff" }}>
                <Typography variant="h6">No workouts planned!</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
        <CardActionArea>
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
            <Fab>
              <DeleteIcon />
            </Fab>
            <Box>
              {isUpdating && (
                <PostWorkoutFormComponent
                  workout={workout != null ? workout : EMPTY_WORKOUT}
                  showPostWorkoutForm={isUpdating}
                  setShowPostWorkoutForm={setIsUpdating}
                />
              )}
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default WorkoutScheduleCardComponent;
