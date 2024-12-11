import { fromDev } from "@/dev-data/info";
import { getApiUrl } from "./utils";

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
