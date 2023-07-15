export interface Page<T> {

    content: T[];

    empty: boolean;

    first: boolean;

    last: boolean;

    size: number;

    number: number;

    length: number;

    totalPages: number;

    totalItems: number;

}

export default Page;