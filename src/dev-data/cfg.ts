export const cfgs = [
  {
    name: "demo",
    url: "https://github.com/ldproxy/dashboard",
    entities: [
      {
        title: "vineyards",
        content: {
          id: "vineyards",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
      {
        title: "daraa",
        content: {
          id: "daraa",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
    ],
  },
  {
    name: "demo2",
    url: "https://github.com/ldproxy/dashboard2",
    entities: [
      {
        title: "vineyards2",
        content: {
          id: "vineyards",
          enabled: true,
          providerType: "FEATURE",
          providerSubType: "SQL",
        },
      },
    ],
  },
];

export interface InputCfg {
  id: string;
  serviceType: string;
  enabled: boolean;
  test: number;
  test2: null;
  label: string;
}

export const services_bergbau: InputCfg = {
  id: "vineyards",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Vineyards in Rhineland - Palatinate, Germany",
};

export const providers_bergbau: InputCfg = {
  id: "bergbau",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Providers",
};

export const providers_krankenhaus: InputCfg = {
  id: "krankenhaus",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Providers",
};

export const services_krankenhaus: InputCfg = {
  id: "krankenhaus",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Services",
};

export const appCfg: InputCfg = {
  id: "appCfg",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Services",
};
