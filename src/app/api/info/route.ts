import { type NextRequest } from "next/server";

import { InputInfo } from "@/lib/info";
import { fromDev } from "@/dev-data/info";
import { MultiResponse, passThrough, SingleResponse } from "../util";

const NOT_AVAILABLE = "N/A";

const unknownInfo = {
  name: NOT_AVAILABLE,
  version: NOT_AVAILABLE,
  status: NOT_AVAILABLE,
  url: "",
  env: NOT_AVAILABLE,
};

export async function GET(req: NextRequest) {
  return passThrough<
    InputInfo | SingleResponse<InputInfo> | MultiResponse<InputInfo>
  >(req, "/info", fromDev, unknownInfo);
}
