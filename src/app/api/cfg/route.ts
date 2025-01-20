import { type NextRequest } from "next/server";

import {
  cfgs,
  addConfiguration,
  deleteConfiguration,
  updateConfiguration,
} from "@/lib/cfg";

export async function GET() {
  return Response.json(cfgs);
}

export async function POST(req: NextRequest) {
  const newCfg = await req.json();
  addConfiguration(cfgs, newCfg);

  return Response.json(newCfg, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { oldName, newName, oldUrl, newUrl } = await req.json();
  updateConfiguration(cfgs, oldName, newName, oldUrl, newUrl);

  return Response.json({ message: "Configuration updated" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  deleteConfiguration(cfgs, name);

  return Response.json({ message: "Configuration deleted" }, { status: 200 });
}
