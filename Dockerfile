FROM node:18.17.1-bullseye-slim

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY ./scripts ./scripts
RUN ./scripts/install-system-dependencies-debian.sh
RUN ./scripts/install-poppler-debian.sh

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm install
