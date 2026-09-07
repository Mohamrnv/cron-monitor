import { Job } from '../types/job.js';
import { logger } from '../config/logger.js';
import { jobRepository } from '../repositories/jobRepository.mongoose.js';
import { AlertModel } from '../models/Alert.model.js';
import nodemailer from 'nodemailer';

// Use Mailtrap for development testing.
// In production, these should be replaced with Resend/SendGrid/etc. credentials in .env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || "2525"),
    auth: {
      user: process.env.SMTP_USER || "YOUR_MAILTRAP_USER",
      pass: process.env.SMTP_PASS || "YOUR_MAILTRAP_PASS"
    }
});

export const sendAlert = async (job: Job) => {
    const jobId = (job as any)._id || job.id;
    
    logger.error(`🚨 ALERT: Job "${job.name}" (ID: ${jobId}) is DOWN!`);

    // 1. Send the email via Nodemailer
    try {
        await transporter.sendMail({
            from: '"Cron Monitor" <alerts@cron-monitor.local>', 
            to: process.env.ALERT_EMAIL || "admin@example.com", // Who should receive the alerts
            subject: `🚨 ALERT: Job "${job.name}" is DOWN!`, 
            text: `Your monitored job "${job.name}" (ID: ${jobId}) has failed to ping in time and is currently marked as DOWN.\n\nLast Ping At: ${job.lastPingAt || 'Never'}\n\nPlease investigate.`,
        });
        logger.info(`Alert email successfully dispatched for job "${job.name}"`);
    } catch (error) {
        logger.error(`Failed to send alert email for job "${job.name}": ${error}`);
    }

    // 2. Record the alert in the database
    await AlertModel.create({
        jobId: jobId.toString(),
        message: `Job ${job.name} went DOWN.`
    });

    // 3. Update the job's last alert timestamp (cooldown)
    await jobRepository.update(jobId.toString(), { lastAlertSentAt: new Date() });
};
