import { Entities } from "@/app/api/entities/route";
import { MultiResponse, SingleResponse } from "@/app/api/util";

const entities: Entities = {
  providers: [
    {
      id: "bergbau",
      status: "AVAILABLE",
      subType: "feature/wfs",
    },
    {
      id: "krankenhaus",
      status: "AVAILABLE",
      subType: "feature/sql",
    },
    {
      id: "krankenhaus-tiles",
      status: "LIMITED",
      subType: "tile/mbtiles",
    },
    {
      id: "cologne-lod2-3dtiles",
      status: "AVAILABLE",
      subType: "3dtile/features",
    },
  ],
  services: [
    {
      id: "bergbau",
      status: "LIMITED",
      subType: "ogc_api",
    },
    {
      id: "krankenhaus",
      status: "UNAVAILABLE",
      subType: "ogc_api",
    },
    {
      id: "testi",
      status: "UNAVAILABLE",
      subType: "ogc_api",
    },
  ],
};

export const fromDev = (
  wrap: boolean,
  apiUrls?: string[]
): Entities | SingleResponse<Entities> | MultiResponse<Entities> => {
  if (wrap && apiUrls) {
    return apiUrls.map((url) => ({
      url,
      response: entities,
    }));
  }

  return entities;
};
