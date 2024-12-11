import {
  fromDevCodelists_foo,
  fromDevTilematrixsets_bar,
} from "../dev-data/cfgValues";

const API_URL2 = "/api";

export const fetchedCodelists_foo =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDevCodelists_foo();

export const fetchedTilematrixsets_bar =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDevTilematrixsets_bar();

export const getValuesCfg = async (param: string) => {
  try {
    const formattedParam = param.replace(/_/g, "/");

    const response = await fetch(`${API_URL2}/cfg/values/${formattedParam}`);
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
