import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jobsRouter from './routes/jobs.js';

const app: Express = express();

// Trust the reverse proxy (like Railway, Heroku, Nginx) so rate limiter gets correct IPs
app.set('trust proxy', 1);

// CORS — allow the React frontend dev server (and future production domain)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://cron-monitor-eight.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));


// Middleware
app.use(express.json());

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after a minute.' },
});
app.use(limiter);


// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Cron Monitor Service is running' });
});

import pingRouter from './routes/ping.js';

app.use('/api/jobs', jobsRouter);
app.use('/ping', pingRouter);

export default app;
