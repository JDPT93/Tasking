import Page from "../payloads/Page";

import Pagination from "../payloads/Pagination";

export interface DataGridState<T> {
  pagination: Pagination;
  page?: Page<T>;
  selection: Set<T>;
}

export type DataGridAction<T>
  = { type: "pagination.page.set", payload: number }
  | { type: "pagination.size.set", payload: number }
  | { type: "pagination.sort.item.toggle", payload: string }
  | { type: "page.set", payload: Page<T> }
  | { type: "selection.set", payload?: T[] }
  | { type: "selection.delete" }
  | { type: "selection.item.toggle", payload: T }
  ;

export function DataGridReducer<T>(state: DataGridState<T>, action: DataGridAction<T>): DataGridState<T> {
  switch (action.type) {
    default:
      throw new TypeError("Unexpected action type");
    case "pagination.page.set":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload
        }
      };
    case "pagination.size.set":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: Math.floor(state.pagination.page! * state.pagination.size! / action.payload),
          size: action.payload
        }
      };
    case "pagination.sort.item.toggle":
      const sort = new Map<string, "asc" | "desc">([
        [action.payload, "asc"],
        ...state.pagination.sort
      ]);
      switch (sort.get(action.payload)) {
        case "asc":
          sort.set(action.payload, "desc");
          break;
        case "desc":
          sort.set(action.payload, "asc");
          break;
      }
      return {
        ...state,
        pagination: {
          ...state.pagination,
          sort
        }
      };
    case "page.set":
      return {
        ...state,
        page: action.payload,
        selection: new Set()
      };
    case "selection.set":
      return {
        ...state,
        selection: new Set(action.payload)
      };
    case "selection.delete":
      // TODO: set pagination
      return {
        ...state,
        pagination: {
          ...state.pagination
        },
        selection: new Set()
      };
    case "selection.item.toggle": {
      const selection = new Set(state.selection);
      if (selection.has(action.payload)) {
        selection.delete(action.payload);
      } else {
        selection.add(action.payload);
      }
      return {
        ...state,
        selection
      };
    }
  }
}

export default DataGridReducer;