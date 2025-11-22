import "dotenv/config";
import { Worker } from "bullmq";
import mongoose from "mongoose";
import { JOB_IMPORT_QUEUE_NAME } from "../config/bullmq";
import { env } from "../config/env";
import { JobImportJobData } from "../queues/jobImport.queue";
import { JobModel } from "../models/job.model";
import { ImportLogModel } from "../models/importLog.model";
import { logger } from "../utils/logger";

(async () => {
  await mongoose.connect(env.mongoUri);
  logger.info("[Worker] Mongo connected");

  const worker = new Worker<JobImportJobData>(
    JOB_IMPORT_QUEUE_NAME,
    async (job) => {
      const { job: jobPayload, importLogId } = job.data;

      try {
        const now = new Date();

        const result = await JobModel.findOneAndUpdate(
          { jobUrl: jobPayload.jobUrl },
          {
            $set: {
              ...jobPayload,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
          { upsert: true, new: true, rawResult: true }
        );

        const updatedExisting =
          result.lastErrorObject && result.lastErrorObject.updatedExisting;
        const isNew = !updatedExisting;

        const inc: Record<string, number> = {
          totalImported: 1,
        };

        if (isNew) {
          inc.newJobs = 1;
        } else {
          inc.updatedJobs = 1;
        }

        await ImportLogModel.updateOne(
          { _id: importLogId },
          {
            $inc: inc,
          }
        );

        return;
      } catch (err: any) {
        logger.error("[Worker] Job failed", err?.message || err);

        await ImportLogModel.updateOne(
          { _id: job.data.importLogId },
          {
            $push: {
              failedJobs: {
                jobUrl: job.data.job.jobUrl,
                reason: err?.message || "Unknown error",
              },
            },
          }
        );

        throw err;
      }
    },
    {
      connection: { url: env.redisUrl },
      concurrency: env.workerConcurrency,
    }
  );

  worker.on("completed", (job) =>
    logger.info(`[Worker] Completed job ${job.id}`)
  );
  worker.on("failed", (job, err) =>
    logger.error(`[Worker] Failed job ${job?.id}`, err)
  );
})();
