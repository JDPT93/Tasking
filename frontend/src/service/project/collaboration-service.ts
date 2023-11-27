import Pagination from "model/common/pagination";
import Collaboration from "model/project/collaboration";

import Service from "service/common/service";

export default new class CollaborationService extends Service {

	public create(collaboration: Collaboration): Promise<Response> {
		const body = JSON.stringify(collaboration);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/collaboration`, {
			body,
			headers,
			method: "POST",
			mode: "cors"
		});
	}

	public retrieveAll(pagination?: Partial<Pagination>): Promise<Response> {
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
		return fetch(`${this.endpoint}/api/project/collaboration?${query.size === 0 ? "" : query.toString()}`, {
			headers,
			method: "GET",
			mode: "cors"
		});
	}

	public update(collaboration: Collaboration): Promise<Response> {
		const body = JSON.stringify(collaboration);
		const headers = new Headers({
			"Accept": "application/json",
			"Content-Type": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/collaboration`, {
			body,
			headers,
			method: "PUT",
			mode: "cors"
		});
	}

	public deleteById(collaborationId: number): Promise<Response> {
		const headers = new Headers({
			"Accept": "application/json"
		});
		const token = this.getToken();
		if (token?.isAlive()) {
			headers.append("Authorization", `Bearer ${token.toString()}`);
		}
		return fetch(`${this.endpoint}/api/project/collaboration/${collaborationId}`, {
			headers,
			method: "DELETE",
			mode: "cors"
		});
	}

}
