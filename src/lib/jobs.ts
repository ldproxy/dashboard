import { MultiResponse } from "@/app/api/util";

export interface TileSetProgress {
  percent?: number;
  current: number;
  total: number;
  levels?: { [tms: string]: number[] };
}

export interface TileSets {
  [key: string]: TileSetProgress;
}

export type JobStatus =
  "ACCEPTED" | "RUNNING" | "SUCCESSFUL" | "FAILED" | "DISMISSED";

export interface Progress {
  current: number;
  total: number;
  percent: number;
  details: { [key: string]: any };
}

export interface BaseJob {
  id: string;
  kind: string;
  createdAt: number;
  startedAt: number;
  updatedAt: number;
  finishedAt: number;
  priority: number;
  progress: Progress;
  status: JobStatus;
  errors: string[];
  context: { [key: string]: any };
}

export interface PartialJob extends BaseJob {
  partOf: string;
  executor: string;
  onHold: boolean;
  progressUpdates: number;
  sequence?: number;
}

export interface Job extends BaseJob {
  label: string;
  description?: string;
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
  setup?: PartialJob;
  cleanup?: PartialJob;
  followUps: Job[];
  sequence?: number;
  ttlSeconds?: number;
}
export interface JobSets {
  sets: Job[];
}

export interface JobsWithUrl {
  sets: Job[];
  url?: string;
}

export const normalizeJobs = (
  input: JobSets | MultiResponse<JobSets>
): JobsWithUrl[] => {
  if (Array.isArray(input)) {
    return input.map(({ url, response }) => {
      return expandJobs(response?.sets, url);
    });
  }

  return [expandJobs(input.sets)];
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

const statusRank: Record<JobStatus, number> = {
  RUNNING: 0,
  ACCEPTED: 1,
  FAILED: 2,
  DISMISSED: 2,
  SUCCESSFUL: 2,
};

const byActivityThenNewest = (a: Job, b: Job): number =>
  statusRank[a.status] - statusRank[b.status] ||
  (b.startedAt || b.createdAt) - (a.startedAt || a.createdAt);

export const sortJobs = (jobs: JobsWithUrl[]): JobsWithUrl[] =>
  jobs.map(({ sets, url }) => ({
    sets: [...sets].sort(byActivityThenNewest),
    url,
  }));
