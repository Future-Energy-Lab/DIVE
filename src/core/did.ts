export type DidDocument = {
  "@context": string[];
  id: string;
  keyAgreement: {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }[];
};

export function getOwnDidDocument(domain: string, publicKey: string): DidDocument {
  const id = `did:web:${domain}`;

  return {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id,
    keyAgreement: [
      {
        id,
        type: "X25519KeyAgreementKey2019",
        controller: id,
        publicKeyMultibase: publicKey,
      },
    ],
  };
}
