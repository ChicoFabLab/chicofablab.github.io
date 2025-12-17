#!/usr/bin/env bash
set -euo pipefail

# Usage: ./utils/timestamp.sh ["format"]
# Default: ISO-8601 UTC (2024-01-01T12:00:00Z)

FORMAT="${1:-%Y-%m-%dT%H:%M:%SZ}"
date -u +"$FORMAT"
