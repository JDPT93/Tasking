import Stage from "./Stage";

export interface Transition {
	id?: Number,
	source?: Stage;
	target?: Stage;
	active?: Boolean;

}

export default Transition;