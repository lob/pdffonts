#!/usr/bin/env sh

# deb.debian.org partially 404s on bullseye-security (dpkg, libkrb5-3, libssl1.1):
# mirror rollout gap on this now-past-LTS release. Pin to the snapshot.debian.org
# lines the base image already ships (commented out) so the build no longer
# depends on the live mirror's current state.
sed -i \
    -e 's|^# deb http://snapshot|deb http://snapshot|' \
    -e 's|^deb http://deb.debian.org|# deb http://deb.debian.org|' \
    /etc/apt/sources.list

apt-get update -o Acquire::Check-Valid-Until=false \
    && apt-get upgrade -y -o Acquire::Check-Valid-Until=false \
    && apt-get install -y -o Acquire::Check-Valid-Until=false bash ca-certificates \
    && update-ca-certificates \
    && apt-get install -y -o Acquire::Check-Valid-Until=false lcov \
    && rm -rf /var/lib/apt/lists/* \