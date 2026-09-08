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
