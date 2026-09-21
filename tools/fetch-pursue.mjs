#!/usr/bin/env node
/**
 * Pobiera oficjalne paczki PURSUE z war.gov. To dorobek rządu USA, czyli
 * domena publiczna, i to jest oryginał, który indeksy takie jak Disclosure
 * Archive tylko wskazują. Chodzimy po dokument tutaj, nie do agregatora.
 *
 *   node tools/fetch-pursue.mjs [--out DIR] [--release 03] [--videos] [--extract]
 *
 * Domyślnie same dokumenty (ok. 2,4 GB). Wideo to dodatkowe ok. 13,4 GB,
 * więc wchodzi wyłącznie na żądanie. Pobieranie wznawia się po przerwaniu,
 * a każdy plik dostaje SHA-256, żeby dało się wykazać, co dokładnie wzięliśmy.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, renameSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { execFileSync } from 'node:child_process';
import { basename, join } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const OUT = String(flag('out', 'harvest/pursue'));
const ONLY = flag('release', null);
const WANT_VIDEOS = argv.includes('--videos');
const EXTRACT = argv.includes('--extract');
const UA = 'disclosure.zone-fetch/1.0 (+https://disclosure.zone)';

const releases = JSON.parse(readFileSync(new URL('./pursue-releases.json', import.meta.url), 'utf8')).releases;
const picked = ONLY ? releases.filter(r => r.release === String(ONLY).padStart(2, '0')) : releases;
if (!picked.length) {
  console.error(`no release matches --release ${ONLY}; known: ${releases.map(r => r.release).join(', ')}`);
  process.exit(1);
}

const gb = (n) => `${n.toFixed(1)} GB`;
const kinds = WANT_VIDEOS ? ['documents', 'videos'] : ['documents'];
const planned = picked.reduce((sum, r) =>
  sum + (r.documents_mb ?? 0) / 1024 + (WANT_VIDEOS ? (r.videos_gb ?? 0) : 0), 0);

/** Miejsce na dysku sprawdzamy zanim zaczniemy, bo to kilkanaście gigabajtów. */
function freeGb(dir) {
  try {
    const out = execFileSync('df', ['-Pk', dir], { encoding: 'utf8' }).trim().split('\n').pop();
    return Number(out.split(/\s+/)[3]) / 1024 / 1024;
  } catch { return null; }
}

mkdirSync(OUT, { recursive: true });
const need = planned * (EXTRACT ? 2 : 1);
const free = freeGb(OUT);
console.log(`releases: ${picked.map(r => r.release).join(', ')} · kinds: ${kinds.join(' + ')}`);
console.log(`download: ~${gb(planned)}${EXTRACT ? `, with extraction ~${gb(need)}` : ''}`);
if (free !== null) {
  console.log(`free on target: ${gb(free)}`);
  if (free < need * 1.1) {
    console.error(`not enough free space: needs ~${gb(need * 1.1)}. Narrow it with --release, or drop --videos.`);
    process.exit(1);
  }
}

async function download(url, dest) {
  const part = `${dest}.part`;
  const have = existsSync(part) ? statSync(part).size : 0;
  const res = await fetch(url, {
    headers: { 'user-agent': UA, ...(have ? { range: `bytes=${have}-` } : {}) },
    redirect: 'follow',
  });
  if (res.status === 416 && have) { renameSync(part, dest); return 'already complete'; }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const resumed = res.status === 206 && have > 0;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(part, { flags: resumed ? 'a' : 'w' }));
  renameSync(part, dest);
  return resumed ? `resumed from ${(have / 1e6).toFixed(0)} MB` : 'downloaded';
}

const sha256 = (p) => new Promise((ok, bad) => {
  const h = createHash('sha256');
  createReadStream(p).on('data', c => h.update(c)).on('end', () => ok(h.digest('hex'))).on('error', bad);
});

const results = [];
for (const rel of picked) {
  const dir = join(OUT, `release_${rel.release}`);
  mkdirSync(dir, { recursive: true });
  for (const kind of kinds) {
    const url = rel[`${kind}_url`];
    if (!url) continue;
    const dest = join(dir, basename(new URL(url).pathname) || `${kind}.zip`);
    const row = { release: rel.release, date: rel.date, kind, url, file: dest };
    try {
      console.log(`\n${rel.release} ${kind}: ${url}`);
      if (existsSync(dest)) console.log('  present, verifying');
      else console.log(`  ${await download(url, dest)}`);
      row.bytes = statSync(dest).size;
      row.sha256 = await sha256(dest);
      console.log(`  ${(row.bytes / 1e6).toFixed(0)} MB · sha256 ${row.sha256.slice(0, 16)}…`);
      if (EXTRACT) {
        const into = join(dir, kind);
        mkdirSync(into, { recursive: true });
        // Rozpakowanie zostawiamy systemowemu unzip: strumieniuje, nie trzyma
        // całego archiwum w pamięci i radzi sobie z ZIP64.
        execFileSync('unzip', ['-q', '-o', dest, '-d', into], { stdio: 'inherit' });
        row.extractedTo = into;
        console.log(`  extracted to ${into}`);
      }
    } catch (e) {
      row.error = String(e.message ?? e);
      console.error(`  failed: ${row.error}`);
    }
    results.push(row);
  }
}

writeFileSync(join(OUT, 'download-results.json'), JSON.stringify({
  source: 'https://www.war.gov/UFO/',
  note: 'US government work, public domain. Hashes recorded so the exact bytes cited can be shown.',
  fetched: new Date().toISOString(),
  results,
}, null, 2));

const bad = results.filter(r => r.error);
console.log(`\n${results.length - bad.length}/${results.length} bundles ok`);
if (bad.length) {
  console.log('failed:');
  for (const r of bad) console.log(`  ${r.release} ${r.kind}: ${r.error}`);
  console.log('If a URL 404s, check war.gov/ufo for the current address and update tools/pursue-releases.json.');
  process.exit(1);
}
