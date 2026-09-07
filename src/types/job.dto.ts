export interface CreateJobDto {
  name: string;
  expectedIntervalSeconds: number;
  gracePeriodSeconds?: number;
}

export interface UpdateJobDto {
  name?: string;
  expectedIntervalSeconds?: number;
  gracePeriodSeconds?: number;
}
