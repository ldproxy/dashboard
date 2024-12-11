export interface InputCfg {
  id: string;
  serviceType: string;
  enabled: boolean;
  test: number;
  test2: null;
  label: string;
}

export const fromDevCodelists_foo = (): InputCfg => {
  return {
    id: "foo",
    serviceType: "OGC_API",
    enabled: true,
    test: 12,
    test2: null,
    label: "Vineyards in Rhineland - Palatinate, Germany",
  };
};

export const fromDevTilematrixsets_bar = (): InputCfg => {
  return {
    id: "bar",
    serviceType: "OGC_API",
    enabled: true,
    test: 12,
    test2: null,
    label: "Providers",
  };
};
