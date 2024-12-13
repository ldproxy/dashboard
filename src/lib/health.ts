import { Deployment } from "@/dev-data/deployments";
import { fromDev } from "../dev-data/health";
import { getApiUrl } from "./utils";
import dayjs from "dayjs";
import { Check } from "@/dev-data/health";

type HealthChecksType = { [key: string]: Check[] };

export const fetchedHealthChecks =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export const getHealthChecks = async (API_URL?: string) => {
  let apiUrls: string[] = [];
  if (API_URL) {
    apiUrls = Array.isArray(API_URL) ? API_URL : [API_URL];
  } else {
    apiUrls = await getApiUrl();
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

export const loadHealthChecksHomePage = async (deployments: Deployment[]) => {
  try {
    if (deployments.length > 0) {
      let healthChecksObj: HealthChecksType = {};
      const promises = deployments.map(async (deployment: any) => {
        try {
          const newHealthChecks = await getHealthChecks(deployment.apiUrl);
          healthChecksObj[deployment.name] = newHealthChecks;
        } catch (error) {
          console.error(
            "Error fetching health checks for",
            deployment.name,
            ":",
            error
          );
          healthChecksObj[deployment.name] = [
            { state: "OFFLINE", url: deployment.url },
          ];
        }
      });
      await Promise.all(promises);
      return healthChecksObj;
    }
  } catch (error) {
    console.error("Error loading health checks:", error);
  }
};
