import Token from "./Token";

import Pagination from "../../model/common/pagination";

export class Service<T> {

  public readonly secure: boolean = false;
  public readonly host: string = "localhost";
  public readonly port: number = 8080;
  public readonly path: string;

  public get endpoint() {
    return `${this.secure ? "https" : "http"}://${this.host}:${this.port}/${this.path}`;
  }

  public constructor(path: string) {
    this.path = path;
  }

  public getToken(): Token | null {
    const token = localStorage.getItem("token");
    return token === null ? null : new Token(token);
  }

  public setToken(value: string) {
    localStorage.setItem("token", value);
  }

  public removeToken() {
    localStorage.removeItem("token");
  }

  public create(object: T) {
    const body = JSON.stringify(object);
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
    return fetch(this.endpoint, {
      body,
      headers,
      method: "POST",
      mode: "cors",
    });
  }

  public deleteAll(...list: T[]) {
    const body = JSON.stringify(list);
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
    return fetch(this.endpoint, {
      body,
      headers,
      method: "DELETE",
      mode: "cors",
    });
  }

  public deleteById(id: number) {
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
    return fetch(this.endpoint.concat("/", id.toString()), {
      headers,
      method: "DELETE",
      mode: "cors",
    });
  }

  public retrieveAll(pagination?: Pagination) {
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
    return fetch(this.endpoint.concat("?", query.toString()), {
      headers,
      method: "GET",
      mode: "cors",
    });
  }

  public retrieveById(id: number) {
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
    return fetch(this.endpoint.concat("/", id.toString()), {
      headers,
      method: "GET",
      mode: "cors",
    });
  }

  public update(object: T) {
    const body = JSON.stringify(object);
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
    return fetch(this.endpoint, {
      body,
      headers,
      method: "PUT",
      mode: "cors",
    });
  }

}

export default Service;