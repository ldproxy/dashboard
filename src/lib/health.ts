import { Deployment } from "@/dev-data/deployments";
import dayjs from "dayjs";
import { fetchDataFromMultipleApiUrls } from "./fetchData";
import { it } from "node:test";

export interface InputCheck {
  url?: string;
  label?: string;
  description?: string;
  healthy: boolean;
  timestamp: string;
  state: string;
  duration: number;
  message?: string;
  sources?: { label: string; status: string }[];
  capabilities?: Record<
    string,
    {
      label: string;
      description: string;
      healthy: boolean;
      state: string;
      message?: string;
    }
  >;
  components?: Record<
    string,
    {
      healthy: boolean;
      state: string;
      message?: string;
      capabilities: [];
    }
  >;
}

export interface Check {
  label?: string;
  description?: string;
  name?: string;
  url: string;
  healthy?: boolean;
  state: string;
  timestamp?: string;
  duration?: number;
  message?: string;
  sources?: { label: string; status: string }[];
  capabilities?: {
    label?: string;
    description?: string;
    name: string;
    healthy: boolean;
    state: string;
    message?: string;
  }[];
  components?: {
    name: string;
    healthy: boolean;
    state: string;
    message?: string;
    capabilities: [];
  }[];
}

type HealthChecksType = { [key: string]: Check[] };

export type SingleInputHealth = Record<string, InputCheck>;
export type MultiInputHealth = {
  url: string;
  checks: SingleInputHealth;
  state?: string;
}[];

const normalizeChecks = (input: SingleInputHealth, url: string): Check[] => {
  return Object.keys(input).map((name) => ({
    name,
    url,
    ...input[name],
    capabilities: input[name].capabilities
      ? Object.keys(input[name].capabilities!).map((cap) => ({
          name: cap,
          ...input[name].capabilities![cap],
        }))
      : undefined,
    components: input[name].components
      ? Object.keys(input[name].components!).map((comp) => ({
          name: comp,
          ...input[name].components![comp],
        }))
      : undefined,
  }));
};

export const normalizeHealth = (
  input: SingleInputHealth | MultiInputHealth
): Check[] => {
  if (Array.isArray(input)) {
    return input.flatMap((item) => {
      if (item.state) {
        return [{ url: item.url, state: item.state }];
      }
      return normalizeChecks(item.checks, item.url);
    });
  }

  return normalizeChecks(input, "TODO");
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
          const newHealthChecks = await fetchDataFromMultipleApiUrls(
            "/api/health",
            deployment.apiUrl
          );
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
