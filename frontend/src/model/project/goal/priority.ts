export interface Priority {
	id: number;
	name: string;
}

export const defaultPriority: Priority = {
	id: NaN,
	name: ""
};

export default Priority;