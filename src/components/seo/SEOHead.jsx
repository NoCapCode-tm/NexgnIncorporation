import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const BASE_URL = 'https://nexgn.cloud';
const DEFAULT_IMAGE = `${BASE_URL}/brand/og-image.png`;
const SUPPORTED_LANGS = ['en', 'es', 'hi'];

const getDynamicOgImageUrl = (pathname = '/') => {
  const clean = String(pathname || '/').replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/en') return DEFAULT_IMAGE;
  return `${BASE_URL}/og${clean}.png`;
};

export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

export const buildOrganizationNode = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Nexgn',
  alternateName: 'Nexgn Agreement Platform',
  legalName: 'NoCapCode Inc.',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  image: DEFAULT_IMAGE,
  description:
    'Enterprise-grade electronic signature and Contract Lifecycle Management (CLM) platform engineered with AES-256 encryption, SHA-256 tamper-evident sealing, and Bring Your Own Storage (BYOS).',
  foundingDate: '2026',
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'AdministrativeArea', name: 'European Union' },
    { '@type': 'Country', name: 'United Kingdom' },
    'Worldwide',
  ],
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302021',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Santa Fe',
      addressRegion: 'NM',
      postalCode: '87501',
      addressCountry: 'US',
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'help@nexgn.cloud',
      availableLanguage: ['English', 'Spanish', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'security',
      email: 'security@nexgn.cloud',
      url: `${BASE_URL}/en/trust/vulnerability-disclosure`,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'privacy',
      email: 'privacy@nexgn.cloud',
      url: `${BASE_URL}/en/trust/privacy`,
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/nexgncloud',
    'https://x.com/nexgncloud',
    'https://www.instagram.com/nexgn.cloud',
    'https://www.facebook.com/nexgncloud',
    'https://postman.com/nexgn-public',
    'https://fazier.com/launches/nexgn.cloud',
    'https://startupfa.me/s/nexgn',
  ],
  knowsAbout: [
    'Electronic Signatures',
    'Contract Lifecycle Management',
    'Information Technology Act 2000',
    'Indian Evidence Act Section 65B',
    'US ESIGN Act',
    'UETA',
    'EU eIDAS Regulation',
    'AES-256 Encryption',
    'SHA-256 Cryptographic Hashing',
    'Bring Your Own Storage (BYOS)',
  ],
});

export const buildWebSiteNode = (lng = 'en') => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: BASE_URL,
  name: 'Nexgn',
  inLanguage: lng,
  publisher: { '@id': ORGANIZATION_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/${lng}/help?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const buildBreadcrumbs = (lng = 'en', items = []) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url.startsWith('http')
      ? item.url
      : `${BASE_URL}/${lng}${item.url === '/' ? '' : item.url}`,
  })),
});

export const SEOHead = ({
  title,
  description = '',
  url = '/',
  image = null,
  type = 'website',
  noindex = false,
  articleMeta = null,
  schema = null,
}) => {
  const { i18n } = useTranslation();
  const rawLang = i18n.resolvedLanguage || i18n.language || 'en';
  const currentLang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : 'en';

  const cleanUrl = !url || url === '/' ? '' : url.startsWith('/') ? url : `/${url}`;
  const routePath = `/${currentLang}${cleanUrl}`;
  const canonicalUrl = `${BASE_URL}${routePath}`;
  const resolvedImage = image || getDynamicOgImageUrl(routePath);

  const SITE_NAME = 'Nexgn';
  const fullTitle = !title
    ? 'Nexgn | The Modern Agreement Platform'
    : title.trim().toLowerCase().includes(SITE_NAME.toLowerCase())
      ? title.trim()
      : `${title.trim()} | ${SITE_NAME}`;

  const generateFinalSchema = () => {
    const baseNodes = [buildOrganizationNode(), buildWebSiteNode(currentLang)];

    if (!schema) {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          ...baseNodes,
          {
            '@type': 'WebPage',
            '@id': `${canonicalUrl}#webpage`,
            url: canonicalUrl,
            name: fullTitle,
            description,
            inLanguage: currentLang,
            isPartOf: { '@id': WEBSITE_ID },
            publisher: { '@id': ORGANIZATION_ID },
          },
        ],
      };
    }

    const rawNodes = schema['@graph'] ? schema['@graph'] : [schema];
    const filteredPageNodes = rawNodes
      .filter((n) => n && n['@type'] !== 'Organization' && n['@type'] !== 'WebSite')
      .map((n) => {
        const copy = { ...n };
        delete copy['@context'];
        return copy;
      });

    return {
      '@context': 'https://schema.org',
      '@graph': [...baseNodes, ...filteredPageNodes],
    };
  };

  const robotsContent = noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en${cleanUrl}`} />
      <link rel="alternate" hrefLang="es" href={`${BASE_URL}/es${cleanUrl}`} />
      <link rel="alternate" hrefLang="hi" href={`${BASE_URL}/hi${cleanUrl}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en${cleanUrl}`} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Nexgn" />
      <meta property="og:locale" content={currentLang === 'hi' ? 'hi_IN' : currentLang === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {type === 'article' && articleMeta?.publishedTime && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {type === 'article' && articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {type === 'article' && articleMeta?.section && (
        <meta property="article:section" content={articleMeta.section} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nexgncloud" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      <script type="application/ld+json">{JSON.stringify(generateFinalSchema())}</script>
    </Helmet>
  );
};