import { JobModel } from "../models/job.model";
import { ImportLogModel } from "../models/importLog.model";

interface JobsBySource {
  source: string;
  count: number;
}

export interface AnalyticsSummary {
  totalJobs: number;
  totalImports: number;
  totalNewJobs: number;
  totalUpdatedJobs: number;
  totalFailedJobs: number;
  lastImport?: {
    _id: string;
    feedUrl: string;
    fileName: string;
    startedAt: string;
    finishedAt?: string;
    totalFetched: number;
    totalImported: number;
    newJobs: number;
    updatedJobs: number;
    failedJobs: number;
  };
  jobsBySource: JobsBySource[];
}

export class AnalyticsService {
  static async getSummary(): Promise<AnalyticsSummary> {
    const totalJobs = await JobModel.countDocuments();

    const [totals] = await ImportLogModel.aggregate([
      {
        $group: {
          _id: null,
          totalImports: { $sum: 1 },
          totalNewJobs: { $sum: "$newJobs" },
          totalUpdatedJobs: { $sum: "$updatedJobs" },
          totalFailedJobs: {
            $sum: {
              $size: {
                $ifNull: ["$failedJobs", []],
              },
            },
          },
        },
      },
    ]);

    const lastImportDoc = await ImportLogModel.findOne({})
      .sort({ startedAt: -1 })
      .lean();

    const jobsBySourceAgg = await JobModel.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$source", "unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const jobsBySource: JobsBySource[] = jobsBySourceAgg.map((item) => ({
      source: item._id || "unknown",
      count: item.count,
    }));

    const summary: AnalyticsSummary = {
      totalJobs,
      totalImports: totals?.totalImports ?? 0,
      totalNewJobs: totals?.totalNewJobs ?? 0,
      totalUpdatedJobs: totals?.totalUpdatedJobs ?? 0,
      totalFailedJobs: totals?.totalFailedJobs ?? 0,
      jobsBySource,
    };

    if (lastImportDoc) {
      summary.lastImport = {
        _id: String(lastImportDoc._id),
        feedUrl: lastImportDoc.feedUrl,
        fileName: lastImportDoc.fileName,
        startedAt: lastImportDoc.startedAt.toISOString(),
        finishedAt: lastImportDoc.finishedAt?.toISOString(),
        totalFetched: lastImportDoc.totalFetched,
        totalImported: lastImportDoc.totalImported,
        newJobs: lastImportDoc.newJobs,
        updatedJobs: lastImportDoc.updatedJobs,
        failedJobs: lastImportDoc.failedJobs?.length ?? 0,
      };
    }

    return summary;
  }
}
