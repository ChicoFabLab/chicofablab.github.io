# 👁️ The Void Documentation

The Void is an interactive cosmic horror experience that lets users "corrupt" the visual appearance of the entire CFL website. It's both a fun easter egg and a showcase of advanced CSS effects.

## Overview

| Feature | Description |
|---------|-------------|
| **Page Location** | `_wiki/void.mkd` |
| **CSS Location** | `assets/css/main.css` (lines ~2086-2310) |
| **Storage Key** | `voidCorruption` |
| **Corruption Range** | 0-100% |

## The Experience

### Page Elements

```
┌─────────────────────────────────────────────┐
│           👁️ T̸h̵e̶ ̷V̴o̵i̷d̶ ̵A̷w̵a̶i̷t̵s̷ 👁️         │
│        "You should not have come here..."    │
│                                              │
│                    👁️                        │
│              (clickable eye)                 │
│                                              │
│         Corruption Level: 40%                │
│         ██████████░░░░░░░░░░░░               │
│                                              │
│     [🌀 Unleash the Void]                    │
│     [✨ Cleanse (if you can)]                │
│                                              │
│  ⚠️ WARNING: Activating the void will...    │
└─────────────────────────────────────────────┘

     Tentacles creep from edges when corrupted
```

### Corruption Levels

| Level | Effects |
|-------|---------|
| 0% | Normal site appearance |
| 1-30% | Subtle purple tint, eldritch-mode class applied |
| 31-50% | Whispers appear randomly, eye grows |
| 51-75% | Stronger visual corruption, tentacles more visible |
| 76-99% | Maximum distortion, console messages intensify |
| 100% | "FULLY CONSUMED" - button disabled |

## Corruption Mechanics

### Increasing Corruption

1. **Main Button**: +20% per click
2. **Eye Click**: +5% per click

### Decreasing Corruption

1. **Cleanse Button**: Resets to 0%

### Persistence

Corruption level persists across:
- Page refreshes
- Navigation to other pages
- Browser sessions (stored in localStorage)

## Visual Effects

### `body.eldritch-mode` Class

Applied to `<body>` when corruption > 0:

```css
body.eldritch-mode {
    animation: void-consume 0.5s ease-out forwards;
}

body.eldritch-mode::before {
    /* Purple gradient overlay */
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(...);
    z-index: 9998;
    animation: void-overlay 10s ease-in-out infinite;
}

body.eldritch-mode h1, h2, h3 {
    text-shadow: 0 0 10px rgba(139, 0, 255, 0.5);
    animation: text-corruption 3s ease-in-out infinite;
}

body.eldritch-mode img {
    filter: hue-rotate(270deg) saturate(1.5);
}
```

### Tentacle Decorations

Four tentacle divs creep from the bottom:

```html
<div class="tentacle tentacle-1" style="--base-rotation: -10deg;"></div>
<div class="tentacle tentacle-2" style="--base-rotation: 10deg;"></div>
<div class="tentacle tentacle-3" style="--base-rotation: -5deg;"></div>
<div class="tentacle tentacle-4" style="--base-rotation: 5deg;"></div>
```

### Whisper Messages

Random messages appear in the center:

```javascript
var whisperMessages = [
    "The void whispers your name...",
    "It sees you...",
    "There is no escape...",
    "Join us in the darkness...",
    "The corruption spreads...",
    "Your pixels belong to us now...",
    "Ph'nglui mglw'nafh...",
    "The old code awakens...",
    "01110110 01101111 01101001 01100100",  // "void" in binary
    "undefined is not a function...",       // JS joke
    "Stack overflow in consciousness...",
    "Cannot read property 'soul' of null..."
];
```

## Console Messages

When corruption persists across pages:

```javascript
// At 50%+ corruption
console.log('%c👁️ The void sees you...',
    'color: #8b00ff; font-size: 20px; text-shadow: 0 0 10px #8b00ff;');

// At 100% corruption
console.log('%c🌀 FULLY CONSUMED',
    'color: #ff00ff; font-size: 24px; font-weight: bold;');
```

## Achievement Integration

| Achievement | Trigger |
|-------------|---------|
| Void Gazer | Visit `/wiki/void` |
| Corrupted Soul | Reach 100% corruption |
| Purified | Cleanse corruption to 0% |

## Technical Implementation

### Void Page JavaScript

```javascript
(function() {
    var corruption = parseInt(localStorage.getItem('voidCorruption') || '0');

    function updateCorruption(level) {
        corruption = Math.max(0, Math.min(100, level));
        localStorage.setItem('voidCorruption', corruption.toString());

        // Update UI
        corruptionFill.style.width = corruption + '%';
        corruptionPercent.textContent = corruption;

        // Apply/remove eldritch mode
        if (corruption > 0) {
            document.body.classList.add('eldritch-mode');
            document.body.classList.add('corrupted');
        } else {
            document.body.classList.remove('eldritch-mode');
            document.body.classList.remove('corrupted');
        }

        // Scale the watching eye
        var eyeScale = 1 + (corruption / 100) * 0.5;
        voidEye.style.transform = 'scale(' + eyeScale + ')';
    }
})();
```

### Global Corruption Check (default.html)

```javascript
// Runs on every page load
(function checkVoidCorruption() {
    var corruption = parseInt(localStorage.getItem('voidCorruption') || '0');
    if (corruption > 0) {
        document.body.classList.add('eldritch-mode');
    }
})();
```

## CSS Keyframes

### `void-consume`
Applies initial corruption filter:
```css
@keyframes void-consume {
    0% { filter: none; }
    100% {
        filter: hue-rotate(-30deg) saturate(0.8) brightness(0.9) contrast(1.1);
    }
}
```

### `text-corruption`
Makes headings slightly unstable:
```css
@keyframes text-corruption {
    0%, 100% { transform: skewX(0deg); }
    25% { transform: skewX(0.5deg); }
    50% { transform: skewX(-0.5deg); letter-spacing: 0.02em; }
    75% { transform: skewX(0.3deg); }
}
```

### `tentacle-reach`
Animates tentacles creeping upward:
```css
@keyframes tentacle-reach {
    0%, 100% { transform: translateY(100%) rotate(0deg); }
    50% { transform: translateY(20%) rotate(5deg); }
}
```

## Cleansing the Void

### Via Button
Click "Cleanse (if you can)" on the Void page.

### Via Console
```javascript
localStorage.setItem('voidCorruption', '0');
document.body.classList.remove('eldritch-mode');
location.reload();
```

### Complete Reset
```javascript
localStorage.removeItem('voidCorruption');
location.reload();
```

## Design Philosophy

The Void serves multiple purposes:

1. **Showcase** - Demonstrates advanced CSS capabilities
2. **Easter Egg** - Rewards exploratory users
3. **Narrative** - Adds personality to the site
4. **Opt-in** - Users choose to corrupt (and can cleanse)
5. **Persistent** - Actions have consequences across sessions
6. **Developer Jokes** - Console messages include JS humor

## Accessibility Notes

- Eldritch mode applies strong visual filters
- Users with vestibular disorders may find effects uncomfortable
- Cleanse button is always available
- Corruption is entirely opt-in
- Does not affect screen reader content

## Content Warnings

The Void page includes:
- Cosmic horror themes
- Distorted/zalgo text
- Flashing/animated elements
- Intentionally unsettling messages

This is designed as a fun, spooky experience and can be avoided by not visiting `/wiki/void`.

