import { Request, Response } from 'express';
import { jobRepository } from '../repositories/jobRepository.mongoose.js';
import { v4 as uuidv4 } from 'uuid';
import { PingModel } from '../models/Ping.model.js';
import { logger } from '../config/logger.js';
import { CreateJobDto } from '../types/job.dto.js';

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
    }
};
