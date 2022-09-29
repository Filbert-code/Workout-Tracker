import "./App.css";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import LoginDialogComponent from "./components/LoginDialogComponent";
import WorkoutTableComponent from "./components/WorkoutTableComponent";
import { useEffect, useState } from "react";
import { refreshTokens } from "./libs/clients/AuthHelper";
import { convertToWorkout, Workout } from "./libs/clients/Workout";
import TopNavigationComponent from "./components/TopNavigationComponent";
import PostWorkoutFormComponent from "./components/PostWorkoutFormComponent";

function App() {
  // refreshTokens();
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [tokensExpirationDate, setTokensExpirationDate] = useState(
    new Date(parseInt(localStorage.getItem("tokenExpireEpoch")!!))
  );
  const [refreshTokenExpirationDate, setRefreshTokenExpirationDate] = useState(
    new Date(parseInt(localStorage.getItem("refreshTokenExpireEpoch")!!))
  );
  const [workoutData, setWorkoutData] = useState<Workout[]>([]);
  const [showPostWorkoutForm, setShowPostWorkoutForm] = useState(true);

  useEffect(() => {
    const tokenExpireEpoch = parseInt(
      localStorage.getItem("tokenExpireEpoch")!!
    );
    console.log(
      `Time till tokens expire: ${new Date(
        tokenExpireEpoch - Date.now()
      ).getMinutes()}`
    );
    if (Date.now() > tokenExpireEpoch - 5 * 60 * 1000) {
      const refreshCredentials = async () => {
        const refreshResult: string = await refreshTokens();
        if (refreshResult) {
          setTokensExpirationDate(new Date(parseInt(refreshResult)));
          setShowLoginDialog(false);
          console.log("Credentials refreshed.");
        } else {
          setShowLoginDialog(true);
        }
      };
      refreshCredentials().catch(console.error);
    } else if (!tokenExpireEpoch) {
      setShowLoginDialog(true);
    } else {
      setShowLoginDialog(false);
    }
  });

  const fetchWorkouts = async () => {
    const endpoint =
      "https://lgm3h1q06a.execute-api.us-west-2.amazonaws.com/dev";
    const route = "/workouts";
    const params = "?Limit=5";
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
      // console.log(await response.json());
      // convert json objects to workout objects
      const jsonObjects = await response.json();
      const workouts = convertToWorkout(jsonObjects);
      console.log(`workouts: ${await workouts[0].exercisesDetails}`);
      setWorkoutData(workouts);
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  const postWorkout = async () => {
    const textObj = {
      workoutType: "PUSH",
      totalTime: "25",
      exercises: "Stuff",
      exercisesRepsSetsWeight: "More Stuff",
      notes: "I had some bacon for breakfast",
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
        },
        body: JSON.stringify(textObj),
      });
      console.log(await response.json());
    } catch (error) {
      // handle exception
      console.error();
    }
  };

  return (
    <div className="App">
      <TopNavigationComponent />
      <Stack>
        <Button>
          Refresh Token Expires at {refreshTokenExpirationDate.toTimeString()}
        </Button>
        <Button>
          ID/Access Tokens Expire at {tokensExpirationDate.toTimeString()}
        </Button>
        <Button onClick={fetchWorkouts}>Get Workouts</Button>
        <Button onClick={postWorkout}>Post Workout</Button>
      </Stack>
      <WorkoutTableComponent workoutData={workoutData} />
      {showLoginDialog && (
        <LoginDialogComponent
          setShowLoginDialog={setShowLoginDialog}
          setTokensExpirationDate={setTokensExpirationDate}
          setRefreshTokenExpirationDate={setRefreshTokenExpirationDate}
        />
      )}
      {showPostWorkoutForm && <PostWorkoutFormComponent />}
    </div>
  );
}

export default App;
