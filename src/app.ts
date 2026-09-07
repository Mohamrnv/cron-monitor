import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobs.js';

const app: Express = express();

// CORS — allow the React frontend dev server (and future production domain)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));


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
