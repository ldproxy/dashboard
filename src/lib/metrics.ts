export interface InputMetrics {
  gauges: {
    [key: string]: {
      value: number;
    };
  };
}

export type MultiInputMetrics = {
  url: string;
  metrics: InputMetrics;
}[];

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
  input: InputMetrics | MultiInputMetrics
): Metrics => {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeSingleMetric(item.metrics, item.url));
  }

  return [normalizeSingleMetric(input, "TODO")];
};
