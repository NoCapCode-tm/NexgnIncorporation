import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiChevronDown, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { SEOHead } from '../../components/seo/SEOHead';
import useHelpCenterAnimations from '../../hooks/useHelpCenterAnimations';
import styles from './HelpCenter.module.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HELP_CATEGORIES = [
  {
    id: 'core-platform',
    number: '01',
    title: 'Core Platform & Capabilities',
    focus: 'Focus: Document preparation, templates, and automated workflows.',
    frequent: [
      {
        id: 'cp-f1',
        q: 'How do I upload a document and prepare it for signing?',
        a: 'Click "New Envelope" on your dashboard, upload your PDF, and use our Document Editor to drag-and-drop necessary fields (Signature, Date, Text, Name, Number) onto the document. Assign a recipient and click send.',
      },
      {
        id: 'cp-f2',
        q: 'What file types are supported?',
        a: 'Currently, Nexgn supports PDF files to ensure pixel-perfect rendering and coordinate precision across all devices.',
      },
      {
        id: 'cp-f3',
        q: 'Can I save a frequently used document as a template?',
        a: 'Yes. Upload your document, assign dynamic roles (e.g., "Contractor", "Hiring Manager"), place your fields, and save it as a Template. Next time, you only need to enter the recipient\'s email.',
      },
      {
        id: 'cp-f4',
        q: 'How do I set up automated reminders for signers?',
        a: 'During the document preparation phase, open the "Automate" tab. You can configure Smart Reminders to follow up with the signer automatically (e.g., every 3 days) until the document expires or is signed.',
      },
      {
        id: 'cp-f5',
        q: 'How do I create multi-signer sequential workflows?',
        a: 'When adding signers, you can define a routing order. For example, assign the Tenant as Step 1, the Broker as Step 2, and the Landlord as Step 3. The document will route to each party sequentially.',
      },
    ],
    rare: [
      {
        id: 'cp-r1',
        q: 'Is it possible to schedule a document to be sent at a later date?',
        a: 'Yes. Using the Scheduler feature, you can queue an envelope to be dispatched at a specific date and time, completely handled by our backend queueing system.',
      },
      {
        id: 'cp-r2',
        q: 'What happens if I place a signature field outside the document margins?',
        a: 'Our Document Editor restricts widgets to the document\'s viewable canvas to ensure that signatures and data are clearly visible and legally binding on the final exported PDF.',
      },
      {
        id: 'cp-r3',
        q: 'Can I edit a document after it has been sent?',
        a: 'No. To preserve the cryptographic integrity and legal validity of the agreement, a document cannot be edited once dispatched. You must void the envelope and send a corrected version.',
      },
    ],
  },
  {
    id: 'signer-experience',
    number: '02',
    title: 'The Signer Experience',
    focus: 'Focus: Frictionless signing, accessibility, and consent.',
    frequent: [
      {
        id: 'se-f1',
        q: 'Does the person signing need a Nexgn account?',
        a: 'No. Signers do not need to create an account, enter a password, or pay any fees. They simply click the secure link in their email to access the document.',
      },
      {
        id: 'se-f2',
        q: 'Can signers complete documents on a mobile device?',
        a: 'Absolutely. Nexgn provides a frictionless, mobile-first portal optimized for smartphones and tablets.',
      },
      {
        id: 'se-f3',
        q: 'What signature styles are available to the signer?',
        a: 'Signers can draw their signature using a trackpad/touchscreen, upload an image of their signature, or type their name using one of our four custom cursive fonts (including Caveat, Dancing Script, Great Vibes, and Pacifico).',
      },
      {
        id: 'se-f4',
        q: 'How does the signer receive the final executed document?',
        a: 'Once all parties have signed, all participants automatically receive an email containing a secure link to download the finalized PDF and its attached Audit Certificate.',
      },
    ],
    rare: [
      {
        id: 'se-r1',
        q: 'How does the "Consent Overlay" work before signing?',
        a: 'Before viewing the document, signers must accept a mandatory "Electronic Record and Signature Consent" overlay. This establishes explicit legal intent to conduct business electronically.',
      },
      {
        id: 'se-r2',
        q: 'What happens if a signer declines to sign?',
        a: 'A signer can choose "Decline to Sign" within the portal and leave an optional reason. The envelope status will update to "Declined," and the sender will be notified immediately.',
      },
      {
        id: 'se-r3',
        q: 'What if the signer forwards their unique signing link to someone else?',
        a: 'Signing links are uniquely tokenized and tied to the recipient\'s email address and session. If a link is forwarded, our telemetry will log the differing IP and browser details in the audit trail, though we recommend strict email security to prevent unauthorized access.',
      },
      {
        id: 'se-r4',
        q: 'Can a signer change their signature after completing the document?',
        a: 'No. Once the "Complete" button is pressed, the document is immediately sealed with a SHA-256 cryptographic hash. Changes cannot be made without breaking the document\'s legal integrity.',
      },
    ],
  },
  {
    id: 'security-compliance',
    number: '03',
    title: 'Advanced Security & Legal Compliance',
    focus: 'Focus: Cryptography, audit trails, and global legality (ESIGN, eIDAS, IT Act).',
    frequent: [
      {
        id: 'sc-f1',
        q: 'Are Nexgn signatures legally binding?',
        a: 'Yes. Nexgn complies with major global electronic signature frameworks, including the US ESIGN Act, UETA, EU eIDAS (Standard Electronic Signatures), and the India IT Act 2000.',
      },
      {
        id: 'sc-f2',
        q: 'What is an Audit Certificate?',
        a: 'An Audit Certificate is an irrefutable, cryptographically sealed page appended to your final contract. It logs the explicit details of the transaction, providing stronger legal evidence than a traditional wet-ink signature.',
      },
      {
        id: 'sc-f3',
        q: 'How does Nexgn prove the identity of the signer?',
        a: 'We utilize a Telemetry Matrix that captures the signer\'s verified email address, IPv4/IPv6 network addresses, exact UTC server timestamps, and browser/OS User-Agent strings.',
      },
      {
        id: 'sc-f4',
        q: 'Is my document data encrypted?',
        a: 'Yes. Data is encrypted in transit using industry-standard TLS 1.3 and at rest within our databases using AES-256 protocols.',
      },
      {
        id: 'sc-f5',
        q: 'What happens if a document is tampered with after signing?',
        a: 'Every completed agreement is sealed with a tamper-evident SHA-256 hash. If a single pixel or character is altered after execution, the cryptographic seal breaks, immediately voiding the document.',
      },
    ],
    rare: [
      {
        id: 'sc-r1',
        q: 'Do you offer Two-Factor Authentication (2FA) for accounts?',
        a: 'Yes. We highly recommend securing your Nexgn workspace with our mandatory TOTP Two-Factor Authentication via authenticator apps (like Google Authenticator or Authy).',
      },
      {
        id: 'sc-r2',
        q: 'Are you SOC 2 or ISO 27001 certified?',
        a: 'Nexgn’s platform is built on top of Tier-1 cloud infrastructure (AWS/GCP) that is independently certified for ISO 27001, SOC 2 Type II, and PCI-DSS.',
      },
      {
        id: 'sc-r3',
        q: 'How does Nexgn satisfy "Advanced Electronic Signatures" (AES) in the EU?',
        a: 'Our comprehensive audit telemetry (IP, email authentication, document hashing, and timestamps) provides the necessary evidence to support AES standards under the eIDAS regulation.',
      },
      {
        id: 'sc-r4',
        q: 'How do I report a security vulnerability?',
        a: 'Nexgn maintains a Vulnerability Disclosure Program. Ethical hackers can report issues to our security team (with PGP encryption support) to help us continually secure the platform.',
      },
    ],
  },
  {
    id: 'account-billing',
    number: '04',
    title: 'Account Management & Billing',
    focus: 'Focus: Subscription tiers, envelope limits, and RBAC.',
    frequent: [
      {
        id: 'ab-f1',
        q: 'What are the envelope limits on the Free and Starter plans?',
        a: 'The Free tier allows for up to 19 envelopes per month. The Starter tier (₹900/month billed annually) allows for up to 49 envelopes per month.',
      },
      {
        id: 'ab-f2',
        q: 'What happens when I hit my monthly envelope limit?',
        a: 'We will notify you when you reach 80% capacity. Once you hit your limit, you will be temporarily blocked from sending further requests until your billing cycle resets on the 1st of the month, or you can instantly upgrade to the Business plan for unlimited envelopes.',
      },
      {
        id: 'ab-f3',
        q: 'How do I upgrade, downgrade, or cancel my subscription?',
        a: 'You can manage your subscription directly from your Workspace Settings. Upgrades take effect immediately. Cancellations leave your paid features active until the end of your current billing cycle.',
      },
      {
        id: 'ab-f4',
        q: 'Do you offer prorated refunds?',
        a: 'No. Per our Refund & Cancellation Policy, Nexgn does not provide prorated refunds for partial months of service if you choose to cancel early.',
      },
      {
        id: 'ab-f5',
        q: 'How do I add team members to my workspace?',
        a: 'On the Starter and Business plans, you can invite team members as Sub-Admins via the Team Management dashboard.',
      },
    ],
    rare: [
      {
        id: 'ab-r1',
        q: 'How does Role-Based Access Control (RBAC) work?',
        a: 'Workspace Admins can strictly restrict Sub-Admin permissions. You can toggle specific capabilities, such as Can View Documents, Can Create Templates, or Can Manage Billing, ensuring sensitive contracts remain confidential.',
      },
      {
        id: 'ab-r2',
        q: 'What payment gateway do you use?',
        a: 'All Nexgn subscription billing is securely processed via Razorpay, supporting localized compliance (like RBI guidelines in India) and global payment methods.',
      },
      {
        id: 'ab-r3',
        q: 'Can I remove the Nexgn watermarks and branding?',
        a: 'Yes. Custom branding and the removal of Nexgn watermarks are exclusive features available on the Business and Enterprise tiers.',
      },
    ],
  },
  {
    id: 'enterprise-api',
    number: '05',
    title: 'Enterprise, API & Customization',
    focus: 'Focus: API integration, webhooks, and embedded signing.',
    frequent: [
      {
        id: 'ea-f1',
        q: 'How do I get an API key?',
        a: 'Navigate to /settings?tab=integrations in your dashboard to generate your REST API key.',
      },
      {
        id: 'ea-f2',
        q: 'Can I embed the signing experience directly into my own app?',
        a: 'Yes. Our Embedded Signing capabilities allow you to render the Nexgn signing portal seamlessly inside your own web application via an iFrame or React component, keeping users on your platform.',
      },
      {
        id: 'ea-f3',
        q: 'Do you provide a Sandbox environment?',
        a: 'Yes. Developers can use our dedicated Sandbox environment to test integrations, webhooks, and template generation with unlimited envelopes without consuming live quotas or triggering Razorpay billing.',
      },
      {
        id: 'ea-f4',
        q: 'How do Webhooks work in Nexgn?',
        a: 'Nexgn pushes real-time HTTPS payloads to your servers for events like agreement.viewed and agreement.completed. You don\'t need to poll our API.',
      },
      {
        id: 'ea-f5',
        q: 'Are there official SDKs available?',
        a: 'Because our stack is heavily optimized for modern web development, we provide official wrappers and SDKs for Node.js and React.',
      },
    ],
    rare: [
      {
        id: 'ea-r1',
        q: 'How do I verify the authenticity of a Nexgn webhook?',
        a: 'All webhook payloads are signed using HMAC SHA-256 signatures. You can verify this signature on your backend to ensure the payload legitimately originated from Nexgn.',
      },
      {
        id: 'ea-r2',
        q: 'What happens if I exceed my API rate limit?',
        a: 'To ensure platform stability, API requests on the Business tier are rate-limited. If you exceed this limit, our API will return a 429 Too Many Requests status code. You can contact support to scale to an Enterprise tier with custom limits.',
      },
      {
        id: 'ea-r3',
        q: 'Do you have a public Postman workspace?',
        a: 'Yes. Developers can fork our public Postman collection to test our endpoints instantly before writing any code.',
      },
    ],
  },
  {
    id: 'sustainability-esg',
    number: '06',
    title: 'Sustainability & Environmental Impact (ESG)',
    focus: 'Focus: Carbon reduction, the Impact Tracker, and green infrastructure.',
    frequent: [
      {
        id: 'esg-f1',
        q: 'What is the Nexgn Sustainability Pledge?',
        a: 'Our pledge is a commitment to reducing planetary waste through digital transformation. We actively measure avoided emissions, optimize our code for lower server footprints, and align with global ESG frameworks.',
      },
      {
        id: 'esg-f2',
        q: 'How does the Live Impact Tracker work?',
        a: 'The tracker dynamically calculates environmental savings in real-time based on the total number of pages processed through Nexgn (e.g., Pages Not Printed = Total Documents × Average Pages).',
      },
      {
        id: 'esg-f3',
        q: 'Does Nexgn optimize its own carbon footprint?',
        a: 'Yes. We build Nexgn using highly optimized React and Node.js architectures to ensure low latency and reduced server load, minimizing the carbon emissions from our data centers.',
      },
      {
        id: 'esg-f4',
        q: 'How does digital signing save resources?',
        a: 'By moving agreements online, you directly eliminate paper usage, physical printer ink, transit emissions from courier shipping, and physical storage bloat.',
      },
    ],
    rare: [
      {
        id: 'esg-r1',
        q: 'How do you ensure your impact numbers aren\'t "greenwashing"?',
        a: 'We maintain absolute transparency. We openly publish the mathematical methodology behind our Live Impact Tracker (e.g., standard calculations for water and wood saved per ream of paper) so our metrics are verifiable.',
      },
      {
        id: 'esg-r2',
        q: 'Can I view my specific company\'s environmental impact?',
        a: 'Currently, the Live Impact Tracker displays the global network\'s impact. Workspace-specific ESG reporting is planned for future Enterprise analytics updates.',
      },
    ],
  },
  {
    id: 'ai-intelligence',
    number: '07',
    title: 'Nexgn AI Intelligence',
    focus: 'Focus: AI summaries, data privacy, and zero-training policies.',
    frequent: [
      {
        id: 'ai-f1',
        q: 'What is the AI Agreement Summary?',
        a: 'Our AI acts as an intelligent assistant that can distill dense, 50-page legal documents into a clean, 5-point summary covering key terms like payment schedules, terminations, and effective dates.',
      },
      {
        id: 'ai-f2',
        q: 'Will my confidential contracts be used to train AI models?',
        a: 'No. Never. Nexgn enforces a strict Zero Training policy. We use enterprise-grade APIs with zero-retention policies. Your documents, signatures, and templates are never used to train our own or any third-party foundational AI models.',
      },
      {
        id: 'ai-f3',
        q: 'What is the AI Template Builder?',
        a: 'Currently in Beta, this feature allows you to describe an agreement in plain text (e.g., "I need an NDA for a California software developer"), and our AI will generate a draft for you to review and edit.',
      },
      {
        id: 'ai-f4',
        q: 'Can I disable AI features for my company?',
        a: 'Yes. AI processing is strictly opt-in. Workspace Admins can globally disable all AI features for their entire organization with a single toggle in the settings.',
      },
    ],
    rare: [
      {
        id: 'ai-r1',
        q: 'Does Nexgn retain the data sent to the AI?',
        a: 'No. We utilize Ephemeral Processing. Document text is processed securely to generate the summary or draft, and the resulting data is discarded immediately after the output is generated.',
      },
      {
        id: 'ai-r2',
        q: 'Can the AI replace my lawyer?',
        a: 'No. Nexgn AI is a productivity assistant, not legal counsel. We strongly advise that all AI-generated drafts or summaries be reviewed by qualified legal counsel prior to execution.',
      },
      {
        id: 'ai-r3',
        q: 'Who are the sub-processors for Nexgn\'s AI features?',
        a: 'If a Workspace Admin explicitly opts in, data is securely routed through OpenAI or Anthropic enterprise APIs (which are legally bound to zero-retention rules).',
      },
    ],
  },
  {
    id: 'cloud-storage-byos',
    number: '08',
    title: 'Cloud Storage & Workspaces (BYOS)',
    focus: 'Focus: Google Drive integration and decentralized data.',
    frequent: [
      {
        id: 'byos-f1',
        q: 'What is "Bring Your Own Storage" (BYOS)?',
        a: 'Unlike legacy competitors that lock your files in their proprietary servers, Nexgn’s architecture allows you to connect your own secure cloud storage (like Google Drive) to act as the permanent home for your contracts.',
      },
      {
        id: 'byos-f2',
        q: 'Does Nexgn keep a copy of my documents forever?',
        a: 'No. Once an envelope is completed and successfully synced to your connected Google Workspace, we do not indefinitely store your proprietary PDFs. You act as the Data Controller.',
      },
      {
        id: 'byos-f3',
        q: 'How do I connect my Google Drive to Nexgn?',
        a: 'Navigate to the integrations panel in your dashboard and authenticate your Google account. Nexgn will automatically route completed PDFs and their corresponding Audit Certificates to a designated folder in your Drive.',
      },
      {
        id: 'byos-f4',
        q: 'Can my team access the synced documents?',
        a: 'Yes, once the document lands in your company\'s Google Drive, it falls under your standard internal Google Workspace permissions and sharing rules.',
      },
    ],
    rare: [
      {
        id: 'byos-r1',
        q: 'What happens if my Google Drive connection fails or disconnects?',
        a: 'If the sync fails, Nexgn temporarily holds the encrypted document in a secure queue and will alert the Workspace Admin to re-authenticate the connection so the routing can complete.',
      },
      {
        id: 'byos-r2',
        q: 'If I delete an envelope in Nexgn, does it delete from Google Drive?',
        a: 'No. Nexgn only routes files to your Drive. Once it is there, Nexgn cannot delete or alter files within your external storage environment.',
      },
    ],
  },
];

const HelpCenter = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`helpCenter.${key}`, fallback);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(HELP_CATEGORIES[0].id);
  const [openCategories, setOpenCategories] = useState(() => ({
    [HELP_CATEGORIES[0].id]: true,
  }));
  const [openQuestions, setOpenQuestions] = useState(() => ({
    [HELP_CATEGORIES[0].frequent[0].id]: true,
  }));

  const rootRef = useRef(null);
  const sectionRefs = useRef({});
  const navListRef = useRef(null);
  const isClickScrolling = useRef(false);
  const clickTimer = useRef(null);

  // Filter categories & questions based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return HELP_CATEGORIES;

    return HELP_CATEGORIES.map((cat) => {
      const catMatches =
        cat.title.toLowerCase().includes(q) || cat.focus.toLowerCase().includes(q);

      const frequent = cat.frequent.filter(
        (item) =>
          catMatches ||
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
      );
      const rare = cat.rare.filter(
        (item) =>
          catMatches ||
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
      );

      if (frequent.length === 0 && rare.length === 0) return null;
      return { ...cat, frequent, rare };
    }).filter(Boolean);
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  // Scroll-spy for active category in sidebar
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.05 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filteredCategories]);

  // Deep link hash support (/help#enterprise-api)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && HELP_CATEGORIES.some((c) => c.id === hash)) {
      setActiveCategory(hash);
      setOpenCategories((prev) => ({ ...prev, [hash]: true }));
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView();
      });
    }
  }, []);

  // Mobile chip row: keep the active chip centred (the sliding indicator itself is GSAP, see the hook)
  useLayoutEffect(() => {
    const list = navListRef.current;
    const item = list?.querySelector(`[data-cat="${activeCategory}"]`);
    if (!list || !item || getComputedStyle(list).flexDirection !== 'row') return;
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [activeCategory]);

  // Every animation on this page (hero, reveals, focus-fade, indicator, accordions, hovers)
  const catKey = filteredCategories.map((c) => c.id).join('|') || 'empty';
  useHelpCenterAnimations(rootRef, { activeCategory, isSearching, catKey });

  const activeIndex = Math.max(0, HELP_CATEGORIES.findIndex((c) => c.id === activeCategory));
  const pad = (n) => String(n).padStart(2, '0');

  useEffect(() => () => clearTimeout(clickTimer.current), []);

    const handleCategoryNavClick = (id) => {
    isClickScrolling.current = true;
    setActiveCategory(id);
    setOpenCategories({ [id]: true });
    window.history.replaceState(null, '', `#${id}`);

    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset =
          parseFloat(getComputedStyle(element).getPropertyValue('scroll-margin-top')) || 120;
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: y,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }
    });

    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
  };

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      [id]: !prev[id],
    }));
    setActiveCategory(id);
  };

  const toggleQuestion = (qId) => {
    setOpenQuestions((prev) => ({
      [qId]: !prev[qId],
    }));
  };;

  const seoTitle = tr('seo.title', 'Nexgn Help Center | Support, Documentation & FAQs');
  const seoDescription = tr(
    'seo.description',
    'Search the Nexgn Help Center for answers on document preparation, frictionless e-signatures, ESIGN/eIDAS/IT Act compliance, API webhooks, AI summaries, and BYOS cloud storage.'
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HELP_CATEGORIES.flatMap((cat) =>
      [...cat.frequent, ...cat.rare].map((item) => ({
        '@type': 'Question',
        name: tr(`questions.${item.id}.q`, item.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: tr(`questions.${item.id}.a`, item.a),
        },
      }))
    ),
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/help" schema={faqSchema} />

      {/* ---------- 1. HERO ---------- */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle} data-h="rise">
              {tr('hero.title', 'Nexgn Help Center')}
            </h1>

            <div className={styles.searchWrapper} data-h="rise search">
              <FiSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr('hero.searchPlaceholder', 'Search the Help Center...')}
                aria-label={tr('hero.searchPlaceholder', 'Search the Help Center...')}
                className={styles.searchInput}
              />
              {isSearching && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={styles.clearBtn}
                  data-hv="clear"
                  aria-label="Clear search"
                >
                  <FiX aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 2. MAIN CONTENT ---------- */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Left Sidebar: Categories + Support CTA Card */}
            <aside className={styles.sidebar}>
              <div className={styles.stickySidebar}>
                <div className={styles.navBlock}>
                  <div className={styles.navTop}>
                    <p className={styles.navHeader}>{tr('nav.header', 'CATEGORIES')}</p>
                    <p className={styles.counter} data-h="counter" aria-hidden="true">
                      {pad(activeIndex + 1)} / {pad(HELP_CATEGORIES.length)}
                    </p>
                  </div>

                  <nav
                    className={styles.navList}
                    ref={navListRef}
                    aria-label={tr('nav.header', 'Categories')}
                  >
                    <span className={styles.indicator} data-h="indicator" aria-hidden="true" />
                    {HELP_CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          data-h="navitem"
                          data-hv="navitem"
                          data-cat={cat.id}
                          type="button"
                          onClick={() => handleCategoryNavClick(cat.id)}
                          className={`${styles.navItem} ${isActive ? styles.activeNav : ''}`}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          <span className={styles.navNumber}>{cat.number}</span>
                          <span className={styles.navLabelText}>
                            {tr(`categories.${cat.id}.title`, cat.title)}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Still Need Help? Desktop Sidebar Card */}
                <div className={`${styles.supportCard} ${styles.desktopSupportCard}`}>
                  <h2 className={styles.supportTitle}>
                    {tr('support.title', 'Still Need Help?')}
                  </h2>
                  <p className={styles.supportText}>
                    {tr(
                      'support.description',
                      "Can't find the answer you're looking for? Reach out to our support and engineering team, and we'll get back to you as soon as possible."
                    )}
                  </p>
                  <Link to="/contact" className={styles.supportBtn} data-hv="lift">
                    <span>{tr('support.button', 'Contact Support')}</span>
                    <HiOutlineSparkles className={styles.supportBtnIcon} aria-hidden="true" />
                  </Link>
                  <a href="mailto:support@nexgn.cloud" className={styles.supportEmail} data-hv="link">
                    support@nexgn.cloud
                  </a>
                </div>
              </div>
            </aside>

            {/* Right Main Column: Category Accordions */}
            <main className={styles.mainContent}>
              {filteredCategories.length === 0 ? (
                <div className={styles.emptyState} data-h="article">
                  <h2 className={styles.emptyTitle}>
                    {tr('search.noResultsTitle', 'No matching articles found')}
                  </h2>
                  <p className={styles.emptyDesc}>
                    {tr(
                      'search.noResultsDesc',
                      `We couldn't find any questions matching "${searchQuery}". Try another keyword or contact our support team.`
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={styles.resetSearchBtn}
                    data-hv="dark"
                  >
                    {tr('search.reset', 'Clear Search')}
                  </button>
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const isCatOpen = isSearching || !!openCategories[cat.id];

                  return (
                    <article
                      key={cat.id}
                      id={cat.id}
                      ref={(el) => {
                        sectionRefs.current[cat.id] = el;
                      }}
                      className={styles.categoryArticle}
                      data-h="article"
                    >
                      <div className={styles.categoryBlock} data-h="block" data-cat={cat.id}>
                          {/* Category Header Row */}
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={styles.categoryHeaderBtn}
                            data-hv="catbtn"
                            aria-expanded={isCatOpen}
                          >
                            <span className={styles.categoryNum}>{cat.number}</span>
                            <div className={styles.categoryHeadingGroup}>
                              <h2 className={styles.categoryTitle}>
                                {tr(`categories.${cat.id}.title`, cat.title)}
                              </h2>
                              <p className={styles.categoryFocus}>
                                {tr(`categories.${cat.id}.focus`, cat.focus)}
                              </p>
                            </div>
                            <span
                              className={styles.chevronBadge}
                              data-h="chev"
                              data-open={isCatOpen}
                              aria-hidden="true"
                            >
                              <FiChevronDown />
                            </span>
                          </button>

                          {/* Expandable Category Body */}
                          <div
                            className={styles.categoryBodyWrapper}
                            data-h="collapse"
                            data-open={isCatOpen}
                          >
                            <div className={styles.categoryBodyInner}>
                              {/* Subgroup 1: TOP FREQUENT QUESTIONS */}
                              {cat.frequent.length > 0 && (
                                <div className={styles.questionGroup}>
                                  <p className={styles.groupEyebrow}>
                                    {tr('groups.frequent', 'TOP FREQUENT QUESTIONS')}
                                  </p>
                                  <div className={styles.questionList}>
                                    {cat.frequent.map((item, qIdx) => {
                                      const isQOpen =
                                        (isSearching && qIdx === 0) || !!openQuestions[item.id];
                                      return (
                                        <div
                                          key={item.id}
                                          className={`${styles.questionItem} ${
                                            isQOpen ? styles.questionItemOpen : ''
                                          }`}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => toggleQuestion(item.id)}
                                            className={styles.questionBtn}
                                            data-hv="qbtn"
                                            aria-expanded={isQOpen}
                                          >
                                            <span
                                              className={styles.qToggleIcon}
                                              data-h="qicon"
                                              aria-hidden="true"
                                            >
                                              {isQOpen ? <FiMinus /> : <FiPlus />}
                                            </span>
                                            <span className={styles.questionText}>
                                              {tr(`questions.${item.id}.q`, item.q)}
                                            </span>
                                          </button>

                                          <div
                                            className={styles.answerWrapper}
                                            data-h="collapse"
                                            data-open={isQOpen}
                                          >
                                            <div className={styles.answerInner}>
                                              <p className={styles.answerText}>
                                                {tr(`questions.${item.id}.a`, item.a)}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Subgroup 2: RARE BUT IMPORTANT QUESTIONS */}
                              {cat.rare.length > 0 && (
                                <div className={styles.questionGroup}>
                                  <p className={styles.groupEyebrow}>
                                    {tr('groups.rare', 'RARE BUT IMPORTANT QUESTIONS')}
                                  </p>
                                  <div className={styles.questionList}>
                                    {cat.rare.map((item, qIdx) => {
                                      const isQOpen =
                                        (isSearching &&
                                          cat.frequent.length === 0 &&
                                          qIdx === 0) ||
                                        !!openQuestions[item.id];
                                      return (
                                        <div
                                          key={item.id}
                                          className={`${styles.questionItem} ${
                                            isQOpen ? styles.questionItemOpen : ''
                                          }`}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => toggleQuestion(item.id)}
                                            className={styles.questionBtn}
                                            data-hv="qbtn"
                                            aria-expanded={isQOpen}
                                          >
                                            <span
                                              className={styles.qToggleIcon}
                                              data-h="qicon"
                                              aria-hidden="true"
                                            >
                                              {isQOpen ? <FiMinus /> : <FiPlus />}
                                            </span>
                                            <span className={styles.questionText}>
                                              {tr(`questions.${item.id}.q`, item.q)}
                                            </span>
                                          </button>

                                          <div
                                            className={styles.answerWrapper}
                                            data-h="collapse"
                                            data-open={isQOpen}
                                          >
                                            <div className={styles.answerInner}>
                                              <p className={styles.answerText}>
                                                {tr(`questions.${item.id}.a`, item.a)}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                    </article>
                  );
                })
              )}

              {/* Mobile-only Support Card shown cleanly below categories */}
              <div className={`${styles.supportCard} ${styles.mobileSupportCard}`} data-h="article">
                <h2 className={styles.supportTitle}>
                  {tr('support.title', 'Still Need Help?')}
                </h2>
                <p className={styles.supportText}>
                  {tr(
                    'support.description',
                    "Can't find the answer you're looking for? Reach out to our support and engineering team, and we'll get back to you as soon as possible."
                  )}
                </p>
                <Link to="/contact" className={styles.supportBtn} data-hv="lift">
                  <span>{tr('support.button', 'Contact Support')}</span>
                  <HiOutlineSparkles className={styles.supportBtnIcon} aria-hidden="true" />
                </Link>
                <a href="mailto:support@nexgn.cloud" className={styles.supportEmail} data-hv="link">
                  support@nexgn.cloud
                </a>
              </div>
            </main>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HelpCenter;