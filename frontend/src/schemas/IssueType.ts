import Project from "./Project";

export interface IssueType {
    id?: number;
    project: Project;
    name: string;
    active?: boolean;
}

export default IssueType;