#!/usr/bin/env node
/**
 * Sprawdza, co leży poziom wyżej od paczek, które już pobraliśmy. Nie zgaduje
 * adresów: bierze te z pursue-releases.json, obcina ścieżkę kolejno po jednym
 * segmencie i pyta o każdy katalog nadrzędny.
 *
 *   node tools/probe-parents.mjs [--browser] [--depth 3] [--json plik]
 *   node tools/probe-parents.mjs --url https://przyklad/sciezka/plik.zip
 *   node tools/probe-parents.mjs --dry-run    wypisuje same adresy, nie pyta
 *
 * Katalog może odpowiedzieć na trzy sposoby:
 *   - spisem treści (autoindex serwera albo ListBucketResult z S3) i wtedy
 *     widzimy pliki, o których manifest nic nie wie,
 *   - zwykłą stroną, i wtedy nie ma tam nic poza tym, co już mamy,
 *   - odmową (403/404), i wtedy spis jest po prostu wyłączony.
 * Narzędzie rozróżnia te trzy przypadki, bo tylko pierwszy coś wnosi.
 *
 * robots.txt obowiązuje. Ścieżka zabroniona nie jest odpytywana, jest
 * wypisana jako pominięta.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const DEPTH = Number(flag('depth', 9));
const JSON_OUT = flag('json', null);
const ONE = flag('url', null);
const DRY = argv.includes('--dry-run');

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const AS_BROWSER = argv.includes('--browser');
const UA = String(flag('ua', AS_BROWSER ? BROWSER_UA : 'disclosure.zone-probe/1.0 (+https://disclosure.zone)'));
const headers = (referer) => AS_BROWSER
  ? {
      'user-agent': UA,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
      ...(referer ? { referer } : {}),
    }
  : { 'user-agent': UA };

const SPACING_MS = 900;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const MAX_BODY = 512 * 1024;

/** Adresy startowe: wszystko, co realnie pobieraliśmy, plus strona wykazu. */
function seeds() {
  if (ONE && ONE !== true) return [String(ONE)];
  const m = JSON.parse(readFileSync(new URL('./pursue-releases.json', import.meta.url), 'utf8'));
  const out = [m.source];
  for (const r of m.releases) for (const k of ['documents_url', 'videos_url']) if (r[k]) out.push(r[k]);
  return out;
}

/** Katalogi nadrzędne danego adresu, od najbliższego do korzenia. */
function ancestors(url) {
  const u = new URL(url);
  const segs = u.pathname.split('/').filter(Boolean);
  // ostatni segment to plik (ma kropkę) albo już katalog
  if (segs.length && segs.at(-1).includes('.')) segs.pop();
  const out = [];
  for (let i = segs.length; i >= 0; i--) {
    out.push(`${u.origin}/${segs.slice(0, i).join('/')}${i ? '/' : ''}`);
    if (out.length > DEPTH) break;
  }
  return out;
}

/* ---------- robots.txt ---------- */

const robotsCache = new Map();
async function robots(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let rules = { fetched: false, disallow: [], allow: [] };
  try {
    const res = await fetch(`${origin}/robots.txt`, { headers: headers(), signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const txt = (await res.text()).slice(0, 200000);
      let active = false;
      for (const raw of txt.split(/\r?\n/)) {
        const line = raw.replace(/#.*$/, '').trim();
        if (!line) continue;
        const [k, ...rest] = line.split(':');
        const key = k.trim().toLowerCase();
        const val = rest.join(':').trim();
        if (key === 'user-agent') active = val === '*';
        else if (active && key === 'disallow' && val) rules.disallow.push(val);
        else if (active && key === 'allow' && val) rules.allow.push(val);
      }
      rules.fetched = true;
    }
  } catch { /* brak robots.txt traktujemy jak brak zakazu */ }
  robotsCache.set(origin, rules);
  return rules;
}

const longest = (list, path) =>
  list.filter(p => path.startsWith(p)).sort((a, b) => b.length - a.length)[0] ?? '';

async function allowed(url) {
  const u = new URL(url);
  const r = await robots(u.origin);
  if (!r.fetched) return true;
  const d = longest(r.disallow, u.pathname);
  const a = longest(r.allow, u.pathname);
  if (!d) return true;
  return a.length >= d.length;
}

/* ---------- czytanie odpowiedzi ---------- */

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', uuml: 'ü', ouml: 'ö', auml: 'ä', szlig: 'ß', deg: '°', middot: '·', bull: '•' };
const unent = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);

function anchors(html) {
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[1]);
    if (!href) continue;
    out.push({
      href: unent(href[2] ?? href[3] ?? href[4] ?? '').trim(),
      text: unent(m[2].replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim(),
    });
  }
  return out;
}

const s3keys = (xml) => [...xml.matchAll(/<Key>([\s\S]*?)<\/Key>/gi)].map(m => unent(m[1]).trim());

async function get(url, referer) {
  try {
    const res = await fetch(url, { headers: headers(referer), redirect: 'follow', signal: AbortSignal.timeout(30000) });
    const type = res.headers.get('content-type') ?? '';
    let body = '';
    if (res.body && /text|html|xml|json|plain/i.test(type)) {
      const buf = [];
      let n = 0;
      for await (const chunk of res.body) {
        buf.push(Buffer.from(chunk));
        n += chunk.length;
        if (n >= MAX_BODY) break;
      }
      body = Buffer.concat(buf).toString('utf8');
    } else if (res.body) {
      await res.body.cancel().catch(() => {});
    }
    return {
      status: res.status,
      finalUrl: res.url,
      server: res.headers.get('server') ?? '',
      type,
      length: res.headers.get('content-length') ?? '',
      body,
    };
  } catch (e) {
    return { status: 0, error: String(e.message ?? e), body: '' };
  }
}

/**
 * Spis treści rozpoznajemy po treści, nie po kodzie odpowiedzi: serwer bywa
 * uprzejmy i na brakujący katalog oddaje 200 ze stroną błędu.
 */
function classify(r, url) {
  if (!r.status) return { kind: 'error', note: r.error };
  if (r.status >= 400) return { kind: 'refused', note: `HTTP ${r.status}` };
  const b = r.body;
  if (/<ListBucketResult/i.test(b)) {
    const keys = s3keys(b);
    const truncated = /<IsTruncated>\s*true\s*<\/IsTruncated>/i.test(b);
    return { kind: 'listing', flavour: 's3', entries: keys, truncated };
  }
  const base = new URL(url);
  const links = anchors(b);
  const autoindex = /<title>\s*(index of|directory listing)/i.test(b) || /<h1>\s*Index of/i.test(b);
  const here = [];
  for (const a of links) {
    if (!a.href || a.href.startsWith('#') || /^(mailto|javascript):/i.test(a.href)) continue;
    let abs;
    try { abs = new URL(a.href, base).href; } catch { continue; }
    if (abs.startsWith(base.href) && abs !== base.href) here.push(abs);
  }
  if (autoindex) return { kind: 'listing', flavour: 'autoindex', entries: [...new Set(here)] };
  // serwer bywa uprzejmy i na brakujacy katalog oddaje 200 ze strona bledu
  const soft404 = /<title>[^<]*(not found|404|nie znaleziono)/i.test(b);
  return { kind: 'page', soft404, entries: [...new Set(here)], links: links.length };
}

/* ---------- przebieg ---------- */

const known = new Set();
try {
  const m = JSON.parse(readFileSync(new URL('./pursue-releases.json', import.meta.url), 'utf8'));
  for (const r of m.releases) for (const k of ['documents_url', 'videos_url']) if (r[k]) known.add(r[k]);
} catch { /* --url bez manifestu */ }

const targets = [];
for (const s of seeds()) for (const a of ancestors(s)) if (!targets.includes(a)) targets.push(a);
// warianty pytania o spis: S3 za CloudFrontem odda listę dopiero z parametrem
const extra = [];
for (const t of targets) {
  const u = new URL(t);
  if (/cloudfront\.net$/i.test(u.host) && u.pathname === '/') {
    extra.push(`${u.origin}/?list-type=2`, `${u.origin}/?delimiter=/`);
  }
}
targets.push(...extra);

if (DRY) {
  console.log(`${targets.length} parent paths would be requested:`);
  for (const t of targets) console.log(`  ${t}`);
  process.exit(0);
}

console.log(`probing ${targets.length} parent paths\n`);
const rows = [];
const found = new Map();   // adres pliku -> skąd

for (const url of targets) {
  if (!await allowed(url)) {
    console.log(`skip  robots  ${url}`);
    rows.push({ url, kind: 'skipped', note: 'disallowed by robots.txt' });
    continue;
  }
  const r = await get(url, new URL(url).origin + '/');
  const c = classify(r, url);
  const code = r.status ? String(r.status) : 'ERR';
  const tag = c.kind === 'listing' ? `LISTING (${c.flavour}, ${c.entries.length} entries)`
    : c.kind === 'page' ? `page (${c.links} links, ${c.entries.length} below this path)${c.soft404 ? ' — reads as a not-found page' : ''}`
    : c.kind === 'refused' ? 'no listing'
    : `error: ${c.note}`;
  console.log(`${code.padEnd(4)} ${tag}`);
  console.log(`     ${url}${r.finalUrl && r.finalUrl !== url ? `\n     -> ${r.finalUrl}` : ''}`);
  rows.push({ url, status: r.status, server: r.server, type: r.type, ...c, body: undefined });
  if (c.kind === 'listing' || c.kind === 'page') {
    for (const e of c.entries ?? []) {
      const abs = c.flavour === 's3' ? new URL('/' + e.replace(/^\//, ''), url).href : e;
      if (/\.(zip|pdf|docx?|xlsx?|csv|mp4|mov|json|txt)$/i.test(abs) && !known.has(abs)) {
        if (!found.has(abs)) found.set(abs, url);
      }
    }
    if (c.truncated) console.log('     (listing truncated by the server, more keys exist)');
  }
  await sleep(SPACING_MS);
}

console.log();
const listings = rows.filter(r => r.kind === 'listing');
if (!listings.length) {
  console.log('No parent path returned a directory listing.');
  console.log('Every level answered with an ordinary page or refused, which means the');
  console.log('server does not publish an index: the bundles we already have are all');
  console.log('that these paths expose. Anything more has to come from the landing page');
  console.log('or an announcement, not from walking the directory tree.');
} else {
  console.log(`${listings.length} path(s) returned a listing.`);
}
if (found.size) {
  console.log(`\n${found.size} file(s) not in pursue-releases.json:`);
  for (const [f, from] of found) console.log(`  ${f}\n    seen at ${from}`);
} else {
  console.log('\nNo file appeared that the manifest does not already have.');
}

if (JSON_OUT && JSON_OUT !== true) {
  writeFileSync(String(JSON_OUT), JSON.stringify({ probed: rows, new_files: [...found].map(([url, seen_at]) => ({ url, seen_at })) }, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}
