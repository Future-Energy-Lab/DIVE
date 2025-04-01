import express from "express";
import * as DidCore from "../../core/did";
import { DOMAIN, PRIVATE_KEY } from "../../constants";
import * as Decrypt from "../../libs/decrypt";

export const getDid = async (req: express.Request, res: express.Response): Promise<void> => {
  const publicKey = Decrypt.getPublicKey(PRIVATE_KEY);
  const didDocument = DidCore.getOwnDidDocument(DOMAIN, publicKey);
  res.status(200).send(didDocument);
};
