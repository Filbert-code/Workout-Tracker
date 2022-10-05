import { GlobalSignOutCommand } from "@aws-sdk/client-cognito-identity-provider";
import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { userPoolClient } from "../../libs/clients/UserPoolClient";

function TopNavigationComponent() {
  const signOutUser = async () => {
    const access_token = localStorage.getItem("accessToken")!!;
    console.log(`Access token: ${access_token}`);
    const response = await userPoolClient.send(
      new GlobalSignOutCommand({ AccessToken: access_token })
    );
    await response.$metadata.httpStatusCode;
    console.log(`Response: ${await response}`);
  };

  return (
    <AppBar position="static">
      <Toolbar
        variant="dense"
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          borderRadius: 2,
          height: 50,
          backgroundColor: "primary.dark",
        }}
      >
        <Container>
          {(localStorage.getItem("username") && (
            <Stack direction="row-reverse" spacing={2}>
              <Button variant="contained" onClick={async () => signOutUser()}>
                Sign Out
              </Button>
              <Typography variant="h6" color="inherit" component="div">
                {localStorage.getItem("username")}
              </Typography>
            </Stack>
          )) ||
            "Not Signed In"}
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavigationComponent;
