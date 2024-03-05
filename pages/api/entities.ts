import { fetchedEntities } from "../../src/data/entities";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedEntities);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
