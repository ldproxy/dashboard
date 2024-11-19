// import { cfgs } from "../../src/data/cfgs";

export const cfgs = [
  {
    name: "demo",
    entities: [
      {
        title: "vineyards",
        url: "https://github.com/ldproxy/dashboard",
        content: {
          id: "vineyards",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
      {
        title: "daraa",
        url: "https://github.com/ldproxy/dashboard2",
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
        url: "https://github.com/ldproxy/dashboard3",
        content: {
          id: "vineyards",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
    ],
  },
];

const addOrUpdateConfiguration = (
  configurations: typeof cfgs,
  newCfg: (typeof cfgs)[0]
): typeof cfgs => {
  const existingConfigIndex = configurations.findIndex(
    (cfg) => cfg.name === newCfg.name
  );

  if (existingConfigIndex !== -1) {
    configurations[existingConfigIndex].entities.push(...newCfg.entities);
  } else {
    configurations.push(newCfg);
  }

  return configurations;
};

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(cfgs);
  } else if (req.method === "POST") {
    const newCfg = req.body;
    addOrUpdateConfiguration(cfgs, newCfg);
    res.status(201).json(newCfg);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
