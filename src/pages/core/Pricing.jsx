// src/pages/core/Pricing.jsx
import React from 'react';
import { SEOHead } from '../../components/seo/SEOHead';

const Pricing = () => {
  // Example Product Schema for Google to show pricing directly in search results
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Nexgn Starter Plan",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "900.00",
      "priceCurrency": "INR"
    }
  };

  return (
    <div className="pricing-page">
      <SEOHead 
        title="Simple Pricing" 
        description="Transparent, affordable pricing for startups and enterprise. Start sending legally binding documents for free."
        url="/pricing"
        schema={pricingSchema}
      />
      
      {/* Rest of your UI components go here */}
      <h1>Simple pricing. No surprise envelope taxes.</h1>
    </div>
  );
};

export default Pricing;