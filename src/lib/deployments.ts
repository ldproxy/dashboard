type Deployment = {
  id: string;
  name: string;
  apiUrl: string[];
};

const fromDev = (): Deployment[] => {
  return [
    {
      id: "3",
      name: "ldproxy 3000",
      apiUrl: [
        "http://localhost:3000/api",
        "http://localhost:7081/api",
        "http://localhost:3000/api",
      ],
    },

    {
      id: "1",
      name: "ldproxy 7080",
      apiUrl: ["http://localhost:7081/api"],
    },

    {
      id: "2",
      name: "Offline",
      apiUrl: ["http://localhost:7082/api"],
    },
    {
      id: "5",
      name: "Healthy",
      apiUrl: ["http://localhost:3000/api"],
    },
    {
      id: "6",
      name: "Limited",
      apiUrl: ["http://localhost:3000/api", "http://localhost:7082/api"],
    },
  ];
};

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
