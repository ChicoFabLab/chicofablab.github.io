# Utils

Small helper scripts for working with the wiki site.

## filetree.sh
- Prints an ASCII tree of the project.
- Usage: `IGNORE_NAMES=".git,_site" ./utils/filetree.sh .` (defaults to ignoring `.git`, `_site`, `__pycache__`, `.DS_Store`).

## uuid.sh
- Generates a UUID, optionally with an extension.
- Usage: `./utils/uuid.sh` or `./utils/uuid.sh txt`.

## timestamp.sh
- Outputs an ISO-8601 UTC timestamp (override with a custom `date` format string).
- Usage: `./utils/timestamp.sh` or `./utils/timestamp.sh "%Y-%m-%d %H:%M"`.

## random-name.sh
- Emits a friendly project slug like `brisk-forge-482`.
- Usage: `./utils/random-name.sh`.

## logger.sh
- Lightweight logging helpers. Source it to reuse functions or run directly.
- Usage: `source ./utils/logger.sh && log_warn "Deploying..."`.
