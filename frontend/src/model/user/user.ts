export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
}

export const defaultUser: User = {
	id: NaN,
	name: "",
	email: "",
	password: ""
};

export default User;