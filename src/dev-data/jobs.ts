import { JobSets } from "@/lib/jobs";

export const fromDev = (): { url: string; response: JobSets }[] => {
  return [
    {
      url: "http://localhost:7081/api",
      response: {
        sets: [
          {
            id: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
            type: "tile-seeding",
            followUps: [],
            errors: [],
            startedAt: 1738323463,
            updatedAt: 1738323466,
            finishedAt: -1,
            total: 68405,
            current: 1,
            details: {
              tileProvider: "strassen-tiles",
              tileSets: {
                netzknoten: {
                  parameters: {
                    clipBoundingBox: {
                      xmin: 5.719475455482998,
                      ymin: 50.31135979175767,
                      xmax: 9.468298285316274,
                      ymax: 53.14973440219072,
                      epsgCrs: {
                        code: 4326,
                        forceAxisOrder: "LON_LAT",
                      },
                    },
                    substitutions: {
                      apiUri: "https://demo.ldproxy.net/strassen",
                      serviceUrl: "https://demo.ldproxy.net/strassen",
                    },
                  },
                  progress: {
                    total: 17234,
                    current: 0,
                    done: false,
                    percent: 0,
                    levels: {
                      WebMercatorQuad: [
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, 42, 154, 594, 2279,
                        9116, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                      ],
                      AdV_25832: [
                        -1, -1, -1, -1, 25, 72, 270, 986, 3696, -1, -1, -1, -1,
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                      ],
                    },
                  },
                },
              },
              reseed: false,
            },
            label: "Tile cache seeding",
            description: " (Tilesets: [netzknoten])",
            entity: "testOpenApi",
            setup: {
              id: "c88b1ac1-dfc7-11ef-917f-d2a0be19b136",
              type: "tile-seeding:setup",
              details: false,
              followUps: [],
              errors: [],
              startedAt: -1,
              updatedAt: -1,
              finishedAt: -1,
              total: 0,
              current: 0,
              partOf: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
              done: true,
              percent: 0,
            },
            cleanup: {
              id: "c88b1ac2-dfc7-11ef-917f-d2a0be19b136",
              type: "tile-seeding:setup",
              details: true,
              followUps: [],
              errors: [],
              startedAt: -1,
              updatedAt: -1,
              finishedAt: -1,
              total: 0,
              current: 0,
              partOf: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
              done: true,
              percent: 0,
            },
            done: false,
            percent: 0,
          },
        ],
      },
    },
    {
      url: "http://localhost:8081/api",
      response: {
        sets: [
          {
            id: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
            type: "tile-seeding",
            followUps: [],
            errors: [],
            startedAt: 1738323463,
            updatedAt: 1738323466,
            finishedAt: -1,
            total: 68405,
            current: 1,
            details: {
              tileProvider: "strassen-tiles",
              tileSets: {
                netzknoten: {
                  parameters: {
                    clipBoundingBox: {
                      xmin: 5.719475455482998,
                      ymin: 50.31135979175767,
                      xmax: 9.468298285316274,
                      ymax: 53.14973440219072,
                      epsgCrs: {
                        code: 4326,
                        forceAxisOrder: "LON_LAT",
                      },
                    },
                    substitutions: {
                      apiUri: "https://demo.ldproxy.net/strassen",
                      serviceUrl: "https://demo.ldproxy.net/strassen",
                    },
                  },
                  progress: {
                    total: 17234,
                    current: 0,
                    done: false,
                    percent: 0,
                    levels: {
                      WebMercatorQuad: [
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, 42, 154, 594, 2279,
                        9116, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                      ],
                      AdV_25832: [
                        -1, -1, -1, -1, 25, 72, 270, 986, 3696, -1, -1, -1, -1,
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                      ],
                    },
                  },
                },
              },
              reseed: false,
            },
            label: "Tile cache seeding",
            description: " (Tilesets: [netzknoten])",
            entity: "testOpenApi",
            setup: {
              id: "c88b1ac1-dfc7-11ef-917f-d2a0be19b136",
              type: "tile-seeding:setup",
              details: false,
              followUps: [],
              errors: [],
              startedAt: -1,
              updatedAt: -1,
              finishedAt: -1,
              total: 0,
              current: 0,
              partOf: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
              done: true,
              percent: 0,
            },
            cleanup: {
              id: "c88b1ac2-dfc7-11ef-917f-d2a0be19b136",
              type: "tile-seeding:setup",
              details: true,
              followUps: [],
              errors: [],
              startedAt: -1,
              updatedAt: -1,
              finishedAt: -1,
              total: 0,
              current: 0,
              partOf: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
              done: true,
              percent: 0,
            },
            done: false,
            percent: 0,
          },
        ],
      },
    },
  ];
};
