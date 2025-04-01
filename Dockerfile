FROM node:21.5-alpine3.19 AS builder

RUN apk update                             && \
  apk upgrade --no-cache                   && \
  apk add --no-cache --virtual .build-deps    \
    bash git openssh make g++

WORKDIR /opt/dena-dive-use-case

COPY package.json yarn.lock ./
COPY tsconfig.json ./
COPY src src

RUN yarn install && \
  apk del .build-deps

RUN yarn build

# Second stage

FROM node:21.5-alpine3.19

WORKDIR /opt/dena-dive-use-case

COPY --from=builder /opt/dena-dive-use-case/build build
COPY package.json package.json
RUN mkdir -p /vault/secrets && touch /vault/secrets/config

RUN yarn install --only=production

CMD ["yarn", "start"]
