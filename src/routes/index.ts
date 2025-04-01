import express from "express";
import * as SQS from "../libs/sqs";
import { router as deviceRouter } from "./device/route";
import { router as wellKnownRouter } from "./well-known/route";

export const router = express.Router();

router.use("/api/v1/device", deviceRouter);
router.use("/.well-known", wellKnownRouter);
// TODO REMOVE IT, USED FOR TESTING SQS CONNECTION
export const testRoute = async (req: express.Request, res: express.Response): Promise<void> => {
  if (req.body.token !== "9759340048") {
    res.sendStatus(401);
  }

  try {
    await SQS.getClient().sendMessage({
      message: req.body.message ?? { content: "test" },
      deduplicationId: req.body.deduplicationId ?? Math.random().toString()
    });
    res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(error, null, 2));
    res.sendStatus(500);
  }
};
router.post("/test-sqs", testRoute);
