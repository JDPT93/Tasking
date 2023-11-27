import Project, { defaultProject } from "model/project/project";

export interface Iteration {
	id: number;
	project: Project;
	name: string;
	description: string;
}

export const defaultIteration: Iteration = {
	id: NaN,
	project: defaultProject,
	name: "",
	description: ""
};

export default Iteration;