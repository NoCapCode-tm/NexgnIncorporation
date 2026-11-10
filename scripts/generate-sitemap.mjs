import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Allow overriding via environment variable (e.g. SITE_URL=https://preview.nexgn.cloud)
const BASE_URL = (process.env.SITE_URL || 'https://nexgn.cloud').replace(/\/+$/, '');
const LOCALES = ['en', 'es', 'hi'];
const DEFAULT_LOCALE = 'en';

const TODAY = new Date().toISOString().split('T')[0];

/* =====================================================================
   Helper: Get last modified date (YYYY-MM-DD) from Git or filesystem
   ===================================================================== */
const getLastMod = (relFilePath) => {
  if (!relFilePath) return TODAY;
  const fullPath = path.resolve(ROOT_DIR, relFilePath);
  if (!fs.existsSync(fullPath)) return TODAY;

  try {
    const gitDate = execSync(`git log -1 --format="%cs" -- "${fullPath}"`, {
      cwd: ROOT_DIR,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) return gitDate;
  } catch {
    // Fallback to file mtime if git history is shallow or unavailable
  }

  try {
    const stats = fs.statSync(fullPath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return TODAY;
  }
};

/* =====================================================================
   1. STATIC LOCALIZED ROUTES (Mapped from src/routes/AppRouter.jsx)
   Note: Redirect-only aliases (/legal/cookies, /products/storage,
   /products/workflows, /products/reminders) are excluded to keep SEO clean.
   ===================================================================== */
const STATIC_ROUTES = [
  // Core Pages
  { path: '', priority: '1.0', changefreq: 'weekly', file: 'src/pages/core/Home.jsx' },
  { path: '/pricing', priority: '0.9', changefreq: 'weekly', file: 'src/pages/core/Pricing.jsx' },
  { path: '/changelog', priority: '0.7', changefreq: 'weekly', file: 'src/pages/core/Changelog.jsx' },
  { path: '/roadmap', priority: '0.7', changefreq: 'monthly', file: 'src/pages/core/Roadmap.jsx' },
  { path: '/labs', priority: '0.6', changefreq: 'monthly', file: 'src/pages/core/Labs.jsx' },

  // Product Hub 1: Core Agreement Products
  { path: '/products', priority: '0.9', changefreq: 'weekly', file: 'src/pages/products/ProductOverview.jsx' },
  { path: '/products/esignature', priority: '0.9', changefreq: 'monthly', file: 'src/pages/products/ProductOverview.jsx' },
  { path: '/products/document-editor', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/ProductOverview.jsx' },
  { path: '/products/templates', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/ProductOverview.jsx' },
  { path: '/products/automation', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/ProductOverview.jsx' },

  // Product Hub 2: Nexgn AI (Intelligence)
  { path: '/products/ai-summary', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/IntelligenceOverview.jsx' },
  { path: '/products/ai-builder', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/IntelligenceOverview.jsx' },
  { path: '/products/ai-clause-assistant', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/IntelligenceOverview.jsx' },

  // Product Hub 3: Trust & Evidence
  { path: '/products/audit-trail', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/TrustOverview.jsx' },
  { path: '/products/identity-assurance', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/TrustOverview.jsx' },
  { path: '/products/agreement-verification', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/TrustOverview.jsx' },

  // Product Hub 4: Workspace & Management
  { path: '/products/workspace', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/WorkspaceOverview.jsx' },
  { path: '/products/cloud-storage', priority: '0.8', changefreq: 'monthly', file: 'src/pages/products/WorkspaceOverview.jsx' },
  { path: '/products/roles-permissions', priority: '0.7', changefreq: 'monthly', file: 'src/pages/products/WorkspaceOverview.jsx' },
  { path: '/products/activity-logs', priority: '0.7', changefreq: 'monthly', file: 'src/pages/products/WorkspaceOverview.jsx' },

  // Developers
  { path: '/developers', priority: '0.8', changefreq: 'monthly', file: 'src/pages/developers/DevPortal.jsx' },
  { path: '/developers/api-reference', priority: '0.8', changefreq: 'monthly', file: 'src/pages/developers/ApiRef.jsx' },
  { path: '/developers/embedded', priority: '0.7', changefreq: 'monthly', file: 'src/pages/developers/Embedded.jsx' },
  { path: '/developers/webhooks', priority: '0.7', changefreq: 'monthly', file: 'src/pages/developers/Webhooks.jsx' },
  { path: '/developers/sdks', priority: '0.7', changefreq: 'monthly', file: 'src/pages/developers/SDKs.jsx' },
  { path: '/developers/sandbox', priority: '0.7', changefreq: 'monthly', file: 'src/pages/developers/Sandbox.jsx' },
  { path: '/developers/community', priority: '0.6', changefreq: 'monthly', file: 'src/pages/developers/Community.jsx' },

  // Trust Center
  { path: '/trust', priority: '0.9', changefreq: 'monthly', file: 'src/pages/trust/TrustCenter.jsx' },
  { path: '/trust/security', priority: '0.8', changefreq: 'monthly', file: 'src/pages/trust/Security.jsx' },
  { path: '/trust/legality', priority: '0.9', changefreq: 'monthly', file: 'src/pages/trust/Legality.jsx' },
  { path: '/trust/privacy', priority: '0.8', changefreq: 'monthly', file: 'src/pages/trust/Privacy.jsx' },
  { path: '/trust/subprocessors', priority: '0.7', changefreq: 'monthly', file: 'src/pages/trust/Subprocessors.jsx' },
  { path: '/trust/vulnerability-disclosure', priority: '0.7', changefreq: 'monthly', file: 'src/pages/trust/VulnDisclosure.jsx' },
  { path: '/trust/ai-ethics', priority: '0.7', changefreq: 'monthly', file: 'src/pages/trust/AiEthics.jsx' },

  // Sustainability
  { path: '/sustainability', priority: '0.8', changefreq: 'monthly', file: 'src/pages/sustainability/Sustainability.jsx' },

  // Company & Support
  { path: '/about', priority: '0.8', changefreq: 'monthly', file: 'src/pages/company/About.jsx' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly', file: 'src/pages/company/Contact.jsx' },
  { path: '/careers', priority: '0.7', changefreq: 'weekly', file: 'src/pages/company/Careers.jsx' },
  { path: '/press', priority: '0.7', changefreq: 'weekly', file: 'src/pages/company/Press.jsx' },
  { path: '/partners', priority: '0.7', changefreq: 'monthly', file: 'src/pages/company/Partners.jsx' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly', file: 'src/pages/company/Blog.jsx' },
  { path: '/help', priority: '0.8', changefreq: 'weekly', file: 'src/pages/help/HelpCenter.jsx' },

  // Legal Hub
  { path: '/legal/terms', priority: '0.5', changefreq: 'yearly', file: 'src/pages/legal/Terms.jsx' },
  { path: '/legal/privacy-policy', priority: '0.5', changefreq: 'yearly', file: 'src/pages/legal/PrivacyPolicy.jsx' },
  { path: '/legal/cookie-policy', priority: '0.5', changefreq: 'yearly', file: 'src/pages/legal/CookiePolicy.jsx' },
  { path: '/legal/acceptable-use', priority: '0.5', changefreq: 'yearly', file: 'src/pages/legal/AUP.jsx' },
  { path: '/legal/dpa', priority: '0.5', changefreq: 'yearly', file: 'src/pages/legal/DPA.jsx' },
  { path: '/legal/refunds', priority: '0.5', changefreq: 'yearly', file: 'src/pages/legal/Refunds.jsx' },
];

/* =====================================================================
   2. DYNAMIC ROUTES DISCOVERY (Solutions, Alternatives, Blog Posts)
   ===================================================================== */
const getDynamicSolutionRoutes = () => {
  const defaultSlugs = ['startups', 'hr', 'legal', 'sales', 'real-estate', 'finance'];
  const jsonPath = path.resolve(ROOT_DIR, 'src/pages/solutions/solutionsData.json');
  const slugs = new Set(defaultSlugs);

  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath, 'utf-8').trim();
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          data.forEach((item) => item?.slug && slugs.add(item.slug));
        } else if (data && typeof data === 'object') {
          Object.keys(data).forEach((key) => slugs.add(key));
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not parse solutionsData.json, using default solution slugs.', err.message);
    }
  }

  return Array.from(slugs).map((slug) => ({
    path: `/solutions/${slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    file: 'src/pages/solutions/SolutionTemplate.jsx',
  }));
};

const COMPETITOR_SLUGS = ['docusign', 'adobe-sign', 'dropbox-sign', 'pandadoc', 'signnow'];
const getAlternativeRoutes = () =>
  COMPETITOR_SLUGS.map((comp) => ({
    path: `/alternatives/${comp}`,
    priority: '0.8',
    changefreq: 'monthly',
    file: 'src/pages/solutions/AlternativeCompare.jsx',
  }));

const DEFAULT_BLOG_SLUGS = [
  'building-trust-at-scale',
  'shift-to-aes-256',
  'navigating-it-act-2000',
  'designing-frictionless-workflows',
  'webhooks-vs-polling',
  'sustainable-code-reductions',
  'automating-legal-reviews',
  'press-1',
  'press-2',
  'press-3',
];

const getBlogRoutes = () => {
  const jsonPath = path.resolve(ROOT_DIR, 'src/pages/company/blogsData.json');
  const entries = new Map();

  // Seed default blog & press slugs
  DEFAULT_BLOG_SLUGS.forEach((slug) => {
    entries.set(slug, {
      path: `/blog/${slug}`,
      priority: slug === 'building-trust-at-scale' ? '0.8' : '0.7',
      changefreq: 'monthly',
      file: 'src/pages/company/blogsData.json',
      lastmod: null,
    });
  });

  // Dynamically read articles and pressReleases from blogsData.json
  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath, 'utf-8').trim();
      if (raw) {
        const data = JSON.parse(raw);
        const allItems = [...(data.articles || []), ...(data.pressReleases || [])];

        allItems.forEach((item) => {
          if (!item?.slug) return;
          const validIso =
            item.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(item.isoDate) ? item.isoDate : null;

          entries.set(item.slug, {
            path: `/blog/${item.slug}`,
            priority: item.featured ? '0.8' : '0.7',
            changefreq: 'monthly',
            file: 'src/pages/company/blogsData.json',
            lastmod: validIso,
          });
        });
      }
    } catch (err) {
      console.warn('⚠️ Could not parse blogsData.json, using default blog slugs.', err.message);
    }
  }

  return Array.from(entries.values());
};

/* =====================================================================
   3. AEO / GEO STATIC KNOWLEDGE BASE FILES (Non-localized root assets)
   ===================================================================== */
const getGeoKnowledgeRoutes = () => {
  const geoRoutes = [];
  const llmsTxt = path.resolve(ROOT_DIR, 'public/llms.txt');
  if (fs.existsSync(llmsTxt)) {
    geoRoutes.push({
      loc: `${BASE_URL}/llms.txt`,
      lastmod: getLastMod('public/llms.txt'),
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  const llmsDir = path.resolve(ROOT_DIR, 'public/llms');
  if (fs.existsSync(llmsDir)) {
    const files = fs.readdirSync(llmsDir).filter((f) => f.endsWith('.md'));
    files.forEach((file) => {
      geoRoutes.push({
        loc: `${BASE_URL}/llms/${file}`,
        lastmod: getLastMod(`public/llms/${file}`),
        changefreq: 'monthly',
        priority: '0.7',
      });
    });
  }

  return geoRoutes;
};

/* =====================================================================
   4. XML GENERATOR
   ===================================================================== */
const escapeXml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const generateSitemap = () => {
  const allLocalizedRoutes = [
    ...STATIC_ROUTES,
    ...getDynamicSolutionRoutes(),
    ...getAlternativeRoutes(),
    ...getBlogRoutes(),
  ];

  // Deduplicate routes by path
  const uniqueRoutesMap = new Map();
  allLocalizedRoutes.forEach((route) => {
    const normalizedPath = route.path === '/' ? '' : route.path.replace(/\/+$/, '');
    if (!uniqueRoutesMap.has(normalizedPath)) {
      uniqueRoutesMap.set(normalizedPath, { ...route, path: normalizedPath });
    }
  });

  const localizedRoutes = Array.from(uniqueRoutesMap.values());
  const geoRoutes = getGeoKnowledgeRoutes();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // 1. Render localized app routes with full bidirectional hreflang + x-default
  localizedRoutes.forEach((route) => {
    const lastmod = route.lastmod || getLastMod(route.file);
    const xDefaultUrl = `${BASE_URL}/${DEFAULT_LOCALE}${route.path}`;

    LOCALES.forEach((locale) => {
      const locUrl = `${BASE_URL}/${locale}${route.path}`;

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(locUrl)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;

      LOCALES.forEach((altLocale) => {
        const altUrl = `${BASE_URL}/${altLocale}${route.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${escapeXml(altUrl)}"/>\n`;
      });

      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultUrl)}"/>\n`;
      xml += `  </url>\n`;
    });
  });

  // 2. Render AEO / GEO Markdown documents (/llms.txt & /llms/*.md)
  geoRoutes.forEach((doc) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(doc.loc)}</loc>\n`;
    xml += `    <lastmod>${doc.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${doc.changefreq}</changefreq>\n`;
    xml += `    <priority>${doc.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const outputPath = path.resolve(ROOT_DIR, 'public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  const totalUrls = localizedRoutes.length * LOCALES.length + geoRoutes.length;
  console.log(
    `✅ Dynamic sitemap generated at public/sitemap.xml (${localizedRoutes.length} routes × ${LOCALES.length} locales + ${geoRoutes.length} AEO/GEO docs = ${totalUrls} total URLs).`
  );
};

generateSitemap();