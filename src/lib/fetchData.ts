import { getApiUrl } from "@/lib/utils";
import { IS_MODE_MULTI } from "./env";

export const fetchData = async (
  url: string,
  normalize: (data: any) => any,
  firstOnly?: boolean,
  apiUrl?: string,
  peek?: (data: any) => any
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

    if (firstOnly) {
      suffix += "&firstOnly=true";
    }
  }

  const response = await fetch(`${url}${suffix}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  try {
    const data = await response.json();

    let dataWithouthErrorStatus = data;
    if (peek) {
      dataWithouthErrorStatus = await peek(data);
    }

    if (firstOnly) {
      return dataWithouthErrorStatus ? normalize(dataWithouthErrorStatus) : [];
    }

    return normalize(dataWithouthErrorStatus);
  } catch (error) {
    console.error("Error parsing response:", error);
  }
};
