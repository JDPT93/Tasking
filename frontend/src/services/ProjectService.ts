import Service from "./Service";
import Project from "../schemas/Project";

export class ProjectService extends Service<Project> {

    constructor() {
        super("api/project");
    }

}

export default ProjectService;