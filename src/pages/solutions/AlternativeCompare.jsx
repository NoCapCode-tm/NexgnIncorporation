import React, { useMemo, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiAward,
  FiCheck,
  FiSearch,
  FiShield,
  FiSliders,
  FiX,
} from 'react-icons/fi';
import { SEOHead, buildBreadcrumbs, ORGANIZATION_ID } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import useSecurityAnimations from '../../hooks/useSecurityAnimations';
import {
  COMPETITORS,
  COMPETITORS_MAP,
  COMPETITOR_CATEGORIES,
  NEXGN_BASELINE,
  NEXGN_HONEST_TRADEOFFS,
  SUSTAINABILITY_PILLARS,
} from './competitorsData';
import styles from './AlternativeCompare.module.css';

const LANGS = ['en', 'es', 'hi'];
const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';

/* Reuse core/trust hero backdrop if present; falls back cleanly to dark architectural gradient */
const coreContext = require.context('../../assets/core', false, /\.(png|jpe?g|webp|avif|svg)$/i);
const findCoreImage = (name) => {
  const key = coreContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = coreContext(key);
  return (mod && mod.default) || mod;
};
const HERO_IMAGE = findCoreImage('pricing-hero') || findCoreImage('workflow');

/* Masked headline words (animated by useSecurityAnimations) */
const Words = ({ text }) =>
  String(text)
    .split(' ')
    .filter(Boolean)
    .map((w, i, all) => (
      <React.Fragment key={`${w}-${i}`}>
        <span className={styles.wMask}>
          <span className={styles.wIn} data-s="w">
            {w}
          </span>
        </span>
        {i < all.length - 1 ? ' ' : null}
      </React.Fragment>
    ));

/* =====================================================================
   PART 1: HUB VIEW (/en/alternatives) — All 24 Platforms Directory & Matrix
   ===================================================================== */
const AlternativesHub = ({ currentLng }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const rootRef = useRef(null);
  const withLng = (p) => `/${currentLng}${p}`;

  useSecurityAnimations(rootRef, { lng: `${currentLng}-hub` });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COMPETITORS.filter((c) => {
      const catMatch = category === 'all' || c.category === category;
      const textMatch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.bestForCompetitor.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [category, search]);

  const seoTitle = 'Nexgn vs 24 eSignature Platforms | Transparent Compare';
  const seoDescription =
    'Compare Nexgn vs DocuSign, Adobe Sign, PandaDoc, Dropbox Sign, Zoho Sign, Documenso & 18 more tools. See hidden fees, API caps, honest trade-offs & sustainability.';
  const hubUrl = `https://nexgn.cloud/${currentLng}/alternatives`;

  const hubFaqs = [
    {
      q: 'What is the best transparent alternative to DocuSign and Adobe Sign?',
      a: 'Nexgn offers flat-rate pricing ($0 Free, $9 Starter, $19/mo Business with 15 seats and unlimited envelopes), zero overage penalties, Google Drive BYOS storage ownership, and AES-256 + SHA-256 cryptographic sealing.',
    },
    {
      q: 'What hidden fees do legacy e-signature providers charge?',
      a: 'Most legacy providers enforce strict annual caps (like 100 envelopes/user/year), charge $1.50+ per invite overage, bill per sender seat ($15–$49/user/mo), and gate API access behind $1,500–$2,500+/year minimums.',
    },
    {
      q: 'When should you NOT choose Nexgn over a competitor?',
      a: 'Choose a regional QTSP (like Yousign) if your EU workflow legally requires QES certificates, or an open-source tool (like Documenso/OpenSign) if you require self-hosting on air-gapped private infrastructure. Nexgn transparently documents these boundaries upfront.',
    },
  ];

  const hubSchema = {
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${hubUrl}#webpage`,
        url: hubUrl,
        name: seoTitle,
        description: seoDescription,
        inLanguage: currentLng,
        isPartOf: { '@id': 'https://nexgn.cloud/#website' },
      },
      buildBreadcrumbs(currentLng, [
        { name: 'Home', url: '/' },
        { name: 'Alternatives (24 Platforms)', url: '/alternatives' },
      ]),
      {
        '@type': 'ItemList',
        name: 'Top 24 eSignature Alternatives Compared with Nexgn',
        numberOfItems: COMPETITORS.length,
        itemListElement: COMPETITORS.map((c, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `Nexgn vs ${c.name}`,
          url: `https://nexgn.cloud/${currentLng}/alternatives/${c.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: hubFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/alternatives" schema={hubSchema} />

      {/* ============ 1. HERO (Frosted Dark Card) ============ */}
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
              Radical Transparency Benchmark
            </p>
            <h1 className={styles.heroTitle}>
              <Words text="Nexgn vs" />{' '}
              <span className={styles.red}>
                <Words text="24 eSignature Platforms." />
              </span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-s="hr">
              No cherry-picked tables. Inspect hidden envelope caps, API paywalls, storage lock-in,
              sustainability practices, where competitors shine, and Nexgn’s own honest boundaries.
            </p>
            <div className={styles.actions} data-s="hr">
              <a href={SIGNUP_URL} className={styles.btnPrimary} data-s="magnet" data-hv="primary">
                Start Free (19 Envelopes/mo)
              </a>
              <Link to={withLng('/pricing')} className={styles.btnOutline} data-s="magnet" data-hv="outline">
                View Open Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. FILTERABLE 24-COMPETITOR DIRECTORY ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Complete Market Matrix
            </p>
            <h2 className={styles.title}>
              <Words text="Every major e-signature vendor side by side." />
            </h2>
            <p className={styles.lead} data-s="r">
              Filter by category or search any platform to view full commercial terms, hidden traps,
              and honest fit comparisons.
            </p>
          </header>

          <div className={styles.filterBar} data-s="r">
            <div className={styles.filterTabs} role="tablist" aria-label="Competitor category filter">
              {COMPETITOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={category === cat.key}
                  className={`${styles.filterTab} ${category === cat.key ? styles.filterTabActive : ''}`}
                  onClick={() => setCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={styles.searchWrap}>
              <FiSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 24 platforms (DocuSign, API, QES...)"
                aria-label="Search competitors"
                className={styles.searchBox}
              />
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableToolbar}>
              <span className={styles.countMeta}>
                Showing {filtered.length} of {COMPETITORS.length} platforms + Nexgn baseline
              </span>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Platform</th>
                    <th scope="col">Starting Price</th>
                    <th scope="col">Envelope / Volume Cap</th>
                    <th scope="col">API Access Reality</th>
                    <th scope="col">Deep Dive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.nexgnRow}>
                    <th scope="row" className={styles.rowLabel}>
                      <span className={styles.vendor}>Nexgn (Our Baseline)</span>
                      <span className={styles.nexgnPill}>NoCapCode Inc.</span>
                    </th>
                    <td data-label="Starting Price">
                      <strong>$0 / $9 / $19 mo (flat, 15 seats)</strong>
                    </td>
                    <td data-label="Envelope / Volume Cap">
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true">
                        <FiCheck />
                      </span>
                      Unlimited on Business ($0 overages)
                    </td>
                    <td data-label="API Access Reality">REST + Webhooks + SDKs included</td>
                    <td data-label="Deep Dive">
                      <Link to={withLng('/pricing')} className={styles.inlineLink}>
                        See Plans <FiArrowRight aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>

                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyRow}>
                        No matching platforms found. Try clearing your filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr key={c.slug}>
                        <th scope="row" className={styles.rowLabel}>
                          <span className={styles.vendor}>{c.name}</span>
                          <span className={styles.catBadge}>{c.category}</span>
                        </th>
                        <td data-label="Starting Price">{c.startingPrice}</td>
                        <td data-label="Envelope / Volume Cap">{c.envelopeCap}</td>
                        <td data-label="API Access Reality">{c.apiBarrier}</td>
                        <td data-label="Deep Dive">
                          <Link to={withLng(`/alternatives/${c.slug}`)} className={styles.inlineLink}>
                            Compare <FiArrowRight aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. RADICAL TRANSPARENCY LEDGER ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Open Ledger · No Hidden Gotchas
            </p>
            <h2 className={styles.title}>
              <Words text="Where Nexgn is upfront about its own limits." />
            </h2>
            <p className={styles.lead} data-s="r">
              Enterprise trust comes from publishing exact scope boundaries alongside strengths.
            </p>
          </header>

          <ul className={styles.threeCol}>
            {NEXGN_HONEST_TRADEOFFS.map((item, idx) => (
              <li key={item.title} className={styles.card} data-s="item spot">
                <span className={styles.cardTopLine} data-s="line" aria-hidden="true" />
                <span className={styles.index}>0{idx + 1}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.body}>{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 4. SUSTAINABILITY DONE WISELY ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Green Web Engineering
            </p>
            <h2 className={styles.title}>
              <Words text="Digital sustainability measured in code, not slogans." />
            </h2>
            <p className={styles.lead} data-s="r">
              How architectural choices reduce storage duplication, client energy, and server polling.
            </p>
          </header>

          <ul className={styles.twoCol}>
            {SUSTAINABILITY_PILLARS.map((p) => (
              <li key={p.metric} className={styles.cardTint} data-s="item spot">
                <span className={styles.iconBox} data-s="pop" aria-hidden="true">
                  <FiActivity />
                </span>
                <h3 className={styles.cardTitle}>{p.metric}</h3>
                <p className={styles.bodyMuted}>
                  <strong>Legacy norm:</strong> {p.legacyProblem}
                </p>
                <p className={styles.body}>
                  <strong>Nexgn engineering:</strong> {p.nexgnApproach}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 5. VISIBLE FAQS (DARK BAND) ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-s="r">
              Common Switching Questions
            </p>
            <h2 className={styles.title}>
              <Words text="Frequently Asked Questions." />
            </h2>
          </header>

          <div className={styles.faqList}>
            {hubFaqs.map((item) => (
              <article key={item.q} className={styles.faqCard} data-s="item">
                <h3 className={styles.faqQ}>{item.q}</h3>
                <p className={styles.faqA}>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. GLOBAL CTA BANNER ============ */}
      <CtaBanner
        title={t('cta.title', 'Start signing documents')}
        highlight={t('cta.highlight', 'signing')}
        text={t(
          'cta.text',
          'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.'
        )}
        primary={{ label: t('cta.primary', 'Create your free account'), href: SIGNUP_URL }}
        secondary={{ label: t('cta.secondary', 'Login'), href: LOGIN_URL }}
      />
    </div>
  );
};

/* =====================================================================
   PART 2: INDIVIDUAL COMPETITOR COMPARISON (/en/alternatives/:competitor)
   ===================================================================== */
export const AlternativeCompare = () => {
  const { competitor } = useParams();
  const { t, i18n } = useTranslation();
  const rawLang = i18n.resolvedLanguage || i18n.language || 'en';
  const currentLang = LANGS.includes(rawLang) ? rawLang : 'en';
  const withLng = (p) => `/${currentLang}${p}`;

  const [teamSeats, setTeamSeats] = useState(10);
  const rootRef = useRef(null);

  useSecurityAnimations(rootRef, { lng: `${currentLang}-${competitor || 'hub'}` });

  if (!competitor) {
    return <AlternativesHub currentLng={currentLang} />;
  }

  const compData = COMPETITORS_MAP[competitor.toLowerCase()];
  if (!compData) {
    return <Navigate to={`/${currentLang}/alternatives`} replace />;
  }

  const perSeatEst = Math.max(8, Math.round((compData.estimatedMonthlyFor10Team || 200) / 10));
  const compMonthlyEst =
    compData.slug === 'ironclad'
      ? 2000
      : compData.slug === 'juro'
        ? 600
        : perSeatEst * teamSeats;
  const nexgnMonthlyCost =
    teamSeats <= 5 ? 9 : teamSeats <= 15 ? 19 : 19 * Math.ceil(teamSeats / 15);
  const annualSavings = Math.max(0, (compMonthlyEst - nexgnMonthlyCost) * 12);

  const seoTitle = `Nexgn vs ${compData.name} (2026): Honest Compare`;
  const seoDescription = `Transparent Nexgn vs ${compData.name} breakdown: ${compData.envelopeCap}. Compare hidden fees, API limits, BYOS security, sustainability & real trade-offs.`;

  const pagePath = `/alternatives/${compData.slug}`;
  const pageUrl = `https://nexgn.cloud/${currentLang}${pagePath}`;

  const visibleFaqs = [
    ...(compData.faqs || []),
    {
      q: `What does ${compData.name} do better than Nexgn?`,
      a: `${compData.whereCompetitorWins} Meanwhile, Nexgn wins on flat unlimited pricing ($19/mo for 15 seats), Google Drive BYOS ownership, zero-retention AI summaries, and developer-friendly REST webhooks.`,
    },
    {
      q: 'What happens to my signed documents if I leave Nexgn?',
      a: 'With Nexgn’s Bring Your Own Storage (BYOS) model, completed PDFs and SHA-256 audit certificates sync directly to your own Google Drive automatically—so you never face vendor lock-in.',
    },
  ];

  const dynamicSchema = {
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: seoTitle,
        description: seoDescription,
        inLanguage: currentLang,
        isPartOf: { '@id': 'https://nexgn.cloud/#website' },
      },
      buildBreadcrumbs(currentLang, [
        { name: 'Home', url: '/' },
        { name: 'Alternatives', url: '/alternatives' },
        { name: `Nexgn vs ${compData.name}`, url: pagePath },
      ]),
      {
        '@type': 'SoftwareApplication',
        name: 'Nexgn',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '19',
          offerCount: 3,
        },
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'FAQPage',
        mainEntity: visibleFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url={pagePath} schema={dynamicSchema} />

      {/* ============ 1. HERO (Frosted Glass Card) ============ */}
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
              Transparent Comparison · {compData.category}
            </p>
            <h1 className={styles.heroTitle}>
              <Words text="Nexgn vs" />{' '}
              <span className={styles.red}>
                <Words text={`${compData.name}.`} />
              </span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-s="hr">
              {compData.tagline}
            </p>
            <div className={styles.actions} data-s="hr">
              <a href={SIGNUP_URL} className={styles.btnPrimary} data-s="magnet" data-hv="primary">
                Start Free (No Card Required)
              </a>
              <Link to={withLng('/pricing')} className={styles.btnOutline} data-s="magnet" data-hv="outline">
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. HIDDEN TRAPS VS HONEST CREDIT ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Unfiltered Buyer Briefing
            </p>
            <h2 className={styles.title}>
              <Words text={`What ${compData.name} hides—and where they genuinely win.`} />
            </h2>
          </header>

          <ul className={styles.twoCol}>
            <li className={styles.cardTint} data-s="item spot">
              <span className={styles.cardTopLine} data-s="line" aria-hidden="true" />
              <span className={`${styles.iconBox} ${styles.iconBoxWarn}`} data-s="pop" aria-hidden="true">
                <FiAlertTriangle />
              </span>
              <h3 className={styles.cardTitle}>What {compData.name} Doesn’t Highlight Upfront</h3>
              <ul className={styles.bulletList}>
                <li><strong>Envelope / Quota Reality:</strong> {compData.envelopeCap}</li>
                <li><strong>Overage & Upgrade Trap:</strong> {compData.overageTrap}</li>
                <li><strong>API Gatekeeping:</strong> {compData.apiBarrier}</li>
                {compData.hiddenTraps.map((trap) => (
                  <li key={trap}>{trap}</li>
                ))}
              </ul>
            </li>

            <li className={styles.cardTint} data-s="item spot">
              <span className={styles.cardTopLine} data-s="line" aria-hidden="true" />
              <span className={`${styles.iconBox} ${styles.iconBoxGreen}`} data-s="pop" aria-hidden="true">
                <FiAward />
              </span>
              <h3 className={styles.cardTitle}>Where {compData.name} Genuinely Wins</h3>
              <p className={styles.body}>{compData.whereCompetitorWins}</p>
              <div className={styles.fitNote}>
                <p className={styles.fitLabel}>Choose {compData.name} if:</p>
                <p className={styles.bodySmall}>{compData.bestForCompetitor}</p>
              </div>
              <div className={`${styles.fitNote} ${styles.fitNoteNexgn}`}>
                <p className={styles.fitLabel}>Choose Nexgn if:</p>
                <p className={styles.bodySmall}>
                  You want predictable flat pricing ($0–$19/mo), unlimited Business envelopes, Google
                  Drive BYOS ownership, SHA-256 non-repudiation, and zero-retention AI summaries.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ 3. INTERACTIVE TEAM COST ESTIMATOR (DARK BAND) ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <div className={styles.tcoCard} data-s="item">
            <div className={styles.tcoHead}>
              <span className={styles.iconBoxDark} aria-hidden="true">
                <FiSliders />
              </span>
              <div>
                <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.eyebrowLeft}`}>
                  Total Cost of Ownership Estimator
                </p>
                <h2 className={styles.tcoTitle}>
                  Instant cost comparison for {teamSeats} active {teamSeats === 1 ? 'seat' : 'seats'}
                </h2>
              </div>
            </div>

            <div className={styles.sliderWrap}>
              <input
                type="range"
                min="1"
                max="30"
                value={teamSeats}
                onChange={(e) => setTeamSeats(Number(e.target.value))}
                aria-label="Team seat count"
                className={styles.tcoSlider}
              />
              <div className={styles.sliderScale}>
                <span>1 user</span>
                <span>15 users</span>
                <span>30 users</span>
              </div>
            </div>

            <div className={styles.tcoGrid}>
              <div className={styles.tcoMetric}>
                <span className={styles.tcoMetricLabel}>
                  Estimated {compData.name} ({teamSeats} seats)
                </span>
                <strong className={styles.tcoValue}>~${compMonthlyEst.toLocaleString()}/mo</strong>
              </div>
              <div className={`${styles.tcoMetric} ${styles.tcoMetricNexgn}`}>
                <span className={styles.tcoMetricLabel}>
                  Nexgn ({teamSeats <= 5 ? 'Starter' : 'Business · Unlimited Envelopes'})
                </span>
                <strong className={styles.tcoValue}>${nexgnMonthlyCost}/mo</strong>
              </div>
              <div className={styles.tcoMetric}>
                <span className={styles.tcoMetricLabel}>Estimated Annual Savings</span>
                <strong className={`${styles.tcoValue} ${styles.greenValue}`}>
                  ~${annualSavings.toLocaleString()}/yr
                </strong>
              </div>
            </div>

            <div className={styles.tcoFooter}>
              <p className={styles.tcoNote}>
                * Estimates based on typical published business tiers as of 2026; negotiated enterprise rates vary.
              </p>
              <Link
                to={`/${currentLang}/contact?subject=sales#contact-form`}
                state={{ subject: 'sales' }}
                className={styles.tcoSalesLink}
              >
                Need a custom plan for 15+ seats? Contact Sales &amp; Pricing <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. HEAD-TO-HEAD TECHNICAL MATRIX ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Side-by-Side Architecture
            </p>
            <h2 className={styles.title}>
              <Words text="Technical, commercial & sustainability breakdown." />
            </h2>
          </header>

          <div className={styles.tableCard} data-s="item">
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Evaluation Criteria</th>
                    <th scope="col" className={styles.nexgnHead}>Nexgn</th>
                    <th scope="col">{compData.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>Pricing Transparency</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiCheck /></span>
                      {NEXGN_BASELINE.pricingTransparency}
                    </td>
                    <td data-label={compData.name}>{compData.startingPrice}</td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>Envelope / Volume Cap</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiCheck /></span>
                      {NEXGN_BASELINE.envelopeModel}
                    </td>
                    <td data-label={compData.name}>{compData.envelopeCap}</td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>Overage Penalties</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiCheck /></span>
                      {NEXGN_BASELINE.overageFees}
                    </td>
                    <td data-label={compData.name}>
                      <span className={`${styles.mark} ${styles.markNo}`} aria-hidden="true"><FiX /></span>
                      {compData.overageTrap}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>REST API & Webhooks</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiCheck /></span>
                      {NEXGN_BASELINE.apiAccess}
                    </td>
                    <td data-label={compData.name}>{compData.apiBarrier}</td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>Storage Ownership (BYOS)</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiCheck /></span>
                      {NEXGN_BASELINE.storageOwnership}
                    </td>
                    <td data-label={compData.name}>Vendor cloud default (manual export or enterprise add-on)</td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>AI Privacy & Summaries</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiCheck /></span>
                      {NEXGN_BASELINE.aiPrivacy}
                    </td>
                    <td data-label={compData.name}>Often paid add-on or omitted on entry plans</td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>Cryptographic Audit Security</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiShield /></span>
                      {NEXGN_BASELINE.securityStack}
                    </td>
                    <td data-label={compData.name}>{compData.techStack}</td>
                  </tr>
                  <tr>
                    <th scope="row" className={styles.rowLabel}>Sustainability & Efficiency</th>
                    <td data-label="Nexgn" className={styles.nexgnCell}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true"><FiActivity /></span>
                      {NEXGN_BASELINE.sustainabilityPractice}
                    </td>
                    <td data-label={compData.name}>{compData.sustainabilityNote}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. HONEST TRADE-OFFS & SUSTAINABILITY ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Open Transparency Ledger
            </p>
            <h2 className={styles.title}>
              <Words text="Where Nexgn is honest about its current limits." />
            </h2>
          </header>

          <ul className={styles.threeCol}>
            {NEXGN_HONEST_TRADEOFFS.map((item, idx) => (
              <li key={item.title} className={styles.cardTint} data-s="item spot">
                <span className={styles.cardTopLine} data-s="line" aria-hidden="true" />
                <span className={styles.index}>0{idx + 1}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.body}>{item.detail}</p>
              </li>
            ))}
          </ul>

          <hr className={styles.rule} data-s="rule" />

          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              Green Web Engineering
            </p>
            <h2 className={styles.title}>
              <Words text="Responsible sustainability practices without greenwashing." />
            </h2>
          </header>

          <ul className={styles.twoCol}>
            {SUSTAINABILITY_PILLARS.map((p) => (
              <li key={p.metric} className={styles.cardTint} data-s="item spot">
                <span className={styles.iconBox} data-s="pop" aria-hidden="true">
                  <FiActivity />
                </span>
                <h3 className={styles.cardTitle}>{p.metric}</h3>
                <p className={styles.bodyMuted}>
                  <strong>Legacy gap:</strong> {p.legacyProblem}
                </p>
                <p className={styles.body}>
                  <strong>Nexgn engineering:</strong> {p.nexgnApproach}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. VISIBLE FAQS & ALL-24 DIRECTORY (DARK BAND) ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-s="r">
              Switching FAQ
            </p>
            <h2 className={styles.title}>
              <Words text={`Common questions: Nexgn vs ${compData.name}.`} />
            </h2>
          </header>

          <div className={styles.faqList}>
            {visibleFaqs.map((item) => (
              <article key={item.q} className={styles.faqCard} data-s="item">
                <h3 className={styles.faqQ}>{item.q}</h3>
                <p className={styles.faqA}>{item.a}</p>
              </article>
            ))}
          </div>

          <hr className={`${styles.rule} ${styles.ruleDark}`} data-s="rule" />

          <nav className={styles.directoryNav} aria-label="Compare all 24 eSignature competitors" data-s="item">
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`}>
              Explore All 24 Platform Comparisons
            </p>
            <div className={styles.directoryPills}>
              <Link to={withLng('/alternatives')} className={styles.dirPill}>
                All 24 Overview
              </Link>
              {COMPETITORS.map((c) => (
                <Link
                  key={c.slug}
                  to={withLng(`/alternatives/${c.slug}`)}
                  className={`${styles.dirPill} ${c.slug === compData.slug ? styles.dirPillActive : ''}`}
                >
                  vs {c.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* ============ 7. GLOBAL CTA BANNER ============ */}
      <CtaBanner
        title={t('cta.title', 'Start signing documents')}
        highlight={t('cta.highlight', 'signing')}
        text={t(
          'cta.text',
          'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.'
        )}
        primary={{ label: t('cta.primary', 'Create your free account'), href: SIGNUP_URL }}
        secondary={{ label: t('cta.secondary', 'Login'), href: LOGIN_URL }}
      />
    </div>
  );
};

export default AlternativeCompare;