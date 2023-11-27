import Interval from "model/common/interval";
import Goal, { defaultGoal } from "model/project/goal/goal";
import Priority, { defaultPriority } from "model/project/goal/priority";
import Type, { defaultType } from "model/project/goal/type";
import Iteration from "model/project/iteration";
import Stage from "model/project/goal/stage/stage";
import User, { defaultUser } from "model/user/user";

export interface Issue extends Goal {
	parent: Goal | null;
	iteration: Iteration | null;
	type: Type;
	priority: Priority;
	description: string;
	complexity: number;
	period: Interval<Date>;
	assignee: User;
	stage: Stage | null;
}

export const defaultIssue: Issue = {
	...defaultGoal,
	parent: null,
	iteration: null,
	type: defaultType,
	priority: defaultPriority,
	description: "",
	complexity: NaN,
	period: {
		from: new Date(),
		to: new Date()
	},
	assignee: defaultUser,
	stage: null
};

export default Issue;