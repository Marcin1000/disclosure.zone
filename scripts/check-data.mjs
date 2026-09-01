/**
 * Kontrola spójności korpusu. Uruchamiana przed buildem.
 *
 * Sprawdza to, czego Zod sam nie złapie: zgodność rekordu kanonicznego
 * z nakładką językową oraz wzajemne referencje spraw i twierdzeń.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { corpusStats } from './corpus-stats.mjs';

const CANON = 'src/content/cases';
const PL = 'src/content/pl';
const errors = [];
const warn = [];

const slugs = (dir) => readdirSync(dir).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3));

/** Minimalny parser frontmatteru — wystarczy do liczenia i pól prostych. */
function fm(path) {
  const t = readFileSync(path, 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n/.exec(t);
  if (!m) { errors.push(`${path}: brak frontmatteru`); return { raw: '', body: t }; }
  return { raw: m[1], body: t.slice(m[0].length) };
}

const countSources = (raw) => (raw.match(/^- "?(?:tier|label)"?:/gm) || []).length;

const canon = slugs(CANON);
const pl = slugs(PL);

for (const s of canon) if (!pl.includes(s)) errors.push(`brak nakładki PL: ${s}`);
for (const s of pl) if (!canon.includes(s)) errors.push(`nakładka PL bez rekordu kanonicznego: ${s}`);

for (const s of canon.filter(x => pl.includes(x))) {
  const a = fm(join(CANON, `${s}.md`));
  const b = fm(join(PL, `${s}.md`));
  const ca = countSources(a.raw), cb = countSources(b.raw);
  if (ca !== cb) errors.push(`${s}: liczba źródeł EN=${ca} PL=${cb}`);
  if (/^"?(?:lat|lon|scores|date|country|tier|status|evidence)"?:/m.test(b.raw)) {
    errors.push(`${s}: nakładka PL zawiera dane strukturalne — te żyją tylko w rekordzie kanonicznym`);
  }
  if (b.body.trim().length < 200) warn.push(`${s}: bardzo krótka treść PL`);
}

// twierdzenia i rejestr źródeł — przez esbuild, bo to TS
const tmp = '/tmp/dz-check';
execFileSync('npx', ['esbuild', 'src/data/claims.ts', '--bundle', '--format=esm',
  '--external:../i18n', `--outfile=${tmp}-claims.mjs`, '--log-level=error']);
const { claims } = await import(`${tmp}-claims.mjs`);

const claimIds = new Set(claims.map(c => c.id));
const canonSet = new Set(canon);

for (const s of canon) {
  const raw = fm(join(CANON, `${s}.md`)).raw;
  const block = /\nclaims:\n((?:- .*\n)+)/.exec(raw);
  const refs = block ? [...block[1].matchAll(/- "?([\w-]+)"?/g)].map(m => m[1]) : [];
  for (const r of refs) if (!claimIds.has(r)) errors.push(`${s}: wskazuje na nieistniejące twierdzenie "${r}"`);
}
for (const c of claims) {
  for (const s of c.cases) if (!canonSet.has(s)) errors.push(`twierdzenie ${c.id}: wskazuje na nieistniejącą sprawę "${s}"`);
  for (const k of ['claim', 'origin', 'verdict', 'resolver']) {
    if (!c[k]?.en || !c[k]?.pl) errors.push(`twierdzenie ${c.id}: brak wersji ${!c[k]?.en ? 'EN' : 'PL'} w polu ${k}`);
  }
}

execFileSync('npx', ['esbuild', 'src/data/sources.ts', '--format=esm',
  `--outfile=${tmp}-sources.mjs`, '--log-level=error']);
const { FINDING_AIDS, SOURCE_URL } = await import(`${tmp}-sources.mjs`);

let linked = 0, aided = 0, total = 0;
const unknownRefs = new Set();
for (const s of canon) {
  const raw = fm(join(CANON, `${s}.md`)).raw;
  total += countSources(raw);
  for (const [, key] of raw.matchAll(/^\s+"?ref"?:\s*"?([\w-]+)"?/gm)) {
    if (!SOURCE_URL[key]) unknownRefs.add(`${s} -> ${key}`);
    else if (FINDING_AIDS.has(key)) aided++;
    else linked++;
  }
  for (const [, key] of raw.matchAll(/^\s+"?archive"?:\s*"?([\w-]+)"?/gm)) {
    if (!SOURCE_URL[key]) unknownRefs.add(`${s} -> ${key}`);
    else aided++;
  }
}
for (const u of unknownRefs) errors.push(`odnośnik spoza rejestru: ${u}`);

// README podaje te same liczby prozą, więc musi nadążać za korpusem
const st = await corpusStats();
const readme = readFileSync('README.md', 'utf8');
const expect = [
  [/\*\*(\d+) cases\*\* from (\d+) countries, from (\d+) to cases still open in (\d+)/,
   [st.cases, st.countries, st.minYear, st.maxYear], 'cases, countries, year span'],
  [/\*\*(\d+) claims\*\*/, [st.claims], 'claims'],
  [/\*\*(\d+) state programmes\*\*/, [st.archives], 'state programmes'],
  [/\*\*(\d+) of (\d+)\*\* sources/, [linked, total], 'sources linked to material'],
  [/^- \*\*(\d+)\*\* point at the archive/m, [aided], 'archive pointers'],
  [/^- \*\*(\d+)\*\* have neither/m, [total - linked - aided], 'sources with neither'],
];
for (const [re, want, what] of expect) {
  const m = re.exec(readme);
  if (!m) { errors.push(`README: no figure found for "${what}"`); continue; }
  const got = m.slice(1).map(Number);
  if (got.join(',') !== want.join(','))
    errors.push(`README out of date (${what}): says ${got.join(', ')}, data says ${want.join(', ')}`);
}

console.log(`cases: ${canon.length} · claims: ${claims.length}`);
console.log(`sources: ${total} · linked to material: ${linked} · archive pointer only: ${aided} · neither: ${total - linked - aided}`);
if (warn.length) console.log('warnings:\n  ' + warn.join('\n  '));
if (errors.length) {
  console.error(`\nCONSISTENCY ERRORS (${errors.length}):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('corpus consistency: OK');
