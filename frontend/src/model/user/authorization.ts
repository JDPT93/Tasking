import User from "./user";

export interface Authentication {
  user: User;
  token: string;
}

export default Authentication;