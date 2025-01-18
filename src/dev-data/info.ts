import { SingleInputInfo } from "@/lib/info";

export const fromDev = (): SingleInputInfo => {
  return {
    name: "demo.ldproxy.net",
    version: "3.6.2",
    status: "HEALTHY",
    url: "foo",
    env: "DEV",
  };
};
