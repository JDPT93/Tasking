export enum PriorityId {
	Higher = 1,
	High = 2,
	Medium = 3,
	Low = 4,
	Lower = 5
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