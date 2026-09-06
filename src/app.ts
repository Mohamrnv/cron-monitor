import express, { Express, Request, Response } from 'express';
import jobsRouter from './routes/jobs.js';

const app: Express = express();

// Middleware
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Cron Monitor Service is running' });
});

import pingRouter from './routes/ping.js';

app.use('/api/jobs', jobsRouter);
app.use('/ping', pingRouter);

export default app;
