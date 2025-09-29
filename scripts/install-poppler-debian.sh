#!/usr/bin/env sh

# Install Poppler and other dependencies
# Alpine image is small, but lacks some essentials
# - Add build tools, python, etc
# - Add pkgconf, poppler-simple needs pkg-config to build
# - Add poppler-dev, the standard poppler package won't do
# - Add poppler-data from community repo
apt-get update \
    && apt-get install -y python3 make g++ \
    && apt-get install -y pkg-config \
    && apt-get install -y libpoppler-cpp-dev libpoppler-private-dev \
    && apt-get install -y poppler-data
