/**
 * Represents a Dive device with a DID URL.
 */
export type Device = {
  /**
   * The DID URL of the device.
   */
  didUrl: string;
};

/**
 * Represents a message from a device using AMQP protocol.
 */
export type DeviceAmqpMessage = {
  /**
   * The address of the message.
   */
  address: string;
  /**
   * The type of the message data.
   */
  type: string;
  /**
   * The access mode of the message data.
   */
  accessMode: string;
  /**
   * Additional text information of the message.
   */
  text: string;
  /**
   * The unit of the message data.
   */
  unit: string;
  /**
   * The value of the message data.
   */
  value: number;
};
