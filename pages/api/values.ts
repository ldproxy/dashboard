import { fetchedValues } from "../../src/lib/values";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedValues);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
