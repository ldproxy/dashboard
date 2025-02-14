import { type NextRequest } from "next/server";

import { InputMetrics } from "@/lib/metrics";
import { fromDev } from "@/dev-data/metrics";
import { MultiResponse, passThrough, SingleResponse } from "../util";

const unknownMetrics: InputMetrics = {
  gauges: {
    "jvm.attribute.uptime": {
      value: 0,
    },
    "jvm.memory.total.used": {
      value: 0,
    },
  },
};

export async function GET(req: NextRequest) {
  return passThrough<
    InputMetrics | SingleResponse<InputMetrics> | MultiResponse<InputMetrics>
  >(req, "/metrics", fromDev, unknownMetrics);
}
