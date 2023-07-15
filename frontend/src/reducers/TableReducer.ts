import Page from "../payloads/Page";
import Pagination from "../payloads/Pagination";

export interface State<T> {
    pagination: Pagination<T>;
    page?: Page<T>;
    selection: Set<T>;
}

export type Action<T>
    = { type: "pagination.page.change", payload: number }
    | { type: "pagination.size.change", payload: number }
    | { type: "pagination.sort.toggle.one", payload: keyof T }
    | { type: "page.change", payload: Page<T> }
    | { type: "selection.toggle.one", payload: T }
    | { type: "selection.change", payload?: T[] }
    ;

export function TableReducer<T>(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
        default:
            throw new TypeError("Unexpected action type");
        case "pagination.page.change":
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.payload
                }
            };
        case "pagination.size.change":
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: Math.floor(state.pagination.page! * state.pagination.size! / action.payload),
                    size: action.payload
                }
            };
        case "pagination.sort.toggle.one":
            const sort = new Map(state.pagination.sort);
            if (!sort.has(action.payload))
                sort.set(action.payload, "desc");
            else switch (sort.get(action.payload)) {
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
            }
        case "page.change":
            return {
                ...state,
                selection: new Set(),
                page: action.payload
            }
        case "selection.change":
            return {
                ...state,
                selection: new Set(action.payload)
            };
        case "selection.toggle.one": {
            const selection = new Set(state.selection);
            if (selection.has(action.payload)) selection.delete(action.payload);
            else selection.add(action.payload);
            return {
                ...state,
                selection
            };
        }
    }
}

export default TableReducer;