import { fetchedHealthChecks } from "../../src/lib/health";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedHealthChecks);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
