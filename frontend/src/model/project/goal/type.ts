import Project, { defaultProject } from "model/project/project";

export interface Type {
    id : number;
    project : Project;
    name : string;
    icon : string;
    color: number;
  }

  export const defaultType: Type = {
    id : NaN,
    project : defaultProject,
    name : "",
    icon : "",
    color: NaN
  };
  
  export default Type;