import { getApiUrl } from "@/lib/utils";

export const fetchDataFromSingleApiUrl = async (
  url: string,
  API_URL?: string
) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await getApiUrl();
    apiUrl = apiUrls[0];
  }
  const response = await fetch(`${url}?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return data;
};

export const fetchDataFromMultipleApiUrls = async (
  url: string,
  API_URL?: string
) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await getApiUrl();
  }
  if (apiUrls.length === 0) {
    return [];
  }
  const response = await fetch(`${url}?apiUrls=${apiUrls.join(",")}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data;
};
