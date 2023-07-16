import User from "../schemas/User";

export interface Authentication {
    user: User;
    token: string;
}

export default Authentication;