import Pagination from "../payloads/Pagination";

class Token {

    public readonly value: string;
    public readonly id: string;
    public readonly subject: number;
    public readonly issuedAt: number;
    public readonly expirationTime: number;

    public constructor(value: string) {
        const claims = JSON.parse(atob(value.split(".")[1]));
        this.value = value;
        this.id = claims.jti;
        this.subject = +claims.sub;
        this.issuedAt = claims.exp * 1000;
        this.expirationTime = claims.exp * 1000;
    }

    public isExpired() {
        return this.expirationTime < Date.now();
    }

    public isNotExpired() {
        return !this.isExpired();
    }

    public toString() {
        return this.value;
    }

}

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

    public setToken(value: string | null) {
        if (value === null) {
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", value);
        }
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
        if (token?.isNotExpired()) {
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
        if (token?.isNotExpired()) {
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
        if (token?.isNotExpired()) {
            headers.append("Authorization", "Bearer ".concat(token.toString()));
        }
        return fetch(this.endpoint.concat("/", id.toString()), {
            headers,
            method: "DELETE",
            mode: "cors",
        });
    }

    public retrieveAll(pagination?: Pagination<T>) {
        const headers = new Headers({
            "Accept": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale !== null) {
            headers.append("Accept-Language", locale);
        }
        const token = this.getToken();
        if (token?.isNotExpired()) {
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
        if (token?.isNotExpired()) {
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
        if (token?.isNotExpired()) {
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