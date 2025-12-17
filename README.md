---
layout: default
title: README
---

# How to Contribute

Repository: [https://github.com/ChicoFabLab/chicofablab.github.io](https://github.com/ChicoFabLab/chicofablab.github.io)

---

## Using the Component Library

This wiki includes a reusable component library for consistent, polished UI elements.

### Quick Start

Add components to any wiki page using Liquid includes:

```liquid
{% include components/button.html
   text="Get Started"
   variant="primary"
   href="/wiki/getting-started"
%}

{% include components/alert.html
   variant="info"
   title="Welcome"
   body="Check out our **equipment guide**!"
%}
```

### Available Components

| Component | Use For |
|-----------|---------|
| **Button** | Links, actions, CTAs |
| **Alert** | Notifications, status messages |
| **Badge** | Labels, status indicators |
| **Callout** | Highlighted tips, warnings |
| **Progress** | Loading, completion status |
| **Stat** | Key metrics, numbers |
| **Avatar** | User/entity representation |
| **Card** | Clickable content previews |

### Resources

- **[Component Showcase](/wiki/component-showcase)** - Live examples with copy-paste code
- **[Components Documentation](/wiki/components)** - Full API reference

---

## If you're in the ChicoFabLab organization

You can directly commit markdown files:

1. Go to the `_wiki/` folder on GitHub
2. Click "Add file" to create a new page, or create the `.md` file locally
3. Name it something like `my-page.md`
4. Add front matter at the top:

```
---
title: My Page
---

your content here in markdown
```

5. Commit the file
6. It will appear on the homepage automatically

## If you're outside the organization

You need to submit a pull request:

1. Fork this repository
2. Go to the `_wiki/` folder in your fork
3. Click "Add file" to create a new page, or create the `.md` file locally
4. Name it something like `my-page.md`
5. Add front matter at the top:

```
---
title: My Page
---

your content here in markdown
```

6. Commit the file to your fork
7. Go to the main repository and click "Pull requests" → "New pull request"
8. Select your fork and branch, then create the PR
9. Once approved and merged, it will appear on the homepage

That's it! No login, no CMS, just commit markdown files (or submit a PR).
