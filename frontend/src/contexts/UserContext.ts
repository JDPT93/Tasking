import * as React from "react";

import User from "../schemas/User";
import UserService from "../services/UserService";

export interface UserContext {
    user: User | null;
    setUser: (user: User | null) => void;
}

export default React.createContext<UserContext>({} as UserContext);
