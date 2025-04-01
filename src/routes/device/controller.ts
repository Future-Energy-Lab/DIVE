import express from "express";
import * as DeviceCore from "../../core/device";
import { DevicePresentation } from "../../libs/kilt";
import { logger } from "../../libs/logger";

type RegisterBody = {
  didUrl: string;
  presentation: DevicePresentation;
};
export const register = async (req: express.Request, res: express.Response): Promise<void> => {
  const { didUrl, presentation } = req.body as RegisterBody;

  logger.info(`Did url: ${didUrl}`);
  logger.info(`Received presentation: ${JSON.stringify(presentation)}`);

  if (didUrl !== presentation.claim.owner) {
    const err = "Presentation did url verification failed: didUrl not the claim owner";
    logger.error(err);
    res.status(403).send(err);
    return;
  }

  const energyClaim = presentation.claim.contents["Bruttoleistung"] as number;
  if (!DeviceCore.verifyEnergyClaim(energyClaim)) {
    const err = "Energy claim verification failed";
    logger.error(err);
    res.status(403).send(err);
    return;
  }

  const result = await DeviceCore.verifyServiceEndpoint(didUrl);
  if (!result) {
    const err = "Service endpoint verification failed";
    logger.error(err);
    res.status(403).send(err);
    return;
  }

  try {
    await DeviceCore.verifyDevicePresentation(presentation);
  } catch (error) {
    logger.info(`Presentation verification failed: ${error}`);
    logger.error(error);
    res.status(403).send(error);
    return;
  }

  await DeviceCore.registerDevice(didUrl);

  res.sendStatus(200);
};
