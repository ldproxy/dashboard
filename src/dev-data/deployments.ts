import { Deployment } from "@/lib/deployments";

export const fromDev = (): Deployment[] => {
  return [
    {
      id: "1",
      name: "Healthy",
      apiUrl: ["http://localhost:7081/api"],
    },

    {
      id: "2",
      name: "Offline",
      apiUrl: ["http://localhost:7082/api"],
    },
    {
      id: "3",
      name: "Limited",
      apiUrl: ["http://localhost:7081/api", "http://localhost:7083/api"],
    },
  ];
};
