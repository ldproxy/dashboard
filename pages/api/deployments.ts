// import { deployments } from "../../src/data/deployments";

export const deployments = [
  {
    name: "ldproxy 3000",
    apiUrl: "http://localhost:3000/api",
    url: "http://localhost:3000/deployment",
    id: "3",
  },
  /*
  {
    name: "ldproxy 7080",
    apiUrl: "http://localhost:7081/api",
    url: "http://localhost:7081/deployment",
    id: "1",
  },
  */
];

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(deployments);
  } else if (req.method === "POST") {
    const newDeployment = req.body;
    deployments.push(newDeployment);
    res.status(201).json(newDeployment);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
