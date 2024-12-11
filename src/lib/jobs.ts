import { Job, fromDev } from "@/dev-data/jobs";
import { getApiUrl } from "@/lib/utils";

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

export const getJobs = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await getApiUrl();
    apiUrl = apiUrls[0];
  }
  const response = await fetch(`/api/fetchJobs?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Jobs");
  }
  const data = await response.json();

  return data;
};
