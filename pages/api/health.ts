import { NextApiRequest, NextApiResponse } from "next";
import { MultiInputHealth, SingleInputHealth } from "../../src/lib/health";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let apiUrls = req.query.apiUrls;

    if (!apiUrls) {
      return res.status(400).json({
        message: "apiUrls parameter is required",
      });
    }

    if (typeof apiUrls === "string") {
      apiUrls = apiUrls.split(",");
    }

    if (!Array.isArray(apiUrls) || apiUrls.length === 0) {
      return res.status(400).json({
        message: "apiUrls parameter must be an array",
      });
    }

    try {
      const health: MultiInputHealth = await Promise.all(
        apiUrls.map(async (url) => {
          try {
            const response = await fetch(url + "/health");

            if (!response.ok && response.status !== 500) {
              console.error(
                `API call failed with status: ${url}: ${response.status}`
              );
              return { url, checks: {}, state: "OFFLINE" };
            }

            const checks: SingleInputHealth = await response.json();

            return { url, checks };
          } catch (error) {
            console.error(`Error fetching health checks from ${url}:`, error);
            return { url, checks: {}, state: "OFFLINE" };
          }
        })
      );

      res.status(200).json(health);
    } catch (error) {
      console.error("Error fetching health:", error);
      res.status(500).json({ message: "Internal Server Error Health" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
