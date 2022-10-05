import { GridColDef } from "@mui/x-data-grid";

export const COLUMN_DEFINITIONS: GridColDef[] = [
  {
    field: "exercise",
    headerName: "Exercise",
    flex: 300,
  },
  {
    field: "reps",
    headerName: "Reps",
    width: 60,
  },
  {
    field: "sets",
    headerName: "Sets",
    width: 60,
  },
  {
    field: "weight",
    headerName: "Weight",
    width: 60,
  },
];
