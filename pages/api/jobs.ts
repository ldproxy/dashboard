import { fetchedJobs } from "../../src/lib/jobs";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(fetchedJobs);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
