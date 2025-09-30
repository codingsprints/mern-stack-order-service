import app from './app';
import { configENV } from './config/config';
import logger from './config/logger';

const startServer = () => {
  const PORT = process.env.PORT || '5050';
  try {
    logger.info('🚀 Starting application...');
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
