import "./App.css";
import Button from "@mui/material/Button";
import { Box, Container, Stack } from "@mui/material";
import LoginDialogComponent from "./components/authentication/LoginDialogComponent";
import { useEffect, useState } from "react";
import { refreshTokens } from "./libs/AuthHelper";
import {
  convertToWorkout,
  EMPTY_WORKOUT,
  Workout,
  WorkoutCardState,
} from "./libs/Workout";
import TopNavigationComponent from "./components/navigation/TopNavigationComponent";
import PostWorkoutFormComponent from "./components/workout-form/PostWorkoutFormComponent";
import WorkoutScheduleComponent from "./components/schedule/WorkoutScheduleComponent";

function App() {
  // refreshTokens();
  const [showWorkoutFormDialog, setShowWorkoutFormDialog] = useState(false);
  const [showLoginFormDialog, setShowLoginFormDialog] = useState(false);
  const [tokensExpirationDate, setTokensExpirationDate] = useState(
    new Date(parseInt(localStorage.getItem("tokenExpireEpoch")!!))
  );
  const [refreshTokenExpirationDate, setRefreshTokenExpirationDate] = useState(
    new Date(parseInt(localStorage.getItem("refreshTokenExpireEpoch")!!))
  );

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
          setShowLoginFormDialog(false);
          console.log("Credentials refreshed.");
        } else {
          setShowLoginFormDialog(true);
        }
      };
      refreshCredentials().catch(console.error);
    } else if (!tokenExpireEpoch) {
      setShowLoginFormDialog(true);
    } else {
      setShowLoginFormDialog(false);
    }
  });

  return (
    <Box>
      <TopNavigationComponent />
      <Container>
        <Stack>
          <Button>
            Refresh Token Expires at {refreshTokenExpirationDate.toTimeString()}
          </Button>
          <Button>
            ID/Access Tokens Expire at {tokensExpirationDate.toTimeString()}
          </Button>
          <Button onClick={() => setShowWorkoutFormDialog(true)}>
            Post Workout
          </Button>
        </Stack>
        <WorkoutScheduleComponent
          showWorkoutFormDialog={showWorkoutFormDialog}
          setShowWorkoutFormDialog={setShowWorkoutFormDialog}
        />
        {showLoginFormDialog && (
          <LoginDialogComponent
            setShowLoginDialog={setShowLoginFormDialog}
            setTokensExpirationDate={setTokensExpirationDate}
            setRefreshTokenExpirationDate={setRefreshTokenExpirationDate}
          />
        )}
        {showWorkoutFormDialog && (
          <PostWorkoutFormComponent
            workout={EMPTY_WORKOUT}
            showPostWorkoutForm={showWorkoutFormDialog}
            setShowPostWorkoutForm={setShowWorkoutFormDialog}
          />
        )}
      </Container>
    </Box>
  );
}

export default App;
