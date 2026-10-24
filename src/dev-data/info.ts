import { MultiResponse, SingleResponse } from "@/app/api/util";
import { InputInfo } from "@/lib/info";

const info = {
  name: "demo.ldproxy.net",
  version: "3.6.2",
  status: "HEALTHY",
  url: "foo",
  env: "DEV",
};
export const fromDev = (
  wrap: boolean,
  apiUrls?: string[]
): InputInfo | SingleResponse<InputInfo> | MultiResponse<InputInfo> => {
  if (wrap && apiUrls) {
    return apiUrls.map((url) => ({
      url,
      response: info,
    }));
  }

  return info;
};
