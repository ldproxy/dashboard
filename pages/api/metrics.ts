import { metrics } from "../../src/data/metrics";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(metrics);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}