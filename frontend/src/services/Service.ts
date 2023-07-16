import Pagination from "../payloads/Pagination";

export class Service<T> {

    secure: boolean = false;
    host: string = "localhost";
    port: number = 8080;
    path: string;

    get endpoint() {
        return `${this.secure ? "https" : "http"}://${this.host}:${this.port}/${this.path}`;
    }

    constructor(path: string) {
        this.path = path;
    }

    create(schema: T) {
        const body = JSON.stringify(schema);
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale != null) {
            headers.append("Accept-Language", locale);
        }
        const token = localStorage.getItem("token");
        if (token != null) {
            headers.append("Authorization", "Bearer ".concat(token));
        }
        return fetch(this.endpoint, {
            body,
            headers,
            method: "POST",
            mode: "cors",
        });
    }

    deleteById(id: number) {
        const headers = new Headers({
            "Accept": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale != null) {
            headers.append("Accept-Language", locale);
        }
        const token = localStorage.getItem("token");
        if (token != null) {
            headers.append("Authorization", "Bearer ".concat(token));
        }
        return fetch(this.endpoint.concat("/", id.toString()), {
            headers,
            method: "DELETE",
            mode: "cors",
        });
    }

    findAll(pagination?: Pagination<T>) {
        const headers = new Headers({
            "Accept": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale != null) {
            headers.append("Accept-Language", locale);
        }
        const token = localStorage.getItem("token");
        if (token != null) {
            headers.append("Authorization", "Bearer ".concat(token));
        }
        const query = new URLSearchParams();
        if (pagination?.page != null) {
            query.append("page", pagination.page.toString());
        }
        if (pagination?.size != null) {
            query.append("size", pagination.size.toString());
        }
        if (pagination?.sort != null) {
            pagination.sort.forEach((order, property) => query.append("sort", property.toString().concat(",", order)));
        }
        return fetch(this.endpoint.concat("?", query.toString()), {
            headers,
            method: "GET",
            mode: "cors",
        });
    }

    findById(id: number) {
        const headers = new Headers({
            "Accept": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale != null) {
            headers.append("Accept-Language", locale);
        }
        const token = localStorage.getItem("token");
        if (token != null) {
            headers.append("Authorization", "Bearer ".concat(token));
        }
        return fetch(this.endpoint.concat("/", id.toString()), {
            headers,
            method: "GET",
            mode: "cors",
        });
    }

    update(schema: T) {
        const body = JSON.stringify(schema);
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale != null) {
            headers.append("Accept-Language", locale);
        }
        const token = localStorage.getItem("token");
        if (token != null) {
            headers.append("Authorization", "Bearer ".concat(token));
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