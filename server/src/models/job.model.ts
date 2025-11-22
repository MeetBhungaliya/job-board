import { Schema, model, Document, Types } from "mongoose";
import { Job } from "../types/interfaces/job.interface";

export type JobDocument = Document<Types.ObjectId> &
  Omit<Job, "_id" | "postedDate" | "createdAt" | "updatedAt"> & {
    postedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  };

const JobSchema = new Schema<JobDocument>(
  {
    jobUrl: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
    category: { type: String },
    postedDate: { type: Date },
    description: { type: String },
    source: { type: String },
  },
  {
    timestamps: true,
  }
);

JobSchema.index({ jobUrl: 1 }, { unique: true });

export const JobModel = model<JobDocument>("Job", JobSchema);
