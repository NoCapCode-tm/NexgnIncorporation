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

const main = async () => {
  const shell = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  const xml = await readSitemap();

  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  let written = 0;

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
  }

  // Unknown URLs still need the app shell (the router shows the NotFound page). This replaces the old
  // `cp dist/index.html dist/404.html`, which also fails on Windows.
  await fs.writeFile(path.join(DIST, '404.html'), shell);

  console.log(`prerender-shells: wrote ${written} page shells from ${urls.length} sitemap URLs`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
