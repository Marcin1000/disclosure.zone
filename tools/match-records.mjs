#!/usr/bin/env node
/**
 * Bierze manifest odkrywania i mówi, co z niego naprawdę wynika dla korpusu:
 * które rekordy dotyczą spraw, które już mamy, które zapowiadają nowe zdarzenie
 * i w jakiej kolejności warto je czytać.
 *
 *   node tools/match-records.mjs harvest/disclosure-archive/manifest.json [--json PLIK]
 *
 * Dopasowanie jest celowo zachowawcze i nigdy nie przesądza sprawy za człowieka.
 * Rekord trafia do „covered" tylko wtedy, gdy rok zgadza się ze sprawą i tytuł
 * dzieli z nią wyróżniające słowo. Wszystko inne ląduje w kandydatach,
 * pogrupowanych po roku i wspólnym słowie, bo jedno zdarzenie ma zwykle
 * kilka rekordów: dokument, analizę i materiał filmowy.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CASES = 'src/content/cases';
const [input, ...rest] = process.argv.slice(2);
if (!input) {
  console.error('usage: node tools/match-records.mjs <manifest.json> [--json out.json]');
  process.exit(1);
}
const jsonOut = rest.includes('--json') ? rest[rest.indexOf('--json') + 1] : null;

/** Słowa, które w tej dziedzinie nie odróżniają niczego od niczego. */
const STOP = new Set([
  'the','a','an','of','on','in','at','to','and','or','for','from','with','by','über',
  'uap','ufo','unidentified','anomalous','phenomena','phenomenon','object','objects',
  'report','reports','file','files','document','documents','record','records','case',
  'memo','memorandum','letter','analysis','photographic','film','video','footage',
  'department','war','air','force','navy','army','project','program','programme',
  'incident','sighting','sightings','encounter','observation','observations','dow','pr','d',
  // Skróty instytucjonalne nazywają rodzaj miejsca, nie zdarzenie.
  'afb','afs','raf','uss','hms','base','station','squadron','wing',
]);

const YEAR = /^(1[89]\d{2}|20[0-4]\d)$/;
/** Sygnatury rekordów (DOW-UAP-D102, PR159) identyfikują plik, nie zdarzenie. */
const stripIds = (s) => s.replace(/\bDOW[-\s]?UAP[-\s]?[A-Z]*\d+\b/gi, ' ').replace(/\b[A-Z]{1,3}\d{2,4}\b/g, ' ');
/** Rok wyłapujemy osobno, więc nie może jeszcze raz liczyć się jako wspólne słowo. */
const words = (s) => (stripIds(s).toLowerCase().match(/[a-zà-ÿ0-9]{3,}/g) ?? [])
  .filter(w => !STOP.has(w) && !YEAR.test(w));
const years = (s) => [...s.matchAll(/\b(1[89]\d{2}|20[0-4]\d)\b/g)].map(m => Number(m[1]));

const unquote = (v) => v.trim().replace(/^["'](.*)["']$/s, '$1');
function frontmatter(path) {
  const t = readFileSync(path, 'utf8');
  return (/^---\n([\s\S]*?)\n---\n/.exec(t) ?? [, ''])[1];
}

// ——— korpus
const corpus = readdirSync(CASES).filter(f => f.endsWith('.md')).map(f => {
  const raw = frontmatter(join(CASES, f));
  const pick = (k) => unquote((new RegExp(`^${k}:\\s*(.+)$`, 'm').exec(raw) ?? [, ''])[1]);
  const id = f.slice(0, -3);
  const title = pick('title');
  const display = pick('dateDisplay');
  const date = pick('date');
  const ys = new Set([...years(`${display} ${date}`), ...years(id)]);
  return { id, title, display, years: ys, words: new Set([...words(title), ...words(id)]) };
});

// ——— manifest
const manifest = JSON.parse(readFileSync(input, 'utf8'));
const records = manifest.records ?? manifest;
if (!Array.isArray(records)) { console.error('manifest has no records array'); process.exit(1); }

/**
 * Bez zgodności roku dopasowanie musi unieść samo słowo, więc poprzeczka jest
 * wysoka: albo jedno słowo wskazujące dokładnie jedną sprawę i dość długie, żeby
 * nie być skrótem („tremonton" tak, „afb" nie), albo co najmniej dwa wspólne
 * słowa. Na jednym krótkim tokenie nie przypisujemy niczego.
 */
const casesPerWord = new Map();
for (const c of corpus)
  for (const w of c.words) casesPerWord.set(w, (casesPerWord.get(w) ?? 0) + 1);
const distinctive = (w) => casesPerWord.get(w) === 1 && w.length >= 5;

const covered = [];
const candidates = [];

for (const r of records) {
  const title = r.title ?? '';
  const ws = new Set(words(title));
  const ys = years(title);
  let best = null;
  for (const c of corpus) {
    const shared = [...ws].filter(w => c.words.has(w));
    if (!shared.length) continue;
    const sameYear = ys.some(y => c.years.has(y));
    const strong = shared.filter(distinctive);
    const substantial = shared.filter(w => w.length >= 4);
    // Rok plus wspólne słowo; albo słowo wskazujące jedną sprawę; albo dwa
    // wspólne słowa. Sam rok i samo krótkie słowo nie wystarczają.
    if (!sameYear && !strong.length && substantial.length < 2) continue;
    const score = shared.length + strong.length + (sameYear ? 1 : 0);
    if (!best || score > best.score) best = { case: c, shared, score, sameYear, strong };
  }
  if (best) {
    covered.push({
      ...r, caseId: best.case.id, caseTitle: best.case.title,
      matchedOn: best.shared,
      confidence: best.sameYear && best.strong.length ? 'high' : best.strong.length ? 'medium' : 'low',
    });
  } else {
    candidates.push({ ...r, years: ys, words: [...ws] });
  }
}

// ——— grupowanie kandydatów w zdarzenia
const groups = new Map();
for (const c of candidates) {
  const y = c.years[0] ?? 0;
  // Klucz zdarzenia: rok plus najrzadsze wyróżniające słowo tytułu.
  const freq = (w) => candidates.filter(o => o.words.includes(w)).length;
  const key = c.words.length
    ? `${y}:${[...c.words].sort((a, b) => freq(a) - freq(b) || a.localeCompare(b))[0]}`
    : `${y}:?`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(c);
}

/**
 * Priorytet czytania. Wyżej idzie to, co ma więcej niezależnych rekordów na
 * jedno zdarzenie i co prowadzi do źródła rządowego, bo z takiego materiału
 * da się zbudować sprawę z proweniencją, a nie kolejny opis.
 */
const govern = (u) => !!u && /\.(gov|mil)(\/|$)|archives\.gov|dvidshub\.net/.test(u);
const events = [...groups].map(([key, items]) => ({
  key,
  year: Number(key.split(':')[0]) || null,
  topic: key.split(':')[1],
  records: items.length,
  withGovSource: items.filter(i => govern(i.officialSourceUrl)).length,
  titles: items.map(i => i.title),
  sources: items.map(i => i.officialSourceUrl).filter(Boolean),
})).sort((a, b) =>
  b.withGovSource - a.withGovSource || b.records - a.records || (a.year ?? 0) - (b.year ?? 0));

// ——— raport
const byCase = new Map();
for (const c of covered) {
  if (!byCase.has(c.caseId)) byCase.set(c.caseId, []);
  byCase.get(c.caseId).push(c);
}

console.log(`manifest: ${records.length} records · corpus: ${corpus.length} cases\n`);
const conf = covered.reduce((m, c) => (m[c.confidence]++, m), { high: 0, medium: 0, low: 0 });
console.log(`already covered by a case: ${covered.length} record(s) across ${byCase.size} case(s)`);
console.log(`  confidence — high ${conf.high} · medium ${conf.medium} · low ${conf.low} (check the low ones by hand)`);
for (const [id, list] of [...byCase].sort((a, b) => b[1].length - a[1].length).slice(0, 15))
  console.log(`  ${String(list.length).padStart(3)}  ${id}`);
if (byCase.size > 15) console.log(`  … and ${byCase.size - 15} more`);

console.log(`\nnew candidate events: ${events.length} (from ${candidates.length} unmatched records)`);
console.log('ordered by government-sourced records, then by how many records back the event\n');
for (const [i, e] of events.slice(0, 25).entries()) {
  const tag = `${e.year ?? '????'} · ${e.topic}`;
  console.log(`${String(i + 1).padStart(3)}. ${tag.padEnd(28)} ${e.records} record(s), ${e.withGovSource} government-sourced`);
  for (const t of e.titles.slice(0, 3)) console.log(`      ${t.slice(0, 92)}`);
  if (e.titles.length > 3) console.log(`      … and ${e.titles.length - 3} more`);
}
if (events.length > 25) console.log(`\n… and ${events.length - 25} further events`);

const govTotal = records.filter(r => govern(r.officialSourceUrl)).length;
console.log(`\ndocuments worth fetching: ${govTotal} record(s) point at a government source`);
console.log(`no usable source link: ${records.filter(r => !r.officialSourceUrl).length}`);

if (jsonOut) {
  writeFileSync(jsonOut, JSON.stringify({
    generated: new Date().toISOString(),
    manifest: input,
    corpusCases: corpus.length,
    covered, events,
  }, null, 2));
  console.log(`\nwritten: ${jsonOut}`);
}
