import * as amqp from "amqplib";
import { logger } from "./logger";

export type AmqpOptions = {
  RABBITMQ_URL: string;
};

let _connection: amqp.Connection;
export async function connect(options: AmqpOptions): Promise<amqp.Connection> {
  _connection = await amqp.connect(options.RABBITMQ_URL);
  return _connection;
}

export async function close(): Promise<void> {
  await _connection.close();
}

export function getConnection(): amqp.Connection {
  if (!_connection) throw new Error("RabbitMq is not connected");
  return _connection;
}

export async function createAmqpSubscriber<T>(queueName: string, handleMessage: (message: T, queueName: string) => Promise<void>): Promise<void> {
  const channel = await _connection.createChannel();

  // Ensure the queue exists
  await channel.assertQueue(queueName, { durable: true });

  // Consume messages from the queue
  await channel.consume(
    queueName,
    async (message) => {
      if (message !== null) {
        const strMsg = message.content.toString();
        const msg = JSON.parse(strMsg) as T;

        await handleMessage(msg, queueName);

        // Acknowledge the message to remove it from the queue
        channel.ack(message);
      }
    },
    { noAck: false }, // Set noAck to false to manually acknowledge messages
  );

  logger.info("Subscriber started. Waiting for messages...");
}
