import { type NextRequest } from "next/server";

import { JobSets } from "@/lib/jobs";
import { fromDev } from "@/dev-data/jobs";
import { USE_DEV_DATA } from "@/lib/env";
import { badRequest, serverError } from "../util";

export async function GET(req: NextRequest) {
  if (USE_DEV_DATA) {
    return Response.json(fromDev());
  }

  let apiUrl = req.nextUrl.searchParams.get("apiUrl");

  if (!apiUrl) {
    return badRequest("apiUrls parameter is required");
  }

  try {
    const response = await fetch(apiUrl + "/jobs");
    const jobs: JobSets = await response.json();

    return Response.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return serverError();
  }
}
