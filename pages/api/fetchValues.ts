import { NextApiRequest, NextApiResponse } from "next";

const fetchValues = async (apiUrl: string) => {
  try {
    const response = await fetch(apiUrl + "/values");
    const data = await response.json();
    return Object.keys(data).flatMap((type) =>
      Array.isArray(data[type])
        ? data[type].map((value: any) => ({
            type,
            uid: `${type}_${value.path}`,
            ...value,
          }))
        : []
    );
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
      const values = await fetchValues(apiUrl as string);
      res.status(200).json(values);
    } catch (error) {
      console.error("Error fetching values:", error);
      res.status(500).json({ message: "Internal Server Error Values" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
