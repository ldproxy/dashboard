import { MultiResponse } from "@/app/api/util";

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

export const normalizeValuesSingle = (input: InputValues): Value[] => {
  return Object.keys(input).flatMap((type: any) =>
    Array.isArray(input[type])
      ? input[type].map((value: any) => ({
          type,
          uid: `${type}_${value.path}`,
          ...value,
        }))
      : []
  );
};

export const normalizeValues = (
  input: InputValues | MultiResponse<InputValues>
): Value[] => {
  if (Array.isArray(input)) {
    return normalizeValuesSingle(input[0].response!);
  }

  return normalizeValuesSingle(input);
};
