interface TileSetProgress {
  percent?: number;
  current: number;
  done: boolean;
  parameters?: {
    clipBoundingBox?: {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
      epsgCrs?: {
        code: number;
        forceAxisOrder?: string;
      };
    };
    substitutions?: {
      apiUri: string;
      serviceUrl: string;
    };
  };
  total: number;
  WebMercatorQuad?: { [level: number]: number };
  levels?: { [tms: string]: number[] };
  [key: string]: any;
}

export interface TileSets {
  [key: string]: {
    progress?: TileSetProgress;
    parameters?: any;
  };
}

interface JobDetails {
  tileProvider: string;
  tileSets: TileSets;
  reseed: boolean;
}

export interface Job {
  id: string;
  finishedAt: number;
  type: string;
  entity: string;
  label: string;
  description?: string;
  details: JobDetails;
  percent: number;
  startedAt: number;
  updatedAt: number;
  current: number;
  total: number;
  followUps: Job[];
  errors: string[];
  setup?: any;
  cleanup?: any;
  done: boolean;
}
export interface JobSets {
  sets: Job[];
}

export interface JobsWithUrl {
  sets: Job[];
  url: string | undefined;
}

export const normalizeJobs = (input: { url: string; response: JobSets }[]) => {
  return input.map(({ url, response }) => {
    return expandJobs(response.sets, url);
  });
};

const expandJobs = (jobs: Job[] = [], url?: string): JobsWithUrl => {
  const allJobs = [...jobs];

  for (const followUp of jobs.flatMap(expandJob)) {
    if (!allJobs.some((job) => job.id === followUp.id)) {
      allJobs.push(followUp);
    }
  }

  return { sets: allJobs, url };
};

const expandJob = (job: Job): Job[] => {
  if (job.followUps.length > 0) {
    return [job, ...job.followUps.flatMap(expandJob)];
  }

  return [job];
};
