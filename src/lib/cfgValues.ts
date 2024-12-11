import {
  fromDevCodelists_foo,
  fromDevTilematrixsets_bar,
} from "../dev-data/cfgValues";

export const fetchedCodelists_foo =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDevCodelists_foo();

export const fetchedTilematrixsets_bar =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDevTilematrixsets_bar();
