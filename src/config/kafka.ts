import {
  Consumer,
  EachMessagePayload,
  Kafka,
  KafkaConfig,
  Producer,
} from 'kafkajs';
import { MessageBroker } from '../common/types/broker';
import { handleProductUpdate } from '../common/cache/productCache/productUpdateHandler';
import { handleToppingUpdate } from '../common/cache/toppingCache/toppingUpdateHandler';
import { NODE_ENV_VAL } from '../common/constants/constants';
import { configENV } from './config';

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    let kafkaConfig: KafkaConfig = {
      clientId,
      brokers,
    };
    if (configENV.nodeEnv === NODE_ENV_VAL.PRODUCTION) {
      kafkaConfig = {
        ...kafkaConfig,
        ssl: configENV.kafkaSSL,
        connectionTimeout: 45000,
        sasl: {
          mechanism: 'plain',
          username: configENV.kafkaUserName,
          password: configENV.kafkaPassword,
        },
      };
    }

    const kafka = new Kafka(kafkaConfig);

    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Connect the producer
   */
  async connectProducer() {
    await this.producer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  /**
   * Disconnect the producer
   */
  async disconnectProducer() {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  /**
   *
   * @param topic - the topic to send the message to
   * @param message - The message to send
   * @throws {Error} - When the producer is not connected
   */
  async sendMessage(topic: string, message: string, key?: string) {
    const data: { value: string; key?: string } = {
      value: message,
    };

    if (key) {
      data.key = key;
    }

    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        // Logic to handle incoming messages.
        console.log('message --->', {
          value: message.value?.toString(),
          topic,
          partition,
        });
        switch (topic) {
          case 'product':
            await handleProductUpdate(message.value?.toString() ?? '');
            return;
          case 'topping':
            await handleToppingUpdate(message.value?.toString() ?? '');
            return;
          default:
            console.log('Doing nothing...');
        }
      },
    });
  }
}
