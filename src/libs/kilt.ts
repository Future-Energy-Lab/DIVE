import * as Kilt from "@kiltprotocol/sdk-js";
import { ApiPromise } from "@polkadot/api";

export type KiltOption = {
  KILT_WSS_ADDRESS: string;
};

let _connection: ApiPromise;
export async function connect(options: KiltOption): Promise<ApiPromise> {
  _connection = await Kilt.connect(options.KILT_WSS_ADDRESS);
  return _connection;
}

export async function close(): Promise<void> {
  await _connection.disconnect();
}

export function getConnection(): ApiPromise {
  if (!_connection) throw new Error("Kilt client is not connected");
  return _connection;
}

export async function queryFullDid(didUri: string): Promise<Kilt.DidDocument> {
  const res = await Kilt.Did.resolve(didUri as Kilt.DidUri);

  if (!res) throw Error("Did document not found");

  const { metadata, document } = res;
  if (metadata.deactivated) {
    throw Error(`DID ${didUri} has been deleted.`);
  } else if (document === undefined) {
    throw Error(`DID ${didUri} does not exist.`);
  }

  return document;
}

export function getServiceUrl(fullDid: Kilt.DidDocument, type: string): string {
  const service = Kilt.Did.getService(fullDid, `#${type}`);
  if (!service) throw Error("Service not found");

  return service.serviceEndpoint[0];
}

export async function verifyPresentation(
  presentation: Kilt.ICredentialPresentation,
  trustedAttesters: string[],
  {
    trustedAttesterUris = trustedAttesters as Kilt.DidUri[],
  }: {
    challenge?: string;
    trustedAttesterUris?: Kilt.DidUri[];
  } = {},
): Promise<void> {
  const { revoked, attester } = await Kilt.Credential.verifyCredential(presentation);

  // TODO: Verify the presentation with the provided challenge. Challenge is not provided yet
  // const { revoked, attester } = await Kilt.Credential.verifyPresentation(presentation, { challenge });

  if (revoked) {
    throw new Error("Credential has been revoked and hence it's not valid.");
  }
  if (!trustedAttesterUris.includes(attester)) {
    throw `Credential was issued by ${attester} which is not in the provided list of trusted attesters: ${trustedAttesterUris}.`;
  }
}

export type DevicePresentation = Kilt.ICredentialPresentation;
