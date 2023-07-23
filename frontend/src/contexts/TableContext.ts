import { TableAction, TableState } from "../reducers/TableReducer";

export interface TableContext<T> {
    state: TableState<T>;
    dispatch: (action: TableAction<T>) => void;
}
