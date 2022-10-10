import "./App.css";
import Button from "@mui/material/Button";
import { Box, Container, Stack, Typography } from "@mui/material";
import LoginDialogComponent from "./components/authentication/LoginDialogComponent";
import { useEffect, useRef, useState } from "react";
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
import { FitnessCenter } from "@mui/icons-material";
import { useFrame } from "@react-three/fiber";
import AuthenticationComponent from "./components/authentication/AuthenticationComponent";

function App() {
  // localStorage.setItem("test", "This is a test.");

  const [showWorkoutFormDialog, setShowWorkoutFormDialog] = useState(false);
  const [showAuthentication, setShowAuthentication] = useState(false);
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

  // useEffect(() => {
  //   if (showSignupFormDialog === true) {
  //     setShowLoginFormDialog(false);
  //   } else {
  //     setShowLoginFormDialog(true);
  //   }
  // }, [showSignupFormDialog]);

  // useEffect(() => {
  //   if (showForgotPasswordDialog === true) {
  //     setShowLoginFormDialog(false);
  //   } else {
  //     setShowLoginFormDialog(true);
  //   }
  // }, [showForgotPasswordDialog]);

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
          setShowAuthentication(false);
          console.log("Credentials refreshed.");
        } else {
          setShowAuthentication(true);
        }
      };
      refreshCredentials().catch(console.error);
    } else if (!tokenExpireEpoch) {
      setShowAuthentication(true);
    } else {
      setShowAuthentication(false);
    }
    setTriggerRefreshTokenExpired(false);
  }, [triggerRefreshTokenExpired]);

  return (
    <Box>
      <TopNavigationComponent
        setTriggerRefreshTokenExpired={setTriggerRefreshTokenExpired}
      />
      <Container>
        <Stack paddingY={3}>
          {/* <Button>
            Refresh Token Expires at {refreshTokenExpirationDate.toTimeString()}
          </Button>
          <Button>
            ID/Access Tokens Expire at {tokensExpirationDate.toTimeString()}
          </Button> */}
          <Box display="flex" justifyContent="center">
            <Button
              color="primary"
              variant="contained"
              onClick={() => setShowWorkoutFormDialog(true)}
              startIcon={<FitnessCenter />}
              endIcon={<FitnessCenter />}
              size="large"
            >
              <Typography variant="h4">Post Workout</Typography>
            </Button>
          </Box>
        </Stack>
        <WorkoutScheduleComponent
          setTriggerRefreshTokenExpired={setTriggerRefreshTokenExpired}
          triggerFetchWorkouts={triggerFetchWorkouts}
          setTriggerFetchWorkouts={setTriggerFetchWorkouts}
          showWorkoutFormDialog={showWorkoutFormDialog}
          setShowWorkoutFormDialog={setShowWorkoutFormDialog}
        />
        {/* {showLoginFormDialog && (
          <LoginDialogComponent
            setShowLoginDialog={setShowLoginFormDialog}
            setShowSignupFormDialog={setShowSignupFormDialog}
            setShowForgotPasswordDialog={setShowForgotPasswordDialog}
            setTriggerFetchWorkouts={setTriggerFetchWorkouts}
          />
        )} */}
        {showAuthentication && (
          <AuthenticationComponent
            setTriggerFetchWorkouts={setTriggerFetchWorkouts}
            setShowAuthentication={setShowAuthentication}
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
