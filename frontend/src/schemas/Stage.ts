import Project from "./Project";
enum StageType {
	Start,
	Middle,
	End
}
export interface Stage {
	id?: number;
    project?: Project;
    type?: StageType;
	name?: string;
	position?: Number;
    active?: boolean;
}

export default Stage;