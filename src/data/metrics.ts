export interface InputMetrics {
  gauges: {
    [key: string]: {
      value: number;
    };
  };
}

export interface Metrics {
  uptime: number;
  memory: number;
}

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
