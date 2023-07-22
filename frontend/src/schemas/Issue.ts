import IssueType from "./IssueType";
import User from "./User";
import Stage from "./Stage";

enum Priority {
	Higher,
	High,
	Medium,
	Low,
	Lower
}
export interface Issue {
	id?: Number,
	type?: IssueType;
	name?: String;
	description?: String;
	priority?: Priority;
	complexity?: Number;
	start?: Date;
	end?: Date;
	reporter?: User;
	assignee?: User;
	stage?: Stage;
	active?: Boolean;
}

export default Issue;