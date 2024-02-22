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
      status: "ACTIVE",
      subType: "features/sql",
    },
    {
      id: "krankenhaus",
      status: "ACTIVE",
      subType: "features/sql",
    },
    {
      id: "test",
      status: "INACTIVE",
      subType: "ogc_api",
    },
  ],
  services: [
    {
      id: "bergbau",
      status: "ACTIVE",
      subType: "features/sql",
    },
    {
      id: "krankenhaus",
      status: "ACTIVE",
      subType: "ogc_api",
    },
  ],
};
