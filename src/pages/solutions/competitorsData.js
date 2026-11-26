/**
 * Transparent 24-Competitor Comparison Dataset for Nexgn.
 *
 * Editorial principles (E-E-A-T & GEO):
 *  1. Expose hidden commercial/technical friction competitors rarely highlight on pricing cards.
 *  2. Give honest credit where a competitor genuinely wins (never claim fake superiority).
 *  3. Document Nexgn's own real trade-offs & sustainability methodology openly.
 *  4. Keep pricing/limits phrased carefully ("typical published tiers / verify current terms")
 *     to stay accurate and defensible over time.
 */

export const COMPETITOR_CATEGORIES = [
  { key: 'all', label: 'All 24 Platforms' },
  { key: 'enterprise', label: 'Enterprise & Legacy' },
  { key: 'smb', label: 'SMB & Sales' },
  { key: 'api', label: 'Developer & API-First' },
  { key: 'opensource', label: 'Open Source' },
  { key: 'payg', label: 'Pay-As-You-Go & PDF' },
];

export const NEXGN_BASELINE = {
  name: 'Nexgn',
  pricingTransparency: '100% public: Free ($0/₹0), Starter ($9/₹900), Business ($19/₹1,900)',
  envelopeModel: '19/mo (Free), 49/mo (Starter), Unlimited Envelopes (Business)',
  overageFees: '$0 — Never blocks a live deal or charges per-envelope surprise fees',
  signerFriction: 'Zero — No account, login, or app install required to sign',
  apiAccess: 'REST JSON API, Node/React SDKs & HMAC-SHA256 Webhooks on Business + Free Sandbox',
  storageOwnership: 'Bring Your Own Storage (BYOS) — Auto-syncs to your own Google Drive',
  aiPrivacy: 'Opt-in Nexgn AI (Summary, Builder, Clause Review) with Zero Data Retention / Zero Training',
  securityStack: 'AES-256-GCM at rest, TLS 1.3 in transit, SHA-256 tamper-evident sealing, TOTP 2FA, IPv4/IPv6 UTC audit trail',
  sustainabilityPractice: 'Lean React 19 + Rsbuild WebP bundles, zero-polling webhooks, zero-duplication BYOS storage, GHG Protocol alignment',
};

export const NEXGN_HONEST_TRADEOFFS = [
  {
    title: 'Signature Tier Scope (SES / AES vs QES & Aadhaar eSign)',
    detail:
      'Nexgn delivers court-admissible Standard & Advanced Electronic Signatures (ESIGN, UETA, eIDAS Article 25, India IT Act 2000). If a regulated filing legally mandates an EU Qualified Trust Service Provider (QTSP) certificate or Indian Aadhaar eSign / USB DSC hardware token, use a certified TSP/CA alongside Nexgn.',
  },
  {
    title: 'Cloud SaaS vs Self-Hosted Open Source',
    detail:
      'Unlike Apache/AGPL open-source tools (Documenso, OpenSign, DocuSeal), Nexgn is managed cloud SaaS—you cannot self-host our control plane on private air-gapped servers. However, our Google Drive BYOS architecture ensures your completed agreements stay in your own storage rather than trapped in our vault.',
  },
  {
    title: 'Focused Integrations vs 400+ Legacy Connectors',
    detail:
      'Legacy suites like DocuSign and Adobe Sign maintain huge pre-built connector catalogs for legacy ERPs (SAP, Workday, Salesforce CPQ). Nexgn focuses on speed, clean REST APIs, HMAC webhooks, and Google Drive BYOS rather than bloated middleware.',
  },
];

export const SUSTAINABILITY_PILLARS = [
  {
    metric: 'Zero Storage Duplication (BYOS)',
    legacyProblem:
      'Most SaaS e-sign vendors replicate and store permanent copies of every multi-MB PDF across their own cloud buckets AND force teams to download another copy to Google Drive/SharePoint.',
    nexgnApproach:
      'Nexgn routes agreements straight to your connected Google Drive and minimizes redundant long-term cloud duplication—cutting unnecessary data-center storage overhead.',
  },
  {
    metric: 'Lightweight Client Bundle (Green Web Engineering)',
    legacyProblem:
      'Heavy Acrobat web viewers, multi-MB legacy SPAs, and bloated tracking scripts spike CPU/GPU usage on signers’ laptops and mobile batteries.',
    nexgnApproach:
      'Built on React 19 + Rsbuild code splitting, WebP media compression, and minimal runtime JS so signing screens load rapidly with minimal client device energy.',
  },
  {
    metric: 'Event-Driven Webhooks vs Polling Loops',
    legacyProblem:
      'Legacy integrations frequently poll status endpoints every 30–60 seconds across thousands of active envelopes, burning constant server CPU and network bandwidth.',
    nexgnApproach:
      'Nexgn pushes instant HMAC-SHA256 webhook events only when state changes (Viewed, Signed, Completed)—eliminating wasteful idle polling traffic.',
  },
  {
    metric: 'Honest Impact Accounting (No Greenwashing)',
    legacyProblem:
      'Many software vendors slap arbitrary “trees planted” badges or inflated CO₂ multipliers without publishing underlying assumptions.',
    nexgnApproach:
      'Nexgn discloses estimated avoided paper sheets, transit, and admin hours transparently and aligns operational engineering with GHG Protocol principles as we scale.',
  },
];

export const COMPETITORS = [
  {
    slug: 'docusign',
    name: 'DocuSign',
    category: 'enterprise',
    tagline: 'Legacy market pioneer built around strict envelope quotas & annual enterprise floors.',
    startingPrice: '~$10–$45+/user/mo (annual) · API from ~$2,500+/yr',
    envelopeCap: '5/mo (Personal) · 100 envelopes/user/yr (Standard & Business Pro)',
    overageTrap: 'Hard 100/user/yr cap triggers steep overage charges or forced enterprise tier upgrades mid-year.',
    apiBarrier: 'Production API requires formal go-live review & annual minimum commitments; embedded features gated to higher tiers.',
    hiddenTraps: [
      'Annual contract lock-in on business tiers with auto-renewal windows.',
      'SMS authentication, bulk send, and payment collection pushed to expensive Pro/Enterprise plans.',
      'Signers are subtly nudged to create DocuSign accounts after completing documents.',
    ],
    whereCompetitorWins: '20+ year enterprise ecosystem, FedRAMP/HIPAA/QTSP options, and deep pre-built Salesforce/Workday/SAP connectors.',
    bestForCompetitor: 'Large Fortune 500 enterprises requiring FedRAMP, QES via TSP partners, or deep legacy ERP connectors.',
    sustainabilityNote: 'Publishes strong corporate ESG targets, but carries heavyweight legacy web UI and frequent polling-heavy enterprise integrations.',
    techStack: 'Legacy SPA + REST/SOAP v2.1 API',
    estimatedMonthlyFor10Team: 400, // 10 seats * ~$40 Business Pro
    faqs: [
      {
        q: 'Why do teams leave DocuSign for Nexgn?',
        a: 'Teams switch to escape DocuSign’s 100-envelope/user/year cap, steep API annual minimums, and per-seat cost escalation across HR, Legal, and Sales.',
      },
      {
        q: 'Are Nexgn signatures as legally binding as DocuSign?',
        a: 'Yes. Both Nexgn and DocuSign comply with US ESIGN/UETA, EU eIDAS (SES), and India’s IT Act 2000, using SHA-256 tamper-evident sealing and UTC/IP audit trails.',
      },
    ],
  },
  {
    slug: 'adobe-sign',
    name: 'Adobe Acrobat Sign',
    category: 'enterprise',
    tagline: 'Enterprise e-signature tied tightly to Acrobat PDF and Microsoft 365 licensing.',
    startingPrice: '~$13–$24+/user/mo (Teams) · API gated to Enterprise Sales',
    envelopeCap: 'Transaction allotments negotiated per annual enterprise contract',
    overageTrap: 'Annual transaction pool caps on enterprise deals can require mid-term block add-on purchases.',
    apiBarrier: 'Standalone API pricing is opaque ("Contact Sales") and locked behind custom enterprise agreements.',
    hiddenTraps: [
      'Heavy Acrobat Web runtime slows mobile rendering and increases page payload.',
      'Advanced routing, custom branding, and API webhooks gated behind higher enterprise contracts.',
      'Complex admin provisioning across Adobe Admin Console and Microsoft integrations.',
    ],
    whereCompetitorWins: 'Unmatched native integration if your company already runs Adobe Creative Cloud / Acrobat Pro and Microsoft 365 Enterprise.',
    bestForCompetitor: 'Organizations heavily standardized on Microsoft 365 and Adobe Acrobat desktop PDF workflows.',
    sustainabilityNote: 'Adobe runs corporate renewable energy goals, yet Acrobat Web signing views ship noticeably heavier client payloads than lightweight React SPAs.',
    techStack: 'Heavy Acrobat Web & Enterprise REST API',
    estimatedMonthlyFor10Team: 240,
    faqs: [
      {
        q: 'How does Nexgn compare to Adobe Acrobat Sign on mobile?',
        a: 'Nexgn renders directly in lightweight mobile browsers with no Acrobat dependencies or login prompts, cutting mobile signing friction.',
      },
    ],
  },
  {
    slug: 'dropbox-sign',
    name: 'Dropbox Sign',
    category: 'smb',
    tagline: 'Formerly HelloSign; clean UX but expensive API tiers & white-label paywalls.',
    startingPrice: '~$15–$25+/user/mo · API from ~$99–$200+/mo',
    envelopeCap: 'Free capped at 3/mo; higher team plans have fair-use limits (typically ~150–500/user/mo)',
    overageTrap: 'White-labeling, custom branding on emails/embeds, and multi-team controls sit behind costly Premium/API tiers.',
    apiBarrier: 'Embedded white-label signing API plans scale rapidly into $120–$200+/mo brackets at modest volumes.',
    hiddenTraps: [
      'Slow feature velocity since Dropbox acquisition; lacks native AI agreement summarization or clause review.',
      'Requires Dropbox ecosystem buy-in for bundled storage perks.',
      'Granular workspace RBAC and audit exports gated to higher plans.',
    ],
    whereCompetitorWins: 'Polished, minimal signing UX and effortless Dropbox cloud folder syncing.',
    bestForCompetitor: 'Teams already paying for Dropbox Business who want basic signing without AI or complex CLM.',
    sustainabilityNote: 'Clean minimalist UI, though storage remains tied to Dropbox proprietary cloud rather than multi-tool BYOS.',
    techStack: 'Legacy React SPA + Metered REST API',
    estimatedMonthlyFor10Team: 250,
    faqs: [
      {
        q: 'Does Nexgn include white-label & embedded features without Dropbox Sign’s API markups?',
        a: 'Yes. Nexgn Business ($19/mo flat for 15 seats) includes REST API, HMAC webhooks, and custom workspace branding without separate high-tier API surcharges.',
      },
    ],
  },
  {
    slug: 'pandadoc',
    name: 'PandaDoc',
    category: 'smb',
    tagline: 'Sales-focused CPQ & proposal builder whose per-seat pricing punishes company-wide rollout.',
    startingPrice: '~$19–$49+/user/mo · Separate paid API add-on',
    envelopeCap: 'Free eSign capped at 60 docs/yr; Starter/Business charge steeply per active seat',
    overageTrap: 'Every additional HR, Finance, or Ops teammate costs another full per-user license ($19–$49/mo each).',
    apiBarrier: 'Developer API is NOT included in base plans—requires an active subscription PLUS a separate paid API add-on.',
    hiddenTraps: [
      'Built for sales proposals/CPQ, creating steep UI bloat if you only need clean contract signing.',
      'Bulk send, Salesforce CRM sync, and custom branding locked on Business ($49/user/mo+) tiers.',
      '10-person team on Business easily exceeds $490+/month.',
    ],
    whereCompetitorWins: 'Superior interactive sales proposal builder, CPQ pricing tables, and built-in Stripe/PayPal payment collection inside proposals.',
    bestForCompetitor: 'Revenue/sales teams creating interactive multi-media proposals with dynamic pricing tables and checkout.',
    sustainabilityNote: 'Rich interactive HTML proposal builders load heavier media scripts compared to focused agreement execution.',
    techStack: 'Heavy CPQ Proposal Web App + Gated API',
    estimatedMonthlyFor10Team: 490,
    faqs: [
      {
        q: 'Why is Nexgn cheaper than PandaDoc for whole-company deployment?',
        a: 'PandaDoc charges per seat ($19–$49+/user/mo), costing $490/mo for 10 users. Nexgn Business covers 15 seats and unlimited envelopes for $19/mo total.',
      },
    ],
  },
  {
    slug: 'signnow',
    name: 'signNow (airSlate)',
    category: 'smb',
    tagline: 'Low headline price that hides 100-invite annual limits and ~$1.50/invite overages.',
    startingPrice: '~$8–$30+/user/mo · Separate API plans ~$146+/mo',
    envelopeCap: 'Standard Business tiers cap annual invites (typically 100 invites/user/year)',
    overageTrap: 'Exceeding the annual invite cap triggers ~$1.50 per extra signature invite—or pushes teams into airSlate bundles.',
    apiBarrier: 'API access is sold separately from web-app seats, often starting around $146/mo+.',
    hiddenTraps: [
      'Frequent upsells into the wider airSlate workflow suite.',
      'Signer attachments, payment fields, and bulk sending locked behind higher tiers.',
      'Interface feels dated compared to modern single-flow web apps.',
    ],
    whereCompetitorWins: 'Very low entry-level seat price for small teams sending fewer than 100 invites/year who also want airSlate PDF tools.',
    bestForCompetitor: 'Low-volume teams already using airSlate PDF editing tools.',
    sustainabilityNote: 'Standard cloud storage model without zero-duplication Google Drive BYOS.',
    techStack: 'Traditional Web Portal + Separate API Pool',
    estimatedMonthlyFor10Team: 150,
    faqs: [
      {
        q: 'What is signNow’s hidden catch compared to Nexgn?',
        a: 'signNow’s low $8–$15 headline price typically caps annual invites at 100/year and charges ~$1.50 per invite overage, while API access is billed separately.',
      },
    ],
  },
  {
    slug: 'zoho-sign',
    name: 'Zoho Sign',
    category: 'smb',
    tagline: 'Strong Zoho-ecosystem tool, but Standard plans cap envelopes at 25/mo and consume API credits.',
    startingPrice: '~$10–$16+/user/mo · Enterprise per seat + API credits',
    envelopeCap: 'Free 5/mo · Standard capped at 25 envelopes/user/mo',
    overageTrap: 'Automated workflows, bulk send, and SMS verification require Professional/Enterprise per-user upgrades + paid Zoho Sign credits.',
    apiBarrier: 'API requests consume Zoho Sign credits and tie closely to Zoho Developer Console / Zoho accounts.',
    hiddenTraps: [
      'Per-seat cost multiplies quickly for teams needing 10–15 senders with Enterprise automation.',
      'AI summarization & clause intelligence are not native standalone strengths.',
      'External BYOS outside Zoho WorkDrive / ecosystem feels secondary.',
    ],
    whereCompetitorWins: 'Seamless native integration with Zoho CRM, Zoho Recruit, Zoho Books, and Zoho One suites—plus strong Indian market presence & Aadhaar eSign support.',
    bestForCompetitor: 'Companies running their entire back office on Zoho One or requiring native Aadhaar eSign.',
    sustainabilityNote: 'Zoho invests in solar-powered data centers in India, though multi-app ecosystem footprints add complexity for standalone teams.',
    techStack: 'Zoho Suite Web App + Credit-Based API',
    estimatedMonthlyFor10Team: 160,
    faqs: [
      {
        q: 'When should I pick Zoho Sign vs Nexgn?',
        a: 'Choose Zoho Sign if you run Zoho One or specifically need Aadhaar eSign; choose Nexgn if you want Google Drive BYOS, AI summaries, and 15 seats + unlimited envelopes at a flat $19/mo.',
      },
    ],
  },
  {
    slug: 'boldsign',
    name: 'BoldSign',
    category: 'api',
    tagline: 'Transparent modern challenger with solid APIs, though per-user seat fees still add up for teams.',
    startingPrice: '~$5–$15/user/mo · API plans from ~$30–$99+/mo',
    envelopeCap: 'Growth ($5/user) limited; Business ($15/user/mo) includes unlimited sends',
    overageTrap: 'A 15-person Business team pays $15 × 15 = $225/mo on web seats PLUS separate API plan fees if embedding.',
    apiBarrier: 'Clean transparent API pricing, though web app seats and production API subscriptions are billed separately.',
    hiddenTraps: [
      'No built-in AI agreement summarization or AI contract clause assistant.',
      'Lacks native BYOS-first architecture focused on zero cloud storage lock-in.',
      'Team-wide deployment still scales linearly per seat.',
    ],
    whereCompetitorWins: 'Very transparent API pricing, clean Syncfusion PDF engine, SOC 2 / HIPAA compliance, and great developer documentation.',
    bestForCompetitor: 'Developers needing HIPAA BAA or fine-grained metered API embedding.',
    sustainabilityNote: 'Modern cloud architecture without bloat, though stores documents in centralized Syncfusion/BoldSign vaults.',
    techStack: '.NET / Modern Web + Transparent REST API',
    estimatedMonthlyFor10Team: 150,
    faqs: [
      {
        q: 'How does Nexgn compare to BoldSign for a 10–15 person team?',
        a: 'BoldSign Business is $15 per user ($150–$225/mo for 10–15 users) plus API tiers. Nexgn Business covers 15 seats, unlimited envelopes, AI Suite, and API for $19/mo flat.',
      },
    ],
  },
  {
    slug: 'signwell',
    name: 'SignWell',
    category: 'smb',
    tagline: 'Clean lightweight signing tool that charges strictly per sender and caps document volume.',
    startingPrice: '~$8–$24+/sender/mo · API ~$0.75/doc or tiered packs',
    envelopeCap: 'Free 3/mo · Light 5 templates / limited sends; Business charges per sender',
    overageTrap: 'Charging per sender makes adding occasional team coordinators expensive, and API volume scales per document.',
    apiBarrier: 'Pay-as-you-go API (~$0.75/doc after free sandbox) adds up steeply at 500+ monthly documents.',
    hiddenTraps: [
      'No native AI agreement summary or clause assistant.',
      'No native Google Drive BYOS automatic two-way sync architecture.',
      'Limited multi-language UX compared to EN/ES/HI localization.',
    ],
    whereCompetitorWins: 'Dead-simple UI, reliable audit reports, and fair pay-as-you-go API entry for low-volume developers.',
    bestForCompetitor: 'Solo consultants or small shops sending low monthly volumes who want minimal setup.',
    sustainabilityNote: 'Lightweight footprint, though lacks explicit sustainability reporting or BYOS deduplication.',
    techStack: 'Clean Web App + Usage-Metered REST API',
    estimatedMonthlyFor10Team: 240,
    faqs: [
      {
        q: 'Why does Nexgn beat SignWell at scale?',
        a: 'At 500 documents/month or 10+ senders, SignWell’s per-sender and per-doc API fees multiply rapidly, whereas Nexgn Business stays flat at $19/mo.',
      },
    ],
  },
  {
    slug: 'signeasy',
    name: 'SignEasy',
    category: 'smb',
    tagline: 'Mobile-first e-signature app with solid UX, but higher per-user Business Plus pricing.',
    startingPrice: '~$10–$30+/user/mo · API custom/tiered',
    envelopeCap: 'Personal limited; Team/Business Plus plans offer unlimited sends per paid seat',
    overageTrap: 'API access, custom branding, and Salesforce/HubSpot integrations require Business Plus (~$30/user/mo) or separate API plans.',
    apiBarrier: 'API is billed separately from web-app seats with minimum monthly thresholds.',
    hiddenTraps: [
      '10 seats on Business Plus runs ~$300/month.',
      'Workspace RBAC & granular activity auditing gated to higher tiers.',
      'Limited AI contract drafting & clause risk review.',
    ],
    whereCompetitorWins: 'Excellent native iOS & Android mobile apps for field workers signing offline or in-person.',
    bestForCompetitor: 'Field service teams heavily reliant on native iOS/Android offline signing apps.',
    sustainabilityNote: 'Good mobile UX, though uses standard centralized cloud storage.',
    techStack: 'Native Mobile Apps + Web & REST API',
    estimatedMonthlyFor10Team: 300,
    faqs: [
      {
        q: 'Does Nexgn work on mobile without installing an app like SignEasy?',
        a: 'Yes. Nexgn is engineered browser-first so both senders and signers complete documents on any iOS or Android browser with zero downloads.',
      },
    ],
  },
  {
    slug: 'yousign',
    name: 'Yousign',
    category: 'enterprise',
    tagline: 'Leading EU-focused eIDAS provider with QES support, priced per user & monthly envelope cap.',
    startingPrice: '€9–€40+/user/mo · API from €75+/mo',
    envelopeCap: 'One plan (~10 signatures/mo); Plus/Pro scale envelopes per seat',
    overageTrap: 'Lower tiers have strict monthly signature caps (e.g., 10/mo), and Advanced/Qualified signatures incur extra per-verification charges.',
    apiBarrier: 'API is a separate product line starting around €75–€250+/mo depending on QES/AES volume.',
    hiddenTraps: [
      'Euro-denominated per-seat pricing becomes costly for global teams outside the EU.',
      'Non-EU compliance workflows (India IT Act 65B, US ESIGN focus) are secondary.',
      'No native Google Drive BYOS zero-retention design.',
    ],
    whereCompetitorWins: 'Official French/EU Trust Service Provider (TSP) offering native eIDAS Advanced (AES) & Qualified Electronic Signatures (QES) with French/German data residency.',
    bestForCompetitor: 'EU regulated companies legally required to collect eIDAS Qualified Electronic Signatures (QES).',
    sustainabilityNote: 'EU GDPR-strict hosting, though centralized document storage.',
    techStack: 'Modern Web + EU TSP API',
    estimatedMonthlyFor10Team: 250,
    faqs: [
      {
        q: 'When should I choose Yousign over Nexgn?',
        a: 'Choose Yousign if European law explicitly mandates an EU Qualified Electronic Signature (QES) from an accredited QTSP. For standard commercial contracts worldwide, Nexgn is far faster and 90% cheaper.',
      },
    ],
  },
  {
    slug: 'onespan-sign',
    name: 'OneSpan Sign',
    category: 'enterprise',
    tagline: 'Bank-grade compliance powerhouse with heavy enterprise minimums and slow procurement.',
    startingPrice: '~$22+/user/mo (Pro) · Enterprise custom quotes',
    envelopeCap: 'Pro capped (~1,000 transactions/user/yr); Enterprise custom contracts',
    overageTrap: 'Strict annual transaction counts & mandatory enterprise sales cycles for white-labeling and custom workflows.',
    apiBarrier: 'Enterprise-heavy SDKs & annual licensing rather than instant self-serve developer tiers.',
    hiddenTraps: [
      'Overkill UX and setup complexity for startups, agencies, and SMBs.',
      'Lacks instant free tier or transparent self-serve AI contract builder.',
      'Requires enterprise commitment for advanced authentication modules.',
    ],
    whereCompetitorWins: 'Deep banking/insurance heritage, on-premises deployment options, FedRAMP, and hardware PKI / notarization workflows.',
    bestForCompetitor: 'Tier-1 banks, insurers, and government agencies needing on-prem deployment or strict financial regulatory audits.',
    sustainabilityNote: 'Legacy enterprise infrastructure without lightweight open web sustainability metrics.',
    techStack: 'Enterprise Java/Cloud Stack',
    estimatedMonthlyFor10Team: 220,
    faqs: [
      {
        q: 'Is OneSpan Sign overkill for SaaS & SMB teams?',
        a: 'Usually yes. OneSpan is built for tier-1 banking procurement, while Nexgn gives startups and mid-market teams SHA-256 sealing, TOTP 2FA, and REST APIs in minutes for $0–$19/mo.',
      },
    ],
  },
  {
    slug: 'foxit-esign',
    name: 'Foxit eSign',
    category: 'payg',
    tagline: 'PDF-suite companion with annual envelope bundles and separate API licensing.',
    startingPrice: '~$8–$25+/user/mo · API custom/bundled',
    envelopeCap: 'Starter ~150 envelopes/yr; Pro varies by annual package',
    overageTrap: 'Annual envelope pools reset without rollover and API automation sits behind Pro/Enterprise bundles.',
    apiBarrier: 'Separate enterprise/developer agreements required for high-volume embedded signing.',
    hiddenTraps: [
      'Tightly coupled to Foxit PDF Editor cross-sells.',
      'No native LLM Agreement Summary or Clause Assistant.',
      'Less polished modern signing flow compared to React-native platforms.',
    ],
    whereCompetitorWins: 'Convenient all-in-one bundle if your company already buys Foxit PDF Editor licenses.',
    bestForCompetitor: 'Teams standardizing on Foxit PDF Editor who want bundled basic eSignatures.',
    sustainabilityNote: 'Standard PDF-centric SaaS infrastructure.',
    techStack: 'Foxit PDF Cloud Engine',
    estimatedMonthlyFor10Team: 250,
    faqs: [
      {
        q: 'How does Nexgn differ from Foxit eSign?',
        a: 'Nexgn is purpose-built for zero-friction agreement workflows, AI summarization, Google Drive BYOS, and flat unlimited sending on Business ($19/mo).',
      },
    ],
  },
  {
    slug: 'documenso',
    name: 'Documenso',
    category: 'opensource',
    tagline: 'Leading open-source DocuSign alternative; great for self-hosters, but DevOps & per-seat cloud costs apply.',
    startingPrice: 'Self-host free (AGPL/Apache parts) · Cloud ~$30/mo+ (Teams $30/user/mo)',
    envelopeCap: 'Self-hosted unlimited (you manage infra) · Cloud team seats scale per user',
    overageTrap: 'Managed cloud Teams/Enterprise pricing scales per user ($30+/seat), and self-hosting requires maintaining PostgreSQL, S3, SMTP, PDF signing certs, and uptime.',
    apiBarrier: 'API included on cloud plans & self-host, though self-hosted production requires security hardening & cert management.',
    hiddenTraps: [
      'Self-hosting shifts 100% of uptime, GDPR security patching, backup, and email deliverability (SPF/DKIM/DMARC) onto your engineers.',
      'No built-in AI Agreement Summary or AI Template Builder.',
      'Enterprise support & SAML/RBAC sit on paid commercial plans.',
    ],
    whereCompetitorWins: 'Full code inspectability and sovereign self-hosting inside private VPCs or air-gapped networks.',
    bestForCompetitor: 'Engineering teams with DevOps capacity who strictly require self-hosted open-source code.',
    sustainabilityNote: 'Modern Next.js/TypeScript stack; self-hosting efficiency depends on how green your own VPS/cloud setup is.',
    techStack: 'Open-Source Next.js + Prisma + Postgres',
    estimatedMonthlyFor10Team: 300,
    faqs: [
      {
        q: 'Should I self-host Documenso or use Nexgn?',
        a: 'Self-host Documenso if you must run binaries inside your own private VPC. Choose Nexgn if you want zero DevOps maintenance, Google Drive BYOS ownership, AI summaries, and 15 seats for $19/mo.',
      },
    ],
  },
  {
    slug: 'opensign',
    name: 'OpenSign',
    category: 'opensource',
    tagline: 'Open-source e-signature platform with AGPL licensing and managed cloud tiers.',
    startingPrice: 'Self-host free (AGPL) · Cloud ~$10–$30+/user/mo',
    envelopeCap: 'Self-host unlimited · Cloud free/starter tiers have monthly document limits',
    overageTrap: 'AGPL license restrictions on proprietary embedding unless buying commercial licensing; managed cloud charges per user.',
    apiBarrier: 'Self-hosting requires managing Parse Server, MongoDB, S3, and SSL/signing keys yourself.',
    hiddenTraps: [
      'DevOps maintenance burden (upgrades, scaling PDF workers, email bounce handling) on self-hosted instances.',
      'Younger UI polish & multi-region enterprise documentation compared to dedicated SaaS.',
      'AI contract intelligence is not a core native workflow.',
    ],
    whereCompetitorWins: 'Open-source transparency, self-hosting freedom, and active developer community.',
    bestForCompetitor: 'Startups comfortable managing AGPL open-source stacks on their own cloud servers.',
    sustainabilityNote: 'Self-hosted footprint depends on user provisioning; cloud relies on standard storage buckets.',
    techStack: 'Open-Source React + Parse Server + MongoDB',
    estimatedMonthlyFor10Team: 150,
    faqs: [
      {
        q: 'How does Nexgn compare to OpenSign?',
        a: 'Nexgn gives you managed enterprise security (AES-256, TOTP 2FA, SHA-256), zero DevOps overhead, Nexgn AI, and Google Drive BYOS for $0–$19/mo flat.',
      },
    ],
  },
  {
    slug: 'docuseal',
    name: 'DocuSeal',
    category: 'opensource',
    tagline: 'Developer-friendly open-source PDF form filling & signing tool (Ruby on Rails).',
    startingPrice: 'Self-host free (AGPL) · Cloud ~$20/user/mo · Pro on-prem paid license',
    envelopeCap: 'Self-host unlimited · Cloud free 10 docs/mo',
    overageTrap: 'Commercial Pro features (white-label, custom CSS, multi-user RBAC, webhooks/API extras) require paid Pro license (~$20+/user/mo).',
    apiBarrier: 'Great embeddable web components, though commercial white-label removal requires Pro licensing.',
    hiddenTraps: [
      'Cloud free tier capped at 10 documents/month.',
      'Per-user cloud pricing scales up for 10–15 person organizations.',
      'No built-in AI Contract Summary / Clause Review.',
    ],
    whereCompetitorWins: 'Very clean form-builder UI and easy embedding into Ruby, Rails, and web apps.',
    bestForCompetitor: 'Developers building form-heavy document intake who want Ruby/Rails self-hosting.',
    sustainabilityNote: 'Lightweight Rails architecture when tuned properly.',
    techStack: 'Open-Source Ruby on Rails + PDF Engine',
    estimatedMonthlyFor10Team: 200,
    faqs: [
      {
        q: 'What is the main difference between DocuSeal and Nexgn?',
        a: 'DocuSeal focuses on open-source form-to-PDF embedding with Pro per-user licensing, while Nexgn delivers full SaaS workspace + AI Suite + Google Drive BYOS + 15 seats for $19/mo flat.',
      },
    ],
  },
  {
    slug: 'goodsign',
    name: 'GoodSign',
    category: 'payg',
    tagline: 'Honest pay-per-envelope model (~$1.50/doc) with zero subscriptions, which becomes costly at volume.',
    startingPrice: 'Pay-as-you-go ~$1.50/envelope (no monthly base)',
    envelopeCap: 'No caps—every sent envelope costs ~$1.50',
    overageTrap: 'Great for 5 docs/month ($7.50), but 200 docs/month costs $300/month—15× more than Nexgn Business ($19/mo)!',
    apiBarrier: 'API usage still pays per-document credit fees on every call.',
    hiddenTraps: [
      'No AI Agreement Summary, AI Clause Assistant, or AI Template Builder.',
      'Lacks deep Google Drive two-way BYOS architecture.',
      'Expenses scale linearly with business success—success literally costs more every month.',
    ],
    whereCompetitorWins: 'Truly zero-commitment pricing if you only sign 1–5 documents every few months.',
    bestForCompetitor: 'Occasional senders doing under 6 documents/month who want zero monthly subscriptions.',
    sustainabilityNote: 'Minimalist UI; no explicit green-engineering or BYOS storage minimization.',
    techStack: 'Lightweight Pay-Per-Use SaaS',
    estimatedMonthlyFor10Team: 300, // at 200 docs/mo
    faqs: [
      {
        q: 'When is Nexgn cheaper than GoodSign?',
        a: 'Nexgn Free gives you 19 envelopes/month for $0 (saving $28.50/mo vs GoodSign). Above 13 envelopes/month, Nexgn Starter ($9) or Business ($19 unlimited) saves hundreds monthly.',
      },
    ],
  },
  {
    slug: 'esignatures-io',
    name: 'eSignatures.com (eSignatures.io)',
    category: 'api',
    tagline: 'Pure pay-per-contract API tool ($0.49–$0.99/contract) missing full team workspace & AI.',
    startingPrice: '~$0.49–$0.99 per contract sent',
    envelopeCap: 'Pay-per-send · No free production tier',
    overageTrap: 'No free monthly allowance (Nexgn gives 19 free/mo), and 500 API contracts/mo runs $245–$495/month.',
    apiBarrier: 'Developer-focused mobile HTML templates—lacks drag-and-drop visual PDF editor for non-technical HR/Legal teams.',
    hiddenTraps: [
      'No visual drag-and-drop PDF placement editor for arbitrary PDFs.',
      'No team workspace RBAC, folder organization, or Google Drive BYOS.',
      'No AI contract summary or risk analysis.',
    ],
    whereCompetitorWins: 'Ultra-clean SMS mobile HTML contract execution for high-velocity gig/dispatch API workflows.',
    bestForCompetitor: 'Backend engineers sending mobile-first HTML agreements strictly via API without needing PDF editing.',
    sustainabilityNote: 'Fast HTML-based signing avoids heavy PDF client rendering.',
    techStack: 'API-First HTML Signing Service',
    estimatedMonthlyFor10Team: 200,
    faqs: [
      {
        q: 'How does Nexgn compare to eSignatures.com?',
        a: 'eSignatures.com lacks a visual PDF editor and charges per contract ($0.49–$0.99). Nexgn combines a visual drag-and-drop PDF editor, AI Suite, BYOS, and unlimited Business envelopes at $19/mo.',
      },
    ],
  },
  {
    slug: 'xodo-sign',
    name: 'Xodo Sign (eversign)',
    category: 'smb',
    tagline: 'Reliable SMB signing tool that gates templates, bulk send, and API behind multi-tier plans.',
    startingPrice: '~$10–$40+/mo · Professional/Enterprise per user',
    envelopeCap: 'Free 3/mo · Basic 25/mo · Professional unlimited for 1–5 users',
    overageTrap: 'Expanding beyond 5 team members or adding SMS authentication & custom branding pushes pricing rapidly upward.',
    apiBarrier: 'API credits are capped by plan tier (e.g., 10–100+ API docs/mo) with per-tier credit ceilings.',
    hiddenTraps: [
      'Rebranded from eversign to Xodo Sign as part of PDF software consolidation.',
      'No native AI clause review or AI agreement summary.',
      'BYOS Google Drive zero-duplication workflow is not the core architecture.',
    ],
    whereCompetitorWins: 'Solid PDF toolkit ecosystem (via Apryse / Xodo) and mature EU/US compliance.',
    bestForCompetitor: 'Small teams already subscribed to Xodo PDF productivity bundles.',
    sustainabilityNote: 'Standard SaaS architecture.',
    techStack: 'Cloud Web App + Credit-Capped REST API',
    estimatedMonthlyFor10Team: 250,
    faqs: [
      {
        q: 'Does Nexgn give more on the Free & Business tiers than Xodo Sign?',
        a: 'Yes. Nexgn Free gives 19 envelopes/mo (vs Xodo Sign’s 3/mo), and Business includes 15 team seats + unlimited envelopes + AI Suite for $19/mo.',
      },
    ],
  },
  {
    slug: 'getaccept',
    name: 'GetAccept',
    category: 'smb',
    tagline: 'B2B digital sales room & video proposal platform—expensive and heavy for general signing.',
    startingPrice: '~$25–$49+/user/mo',
    envelopeCap: 'eSign-only tier limited; full Sales Room requires ~$49+/user/mo',
    overageTrap: 'Minimum user counts & steep per-seat licensing make HR, Operations, or Legal deployment prohibitively costly.',
    apiBarrier: 'API & CRM automation reserved for higher tiers.',
    hiddenTraps: [
      'Video tracking and sales engagement scripts bloat the signer experience for simple NDAs/contracts.',
      'A 10-person team easily exceeds $490/mo.',
      'Not built as a lightweight developer REST API or BYOS platform.',
    ],
    whereCompetitorWins: 'Rich B2B sales deal rooms, embedded intro videos, live chat inside proposals, and buyer intent tracking.',
    bestForCompetitor: 'Outbound B2B enterprise sales teams needing video-assisted deal rooms.',
    sustainabilityNote: 'Video streaming & deal-room tracking scripts consume significantly more client bandwidth and energy.',
    techStack: 'Sales Enablement SaaS',
    estimatedMonthlyFor10Team: 490,
    faqs: [
      {
        q: 'Why pick Nexgn instead of GetAccept for everyday contracts?',
        a: 'GetAccept is priced and built as a sales deal room ($25–$49/user/mo). Nexgn handles NDAs, HR onboarding, vendor contracts, and sales agreements cleanly across 15 seats for $19/mo.',
      },
    ],
  },
  {
    slug: 'conga-sign',
    name: 'Conga Sign',
    category: 'enterprise',
    tagline: 'Salesforce-centric enterprise signing locked behind custom quotes and Conga suite dependencies.',
    startingPrice: 'Custom Enterprise Quote Only (~$20–$45+/user/mo est.)',
    envelopeCap: 'Contracted annual Salesforce org volume limits',
    overageTrap: 'Zero public self-serve pricing; impossible to test or buy without multi-week enterprise sales cycles.',
    apiBarrier: 'Deeply coupled to Salesforce Apex/Conga Composer workflows rather than standalone REST apps.',
    hiddenTraps: [
      'Requires Salesforce licensing & Conga administration overhead.',
      'No free tier, no transparent monthly billing, no self-serve sandbox.',
      'Slow implementation timelines (weeks/months vs minutes).',
    ],
    whereCompetitorWins: 'Deep enterprise Salesforce Composer document generation + automated Conga CLM pipelines.',
    bestForCompetitor: 'Large enterprises deeply invested in Salesforce & Conga Composer.',
    sustainabilityNote: 'Heavy enterprise CRM runtime dependency.',
    techStack: 'Salesforce AppExchange / Enterprise Suite',
    estimatedMonthlyFor10Team: 350,
    faqs: [
      {
        q: 'Can non-Salesforce teams use Nexgn faster than Conga Sign?',
        a: 'Yes—Nexgn requires zero Salesforce licensing, includes transparent $0–$19/mo self-serve tiers, and starts in under 2 minutes.',
      },
    ],
  },
  {
    slug: 'ironclad',
    name: 'Ironclad',
    category: 'enterprise',
    tagline: 'Fortune-500 Enterprise CLM requiring six-figure annual contracts and implementation consultants.',
    startingPrice: 'Custom Enterprise Quote Only (typically $25k–$100k+/yr)',
    envelopeCap: 'Custom annual contract volume tiers',
    overageTrap: 'Multi-year enterprise minimums and costly professional onboarding fees; not built for SMBs or agile dev teams.',
    apiBarrier: 'Enterprise GraphQL/REST APIs unlocked only on custom enterprise contracts.',
    hiddenTraps: [
      'Complete lack of public pricing transparency.',
      'Months-long implementation & legal-ops administrator dependency.',
      'Massive feature complexity if your team needs fast drafting, AI summary, and signing.',
    ],
    whereCompetitorWins: 'Deep Fortune-500 legal-ops redlining, playbooks, Salesforce/Workday repository governance, and enterprise procurement workflows.',
    bestForCompetitor: 'Large in-house legal departments with dedicated Legal Ops staff and $50k+ annual CLM budgets.',
    sustainabilityNote: 'Heavy enterprise web application & multi-service indexing.',
    techStack: 'Enterprise Legal CLM Platform',
    estimatedMonthlyFor10Team: 2000,
    faqs: [
      {
        q: 'Who should choose Nexgn instead of Ironclad?',
        a: 'Startups, agencies, SMBs, and fast-moving teams that need AI contract summaries, RBAC, BYOS, and instant signing without a $30k+ annual contract or 3-month onboarding.',
      },
    ],
  },
  {
    slug: 'juro',
    name: 'Juro',
    category: 'enterprise',
    tagline: 'Browser-native legal contract collaboration tool gated behind custom annual team quotes.',
    startingPrice: 'Custom Quote Only (typically ~$6,000–$15,000+/yr)',
    envelopeCap: 'Annual contract volume & seat bundles negotiated via sales',
    overageTrap: 'No self-serve monthly tier or free plan; annual upfront commitment required.',
    apiBarrier: 'API & CRM integrations reserved for Growth/Enterprise annual packages.',
    hiddenTraps: [
      'Opaque pricing hides true Total Cost of Ownership until after sales discovery calls.',
      'Overkill redlining workflow when you already draft docs in Google Docs/Word/PDF.',
      'High entry cost disqualifies freelancers, early startups, and lean teams.',
    ],
    whereCompetitorWins: 'Real-time browser-native contract negotiation, redlining, and conditional HTML contract drafting for legal teams.',
    bestForCompetitor: 'Scale-up legal teams wanting in-browser redlining and approval playbooks with dedicated budget.',
    sustainabilityNote: 'Clean browser-native contract editor.',
    techStack: 'Custom SaaS CLM',
    estimatedMonthlyFor10Team: 600,
    faqs: [
      {
        q: 'How does Nexgn compare to Juro on transparency?',
        a: 'Juro hides pricing behind sales calls and annual contracts. Nexgn publishes transparent $0 / $9 / $19 monthly plans and lets you connect your own Google Drive.',
      },
    ],
  },
  {
    slug: 'nitro-sign',
    name: 'Nitro Sign',
    category: 'payg',
    tagline: 'Desktop-PDF heritage signing tool shifting toward bundled Nitro Productivity plans.',
    startingPrice: '~$10–$25+/user/mo (often bundled with Nitro PDF Pro)',
    envelopeCap: 'Limited signature requests on entry tiers; unlimited tied to enterprise PDF bundles',
    overageTrap: 'True enterprise workflows, SMS auth, and API integration require upgrading entire teams to Nitro Enterprise.',
    apiBarrier: 'Enterprise-gated API without self-serve developer sandbox/REST pricing.',
    hiddenTraps: [
      'Bundled desktop-first PDF licensing adds seat cost for team members who never edit PDFs locally.',
      'No native AI clause assistant or agreement summary for signers.',
      'No BYOS Google Drive zero-duplication workflow.',
    ],
    whereCompetitorWins: 'Strong Windows/Mac desktop PDF editing suite paired with reliable electronic signing and Swiss/EU hosting options.',
    bestForCompetitor: 'Organizations replacing Adobe Acrobat desktop licenses across finance/operations staff.',
    sustainabilityNote: 'Desktop software installers & dual PDF storage carry higher distribution overhead.',
    techStack: 'Desktop PDF Suite + Cloud Portal',
    estimatedMonthlyFor10Team: 200,
    faqs: [
      {
        q: 'Is Nexgn better than Nitro Sign for web & remote teams?',
        a: 'Yes—Nexgn requires zero desktop software installs, works identically across Mac, Windows, Linux, and mobile browsers, and costs $19/mo total for up to 15 seats.',
      },
    ],
  },
  {
    slug: 'box-sign',
    name: 'Box Sign',
    category: 'enterprise',
    tagline: 'Native signing inside Box cloud storage—great if you live in Box, unusable without it.',
    startingPrice: 'Bundled in Box Business+ (~$15–$35+/user/mo · 3-user minimum)',
    envelopeCap: 'Unlimited web sends inside Box Business+; API sends strictly capped (e.g., 10–150/mo) unless buying extra API packs',
    overageTrap: 'Requires paying Box per-seat storage fees for every user (3-seat minimum) AND API signature packs cost extra.',
    apiBarrier: 'Box Sign API calls have strict monthly caps unless purchasing custom Box Platform / API add-ons.',
    hiddenTraps: [
      'Zero value if your team uses Google Workspace / Google Drive instead of Box.',
      '3-seat minimum + per-user Box Enterprise costs escalate fast for 15 users ($225–$525+/mo).',
      'Basic signing UI lacks standalone AI contract review unless buying expensive Box AI Enterprise.',
    ],
    whereCompetitorWins: 'Zero extra vendor cost if your company already runs Box Business Plus or Enterprise Plus for all cloud files.',
    bestForCompetitor: 'Enterprises already standardized on Box for 100% of corporate file storage.',
    sustainabilityNote: 'Good storage locality inside Box—just like Nexgn’s native Google Drive BYOS keeps files in Google Workspace without duplication.',
    techStack: 'Box Content Cloud Integration',
    estimatedMonthlyFor10Team: 250,
    faqs: [
      {
        q: 'What is the Google Workspace equivalent of Box Sign?',
        a: 'Nexgn is purpose-built for Google Workspace / BYOS teams—syncing signed agreements and SHA-256 audit certificates straight to your Google Drive at a flat $0–$19/mo.',
      },
    ],
  },
];

export const COMPETITORS_MAP = Object.fromEntries(
  COMPETITORS.map((c) => [c.slug, c])
);