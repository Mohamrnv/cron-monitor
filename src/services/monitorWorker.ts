import cron from 'node-cron';
import { jobRepository } from '../repositories/jobRepository.mongoose.js';
import { sendAlert } from './alertService.js';
import { logger } from '../config/logger.js';

export const startMonitorWorker = () => {
    logger.info("Starting background monitor worker...");
    cron.schedule('* * * * *', async () => {
        try {
            const overdueJobs = await jobRepository.findOverdueJobs();
            for (const job of overdueJobs) {
                const jobId = (job as any)._id || job.id;
                await jobRepository.markAsDown(jobId.toString());
                await sendAlert(job);
            }
        } catch (error) {
            logger.error(`Error in monitor worker: ${error}`);
        }
    });
};
