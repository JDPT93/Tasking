export interface Page<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

const defaultValue: Page<any> = {
  content: [],
  empty: true,
  first: true,
  last: true,
  size: 0,
  number: 0,
  totalPages: 0,
  totalElements: 0,
  numberOfElements: 0
};

export default Page;