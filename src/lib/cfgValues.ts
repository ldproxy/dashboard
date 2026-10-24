import {
  fromDevCodelists_foo,
  fromDevTilematrixsets_bar,
} from "../dev-data/cfgValues";
import { IS_PROD } from "./env";

const API_URL2 = "/api";

export const fetchedCodelists_foo =
  process.env.DEPLOYMENTS || IS_PROD ? {} : fromDevCodelists_foo();

export const fetchedTilematrixsets_bar =
  process.env.DEPLOYMENTS || IS_PROD ? {} : fromDevTilematrixsets_bar();

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
