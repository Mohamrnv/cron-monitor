import mongoose, { Schema } from "mongoose";
import { Job } from "../types/job.js";
export enum JobStatus {
  HEALTHY = 'healthy',
  LATE = 'late',
  DOWN = 'down',
  PAUSED = 'paused'
}
const jobSchema = new Schema<Job>({
  name: { type: String, required: true },
  pingToken: { type: String, required: true, unique: true },
  expectedIntervalSeconds: { type: Number, required: true },
  gracePeriodSeconds: { type: Number, default: 300 },
  status: { type: String, enum: Object.values(JobStatus), default: JobStatus.HEALTHY, index: true },
  lastPingAt: { type: Date, default: null, index: true },
  lastStartedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
