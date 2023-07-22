import Project from "./Project";
import User from "./User";

export interface Colaboration {
    id?: number;
    project?: Project;
    colaborator?: User;
    active?: boolean;
}

export default Project;