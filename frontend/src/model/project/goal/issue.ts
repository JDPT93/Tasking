import Interval from "model/common/interval";
import Goal, { defaultGoal } from "model/project/goal/goal";
import Priority, { defaultPriority } from "model/project/goal/priority";
import Type, { defaultType } from "model/project/goal/type";
import Stage, { defaultStage } from "model/project/stage/stage";
import User, { defaultUser } from "model/user/user";

export interface Issue extends Goal {
	parent: Goal | null;
	type: Type;
	priority: Priority;
	description: string;
	complexity: number;
	period: Interval<Date>;
	reporter: User;
	assignee: User;
	stage: Stage;
}

export const defaultIssue: Issue = {
	...defaultGoal,
	parent: null,
	type: defaultType,
	priority: defaultPriority,
	description: "",
	complexity: NaN,
	period: {
		from: new Date(),
		to: new Date()
	},
	reporter: defaultUser,
	assignee: defaultUser,
	stage: defaultStage
};

export default Issue;