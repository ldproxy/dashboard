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

const addConfiguration = (
  configurations: any,
  newCfg: { name: string; url: string }
): any => {
  configurations.push({
    name: newCfg.name,
    entities: [
      {
        url: newCfg.url,
      },
    ],
  });

  return configurations;
};

const deleteConfiguration = (
  configurations: typeof cfgs,
  name: string,
  title?: string
): typeof cfgs => {
  const configIndex = configurations.findIndex((cfg) => cfg.name === name);
  if (configIndex !== -1) {
    if (title) {
      const entityIndex = configurations[configIndex].entities.findIndex(
        (entity) => entity.title === title
      );
      if (entityIndex !== -1) {
        configurations[configIndex].entities.splice(entityIndex, 1);
        // Wenn keine Entities mehr vorhanden sind, entfernen Sie die gesamte Konfiguration
        if (configurations[configIndex].entities.length === 0) {
          configurations.splice(configIndex, 1);
        }
      }
    } else {
      // Entfernen Sie die gesamte Konfiguration, wenn kein title angegeben ist
      configurations.splice(configIndex, 1);
    }
  }
  return configurations;
};

const updateConfiguration = (
  configurations: typeof cfgs,
  oldName: string,
  newName: string,
  oldTitle: string,
  newTitle: string
): typeof cfgs => {
  const configIndex = configurations.findIndex((cfg) => cfg.name === oldName);
  if (configIndex !== -1) {
    const entityIndex = configurations[configIndex].entities.findIndex(
      (entity) => entity.url === oldTitle
    );
    if (entityIndex !== -1) {
      configurations[configIndex].name = newName;
      configurations[configIndex].entities[entityIndex].url = newTitle;
    }
    configurations[configIndex].name = newName;
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
    const { oldName, newName, oldTitle, newTitle } = req.body;
    updateConfiguration(cfgs, oldName, newName, oldTitle, newTitle);
    res.status(200).json({ message: "Configuration updated" });
  } else if (req.method === "DELETE") {
    const { name, title } = req.body;
    deleteConfiguration(cfgs, name, title);
    res.status(200).json({ message: "Configuration deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
