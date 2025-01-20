import { type NextRequest } from "next/server";

import { InputHealth } from "@/lib/health";
import { fromDev } from "@/dev-data/health";
import { USE_DEV_DATA } from "@/lib/env";
import { badRequest, fetchMulti, parseApiUrls, serverError } from "../util";

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
    const health = await fetchMulti<InputHealth>(apiUrls, "/health");

    return Response.json(health);
  } catch (error) {
    console.error("Error fetching health:", error);
    return serverError();
  }
}
