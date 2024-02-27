import { tilematrixsets_bar } from "../../../../../src/data/cfgValues";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(tilematrixsets_bar);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
