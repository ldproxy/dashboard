import { NextApiRequest, NextApiResponse } from "next";
import { expandJobs, expandJob } from "@/lib/jobs";

const fetchJobs = async (apiUrl: string) => {
  try {
    const response = await fetch(apiUrl + "/jobs");
    const data = await response.json();
    return expandJobs(data.sets);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

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
      const jobs = await fetchJobs(apiUrl as string);
      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Internal Server Error Jobs" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
