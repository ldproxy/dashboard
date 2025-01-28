"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

import { HealthChecksType } from "../app/deployment/page";
import { Deployment, getDeployments } from "@/lib/deployments";
import { IS_MODE_SINGLE } from "./env";
import { fetchData } from "./fetchData";
import { MultiResponse } from "@/app/api/util";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getApiUrl(): Promise<string[]> {
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

export const compareDataAcrossUrls = async () => {
  try {
    const entitiesData: MultiResponse<any> = await fetchData(
      "/api/entities",
      (r) => r
    );
    const valuesData: MultiResponse<any> = await fetchData(
      "/api/values",
      (r) => r
    );

    const entities = entitiesData
      .filter((entity) => !entity.offline)
      .map((entity) => entity.response);
    const values = valuesData
      .filter((value) => !value.offline)
      .map((value) => value.response);

    const hasDifferences = (data: any[][]) => {
      if (data.length <= 1) return false;
      const [first, ...rest] = data;
      return rest.some(
        (item) => JSON.stringify(item) !== JSON.stringify(first)
      );
    };

    const entitiesDifferent = hasDifferences(entities);
    const valuesDifferent = hasDifferences(values);

    return {
      entitiesDifferent,
      valuesDifferent,
    };
  } catch (error) {
    console.error("Error comparing data:", error);
    return {
      entitiesDifferent: false,
      valuesDifferent: false,
    };
  }
};

export const getLimitedNodes = async (
  healthChecks: HealthChecksType,
  deployments: Deployment[]
): Promise<{ name: string; availableUrlsCount: number }[]> => {
  return deployments.map((deployment: Deployment) => {
    const uniqueUrls = new Set<string>();
    const checks = healthChecks[deployment.name];

    let hasAvailableOrLimited = false;
    let hasLimitedOrUnavailable = false;

    checks.forEach((check) => {
      if (check.state === "AVAILABLE" || check.state === "LIMITED") {
        uniqueUrls.add(check.url);
        hasAvailableOrLimited = true;
      }
      if (check.state === "LIMITED" || check.state === "UNAVAILABLE") {
        hasLimitedOrUnavailable = true;
      }
    });

    return {
      name: deployment.name,
      availableUrlsCount:
        hasAvailableOrLimited && hasLimitedOrUnavailable ? uniqueUrls.size : 0,
    };
  });
};

export const getHealthyNodesCount = (
  healthChecks: HealthChecksType,
  deployments: Deployment[]
): { name: string; availableUrlsCount: number }[] => {
  return deployments.map((deployment: Deployment) => {
    const checks = healthChecks[deployment.name];
    const urlStateMap = new Map<string, boolean>();

    checks.forEach((check) => {
      if (!urlStateMap.has(check.url)) {
        urlStateMap.set(check.url, check.healthy === true);
      } else if (check.healthy !== true) {
        urlStateMap.set(check.url, false);
      }
    });

    const availableUrlsCount = Array.from(urlStateMap.values()).filter(
      (isHealthy) => isHealthy === true
    ).length;

    return { name: deployment.name, availableUrlsCount };
  });
};

export const getOfflineNodesCount = (
  healthChecks: HealthChecksType,
  deployments: Deployment[]
): { name: string; offlineUrlsCount: number }[] => {
  return deployments.map((deployment: Deployment) => {
    const checks = healthChecks[deployment.name];
    const urlStateMap = new Map<string, boolean>();

    checks.forEach((check) => {
      if (!urlStateMap.has(check.url)) {
        urlStateMap.set(
          check.url,
          check.state === "UNAVAILABLE" || check.state === "OFFLINE"
        );
      } else if (check.state !== "UNAVAILABLE" && check.state !== "OFFLINE") {
        urlStateMap.set(check.url, false);
      }
    });

    const offlineUrlsCount = Array.from(urlStateMap.values()).filter(
      (isOffline) => isOffline === true
    ).length;

    return { name: deployment.name, offlineUrlsCount };
  });
};
