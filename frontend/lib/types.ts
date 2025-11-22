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
export interface Job {
  _id: string;
  jobUrl: string;
  title: string;
  company?: string;
  location?: string;
  category?: string;
  postedDate?: string;
  description?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobsListResult {
  items: Job[];
  total: number;
  page: number;
  limit: number;
}
