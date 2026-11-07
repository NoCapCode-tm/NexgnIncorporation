import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiCreditCard, FiInfo, FiUser, FiXCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { SEOHead } from '../../components/seo/SEOHead';
import ProductLayout, {
  ProductText,
  ProductSubSection,
  FeatureCardsGrid,
  ProductNote,
  ChatExampleGrid,
} from '../../components/products/ProductLayout';

const LANGS = ['en', 'es', 'hi'];

/**
 * Intelligence (Nexgn AI) hub. One page, two sections:
 *   /products/ai-summary  -> AI Agreement Summary
 *   /products/ai-builder  -> AI Template Builder
 * AISummary.jsx and AIBuilder.jsx both re-export this, ProductLayout scrolls to the section.
 */
const IntelligenceOverview = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`products.intelligence.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Intelligence (Nexgn AI) | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Nexgn AI summarizes agreements before you sign and drafts new templates from a plain-language prompt, with a human always in the loop.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/products/ai-summary`;
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
        id: 'ai-summary',
        routeSlug: 'ai-summary',
        aliases: ['summary', 'agreement-summary'],
        navLabel: t('products.intelligence.summary.navLabel', 'AI Agreement Summary'),
        title: t('products.intelligence.summary.title', 'AI Agreement Summary'),
        subtitle: t(
          'products.intelligence.summary.subtitle',
          'Understand the agreement before you sign it.'
        ),
        body: (
          <>
            <ProductSubSection
              title={t('products.intelligence.summary.beforeAfter.title', 'Before/After')}
            >
              <ProductText>
                {t(
                  'products.intelligence.summary.beforeAfter.desc',
                  'Long agreements are hard to read on a deadline. Nexgn AI pulls out the terms that matter most, so signers know what they are agreeing to before they sign. A dense wall of legal jargon, next to a clean, 5-point AI summary extracting Payment Terms, Termination Clauses, and Effective Dates.'
                )}
              </ProductText>
              <FeatureCardsGrid
                items={[
                  {
                    label: t('products.intelligence.summary.beforeAfter.payment', 'Payment Terms'),
                    icon: <FiCreditCard />,
                  },
                  {
                    label: t(
                      'products.intelligence.summary.beforeAfter.termination',
                      'Termination Clauses'
                    ),
                    icon: <FiXCircle />,
                  },
                  {
                    label: t('products.intelligence.summary.beforeAfter.dates', 'Effective Dates'),
                    icon: <FiCalendar />,
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.intelligence.summary.disclaimer.title', 'Legal Disclaimer')}
            >
              <ProductNote icon={<FiInfo />}>
                {t(
                  'products.intelligence.summary.disclaimer.text',
                  'Nexgn AI is an assistant, not a lawyer. Always review original documents.'
                )}
              </ProductNote>
            </ProductSubSection>
          </>
        ),
      },
      {
        id: 'ai-builder',
        routeSlug: 'ai-builder',
        aliases: ['template-builder', 'builder'],
        navLabel: t('products.intelligence.builder.navLabel', 'AI Template Builder'),
        title: t('products.intelligence.builder.title', 'AI Template Builder'),
        subtitle: t(
          'products.intelligence.builder.subtitle',
          'Describe the agreement. Nexgn builds the draft.'
        ),
        body: (
          <>
            <ProductSubSection title={t('products.intelligence.builder.chat.title', 'Chat')}>
              <ProductText>
                {t(
                  'products.intelligence.builder.chat.desc',
                  'Describe the agreement you need in plain language, including the role and the jurisdiction, and Nexgn AI prepares a first draft.'
                )}
              </ProductText>
              <ChatExampleGrid
                messages={[
                  {
                    role: t('products.intelligence.builder.chat.userRole', 'USER'),
                    icon: <FiUser />,
                    text: t(
                      'products.intelligence.builder.chat.userText',
                      '“I need a non-disclosure agreement for a software developer in California.”'
                    ),
                  },
                  {
                    role: t('products.intelligence.builder.chat.aiRole', 'NEXGN AI'),
                    icon: <HiOutlineSparkles />,
                    text: t(
                      'products.intelligence.builder.chat.aiText',
                      '“Generating draft with California jurisdiction…”'
                    ),
                  },
                ]}
              />
            </ProductSubSection>

            <ProductSubSection
              title={t('products.intelligence.builder.loop.title', 'Human-in-the-Loop')}
            >
              <ProductText>
                {t(
                  'products.intelligence.builder.loop.desc',
                  'Nothing goes out until you have reviewed it. The AI generates the HTML, but the Admin retains full editing control via our rich-text editor before sending.'
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
      <SEOHead title={seoTitle} description={seoDescription} url="/products/ai-summary" schema={schema} />
      <ProductLayout
        eyebrow={tr('hero.eyebrow', 'PRODUCT')}
        title={tr('hero.title', 'Intelligence (Nexgn AI)')}
        lead={tr(
          'hero.lead',
          'This separates Nexgn from cheap e-sign clones. We are building an intelligent platform.'
        )}
        align="center"
        navHeader={tr('nav.header', 'CATEGORIES')}
        sections={sections}
      />
    </>
  );
};

export default IntelligenceOverview;