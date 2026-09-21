#!/usr/bin/env node
/**
 * Zbiera z Disclosure Archive wyłącznie warstwę odkrywania: tytuł, adres
 * rekordu i adres źródła oficjalnego. Nie zapisuje ich stron ani nie pobiera
 * plików z ich serwera.
 *
 * Powód jest metodologiczny, nie prawny. Do bazy wchodzi dokument pierwotny
 * przeczytany u wydawcy, a nie cudze streszczenie. Indeks służy do tego, żeby
 * ten dokument znaleźć, i na tym jego rola się kończy.
 *
 *   node tools/harvest-archive.mjs [--out DIR] [--limit N] [--index URL] [--probe]
 *
 * Selektorów tej strony nie widziałem, więc narzędzie samo mówi, czego nie
 * znalazło: --probe wypisuje faktyczną strukturę odnośników na stronie
 * indeksu, żeby dało się poprawić wzorce zamiast zgadywać.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

const DEFAULT_INDEX = 'https://disclosurearchive.org/records/';
const UA = 'disclosure.zone-harvester/1.0 (+https://disclosure.zone; manifest only, no content copied)';
const DELAY_MS = 900;
const TIMEOUT_MS = 30_000;

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i < 0 ? fallback : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const OUT = String(flag('out', 'harvest/disclosure-archive'));
/** Nadpisywalny, żeby dało się przejechać całość na atrapie przed wyjściem w świat. */
const INDEX = String(flag('index', DEFAULT_INDEX));
const LIMIT = Number(flag('limit', 0)) || Infinity;
const PROBE = argv.includes('--probe');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/**
 * robots.txt sprawdzamy naprawdę, a nie deklaratywnie. Parser jest celowo
 * prosty: bierzemy grupę dla * i traktujemy Disallow jako prefiks ścieżki.
 */
async function disallowedPaths() {
  try {
    const txt = await get(new URL('/robots.txt', INDEX).href);
    const rules = [];
    let applies = false;
    for (const raw of txt.split('\n')) {
      const line = raw.split('#')[0].trim();
      const [k, ...rest] = line.split(':');
      const v = rest.join(':').trim();
      if (!v && !/^user-agent$/i.test(k)) continue;
      if (/^user-agent$/i.test(k)) applies = v === '*';
      else if (applies && /^disallow$/i.test(k) && v) rules.push(v);
    }
    return rules;
  } catch {
    return null;   // brak robots.txt to nie jest zakaz
  }
}

const blocked = (rules, url) =>
  rules?.some(p => new URL(url).pathname.startsWith(p)) ?? false;

const label = (el) => el.text.replace(/\s+/g, ' ').trim();

function recordLinks(html, base) {
  const root = parse(html);
  const origin = new URL(base).origin;
  const seen = new Map();
  for (const a of root.querySelectorAll('a[href]')) {
    let u;
    try { u = new URL(a.getAttribute('href'), base); } catch { continue; }
    if (u.origin !== origin) continue;
    if (!u.pathname.startsWith('/records/')) continue;
    if (u.pathname.replace(/\/$/, '') === new URL(base).pathname.replace(/\/$/, '')) continue;
    u.hash = '';
    if (!seen.has(u.href)) seen.set(u.href, label(a));
  }
  return [...seen].map(([url, title]) => ({ url, title }));
}

/** Odnośnik do źródła oficjalnego. Etykieta bywa różna, więc bierzemy szerzej. */
function officialSource(html, base) {
  const root = parse(html);
  for (const a of root.querySelectorAll('a[href]')) {
    const t = label(a).toLowerCase();
    if (!/official\s+source|source\s+document|view\s+on\s+|original\s+source/.test(t)) continue;
    try {
      const u = new URL(a.getAttribute('href'), base);
      if (u.origin !== new URL(base).origin) return u.href;   // wychodzi na zewnątrz, czyli do wydawcy
    } catch { /* ignorujemy nieparsowalny href */ }
  }
  // Zapasowo: pierwszy odnośnik na domenę rządową lub archiwalną.
  for (const a of root.querySelectorAll('a[href]')) {
    try {
      const u = new URL(a.getAttribute('href'), base);
      if (/\.(gov|mil)$|archives\.gov|dvidshub\.net/.test(u.hostname)) return u.href;
    } catch { /* jw. */ }
  }
  return null;
}

function probe(html, base) {
  const root = parse(html);
  const rows = root.querySelectorAll('a[href]').slice(0, 40)
    .map(a => `${(a.getAttribute('href') || '').slice(0, 70).padEnd(70)} | ${label(a).slice(0, 50)}`);
  console.log(`\nFirst ${rows.length} anchors on ${base}:\n` + rows.join('\n'));
  console.log('\nNo records matched. Paste the block above and the patterns can be corrected.');
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const rules = await disallowedPaths();
  if (rules === null) console.log('robots.txt: not served, proceeding');
  else console.log(`robots.txt: ${rules.length} disallow rule(s) for *`);
  if (blocked(rules, INDEX)) {
    console.error(`robots.txt disallows ${INDEX} — stopping.`);
    process.exit(2);
  }

  console.log(`index: ${INDEX}`);
  const indexHtml = await get(INDEX);
  const links = recordLinks(indexHtml, INDEX);
  console.log(`record pages discovered: ${links.length}`);

  if (!links.length || PROBE) {
    probe(indexHtml, INDEX);
    if (!links.length) process.exit(1);
  }

  const records = [];
  const failures = [];
  const todo = links.slice(0, LIMIT === Infinity ? links.length : LIMIT);

  for (const [i, { url, title }] of todo.entries()) {
    process.stdout.write(`[${i + 1}/${todo.length}] ${title.slice(0, 64)}\r`);
    if (blocked(rules, url)) { failures.push({ url, error: 'robots-disallow' }); continue; }
    try {
      const html = await get(url);
      records.push({ title, recordUrl: url, officialSourceUrl: officialSource(html, url) });
    } catch (e) {
      failures.push({ url, error: String(e.message ?? e) });
    }
    await sleep(DELAY_MS);
  }

  const withSource = records.filter(r => r.officialSourceUrl).length;
  const manifest = {
    dataset: 'disclosure-archive / discovery manifest',
    note: 'Discovery layer only: titles and links. No page content or source files were copied.',
    index: INDEX,
    harvested: new Date().toISOString(),
    count: records.length,
    withOfficialSource: withSource,
    records,
  };
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  if (failures.length) writeFileSync(join(OUT, 'failures.json'), JSON.stringify(failures, null, 2));

  console.log(`\nrecords: ${records.length} · with an official source link: ${withSource} · failures: ${failures.length}`);
  console.log(`written: ${join(OUT, 'manifest.json')}`);
  if (!withSource) console.log('No official-source links found — re-run with --probe on one record page.');
}

main().catch(e => { console.error('failed:', e.message ?? e); process.exit(1); });
