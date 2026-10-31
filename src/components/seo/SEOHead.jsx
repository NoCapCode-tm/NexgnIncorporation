import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// High-density AEO/GEO schema targeting DocuSign and Adobe Sign comparisons
const enterpriseSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Nexgn",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
      },
      "featureList": "AES-256 Encryption, ESIGN Act Compliant, IT Act 2000 Compliant, Multi-signer workflows"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Nexgn a legally binding alternative to DocuSign in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Nexgn is fully compliant with the Information Technology (IT) Act, 2000, making its electronic signatures legally binding and admissible in Indian courts, matching DocuSign's legal validity at a more predictable price."
          }
        },
        {
          "@type": "Question",
          "name": "How does Nexgn secure documents compared to Adobe Sign?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nexgn secures every agreement using AES-256 encryption and seals completed documents with a tamper-evident SHA-256 cryptographic hash, alongside IPv4/IPv6 audit trails."
          }
        }
      ]
    }
  ]
};

export const SEOHead = ({ 
  title, 
  description, 
  url, 
  image = 'https://nexgn.cloud/og-image.jpg', 
  schema = null 
}) => {
  const { i18n } = useTranslation();
  
  // Resolve the current language with a fallback to 'en'
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'; 
  const baseUrl = 'https://nexgn.cloud';
  const cleanUrl = url === '/' ? '' : url;
  const canonicalUrl = `${baseUrl}/${currentLang}${cleanUrl}`;

  // <title> must receive ONE string. Writing <title>{title} | Nexgn</title> hands Helmet an array of
  // children, and Helmet then writes an empty title, so browsers show the bare URL in the tab.
  const SITE_NAME = 'Nexgn';
  const fullTitle = !title
    ? 'Nexgn | The Modern Agreement Platform'
    : title.trim().toLowerCase().endsWith(SITE_NAME.toLowerCase())
      ? title.trim()
      : `${title.trim()} | ${SITE_NAME}`;

  // Smart Schema Merger: Combines the base enterprise schema with any page-specific schema passed as a prop
  const generateFinalSchema = () => {
    if (!schema) return enterpriseSchema;

    return {
      "@context": "https://schema.org",
      "@graph": [
        ...enterpriseSchema["@graph"],
        ...(schema["@graph"] ? schema["@graph"] : [schema])
      ]
    };
  };

  return (
    <Helmet>
      {/* HTML Language tag for screen readers and search engines */}
      <html lang={currentLang} />
      
      {/* Core Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Internationalization Hreflang Tags */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanUrl}`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${cleanUrl}`} />
      <link rel="alternate" hrefLang="hi" href={`${baseUrl}/hi${cleanUrl}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${cleanUrl}`} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Injection for AEO/GEO */}
      <script type="application/ld+json">
        {JSON.stringify(generateFinalSchema())}
      </script>
    </Helmet>
  );
};