#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PROJECT_ROOT}"

if [ "${CI:-}" = "true" ] || [ ! -d node_modules ]; then
  npm ci
fi

npx ng test --no-watch --coverage "$@"