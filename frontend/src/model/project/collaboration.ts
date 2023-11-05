import User, { defaultUser } from "../user/user";
import Project, { defaultProject } from "./project";

export interface Collaboration {
    id : number;
    project : Project;
    collaborator : User;
  }

  export const defaultCollaboration: Collaboration = {
    id : NaN,
    project : defaultProject,
    collaborator : defaultUser
  };
  
  export default Collaboration;