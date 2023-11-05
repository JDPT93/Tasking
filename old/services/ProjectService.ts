import Pagination from "../../model/common/pagination";

import Project from "../schemas/Project";

import Service from "./Service";

export class ProjectService extends Service<Project> {

  constructor() {
    super("api/project");
  }

  public retrieveRelated(pagination?: Pagination) {
    const headers = new Headers({
      "Accept": "application/json"
    });
    const locale = localStorage.getItem("locale");
    if (locale !== null) {
      headers.append("Accept-Language", locale);
    }
    const token = this.getToken();
    if (token?.isAlive()) {
      headers.append("Authorization", `Bearer ${token.toString()}`);
    }
    const query = new URLSearchParams();
    if (pagination?.page !== undefined) {
      query.append("page", pagination.page.toString());
    }
    if (pagination?.size !== undefined) {
      query.append("size", pagination.size.toString());
    }
    if (pagination?.sort !== undefined) {
      pagination.sort.forEach((order, property) => query.append("sort", property.toString().concat(",", order)));
    }
    return fetch(this.endpoint.concat("/me?", query.toString()), {
      headers,
      method: "GET",
      mode: "cors",
    });
  }

}

export default ProjectService;