#!/usr/bin/env bash
set -euo pipefail

# Usage: ./utils/random-name.sh
# Generates a human-friendly project slug like "brisk-forge-482".

adjectives=(brisk bright clever copper nimble rugged solar steady vivid)
nouns=(anvil beacon circuit forge gantry kiln lathe rover welder)

adj="${adjectives[RANDOM % ${#adjectives[@]}]}"
noun="${nouns[RANDOM % ${#nouns[@]}]}"
suffix=$(printf "%03d" $((RANDOM % 900 + 100)))

echo "${adj}-${noun}-${suffix}"
