#!/usr/bin/env sh

# Install Poppler and other dependencies
# Alpine image is small, but lacks some essentials
# - Add build tools, python, etc
# - Add pkgconf, poppler-simple needs pkg-config to build
# - Add poppler-dev, the standard poppler package won't do
# - Add poppler-data from community repo
apt-get update -o Acquire::Check-Valid-Until=false \
    && apt-get install -y -o Acquire::Check-Valid-Until=false python3 make g++ \
    && apt-get install -y -o Acquire::Check-Valid-Until=false pkg-config \
    && apt-get install -y -o Acquire::Check-Valid-Until=false libpoppler-cpp-dev libpoppler-private-dev \
    && apt-get install -y -o Acquire::Check-Valid-Until=false poppler-data
