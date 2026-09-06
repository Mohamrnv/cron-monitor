import { IJobRepository } from "./jobRepository.interface.js";
import { Job } from "../types/job.js";
import JobModel, { JobStatus } from "../models/Job.model.js";
class JobRepositoryMongoose implements IJobRepository {
    async findOverdueJobs(): Promise<Job[]> {
        const now = new Date();
        
        // High-performance MongoDB query using $expr
        // Calculates (lastPingAt + (expectedInterval + gracePeriod) * 1000) < now directly in the database
        return JobModel.find({
            status: JobStatus.HEALTHY,
            lastPingAt: { $ne: null },
            $expr: {
                $lt: [
                    {
                        $add: [
                            "$lastPingAt",
                            {
                                $multiply: [
                                    { $add: ["$expectedIntervalSeconds", { $ifNull: ["$gracePeriodSeconds", 0] }] },
                                    1000
                                ]
                            }
                        ]
                    },
                    now
                ]
            }
        }).lean().exec();
    }
    async createJob(data: Partial<Job>): Promise<Job> {
        return JobModel.create(data);
    }
    async findByToken(token: string): Promise<Job | null> {
        return JobModel.findOne({ pingToken: token }).lean().exec();
    }
    async update(jobId: string, data: Partial<Job>): Promise<Job | null> {
        return JobModel.findByIdAndUpdate(jobId, data, { new: true }).lean().exec();
    }
    async findAll(): Promise<Job[]> {
        return JobModel.find().lean().exec();
    }
    async findById(id: string): Promise<Job | null> {
        return JobModel.findById(id).lean().exec();
    }
    async markAsDown(jobId: string): Promise<Job | null> {
        return this.update(jobId, { status: JobStatus.DOWN });
    }
}
export const jobRepository = new JobRepositoryMongoose();