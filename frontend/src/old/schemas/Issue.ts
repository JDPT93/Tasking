import IssueType from "./IssueType";
import Stage from "./Stage";
import User from "../../model/user/user";

export enum IssuePriority {
  HIGHER = "HIGHER", HIGH = "HIGH", MEDIUM = "MEDIUM", LOW = "LOW", LOWER = "LOWER"
}

export interface Issue {
  id: number;
  parent?: Issue;
  depth: number;
  type: IssueType;
  index: number;
  name: string;
  description: string;
  priority: IssuePriority;
  complexity: number;
  start: Date;
  end: Date;
  reporter: User;
  assignee: User;
  stage: Stage;
  active: boolean;
}

export default Issue;