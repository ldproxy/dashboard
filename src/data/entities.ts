export interface InputEntity {
  id: string;
  status: string;
  subType: string;
}

export interface Entity {
  id: string;
  uid: string;
  type: string;
  status: string;
  subType: string;
}

export const fetchedEntities: { [key: string]: InputEntity[] } = {
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
      id: "test",
      status: "UNAVAILABLE",
      subType: "ogc_api",
    },
  ],
};
