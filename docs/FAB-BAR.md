# 🎯 Unified Floating Action Bar Documentation

The Unified FAB Bar consolidates all floating action buttons (Settings, Achievements, Sound) into a single expandable horizontal bar at the bottom-right of every page.

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `_layouts/default.html` (lines ~603-760) |
| **CSS Location** | `assets/css/main.css` (lines ~2389-2554) |
| **Purpose** | Single entry point for all quick actions |
| **Layout** | Horizontal bar that expands leftward |

## Architecture

```
.cfl-fab-bar
├── .cfl-fab-bar__main          (Main + button)
│   └── .cfl-fab-bar__main-icon (Rotates 45° when open)
├── .cfl-fab-bar__items          (Container for action buttons)
│   ├── .cfl-fab-bar__item--settings     (⚙️ Settings)
│   ├── .cfl-fab-bar__item--achievements (🏆 Achievements)
│   └── .cfl-fab-bar__item--sound        (🔊/🔇 Sound toggle)
└── .cfl-fab-bar--open           (Expanded state)
```

## Components

### Main FAB Button

- **Icon**: `+` (rotates to `×` when open)
- **Position**: Rightmost element
- **Size**: 52px × 52px
- **Color**: Accent gradient
- **Behavior**: Toggles `.cfl-fab-bar--open` class

### Settings Button

- **Icon**: ⚙️
- **Action**: Opens/closes the settings widget orbit menu
- **Integration**: Works with existing `#cfl-settings` widget

### Achievements Button

- **Icon**: 🏆
- **Color**: Gold gradient (distinctive)
- **Action**: Opens achievement panel
- **Notification**: Red dot appears when new achievements unlocked

### Sound Toggle Button

- **Icon**: 🔊 (enabled) / 🔇 (disabled)
- **Action**: Toggles `CFL.sounds.setEnabled()`
- **State**: `data-enabled="true|false"` attribute

## Visual States

### Collapsed (Default)

```
[+]  (only main button visible)
```

### Expanded

```
[+] [⚙️] [🏆] [🔊]
     ↑    ↑    ↑
   Settings Achievements Sound
```

Items slide in from right with staggered delays (0s, 0.05s, 0.1s).

## CSS Classes

| Class | Purpose |
|-------|---------|
| `.cfl-fab-bar` | Container (flex, row-reverse) |
| `.cfl-fab-bar--open` | Expanded state |
| `.cfl-fab-bar__main` | Main + button |
| `.cfl-fab-bar__main-icon` | Icon that rotates |
| `.cfl-fab-bar__items` | Container for action buttons |
| `.cfl-fab-bar__item` | Individual action button |
| `.cfl-fab-bar__item--settings` | Settings button |
| `.cfl-fab-bar__item--achievements` | Achievements button (gold) |
| `.cfl-fab-bar__item--sound` | Sound toggle button |
| `.cfl-fab-bar__label` | Tooltip on hover |

## Positioning

```css
.cfl-fab-bar {
    position: fixed;
    bottom: 1rem;      /* 16px from bottom */
    right: 1rem;       /* 16px from right */
    z-index: 9999;     /* Above most content */
}
```

## Animations

### Main Button

- **Hover**: Scale 1.1, enhanced shadow
- **Icon Rotation**: 0° → 45° when open (cubic-bezier easing)

### Items Container

- **Collapsed**: `opacity: 0`, `translateX(20px)`, `pointer-events: none`
- **Expanded**: `opacity: 1`, `translateX(0)`, `pointer-events: auto`
- **Transition**: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) (bouncy)

### Staggered Entry

Items appear with slight delays:
- Item 1: 0s
- Item 2: 0.05s
- Item 3: 0.1s
- Item 4: 0.15s

## Tooltips

Each item shows a label on hover:

```html
<span class="cfl-fab-bar__label">Settings</span>
```

- **Position**: Above button, centered
- **Style**: Dark background, white text, rounded
- **Animation**: Fade in on hover

## JavaScript Integration

### Initialization

```javascript
(function createUnifiedFabBar() {
    // Creates FAB bar structure
    // Wires up click handlers
    // Integrates with existing systems
})();
```

### Main Toggle

```javascript
mainBtn.addEventListener('click', function() {
    fabBar.classList.toggle('cfl-fab-bar--open');
    CFL.sounds.click();
});
```

### Click Outside to Close

```javascript
document.addEventListener('click', function(e) {
    if (!fabBar.contains(e.target) && fabBar.classList.contains('cfl-fab-bar--open')) {
        fabBar.classList.remove('cfl-fab-bar--open');
    }
});
```

### Settings Integration

```javascript
settingsItem.addEventListener('click', function(e) {
    e.stopPropagation();
    var settingsWidget = document.getElementById('cfl-settings');
    
    // Show if hidden
    if (settingsWidget.classList.contains('cfl-settings--hidden')) {
        settingsWidget.classList.remove('cfl-settings--hidden');
    }
    
    // Toggle orbit menu
    settingsWidget.classList.toggle('cfl-settings--open');
    
    fabBar.classList.remove('cfl-fab-bar--open');
    CFL.sounds.pop();
});
```

## Accessibility

- **ARIA Labels**: Main button has `aria-label="Toggle quick actions menu"`
- **Keyboard**: All buttons are focusable
- **Focus States**: Visible outline on focus
- **Screen Readers**: Labels provide context

## Responsive Behavior

The FAB bar maintains its position on all screen sizes. On mobile:
- Items may overlap slightly if screen is narrow
- Touch targets remain 44px minimum
- Tooltips may be cut off (acceptable trade-off)

## Migration from Old System

The old standalone buttons are hidden:

```css
.cfl-achievements-btn,
.cfl-sound-toggle {
    display: none !important;
}
```

Settings widget repositioned to work with FAB bar:

```css
.cfl-settings {
    bottom: 80px !important;  /* Above FAB bar */
    right: 1rem !important;
}
```

## Adding New Actions

1. Create button element:

```javascript
var newItem = document.createElement('button');
newItem.className = 'cfl-fab-bar__item cfl-fab-bar__item--new';
newItem.innerHTML = '🆕<span class="cfl-fab-bar__label">New Action</span>';
```

2. Add click handler:

```javascript
newItem.addEventListener('click', function(e) {
    e.stopPropagation();
    // Do something
    fabBar.classList.remove('cfl-fab-bar--open');
});
```

3. Append to items container:

```javascript
itemsContainer.appendChild(newItem);
```

4. Update CSS stagger delays if needed.

## Design Rationale

1. **Consolidation** - Reduces visual clutter from multiple floating buttons
2. **Discoverability** - Single entry point makes features easier to find
3. **Consistency** - Matches Material Design FAB pattern
4. **Progressive Disclosure** - Actions hidden until needed
5. **Touch-Friendly** - Large targets, good spacing
