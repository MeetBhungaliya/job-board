import { Queue } from "bullmq";
import { env } from "./env";

export const JOB_IMPORT_QUEUE_NAME = "job-import-queue";

const connection = {
  connection: {
    url: env.redisUrl
  }
};

export const jobImportQueue = new Queue(JOB_IMPORT_QUEUE_NAME, connection);
