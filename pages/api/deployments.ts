// import { deployments } from "../../src/data/deployments";
import { deployments } from "../../src/lib/deployments";

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
