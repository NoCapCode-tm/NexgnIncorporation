/**
 * Tells Bing, Yandex and other IndexNow engines which URLs changed (clears Ahrefs' "Changed pages not
 * submitted to IndexNow"). Runs after the deploy (see .github/workflows/deploy.yml).
 *
 * The key is the name of the file in public/ (public/<key>.txt, whose content is the same key).
 * Reads the LIVE sitemap, so it submits exactly what was published. Never fails the deploy.
 */
const SITE = 'https://nexgn.cloud';
const KEY = process.env.INDEXNOW_KEY || '7u9h24m7ecyw1k9c8wmjbhu9gz6f4bbw';

const main = async () => {
  // the file that proves we own the site must be reachable
  const keyRes = await fetch(`${SITE}/${KEY}.txt`);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    console.warn(`indexnow: ${SITE}/${KEY}.txt is missing or its content is not the key. Skipping.`);
    return;
  }

  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(SITE) && !/\.(txt|md)$/.test(u));
  if (!urlList.length) {
    console.warn('indexnow: no URLs in sitemap, nothing to submit.');
    return;
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: 'nexgn.cloud', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  console.log(`indexnow: submitted ${urlList.length} URLs, response ${res.status}`);
};

main().catch((err) => console.warn(`indexnow: ${err.message}`));
