import { GridColDef } from "@mui/x-data-grid";

export const COLUMN_DEFINITIONS: GridColDef[] = [
  {
    field: "workoutType",
    headerName: "Workout Type",
    width: 100,
  },
  {
    field: "exercises",
    headerName: "Exercises",
    width: 100,
  },
  {
    field: "exercisesDetails",
    headerName: "Details",
    width: 100,
  },
  {
    field: "date",
    headerName: "Date",
    width: 100,
  },
  {
    field: "notes",
    headerName: "Notes",
    width: 100,
  },
];
