import axios from "axios";
import { JOB_FEEDS } from "../config/feeds";
import { parseXmlToJson } from "../utils/xml";
import { Job } from "../types/interfaces/job.interface";
import { ImportLogModel } from "../models/importLog.model";
import { enqueueJobsForFeed } from "../queues/jobImport.queue";
import { logger } from "../utils/logger";
import { broadcastSSE } from "../events/sse";

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  "content:encoded"?: string;
}

function normalizeRssItem(item: RssItem, feedUrl: string): Job | null {
  const jobUrl = item.link;
  const title = item.title;

  if (!jobUrl || !title) return null;

  return {
    jobUrl,
    title,
    description: item["content:encoded"] || item.description || "",
    company: "",
    location: "",
    category: "",
    postedDate: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
    source: feedUrl,
  };
}

export class JobImportService {
  static async runForAllFeeds(): Promise<void> {
    for (const feed of JOB_FEEDS) {
      await this.runForSingleFeed(feed);
    }
  }

  static async runForSingleFeed(feedUrl: string): Promise<void> {
    logger.info(`[JobImportService] Fetching feed ${feedUrl}`);

    const importLog = await ImportLogModel.create({
      feedUrl,
      fileName: feedUrl,
      startedAt: new Date(),
      totalFetched: 0,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: [],
    });

    broadcastSSE("imports-updated", {
      reason: "import-started",
      importLogId: importLog._id,
    });

    try {
      const res = await axios.get<string>(feedUrl, {
        responseType: "text",
        timeout: 30000,
      });

      const xml = res.data;
      const json = await parseXmlToJson(xml);

      const items: RssItem[] =
        json?.rss?.channel?.item || json?.channel?.item || json?.items || [];

      const arr = Array.isArray(items) ? items : [items];
      const jobs: Job[] = [];

      for (const item of arr) {
        const job = normalizeRssItem(item, feedUrl);
        if (job) jobs.push(job);
      }

      await ImportLogModel.updateOne(
        { _id: importLog._id },
        { $set: { totalFetched: jobs.length } }
      );

      broadcastSSE("imports-updated", {
        reason: "import-fetched",
        importLogId: importLog._id,
      });

      if (!jobs.length) {
        await ImportLogModel.updateOne(
          { _id: importLog._id },
          { $set: { finishedAt: new Date() } }
        );

        broadcastSSE("imports-updated", {
          reason: "import-finished-empty",
          importLogId: importLog._id,
        });

        return;
      }

      await enqueueJobsForFeed(jobs, importLog._id.toString());
    } catch (err: any) {
      logger.error(
        `[JobImportService] Failed to fetch feed ${feedUrl}`,
        err?.message || err
      );

      await ImportLogModel.updateOne(
        { _id: importLog._id },
        {
          $set: { finishedAt: new Date() },
          $push: {
            failedJobs: {
              reason: err?.message || "Feed fetch failed",
            },
          },
        }
      );

      broadcastSSE("imports-updated", {
        reason: "import-error",
        importLogId: importLog._id,
      });
    }
  }
}
