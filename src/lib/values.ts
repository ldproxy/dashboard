import { fromDev } from "@/dev-data/cfg";

export const fetchedValues =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();
