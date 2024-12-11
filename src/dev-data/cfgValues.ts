export interface InputCfg {
  id: string;
  serviceType: string;
  enabled: boolean;
  test: number;
  test2: null;
  label: string;
}

export const codelists_foo: InputCfg = {
  id: "foo",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Vineyards in Rhineland - Palatinate, Germany",
};

export const tilematrixsets_bar: InputCfg = {
  id: "bar",
  serviceType: "OGC_API",
  enabled: true,
  test: 12,
  test2: null,
  label: "Providers",
};
