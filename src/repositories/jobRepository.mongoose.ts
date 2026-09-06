import { IJobRepository } from "./jobRepository.interface.js";
import { Job } from "../types/job.js";
import JobModel, { JobStatus } from "../models/Job.model.js";
class JobRepositoryMongoose implements IJobRepository {
    async findOverdueJobs(): Promise<Job[]> {
        return JobModel.find({
            status: JobStatus.LATE
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
}
export const jobRepository = new JobRepositoryMongoose();