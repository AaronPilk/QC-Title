# QC Title

Marketing site for **QC Title** — residential, land, and commercial title insurance
and title services throughout North and South Carolina, rooted in Charlotte.

Static HTML/CSS/JS. No framework, no build dependencies beyond Node for the page
generator. Deployed on Cloudflare Pages (framework preset: None, build command:
none, output directory: `/`, production branch: `main`). Domain: QCTitleCLT.com.

## Brand direction

> **Rooted in Charlotte. Trusted across the Carolinas.**

High-end, Charlotte-rooted, residential-friendly, Carolinas-wide. Teal `#047E8C`
and purple `#2C1050` are accents on a white / `#f5f5f7` Apple-style ground, never
large saturated backgrounds. Charlotte is part of the story, not the service-area
limit: coverage always reads North **and** South Carolina.

**Underwriters: WFG National Title Insurance Company and Commonwealth Land Title
Insurance Company** — always both, never one as exclusive. No rate calculators or
external underwriter tools.

## Structure

```
index.html about.html services.html resources.html order.html contact.html 404.html
                        <- generated, deployed
build.js                <- regenerates the pages from src/ + shared chrome
src/*.body.html         <- page content (edit these, not the root HTML)
assets/css/style.css    <- design system
assets/js/main.js       <- nav, scroll reveal, accordion, order-form email composer
assets/img/             <- WebP + JPEG pairs, favicons, OG image
```

## Editing

Page chrome (nav, footer, CTA, `<head>`, contact details) lives in `build.js`
(`SITE` at the top). Page content lives in `src/*.body.html`. After any edit:

```bash
node build.js
```

Then commit the regenerated root HTML. Bodies support these tokens:

`{{ORDER}} {{MAILTO}} {{TEL}} {{PHONE}} {{PHONE_PRETTY}} {{EMAIL}} {{EMAIL_LOWER}} {{CITY}} {{ARROW}}`

and `{{PIC:basename|alt text|width|height|lazy|eager}}`, which expands to a
`<picture>` with a WebP source and a JPEG fallback.

## Logo

`assets/img/logo.png` is the approved lockup (skyline + QC TITLE + Queen City
Title); `logo-white.png` is a white silhouette of it for dark surfaces (nav over
photo heroes, footer); `mark.png` is the skyline alone. Favicons are the "QC"
letters. Source art lives in `_source-originals/` (gitignored). Brand colors are
sampled from the logo: teal `#047E8C`, purple `#2C1050`.

## Order form

`order.html` is a real form, but the site is static: on submit it composes an
email to orders@ with every field filled in and opens the visitor's mail client.
No data is stored or transmitted by the site itself. Swap in a Cloudflare Pages
Function or a form service later if a server-side submission is wanted.

## Conventions

- One primary button style and one secondary. Flat, no gradients on buttons.
- Every image ships as WebP plus a JPEG fallback.
- Do not invent years in business, staff size, volume, turnaround guarantees,
  or a mailing address. None are approved.
