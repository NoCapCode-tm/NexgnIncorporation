import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiActivity,
  FiArrowRight,
  FiCheck,
  FiCloud,
  FiDatabase,
  FiFileText,
  FiGlobe,
  FiHash,
  FiKey,
  FiLock,
  FiShare2,
  FiShield,
  FiSliders,
  FiUploadCloud,
} from 'react-icons/fi';
import { SEOHead, buildBreadcrumbs, ORGANIZATION_ID } from '../../components/seo/SEOHead';
import ImpactStats from '../../components/common/ImpactStats';
import useSecurityAnimations from '../../hooks/useSecurityAnimations';
import styles from './TrustCenter.module.css';

const STATUS_URL = 'https://status.nexgn.cloud';
const SECURITY_EMAIL = 'security@nexgn.cloud';
const PRIVACY_EMAIL = 'privacy@nexgn.cloud';
const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES (Drop trust-hero.(png|webp|jpg) into src/assets/trust/;
   falls back automatically to security-hero so build never breaks)
   ===================================================================== */
const imageContext = require.context('../../assets/trust', false, /\.(png|jpe?g|webp|avif|svg)$/i);

const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};

const HERO_IMAGE = findImage('trust-hero') || findImage('security-hero');

/* =====================================================================
   3 CORE TRUST CENTER PILLARS (Mirrors Mega Menu Blueprint)
   ===================================================================== */
const PILLAR_GROUPS = [
  {
    key: 'security',
    no: '01',
    Icon: FiShield,
    eyebrow: 'Column 1 · CISO & IT Review',
    title: 'Security & Compliance',
    desc: 'Inspect how Nexgn protects agreements in transit and at rest, isolates access with TOTP 2FA and RBAC, and welcomes ethical security research.',
    links: [
      {
        key: 'arch',
        title: 'Security Architecture',
        desc: 'Encryption protocols, zero-trust workspace controls, SHA-256 sealing, and cloud infrastructure posture.',
        to: '/trust/security',
        cta: 'Explore Architecture',
      },
      {
        key: 'status',
        title: 'System Status & Uptime',
        desc: 'Independent, externally hosted service availability and real-time operational incident transparency.',
        href: STATUS_URL,
        cta: 'View Live Status',
      },
      {
        key: 'vuln',
        title: 'Vulnerability Disclosure',
        desc: 'Safe harbor policy, testing scope, response SLAs, and responsible reporting channel for researchers.',
        to: '/trust/vulnerability-disclosure',
        cta: 'Read Disclosure Policy',
      },
    ],
  },
  {
    key: 'privacy',
    no: '02',
    Icon: FiGlobe,
    eyebrow: 'Column 2 · Legal & DPO Review',
    title: 'Privacy & Legality',
    desc: 'Verify global electronic signature enforceability, GDPR/DPDP data rights, zero-training AI rules, and our complete third-party vendor list.',
    links: [
      {
        key: 'legality',
        title: 'eSignature Legality Guide',
        desc: 'Compliance mappings for US ESIGN & UETA, EU/UK eIDAS, India IT Act 2000 (Sec. 65B), and UNCITRAL.',
        to: '/trust/legality',
        cta: 'View Legal Frameworks',
      },
      {
        key: 'center',
        title: 'Privacy Center & AI Practices',
        desc: 'Data minimization, Bring Your Own Storage (BYOS) ownership, and strict zero-retention AI guarantees.',
        to: '/trust/privacy',
        cta: 'Inspect Privacy Center',
      },
      {
        key: 'subprocessors',
        title: 'Subprocessor Registry',
        desc: 'Authorized infrastructure, payment, and delivery vendors—plus 30-day advance change notifications.',
        to: '/trust/subprocessors',
        cta: 'View Subprocessors',
      },
    ],
  },
  {
    key: 'sustainability',
    no: '03',
    Icon: FiActivity,
    eyebrow: 'Column 3 · ESG & Code Efficiency',
    title: 'Sustainability & Green Tech',
    desc: 'We reduce physical paper waste while minimizing digital operational emissions—publishing our methodology openly without greenwashing.',
    links: [
      {
        key: 'pledge',
        title: 'The Nexgn Sustainability Pledge',
        desc: 'Live impact metrics, open estimation methodology, lean React/Node engineering, and GHG Protocol alignment.',
        to: '/sustainability',
        cta: 'Explore Sustainability',
      },
    ],
  },
];

/* =====================================================================
   ZERO-TRUST DOCUMENT PIPELINE (Interactive Architecture Blueprint 2.1)
   ===================================================================== */
const PIPELINE_STEPS = [
  {
    step: '01',
    Icon: FiUploadCloud,
    title: 'Document Prepared',
    detail: 'PDF prepared in workspace; fields placed with strict RBAC and TOTP-protected sessions.',
  },
  {
    step: '02',
    Icon: FiLock,
    title: 'Encrypted Transit',
    detail: 'All payloads travel across encrypted TLS connections with ephemeral buffer handling.',
  },
  {
    step: '03',
    Icon: FiKey,
    title: 'Intent & Consent Logged',
    detail: 'Signer accepts explicit electronic consent before viewing; IP, UTC time & User-Agent recorded.',
  },
  {
    step: '04',
    Icon: FiHash,
    title: 'SHA-256 Sealed',
    detail: 'Final PDF + forensic Audit Certificate are sealed with a deterministic SHA-256 hash.',
  },
  {
    step: '05',
    Icon: FiCloud,
    title: 'Deposited to Your Drive',
    detail: 'Completed files sync straight to your Google Drive (BYOS)—no centralized hoarding.',
  },
];

/* =====================================================================
   PLATFORM DEFENSES MATRIX (Blueprint 2.1 + Privacy + VRA Transparency)
   ===================================================================== */
const DEFENSES = [
  {
    key: 'rbac',
    Icon: FiSliders,
    title: 'Access Control (RBAC & TOTP 2FA)',
    text: 'Enforce Time-based One-Time Password (TOTP) 2FA, brute-force lockouts, expiring session tokens, and granular Sub-Admin permissions.',
  },
  {
    key: 'integrity',
    Icon: FiHash,
    title: 'Cryptographic Document Integrity',
    text: 'Every executed agreement receives a SHA-256 checksum. Any post-signing byte or pixel edit breaks verification immediately.',
  },
  {
    key: 'byos',
    Icon: FiDatabase,
    title: 'Bring Your Own Storage (BYOS)',
    text: 'We act as a secure routing engine—syncing signed agreements directly into your organization’s Google Drive to reduce centralized breach surface.',
  },
  {
    key: 'ai',
    Icon: FiShield,
    title: 'Zero-Training AI Isolation',
    text: 'Opt-in AI summaries and clause reviews run ephemerally and are never used to train public or foundational AI models.',
  },
];

const VRA_CHECKS = [
  'Hosted on tier-1 cloud infrastructure certified for ISO 27001, SOC 2 Type II, and PCI-DSS.',
  'Court-admissible Audit Certificates capturing UTC timestamps, IPv4/IPv6, User-Agent, and explicit consent.',
  'Pre-signed Data Processing Addendum (DPA) coverage for GDPR, UK GDPR, and India DPDP Act requirements.',
  'Transparent 30-day advance notification policy before authorizing any new third-party subprocessor.',
];

const CERTS = [
  { name: 'ISO 27001 (Infra)', img: findImage('cert-iso27001') },
  { name: 'SOC 2 Type II (Infra)', img: findImage('cert-soc2') },
  { name: 'PCI-DSS (Payments)', img: findImage('cert-pcidss') },
];

const LEGAL_HUB = [
  {
    key: 'terms',
    title: 'Terms of Service',
    desc: 'Master agreement covering platform usage, BYOS conduit model, API rate limits, and liability boundaries.',
    to: '/legal/terms',
  },
  {
    key: 'privacy',
    title: 'Privacy Policy',
    desc: 'Formal legal notice detailing Data Controller vs Data Processor roles, telemetry capture, and AI isolation.',
    to: '/legal/privacy-policy',
  },
  {
    key: 'dpa',
    title: 'Data Processing Addendum (DPA)',
    desc: 'GDPR, UK GDPR, and India DPDP Act contractual safeguards and international transfer commitments.',
    to: '/legal/dpa',
  },
  {
    key: 'aup',
    title: 'Acceptable Use Policy (AUP)',
    desc: 'Strict anti-spam, anti-malware, and lawful document execution rules protecting workspace deliverability.',
    to: '/legal/acceptable-use',
  },
  {
    key: 'cookies',
    title: 'Cookie Policy',
    desc: 'Essential signer-session tokens, preference cookies, Cloudflare edge security, and consent controls.',
    to: '/legal/cookie-policy',
  },
  {
    key: 'refunds',
    title: 'Refund & Cancellation Policy',
    desc: 'Clear Razorpay monthly/annual billing rules, workspace cancellation access, and envelope tier resets.',
    to: '/legal/refunds',
  },
];

const TRUST_FAQS = [
  {
    q: 'Where does Nexgn store my signed PDF agreements?',
    a: 'Nexgn operates on a Bring Your Own Storage (BYOS) architecture. When connected to your Google Workspace, completed agreements and SHA-256 Audit Certificates sync directly to your Google Drive rather than staying locked inside proprietary vendor silos.',
  },
  {
    q: 'Does Nexgn use customer contracts to train AI models?',
    a: 'Never. Nexgn AI features are strictly opt-in, can be disabled globally by Workspace Admins, and process document text ephemerally without using customer contracts or signatures to train foundational AI models.',
  },
  {
    q: 'How can enterprise security teams run a Vendor Risk Assessment (VRA)?',
    a: 'Security teams can inspect our Security Architecture, Legality Guide, Subprocessor Registry, and Legal Hub directly from this Trust Center without sales gates, or email security@nexgn.cloud for specific security questionnaire assistance.',
  },
];

const Words = ({ text, mask = true }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      {mask ? (
        <span className={styles.wMask}>
          <span className={styles.wIn} data-s="w">
            {w}
          </span>
        </span>
      ) : (
        <span className={styles.wFree} data-s="qw">
          {w}
        </span>
      )}
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

const TrustCenter = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`trustCenter.${key}`, fallback);

  const rootRef = useRef(null);
  useSecurityAnimations(rootRef, { lng: currentLng });

  const pledgeText =
    'We believe digital transformation should not just accelerate business. it should protect resources. At Nexgn, we build optimized code to reduce server emissions, transparently publish our impact methodology, and eliminate paper and operational waste.';
  const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    `${pledgeText} https://nexgn.cloud/${currentLng}/sustainability`
  )}`;

  const seoTitle = tr('seo.title', 'Trust Center: Security, Privacy & Legality');
  const seoDescription = tr(
    'seo.description',
    'Review Nexgn security architecture, ESIGN/eIDAS/IT Act legality, GDPR & DPDP privacy controls, subprocessors, sustainability metrics, and legal policies.'
  );
  const pageUrl = `https://nexgn.cloud/${currentLng}/trust`;

  const schema = {
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${seoTitle} | Nexgn`,
        description: seoDescription,
        inLanguage: currentLng,
        isPartOf: { '@id': 'https://nexgn.cloud/#website' },
        about: { '@id': ORGANIZATION_ID },
      },
      buildBreadcrumbs(currentLng, [
        { name: 'Home', url: '/' },
        { name: 'Trust Center', url: '/trust' },
      ]),
      {
        '@type': 'ItemList',
        name: 'Nexgn Trust Center Documentation Pillars',
        numberOfItems: 6,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Security Architecture', url: `https://nexgn.cloud/${currentLng}/trust/security` },
          { '@type': 'ListItem', position: 2, name: 'eSignature Legality Guide', url: `https://nexgn.cloud/${currentLng}/trust/legality` },
          { '@type': 'ListItem', position: 3, name: 'Privacy Center', url: `https://nexgn.cloud/${currentLng}/trust/privacy` },
          { '@type': 'ListItem', position: 4, name: 'Subprocessor Registry', url: `https://nexgn.cloud/${currentLng}/trust/subprocessors` },
          { '@type': 'ListItem', position: 5, name: 'Vulnerability Disclosure', url: `https://nexgn.cloud/${currentLng}/trust/vulnerability-disclosure` },
          { '@type': 'ListItem', position: 6, name: 'Sustainability Pledge', url: `https://nexgn.cloud/${currentLng}/sustainability` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: TRUST_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust" schema={schema} />

      {/* ============ 1. HERO (Frosted Card + Dark Backdrop) ============ */}
      <section className={styles.hero} data-s="hero">
        <div
          className={styles.heroPhoto}
          style={HERO_IMAGE ? { '--img': `url("${HERO_IMAGE}")` } : undefined}
          data-s="photo"
          aria-hidden="true"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard} data-s="card">
            <span className={styles.cardLine} data-s="cardline" aria-hidden="true" />
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-s="hr">
              {tr('hero.eyebrow', 'Nexgn Trust Center')}
            </p>
            <h1 className={styles.heroTitle}>
              <Words text={tr('hero.title1', 'Security, legality, and privacy,')} />{' '}
              <span className={styles.muted}>
                <Words text={tr('hero.title2', 'built for open verification.')} />
              </span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-s="hr">
              {tr(
                'hero.text',
                'Built for CISOs, Legal Counsel, and DPOs conducting Vendor Risk Assessments. Explore our cryptographic architecture, global signature enforceability, data subprocessors, and sustainability practices—without sales gates.'
              )}
            </p>
            <div className={styles.actions} data-s="hr">
              <Link to={withLng('/trust/security')} className={styles.btnPrimary} data-s="magnet" data-hv="primary">
                {tr('hero.primary', 'Explore Security Architecture')}
              </Link>
              <Link to={withLng('/trust/legality')} className={styles.btnOutline} data-s="magnet" data-hv="outline">
                {tr('hero.secondary', 'View Legality Guide')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. 3-COLUMN TRUST CENTER DIRECTORY (Blueprint Columns 1-3) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('directory.eyebrow', 'Trust Center Overview')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('directory.title', 'Everything enterprise compliance teams verify first.')} />
            </h2>
            <p className={styles.lead} data-s="r">
              {tr(
                'directory.lead',
                'Navigate directly to our security architecture, legal enforceability guides, live uptime status, and privacy disclosures.'
              )}
            </p>
          </header>

          <div className={styles.pillarStack}>
            {PILLAR_GROUPS.map((group) => {
              const GroupIcon = group.Icon;
              return (
                <div key={group.key} className={styles.groupBlock}>
                  <div className={styles.groupHeader} data-s="r">
                    <span className={styles.groupBadge}>
                      <GroupIcon aria-hidden="true" />
                      <span>{group.no}</span>
                    </span>
                    <div>
                      <p className={styles.groupEyebrow}>{group.eyebrow}</p>
                      <h3 className={styles.groupTitle}>{group.title}</h3>
                      <p className={styles.body}>{group.desc}</p>
                    </div>
                  </div>

                  <ul className={styles.resources}>
                    {group.links.map((item, i) => {
                      const inner = (
                        <>
                          <span className={styles.index}>#{i + 1}</span>
                          <h4 className={styles.featureTitle}>{item.title}</h4>
                          <p className={styles.bodySmall}>{item.desc}</p>
                          <span className={styles.resourceCta}>
                            <span>{item.cta}</span>
                            <span className={styles.arrow} data-s="arrow" aria-hidden="true">
                              <span className={styles.arrowIcon} data-s="arrowIcon">
                                <FiArrowRight />
                              </span>
                            </span>
                          </span>
                        </>
                      );

                      return (
                        <li key={item.key} className={styles.resourceItem} data-s="item">
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.resource}
                              data-s="spot"
                              data-hv="res"
                            >
                              {inner}
                            </a>
                          ) : (
                            <Link to={withLng(item.to)} className={styles.resource} data-s="spot" data-hv="res">
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 3. ZERO-TRUST ARCHITECTURE FLOW (Blueprint 2.1 Diagram) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('flow.eyebrow', 'Interactive Architecture Pipeline')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('flow.title', 'How Every Agreement Moves Through Nexgn.')} />
            </h2>
            <p className={styles.lead} data-s="r">
              {tr(
                'flow.lead',
                'From initial upload to SHA-256 cryptographic sealing and Google Drive BYOS routing—zero unnecessary retention.'
              )}
            </p>
          </header>

          <ol className={styles.pipeline}>
            {PIPELINE_STEPS.map((s) => {
              const StepIcon = s.Icon;
              return (
                <li key={s.step} className={styles.pipelineStep} data-s="item spot">
                  <div className={styles.pipelineTop}>
                    <span className={styles.iconBox} data-s="pop icon" aria-hidden="true">
                      <StepIcon />
                    </span>
                    <span className={styles.stepNum}>STEP {s.step}</span>
                  </div>
                  <h3 className={styles.smallTitle}>{s.title}</h3>
                  <p className={styles.bodySmall}>{s.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============ 4. QUOTE BAND ============ */}
      <section className={`${styles.section} ${styles.dark} ${styles.quoteBand}`}>
        <div className={styles.container}>
          <p className={styles.quote} data-s="quote">
            <Words text={tr('quote', 'Trust is not a 50-page PDF. It is verifiable architecture.')} mask={false} />
          </p>
        </div>
      </section>

      {/* ============ 5. PLATFORM DEFENSES & INFRASTRUCTURE ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('defenses.eyebrow', 'Platform Defenses Matrix')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('defenses.title', 'Built to Pass Rigorous Security Audits.')} />
            </h2>
          </header>

          <ul className={styles.pillars}>
            {DEFENSES.map(({ key, Icon, title, text }) => (
              <li key={key} className={styles.pillar} data-s="item spot">
                <span className={styles.featureLine} data-s="line" aria-hidden="true" />
                <div className={styles.defenseHead}>
                  <span className={styles.iconBox} data-s="pop" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={styles.featureTitle}>{title}</h3>
                </div>
                <p className={styles.body}>{text}</p>
              </li>
            ))}
          </ul>

          <hr className={styles.rule} data-s="rule" />

          <div className={styles.infra}>
            <div data-s="head">
              <p className={styles.eyebrow} data-s="r">
                {tr('infra.eyebrow', 'Vendor Risk Readiness')}
              </p>
              <h2 className={`${styles.title} ${styles.titleLeft}`}>
                <Words text={tr('infra.title', 'Verified Infrastructure & Honest Posture.')} />
              </h2>
              <p className={`${styles.lead} ${styles.leadLeft}`} data-s="r">
                {tr(
                  'infra.lead',
                  'We transparently distinguish between underlying tier-1 cloud data-center certifications and Nexgn’s own application-level controls.'
                )}
              </p>
            </div>

            <ul className={styles.checks}>
              {VRA_CHECKS.map((text, idx) => (
                <li key={idx} className={styles.check} data-s="item">
                  <span className={styles.checkIcon} data-s="pop" aria-hidden="true">
                    <FiCheck />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className={styles.rule} data-s="rule" />

          <ul className={styles.certs}>
            {CERTS.map(({ name, img }) => (
              <li key={name} className={styles.cert} data-s="item" data-hv="cert">
                {img ? (
                  <img src={img} alt="" className={styles.certLogo} data-s="certLogo" loading="lazy" decoding="async" />
                ) : (
                  <span className={styles.certBadge} data-s="certLogo" aria-hidden="true">
                    <FiShield />
                  </span>
                )}
                <span className={styles.certName}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. SUSTAINABILITY & RESPONSIBLE TECH PLEDGE (Blueprint Column 3) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('sustain.eyebrow', 'Responsible Tech & ESG')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('sustain.title', 'Every Digital Agreement Leaves a Smaller Footprint.')} />
            </h2>
          </header>

          <div data-s="item">
            <ImpactStats />
          </div>

          <blockquote className={styles.pledgeCard} data-s="item spot">
            <p className={styles.pledgeLabel}>THE NEXGN RESPONSIBLE TECH PLEDGE</p>
            <p className={styles.pledgeText}>{pledgeText}</p>
            <div className={styles.pledgeActions}>
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnDark}
              >
                <FiShare2 aria-hidden="true" />
                <span>Share Pledge on LinkedIn</span>
              </a>
              <Link to={withLng('/sustainability')} className={styles.textLink}>
                <span>Read Open Methodology</span>
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </blockquote>
        </div>
      </section>

      {/* ============ 7. THE LEGAL HUB (Blueprint Section 5) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('legal.eyebrow', 'The Legal Hub')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('legal.title', 'Master Contracts, Privacy Terms & DPAs.')} />
            </h2>
            <p className={styles.lead} data-s="r">
              {tr(
                'legal.lead',
                'Clear, plain-language legal documentation engineered with sticky section navigation for rapid legal counsel review.'
              )}
            </p>
          </header>

          <ul className={styles.legalGrid}>
            {LEGAL_HUB.map((doc) => (
              <li key={doc.key} className={styles.resourceItem} data-s="item">
                <Link to={withLng(doc.to)} className={styles.resource} data-s="spot" data-hv="res">
                  <span className={styles.index}>
                    <FiFileText aria-hidden="true" /> LEGAL DOC
                  </span>
                  <h3 className={styles.featureTitle}>{doc.title}</h3>
                  <p className={styles.bodySmall}>{doc.desc}</p>
                  <span className={styles.resourceCta}>
                    <span>Read Document</span>
                    <span className={styles.arrow} data-s="arrow" aria-hidden="true">
                      <span className={styles.arrowIcon} data-s="arrowIcon">
                        <FiArrowRight />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 8. VISIBLE VRA FAQs (Matches FAQPage Schema) + DIRECT CONTACTS ============ */}
      <section className={`${styles.section} ${styles.dark} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-s="r">
              {tr('faq.eyebrow', 'Common VRA Questions')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('faq.title', 'Security & Compliance FAQ.')} />
            </h2>
          </header>

          <div className={styles.faqList}>
            {TRUST_FAQS.map((item) => (
              <article key={item.q} className={styles.faqCard} data-s="item">
                <h3 className={styles.faqQ}>{item.q}</h3>
                <p className={styles.faqA}>{item.a}</p>
              </article>
            ))}
          </div>

          <div className={styles.contactStrip} data-s="item">
            <div>
              <h3 className={styles.contactTitle}>Need custom Vendor Risk Assessment assistance?</h3>
              <p className={styles.leadLight}>
                Reach our security team at{' '}
                <a href={`mailto:${SECURITY_EMAIL}`} className={styles.mailLink}>
                  {SECURITY_EMAIL}
                </a>{' '}
                or privacy team at{' '}
                <a href={`mailto:${PRIVACY_EMAIL}`} className={styles.mailLink}>
                  {PRIVACY_EMAIL}
                </a>
                .
              </p>
            </div>
            <Link to={withLng('/contact')} className={styles.btnPrimary} data-s="magnet" data-hv="primary">
              Contact Security & Legal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustCenter;