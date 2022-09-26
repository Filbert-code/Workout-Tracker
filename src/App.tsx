import "./App.css";
import Button from "@mui/material/Button";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { userPoolClient } from "./libs/clients/UserPoolClient";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const signInUser = async () => {
  const response = await userPoolClient.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "1vdmuccspf3jne0ig707rd9foo",
      AuthParameters: {
        USERNAME: "thisusernamesucks",
        PASSWORD: "password",
      },
    })
  );
  console.log(`Signed in: ${response.AuthenticationResult?.IdToken!!}`);
};

const signOutUser = async () => {
  var AWS = require("aws-sdk");
  // const response = await userPoolClient.send(
  //   new GlobalSignOutCommand({ AccessToken: access_token })
  // );
  // console.log(`Response: ${response}`);
};

// const requestBuilder = async () => {

// };

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

function App() {
  return (
    <div className="App">
      <header>
        <p>This is a table, woop woop</p>
        <Button onClick={signInUser} variant="contained">
          Sign In
        </Button>
        <Button onClick={signOutUser} variant="contained">
          Sign Out
        </Button>
      </header>
      <body>
        <TableContainer component={Paper}>
          <Table size="medium" stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </body>
    </div>
  );
}

export default App;
