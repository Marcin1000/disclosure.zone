#!/usr/bin/env node
/**
 * Pobiera oficjalne paczki PURSUE z war.gov. To dorobek rządu USA, czyli
 * domena publiczna, i to jest oryginał, który indeksy takie jak Disclosure
 * Archive tylko wskazują. Chodzimy po dokument tutaj, nie do agregatora.
 *
 *   node tools/fetch-pursue.mjs [--out DIR] [--release 03] [--videos] [--extract]
 *   node tools/fetch-pursue.mjs --check        sprawdza same adresy, nic nie pobiera
 *
 * Domyślnie same dokumenty (ok. 2,4 GB). Wideo to dodatkowe ok. 13,4 GB,
 * więc wchodzi wyłącznie na żądanie. Pobieranie wznawia się po przerwaniu,
 * a każdy plik dostaje SHA-256, żeby dało się wykazać, co dokładnie wzięliśmy.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, statfsSync, renameSync, writeFileSync } from 'node:fs';
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
const CHECK = argv.includes('--check');
/**
 * Serwisy rządowe siedzą często za zaporą, która odrzuca nieznanego klienta
 * kodem 403. To nie jest kontrola dostępu do treści, bo pliki są publiczne
 * i w domenie publicznej, tylko odsiew botów po nagłówkach.
 * --browser wysyła komplet nagłówków przeglądarki, --ua podmienia sam podpis.
 */
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

const releases = JSON.parse(readFileSync(new URL('./pursue-releases.json', import.meta.url), 'utf8')).releases;
const picked = ONLY ? releases.filter(r => r.release === String(ONLY).padStart(2, '0')) : releases;
if (!picked.length) {
  console.error(`no release matches --release ${ONLY}; known: ${releases.map(r => r.release).join(', ')}`);
  process.exit(1);
}

/**
 * Sprawdzenie adresu bez pobierania: zakres jednego bajtu wystarczy, żeby
 * zobaczyć kod odpowiedzi i rozmiar. Niektóre serwery odrzucają HEAD.
 */
async function probe(url) {
  try {
    const res = await fetch(url, { headers: { ...headers(), range: 'bytes=0-0' }, redirect: 'follow' });
    const len = res.headers.get('content-range')?.split('/')[1] ?? res.headers.get('content-length');
    return {
      status: res.status,
      ok: res.status === 206 || res.status === 200,
      size: len && len !== '*' ? `${(Number(len) / 1e6).toFixed(0)} MB` : '?',
      server: res.headers.get('server') ?? '',
      type: res.headers.get('content-type') ?? '',
    };
  } catch (e) {
    return { status: 0, ok: false, error: String(e.message ?? e) };
  }
}

if (CHECK) {
  console.log('checking bundle addresses, nothing is downloaded\n');
  const rows = [];
  for (const rel of picked) {
    for (const kind of ['documents', 'videos']) {
      const url = rel[`${kind}_url`];
      if (!url) continue;
      const r = await probe(url);
      rows.push({ release: rel.release, kind, url, ...r });
      const mark = r.ok ? 'ok  ' : `${String(r.status || 'ERR').padEnd(4)}`;
      console.log(`${rel.release} ${kind.padEnd(9)} ${mark} ${(r.size ?? '').padStart(8)}  ${r.server}${r.error ? '  ' + r.error : ''}`);
      console.log(`   ${url}`);
    }
  }
  const dead = rows.filter(r => !r.ok);
  console.log();
  if (!dead.length) { console.log('every address answers — the manifest is current'); process.exit(0); }
  console.log(`${dead.length} of ${rows.length} addresses did not answer.\n`);

  /**
   * Rozstrzygamy per host, nie na całym zbiorze. Gdy pada każdy adres jednego
   * serwera, a inny serwer odpowiada, to ten serwer odrzuca klienta: pięć
   * różnie zbudowanych ścieżek nie bywa złych naraz. Dopiero gdy na tym samym
   * hoście część działa, a część nie, winne są same ścieżki.
   */
  const hosts = new Map();
  for (const r of rows) {
    const h = new URL(r.url).host;   // z portem, żeby dwa serwisy na tym samym adresie nie zlały się w jeden
    if (!hosts.has(h)) hosts.set(h, []);
    hosts.get(h).push(r);
  }
  let refused = false;
  for (const [host, list] of hosts) {
    const bad = list.filter(r => !r.ok);
    if (!bad.length) { console.log(`${host}: all ${list.length} ok`); continue; }
    if (bad.length === list.length) {
      refused = true;
      const codes = [...new Set(bad.map(r => r.status))].join('/');
      console.log(`${host}: all ${list.length} refused with ${codes} (${bad[0].server || 'unknown edge'})`);
      console.log('   Every path on this host fails while another host answers, so the host is');
      console.log('   refusing the client rather than the paths being wrong.');
    } else {
      console.log(`${host}: ${bad.length} of ${list.length} failed`);
      console.log('   Some paths on this host answer and some do not, so those paths are wrong.');
      for (const r of bad) console.log(`   wrong: ${r.url}`);
    }
  }
  if (refused) {
    console.log('\nRetry with a full set of browser headers:');
    console.log('  npm run harvest:pursue -- --check --browser');
  }
  process.exit(1);
}

const gb = (n) => `${n.toFixed(1)} GB`;
const kinds = WANT_VIDEOS ? ['documents', 'videos'] : ['documents'];
const planned = picked.reduce((sum, r) =>
  sum + (r.documents_mb ?? 0) / 1024 + (WANT_VIDEOS ? (r.videos_gb ?? 0) : 0), 0);

/**
 * Miejsce na dysku sprawdzamy zanim zaczniemy, bo to kilkanaście gigabajtów.
 * statfs działa tak samo na Windowsie i na Uniksie, więc nie wołamy `df`,
 * którego na Windowsie nie ma i którego brak po cichu wyłączyłby tę kontrolę.
 */
function freeGb(dir) {
  try {
    const s = statfsSync(dir);
    return (s.bavail * s.bsize) / 1024 ** 3;
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
    headers: { ...headers(), ...(have ? { range: `bytes=${have}-` } : {}) },
    redirect: 'follow',
  });
  if (res.status === 416 && have) { renameSync(part, dest); return 'already complete'; }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const resumed = res.status === 206 && have > 0;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(part, { flags: resumed ? 'a' : 'w' }));
  renameSync(part, dest);
  return resumed ? `resumed from ${(have / 1e6).toFixed(0)} MB` : 'downloaded';
}

/**
 * Rozpakowanie zostawiamy narzędziu systemowemu: strumieniuje i radzi sobie
 * z ZIP64, którego te paczki wymagają. Na Windowsie nie ma `unzip`, ale od
 * Windows 10 jest `tar` (bsdtar), który czyta zipy. Próbujemy obu.
 */
function extract(zip, into) {
  const attempts = process.platform === 'win32'
    ? [['tar', ['-xf', zip, '-C', into]], ['unzip', ['-q', '-o', zip, '-d', into]]]
    : [['unzip', ['-q', '-o', zip, '-d', into]], ['tar', ['-xf', zip, '-C', into]]];
  const tried = [];
  for (const [cmd, args] of attempts) {
    try {
      execFileSync(cmd, args, { stdio: 'pipe' });
      return cmd;
    } catch (e) {
      tried.push(`${cmd} ${e.code === 'ENOENT' ? 'is not installed' : 'could not read it'}`);
    }
  }
  throw new Error(
    `no working unzip tool: ${tried.join(', ')}. ` +
    'Windows 10 and later ship tar; on Linux install unzip. ' +
    'The bundle itself downloaded fine, so you can also unpack it by hand.');
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
        row.extractedTo = into;
        console.log(`  extracted to ${into} (${extract(dest, into)})`);
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
  console.log('Run with --check to see every address at once; it tells a wrong path from a refused client.');
  process.exit(1);
}
