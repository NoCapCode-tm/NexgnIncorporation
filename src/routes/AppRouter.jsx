import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Global Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ScrollToTop } from '../components/layout/ScrollToTop';

// ==========================================
// ASYNC ROUTE SPLITTING (LAZY LOADING)
// ==========================================
// 1. Core Pages
const Home = lazy(() => import('../pages/core/Home'));
const Pricing = lazy(() => import('../pages/core/Pricing'));
const Changelog = lazy(() => import('../pages/core/Changelog'));
const Roadmap = lazy(() => import('../pages/core/Roadmap'));
const NotFound = lazy(() => import('../pages/core/NotFound'));

// 2. Product Pages
const ProductOverview = lazy(() => import('../pages/products/ProductOverview'));
const ESignature = lazy(() => import('../pages/products/ESignature'));
const DocEditor = lazy(() => import('../pages/products/DocEditor'));
const Templates = lazy(() => import('../pages/products/Templates'));
const Workflows = lazy(() => import('../pages/products/Workflows'));
const Scheduler = lazy(() => import('../pages/products/Scheduler'));
const Reminders = lazy(() => import('../pages/products/Reminders'));
const AISummary = lazy(() => import('../pages/products/AISummary'));
const AIBuilder = lazy(() => import('../pages/products/AIBuilder'));
const AIClause = lazy(() => import('../pages/products/AIClause'));
const Identity = lazy(() => import('../pages/products/Identity'));
const AuditTrail = lazy(() => import('../pages/products/AuditTrail'));
const Verification = lazy(() => import('../pages/products/Verification'));
const Workspace = lazy(() => import('../pages/products/Workspace'));
const Rbac = lazy(() => import('../pages/products/Rbac'));
const Storage = lazy(() => import('../pages/products/Storage'));
const ActivityLogs = lazy(() => import('../pages/products/ActivityLogs'));

// 3. Solutions Pages
const HR = lazy(() => import('../pages/solutions/HR'));
const Sales = lazy(() => import('../pages/solutions/Sales'));
const Legal = lazy(() => import('../pages/solutions/Legal'));
const Startups = lazy(() => import('../pages/solutions/Startups'));
const RealEstate = lazy(() => import('../pages/solutions/RealEstate'));
const Agencies = lazy(() => import('../pages/solutions/Agencies'));
const Individuals = lazy(() => import('../pages/solutions/Individuals'));
const SMB = lazy(() => import('../pages/solutions/SMB'));
const Enterprise = lazy(() => import('../pages/solutions/Enterprise'));

// 4. Programmatic SEO / Comparison Pages
const AlternativeCompare = lazy(() => import('../pages/solutions/AlternativeCompare'));

// 5. Developers
const DevPortal = lazy(() => import('../pages/developers/DevPortal'));
const ApiRef = lazy(() => import('../pages/developers/ApiRef'));
const Embedded = lazy(() => import('../pages/developers/Embedded'));
const Webhooks = lazy(() => import('../pages/developers/Webhooks'));
const SDKs = lazy(() => import('../pages/developers/SDKs'));
const Sandbox = lazy(() => import('../pages/developers/Sandbox'));

// 6. Trust Center
const TrustCenter = lazy(() => import('../pages/trust/TrustCenter'));
const Security = lazy(() => import('../pages/trust/Security'));
const Legality = lazy(() => import('../pages/trust/Legality'));
const Privacy = lazy(() => import('../pages/trust/Privacy'));
const Subprocessors = lazy(() => import('../pages/trust/Subprocessors'));
const VulnDisclosure = lazy(() => import('../pages/trust/VulnDisclosure'));

// 7. Sustainability
const Sustainability = lazy(() => import('../pages/sustainability/Sustainability'));

// 8. Legal (Footer Pages)
const Terms = lazy(() => import('../pages/legal/Terms'));
const PrivacyPolicy = lazy(() => import('../pages/legal/PrivacyPolicy'));
const AUP = lazy(() => import('../pages/legal/AUP'));
const DPA = lazy(() => import('../pages/legal/DPA'));
const Refunds = lazy(() => import('../pages/legal/Refunds'));

// 9. Company Pages
const Contact = lazy(() => import('../pages/company/Contact'));
const About = lazy(() => import('../pages/company/About'));
const Careers = lazy(() => import('../pages/company/Careers'));
const Press = lazy(() => import('../pages/company/Press'));
const Blog = lazy(() => import('../pages/company/Blog'));

// ==========================================
// CONSTANTS
// ==========================================
// Must match the folders in public/locales
const SUPPORTED_LANGUAGES = ['en', 'es', 'hi'];

// ==========================================
// FALLBACK LOADER UI
// ==========================================
// Rendered inside <main>, so Navbar and Footer stay visible while a page loads.
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      width: '100%',
    }}
  >
    <div className="spinner" role="status" aria-label="Loading"></div>
  </div>
);

// ==========================================
// LANGUAGE ROUTER WRAPPER
// ==========================================
const LanguageWrapper = () => {
  const { lng } = useParams();
  const { i18n } = useTranslation();

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

  // Unsupported language (e.g. /fr/pricing) -> redirect to English
  if (!isSupported) {
    return <Navigate to="/en" replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* flex: 1 pushes the Footer to the bottom on short pages */}
      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/roadmap" element={<Roadmap />} />

            {/* Product Routes */}
            <Route path="/products" element={<ProductOverview />} />
            <Route path="/products/esignature" element={<ESignature />} />
            <Route path="/products/document-editor" element={<DocEditor />} />
            <Route path="/products/templates" element={<Templates />} />
            <Route path="/products/workflows" element={<Workflows />} />
            <Route path="/products/scheduler" element={<Scheduler />} />
            <Route path="/products/reminders" element={<Reminders />} />
            <Route path="/products/ai-summary" element={<AISummary />} />
            <Route path="/products/ai-builder" element={<AIBuilder />} />
            <Route path="/products/ai-clause-assistant" element={<AIClause />} />
            <Route path="/products/identity-assurance" element={<Identity />} />
            <Route path="/products/audit-trail" element={<AuditTrail />} />
            <Route path="/products/agreement-verification" element={<Verification />} />
            <Route path="/products/workspace" element={<Workspace />} />
            <Route path="/products/roles-permissions" element={<Rbac />} />
            <Route path="/products/storage" element={<Storage />} />
            <Route path="/products/activity-logs" element={<ActivityLogs />} />

            {/* Solutions Routes */}
            <Route path="/solutions/hr" element={<HR />} />
            <Route path="/solutions/sales" element={<Sales />} />
            <Route path="/solutions/legal" element={<Legal />} />
            <Route path="/solutions/startups" element={<Startups />} />
            <Route path="/solutions/real-estate" element={<RealEstate />} />
            <Route path="/solutions/agencies" element={<Agencies />} />
            <Route path="/solutions/individuals" element={<Individuals />} />
            <Route path="/solutions/smb" element={<SMB />} />
            <Route path="/solutions/enterprise" element={<Enterprise />} />

            {/* pSEO / Alternatives Routes */}
            <Route path="/alternatives/:competitor" element={<AlternativeCompare />} />

            {/* Developer Routes */}
            <Route path="/developers" element={<DevPortal />} />
            <Route path="/developers/api-reference" element={<ApiRef />} />
            <Route path="/developers/embedded" element={<Embedded />} />
            <Route path="/developers/webhooks" element={<Webhooks />} />
            <Route path="/developers/sdks" element={<SDKs />} />
            <Route path="/developers/sandbox" element={<Sandbox />} />

            {/* Trust Center Routes */}
            <Route path="/trust" element={<TrustCenter />} />
            <Route path="/trust/security" element={<Security />} />
            <Route path="/trust/legality" element={<Legality />} />
            <Route path="/trust/privacy" element={<Privacy />} />
            <Route path="/trust/subprocessors" element={<Subprocessors />} />
            <Route path="/trust/vulnerability-disclosure" element={<VulnDisclosure />} />

            {/* Sustainability Route */}
            <Route path="/sustainability" element={<Sustainability />} />

            {/* Legal Routes */}
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/acceptable-use" element={<AUP />} />
            <Route path="/legal/dpa" element={<DPA />} />
            <Route path="/legal/refunds" element={<Refunds />} />

            {/* Company Routes */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            {/* This handles individual dynamic blog posts (e.g. /blog/shift-to-aes-256) */}
            <Route path="/blog/:slug" element={<Blog />} /> 

            {/* Global 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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