/**
 * Single source of truth for the global navigation.
 * Navbar.jsx (homepage) and Navbar_Alt.jsx (all other pages) both import this file,
 * so a change to the menu structure is made once. It mirrors the Notion document
 * "Nexgn Global Navigation (Navbar) Structure & Routing".
 *
 * Shapes
 *   menu   { key, label, to?, landingLabel?, groups }   `to` = the menu's main landing page
 *          { key, label, to }                            plain link (no dropdown)
 *   group  { key, title, strip?, links }                 `strip` = full-width footer row of the dropdown
 *   link   { key, label, to }                            internal route, relative to /:lng
 *          { key, label, href }                          external URL, opens in a new tab
 *
 * Translation keys are built as nav.<menu>.<group>.<link>, with the label here as the default.
 * If public/locales/*\/translation.json already holds an older label for a key,
 * that translation wins over the label below, so update it there too.
 */

export const LOGIN_URL = 'https://sign.nexgn.cloud/login';
export const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
export const HELP_PATH = '/help';

// Must match the folders in public/locales and SUPPORTED_LANGUAGES in AppRouter.jsx
export const LANGS = ['en', 'es', 'hi'];

export const MENUS = [
  {
    key: 'product',
    label: 'Product',
    groups: [
      {
        key: 'core',
        title: 'Core Agreement Products',
        links: [
          { key: 'esignature', label: 'eSignature', to: '/products/esignature' },
          { key: 'docEditor', label: 'Document Editor', to: '/products/document-editor' },
          { key: 'templates', label: 'Templates', to: '/products/templates' },
          { key: 'workflows', label: 'Agreement Workflows & Scheduler', to: '/products/automation' },
        ],
      },
      {
        key: 'intelligence',
        title: 'Intelligence (Nexgn AI)',
        links: [
          { key: 'aiSummary', label: 'AI Agreement Summary', to: '/products/ai-summary' },
          { key: 'aiBuilder', label: 'AI Template Builder', to: '/products/ai-builder' },
        ],
      },
      {
        key: 'trust',
        title: 'Trust & Evidence',
        links: [
          { key: 'audit', label: 'Audit Trail & Evidence', to: '/products/audit-trail' },
          { key: 'identity', label: 'Signer Identity Assurance', to: '/products/identity-assurance' },
        ],
      },
      {
        key: 'workspace',
        title: 'Workspace & Management',
        links: [
          { key: 'workspace', label: 'Team Workspace & RBAC', to: '/products/workspace' },
          { key: 'storage', label: 'Google Drive & Storage', to: '/products/cloud-storage' },
        ],
      },
      {
        key: 'explore',
        title: 'Explore',
        strip: true, // "Menu Footer Strip" in the spec
        links: [
          { key: 'whatsNew', label: 'What’s New', to: '/changelog' },
          { key: 'labs', label: 'Nexgn Labs', to: '/labs' },
          { key: 'roadmap', label: 'Product Roadmap', to: '/roadmap' },
        ],
      },
    ],
  },
  {
    key: 'solutions',
    label: 'Solutions',
    groups: [
      {
        key: 'teams',
        title: 'By Team',
        links: [
          { key: 'hr', label: 'Human Resources', to: '/solutions/hr' },
          { key: 'sales', label: 'Sales & Revenue', to: '/solutions/sales' },
          { key: 'legal', label: 'Legal & Compliance', to: '/solutions/legal' },
        ],
      },
      {
        key: 'industry',
        title: 'By Industry',
        links: [
          { key: 'startups', label: 'Startups & Technology', to: '/solutions/startups' },
          { key: 'realEstate', label: 'Real Estate', to: '/solutions/real-estate' },
          { key: 'agencies', label: 'Agencies & Consulting', to: '/solutions/agencies' },
        ],
      },
      {
        key: 'size',
        title: 'By Company Size',
        links: [
          { key: 'individuals', label: 'Individuals & Freelancers', to: '/solutions/individuals' },
          { key: 'smb', label: 'Small & Medium Businesses', to: '/solutions/smb' },
          { key: 'enterprise', label: 'Enterprise', to: '/solutions/enterprise' },
        ],
      },
    ],
  },
  {
    key: 'developers',
    label: 'Developers',
    to: '/developers',
    landingLabel: 'Developer Hub',
    groups: [
      {
        key: 'platform',
        title: 'Platform APIs',
        links: [
          { key: 'api', label: 'REST API Reference', to: '/developers/api-reference' },
          { key: 'embedded', label: 'Embedded Signing', to: '/developers/embedded' },
          { key: 'webhooks', label: 'Webhooks', to: '/developers/webhooks' },
        ],
      },
      {
        key: 'libraries',
        title: 'Libraries & Tools',
        links: [
          { key: 'sdks', label: 'SDKs (Node.js & React)', to: '/developers/sdks' },
          { key: 'postman', label: 'Postman Workspace', href: 'https://postman.com/nexgn-public' },
        ],
      },
      {
        key: 'resources',
        title: 'Resources',
        links: [
          { key: 'sandbox', label: 'Sandbox Environment', to: '/developers/sandbox' },
          { key: 'status', label: 'System Status', href: 'https://status.nexgn.cloud' },
          { key: 'community', label: 'Developer Community', to: '/developers/community' },
        ],
      },
    ],
  },
  { key: 'pricing', label: 'Pricing', to: '/pricing' },
  {
    key: 'trust',
    label: 'Trust Center',
    to: '/trust',
    landingLabel: 'Trust Center overview',
    groups: [
      {
        key: 'security',
        title: 'Security & Compliance',
        links: [
          { key: 'architecture', label: 'Security Architecture', to: '/trust/security' },
          { key: 'status', label: 'System Status', href: 'https://status.nexgn.cloud' },
          { key: 'vuln', label: 'Vulnerability Disclosure Program', to: '/trust/vulnerability-disclosure' },
        ],
      },
      {
        key: 'privacy',
        title: 'Privacy & Legality',
        links: [
          { key: 'legality', label: 'eSignature Legality Guide', to: '/trust/legality' },
          { key: 'center', label: 'Privacy Center', to: '/trust/privacy' },
          { key: 'subprocessors', label: 'Subprocessors List', to: '/trust/subprocessors' },
        ],
      },
      {
        key: 'sustainability',
        title: 'Sustainability',
        links: [
          { key: 'pledge', label: 'The Nexgn Sustainability Pledge', to: '/sustainability' },
        ],
      },
    ],
  },
];
