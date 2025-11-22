import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { JobImportService } from "../services/jobImport.service";
import { HistoryService } from "../services/history.service";
import { ApiSuccess } from "../utils/ApiSuccess";

export const triggerManualImport = asyncHandler(
  async (req: Request, res: Response) => {
    const { feedUrl } = req.body as { feedUrl?: string };

    if (feedUrl) {
      await JobImportService.runForSingleFeed(feedUrl);
    } else {
      await JobImportService.runForAllFeeds();
    }

    res.status(202).json(new ApiSuccess(null, "Import started"));
  }
);

export const listImportLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 50;
    const skip = Number(req.query.skip) || 0;

    const logs = await HistoryService.listImportLogs(limit, skip);
    res.status(200).json(new ApiSuccess(logs));
  }
);
