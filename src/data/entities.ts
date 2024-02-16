export interface InputEntity {
  id: string;
  status: string;
}

export interface Entity {
  id: string;
  uid: string;
  type: string;
  status: string;
}

export const fetchedEntities: { [key: string]: InputEntity[] } = {
  providers: [
    {
      id: "bergbau",
      status: "ACTIVE",
    },
    {
      id: "krankenhaus",
      status: "ACTIVE",
    },
  ],
  services: [
    {
      id: "bergbau",
      status: "ACTIVE",
    },
    {
      id: "krankenhaus",
      status: "ACTIVE",
    },
  ],
};
