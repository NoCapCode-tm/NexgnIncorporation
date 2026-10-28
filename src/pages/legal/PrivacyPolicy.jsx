import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import LegalLayout, {
  LegalText,
  LegalBullets,
  LegalCallout,
  LegalCards,
  LegalGuarantee,
} from '../../components/legal/LegalLayout';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.privacy.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Privacy Policy | Nexgn Legal Hub');
  const seoDescription = tr(
    'seo.description',
    'Review the Nexgn Privacy Policy to understand our role as a data processor, telemetry collection, and strict AI data isolation guarantees.'
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDescription,
    url: 'https://nexgn.cloud/legal/privacy-policy',
    isPartOf: { '@id': 'https://nexgn.cloud/#website' },
  };

  const sections = [
    {
      id: 'role',
      navLabel: tr('section.role.navLabel', '1. Our Role in Your Privacy'),
      title: tr('role.title', '1. Our Role in Your Privacy'),
      body: (
        <>
          <LegalText>
            {tr('role.desc', 'Under global data protection laws, including the GDPR and India’s DPDP Act:')}
          </LegalText>
          <LegalCards
            cards={[
              {
                eyebrow: tr('role.card1.eyebrow', 'THE USER (YOU)'),
                title: tr('role.card1.title', 'Data Controller'),
                text: tr('role.card1.desc', 'You decide what documents to upload and who to send them to.'),
              },
              {
                eyebrow: tr('role.card2.eyebrow', 'NEXGN'),
                title: tr('role.card2.title', 'Data Processor'),
                text: tr(
                  'role.card2.desc',
                  'We process the documents and signer telemetry strictly on your instructions to facilitate the signature workflow.'
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: 'telemetry',
      navLabel: tr('section.telemetry.navLabel', '2. Collection of Signer Telemetry'),
      title: tr('telemetry.title', '2. Collection of Signer Telemetry'),
      body: (
        <>
          <LegalText>
            {tr(
              'telemetry.desc',
              'To generate a legally binding Audit Certificate, Nexgn automatically collects the following information from individuals who view or sign a document:'
            )}
          </LegalText>
          <LegalBullets
            items={[
              tr('telemetry.bullet1', 'IPv4 and IPv6 network addresses.'),
              tr('telemetry.bullet2', 'Cryptographic UTC timestamps of viewing and signing actions.'),
              tr('telemetry.bullet3', 'Browser and Operating System User-Agent strings.'),
            ]}
          />
          <LegalCallout eyebrow={tr('telemetry.note.eyebrow', 'NOTE')}>
            {tr(
              'telemetry.note.desc',
              'This data is permanently embedded into the cryptographic Audit Certificate and stored in the Data Controller’s connected storage.'
            )}
          </LegalCallout>
        </>
      ),
    },
    {
      id: 'ai',
      navLabel: tr('section.ai.navLabel', '3. Artificial Intelligence & Data Isolation'),
      title: tr('ai.title', '3. Artificial Intelligence & Data Isolation'),
      body: (
        <>
          <LegalText>
            {tr(
              'ai.desc',
              'If a Workspace Admin opts into Nexgn AI features (e.g., AI Agreement Summary), document text is securely transmitted to our AI sub-processors via zero-retention enterprise APIs.'
            )}
          </LegalText>
          <LegalGuarantee>
            {tr(
              'ai.guarantee',
              'Nexgn explicitly guarantees that customer documents, templates, and signatures are never used to train public or foundational AI models.'
            )}
          </LegalGuarantee>
        </>
      ),
    },
  ];

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/privacy-policy" schema={schema} />
      <LegalLayout
        eyebrow={tr('hero.eyebrow', 'LEGAL HUB')}
        title={tr('hero.title', 'Privacy Policy')}
        navHeader={tr('nav.header', 'ON THIS PAGE')}
        sections={sections}
      />
    </>
  );
};

export default PrivacyPolicy;