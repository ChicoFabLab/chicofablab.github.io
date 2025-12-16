# 🎨 Button Playground Documentation

The Button Playground is an interactive tool for composing custom buttons by mixing styles, sizes, variants, and icons. Users can experiment with combinations and copy the generated code.

## Overview

| Feature | Description |
|---------|-------------|
| **Page Location** | `_wiki/button-playground.mkd` |
| **URL** | `/wiki/button-playground` |
| **Purpose** | Visual button builder with code export |

## Interface Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                      🎨 Button Playground                           │
├─────────────────────┬───────────────────────────────────────────────┤
│   PALETTE           │              CANVAS                           │
│                     │                                               │
│   Fun Style         │       ┌─────────────────────┐                 │
│   [Rainbow] [Holo]  │       │                     │                 │
│   [Bouncy] [Neon]   │       │   [🚀 Click Me]     │                 │
│   ...               │       │                     │                 │
│                     │       └─────────────────────┘                 │
│   Base Variant      │                                               │
│   [Primary] [Ghost] │       ┌─────────────────────────────────────┐ │
│   ...               │       │ <button class="cfl-btn cfl-btn--   │ │
│                     │       │ rainbow cfl-btn--md">🚀 Click Me   │ │
│   Size              │       │ </button>                           │ │
│   [Sm] [Md] [Lg]    │       └─────────────────────────────────────┘ │
│                     │                                               │
│   Icon              │       [📋 Copy Code]                          │
│   [None] [🚀] [❤️]  │                                               │
│   ...               │                                               │
│                     │                                               │
│   Button Text       │                                               │
│   [____________]    │                                               │
│                     │                                               │
│   [🎲 Randomize!]   │                                               │
│                     │                                               │
└─────────────────────┴───────────────────────────────────────────────┘
```

## Features

### Style Options

| Category | Options |
|----------|---------|
| **Fun Style** | None, Rainbow, Holo, Bouncy, Wiggle, Liquid, Neon, Pulse, 3D, Pixel, Glitch, Fire, Ice, Aurora, Disco, Portal, Casino, Eldritch |
| **Base Variant** | Default, Primary, Secondary, Ghost, Success, Danger |
| **Size** | Small (sm), Medium (md), Large (lg) |
| **Icon** | None, 🚀, ⬇️, ❤️, ⚡, 🎉, ✨, 🔥, 👁️ |
| **Text** | Custom text input |

### Randomize Function

The 🎲 Randomize button picks random values for all options, creating unexpected combinations. Great for inspiration!

### Dark Background Detection

The preview automatically switches to a dark background when these styles are selected:
- `neon`
- `glitch`
- `eldritch`
- `aurora`
- `cyber`

### Code Output

Generated code is displayed in a styled code block:

```html
<button class="cfl-btn cfl-btn--rainbow cfl-btn--md">🚀 Click Me</button>
```

The copy button uses the Clipboard API to copy the raw HTML.

## JavaScript Implementation

### State Object

```javascript
var state = {
    style: '',      // Fun style (rainbow, bouncy, etc.)
    variant: '',    // Base variant (primary, ghost, etc.)
    size: 'md',     // Size (sm, md, lg)
    icon: '',       // Left icon emoji
    text: 'Click Me'
};
```

### Update Preview Function

```javascript
function updatePreview() {
    // Build class list
    var classes = ['cfl-btn'];
    if (state.variant) classes.push('cfl-btn--' + state.variant);
    if (state.style) classes.push('cfl-btn--' + state.style);
    classes.push('cfl-btn--' + state.size);

    // Apply to preview button
    previewBtn.className = classes.join(' ');
    previewBtn.innerHTML = (state.icon ? state.icon + ' ' : '') + state.text;

    // Handle dark background for neon buttons
    var preview = document.getElementById('playground-preview');
    if (['neon', 'glitch', 'eldritch', 'aurora', 'cyber'].includes(state.style)) {
        preview.style.background = '#1a1a2e';
    } else {
        preview.style.background = '';
    }

    // Update code output
    var code = '<button class="' + classes.join(' ') + '">';
    code += (state.icon ? state.icon + ' ' : '') + state.text;
    code += '</button>';
    codeOutput.innerHTML = code;  // Uses &lt; &gt; entities
}
```

### Option Selection

```javascript
document.querySelectorAll('.playground-options').forEach(function(group) {
    var groupName = group.getAttribute('data-group');
    group.querySelectorAll('.playground-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            // Remove selection from siblings
            group.querySelectorAll('.playground-option').forEach(function(o) {
                o.classList.remove('is-selected');
            });
            // Add selection to clicked
            opt.classList.add('is-selected');
            // Update state
            state[groupName] = opt.getAttribute('data-value');
            updatePreview();

            // Play sound
            if (window.CFL && CFL.sounds) CFL.sounds.pop();
        });
    });
});
```

## CSS Classes

### Layout

| Class | Purpose |
|-------|---------|
| `.playground-container` | CSS Grid: 300px palette + 1fr canvas |
| `.playground-palette` | Left sidebar with options |
| `.playground-canvas` | Right area with preview |
| `.playground-preview` | White card containing the button |
| `.playground-code` | Dark code display area |

### Interactive

| Class | Purpose |
|-------|---------|
| `.playground-option` | Individual option button |
| `.playground-option.is-selected` | Currently selected option |
| `.playground-palette-section` | Groups of related options |
| `.playground-copy-btn` | Copy to clipboard button |

### Responsive

At 768px and below, the grid becomes single-column:

```css
@media (max-width: 768px) {
    .playground-container {
        grid-template-columns: 1fr;
    }
}
```

## Sound Integration

The playground integrates with the CFL sound system:

| Action | Sound |
|--------|-------|
| Option click | `CFL.sounds.pop()` |
| Randomize | `CFL.sounds.magic()` |
| Copy code | `CFL.sounds.success()` |
| Preview click | (whatever button's sound is) |

## Toast Notifications

| Action | Toast |
|--------|-------|
| Randomize | "🎲 Randomized! New button combo generated!" |
| Preview click | "{icon} Button Clicked! Your custom button is working!" |
| Copy | Button text changes to "✅ Copied!" |

## Extending the Playground

### Add New Style Option

In `_wiki/button-playground.mkd`:

```html
<div class="playground-options" data-group="style">
    <!-- ... existing options ... -->
    <button class="playground-option" data-value="newstyle">🆕 New Style</button>
</div>
```

### Add New Icon Option

```html
<div class="playground-options" data-group="icon">
    <!-- ... existing options ... -->
    <button class="playground-option" data-value="🆕">🆕</button>
</div>
```

### Add Randomize Variants

In the `randomBtn` click handler:

```javascript
var styles = [
    '', 'rainbow', 'holo', /* ... */,
    'newstyle'  // Add new style here
];
```

## Accessibility

- All options are keyboard-focusable buttons
- Selected state is visually distinct (accent background)
- Code output is in a `<code>` element for semantic meaning
- Preview button is fully interactive

## Use Cases

1. **Learning** - Understand available button options
2. **Prototyping** - Quickly test combinations
3. **Code Generation** - Copy-paste ready code
4. **Inspiration** - Use randomize for ideas
5. **Documentation** - Show what's possible

## Link from Component Showcase

The Fun Buttons Gallery includes a callout linking to the playground:

```html
<div class="cfl-callout cfl-callout--info">
    <strong>🎨 Try the Button Playground!</strong>
    Mix and match styles to create your perfect button.
    <a href="/wiki/button-playground" class="cfl-btn cfl-btn--rainbow cfl-btn--sm">
        Open Playground →
    </a>
</div>
```

