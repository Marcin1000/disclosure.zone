export const LOCALES = ['en', 'pl'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LOCALE_NAME: Record<Lang, string> = { en: 'English', pl: 'Polski' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', pl: 'pl' };

/** Ścieżka z prefiksem języka. Domyślny język bez prefiksu. */
export function path(lang: Lang, p = '/'): string {
  const clean = p === '/' ? '' : p.replace(/^\/|\/$/g, '');
  const base = lang === DEFAULT_LANG ? '' : `/${lang}`;
  return clean ? `${base}/${clean}` : base || '/';
}

/** Parametry getStaticPaths dla obu wersji językowych. Nowe obiekty na każde wywołanie. */
export function langParams() {
  return LOCALES.map(l => ({
    params: { lang: l === DEFAULT_LANG ? undefined : l },
    props: { lang: l },
  }));
}

export function langFromParams(v: string | undefined): Lang {
  return v === 'pl' ? 'pl' : 'en';
}

type Dict = Record<string, string>;

const en: Dict = {
  'nav.cases': 'Case files',
  'nav.map': 'Map',
  'nav.claims': 'Claims',
  'nav.archives': 'Archives',
  'nav.method': 'Method',
  'nav.toolkit': 'Toolkit',
  'nav.skip': 'Skip to content',
  'nav.main': 'Main',

  'site.tagline': 'Documents, not rumors',
  'site.desc': 'A UAP case database with an explicit evidence methodology. Every claim carries a source tier. Unresolved never means extraterrestrial.',

  'foot.nav': 'Navigate',
  'foot.project': 'Project',
  'foot.about': 'About',
  'foot.data': 'Open data',
  'foot.rights': 'Content under CC BY 4.0 · Source documents remain the property of the issuing institutions',
  'foot.lang': 'Language',

  'home.kicker': 'Open archive',
  'home.h1a': 'Unresolved',
  'home.h1b': 'does not mean',
  'home.h1c': 'extraterrestrial.',
  'home.lead': 'The UAP problem is not a shortage of cases. It is a shortage of data. This database separates what was recorded at the time from what was added in the decades after — case by case, claim by claim.',
  'home.cta1': 'Open the files',
  'home.cta2': 'How we score',
  'home.stat.cases': 'documented<br />cases',
  'home.stat.countries': 'countries<br />in the corpus',
  'home.stat.claims': 'claims<br />on the ledger',
  'home.stat.programs': 'state<br />programmes',
  'home.confirmed': 'Established',
  'home.unconfirmed': 'Not established',
  'home.bothTrue': 'Both columns are true at the same time. The entire difficulty of this field sits between them — and most public argument consists of pretending only one of them exists.',
  'home.coreKicker': 'Evidential core',
  'home.coreH': 'Cases that survived verification',
  'home.allCases': 'All {n} cases',
  'home.claimsKicker': 'Claim ledger',
  'home.claimsH': 'Myth versus document',
  'home.claimsLead': 'Not cases — individual sentences. Each with its origin, its status, and what exactly would settle it.',
  'home.claimsCta': 'Full ledger — {n} claims',
  'home.tierKicker': 'Source tiers',
  'home.tierH': 'Every sentence has a level',
  'home.tierNote': 'Roswell and Rendlesham are built mostly from T4 and T5. Tehran 1976 and Trans-en-Provence stand on T1. That difference matters more than the shape of the object.',
  'home.mapKicker': 'Next',
  'home.mapH': 'See where this happened',
  'home.mapLead': 'All {n} cases plotted on a world map, filterable by country. UAP is not an American phenomenon — that only becomes obvious on a map.',
  'home.mapCta': 'Open the event map',

  'cases.title': 'Case files',
  'cases.lead': 'The corpus in chronological order. The evidence score is computed across eight axes — higher means better documented, not more anomalous.',
  'cases.status': 'Status',
  'cases.character': 'Character',
  'cases.country': 'Country',
  'cases.all': 'All',
  'cases.core': '◆ Evidential core',
  'cases.listHeading': 'The list of cases',
  'cases.count': '{n} cases',
  'cases.empty': 'No cases match these filters.',
  'cases.back': '← All case files',

  'case.file': 'File',
  'case.date': 'Date',
  'case.place': 'Location',
  'case.country': 'Country',
  'case.witnesses': 'Witnesses',
  'case.duration': 'Duration',
  'case.coords': 'Coordinates',
  'case.official': 'Official position',
  'case.alternatives': 'Alternative hypotheses',
  'case.claimsHere': 'Claims from this case',
  'case.core': 'Evidential core',

  'score.title': 'Evidence score',
  'score.class': 'Class',
  'score.legend': 'S witnesses · R radar/sensor · O optics/IR · P physical trace · M multi-channel · T documentation · X anomaly · D data today.',
  'score.full': 'Full methodology',

  'src.title': 'Sources',
  'src.provenance': 'Provenance {a}/{b} linked',
  'src.nolink': 'no link yet — to be completed',
  'src.heldAt': 'find it in the archive ↗',

  'map.kicker': 'Situation board',
  'map.title': 'Event map',
  'map.lead': '{n} cases from {c} countries. The biggest misconception in this field is that UAP looks like an American phenomenon. It is not — only the US talked about it loudly.',
  'map.pick': 'Select a country',
  'map.world': 'World',
  'map.core': '◆ = evidential core',
  'map.proj': 'Equirectangular projection · positions approximate',
  'map.events': '{n} events · {c} countries',
  'map.thDate': 'Date', 'map.thCase': 'Case', 'map.thCountry': 'Country',
  'map.thStatus': 'Status', 'map.thPos': 'Position',

  'claims.kicker': 'Myth versus document · {n} entries',
  'claims.title': 'Claim ledger',
  'claims.lead': 'Not cases — individual sentences. Each with its origin, source tier, verification status, and what exactly would settle it.',
  'claims.lead2': 'This page cuts both ways. It dismantles legends grown around strong cases — and defends cases that were discarded along with the legends.',
  'claims.resolver': 'What would settle it',
  'claims.cases': 'Cases',

  'arch.kicker': '{n} programmes · {o} with public access',
  'arch.title': 'State archives',
  'arch.lead': 'English-language UAP literature rests almost entirely on Blue Book. Meanwhile France runs a public database, Italy an unbroken register since 1978, Chile publishes resolutions — and the first serious state investigation was Swedish, in 1946.',
  'arch.volume': 'Volume',
  'arch.source': 'Source archive ↗',
  'arch.active': 'Active', 'arch.closed': 'Closed', 'arch.transformed': 'Transformed',
  'arch.publicDb': 'Public database',

  'og.tagline': 'DISCLOSURE.ZONE — DOCUMENTS, NOT RUMORS',

  'scope.alt': 'Radar scope: {n} evidential-core cases, angle by longitude, radius by age',
};

const pl: Dict = {
  'nav.cases': 'Akta',
  'nav.map': 'Mapa',
  'nav.claims': 'Twierdzenia',
  'nav.archives': 'Archiwa',
  'nav.method': 'Metodologia',
  'nav.toolkit': 'Kalkulator',
  'nav.skip': 'Przejdź do treści',
  'nav.main': 'Główna',

  'site.tagline': 'Dokumenty, nie plotki',
  'site.desc': 'Baza przypadków UAP z jawną metodologią oceny dowodów. Każde twierdzenie ma przypisany poziom źródła. Nierozstrzygnięte nigdy nie znaczy pozaziemskie.',

  'foot.nav': 'Nawigacja',
  'foot.project': 'Projekt',
  'foot.about': 'O projekcie',
  'foot.data': 'Dane otwarte',
  'foot.rights': 'Treść na licencji CC BY 4.0 · Dokumenty źródłowe pozostają własnością wydających je instytucji',
  'foot.lang': 'Język',

  'home.kicker': 'Archiwum otwarte',
  'home.h1a': 'Nierozstrzygnięte',
  'home.h1b': 'nie znaczy',
  'home.h1c': 'pozaziemskie.',
  'home.lead': 'Przypadków UAP nie brakuje. Brakuje danych. Ta baza oddziela to, co zapisano w chwili zdarzenia, od tego, co dopisano przez następne dekady: sprawa po sprawie, twierdzenie po twierdzeniu.',
  'home.cta1': 'Otwórz akta',
  'home.cta2': 'Jak to oceniamy',
  'home.stat.cases': 'udokumentowanych<br />spraw',
  'home.stat.countries': 'państw<br />w korpusie',
  'home.stat.claims': 'twierdzeń<br />w rejestrze',
  'home.stat.programs': 'programów<br />państwowych',
  'home.confirmed': 'Potwierdzone',
  'home.unconfirmed': 'Niepotwierdzone',
  'home.bothTrue': 'Obie kolumny są jednocześnie prawdziwe. Cała trudność tej dziedziny mieści się między nimi i większość publicznej dyskusji polega na udawaniu, że istnieje tylko jedna z nich.',
  'home.coreKicker': 'Sprawy kluczowe',
  'home.coreH': 'Sprawy, które przetrwały weryfikację',
  'home.allCases': 'Wszystkie sprawy ({n})',
  'home.claimsKicker': 'Rejestr twierdzeń',
  'home.claimsH': 'Mit kontra dokument',
  'home.claimsLead': 'Nie sprawy, tylko pojedyncze zdania, każde ze wskazanym pochodzeniem, statusem i informacją, co dokładnie by je rozstrzygnęło.',
  'home.claimsCta': 'Pełny rejestr, {n} twierdzeń',
  'home.tierKicker': 'Skala źródeł',
  'home.tierH': 'Każde zdanie ma swój poziom',
  'home.tierNote': 'Roswell i Rendlesham są w większości zbudowane z T4 i T5. Teheran 1976 i Trans-en-Provence stoją na T1. Ta różnica jest ważniejsza od kształtu obiektu.',
  'home.mapKicker': 'Następny krok',
  'home.mapH': 'Zobacz, gdzie to się działo',
  'home.mapLead': 'Wszystkie sprawy ({n}) naniesione na mapę świata, z filtrowaniem po państwie. Fenomen UAP nie jest amerykański: to widać dopiero na mapie.',
  'home.mapCta': 'Otwórz mapę zdarzeń',

  'cases.title': 'Akta sprawy',
  'cases.lead': 'Korpus uporządkowany chronologicznie. Ocena dowodowa liczona z ośmiu osi, im wyższa, tym lepiej sprawa jest udokumentowana, a nie tym bardziej jest niezwykła.',
  'cases.status': 'Status',
  'cases.character': 'Charakter',
  'cases.country': 'Państwo',
  'cases.all': 'Wszystkie',
  'cases.core': '◆ Sprawy kluczowe',
  'cases.listHeading': 'Lista spraw',
  'cases.count': '{n} spraw',
  'cases.empty': 'Brak spraw spełniających te kryteria.',
  'cases.back': '← Wszystkie akta',

  'case.file': 'Akta',
  'case.date': 'Data',
  'case.place': 'Miejsce',
  'case.country': 'Państwo',
  'case.witnesses': 'Świadkowie',
  'case.duration': 'Czas trwania',
  'case.coords': 'Współrzędne',
  'case.official': 'Oficjalne stanowisko',
  'case.alternatives': 'Hipotezy alternatywne',
  'case.claimsHere': 'Twierdzenia z tej sprawy',
  'case.core': 'Sprawa kluczowa',

  'score.title': 'Ocena dowodowa',
  'score.class': 'Klasa',
  'score.legend': 'S świadkowie · R radar/sensor · O optyka/IR · P ślad fizyczny · M wielokanałowość · T dokumentacja · X anomalność · D dane dzisiaj.',
  'score.full': 'Pełna metodologia',

  'src.title': 'Źródła',
  'src.provenance': 'Proweniencja {a}/{b} z odnośnikiem',
  'src.nolink': 'brak odnośnika, do uzupełnienia',
  'src.heldAt': 'szukaj w archiwum ↗',

  'map.kicker': 'Plansza sytuacyjna',
  'map.title': 'Mapa zdarzeń',
  'map.lead': '{n} spraw z {c} państw. Największe nieporozumienie w tej dziedzinie polega na tym, że UAP wygląda na zjawisko amerykańskie. Nie jest, po prostu tylko USA opowiadały o tym głośno.',
  'map.pick': 'Wybierz państwo',
  'map.world': 'Świat',
  'map.core': '◆ = sprawy kluczowe',
  'map.proj': 'Rzut walcowy równoodległościowy · pozycje przybliżone',
  'map.events': '{n} zdarzeń · {c} państw',
  'map.thDate': 'Data', 'map.thCase': 'Sprawa', 'map.thCountry': 'Państwo',
  'map.thStatus': 'Status', 'map.thPos': 'Pozycja',

  'claims.kicker': 'Mit kontra dokument · {n} pozycji',
  'claims.title': 'Rejestr twierdzeń',
  'claims.lead': 'Nie sprawy, pojedyncze zdania. Każde ze wskazanym pochodzeniem, klasą źródła, statusem i informacją, co dokładnie musiałoby się pojawić, żeby je rozstrzygnąć.',
  'claims.lead2': 'Ta strona działa w obie strony. Obala legendy, które narosły wokół mocnych spraw i broni spraw, które zostały odrzucone razem z legendami.',
  'claims.resolver': 'Co by to rozstrzygnęło',
  'claims.cases': 'Sprawy',

  'arch.kicker': '{n} programów · {o} z dostępem publicznym',
  'arch.title': 'Archiwa państwowe',
  'arch.lead': 'Anglojęzyczna literatura o UAP opiera się prawie wyłącznie na Blue Book. Tymczasem Francja prowadzi publiczną bazę, Włochy nieprzerwany rejestr od 1978 r. Chile publikuje rozstrzygnięcia, a pierwsze poważne dochodzenie państwowe przeprowadziła Szwecja, w 1946 r.',
  'arch.volume': 'Wolumen',
  'arch.source': 'Archiwum źródłowe ↗',
  'arch.active': 'Działa', 'arch.closed': 'Zamknięty', 'arch.transformed': 'Przekształcony',
  'arch.publicDb': 'Baza publiczna',

  'og.tagline': 'DISCLOSURE.ZONE, DOKUMENTY, NIE PLOTKI',

  'scope.alt': 'Ekran radaru: {n} spraw kluczowych, kąt to długość geograficzna, promień to wiek',
};

const DICT: Record<Lang, Dict> = { en, pl };

export function useT(lang: Lang) {
  return (key: string, vars?: Record<string, string | number>): string => {
    let s = DICT[lang][key] ?? DICT.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}
