import { DataGridAction, DataGridState } from "../reducers/DataGridReducer";

export interface TableContext<T> {
  state: DataGridState<T>;
  dispatch: (action: DataGridAction<T>) => void;
}
