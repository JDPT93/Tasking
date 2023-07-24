import Service from "./Service";
import Authentication from "../payloads/Authentication";
import User from "../schemas/User";

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
        return fetch(this.endpoint.concat("/authentication"), {
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
            headers.append("Authorization", "Bearer ".concat(token.toString()));
        }
        return fetch(this.endpoint.concat("/authorization"), {
            headers,
            method: "POST",
            mode: "cors",
        });
    }

    retrieveMyself() {
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
        return fetch(this.endpoint.concat("/myself"), {
            headers,
            method: "GET",
            mode: "cors",
        });
    }

}

export default UserService;