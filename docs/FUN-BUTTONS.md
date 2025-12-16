# 🎪 Fun Button Styles Documentation

The CFL Fun Button system provides 30+ animated, playful button styles using pure CSS. No JavaScript required for the animations—just add the class!

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `assets/css/main.css` (lines ~730-2200) |
| **Class Prefix** | `.cfl-btn--{style}` |
| **Compatibility** | Works with size classes (`.cfl-btn--sm`, `--md`, `--lg`) |
| **Reduced Motion** | Animations respect `prefers-reduced-motion` |

## Button Categories

### 🌈 Rainbow & Gradient

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--rainbow` | Sliding rainbow gradient | Any background |
| `cfl-btn--holo` | Holographic color shift + shine sweep | Any background |
| `cfl-btn--mood` | Slow mood-ring color transition | Any background |
| `cfl-btn--gradient-border` | Rainbow border, solid center | Any background |

### 🎾 Bouncy & Playful

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--bouncy` | Idle bounce + jello squish on hover | Any background |
| `cfl-btn--wiggle` | Left-right wiggle on hover | Any background |
| `cfl-btn--liquid` | Morphing blob border-radius | Any background |
| `cfl-btn--rubber` | Stretch/squash on hover/click | Any background |
| `cfl-btn--spin` | 360° rotation on hover | Any background |

### 🧘 Organic & Natural

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--breathe` | Gentle scale + glow pulse | Any background |
| `cfl-btn--heartbeat` | Cardiac rhythm pulse | Any background |
| `cfl-btn--bubble` | Iridescent soap bubble float | Any background |
| `cfl-btn--water` | Water droplet wobble | Any background |
| `cfl-btn--lava` | Lava lamp flow + morphing | Any background |

### 🔥 Elements

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--fire` | Flame gradient + floating fire emoji | Any background |
| `cfl-btn--ice` | Frosted glass + snowflake on hover | Any background |
| `cfl-btn--electric` | Lightning bolt animation on hover | **Dark background** |
| `cfl-btn--aurora` | Northern lights wave | **Dark background** |

### ⚡ Neon & Glow

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--neon` | Cyan neon flicker + glow | **Dark background** |
| `cfl-btn--neon-pink` | Magenta neon glow | **Dark background** |
| `cfl-btn--pulse` | Pulsing glow rings | Any background |
| `cfl-btn--disco` | Mirror ball sparkle + hue rotate | **Dark background** |

### 👾 Retro & Digital

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--glitch` | Cyberpunk glitch distortion | **Dark background** |
| `cfl-btn--vhs` | VHS tracking lines + color shift | **Dark background** |
| `cfl-btn--static` | TV static noise overlay | **Dark background** |
| `cfl-btn--cyber` | Cyberpunk cut corners + accent | **Dark background** |
| `cfl-btn--soundwave` | Audio visualizer animation | **Dark background** |

### 🎮 3D & Tactile

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--3d` | Green push-button with shadow | Any background |
| `cfl-btn--3d-red` | Red push-button variant | Any background |
| `cfl-btn--pixel` | Retro 8-bit hard shadows | Any background |
| `cfl-btn--flip` | 3D Y-axis flip on hover | Any background |
| `cfl-btn--sticker` | Peeling corner effect | Any background |

### 📝 Textures & Materials

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--paper` | Lined paper + slight rotation | Any background |
| `cfl-btn--chalk` | Chalkboard texture | Any background |
| `cfl-btn--glass` | Glassmorphism blur | **Colorful background** |

### ✨ Special Effects

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--confetti` | Emoji explosion on click | Any background |
| `cfl-btn--portal` | Spinning vortex hue shift | Any background |
| `cfl-btn--meteor` | Shooting star on hover | Any background |
| `cfl-btn--loading` | Sweeping highlight animation | Any background |
| `cfl-btn--magnetic` | Scale up on hover | Any background |

### 🎰 Fun & Themed

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--casino` | Gold slot machine flash | Any background |
| `cfl-btn--dna` | Spinning DNA helix emoji | Any background |
| `cfl-btn--magnet` | N/S pole split coloring | Any background |
| `cfl-btn--emoji` | Party emoji appear on hover | Any background |
| `cfl-btn--typewriter` | Blinking cursor terminal | Any background |

### 👁️ Eldritch (Handle with Care!)

| Class | Effect | Best On |
|-------|--------|---------|
| `cfl-btn--eldritch` | Cosmic horror corruption | **Dark background** |

## Usage Examples

### Basic Usage

```html
<!-- Single fun style -->
<button class="cfl-btn cfl-btn--rainbow cfl-btn--md">Rainbow Button</button>

<!-- With size variation -->
<button class="cfl-btn cfl-btn--bouncy cfl-btn--lg">Big Bouncy</button>
<button class="cfl-btn cfl-btn--neon cfl-btn--sm">Tiny Neon</button>
```

### Combining with Base Variants

```html
<!-- Fun style + base variant (variant provides fallback colors) -->
<button class="cfl-btn cfl-btn--primary cfl-btn--wiggle cfl-btn--md">
    Wiggly Primary
</button>

<!-- Ghost base + pulse effect -->
<button class="cfl-btn cfl-btn--ghost cfl-btn--pulse cfl-btn--md">
    Pulsing Ghost
</button>
```

### Dark Background Container

```html
<!-- For neon/cyber/glitch buttons -->
<div style="background: #1a1a2e; padding: 2rem; border-radius: 8px;">
    <button class="cfl-btn cfl-btn--neon cfl-btn--md">Neon</button>
    <button class="cfl-btn cfl-btn--glitch cfl-btn--md" data-text="GLITCH">
        Glitch
    </button>
</div>
```

### Glitch Button Data Attribute

The glitch button requires a `data-text` attribute for the glitch effect:

```html
<button class="cfl-btn cfl-btn--glitch cfl-btn--md" data-text="GLITCH">
    GLITCH
</button>
```

## Animation Keyframes Reference

| Animation | Duration | Timing | Used By |
|-----------|----------|--------|---------|
| `rainbow-slide` | 3s (1s hover) | linear | rainbow, gradient-border |
| `holo-shift` | 4s | ease | holo |
| `holo-shine` | 3s | linear | holo |
| `bounce-idle` | 2s | ease-in-out | bouncy |
| `jello` | 0.6s | ease-in-out | bouncy (hover) |
| `wiggle` | 0.5s | ease-in-out | wiggle |
| `morph` | 8s (1s hover) | ease-in-out | liquid |
| `breathe` | 4s | ease-in-out | breathe |
| `heartbeat` | 1.5s | ease-in-out | heartbeat |
| `flame` | 0.5s | ease-in-out | fire |
| `neon-flicker` | 1.5s | alternate | neon |
| `pulse-glow` | 2s (0.5s hover) | ease-in-out | pulse |
| `portal-spin` | 3s (0.5s hover) | linear | portal |
| `eldritch-pulse` | 4s (0.5s hover) | ease-in-out | eldritch |
| `eldritch-warp` | 8s | ease-in-out | eldritch |

## CSS Custom Properties

Some buttons use CSS custom properties that you can override:

```css
/* Example: Custom lava colors */
.my-lava-btn {
    --lava-color-1: #ff0000;
    --lava-color-2: #ff6600;
}
```

## Accessibility Considerations

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    .cfl-btn--rainbow,
    .cfl-btn--bouncy,
    /* ... etc ... */ {
        animation: none !important;
    }
}
```

### Focus States

All fun buttons maintain visible focus outlines:

```css
.cfl-btn:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
```

### Color Contrast

Most buttons maintain WCAG AA contrast ratios. The neon buttons on dark backgrounds are designed for decorative/fun use and may not meet strict contrast requirements.

## Performance Tips

1. **Limit animated buttons** - Too many on one page can cause jank
2. **Use `will-change` sparingly** - Already applied where needed
3. **Avoid on mobile lists** - Animations can drain battery
4. **Test on low-end devices** - Some effects are GPU-intensive

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic animations | ✅ | ✅ | ✅ | ✅ |
| `backdrop-filter` (glass) | ✅ | ✅ | ✅ | ✅ |
| `clip-path` (cyber) | ✅ | ✅ | ✅ | ✅ |
| `mix-blend-mode` | ✅ | ✅ | ✅ | ✅ |

## Live Examples

See all buttons in action:
- [Component Showcase - Fun Buttons Gallery](/wiki/component-showcase#fun-buttons-gallery)
- [Button Playground](/wiki/button-playground) - Build your own combinations

