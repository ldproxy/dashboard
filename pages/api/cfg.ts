import { cfgs } from "../../src/dev-data/cfg";

import {
  addConfiguration,
  deleteConfiguration,
  updateConfiguration,
} from "../../src/lib/cfg";

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json(cfgs);
  } else if (req.method === "POST") {
    const newCfg = req.body;
    addConfiguration(cfgs, newCfg);
    res.status(201).json(newCfg);
  } else if (req.method === "PUT") {
    const { oldName, newName, oldUrl, newUrl } = req.body;
    updateConfiguration(cfgs, oldName, newName, oldUrl, newUrl);
    res.status(200).json({ message: "Configuration updated" });
  } else if (req.method === "DELETE") {
    const { name } = req.body;
    deleteConfiguration(cfgs, name);
    res.status(200).json({ message: "Configuration deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
