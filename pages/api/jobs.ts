import { NextApiRequest, NextApiResponse } from "next";
import { JobSets } from "../../src/lib/jobs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let apiUrl = req.query.apiUrl;

    if (!apiUrl) {
      return res.status(400).json({
        message: "apiUrls parameter is required",
      });
    }

    try {
      const response = await fetch(apiUrl + "/jobs");
      const jobs: JobSets = await response.json();

      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Internal Server Error Jobs" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
