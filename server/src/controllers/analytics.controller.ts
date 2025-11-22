import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AnalyticsService } from "../services/analytics.service";
import { ApiSuccess } from "../utils/ApiSuccess";

export const getAnalyticsSummary = asyncHandler(
  async (_req: Request, res: Response) => {
    const summary = await AnalyticsService.getSummary();
    res.status(200).json(new ApiSuccess(summary));
  }
);
