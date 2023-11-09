import User, { defaultUser } from "model/user/user";

export interface Project {
	id: number;
	leader: User;
	name: string;
	description: string
}

export const defaultProject: Project = {
	id: NaN,
	leader: defaultUser,
	name: "",
	description: ""
};

export default Project;