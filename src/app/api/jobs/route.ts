import { type NextRequest } from "next/server";

import { JobSets, JobsWithUrl } from "@/lib/jobs";
import { fromDev } from "@/dev-data/jobs";
import { passThrough } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<JobSets | JobsWithUrl>(req, "/jobs", fromDev);
}
