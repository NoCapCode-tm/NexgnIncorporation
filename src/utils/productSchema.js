const SITE = 'https://nexgn.cloud';
const LANG_PREFIX = /^\/(en|es|hi)(?=\/|$)/;

/* Plan range shown on /pricing (Free, Starter, Business). Keep in sync with Pricing.jsx. */
const OFFER = {
  '@type': 'AggregateOffer',
  priceCurrency: 'USD',
  lowPrice: '0',
  highPrice: '19',
  offerCount: 3,
  availability: 'https://schema.org/InStock',
};

/**
 * schema.org Product for a single /products/<slug> URL (clears Ahrefs "Product page missing Product schema").
 * Returns null for anything that is not a product detail URL (/products itself, /solutions/..., etc.).
 *
 * `sections` are the hub's sections; the one whose id / routeSlug / alias matches the URL slug supplies the
 * name and description. Retired URLs that no longer have their own section (e.g. /products/ai-clause-assistant)
 * fall back to the hub's own title and lead.
 */
export const buildProductSchema = ({ pathname, lng = 'en', sections = [], hubTitle = '', hubLead = '' }) => {
  const path = (pathname || '').replace(LANG_PREFIX, '').replace(/\/+$/, '');
  const m = path.match(/^\/products\/([^/]+)$/);
  if (!m) return null;
  const slug = m[1].toLowerCase();

  const section = sections.find(
    (s) =>
      s.id?.toLowerCase() === slug ||
      s.routeSlug?.toLowerCase() === slug ||
      (Array.isArray(s.aliases) && s.aliases.some((a) => a.toLowerCase() === slug))
  );

  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const name = str(section?.title) || str(hubTitle) || 'Nexgn';
  const description =
    str(section?.subtitle) || str(hubLead) || `${name}: part of the Nexgn agreement platform.`;
  const url = `${SITE}/${lng}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: `Nexgn ${name}`.replace(/^Nexgn Nexgn/i, 'Nexgn'),
    description,
    url,
    image: `${SITE}/android-chrome-512x512.png`,
    brand: { '@type': 'Brand', name: 'Nexgn' },
    category: 'Business software > Electronic signature',
    offers: { ...OFFER, url: `${SITE}/${lng}/pricing` },
  };
};