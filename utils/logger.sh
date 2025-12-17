#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   LOG_LEVEL=DEBUG ./utils/logger.sh "Example message"
#   source ./utils/logger.sh && log_info "Ready"

LOG_LEVEL="${LOG_LEVEL:-INFO}"

level_value() {
  case "$1" in
    DEBUG) echo 0 ;;
    INFO)  echo 1 ;;
    WARN|WARNING)  echo 2 ;;
    ERROR|ERR) echo 3 ;;
    *) echo 1 ;;
  esac
}

should_log() {
  local level="$1"
  local current
  current="$(level_value "$LOG_LEVEL")"
  [[ "$(level_value "$level")" -ge "$current" ]]
}

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log() {
  local level="$1"
  shift
  should_log "$level" || return 0
  printf "%s [%s] %s\n" "$(timestamp)" "$level" "$*"
}

log_debug() { log DEBUG "$@"; }
log_info()  { log INFO "$@"; }
log_warn()  { log WARN "$@"; }
log_error() { log ERROR "$@"; }

# If called directly, log the passed arguments as INFO.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  if [[ $# -eq 0 ]]; then
    log_info "No message provided."
  else
    log_info "$*"
  fi
fi
