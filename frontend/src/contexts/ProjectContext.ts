import * as React from "react";

import Project from "../schemas/Project";

export interface ProjectContext {

    project: Project | null;
    setProject: (project: Project | null) => void;

}

export default React.createContext<ProjectContext>({} as ProjectContext);
