#!/usr/bin/env bash

THRESHOLD=100

COVER_OUTPUT="$(yarn cover)"
status=$?
if [ $status -ne 0 ]; then
  exit $status
fi

echo "Checking against threshold of ${THRESHOLD}%"

PERCENTS=$(echo "$COVER_OUTPUT" | grep "%" | sed 's/.*[^0-9]\([0-9][0-9]*\)\.[0-9][0-9]*%.*/\1/g')

for PERCENT in $PERCENTS; do
  if (( $PERCENT < $THRESHOLD )); then
    echo "Coverage rate $PERCENT% is less than threshold $THRESHOLD%"
    exit 1
  fi
done

echo "Coverage is 100%"
