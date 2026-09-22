#!/usr/bin/env node
/**
 * Pobiera pojedyncze dokumenty po adresach z rejestru (src/data/records.json).
 *
 *   node tools/fetch-records.mjs --release 06 --browser
 *   node tools/fetch-records.mjs --case tremonton-1952 --browser
 *   node tools/fetch-records.mjs --place "Western United States Event" --browser
 *   node tools/fetch-records.mjs --id DOW-UAP-D077 --id DOW-UAP-D078 --browser
 *   node tools/fetch-records.mjs --release 06 --dry-run
 *
 * To jest uzupełnienie paczek, nie ich zamiennik. Paczka jest szybsza, gdy
 * chce się całe wydanie. Ten skrypt bierze się za przypadki, w których paczki
 * nie ma albo potrzeba kilku dokumentów, a nie gigabajta.
 *
 * Bierzemy wyłącznie rekordy, które mają adres samego materiału. Rekord ze
 * stroną wydania albo bez odnośnika jest pomijany i policzony osobno, bo
 * zgadywanie adresu pliku jest dokładnie tym, czego ten projekt nie robi.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, statfsSync, renameSync, writeFileSync, createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { basename, join } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const many = (n) => argv.reduce((a, v, i) => (v === `--${n}` && argv[i + 1] ? [...a, argv[i + 1]] : a), []);

const OUT = String(flag('out', 'harvest/records'));
const REGISTRY = String(flag('registry', 'src/data/records.json'));
const RELEASE = flag('release', null);
const CASE = flag('case', null);
const PLACE = flag('place', null);
const YEAR = flag('year', null);
const IDS = many('id').map(s => s.toUpperCase());
const LIMIT = Number(flag('limit', 0)) || 0;
const DRY = argv.includes('--dry-run');

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const AS_BROWSER = argv.includes('--browser');
const UA = String(flag('ua', AS_BROWSER ? BROWSER_UA : 'disclosure.zone-fetch/1.0 (+https://disclosure.zone)'));
const headers = () => AS_BROWSER
  ? {
      'user-agent': UA,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
      referer: 'https://www.war.gov/UFO/',
    }
  : { 'user-agent': UA };

const SPACING_MS = 700;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;

const reg = JSON.parse(readFileSync(REGISTRY, 'utf8'));
let picked = reg.records;
if (RELEASE && RELEASE !== true) picked = picked.filter(r => r.release === String(RELEASE).padStart(2, '0'));
if (CASE && CASE !== true) picked = picked.filter(r => r.cases.includes(String(CASE)));
if (PLACE && PLACE !== true) {
  const needle = String(PLACE).toLowerCase();
  picked = picked.filter(r => (r.place ?? '').toLowerCase().includes(needle)
    || r.title.toLowerCase().includes(needle));
}
if (YEAR && YEAR !== true) picked = picked.filter(r => String(r.year) === String(YEAR));
if (IDS.length) picked = picked.filter(r => r.id && IDS.includes(r.id));

const skipped = picked.filter(r => r.sourceKind !== 'file');
const wanted = picked.filter(r => r.sourceKind === 'file');
if (LIMIT) wanted.length = Math.min(wanted.length, LIMIT);

if (!picked.length) {
  console.error('no record matches those filters');
  process.exit(1);
}

console.log(`${wanted.length} record(s) have an address for the material`);
if (skipped.length) {
  const byKind = skipped.reduce((m, r) => (m.set(r.sourceKind, (m.get(r.sourceKind) ?? 0) + 1), m), new Map());
  console.log(`${skipped.length} skipped: ${[...byKind].map(([k, n]) => `${n} ${k}`).join(', ')}`);
  console.log('   Those records carry no address for the file itself, so there is nothing to request.');
}
if (DRY) {
  for (const r of wanted) console.log(`  ${(r.id ?? r.slug).padEnd(16)} ${r.source}`);
  process.exit(0);
}
if (!wanted.length) process.exit(1);

mkdirSync(OUT, { recursive: true });

/** Nazwa pliku z adresu, poprzedzona identyfikatorem, żeby nie było kolizji. */
function target(r) {
  const name = decodeURIComponent(basename(new URL(r.source).pathname));
  return join(OUT, name.startsWith(r.id ?? '\u0000') ? name : `${r.id ?? r.slug}_${name}`);
}

const sha256 = (file) => new Promise((res, rej) => {
  const h = createHash('sha256');
  createReadStream(file).on('error', rej).on('data', c => h.update(c)).on('end', () => res(h.digest('hex')));
});

/**
 * Miejsce na dysku sprawdzamy przed pobraniem. Rozmiaru nie znamy z góry, bo
 * rejestr go nie trzyma, więc pilnujemy prostego progu: gdy zostaje mniej niż
 * pół gigabajta, przerywamy, zamiast zapisać plik w połowie.
 */
function freeBytes(dir) {
  try { const s = statfsSync(dir); return s.bavail * s.bsize; } catch { return null; }
}

const results = [];
let ok = 0, failed = 0, already = 0;

for (const r of wanted) {
  const out = target(r);
  const part = `${out}.part`;
  const label = (r.id ?? r.slug).padEnd(16);

  if (existsSync(out)) {
    const size = statSync(out).size;
    console.log(`${label} have   ${mb(size).padStart(9)}  ${basename(out)}`);
    results.push({ slug: r.slug, id: r.id, url: r.source, file: out, bytes: size, sha256: await sha256(out), state: 'already' });
    already++;
    continue;
  }

  const free = freeBytes(OUT);
  if (free !== null && free < 500e6) {
    console.error(`\nstopping: ${mb(free)} free on the output volume`);
    break;
  }

  const from = existsSync(part) ? statSync(part).size : 0;
  try {
    const res = await fetch(r.source, {
      headers: { ...headers(), ...(from ? { range: `bytes=${from}-` } : {}) },
      redirect: 'follow',
      signal: AbortSignal.timeout(180000),
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const resuming = from > 0 && res.status === 206;
    await pipeline(Readable.fromWeb(res.body), createWriteStream(part, { flags: resuming ? 'a' : 'w' }));
    renameSync(part, out);
    const size = statSync(out).size;
    const hash = await sha256(out);
    console.log(`${label} ok     ${mb(size).padStart(9)}  ${basename(out)}`);
    results.push({ slug: r.slug, id: r.id, url: r.source, file: out, bytes: size, sha256: hash, state: 'fetched' });
    ok++;
  } catch (e) {
    console.log(`${label} FAILED            ${String(e.message ?? e)}`);
    results.push({ slug: r.slug, id: r.id, url: r.source, error: String(e.message ?? e), state: 'failed' });
    failed++;
  }
  await sleep(SPACING_MS);
}

const indexFile = join(OUT, 'fetched.json');
writeFileSync(indexFile, JSON.stringify({
  dataset: 'disclosure.zone / fetched PURSUE records',
  note: 'Local copies of documents the publisher serves directly. Hashes are over the bytes as received.',
  generated: new Date().toISOString(),
  filters: { release: RELEASE ?? null, case: CASE ?? null, place: PLACE ?? null, year: YEAR ?? null, ids: IDS },
  files: results,
}, null, 1) + '\n');

console.log(`\nfetched ${ok} · already held ${already} · failed ${failed}`);
console.log(`wrote ${indexFile}`);
if (failed && AS_BROWSER === false) {
  console.log('\nIf the failures are 403, the host is filtering on headers. Retry with --browser.');
}
process.exit(failed ? 1 : 0);
