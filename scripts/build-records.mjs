#!/usr/bin/env node
/**
 * Buduje rejestr dokumentów z manifestu zebranego przez tools/harvest-archive.mjs.
 * Wynik, src/data/records.json, jest w repozytorium, więc strona buduje się
 * bez sięgania do sieci, a zmiany w rejestrze widać w diffie.
 *
 *   node scripts/build-records.mjs [--manifest PLIK] [--out PLIK]
 *
 * Rejestr nie jest bazą spraw. Trzyma to, co wydawca sam podał: identyfikator,
 * tytuł, wydanie i adres materiału. Niczego tu nie oceniamy i nie streszczamy.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i < 0 ? d : argv[i + 1]; };
const MANIFEST = flag('manifest', 'harvest/disclosure-archive/manifest.json');
const OUT = flag('out', 'src/data/records.json');

/** Kody wydawcy, których rozwinięcia jesteśmy pewni. Reszta zostaje kodem. */
const AGENCY = {
  DOW: 'Department of War',
  FBI: 'Federal Bureau of Investigation',
  CIA: 'Central Intelligence Agency',
  NASA: 'National Aeronautics and Space Administration',
  DOS: 'Department of State',
  DOE: 'Department of Energy',
  EOP: 'Executive Office of the President',
  ODNI: 'Office of the Director of National Intelligence',
};

/**
 * Część materiału z NARA nie ma identyfikatora PURSUE, tylko nazwę pliku
 * zaczynającą się numerem zespołu archiwalnego. Numer czytamy z nazwy, więc
 * podpisujemy to jako odczyt z nazwy pliku, nie jako ustalenie wydawcy.
 */
const RECORD_GROUP = {
  18: 'Records of the Army Air Forces',
  38: 'Records of the Office of the Chief of Naval Operations',
  59: 'General Records of the Department of State',
  65: 'Records of the Federal Bureau of Investigation',
  255: 'Records of the National Aeronautics and Space Administration',
  331: 'Records of Allied Operational and Occupation Headquarters, World War II',
  341: 'Records of Headquarters U.S. Air Force (Air Staff)',
  342: 'Records of U.S. Air Force Commands, Activities, and Organizations',
};
const RG_AGENCY = { 18: null, 38: null, 59: 'DOS', 65: 'FBI', 255: 'NASA', 331: null, 341: null, 342: null };

/**
 * Sprawy, w których dokument został przeczytany i wskazany ręcznie.
 * Klucz to identyfikator, a gdy ten sam identyfikator nosi więcej niż jeden
 * rekord, trzeba dopisać wydanie w formie „ID@03". Generator przerywa pracę,
 * gdy klucz bez wydania trafia w kilka rekordów, bo takie przypisanie
 * podwiesiłoby pod sprawę cudzy dokument.
 */
const CASE_LINKS = {
  'DOW-UAP-D102': ['tremonton-1952'],
  'DOW-UAP-D103': ['tremonton-1952'],
  'DOW-UAP-D104': ['tremonton-1952'],   // Newhouse nakręcił film z Tremonton
  'DOW-UAP-D099': ['ghost-rockets-1946'],
  // Zdarzenie na zachodzie USA: analiza, mapa, pięć relacji, dziesięć renderingów
  // i dwie rekonstrukcje. Renderingi i rekonstrukcje są ilustracją relacji,
  // nie zapisem zjawiska, i strona sprawy mówi to wprost.
  'DOW-UAP-D077': ['western-us-2023'],
  'DOW-UAP-D078': ['western-us-2023'],
  'DOW-UAP-D079': ['western-us-2023'],
  'DOW-UAP-D080': ['western-us-2023'],
  'DOW-UAP-D081': ['western-us-2023'],
  'DOW-UAP-D082': ['western-us-2023'],
  'DOW-UAP-D083': ['western-us-2023'],
  'FBI-UAP-D014@03': ['western-us-2023'],   // ten sam identyfikator nosi też korespondencja z wydania 04
  'FBI-UAP-D015': ['western-us-2023'],
  'FBI-UAP-D016': ['western-us-2023'],
  'FBI-UAP-D017': ['western-us-2023'],
  'FBI-UAP-D018': ['western-us-2023'],
  'FBI-UAP-D019': ['western-us-2023'],
  'FBI-UAP-D020': ['western-us-2023'],
  'FBI-UAP-D021': ['western-us-2023'],
  'FBI-UAP-D022': ['western-us-2023'],
  'FBI-UAP-D023': ['western-us-2023'],
  'FBI-UAP-PR005': ['western-us-2023'],
  'FBI-UAP-PR006': ['western-us-2023'],
  // Cheyenne Mountain 2022: analiza i dwa przesłuchania FBI. Rendering nie ma
  // autora, daty ani podstawy, więc jest podpięty jako ilustracja, nie źródło.
  'ICA-UAP-D001': ['colorado-springs-2022'],
  'FBI-UAP-D001': ['colorado-springs-2022'],
  'FBI-UAP-D002': ['colorado-springs-2022'],
  'FBI-UAP-D003': ['colorado-springs-2022'],
  // Pociąg z Baku, 1955: dwa memoranda OSI dla DCI i nieoceniony raport informacyjny
  'CIA-UAP-D020': ['russell-1955'],
  'CIA-UAP-D021': ['russell-1955'],
  'CIA-UAP-006': ['russell-1955'],
  // Teczka CIA o panelu naukowym (Robertson), styczeń 1953: panel ocenia film z
  // Tremonton, wymienia raport o zielonych kulach wśród dowodów i omawia „Foo Fighters”.
  // Waszyngton i Lubbock są tam tylko wymienione, więc ich nie podpinamy.
  'CIA-UAP-002': ['tremonton-1952', 'green-fireballs-1948', 'foo-fighters-1944'],
  // Memorandum do akt z 18 grudnia 1952: kurier z Wielkiej Brytanii wspomniał R. V. Jonesowi
  // o filmie z Tremonton (pkt 5). 015 to kopia Special Report 14 z archiwum CIA, ten sam
  // raport, który sprawa cytuje jako dtic-special-report-14.
  'CIA-UAP-014': ['tremonton-1952'],
  'CIA-UAP-015': ['tremonton-1952'],
  // Raport informacyjny z 1968: siedem obserwacji w Ladakhu, Nepalu, Sikkimie i Bhutanie
  // oraz krater w Baltichaur. Ladakh 2012 nie jest podpięty, bo raport nie daje ku temu powodu.
  'CIA-UAP-016': ['himalaya-1968'],
  // Depesza z 3 lipca 2008: obiekt nad lotniskiem w Harare i zimbabweńska gotowość
  'CIA-UAP-017': ['harare-2008'],
  // Streszczenia incydentów z Wright Field z 14 marca 1949, dwie części jednego dokumentu:
  // D087 ma Arnolda (17) i Godman (33 do 33g), D088 Chilesa i Whitteda (144) oraz Fargo (172 do 172c).
  'DOW-UAP-D087': ['arnold-1947', 'mantell-1948'],
  'DOW-UAP-D088': ['chiles-whitted-1948', 'gorman-1948'],
  // Studium nr 203 z 10 grudnia 1948: Wenus nad Godman i odesłanie do incydentu z 7 stycznia 1948
  'DOW-UAP-D094': ['mantell-1948'],
  // Teczka zarządu wywiadu USAF, s. 37–46: KC-97 i radar naziemny nad Nową Fundlandią, 6 lipca 1955
  'DOW-UAP-D095': ['newfoundland-1955'],
  'sandia-base-correspondence-new-mexico-aerial-phenomena-and-green-fireballs-1948': ['green-fireballs-1948'],
};

/**
 * Adresy, które indeks podaje, a wydawca ich nie obsługuje. Wpisujemy tu tylko
 * to, co sprawdzone pobraniem: DOW-UAP-D134 oddaje 404 przy ścieżce zbudowanej
 * tak samo jak działająca ścieżka D135, więc nazwa pliku w indeksie jest inna
 * niż u wydawcy. Poprawnego adresu nie zgadujemy, pokazujemy stan faktyczny.
 */
const DEAD_SOURCES = new Set(['DOW-UAP-D134']);

/**
 * Rok zdarzenia tam, gdzie tytuł z indeksu przeczy nazwie pliku u wydawcy.
 * FBI-UAP-D022 ma w tytule rok 2026, a nazwa pliku u wydawcy i dziewięć pozostałych
 * renderingów tego samego zdarzenia podają 2023. Tytuł zostawiamy dosłownie,
 * poprawiamy wyłącznie rok, bo to on trafia do filtrów i na stronę rekordu.
 */
const YEAR_FIXES = { 'FBI-UAP-D022@03': 2023 };

/**
 * Adres z indeksu, którego wydawca nie obsługuje, a ten sam plik leży u niego
 * pod inną nazwą. Wpisujemy tylko adresy pobrane i porównane bajt w bajt
 * z paczką wydania. Strona rekordu pokazuje oba: podany i działający.
 */
const SOURCE_FIXES = {
  // indeks: …southern-united-states-2020.pdf (404); ten sam plik pod nazwą „iraq-2023”
  'DOW-UAP-D20@01': 'https://www.war.gov/medialink/ufo/release_1/dow-uap-d20-mission-report-iraq-2023.pdf',
};

/**
 * Tytuł wydawcy przeczy treści dokumentu. Tytuł zostawiamy dosłownie i miejsce
 * „z tytułu” też; obok zapisujemy, co mówi sam dokument. placeFrom mówi, skąd
 * miejsce: text to słowa dokumentu, grid to nasze przeliczenie siatki MGRS z dokumentu.
 * Rok, jeśli podany, to data zdarzenia z dokumentu; zastępuje rok z tytułu w filtrach.
 */
const DOCUMENT_SAYS = {
  'DOW-UAP-D20@01': { place: 'Syria', year: 2023, placeFrom: 'text' },
  'DOW-UAP-D14@01': { place: 'Syrian coast, north of Latakia', placeFrom: 'grid' },
  'DOW-UAP-PR21@01': { place: 'Syrian coast, north of Latakia', placeFrom: 'grid' },
  'DOW-UAP-D27@01': { place: 'Gulf of Oman', year: 2024, placeFrom: 'grid' },
  'DOW-UAP-D42@01': { place: 'Persian Gulf', year: 2020, placeFrom: 'grid' },
  'DOW-UAP-D4@01': { place: 'Ionian Sea', placeFrom: 'grid' },
  'DOW-UAP-D5@01': { place: 'Ionian Sea and Black Sea', placeFrom: 'grid' },
  'DOW-UAP-D6@01': { place: 'Libyan Sea, south of Crete', placeFrom: 'grid' },
  'DOW-UAP-D8@01': { place: 'Eastern Mediterranean', placeFrom: 'grid' },
  'DOW-UAP-D74@01': { place: 'Western Iraq', placeFrom: 'grid' },
};

/**
 * Ten sam dokument wydany więcej niż raz. Wpisujemy wyłącznie pary sprawdzone
 * porównaniem stron, nie po tytule. „same" to ten sam dokument w innym skanie,
 * „part" znaczy, że wszystkie strony pierwszego pliku są w drugim, „edition"
 * to ten sam tekst w innym wydaniu (np. maszynopis i druk), a „next" znaczy,
 * że dokument z pierwszego pliku ciągnie się w drugim.
 * Klucze jak w CASE_LINKS: slug albo identyfikator, z wydaniem, gdy trzeba.
 */
const SAME_DOCUMENT = [
  // Sary Shagan: D001 skanowany w 300 dpi, 011 w 144 dpi, te same strony raportu
  ['CIA-UAP-011', 'same', 'CIA-UAP-D001'],
  // Budapeszt: strona 1 pliku 018 to ten sam skan co cały plik 013
  ['CIA-UAP-013', 'part', 'CIA-UAP-018'],
  // Studium nr 203 z 10 grudnia 1948: D093 to maszynopis, D094 wydanie drukowane
  ['DOW-UAP-D093', 'edition', 'DOW-UAP-D094'],
  // Streszczenia incydentów z 14 marca 1949: D087 kończy się na 100, D088 zaczyna od 101
  ['DOW-UAP-D087', 'next', 'DOW-UAP-D088'],
];

/**
 * Pliki, które wydawca udostępnia, a których nie da się przeczytać. Link zostaje,
 * bo to stan faktyczny; strona rekordu mówi, co z plikiem jest nie tak.
 */
const ILLEGIBLE = {
  // jedna strona 67×110 pt zeskanowana w 134×221 px: miniatura, nie dokument
  'CIA-UAP-009': 'thumbnail',
};

const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-+$/, '');

const MONTH = '(january|february|march|april|may|june|july|august|september|october|november|december)';
const isDateSegment = (s) => new RegExp(`^(${MONTH}\\s+)?\\d{1,2}$|^(${MONTH}\\s+)?\\d{4}(\\s*[-–]\\s*\\d{2,4})?$|^${MONTH}$|^(circa|undated|n\\.d\\.)$`, 'i').test(s.trim());

/**
 * W pozycji miejsca stoi czasem temat dokumentu, nie geografia. Przyjmujemy
 * człon tylko wtedy, gdy wygląda na nazwę własną: krótki, bez cyfr, każdy
 * wyraz wielką literą poza spójnikiem. Serie tematyczne, w których ta pozycja
 * z definicji nie jest miejscem, wykluczamy po nazwie serii.
 */
const SUBJECT_SERIES = new Set(['AAWSAP DIRD']);
const CONNECTORS = new Set(['of', 'the', 'and', 'de', 'la', 'du', 'el', 'al']);
/** Człony, które mają kształt nazwy własnej, a niczego nie lokalizują. */
const NOT_A_PLACE = /^(part\s+[ivxlc]+|report|continued|n\/?a|unknown|various)$/i;
function isPlaceLike(seg) {
  if (!seg || seg.length > 34 || /\d/.test(seg) || NOT_A_PLACE.test(seg)) return false;
  const words = seg.split(/\s+/);
  if (words.length > 4) return false;
  return words.every(w => CONNECTORS.has(w) || /^[A-Z\u00c0-\u00de]/.test(w));
}

/** Tytuł ma zwykle postać „identyfikator, opis, miejsce, data". */
function parseTitle(raw) {
  const clean = raw.replace(/\s+/g, ' ').trim();
  const idm = /^([A-Z]{2,6}-UAP-[A-Z]{0,3}\d+)\s*[,:]?\s*/i.exec(clean);
  const id = idm ? idm[1].toUpperCase() : null;
  let rest = idm ? clean.slice(idm[0].length) : clean;
  rest = rest.replace(/^["“]|["”]$/g, '').trim();

  // Granica \b nie działa przy podkreślnikach, a tak wyglądają nazwy plików
  // z NARA. Zamiast niej pilnujemy, żeby z żadnej strony nie stała cyfra.
  const years = [...clean.matchAll(/(?<![0-9])(1[89]\d\d|20\d\d)(?![0-9])/g)].map(m => Number(m[1]));
  const year = years.length ? Math.min(...years) : null;
  const yearEnd = years.length && Math.max(...years) !== year ? Math.max(...years) : null;

  // miejsce: idziemy od końca, zjadamy człony wyglądające na datę
  let place = null;
  const segs = rest.split(',').map(s => s.trim()).filter(Boolean);
  if (segs.length >= 2) {
    let i = segs.length - 1;
    while (i > 0 && isDateSegment(segs[i])) i--;
    // Bierzemy człon tylko wtedy, gdy stoi przed datą albo gdy tytuł ma
    // dokładnie dwie części. Inaczej łapaliśmy ostatni człon wyliczenia.
    const shaped = i < segs.length - 1 || segs.length === 2;
    if (i > 0 && shaped && isPlaceLike(segs[i]) && !SUBJECT_SERIES.has(segs[0])) place = segs[i];
  }
  return { id, title: rest || clean, place, year, yearEnd };
}

/** Identyfikator PURSUE z początku nazwy pliku, np. CIA-UAP-D001_Intelligence_... */
function idFromFile(url) {
  const file = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '');
  return /^([A-Z]{2,6}-UAP-[A-Z]{0,3}\d+)[_-]/.exec(file)?.[1] ?? null;
}

function parseSource(url) {
  if (!url) return { source: null, sourceKind: 'none', format: null, release: null, publisher: null };
  const u = new URL(url);
  const publisher = u.host.replace(/^www\./, '');
  const rel = /release[-_/]?0?(\d)\b/i.exec(u.pathname);
  const release = rel ? rel[1].padStart(2, '0') : null;
  if (/dvidshub\.net$/i.test(u.host)) {
    return { source: url, sourceKind: 'page', format: 'video', release, publisher };
  }
  const ext = /\.([a-z0-9]{2,5})$/i.exec(u.pathname)?.[1]?.toLowerCase() ?? null;
  if (!ext) return { source: url, sourceKind: 'landing', format: null, release, publisher };
  return { source: url, sourceKind: 'file', format: ext, release, publisher };
}

function agencyOf(id, title) {
  if (id) {
    const code = id.split('-UAP-')[0];
    return { code, name: AGENCY[code] ?? null };
  }
  if (/^FBI\b/i.test(title)) return { code: 'FBI', name: AGENCY.FBI };
  if (/^State Department\b/i.test(title)) return { code: 'DOS', name: AGENCY.DOS };
  const rg = /^(\d{2,3})[_-]/.exec(title);
  if (rg && RECORD_GROUP[Number(rg[1])]) {
    const code = RG_AGENCY[Number(rg[1])];
    return { code: code ?? null, name: code ? AGENCY[code] : null };
  }
  return { code: null, name: null };
}

function seriesOf(title) {
  const rg = /^(\d{2,3})[_-]/.exec(title);
  const n = rg ? Number(rg[1]) : null;
  return n && RECORD_GROUP[n] ? { rg: n, name: RECORD_GROUP[n] } : null;
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const taken = new Map();
const records = [];

for (const r of manifest.records) {
  const t = parseTitle(r.title);
  const idPre = t.id ?? (r.officialSourceUrl ? idFromFile(r.officialSourceUrl) : null);
  const fixKey = idPre && `${idPre}@${parseSource(r.officialSourceUrl || null).release}`;
  const fixedUrl = fixKey ? SOURCE_FIXES[fixKey] : undefined;
  const s = parseSource(fixedUrl ?? r.officialSourceUrl ?? null);
  // Wydanie 02 podaje w indeksie sam opis, a identyfikator stoi tylko w nazwie
  // pliku u wydawcy. Bierzemy go stamtąd, ale adres strony rekordu budujemy
  // jak dotąd z tytułu, żeby istniejące linki dalej działały.
  const fileId = !t.id && s.source ? idFromFile(s.source) : null;
  const id = t.id ?? fileId;
  const a = agencyOf(id, r.title.trim());
  const series = id ? null : seriesOf(r.title.trim());

  let base = t.id ? t.id.toLowerCase() : slugify(t.title);
  if (!base) base = 'record';
  const seen = (taken.get(base) ?? 0) + 1;
  taken.set(base, seen);
  const slug = seen === 1 ? base : `${base}-${seen}`;

  records.push({
    slug,
    id,
    idFrom: id ? (t.id ? 'title' : 'file') : null,
    title: t.title,
    agency: a.code,
    agencyName: a.name,
    series,
    place: t.place,
    year: YEAR_FIXES[`${id}@${s.release}`] ?? DOCUMENT_SAYS[`${id}@${s.release}`]?.year ?? t.year,
    yearEnd: YEAR_FIXES[`${id}@${s.release}`] || DOCUMENT_SAYS[`${id}@${s.release}`]?.year ? null : t.yearEnd,
    kind: s.format === 'video' ? 'recording' : (s.format === 'jpg' || s.format === 'png') ? 'image'
        : s.sourceKind === 'file' ? 'document' : 'unknown',
    sourceKind: id && DEAD_SOURCES.has(id) ? 'dead' : s.sourceKind,
    release: s.release,
    publisher: s.publisher,
    source: s.source,
    format: s.format,
    cases: CASE_LINKS[`${id}@${s.release}`] ?? CASE_LINKS[slug] ?? CASE_LINKS[id] ?? [],
    illegible: (id && ILLEGIBLE[id]) ?? null,
    documentSays: DOCUMENT_SAYS[`${id}@${s.release}`] ?? null,
    sourceAsIndexed: fixedUrl ? r.officialSourceUrl : null,
    related: [],
  });
}

/**
 * Klucz bez wydania, który trafia w kilka rekordów, jest błędem, a nie
 * niejednoznacznością do rozstrzygnięcia na chybił trafił.
 */
const lookup = (key) => {
  const [id, rel] = key.split('@');
  return records.filter(r => (rel ? r.release === rel : true) && (r.id === id || r.slug === id));
};
const ambiguous = [], unused = [];
for (const key of [...Object.keys(CASE_LINKS), ...Object.keys(ILLEGIBLE), ...Object.keys(SOURCE_FIXES), ...Object.keys(DOCUMENT_SAYS), ...SAME_DOCUMENT.flatMap(([a, , b]) => [a, b])]) {
  const hits = lookup(key);
  if (!hits.length) unused.push(key);
  else if (!key.includes('@') && hits.length > 1) ambiguous.push(`${key} matches ${hits.length} records: ${hits.map(r => r.slug).join(', ')}`);
}
if (ambiguous.length) {
  console.error('registry keys that point at more than one record, add the release as ID@NN:');
  for (const a of ambiguous) console.error(`  ${a}`);
}
if (unused.length) console.error(`registry keys that match no record: ${unused.join(', ')}`);
if (ambiguous.length || unused.length) process.exit(1);

// powiązania zapisujemy po obu stronach, żeby każda strona rekordu je pokazała
const INVERSE = { same: 'same', part: 'whole', edition: 'edition', next: 'prev' };
for (const [a, rel, b] of SAME_DOCUMENT) {
  const [ra] = lookup(a), [rb] = lookup(b);
  ra.related.push({ slug: rb.slug, rel });
  rb.related.push({ slug: ra.slug, rel: INVERSE[rel] });
}

// stała kolejność, żeby diff pokazywał zmiany w danych, a nie w sortowaniu
records.sort((a, b) =>
  (a.release ?? 'zz').localeCompare(b.release ?? 'zz') ||
  a.slug.localeCompare(b.slug));

const out = {
  dataset: 'disclosure.zone / PURSUE document registry',
  note: 'Identifiers, titles and links as published. Nothing here is assessed, summarised or rewritten by us. Where a published title contradicts the document, the title stays and documentSays records what the document gives. Where the index gives an address the publisher does not serve and the same file is served elsewhere, source is the working address and sourceAsIndexed the one given. Where the index gives no identifier, it is read from the published file name (idFrom). Links between files that hold the same document, and files that cannot be read, are our own observations, checked page by page.',
  index: manifest.index ?? null,
  harvested: manifest.harvested ?? null,
  generated: new Date().toISOString(),
  count: records.length,
  records,
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');

const by = (fn) => records.reduce((m, r) => (m.set(fn(r), (m.get(fn(r)) ?? 0) + 1), m), new Map());
console.log(`records: ${records.length} -> ${OUT}`);
console.log('  link to the file  ', records.filter(r => r.sourceKind === 'file').length);
console.log('  publisher page    ', records.filter(r => r.sourceKind === 'page').length);
console.log('  release page only ', records.filter(r => r.sourceKind === 'landing').length);
console.log('  address dead      ', records.filter(r => r.sourceKind === 'dead').length);
console.log('  no link at all    ', records.filter(r => r.sourceKind === 'none').length);
console.log('  cited by a case   ', records.filter(r => r.cases.length).length);
console.log('  release:', [...by(r => r.release ?? '--')].sort().map(([k, v]) => `${k}=${v}`).join(' '));
console.log('  kind:   ', [...by(r => r.kind)].sort().map(([k, v]) => `${k}=${v}`).join(' '));
console.log('  no year:', records.filter(r => !r.year).length, '· no place:', records.filter(r => !r.place).length);
