# 🔊 Sound System Documentation

The CFL Sound System provides Web Audio API-powered sound effects for interactive elements. All sounds are synthesized in real-time—no audio files needed.

## Overview

| Feature | Description |
|---------|-------------|
| **Location** | `_layouts/default.html` (lines ~180-335) |
| **Global Object** | `CFL.sounds` |
| **Storage Keys** | `cflSoundsEnabled`, `cflSoundsVolume` |
| **Default State** | Enabled, 30% volume |

## Architecture

```
CFL.sounds
├── audioContext      (Web Audio API context, lazy-initialized)
├── playTone()        (Internal: generates oscillator tones)
├── playNoise()       (Internal: generates filtered noise)
├── Basic Sounds      (click, pop, success, error, hover, whoosh, ding)
├── Fun Sounds        (boing, zap, magic, coin, powerup, glitch, laser, explosion, eldritch)
└── Settings          (setEnabled, setVolume, isEnabled, getVolume)
```

## Available Sounds

### Basic Sounds

| Sound | Method | Description | Use Case |
|-------|--------|-------------|----------|
| Click | `CFL.sounds.click()` | Quick 800Hz sine blip | Default button click |
| Pop | `CFL.sounds.pop()` | Two-tone pop (600Hz + 900Hz) | Opening menus, selections |
| Success | `CFL.sounds.success()` | Ascending C-E-G triad | Successful actions |
| Error | `CFL.sounds.error()` | Descending sawtooth | Failed actions |
| Hover | `CFL.sounds.hover()` | Subtle 1200Hz blip | Mouse hover (30% chance) |
| Whoosh | `CFL.sounds.whoosh()` | Sine + noise sweep | Transitions, slides |
| Ding | `CFL.sounds.ding()` | High C bell tone | Notifications |

### Fun Sounds

| Sound | Method | Description | Use Case |
|-------|--------|-------------|----------|
| Boing | `CFL.sounds.boing()` | Springy pitch sweep | Bouncy/rubber buttons |
| Zap | `CFL.sounds.zap()` | High-to-low sawtooth | Neon/electric buttons |
| Magic | `CFL.sounds.magic()` | 5-note ascending arpeggio | Rainbow/holo buttons |
| Coin | `CFL.sounds.coin()` | Retro pickup sound | 3D/pixel buttons, achievements |
| Powerup | `CFL.sounds.powerup()` | 6-note ascending scale | Major achievements, Konami |
| Glitch | `CFL.sounds.glitch()` | Random frequency bursts | Glitch/VHS buttons |
| Laser | `CFL.sounds.laser()` | Descending sawtooth sweep | Sci-fi elements |
| Explosion | `CFL.sounds.explosion()` | Low tone + noise burst | Fire/danger buttons |
| Eldritch | `CFL.sounds.eldritch()` | Dissonant low drones | Void/eldritch buttons |

## Usage Examples

### Manual Sound Playback

```javascript
// Play a sound directly
CFL.sounds.magic();

// Chain with actions
document.querySelector('#myButton').addEventListener('click', function() {
    CFL.sounds.coin();
    // ... do something
});
```

### Settings Control

```javascript
// Toggle sounds on/off
CFL.sounds.setEnabled(true);
CFL.sounds.setEnabled(false);

// Check if enabled
if (CFL.sounds.isEnabled()) {
    console.log('Sounds are on!');
}

// Adjust volume (0.0 to 1.0)
CFL.sounds.setVolume(0.5);  // 50% volume

// Get current volume
var vol = CFL.sounds.getVolume();  // Returns 0.0-1.0
```

## Auto-Attachment

Sounds automatically attach to `.cfl-btn` buttons based on their classes:

| Button Class | Sound Played |
|--------------|--------------|
| `--rainbow` | `magic()` |
| `--holo`, `--aurora` | `magic()` |
| `--bouncy`, `--rubber` | `boing()` |
| `--neon`, `--electric` | `zap()` |
| `--glitch`, `--vhs`, `--static` | `glitch()` |
| `--3d`, `--pixel` | `coin()` |
| `--eldritch` | `eldritch()` |
| `--confetti`, `--party` | `powerup()` |
| `--portal`, `--spin` | `whoosh()` |
| `--fire`, `--lava` | `explosion()` |
| `--danger` | `error()` |
| `--success` | `success()` |
| (default) | `click()` |

## UI Controls

A floating sound toggle button appears at bottom-right of every page:

- **Icon**: 🔊 (enabled) / 🔇 (disabled)
- **Position**: `bottom: 100px; right: 80px`
- **CSS Class**: `.cfl-sound-toggle`

## Technical Details

### Web Audio API Flow

```
playTone(frequency, type, duration, volumeMod)
    │
    ├── Create OscillatorNode
    │   └── Set frequency & waveform type
    │
    ├── Create GainNode
    │   └── Set initial volume
    │   └── Schedule exponential ramp to 0
    │
    └── Connect: Oscillator → Gain → Destination
        └── Start oscillator
        └── Schedule stop
```

### Waveform Types

- `sine` - Pure tone, mellow
- `square` - Hollow, retro/8-bit
- `sawtooth` - Bright, buzzy
- `triangle` - Soft, flute-like

### LocalStorage

```javascript
// Keys used
localStorage.getItem('cflSoundsEnabled')  // 'true' or 'false'
localStorage.getItem('cflSoundsVolume')   // '0.3' (float as string)
```

## Accessibility

- **Hover sounds** only trigger 30% of the time to prevent annoyance
- **Sounds can be disabled** via toggle button or `CFL.sounds.setEnabled(false)`
- **Volume defaults to 30%** to avoid startling users
- **No sounds play** if browser blocks autoplay (requires user interaction first)

## Browser Support

Requires Web Audio API support:
- Chrome 35+
- Firefox 25+
- Safari 14.1+
- Edge 79+

Falls back gracefully if unsupported (sounds simply don't play).
