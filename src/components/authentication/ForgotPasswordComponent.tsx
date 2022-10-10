import {
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import SimpleDialog from "@mui/material/Dialog";
import { useState } from "react";
import { userPoolClient } from "../../libs/clients/UserPoolClient";

type ForgotPasswordComponentProps = {
  navigateToConfirmForgotPasswordPage: () => void;
};

function ForgotPasswordComponent(props: ForgotPasswordComponentProps) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("Reset Password Failed");
  const [showResetUnsuccessful, setShowResetUnsuccessful] = useState(false);
  const [showResetSuccessful, setShowResetSuccessful] = useState(false);

  const resetUserPassword = async () => {
    if (enteredUsername.length === 0) {
      setErrorMessage("Please enter your username.");
      setShowResetUnsuccessful(true);
      return;
    }
    const response = await userPoolClient
      .send(
        new ForgotPasswordCommand({
          ClientId: "1vdmuccspf3jne0ig707rd9foo",
          Username: enteredUsername,
        })
      )
      .then((res) => setShowResetSuccessful(true))
      .catch((res) => {
        setErrorMessage(res.message);
        setShowResetUnsuccessful(true);
      });
  };

  return (
    <Box margin={5}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h4">Reset Password</Typography>
        <TextField
          label="Enter Your Username"
          onChange={(event) => setEnteredUsername(event.target.value)}
        />
        <Button variant="contained" onClick={resetUserPassword}>
          Send
        </Button>

        <Snackbar
          open={showResetUnsuccessful}
          onClose={() => setShowResetUnsuccessful(false)}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={5000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showResetSuccessful}
          onClose={() => {
            setShowResetSuccessful(false);
            localStorage.setItem("username", enteredUsername);
            props.navigateToConfirmForgotPasswordPage();
          }}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={2000}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            A message was sent to your email with the reset-password
            confirmation code.
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}

export default ForgotPasswordComponent;
