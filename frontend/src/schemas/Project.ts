import Stage from "./Stage";
import User from "./User";

export interface Project {
    id?: number;
    leader: User;
    name: string;
    description: string;
    active?: boolean;
    stages?: Stage[];
}

export default Project;