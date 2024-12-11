import { fetchedMetrics } from "../../src/lib/metrics";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedMetrics);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
