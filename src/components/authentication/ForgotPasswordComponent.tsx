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

type ForgotPasswordComponentProps = {
  setShowForgotPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function ForgotPasswordComponent(props: ForgotPasswordComponentProps) {
  const [enteredEmailOrUsername, setEnteredEmailOrUsername] = useState("");
  const [showNotAuthenticatedAlert, setShowNotAuthenticatedAlert] =
    useState(false);

  return (
    <SimpleDialog
      transitionDuration={0}
      open={true}
      children={
        <Box margin={5}>
          <IconButton onClick={() => props.setShowForgotPasswordDialog(false)}>
            <ArrowBack />
          </IconButton>
          <Stack direction="column" spacing={2}>
            <TextField
              label="Enter Your Email or Username"
              onChange={(event) =>
                setEnteredEmailOrUsername(event.target.value)
              }
            />
            <Button
              variant="contained"
              // onClick={() => signUpUser(enteredUsername, enteredEmail, enteredPassword)}
            >
              Send
            </Button>

            <Snackbar
              open={showNotAuthenticatedAlert}
              onClose={() => setShowNotAuthenticatedAlert(false)}
              anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
              autoHideDuration={5000}
            >
              <Alert severity="error" sx={{ width: "100%" }}>
                A message was sent to your email with the reset-password
                confirmation code.
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      }
    />
  );
}

export default ForgotPasswordComponent;
