import { getApiUrl } from "@/lib/utils";
import { IS_DEV, IS_MODE_MULTI, IS_MODE_SINGLE, USE_DEV_DATA } from "./env";

export const fetchData = async <T>(
  url: string,
  normalize: (data: any) => T[],
  firstOnly?: boolean,
  apiUrl?: string,
  unwrap?: (data: any, headers: Headers) => any,
  timeout: number = 0
): Promise<T[]> => {
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

  let fullUrl = `${url}${suffix}`;

  if (IS_DEV && !USE_DEV_DATA && IS_MODE_SINGLE) {
    fullUrl = `http://localhost:7081${fullUrl}`;
  }

  const opts: RequestInit =
    timeout > 0 ? { signal: AbortSignal.timeout(timeout) } : {};

  const response = await fetch(fullUrl, opts);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  try {
    const data = await response.json();

    let unwrapped = data;
    if (unwrap) {
      unwrapped = await unwrap(data, response.headers);
    }

    if (firstOnly) {
      return unwrapped ? normalize(unwrapped) : [];
    }

    return normalize(unwrapped);
  } catch (error) {
    console.error("Error parsing response:", error);
  }

  return [];
};
