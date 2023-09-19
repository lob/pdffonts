#!/usr/bin/env sh

apt-get update \
    && apt-get upgrade \
    && apt-get install -y bash ca-certificates \
    && update-ca-certificates \
    && apt-get install -y lcov \
    && rm -rf /var/lib/apt/lists/* \