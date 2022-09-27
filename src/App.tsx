import "./App.css";
import Button from "@mui/material/Button";
import SimpleDialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { userPoolClient } from "./libs/clients/UserPoolClient";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import LoginDialogComponent from "./components/LoginDialogComponent";
import WorkoutTableComponent from "./components/WorkoutTableComponent";
import { useState } from "react";

const signOutUser = async () => {
  var AWS = require("aws-sdk");
  // const response = await userPoolClient.send(
  //   new GlobalSignOutCommand({ AccessToken: access_token })
  // );
  // console.log(`Response: ${response}`);
};

// const requestBuilder = async () => {

// };

function App() {
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  return (
    <div className="App">
      <header>
        <p>This is a table, woop woop</p>
      </header>
      <body>
        <WorkoutTableComponent />
      </body>
      {showLoginDialog && (
        <LoginDialogComponent setShowLoginDialog={setShowLoginDialog} />
      )}
    </div>
  );
}

export default App;
