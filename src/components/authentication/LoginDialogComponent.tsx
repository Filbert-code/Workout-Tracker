import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Alert, Box, Snackbar, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import SimpleDialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { userPoolClient } from "../../libs/clients/UserPoolClient";
import React, { useState } from "react";

type LoginDialogComponentProps = {
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setTokensExpirationDate: React.Dispatch<React.SetStateAction<Date>>;
  setRefreshTokenExpirationDate: React.Dispatch<React.SetStateAction<Date>>;
  setTriggerFetchWorkouts: React.Dispatch<React.SetStateAction<boolean>>;
};

function LoginDialogComponent(props: LoginDialogComponentProps) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showNotAuthenticatedAlert, setShowNotAuthenticatedAlert] =
    useState(false);

  const signInUser = async (username: string, password: string) => {
    try {
      const response = await userPoolClient.send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: "1vdmuccspf3jne0ig707rd9foo",
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
          },
        })
      );
      props.setShowLoginDialog(false);

      // update credentials in local storage
      localStorage.setItem(
        "refreshToken",
        response.AuthenticationResult?.RefreshToken!!
      );
      localStorage.setItem("idToken", response.AuthenticationResult?.IdToken!!);
      localStorage.setItem(
        "accessToken",
        response.AuthenticationResult?.AccessToken!!
      );
      localStorage.setItem(
        "refreshTokenExpireEpoch",
        (Date.now() + 60 * 60 * 1000).toString()
      );
      localStorage.setItem(
        "tokenExpireEpoch",
        (
          Date.now() +
          response.AuthenticationResult?.ExpiresIn!! * 1000
        ).toString()
      );
      localStorage.setItem("username", username);

      props.setTokensExpirationDate(
        new Date(Date.now() + response.AuthenticationResult?.ExpiresIn!! * 1000)
      );
      props.setRefreshTokenExpirationDate(
        new Date(Date.now() + 60 * 60 * 1000)
      );
      props.setTriggerFetchWorkouts(true);
    } catch (error) {
      // show error alert
      setShowNotAuthenticatedAlert(true);
    }
  };

  return (
    <SimpleDialog
      open={true}
      children={
        <Box margin={5}>
          <Stack direction="column" spacing={2}>
            <TextField
              label="Username"
              onChange={(event) => setEnteredUsername(event.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              onChange={(event) => setEnteredPassword(event.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => signInUser(enteredUsername, enteredPassword)}
            >
              Sign In
            </Button>
            <Snackbar
              open={showNotAuthenticatedAlert}
              onClose={() => setShowNotAuthenticatedAlert(false)}
              anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
              autoHideDuration={5000}
            >
              <Alert severity="error" sx={{ width: "100%" }}>
                Username or Password was incorrect.
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      }
    />
  );
}

export default LoginDialogComponent;
