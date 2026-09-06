import { JobStatus } from "../models/Job.model";
export interface Job {
  id: string;
  name: string;
  pingToken: string;
  expectedIntervalSeconds: number;
  gracePeriodSeconds: number;
  status: JobStatus;
  lastPingAt: Date | null;
  lastStartedAt: Date | null;
  createdAt: Date;
}
