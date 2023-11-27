import Stage, { defaultStage } from "model/project/goal/stage/stage";

export interface Transition {
	id: number;
	source: Stage;
	target: Stage;
	description: string;
}

export const defaultTransition: Transition = {
	id: NaN,
	source: defaultStage,
	target: defaultStage,
	description: ""
};

export default Transition;