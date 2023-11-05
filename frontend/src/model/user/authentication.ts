export interface Authentication {
  email: string;
  password: string;
}

export const defaultValue: Authentication = {
  email: "",
  password: ""
};

export default Authentication;