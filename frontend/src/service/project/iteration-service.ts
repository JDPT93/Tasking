import Pagination from "model/common/pagination";
import Iteration from "model/project/iteration";

import Service from "service/common/service";

export default new class IterationService extends Service {

	public create(iteration: Iteration): Promise<Response> {
		const body = JSON.stringify(iteration);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/iteration`, {
			body,
			headers,
			method: "POST",
			mode: "cors"
		});
	}

	public retrieveByProjectId(projectId: number, pagination?: Partial<Pagination>): Promise<Response> {
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
		return fetch(`${this.endpoint}/api/project/${projectId}/iteration?${query.size === 0 ? "" : query.toString()}`, {
			headers,
			method: "GET",
			mode: "cors"
		});
	}

	public update(iteration: Iteration): Promise<Response> {
		const body = JSON.stringify(iteration);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/iteration`, {
			body,
			headers,
			method: "PUT",
			mode: "cors"
		});
	}

	public deleteById(projectId: number): Promise<Response> {
		const headers = new Headers({
			"Accept": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/iteration/${projectId}`, {
			headers,
			method: "DELETE",
			mode: "cors"
		});
	}

}
