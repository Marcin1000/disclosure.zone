import type { Lang } from '../i18n';
type Bi = Record<Lang, string>;

/**
 * Sprawy i twierdzenia wycofane z bazy. Nie znikają bez śladu: strona /withdrawn
 * podaje, co było, kiedy wypadło i dlaczego. Stare adresy spraw przekierowuje
 * public/_redirects, więc linki z zewnątrz trafiają tutaj, a nie w 404.
 */
export interface Withdrawn {
  kind: 'case' | 'claim';
  id: string;
  title: Bi;
  /** data wycofania, RRRR-MM-DD */
  on: string;
  reason: Bi;
}

export const withdrawn: Withdrawn[] = [
  {
    kind: 'case',
    id: 'chile-navy-2014',
    title: { en: 'The Chilean Navy Footage (11 November 2014)', pl: 'Nagranie Marynarki Chile (11 listopada 2014)' },
    on: '2026-10-05',
    reason: {
      en: 'No source we could open supports any part of the case. The CEFAA announcement it rested on is gone: the page returns 404 and the old cefaa.gob.cl domain no longer resolves. The current publications of SEFAA, CEFAA’s successor, do not include the case, and the US releases do not mention it. Not even the existence of the recording can be checked today, so its scores had nothing to stand on.',
      pl: 'Żadne źródło, które dało się otworzyć, nie popiera żadnej części sprawy. Komunikat CEFAA, na którym stała, zniknął: strona zwraca 404, a stara domena cefaa.gob.cl już nie działa. Obecne publikacje SEFAA, następcy CEFAA, tej sprawy nie zawierają, a wydania USA o niej nie wspominają. Dziś nie da się sprawdzić nawet tego, że nagranie istnieje, więc jej oceny nie miały na czym stać.',
    },
  },
  {
    kind: 'claim',
    id: 'chile-navy-video',
    title: { en: '“The Chilean Navy video shows an object venting material.”', pl: '„Chilijskie nagranie marynarki pokazuje obiekt zrzucający materię.”' },
    on: '2026-10-05',
    reason: {
      en: 'Withdrawn with the case it belonged to: neither the claim, nor its origin, nor our verdict rested on anything that can be opened today.',
      pl: 'Wycofane razem ze sprawą, do której należało: ani twierdzenie, ani jego pochodzenie, ani nasz werdykt nie opierały się na niczym, co dziś da się otworzyć.',
    },
  },
  {
    kind: 'claim',
    id: 'belgian-f16-acceleration',
    title: { en: '“F-16 radar recorded accelerations impossible for known technology.”', pl: '„Radar F-16 zarejestrował przyspieszenia niemożliwe dla znanej technologii.”' },
    on: '2026-10-05',
    reason: {
      en: 'Our verdict described the F-16 radar recordings and how their tracking filter behaved, but no recording, analysis or official account of them is in the US releases or on any official site we could find. The only sources that can be opened are two later accounts: The National Archives’ summary, which says radar “reportedly” tracked an object, and one sentence in a newspaper article of 2000. The Belgian case remains, rebuilt on those two accounts.',
      pl: 'Nasz werdykt opisywał zapisy radarowe F-16 i działanie ich filtru śledzącego, ale żadnego zapisu, analizy ani oficjalnego opisu nie ma w wydaniach USA ani na żadnej stronie urzędowej, którą udało się znaleźć. Jedyne źródła, które da się otworzyć, to dwie późniejsze relacje: streszczenie The National Archives, według którego radar „reportedly” (podobno) śledził obiekt, i jedno zdanie z artykułu prasowego z 2000 r. Sprawa belgijska zostaje, przebudowana na tych dwóch relacjach.',
    },
  },
  {
    kind: 'claim',
    id: 'belgian-triangle-photo',
    title: { en: '“The Petit-Rechain photograph shows a triangular craft from the Belgian wave.”', pl: '„Fotografia z Petit-Rechain przedstawia trójkątny obiekt fali belgijskiej.”' },
    on: '2026-10-05',
    reason: {
      en: 'Our verdict rested on an admission in 2011 and a report in 2022, and we could open no source for either. Without them the entry would have been a claim and a verdict with nothing behind the verdict.',
      pl: 'Nasz werdykt opierał się na przyznaniu się z 2011 r. i doniesieniu z 2022 r., a dla żadnego z nich nie dało się otworzyć źródła. Bez nich wpis byłby twierdzeniem i werdyktem, za którym nic nie stoi.',
    },
  },
];
