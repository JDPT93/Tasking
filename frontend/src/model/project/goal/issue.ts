import Interval from "model/common/interval";
import User, { defaultUser } from "model/user/user";
import Goal, { defaultGoal } from "model/project/goal/goal";
import Stage, { defaultStage } from "model/project/stage/stage";

export interface Issue extends Goal {
	parent: Goal | null;
	complexity: number;
	period: Interval<Date>;
	reporter: User;
	assignee: User;
	stage: Stage;
}

export const defaultIssue: Issue = {
	...defaultGoal,
	parent: null,
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