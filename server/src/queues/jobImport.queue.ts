import { jobImportQueue } from "../config/bullmq";
import { Job } from "../types/interfaces/job.interface";

export interface JobImportJobData {
  job: Job;
  importLogId: string;
}

export const enqueueJobsForFeed = async (
  jobs: Job[],
  importLogId: string
): Promise<void> => {
  const jobsData = jobs.map((job) => ({
    name: "import-job",
    data: { job, importLogId } as JobImportJobData,
    opts: {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    },
  }));

  await jobImportQueue.addBulk(jobsData);
};
