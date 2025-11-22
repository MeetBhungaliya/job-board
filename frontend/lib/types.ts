export interface FailedJobInfo {
  jobUrl?: string;
  reason: string;
}

export interface ImportLog {
  _id: string;
  feedUrl: string;
  fileName: string;
  startedAt: string;
  finishedAt?: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: FailedJobInfo[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

// NEW TYPES
export interface JobsBySource {
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
