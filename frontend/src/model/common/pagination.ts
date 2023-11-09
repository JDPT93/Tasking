import Sort from "model/common/sort";

export interface Pagination {
	page?: number;
	size?: number;
	sort?: Sort;
}

export default Pagination;