import type { Lang } from '../i18n';
type Bi = Record<Lang, string>;

export interface Archive {
  country: string;
  countryName: Bi;
  program: string;
  years: string;
  status: 'active' | 'closed' | 'transformed';
  institution: Bi;
  publicDb: boolean;
  volume: Bi;
  note: Bi;
  ref?: string;
}

export const archives: Archive[] = [
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'Project SIGN → GRUDGE → BLUE BOOK',
    years: '1947–1969', status: 'closed', publicDb: true,
    institution: { en: 'United States Air Force', pl: 'United States Air Force' },
    volume: { en: '12,618 reports, 701 “unidentified”', pl: '12 618 zgłoszeń, 701 „unidentified”' },
    note: {
      en: 'The largest historical corpus in the world. The holding covers case files, microfilm, photographs, film and administrative records, digitised by the National Archives. Mind the definition: “unidentified” means “not determined from the available information”, not “confirmed non-terrestrial”.',
      pl: 'Największy historyczny korpus na świecie. Zbiór obejmuje akta spraw, mikrofilmy, fotografie, filmy i materiały administracyjne, zdigitalizowane przez National Archives. Uwaga na definicję: „unidentified” znaczy „nie ustalono na podstawie dostępnych informacji”, nie „potwierdzono nieziemskie”.',
    },
    ref: 'nara-bluebook',
  },
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'AARO (All-domain Anomaly Resolution Office)',
    years: '2022–present', status: 'active', publicDb: true,
    institution: { en: 'Department of Defense', pl: 'Department of Defense' },
    volume: { en: '319 new reports in FY2025: 274 air, 44 space, 1 maritime; 114 resolved', pl: '319 nowych zgłoszeń w roku 2025: 274 powietrzne, 44 kosmiczne, 1 morskie; 114 rozstrzygniętych' },
    note: {
      en: 'The most important methodological change since Blue Book: AARO breaks the old “unidentified” category into three — resolved, unresolved for lack of data, and requiring further analysis. That distinction changes how the whole field counts.',
      pl: 'Najważniejsza zmiana metodologiczna od czasów Blue Book: AARO rozbija dawną kategorię „unidentified” na trzy osobne, rozwiązane, nierozstrzygnięte z powodu braku danych oraz wymagające dalszej analizy. To rozróżnienie zmienia sposób liczenia całej dziedziny.',
    },
    ref: 'aaro',
  },
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'PURSUE (Presidential Unsealing and Reporting System for UAP Encounters)',
    years: '2026–present', status: 'active', publicDb: true,
    institution: { en: 'Department of War', pl: 'Department of War' },
    volume: { en: 'Five tranches between 8 May and 7 August 2026, released on a rolling basis', pl: 'Pięć transz między 8 maja a 7 sierpnia 2026, publikowane sukcesywnie' },
    note: {
      en: 'The largest release of holdings in this field since Blue Book was digitised. The tranches mix War Department records from 1947–1948 with recent AARO video and FBI witness interviews. Be precise about what this is: agencies are publishing files they held, not conclusions about what the files show. Nothing released so far asserts a non-human origin, and AARO’s own captions state what was reported, not what was established.',
      pl: 'Największe udostępnienie zasobu w tej dziedzinie od czasu digitalizacji Blue Book. Transze mieszają akta Departamentu Wojny z lat 1947–1948 z niedawnymi nagraniami AARO i protokołami przesłuchań FBI. Warto być tu precyzyjnym: agencje publikują akta, które miały, a nie wnioski o tym, co z tych akt wynika. Nic z dotychczas opublikowanych materiałów nie stwierdza pochodzenia nieludzkiego, a opisy AARO przy nagraniach mówią, co zgłoszono, nie co ustalono.',
    },
  },
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'UAP Records Collection (Record Group 615)',
    years: '2024–present', status: 'active', publicDb: true,
    institution: { en: 'National Archives and Records Administration', pl: 'National Archives and Records Administration' },
    volume: { en: 'Transfers from ODNI, the Department of Defense, the FAA and the Nuclear Regulatory Commission, added as they arrive', pl: 'Przekazania z ODNI, Departamentu Obrony, FAA i Nuclear Regulatory Commission, dokładane w miarę wpływania' },
    note: {
      en: 'Created under the 2024 National Defense Authorization Act, which obliges federal agencies to transfer digital copies of their UAP records to the National Archives. Structurally this is the more durable of the two American channels: PURSUE is a release programme run by the department that holds the files, RG 615 is an archive with a statutory accession requirement behind it. A release programme ends with an administration; an accession duty is harder to reverse.',
      pl: 'Powstała na mocy ustawy budżetowej obronnej z 2024 r., która zobowiązuje agencje federalne do przekazywania cyfrowych kopii akt UAP do archiwum państwowego. Strukturalnie to trwalszy z dwóch kanałów amerykańskich: PURSUE jest programem publikacyjnym prowadzonym przez resort, który te akta trzyma, a RG 615 archiwum z ustawowym obowiązkiem przejęcia. Program publikacyjny kończy się razem z administracją, obowiązek archiwalny jest trudniejszy do odwrócenia.',
    },
  },
  {
    country: 'FR',
    countryName: { en: 'France', pl: 'Francja' },
    program: 'GEPAN → SEPRA → GEIPAN',
    years: '1977–present', status: 'active', publicDb: true,
    institution: { en: 'CNES — the French space agency', pl: 'CNES, francuska agencja kosmiczna' },
    volume: { en: 'Over 3,300 cases in a public database', pl: 'Ponad 3300 przypadków w publicznej bazie' },
    note: {
      en: 'The best-structured public collection in the world. A four-level classification: A identified, B probably identified, C insufficient data, D unexplained after investigation. Category D covers roughly 3% of the set and is further split into D1 and D2 by the consistency of the material.',
      pl: 'Najlepiej ustrukturyzowany publiczny zbiór na świecie. Klasyfikacja czteropoziomowa: A, zidentyfikowane, B, prawdopodobnie zidentyfikowane, C, brak wystarczających danych, D, niewyjaśnione po dochodzeniu. Kategoria D obejmuje ok. 3% zbioru i dzieli się dodatkowo na D1 i D2 według konsystencji materiału.',
    },
    ref: 'geipan',
  },
  {
    country: 'GB',
    countryName: { en: 'United Kingdom', pl: 'Wielka Brytania' },
    program: 'MOD UFO Desk / DI55',
    years: '1950–2009', status: 'closed', publicDb: true,
    institution: { en: 'Ministry of Defence', pl: 'Ministry of Defence' },
    volume: { en: 'Tens of thousands of pages released in batches', pl: 'Kilkadziesiąt tysięcy stron udostępnionych partiami' },
    note: {
      en: 'A serious archival problem: until 1967 part of the UFO documentation was destroyed on a five-year cycle, so much older material no longer exists. The post-1970 holding is far more complete. Report statistics show a marked sensitivity to media attention.',
      pl: 'Poważny problem archiwalny: do 1967 r. część dokumentacji UFO była niszczona w pięcioletnich odstępach, więc wiele starszych materiałów nie istnieje. Zbiór po 1970 r. jest znacznie kompletniejszy. Statystyki zgłoszeń pokazują wyraźną wrażliwość na uwagę mediów.',
    },
    ref: 'tna-ufo',
  },
  {
    country: 'IT',
    countryName: { en: 'Italy', pl: 'Włochy' },
    program: 'Aeronautica Militare sighting register',
    years: '1978–present', status: 'active', publicDb: true,
    institution: { en: 'Aeronautica Militare', pl: 'Aeronautica Militare' },
    volume: { en: 'An unbroken register since 1978', pl: 'Nieprzerwany rejestr od 1978 r.' },
    note: {
      en: 'One of very few states that assigned the task to a named institution and never revoked it. The result is a uniformly maintained register spanning nearly half a century — comparable in quality to GEIPAN and almost entirely overlooked by English-language literature.',
      pl: 'Jedno z niewielu państw, które przypisało zadanie konkretnej instytucji i nigdy tego nie odwołało. Dzięki temu istnieje jednolicie prowadzony rejestr obejmujący prawie pół wieku, zasób jakościowo porównywalny z GEIPAN i niemal całkowicie pominięty przez anglojęzyczną literaturę.',
    },
    ref: 'am-ovni',
  },
  {
    country: 'CL',
    countryName: { en: 'Chile', pl: 'Chile' },
    program: 'CEFAA → SEFAA',
    years: '1997–present', status: 'transformed', publicDb: true,
    institution: { en: 'DGAC — the Chilean civil aviation authority', pl: 'DGAC, chilijski urząd lotnictwa cywilnego' },
    volume: { en: 'Published case resolutions, including contemporary ones', pl: 'Publikowane rozstrzygnięcia spraw, także współczesnych' },
    note: {
      en: 'Not a ufology group but a unit of the state civil aviation authority. It requires original material for analysis, not screenshots from messaging apps, which destroy the data the work depends on. That is the standard the whole field should demand.',
      pl: 'Nie organizacja ufologiczna, lecz komórka państwowego urzędu lotnictwa. Wymaga do analizy materiałów oryginalnych, nie zrzutów ekranu z komunikatorów, które niszczą dane potrzebne do badania. To standard, którego powinna wymagać cała dziedzina.',
    },
    ref: 'cl-sefaa',
  },
  {
    country: 'CA',
    countryName: { en: 'Canada', pl: 'Kanada' },
    program: 'Project Magnet, Project Second Storey, NRC archive',
    years: '1950–1995', status: 'closed', publicDb: true,
    institution: { en: 'Department of Transport, DND, National Research Council', pl: 'Department of Transport, DND, National Research Council' },
    volume: { en: 'Thousands of reports, photographs, sketches and maps', pl: 'Tysiące raportów, zdjęć, szkiców i map' },
    note: {
      en: 'Project Magnet is often cited as proof that the Canadian government accepted an extraterrestrial origin for UFOs. That is an over-reading: it was the personal thesis of the programme lead, Wilbert Smith, not a state position. The programme closed without conclusive results. From 1968 the NRC collected reports.',
      pl: 'Project Magnet jest często cytowany jako dowód, że rząd Kanady uznawał pozaziemskie pochodzenie UFO. To nadinterpretacja: taka była osobista teza prowadzącego program Wilberta Smitha, nie stanowisko państwa. Program zamknięto bez rozstrzygających rezultatów. Od 1968 r. zgłoszenia gromadziła NRC.',
    },
    ref: 'lac-ufo-timeline',
  },
  {
    country: 'AU',
    countryName: { en: 'Australia', pl: 'Australia' },
    program: 'RAAF sighting reports',
    years: '1950–1996', status: 'closed', publicDb: true,
    institution: { en: 'Royal Australian Air Force', pl: 'Royal Australian Air Force' },
    volume: { en: 'Several thousand forms and reports', pl: 'Kilka tysięcy formularzy i raportów' },
    note: {
      en: 'A model of disciplined procedure: a standard form with a list of hypotheses to be worked through in order, where “flying saucer” is one of the boxes rather than a conclusion. This is exactly how GEIPAN and AARO work today.',
      pl: 'Wzorowy przykład zdyscyplinowanej procedury: standardowy formularz z listą hipotez do kolejnego odhaczenia, gdzie „flying saucer” jest jedną z rubryk, a nie wnioskiem. Dokładnie tak pracują dziś GEIPAN i AARO.',
    },
    ref: 'naa-ufo',
  },
  {
    country: 'SE',
    countryName: { en: 'Sweden', pl: 'Szwecja' },
    program: 'Ghost Rockets investigation and the later FOI holding',
    years: '1946–present', status: 'closed', publicDb: false,
    institution: { en: 'Swedish Armed Forces / FOI', pl: 'Szwedzkie siły zbrojne / FOI' },
    volume: { en: 'Thousands of documents from 1946 onward', pl: 'Wielotysięczny zbiór dokumentów od 1946 r.' },
    note: {
      en: 'The first serious state investigation into UAP in history — a year before the Kenneth Arnold sighting. This moves the field’s true starting date from 1947 to 1946.',
      pl: 'Pierwsze poważne państwowe dochodzenie w sprawie UAP w historii, rok przed obserwacją Kennetha Arnolda. To przesuwa właściwą datę początkową całej dziedziny z 1947 na 1946.',
    },
  },
  {
    country: 'ES',
    countryName: { en: 'Spain', pl: 'Hiszpania' },
    program: 'Ministry of Defence UFO files',
    years: '1962–1995', status: 'closed', publicDb: true,
    institution: { en: 'Ministerio de Defensa / Ejército del Aire', pl: 'Ministerio de Defensa / Ejército del Aire' },
    volume: { en: '80 files, about 1,900 pages of military documentation', pl: '80 spraw, ok. 1900 stron dokumentacji wojskowej' },
    note: {
      en: 'Spain ran one of the most orderly declassifications in Europe and made the files available in the defence ministry’s digital library. A resource practically untouched by English-language researchers.',
      pl: 'Hiszpania przeprowadziła jedno z najbardziej uporządkowanych odtajnień w Europie i udostępniła akta w cyfrowej bibliotece resortu obrony. Zasób praktycznie nietknięty przez badaczy anglojęzycznych.',
    },
    ref: 'es-ovni',
  },
  {
    country: 'BR',
    countryName: { en: 'Brazil', pl: 'Brazylia' },
    program: 'Operação Prato, CINDACTA files, FAB holdings, SIOANI',
    years: '1952–present', status: 'transformed', publicDb: true,
    institution: { en: 'Força Aérea Brasileira / Arquivo Nacional', pl: 'Força Aérea Brasileira / Arquivo Nacional' },
    volume: { en: '743 records in the National Archives UFO fund, 1952–2016', pl: '743 jednostki w zespole OVNI Archiwum Narodowego, 1952–2016' },
    note: {
      en: 'Brazil is the only state that sent a military unit into the field to systematically document UAP (Operação Prato), and the only one whose minister publicly confirmed multiple intercepts within days of the event (1986). The holding is among the most consulted in the National Archives.',
      pl: 'Brazylia jest jedynym państwem, które skierowało jednostkę wojskową w teren z zadaniem systematycznego dokumentowania UAP (Operação Prato) i jedynym, którego minister publicznie potwierdził wielokrotne przechwycenia w ciągu dni od zdarzenia (1986). Zespół należy do najczęściej odwiedzanych w Archiwum Narodowym.',
    },
    ref: 'br-an-ovni',
  },
  {
    country: 'NO',
    countryName: { en: 'Norway', pl: 'Norwegia' },
    program: 'Project Hessdalen',
    years: '1983–present', status: 'active', publicDb: true,
    institution: { en: 'A university consortium (incl. Østfold University College)', pl: 'Konsorcjum uczelni (m.in. Østfold University College)' },
    volume: { en: '1984 expedition data plus continuous automatic monitoring since 1998', pl: 'Dane ekspedycji 1984 oraz ciągły monitoring automatyczny od 1998 r.' },
    note: {
      en: 'The only programme in the world studying UAP as a repeatable physical phenomenon rather than a set of historical events. An automatic station records the valley continuously. Methodologically the most advanced initiative in the field.',
      pl: 'Jedyny program na świecie badający UAP jako powtarzalne zjawisko fizyczne, a nie jako zbiór zdarzeń historycznych. Automatyczna stacja pomiarowa rejestruje dolinę w sposób ciągły. Metodologicznie najbardziej zaawansowana inicjatywa w całej dziedzinie.',
    },
    ref: 'hessdalen',
  },
  {
    country: 'BE',
    countryName: { en: 'Belgium', pl: 'Belgia' },
    program: 'Documentation of the 1989–1990 wave',
    years: '1989–1991', status: 'closed', publicDb: true,
    institution: { en: 'Belgian Air Force / SOBEPS', pl: 'Belgijskie siły powietrzne / SOBEPS' },
    volume: { en: 'F-16 radar recordings, gendarmerie reports, thousands of sightings', pl: 'Zapisy radarowe F-16, raporty żandarmerii, tysiące zgłoszeń' },
    note: {
      en: 'A rare instance of an air force collaborating with a civilian research association on the analysis. The F-16 radar recordings are among the most important datasets in the field’s history — and among the most frequently misread.',
      pl: 'Rzadki przypadek współpracy sił powietrznych z cywilnym stowarzyszeniem badawczym przy analizie. Zapisy radarowe F-16 są jednym z najważniejszych zbiorów danych w historii dziedziny i jednym z najczęściej błędnie interpretowanych.',
    },
  },
  {
    country: 'RU',
    countryName: { en: 'USSR / Russia', pl: 'ZSRR / Rosja' },
    program: 'Setka MO / Setka AN (“the Grid”)',
    years: '1978–1990', status: 'closed', publicDb: false,
    institution: { en: 'USSR Ministry of Defence and Academy of Sciences', pl: 'Ministerstwo Obrony i Akademia Nauk ZSRR' },
    volume: { en: 'About 3,000 reports per later participant accounts', pl: 'Ok. 3000 zgłoszeń wg późniejszych relacji uczestników' },
    note: {
      en: 'The programme was created after the wave triggered by the Petrozavodsk phenomenon. A significant share of reports was tied to rocket launches from Soviet cosmodromes — that is, to the state’s own classified programmes. It is the clearest illustration of the mechanism that generates UAP with nothing unknown involved.',
      pl: 'Program powstał po fali wywołanej zjawiskiem nad Pietrozawodskiem. Znacząca część zgłoszeń została powiązana ze startami rakiet z kosmodromów, czyli z tajnymi programami własnego państwa. To najlepsza ilustracja mechanizmu, który generuje UAP bez udziału czegokolwiek nieznanego.',
    },
  },
];
