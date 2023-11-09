import User from "model/user/user";

export interface Authorization {
	user: User;
	token: string;
}

export default Authorization;