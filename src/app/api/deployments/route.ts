import { type NextRequest } from "next/server";

import { fromDev } from "@/dev-data/deployments";
import { fromEnv } from "@/lib/deployments";
import { USE_DEV_DEPLOYMENTS } from "@/lib/env";

const deployments = USE_DEV_DEPLOYMENTS ? fromDev() : fromEnv();

export async function GET() {
  return Response.json(deployments);
}

export async function POST(req: NextRequest) {
  const newDeployment = await req.json();
  deployments.push(newDeployment);

  return Response.json(deployments, { status: 201 });
}
