import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const SEOHead = ({ 
  title, 
  description, 
  url, 
  image = 'https://nexgn.cloud/og-image.jpg', 
  schema = null 
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'; 
  const baseUrl = 'https://nexgn.cloud';
  const cleanUrl = url === '/' ? '' : url;
  const canonicalUrl = `${baseUrl}/${currentLang}${cleanUrl}`;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title} | Nexgn</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* FIXED: capital "L" in hrefLang */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanUrl}`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${cleanUrl}`} />
      <link rel="alternate" hrefLang="hi" href={`${baseUrl}/hi${cleanUrl}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${cleanUrl}`} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={`${title} | Nexgn`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={`${title} | Nexgn`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};