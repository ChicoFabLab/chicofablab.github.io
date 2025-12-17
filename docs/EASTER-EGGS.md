# 🥚 Easter Eggs Documentation

The CFL site contains hidden secrets, interactive surprises, and classic gaming references. This document reveals them all (spoiler alert!).

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `_layouts/default.html` (Konami: ~450-485, Eggs: ~600-650) |
| **Storage Keys** | `cflFoundEggs` |
| **Total Eggs** | 5 hidden + Konami code + Void page |

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

## 🕹️ Achievement Integration

Easter eggs unlock these achievements:

| Achievement | ID | Trigger |
|-------------|-----|---------|
| Egg Hunter | `easter-egg` | Find any hidden egg OR enter Konami code |
| Old School | `konami` | Enter Konami code |
| Void Gazer | `void-gazer` | Visit The Void page |

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

