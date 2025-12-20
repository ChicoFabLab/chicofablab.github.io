# CFL Wiki v0.1.2 - Super Block Invaders Pong

**Release Date:** December 17, 2025
**Tag:** `v0.1.2`
**Type:** Feature Release

---

## 🎉 Overview

This release adds a playable arcade game easter egg: **Super Block Invaders Pong** - an epic mashup of Pong, Breakout, and Space Invaders!

---

## ✨ New Features

### 🏓 Super Block Invaders Pong

A complete arcade game hidden in the footer featuring:

- **Hybrid Gameplay** - Pong + Breakout + Space Invaders combined
- **Brick Walls** - Each side has destructible brick walls
- **Space Invaders** - Aliens float in the middle and shoot lasers
- **Lives System** - Both player and CPU have 3 lives
- **5 Waves** - Increasing difficulty with boss waves
- **10 Power-ups** - Extra life, big paddle, shield, laser gun, speed ball, multi-ball, magnet, fire ball, slow motion, bonus points
- **Combo System** - Rapid hits increase score multiplier
- **Leaderboard** - 3-initial entry, top 10 scores in localStorage

### 🎮 Controls

**Keyboard:**

| Key | Action |
|-----|--------|
| `W` / `↑` | Move paddle up |
| `S` / `↓` | Move paddle down |
| `Space` | Shoot laser / Pause |
| `P` | Pause/Resume |
| `R` | Reset game |

**Mobile/Touch:**

| Control | Action |
|---------|--------|
| Drag on canvas | Move paddle to finger |
| ⬆️ Up button | Move paddle up |
| ⬇️ Down button | Move paddle down |
| 🔫 Shoot button | Fire laser (when powered up) |

*Mobile controls appear automatically on touch devices.*

### 🏅 New Achievement

- **Pong Champion** (`pong-master`) - Win a game of Pong (Rare)

---

## 📁 Files Changed

### New Files
- `_wiki/pong.mkd` - Game page
- `assets/js/games/sbip-config.js` - Game configuration
- `assets/js/games/sbip-entities.js` - Entity classes
- `assets/js/games/sbip-renderer.js` - Rendering engine
- `assets/js/games/sbip-game.js` - Main game logic

### Modified Files
- `_layouts/default.html` - Added pong-master achievement
- `_data/navigation.yml` - Added Pong to footer nav
- `assets/css/main.css` - Footer link styles
- `docs/EASTER-EGGS.md` - Game documentation

---

## 🔗 Access

- **Footer button:** "🏓 Play Pong"
- **Footer nav:** "🏓 Pong" link
- **Direct URL:** `/wiki/pong`

---

*Built with Jekyll · Hosted on GitHub Pages*
