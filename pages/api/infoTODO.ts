import { fromDev } from "../../src/dev-data/info";
import { IS_PROD } from "../../src/lib/env";

export const fetchedInfo = process.env.DEPLOYMENTS || IS_PROD ? {} : fromDev();

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedInfo);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
