export enum PriorityId {
	HIGHER = 1,
	HIGH = 2,
	MEDIUM = 3,
	LOW = 4,
	LOWER = 5
}

export interface Priority {
	id: PriorityId;
	name: string;
}

export const defaultPriority: Priority = {
	id: NaN,
	name: ""
};

export default Priority;