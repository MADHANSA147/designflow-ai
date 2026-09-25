import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import './queue';

const startServer = () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${env.PORT}/api/v1`);
      logger.info(`🏥 Health check at http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
