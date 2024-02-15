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

// TODO: fetch from api route
const fetchedEntities: { [key: string]: InputEntity[] } = {
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

export const entities: Entity[] = Object.keys(fetchedEntities).flatMap((type) =>
  fetchedEntities[type].map((entity) => ({
    type,
    uid: `${type}_${entity.id}`,
    ...entity,
  }))
);
