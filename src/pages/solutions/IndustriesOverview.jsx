import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCode, FiUser, FiEye, FiEdit3 } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  ProductNote,
  FlowSteps,
  ProductBulletList,
} from '../../components/products/ProductLayout';

const LANGS = ['en', 'es', 'hi'];

/**
 * Solutions > By Industry hub. One page, three sections:
 *   /solutions/startups   /solutions/real-estate   /solutions/agencies
 */
const IndustriesOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const k = 'solutions.industries';
  const tr = (key, fallback) => t(`${k}.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Nexgn by Industry: Startups, Real Estate & Agencies | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'E-signature workflows tailored to startups, real estate and property management, and agencies and consulting.'
  );
  const pageUrl = `https://nexgn.cloud/${currentLng}/solutions/startups`;
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
        id: 'startups',
        routeSlug: 'startups',
        aliases: ['saas', 'technology'],
        navLabel: t(`${k}.startups.navLabel`, 'Startups & Technology (SaaS)'),
        title: t(`${k}.startups.title`, 'Startups & Technology (SaaS)'),
        subtitle: t(`${k}.startups.subtitle`, 'Enterprise-grade agreements. Startup-friendly pricing.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.startups.pricing.title`, 'The Pricing Differentiator')}>
              <ProductText>
                {t(
                  `${k}.startups.pricing.desc`,
                  'No per-envelope tax. Nexgn’s Starter and Business tiers let startups scale their hiring and sales without restrictive limits, so you are never penalized for growing.'
                )}
              </ProductText>
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.startups.api.title`, 'API & Developer Teaser')}>
              <ProductNote icon={<FiCode />}>
                {t(
                  `${k}.startups.api.desc`,
                  'Building your own app? Embed our signing flows directly into your SaaS using the Nexgn API.'
                )}
              </ProductNote>
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'real-estate',
        routeSlug: 'real-estate',
        aliases: ['realestate', 'property'],
        navLabel: t(`${k}.realEstate.navLabel`, 'Real Estate & Property Management'),
        title: t(`${k}.realEstate.title`, 'Real Estate & Property Management'),
        subtitle: t(`${k}.realEstate.subtitle`, 'Close leases from the property, not the printer.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.realEstate.multi.title`, 'Multi-Signer Workflows')}>
              <ProductText>
                {t(
                  `${k}.realEstate.multi.desc`,
                  'Landlords, tenants and brokers each sign in the right order. Nexgn routes the lease from one party to the next automatically.'
                )}
              </ProductText>
              <FlowSteps
                steps={[
                  { label: t(`${k}.realEstate.multi.s1`, 'Tenant Signs'), icon: <FiUser /> },
                  { label: t(`${k}.realEstate.multi.s2`, 'Broker Reviews'), icon: <FiEye /> },
                  { label: t(`${k}.realEstate.multi.s3`, 'Landlord Countersigns'), icon: <FiEdit3 /> },
                ]}
              />
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.realEstate.editor.title`, 'Document Editor Showcase')}>
              <ProductText>
                {t(
                  `${k}.realEstate.editor.desc`,
                  'Real estate contracts have dozens of initial fields. Drag Signature and Date widgets onto every page, even on a 40-page lease.'
                )}
              </ProductText>
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'agencies',
        routeSlug: 'agencies',
        aliases: ['consulting'],
        navLabel: t(`${k}.agencies.navLabel`, 'Agencies & Consulting'),
        title: t(`${k}.agencies.title`, 'Agencies & Consulting'),
        subtitle: t(`${k}.agencies.subtitle`, 'Professional agreements for professional services.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.agencies.use.title`, 'Use Cases')}>
              <ProductText>
                {t(
                  `${k}.agencies.use.desc`,
                  'Clean, branded agreement workflows help agencies look professional to every client.'
                )}
              </ProductText>
              <ProductBulletList
                items={[
                  t(`${k}.agencies.use.i1`, 'Master Services Agreements (MSAs)'),
                  t(`${k}.agencies.use.i2`, 'Statements of Work (SOWs)'),
                  t(`${k}.agencies.use.i3`, 'Freelancer NDAs'),
                ]}
              />
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.agencies.sync.title`, 'Cloud Sync')}>
              <ProductText>
                {t(
                  `${k}.agencies.sync.desc`,
                  'Keep client contracts exactly where client files live. Signed SOWs drop straight into each client’s Google Drive folder.'
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
      <SEOHead title={seoTitle} description={seoDescription} url="/solutions/startups" schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'SOLUTIONS')}
        title={tr('hero.title', 'By Industry')}
        titleAccent={tr('hero.accent', '(Vertical Markets)')}
        lead={tr('hero.lead', 'Tailoring the language to match the specific regulatory and operational reality of different verticals.')}
        align="center"
        navHeader={tr('nav.header', 'CATEGORIES')}
        sections={sections}
      />
    </>
  );
};

export default IndustriesOverview;