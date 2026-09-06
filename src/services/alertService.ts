import { Job } from '../types/job.js';
import { logger } from '../config/logger.js';

export const sendAlert = async (job: Job) => {
    // Phase 5 will implement actual email sending here
    logger.error(`🚨 ALERT: Job "${job.name}" (ID: ${(job as any)._id || job.id}) is DOWN!`);
};
