import * as React from "react";

import UserService from "../services/UserService";
import ProjectService from "../services/ProjectService";

export interface ServiceContext {
    projectService: ProjectService;
    userService: UserService;
}

export default React.createContext<ServiceContext>({
    projectService: new ProjectService(),
    userService: new UserService()
} as ServiceContext);
