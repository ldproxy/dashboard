interface TileSetProgress {
  percent?: number;
  total: number;
  WebMercatorQuad?: { [level: number]: number };
  levels?: { [tms: string]: number[] };
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

export const normalizeJobs = (input: JobSets) => {
  return expandJobs(input.sets);
};

const expandJobs = (jobs: Job[] = []): Job[] => {
  const allJobs = [...jobs];

  for (const followUp of jobs.flatMap(expandJob)) {
    if (!allJobs.some((job) => job.id === followUp.id)) {
      allJobs.push(followUp);
    }
  }

  return allJobs;
};

const expandJob = (job: Job): Job[] => {
  if (job.followUps.length > 0) {
    return [job, ...job.followUps.flatMap(expandJob)];
  }

  return [job];
};
