import Pagination from "model/common/pagination";
import Project from "model/project/project";

import Service from "service/common/service";

export default new class ProjectService extends Service {

	create(project: Project): Promise<Response> {
		const body = JSON.stringify(project);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project`, {
			body,
			headers,
			method: "POST",
			mode: "cors",
		});
	}

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
		return fetch(`${this.endpoint}/api/project?${query.size === 0 ? "" : query.toString()}`, {
			headers,
			method: "GET",
			mode: "cors",
		});
	}

	retrieveById(projectId: number): Promise<Response> {
		const headers = new Headers({
			"Accept": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/${projectId}`, {
			headers,
			method: "GET",
			mode: "cors",
		});
	}

	public update(project: Project): Promise<Response> {
		const body = JSON.stringify(project);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project`, {
			body,
			headers,
			method: "PUT",
			mode: "cors",
		});
	}

	deleteById(projectId: number): Promise<Response> {
		const headers = new Headers({
			"Accept": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/${projectId}`, {
			headers,
			method: "DELETE",
			mode: "cors",
		});
	}

}
