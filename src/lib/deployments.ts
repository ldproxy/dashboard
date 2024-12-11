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

export const getDeployments = async () => {
  try {
    const response = await fetch("/api/deployments");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postDeployment = async (deployment: Deployment) => {
  try {
    const response = await fetch("/api/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deployment),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
