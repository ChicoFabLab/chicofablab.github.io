---
title: Components
---

# CFL Components

Reusable includes that can be dropped into wiki pages or layouts. Examples assume the include path `components/<file>.html`.

## Button

```
{% include components/button.html text="View docs" href="/README" variant="primary" size="md" %}
{% include components/button.html text="Submit" type="submit" variant="secondary" block=true %}
```

Options: `text`/`label`, `href`/`url`, `type` (for button tag), `variant` (`primary`, `secondary`, `ghost`, etc.), `size` (`sm`, `md`, `lg`), `block` (true/false).

## Alert

```
{% include components/alert.html variant="warning" title="Heads up" body="This feature is in beta." %}
```

Body supports Markdown. Variants: `info`, `success`, `warning`, `danger`.

## Badge

```
{% include components/badge.html text="In Progress" variant="warning" %}
{% include components/badge.html text="Done" variant="success" %}
```

## Callout

```
{% include components/callout.html title="Need access?" body="Email lab@chicofl.org to request access." cta_url="/README" cta_label="Read the guide" cta_variant="primary" %}
```

Body supports Markdown. Variants can mirror alert/badge colors.
