import { fetchedEntities } from "../../src/data/entities";
import { cors } from "../../src/lib/cors";

export default async function handler(req: any, res: any) {
  await cors(req, res);
  if (req.method === "GET") {
    res.status(200).json(fetchedEntities);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
