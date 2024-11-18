// import { cfgs } from "../../src/data/cfgs";

export const cfgs = [
  {
    name: "demo",
    entities: [
      {
        title: "vineyards",
        content: {
          id: "vineyards",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
      {
        title: "daraa",
        content: {
          id: "daraa",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
    ],
  },
  {
    name: "demo2",
    entities: [
      {
        title: "vineyards2",
        content: {
          id: "vineyards",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
      {
        title: "daraa2",
        content: {
          id: "daraa",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
    ],
  },
];

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(cfgs);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
