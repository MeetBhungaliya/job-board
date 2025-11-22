import { JobModel } from "../models/job.model";
import type { Job } from "../types/interfaces/job.interface";
import { toIsoString } from "../utils/helpers";

export type JobLean = Job & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface ListJobsParams {
  search?: string;
  source?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  limit: number;
}

export interface ListJobsResult {
  items: JobLean[];
  total: number;
  page: number;
  limit: number;
}

export class JobService {
  static async listJobs(params: ListJobsParams): Promise<ListJobsResult> {
    const { search, source, dateFrom, dateTo, page, limit } = params;

    const filter: Record<string, any> = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
        { category: regex },
      ];
    }

    if (source) {
      filter.source = source;
    }

    if (dateFrom || dateTo) {
      filter.postedDate = {};
      if (dateFrom) filter.postedDate.$gte = dateFrom;
      if (dateTo) filter.postedDate.$lte = dateTo;
    }

    const pageNum = Math.max(1, page);
    const limitNum = Math.min(Math.max(1, limit), 200);
    const skip = (pageNum - 1) * limitNum;

    const [docs, total] = await Promise.all([
      JobModel.find(filter)
        .sort({ postedDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
      JobModel.countDocuments(filter),
    ]);

    const items: JobLean[] = (docs as any[]).map((doc) => ({
      _id: doc._id?.toString(),
      jobUrl: doc.jobUrl,
      title: doc.title,
      company: doc.company,
      location: doc.location,
      category: doc.category,
      postedDate: doc.postedDate
        ? typeof doc.postedDate === "string"
          ? doc.postedDate
          : doc.postedDate.toISOString()
        : undefined,
      description: doc.description,
      source: doc.source,
      createdAt: doc.createdAt
        ? typeof doc.createdAt === "string"
          ? doc.createdAt
          : doc.createdAt.toISOString()
        : undefined,
      updatedAt: doc.updatedAt
        ? typeof doc.updatedAt === "string"
          ? doc.updatedAt
          : doc.updatedAt.toISOString()
        : undefined,
    }));

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  static async getJobById(id: string): Promise<JobLean | null> {
    const doc = await JobModel.findById(id).lean().exec();

    if (!doc) return null;

    const job: JobLean = {
      _id: doc._id?.toString(),
      jobUrl: doc.jobUrl,
      title: doc.title,
      company: doc.company,
      location: doc.location,
      category: doc.category,
      description: doc.description,
      source: doc.source,
      postedDate: toIsoString(doc.postedDate),
      createdAt: toIsoString(doc.createdAt),
      updatedAt: toIsoString(doc.updatedAt),
    };

    return job;
  }
}
