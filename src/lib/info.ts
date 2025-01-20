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

export const loadInfoHomePage = async (
  deployments: Deployment[],
  setInfo: any
) => {
  try {
    if (deployments.length > 0) {
      const promises = deployments.map(async (deployment: any) => {
        const newInfo = await fetchData(
          "api/info",
          normalizeInfo,
          false,
          deployment.apiUrl
        );

        if (newInfo && newInfo.length > 0) {
          return { name: deployment.name, info: newInfo as Infos };
        } else {
          return { name: deployment.name, info: [] as Infos };
        }
      });
      const results = await Promise.all(promises);
      setInfo(results);
    }
  } catch (error) {
    console.error("Error loading info:", error);
  }
};
