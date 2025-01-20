import { type NextRequest } from "next/server";

import { fromDev } from "@/dev-data/entities";
import { USE_DEV_DATA } from "@/lib/env";
import { badRequest, serverError } from "../util";

export async function GET(req: NextRequest) {
  if (USE_DEV_DATA) {
    return Response.json(fromDev());
  }

  let apiUrl = req.nextUrl.searchParams.get("apiUrl");

  if (!apiUrl) {
    return badRequest("apiUrl parameter is required");
  }

  try {
    const response = await fetch(apiUrl + "/entities");
    const entities = await response.json();

    return Response.json(entities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    return serverError();
  }
}
