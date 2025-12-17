# CFL Wiki v0.1.0 - UI Polish & Dark Mode

**Release Date:** December 16, 2025
**Tag:** `v0.1.0`
**Type:** Feature Release

---

## 🎉 Overview

This release focuses on UI polish, reduced visual noise, and major new features including dark mode, a slide-in settings drawer, and keyboard shortcuts.

---

## ✨ Major Features

### 🌙 Dark Mode

- Full dark mode theme with warm, comfortable colors
- Respects system preference (`prefers-color-scheme: dark`)
- Toggle via settings drawer, FAB menu, or keyboard shortcut `d`
- Persists across sessions via localStorage

### 📱 Settings Drawer

- New slide-in settings panel (replaces complex orbit widget)
- Fast 150ms animation from the right
- Contains:
  - Dark mode toggle
  - Font selection (11 options)
  - Reset all settings
- Opens via header settings button or keyboard shortcut `,`

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search input |
| `d` | Toggle dark mode |
| `,` | Open/close settings |
| `Escape` | Close any open panel |

### 🎨 Emoji Reduction

Replaced emojis with clean SVG icons throughout:
- Category filters now use colored dots
- Card headers simplified to badges only
- Footer uses proper GitHub/Discord SVG icons
- Settings button uses gear SVG
- No results state uses search SVG

### 💡 Daily Tip Widget

- Shows keyboard shortcuts tip on homepage
- Dismissible banner below hero section

### 🏷️ Last Updated Badges

- Cards can now display "last updated" date
- Appears when `last_updated` or `date` is set in frontmatter
- Compact clock icon with abbreviated date

---

## 🔧 Technical Changes

### CSS

- Added `[data-theme="dark"]` CSS variables
- Added `.cfl-drawer` slide-in component
- Added `.cfl-toggle` switch component
- Added `.daily-tip` banner styles
- Added `.card-updated` badge styles
- Replaced `.category-pill__icon` with `.category-pill__dot`

### JavaScript

- Added `CFLDarkMode` shared manager for consistent dark mode state
- Added keyboard shortcuts handler
- Added drawer open/close logic
- Dark mode syncs across drawer and FAB menu toggles

### Configuration

- Added `_data/settings.yml` for centralized config
- Settings keys, defaults, fonts, and themes configurable

---

## 📁 Files Changed

### New Files
- `_data/settings.yml` - Centralized settings configuration
- `_includes/privacy-disclaimer.html` - Privacy banner
- `_wiki/achievements.mkd` - Achievements page
- `_work_efforts/10-19_category/10_subcategory/10.02_*.md` - Achievement work effort
- `_work_efforts/10-19_category/10_subcategory/10.03_*.md` - UI polish work effort

### Modified Files
- `_layouts/default.html` - Drawer, dark mode, keyboard shortcuts
- `_includes/card.html` - Simplified, added last_updated
- `assets/css/main.css` - Dark mode, drawer, toggle styles
- `index.html` - Emoji-free category pills, daily tip widget

---

## 🚀 Upgrade Notes

This release is backward compatible. Existing localStorage settings will continue to work.

### For Fork Users

If viewing from a fork (`username.github.io/chicofablab.github.io`), you may need to set `baseurl: "/chicofablab.github.io"` in `_config.yml` for assets to load correctly.

---

## 📊 Stats

- **Lines of CSS added:** ~200
- **Lines of JS added:** ~100
- **New keyboard shortcuts:** 4
- **Emojis replaced:** 15+

---

*Built with Jekyll · Hosted on GitHub Pages*
