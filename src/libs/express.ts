import express from "express";
import bodyParser from "body-parser";
import path from "path";
import helmet from "helmet";

type ExpressOptions = {
  PORT: number;
  BODY_LIMIT: string;
  PARAMETER_LIMIT: number;
};

export function expressConfig(app: express.Application, options: ExpressOptions): express.Application {
  app.set("port", options.PORT);

  // X-Powered-By header has no functional value.
  // Keeping it makes it easier for an attacker to build the site's profile
  // It can be removed safely
  app.disable("x-powered-by");

  app.use(
    bodyParser.json({
      limit: options.BODY_LIMIT,
    }),
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: options.BODY_LIMIT,
      parameterLimit: options.PARAMETER_LIMIT,
    }),
  );

  app.use(express.static(path.join(process.cwd(), "public")));

  app.use(helmet());

  app.set("trust proxy", 1);

  return app;
}
