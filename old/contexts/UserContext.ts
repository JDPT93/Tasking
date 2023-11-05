import * as React from "react";

import User from "../../model/user/user";

export interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default React.createContext<UserContext>({} as UserContext);
