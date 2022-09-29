import { Box, Button, Stack, TextField } from "@mui/material";
import SimpleDialog from "@mui/material/Dialog";

const textObj = {
  workoutType: "PUSH",
  totalTime: "25",
  exercises: "Stuff",
  exercisesRepsSetsWeight: "More Stuff",
  notes: "I had some bacon for breakfast",
};

function PostWorkoutFormComponent() {
  return (
    <SimpleDialog
      open={true}
      children={
        <Box margin={5}>
          <Stack direction="column" spacing={2}>
            <TextField
              label="Workout Type"
              //   onChange={(event) => setEnteredUsername(event.target.value)}
            />
            <TextField
              label="Total Time"
              //   onChange={(event) => setEnteredPassword(event.target.value)}
            />
            <TextField
              label="Exercises"
              //   onChange={(event) => setEnteredPassword(event.target.value)}
            />
            <TextField
              label="Details"
              //   onChange={(event) => setEnteredPassword(event.target.value)}
            />
            <TextField
              label="Notes"
              //   onChange={(event) => setEnteredPassword(event.target.value)}
            />
            <Stack>
              <Button
                variant="contained"
                // onClick={() => signInUser(enteredUsername, enteredPassword)}
              >
                Post Workout! :D
              </Button>
              {/* <Snackbar
                open={showNotAuthenticatedAlert}
                onClose={() => setShowNotAuthenticatedAlert(false)}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                autoHideDuration={5000}
              >
                <Alert severity="error" sx={{ width: "100%" }}>
                  Something went wrong, please check your workout parameters.
                </Alert>
              </Snackbar> */}
            </Stack>
          </Stack>
        </Box>
      }
    />
  );
}

export default PostWorkoutFormComponent;
