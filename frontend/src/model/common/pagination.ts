import Sort, { defaultSort } from "model/common/sort";

export interface Pagination {
	page: number;
	size: number;
	sort: Sort;
}

export const defaultPagination: Pagination = {
	page: 0,
	size: 5,
	sort: defaultSort
};

export default Pagination;