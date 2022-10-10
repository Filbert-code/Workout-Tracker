import {
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SimpleDialog from "@mui/material/Dialog";
import { useState } from "react";
import { userPoolClient } from "../../libs/clients/UserPoolClient";

type ConfirmSignupDialogComponentProps = {
  navigateBackToLogin: () => void;
};

function ConfirmSignupDialogComponent(
  props: ConfirmSignupDialogComponentProps
) {
  const [enteredCode, setEnteredCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("Sign up failed");
  const [showConfirmationUnsuccessful, setShowConfirmationUnsuccessful] =
    useState(false);
  const [showConfirmationSuccessful, setShowConfirmationSuccessful] =
    useState(false);

  const confirmUser = async () => {
    if (enteredCode.length === 0) {
      setErrorMessage("Please enter the code sent to your email.");
      setShowConfirmationUnsuccessful(true);
      return;
    }
    const response = await userPoolClient
      .send(
        new ConfirmSignUpCommand({
          ClientId: "1vdmuccspf3jne0ig707rd9foo",
          Username: localStorage.getItem("username")!!,
          ConfirmationCode: enteredCode,
        })
      )
      .then((res) => setShowConfirmationSuccessful(true))
      .catch((res) => {
        setErrorMessage(res.message);
        setShowConfirmationUnsuccessful(true);
      });
  };

  return (
    <Box margin={5}>
      <Stack direction="column" spacing={2}>
        <TextField
          label="Enter Code Sent to Your Email"
          onChange={(event) => setEnteredCode(event.target.value)}
        />
        <Button variant="contained" onClick={confirmUser}>
          Verify
        </Button>

        <Snackbar
          open={showConfirmationUnsuccessful}
          onClose={() => setShowConfirmationUnsuccessful(false)}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={5000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showConfirmationSuccessful}
          onClose={() => {
            setShowConfirmationSuccessful(false);
            props.navigateBackToLogin();
          }}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={3000}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Email Verfied! You're all set to sign in.
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}

export default ConfirmSignupDialogComponent;
