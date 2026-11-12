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
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());

  const ok = [];
  const failed = [];
  const noH1 = [];
  const queue = [...pathnames];

  const worker = async () => {
    const page = await context.newPage();
    for (let pathname = queue.shift(); pathname; pathname = queue.shift()) {
      try {
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
        // let react-helmet-async flush <title>/<meta>
        await page.waitForTimeout(250);
        if (!hasH1) noH1.push(pathname);

        let html = await page.content();
        // Keep canonical + lang from step 1 (page.content() already includes them as rendered)
        if (!/<!doctype/i.test(html)) html = `<!DOCTYPE html>\n${html}`;
        await fs.writeFile(path.join(DIST, `${pathname}.html`), html);
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
  return { ok: ok.length, failed, noH1 };
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
    if (!pathname) continue; // "/" is dist/index.html already

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

  // Unknown URLs still need the app shell (the router shows the NotFound page). This replaces the old
  // `cp dist/index.html dist/404.html`, which also fails on Windows.
  await fs.writeFile(path.join(DIST, '404.html'), shell);

  const snap = await snapshotPages(pathnames, shell);
  if (snap.ok) console.log(`prerender: rendered ${snap.ok}/${pathnames.length} pages with their own <title> and <h1>`);
  if (snap.noH1.length) console.warn(`prerender: no <h1> found on:\n  ${snap.noH1.join('\n  ')}`);
  if (snap.failed.length) console.warn(`prerender: kept plain shell for:\n  ${snap.failed.join('\n  ')}`);

  console.log(`prerender-shells: wrote ${written} page shells from ${urls.length} sitemap URLs`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
