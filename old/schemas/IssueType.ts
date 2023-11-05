import Project from "./Project";

export interface IssueType {
  id: number;
  project: Project;
  name: string;
  icon: string;
  color: string;
  active: boolean;
}

export default IssueType;