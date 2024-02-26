import { providers_bergbau } from "../../../../../src/data/cfg";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(providers_bergbau);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
