import { NextApiRequest, NextApiResponse } from "next";

const fetchMetrics = async (apiUrls: string[]) => {
  try {
    const metrics = await Promise.all(
      apiUrls.map(async (url) => {
        try {
          const response = await fetch(url + "/metrics");
          if (!response.ok && response.status !== 500) {
            console.error(`API call failed with status: ${response.status}`);
            return { uptime: 0, memory: 0, apiUrl: url };
          }
          const data = await response.json();
          return {
            uptime: data.gauges["jvm.attribute.uptime"].value,
            memory: data.gauges["jvm.memory.total.used"].value,
            apiUrl: url,
          };
        } catch (error) {
          console.error(`Error fetching metrics from ${url}:`, error);
          return { uptime: 0, memory: 0, apiUrl: url };
        }
      })
    );
    return metrics;
  } catch (error) {
    console.error("Error:", error);
    return [{ uptime: 0, memory: 0, apiUrl: "unknown" }];
  }
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
      const metrics = await fetchMetrics(apiUrls as string[]);
      res.status(200).json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Internal Server Error Metrics" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
