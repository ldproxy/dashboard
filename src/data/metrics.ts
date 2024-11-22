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

export const metrics = {
  gauges: {
    "jvm.attribute.uptime": {
      value: 105385,
    },
    "jvm.memory.total.used": {
      value: 534838392,
    },
  },
};
