import Service from "./Service";
import Authentication from "../payloads/Authentication";
import User from "../schemas/User";

export class UserService extends Service<User> {

    constructor() {
        super("api/user");
    }

    signUp(schema: User): Promise<Response> {
        return this.create(schema);
    }

    signIn(schema: Authentication): Promise<Response> {
        const body = JSON.stringify(schema);
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
        const locale = localStorage.getItem("locale");
        if (locale != null) {
            headers.append("Accept-Language", locale);
        }
        return fetch(`${this.endpoint}/authentication`, {
            body,
            headers,
            method: "POST",
            mode: "cors",
        });
    }

}

export default UserService;