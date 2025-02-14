import { MultiResponse, SingleResponse } from "@/app/api/util";
import { InputMetrics } from "@/lib/metrics";

const metrics = {
  gauges: {
    "jvm.attribute.uptime": {
      value: 105385,
    },
    "jvm.memory.total.used": {
      value: 534838392,
    },
  },
};

export const fromDev = (
  wrap: boolean,
  apiUrls?: string[]
):
  | InputMetrics
  | SingleResponse<InputMetrics>
  | MultiResponse<InputMetrics> => {
  if (wrap && apiUrls) {
    return apiUrls.map((url) => ({
      url,
      response: metrics,
    }));
  }

  return metrics;
};
