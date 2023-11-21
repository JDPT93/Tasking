import Project, { defaultProject } from "model/project/project";

export interface Goal {
	id: number;
	project: Project;
	index: number;
	name: string;
}

export const defaultGoal: Goal = {
	id: NaN,
	project: defaultProject,
	index: NaN,
	name: "",
};

export default Goal;