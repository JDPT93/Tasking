import Priority, { defaultPriority } from "model/project/goal/priority";
import Type, { defaultType } from "model/project/goal/type";

export interface Goal {
	id: number;
	type: Type;
	priority: Priority;
	index: number;
	name: string;
	description: string;
}

export const defaultGoal: Goal = {
	id: NaN,
	type: defaultType,
	priority: defaultPriority,
	index: NaN,
	name: "",
	description: ""
};

export default Goal;