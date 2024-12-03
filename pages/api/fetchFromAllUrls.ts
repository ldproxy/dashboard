import { NextApiRequest, NextApiResponse } from "next";

const fetchFromAllUrls = async (apiUrls: string[], endpoint: string) => {
  try {
    const data = await Promise.all(
      apiUrls.map(async (url) => {
        try {
          const response = await fetch(`${url}/${endpoint}`);
          if (!response.ok) {
            console.error(`API call failed with status: ${response.status}`);
            return null;
          }
          return await response.json();
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          return null;
        }
      })
    );
    return data.filter((item) => item !== null);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let apiUrls = req.query.apiUrls;
    let endpoint = req.query.endpoint;

    if (!apiUrls || !endpoint) {
      return res.status(400).json({
        message: "apiUrls and endpoint parameter is required",
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
      const data = await fetchFromAllUrls(
        apiUrls as string[],
        endpoint as string
      );
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error Data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
