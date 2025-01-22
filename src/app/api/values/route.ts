import { type NextRequest } from "next/server";

import { InputValues } from "@/lib/values";
import { fromDev } from "@/dev-data/values";
import { passThrough } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<InputValues>(req, "/values", fromDev);
}
