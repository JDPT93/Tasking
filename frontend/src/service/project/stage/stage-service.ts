import Pagination from "model/common/pagination";
import Stage from "model/project/stage/stage";

import Service from "service/common/service";

export default new class StageService extends Service {

	create(stage: Stage): Promise<Response> {
		const body = JSON.stringify(stage);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/stage`, {
			body,
			headers,
			method: "POST",
			mode: "cors",
		});
	}

	retrieveByProjectId(projectId: number, pagination?: Pagination): Promise<Response> {
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
		return fetch(`${this.endpoint}/api/project/${projectId}/stage?${query.size === 0 ? "" : query.toString()}`, {
			headers,
			method: "GET",
			mode: "cors",
		});
	}

	public update(stage: Stage): Promise<Response> {
		const body = JSON.stringify(stage);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/stage`, {
			body,
			headers,
			method: "PUT",
			mode: "cors",
		});
	}

	deleteById(stageId: number): Promise<Response> {
		const headers = new Headers({
			"Accept": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/stage/${stageId}`, {
			headers,
			method: "DELETE",
			mode: "cors",
		});
	}

}
