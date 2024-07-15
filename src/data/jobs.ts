export const Jobs = [
  {
    id: "e40d98bd-4283-11ef-a432-bcd0744ffbd9",
    type: "tile-seeding",
    details: {
      tileProvider: "lika-tiles",
      tileSets: {
        verwaltungseinheit: {},
        gebaeude_bauwerk: {},
        flurstueck: {},
        flurstueck_punkt: {},
        nutzung: {},
        katasterbezirk: {},
      },
      reseed: false,
    },
    followUps: [],
    errors: [],
    startedAt: 1721031971,
    updatedAt: -1,
    total: 38,
    current: 16,
    label: "Tile cache seeding",
    description:
      " (Tilesets: [verwaltungseinheit, gebaeude_bauwerk, flurstueck, flurstueck_punkt, nutzung, katasterbezirk])",
    entity: "krankenhaus-tiles",
    setup: {},
    cleanup: {},
    done: false,
    percent: 42,
  },
  {
    id: "e40d98bd-4283-11ef-a432-bcd0744ffbd9",
    type: "tile-seeding",
    details: {
      tileProvider: "lika-tiles",
      tileSets: {
        verwaltungseinheit: {},
        gebaeude_bauwerk: {},
        flurstueck: {},
        flurstueck_punkt: {},
        nutzung: {},
        katasterbezirk: {},
      },
      reseed: false,
    },
    followUps: [],
    errors: [],
    startedAt: 1721031971,
    updatedAt: -1,
    total: 38,
    current: 16,
    label: "Tile cache seeding",
    description:
      " (Tilesets: [verwaltungseinheit, gebaeude_bauwerk, flurstueck, flurstueck_punkt, nutzung, katasterbezirk])",
    entity: "krankenhaus-tiles",
    setup: {},
    cleanup: {},
    done: false,
    percent: 42,
  },
];

export interface Job {
  id: string;
  entity: string;
  label: string;
  details: { [key: string]: any };
  percent: number;
}
