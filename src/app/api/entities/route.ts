import { type NextRequest } from "next/server";

import { fromDev } from "@/dev-data/entities";
import { passThrough, SingleResponse } from "../util";
import { InputEntity } from "@/lib/entities";

export type Entities = {
  [key: string]: InputEntity[];
};

export async function GET(req: NextRequest) {
  return passThrough<Entities | SingleResponse<Entities>>(
    req,
    "/entities",
    fromDev
  );
}
