import "./App.css";
import Button from "@mui/material/Button";
import { Box, Container, Stack } from "@mui/material";
import LoginDialogComponent from "./components/authentication/LoginDialogComponent";
import { useEffect, useState } from "react";
import { hasTokenExpired, refreshTokens } from "./libs/AuthHelper";
import {
  convertToWorkout,
  EMPTY_WORKOUT,
  Workout,
  WorkoutCardState,
} from "./libs/Workout";
import TopNavigationComponent from "./components/navigation/TopNavigationComponent";
import PostWorkoutFormComponent from "./components/workout-form/PostWorkoutFormComponent";
import WorkoutScheduleComponent from "./components/schedule/WorkoutScheduleComponent";
import SignupDialogComponent from "./components/authentication/SignupDialogComponent";
import ForgotPasswordComponent from "./components/authentication/ForgotPasswordComponent";

function App() {
  // localStorage.setItem("test", "This is a test.");

  const [showWorkoutFormDialog, setShowWorkoutFormDialog] = useState(false);
  const [showLoginFormDialog, setShowLoginFormDialog] = useState(false);
  const [showSignupFormDialog, setShowSignupFormDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState(false);
  const [tokensExpirationDate, setTokensExpirationDate] = useState(
    new Date(parseInt(localStorage.getItem("tokenExpireEpoch")!!))
  );
  const [refreshTokenExpirationDate, setRefreshTokenExpirationDate] = useState(
    new Date(parseInt(localStorage.getItem("refreshTokenExpireEpoch")!!))
  );
  const [triggerFetchWorkouts, setTriggerFetchWorkouts] = useState(false);
  const [triggerRefreshTokenExpired, setTriggerRefreshTokenExpired] =
    useState(false);

  useEffect(() => {
    if (showSignupFormDialog === true) {
      setShowLoginFormDialog(false);
    } else {
      setShowLoginFormDialog(true);
    }
  }, [showSignupFormDialog]);

  useEffect(() => {
    if (showForgotPasswordDialog === true) {
      setShowLoginFormDialog(false);
    } else {
      setShowLoginFormDialog(true);
    }
  }, [showForgotPasswordDialog]);

  useEffect(() => {
    const tokenExpireEpoch = parseInt(
      localStorage.getItem("tokenExpireEpoch")!!
    );
    if (hasTokenExpired()) {
      console.log("refreshing...");
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
    setTriggerRefreshTokenExpired(false);
  }, [triggerRefreshTokenExpired]);

  return (
    <Box>
      <TopNavigationComponent
        setTriggerRefreshTokenExpired={setTriggerRefreshTokenExpired}
      />
      <Container>
        <Stack>
          {/* <Button>
            Refresh Token Expires at {refreshTokenExpirationDate.toTimeString()}
          </Button>
          <Button>
            ID/Access Tokens Expire at {tokensExpirationDate.toTimeString()}
          </Button> */}
          <Button onClick={() => setShowWorkoutFormDialog(true)}>
            Post Workout
          </Button>
        </Stack>
        <WorkoutScheduleComponent
          setTriggerRefreshTokenExpired={setTriggerRefreshTokenExpired}
          triggerFetchWorkouts={triggerFetchWorkouts}
          setTriggerFetchWorkouts={setTriggerFetchWorkouts}
          showWorkoutFormDialog={showWorkoutFormDialog}
          setShowWorkoutFormDialog={setShowWorkoutFormDialog}
        />
        {showLoginFormDialog && (
          <LoginDialogComponent
            setShowLoginDialog={setShowLoginFormDialog}
            setShowSignupFormDialog={setShowSignupFormDialog}
            setShowForgotPasswordDialog={setShowForgotPasswordDialog}
            setTokensExpirationDate={setTokensExpirationDate}
            setRefreshTokenExpirationDate={setRefreshTokenExpirationDate}
            setTriggerFetchWorkouts={setTriggerFetchWorkouts}
          />
        )}
        {showSignupFormDialog && (
          <SignupDialogComponent
            setShowSignupFormDialog={setShowSignupFormDialog}
          />
        )}
        {showForgotPasswordDialog && (
          <ForgotPasswordComponent
            setShowForgotPasswordDialog={setShowForgotPasswordDialog}
          />
        )}
        {showWorkoutFormDialog && (
          <PostWorkoutFormComponent
            setTriggerRefreshTokenExpired={setTriggerRefreshTokenExpired}
            setTriggerFetchWorkouts={setTriggerFetchWorkouts}
            isUpdating={false}
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
