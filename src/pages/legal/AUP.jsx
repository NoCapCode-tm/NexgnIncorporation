import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import LegalLayout, { LegalText, LegalBullets } from '../../components/legal/LegalLayout';

const AUP = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.aup.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Acceptable Use Policy | Nexgn Legal Hub');
  const seoDescription = tr(
    'seo.description',
    'Review the Nexgn Acceptable Use Policy outlining prohibited activities, anti-spam rules, and compliance standards.'
  );

  const sections = [
    {
      id: 'prohibited',
      navLabel: tr('policy.prohibited.navLabel', '1. Prohibited Activities'),
      title: tr('policy.prohibited.title', '1. Unlawful and Harmful Use'),
      body: (
        <>
          <LegalText>
            {tr(
              'policy.prohibited.content',
              'You may not use Nexgn to process, store, or transmit any agreements that:'
            )}
          </LegalText>
          <LegalBullets
            items={[
              tr('policy.prohibited.b1', 'Facilitate illegal activities, fraud, or money laundering.'),
              tr('policy.prohibited.b2', 'Contain malicious code, malware, or viruses disguised as PDFs.'),
              tr('policy.prohibited.b3', 'Involve the sale of illegal goods, weapons, or controlled substances.'),
            ]}
          />
        </>
      ),
    },
    {
      id: 'spam',
      navLabel: tr('policy.spam.navLabel', '2. Spam & Abuse Prevention'),
      title: tr('policy.spam.title', '2. Signature Request Spam'),
      body: (
        <LegalText>
          {tr(
            'policy.spam.content',
            'Nexgn relies on a high email deliverability reputation. You may not use the platform to send unsolicited signature requests (spam) or to harass individuals. Accounts found to be mass-emailing unconsenting recipients will be immediately terminated without a refund.'
          )}
        </LegalText>
      ),
    },
  ];

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/acceptable-use" />
      <LegalLayout
        align="center"
        eyebrow={tr('hero.eyebrow', 'LEGAL HUB')}
        title={tr('hero.title', 'Acceptable Use\nPolicy')}
        lead={tr('hero.lead', 'Our global support and engineering teams\nare ready to assist you.')}
        navHeader={tr('nav.header', 'ON THIS PAGE')}
        sections={sections}
      />
    </>
  );
};

export default AUP;