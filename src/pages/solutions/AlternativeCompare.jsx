import React, { useMemo, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiCheck,
  FiX,
  FiArrowRight,
  FiShield,
  FiAlertTriangle,
  FiAward,
  FiActivity,
  FiSliders,
} from 'react-icons/fi';
import { SEOHead, buildBreadcrumbs, ORGANIZATION_ID } from '../../components/seo/SEOHead';
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

/* =====================================================================
   PART 1: HUB VIEW (/en/alternatives) — All 24 Platforms Directory & Matrix
   ===================================================================== */
const AlternativesHub = ({ currentLng }) => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const withLng = (p) => `/${currentLng}${p}`;

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

  const seoTitle = 'Nexgn vs 24 eSignature Platforms | Transparent Comparison';
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
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/alternatives" schema={hubSchema} />

      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <p className={styles.eyebrow}>RADICAL TRANSPARENCY BENCHMARK</p>
          <h1 className={styles.title}>
            Nexgn vs <span className={styles.red}>24 eSignature Platforms</span>
          </h1>
          <p className={styles.lead}>
            No cherry-picked metrics. Compare hidden envelope caps, API paywalls, storage lock-in,
            sustainability practices, where competitors genuinely shine, and Nexgn’s own honest trade-offs.
          </p>
          <div className={styles.actions}>
            <a href={SIGNUP_URL} className={styles.btnPrimary}>
              Start Free (19 Envelopes/mo)
            </a>
            <Link to={withLng('/pricing')} className={styles.btnGhost}>
              View Open Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
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
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter 24 competitors (e.g., DocuSign, API, QES)..."
              aria-label="Search competitors"
              className={styles.searchBox}
            />
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Starting Price</th>
                  <th>Envelope / Volume Trap</th>
                  <th>API Access Reality</th>
                  <th>Deep Dive</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.nexgnHighlightRow}>
                  <td><strong>Nexgn (Our Baseline)</strong></td>
                  <td><strong>$0 / $9 / $19 mo (flat, 15 seats)</strong></td>
                  <td><strong>Unlimited on Business ($0 overages)</strong></td>
                  <td><strong>REST + Webhooks + SDKs included</strong></td>
                  <td><Link to={withLng('/pricing')} className={styles.inlineLink}>See Plans →</Link></td>
                </tr>
                {filtered.map((c) => (
                  <tr key={c.slug}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.startingPrice}</td>
                    <td>{c.envelopeCap}</td>
                    <td>{c.apiBarrier}</td>
                    <td>
                      <Link to={withLng(`/alternatives/${c.slug}`)} className={styles.inlineLink}>
                        Compare {c.name} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Open Trade-offs & Sustainability */}
          <div className={styles.transparencyBlock}>
            <h2 className={styles.sectionTitle}>Our Radical Transparency Ledger</h2>
            <p className={styles.sectionSubtitle}>
              We believe trust comes from publishing our boundaries alongside our strengths.
            </p>
            <div className={styles.cardsGrid}>
              {NEXGN_HONEST_TRADEOFFS.map((item) => (
                <article key={item.title} className={styles.infoCard}>
                  <FiAlertTriangle className={styles.cardIconWarn} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.transparencyBlock}>
            <h2 className={styles.sectionTitle}>Digital Sustainability Done Wisely</h2>
            <p className={styles.sectionSubtitle}>
              Real engineering reductions instead of vague carbon-offset slogans.
            </p>
            <div className={styles.cardsGrid2}>
              {SUSTAINABILITY_PILLARS.map((p) => (
                <article key={p.metric} className={styles.infoCard}>
                  <FiActivity className={styles.cardIconGreen} aria-hidden="true" />
                  <h3>{p.metric}</h3>
                  <p className={styles.mutedSmall}><strong>Industry norm:</strong> {p.legacyProblem}</p>
                  <p><strong>Nexgn engineering:</strong> {p.nexgnApproach}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Visible FAQ section matching FAQPage schema */}
          <div className={styles.faqBlock}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {hubFaqs.map((item) => (
                <div key={item.q} className={styles.faqItem}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* =====================================================================
   PART 2: INDIVIDUAL COMPETITOR COMPARISON (/en/alternatives/:competitor)
   ===================================================================== */
export const AlternativeCompare = () => {
  const { competitor } = useParams();
  const { i18n } = useTranslation();
  const rawLang = i18n.resolvedLanguage || i18n.language || 'en';
  const currentLang = LANGS.includes(rawLang) ? rawLang : 'en';
  const withLng = (p) => `/${currentLang}${p}`;

  const [teamSeats, setTeamSeats] = useState(10);

  if (!competitor) {
    return <AlternativesHub currentLng={currentLang} />;
  }

  const compData = COMPETITORS_MAP[competitor.toLowerCase()];
  if (!compData) {
    return <Navigate to={`/${currentLang}/alternatives`} replace />;
  }

  // Transparent TCO estimator for 10-seat / N-seat comparison
  const perSeatEst = Math.max(8, Math.round((compData.estimatedMonthlyFor10Team || 200) / 10));
  const compMonthlyEst =
    compData.slug === 'ironclad'
      ? 2000
      : compData.slug === 'juro'
        ? 600
        : perSeatEst * teamSeats;
  const nexgnMonthlyCost = teamSeats <= 5 ? 9 : teamSeats <= 15 ? 19 : 19 * Math.ceil(teamSeats / 15);
  const annualSavings = Math.max(0, (compMonthlyEst - nexgnMonthlyCost) * 12);

  // Title kept safely <= 60 chars for Google SERP & prerender check
  const seoTitle = `Nexgn vs ${compData.name} (2026): Honest Compare`;
  const seoDescription = `Transparent Nexgn vs ${compData.name} breakdown: ${compData.envelopeCap}. Compare hidden fees, API limits, BYOS security, sustainability & real trade-offs.`;

  const pagePath = `/alternatives/${compData.slug}`;
  const pageUrl = `https://nexgn.cloud/${currentLang}${pagePath}`;

  // Combine competitor FAQs + universal transparency FAQ (all rendered visibly below)
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
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url={pagePath} schema={dynamicSchema} />

      {/* 1. HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <p className={styles.eyebrow}>TRANSPARENT COMPARISON · {compData.category.toUpperCase()}</p>
          <h1 className={styles.title}>
            Nexgn vs <span className={styles.red}>{compData.name}</span>
          </h1>
          <p className={styles.lead}>{compData.tagline}</p>
          <div className={styles.actions}>
            <a href={SIGNUP_URL} className={styles.btnPrimary}>
              Start Free (No Card Required)
            </a>
            <Link to={withLng('/pricing')} className={styles.btnGhost}>
              View Transparent Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHAT COMPETITORS RARELY HIGHLIGHT UPFRONT + HONEST CREDIT */}
      <section className={styles.tableSection}>
        <div className={styles.container}>
          <div className={styles.twoColCards}>
            <article className={styles.infoCard}>
              <FiAlertTriangle className={styles.cardIconWarn} aria-hidden="true" />
              <h2>What {compData.name} Doesn’t Highlight on the Pricing Card</h2>
              <ul className={styles.bulletList}>
                <li><strong>Envelope / Quota Reality:</strong> {compData.envelopeCap}</li>
                <li><strong>Overage & Upgrade Trap:</strong> {compData.overageTrap}</li>
                <li><strong>API Gatekeeping:</strong> {compData.apiBarrier}</li>
                {compData.hiddenTraps.map((trap) => (
                  <li key={trap}>{trap}</li>
                ))}
              </ul>
            </article>

            <article className={styles.infoCard}>
              <FiAward className={styles.cardIconGreen} aria-hidden="true" />
              <h2>Where {compData.name} Genuinely Wins (Honest View)</h2>
              <p>{compData.whereCompetitorWins}</p>
              <p className={styles.bestForBox}>
                <strong>Choose {compData.name} if:</strong> {compData.bestForCompetitor}
              </p>
              <p className={styles.bestForBox}>
                <strong>Choose Nexgn if:</strong> You want predictable flat pricing ($0–$19/mo),
                unlimited Business envelopes, Google Drive BYOS ownership, SHA-256 non-repudiation,
                and zero-retention AI summaries.
              </p>
            </article>
          </div>

          {/* 3. INTERACTIVE TEAM TCO ESTIMATOR */}
          <div className={styles.tcoBox}>
            <div className={styles.tcoHeader}>
              <FiSliders aria-hidden="true" />
              <h2>Instant Team Cost Comparison</h2>
            </div>
            <p className={styles.tcoSub}>
              Adjust active team seats ({teamSeats} seats) to estimate typical monthly software spend.
            </p>
            <input
              type="range"
              min="1"
              max="30"
              value={teamSeats}
              onChange={(e) => setTeamSeats(Number(e.target.value))}
              aria-label="Team seat count"
              className={styles.tcoSlider}
            />
            <div className={styles.tcoGrid}>
              <div className={styles.tcoMetric}>
                <span>Estimated {compData.name} ({teamSeats} users)</span>
                <strong>~${compMonthlyEst.toLocaleString()}/mo</strong>
              </div>
              <div className={`${styles.tcoMetric} ${styles.tcoMetricNexgn}`}>
                <span>Nexgn ({teamSeats <= 5 ? 'Starter' : 'Business · Unlimited Envelopes'})</span>
                <strong>${nexgnMonthlyCost}/mo</strong>
              </div>
              <div className={styles.tcoMetric}>
                <span>Estimated Annual Savings</span>
                <strong className={styles.greenText}>~${annualSavings.toLocaleString()}/yr</strong>
              </div>
            </div>
            <p className={styles.tcoDisclaimer}>
              * Estimates based on publicly listed standard business tiers as of 2026. Custom enterprise discounts vary.
            </p>
          </div>

          {/* 4. FULL FEATURE, SECURITY & SUSTAINABILITY MATRIX */}
          <h2 className={styles.sectionTitle}>Head-to-Head Technical & Commercial Matrix</h2>
          <p className={styles.sectionSubtitle}>
            Every metric verified against real platform architecture—including sustainability & AI data privacy.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Evaluation Criteria</th>
                  <th className={styles.nexgnColumn}>Nexgn</th>
                  <th className={styles.compColumn}>{compData.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Pricing Transparency</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> {NEXGN_BASELINE.pricingTransparency}</td>
                  <td className={styles.compCell}>{compData.startingPrice}</td>
                </tr>
                <tr>
                  <td><strong>Envelope / Volume Cap</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> {NEXGN_BASELINE.envelopeModel}</td>
                  <td className={styles.compCell}>{compData.envelopeCap}</td>
                </tr>
                <tr>
                  <td><strong>Overage Penalties</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> {NEXGN_BASELINE.overageFees}</td>
                  <td className={styles.compCell}><FiX className={styles.iconRed} /> {compData.overageTrap}</td>
                </tr>
                <tr>
                  <td><strong>REST API & Webhooks</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> {NEXGN_BASELINE.apiAccess}</td>
                  <td className={styles.compCell}>{compData.apiBarrier}</td>
                </tr>
                <tr>
                  <td><strong>Storage Ownership (BYOS)</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> {NEXGN_BASELINE.storageOwnership}</td>
                  <td className={styles.compCell}>Vendor cloud default (export manually or enterprise sync)</td>
                </tr>
                <tr>
                  <td><strong>AI Privacy & Summaries</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> {NEXGN_BASELINE.aiPrivacy}</td>
                  <td className={styles.compCell}>Often paid add-on or unavailable on entry tiers</td>
                </tr>
                <tr>
                  <td><strong>Cryptographic Audit Security</strong></td>
                  <td className={styles.nexgnCell}><FiShield className={styles.iconGreen} /> {NEXGN_BASELINE.securityStack}</td>
                  <td className={styles.compCell}>{compData.techStack}</td>
                </tr>
                <tr>
                  <td><strong>Sustainability & Efficiency</strong></td>
                  <td className={styles.nexgnCell}><FiActivity className={styles.iconGreen} /> {NEXGN_BASELINE.sustainabilityPractice}</td>
                  <td className={styles.compCell}>{compData.sustainabilityNote}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. NEXGN HONEST TRADE-OFFS (OPEN LEDGER) */}
          <div className={styles.transparencyBlock}>
            <h2 className={styles.sectionTitle}>Where Nexgn Is Transparent About Its Own Limits</h2>
            <p className={styles.sectionSubtitle}>
              No software fits 100% of edge cases. Here are Nexgn’s real boundaries today:
            </p>
            <div className={styles.cardsGrid}>
              {NEXGN_HONEST_TRADEOFFS.map((item) => (
                <article key={item.title} className={styles.infoCard}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          {/* 6. SUSTAINABILITY ENGINEERING */}
          <div className={styles.transparencyBlock}>
            <h2 className={styles.sectionTitle}>Green Web Engineering & Sustainability Practice</h2>
            <p className={styles.sectionSubtitle}>
              How Nexgn lowers operational energy & paper waste without unverified greenwashing claims.
            </p>
            <div className={styles.cardsGrid2}>
              {SUSTAINABILITY_PILLARS.map((p) => (
                <article key={p.metric} className={styles.infoCard}>
                  <h3>{p.metric}</h3>
                  <p className={styles.mutedSmall}><strong>Legacy gap:</strong> {p.legacyProblem}</p>
                  <p><strong>Nexgn engineering:</strong> {p.nexgnApproach}</p>
                </article>
              ))}
            </div>
          </div>

          {/* 7. VISIBLE FAQS (MATCHES JSON-LD 100%) */}
          <div className={styles.faqBlock}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions: Nexgn vs {compData.name}</h2>
            <div className={styles.faqList}>
              {visibleFaqs.map((item) => (
                <div key={item.q} className={styles.faqItem}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. INTERNAL LINKING DIRECTORY TO ALL 24 COMPETITORS (CRAWL DEPTH = 1) */}
          <nav className={styles.directoryNav} aria-label="Compare all 24 eSignature competitors">
            <h3>Explore All 24 Transparent Comparisons</h3>
            <div className={styles.directoryPills}>
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

          {/* 9. FINAL CTA */}
          <div className={styles.bottomCta}>
            <h3>Ready to switch from {compData.name} with zero lock-in?</h3>
            <p>Start with 19 free envelopes/month, or unlock unlimited Business envelopes for $19/mo.</p>
            <a href={SIGNUP_URL} className={styles.btnPrimary}>
              Switch to Nexgn Free <FiArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlternativeCompare;