FROM node:12.13.1-alpine3.10

ARG NODE_ENV
ARG NPM_TOKEN

COPY ./scripts ./scripts
RUN ./scripts/install-system-dependencies-alpine.sh
RUN ./scripts/install-poppler-alpine.sh

RUN mkdir /app
WORKDIR /app

COPY npmrc .npmrc
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --production --silent

RUN apk del .build-deps

COPY . .
