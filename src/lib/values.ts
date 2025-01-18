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

export type InputValues = Record<string, InputValue[]>;

export type Value = InputValue & {
  uid: string;
};

export const normalizeValues = (input: InputValues): Value[] => {
  return Object.keys(input).flatMap((type) =>
    Array.isArray(input[type])
      ? input[type].map((value: any) => ({
          type,
          uid: `${type}_${value.path}`,
          ...value,
        }))
      : []
  );
};
