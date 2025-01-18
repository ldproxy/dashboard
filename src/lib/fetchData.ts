import { getApiUrl } from "@/lib/utils";
import { IS_MODE_MULTI } from "./env";

export const fetchDataFromSingleApiUrl = async (
  url: string,
  normalize: (data: any) => any,
  apiUrl?: string
) => {
  let suffix = "";

  if (IS_MODE_MULTI) {
    if (!apiUrl) {
      const apiUrls = await getApiUrl();
      apiUrl = apiUrls[0];
    }
    suffix = `?apiUrl=${apiUrl}`;
  }

  const response = await fetch(`${url}${suffix}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return normalize(data);
};

export const fetchDataFromMultipleApiUrls = async (
  url: string,
  normalize: (data: any) => any,
  apiUrl?: string
) => {
  let suffix = "";

  if (IS_MODE_MULTI) {
    let apiUrls: string[] = [];
    if (apiUrl) {
      apiUrls = Array.isArray(apiUrl) ? apiUrl : [apiUrl];
    } else {
      apiUrls = await getApiUrl();
    }
    if (apiUrls.length === 0) {
      return [];
    }

    suffix = `?apiUrls=${apiUrls.join(",")}`;
  }

  const response = await fetch(`${url}${suffix}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return normalize(data);
};
