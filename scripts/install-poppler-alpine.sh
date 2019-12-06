#!/usr/bin/env sh

# Install Poppler and other dependencies
# Alpine image is small, but lacks some essentials
# - Add build tools, python, etc
# - Add pkgconf, poppler-simple needs pkg-config to build
# - Add poppler-dev, the standard poppler package won't do
# - Add poppler-data from community repo
apk add alpine-sdk
apk add pkgconf
apk add poppler-dev
apk add poppler-data --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
