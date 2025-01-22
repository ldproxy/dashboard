import { type NextRequest } from "next/server";

import { fromDev } from "@/dev-data/entities";
import { passThrough } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<any>(req, "/entities", fromDev);
}
