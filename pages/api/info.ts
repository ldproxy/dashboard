import { NextApiRequest, NextApiResponse } from "next";
import { SingleInputInfo, MultiInputInfo } from "../../src/lib/info";

const unknownInfo = {
  name: "unknown",
  version: "unknown",
  status: "unknown",
  url: "",
  env: "unknown",
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
      const info: MultiInputInfo = await Promise.all(
        apiUrls.map(async (apiUrl) => {
          try {
            const response = await fetch(apiUrl + "/info");

            if (!response.ok && response.status !== 500) {
              console.error(
                `API call Info failed with status: ${response.status}`
              );
              return { url: apiUrl, info: unknownInfo };
            }
            const data: SingleInputInfo = await response.json();

            return { url: apiUrl, info: data };
          } catch (error) {
            console.error(`Error fetching info from ${apiUrl}:`, error);
            return { url: apiUrl, info: unknownInfo };
          }
        })
      );

      res.status(200).json(info);
    } catch (error) {
      console.error("Error fetching info:", error);
      res.status(500).json({ message: "Internal Server Error Info" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
