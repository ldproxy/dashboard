export type Deployment = {
  id: string;
  name: string;
  apiUrl: string[];
  url?: string;
  cfg?: string;
};

export const fromEnv = (): Deployment[] => {
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

export const getMatchingDeployment = async (
  data: Deployment[],
  setDeploymentId: (did: string) => void,
  setMatchingDelpoyment: (deployment: Deployment) => void
) => {
  const currentUrl = new URL(window.location.href);
  const queryParams = new URLSearchParams(currentUrl.search);
  const did = queryParams.get("did");
  const baseUrl = currentUrl.origin;
  const apiUrl = `${baseUrl}/api`;
  let deployment: Deployment | {} = {};
  if (did) {
    setDeploymentId(did);
    deployment = data.find((d) => d.id === did) || {};
  } else {
    deployment =
      data.find((deployment: Deployment) =>
        deployment.apiUrl.includes(apiUrl)
      ) || {};
  }
  if ("name" in deployment && Object.keys(deployment).length > 0) {
    setMatchingDelpoyment(deployment);
  }
};

export const getDeploymentId = async (
  setDeploymentId: (did: string) => void
) => {
  const currentUrl = new URL(window.location.href);
  const queryParams = new URLSearchParams(currentUrl.search);
  const did = queryParams.get("did");
  if (did) {
    setDeploymentId(did);
  }
};
