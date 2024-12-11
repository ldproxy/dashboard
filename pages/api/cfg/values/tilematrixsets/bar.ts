import { fetchedTilematrixsets_bar } from "../../../../../src/lib/cfgValues";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedTilematrixsets_bar);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
