import { KafkaBroker } from '../../config/kafka';
import { MessageBroker } from '../types/broker';
import { configENV } from '../../config/config';
import { ORDER_SERVICE } from '../constants/constants';
import logger from '../../config/logger';

let broker: MessageBroker | null = null;

export const createMessageBroker = (): MessageBroker => {
  logger.info('✅ connecting to kafka broker...');
  // singleton
  if (!broker) {
    // broker = new KafkaBroker(ORDER_SERVICE, configENV.broker);
    broker = new KafkaBroker(ORDER_SERVICE, [
      'pkc-l7pr2.ap-south-1.aws.confluent.cloud:9092',
    ]);
  }
  return broker;
};
