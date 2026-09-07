import { Request, Response } from 'express';
import { jobRepository } from '../repositories/jobRepository.mongoose.js';
import { PingModel } from '../models/Ping.model.js';
import { JobStatus } from '../models/Job.model.js';
import { logger } from '../config/logger.js';
import { sendAlert } from '../services/alertService.js';

interface pingInterface {
    token:string
}
export const pingController = {
    pingSuccess: async (req: Request<pingInterface>, res: Response) => {
        try {
            const { token } = req.params;
            
            // 1. Look up job by token
            const job = await jobRepository.findByToken(token);
            if (!job) {
                return res.status(404).json({ error: 'Job not found for provided token' });
            }

            // 2. Prepare updates
            const now = new Date();
            const nextExpected = new Date(now.getTime() + (job.expectedIntervalSeconds + (job.gracePeriodSeconds || 0)) * 1000);
            
            const updates: any = {
                lastPingAt: now,
                nextExpectedPingAt: nextExpected,
            };
            
            // If it was down, recover it
            if (job.status === JobStatus.DOWN) {
                updates.status = JobStatus.HEALTHY;
                logger.info(`Job ${job.name} (ID: ${(job as any)._id}) recovered from DOWN state.`);
            }

            // 3. Update the job
            await jobRepository.update((job as any)._id.toString(), updates);

            // 4. Insert a new row in the pings table
            await PingModel.create({
                jobId: (job as any)._id,
                sourceIp: req.ip || req.socket.remoteAddress,
            });

            // 5. Respond quickly
            return res.status(200).send('OK');
        } catch (error) {
            logger.error(`Error handling ping success: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    pingFail: async (req: Request<pingInterface>, res: Response) => {
        try {
            const { token } = req.params;
            
            // 1. Look up job by token
            const job = await jobRepository.findByToken(token);
            if (!job) {
                return res.status(404).json({ error: 'Job not found for provided token' });
            }

            // 2. Prepare updates to set status to DOWN immediately
            const wasHealthy = job.status !== JobStatus.DOWN;
            const updates: any = {
                status: JobStatus.DOWN,
            };
            
            // 3. Update the job
            await jobRepository.update((job as any)._id.toString(), updates);

            logger.warn(`Job ${job.name} (ID: ${(job as any)._id}) explicitly failed via /fail ping! Status set to DOWN.`);
            
            if (wasHealthy) {
                await sendAlert(job);
            }

            // 4. Respond quickly
            return res.status(200).send('OK');
        } catch (error) {
            logger.error(`Error handling ping fail: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    pingStart: async (req: Request<pingInterface>, res: Response) => {
        try {
            const { token } = req.params;
            
            // 1. Look up job by token
            const job = await jobRepository.findByToken(token);
            if (!job) {
                return res.status(404).json({ error: 'Job not found for provided token' });
            }

            // 2. Prepare updates to set lastStartedAt
            const updates: any = {
                lastStartedAt: new Date(),
            };
            
            // 3. Update the job
            await jobRepository.update((job as any)._id.toString(), updates);

            // 4. Respond quickly
            return res.status(200).send('OK');
        } catch (error) {
            logger.error(`Error handling ping start: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};
