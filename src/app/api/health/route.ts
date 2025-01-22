import { type NextRequest } from "next/server";

import { InputHealth } from "@/lib/health";
import { fromDev } from "@/dev-data/health";
import { passThrough } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<InputHealth>(req, "/health", fromDev);
}
