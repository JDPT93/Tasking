import Authentication from "model/user/authentication";
import User from "model/user/user";

import Service from "service/common/service";

export class UserService extends Service {

    public setToken(value: string): void {
        localStorage.setItem("token", value);
    }

    public removeToken(): void {
        localStorage.removeItem("token");
    }

    public signUp(user: User): Promise<Response> {
        const body = JSON.stringify(user);
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
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

    signIn(authentication: Authentication): Promise<Response> {
        const body = JSON.stringify(authentication);
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
        return fetch(`${this.endpoint}/api/user/sign-in`, {
            body,
            headers,
            method: "POST",
            mode: "cors",
        });
    }

    renewToken(): Promise<Response> {
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
        const token = this.getToken();
        if (token?.isAlive()) {
            headers.append("Authorization", `Bearer ${token.toString()}`);
        }
        return fetch(`${this.endpoint}/api/user/token`, {
            headers,
            method: "POST",
            mode: "cors",
        });
    }

    whoAmI() {
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        });
        const token = this.getToken();
        if (token?.isAlive()) {
            headers.append("Authorization", `Bearer ${token.toString()}`);
        }
        return fetch(`${this.endpoint}/api/user/who-am-i`, {
            headers,
            method: "GET",
            mode: "cors",
        });
    }

}

export default UserService;