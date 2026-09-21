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
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CASES = 'src/content/cases';
const [input, ...rest] = process.argv.slice(2);
if (!input) {
  console.error('usage: node tools/match-records.mjs <manifest.json> [--json out.json]');
  process.exit(1);
}
const jsonOut = rest.includes('--json') ? rest[rest.indexOf('--json') + 1] : null;
/** Spis z index-bundles: pozwala pokazać, które rekordy leżą już na dysku. */
const invPath = rest.includes('--files') ? rest[rest.indexOf('--files') + 1] : null;
/** Jedno zdarzenie w całości, z listą plików do przeczytania. */
const onlyEvent = rest.includes('--event') ? rest[rest.indexOf('--event') + 1] : null;

const normId = (x) => x.toUpperCase().replace(/[^A-Z0-9]/g, '');
let localFiles = null;
if (invPath) {
  if (!existsSync(invPath)) { console.error(`${invPath} not found — run index-bundles first.`); process.exit(1); }
  localFiles = JSON.parse(readFileSync(invPath, 'utf8')).coverage?.matches ?? {};
}

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
  // Wydawca rekordu. Siedzi już w jego sygnaturze, więc jako temat nic nie wnosi.
  'fbi','nasa','cia','dod','dos','doe','eop','ica','usg','lle','aaro','odni',
  'statement','narrative','mission','rendering','digital','section','unresolved',
]);

const YEAR = /^(1[89]\d{2}|20[0-4]\d)$/;
/**
 * Sygnatury rekordów identyfikują plik, nie zdarzenie. Wydawców jest więcej niż
 * jeden (DOW, FBI, NASA, CIA, DOS, DOE), więc wzorzec bierze dowolny prefiks.
 */
const RECORD_ID = /\b[A-Z]{2,5}[-\s]?UAP[-\s]?[A-Z]*\d+\b/i;
const stripIds = (s) => s
  .replace(new RegExp(RECORD_ID.source, 'gi'), ' ')
  .replace(/\b[A-Z]{1,3}\d{2,4}\b/g, ' ');

/** Identyfikator rekordu, gdy tytuł go niesie. Ten sam identyfikator to ten sam rekord. */
const recordId = (s) => (RECORD_ID.exec(s) ?? [null])[0]?.toUpperCase().replace(/\s/g, '-') ?? null;
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
if (!existsSync(CASES)) {
  console.error(`${CASES} not found — run this from the repository root.`);
  process.exit(1);
}
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
const raw = manifest.records ?? manifest;
if (!Array.isArray(raw)) { console.error('manifest has no records array'); process.exit(1); }

// Ten sam rekord bywa opublikowany pod kilkoma adresami. Liczymy go raz,
// ale odnotowujemy, ile kopii widzieliśmy, bo to informacja o indeksie.
const byId = new Map();
const records = [];
let duplicates = 0;
for (const r of raw) {
  const id = recordId(r.title ?? '');
  if (id && byId.has(id)) { byId.get(id).copies++; duplicates++; continue; }
  const row = { ...r, recordId: id, copies: 1 };
  if (id) byId.set(id, row);
  records.push(row);
}

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
const review = [];
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
  const hit = best && {
    ...r, caseId: best.case.id, caseTitle: best.case.title,
    matchedOn: best.shared,
    confidence: best.sameYear && best.strong.length ? 'high' : best.strong.length ? 'medium' : 'low',
  };
  // Tylko zgodność roku i słowa wskazującego jedną sprawę liczymy jako pokrycie.
  // Słabsze trafienia idą do przejrzenia, bo na tym korpusie okazały się w
  // większości pozorne: „East China Sea" trafiało w East Coast, „Persian Gulf"
  // w Gulf of Mexico, a „airport" łączył Kazachstan z Hangzhou.
  if (hit?.confidence === 'high') covered.push(hit);
  else if (hit) review.push(hit);
  else candidates.push({ ...r, years: ys, words: [...ws] });
}

/**
 * Tytuły archiwalne często mają postać „sygnatura, rodzaj, miejsce, data".
 * Gdy tytuł tak się rozkłada, miejsce i rok są lepszym kluczem zdarzenia niż
 * najrzadsze słowo: „Gulf of Oman 2021" mówi coś, „oman" mniej, a „photo" nic.
 */
function structuredKey(title) {
  const body = title.replace(new RegExp(`^${RECORD_ID.source}[,\\s-]*`, 'i'), '');
  const seg = body.split(',').map(x => x.trim()).filter(Boolean);
  if (seg.length < 3) return null;
  const last = seg[seg.length - 1];
  const y = (/\b(1[89]\d{2}|20[0-4]\d)\b/.exec(last) ?? [])[1];
  if (!y) return null;
  const place = seg[seg.length - 2].replace(/^["']|["']$/g, '').trim();
  return place ? `${place} · ${y}` : null;
}

// ——— grupowanie kandydatów w zdarzenia
const groups = new Map();
for (const c of candidates) {
  const y = c.years[0] ?? 0;
  const freq = (w) => candidates.filter(o => o.words.includes(w)).length;
  // Zapasowo, gdy tytuł nie ma struktury: rok plus najrzadsze wyróżniające słowo.
  const fallback = c.words.length
    ? `${y || '????'} · ${[...c.words].sort((a, b) => freq(a) - freq(b) || a.localeCompare(b))[0]}`
    : `${y || '????'} · ?`;
  const key = structuredKey(c.title ?? '') ?? fallback;
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
  year: Number((/\b(1[89]\d{2}|20[0-4]\d)\b/.exec(key) ?? [])[1]) || null,
  topic: key,
  records: items.length,
  withGovSource: items.filter(i => govern(i.officialSourceUrl)).length,
  titles: items.map(i => i.title),
  sources: items.map(i => i.officialSourceUrl).filter(Boolean),
  files: localFiles
    ? items.flatMap(i => localFiles[normId(i.recordId ?? '')] ?? [])
    : undefined,
})).sort((a, b) =>
  b.withGovSource - a.withGovSource || b.records - a.records || (a.year ?? 0) - (b.year ?? 0));

// ——— raport
const byCase = new Map();
for (const c of covered) {
  if (!byCase.has(c.caseId)) byCase.set(c.caseId, []);
  byCase.get(c.caseId).push(c);
}

console.log(`manifest: ${raw.length} records${duplicates ? ` (${duplicates} duplicate id(s) collapsed, ${records.length} distinct)` : ''}`);
console.log(`corpus: ${corpus.length} cases\n`);
console.log(`already covered by a case: ${covered.length} record(s) across ${byCase.size} case(s)`);
console.log('  year agreement plus a word that points at exactly one case');
for (const [id, list] of [...byCase].sort((a, b) => b[1].length - a[1].length).slice(0, 15))
  console.log(`  ${String(list.length).padStart(3)}  ${id}`);
if (byCase.size > 15) console.log(`  … and ${byCase.size - 15} more`);

if (review.length) {
  console.log(`\npossibly related, needs a human: ${review.length} record(s)`);
  console.log('  one shared word and no year agreement — usually a place name colliding');
  for (const r of review.slice(0, 12))
    console.log(`  ${r.caseId.padEnd(22)} ? ${r.title.slice(0, 62)}  ${JSON.stringify(r.matchedOn)}`);
  if (review.length > 12) console.log(`  … and ${review.length - 12} more in the JSON output`);
}

console.log(`\nnew candidate events: ${events.length} (from ${candidates.length} unmatched records)`);
console.log('ordered by government-sourced records, then by how many records back the event\n');
for (const [i, e] of events.slice(0, 25).entries()) {
  const held = e.files ? `, ${e.files.length} file(s) on disk` : '';
  console.log(`${String(i + 1).padStart(3)}. ${e.topic.padEnd(34)} ${e.records} record(s), ${e.withGovSource} government-sourced${held}`);
  for (const t of e.titles.slice(0, 3)) console.log(`      ${t.slice(0, 92)}`);
  if (e.titles.length > 3) console.log(`      … and ${e.titles.length - 3} more`);
}
if (events.length > 25) console.log(`\n… and ${events.length - 25} further events`);

if (onlyEvent) {
  const want = onlyEvent.toLowerCase();
  const hit = events.filter(e => e.key.toLowerCase().includes(want));
  if (!hit.length) {
    console.error(`\nno event matches "${onlyEvent}". Run without --event to see the list.`);
    process.exit(1);
  }
  for (const e of hit) {
    console.log(`\n=== ${e.key}  (${e.records} record(s))`);
    for (const t of e.titles) console.log(`  ${t}`);
    if (e.files?.length) {
      console.log(`\n  files held locally (${e.files.length}):`);
      for (const f of e.files) console.log(`    ${f}`);
    } else if (localFiles) {
      console.log('\n  none of these records was found in the download');
    }
    console.log('\n  sources:');
    for (const u of e.sources) console.log(`    ${u}`);
  }
  process.exit(0);
}

const govTotal = records.filter(r => govern(r.officialSourceUrl)).length;
console.log(`\ndocuments worth fetching: ${govTotal} record(s) point at a government source`);
console.log(`no usable source link: ${records.filter(r => !r.officialSourceUrl).length}`);

if (jsonOut) {
  writeFileSync(jsonOut, JSON.stringify({
    generated: new Date().toISOString(),
    manifest: input,
    corpusCases: corpus.length,
    covered, review, events,
  }, null, 2));
  console.log(`\nwritten: ${jsonOut}`);
}
