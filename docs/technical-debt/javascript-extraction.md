# JavaScript Extraction

## Current State

All site JavaScript (~1,100+ lines) is embedded inline in `_layouts/default.html` within a single `<script>` tag.

### Current Inline Systems

1. **Void Corruption Check** (~15 lines) - Easter egg persistence
2. **Sound Effects System** (~150 lines) - Web Audio API tones
3. **Achievement System** (~120 lines) - Gamification tracking
4. **Konami Code** (~35 lines) - Easter egg detection
5. **Button Sound Hooks** (~40 lines) - Auto-attach sounds
6. **Achievement Panel UI** (~70 lines) - Trophy display
7. **Easter Egg Hunt** (~50 lines) - Hidden collectibles
8. **Code Snippet Copy** (~25 lines) - Copy buttons
9. **Search Clear** (~15 lines) - Input clearing
10. **Tabs Functionality** (~30 lines) - Tab switching
11. **Toast System** (~100 lines) - Notifications
12. **Slider/Rating/Color** (~50 lines) - Form widgets
13. **File Upload** (~20 lines) - Drag and drop
14. **Settings Widget** (~400 lines) - Font/theme switcher

### Problems

1. **No separation of concerns**: Layout file handles both structure AND behavior
2. **Not testable**: Inline JS can't be unit tested
3. **No caching**: Script re-downloads with every page (no browser caching)
4. **Hard to maintain**: Finding specific functionality requires scrolling
5. **No tree shaking**: All code loads even if page doesn't use it
6. **Global namespace pollution**: Everything on `window.CFL`
7. **Can't use modules**: No ES6 import/export capability

## Impact

- **Performance**: Medium - No caching, all JS loads on every page
- **Maintainability**: High - Very difficult to work with
- **Developer Experience**: High - Can't use modern tooling
- **Testing**: High - Impossible to unit test

## Proposed Solution

### Phase 1: Extract to External File (Quick Win)

Move all JS to `assets/js/main.js`:

```html
<!-- In default.html -->
<script src="/assets/js/main.js"></script>
```

**Benefits**: Browser caching, cleaner layout file
**Effort**: Small (1-2 hours)

### Phase 2: Modularize (Recommended)

Split into logical modules:

```
assets/js/
├── main.js              # Entry point, initializes all
├── sounds.js            # Web Audio system
├── achievements.js      # Gamification
├── settings.js          # Font/theme widget
├── toasts.js            # Notification system
├── components/
│   ├── tabs.js
│   ├── search.js
│   └── forms.js
└── easter-eggs/
    ├── konami.js
    ├── void.js
    └── eggs.js
```

**Pattern**: Use IIFE or revealing module pattern for compatibility:

```javascript
// sounds.js
window.CFL = window.CFL || {};
CFL.sounds = (function() {
    // Private
    var audioContext = null;

    // Public API
    return {
        click: function() { /* ... */ },
        setEnabled: function(val) { /* ... */ }
    };
})();
```

### Phase 3: Modern Build (Future)

If/when adding a build step:
- Use ES6 modules
- Bundle with esbuild/rollup
- Tree shaking for unused code
- TypeScript for type safety

## Tasks

- [ ] **Phase 1**: Extract inline JS to `assets/js/main.js`
- [ ] Test all functionality after extraction
- [ ] **Phase 2**: Identify module boundaries
- [ ] Extract sounds system to separate file
- [ ] Extract achievements system
- [ ] Extract settings widget
- [ ] Extract toast system
- [ ] Extract component JS (tabs, forms, etc.)
- [ ] Extract easter eggs
- [ ] Create initialization order in main.js
- [ ] Document JS architecture

## Estimated Effort

- **Phase 1**: Small (1-2 hours)
- **Phase 2**: Large (1-2 days)
- **Phase 3**: XL (depends on tooling decisions)

## Dependencies

- Should coordinate with any active feature work
- Settings widget has localStorage dependencies (test persistence)
- Achievement system has cross-page state

## References

- `_layouts/default.html` lines 161-1293 - Current inline JS
- [Jekyll JS assets](https://jekyllrb.com/docs/assets/)

## Notes

The current code is well-organized with clear section comments. The main issue is location (inline) not quality. Extraction should be straightforward.


