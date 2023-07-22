import Project from "./Project";

export interface IssueType {
	id?: Number,
	project?: Project;
	name?: String;
	icon?: String;
	color?: String;
	active?: Boolean;

}

export default IssueType;