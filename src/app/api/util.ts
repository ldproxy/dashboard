import { type NextRequest } from "next/server";
import { DevApi } from "@/dev-data/constants";
import { USE_DEV_DATA } from "@/lib/env";

export type MultiResponseItem<T> = {
  url: string;
  response: T | null;
  offline?: boolean;
};

export type MultiResponse<T> = MultiResponseItem<T>[];

export const passThrough = async <T>(
  req: NextRequest,
  endpoint: string,
  fromDev: () => T,
  fallback?: T
): Promise<Response> => {
  if (USE_DEV_DATA) {
    return Response.json(fromDev());
  }

  const firstOnly = parseBoolean(req, "firstOnly");
  const fetchData = firstOnly ? fetchMultiFirst<T> : fetchMulti<T>;
  let apiUrls: string[];

  try {
    apiUrls = parseStringArray(req, "apiUrls");
  } catch (error: any) {
    return badRequest(error.message);
  }

  try {
    const data = await fetchData(apiUrls, endpoint, fallback);

    return Response.json(data);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return serverError();
  }
};

const logError = (url: string, message: any) => {
  if (DevApi) {
    console.error(`API call failed: ${url}`, message);
  }
};

const errorResponse = <T>(
  url: string,
  endpoint: string,
  fallback: T | null,
  message: any
) => {
  logError(url + endpoint, message);

  return {
    url,
    response: fallback,
    offline: true,
  } as MultiResponseItem<T>;
};

export const fetchMulti = async <T>(
  apiUrls: string[],
  endpoint: string,
  fallback: T | null = null
): Promise<MultiResponse<T>> => {
  return Promise.all(
    apiUrls.map(async (url) => {
      try {
        const res = await fetch(url + endpoint);

        if (!res.ok) {
          return errorResponse(url, endpoint, fallback, res.status);
        }

        const response: T = await res.json();

        return { url, response } as MultiResponseItem<T>;
      } catch (error) {
        return errorResponse(url, endpoint, fallback, error);
      }
    })
  );
};

export const fetchMultiFirst = async <T>(
  apiUrls: string[],
  endpoint: string,
  fallback: T | null = null
): Promise<T | null> => {
  for (const apiUrl of apiUrls) {
    const url = apiUrl + endpoint;
    try {
      const res = await fetch(url);

      if (!res.ok) {
        logError(url, res.status);
        continue;
      }

      const response: T = await res.json();

      return response;
    } catch (error: any) {
      logError(url, error);
    }
  }

  return fallback;
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

export const parseStringArray = (req: NextRequest, param: string): string[] => {
  const input = req.nextUrl.searchParams.get(param);

  if (!input) {
    throw new Error(`parameter '${param}' is required`);
  }

  const result: string[] = input.split(",");

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error(`parameter '${param}' must be a non-empty array`);
  }

  return result;
};

export const parseBoolean = (
  req: NextRequest,
  param: string,
  required?: boolean
): boolean => {
  const input = req.nextUrl.searchParams.get(param);

  if (!input && required) {
    throw new Error(`parameter '${param}' is required`);
  }

  return input === "true";
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
