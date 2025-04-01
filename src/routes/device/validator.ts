import { body } from "express-validator";

export const registerValidator = [body("didUrl").exists().isString().bail(), body("presentation").exists().bail()];
