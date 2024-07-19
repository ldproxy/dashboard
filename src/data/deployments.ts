export interface Deployment {
  name: string;
  apiUrl: string;
  url: string;
  id: string;
}

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
