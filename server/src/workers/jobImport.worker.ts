import "dotenv/config";
import { Worker } from "bullmq";
import mongoose from "mongoose";
import { JOB_IMPORT_QUEUE_NAME } from "../config/bullmq";
import { env } from "../config/env";
import { JobImportJobData } from "../queues/jobImport.queue";
import { JobModel } from "../models/job.model";
import { ImportLogModel } from "../models/importLog.model";
import { logger } from "../utils/logger";
import { broadcastSSE } from "../events/sse";

(async () => {
  await mongoose.connect(env.mongoUri!);
  logger.info("[Worker] Mongo connected");

  const worker = new Worker<JobImportJobData>(
    JOB_IMPORT_QUEUE_NAME,
    async (job) => {
      const { job: jobPayload, importLogId } = job.data;

      try {
        const now = new Date();

        const updateResult = await JobModel.updateOne(
          { jobUrl: jobPayload.jobUrl },
          {
            $set: {
              ...jobPayload
            },
            $setOnInsert: {
              createdAt: now
            }
          },
          { upsert: true }
        );

        // Safely detect if this was an insert or an update
        const raw = updateResult as any;
        const upsertedCount =
          raw.upsertedCount ??
          (Array.isArray(raw.upserted) ? raw.upserted.length : 0) ??
          0;

        const isNew = upsertedCount > 0;

        const inc: Record<string, number> = {
          totalImported: 1
        };

        if (isNew) {
          inc.newJobs = 1;
        } else {
          inc.updatedJobs = 1;
        }

        await ImportLogModel.updateOne(
          { _id: importLogId },
          {
            $inc: inc
          }
        );

        broadcastSSE("imports-updated", {
          reason: "job-processed",
          importLogId
        });

        return;
      } catch (err: any) {
        logger.error("[Worker] Job failed", err?.message || err);

        await ImportLogModel.updateOne(
          { _id: job.data.importLogId },
          {
            $push: {
              failedJobs: {
                jobUrl: job.data.job.jobUrl,
                reason: err?.message || "Unknown error"
              }
            }
          }
        );

        broadcastSSE("imports-updated", {
          reason: "job-failed",
          importLogId: job.data.importLogId
        });

        throw err;
      }
    },
    {
      connection: { url: env.redisUrl },
      concurrency: env.workerConcurrency
    }
  );

  worker.on("completed", (job) =>
    logger.info(`[Worker] Completed job ${job.id}`)
  );
  worker.on("failed", (job, err) =>
    logger.error(`[Worker] Failed job ${job?.id}`, err)
  );
})();
