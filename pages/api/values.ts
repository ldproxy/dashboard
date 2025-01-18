import { NextApiRequest, NextApiResponse } from "next";
import { InputValues } from "../../src/lib/values";

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
      const response = await fetch(apiUrl + "/values");
      const values: InputValues = await response.json();

      res.status(200).json(values);
    } catch (error) {
      console.error("Error fetching values:", error);
      res.status(500).json({ message: "Internal Server Error Values" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
