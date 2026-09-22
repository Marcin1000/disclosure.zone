#!/usr/bin/env node
/**
 * Czyta stronę wydawcy każdego nagrania i wyciąga z niej trzy rzeczy:
 * numer zasobu DOD (tak nazywają się pliki, które pobraliśmy lokalnie),
 * bezpośredni adres nagrania i adres klatki tytułowej.
 *
 *   node tools/map-videos.mjs --probe            sprawdza jedną stronę i wypisuje, co znalazł
 *   node tools/map-videos.mjs --browser          buduje mapę dla wszystkich nagrań
 *   node tools/map-videos.mjs --posters          pobiera klatki z mapy do public/media/records
 *
 * Niczego nie zgadujemy po układzie strony. Szukamy dwóch wzorców w treści:
 * „DOD_" z numerem i adresu kończącego się na .mp4, oraz znacznika og:image.
 * Gdy strona ich nie zawiera, narzędzie mówi to wprost i kończy błędem,
 * zamiast wypisać pustą mapę, po której wszystko dalej milcząco nie zadziała.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const REGISTRY = String(flag('registry', 'src/data/records.json'));
const OUT = String(flag('out', 'harvest/video-map.json'));
const OUT_DIR = String(flag('out-dir', 'public/media/records'));
const LIMIT = Number(flag('limit', 0)) || 0;
const PROBE = argv.includes('--probe');
const POSTERS = argv.includes('--posters');

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const AS_BROWSER = argv.includes('--browser') || PROBE;
const UA = String(flag('ua', AS_BROWSER ? BROWSER_UA : 'disclosure.zone-map/1.0 (+https://disclosure.zone)'));
const headers = () => AS_BROWSER
  ? {
      'user-agent': UA,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
    }
  : { 'user-agent': UA };

const SPACING_MS = 1000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------- robots.txt ---------- */
const robotsCache = new Map();
async function robots(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let rules = { fetched: false, disallow: [], allow: [] };
  try {
    const res = await fetch(`${origin}/robots.txt`, { headers: headers(), signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      let active = false;
      for (const raw of (await res.text()).slice(0, 200000).split(/\r?\n/)) {
        const line = raw.replace(/#.*$/, '').trim();
        if (!line) continue;
        const [k, ...rest] = line.split(':');
        const key = k.trim().toLowerCase(), val = rest.join(':').trim();
        if (key === 'user-agent') active = val === '*';
        else if (active && key === 'disallow' && val) rules.disallow.push(val);
        else if (active && key === 'allow' && val) rules.allow.push(val);
      }
      rules.fetched = true;
    }
  } catch { /* brak robots.txt to brak zakazu */ }
  robotsCache.set(origin, rules);
  return rules;
}
const longest = (list, path) => list.filter(p => path.startsWith(p)).sort((a, b) => b.length - a.length)[0] ?? '';
async function allowed(url) {
  const u = new URL(url);
  const r = await robots(u.origin);
  if (!r.fetched) return true;
  const d = longest(r.disallow, u.pathname);
  if (!d) return true;
  return longest(r.allow, u.pathname).length >= d.length;
}

/* ---------- wyciąganie ---------- */

const attr = (html, prop) => {
  const re = new RegExp(`<meta[^>]+(?:property|name)\\s*=\\s*["']${prop}["'][^>]*>`, 'i');
  const tag = re.exec(html)?.[0];
  return tag ? /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? null : null;
};

function extract(html, pageUrl) {
  const assets = [...new Set([...html.matchAll(/DOD[_-](\d{6,})/gi)].map(m => `DOD_${m[1]}`))];
  const mp4 = [...new Set([...html.matchAll(/https?:\/\/[^"'\s<>\\)]+\.mp4(?:\?[^"'\s<>\\)]*)?/gi)].map(m => m[0]))];
  let poster = attr(html, 'og:image') ?? attr(html, 'twitter:image');
  if (poster) { try { poster = new URL(poster, pageUrl).href; } catch { poster = null; } }
  return { assets, mp4, poster };
}

async function getPage(url) {
  const res = await fetch(url, { headers: headers(), redirect: 'follow', signal: AbortSignal.timeout(30000) });
  const html = res.ok ? await res.text() : '';
  return { status: res.status, html };
}

/* ---------- przebieg ---------- */

const reg = JSON.parse(readFileSync(REGISTRY, 'utf8'));
const films = reg.records.filter(r => r.kind === 'recording' && r.source);

if (POSTERS) {
  if (!existsSync(OUT)) {
    console.error(`no map at ${OUT}. Build it first:\n  node tools/map-videos.mjs --browser`);
    process.exit(1);
  }
  const map = JSON.parse(readFileSync(OUT, 'utf8'));
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0, held = 0, fail = 0;
  const noAddress = [];
  for (const e of map.videos) {
    if (!e.poster || !e.id) { noAddress.push(e.id ?? e.slug ?? e.page); continue; }
    const file = join(OUT_DIR, `${e.id}.jpg`);
    if (existsSync(file)) { held++; continue; }
    try {
      const res = await fetch(e.poster, { headers: headers(), redirect: 'follow', signal: AbortSignal.timeout(60000) });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
      console.log(`${e.id.padEnd(16)} ok`);
      ok++;
    } catch (err) {
      console.log(`${e.id.padEnd(16)} FAILED  ${String(err.message ?? err)}`);
      fail++;
    }
    await sleep(SPACING_MS);
  }
  console.log(`\nstills fetched ${ok} · already held ${held} · failed ${fail}`);
  if (noAddress.length) {
    // Bez tej listy „pominięto jedno" nie mówi które, a to jest właśnie ta
    // pozycja, której na stronie zabraknie.
    console.log(`\n${noAddress.length} recording(s) have no still address on the publisher's page:`);
    for (const n of noAddress) console.log(`  ${n}`);
  }
  console.log(`\nwrote into ${OUT_DIR}`);
  process.exit(fail && !ok ? 1 : 0);
}

const picked = PROBE ? films.slice(0, 1) : (LIMIT ? films.slice(0, LIMIT) : films);
console.log(`${picked.length} recording page(s) to read\n`);

const out = [];
let found = 0;
for (const r of picked) {
  if (!await allowed(r.source)) {
    console.log(`${(r.id ?? r.slug).padEnd(16)} skip (robots.txt)`);
    out.push({ id: r.id, slug: r.slug, page: r.source, skipped: 'robots' });
    continue;
  }
  let res;
  try { res = await getPage(r.source); }
  catch (e) { console.log(`${(r.id ?? r.slug).padEnd(16)} ERR  ${String(e.message ?? e)}`); out.push({ id: r.id, slug: r.slug, page: r.source, error: String(e.message ?? e) }); await sleep(SPACING_MS); continue; }

  if (res.status !== 200) {
    console.log(`${(r.id ?? r.slug).padEnd(16)} HTTP ${res.status}`);
    out.push({ id: r.id, slug: r.slug, page: r.source, status: res.status });
    await sleep(SPACING_MS);
    continue;
  }
  const e = extract(res.html, r.source);
  if (e.assets.length || e.mp4.length || e.poster) found++;
  console.log(`${(r.id ?? r.slug).padEnd(16)} asset=${e.assets[0] ?? '-'}  mp4=${e.mp4.length}  still=${e.poster ? 'yes' : 'no'}`);
  out.push({ id: r.id, slug: r.slug, page: r.source, ...e });

  if (PROBE) {
    console.log('\n--- what the page yielded ---');
    console.log('asset numbers:', e.assets.length ? e.assets.join(', ') : '(none)');
    console.log('mp4 addresses:', e.mp4.length ? '\n  ' + e.mp4.join('\n  ') : '(none)');
    console.log('still:', e.poster ?? '(none)');
    console.log('page length:', res.html.length, 'characters');
    if (!e.assets.length && !e.mp4.length && !e.poster) {
      console.log('\nNone of the three patterns appear. Either the page builds itself in the');
      console.log('browser, or the markup changed. Here are the first 600 characters so the');
      console.log('patterns can be corrected rather than guessed at again:\n');
      console.log(res.html.slice(0, 600));
      process.exit(1);
    }
    process.exit(0);
  }
  await sleep(SPACING_MS);
}

mkdirSync(OUT.replace(/[^/\\]*$/, '') || '.', { recursive: true });
writeFileSync(OUT, JSON.stringify({
  dataset: 'disclosure.zone / recording map',
  note: 'Asset numbers, direct addresses and still addresses as the publisher states them. No file content is included.',
  generated: new Date().toISOString(),
  count: out.length,
  videos: out,
}, null, 1) + '\n');

console.log(`\n${found} of ${picked.length} pages yielded something`);
console.log(`wrote ${OUT}`);
if (!found) {
  console.log('\nNothing was extracted from any page. Run --probe to see one page in full.');
  process.exit(1);
}
