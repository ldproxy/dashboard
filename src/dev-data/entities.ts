import { Entities } from "@/app/api/entities/route";
import { SingleResponse } from "@/app/api/util";
import { InputEntity } from "@/lib/entities";

export const fromDev = (wrap: boolean): Entities | SingleResponse<Entities> => {
  const entities: Entities = {
    providers: [
      {
        id: "bergbau",
        status: "AVAILABLE",
        subType: "features/wfs",
      },
      {
        id: "krankenhaus",
        status: "AVAILABLE",
        subType: "features/sql",
      },
      {
        id: "krankenhaus-tiles",
        status: "LIMITED",
        subType: "tiles/mbtiles",
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

  if (wrap) {
    return {
      response: entities,
    };
  }

  return entities;
};
