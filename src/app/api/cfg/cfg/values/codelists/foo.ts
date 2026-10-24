import { fetchedCodelists_foo } from "../../../../../../lib/cfgValues";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedCodelists_foo);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
