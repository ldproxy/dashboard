import { NextApiRequest, NextApiResponse } from "next";

const fetchInfo = async (apiUrls: string[]) => {
  try {
    const info = await Promise.all(
      apiUrls.map(async (apiUrl) => {
        try {
          const response = await fetch(apiUrl + "/info");
          if (!response.ok && response.status !== 500) {
            console.error(
              `API call Info failed with status: ${response.status}`
            );
            return {
              name: "unknown",
              version: "unknown",
              status: "unknown",
              url: "",
              env: "unknown",
              apiUrl,
            };
          }
          const data = await response.json();
          return { ...data, apiUrl };
        } catch (error) {
          console.error(`Error fetching info from ${apiUrl}:`, error);
          return {
            name: "unknown",
            version: "unknown",
            status: "unknown",
            url: "",
            env: "unknown",
            apiUrl,
          };
        }
      })
    );
    return info;
  } catch (error) {
    console.error("Error:", error);
    return [
      {
        name: "unknown",
        version: "unknown",
        status: "unknown",
        url: "",
        env: "unknown",
        apiUrl: "unknown",
      },
    ];
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
      const info = await fetchInfo(apiUrls as string[]);
      res.status(200).json(info);
    } catch (error) {
      console.error("Error fetching info:", error);
      res.status(500).json({ message: "Internal Server Error Info" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
