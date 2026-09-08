export type JobStatus = 'healthy' | 'late' | 'down' | 'paused';

export interface Job {
  _id: string;
  name: string;
  pingToken: string;
  expectedIntervalSeconds: number;
  gracePeriodSeconds: number;
  status: JobStatus;
  lastPingAt: string | null;
  nextExpectedPingAt: string | null;
  lastStartedAt: string | null;
  lastAlertSentAt: string | null;
  alertEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ping {
  _id: string;
  jobId: string;
  sourceIp: string;
  receivedAt: string;
  type?: 'success' | 'start' | 'fail';
}

export interface CreateJobDto {
  name: string;
  expectedIntervalSeconds: number;
  gracePeriodSeconds?: number;
  alertEmail?: string;
}

export interface UpdateJobDto {
  name?: string;
  expectedIntervalSeconds?: number;
  gracePeriodSeconds?: number;
  alertEmail?: string;
}
