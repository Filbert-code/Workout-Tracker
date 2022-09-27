import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import SimpleDialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { userPoolClient } from "../libs/clients/UserPoolClient";
import React, { useState } from "react";

const TEST_USERNAME = "thisusernamesucks";
const TEST_PASSWORD = "password";

type LoginDialogComponentProps = {};

function LoginDialogComponent(props: LoginDialogComponentProps) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

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
      console.log(`Signed in: ${response.AuthenticationResult?.IdToken!!}`);
      // set authentication boolean to true to get rid of the login dialog box
    } catch (error) {
      // show error alert
    }
  };

  return (
    <SimpleDialog
      open={true}
      children={
        <Box margin={5}>
          <Stack direction="column" spacing={2}>
            <TextField
              label={"Username"}
              onChange={(event) => setEnteredUsername(event.target.value)}
            />
            <TextField
              label={"password"}
              onChange={(event) => setEnteredPassword(event.target.value)}
            />
            <Stack>
              <Button
                variant="contained"
                onClick={() => signInUser(enteredUsername, enteredPassword)}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Box>
      }
    />
  );
}

export default LoginDialogComponent;
