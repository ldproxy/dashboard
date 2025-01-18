import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let apiUrl = req.query.apiUrl;

    if (!apiUrl) {
      return res.status(400).json({
        message: "apiUrl parameter is required",
      });
    }

    try {
      const response = await fetch(apiUrl + "/entities");
      const entities = await response.json();

      res.status(200).json(entities);
    } catch (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ message: "Internal Server Error Entities" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
