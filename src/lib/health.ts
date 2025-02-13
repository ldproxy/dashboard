import dayjs from "dayjs";
import { fetchData } from "./fetchData";
import { Deployment } from "./deployments";
import { MultiResponse } from "@/app/api/util";

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
  url?: string;
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

export interface UiCheck {
  label: string;
  description?: string;
  name?: string;
  url?: string;
  state: string;
  message?: string;
  checked: string;
}

type HealthChecksType = { [key: string]: Check[] };

export type InputHealth = Record<string, InputCheck>;

const normalizeChecks = (input: InputHealth, url?: string): Check[] => {
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
  input: InputHealth | MultiResponse<InputHealth>
): Check[] => {
  if (Array.isArray(input)) {
    return input.flatMap((item) => {
      if (item.offline || item.response === null) {
        return [{ url: item.url, state: "OFFLINE" }];
      }
      return normalizeChecks(item.response!, item.url);
    });
  }

  return normalizeChecks(input);
};

export function summarizeStoreCheck(storeCheck: UiCheck[]): UiCheck[] {
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

      if (check.state === "UNAVAILABLE") {
        existingCheck.status = "UNAVAILABLE";
      } else if (
        check.state === "LIMITED" &&
        existingCheck.status !== "UNAVAILABLE"
      ) {
        existingCheck.status = "LIMITED";
      } else if (
        check.state === "AVAILABLE" &&
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
