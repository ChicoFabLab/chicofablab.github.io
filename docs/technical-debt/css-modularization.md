# CSS Modularization

## Current State

The entire site's CSS lives in a single file: `assets/css/main.css` (~7,000+ lines).

### Problems

1. **File size**: Single large file is harder to navigate and maintain
2. **No code splitting**: All CSS loads on every page, even if unused
3. **Merge conflicts**: Multiple developers editing one file causes conflicts
4. **Mental overhead**: Hard to find relevant styles quickly
5. **No separation of concerns**: Component styles mixed with layout, utilities, themes

### Current Structure (approximate)

```
main.css (~7,000 lines)
├── CSS Variables / Tokens (~50 lines)
├── Reset / Base (~50 lines)
├── Marquee (~40 lines)
├── Header (~50 lines)
├── Hero (~100 lines)
├── Layout (~200 lines)
├── Typography (~100 lines)
├── Cards (~200 lines)
├── Buttons (~500+ lines including fun variants)
├── Forms (~300 lines)
├── Components (~2,000+ lines)
│   ├── Alerts, Badges, Callouts
│   ├── Tables, Tabs, Tooltips
│   ├── Progress, Spinners
│   └── Settings widget
├── Fun/Interactive styles (~1,500+ lines)
│   ├── Achievement system
│   ├── Easter eggs
│   ├── Animations
│   └── Konami mode
├── Utilities (~500 lines)
└── Responsive (~500 lines)
```

## Impact

- **Performance**: Medium - All CSS loads regardless of page needs
- **Maintainability**: High - Difficult to work with large single file
- **Developer Experience**: High - Finding styles is time-consuming

## Proposed Solution

### Option A: CSS Modules / Partials (Recommended)

Split into logical partials that Jekyll concatenates:

```
assets/css/
├── main.css              # Import manifest
├── _variables.css        # Design tokens
├── _reset.css            # Normalize/reset
├── _typography.css       # Font styles
├── _layout.css           # Grid, containers
├── _components/
│   ├── _buttons.css
│   ├── _cards.css
│   ├── _forms.css
│   ├── _alerts.css
│   └── ...
├── _utilities.css        # Helper classes
└── _fun.css              # Easter eggs, achievements
```

**Pros**: Clean separation, easier maintenance
**Cons**: Jekyll doesn't natively support CSS imports (need build step or manual concatenation)

### Option B: CSS Custom Properties + Scoping

Keep single file but reorganize with clear section markers and use CSS nesting (supported in modern browsers):

```css
/* === BUTTONS === */
.cfl-btn { /* base */ }
.cfl-btn {
  &--primary { }
  &--secondary { }
}
```

**Pros**: No build changes needed
**Cons**: Still one large file

### Option C: Introduce Sass/SCSS

Use Jekyll's built-in Sass support:

```
_sass/
├── _variables.scss
├── _mixins.scss
├── components/
│   ├── _buttons.scss
│   └── ...
└── main.scss
```

**Pros**: Powerful features (mixins, nesting), standard approach
**Cons**: Adds build complexity, learning curve

## Recommended Approach

**Phase 1**: Option B - Reorganize current file with clear sections
**Phase 2**: Option C - Migrate to Sass when ready for build tooling

## Tasks

- [ ] Audit current CSS and map all sections
- [ ] Add clear section comments and TOC at top of file
- [ ] Group related styles together
- [ ] Identify unused/dead CSS
- [ ] Extract reusable variables/tokens
- [ ] Consider Sass migration path

## Estimated Effort

**Large** (1-3 days for full reorganization)

## Dependencies

- None blocking, but coordinate with any active style changes

## References

- `assets/css/main.css` - Current stylesheet
- `assets/css/archive/` - Previous versions for reference
- [Jekyll Sass docs](https://jekyllrb.com/docs/assets/#sassscss)

