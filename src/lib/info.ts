import { fromDev } from "@/dev-data/info";

export const fetchedInfo =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();
