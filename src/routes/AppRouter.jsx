import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageLoader from '../components/common/PageLoader'; // Nexgn wave loader for lazy-loaded pages

// Global Layout Components
import Navbar from '../components/layout/Navbar'; // one navbar for every page
import Footer from '../components/layout/Footer';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';

// ==========================================
// ASYNC ROUTE SPLITTING (LAZY LOADING)
// ==========================================

// 1. Core Pages
const Home = lazy(() => import('../pages/core/Home'));
const Pricing = lazy(() => import('../pages/core/Pricing'));
const Changelog = lazy(() => import('../pages/core/Changelog'));
const Roadmap = lazy(() => import('../pages/core/Roadmap'));
const Labs = lazy(() => import('../pages/core/Labs'));
const NotFound = lazy(() => import('../pages/core/NotFound'));

// 2. Product Pages
// Each product hub is ONE page with scroll-spy sections (components/products/ProductLayout).
// Several URLs share the same hub, and ProductLayout scrolls to the section named by the URL.
const ProductOverview = lazy(() => import('../pages/products/ProductOverview')); // Core Agreement Products
const IntelligenceOverview = lazy(() => import('../pages/products/IntelligenceOverview')); // Nexgn AI
const TrustOverview = lazy(() => import('../pages/products/TrustOverview')); // Trust & Evidence
const WorkspaceOverview = lazy(() => import('../pages/products/WorkspaceOverview')); // Workspace & Management

// 3. Solutions Pages (Optimized to Single Master Template)
const TeamsOverview = lazy(() => import('../pages/solutions/TeamsOverview'));
const IndustriesOverview = lazy(() => import('../pages/solutions/IndustriesOverview'));
const CompanySizeOverview = lazy(() => import('../pages/solutions/CompanySizeOverview'));
const SolutionTemplate = lazy(() => import('../pages/solutions/SolutionTemplate'));
const AlternativeCompare = lazy(() => import('../pages/solutions/AlternativeCompare'));

// 4. Developers
const DevPortal = lazy(() => import('../pages/developers/DevPortal'));
const ApiRef = lazy(() => import('../pages/developers/ApiRef'));
const Embedded = lazy(() => import('../pages/developers/Embedded'));
const Webhooks = lazy(() => import('../pages/developers/Webhooks'));
const SDKs = lazy(() => import('../pages/developers/SDKs'));
const Sandbox = lazy(() => import('../pages/developers/Sandbox'));
const Community = lazy(() => import('../pages/developers/Community'));

// 5. Trust Center
const TrustCenter = lazy(() => import('../pages/trust/TrustCenter'));
const Security = lazy(() => import('../pages/trust/Security'));
const Legality = lazy(() => import('../pages/trust/Legality'));
const Privacy = lazy(() => import('../pages/trust/Privacy'));
const Subprocessors = lazy(() => import('../pages/trust/Subprocessors'));
const VulnDisclosure = lazy(() => import('../pages/trust/VulnDisclosure'));
const AiEthics = lazy(() => import('../pages/trust/AiEthics'));

// 6. Sustainability
const Sustainability = lazy(() => import('../pages/sustainability/Sustainability'));

// 7. Legal (Footer Pages)
const Terms = lazy(() => import('../pages/legal/Terms'));
const PrivacyPolicy = lazy(() => import('../pages/legal/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('../pages/legal/CookiePolicy'));
const AUP = lazy(() => import('../pages/legal/AUP'));
const DPA = lazy(() => import('../pages/legal/DPA'));
const Refunds = lazy(() => import('../pages/legal/Refunds'));

// 8. Company & Support Pages
const Contact = lazy(() => import('../pages/company/Contact'));
const About = lazy(() => import('../pages/company/About'));
const Careers = lazy(() => import('../pages/company/Careers'));
const Press = lazy(() => import('../pages/company/Press'));
const Partners = lazy(() => import('../pages/company/Partners'));
const Blog = lazy(() => import('../pages/company/Blog'));
const HelpCenter = lazy(() => import('../pages/help/HelpCenter')); // Added Help Center

// ==========================================
// PRODUCT HUB ROUTES
// ==========================================
// Paths are relative to /:lng. Every path in a list renders the SAME lazy component, so moving between
// two of them (e.g. from the Navbar) keeps the page mounted and just scrolls to the right section
// instead of reloading the page. Add old URLs to a list to keep them working.
const PRODUCT_HUBS = [
  {
    Page: ProductOverview,
    paths: [
      '/products',
      '/products/esignature',
      '/products/document-editor',
      '/products/templates',
      '/products/automation',
      '/products/workflows',
      '/products/reminders',
      '/products/scheduler',
    ],
  },
  {
    Page: IntelligenceOverview,
    paths: [
      '/products/ai-summary',
      '/products/ai-builder',
      '/products/ai-clause-assistant', // retired page -> Nexgn AI hub
    ],
  },
  {
    Page: TrustOverview,
    paths: [
      '/products/audit-trail',
      '/products/identity-assurance',
      '/products/agreement-verification', // retired page -> Trust & Evidence hub
    ],
  },
  {
    Page: WorkspaceOverview,
    paths: [
      '/products/workspace',
      '/products/cloud-storage',
      '/products/roles-permissions', // retired page -> Workspace hub
      '/products/activity-logs', // retired page -> Workspace hub
    ],
  },
];

// ==========================================
// CONSTANTS
// ==========================================
// Must match the folders in public/locales
const SUPPORTED_LANGUAGES = ['en', 'es', 'hi'];

// ==========================================
// LANGUAGE ROUTER WRAPPER
// ==========================================
const LanguageWrapper = () => {
  const { lng } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();

  const isSupported = SUPPORTED_LANGUAGES.includes(lng);

  useEffect(() => {
    if (!isSupported) return;

    // Sync React Router URL with i18next state
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
    // Keep <html lang="..."> correct for SEO and screen readers
    document.documentElement.lang = lng;
  }, [lng, isSupported, i18n]);

  // Unsupported or missing language prefix -> English, but keep the page the visitor asked for:
  //   /fr/pricing -> /en/pricing      /legal/cookie-policy -> /en/legal/cookie-policy
  // (the old redirect sent every one of these to the homepage). Unknown paths end up on the 404 page.
  if (!isSupported) {
    const rest = /^[a-z]{2}$/i.test(lng) ? location.pathname.replace(/^\/[^/]+/, '') : location.pathname;
    return <Navigate to={`/en${rest === '/' ? '' : rest}${location.search}${location.hash}`} replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* flex: 1 pushes the Footer to the bottom on short pages */}
      <main style={{ flex: 1 }}>
        {/* key={location.pathname}: React remounts the boundary on every URL change, which clears
            a previous error. Without it the error screen stays up after the user navigates
            elsewhere (the boundary keeps hasError=true) until a manual refresh. */}
        <ErrorBoundary key={location.pathname}>
          {/* PageLoader shows the Nexgn loader after 150ms if a page is still downloading */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Core Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/labs" element={<Labs />} />

              {/* Product Routes: 4 hubs, each serving several section URLs (see PRODUCT_HUBS above) */}
              {PRODUCT_HUBS.flatMap(({ Page, paths }) =>
                paths.map((path) => <Route key={path} path={path} element={<Page />} />)
              )}
              <Route path="/products/storage" element={<Navigate to={`/${lng}/products/cloud-storage`} replace />} />

              {/* Solutions Routes (Dynamic Template Engine) */}
              {['hr', 'sales', 'legal'].map((slug) => (
                <Route key={slug} path={`/solutions/${slug}`} element={<TeamsOverview />} />
              ))}
              {['startups', 'real-estate', 'agencies'].map((slug) => (
                <Route key={slug} path={`/solutions/${slug}`} element={<IndustriesOverview />} />
              ))}
              {['individuals', 'smb', 'enterprise'].map((slug) => (
                <Route key={slug} path={`/solutions/${slug}`} element={<CompanySizeOverview />} />
              ))}
              <Route path="/solutions/:industry" element={<SolutionTemplate />} />
              <Route path="/alternatives/:competitor" element={<AlternativeCompare />} />

              {/* Developer Routes */}
              <Route path="/developers" element={<DevPortal />} />
              <Route path="/developers/api-reference" element={<ApiRef />} />
              <Route path="/developers/embedded" element={<Embedded />} />
              <Route path="/developers/webhooks" element={<Webhooks />} />
              <Route path="/developers/sdks" element={<SDKs />} />
              <Route path="/developers/sandbox" element={<Sandbox />} />
              <Route path="/developers/community" element={<Community />} />

              {/* Trust Center Routes */}
              <Route path="/trust" element={<TrustCenter />} />
              <Route path="/trust/security" element={<Security />} />
              <Route path="/trust/legality" element={<Legality />} />
              <Route path="/trust/privacy" element={<Privacy />} />
              <Route path="/trust/subprocessors" element={<Subprocessors />} />
              <Route path="/trust/vulnerability-disclosure" element={<VulnDisclosure />} />
              <Route path="/trust/ai-ethics" element={<AiEthics />} />

              {/* Sustainability Route */}
              <Route path="/sustainability" element={<Sustainability />} />

              {/* Legal Routes */}
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/legal/cookie-policy" element={<CookiePolicy />} />
              <Route path="/legal/cookies" element={<Navigate to={`/${lng}/legal/cookie-policy`} replace />} />
              <Route path="/legal/acceptable-use" element={<AUP />} />
              <Route path="/legal/dpa" element={<DPA />} />
              <Route path="/legal/refunds" element={<Refunds />} />

              {/* Company & Support Routes */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/help" element={<HelpCenter />} />

              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Blog />} />

              {/* Global 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

// ==========================================
// MASTER APP ROUTER
// ==========================================
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Redirect root (/) to default language (/en) */}
        <Route path="/" element={<Navigate to="/en" replace />} />

        {/* Everything else goes through the Language Wrapper */}
        <Route path="/:lng/*" element={<LanguageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};