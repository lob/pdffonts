FROM node:18.17.1-bullseye-slim

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY ./scripts ./scripts
RUN ./scripts/install-system-dependencies-alpine.sh
RUN ./scripts/install-poppler-alpine.sh

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm install
