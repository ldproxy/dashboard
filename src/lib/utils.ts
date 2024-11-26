"use client";
import { Job } from "@/data/jobs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Deployment } from "@/data/deployments";
import dayjs from "dayjs";

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
  try {
    const response = await fetch(apiUrl + "/entities");
    const data = await response.json();
    const newMappedEntities = Object.keys(data)
      .flatMap((type) =>
        data[type].map((entity: any) => ({
          type,
          uid: `${type}_${entity.id}`,
          ...entity,
        }))
      )
      .filter((entity: any) => entity.status !== "DISABLED");
    return newMappedEntities;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

function calculateDaysBetweenDates(begin: number, end: number): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = end - begin;
  return Math.floor(diff / oneDay);
}

export const getHealthChecks = async (API_URL?: string) => {
  let apiUrl: string[] = [];
  if (API_URL) {
    apiUrl = API_URL;
  } else {
    apiUrl = await GetApiUrl();
  }
  if (apiUrl.length === 0) {
    return [];
  }

  try {
    const healthChecks = await Promise.all(
      apiUrl.map(async (url) => {
        const response = await fetch(url + "/health");
        if (!response.ok && response.status !== 500) {
          console.error(
            `API call failed with status: ${url}: ${response.status}`
          );
          return [];
        }
        const data = await response.json();
        const mappedHealthChecks = Object.keys(data).map((name) => ({
          name,
          url,
          ...data[name],
          capabilities: data[name].capabilities
            ? Object.keys(data[name].capabilities).map((cap) => ({
                name: cap,
                ...data[name].capabilities[cap],
              }))
            : undefined,
          components: data[name].components
            ? Object.keys(data[name].components).map((comp) => ({
                name: comp,
                ...data[name].components[comp],
              }))
            : undefined,
        }));
        return mappedHealthChecks;
      })
    );
    return healthChecks.flat();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Failed to fetch");
    } else {
      console.error("Error:", error);
    }
    return [];
  }
};

export const getInfo = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = API_URL;
  } else {
    apiUrls = await GetApiUrl();
  }
  if (apiUrls.length === 0) {
    return [];
  }
  try {
    const info = await Promise.all(
      apiUrls.map(async (apiUrl) => {
        const response = await fetch(apiUrl + "/info");
        if (!response.ok && response.status !== 500) {
          console.error(`API call Info failed with status: ${response.status}`);
          return {
            name: "unknown",
            version: "unknown",
            status: "unknown",
            url: "",
            env: "unknown",
            apiUrl,
          };
        }
        const data = await response.json();
        return { ...data, apiUrl };
      })
    );
    return info;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Failed to fetch");
    } else {
      console.error("Error:", error);
    }

    return [
      {
        name: "unknown",
        version: "unknown",
        status: "unknown",
        url: "",
        env: "unknown",
        apiUrl: "",
      },
    ];
  }
};

export const getMetrics = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = API_URL;
  } else {
    apiUrls = await GetApiUrl();
  }
  if (apiUrls.length === 0) {
    return [];
  }

  try {
    const metrics = await Promise.all(
      apiUrls.map(async (url) => {
        const response = await fetch(url + "/metrics");
        if (!response.ok && response.status !== 500) {
          console.error(`API call failed with status: ${response.status}`);
          return { uptime: 0, memory: 0, apiUrl: url };
        }
        const data = await response.json();
        return {
          uptime: data.gauges["jvm.attribute.uptime"].value,
          memory: data.gauges["jvm.memory.total.used"].value,
          apiUrl: url,
        };
      })
    );
    return metrics;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Failed to fetch");
    } else if (
      error instanceof TypeError &&
      error.message.includes("NetworkError")
    ) {
      console.error("Network error: Connection refused");
    } else {
      console.error("Error:", error);
    }
    return [{ uptime: 0, memory: 0, apiUrl: "" }];
  }
};

export const getJobs = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await GetApiUrl();
    apiUrl = apiUrls[0];
  }
  try {
    const response = await fetch(apiUrl + "/jobs");
    const data = await response.json();
    return expandJobs(data.sets);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const expandJobs = (jobs: Job[] = []): Job[] => {
  const allJobs = [...jobs];

  for (const followUp of jobs.flatMap(expandJob)) {
    if (!allJobs.some((job) => job.id === followUp.id)) {
      allJobs.push(followUp);
    }
  }

  return allJobs;
};
const expandJob = (job: Job): Job[] => {
  if (job.followUps.length > 0) {
    return [job, ...job.followUps.flatMap(expandJob)];
  }

  return [job];
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

export const getValues = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await GetApiUrl();
    apiUrl = apiUrls[0];
  }
  try {
    const response = await fetch(apiUrl + "/values");
    const data = await response.json();
    return Object.keys(data).flatMap((type) =>
      Array.isArray(data[type])
        ? data[type].map((value: any) => ({
            type,
            uid: `${type}_${value.path}`,
            ...value,
          }))
        : []
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
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
