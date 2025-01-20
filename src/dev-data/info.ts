import { InputInfo } from "@/lib/info";

export const fromDev = (): InputInfo => {
  return {
    name: "demo.ldproxy.net",
    version: "3.6.2",
    status: "HEALTHY",
    url: "foo",
    env: "DEV",
  };
};
