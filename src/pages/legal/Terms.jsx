import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import LegalLayout, { LegalText, LegalCallout } from '../../components/legal/LegalLayout';

const Terms = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.terms.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Terms of Service | Nexgn Legal Hub');
  const seoDescription = tr(
    'seo.description',
    'Read the Nexgn Terms of Service: acceptance of terms, our Bring Your Own Storage model, API usage and rate limits, and limitation of liability.'
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDescription,
    url: 'https://nexgn.cloud/legal/terms',
    isPartOf: { '@id': 'https://nexgn.cloud/#website' },
  };

  const sections = [
    {
      id: 'acceptance',
      navLabel: tr('section.acceptance.navLabel', '1. Acceptance of Terms'),
      title: tr('acceptance.title', '1. Acceptance of Terms'),
      body: (
        <LegalText>
          {tr(
            'acceptance.desc',
            'By accessing or using the Nexgn platform, APIs, or associated services (collectively, the "Service"), you agree to be bound by these Terms of Service. If you are accepting these terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these terms.'
          )}
        </LegalText>
      ),
    },
    {
      id: 'service',
      navLabel: tr('section.service.navLabel', '2. Service Description & Cloud Storage'),
      title: tr('service.title', '2. Service Description & Cloud Storage'),
      body: (
        <>
          <LegalText>
            {tr('service.desc', 'Nexgn provides an electronic signature and agreement workflow routing platform.')}
          </LegalText>
          <LegalCallout eyebrow={tr('service.clause.eyebrow', 'THE "BYOS" CLAUSE')}>
            {tr(
              'service.clause.text',
              'Nexgn operates on a "Bring Your Own Storage" model. By connecting your Google Workspace/Drive, you acknowledge that Nexgn is merely a routing conduit. Nexgn is not a permanent document repository. We are not liable for data loss, unauthorized access, or misconfiguration occurring within your connected third-party storage environment.'
            )}
          </LegalCallout>
        </>
      ),
    },
    {
      id: 'api',
      navLabel: tr('section.api.navLabel', '3. API Usage and Rate Limiting'),
      title: tr('api.title', '3. API Usage and Rate Limiting'),
      body: (
        <LegalText>
          {tr(
            'api.desc',
            'For users on the Business or Enterprise plans utilizing the Nexgn API: You agree to access the API only according to the documentation. Nexgn reserves the right to enforce rate limits (e.g., maximum requests per minute) to ensure platform stability. Attempting to bypass rate limits or reverse-engineer the API may result in immediate account suspension.'
          )}
        </LegalText>
      ),
    },
    {
      id: 'liability',
      navLabel: tr('section.liability.navLabel', '4. Limitation of Liability & Legal Disclaimer'),
      title: tr('liability.title', '4. Limitation of Liability & Legal Disclaimer'),
      body: (
        <LegalText>
          {tr(
            'liability.desc',
            'Nexgn provides software to facilitate electronic signatures. We do not provide legal advice. It is the User’s sole responsibility to ensure that electronic signatures are legally valid for their specific jurisdiction and document type (e.g., certain jurisdictions do not allow electronic signatures for wills or property transfers). Nexgn disclaims all liability for the enforceability of contracts executed via the platform.'
          )}
        </LegalText>
      ),
    },
  ];

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/terms" schema={schema} />
      <LegalLayout
        eyebrow={tr('hero.eyebrow', 'LEGAL HUB')}
        title={tr('hero.title', 'Terms of Service')}
        navHeader={tr('nav.header', 'ON THIS PAGE')}
        sections={sections}
      />
    </>
  );
};

export default Terms;