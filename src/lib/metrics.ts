import { fromDev } from "@/dev-data/cfg";

export const fetchedMetrics =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();
