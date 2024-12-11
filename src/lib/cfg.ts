import { fromDev } from "../dev-data/cfg";

export const cfgs =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? []
    : fromDev();

export const addConfiguration = (
  configurations: any,
  newCfg: { name: string; url: string }
): any => {
  configurations.push({
    name: newCfg.name,
    url: newCfg.url,
  });

  return configurations;
};

export const deleteConfiguration = (
  configurations: typeof cfgs,
  name: string
): typeof cfgs => {
  const configIndex = configurations.findIndex((cfg) => cfg.name === name);
  if (configIndex !== -1) {
    configurations.splice(configIndex, 1);
  }
  return configurations;
};

export const updateConfiguration = (
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
