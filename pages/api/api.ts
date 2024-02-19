import { fetchedEntities } from "../../src/data/entities";
import { fetchedHealthChecks } from "../../src/data/health";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    if (req.query.type === "entities") {
      res.status(200).json(fetchedEntities);
    } else if (req.query.type === "healthchecks") {
      res.status(200).json(fetchedHealthChecks);
    } else {
      res.status(200).json(fetchedEntities);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
