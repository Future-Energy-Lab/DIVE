import dotenv from "dotenv";
dotenv.config();

// Server
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = Number(process.env.PORT) || 8000;
export const PARAMETER_LIMIT = Number(process.env.PARAMETER_LIMIT) || 1000;
export const BODY_LIMIT = process.env.BODY_LIMIT || "100mb";

// Device DID
export const SERVICE_ENDPOINT_TYPE = "dive";
export const KILT_WSS_ADDRESS = process.env.KILT_WSS_ADDRESS || "wss://peregrine.kilt.io";
export const TRUSTED_ATTESTER = process.env.TRUSTED_ATTESTER || "did:kilt:4qGqegcXWctkdLToCSFfBAUQE5V5SBdwivaB6miWgXS6C6Cf";
export const ENERGY_THRESHOLD = Number(process.env.ENERGY_THRESHOLD) || 200;

// Use case Did Document
export const DOMAIN = process.env.DOMAIN || "example.com";
export const PRIVATE_KEY = process.env.PRIVATE_KEY || "a1614f6cb57eaf8db3167d9610784d4668586176270b15d46c7a65f1344f6b8f";

// RabbitMq
export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

// Database
export const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/use-case";

// SQS Queue
export const SQS_REGION = process.env.SQS_REGION || "us-east-1";
export const SQS_ENDPOINT = process.env.SQS_ENDPOINT || "http://localhost:4566";
export const SQS_URL = process.env.SQS_URL || "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/DENA_DIVE_USE_CASE.fifo";
export const SQS_ACCESS_KEY_ID = process.env.SQS_ACCESS_KEY_ID;
export const SQS_SECRET_ACCESS_KEY = process.env.SQS_SECRET_ACCESS_KEY;