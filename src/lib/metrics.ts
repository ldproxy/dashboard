import { MultiResponse } from "@/app/api/util";

export interface InputMetrics {
  gauges: {
    [key: string]: {
      value: number;
    };
  };
}

export interface MetricsInfo {
  uptime: number;
  memory: number;
  apiUrl: string;
}

export type Metrics = MetricsInfo[];

const normalizeSingleMetric = (
  input: InputMetrics,
  url: string
): MetricsInfo => {
  return {
    uptime: input.gauges["jvm.attribute.uptime"].value,
    memory: input.gauges["jvm.memory.total.used"].value,
    apiUrl: url,
  };
};

export const normalizeMetrics = (
  input: InputMetrics | MultiResponse<InputMetrics>
): Metrics => {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeSingleMetric(item.response!, item.url));
  }

  return [normalizeSingleMetric(input, "TODO")];
};
