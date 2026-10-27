import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://nexgn.cloud';
const LOCALES = ['en', 'es', 'hi'];

// Extract this from your AppRouter.jsx structure
const ROUTES = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/products/esignature', priority: 0.8, changefreq: 'monthly' },
  { path: '/products/document-editor', priority: 0.8, changefreq: 'monthly' },
  { path: '/products/audit-trail', priority: 0.8, changefreq: 'monthly' },
  { path: '/trust', priority: 0.9, changefreq: 'monthly' },
  { path: '/trust/security', priority: 0.8, changefreq: 'monthly' },
  { path: '/trust/legality', priority: 0.9, changefreq: 'monthly' },
  { path: '/sustainability', priority: 0.9, changefreq: 'weekly' },
  { path: '/developers', priority: 0.8, changefreq: 'monthly' }
];

const generateSitemap = () => {
  const today = new Date().toISOString.split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  ROUTES.forEach((route) => {
    LOCALES.forEach((locale) => {
      const locUrl = `${BASE_URL}/${locale}${route.path}`;
      
      xml += `  <url>\n`;
      xml += `    <loc>${locUrl}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      
      // Inject hreflang tags so Ahrefs knows these pages are translations of each other
      LOCALES.forEach((altLocale) => {
        const altUrl = `${BASE_URL}/${altLocale}${route.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}"/>\n`;
      });
      // x-default fallback
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${route.path}"/>\n`;
      
      xml += `  </url>\n`;
    });
  });

  xml += `</urlset>`;

  // Write to the public directory so Rsbuild picks it up during the build
  fs.writeFileSync(path.resolve('public/sitemap.xml'), xml);
  console.log('Dynamic sitemap generated successfully.');
};

generateSitemap();