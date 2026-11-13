#!/usr/bin/env bash
set -e

REPO="yanshay/SpoolEase-Bin"
BRANCH="main"

RUN_ID=$(gh run list \
  --repo "$REPO" \
  --branch "$BRANCH" \
  --limit 1 \
  --json databaseId \
  -q '.[0].databaseId')


while true; do
  echo "Waiting for run $RUN_ID to complete..."
  STATUS=$(gh run view "$RUN_ID" --repo "$REPO" --json status,conclusion -q '.status + " " + (.conclusion // "")')

  if [[ "$STATUS" == completed* ]]; then
    echo "Run finished: $STATUS"
    break
  fi

  sleep 5
done
