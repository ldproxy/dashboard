import { NextApiRequest, NextApiResponse } from "next";
import { InputMetrics, MultiInputMetrics } from "../../src/lib/metrics";

const unknownMetrics: InputMetrics = {
  gauges: {
    "jvm.attribute.uptime": {
      value: 0,
    },
    "jvm.memory.total.used": {
      value: 0,
    },
  },
};

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
      const metrics: MultiInputMetrics = await Promise.all(
        apiUrls.map(async (apiUrl) => {
          try {
            const response = await fetch(apiUrl + "/metrics");

            if (!response.ok && response.status !== 500) {
              console.error(`API call failed with status: ${response.status}`);
              return { url: apiUrl, metrics: unknownMetrics };
            }
            const data: InputMetrics = await response.json();

            return { url: apiUrl, metrics: data };
          } catch (error) {
            console.error(`Error fetching metrics from ${apiUrl}:`, error);
            return { url: apiUrl, metrics: unknownMetrics };
          }
        })
      );

      res.status(200).json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Internal Server Error Metrics" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
