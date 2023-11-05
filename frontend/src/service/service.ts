import Token from "@src/service/token";

import Pagination from "@src/model/pagination";

export class Service<T> {

  public readonly scheme: "http" | "https";
  public readonly host: string;
  public readonly port: number;

  public get endpoint() {
    return `${this.scheme}://${this.host}:${this.port}`;
  }

  public constructor(settings: { scheme?: "http" | "https", host?: string, port?: number }) {
    this.scheme = settings.scheme ?? "http";
    this.host = settings.host ?? "localhost";
    this.port = settings.port ?? 80;
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
      headers.append("Authorization", "Bearer ".concat(token.toString()));
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
      headers.append("Authorization", "Bearer ".concat(token.toString()));
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
      headers.append("Authorization", "Bearer ".concat(token.toString()));
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
      headers.append("Authorization", "Bearer ".concat(token.toString()));
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
      headers.append("Authorization", "Bearer ".concat(token.toString()));
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
      headers.append("Authorization", "Bearer ".concat(token.toString()));
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