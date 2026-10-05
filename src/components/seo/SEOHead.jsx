import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const SEOHead = ({ 
  title, 
  description, 
  url, // Expects the raw URL path (e.g., "/pricing" or "/")
  image = 'https://nexgn.cloud/og-image.jpg', 
  schema = null 
}) => {
  const { i18n } = useTranslation();
  
  // Fallback to 'en' if i18n isn't fully loaded yet
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'; 
  
  const baseUrl = 'https://nexgn.cloud';
  
  // Clean the URL (prevent double slashes if url is just "/")
  const cleanUrl = url === '/' ? '' : url;
  
  // The canonical URL MUST include the language prefix now
  const canonicalUrl = `${baseUrl}/${currentLang}${cleanUrl}`;

  return (
    <Helmet>
      {/* Set HTML Lang Attribute for Accessibility & SEO */}
      <html lang={currentLang} />

      {/* Standard HTML Meta Tags */}
      <title>{title} | Nexgn</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* 🌍 GLOBAL SEO: HREFLANG TAGS */}
      {/* Tells Google that these pages are translated versions of each other */}
      <link rel="alternate" hreflang="en" href={`${baseUrl}/en${cleanUrl}`} />
      <link rel="alternate" hreflang="es" href={`${baseUrl}/es${cleanUrl}`} />
      <link rel="alternate" hreflang="hi" href={`${baseUrl}/hi${cleanUrl}`} />
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}/en${cleanUrl}`} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={`${title} | Nexgn`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={`${title} | Nexgn`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data for Google Rich Snippets */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};