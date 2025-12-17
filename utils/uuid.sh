#!/usr/bin/env bash
set -euo pipefail

# Usage: ./utils/uuid.sh [extension]
# Example: ./utils/uuid.sh txt  ->  123e4567-e89b-12d3-a456-426614174000.txt

EXT="${1:-}"

generate_uuid() {
  if command -v uuidgen >/dev/null 2>&1; then
    uuidgen
    return
  fi

  python3 - <<'PY'
import uuid
print(uuid.uuid4())
PY
}

UUID_VALUE="$(generate_uuid)"

if [[ -n "$EXT" ]]; then
  EXT="${EXT#.}"
  echo "${UUID_VALUE}.${EXT}"
else
  echo "${UUID_VALUE}"
fi
