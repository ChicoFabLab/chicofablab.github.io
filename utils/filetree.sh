#!/usr/bin/env bash
set -euo pipefail

# Usage: ./utils/filetree.sh [root_dir]
# Optional: IGNORE_NAMES=".git,_site" ./utils/filetree.sh

ROOT="${1:-.}"
IGNORE_NAMES="${IGNORE_NAMES:-.git,.DS_Store,__pycache__,.jekyll-cache,_site}"
IFS=',' read -r -a IGNORE <<< "$IGNORE_NAMES"

if ! [ -d "$ROOT" ]; then
  echo "Directory not found: $ROOT" >&2
  exit 1
fi

ROOT_ABS="$(cd "$ROOT" && pwd)"
ROOT_NAME="$(basename "$ROOT_ABS")"

should_skip() {
  local name="$1"
  for pat in "${IGNORE[@]}"; do
    [[ "$name" == "$pat" ]] && return 0
  done
  return 1
}

print_tree() {
  local dir="$1"
  local prefix="$2"
  local entries=()

  while IFS= read -r entry; do
    should_skip "$entry" && continue
    entries+=("$entry")
  done < <(LC_ALL=C ls -A "$dir")

  local total=${#entries[@]}

  for i in "${!entries[@]}"; do
    local name="${entries[$i]}"
    local path="$dir/$name"
    local connector="|-- "
    local spacer="|   "

    if (( i == total - 1 )); then
      connector="+-- "
      spacer="    "
    fi

    printf "%s%s%s\n" "$prefix" "$connector" "$name"

    if [ -d "$path" ]; then
      print_tree "$path" "${prefix}${spacer}"
    fi
  done
}

printf "%s\n" "$ROOT_NAME"
print_tree "$ROOT_ABS" ""
