#!/usr/bin/env sh

apk update

# Needed for poppler as well as some Node addons
apk add --no-cache --virtual .build-deps python make g++

# Install certs so we can pull from https sources
apk add --no-cache ca-certificates
update-ca-certificates

# For cov reports
apk add lcov --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing

# Install chamber
wget -q -O /usr/bin/chamber https://github.com/segmentio/chamber/releases/download/v2.0.0/chamber-v2.0.0-linux-amd64 \
          && chmod +x /usr/bin/chamber
