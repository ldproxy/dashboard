import { Deployment } from "@/dev-data/deployments";
import { fetchDataFromMultipleApiUrls } from "./fetchData";

export type SingleInputInfo = {
  name: string;
  version: string;
  url: string;
  env: string;
  status: string;
};

export type InfoItem = SingleInputInfo & {
  apiUrl: string;
};

export type Infos = InfoItem[];

export type MultiInputInfo = {
  url: string;
  info: SingleInputInfo;
}[];

export const normalizeInfo = (
  input: SingleInputInfo | MultiInputInfo
): Infos => {
  if (Array.isArray(input)) {
    return input.map((item) => ({
      ...item.info,
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
        const newInfo = await fetchDataFromMultipleApiUrls(
          "api/info",
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
