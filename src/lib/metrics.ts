import { fromDev } from "@/dev-data/metrics";

export const fetchedMetrics =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();
