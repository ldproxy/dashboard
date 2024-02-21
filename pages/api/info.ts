import { info } from "../../src/data/info";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(info);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
