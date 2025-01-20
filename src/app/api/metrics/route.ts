import { type NextRequest } from "next/server";

import { InputMetrics } from "@/lib/metrics";
import { fromDev } from "@/dev-data/metrics";
import { USE_DEV_DATA } from "@/lib/env";
import { badRequest, fetchMulti, parseApiUrls, serverError } from "../util";

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
  if (USE_DEV_DATA) {
    return Response.json(fromDev());
  }

  let apiUrls: string[];

  try {
    apiUrls = parseApiUrls(req.nextUrl.searchParams.get("apiUrl"));
  } catch (error: any) {
    return badRequest(error.message);
  }

  try {
    const health = await fetchMulti<InputMetrics>(
      apiUrls,
      "/metrics",
      unknownMetrics
    );

    Response.json(health);
  } catch (error) {
    console.error("Error fetching health:", error);
    return serverError();
  }
}
