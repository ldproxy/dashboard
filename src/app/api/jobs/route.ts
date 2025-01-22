import { type NextRequest } from "next/server";

import { JobSets } from "@/lib/jobs";
import { fromDev } from "@/dev-data/jobs";
import { passThrough } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<JobSets>(req, "/jobs", fromDev);
}
