import { NextApiRequest, NextApiResponse } from "next";

const fetchEntities = async (apiUrl: string) => {
  try {
    const response = await fetch(apiUrl + "/entities");
    const data = await response.json();
    const newMappedEntities = Object.keys(data)
      .flatMap((type) =>
        data[type].map((entity: any) => ({
          type,
          uid: `${type}_${entity.id}`,
          ...entity,
        }))
      )
      .filter((entity: any) => entity.status !== "DISABLED");
    return newMappedEntities;
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
      const entities = await fetchEntities(apiUrl as string);
      res.status(200).json(entities);
    } catch (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ message: "Internal Server Error Entities" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
