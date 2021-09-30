#!/usr/bin/env sh

apk update

# Install certs so we can pull from https sources
apk add --no-cache ca-certificates
update-ca-certificates

# For cov reports
apk add lcov --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing
