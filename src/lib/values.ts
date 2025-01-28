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
  if (Array.isArray(input)) {
    input = input[0];
  }
  if (input.response) {
    return Object.keys(input.response).flatMap((type: any) =>
      Array.isArray(input.response[type])
        ? input.response[type].map((value: any) => ({
            type,
            uid: `${type}_${value.path}`,
            ...value,
          }))
        : []
    );
  } else {
    return [];
  }
};
