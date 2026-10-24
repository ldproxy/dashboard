import { type NextRequest } from "next/server";

import { InputHealth } from "@/lib/health";
import { fromDev } from "@/dev-data/health";
import { MultiResponse, passThrough, SingleResponse } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<
    InputHealth | SingleResponse<InputHealth> | MultiResponse<InputHealth>
  >(req, "/health", fromDev);
}
