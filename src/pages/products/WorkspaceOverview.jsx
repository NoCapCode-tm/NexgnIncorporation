import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiEye, FiFileText, FiTrash2, FiCreditCard, FiServer } from 'react-icons/fi';
import { FaGoogleDrive } from 'react-icons/fa';
import { SEOHead } from '../../components/seo/SEOHead';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  FeatureCardsGrid,
  ProductStepList,
} from '../../components/products/ProductLayout';

const LANGS = ['en', 'es', 'hi'];

/**
 * Workspace & Management hub. One page, two sections:
 *   /products/workspace      -> Team Workspace & RBAC
 *   /products/cloud-storage  -> Google Drive & Storage
 * Workspace.jsx and Storage.jsx both re-export this; ProductLayout scrolls to the section.
 */
const WorkspaceOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const k = 'products.workspace';
  const tr = (key, fallback) => t(`${k}.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Workspace & Management | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Give every teammate the right access with role-based permissions and activity logs, and keep signed contracts in your own Google Drive.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/products/workspace`;
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
        id: 'workspace',
        routeSlug: 'workspace',
        aliases: ['rbac', 'team-workspace', 'activity-logs'],
        navLabel: t(`${k}.team.navLabel`, 'Team Workspace & RBAC'),
        title: t(`${k}.team.title`, 'Team Workspace & RBAC'),
        subtitle: t(`${k}.team.subtitle`, 'One workspace. Granular control.'),
        body: (
          <>
            <ProductSubSection title={t(`${k}.team.matrix.title`, 'Permissions Matrix')}>
              <ProductText>
                {t(
                  `${k}.team.matrix.desc`,
                  'Give each teammate only the access their role needs. Admins decide who can view documents, create templates, delete contacts or manage billing.'
                )}
              </ProductText>
              <FeatureCardsGrid
                columns={4}
                items={[
                  { label: t(`${k}.team.matrix.view`, 'Can View Documents'), icon: <FiEye /> },
                  { label: t(`${k}.team.matrix.create`, 'Can Create Templates'), icon: <FiFileText /> },
                  { label: t(`${k}.team.matrix.delete`, 'Can Delete Contacts'), icon: <FiTrash2 /> },
                  { label: t(`${k}.team.matrix.billing`, 'Billing Admin'), icon: <FiCreditCard /> },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection title={t(`${k}.team.logs.title`, 'Activity Logs')}>
              <ProductText>
                {t(
                  `${k}.team.logs.desc`,
                  'Admins can see exactly who logged in, who deleted a file, and when. A complete record of account activity helps admins answer questions quickly and spot anything unexpected.'
                )}
              </ProductText>
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'cloud-storage',
        routeSlug: 'cloud-storage',
        aliases: ['storage', 'google-drive', 'drive'],
        navLabel: t(`${k}.storage.navLabel`, 'Google Drive & Storage'),
        title: t(`${k}.storage.title`, 'Google Drive & Storage'),
        subtitle: t(
          `${k}.storage.subtitle`,
          'Your data, your drive. We don’t hold your contracts hostage.'
        ),
        body: (
          <>
            <ProductSubSection title={t(`${k}.storage.byos.title`, 'Bring Your Own Storage')}>
              <ProductText>
                {t(
                  `${k}.storage.byos.desc`,
                  'Signed documents are delivered straight to your organization’s Google Drive, so your contracts stay in storage you already own and control.'
                )}
              </ProductText>
              <ProductStepList
                steps={[
                  { step: false, title: t(`${k}.storage.byos.s1`, 'Completed document'), icon: <FiFileText /> },
                  { step: false, title: t(`${k}.storage.byos.s2`, 'Bypasses Nexgn’s servers'), icon: <FiServer /> },
                  {
                    step: false,
                    title: t(`${k}.storage.byos.s3`, 'Secure, organized Google Drive folder'),
                    icon: <FaGoogleDrive />,
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection title={t(`${k}.storage.cost.title`, 'Cost Savings')}>
              <ProductText>
                {t(
                  `${k}.storage.cost.desc`,
                  'Because Nexgn doesn’t charge you for infinite cloud storage, our subscription plans remain radically affordable.'
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
      <SEOHead title={seoTitle} description={seoDescription} url="/products/workspace" schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'PRODUCT')}
        title={tr('hero.title', 'Workspace & Management')}
        lead={tr('hero.lead', 'How teams organize the chaos of paperwork.')}
        align="center"
        navHeader={tr('nav.header', 'CATEGORIES')}
        sections={sections}
      />
    </>
  );
};

export default WorkspaceOverview;