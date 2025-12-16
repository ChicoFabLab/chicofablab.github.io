---
title: Components
---

# CFL Component Library

A comprehensive set of reusable UI components for the CFL Wiki. All components use the `cfl-` namespace and follow BEM naming conventions.

**Styles:** `assets/css/main.css` (search for "CFL COMPONENT LIBRARY")
**Showcase:** [View all components in action →](/wiki/component-showcase)

---

## Button

Versatile button/link component with multiple variants and sizes.

```liquid
{% include components/button.html text="Primary" variant="primary" href="/page" %}
{% include components/button.html text="Submit" type="submit" variant="secondary" %}
{% include components/button.html text="Download" icon="⬇️" variant="primary" href="#" %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `text` / `label` | "Button" | Any string |
| `href` / `url` | — | URL (renders `<a>`) |
| `type` | "button" | "button", "submit", "reset" |
| `variant` | "primary" | primary, secondary, ghost, danger, success |
| `size` | "md" | sm, md, lg |
| `block` | false | true (full width) |
| `icon` | — | Emoji/text (left side) |
| `icon_right` | — | Emoji/text (right side) |
| `target` | — | "_blank", etc. |
| `rel` | — | "noopener", etc. |

---

## Alert

Notification boxes for important messages.

```liquid
{% include components/alert.html variant="info" title="Note" body="This is **markdown**." %}
{% include components/alert.html variant="warning" icon="⚠️" body="Be careful!" dismissible=true %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `variant` | "info" | info, success, warning, danger |
| `title` | — | String |
| `body` / `content` | — | Markdown string |
| `icon` | — | Emoji/text |
| `dismissible` | false | true (shows × button) |

---

## Badge

Small status indicators and labels.

```liquid
{% include components/badge.html text="New" variant="success" %}
{% include components/badge.html text="Live" variant="danger-solid" dot=true pulse=true %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `text` / `label` | "Badge" | Any string |
| `variant` | "neutral" | neutral, info, success, warning, danger, *-solid |
| `size` | "md" | sm, md, lg |
| `dot` | false | true (shows status dot) |
| `pulse` | false | true (pulsing animation) |

---

## Callout

Highlighted content blocks with optional CTA.

```liquid
{% include components/callout.html variant="tip" title="Pro Tip" body="Check this out!" %}
{% include components/callout.html variant="note" title="Info" body="Details here." cta_url="/page" cta_label="Learn More" %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `variant` | "note" | note, tip, warning, danger |
| `title` | — | String |
| `body` / `content` | — | Markdown string |
| `icon` | — | Emoji/text |
| `cta_url` | — | URL for button |
| `cta_label` | "Learn more" | Button text |
| `cta_variant` | "primary" | Button variant |

---

## Progress

Visual progress indicators with animations.

```liquid
{% include components/progress.html value=75 label="Loading" show_value=true %}
{% include components/progress.html value=50 variant="warning" striped=true animated=true %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `value` | 0 | Number (0-100) |
| `max` | 100 | Number |
| `label` | — | String |
| `variant` | "primary" | primary, info, success, warning, danger |
| `size` | "md" | sm, md, lg |
| `show_value` | false | true (shows percentage) |
| `striped` | false | true (striped pattern) |
| `animated` | false | true (moving stripes) |

---

## Stat

Display key metrics with optional trends.

```liquid
{% include components/stat.html value="1,247" label="Members" %}
{% include components/stat.html value="99" suffix="%" label="Uptime" trend="+2%" trend_up=true %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `value` | "0" | Number/string |
| `label` | "Stat" | String |
| `prefix` | — | String (before value) |
| `suffix` | — | String (after value) |
| `trend` | — | String (e.g., "+12%") |
| `trend_up` | true | false for downward trend |

---

## Avatar

User/entity representation with status indicators.

```liquid
{% include components/avatar.html initials="JD" size="md" %}
{% include components/avatar.html src="/path/to/image.jpg" status="online" ring=true %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `src` / `image` | — | Image URL |
| `initials` | — | 1-2 characters |
| `alt` / `name` | "Avatar" | Alt text |
| `size` | "md" | sm, md, lg, xl |
| `status` | — | online, away, busy, offline |
| `ring` | false | true (accent ring) |

---

## Card

Clickable content cards with images and badges.

```liquid
{% include components/card.html title="Project" body="Description here." href="/link" %}
{% include components/card.html title="Featured" body="Content." image="/img.jpg" badge="New" badge_variant="success" %}
```

| Parameter | Default | Options |
|-----------|---------|---------|
| `title` | — | String |
| `body` / `content` | — | String (truncated to 120 chars) |
| `href` / `url` | — | URL (makes card clickable) |
| `image` | — | Image URL |
| `variant` | "default" | default |
| `badge` | — | Badge text |
| `badge_variant` | "neutral" | Badge variant |

---

## Utility Classes

Additional CSS utilities for common patterns:

| Class | Description |
|-------|-------------|
| `.cfl-shimmer` | Loading skeleton animation |
| `.cfl-fade-in` | Fade-in on scroll (needs JS) |
| `.showcase-row` | Flexbox row for component demos |
| `.showcase-stats` | Grid layout for stat cards |
| `.showcase-cards` | Grid layout for card components |
