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
  {
    kind: 'case',
    id: 'delphos-1971',
    title: { en: 'Delphos (2 November 1971)', pl: 'Delphos (2 listopada 1971)' },
    on: '2026-10-15',
    reason: {
      en: 'No source we could open supports any part of the case. The US releases do not mention Delphos, the National Archives catalogue holds no record of the event, and the soil analyses and photographs the case cited have no address. Project Blue Book had been closed in December 1969, two years before the date the case gave. The scores had nothing to stand on.',
      pl: 'Żadne źródło, które dało się otworzyć, nie popiera żadnej części sprawy. Wydania USA nie wspominają Delphos, katalog National Archives nie ma żadnego zapisu o zdarzeniu, a analizy gleby i zdjęcia, na które sprawa się powoływała, nie mają adresu. Project Blue Book zamknięto w grudniu 1969 r., dwa lata przed datą, którą podawała sprawa. Oceny nie miały na czym stać.',
    },
  },
  {
    kind: 'claim',
    id: 'delphos-hydrophobic-soil',
    title: { en: '“The Delphos ring soil repelled water for years.”', pl: '„Gleba z pierścienia w Delphos przez lata odpychała wodę.”' },
    on: '2026-10-15',
    reason: {
      en: 'Withdrawn with the case it belonged to: no laboratory report on the soil can be opened today.',
      pl: 'Wycofane razem ze sprawą, do której należało: dziś nie da się otworzyć żadnego raportu laboratoryjnego o glebie.',
    },
  },
  {
    kind: 'case',
    id: 'coyne-1973',
    title: { en: 'The Coyne Helicopter Incident (18 October 1973)', pl: 'Incydent śmigłowca Coyne’a (18 października 1973)' },
    on: '2026-10-15',
    reason: {
      en: 'No source we could open supports any part of the case beyond its date and place. The only mention in the US releases is one paragraph of a magazine article reprinted in NASA correspondence of 1998 (USG-UAP-D001), which names the date, Mansfield, Ohio, and Captain Lawrence Coyne’s helicopter crew, and says nothing of what the crew saw or of the altimeter. The National Archives catalogue holds no record of the event, and the flight report and testimony the case cited have no address. The scores had nothing to stand on.',
      pl: 'Żadne źródło, które dało się otworzyć, nie popiera żadnej części sprawy poza datą i miejscem. Jedyna wzmianka w wydaniach USA to akapit artykułu prasowego przedrukowanego w korespondencji NASA z 1998 r. (USG-UAP-D001), który podaje datę, Mansfield w Ohio i załogę śmigłowca kapitana Lawrence’a Coyne’a, a nic nie mówi o tym, co załoga widziała, ani o wysokościomierzu. Katalog National Archives nie ma żadnego zapisu o zdarzeniu, a raport lotniczy i zeznania, na które powoływała się sprawa, nie mają adresu. Oceny nie miały na czym stać.',
    },
  },
  {
    kind: 'claim',
    id: 'coyne-altitude-gain',
    title: { en: '“The helicopter gained several hundred metres with the collective set to descend.”', pl: '„Śmigłowiec zyskał kilkaset metrów wysokości przy drążku w pozycji zejścia.”' },
    on: '2026-10-15',
    reason: {
      en: 'Withdrawn with the case it belonged to: no flight report, testimony or other document on the climb can be opened today.',
      pl: 'Wycofane razem ze sprawą, do której należało: dziś nie da się otworzyć żadnego raportu lotniczego, zeznania ani innego dokumentu o tym wznoszeniu.',
    },
  },
  {
    kind: 'case',
    id: 'cash-landrum-1980',
    title: { en: 'Cash–Landrum (29 December 1980)', pl: 'Cash–Landrum (29 grudnia 1980)' },
    on: '2026-10-15',
    reason: {
      en: 'No source we could open supports the event as the case described it. The only mention in the US releases is a Defense Intelligence Reference Document of 2010 (DOW-UAP-D128), which discusses the witnesses’ reported injuries on the strength of a MUFON journal article of 1981 and unpublished findings, and gives no date, place, object or helicopters. The National Archives catalogue holds no record of the event, and the court file and medical records the case cited have no address. The scores had nothing to stand on.',
      pl: 'Żadne źródło, które dało się otworzyć, nie popiera zdarzenia w postaci, w jakiej opisywała je sprawa. Jedyna wzmianka w wydaniach USA to Defense Intelligence Reference Document z 2010 r. (DOW-UAP-D128), który omawia zgłoszone obrażenia świadków na podstawie artykułu z pisma MUFON z 1981 r. i nieopublikowanych ustaleń, a nie podaje daty, miejsca, obiektu ani śmigłowców. Katalog National Archives nie ma żadnego zapisu o zdarzeniu, a akta sądowe i dokumentacja medyczna, na które powoływała się sprawa, nie mają adresu. Oceny nie miały na czym stać.',
    },
  },
  {
    kind: 'case',
    id: 'uss-omaha-2019',
    title: { en: 'USS Omaha (July 2019)', pl: 'USS Omaha (lipiec 2019)' },
    on: '2026-10-16',
    reason: {
      en: 'No document we can open names USS Omaha: not the Navy’s FOIA reading room, which holds the logs of other ships off San Diego in July 2019, not releases 01 to 06 of the Department of War, not RG 615 at the National Archives, and not AARO, the ODNI, NASA or the printed congressional hearings. The video that circulates under the ship’s name is known from a leak, and the confirmation of 2021 that Navy personnel took it only from the press. What the documents do hold, drones around other ships off San Diego in those weeks, is now in [Off San Diego, July 2019](/cases/san-diego-drones-2019). Release 05 has five recordings titled “Unresolved UAP Report, Pacific Ocean, 2019”, among them [DOW-UAP-PR124](/records/dow-uap-pr124); their descriptions name no ship and give no date beyond the year. The scores had nothing to stand on.',
      pl: 'Żaden dokument, który da się otworzyć, nie wymienia USS Omaha: ani czytelnia FOIA Marynarki Wojennej, która ma dzienniki innych okrętów u wybrzeży San Diego z lipca 2019 r., ani wydania 01–06 Departamentu Wojny, ani zespół RG 615 w Archiwach Narodowych USA, ani AARO, ODNI, NASA czy druki przesłuchań w Kongresie. Nagranie, które krąży pod nazwą okrętu, znamy z przecieku, a potwierdzenie z 2021 r., że nagrał je personel Marynarki Wojennej, tylko z prasy. To, co dokumenty rzeczywiście zawierają, czyli drony wokół innych okrętów u wybrzeży San Diego w tych tygodniach, jest teraz w sprawie [U wybrzeży San Diego, lipiec 2019](/cases/san-diego-drones-2019). Wydanie 05 ma pięć nagrań zatytułowanych „Unresolved UAP Report, Pacific Ocean, 2019” (nierozstrzygnięte zgłoszenie UAP, Ocean Spokojny, 2019), w tym [DOW-UAP-PR124](/records/dow-uap-pr124); ich opisy nie podają okrętu, a z daty tylko rok. Oceny nie miały na czym stać.',
    },
  },
];
