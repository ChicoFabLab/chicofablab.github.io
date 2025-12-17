# 🥚 Easter Eggs Documentation

The CFL site contains hidden secrets, interactive surprises, and classic gaming references. This document reveals them all (spoiler alert!).

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `_layouts/default.html` (Konami: ~450-485, Eggs: ~600-650) |
| **Storage Keys** | `cflFoundEggs`, `cflPongLeaderboard` |
| **Total Eggs** | 5 hidden + Konami code + Void page + Pong game |

## 🎮 Konami Code

The classic cheat code triggers a rainbow celebration mode.

### The Code

```
↑ ↑ ↓ ↓ ← → ← → B A
```

Or in JavaScript key terms:
```javascript
['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
 'b', 'a']
```

### What Happens

1. **Rainbow Mode Activates** - Entire page cycles through hue-rotate filter
2. **Sound Effect** - `CFL.sounds.powerup()` plays
3. **Toast Notification** - "KONAMI CODE ACTIVATED!"
4. **Achievements Unlock**:
   - "Old School" (🎮)
   - "Egg Hunter" (🥚)
5. **Duration** - 10 seconds of rainbow chaos

### CSS Classes Applied

```css
body.konami-mode {
    animation: konami-rainbow 0.5s linear infinite;
}

@keyframes konami-rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}
```

## 🥚 Hidden Eggs

Five semi-transparent emoji are randomly placed around pages.

### Egg Locations

| Emoji | X Position | Y Position |
|-------|------------|------------|
| 🥚 | 5% | 30% |
| 🐣 | 95% | 60% |
| 🌟 | 10% | 85% |
| 🍀 | 90% | 15% |
| 🎁 | 50% | 95% |

### Spawn Mechanics

- **Spawn Chance**: 20% per egg per page load
- **Persistence**: Found eggs don't respawn (tracked in localStorage)
- **Appearance**: 10% opacity by default, 100% on hover
- **Size**: 30px diameter circles

### Click Behavior

When clicked:
1. Egg animates (grows then shrinks away)
2. `CFL.sounds.coin()` plays
3. "Egg Hunter" achievement unlocks (first time only)
4. Toast: "Easter Egg Found! You found a hidden {emoji}!"
5. Remaining count shown: "X more to find!"

### CSS Styles

```css
.easter-egg {
    position: fixed;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0.1;
    transition: all 0.3s ease;
    z-index: 100;
}

.easter-egg:hover {
    opacity: 1;
    transform: scale(1.5) rotate(360deg);
}

.easter-egg--found {
    animation: egg-found 0.5s ease forwards;
}

@keyframes egg-found {
    0% { transform: scale(1); }
    50% { transform: scale(2); }
    100% { transform: scale(0); opacity: 0; }
}
```

### LocalStorage

```javascript
// Storage key: 'cflFoundEggs'
// Value: JSON array of found egg indices
["0", "2", "4"]  // Found eggs at indices 0, 2, and 4
```

### Reset Found Eggs

```javascript
// To reset and allow re-finding:
localStorage.removeItem('cflFoundEggs');
location.reload();
```

## 👁️ The Void (Secret Page)

A hidden page at `/wiki/void` contains an interactive corruption mechanic.

### Access Methods

1. Direct URL: `/wiki/void`
2. Click the eldritch button in Fun Buttons Gallery
3. Achievement system tracks visits

### Corruption Mechanics

See [THE-VOID.md](THE-VOID.md) for full documentation.

## 🚀 Super Block Invaders Pong (Secret Page)

An epic mashup of Pong, Breakout, and Space Invaders hidden in the footer!

### Access Methods

1. Click the 🏓 Play Pong link in the footer
2. Direct URL: `/wiki/pong`

### Game Features

- **Canvas-based** - Pure vanilla JavaScript with modular architecture
- **Hybrid Gameplay** - Pong + Breakout + Space Invaders combined
- **Brick Walls** - Each side has brick walls to protect/destroy
- **Space Invaders** - Aliens float in the middle and shoot lasers at both players
- **Lives System** - Both player and CPU have 3 lives
- **Wave System** - 5 waves of increasing difficulty with boss waves
- **10 Power-ups**:
  - ❤️ Extra Life
  - 📏 Big Paddle (15s)
  - 🛡️ Shield (blocks 1 hit)
  - 🔫 Laser Gun (10s)
  - ⚡ Speed Ball
  - 🌟 Multi-Ball (splits into 3)
  - 🧲 Magnet (catch ball)
  - 🔥 Fire Ball (passes through bricks, 5s)
  - 🐢 Slow Motion (8s)
  - 💎 +500 Points

### Controls

- `W` / `↑` - Move paddle up
- `S` / `↓` - Move paddle down
- `Space` - Shoot laser (when powered up) / Pause
- `P` - Pause/Resume
- `R` - Reset game

### Scoring System

| Action | Points |
|--------|--------|
| Destroy normal brick | 100 |
| Destroy strong brick | 200 |
| Destroy super brick | 300 |
| Destroy basic invader | 150 |
| Destroy fast invader | 200 |
| Destroy tank invader | 400 |
| Destroy boss | 1000 |
| Collect powerup | 50 |
| Clear wave | 1000 |
| CPU loses life | 500 |

**Combo System**: Rapid hits increase a combo multiplier (25% per combo level)!

### Leaderboard

- 3-character initials entry on game over/victory
- Tracks score, wave reached, and date
- Top 10 scores stored in localStorage
- Storage keys: `cflSBIPLeaderboard`, `cflSBIPHighScore`

```javascript
// Leaderboard format
[
  { initials: "ABC", score: 15000, wave: 5, date: "2025-12-17" },
  { initials: "XYZ", score: 8500, wave: 3, date: "2025-12-16" }
]
```

### Reset Leaderboard

```javascript
localStorage.removeItem('cflSBIPLeaderboard');
localStorage.removeItem('cflSBIPHighScore');
location.reload();
```

### Technical Architecture

The game uses a modular JavaScript architecture:

```
assets/js/games/
├── sbip-config.js    # Game constants and settings
├── sbip-entities.js  # Entity classes (Ball, Brick, Invader, etc.)
├── sbip-renderer.js  # All drawing and visual effects
└── sbip-game.js      # Main game logic and state management
```

## 🕹️ Achievement Integration

Easter eggs unlock these achievements:

| Achievement | ID | Trigger | Rarity |
|-------------|-----|---------|--------|
| Egg Hunter | `easter-egg` | Find any hidden egg OR enter Konami code | Common |
| Old School | `konami` | Enter Konami code | Rare |
| Void Gazer | `void-gazer` | Visit The Void page | Epic |
| Pong Champion | `pong-master` | Win a game of Pong | Rare |
| Space Defender | `sbip-master` | Beat all 5 waves in Super Block Invaders Pong | Legendary |

## Adding New Easter Eggs

### Add a New Hidden Egg

In `_layouts/default.html`, find the `createEasterEggs` function:

```javascript
var eggs = [
    { emoji: '🥚', x: '5%', y: '30%' },
    // ... existing eggs ...
    { emoji: '🆕', x: '75%', y: '50%' }  // Add new one
];
```

### Add a New Secret Code

```javascript
// Example: Add "CFL" secret code
(function cflCode() {
    var pattern = ['c', 'f', 'l'];
    var current = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === pattern[current]) {
            current++;
            if (current === pattern.length) {
                current = 0;
                // Do something fun!
                CFL.toast({
                    icon: '🏭',
                    title: 'CFL Code!',
                    message: 'You typed CFL!',
                    variant: 'party'
                });
            }
        } else {
            current = 0;
        }
    });
})();
```

## Debugging Easter Eggs

```javascript
// Check found eggs
console.log('Found eggs:', JSON.parse(localStorage.getItem('cflFoundEggs') || '[]'));

// Force show all eggs (for testing)
document.querySelectorAll('.easter-egg').forEach(e => e.style.opacity = '1');

// Manually trigger Konami mode
document.body.classList.add('konami-mode');
setTimeout(() => document.body.classList.remove('konami-mode'), 10000);
```

## Easter Egg Philosophy

The CFL easter eggs follow these principles:

1. **Non-intrusive** - Users can ignore them completely
2. **Delightful** - Finding them feels rewarding
3. **Nostalgic** - References to gaming history (Konami)
4. **Thematic** - The Void fits the "fun buttons" experimental nature
5. **Trackable** - Achievements give permanent recognition

