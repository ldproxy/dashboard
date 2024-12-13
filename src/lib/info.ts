import { fromDev, InputInfo } from "@/dev-data/info";
import { getApiUrl } from "./utils";
import { Deployment } from "@/dev-data/deployments";

export const fetchedInfo =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export const getInfo = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await getApiUrl();
  }
  if (apiUrls.length === 0) {
    return [];
  }
  const response = await fetch(`/api/fetchInfo?apiUrls=${apiUrls.join(",")}`);
  if (!response.ok) {
    throw new Error("Failed to fetch info");
  }
  const data = await response.json();

  return data;
};

export const loadInfoHomePage = async (
  deployments: Deployment[],
  setInfo: any
) => {
  try {
    if (deployments.length > 0) {
      const promises = deployments.map(async (deployment: any) => {
        const newInfo = await getInfo(deployment.apiUrl);

        if (newInfo && newInfo.length > 0) {
          return { name: deployment.name, info: newInfo as InputInfo };
        } else {
          return { name: deployment.name, info: [] as InputInfo };
        }
      });
      const results = await Promise.all(promises);
      setInfo(results);
    }
  } catch (error) {
    console.error("Error loading info:", error);
  }
};
