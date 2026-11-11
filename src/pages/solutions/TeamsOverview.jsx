import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiUser,
  FiZap,
  FiMail,
  FiMousePointer,
  FiEdit3,
  FiCheckCircle,
  FiHash,
  FiClock,
  FiMapPin,
  FiShield,
} from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import { FlagUS, FlagEU, FlagIN } from '../../components/products/Flags';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  ChatExampleGrid,
  ProductBulletList,
  FlowSteps,
  FeatureCardsGrid,
  FlagList,
} from '../../components/products/ProductLayout';

const LANGS = ['en', 'es', 'hi'];

/**
 * Solutions > By Team hub. One page, three sections:
 *   /solutions/hr    /solutions/sales    /solutions/legal
 */
const TeamsOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const k = 'solutions.teams';
  const tr = (key, fallback) => t(`${k}.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Nexgn for Teams: HR, Sales & Legal | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Departmental e-signature workflows for HR, Sales and Legal teams: faster onboarding, quicker deal closes and audit-ready contracts.'
  );
  const pageUrl = `https://nexgn.cloud/${currentLng}/solutions/hr`;
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

  const pain = (key, text) => ({ role: tr(`${key}.painLabel`, 'PAIN'), icon: <FiZap />, text });
  const fix = (key, text) => ({ role: tr(`${key}.fixLabel`, 'NEXGN SOLUTION'), icon: <FiCheckCircle />, text });

  const sections = useMemo(
    () => [
      {
        id: 'hr',
        routeSlug: 'hr',
        aliases: ['human-resources'],
        navLabel: t(`${k}.hr.navLabel`, 'HR'),
        title: t(`${k}.hr.title`, 'HR'),
        subtitle: t(`${k}.hr.subtitle`, 'Onboard people, not paperwork.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.hr.problem.title`, 'The Problem & Solution')}>
              <ChatExampleGrid
                messages={[
                  pain('hr', t(`${k}.hr.problem.pain`, 'New hires wait days for offer letters, and chasing signatures buries HR in follow-ups.')),
                  fix('hr', t(`${k}.hr.problem.fix`, 'Send offer letters and onboarding packs in minutes, with automatic reminders until everyone has signed.')),
                ]}
              />
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.hr.highlight.title`, 'Template Highlight')}>
              <ProductBulletList
                items={[
                  t(`${k}.hr.highlight.i1`, 'Offer letters and employment contracts'),
                  t(`${k}.hr.highlight.i2`, 'NDAs and policy acknowledgements'),
                  t(`${k}.hr.highlight.i3`, 'Bulk send to an entire hiring cohort'),
                ]}
              />
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'sales',
        routeSlug: 'sales',
        aliases: ['sales-teams'],
        navLabel: t(`${k}.sales.navLabel`, 'Sales'),
        title: t(`${k}.sales.title`, 'Sales'),
        subtitle: t(`${k}.sales.subtitle`, 'Close deals while the customer is still excited.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.sales.problem.title`, 'The Problem & Solution')}>
              <ChatExampleGrid
                messages={[
                  pain('sales', t(`${k}.sales.problem.pain`, 'Deals stall when contracts sit in an inbox waiting for a printer or a laptop.')),
                  fix('sales', t(`${k}.sales.problem.fix`, 'Customers sign from any device in seconds, so quotes turn into revenue the same day.')),
                ]}
              />
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.sales.frictionless.title`, 'The Frictionless Signer')}>
              <ProductText>
                {t(`${k}.sales.frictionless.desc`, 'No account, no app, no download. Your customer signs in four taps.')}
              </ProductText>
              <FlowSteps
                steps={[
                  { label: t(`${k}.sales.frictionless.s1`, 'Email'), icon: <FiMail /> },
                  { label: t(`${k}.sales.frictionless.s2`, 'Tap link'), icon: <FiMousePointer /> },
                  { label: t(`${k}.sales.frictionless.s3`, 'Type signature'), icon: <FiEdit3 /> },
                  { label: t(`${k}.sales.frictionless.s4`, 'Complete'), icon: <FiCheckCircle /> },
                ]}
              />
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'legal',
        routeSlug: 'legal',
        aliases: ['legal-teams'],
        navLabel: t(`${k}.legal.navLabel`, 'Legal'),
        title: t(`${k}.legal.title`, 'Legal'),
        subtitle: t(`${k}.legal.subtitle`, 'Contracts you can defend.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.legal.evidence.title`, 'Evidence Deep Dive')}>
              <ProductText>
                {t(`${k}.legal.evidence.desc`, 'Every signature is backed by a tamper-evident record that stands up in review.')}
              </ProductText>
              <FeatureCardsGrid
                columns={4}
                items={[
                  { label: t(`${k}.legal.evidence.hash`, 'SHA-256 Cryptographic Hashing'), icon: <FiHash /> },
                  { label: t(`${k}.legal.evidence.time`, 'Timestamps'), icon: <FiClock /> },
                  { label: t(`${k}.legal.evidence.ip`, 'IP & Location'), icon: <FiMapPin /> },
                  { label: t(`${k}.legal.evidence.id`, 'Signer Identity'), icon: <FiUser /> },
                ]}
              />
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.legal.compliance.title`, 'Compliance')}>
              <ProductText>
                {t(`${k}.legal.compliance.desc`, 'Built to meet the e-signature laws where you do business.')}
              </ProductText>
              <FlagList
                items={[
                  { flag: <FlagUS />, label: 'ESIGN / UETA' },
                  { flag: <FlagEU />, label: 'eIDAS' },
                  { flag: <FlagIN />, label: 'IT Act 2000' },
                ]}
              />
            </ProductSubSection>
          </>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url="/solutions/hr" schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'SOLUTIONS')}
        title={tr('hero.title', 'By Team')}
        titleAccent={tr('hero.accent', '(Departmental Workflows)')}
        lead={tr('hero.lead', 'The right workflow for every department.')}
        align="center"
        navHeader={tr('nav.header', 'CATEGORIES')}
        sections={sections}
      />
    </>
  );
};

export default TeamsOverview;
