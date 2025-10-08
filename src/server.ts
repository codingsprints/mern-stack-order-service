import app from './app';
import { TOPIC_NAME } from './common/constants/constants';
import { createMessageBroker } from './common/factories/brokerFactory';
import { MessageBroker } from './common/types/broker';
import { configENV } from './config/config';
import connectDB from './config/db';
import logger from './config/logger';

const startServer = async () => {
  let broker: MessageBroker | null = null;
  try {
    logger.info('🚀 Starting application...');
    await connectDB();
    broker = createMessageBroker();
    await broker.connectProducer();

    await broker.connectConsumer();
    await broker.consumeMessage(
      [TOPIC_NAME.product, TOPIC_NAME.topping],
      false,
    );

    app.listen(configENV.port, () =>
      logger.info(`Listening on port ${configENV.port}`),
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error('❌ Error happened: ', err.message);
      if (broker) {
        await broker.disconnectProducer();
        await broker.disconnectConsumer();
      }
      logger.on('finish', () => {
        process.exit(1);
      });
    }
  }
};

startServer();
