import { Options } from "express-jsdoc-swagger";

export const swaggerConfig: Options = {
  info: {
    version: "1.0.0",
    title: "Use case api",
    license: {
      name: "GPL-3.0-or-later",
    },
    description: "Service for connecting and certifying energy flow",
  },
  security: {
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: "../**/route.js",
  // URL where SwaggerUI will be rendered
  swaggerUIPath: "/api-docs",
};
