import express from "express";
import * as Validator from "./validator";
import * as Controller from "./controller";
import { asyncHandler } from "../middlewares/async-handler";

export const router = express.Router({ mergeParams: true });

/**
 * POST /api/v1/device/register
 * @typedef {object} RegisterBody
 * @property {string} didUrl
 * @property {object} presentation
 * @summary Request device registration
 * @param {RegisterBody} request.body.required - did url
 * @return 200 - Success response
 * @return 422 - Validation error
 * @return 403 - Forbidden error
 * @return 500 - Internal server error
 */
router.post("/register", Validator.registerValidator, asyncHandler(Controller.register));
