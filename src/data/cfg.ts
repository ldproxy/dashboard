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
