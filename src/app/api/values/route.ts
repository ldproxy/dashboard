import { type NextRequest } from "next/server";

import { InputValues } from "@/lib/values";
import { fromDev } from "@/dev-data/cfg";
import { USE_DEV_DATA } from "@/lib/env";
import { badRequest, serverError } from "../util";

export async function GET(req: NextRequest) {
  if (USE_DEV_DATA) {
    return Response.json(fromDev());
  }

  let apiUrl = req.nextUrl.searchParams.get("apiUrl");

  if (!apiUrl) {
    return badRequest("apiUrls parameter is required");
  }

  try {
    const response = await fetch(apiUrl + "/values");
    const values: InputValues = await response.json();

    Response.json(values);
  } catch (error) {
    console.error("Error fetching values:", error);
    return serverError();
  }
}
