import {
  ConfirmForgotPasswordCommand,
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

type ConfirmForgotPasswordComponentProps = {
  navigateBackToLogin: () => void;
};

function ConfirmForgotPasswordComponent(
  props: ConfirmForgotPasswordComponentProps
) {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordCheck, setEnteredPasswordCheck] = useState("");
  const [enteredConfirmationCode, setEnteredConfirmationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("Failed to Reset Password");
  const [showConfirmResetUnsuccessful, setShowConfirmResetUnsuccessful] =
    useState(false);
  const [showConfirmResetSuccessful, setShowConfirmResetSuccessful] =
    useState(false);

  const confirmResetUserPassword = async () => {
    if (
      enteredPassword.length === 0 ||
      enteredPasswordCheck.length === 0 ||
      enteredConfirmationCode.length === 0
    ) {
      setErrorMessage("Please fill in all fields.");
      setShowConfirmResetUnsuccessful(true);
      return;
    }
    const response = await userPoolClient
      .send(
        new ConfirmForgotPasswordCommand({
          ClientId: "1vdmuccspf3jne0ig707rd9foo",
          Username: localStorage.getItem("username")!!,
          Password: enteredPassword,
          ConfirmationCode: enteredConfirmationCode,
        })
      )
      .then((res) => {
        setShowConfirmResetSuccessful(true);
      })
      .catch((res) => {
        setErrorMessage(res.message);
        setShowConfirmResetUnsuccessful(true);
      });
  };

  return (
    <Box margin={5}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h4">Set Your New Password</Typography>
        <Typography variant="body2">
          The password reset requires a confirmation code that was sent to your
          email.
        </Typography>
        <TextField
          label="Enter Password"
          type="password"
          onChange={(event) => setEnteredPassword(event.target.value)}
        />
        <TextField
          label="Re-enter Password"
          type="password"
          onChange={(event) => setEnteredPasswordCheck(event.target.value)}
        />
        <TextField
          label="Confirmation Code"
          onChange={(event) => setEnteredConfirmationCode(event.target.value)}
        />
        <Button variant="contained" onClick={confirmResetUserPassword}>
          Reset Password
        </Button>

        <Snackbar
          open={showConfirmResetUnsuccessful}
          onClose={() => setShowConfirmResetUnsuccessful(false)}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={5000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showConfirmResetSuccessful}
          onClose={() => {
            setShowConfirmResetSuccessful(false);
            props.navigateBackToLogin();
          }}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={2000}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            You've successfully reset your password!
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}

export default ConfirmForgotPasswordComponent;
