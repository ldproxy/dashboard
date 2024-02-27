import { codelists_foo } from "../../../../../src/data/cfgValues";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(codelists_foo);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
