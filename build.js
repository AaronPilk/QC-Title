/* QC Title — static page builder.
   Page bodies live in src/*.body.html; this wraps them in the shared
   head / nav / footer chrome and writes the root HTML files.
   Regenerate with:  node build.js                                    */
const fs = require('fs');
const path = require('path');

const SITE = {
  name: 'QC Title',
  url: 'https://www.qctitleclt.com',
  phone: '704-467-3301',
  phonePretty: '(704) 467-3301',
  tel: '7044673301',
  email: 'orders@QCTitleCLT.com',
  emailLower: 'orders@qctitleclt.com',
  city: 'Charlotte, NC',
  underwriters: 'WFG National Title Insurance Company and Commonwealth Land Title Insurance Company',
};
const ORDER = 'order.html';
const MAILTO = `mailto:${SITE.emailLower}?subject=New%20Title%20Order%20%E2%80%94%20QC%20Title`;

const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};

/* Typographic lockup. Swap the inner markup for the approved logo file
   (assets/img/logo.png / logo-white.png) once it is supplied. */
const LOGO = `<span class="wm" aria-hidden="true"><span class="wm__q">QC</span><span class="wm__t">Title</span></span>`;

const NAV_ITEMS = [
  ['index.html', 'Home'],
  ['about.html', 'About'],
  ['services.html', 'Services'],
  ['resources.html', 'Resources'],
  ['contact.html', 'Contact'],
];

/* {{PIC:base|alt|width|height|loading}} -> <picture> with WebP + JPEG fallback */
function expandPictures(html) {
  return html.replace(/\{\{PIC:([^}|]+)\|([^}|]*)\|(\d+)\|(\d+)\|(\w+)\}\}/g,
    (_, base, alt, w, h, loading) => {
      const fetchAttr = loading === 'eager' ? ' fetchpriority="high"' : '';
      const loadAttr = loading === 'eager' ? '' : ' loading="lazy" decoding="async"';
      return `<picture>
          <source srcset="assets/img/${base}.webp" type="image/webp" />
          <img src="assets/img/${base}.jpg" alt="${alt}" width="${w}" height="${h}"${loadAttr}${fetchAttr} />
        </picture>`;
    });
}

const nav = (active, light) => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="nav${light ? ' nav--light' : ''}">
  <div class="nav__inner">
    <a href="index.html" class="nav__logo" aria-label="QC Title — home">${LOGO}</a>
    <nav class="nav__links" aria-label="Primary">
${NAV_ITEMS.map(([h, l]) => `      <a href="${h}"${h === active ? ' class="active" aria-current="page"' : ''}>${l}</a>`).join('\n')}
    </nav>
    <div class="nav__cta">
      <a href="tel:${SITE.tel}" class="nav__phone">${I.phone}${SITE.phone}</a>
      <a href="${ORDER}" class="btn btn--primary btn--sm">Order Title</a>
      <button class="nav__burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<div class="mobile-menu">
${NAV_ITEMS.map(([h, l]) => `  <a href="${h}">${l}</a>`).join('\n')}
  <a href="tel:${SITE.tel}">Call ${SITE.phone}</a>
  <a href="${ORDER}" class="btn btn--primary">Order Title</a>
</div>
`;

const cta = () => `
<section class="section section--cta">
  <div class="wrap">
    <div class="cta-card" data-reveal>
      <span class="eyebrow eyebrow--light">North &amp; South Carolina</span>
      <h2>Ready to move forward with confidence?</h2>
      <p>From residential purchases and land transactions to commercial real estate, QC Title is ready to provide responsive service and dependable title protection across North and South Carolina.</p>
      <div class="cta-actions">
        <a href="${ORDER}" class="btn btn--light">Order Title</a>
        <a href="contact.html" class="btn btn--outline-light">Contact QC Title</a>
      </div>
    </div>
  </div>
</section>
`;

const footer = () => `
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <a href="index.html" class="footer__logo" aria-label="QC Title">${LOGO}</a>
        <p>Residential, land, and commercial title insurance and title services throughout North and South Carolina — rooted in Charlotte.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <div class="footer__links">
${NAV_ITEMS.map(([h, l]) => `          <a href="${h}">${l}</a>`).join('\n')}
          <a href="${ORDER}">Order Title</a>
        </div>
      </div>
      <div>
        <h4>Services</h4>
        <div class="footer__links">
          <a href="services.html#residential">Residential Title Insurance</a>
          <a href="services.html#land">Land Title</a>
          <a href="services.html#commercial">Commercial Title Insurance</a>
        </div>
      </div>
      <div>
        <h4>Contact</h4>
        <div class="footer__contact">
          <a href="tel:${SITE.tel}">${I.phone}${SITE.phonePretty}</a>
          <a href="${MAILTO}">${I.mail}${SITE.email}</a>
          <span>${I.pin}${SITE.city} &middot; Serving North &amp; South Carolina</span>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span>&copy; <span id="year">2026</span> QC Title. All rights reserved.</span>
      <span>Title insurance underwritten by WFG National Title Insurance Company and Commonwealth Land Title Insurance Company.</span>
    </div>
  </div>
</footer>
`;

const PAGES = [
  { file: 'index.html',
    title: 'QC Title | Title Insurance in North &amp; South Carolina',
    desc: 'QC Title provides residential, land, and commercial title insurance and title services throughout North and South Carolina, with responsive service rooted in Charlotte.',
    cta: true },
  { file: 'about.html',
    title: 'About QC Title | Charlotte Title Company Serving the Carolinas',
    desc: 'Built in Charlotte and serving North and South Carolina. QC Title brings experienced title service, responsive communication, and dependable protection to every transaction.',
    cta: true },
  { file: 'services.html',
    title: 'Title Services | Residential, Land &amp; Commercial Title Insurance — QC Title',
    desc: 'Residential title insurance, land title, and commercial title insurance throughout North and South Carolina. Careful title review backed by WFG and Commonwealth.',
    cta: true },
  { file: 'resources.html',
    title: 'Title Insurance FAQ &amp; Resources | QC Title',
    desc: 'Plain answers about title insurance, the title search, what a policy covers, and what to expect from order to closing in North and South Carolina.',
    cta: true },
  { file: 'order.html',
    title: 'Order Title | QC Title — North &amp; South Carolina',
    desc: `Submit a title order to QC Title. Send the property and transaction details and we will open the file. Email ${SITE.email} or call ${SITE.phonePretty}.`,
    cta: false, light: true },
  { file: 'contact.html',
    title: 'Contact QC Title | Charlotte Title Company — NC &amp; SC',
    desc: `Reach QC Title by phone at ${SITE.phonePretty} or email ${SITE.email}. Residential, land, and commercial title services across North and South Carolina.`,
    cta: false },
  { file: '404.html', title: 'Page not found — QC Title',
    desc: 'That page does not exist. Find title services, resources, or contact QC Title.',
    cta: false, noindex: true, light: true },
];

const head = (p) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${p.title}</title>
<meta name="description" content="${p.desc}" />${p.noindex ? '\n<meta name="robots" content="noindex" />' : ''}
<link rel="canonical" href="${SITE.url}/${p.file === 'index.html' ? '' : p.file}" />
<meta name="theme-color" content="#0E8A8A" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="QC Title" />
<meta property="og:title" content="${p.title}" />
<meta property="og:description" content="${p.desc}" />
<meta property="og:url" content="${SITE.url}/${p.file === 'index.html' ? '' : p.file}" />
<meta property="og:image" content="${SITE.url}/assets/img/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="assets/img/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" href="assets/img/icon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="assets/img/icon-180.png" />
<link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
`;

const SCHEMA = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "QC Title",
  "description": "Residential, land, and commercial title insurance and title services throughout North and South Carolina, rooted in Charlotte.",
  "url": "${SITE.url}",
  "telephone": "+1-704-467-3301",
  "email": "${SITE.emailLower}",
  "image": "${SITE.url}/assets/img/og-image.jpg",
  "address": { "@type": "PostalAddress", "addressLocality": "Charlotte", "addressRegion": "NC", "addressCountry": "US" },
  "areaServed": [
    { "@type": "State", "name": "North Carolina" },
    { "@type": "State", "name": "South Carolina" }
  ],
  "knowsAbout": ["Residential title insurance", "Land title", "Commercial title insurance"]
}
</script>`;

for (const p of PAGES) {
  const bodyFile = path.join(__dirname, 'src', p.file.replace('.html', '.body.html'));
  if (!fs.existsSync(bodyFile)) { console.error('missing ' + bodyFile); process.exit(1); }
  let body = fs.readFileSync(bodyFile, 'utf8')
    .replaceAll('{{ORDER}}', ORDER)
    .replaceAll('{{MAILTO}}', MAILTO)
    .replaceAll('{{TEL}}', SITE.tel)
    .replaceAll('{{PHONE}}', SITE.phone)
    .replaceAll('{{PHONE_PRETTY}}', SITE.phonePretty)
    .replaceAll('{{EMAIL}}', SITE.email)
    .replaceAll('{{EMAIL_LOWER}}', SITE.emailLower)
    .replaceAll('{{CITY}}', SITE.city)
    .replaceAll('{{ARROW}}', I.arrow);
  body = expandPictures(body);
  const out = head(p) + nav(p.file, p.light) + '<main id="main">\n' + body +
    (p.cta ? cta() : '') + '</main>\n' +
    footer() +
    (p.file === 'index.html' ? '\n' + SCHEMA + '\n' : '') +
    '\n<script src="assets/js/main.js"></script>\n</body>\n</html>\n';
  fs.writeFileSync(path.join(__dirname, p.file), out);
  console.log('built', p.file, (out.length / 1024).toFixed(1) + 'kb');
}
