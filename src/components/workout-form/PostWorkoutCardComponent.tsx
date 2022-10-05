import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { WorkoutCardState } from "../../libs/Workout";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

type PostWorkoutCardComponentProps = {
  id: number;
  onClose: (id: number) => void;
  setWorkoutCards: React.Dispatch<React.SetStateAction<WorkoutCardState[]>>;
  workoutCards: WorkoutCardState[];
};

function PostWorkoutCardComponent(props: PostWorkoutCardComponentProps) {
  const [cardNum, setCardNum] = useState(props.id + 1);
  const workoutCardState = props.workoutCards.filter((ele) => {
    return ele.id === props.id;
  })[0];
  useEffect(() => {
    for (let i = 0; i < props.workoutCards.length; i++) {
      if (props.workoutCards[i].id === props.id) {
        setCardNum(i + 1);
      }
    }
    console.log(`Card num: ${cardNum}`);
    console.log(`id: ${props.id}`);
    console.log(`Workout Cards: ${props.workoutCards}`);
  });
  return (
    <Card sx={{ width: 345, overflow: "visible" }}>
      <CardHeader title={`Exercise ${cardNum.toString()}`} />
      <CardActionArea>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 xs={12}>
              <Autocomplete
                disablePortal
                id="exercise-input"
                options={[
                  "Dumbell Presses",
                  "Lateral Raises",
                  "Squats",
                  "Deadlift",
                ]}
                onChange={(event: React.SyntheticEvent, value: string | null) =>
                  props.setWorkoutCards(
                    props.workoutCards.map((ele) => {
                      if (ele.id === props.id) {
                        if (typeof value === "string") {
                          ele.exercise = value;
                        }
                      }
                      return ele;
                    })
                  )
                }
                freeSolo
                autoSelect
                value={workoutCardState.exercise}
                renderInput={(params) => (
                  <TextField {...params} label="Exercise" variant="standard" />
                )}
              />
            </Grid2>
            <Grid2 xs={4}>
              <Autocomplete
                disablePortal
                id="sets-input"
                options={["1", "2", "3", "4"]}
                onChange={(event: React.SyntheticEvent, value: string | null) =>
                  props.setWorkoutCards(
                    props.workoutCards.map((ele) => {
                      if (ele.id === props.id) {
                        if (typeof value === "string") {
                          ele.sets = value;
                        }
                      }
                      return ele;
                    })
                  )
                }
                freeSolo
                autoSelect
                value={workoutCardState.sets}
                renderInput={(params) => (
                  <TextField {...params} label="# of Sets" variant="standard" />
                )}
              />
            </Grid2>
            <Grid2 xs={4}>
              <Autocomplete
                disablePortal
                id="reps-input"
                options={["1", "2", "3", "4"]}
                onChange={(event: React.SyntheticEvent, value: string | null) =>
                  props.setWorkoutCards(
                    props.workoutCards.map((ele) => {
                      if (ele.id === props.id) {
                        if (typeof value === "string") {
                          ele.reps = value;
                        }
                      }
                      return ele;
                    })
                  )
                }
                freeSolo
                autoSelect
                value={workoutCardState.reps}
                renderInput={(params) => (
                  <TextField {...params} label="# of Reps" variant="standard" />
                )}
              />
            </Grid2>
            <Grid2 xs={4}>
              <Autocomplete
                disablePortal
                id="weight-input"
                options={[
                  "10",
                  "20",
                  "30",
                  "40",
                  "50",
                  "60",
                  "70",
                  "80",
                  "90",
                  "100",
                ]}
                onChange={(event: React.SyntheticEvent, value: string | null) =>
                  props.setWorkoutCards(
                    props.workoutCards.map((ele) => {
                      if (ele.id === props.id) {
                        if (typeof value === "string") {
                          ele.weight = value;
                        }
                      }
                      return ele;
                    })
                  )
                }
                freeSolo
                autoSelect
                value={workoutCardState.weight}
                renderInput={(params) => (
                  <TextField {...params} label="Weight" variant="standard" />
                )}
              />
            </Grid2>
          </Grid2>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => props.onClose(props.id)}
        >
          Close
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostWorkoutCardComponent;
