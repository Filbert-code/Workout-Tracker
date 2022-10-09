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

type TopNavigationComponentProps = {
  setTriggerRefreshTokenExpired: React.Dispatch<React.SetStateAction<boolean>>;
};

function TopNavigationComponent(props: TopNavigationComponentProps) {
  const signOutUser = async () => {
    const access_token = localStorage.getItem("accessToken")!!;
    const response = await userPoolClient
      .send(new GlobalSignOutCommand({ AccessToken: access_token }))
      .then((res) => {
        localStorage.clear();
        props.setTriggerRefreshTokenExpired(true);
        console.log("Signing out...");
      })
      .catch((res) => console.log("Sign out failed..."));
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
              <Button variant="contained" onClick={signOutUser}>
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
