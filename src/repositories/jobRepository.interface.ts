import { Job } from '../types/job.js'

export interface IJobRepository {
  findOverdueJobs(): Promise<Job[]>;
  createJob(data: Partial<Job>): Promise<Job>;
  findByToken(token: string): Promise<Job | null>;
  update(jobId: string, data: Partial<Job>): Promise<Job | null>;
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | null>;
  markAsDown(jobId: string): Promise<Job | null>;
}