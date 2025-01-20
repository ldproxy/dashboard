import { Deployment } from "@/lib/deployments";

export const fromDev = (): Deployment[] => {
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

export const deployments = [
  {
    name: "ldproxy 7080",
    apiUrl: "http://localhost:7081/api",
    url: "http://localhost:7081/deployment",
    id: "1",
  },
  /*
  {
    name: "ldproxy 8080",
    apiUrl: "http://localhost:8081/api",
    url: "http://localhost:8081/deployment",
    id: "2",
  },
*/
  {
    name: "ldproxy 3000",
    apiUrl: "http://localhost:3000/api",
    url: "http://localhost:3000/deployment",
    id: "3",
  },
];
