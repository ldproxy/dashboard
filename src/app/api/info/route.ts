import { type NextRequest } from "next/server";

import { InputInfo } from "@/lib/info";
import { fromDev } from "@/dev-data/info";
import { USE_DEV_DATA } from "@/lib/env";
import { badRequest, fetchMulti, parseApiUrls, serverError } from "../util";

const unknownInfo = {
  name: "unknown",
  version: "unknown",
  status: "unknown",
  url: "",
  env: "unknown",
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
    const health = await fetchMulti<InputInfo>(apiUrls, "/info", unknownInfo);

    return Response.json(health);
  } catch (error) {
    console.error("Error fetching health:", error);
    return serverError();
  }
}
