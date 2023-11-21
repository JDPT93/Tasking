import Pagination from "model/common/pagination";
import Service from "service/common/service";

export default new class PriorityService extends Service {

	retrieveAll(pagination?: Pagination): Promise<Response> {
		const headers = new Headers({
			"Accept": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		const query: URLSearchParams = new URLSearchParams();
		if (pagination?.page !== undefined) {
			query.append("page", pagination.page.toString());
		}
		if (pagination?.size !== undefined) {
			query.append("size", pagination.size.toString());
		}
		if (pagination?.sort !== undefined) {
			Object.entries(pagination.sort).forEach(([property, order]) => query.append("sort", `${property},${order}`));
		}
		return fetch(`${this.endpoint}/api/project/goal/priority?${query.size === 0 ? "" : query.toString()}`, {
			headers,
			method: "GET",
			mode: "cors",
		});
	}

}



