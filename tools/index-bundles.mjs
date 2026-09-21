#!/usr/bin/env node
/**
 * Spis tego, co faktycznie leży na dysku po pobraniu paczek PURSUE, i zestawienie
 * go z manifestem odkrywania. Odpowiada na pytanie, od którego zależy reszta:
 * które z rekordów indeksu mamy już jako plik pierwotny.
 *
 *   node tools/index-bundles.mjs [--dir harvest/pursue]
 *                                [--manifest harvest/disclosure-archive/manifest.json]
 *                                [--out harvest/inventory.json]
 *
 * Archiwów nie rozpakowuje: czyta samą listę nazw, więc działa na 16 GB w kilka
 * sekund i nie potrzebuje drugiego tyle miejsca. Wynik to lekki JSON z nazwami,
 * bez treści dokumentów.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? d);
};
const DIR = String(flag('dir', 'harvest/pursue'));
const MANIFEST = String(flag('manifest', 'harvest/disclosure-archive/manifest.json'));
const OUT = String(flag('out', 'harvest/inventory.json'));

if (!existsSync(DIR)) {
  console.error(`${DIR} not found — point --dir at where the bundles were downloaded.`);
  process.exit(1);
}

/**
 * Odpadki po pakowaniu na macOS. W tych paczkach jest ich 180 na 554 wpisy,
 * czyli jedna trzecia, i każdy dubluje nazwę prawdziwego pliku. Liczone jako
 * pliki zawyżają wszystko, co potem raportujemy.
 */
const junk = (p) => p.includes('__MACOSX/') || p.split('/').pop().startsWith('._');

/** Lista nazw w archiwum. Windows ma bsdtar, reszta zwykle unzip. */
function zipEntries(zip) {
  const attempts = process.platform === 'win32'
    ? [['tar', ['-tf', zip]], ['unzip', ['-Z1', zip]]]
    : [['unzip', ['-Z1', zip]], ['tar', ['-tf', zip]]];
  for (const [cmd, args] of attempts) {
    try {
      return execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
        .split('\n').map(x => x.trim()).filter(x => x && !x.endsWith('/') && !junk(x));
    } catch { /* próbujemy następnego */ }
  }
  return null;
}

function walk(dir, base = dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, base, acc);
    else {
      const rp = relative(base, p).split(sep).join('/');
      if (!junk(rp)) acc.push({ path: rp, bytes: statSync(p).size });
    }
  }
  return acc;
}

// ——— zbieramy zawartość
const sources = [];
for (const rel of readdirSync(DIR, { withFileTypes: true })) {
  if (!rel.isDirectory()) continue;
  const relDir = join(DIR, rel.name);
  for (const e of readdirSync(relDir, { withFileTypes: true })) {
    const p = join(relDir, e.name);
    if (e.isFile() && extname(e.name).toLowerCase() === '.zip') {
      const names = zipEntries(p);
      if (names === null) { sources.push({ container: p, kind: 'zip', error: 'no tool could list it', files: [] }); continue; }
      sources.push({ container: p, kind: 'zip', files: names.map(path => ({ path })) });
    } else if (e.isDirectory()) {
      sources.push({ container: p, kind: 'directory', files: walk(p) });
    }
  }
}

const all = sources.flatMap(s => s.files.map(f => ({ ...f, container: s.container })));
if (!all.length) {
  console.error(`nothing found under ${DIR}. Expected release_XX folders holding the .zip bundles.`);
  process.exit(1);
}

// ——— podsumowanie
const byExt = {};
for (const f of all) {
  const e = (extname(f.path) || '(none)').toLowerCase();
  byExt[e] = (byExt[e] ?? 0) + 1;
}

console.log(`containers: ${sources.length} · files inside: ${all.length}\n`);
for (const s of sources) {
  const tag = s.error ? `ERROR ${s.error}` : `${s.files.length} file(s)`;
  console.log(`  ${tag.padEnd(16)} ${s.container}`);
}
console.log('\nby extension:');
for (const [e, n] of Object.entries(byExt).sort((a, b) => b[1] - a[1]).slice(0, 12))
  console.log(`  ${String(n).padStart(6)}  ${e}`);

const DOC = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.txt', '.doc', '.docx']);
const docs = all.filter(f => DOC.has(extname(f.path).toLowerCase()));
const vids = all.filter(f => ['.mp4', '.mov', '.avi', '.wmv'].includes(extname(f.path).toLowerCase()));
console.log(`\ndocuments: ${docs.length} · recordings: ${vids.length}`);

// ——— zestawienie z manifestem
const RECORD_ID = /\b[A-Z]{2,5}[-_\s]?UAP[-_\s]?[A-Z]*\d+\b/i;
const norm = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
let coverage = null;

if (existsSync(MANIFEST)) {
  const recs = (JSON.parse(readFileSync(MANIFEST, 'utf8')).records ?? []);
  const ids = new Map();
  for (const r of recs) {
    const m = RECORD_ID.exec(r.title ?? '');
    if (m) ids.set(norm(m[0]), r.title);
  }
  /**
   * Dopasowanie po znormalizowanym identyfikatorze, bo w nazwach plików bywają
   * podkreślenia tam, gdzie w tytule są myślniki. Identyfikator musi się jednak
   * kończyć tam, gdzie się kończy: D10 jest podciągiem D102, a takich par jest
   * w tym zbiorze kilkadziesiąt. Bez tego warunku pokrycie byłoby zawyżone,
   * a przy wybieraniu plików do sprawy wskazywalibyśmy nie ten dokument.
   */
  const hits = new Map();
  // Identyfikatory niosą nazwy dokumentów. Nagrania nazywane są numerem zasobu
  // DOD (DOD_111688723.mp4), którego nie da się związać z sygnaturą rekordu
  // po samej nazwie, więc ich tu nie szukamy, żeby nie zaniżać wyniku pozornym
  // brakiem dopasowania.
  for (const f of docs) {
    const key = norm(f.path.split('/').pop());
    for (const id of ids.keys()) {
      let at = key.indexOf(id);
      let ok = false;
      while (at >= 0) {
        const after = key[at + id.length];
        if (after === undefined || !/[0-9]/.test(after)) { ok = true; break; }
        at = key.indexOf(id, at + 1);
      }
      if (!ok) continue;
      if (!hits.has(id)) hits.set(id, []);
      hits.get(id).push(f);
    }
  }
  const have = [...ids.keys()].filter(id => hits.has(id));
  const missing = [...ids.keys()].filter(id => !hits.has(id));
  coverage = {
    manifestRecordsWithId: ids.size,
    presentLocally: have.length,
    missingLocally: missing.length,
    missingIds: missing.slice(0, 200),
    matches: Object.fromEntries([...hits].map(([id, fs]) => [id, fs.map(f => `${f.container}::${f.path}`)])),
  };
  // Rekordy typu PR to nagrania; szukanie ich wśród dokumentów zawsze zawiedzie,
  // więc liczymy je osobno, zamiast wliczać w brakujące.
  const isPr = (id) => /UAPPR\d+$/.test(id);
  const docIds = [...ids.keys()].filter(id => !isPr(id));
  const prIds = [...ids.keys()].filter(isPr);
  const docHave = docIds.filter(id => hits.has(id));
  coverage.documentRecords = docIds.length;
  coverage.documentRecordsPresent = docHave.length;
  coverage.recordingRecords = prIds.length;

  console.log(`\nmanifest cross-reference (${MANIFEST}):`);
  console.log(`  document records:      ${docIds.length}, of which ${docHave.length} are here`);
  console.log(`  recording records:     ${prIds.length}, not matchable by name`);
  console.log('    recordings are named by DOD asset number, which carries no record identifier');
  if (docIds.length - docHave.length)
    console.log(`  missing documents:     ${docIds.length - docHave.length}`);
} else {
  console.log(`\nno manifest at ${MANIFEST} — skipping the cross-reference`);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({
  dataset: 'pursue / local inventory',
  note: 'File names only. No document content is included.',
  dir: DIR,
  generated: new Date().toISOString(),
  containers: sources.map(s => ({ container: s.container, kind: s.kind, count: s.files.length, error: s.error })),
  coverage,
  files: all,
}, null, 1));
console.log(`\nwritten: ${OUT}`);
