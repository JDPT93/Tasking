export interface Authentication {
	email: string;
	password: string;
}

export const defaultAuthentication: Authentication = {
	email: "",
	password: ""
};

export default Authentication;