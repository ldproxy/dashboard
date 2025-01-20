export type MultiResponseItem<T> = {
  url: string;
  response: T | null;
  offline?: boolean;
};

export type MultiResponse<T> = MultiResponseItem<T>[];

export const fetchMulti = async <T>(
  apiUrls: string[],
  endpoint: string,
  fallback: T | null = null
): Promise<MultiResponse<T>> => {
  return Promise.all(
    apiUrls.map(async (url) => {
      try {
        const res = await fetch(url + endpoint);

        if (!res.ok && res.status !== 500) {
          console.error(`API call failed with status: ${url}: ${res.status}`);
          return {
            url,
            response: fallback,
            offline: true,
          } as MultiResponseItem<T>;
        }

        const response: T = await res.json();

        return { url, response } as MultiResponseItem<T>;
      } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        return {
          url,
          response: fallback,
          offline: true,
        } as MultiResponseItem<T>;
      }
    })
  );
};

export const fetchMultiPlain = async <T>(
  apiUrls: string[],
  endpoint: string
): Promise<T[]> => {
  return fetchMulti<T>(apiUrls, endpoint).then((responses) =>
    responses
      .filter((response) => !response.offline)
      .map((response) => response.response as T)
  );
};

export const parseApiUrls = (
  input: string | string[] | null | undefined
): string[] => {
  let apiUrls: string[] = [];

  if (!input) {
    throw new Error("apiUrls parameter is required");
  }

  if (Array.isArray(input)) {
    apiUrls = input;
  } else if (typeof apiUrls === "string") {
    apiUrls = input.split(",");
  }

  if (!Array.isArray(apiUrls) || apiUrls.length === 0) {
    throw new Error("apiUrls parameter must be an array");
  }

  return apiUrls;
};

export const badRequest = (message?: string) =>
  Response.json(
    {
      message: message,
    },
    { status: 400 }
  );

export const serverError = (message?: string) =>
  Response.json(
    {
      message: message || "Internal Server Error",
    },
    { status: 500 }
  );
