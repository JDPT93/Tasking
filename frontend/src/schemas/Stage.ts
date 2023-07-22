import Issue from "./Issue";
import Project from "./Project";

export enum StageType {
    START, MIDDLE, END
}

export interface Stage {
    id?: number;
    project: Project;
    type: StageType;
    name: string;
    position: number;
    active?: Boolean;
    issues?: Issue[];
}

export default Stage;