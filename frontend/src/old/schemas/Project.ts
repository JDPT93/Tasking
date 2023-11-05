import Stage from "./Stage";
import User from "../../model/user/user";

export interface Project {
  id: number;
  leader: User;
  name: string;
  description: string;
  active: boolean;
  stages: Stage[];
}

export default Project;