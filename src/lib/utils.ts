"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

import { Deployment } from "@/dev-data/deployments";
import { HealthChecksType } from "../../src/app/deployment/page";
import { getDeployments } from "@/lib/deployments";
import { IS_MODE_SINGLE } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getApiUrl(): Promise<string[]> {
  if (IS_MODE_SINGLE) {
    return ["/api"];
  }

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

function calculateDaysBetweenDates(begin: number, end: number): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = end - begin;
  return Math.floor(diff / oneDay);
}

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
  const nameCounts: { [name: string]: number } = {};
  const summarized: { [name: string]: any } = {};

  storeCheck.forEach((check) => {
    if (!nameCounts[check.name]) {
      nameCounts[check.name] = 0;
    }
    nameCounts[check.name]++;
  });

  storeCheck.forEach((check) => {
    if (nameCounts[check.name] > 1) {
      if (!summarized[check.name]) {
        summarized[check.name] = { ...check, subRows: [] };
      }

      const existingCheck = summarized[check.name];
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
      summarized[check.name] = check;
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
  const apiUrls: string[] = await getApiUrl();

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

    return { name: deployment.name, availableUrlsCount };
  });
};
