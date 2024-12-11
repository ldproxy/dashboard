import { fromDev, Deployment } from "../dev-data/deployments";

const fromEnv = (): Deployment[] => {
  const input = process.env.DEPLOYMENTS || "[]";

  try {
    const d: { name: string; urls: string[] }[] = JSON.parse(input);
    return d.map((d, i) => {
      return {
        id: i.toString(),
        name: d.name,
        apiUrl: d.urls,
      };
    });
  } catch (e) {
    throw new Error(
      "Invalid JSON in environment variable DEPLOYMENT: " + input
    );
  }
};

export const deployments =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? fromEnv()
    : fromDev();
