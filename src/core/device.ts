import { DOMAIN, ENERGY_THRESHOLD, PRIVATE_KEY, SERVICE_ENDPOINT_TYPE, TRUSTED_ATTESTER } from "../constants";
import * as KiltService from "../libs/kilt";
import * as DidCore from "./did";
import * as Decrypt from "../libs/decrypt";
import * as DeviceHandlers from "../database/handlers/device";
import { Device } from "../types/device";
import { logger } from "../libs/logger";
import { createAmqpSubscriber } from "../libs/rabbitmq";
import * as SQS from "../libs/sqs";
import md5 from "md5";

/**
 * Verifies the service endpoint retrieved from the DID document.
 *
 * @param didUrl The DID URL to fetch the DID document.
 * @returns A Promise that resolves to true if the service endpoint is successfully verified, or false otherwise.
 */
export async function verifyServiceEndpoint(didUrl: string): Promise<boolean> {
  const didDocument = await KiltService.queryFullDid(didUrl);
  const serviceEndpointUrl = KiltService.getServiceUrl(didDocument, SERVICE_ENDPOINT_TYPE);

  const [ownDidUrl, foreignDidUrl] = splitConcatenatedDidUrl(serviceEndpointUrl);

  const publicKey = Decrypt.getPublicKey(PRIVATE_KEY);
  const ownDidDocument = DidCore.getOwnDidDocument(DOMAIN, publicKey);

  return foreignDidUrl === didUrl && ownDidDocument.id === ownDidUrl;
}

/**
 * Verifies a device presentation.
 *
 * @param presentation - The device presentation to verify.
 * @returns A Promise that resolves to void if the presentation is valid, or rejects with an error if the presentation is invalid.
 *
 * @remarks
 * This function verifies a device presentation using the Kilt service. The presentation must conform to the Kilt `ICredentialPresentation` interface.
 */
export async function verifyDevicePresentation(presentation: KiltService.DevicePresentation): Promise<void> {
  return KiltService.verifyPresentation(presentation, [TRUSTED_ATTESTER]);
}

/**
 * Verifies an energy claim.
 *
 * @param energy - The amount of energy claimed.
 * @returns A boolean value indicating whether the energy claim is valid.
 *
 * @remarks
 * This function verifies an energy claim by checking if the claimed energy is below a predefined threshold.
 */
export function verifyEnergyClaim(energy: number): boolean {
  return energy > ENERGY_THRESHOLD;
}

/**
 * Registers a device with the given DID URL and subscribes it to an AMQP queue.
 *
 * @param didUrl - The DID URL of the device to register.
 *
 * @remarks
 * This function checks if a device with the provided DID URL already exists in the database. If it does, the function returns without performing any further actions.
 * If the device does not exist, it creates a new device entry in the database and subscribes the device to an AMQP queue with the same name as the DID URL.
 *
 * @param RABBITMQ_URL - The URL of the RabbitMQ server.
 * @param EXCHANGE_NAME - The name of the exchange to bind the queue to.
 * @param handleMessage - The async message handler function to be executed when messages are received by the device.
 *
 * @returns A Promise that resolves once the device registration and subscription are completed successfully.
 */
export async function registerDevice(didUrl: string) {
  const existingDevice = await DeviceHandlers.findOneByDidUrl(didUrl);
  if (existingDevice) return;

  const device: Device = { didUrl };
  await DeviceHandlers.create(device);

  logger.info(`Starting subscriber for: ${didUrl}`);
  await createAmqpSubscriber(didUrl, handleMessage);
}

/**
 * Listens to registered devices and subscribes them to corresponding AMQP queues.
 *
 * @remarks
 * This function retrieves all registered devices from the database and subscribes each device to an AMQP queue with the same name as its DID URL.
 * If no devices are found in the database, the function logs a message indicating that no devices were found and returns.
 *
 * @param RABBITMQ_URL - The URL of the RabbitMQ server.
 * @param EXCHANGE_NAME - The name of the exchange to bind the queues to.
 * @param handleMessage - The async message handler function to be executed when messages are received by the devices.
 *
 * @returns A Promise that resolves once all devices have been subscribed to their corresponding AMQP queues.
 */
export async function listenToRegisteredDevices() {
  const devices = await DeviceHandlers.findAll();
  if (devices.length === 0) {
    logger.info("No devices found");
    return;
  }

  for (const d of devices) {
    logger.info(`Starting subscriber for: ${d.didUrl}`);
    await createAmqpSubscriber(d.didUrl, handleMessage);
  }
}

async function handleMessage(message: Record<string, unknown>, queueName: string): Promise<void> {
  const did = queueName;
  const messageId = (() => {
    if (typeof message === "object" && "timestamp" in message) {
      return `${did}-${String(message.timestamp)}`;
    }
    return `${did}-${md5(JSON.stringify(message))}`;
  })();

  logger.info(
    `Received message from Device. Handing over to SQS queue. (id: ${queueName}) message: ${JSON.stringify(message)}`,
  );
  await SQS.getClient().sendMessage({
    message: {
      did,
      content: message,
    },
    deduplicationId: messageId
  });
}

/**
 * Splits a concatenated DID URL into its constituent parts.
 *
 * @param concatenatedDidUrl - The concatenated DID URL to split.
 * @returns An array containing the individual DID URLs.
 */
function splitConcatenatedDidUrl(concatenatedDidUrl: string): [string, string] {
  const lastSlashIndex = concatenatedDidUrl.lastIndexOf("/");

  const ownDidUrl = concatenatedDidUrl.slice(0, lastSlashIndex);
  const foreighDidUrl = concatenatedDidUrl.slice(lastSlashIndex + 1);

  return [ownDidUrl, foreighDidUrl];
}
