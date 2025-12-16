# Chico Fab Lab Documentation

This folder contains project documentation for developers and contributors.

## 📚 Documentation Index

### Core Documentation
- [Component Library](_includes/components/index.md) - Reusable UI components
- [CSS Library](/wiki/css-library.html) - Utility classes and design tokens
- [Brand Standards](/wiki/brand-standards.html) - Colors, typography, and design guidelines

### Interactive Features (NEW!)
- [Sound System](SOUND-SYSTEM.md) - Web Audio API sound effects
- [Achievement System](ACHIEVEMENTS.md) - Gamification and badges
- [Fun Buttons](FUN-BUTTONS.md) - 30+ animated button styles
- [Easter Eggs](EASTER-EGGS.md) - Hidden secrets and the Konami code
- [The Void](THE-VOID.md) - Eldritch corruption system
- [Button Playground](BUTTON-PLAYGROUND.md) - Interactive button builder

## 🎮 Quick Feature Overview

### Sound Effects (`CFL.sounds`)
Every button click triggers contextual sounds. Rainbow buttons play magical chimes, bouncy buttons go "boing", neon buttons zap, etc.

```javascript
CFL.sounds.magic();     // Ascending arpeggio
CFL.sounds.boing();     // Springy bounce
CFL.sounds.coin();      // Retro pickup sound
CFL.sounds.eldritch();  // Ominous drone
```

### Achievement System (`CFL.achievements`)
16 unlockable achievements track user interactions. Toast notifications appear on unlock.

```javascript
CFL.achievements.unlock('first-click');  // Manually unlock
CFL.achievements.getStats();             // { clicks: 42, pages: [...] }
```

### Easter Eggs
- **Konami Code**: ↑↑↓↓←→←→BA triggers rainbow mode
- **Hidden Eggs**: 5 semi-transparent emoji eggs appear randomly
- **The Void**: `/wiki/void` page with corruption mechanics

## 🛠️ Development

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
├── _layouts/
│   └── default.html       # Main template + ALL JavaScript
├── _wiki/
│   ├── component-showcase.mkd  # Live component examples
│   ├── button-playground.mkd   # Interactive button builder
│   ├── void.mkd                # Eldritch corruption page
│   └── ...
├── assets/
│   └── css/main.css       # Main stylesheet (includes fun buttons)
├── docs/                  # This folder
│   ├── README.md          # This file
│   ├── SOUND-SYSTEM.md    # Sound effects documentation
│   ├── ACHIEVEMENTS.md    # Achievement system documentation
│   ├── FUN-BUTTONS.md     # Fun button styles reference
│   ├── EASTER-EGGS.md     # Secrets and hidden features
│   ├── THE-VOID.md        # Void/corruption documentation
│   └── BUTTON-PLAYGROUND.md
└── index.html
```

### Key Implementation Details

1. **All JavaScript lives in `_layouts/default.html`** - No external JS files
2. **All CSS lives in `assets/css/main.css`** - Single stylesheet
3. **LocalStorage keys** use `cfl` prefix (e.g., `cflAchievements`, `cflSoundsEnabled`)
4. **Animations respect `prefers-reduced-motion`** media query

## 🎯 Work Efforts

This project uses the **Johnny Decimal** system for tracking work efforts, integrated with MCP (Model Context Protocol) tools.

### Structure

Work efforts are organized in `_work_efforts/` using the Johnny Decimal system:
- **Categories** (00-99): Main areas like Project Management (00-09) and Development (10-19)
- **Subcategories** (00-99): Specific focus areas within each category
- **Index Files**: Each subcategory has an `XX.00_index.md` file for navigation

### Using MCP Tools

The project integrates with MCP tools for managing work efforts:

- **`list_work_efforts`**: View all work efforts by status (active, paused, completed, all)
- **`search_work_efforts`**: Search by keyword in title or content
- **`create_work_effort`**: Create new work efforts with automatic Johnny Decimal numbering
- **`update_work_effort`**: Update status or add progress notes

### Documentation

- See `_work_efforts/README.md` for complete system documentation
- See `_work_efforts/XX-XX_category/XX_subcategory/XX.00_index.md` for category navigation
- See individual work effort files for detailed task tracking

## 📖 Quick Links

- [Component Showcase](/wiki/component-showcase.html) - Live examples of all UI components
- [Button Playground](/wiki/button-playground.html) - Build custom buttons interactively
- [Getting Started](/wiki/getting-started.html) - New user guide
- [The Void](/wiki/void.html) - Enter if you dare... 👁️
