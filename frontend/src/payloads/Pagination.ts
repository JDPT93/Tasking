export interface Pagination {
  page: number;
  size: number;
  sort: Map<string, "asc" | "desc">;
}

export default Pagination;