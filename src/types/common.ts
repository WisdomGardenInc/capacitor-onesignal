export interface IndexKeyDict<T> {
  [key: string]: T;
}

export interface IndexNumKeyDict<T> {
  [key: number]: T;
}

export type JSONType = IndexKeyDict<any>;
