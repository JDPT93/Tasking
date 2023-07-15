import Membership from "./Membership";
import Project from "./Project";

export interface User {

    id: number;

    name: string;

    surname: string;

    email: string;

    password: string;

    active: boolean;

}

export default User;