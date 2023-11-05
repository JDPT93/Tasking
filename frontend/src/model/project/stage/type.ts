export interface Type {
    id : number;
    name : string;
  }

  export const defaultType: Type = {
    id : NaN,
    name : ""
  };
  
  export default Type;