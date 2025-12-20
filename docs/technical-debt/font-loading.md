# Font Loading Optimization

## Current State

The site loads **11+ Google Fonts** on every page via two `<link>` tags in `_layouts/default.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Caprasimo&family=Chonburi&family=DM+Serif+Display&family=Abril+Fatface&family=Bricolage+Grotesque:wght@400;600;700&family=Calistoga&family=Varela+Round&family=Fredoka:wght@400;600&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

### Fonts Loaded

**Always used:**
- Inter (400, 500, 600, 700) - UI text
- JetBrains Mono (400, 700) - Code

**Optional (settings widget):**
- Fraunces (400, 600, 700)
- Caprasimo
- Chonburi
- DM Serif Display
- Abril Fatface
- Bricolage Grotesque (400, 600, 700)
- Calistoga
- Varela Round
- Fredoka (400, 600)
- Nunito (400, 600, 700)

### Problems

1. **Large payload**: Each font family adds ~20-100KB
2. **Render blocking**: Fonts block first paint
3. **Unused fonts**: 9 fonts only used if user switches via settings
4. **Multiple requests**: Two separate Google Fonts requests
5. **FOUT/FOIT**: Flash of unstyled/invisible text during load

## Impact

- **Performance**: High - Significant page load impact
- **Maintainability**: Low - Simple to change
- **Developer Experience**: Low - Not a DX issue

## Proposed Solution

### Option A: Lazy Load Optional Fonts (Recommended)

Only load the core fonts initially, lazy-load others when user opens settings:

```javascript
// In settings.js - load font on demand
function loadFont(fontName) {
    if (document.querySelector(`link[data-font="${fontName}"]`)) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.font = fontName;
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
    document.head.appendChild(link);
}
```

**Pros**: Only loads what's needed
**Cons**: Slight delay when switching fonts first time

### Option B: Self-Host Fonts

Download and serve fonts locally:

```
assets/fonts/
├── inter/
├── jetbrains-mono/
└── ...
```

**Pros**: Full control, no external requests, privacy
**Cons**: More maintenance, need to handle subsetting

### Option C: Font Subsetting

Use Google Fonts `text=` parameter or subset locally:

```html
<!-- Only load characters actually used -->
<link href="https://fonts.googleapis.com/css2?family=Inter&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" rel="stylesheet">
```

**Pros**: Smaller file sizes
**Cons**: Complex if content is dynamic

### Option D: Reduce Font Variants

Audit which weights are actually used:

```css
/* Do we really need all these weights? */
Inter: 400, 500, 600, 700  /* Maybe just 400, 600? */
```

## Recommended Approach

1. **Immediate**: Combine into single Google Fonts request
2. **Short-term**: Lazy load optional fonts (Option A)
3. **Long-term**: Consider self-hosting (Option B)

## Tasks

- [ ] Audit which font weights are actually used in CSS
- [ ] Combine font requests into single `<link>`
- [ ] Add `font-display: swap` to prevent FOIT
- [ ] Implement lazy loading for settings fonts
- [ ] Add preconnect hints for Google Fonts
- [ ] Consider `font-display: optional` for optional fonts
- [ ] Test performance with Lighthouse

## Quick Wins

Add preconnect (already present) and ensure `display=swap`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

## Estimated Effort

- **Combine requests**: Small (30 min)
- **Lazy loading**: Medium (2-4 hours)
- **Self-hosting**: Large (1 day)

## Dependencies

- Settings widget functionality depends on fonts being available
- Need to maintain font switching feature

## References

- `_layouts/default.html` lines 8-11 - Current font loading
- [Google Fonts API](https://developers.google.com/fonts/docs/css2)
- [web.dev Font Best Practices](https://web.dev/font-best-practices/)

## Metrics to Track

Before/after:
- Lighthouse Performance score
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total font payload size




