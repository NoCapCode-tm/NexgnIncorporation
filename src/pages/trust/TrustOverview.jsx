import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiClock, FiGlobe, FiHash, FiKey, FiMail, FiMonitor, FiShield } from 'react-icons/fi';
import useCurrentPath from '../../hooks/useCurrentPath';
import { SEOHead } from '../../components/seo/SEOHead';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  FeatureCardsGrid,
  FlagList,
  ProductStepList,
} from '../../components/products/ProductLayout';
import { FlagUS, FlagEU, FlagIN } from '../../components/products/Flags';

const LANGS = ['en', 'es', 'hi'];

/**
 * Trust & Evidence hub. One page, two sections:
 *   /products/audit-trail        -> Audit Trail & Evidence
 *   /products/identity-assurance -> Signer Identity Assurance
 * AuditTrail.jsx and Identity.jsx both re-export this; ProductLayout scrolls to the section.
 */
const TrustOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const pagePath = useCurrentPath('/products/audit-trail');
  const tr = (key, fallback) => t(`products.trustEvidence.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Trust & Evidence | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Every Nexgn agreement carries a tamper-evident audit certificate and tiered signer identity checks, built for Enterprise IT, Legal Ops and Compliance teams.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}${pagePath}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: seoTitle,
    description: seoDescription,
    inLanguage: currentLng,
    isPartOf: { '@type': 'WebSite', name: 'Nexgn', url: 'https://nexgn.cloud' },
  };

  const sections = useMemo(
    () => [
      {
        id: 'audit-trail',
        routeSlug: 'audit-trail',
        aliases: ['audit', 'evidence', 'audit-trails'],
        navLabel: t('products.trustEvidence.audit.navLabel', 'Audit Trail & Evidence'),
        title: t('products.trustEvidence.audit.title', 'Audit Trail & Evidence'),
        subtitle: t(
          'products.trustEvidence.audit.subtitle',
          'Every agreement leaves an irrefutable trail.'
        ),
        body: (
          <>
            <ProductSubSection
              title={t('products.trustEvidence.audit.certificate.title', 'The Certificate Breakdown')}
            >
              <ProductText>
                {t(
                  'products.trustEvidence.audit.certificate.desc',
                  'Every completed agreement carries an Audit Certificate. It records who signed, from where, on which device and at what exact moment, and seals the document with a hash so any later change can be detected.'
                )}
              </ProductText>
              <FeatureCardsGrid
                columns={4}
                items={[
                  {
                    label: t('products.trustEvidence.audit.certificate.hash', 'Cryptographic SHA-256 Hash'),
                    icon: <FiHash />,
                  },
                  {
                    label: t('products.trustEvidence.audit.certificate.ip', 'Signer IPv4/IPv6 Telemetry'),
                    icon: <FiGlobe />,
                  },
                  {
                    label: t('products.trustEvidence.audit.certificate.time', 'Precise UTC Timestamps'),
                    icon: <FiClock />,
                  },
                  {
                    label: t('products.trustEvidence.audit.certificate.device', 'Browser/Device User-Agent'),
                    icon: <FiMonitor />,
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.trustEvidence.audit.legality.title', 'Global Legality')}
            >
              <ProductText>
                {t(
                  'products.trustEvidence.audit.legality.desc',
                  'Nexgn signatures are built to align with the major e-signature laws in the US, the EU and India.'
                )}
              </ProductText>
              <FlagList
                items={[
                  { label: t('products.trustEvidence.audit.legality.us', 'ESIGN (US)'), flag: <FlagUS /> },
                  { label: t('products.trustEvidence.audit.legality.eu', 'eIDAS (EU)'), flag: <FlagEU /> },
                  {
                    label: t('products.trustEvidence.audit.legality.in', 'IT Act 2000 (India)'),
                    flag: <FlagIN />,
                  },
                ]}
              />
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'identity-assurance',
        routeSlug: 'identity-assurance',
        aliases: ['identity', 'signer-identity'],
        navLabel: t('products.trustEvidence.identity.navLabel', 'Signer Identity Assurance'),
        title: t('products.trustEvidence.identity.title', 'Signer Identity Assurance'),
        body: (
          <>
            <ProductSubSection
              title={t('products.trustEvidence.identity.tiers.title', 'Tiered Trust')}
            >
              <ProductText>
                {t(
                  'products.trustEvidence.identity.tiers.desc',
                  'Match the level of verification to the risk of the contract. Every signer starts with a secure email link; add OTP or SMS checks, or government ID verification for Enterprise agreements.'
                )}
              </ProductText>
              <ProductStepList
                steps={[
                  {
                    step: t('products.trustEvidence.identity.tiers.base', 'BASE'),
                    title: t(
                      'products.trustEvidence.identity.tiers.baseTitle',
                      'Secure Email Link (Standard)'
                    ),
                    icon: <FiMail />,
                  },
                  {
                    step: t('products.trustEvidence.identity.tiers.middle', 'MIDDLE'),
                    title: t('products.trustEvidence.identity.tiers.middleTitle', 'OTP / SMS Verification'),
                    icon: <FiKey />,
                  },
                  {
                    step: t('products.trustEvidence.identity.tiers.top', 'TOP'),
                    title: t(
                      'products.trustEvidence.identity.tiers.topTitle',
                      'Government ID / DigiLocker Verification (For Enterprise)'
                    ),
                    icon: <FiShield />,
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.trustEvidence.identity.privacy.title', 'Privacy Commitment')}
            >
              <ProductText>
                {t(
                  'products.trustEvidence.identity.privacy.desc',
                  'Nexgn does not store sensitive government IDs in plain text—we only store the cryptographic verification token. You get proof that a signer was verified, without holding a copy of their ID.'
                )}
              </ProductText>
            </ProductSubSection>
          </>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url={pagePath} schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'PRODUCT')}
        title={tr('hero.title', 'Trust & Evidence')}
        lead={tr(
          'hero.lead',
          'This is for the Enterprise IT buyers, Legal Ops, and Compliance Officers.'
        )}
        align="center"
        navHeader={tr('nav.header', 'CATEGORIES')}
        sections={sections}
      />
    </>
  );
};

export default TrustOverview;