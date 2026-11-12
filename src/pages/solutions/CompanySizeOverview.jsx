import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiSend,
  FiUser,
  FiEye,
  FiEdit3,
  FiKey,
  FiCode,
  FiLock,
  FiFileText,
  FiHeadphones,
} from 'react-icons/fi';
import useCurrentPath from '../../hooks/useCurrentPath';
import { SEOHead } from '../../components/seo/SEOHead';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  WidgetPillsGrid,
  FeatureCardsGrid,
  ProductCta,
} from '../../components/products/ProductLayout';

const LANGS = ['en', 'es', 'hi'];

/**
 * Solutions > By Company Size hub. One page, three sections:
 *   /solutions/individuals   /solutions/smb   /solutions/enterprise
 */
const CompanySizeOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const pagePath = useCurrentPath('/solutions/individuals');
  const k = 'solutions.size';
  const tr = (key, fallback) => t(`${k}.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Nexgn by Company Size: Solo to Enterprise');
  const seoDescription = tr(
    'seo.description',
    'From a free tier for freelancers to team workspaces for SMBs and security controls for enterprise, find the Nexgn plan that fits your size.'
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
        id: 'individuals',
        routeSlug: 'individuals',
        aliases: ['freelancers'],
        navLabel: t(`${k}.individuals.navLabel`, 'Individuals & Freelancers'),
        title: t(`${k}.individuals.title`, 'Individuals & Freelancers'),
        subtitle: t(
          `${k}.individuals.subtitle`,
          'Look professional, stay legally protected, and never pay a dime until you scale.'
        ),
        body: (
          <ProductSubSection title={t(`${k}.individuals.free.title`, 'Free Tier')}>
            <ProductText>
              {t(`${k}.individuals.free.desc`, 'Speed and zero cost. Send your first agreements today on the Free Tier.')}
            </ProductText>
            <WidgetPillsGrid
              widgets={[{ label: t(`${k}.individuals.free.pill`, '19 envelopes/mo'), icon: <FiSend /> }]}
            />
          </ProductSubSection>
        ),
      },
      {
        id: 'smb',
        routeSlug: 'smb',
        aliases: ['small-business', 'smbs'],
        navLabel: t(`${k}.smb.navLabel`, 'Small & Medium Businesses (SMBs)'),
        title: t(`${k}.smb.title`, 'Small & Medium Businesses (SMBs)'),
        subtitle: t(
          `${k}.smb.subtitle`,
          'Get your entire team off local hard drives and into one unified, secure agreement workspace.'
        ),
        body: (
          <ProductSubSection title={t(`${k}.smb.starter.title`, 'Starter Plan')}>
            <ProductText>
              {t(
                `${k}.smb.starter.desc`,
                'The Starter Plan centralizes your team’s agreements in one Team Workspace, with Sub-Admin roles to share the work and Contact Books to send faster.'
              )}
            </ProductText>
            <WidgetPillsGrid
              widgets={[
                { label: t(`${k}.smb.starter.w1`, 'Team Workspaces'), icon: <FiUser /> },
                { label: t(`${k}.smb.starter.w2`, 'Sub-Admin roles'), icon: <FiEye /> },
                { label: t(`${k}.smb.starter.w3`, 'Contact Books'), icon: <FiEdit3 /> },
              ]}
            />
          </ProductSubSection>
        ),
      },
      {
        id: 'enterprise',
        routeSlug: 'enterprise',
        aliases: [],
        navLabel: t(`${k}.enterprise.navLabel`, 'Enterprise'),
        title: t(`${k}.enterprise.title`, 'Enterprise'),
        subtitle: '',
        body: (
          <>
            <ProductSubSection title={t(`${k}.enterprise.security.title`, 'Security, Identity, and Control')}>
              <ProductText>
                {t(
                  `${k}.enterprise.security.desc`,
                  'The Business Plan gives enterprise teams the controls their security reviews ask for.'
                )}
              </ProductText>
              <FeatureCardsGrid
                columns={4}
                items={[
                  { label: t(`${k}.enterprise.security.totp`, 'TOTP Two-Factor Authentication'), icon: <FiKey /> },
                  { label: t(`${k}.enterprise.security.api`, 'API access'), icon: <FiCode /> },
                  { label: t(`${k}.enterprise.security.sso`, 'SSO integrations (upcoming)'), icon: <FiLock /> },
                  { label: t(`${k}.enterprise.security.logs`, 'Advanced Audit Logs'), icon: <FiFileText /> },
                ]}
              />
            </ProductSubSection>
            <ProductSubSection title={t(`${k}.enterprise.business.title`, 'Business Plan')}>
              <ProductText>
                {t(
                  `${k}.enterprise.business.desc`,
                  'Talk to our team about the Business Plan for your organization.'
                )}
              </ProductText>
              <ProductCta to={`/${currentLng}/contact`} icon={<FiHeadphones />}>
                {t(`${k}.enterprise.business.cta`, 'Talk to Sales')}
              </ProductCta>
            </ProductSubSection>
          </>
        ),
      },
    ],
    [t, currentLng]
  );

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url={pagePath} schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'SOLUTIONS')}
        title={tr('hero.title', 'By Company Size')}
        lead={tr('hero.lead', 'Segmenting users to push them to the correct pricing tier.')}
        align="center"
        navHeader={tr('nav.header', 'CATEGORIES')}
        sections={sections}
      />
    </>
  );
};

export default CompanySizeOverview;