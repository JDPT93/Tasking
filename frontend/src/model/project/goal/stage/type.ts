export enum TypeId {
	ToDo = 1,
	InProgress = 2,
	Done = 3
}

export interface Type {
	id: TypeId;
	name: string;
}

export const defaultType: Type = {
	id: NaN,
	name: ""
};

export default Type;