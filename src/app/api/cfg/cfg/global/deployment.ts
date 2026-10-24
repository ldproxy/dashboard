import { appCfg } from "../../../../../dev-data/cfg";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(appCfg);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
