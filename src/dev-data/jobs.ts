import { MultiResponse, SingleResponse } from "@/app/api/util";
import { JobSets, JobsWithUrl } from "@/lib/jobs";

const jobSets: JobSets = {
  sets: [
    {
      id: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
      type: "tile-seeding",
      followUps: [],
      errors: [],
      startedAt: 1738323463,
      updatedAt: 1738323566,
      finishedAt: -1,
      total: 68405,
      current: 33000,
      details: {
        tileProvider: "strassen-tiles",
        tileSets: {
          netzknoten: {
            progress: {
              total: 17234,
              current: 10000,
              done: false,
              percent: 73,
              levels: {
                WebMercatorQuad: [
                  -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 2279, 9116, -1,
                  -1, -1, -1, -1, -1, -1, -1, -1, -1,
                ],
                AdV_25832: [
                  -1, -1, -1, -1, 0, 0, 0, 0, 3696, -1, -1, -1, -1, -1, -1, -1,
                  -1, -1, -1, -1, -1, -1, -1, -1,
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
      percent: 48,
    },
  ],
};

export const fromDev = (
  wrap: boolean,
  apiUrls?: string[]
): JobSets | SingleResponse<JobSets> | MultiResponse<JobSets> => {
  if (wrap && apiUrls) {
    return apiUrls.map((url) => ({
      url,
      response: jobSets,
    }));
  }

  return jobSets;
};
