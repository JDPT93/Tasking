import Stage, { defaultStage } from "model/project/stage/stage";

export interface Transition {
    id : number;
    sourse : Stage;
    target : Stage;
    description : string;
  }

  export const defaultTransition: Transition = {
    id : NaN,
    sourse : defaultStage,
    target : defaultStage,
    description : ""
  };
  
  export default Transition;