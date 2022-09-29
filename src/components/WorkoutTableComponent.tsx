import { DataGrid } from "@mui/x-data-grid";
import { COLUMN_DEFINITIONS } from "../constants";
import { Workout } from "../libs/clients/Workout";

type WorkoutTableComponentProps = {
  workoutData: Workout[];
};

function WorkoutTableComponent(props: WorkoutTableComponentProps) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={props.workoutData}
        columns={COLUMN_DEFINITIONS}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

export default WorkoutTableComponent;
