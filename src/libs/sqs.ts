import * as sqs from "@aws-sdk/client-sqs";

type SQSConfig = {
  region: string,
  endpoint: string,
  url: string,
  credentials?: {
    accessKeyId: string,
    secretAccessKey: string,
  }
}

let _sqsClient: SQSClient | null = null;
export function initializeClient(config: SQSConfig) {
  _sqsClient = new SQSClient(config);

  return _sqsClient;
}
export function getClient() {
  if (_sqsClient === null) {
    throw new Error("SQS Client has not been initialized yet");
  }
  return _sqsClient;
}

export function close() {
  if (_sqsClient !== null) {
    _sqsClient.destroy();
    _sqsClient = null;
  }
}


export class SQSClient {
  private readonly client: sqs.SQSClient;
  private readonly messageGroupId = "dena-dive-use-case";
  private readonly queueUrl: string;

  public constructor(config: SQSConfig) {
    this.client = new sqs.SQSClient({
      region: config.region,
      endpoint: config.endpoint,
      credentials: config.credentials,
    });
    this.queueUrl = config.url;
    
    if (this.queueUrl.endsWith(".fifo") === false) {
      throw new Error("Only fifo queues are supported");
    }
  }

  public destroy() {
    this.client.destroy();
  }

  public async sendMessage(params: {
    message: Record<string, unknown>,
    deduplicationId: string,
  }): Promise<void> {
    const { deduplicationId, message } = params;

    await this.client.send(new sqs.SendMessageCommand({
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueUrl,
      MessageGroupId: this.messageGroupId,
      MessageDeduplicationId: deduplicationId,
    }));
  }
}