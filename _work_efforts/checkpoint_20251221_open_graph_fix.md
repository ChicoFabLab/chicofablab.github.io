# Checkpoint Continuation Prompt

**Date:** 2025-12-21
**Project:** chicofablab.github.io (CFL Wiki)
**Last Commit:** `af35f24`

---

## Copy/paste this into a new chat:

```
## Project Context: CFL Wiki (chicofl.org)

Jekyll site for Chico Fab Lab community makerspace wiki.

**Repos:**
- Upstream (live): ChicoFabLab/chicofablab.github.io
- Fork: ctavolazzi/chicofablab.github.io
- Local: /Users/ctavolazzi/Code/chicofablab.github.io-1

**Current State (2025-12-21):**
- All repos synced at commit `af35f24`
- Working tree clean
- Site live at https://chicofl.org

---

## Session Summary: Open Graph Fix

**Problem:** When sharing chicofl.org from Chrome (iPhone → Android), the preview showed "localhost:4000" and the image didn't display.

**Root Causes & Fixes:**
1. `_config.yml` had `url: "http://localhost:4000"` → Changed to `url: "https://chicofl.org"`
2. `_includes/seo.html` used WebP image format → Changed to PNG for Android compatibility

**Files Modified:**
- `_config.yml` - Production URL
- `_includes/seo.html` - og:image format (WebP → PNG)

**Verification:**
- og:url: https://chicofl.org/ ✅
- og:image: https://chicofl.org/assets/img/cfl-logo.png ✅
- canonical: https://chicofl.org/ ✅

**Work Effort:** `_work_efforts/10-19_category/10_subcategory/10.07_20251221_open_graph_url_fix.md`

---

## Key Architecture Notes

**SEO/Open Graph:**
- Custom `_includes/seo.html` generates all og:* meta tags
- Uses `site.url` from `_config.yml`
- Page-specific images via `image:` front matter (none currently set)

**Deployment:**
- GitHub Pages from upstream repo
- Changes to fork require PR or direct push to upstream
- Both remotes configured: `origin` (fork) and `upstream` (live)

---

## Pending/Future Work

1. **Page-specific preview images** - Can add `image:` to front matter for different pages
2. **Technical debt docs** - Updated but may need review
3. **CSS/JS modularization** - Work effort 10.06 (active)

---

## Useful Commands

```bash
# Verify all repos synced
git status && echo "Origin: $(gh api repos/ctavolazzi/chicofablab.github.io/commits/main --jq '.sha[:7]')" && echo "Upstream: $(gh api repos/ChicoFabLab/chicofablab.github.io/commits/main --jq '.sha[:7]')"

# Check live site meta tags
curl -s https://chicofl.org/ | grep -E "(og:url|og:image|canonical)"

# Push to both remotes
git push origin main && git push upstream main
```
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Site URL | https://chicofl.org |
| Upstream Repo | ChicoFabLab/chicofablab.github.io |
| Fork Repo | ctavolazzi/chicofablab.github.io |
| Last Commit | af35f24 |
| Config File | _config.yml |
| SEO Include | _includes/seo.html |
| Work Effort | 10.07_20251221_open_graph_url_fix.md |
