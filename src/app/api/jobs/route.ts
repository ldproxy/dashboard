import { type NextRequest } from "next/server";

import { JobSets, JobsWithUrl } from "@/lib/jobs";
import { fromDev } from "@/dev-data/jobs";
import { MultiResponse, passThrough, SingleResponse } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<
    JobSets | SingleResponse<JobSets> | MultiResponse<JobSets>
  >(req, "/jobs", fromDev);
}
