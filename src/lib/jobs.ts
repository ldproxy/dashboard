import { Job, fromDev } from "@/dev-data/jobs";

export const fetchedJobs =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export const expandJobs = (jobs: Job[] = []): Job[] => {
  const allJobs = [...jobs];

  for (const followUp of jobs.flatMap(expandJob)) {
    if (!allJobs.some((job) => job.id === followUp.id)) {
      allJobs.push(followUp);
    }
  }

  return allJobs;
};

export const expandJob = (job: Job): Job[] => {
  if (job.followUps.length > 0) {
    return [job, ...job.followUps.flatMap(expandJob)];
  }

  return [job];
};
