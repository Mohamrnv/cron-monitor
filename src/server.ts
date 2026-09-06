import 'dotenv/config';
import app from './app.js'; // Using .js extension because type: module is enabled in package.json
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';

import { startMonitorWorker } from './services/monitorWorker.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Here we will connect to the database later (e.g., MongoDB)
     await connectDB();   

    // Start background monitor worker
    startMonitorWorker();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
