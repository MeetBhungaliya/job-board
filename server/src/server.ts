import app from "./app";
import { connectMongo } from "./config/db";
import { env } from "./config/env";
import { registerJobImportScheduler } from "./scheduler/jobImport.scheduler";
import { logger } from "./utils/logger";

(async () => {
  try {
    await connectMongo();

    registerJobImportScheduler();

    app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
})();
