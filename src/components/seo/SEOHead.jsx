import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title, 
  description, 
  url, 
  image = 'https://nexgn.cloud/og-image.jpg', // Default image, but can be overridden
  schema = null // Optional JSON-LD schema
}) => {
  return (
    <Helmet>
      {/* Standard HTML Meta Tags */}
      <title>{title} | Nexgn</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://nexgn.cloud${url}`} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://nexgn.cloud${url}`} />
      <meta property="og:title" content={`${title} | Nexgn`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`https://nexgn.cloud${url}`} />
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