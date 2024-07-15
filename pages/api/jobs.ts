import { Jobs } from "../../src/data/jobs";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(Jobs);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
