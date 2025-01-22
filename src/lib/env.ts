import { DevCfg } from "@/dev-data/constants";

export const IS_DEV = process.env.NODE_ENV === "development";
export const IS_PROD = !IS_DEV;

// all features are enabled
export const IS_MODE_SAAS =
  process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS === "saas";

// multiple deployments are enabled
export const IS_MODE_MULTI =
  IS_MODE_SAAS || process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS === "multi";

// only single deployment is enabled
export const IS_MODE_SINGLE = !IS_MODE_MULTI && !IS_MODE_SAAS;

if (DevCfg) {
  console.log("IS_DEV", IS_DEV);
  console.log("IS_MODE_SAAS", IS_MODE_SAAS);
  console.log("IS_MODE_MULTI", IS_MODE_MULTI);
  console.log("IS_MODE_SINGLE", IS_MODE_SINGLE);
}

export const USE_DEV_DEPLOYMENTS = IS_DEV && !process.env.DEPLOYMENTS;

export const USE_DEV_DATA = IS_DEV && process.env.USE_DEV_DATA;
