export class Pagination<T> {

    page?: number;

    size?: number;

    sort?: Map<keyof T, "asc" | "desc">;

}

export default Pagination;