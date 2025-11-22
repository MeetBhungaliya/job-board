import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY),
  jobFetchCron: process.env.JOB_FETCH_CRON,
  jobFetchBatchSize: Number(process.env.JOB_FETCH_BATCH_SIZE),
};
