import Authentication from "../../model/user/authentication";

import User from "../../model/user/user";

import Service from "./Service";

export class UserService extends Service<User> {

  constructor() {
    super("api/user");
  }

  authenticate(object: Authentication): Promise<Response> {
    const body = JSON.stringify(object);
    const headers = new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json"
    });
    const locale = localStorage.getItem("locale");
    if (locale !== null) {
      headers.append("Accept-Language", locale);
    }
    return fetch(`${this.endpoint}/authentication`, {
      body,
      headers,
      method: "POST",
      mode: "cors",
    });
  }

  authorize(): Promise<Response> {
    const headers = new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json"
    });
    const locale = localStorage.getItem("locale");
    if (locale !== null) {
      headers.append("Accept-Language", locale);
    }
    const token = this.getToken();
    if (token?.isAlive()) {
      headers.append("Authorization", `Bearer ${token.toString()}`);
    }
    return fetch(`${this.endpoint}/authorization`, {
      headers,
      method: "POST",
      mode: "cors",
    });
  }

  retrieveMe() {
    const headers = new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json"
    });
    const locale = localStorage.getItem("locale");
    if (locale !== null) {
      headers.append("Accept-Language", locale);
    }
    const token = this.getToken();
    if (token?.isAlive()) {
      headers.append("Authorization", `Bearer ${token.toString()}`);
    }
    return fetch(`${this.endpoint}/me`, {
      headers,
      method: "GET",
      mode: "cors",
    });
  }

}

export default UserService;