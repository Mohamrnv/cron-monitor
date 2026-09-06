import { Schema, model } from 'mongoose';

const pingSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  receivedAt: { type: Date, default: Date.now },
  sourceIp: { type: String, required: false },
}, { timestamps: true });

export const PingModel = model('Ping', pingSchema);
