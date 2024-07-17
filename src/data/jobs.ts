export const Jobs = [
  {
    id: "e40d98bd-4283-11ef-a432-bcd0744ffbd9",
    type: "tile-seeding",
    details: {
      tileProvider: "lika-tiles",
      tileSets: {
        verwaltungseinheitasdfghjkljhuhuhuhhuhuhuh: {
          progress: { total: 5, WebMercatorQuad: { 5: 45, 6: 100, 7: 77 } },
        },
        gebaeude_bauwerk: {
          progress: { total: 100, WebMercatorQuad: { 5: 100, 6: 100, 7: 100 } },
        },
        flurstueck: {
          progress: { total: 5, WebMercatorQuad: { 5: 45, 6: 55, 7: 77 } },
        },
        flurstueck_punkt: {},
        nutzung: {},
        katasterbezirk: {},
        verwalteungseinheit: {},
        gebaeudde_bauwerk: {},
        flursetueck: {},
        flurdstueck_punkt: {},
        nutzeung: {},
        kataasterbezirk: {},
        verwyaltungseinheit: {},
        gebaveude_bauwerk: {},
        flursrtueck: {},
        flursctueck_punkt: {},
        nutzgng: {},
        kataseterbezirk: {},
      },
      reseed: false,
    },
    followUps: [],
    errors: [],
    startedAt: 1721031971,
    updatedAt: 1721031999,
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
        wed_o: {
          progress: { total: 100, WebMercatorQuad: { 5: 100, 6: 100, 7: 100 } },
        },
        wed_i: {},
        wed_a: {},
      },
      reseed: false,
    },
    followUps: [],
    errors: [],
    startedAt: 1721031970,
    updatedAt: 99,
    total: 38,
    current: 16,
    label: "Tile cache seeding",
    description:
      " (Tilesets: [verwaltungseinheit, gebaeude_bauwerk, flurstueck, flurstueck_punkt, nutzung, katasterbezirk])",
    entity: "lika-tiles",
    setup: {},
    cleanup: {},
    done: false,
    percent: 100,
  },
  {
    id: "e40d98bd-4283-11ef-a432-bcd0744ffbd9",
    type: "tile-seeding",
    details: {
      tileProvider: "lika-tiles",
      tileSets: {
        wed_o: {
          progress: { total: 50, WebMercatorQuad: { 5: 45, 6: 55, 7: 77 } },
        },
      },
      reseed: false,
    },
    followUps: [],
    errors: [],
    startedAt: -1,
    updatedAt: -1,
    total: 38,
    current: 16,
    label: "Tile cache seeding",
    description:
      " (Tilesets: [verwaltungseinheit, gebaeude_bauwerk, flurstueck, flurstueck_punkt, nutzung, katasterbezirk])",
    entity: "lika-tiles",
    setup: {},
    cleanup: {},
    done: false,
    percent: 99,
  },
  {
    id: "e40d98bd-4283-11ef-a432-bcd0744ffbd9",
    type: "tile-seeding",
    details: {
      tileProvider: "lika-tiles",
      tileSets: {
        wed_o: {
          progress: { total: 45, WebMercatorQuad: { 5: 45, 6: 55, 7: 77 } },
        },
        test: {},
      },
      reseed: false,
    },
    followUps: [],
    errors: [],
    startedAt: 1721031999,
    updatedAt: -1,
    total: 38,
    current: 16,
    label: "Tile cache seeding",
    description:
      " (Tilesets: [verwaltungseinheit, gebaeude_bauwerk, flurstueck, flurstueck_punkt, nutzung, katasterbezirk])",
    entity: "lika-tiles",
    setup: {},
    cleanup: {},
    done: false,
    percent: 99,
  },
];

interface TileSetProgress {
  total: number;
  WebMercatorQuad?: { [level: number]: number };
}

export interface TileSets {
  [key: string]: {
    progress?: TileSetProgress;
  };
}

interface JobDetails {
  tileProvider: string;
  tileSets: TileSets;
  reseed: boolean;
}

export interface Job {
  id: string;
  entity: string;
  label: string;
  details: JobDetails;
  percent: number;
  startedAt: number;
  updatedAt: number;
}
