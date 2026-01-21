#!/bin/bash
set -e

LANGUAGE=$1

if [ -z "$LANGUAGE" ]; then
  echo "Language not specified"
  exit 1
fi

case "$LANGUAGE" in
  cpp)
    /cpp/run.sh
    ;;
  python)
    /python/run.sh
    ;;
  *)
    echo "Unsupported language: $LANGUAGE"
    exit 1
    ;;
esac
