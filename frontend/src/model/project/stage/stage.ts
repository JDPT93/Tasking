import Type, { defaultType } from "model/project/goal/type";
import Project, { defaultProject } from "model/project/project";

export interface Stage {
    id : number;
    project : Project;
    type : Type;
    name : string;
    index : number;
  }

  export const defaultStage: Stage = {
    id : NaN,
    project : defaultProject,
    type : defaultType,
    name : "",
    index : NaN
  };
  
  export default Stage;