import * as Ecies from "eciesjs";

const COMPRESS_KEY = true;

/**
 * Represents a function that decrypts ciphertext using a private key.
 * @param privatekey The private key to use for decryption, as a string.
 * @param ciphertext The ciphertext to decrypt, as a Buffer.
 * @returns The decrypted plaintext, as a Buffer.
 */
export type DecryptFunc = (privatekey: string, ciphertext: Buffer) => Buffer;

/**
 * @deprecated This function is not used and is kept here for reference.
 * Decrypts the given ciphertext using the provided private key.
 * @param privatekey The private key used for decryption, as a string.
 * @param ciphertext The ciphertext to decrypt, as a Buffer.
 * @returns The decrypted plaintext, as a Buffer.
 */
export const decrypt: DecryptFunc = (privatekey: string, ciphertext: Buffer): Buffer => {
  // With the following config the payload would be: 33 Bytes + Ciphered instead of 65 Bytes + Ciphered
  Ecies.ECIES_CONFIG.isEphemeralKeyCompressed = COMPRESS_KEY;
  return Ecies.decrypt(privatekey, ciphertext);
};

/**
 * Retrieves the public key corresponding to the provided private key.
 *
 * @param privatekey - The private key represented as a hexadecimal string.
 * @returns The public key derived from the given private key, represented as a hexadecimal string.
 */
export const getPublicKey = (privatekey: string): string => {
  const pk = Ecies.PrivateKey.fromHex(privatekey);
  return pk.publicKey.toHex(COMPRESS_KEY);
};
