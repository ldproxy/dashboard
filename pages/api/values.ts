import { values } from "../../src/data/values";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(values);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
