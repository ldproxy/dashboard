export interface InputValueWithPath {
  path: string;
  status: string;
  type: string;
}

export interface InputValueWithId {
  id: string;
  status: string;
  type: string;
}

export type InputValue = InputValueWithPath | InputValueWithId;

export const values: InputValue[] = [
  {
    path: "foo",
    status: "HEALTHY",
    type: "codelists",
  },
  {
    id: "bar",
    status: "ACTIVE",
    type: "tile-matrix-sets",
  },
];
