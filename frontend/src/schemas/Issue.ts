import IssuePrioriry from "./IssuePriority";
import IssueType from "./IssueType";

export interface Issue {

    id: number;

    summary: string;

    description: string;

    type: IssueType;

    priority: IssuePrioriry;

    complexity: number;

    active: boolean;

}

export default Issue;