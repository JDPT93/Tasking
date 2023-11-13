export interface Sort {
	[property: string]: "asc" | "desc";
}

export function orderBy(property: string, sort: Sort): void {
	switch (sort[property]) {
		case undefined:
			sort[property] = "asc";
			break;
		case "asc":
			sort[property] = "desc";
			break;
		case "desc":
			delete sort[property];
			break;
	}
};

export default Sort;