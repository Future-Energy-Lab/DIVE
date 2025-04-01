import express from "express";
import http from "http";

import { expressConfig } from "./libs/express";
import { logger } from "./libs/logger";
import * as constants from "./constants";
import { router as api } from "./routes";
import { morganConfig } from "./libs/morgan";
import expressJSDocSwagger from "express-jsdoc-swagger";
import { swaggerConfig } from "./libs/swagger";
import * as DbConnection from "./libs/db-connection";
import * as RabbitMq from "./libs/rabbitmq";
import { listenToRegisteredDevices } from "./core/device";
import * as Kilt from "./libs/kilt";
import * as SQS from "./libs/sqs";

const app: express.Application = express();
const server = http.createServer(app);

expressConfig(app, constants);
morganConfig(app, constants);

app.use(api);

expressJSDocSwagger(app)(swaggerConfig);

const shutdown = async (): Promise<void> => {
  logger.info(`Stopping server [${constants.NODE_ENV}] . . .`);
  server.close(async (error) => {
    if (error) {
      logger.warn(`Failed closing HTTP service: ${error}`);
    }
    logger.info("Closed HTTP service");

    try {
      await DbConnection.close();
      logger.info("Closed MongoDB connection");

      await RabbitMq.close();
      logger.info("Closed RabbitMq connection");

      await Kilt.close();
      logger.info("Closed Kilt connection");

      SQS.close();
      logger.info("Closed SQS queue connection");
    } catch (error) {
      logger.warn(`Failed closing connections: ${error}`);
    } finally {
      logger.info("👋 Stopped server");
      logger.close();
      process.exit(0);
    }
  });
};

const start = async (): Promise<void> => {
  process.on("unhandledRejection", async (err) => {
    logger.error(`unhandledRejection ${err}`);
    await shutdown();
  });

  process.on("uncaughtException", async (err) => {
    logger.error(`uncaughtException ${err}`);
    await shutdown();
  });

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
  process.on("SIGUSR1", shutdown);

  server.listen(constants.PORT, async () => {
    try {
      await DbConnection.connect(constants);
      logger.debug("Successfully connected to database");
    } catch (error) {
      logger.error("Failed to connect to database");
      throw error;
    }

    try {
      SQS.initializeClient({
        region: constants.SQS_REGION,
        endpoint: constants.SQS_ENDPOINT,
        url: constants.SQS_URL,
        credentials: constants.SQS_ACCESS_KEY_ID !== undefined && constants.SQS_SECRET_ACCESS_KEY ? {
          accessKeyId: constants.SQS_ACCESS_KEY_ID,
          secretAccessKey: constants.SQS_SECRET_ACCESS_KEY,
        } : undefined,
      });
      logger.info("Successfully initialized SQS queue");
    } catch (error) {
      logger.error("error", error);
    }

    try {
      await RabbitMq.connect(constants);
      await listenToRegisteredDevices();
      logger.info("Successfully connected to rabbitmq");
    } catch (error) {
      logger.error("error", error);
    }

    try {
      await Kilt.connect(constants);
      logger.info("Successfully connected to Kilt");
    } catch (error) {
      logger.error("error", error);
    }

    logger.info(`[${constants.NODE_ENV} mode] - Service listening on port ${constants.PORT}`);
  });
};

start();
