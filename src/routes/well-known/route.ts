import express from "express";
import * as Controller from "./controller";
import { asyncHandler } from "../middlewares/async-handler";

export const router = express.Router({ mergeParams: true });

/**
 * The key agreement type
 * @typedef {object} KeyAgreement
 * @property {string} id - The id
 * @property {string} type - The type
 * @property {string} controller - The controller
 * @property {string} publicKeyMultibase - The publicKeyMultibase
 */

/**
 * GET /.well-known/did.json
 * @typedef {object} DidDocument
 * @property {string[]} context - The context of the DID document.
 * @property {string} id - The context of the DID document.
 * @property {KeyAgreement[]} keyAgreement - The keyAgreement information.
 * @summary Request did document
 * @return {DidDocument} 200 - Success response
 * @return 500 - Internal server error
 */
router.get("/did.json", asyncHandler(Controller.getDid));
