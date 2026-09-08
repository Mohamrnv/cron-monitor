import { Request, Response } from 'express';
import { jobRepository } from '../repositories/jobRepository.mongoose.js';
import { v4 as uuidv4 } from 'uuid';
import { PingModel } from '../models/Ping.model.js';
import { logger } from '../config/logger.js';
import { CreateJobDto, UpdateJobDto } from '../types/job.dto.js';

interface JobParams {
    id: string;
}

export const jobsController = {
    createJob: async (req: Request<{}, {}, CreateJobDto>, res: Response) => {
        try {
            const { name, expectedIntervalSeconds, gracePeriodSeconds } = req.body

            // Basic validation
            if (!name || !expectedIntervalSeconds) {
                return res.status(400).json({ error: 'Name and expectedIntervalSeconds are required' });
            }

            const gracePeriod = gracePeriodSeconds !== undefined ? gracePeriodSeconds : 300;
            const now = new Date();
            const nextExpected = new Date(now.getTime() + (expectedIntervalSeconds + gracePeriod) * 1000);

            // Create the job via repository
            const newJob = await jobRepository.createJob({
                name,
                expectedIntervalSeconds,
                gracePeriodSeconds: gracePeriod,
                pingToken: uuidv4(),
                nextExpectedPingAt: nextExpected
            });

            return res.status(201).json(newJob);
        } catch (error) {
            logger.error(`Error creating job: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getJobs: async (req: Request, res: Response) => {
        try {
            const jobs = await jobRepository.findAll();
            return res.status(200).json(jobs);
        } catch (error) {
            logger.error(`Error fetching jobs: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getJobById: async (req: Request<JobParams>, res: Response) => {
        try {
            const { id } = req.params;
            const job = await jobRepository.findById(id);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            const pings = await PingModel.find({ jobId: id })
                .sort({ receivedAt: -1 })
                .limit(20)
                .lean()
                .exec();

            return res.status(200).json({ job, pings });
        } catch (error) {
            logger.error(`Error fetching job by ID: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteJob: async (req: Request<JobParams>, res: Response) => {
        try {
            const { id } = req.params;
            await jobRepository.update(id, {});
            // Delete from DB directly using the model
            const JobModel = (await import('../models/Job.model.js')).default;
            await JobModel.findByIdAndDelete(id);
            return res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting job: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateJob: async (req: Request<JobParams, {}, UpdateJobDto>, res: Response) => {
        try {
            const { id } = req.params;
            const { name, expectedIntervalSeconds, gracePeriodSeconds } = req.body;

            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (expectedIntervalSeconds !== undefined) updateData.expectedIntervalSeconds = expectedIntervalSeconds;
            if (gracePeriodSeconds !== undefined) updateData.gracePeriodSeconds = gracePeriodSeconds;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No fields provided for update' });
            }

            const existingJob = await jobRepository.findById(id);
            if (!existingJob) {
                return res.status(404).json({ error: 'Job not found' });
            }

            if (expectedIntervalSeconds !== undefined || gracePeriodSeconds !== undefined) {
                const interval = expectedIntervalSeconds !== undefined ? expectedIntervalSeconds : existingJob.expectedIntervalSeconds;
                const grace = gracePeriodSeconds !== undefined ? gracePeriodSeconds : (existingJob.gracePeriodSeconds || 0);
                
                const baseTime = existingJob.lastPingAt ? new Date(existingJob.lastPingAt) : new Date(existingJob.createdAt);
                const nextExpected = new Date(baseTime.getTime() + (interval + grace) * 1000);
                updateData.nextExpectedPingAt = nextExpected;
            }

            const updatedJob = await jobRepository.update(id, updateData);

            return res.status(200).json(updatedJob);
        } catch (error) {
            logger.error(`Error updating job: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};
