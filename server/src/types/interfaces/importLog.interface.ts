export interface FailedJobInfo {
  jobUrl?: string;
  reason: string;
}

export interface ImportLog {
  _id?: string;
  feedUrl: string;
  fileName: string;
  startedAt: Date;
  finishedAt?: Date;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: FailedJobInfo[];
}
