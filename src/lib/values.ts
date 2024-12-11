import { fromDev } from "@/dev-data/cfg";
import { getApiUrl } from "@/lib/utils";

export const fetchedValues =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export const getValues = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await getApiUrl();
    apiUrl = apiUrls[0];
  }
  const response = await fetch(`/api/fetchValues?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Values");
  }
  const data = await response.json();

  return data;
};
