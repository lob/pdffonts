FROM node:14.15.4-alpine3.10

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY ./scripts ./scripts
RUN ./scripts/install-system-dependencies-alpine.sh
RUN ./scripts/install-poppler-alpine.sh

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --silent

RUN apk del .build-deps

COPY . .
