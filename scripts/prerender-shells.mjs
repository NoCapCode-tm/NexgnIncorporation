/**
 * Runs AFTER `rsbuild build` (see package.json "postbuild").
 *
 * Why: the site is a single-page app on GitHub Pages. GitHub Pages only has files for "/" and the
 * assets, so a deep link such as /en/sustainability is answered with 404.html and the HTTP status
 * 404. Browsers still show the app, but Googlebot, Ahrefs and link previews see a real 404.
 *
 * Fix: write a real file for every URL in sitemap.xml. GitHub Pages serves /en/pricing from
 * dist/en/pricing.html with status 200 (no trailing-slash redirect). The file is the normal app
 * shell, so React Router and react-helmet-async behave exactly as before; only <html lang> and the
 * canonical link are set per page so crawlers that don't run JavaScript see them too.
 *
 * Needs no hand-written route list: it reads the same sitemap that generate-sitemap.mjs produces.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const DIST = path.resolve('dist');
const SITE = 'https://nexgn.cloud';
const ROOT_SOURCE = '/en'; // https://nexgn.cloud/ serves a copy of /en (canonical points at /en)

const readSitemap = async () => {
  for (const file of [path.join(DIST, 'sitemap.xml'), path.resolve('public', 'sitemap.xml')]) {
    try {
      return await fs.readFile(file, 'utf8');
    } catch {
      /* try next */
    }
  }
  throw new Error('prerender-shells: sitemap.xml not found in dist/ or public/');
};


/* ---------------------------------------------------------------------------------------------
 * Step 2 (optional): snapshot the RENDERED page into each shell.
 *
 * Crawlers that don't run JavaScript (Ahrefs' default crawl, many link scrapers) only see the raw
 * HTML. Without this step every page looks identical: same <title>, no <h1>, no text. Here we open
 * each URL in headless Chromium, wait for the app to render, and save the resulting HTML, so every
 * page ships its own title, meta description, <h1> and content.
 *
 * Needs `playwright` (devDependency) and a Chromium browser. If either is missing the step is
 * skipped and the plain shells from step 1 are kept, so local builds never break.
 * ------------------------------------------------------------------------------------------- */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const startStaticServer = (shellFallback) =>
  new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const clean = urlPath.replace(/\/+$/, '');
      const candidates = [
        path.join(DIST, urlPath),
        path.join(DIST, `${clean}.html`),
        path.join(DIST, clean, 'index.html'),
      ];
      for (const file of candidates) {
        if (!file.startsWith(DIST)) continue;
        try {
          const stat = await fs.stat(file);
          if (!stat.isFile()) continue;
          res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
          res.end(await fs.readFile(file));
          return;
        } catch {
          /* next candidate */
        }
      }
      // Unknown path: app shell (same as GitHub Pages' 404.html behaviour for the SPA)
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(shellFallback);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });


/* ---------------------------------------------------------------------------------------------
 * Head clean-up for each snapshot. The shell has a static <title>/meta set and the app adds its own
 * through react-helmet-async, so the snapshot ends up with duplicates ("Multiple title tags"), and
 * hub pages (one component, several URLs) carry the hub's canonical instead of their own.
 * Result: exactly one title, one description, one canonical (the page's own URL), hreflang
 * alternates that match sitemap.xml, and Open Graph / X tags (derived from title + description when
 * the page doesn't set them).
 * ------------------------------------------------------------------------------------------- */
const LOCALES = ['en', 'es', 'hi'];
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[1] ?? m[2]) : undefined;
};
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const unesc = (v) => String(v).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// among duplicates keep the app's own (data-rh) tag, otherwise the last one
const pickKeeper = (tags) => tags.find((t) => /data-rh/i.test(t)) || tags[tags.length - 1];

const normalizeHead = (html, pathname) => {
  const end = html.search(/<\/head>/i);
  if (end === -1) return { html, title: '', description: '' };
  let head = html.slice(0, end);
  const rest = html.slice(end);

  // --- title
  const titles = head.match(/<title\b[^>]*>[\s\S]*?<\/title>/gi) || [];
  let title = '';
  if (titles.length) {
    const keep = pickKeeper(titles);
    head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, '');
    head += `  ${keep}\n`;
    title = unesc(keep.replace(/<[^>]+>/g, '').trim());
  }

  // --- <meta> dedupe by name/property
  const metas = head.match(/<meta\b[^>]*>/gi) || [];
  const groups = new Map();
  for (const m of metas) {
    const key = (attr(m, 'name') || attr(m, 'property') || '').toLowerCase();
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  const meta = {};
  for (const [key, list] of groups) {
    const keep = pickKeeper(list);
    for (const m of list) if (m !== keep) head = head.replace(m, '');
    meta[key] = attr(keep, 'content') ?? '';
  }

  // --- canonical + hreflang: replace with this URL's own
  head = head.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
  head = head.replace(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=[^>]*>\s*/gi, '');
  const canonical = `${SITE}${pathname}`;
  const rest2 = pathname.split('/').slice(2).join('/');
  const alt = (lng) => `${SITE}/${lng}${rest2 ? `/${rest2}` : ''}`;
  let links = `  <link rel="canonical" href="${canonical}" />\n`;
  if (LOCALES.includes(pathname.split('/')[1])) {
    for (const lng of LOCALES) links += `  <link rel="alternate" hreflang="${lng}" href="${alt(lng)}" />\n`;
    links += `  <link rel="alternate" hreflang="x-default" href="${alt('en')}" />\n`;
  }

  // --- Open Graph / X: fill what the page didn't set, force og:url to the page's own URL
  const description = meta.description || '';
  const setMeta = (kind, key, value) => {
    if (!value) return '';
    const present = key in meta;
    if (present && key !== 'og:url') return '';
    if (present) head = head.replace(new RegExp(`<meta\\b[^>]*property=["']${key}["'][^>]*>\\s*`, 'gi'), '');
    return `  <meta ${kind}="${key}" content="${esc(value)}" />\n`;
  };
  let social = '';
  social += setMeta('property', 'og:title', title);
  social += setMeta('property', 'og:description', description);
  social += setMeta('property', 'og:url', canonical);
  social += setMeta('property', 'og:type', 'website');
  social += setMeta('property', 'og:site_name', 'Nexgn');
  social += setMeta('name', 'twitter:card', 'summary_large_image');
  social += setMeta('name', 'twitter:title', title);
  social += setMeta('name', 'twitter:description', description);

  head = head.replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '\n');
  return { html: head + links + social + rest, title, description };
};

/* ---------------------------------------------------------------------------------------------
 * Safety net: if react-helmet-async did not flush into the snapshot (no description / generic title /
 * no Product JSON-LD), derive them from the rendered page itself so crawlers never get an empty head.
 * Every use is logged ("prerender: head fallback used on ...") so a real Helmet problem stays visible.
 * ------------------------------------------------------------------------------------------- */
const DEFAULT_TITLE = /^Nexgn \| The Modern Agreement Platform/i;
let productSchemaMod = null;
const loadProductSchema = async () => {
  if (productSchemaMod) return productSchemaMod;
  const src = await fs.readFile(path.resolve('src', 'utils', 'productSchema.js'), 'utf8');
  productSchemaMod = await import(`data:text/javascript;base64,${Buffer.from(src).toString('base64')}`);
  return productSchemaMod;
};
const clip = (v, max = 158) => (v.length <= max ? v : `${v.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

const applyHeadFallbacks = async (html, pathname, info) => {
  const used = [];
  const end = html.search(/<\/head>/i);
  if (end === -1) return { html, used };
  let head = html.slice(0, end);
  const rest = html.slice(end);
  const lng = pathname.split('/')[1];
  const productSlug = (pathname.match(/^\/(?:en|es|hi)\/products\/([^/]+)$/) || [])[1];
  const pageName = info.secTitle || info.h1;

  // Hub URLs (/products/<slug>, /solutions/<slug>) share one page component and so one SEO title/description.
  // Give each URL its own, taken from the section it shows (avoids "duplicate title / description" in audits).
  const isHubSection = /^\/(?:en|es|hi)\/(?:products|solutions)\/[^/]+$/.test(pathname) && info.secTitle;
  if (isHubSection) {
    const st = clip(`${info.secTitle} | Nexgn`, 60);
    head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, '') + `  <title>${esc(st)}</title>\n`;
    head = head.replace(/<meta\b[^>]*name=["']description["'][^>]*>\s*/gi, '');
    head = head.replace(/<meta\b[^>]*(?:property|name)=["'](?:og:title|og:description|twitter:title|twitter:description)["'][^>]*>\s*/gi, '');
    const sd = info.secSub && info.secSub.length >= 40 ? info.secSub : `${info.secTitle}: ${info.lead || ''}`.trim();
    if (sd) head += `  <meta name="description" content="${esc(clip(sd))}" />\n`;
    used.push('section title/description');
  }

  // title: the live document.title is what react-helmet-async set, so it is authoritative.
  // (the shell's static generic <title> must never win over it)
  const live = (info.liveTitle || '').trim();
  const t = (head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  if (isHubSection) {
    /* already set above */
  } else if (live && !DEFAULT_TITLE.test(live)) {
    head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, '') + `  <title>${esc(live)}</title>\n`;
    if (unesc(t.trim()) !== live) used.push('title(live)');
  } else if (pageName && /\/(?:en|es|hi)\/.+/.test(pathname)) {
    // Helmet never set one: "<page> | Nexgn"
    const nt = clip(`${pageName} | Nexgn`, 60);
    head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, '') + `  <title>${esc(nt)}</title>\n`;
    used.push('title(h1)');
  }

  // missing description
  const hasDesc = /<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+/i.test(head);
  const desc = info.secSub || info.lead;
  if (!hasDesc && desc) {
    head += `  <meta name="description" content="${esc(clip(desc))}" />\n`;
    used.push('description');
  }

  // Product JSON-LD on /products/<slug>
  if (productSlug && !/"@type"\s*:\s*"Product"/.test(head)) {
    const { buildProductSchema } = await loadProductSchema();
    const schema = buildProductSchema({
      pathname,
      lng,
      sections: [{ id: productSlug, title: info.secTitle, subtitle: info.secSub }],
      hubTitle: info.h1,
      hubLead: info.lead,
    });
    if (schema) {
      head += `  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n`;
      used.push('Product schema');
    }
  }
  return { html: head + rest, used };
};

const ERROR_PAGE = /new version of nexgn is available|couldn.?t load this page|something went wrong/i;

/* Load one URL, wait for the app (h1, Product JSON-LD, Helmet) and read what the fallbacks need. */
const renderOnce = async (page, origin, pathname, getErrs, resetErrs) => {
  resetErrs();
  await page.goto(`${origin}${pathname}`, { waitUntil: 'load', timeout: 30000 });
  // Lazy route + i18n: wait until the page has an <h1> with text (or give up after 8s)
  const hasH1 = await page
    .waitForFunction(
      () => {
        const h1 = document.querySelector('h1');
        return !!h1 && h1.textContent.trim().length > 0;
      },
      null,
      { timeout: 8000 }
    )
    .then(() => true)
    .catch(() => false);
  // /products/<slug> pages must ship Product JSON-LD in the raw HTML
  let schemaMissing = false;
  if (/^\/(en|es|hi)\/products\/[^/]+$/.test(pathname)) {
    await page
      .waitForFunction(
        () =>
          Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((el) =>
            /"@type"\s*:\s*"Product"/.test(el.textContent)
          ),
        null,
        { timeout: 5000 }
      )
      .catch(() => {
        schemaMissing = true;
      });
  }
  // let react-helmet-async flush <title>/<meta>
  await page.waitForTimeout(250);

  let html = await page.content();
  if (!/<!doctype/i.test(html)) html = `<!DOCTYPE html>\n${html}`;
  const slug = (pathname.match(/\/(?:products|solutions)\/([^/]+)$/) || [])[1] || '';
  const info = await page.evaluate((sl) => {
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    // ProductLayout marks the section the URL points at (alias-aware) with data-target
    const art = document.querySelector('article[data-target="true"]') || (sl && document.getElementById(sl)) || null;
    const lead =
      txt(document.querySelector('[data-pl="hero-lead"]')) ||
      Array.from(document.querySelectorAll('main p, h1 ~ p')).map(txt).find((x) => x.length > 60) ||
      '';
    return {
      h1: txt(document.querySelector('h1')),
      lead,
      liveTitle: document.title || '',
      secTitle: sl ? txt(art?.querySelector('h2')) : '',
      secSub: sl ? txt(art?.querySelector('header p')) : '',
    };
  }, slug);
  const isErrorPage = ERROR_PAGE.test(info.h1) && !/\/(404|not-found)/.test(pathname);
  return { html, info, hasH1, schemaMissing, isErrorPage, errs: getErrs() };
};

const snapshotPages = async (pathnames, shell) => {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    const msg = 'prerender: "playwright" is not installed, so pages have no per-page <h1>/title. Run: npm i -D playwright';
    if (process.env.CI) throw new Error(msg); // never ship un-rendered pages from CI
    console.warn(`${msg} (keeping plain shells)`);
    return { ok: 0, failed: [], noH1: [] };
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    const msg = `prerender: Chromium could not start (${err.message.split('\n')[0]})`;
    if (process.env.CI) throw new Error(msg);
    console.warn(`${msg}. Keeping plain shells.`);
    return { ok: 0, failed: [], noH1: [] };
  }

  const server = await startStaticServer(shell);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const context = await browser.newContext({
    locale: 'en-US',
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce', // the app skips GSAP, so the snapshot has no hidden/opacity:0 inline styles
    serviceWorkers: 'block',
  });
  // Never call out to analytics / fonts / third parties while snapshotting
  // Stylesheets must be answered (empty), not aborted: a CSS file with an external @import (Google Fonts in
  // ProductLayout.module.css) otherwise fails to load and the app shows its "new version available" screen.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) =>
    route.request().resourceType() === 'stylesheet'
      ? route.fulfill({ status: 200, contentType: 'text/css', body: '/* external stylesheet skipped while prerendering */' })
      : route.abort()
  );

  const ok = [];
  const failed = [];
  const noH1 = [];
  const noSchema = [];
  const fallbackUsed = [];
  const errorPages = [];
  const seo = [];
  let rootHtml = null;
  const queue = [...pathnames];

  const worker = async () => {
    const page = await context.newPage();
    let errs = [];
    page.on('pageerror', (e) => errs.push(`pageerror: ${String(e.message).split('\n')[0]}`));
    page.on('console', (m) => {
      if (m.type() === 'error') errs.push(`console: ${m.text().split('\n')[0].slice(0, 200)}`);
    });
    page.on('requestfailed', (r) => {
      if (/^https?:\/\/127\.0\.0\.1/.test(r.url())) errs.push(`requestfailed: ${r.url().replace(/^https?:\/\/[^/]+/, '')} ${r.failure()?.errorText || ''}`);
    });
    page.on('response', (r) => {
      if (r.status() >= 400 && /^https?:\/\/127\.0\.0\.1/.test(r.url())) errs.push(`http ${r.status()}: ${r.url().replace(/^https?:\/\/[^/]+/, '')}`);
    });
    for (let pathname = queue.shift(); pathname; pathname = queue.shift()) {
      try {
        let result = null;
        // The error boundary renders an <h1> too, so detect it and retry once before giving up
        for (let attempt = 1; attempt <= 2; attempt += 1) {
          result = await renderOnce(page, origin, pathname, () => errs, () => { errs = []; });
          if (!result.isErrorPage) break;
          await page.waitForTimeout(600);
        }
        const { html: rawHtml, info, hasH1, schemaMissing } = result;

        if (result.isErrorPage) {
          const why = errs.length ? errs : ['(no error was logged by the page)'];
          errorPages.push({ pathname, h1: info.h1, errs: why });
          failed.push(`${pathname} (page crashed: "${info.h1.slice(0, 40)}")`);
          continue; // keep the plain shell from step 1; never publish an error screen as the page
        }
        if (!hasH1) noH1.push(pathname);
        if (schemaMissing) noSchema.push(pathname);

        const fb = await applyHeadFallbacks(rawHtml, pathname, info);
        if (fb.used.length) fallbackUsed.push(`${pathname} [${fb.used.join(', ')}]`);
        const n = normalizeHead(fb.html, pathname);
        seo.push({ pathname, title: n.title, description: n.description });
        if (pathname === ROOT_SOURCE) rootHtml = n.html;
        await fs.writeFile(path.join(DIST, `${pathname}.html`), n.html);
        ok.push(pathname);
      } catch (err) {
        failed.push(`${pathname} (${err.message.split('\n')[0]})`);
      }
    }
    await page.close();
  };

  await Promise.all(Array.from({ length: 4 }, worker));
  await browser.close();
  server.close();
  return { ok: ok.length, failed, noH1, noSchema, fallbackUsed, errorPages, seo, rootHtml };
};

const main = async () => {
  const shell = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  const xml = await readSitemap();

  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  let written = 0;
  const pathnames = [];

  for (const url of urls) {
    let pathname;
    try {
      pathname = new URL(url).pathname.replace(/\/+$/, '');
    } catch {
      continue;
    }
    if (!pathname || /\.(txt|md|xml)$/i.test(pathname)) continue; // "/" is dist/index.html; skip non-HTML GEO docs (/llms*.txt, /llms/*.md)

    const lng = pathname.split('/')[1];
    const canonical = `${SITE}${pathname}`;

    let html = shell;
    if (/^(en|es|hi)$/.test(lng)) html = html.replace(/<html lang="[^"]*"/, `<html lang="${lng}"`);
    html = html.replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`);

    // /en/pricing -> dist/en/pricing.html ; /en -> dist/en.html
    const file = path.join(DIST, `${pathname}.html`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, html);
    written += 1;
    pathnames.push(pathname);
  }

  // Unknown URLs still need the app shell (the router shows the NotFound page), and GitHub Pages
  // 404 responses must carry noindex so crawlers never index missing URLs.
  const shell404 = /content=["']noindex/i.test(shell)
    ? shell
    : shell.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
  await fs.writeFile(path.join(DIST, '404.html'), shell404);

  const snap = await snapshotPages(pathnames, shell);

  // "/" is a duplicate of /en: ship the rendered /en content (so it has an <h1>, text and links) with the
  // canonical pointing at /en. Written last, because the snapshot server serves dist/index.html.
  if (snap.rootHtml) await fs.writeFile(path.join(DIST, 'index.html'), snap.rootHtml);

  // SEO length report (Ahrefs: title > 60, description < 110 or > 160 characters)
  const lines = [];
  for (const p of snap.seo || []) {
    const issues = [];
    if (!p.title) issues.push('no <title>');
    else if (p.title.length > 60) issues.push(`title ${p.title.length} chars`);
    if (!p.description) issues.push('NO meta description');
    else if (p.description.length > 160) issues.push(`description ${p.description.length} chars (max 160)`);
    else if (p.description.length < 110) issues.push(`description ${p.description.length} chars (min 110)`);
    if (issues.length) lines.push(`${p.pathname}: ${issues.join(', ')}`);
  }
  if (lines.length) {
    // Same copy in every language shares one source string, so the English page is the one to edit
    console.warn(`prerender: SEO length issues on ${lines.length} pages (fix the en page; es/hi follow its i18n keys):\n  ${lines.join('\n  ')}`);
  }

  if (snap.ok) console.log(`prerender: rendered ${snap.ok}/${pathnames.length} pages with their own <title> and <h1>`);
  if (snap.errorPages?.length) {
    const byMsg = new Map();
    for (const e of snap.errorPages) for (const m of e.errs.slice(0, 3)) byMsg.set(m, (byMsg.get(m) || 0) + 1);
    console.warn(`prerender: ${snap.errorPages.length} pages CRASHED while rendering (plain shell kept, not published as an error screen):`);
    console.warn(`  pages: ${snap.errorPages.map((e) => e.pathname).join(', ')}`);
    console.warn('  errors (count x message):');
    for (const [m, c] of [...byMsg].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.warn(`   ${c}x ${m}`);
  }
  if (snap.fallbackUsed?.length) console.warn(`prerender: head fallback used on ${snap.fallbackUsed.length} pages (react-helmet-async did not flush):\n  ${snap.fallbackUsed.join('\n  ')}`);
  if (snap.noSchema?.length) console.warn(`prerender: no Product schema on:\n  ${snap.noSchema.join('\n  ')}`);
  if (snap.noH1.length) console.warn(`prerender: no <h1> found on:\n  ${snap.noH1.join('\n  ')}`);
  if (snap.failed.length) console.warn(`prerender: kept plain shell for:\n  ${snap.failed.join('\n  ')}`);

  console.log(`prerender-shells: wrote ${written} page shells from ${urls.length} sitemap URLs`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
