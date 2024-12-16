import { fromDev } from "@/dev-data/metrics";
import { getApiUrl } from "@/lib/utils";

export const fetchedMetrics =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export const getMetrics = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await getApiUrl();
  }
  if (apiUrls.length === 0) {
    return [];
  }
  const response = await fetch(
    `/api/fetchMetrics?apiUrls=${apiUrls.join(",")}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }
  const data = await response.json();
  console.log("data", data);

  return data;
};
