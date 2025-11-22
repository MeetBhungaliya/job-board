import { Schema, model, Document } from "mongoose";
import { Job } from "../types/interfaces/job.interface";

export interface JobDocument extends Job, Document {
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<JobDocument>(
  {
    jobUrl: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
    category: { type: String },
    postedDate: { type: Date },
    description: { type: String },
    source: { type: String }
  },
  { timestamps: true }
);

JobSchema.index({ jobUrl: 1 }, { unique: true });

export const JobModel = model<JobDocument>("Job", JobSchema);
