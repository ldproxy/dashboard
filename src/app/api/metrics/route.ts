import { type NextRequest } from "next/server";

import { InputMetrics } from "@/lib/metrics";
import { fromDev } from "@/dev-data/metrics";
import { passThrough } from "../util";

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
  return passThrough<InputMetrics>(req, "/metrics", fromDev, unknownMetrics);
}
