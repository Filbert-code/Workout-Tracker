import {
  ArrowBack,
  ArrowForward,
  ArrowLeft,
  ArrowRight,
  WidthFull,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Moment } from "moment";
import { useEffect, useState } from "react";
import { COLUMN_DEFINITIONS } from "../../constants";
import { hasTokenExpired, refreshTokens } from "../../libs/AuthHelper";
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
  triggerFetchWorkouts: boolean;
  setTriggerFetchWorkouts: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerRefreshTokenExpired: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface WorkoutCardData {
  dayOfTheWeek: string;
  date: Moment;
  workout: Workout | null;
}

function WorkoutScheduleComponent(props: WorkoutScheduleComponentProps) {
  const [workoutCardDataList, setWorkoutCardDataList] = useState<
    WorkoutCardData[]
  >([]);
  const [relativeDate, setRelativeDate] = useState(moment());

  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    handleFetchWorkouts();
    props.setTriggerFetchWorkouts(false);
  }, [props.triggerFetchWorkouts]);

  useEffect(() => {
    const dates = getDatesForTheWeek(relativeDate);
    let cards: WorkoutCardData[] = [];
    for (let i = 0; i < 7; i++) {
      cards.push({
        dayOfTheWeek: daysOfTheWeek[i],
        date: dates[i],
        workout: null,
      });
    }
    setWorkoutCardDataList(cards);
  }, []);

  const handleFetchWorkouts = async () => {
    console.log("Fetching workouts...");
    if (hasTokenExpired()) {
      console.log("Fetch request: Token expired.");
      const ableToRefreshTokens = await refreshTokens();
      if (ableToRefreshTokens === "false") {
        props.setTriggerRefreshTokenExpired(true);
      }
    }
    const endpoint =
      "https://lgm3h1q06a.execute-api.us-west-2.amazonaws.com/dev";
    const route = "/workouts";

    const limit = 7;
    const timestamps = getTimestampStartEnd(relativeDate);
    const username = localStorage.getItem("username");
    const params = `?username=${username}&Limit=${limit}&startDate=${timestamps.start}&endDate=${timestamps.end}`;

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

      const dates = getDatesForTheWeek(relativeDate);

      setWorkoutCardDataList(
        convertToWorkoutCardData(dates, daysOfTheWeek, workouts)
      );
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  useEffect(() => {
    handleFetchWorkouts();
  }, []);

  useEffect(() => {
    handleFetchWorkouts();
  }, [relativeDate]);

  function updateRelativeTimeAndUpdate(backOrNext: string) {
    let dateOffset = 0;
    if (backOrNext === "next") {
      const dateClone = relativeDate.clone();
      setRelativeDate(dateClone.add(7, "days"));
    } else {
      const dateClone = relativeDate.clone();
      setRelativeDate(dateClone.subtract(7, "days"));
    }
  }

  function convertToWorkoutCardData(
    datesOfTheWeek: Moment[],
    daysOfTheWeek: string[],
    workouts: Workout[]
  ) {
    const workoutCardList: WorkoutCardData[] = [];

    for (let i = 0; i < datesOfTheWeek.length; i++) {
      const currDate = datesOfTheWeek[i];
      let hasWorkoutOnThisDay = false;
      workouts.forEach((workout) => {
        const workoutDate: Moment = moment.unix(parseInt(workout.timestamp));
        // console.log(
        //   `i: ${i}, WorkoutDate Day: ${workoutDate.date()}, currDate Day: ${currDate.date()}`
        // );
        // Found a workout for this day of the week
        if (
          workoutDate.date() === currDate.date() &&
          workoutDate.month() === currDate.month() &&
          workoutDate.year() === currDate.year() &&
          !hasWorkoutOnThisDay
        ) {
          workoutCardList.push({
            dayOfTheWeek: daysOfTheWeek[i],
            date: currDate,
            workout: workout,
          });
          hasWorkoutOnThisDay = true;
        }
      });

      // did not find a workout for this day of the week
      if (!hasWorkoutOnThisDay) {
        workoutCardList.push({
          dayOfTheWeek: daysOfTheWeek[i],
          date: currDate,
          workout: null,
        });
      }
    }
    return workoutCardList;
  }

  return (
    <Box>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
        {/* <Grid xs={12} item>
          
        </Grid> */}
        {workoutCardDataList.map((workoutCardData, index) => {
          return (
            <WorkoutScheduleCardComponent
              key={index.toString()}
              workoutCardData={workoutCardData}
              setTriggerFetchWorkouts={props.setTriggerFetchWorkouts}
              setTriggerRefreshTokenExpired={
                props.setTriggerRefreshTokenExpired
              }
            />
          );
        })}
      </Grid>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "sticky",
          bottom: 8,
          display: "flex",
          justifyContent: "center",
          zIndex: "1200",
        }}
      >
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => updateRelativeTimeAndUpdate("back")}
          startIcon={<ArrowBack />}
          sx={{ borderRadius: 4 }}
        >
          <Typography variant="body1">Prev Week</Typography>
        </Button>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => updateRelativeTimeAndUpdate("next")}
          endIcon={<ArrowForward />}
          sx={{ borderRadius: 4 }}
        >
          <Typography variant="body1">Next Week</Typography>
        </Button>
      </Stack>
    </Box>
  );
}

export default WorkoutScheduleComponent;
