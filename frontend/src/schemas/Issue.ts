import IssueType from "./IssueType";
import Stage from "./Stage";
import User from "./User";

export enum IssuePriority {
    HIGHER, HIGH, MEDIUM, LOW, LOWER
}

export interface Issue {
    id?: number;
    type: IssueType;
    name: string;
    description: string;
    priority: IssuePriority;
    complexity: number;
    start: Date;
    end: Date;
    reporter: User;
    assignee: User;
    stage: Stage;
    active?: boolean;
}

export default Issue;