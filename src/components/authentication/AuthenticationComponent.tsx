import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import ForgotPasswordComponent from "./ForgotPasswordComponent";
import LoginDialogComponent from "./LoginDialogComponent";
import SignupDialogComponent from "./SignupDialogComponent";
import SimpleDialog from "@mui/material/Dialog";
import ConfirmSignupDialogComponent from "./ConfirmSignupDialogComponent";
import ConfirmForgotPasswordComponent from "./ConfirmForgotPasswordComponent";

type AuthenticationComponentProps = {
  setTriggerFetchWorkouts: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAuthentication: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthenticationComponent(props: AuthenticationComponentProps) {
  const { setTriggerFetchWorkouts, setShowAuthentication } = props;
  const [authComponentStack, setAuthComponentStack] = useState<JSX.Element[]>([
    <LoginDialogComponent
      setTriggerFetchWorkouts={setTriggerFetchWorkouts}
      navigateToSignupPage={navigateToSignupPage}
      navigateToForgotPasswordPage={navigateToForgotPasswordPage}
      setShowAuthentication={setShowAuthentication}
    />,
  ]);

  function handleBackNavigation() {
    // pop the top component off the component stack
    setAuthComponentStack(
      authComponentStack.slice(0, authComponentStack.length - 1)
    );
  }

  function navigateToSignupPage() {
    setAuthComponentStack([
      ...authComponentStack,
      <SignupDialogComponent
        navigateToConfirmSignupPage={navigateToConfirmSignupPage}
      />,
    ]);
  }

  function navigateToForgotPasswordPage() {
    setAuthComponentStack([
      ...authComponentStack,
      <ForgotPasswordComponent
        navigateToConfirmForgotPasswordPage={
          navigateToConfirmForgotPasswordPage
        }
      />,
    ]);
  }

  function navigateToConfirmSignupPage() {
    setAuthComponentStack([
      ...authComponentStack,
      <ConfirmSignupDialogComponent
        navigateBackToLogin={navigateBackToLogin}
      />,
    ]);
  }

  function navigateBackToLogin() {
    // clear the stack back to only having the login component
    setAuthComponentStack([
      <LoginDialogComponent
        setTriggerFetchWorkouts={setTriggerFetchWorkouts}
        navigateToSignupPage={navigateToSignupPage}
        navigateToForgotPasswordPage={navigateToForgotPasswordPage}
        setShowAuthentication={setShowAuthentication}
      />,
    ]);
  }

  function navigateToConfirmForgotPasswordPage() {
    setAuthComponentStack([
      ...authComponentStack,
      <ConfirmForgotPasswordComponent
        navigateBackToLogin={navigateBackToLogin}
      />,
    ]);
  }

  return (
    <Dialog transitionDuration={0} open={true}>
      <DialogTitle>
        {authComponentStack.length > 1 && (
          <IconButton onClick={handleBackNavigation}>
            <ArrowBack />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        {authComponentStack[authComponentStack.length - 1]}
      </DialogContent>
    </Dialog>
  );
}

export default AuthenticationComponent;
