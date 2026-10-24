import { MultiResponse } from "@/app/api/util";
import { Deployment } from "./deployments";
import { fetchData } from "./fetchData";

export type InputInfo = {
  name: string;
  version: string;
  url: string;
  env: string;
  status: string;
};

export type InfoItem = InputInfo & {
  apiUrl: string;
};

export type Infos = InfoItem[];

export const normalizeInfo = (
  input: InputInfo | MultiResponse<InputInfo>
): Infos => {
  if (Array.isArray(input)) {
    return input.map((item) => ({
      ...item.response!,
      apiUrl: item.url,
    }));
  }
  return [{ ...input, apiUrl: "TODO" }];
};
