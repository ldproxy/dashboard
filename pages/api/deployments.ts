import { deployments } from "../../src/data/deployments";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(deployments);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
