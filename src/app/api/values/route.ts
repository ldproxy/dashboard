import { type NextRequest } from "next/server";

import { InputValues } from "@/lib/values";
import { fromDev } from "@/dev-data/values";
import { MultiResponse, passThrough, SingleResponse } from "../util";

export async function GET(req: NextRequest) {
  return passThrough<
    InputValues | SingleResponse<InputValues> | MultiResponse<InputValues>
  >(req, "/values", fromDev);
}
