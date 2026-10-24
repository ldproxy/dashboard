import { MultiResponse, SingleResponse } from "@/app/api/util";
import { JobSets, PartialJob } from "@/lib/jobs";

const partialJob = (id: string, kind: string, partOf: string): PartialJob => ({
  id,
  kind,
  createdAt: 1738323460000,
  startedAt: 0,
  updatedAt: 0,
  finishedAt: 0,
  priority: 0,
  progress: { current: 0, total: 0, percent: 0, details: {} },
  status: "SUCCESSFUL",
  errors: [],
  context: { entity: "testOpenApi" },
  partOf,
  executor: "",
  onHold: false,
  progressUpdates: 0,
});

export const jobSets: JobSets = {
  sets: [
    {
      id: "c88b1ac0-dfc7-11ef-917f-d2a0be19b136",
      kind: "tile-seeding",
      createdAt: 1738323460000,
      startedAt: 1738323463000,
      updatedAt: 1738323566000,
      finishedAt: 0,
      priority: 0,
      progress: {
        current: 33000,
        total: 68405,
        percent: 48,
        details: {
          netzknoten: {
            total: 17234,
            current: 10000,
            percent: 73,
            levels: {
              WebMercatorQuad: [
                -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 2279, 9116, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1,
              ],
              AdV_25832: [
                -1, -1, -1, -1, 0, 0, 0, 0, 3696, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1,
              ],
            },
          },
        },
      },
      status: "RUNNING",
      errors: [],
      context: { entity: "testOpenApi" },
      label: "Tile cache seeding",
      description: " (Tilesets: [netzknoten])",
      inputs: { tileProvider: "strassen-tiles", reseed: false },
      outputs: {},
      setup: partialJob(
        "c88b1ac1-dfc7-11ef-917f-d2a0be19b136",
        "tile-seeding:setup",
        "c88b1ac0-dfc7-11ef-917f-d2a0be19b136"
      ),
      cleanup: partialJob(
        "c88b1ac2-dfc7-11ef-917f-d2a0be19b136",
        "tile-seeding:cleanup",
        "c88b1ac0-dfc7-11ef-917f-d2a0be19b136"
      ),
      followUps: [],
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
