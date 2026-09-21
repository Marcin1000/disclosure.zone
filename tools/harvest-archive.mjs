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

/**
 * Nierozwinięta encja przechodzi dalej do tytułu, a stamtąd do słów kluczowych
 * w dopasowywaniu, gdzie „mdash" albo „eacute" udaje wyraz. Stąd ta tablica:
 * typografia i znaki diakrytyczne, które realnie pojawiają się w nazwach miejsc.
 */
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '',
  mdash: '—', ndash: '–', minus: '−', hellip: '…', middot: '·', bull: '•',
  lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201C', rdquo: '\u201D',
  laquo: '«', raquo: '»', deg: '°', times: '×', copy: '©', reg: '®', trade: '™',
  ensp: ' ', emsp: ' ', thinsp: ' ',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
  agrave: 'à', egrave: 'è', igrave: 'ì', ograve: 'ò', ugrave: 'ù',
  acirc: 'â', ecirc: 'ê', icirc: 'î', ocirc: 'ô', ucirc: 'û',
  auml: 'ä', euml: 'ë', iuml: 'ï', ouml: 'ö', uuml: 'ü',
  ccedil: 'ç', ntilde: 'ñ', atilde: 'ã', otilde: 'õ',
  aring: 'å', oslash: 'ø', aelig: 'æ', szlig: 'ß',
};
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-zA-Z]+);/gi, (m, e) => {
  // Wielkość liter rozróżnia Aacute od aacute, więc najpierw próba dosłowna.
  if (e in ENTITIES) return ENTITIES[e];
  const lower = e.toLowerCase();
  if (lower in ENTITIES) {
    const v = ENTITIES[lower];
    return e[0] === e[0].toUpperCase() && /^[a-z]/.test(lower) ? v.toUpperCase() : v;
  }
  if (e[0] === '#') {
    const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(n) ? String.fromCodePoint(n) : m;
  }
  return m;
});

/**
 * Wyciąga kotwice bez biblioteki. Narzędzie odpalane raz na jakiś czas ma
 * działać ze świeżego klona bez instalowania czegokolwiek, a do znalezienia
 * odnośników pełny parser HTML nie jest potrzebny. Zagnieżdżone <a> są
 * niepoprawne w HTML, więc leniwe dopasowanie do </a> wystarcza.
 */
function anchors(html) {
  const out = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(m[1]);
    if (!href) continue;
    out.push({
      href: decode(href[1] ?? href[2] ?? href[3] ?? ''),
      text: decode(m[2].replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim(),
    });
  }
  return out;
}

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

function recordLinks(html, base) {
  const origin = new URL(base).origin;
  const seen = new Map();
  for (const a of anchors(html)) {
    let u;
    try { u = new URL(a.href, base); } catch { continue; }
    if (u.origin !== origin) continue;
    if (!u.pathname.startsWith('/records/')) continue;
    if (u.pathname.replace(/\/$/, '') === new URL(base).pathname.replace(/\/$/, '')) continue;
    u.hash = '';
    if (!seen.has(u.href)) seen.set(u.href, a.text);
  }
  return [...seen].map(([url, title]) => ({ url, title }));
}

/** Odnośnik do źródła oficjalnego. Etykieta bywa różna, więc bierzemy szerzej. */
function officialSource(html, base) {
  const list = anchors(html);
  for (const a of list) {
    if (!/official\s+source|source\s+document|view\s+on\s+|original\s+source/.test(a.text.toLowerCase())) continue;
    try {
      const u = new URL(a.href, base);
      if (u.origin !== new URL(base).origin) return u.href;   // wychodzi na zewnątrz, czyli do wydawcy
    } catch { /* ignorujemy nieparsowalny href */ }
  }
  // Zapasowo: pierwszy odnośnik na domenę rządową lub archiwalną.
  for (const a of list) {
    try {
      const u = new URL(a.href, base);
      if (/\.(gov|mil)$|archives\.gov|dvidshub\.net/.test(u.hostname)) return u.href;
    } catch { /* jw. */ }
  }
  return null;
}

function probe(html, base) {
  const rows = anchors(html).slice(0, 40)
    .map(a => `${a.href.slice(0, 70).padEnd(70)} | ${a.text.slice(0, 50)}`);
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
