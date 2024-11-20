// import { cfgs } from "../../src/data/cfgs";

export const cfgs = [
  {
    name: "demo",
    url: "https://github.com/ldproxy/dashboard",
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
    url: "https://github.com/ldproxy/dashboard2",
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
    ],
  },
];

const addConfiguration = (
  configurations: any,
  newCfg: { name: string; url: string }
): any => {
  configurations.push({
    name: newCfg.name,
    url: newCfg.url,
  });

  return configurations;
};

const deleteConfiguration = (
  configurations: typeof cfgs,
  name: string
): typeof cfgs => {
  const configIndex = configurations.findIndex((cfg) => cfg.name === name);
  if (configIndex !== -1) {
    configurations.splice(configIndex, 1);
  }
  return configurations;
};

const updateConfiguration = (
  configurations: typeof cfgs,
  oldName: string,
  newName: string,
  oldUrl: string,
  newUrl: string
): typeof cfgs => {
  const configIndex = configurations.findIndex(
    (cfg) => cfg.name === oldName && cfg.url === oldUrl
  );
  if (configIndex !== -1) {
    configurations[configIndex].name = newName;
    configurations[configIndex].url = newUrl;
  }
  return configurations;
};

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(cfgs);
  } else if (req.method === "POST") {
    const newCfg = req.body;
    addConfiguration(cfgs, newCfg);
    res.status(201).json(newCfg);
  } else if (req.method === "PUT") {
    const { oldName, newName, oldUrl, newUrl } = req.body;
    updateConfiguration(cfgs, oldName, newName, oldUrl, newUrl);
    res.status(200).json({ message: "Configuration updated" });
  } else if (req.method === "DELETE") {
    const { name } = req.body;
    deleteConfiguration(cfgs, name);
    res.status(200).json({ message: "Configuration deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
