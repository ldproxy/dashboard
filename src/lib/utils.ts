"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Deployment } from "@/data/deployments";
import dayjs from "dayjs";
import { HealthChecksType } from "../../src/app/deployment/page";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const multipleDeployments = process.env.MULTIPLE_DEPLOYMENTS;

/*
const currentUrl = new URL(window.location.href);
const baseUrl = currentUrl.origin;
const apiUrl = `${baseUrl}/api`;
const API_URL = apiUrl;
*/

// const API_URL = "http://localhost:7081/api";
const API_URL2 = "/api";

export async function GetApiUrl(): Promise<string[]> {
  let apiUrl: string[] = [];

  const deployments = await getDeployments();

  const currentUrl = new URL(window.location.href);

  if (currentUrl && deployments.length > 0) {
    const url = new URL(currentUrl.href);
    const queryParams = new URLSearchParams(url.search);
    const deploymentId = queryParams.get("did");

    let matchingDeployment;
    // case multipleDeployments === "true"
    if (deploymentId) {
      matchingDeployment = deployments.find(
        (deployment: Deployment) => deployment.id === deploymentId
      );
      // case multipleDeployments === "false"
    } else {
      const baseUrl = currentUrl.origin;
      const apiUrl = `${baseUrl}/api`;

      matchingDeployment = deployments.find((deployment: Deployment) =>
        deployment.apiUrl.includes(apiUrl)
      );

      if (matchingDeployment && matchingDeployment.apiUrl) {
        return matchingDeployment.apiUrl;
      }
    }

    if (matchingDeployment && matchingDeployment.apiUrl) {
      apiUrl = matchingDeployment.apiUrl;
    }

    return apiUrl;
  }
  return apiUrl;
}

export const GetEntities = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await GetApiUrl();
    apiUrl = apiUrls[0];
  }

  const response = await fetch(`/api/fetchEntities?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Entities");
  }
  const data = await response.json();

  return data;
};

function calculateDaysBetweenDates(begin: number, end: number): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = end - begin;
  return Math.floor(diff / oneDay);
}

export const getHealthChecks = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await GetApiUrl();
  }
  if (apiUrls.length === 0) {
    return [];
  }
  const response = await fetch(`/api/fetchHealth?apiUrls=${apiUrls.join(",")}`);
  if (!response.ok) {
    throw new Error("Failed to fetch health");
  }
  const data = await response.json();

  return data;
};

export const getInfo = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await GetApiUrl();
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

export const getMetrics = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await GetApiUrl();
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

  return data;
};

export const getJobs = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await GetApiUrl();
    apiUrl = apiUrls[0];
  }
  const response = await fetch(`/api/fetchJobs?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Jobs");
  }
  const data = await response.json();

  return data;
};

export const getDeployments = async () => {
  try {
    const response = await fetch("/api/deployments");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postDeployment = async (deployment: Deployment) => {
  try {
    const response = await fetch("/api/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deployment),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postCfg = async (cfg: any) => {
  try {
    const response = await fetch("/api/cfg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cfg),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getValues = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await GetApiUrl();
    apiUrl = apiUrls[0];
  }
  const response = await fetch(`/api/fetchValues?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Values");
  }
  const data = await response.json();

  return data;
};

export const getCfg = async (param: string) => {
  try {
    const formattedParam = param.replace(/_/g, "/");

    const response = await fetch(`${API_URL2}/cfg/entities/${formattedParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getDeploymentCfg = async () => {
  try {
    const response = await fetch(API_URL2 + "/cfg/global/deployment");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCfgs = async () => {
  try {
    const response = await fetch(API_URL2 + "/cfg");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getValuesCfg = async (param: string) => {
  try {
    const formattedParam = param.replace(/_/g, "/");

    const response = await fetch(`${API_URL2}/cfg/values/${formattedParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const sortCards = (cards: any[]) => {
  if (cards.length === 0) return [];
  return cards.sort((a: any, b: any) => {
    if (a.percent === 100 && b.percent !== 100) return 1;
    if (b.percent === 100 && a.percent !== 100) return -1;
    if (a.startedAt === -1 && b.startedAt > -1) return 1;
    if (b.startedAt === -1 && a.startedAt > -1) return -1;
    if (a.updatedAt <= 0 && b.updatedAt > 0) return 1;
    if (b.updatedAt <= 0 && a.updatedAt > 0) return -1;
    return b.startedAt - a.startedAt;
  });
};

export function summarizeStoreCheck(storeCheck: any[]): any[] {
  const labelCounts: { [label: string]: number } = {};
  const summarized: { [label: string]: any } = {};

  storeCheck.forEach((check) => {
    if (!labelCounts[check.label]) {
      labelCounts[check.label] = 0;
    }
    labelCounts[check.label]++;
  });

  storeCheck.forEach((check) => {
    if (labelCounts[check.label] > 1) {
      if (!summarized[check.label]) {
        summarized[check.label] = { ...check, subRows: [] };
      }

      const existingCheck = summarized[check.label];
      existingCheck.subRows.push(check);

      if (check.status === "UNAVAILABLE") {
        existingCheck.status = "UNAVAILABLE";
      } else if (
        check.status === "LIMITED" &&
        existingCheck.status !== "UNAVAILABLE"
      ) {
        existingCheck.status = "LIMITED";
      } else if (
        check.status === "AVAILABLE" &&
        existingCheck.status !== "UNAVAILABLE" &&
        existingCheck.status !== "LIMITED"
      ) {
        existingCheck.status = "AVAILABLE";
      }

      if (dayjs(check.checked).isAfter(dayjs(existingCheck.checked))) {
        existingCheck.checked = check.checked;
      }
    } else {
      summarized[check.label] = check;
    }
  });

  Object.values(summarized).forEach((item) => {
    if (item.subRows) {
      item.subRows = item.subRows.filter((subRow: any) => subRow !== item);
    }
  });

  return Object.values(summarized);
}

const fetchDataFromAllUrls = async (endpoint: string) => {
  const apiUrls: string[] = await GetApiUrl();

  if (apiUrls.length === 0) {
    return [];
  }

  const response = await fetch(
    `/api/fetchFromAllUrls?apiUrls=${apiUrls.join(",")}&endpoint=${endpoint}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return data;
};

export const compareDataAcrossUrls = async () => {
  const entitiesData = await fetchDataFromAllUrls("entities");
  const valuesData = await fetchDataFromAllUrls("values");

  const hasDifferences = (data: any[][]) => {
    if (data.length <= 1) return false;
    const [first, ...rest] = data;
    return rest.some((item) => JSON.stringify(item) !== JSON.stringify(first));
  };

  const entitiesDifferent = hasDifferences(entitiesData);
  const valuesDifferent = hasDifferences(valuesData);

  return {
    entitiesDifferent,
    valuesDifferent,
  };
};

export const getAvailableNodes = async (
  healthChecks: HealthChecksType,
  deployments: Deployment[]
): Promise<{ name: string; availableUrlsCount: number }[]> => {
  return deployments.map((deployment: Deployment) => {
    const uniqueUrls = new Set<string>();
    const checks = healthChecks[deployment.name];

    checks.forEach((check) => {
      if (check.state !== "OFFLINE") {
        uniqueUrls.add(check.url);
      }
    });

    return { name: deployment.name, availableUrlsCount: uniqueUrls.size };
  });
};

export const getAvailableNodesCount = (
  healthChecks: HealthChecksType,
  deployments: Deployment[]
): { name: string; availableUrlsCount: number }[] => {
  return deployments.map((deployment: Deployment) => {
    const checks = healthChecks[deployment.name];
    const urlStateMap = new Map<string, boolean>();

    checks.forEach((check) => {
      if (!urlStateMap.has(check.url)) {
        urlStateMap.set(check.url, check.state === "AVAILABLE");
      } else if (check.state !== "AVAILABLE") {
        urlStateMap.set(check.url, false);
      }
    });

    const availableUrlsCount = Array.from(urlStateMap.values()).filter(
      (isAvailable) => isAvailable
    ).length;

    console.log("availableUrlsCount", deployment.name, availableUrlsCount);
    return { name: deployment.name, availableUrlsCount };
  });
};
