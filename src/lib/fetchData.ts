import { getApiUrl } from "@/lib/utils";
import { IS_MODE_MULTI } from "./env";

export const fetchData = async (
  url: string,
  normalize: (data: any) => any,
  firstOnly?: boolean,
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
    if (firstOnly) {
      apiUrls = [apiUrls[0]];
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
