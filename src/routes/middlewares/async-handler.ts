import express from "express";
import { validationResult } from "express-validator";
import { logger } from "../../libs/logger";

export const asyncHandler =
  (asyncFn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) =>
  async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(422).json({ errors: result.array() });
      return;
    }

    try {
      await asyncFn(req, res, next);
    } catch (error) {
      const err = extractErrorMessage(error);
      logger.error(err);
      res.status(500).send(err);
    }
  };

// Utility function to extract the error message from the HTML response
const extractErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  } else if (error instanceof Error && error.message) {
    return error.message;
  } else {
    return "Unknown error: " + error;
  }
};
