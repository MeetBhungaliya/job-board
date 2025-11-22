import cron from "node-cron";
import { env } from "../config/env";
import { JobImportService } from "../services/jobImport.service";
import { logger } from "../utils/logger";

export function registerJobImportScheduler(): void {
  cron.schedule(env.jobFetchCron!, async () => {
    logger.info("[Scheduler] Starting scheduled job import for all feeds");
    await JobImportService.runForAllFeeds();
  });
}
