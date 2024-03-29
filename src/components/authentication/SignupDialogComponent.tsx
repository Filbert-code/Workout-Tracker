import {
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
import { useEffect, useState } from "react";
import { userPoolClient } from "../../libs/clients/UserPoolClient";

type SignupDialogComponentProps = {
  navigateToConfirmSignupPage: () => void;
};

function SignupDialogComponent(props: SignupDialogComponentProps) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showSignupSuccessful, setShowSignupSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Sign up failed");
  const [showSignupUnsuccessful, setShowSignupUnsuccessful] = useState(false);

  const signUpUser = async () => {
    if (
      enteredUsername.length === 0 ||
      enteredEmail.length === 0 ||
      enteredPassword.length === 0
    ) {
      setErrorMessage("Please fill in all fields.");
      setShowSignupUnsuccessful(true);
      return;
    }
    const response = await userPoolClient
      .send(
        new SignUpCommand({
          ClientId: "1vdmuccspf3jne0ig707rd9foo",
          Username: enteredUsername,
          Password: enteredPassword,
          UserAttributes: [
            {
              Name: "email",
              Value: enteredEmail,
            },
          ],
        })
      )
      .then((res) => {
        setShowSignupSuccessful(true);
      })
      .catch((res) => {
        setErrorMessage(res.message);
        setShowSignupUnsuccessful(true);
      });
  };

  return (
    <Box margin={5}>
      <Stack direction="column" spacing={2}>
        <TextField
          label="Choose a Username"
          onChange={(event) => setEnteredUsername(event.target.value)}
        />
        <TextField
          label="Enter a Valid Email"
          type="email"
          onChange={(event) => setEnteredEmail(event.target.value)}
        />
        <TextField
          label="Choose a Password"
          type="password"
          onChange={(event) => setEnteredPassword(event.target.value)}
        />
        <Button variant="contained" onClick={signUpUser}>
          Sign Up
        </Button>

        <Snackbar
          open={showSignupUnsuccessful}
          onClose={() => setShowSignupUnsuccessful(false)}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={5000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showSignupSuccessful}
          onClose={() => {
            setShowSignupSuccessful(false);
            props.navigateToConfirmSignupPage();
            localStorage.setItem("username", enteredUsername);
          }}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={2000}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Sign Up Successful! Please Verify Your Email.
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}

export default SignupDialogComponent;
