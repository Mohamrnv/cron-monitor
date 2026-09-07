import mongoose, { Schema } from 'mongoose';
import { Alert } from '../types/alert.js';

const alertSchema = new Schema<Alert>({
    jobId: { type: String, required: true, index: true },
    message: { type: String }
}, { timestamps: true });

export const AlertModel = mongoose.model('Alert', alertSchema);
