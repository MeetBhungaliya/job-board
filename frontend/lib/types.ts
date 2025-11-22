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
