import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { JobService } from "../services/job.service";
import { ApiSuccess } from "../utils/ApiSuccess";
import { ApiError } from "../utils/ApiError";

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "50",
    search,
    source,
    dateFrom,
    dateTo
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
  };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 50;

  const dFrom = dateFrom ? new Date(dateFrom) : undefined;
  const dTo = dateTo ? new Date(dateTo) : undefined;

  const result = await JobService.listJobs({
    search,
    source,
    dateFrom: dFrom && !isNaN(dFrom.getTime()) ? dFrom : undefined,
    dateTo: dTo && !isNaN(dTo.getTime()) ? dTo : undefined,
    page: pageNum,
    limit: limitNum
  });

  res.status(200).json(new ApiSuccess(result));
});

export const getJobById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const job = await JobService.getJobById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    res.status(200).json(new ApiSuccess(job));
  }
);
