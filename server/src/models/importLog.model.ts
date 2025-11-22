import { Schema, model, Document, Types } from "mongoose";
import {
  ImportLog,
  FailedJobInfo
} from "../types/interfaces/importLog.interface";

export type ImportLogDocument = Document<Types.ObjectId> & Omit<ImportLog, "_id">;

const FailedJobSchema = new Schema<FailedJobInfo>(
  {
    jobUrl: { type: String },
    reason: { type: String, required: true }
  },
  { _id: false }
);

const ImportLogSchema = new Schema<ImportLogDocument>({
  feedUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date },
  totalFetched: { type: Number, required: true, default: 0 },
  totalImported: { type: Number, required: true, default: 0 },
  newJobs: { type: Number, required: true, default: 0 },
  updatedJobs: { type: Number, required: true, default: 0 },
  failedJobs: { type: [FailedJobSchema], default: [] }
});

ImportLogSchema.index({ startedAt: -1 });

export const ImportLogModel = model<ImportLogDocument>(
  "ImportLog",
  ImportLogSchema
);
