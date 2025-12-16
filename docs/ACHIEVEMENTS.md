# 🏆 Achievement System Documentation

The CFL Achievement System gamifies user interactions by tracking clicks, page visits, and special actions. Achievements unlock with celebratory toasts and sounds.

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `_layouts/default.html` (lines ~340-445) |
| **Global Object** | `CFL.achievements` |
| **Storage Keys** | `cflAchievements`, `cflStats` |
| **Total Achievements** | 16 |

## Architecture

```
CFL.achievements
├── achievements{}     (Static definitions)
├── unlocked{}         (User's unlocked achievements)
├── stats{}            (Click count, pages visited, button types)
├── recentClicks[]     (Timestamps for speed tracking)
├── unlock()           (Unlock an achievement)
├── trackClick()       (Track button clicks)
├── trackPage()        (Track page visits)
└── Getters            (isUnlocked, getUnlocked, getStats, getAll, reset)
```

## Achievement List

### Progression Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
| `first-click` | First Click | 🖱️ | Click your first button | 1 button click |
| `button-10` | Button Masher | 🔘 | Click 10 buttons | 10 clicks |
| `button-50` | Click Champion | 🏆 | Click 50 buttons | 50 clicks |
| `button-100` | Button Legend | 👑 | Click 100 buttons | 100 clicks |
| `explorer` | Explorer | 🧭 | Visit 5 different pages | 5 unique pages |

### Special Action Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
| `rainbow` | Taste the Rainbow | 🌈 | Click a rainbow button | Click `.cfl-btn--rainbow` |
| `void-gazer` | Void Gazer | 👁️ | Visit The Void | Navigate to `/wiki/void` |
| `corrupted` | Corrupted Soul | 🌀 | Reach 100% void corruption | Max corruption level |
| `cleansed` | Purified | ✨ | Cleanse the void corruption | Reset corruption to 0 |
| `all-buttons` | Completionist | ⭐ | Click every fun button type | 15+ unique button types |

### Time-Based Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
| `night-owl` | Night Owl | 🦉 | Browse after midnight | Page load 12am-5am |
| `early-bird` | Early Bird | 🐦 | Browse before 6am | Page load 12am-6am |

### Secret Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
| `sound-on` | Audiophile | 🔊 | Enable sound effects | Toggle sounds on |
| `easter-egg` | Egg Hunter | 🥚 | Find a hidden easter egg | Click any hidden egg |
| `speed-demon` | Speed Demon | ⚡ | Click 5 buttons in 2 seconds | Rapid clicking |
| `konami` | Old School | 🎮 | Enter the Konami code | ↑↑↓↓←→←→BA |

## Usage Examples

### Check Achievement Status

```javascript
// Check if a specific achievement is unlocked
if (CFL.achievements.isUnlocked('rainbow')) {
    console.log('User has clicked a rainbow button!');
}

// Get list of all unlocked achievement IDs
var unlocked = CFL.achievements.getUnlocked();
// Returns: ['first-click', 'button-10', ...]

// Get all achievement definitions
var all = CFL.achievements.getAll();
// Returns: { 'first-click': { name: '...', desc: '...', icon: '...' }, ... }
```

### Track Custom Events

```javascript
// Track a button click (usually automatic)
CFL.achievements.trackClick('rainbow');  // Button type as string

// Track a page visit (usually automatic)
CFL.achievements.trackPage('/wiki/void');

// Manually unlock an achievement
CFL.achievements.unlock('custom-achievement');
```

### Get Statistics

```javascript
var stats = CFL.achievements.getStats();
// Returns: {
//     clicks: 42,
//     pages: ['/wiki/component-showcase', '/wiki/void', ...],
//     buttonTypes: ['rainbow', 'bouncy', 'neon', ...]
// }
```

### Reset All Progress

```javascript
// Warning: This clears all achievements and stats!
CFL.achievements.reset();
```

## UI Components

### Trophy Button (`.cfl-achievements-btn`)

- **Position**: `bottom: 100px; right: 20px`
- **Appearance**: Gold gradient circle with 🏆 icon
- **Behavior**: Click to open achievement panel
- **Notification dot**: Appears when new achievement unlocked (via `[data-new]` attribute)

### Achievement Panel (`.cfl-achievements-panel`)

```
┌─────────────────────────────────────┐
│ 🏆 Achievements                  ✕ │
├─────────────────────────────────────┤
│ ┌─────┐                             │
│ │ 🖱️  │ First Click                │
│ └─────┘ Click your first button    │
│                                     │
│ ┌─────┐                             │
│ │ 🔘  │ Button Masher              │
│ └─────┘ ???                        │
│ (locked - grayed out)              │
│                                     │
│ ... more achievements ...          │
├─────────────────────────────────────┤
│ Unlocked: 3/16        Clicks: 42   │
└─────────────────────────────────────┘
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.cfl-achievements-btn` | Floating trophy button |
| `.cfl-achievements-panel` | Panel container |
| `.cfl-achievements-panel.is-open` | Panel visible state |
| `.cfl-achievement` | Single achievement row |
| `.cfl-achievement--locked` | Grayed out, description hidden |
| `.cfl-achievement--unlocked` | Gold highlight, description visible |

## Data Storage

### LocalStorage: `cflAchievements`

```json
{
    "first-click": { "time": 1702752000000 },
    "button-10": { "time": 1702752100000 },
    "rainbow": { "time": 1702752200000 }
}
```

### LocalStorage: `cflStats`

```json
{
    "clicks": 42,
    "pages": ["/wiki/component-showcase", "/wiki/void"],
    "buttonTypes": ["primary", "rainbow", "bouncy", "neon"]
}
```

## Technical Implementation

### Unlock Flow

```
unlock(id)
    │
    ├── Check: Already unlocked? → Return false
    ├── Check: Achievement exists? → Return false
    │
    ├── Add to unlocked{} with timestamp
    ├── Save to localStorage
    │
    ├── Play associated sound
    │   └── CFL.sounds[achievement.sound]()
    │
    ├── Show toast notification
    │   └── CFL.toast({ icon, title, message, variant: 'party' })
    │
    └── Console log with gold styling
```

### Click Tracking

```
trackClick(buttonType)
    │
    ├── Increment stats.clicks
    ├── Add timestamp to recentClicks[]
    ├── Filter recentClicks to last 2 seconds
    │
    ├── Check progression achievements
    │   ├── clicks >= 1 → 'first-click'
    │   ├── clicks >= 10 → 'button-10'
    │   ├── clicks >= 50 → 'button-50'
    │   └── clicks >= 100 → 'button-100'
    │
    ├── Check speed achievement
    │   └── recentClicks.length >= 5 → 'speed-demon'
    │
    ├── Track button type if new
    │   ├── Add to stats.buttonTypes[]
    │   ├── type === 'rainbow' → 'rainbow'
    │   └── types.length >= 15 → 'all-buttons'
    │
    └── Save stats
```

## Adding New Achievements

1. Add definition to `achievements` object:

```javascript
achievements: {
    // ... existing achievements ...
    'new-achievement': {
        name: 'Display Name',
        desc: 'How to unlock this',
        icon: '🆕',
        sound: 'success'  // Must be valid CFL.sounds method
    }
}
```

2. Add unlock trigger somewhere in code:

```javascript
CFL.achievements.unlock('new-achievement');
```

## Debugging

```javascript
// View all data in console
console.log('Unlocked:', CFL.achievements.getUnlocked());
console.log('Stats:', CFL.achievements.getStats());
console.log('All definitions:', CFL.achievements.getAll());

// Reset everything (development only!)
CFL.achievements.reset();
localStorage.removeItem('cflAchievements');
localStorage.removeItem('cflStats');
```

