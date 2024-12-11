import { fromDev } from "../dev-data/cfg";

const API_URL2 = "/api";

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

export const postCfg = async (cfg: any) => {
  try {
    const response = await fetch("/api/cfg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cfg),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateCfg = async (
  oldName: string,
  newName: string,
  oldUrl: string,
  newUrl: string
) => {
  try {
    const response = await fetch("/api/cfg", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldName, newName, oldUrl, newUrl }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteConfig = async (name: string) => {
  try {
    const response = await fetch("/api/cfg", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCfg = async (param: string) => {
  try {
    const formattedParam = param.replace(/_/g, "/");

    const response = await fetch(`${API_URL2}/cfg/entities/${formattedParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getDeploymentCfg = async () => {
  try {
    const response = await fetch(API_URL2 + "/cfg/global/deployment");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCfgs = async () => {
  try {
    const response = await fetch(API_URL2 + "/cfg");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
