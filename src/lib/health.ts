import { fromDev } from "../dev-data/health";

export const fetchedHealthChecks =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();
