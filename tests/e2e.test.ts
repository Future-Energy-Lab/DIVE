import axios from "axios";
import * as DidLib from "@decentralized-identity/did-common-typescript";
import * as amqp from "amqplib";
import { deviceAmqpMessage, didUrl, didUrlWithIncorrectServiceEndpoint, invalidDidUrl, presentation } from "./data";

const host = "http://localhost:8000";
const rabbitmqUrl = "amqp://localhost:5672";
const deviceRoute = `${host}/api/v1/device`;
const didRoute = `${host}/.well-known/did.json`;

describe("POST /api/v1/device/register", () => {
  it("works", async () => {
    const body = {
      didUrl,
      presentation,
    };

    const res = await axios.post(`${deviceRoute}/register`, body);
    expect(res.status).toEqual(200);
  });

  it("fails - 422 - missing didUrl", async () => {
    const body = {
      presentation,
    };

    const res = await axios.post(`${deviceRoute}/register`, body).catch((err) => err);
    expect(res.response.status).toEqual(422);
  });

  it("fails - 422 - missing presentation", async () => {
    const body = {
      didUrl,
    };

    const res = await axios.post(`${deviceRoute}/register`, body).catch((err) => err);
    expect(res.response.status).toEqual(422);
  });

  it("fails - 403 - Presentation did url verification failed: didUrl not the claim owner", async () => {
    const invalidPresentation = { ...presentation, claim: { ...presentation.claim, owner: invalidDidUrl } };
    const body = {
      didUrl,
      presentation: invalidPresentation,
    };

    const res = await axios.post(`${deviceRoute}/register`, body).catch((err) => err);
    expect(res.response.status).toEqual(403);
    expect(res.response.data).toEqual("Presentation did url verification failed: didUrl not the claim owner");
  });

  it("fails - 403 - Incorrect service endpoint on device did document", async () => {
    const body = {
      didUrl: didUrlWithIncorrectServiceEndpoint,
      presentation,
    };

    const res = await axios.post(`${deviceRoute}/register`, body).catch((err) => err);
    expect(res.response.status).toEqual(403);
  });

  it("fails - 500 - Not a valid KILT DID", async () => {
    const invalidDidUrl = "did:kilt:5trTeBK2wUpbopdKRYrsiihNjC452P6Sj6RmaJcSFZwcGcje";
    const invalidPresentation = { ...presentation, claim: { ...presentation.claim, owner: invalidDidUrl } };
    const body = {
      didUrl: invalidDidUrl,
      presentation: invalidPresentation,
    };

    const res = await axios.post(`${deviceRoute}/register`, body).catch((err) => err);
    expect(res.response.status).toEqual(500);
    expect(res.response.data).toEqual(`Not a valid KILT DID "${invalidDidUrl}"`);
  });

  it("fails - 500 - Service not found", async () => {
    const invalidPresentation = { ...presentation, claim: { ...presentation.claim, owner: invalidDidUrl } };
    const body = {
      didUrl: invalidDidUrl,
      presentation: invalidPresentation,
    };

    const res = await axios.post(`${deviceRoute}/register`, body).catch((err) => err);
    expect(res.response.status).toEqual(500);
    expect(res.response.data).toEqual("Service not found");
  });
});

describe("GET /.well-known/did.json", () => {
  it("works", async () => {
    const res = await axios.get(`${didRoute}`);
    expect(res.status).toEqual(200);

    const didDoc = new DidLib.DidDocument(res.data);
    expect(didDoc).not.toBe(undefined);
  });
});

describe("AMQP: Device message", () => {
  let connection: amqp.Connection;
  let amqpChannel: amqp.Channel;

  beforeAll(async () => {
    connection = await amqp.connect(rabbitmqUrl);
    amqpChannel = await connection.createChannel();
  });

  afterAll(async () => {
    await amqpChannel.close();
    await connection.close();
  });

  it("works", () => {
    amqpChannel.sendToQueue(didUrl, Buffer.from(JSON.stringify(deviceAmqpMessage)), { deliveryMode: 2 });
  });
});
