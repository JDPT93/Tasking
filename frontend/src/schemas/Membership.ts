import Project from "./Project";
import User from "./User";

export interface Membership {

    id: number;

    project: Project;

    member: User;

    active: boolean;

}

export default Membership;