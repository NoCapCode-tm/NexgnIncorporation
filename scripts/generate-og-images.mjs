/**
 * Dynamic 1200x630 Open Graph Image Generator for Nexgn.
 *
 * Shuffles deterministically between:
 *   - public/brand/dyanmic-og-image-1.png
 *   - public/brand/dyanmic-og-image-2.png
 * (with automatic fallback to dynamic-og-image-1.png / 2.png if renamed)
 *
 * Preserves Nexgn's top-left logo brightness via a masked radial scrim,
 * adapts font sizing across EN / ES / HI (Devanagari-aware line wrapping),
 * and outputs compact palette-quantized PNGs under dist/og/<route>.png.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SITE = 'https://nexgn.cloud';
const WIDTH = 1200;
const HEIGHT = 630;
const COMBINING_MARKS = /[\u0300-\u036f\u0900-\u0903\u093a-\u094f\u0951-\u0957\u0962-\u0963]/g;

/** Canonical OG image URL matching SEOHead.jsx & prerender-shells.mjs. */
export const getOgImageUrl = (pathname = '/') => {
  const clean = String(pathname || '/').replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/en') return `${SITE}/brand/og-image.png`;
  return `${SITE}/og${clean}.png`;
};

const escXml = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const visualLength = (s) => Array.from(String(s || '').replace(COMBINING_MARKS, '')).length;
const hasDevanagari = (s) => /[\u0900-\u097f]/.test(String(s || ''));

const pickBgIndex = (pathname) => {
  let h = 2166136261;
  for (let i = 0; i < pathname.length; i += 1) {
    h ^= pathname.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 2;
};

const wrapLines = (text, maxVisualChars, maxLines) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const words = clean.split(' ').filter(Boolean);
  const lines = [];
  let cur = '';
  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    const candidate = cur ? `${cur} ${w}` : w;
    if (visualLength(candidate) <= maxVisualChars || !cur) {
      cur = candidate;
    } else {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines) {
        lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, '')}…`;
        return lines;
      }
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
};

const ROUTE_EYEBROWS = {
  blog: { en: 'Blog & Press', es: 'Blog y Prensa', hi: 'ब्लॉग और प्रेस' },
  alternatives: { en: 'Transparent Compare', es: 'Comparativa Abierta', hi: 'पारदर्शी तुलना' },
  pricing: { en: 'Open Pricing', es: 'Precios Claros', hi: 'स्पष्ट मूल्य निर्धारण' },
  products: { en: 'Nexgn Platform', es: 'Plataforma Nexgn', hi: 'Nexgn प्लेटफ़ॉर्म' },
  solutions: { en: 'Solutions', es: 'Soluciones', hi: 'समाधान' },
  developers: { en: 'Developer API', es: 'API para Desarrolladores', hi: 'डेवलपर API' },
  trust: { en: 'Trust Center', es: 'Centro de Confianza', hi: 'ट्रस्ट सेंटर' },
  sustainability: { en: 'Sustainability', es: 'Sostenibilidad', hi: 'स्थिरता संकल्प' },
  legal: { en: 'Legal & Compliance', es: 'Legal y Cumplimiento', hi: 'कानूनी और अनुपालन' },
  help: { en: 'Help Center', es: 'Centro de Ayuda', hi: 'सहायता केंद्र' },
  contact: { en: 'Contact & Sales', es: 'Contacto y Ventas', hi: 'संपर्क और बिक्री' },
  about: { en: 'About Nexgn', es: 'Sobre Nexgn', hi: 'Nexgn के बारे में' },
};

export const getRouteEyebrow = (pathname) => {
  const parts = String(pathname || '/').split('/').filter(Boolean);
  const lng = /^(en|es|hi)$/.test(parts[0]) ? parts[0] : 'en';
  const section = parts[1] || '';
  const entry = ROUTE_EYEBROWS[section];
  if (entry) return entry[lng] || entry.en;
  return lng === 'es' ? 'Plataforma Nexgn' : lng === 'hi' ? 'Nexgn प्लेटफ़ॉर्म' : 'Nexgn Agreement Platform';
};

const loadBackground = async (candidates) => {
  for (const rel of candidates) {
    try {
      return await fs.readFile(path.resolve(rel));
    } catch {
      /* try next candidate spelling */
    }
  }
  throw new Error(`Missing OG background image. Tried: ${candidates.join(', ')}`);
};

const buildCardSvg = ({ pathname, eyebrow, title, desc }) => {
  const cleanTitle = String(title || 'Nexgn')
    .replace(/\s*\|\s*Nexgn.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  const cleanDesc = String(desc || '').replace(/\s+/g, ' ').trim();
  const isHi = hasDevanagari(cleanTitle) || hasDevanagari(cleanDesc) || hasDevanagari(eyebrow);

  const vLen = visualLength(cleanTitle);
  const titleSize = vLen <= 20 ? 68 : vLen <= 38 ? 54 : vLen <= 62 ? 44 : 38;
  const maxCharsTitle = isHi
    ? titleSize >= 64 ? 22 : titleSize >= 50 ? 27 : 33
    : titleSize >= 64 ? 22 : titleSize >= 50 ? 28 : titleSize >= 42 ? 34 : 40;

  const titleLines = wrapLines(cleanTitle, maxCharsTitle, 3);
  const titleLineH = Math.round(titleSize * (isHi ? 1.24 : 1.14));

  const eyeDisplay = isHi ? eyebrow : eyebrow.toUpperCase();
  const pillW = Math.max(150, Math.min(480, Math.round(visualLength(eyeDisplay) * (isHi ? 10.2 : 10.8) + 56)));

  const pillY = titleLines.length === 1 ? 156 : titleLines.length === 2 ? 144 : 136;
  const titleStartY = pillY + 38 + (isHi ? 76 : 68);
  const lastTitleY = titleStartY + (titleLines.length - 1) * titleLineH;
  const ruleY = lastTitleY + (isHi ? 30 : 28);
  const descStartY = ruleY + 46;
  const descMaxLines = titleLines.length >= 3 ? 2 : 3;
  const descLines = wrapLines(cleanDesc, isHi ? 54 : 58, descMaxLines);
  const descLineH = isHi ? 36 : 33;

  const fontStack = isHi
    ? 'Noto Sans Devanagari, Nirmala UI, Inter, Segoe UI, Liberation Sans, sans-serif'
    : 'Inter, Segoe UI, Liberation Sans, Noto Sans, Noto Sans Devanagari, sans-serif';

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="textScrim" cx="30%" cy="56%" r="55%">
      <stop offset="0%" stop-color="#07090d" stop-opacity="0.72"/>
      <stop offset="68%" stop-color="#07090d" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#07090d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="logoSafe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="22%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="30%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="1"/>
    </linearGradient>
    <mask id="belowLogo">
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#logoSafe)"/>
    </mask>
    <linearGradient id="redRule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff0915" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ff0915" stop-opacity="0.22"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#textScrim)" mask="url(#belowLogo)"/>

  <rect x="64" y="${pillY}" width="${pillW}" height="38" rx="19" fill="#ff0915" fill-opacity="0.16" stroke="#ff0915" stroke-opacity="0.52" stroke-width="1.2"/>
  <circle cx="86" cy="${pillY + 19}" r="4.5" fill="#ff0915"/>
  <text x="102" y="${pillY + 24.5}" fill="#ffd6da" font-family="${fontStack}" font-size="15" font-weight="600"${isHi ? '' : ' letter-spacing="1.4"'}>${escXml(eyeDisplay)}</text>

  <text x="64" y="${titleStartY}" fill="#ffffff" font-family="${fontStack}" font-size="${titleSize}" font-weight="700">
    ${titleLines.map((line, i) => `<tspan x="64" dy="${i === 0 ? 0 : titleLineH}">${escXml(line)}</tspan>`).join('')}
  </text>

  <rect x="64" y="${ruleY}" width="72" height="4" rx="2" fill="url(#redRule)"/>

  <text x="64" y="${descStartY}" fill="#d8dde6" font-family="${fontStack}" font-size="23" font-weight="400">
    ${descLines.map((line, i) => `<tspan x="64" dy="${i === 0 ? 0 : descLineH}">${escXml(line)}</tspan>`).join('')}
  </text>

  <line x1="64" y1="548" x2="1136" y2="548" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1"/>
  <text x="64" y="582" fill="#c7cdd8" font-family="Inter, Segoe UI, Liberation Sans, Noto Sans, sans-serif" font-size="18" font-weight="500">${escXml(`nexgn.cloud${pathname}`)}</text>
  <text x="1136" y="582" text-anchor="end" fill="#9aa0a9" font-family="Inter, Segoe UI, Liberation Sans, Noto Sans, sans-serif" font-size="15" font-weight="600" letter-spacing="1.1">AES-256 · SHA-256 · BYOS</text>
</svg>`;
};

/**
 * Generates dynamic 1200x630 PNG OG images into `<distDir>/og<pathname>.png`
 * for every route except `/` and `/en` (which use `/brand/og-image.png`).
 */
export const generateOgImagesBatch = async (items, distDir = path.resolve('dist')) => {
  const targets = (items || []).filter((it) => {
    const clean = String(it?.pathname || '').replace(/\/+$/, '');
    return clean && clean !== '/' && clean !== '/en';
  });
  if (!targets.length) return { generated: 0, bgCounts: [0, 0] };

  const bgs = [
    await loadBackground(['public/brand/dyanmic-og-image-1.png', 'public/brand/dynamic-og-image-1.png']),
    await loadBackground(['public/brand/dyanmic-og-image-2.png', 'public/brand/dynamic-og-image-2.png']),
  ];

  const queue = [...targets];
  const bgCounts = [0, 0];
  let generated = 0;

  const worker = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const cleanPath = String(item.pathname).replace(/\/+$/, '');
      const bgIdx = pickBgIndex(cleanPath);
      bgCounts[bgIdx] += 1;
      const eyebrow = item.eyebrow || getRouteEyebrow(cleanPath);
      const svg = buildCardSvg({
        pathname: cleanPath,
        eyebrow,
        title: item.title,
        desc: item.desc,
      });

      const outFile = path.join(distDir, 'og', `${cleanPath.slice(1)}.png`);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await sharp(bgs[bgIdx])
        .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
        .png({ palette: true, quality: 90, compressionLevel: 9 })
        .toFile(outFile);
      generated += 1;
    }
  };

  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`✅ Generated ${generated} dynamic 1200x630 OG images (bg1=${bgCounts[0]}, bg2=${bgCounts[1]}).`);
  return { generated, bgCounts };
};