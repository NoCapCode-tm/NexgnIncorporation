import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiFileText,
  FiHash,
  FiLayers,
  FiMail,
  FiRadio,
  FiSend,
  FiType,
  FiUserCheck,
  FiZap,
} from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  ProductDarkBanner,
  SignatureStylesGrid,
  StatusTrackRow,
  WidgetPillsGrid,
  ProductStepList,
  ProductCheckList,
} from '../../components/products/ProductLayout';

const LANGS = ['en', 'es', 'hi'];

const ProductOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`products.core.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Core Agreement Products | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Explore Nexgn’s core agreement products: legally binding eSignature, drag-and-drop Document Editor, reusable Templates, and automated Agreement Workflows & Scheduler.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/products`;
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

  // Memoized so ProductLayout never re-triggers effects unnecessarily on re-renders
  const sections = useMemo(
    () => [
      /* ===============================================================
         1. eSIGNATURE
         =============================================================== */
      {
        id: 'esignature',
        routeSlug: 'esignature',
        aliases: ['esignature'],
        navLabel: t('products.core.esignature.navLabel', 'eSignature'),
        title: t('products.core.esignature.title', 'eSignature'),
        subtitle: t(
          'products.core.esignature.subtitle',
          'Sign agreements in minutes, not days.'
        ),
        body: (
          <>
            <ProductText>
              {t(
                'products.core.esignature.desc',
                'Send documents to one or multiple signers with clear signing order, role assignment, and real-time cryptographic tracking.'
              )}
            </ProductText>

            <ProductSubSection
              title={t('products.core.esignature.noAccount.title', 'No Account Required')}
            >
              <ProductText>
                {t(
                  'products.core.esignature.noAccount.desc',
                  'Recipients open a secure link from their email, review the document in any mobile or desktop browser, and complete their signature—no paywalls, downloads, or login friction.'
                )}
              </ProductText>
              <ProductDarkBanner icon={<FiUserCheck />}>
                {t(
                  'products.core.esignature.noAccount.banner',
                  'Signers never need to create a Nexgn account to sign.'
                )}
              </ProductDarkBanner>
            </ProductSubSection>

            <ProductSubSection
              title={t('products.core.esignature.styles.title', 'Signature Styles')}
            >
              <ProductText>
                {t(
                  'products.core.esignature.styles.desc',
                  'Signers can draw their signature with a mouse, stylus, or finger, upload an image of their wet-ink signature, or type their name and choose from curated calligraphic styles.'
                )}
              </ProductText>
              <ProductSubSection noBorder>
                <ProductText strong>
                  {t(
                    'products.core.esignature.styles.note',
                    'Type your name and pick a clean signature style:'
                  )}
                </ProductText>
              </ProductSubSection>

              <SignatureStylesGrid
                items={[
                  {
                    label: t('products.core.esignature.styles.s1', 'STYLE 01'),
                    sample: 'John Doe',
                    fontClass: 'sigFont1',
                  },
                  {
                    label: t('products.core.esignature.styles.s2', 'STYLE 02'),
                    sample: 'John Doe',
                    fontClass: 'sigFont2',
                  },
                  {
                    label: t('products.core.esignature.styles.s3', 'STYLE 03'),
                    sample: 'John Doe',
                    fontClass: 'sigFont3',
                  },
                  {
                    label: t('products.core.esignature.styles.s4', 'STYLE 04'),
                    sample: 'John Doe',
                    fontClass: 'sigFont4',
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.core.esignature.status.title', 'Status Tracking')}
            >
              <ProductText>
                {t(
                  'products.core.esignature.status.desc',
                  'Track every agreement through its entire lifecycle with instant dashboard updates and automated webhook notifications:'
                )}
              </ProductText>
              <StatusTrackRow
                steps={[
                  { label: t('products.core.esignature.status.sent', 'Sent'), icon: <FiSend  /> },
                  { label: t('products.core.esignature.status.viewed', 'Viewed'), icon: <FiEye /> },
                  {
                    label: t('products.core.esignature.status.signed', 'Signed'),
                    icon: <FiEdit3 />,
                  },
                  {
                    label: t('products.core.esignature.status.completed', 'Completed'),
                    icon: <FiCheckCircle />,
                  },
                ]}
              />
            </ProductSubSection>
          </>
        ),
      },

      /* ===============================================================
         2. DOCUMENT EDITOR
         =============================================================== */
      {
        id: 'document-editor',
        routeSlug: 'document-editor',
        aliases: ['document-editor', 'doc-editor'],
        navLabel: t('products.core.editor.navLabel', 'Document Editor'),
        title: t('products.core.editor.title', 'Document Editor'),
        subtitle: t(
          'products.core.editor.subtitle',
          'Turn any PDF into an interactive agreement.'
        ),
        body: (
          <>
            <ProductSubSection title={t('products.core.editor.widgets.title', 'Widget Grid')}>
              <ProductText>
                {t(
                  'products.core.editor.widgets.desc',
                  'Drag and drop validated input fields directly onto your document canvas and assign each field to a specific recipient role with color-coded precision:'
                )}
              </ProductText>

              <WidgetPillsGrid
                widgets={[
                  { label: t('products.core.editor.widgets.text', 'Text'), icon: <FiType /> },
                  { label: t('products.core.editor.widgets.number', 'Number'), icon: <FiHash /> },
                  { label: t('products.core.editor.widgets.radio', 'Radio'), icon: <FiRadio /> },
                  {
                    label: t('products.core.editor.widgets.signature', 'Signature'),
                    icon: <FiEdit3 />,
                  },
                  { label: t('products.core.editor.widgets.email', 'Email'), icon: <FiMail /> },
                  { label: t('products.core.editor.widgets.date', 'Date'), icon: <FiCalendar /> },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.core.editor.precision.title', 'Pixel-Perfect Precision')}
            >
              <ProductText strong>
                {t(
                  'products.core.editor.precision.lead',
                  'What you place in the editor is exactly what the signer sees.'
                )}
              </ProductText>
              <ProductText>
                {t(
                  'products.core.editor.precision.desc',
                  'Every field coordinate is anchored relative to the PDF page geometry so signatures, stamps, and text inputs render in the exact position across 4K monitors, laptops, and mobile screens.'
                )}
              </ProductText>
            </ProductSubSection>
          </>
        ),
      },

      /* ===============================================================
         3. TEMPLATES
         =============================================================== */
      {
        id: 'templates',
        routeSlug: 'templates',
        aliases: ['templates'],
        navLabel: t('products.core.templates.navLabel', 'Templates'),
        title: t('products.core.templates.title', 'Templates'),
        subtitle: t('products.core.templates.subtitle', 'Build once. Send a thousand times.'),
        body: (
          <>
            <ProductSubSection
              title={t('products.core.templates.discovery.title', 'Visual Discovery')}
            >
              <ProductText>
                {t(
                  'products.core.templates.discovery.desc',
                  'Standardize your most frequent agreements so your team never has to re-upload PDFs or drag fields from scratch:'
                )}
              </ProductText>

              <ProductStepList
                steps={[
                  {
                    step: 'STEP 01',
                    title: t(
                      'products.core.templates.discovery.s1',
                      'Upload Reference Document'
                    ),
                    icon: <FiFileText />,
                  },
                  {
                    step: 'STEP 02',
                    title: t(
                      'products.core.templates.discovery.s2',
                      'Pre-place Signer Roles & Field Coordinates'
                    ),
                    icon: <FiLayers />,
                  },
                  {
                    step: 'STEP 03',
                    title: t(
                      'products.core.templates.discovery.s3',
                      'Send in Seconds via UI or API'
                    ),
                    icon: <FiZap />,
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.core.templates.library.title', 'Template Library')}
            >
              <ProductText>
                {t(
                  'products.core.templates.library.desc',
                  'Organize workspace templates by department with role-based permissions for HR, Legal, Sales, and Operations:'
                )}
              </ProductText>
              <ProductCheckList
                items={[
                  {
                    text: t('products.core.templates.library.b1', 'NDA & Confidentiality'),
                    icon: <FiCheck />,
                  },
                  {
                    text: t('products.core.templates.library.b2', 'Offer Letters'),
                    icon: <FiCheck />,
                  },
                  {
                    text: t('products.core.templates.library.b3', 'Vendor Agreements'),
                    icon: <FiCheck />,
                  },
                ]}
              />
            </ProductSubSection>
          </>
        ),
      },

      /* ===============================================================
         4. AGREEMENT WORKFLOWS & SCHEDULER
         =============================================================== */
      {
        id: 'workflows',
        routeSlug: 'automation',
        aliases: ['automation', 'workflows', 'reminders', 'scheduler'],
        navLabel: t('products.core.workflows.navLabel', 'Agreement Workflows & Scheduler'),
        title: t('products.core.workflows.title', 'Agreement Workflows & Scheduler'),
        subtitle: t(
          'products.core.workflows.subtitle',
          'Put your contract lifecycle on autopilot.'
        ),
        body: (
          <>
            <ProductSubSection
              title={t('products.core.workflows.scheduler.title', 'The Scheduler')}
            >
              <ProductText>
                {t(
                  'products.core.workflows.scheduler.desc',
                  'Prepare agreements ahead of time and schedule exact UTC dispatch timestamps for product launches, embargoed press agreements, or batch employee onboarding.'
                )}
              </ProductText>
            </ProductSubSection>

            <ProductSubSection
              title={t('products.core.workflows.reminders.title', 'Smart Reminders')}
            >
              <ProductText>
                {t(
                  'products.core.workflows.reminders.desc',
                  'Eliminate manual follow-ups with automated reminder intervals and configurable expiration deadlines that notify pending signers until the agreement is completed.'
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
      <SEOHead title={seoTitle} description={seoDescription} url="/products" schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'PRODUCTS')}
        title={tr('hero.title', 'Core Agreement Products')}
        lead={tr(
          'hero.lead',
          'Everything you need to prepare, route, sign, and automate\nhigh-trust agreements in a single unified workspace.'
        )}
        align="center"
        navHeader={tr('nav.header', 'ON THIS PAGE')}
        sections={sections}
      />
    </>
  );
};

export default ProductOverview;