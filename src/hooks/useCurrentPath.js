import { useLocation } from 'react-router-dom';

const LANG_PREFIX = /^\/(en|es|hi)(?=\/|$)/;

/**
 * Path of the current page without the language prefix, e.g. /es/solutions/sales -> /solutions/sales.
 * Hub pages (one component, several URLs) use it so each URL gets its own canonical / hreflang / og:url
 * instead of all pointing at the hub's first section.
 */
export default function useCurrentPath(fallback = '/') {
  const { pathname } = useLocation();
  const path = pathname.replace(LANG_PREFIX, '').replace(/\/+$/, '');
  return path || fallback;
}