# Chico Fab Lab Documentation

This folder contains project documentation for developers and contributors.

## Contents

- **Component Library** - See `_includes/components/index.md` for component documentation
- **Wiki Pages** - Located in `_wiki/` folder
- **Brand Standards** - See `_wiki/brand-standards.mkd`

## Quick Links

- [Component Showcase](/wiki/component-showcase.html) - Live examples of all UI components
- [Getting Started](/wiki/getting-started.html) - New user guide
- [Brand Standards](/wiki/brand-standards.html) - Colors, typography, and design guidelines

## Development

### Local Setup

```bash
# Install Jekyll (if not installed)
gem install bundler jekyll

# Serve locally
jekyll serve
```

### File Structure

```
chicofablab.github.io/
├── _includes/components/  # Reusable UI components
├── _layouts/              # Page templates
├── _wiki/                 # Wiki content (Markdown)
├── _work_efforts/         # Project tracking (Johnny Decimal)
├── assets/
│   ├── css/main.css       # Main stylesheet
│   └── img/               # Images
├── docs/                  # This folder
└── index.html             # Homepage
```

## Work Efforts

This project uses the Johnny Decimal system for tracking work. See `_work_efforts/` for current tasks and progress.
