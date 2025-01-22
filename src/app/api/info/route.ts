import { type NextRequest } from "next/server";

import { InputInfo } from "@/lib/info";
import { fromDev } from "@/dev-data/info";
import { passThrough } from "../util";

const unknownInfo = {
  name: "unknown",
  version: "unknown",
  status: "unknown",
  url: "",
  env: "unknown",
};

export async function GET(req: NextRequest) {
  return passThrough<InputInfo>(req, "/info", fromDev, unknownInfo);
}
