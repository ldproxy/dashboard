import { InputMetrics } from "@/lib/metrics";

export const fromDev = (): InputMetrics => {
  return {
    gauges: {
      "jvm.attribute.uptime": {
        value: 105385,
      },
      "jvm.memory.total.used": {
        value: 534838392,
      },
    },
  };
};
