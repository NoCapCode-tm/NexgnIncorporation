import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import LegalLayout, { LegalText } from '../../components/legal/LegalLayout';

const POLICIES = [
  {
    id: 'billing',
    navLabel: '1. Subscription Billing (Razorpay)',
    title: '1. Billing Cycles',
    content:
      'Nexgn subscriptions are billed in advance on a monthly or annual basis via Razorpay. By upgrading to a paid tier, you authorize Nexgn to automatically charge your payment method at the beginning of each billing cycle.',
  },
  {
    id: 'cancellation',
    navLabel: '2. Cancellations & Proration',
    title: '2. Canceling Your Workspace',
    content:
      'You may cancel your subscription at any time from your Workspace Settings. Upon cancellation, your workspace will retain its paid features until the end of your current billing cycle. Nexgn does not provide prorated refunds for partial months of service.',
  },
  {
    id: 'overage',
    navLabel: '3. Envelope Limits & Overage',
    title: '3. Plan Limits & Overage',
    content:
      'If you are on the Free (19 envelopes) or Starter (49 envelopes) tier, you will be blocked from sending further requests once your limit is reached. Limits reset on the 1st day of your billing cycle. Unused envelopes do not roll over to the next month. To remove limits immediately, you must upgrade to the Business tier.',
  },
];

const Refunds = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.refunds.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Refund & Cancellation Policy | Nexgn Legal Hub');
  const seoDescription = tr(
    'seo.description',
    'Read the Nexgn refund, cancellation, and proration policies for our electronic signature platform.'
  );

  const sections = POLICIES.map((p) => ({
    id: p.id,
    navLabel: tr(`policy.${p.id}.navLabel`, p.navLabel),
    title: tr(`policy.${p.id}.title`, p.title),
    body: <LegalText>{tr(`policy.${p.id}.content`, p.content)}</LegalText>,
  }));

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/refunds" />
      <LegalLayout
        align="center"
        eyebrow={tr('hero.eyebrow', 'LEGAL HUB')}
        title={tr('hero.title', 'Refund & Cancellation\nPolicy')}
        navHeader={tr('nav.header', 'ON THIS PAGE')}
        sections={sections}
      />
    </>
  );
};

export default Refunds;