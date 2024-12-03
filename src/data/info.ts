export interface InputInfoItem {
  name: string;
  version: string;
  url: string;
  env: string;
  status: string;
  apiUrl: string;
}

export type InputInfo = InputInfoItem[];

export const info = {
  name: "demo.ldproxy.net",
  version: "3.6.2",
  status: "HEALTHY",
  url: "foo",
  env: "DEV",
};
