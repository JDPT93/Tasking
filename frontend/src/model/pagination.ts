import Sort from "@src/model/sort";

export interface Pagination {
  page?: number;
  size?: number;
  sort?: Sort;
}

export default Pagination;