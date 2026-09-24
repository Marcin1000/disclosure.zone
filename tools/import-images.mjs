#!/usr/bin/env node
/**
 * Pobiera obrazy z rejestru wprost do public/media/records, żeby strona rekordu
 * miała co pokazać. Dotyczy rekordów rodzaju "image": renderingów, zdjęć FBI
 * oraz kadrów z misji Apollo i STS.
 *
 *   node tools/import-images.mjs --dry-run
 *   node tools/import-images.mjs --browser
 *   node tools/import-images.mjs --browser --id FBI-UAP-D014
 *
 * Te pliki idą do repozytorium, więc obowiązuje limit rozmiaru. Obraz większy
 * niż --max-mb jest pomijany z komunikatem, zamiast po cichu wpuszczać
 * kilkudziesięciomegabajtowy skan do historii gita.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, renameSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { extname, join } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const many = (n) => argv.reduce((a, v, i) => (v === `--${n}` && argv[i + 1] ? [...a, argv[i + 1]] : a), []);

const REGISTRY = String(flag('registry', 'src/data/records.json'));
const OUT = String(flag('out', 'public/media/records'));
const MAX_MB = Number(flag('max-mb', 4)) || 4;
const IDS = many('id').map(s => s.toUpperCase());
const DRY = argv.includes('--dry-run');

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const AS_BROWSER = argv.includes('--browser');
const headers = () => AS_BROWSER
  ? {
      'user-agent': BROWSER_UA,
      accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
      referer: 'https://www.war.gov/UFO/',
    }
  : { 'user-agent': 'disclosure.zone-fetch/1.0 (+https://disclosure.zone)' };

const SPACING_MS = 700;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const reg = JSON.parse(readFileSync(REGISTRY, 'utf8'));
let picked = reg.records.filter(r => r.kind === 'image' && r.sourceKind === 'file' && r.source);
if (IDS.length) picked = picked.filter(r => r.id && IDS.includes(r.id));

if (!picked.length) { console.error('no image record matches'); process.exit(1); }

/**
 * Nazwa pliku to adres rekordu, nie identyfikator. Identyfikator bywa
 * współdzielony: FBI-UAP-D014 noszą rendering z wydania 03 i korespondencja
 * z wydania 04. Adres jest unikalny z definicji, więc obraz nigdy nie trafi
 * pod cudzy rekord.
 */
const target = (r) => join(OUT, `${r.slug}${extname(new URL(r.source).pathname).toLowerCase() || '.jpg'}`);

console.log(`${picked.length} image record(s) in the registry\n`);
if (DRY) {
  for (const r of picked) console.log(`  ${(r.id ?? r.slug).padEnd(16)} ${existsSync(target(r)) ? 'have' : 'want'}  ${r.source}`);
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
let ok = 0, held = 0, big = 0, failed = 0;

for (const r of picked) {
  const label = (r.id ?? r.slug).slice(0, 22).padEnd(24);
  const out = target(r);
  if (existsSync(out)) { console.log(`${label} have`); held++; continue; }

  const part = `${out}.part`;
  try {
    const res = await fetch(r.source, { headers: headers(), redirect: 'follow', signal: AbortSignal.timeout(120000) });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const stated = Number(res.headers.get('content-length') || 0);
    if (stated && stated > MAX_MB * 1e6) {
      await res.body.cancel().catch(() => {});
      console.log(`${label} SKIP  ${(stated / 1e6).toFixed(1)} MB is over the ${MAX_MB} MB limit for files kept in the repository`);
      big++;
      await sleep(SPACING_MS);
      continue;
    }
    await pipeline(Readable.fromWeb(res.body), createWriteStream(part));
    const size = statSync(part).size;
    if (size > MAX_MB * 1e6) {
      console.log(`${label} SKIP  ${(size / 1e6).toFixed(1)} MB is over the ${MAX_MB} MB limit`);
      rmSync(part, { force: true });
      big++;
    } else {
      renameSync(part, out);
      console.log(`${label} ok    ${(size / 1024).toFixed(0)} kB`);
      ok++;
    }
  } catch (e) {
    // Pobieranie nie jest wznawiane, więc urwany plik .part do niczego się nie przyda
    rmSync(part, { force: true });
    console.log(`${label} FAILED  ${String(e.message ?? e)}`);
    failed++;
  }
  await sleep(SPACING_MS);
}

console.log(`\nfetched ${ok} · already held ${held} · too large ${big} · failed ${failed}`);
console.log(`wrote into ${OUT}. Run npm run build, then commit what you want the site to serve.`);
if (failed && !AS_BROWSER) console.log('\nIf the failures are 403, retry with --browser.');
process.exit(failed && !ok ? 1 : 0);
