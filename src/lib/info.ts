import { fromDev, InputInfo } from "@/dev-data/info";
import { Deployment } from "@/dev-data/deployments";
import { fetchDataFromMultipleApiUrls } from "./fetchData";

export const fetchedInfo =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export const loadInfoHomePage = async (
  deployments: Deployment[],
  setInfo: any
) => {
  try {
    if (deployments.length > 0) {
      const promises = deployments.map(async (deployment: any) => {
        const newInfo = await fetchDataFromMultipleApiUrls(
          "api/fetchInfo",
          deployment.apiUrl
        );

        if (newInfo && newInfo.length > 0) {
          return { name: deployment.name, info: newInfo as InputInfo };
        } else {
          return { name: deployment.name, info: [] as InputInfo };
        }
      });
      const results = await Promise.all(promises);
      setInfo(results);
    }
  } catch (error) {
    console.error("Error loading info:", error);
  }
};
