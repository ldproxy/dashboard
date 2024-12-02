import { NextApiRequest, NextApiResponse } from "next";

const fetchHealth = async (apiUrls: string[]) => {
  try {
    const healthChecks = await Promise.all(
      apiUrls.map(async (url) => {
        try {
          const response = await fetch(url + "/health");
          if (!response.ok && response.status !== 500) {
            console.error(
              `API call failed with status: ${url}: ${response.status}`
            );
            return [{ state: "OFFLINE", url }];
          }
          const data = await response.json();
          const mappedHealthChecks = Object.keys(data).map((name) => ({
            name,
            url,
            ...data[name],
            capabilities: data[name].capabilities
              ? Object.keys(data[name].capabilities).map((cap) => ({
                  name: cap,
                  ...data[name].capabilities[cap],
                }))
              : undefined,
            components: data[name].components
              ? Object.keys(data[name].components).map((comp) => ({
                  name: comp,
                  ...data[name].components[comp],
                }))
              : undefined,
          }));
          return mappedHealthChecks;
        } catch (error) {
          console.error(`Error fetching health checks from ${url}:`, error);
          return [{ state: "OFFLINE", url }];
        }
      })
    );
    return healthChecks.flat();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Failed to fetch");
    } else {
      console.error("Error:", error);
    }
    return [];
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
      const health = await fetchHealth(apiUrls as string[]);
      res.status(200).json(health);
    } catch (error) {
      console.error("Error fetching health:", error);
      res.status(500).json({ message: "Internal Server Error Health" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
