import { Job } from '../types/job.js';
import { logger } from '../config/logger.js';
import { jobRepository } from '../repositories/jobRepository.mongoose.js';
import { AlertModel } from '../models/Alert.model.js';

export const sendAlert = async (job: Job) => {
    const jobId = (job as any)._id || job.id;
    // Phase 5 will implement actual email sending here
    logger.error(`🚨 ALERT: Job "${job.name}" (ID: ${jobId}) is DOWN!`);

    await AlertModel.create({
        jobId: jobId.toString(),
        message: `Job ${job.name} went DOWN.`
    });

    await jobRepository.update(jobId.toString(), { lastAlertSentAt: new Date() });
};
