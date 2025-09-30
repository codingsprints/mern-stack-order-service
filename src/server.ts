import app from './app';
import { configENV } from './config/config';
import connectDB from './config/db';
import logger from './config/logger';

const startServer = async () => {
  const PORT = process.env.PORT || '5050';
  try {
    logger.info('🚀 Starting application...');
    await connectDB();
    app.listen(configENV.port, () =>
      logger.info(`Listening on port ${configENV.port}`),
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message);
      logger.on('finish', () => {
        process.exit(1);
      });
    }
  }
};

startServer();
