import { WidthFull } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { COLUMN_DEFINITIONS } from "../../constants";
import {
  getDatesForTheWeek,
  getTimestampStartEnd,
} from "../../libs/DateHelper";
import {
  convertToWorkout,
  Workout,
  WorkoutCardState,
} from "../../libs/Workout";
import WorkoutScheduleCardComponent from "./WorkoutScheduleCardComponent";

type WorkoutScheduleComponentProps = {
  showWorkoutFormDialog: boolean;
  setShowWorkoutFormDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface WorkoutCardData {
  dayOfTheWeek: string;
  date: Date;
  workout: Workout | null;
}

function WorkoutScheduleComponent(props: WorkoutScheduleComponentProps) {
  const [workoutCardDataList, setWorkoutCardDataList] = useState<
    WorkoutCardData[]
  >([]);
  const [relativeDate, setRelativeDate] = useState(new Date());
  const { showWorkoutFormDialog, setShowWorkoutFormDialog } = props;

  const fetchWorkouts = async () => {
    const endpoint =
      "https://lgm3h1q06a.execute-api.us-west-2.amazonaws.com/dev";
    const route = "/workouts";

    const limit = 14;
    const timestamps = getTimestampStartEnd(relativeDate);
    const username = localStorage.getItem("username");
    const params = `?username=${username}?Limit=${limit}?startDate=${timestamps.start}?endDate=${timestamps.end}`;
    console.log(`ID Token: ${localStorage.getItem("idToken")}`);

    try {
      const response = await fetch(endpoint + route + params, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("idToken")!!,
        },
      });
      // convert json objects to workout objects
      const jsonObjects = await response.json();
      const workouts = convertToWorkout(jsonObjects);
      const daysOfTheWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const dates = getDatesForTheWeek(relativeDate);

      setWorkoutCardDataList(
        convertToWorkoutCardData(dates, daysOfTheWeek, workouts)
      );
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  function updateRelativeTimeAndUpdate(backOrNext: string) {
    let dateOffset = 0;
    if (backOrNext === "next") {
      dateOffset = 7;
    } else {
      dateOffset = -7;
    }
    setRelativeDate(
      new Date(relativeDate.setDate(relativeDate.getDate() + dateOffset))
    );
    fetchWorkouts();
  }

  function convertToWorkoutCardData(
    datesOfTheWeek: Date[],
    daysOfTheWeek: string[],
    workouts: Workout[]
  ) {
    const workoutCardDataList: WorkoutCardData[] = [];

    for (let i = 0; i < datesOfTheWeek.length; i++) {
      const currDate = datesOfTheWeek[i];
      let hasWorkoutOnThisDay = false;
      workouts.forEach((workout) => {
        const workoutDate = new Date(parseInt(workout.timestamp) * 1000);
        // Found a workout for this day of the week
        if (
          workoutDate.getDate() === currDate.getDate() &&
          workoutDate.getMonth() === currDate.getMonth() &&
          workoutDate.getFullYear() === currDate.getFullYear() &&
          !hasWorkoutOnThisDay
        ) {
          workoutCardDataList.push({
            dayOfTheWeek: daysOfTheWeek[i],
            date: currDate,
            workout: workout,
          });
          hasWorkoutOnThisDay = true;
        }
      });

      // did not find a workout for this day of the week
      if (!hasWorkoutOnThisDay) {
        workoutCardDataList.push({
          dayOfTheWeek: daysOfTheWeek[i],
          date: currDate,
          workout: null,
        });
      }
    }
    console.log(
      `workout list: ${workoutCardDataList.map((ele) => ele.workout)}`
    );
    return workoutCardDataList;
  }

  return (
    <Box>
      <Button onClick={fetchWorkouts}>Get Workouts</Button>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="contained"
          onClick={() => updateRelativeTimeAndUpdate("back")}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => updateRelativeTimeAndUpdate("next")}
        >
          Next
        </Button>
      </Stack>

      <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
        {workoutCardDataList.map((workoutCardData) => {
          return (
            <WorkoutScheduleCardComponent workoutCardData={workoutCardData} />
          );
        })}
      </Grid>
    </Box>
  );
}

export default WorkoutScheduleComponent;
