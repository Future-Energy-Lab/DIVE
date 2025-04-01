import express from "express";
import morgan from "morgan";
import { logger } from "./logger";

type MorganOptions = {
  NODE_ENV: string;
  MORGAN_IGNORE_PATHS?: string[];
};

export function morganConfig(app: express.Application, options: MorganOptions): express.Application {
  const MORGAN_LOG_FORMAT = options.NODE_ENV === "production" ? "common" : "dev";
  const MORGAN_IGNORE_PATHS = options.MORGAN_IGNORE_PATHS || ["/healthz"];

  app.use(
    morgan(MORGAN_LOG_FORMAT, {
      skip: (req, res) => {
        const redirectCode = res.statusCode >= 300 && res.statusCode < 400; // skip redirects
        const ignoredPath = MORGAN_IGNORE_PATHS.includes(req.url); // skip ignored paths
        return redirectCode || ignoredPath;
      },
      stream: {
        write: (msg) => {
          // removes newline added by morgan
          logger.info(msg.trimEnd());
        },
      },
    }),
  );

  return app;
}
