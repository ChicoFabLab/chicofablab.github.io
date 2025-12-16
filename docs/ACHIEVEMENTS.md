# 🏆 Achievement System Documentation

The CFL Achievement System gamifies user interactions by tracking clicks, page visits, and special actions. Achievements unlock with celebratory toasts and sounds.

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `_layouts/default.html` (lines ~340-500) |
| **Global Object** | `CFL.achievements` |
| **Storage Keys** | `cflAchievements`, `cflStats` |
| **Total Achievements** | 16 |
| **Categories** | Progression, Special, Time, Secret |
| **Progress Tracking** | Visual progress bars for progression achievements |
| **Timestamps** | Unlock times with relative formatting |

## Architecture

```
CFL.achievements
├── achievements{}     (Static definitions with category, progress)
├── unlocked{}         (User's unlocked achievements with timestamps)
├── stats{}            (Click count, pages visited, button types)
├── recentClicks[]     (Timestamps for speed tracking)
├── unlock()           (Unlock an achievement)
├── trackClick()       (Track button clicks, update progress)
├── trackPage()        (Track page visits)
└── Getters
    ├── isUnlocked(id)
    ├── getUnlocked()              (Array of IDs)
    ├── getUnlockedData()          (Full unlock data with timestamps)
    ├── getStats()                 (Click/page/type stats)
    ├── getAll()                   (All achievement definitions)
    ├── getByCategory(category)    (Filter by category)
    └── reset()                    (Clear all progress)
```

## Achievement List

All achievements now include:
- **Category**: `progression`, `special`, `time`, or `secret`
- **Progress** (for progression achievements): `{ current: 0, target: N }`
- **Unlock timestamp**: Stored when achievement is unlocked

### Progression Achievements

These achievements show progress bars in the UI.

| ID | Name | Icon | Description | Trigger | Progress |
|----|------|------|-------------|---------|----------|
| `first-click` | First Click | 🖱️ | Click your first button | 1 button click | 0/1 |
| `button-10` | Button Masher | 🔘 | Click 10 buttons | 10 clicks | 0/10 |
| `button-50` | Click Champion | 🏆 | Click 50 buttons | 50 clicks | 0/50 |
| `button-100` | Button Legend | 👑 | Click 100 buttons | 100 clicks | 0/100 |
| `explorer` | Explorer | 🧭 | Visit 5 different pages | 5 unique pages | 0/5 |
| `all-buttons` | Completionist | ⭐ | Click every fun button type | 15+ unique button types | 0/15 |

### Special Action Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
| `rainbow` | Taste the Rainbow | 🌈 | Click a rainbow button | Click `.cfl-btn--rainbow` |
| `void-gazer` | Void Gazer | 👁️ | Visit The Void | Navigate to `/wiki/void` |
| `corrupted` | Corrupted Soul | 🌀 | Reach 100% void corruption | Max corruption level |
| `cleansed` | Purified | ✨ | Cleanse the void corruption | Reset corruption to 0 |
| `sound-on` | Audiophile | 🔊 | Enable sound effects | Toggle sounds on |

### Time-Based Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
| `night-owl` | Night Owl | 🦉 | Browse after midnight | Page load 12am-5am |
| `early-bird` | Early Bird | 🐦 | Browse before 6am | Page load 12am-6am |

### Secret Achievements

| ID | Name | Icon | Description | Trigger |
|----|------|------|-------------|---------|
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

// Get unlocked achievements with timestamps
var unlockedData = CFL.achievements.getUnlockedData();
// Returns: { 'first-click': { time: 1702752000000 }, ... }

// Get all achievement definitions
var all = CFL.achievements.getAll();
// Returns: { 'first-click': { name: '...', desc: '...', icon: '...', category: '...', progress: {...} }, ... }

// Get achievements by category
var progression = CFL.achievements.getByCategory('progression');
// Returns: ['first-click', 'button-10', 'button-50', 'button-100', 'explorer', 'all-buttons']
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

### Achievement Button (in FAB Bar)

- **Location**: Unified FAB bar (bottom-right)
- **Appearance**: Gold gradient circle with 🏆 icon
- **Behavior**: Click to open achievement panel
- **Notification dot**: Appears when new achievement unlocked (via `[data-new]` attribute)

### Achievement Panel (`.cfl-achievements-panel`) ⭐ ENHANCED

Enhanced UI with category tabs, progress bars, and timestamps:

```
┌─────────────────────────────────────────────┐
│ 🏆 Achievements                          ✕ │
│    Unlock them all!                         │
├─────────────────────────────────────────────┤
│ [All] [📈 Progression] [⭐ Special] ...     │
├─────────────────────────────────────────────┤
│ ┌─────┐                                     │
│ │ 🖱️  │ First Click                        │
│ └─────┘ Click your first button            │
│         Today                               │
│                                             │
│ ┌─────┐                                     │
│ │ 🔘  │ Button Masher                      │
│ └─────┘ ???                                │
│         ████████░░ 8/10                     │
│         🔒 (locked - grayed out)            │
│                                             │
│ ... more achievements ...                  │
├─────────────────────────────────────────────┤
│ Category: 2/6  Total: 3/16  Clicks: 42    │
└─────────────────────────────────────────────┘
```

**New Features:**
- **Category Tabs**: Filter by All, Progression, Special, Time, Secrets
- **Progress Bars**: Visual progress for locked progression achievements
- **Timestamps**: "Today", "Yesterday", "2 days ago", or date
- **Lock Icons**: 🔒 shown on locked achievements
- **Glow Effect**: Unlocked achievements have animated glow
- **Scroll Lock**: Body scroll disabled when panel is open
- **Real-time Updates**: Panel refreshes when achievements unlock

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.cfl-achievements-panel` | Panel container |
| `.cfl-achievements-panel.is-open` | Panel visible state |
| `.cfl-achievements-header` | Header with title and close button |
| `.cfl-achievements-tabs` | Category filter tabs container |
| `.cfl-achievements-tab` | Individual tab button |
| `.cfl-achievements-tab.active` | Active tab state |
| `.cfl-achievements-list` | Scrollable achievement list |
| `.cfl-achievement` | Single achievement card |
| `.cfl-achievement--locked` | Locked state (grayed, lock icon) |
| `.cfl-achievement--unlocked` | Unlocked state (gold highlight, glow) |
| `.cfl-achievement__progress` | Progress bar container |
| `.cfl-achievement__progress-bar` | Progress bar fill |
| `.cfl-achievement__progress-text` | Progress text overlay (e.g., "8/10") |
| `.cfl-achievement__time` | Unlock timestamp display |
| `.cfl-achievement__lock` | Lock icon overlay |
| `.cfl-achievements-stats` | Footer statistics |

## Data Storage

### LocalStorage: `cflAchievements`

Stores unlock timestamps for each achievement:

```json
{
    "first-click": { "time": 1702752000000 },
    "button-10": { "time": 1702752100000 },
    "rainbow": { "time": 1702752200000 }
}
```

The `time` field is a Unix timestamp (milliseconds) used for:
- Displaying relative time ("Today", "2 days ago")
- Sorting achievements (newest first)
- Tracking when achievements were unlocked

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
    ├── Update progress for progression achievements
    │   ├── first-click.progress.current = min(clicks, 1)
    │   ├── button-10.progress.current = min(clicks, 10)
    │   ├── button-50.progress.current = min(clicks, 50)
    │   ├── button-100.progress.current = min(clicks, 100)
    │   ├── explorer.progress.current = min(pages.length, 5)
    │   └── all-buttons.progress.current = min(buttonTypes.length, 15)
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
        sound: 'success',  // Must be valid CFL.sounds method
        category: 'special',  // 'progression', 'special', 'time', or 'secret'
        progress: { current: 0, target: 10 }  // Optional: for progression achievements
    }
}
```

**Category Guidelines:**
- `progression` - Achievements that track incremental progress (show progress bars)
- `special` - One-time actions or special events
- `time` - Time-based achievements (browsing at specific times)
- `secret` - Hidden achievements (easter eggs, codes, etc.)

2. Add unlock trigger somewhere in code:

```javascript
CFL.achievements.unlock('new-achievement');
```

## Debugging

```javascript
// View all data in console
console.log('Unlocked IDs:', CFL.achievements.getUnlocked());
console.log('Unlocked with timestamps:', CFL.achievements.getUnlockedData());
console.log('Stats:', CFL.achievements.getStats());
console.log('All definitions:', CFL.achievements.getAll());
console.log('Progression achievements:', CFL.achievements.getByCategory('progression'));

// Check progress for a specific achievement
var all = CFL.achievements.getAll();
var stats = CFL.achievements.getStats();
console.log('Button clicks progress:', all['button-10'].progress);
console.log('Current clicks:', stats.clicks);

// Reset everything (development only!)
CFL.achievements.reset();
localStorage.removeItem('cflAchievements');
localStorage.removeItem('cflStats');
```

## Progress Tracking

Progression achievements automatically update their progress as users interact:

- **Button clicks**: `first-click`, `button-10`, `button-50`, `button-100`
- **Pages visited**: `explorer` (tracks unique pages)
- **Button types**: `all-buttons` (tracks unique button styles clicked)

Progress is displayed as:
- Visual progress bar (for locked achievements)
- Text overlay showing "current/target" (e.g., "8/10")
- Percentage calculation: `(current / target) * 100`

The progress bar updates in real-time as users interact with the site.

