export interface Archive {
  country: string;        // ISO alpha-2
  countryName: string;
  program: string;
  years: string;
  status: 'active' | 'closed' | 'transformed';
  institution: string;
  publicDb: boolean;
  volume: string;
  note: string;
  url?: string;
}

export const archives: Archive[] = [
  {
    country: 'US', countryName: 'Stany Zjednoczone',
    program: 'Project SIGN → GRUDGE → BLUE BOOK',
    years: '1947–1969', status: 'closed',
    institution: 'United States Air Force',
    publicDb: true,
    volume: '12 618 zgłoszeń, 701 „unidentified"',
    note: 'Największy historyczny korpus na świecie. Zbiór obejmuje akta spraw, mikrofilmy, fotografie, filmy i materiały administracyjne, zdigitalizowane przez National Archives. Uwaga na definicję: „unidentified" znaczy „nie ustalono na podstawie dostępnych informacji", nie „potwierdzono nieziemskie".',
    url: 'https://www.archives.gov/research/military/air-force/ufos',
  },
  {
    country: 'US', countryName: 'Stany Zjednoczone',
    program: 'AARO (All-domain Anomaly Resolution Office)',
    years: '2022–obecnie', status: 'active',
    institution: 'Department of Defense',
    publicDb: true,
    volume: 'Ponad tysiąc spraw w zasobie; setki nowych zgłoszeń rocznie',
    note: 'Najważniejsza zmiana metodologiczna od czasów Blue Book: AARO rozbija dawną kategorię „unidentified" na trzy osobne — rozwiązane, nierozstrzygnięte z powodu braku danych oraz wymagające dalszej analizy. To rozróżnienie zmienia sposób liczenia całej dziedziny.',
    url: 'https://www.aaro.mil/',
  },
  {
    country: 'FR', countryName: 'Francja',
    program: 'GEPAN → SEPRA → GEIPAN',
    years: '1977–obecnie', status: 'active',
    institution: 'CNES — francuska agencja kosmiczna',
    publicDb: true,
    volume: 'Ponad 3300 przypadków w publicznej bazie',
    note: 'Najlepiej ustrukturyzowany publiczny zbiór na świecie. Klasyfikacja czteropoziomowa: A — zidentyfikowane, B — prawdopodobnie zidentyfikowane, C — brak wystarczających danych, D — niewyjaśnione po dochodzeniu. Kategoria D obejmuje ok. 3% zbioru i dzieli się dodatkowo na D1 i D2 według konsystencji materiału.',
    url: 'https://www.geipan.fr/',
  },
  {
    country: 'GB', countryName: 'Wielka Brytania',
    program: 'MOD UFO Desk / DI55',
    years: '1950–2009', status: 'closed',
    institution: 'Ministry of Defence',
    publicDb: true,
    volume: 'Kilkadziesiąt tysięcy stron udostępnionych partiami',
    note: 'Poważny problem archiwalny: do 1967 r. część dokumentacji UFO była niszczona w pięcioletnich odstępach, więc wiele starszych materiałów nie istnieje. Zbiór po 1970 r. jest znacznie kompletniejszy. Statystyki zgłoszeń pokazują wyraźną wrażliwość na uwagę mediów.',
    url: 'https://www.nationalarchives.gov.uk/ufos/',
  },
  {
    country: 'IT', countryName: 'Włochy',
    program: 'Rejestr obserwacji Aeronautica Militare',
    years: '1978–obecnie', status: 'active',
    institution: 'Aeronautica Militare',
    publicDb: true,
    volume: 'Nieprzerwany rejestr od 1978 r.',
    note: 'Jedno z niewielu państw, które przypisało zadanie konkretnej instytucji i nigdy tego nie odwołało. Dzięki temu istnieje jednolicie prowadzony rejestr obejmujący prawie pół wieku — zasób jakościowo porównywalny z GEIPAN i niemal całkowicie pominięty przez anglojęzyczną literaturę.',
    url: 'https://www.aeronautica.difesa.it/',
  },
  {
    country: 'CL', countryName: 'Chile',
    program: 'CEFAA → SEFAA',
    years: '1997–obecnie', status: 'transformed',
    institution: 'DGAC — chilijski urząd lotnictwa cywilnego',
    publicDb: true,
    volume: 'Publikowane rozstrzygnięcia spraw, także współczesnych',
    note: 'Nie organizacja ufologiczna, lecz komórka państwowego urzędu lotnictwa. Wymaga do analizy materiałów oryginalnych, nie zrzutów ekranu z komunikatorów, które niszczą dane potrzebne do badania. To standard, którego powinna wymagać cała dziedzina.',
    url: 'https://www.dgac.gob.cl/',
  },
  {
    country: 'CA', countryName: 'Kanada',
    program: 'Project Magnet, Project Second Storey, archiwum NRC',
    years: '1950–1995', status: 'closed',
    institution: 'Department of Transport, DND, National Research Council',
    publicDb: true,
    volume: 'Tysiące raportów, zdjęć, szkiców i map',
    note: 'Project Magnet jest często cytowany jako dowód, że rząd Kanady uznawał pozaziemskie pochodzenie UFO. To nadinterpretacja: taka była osobista teza prowadzącego program Wilberta Smitha, nie stanowisko państwa. Program zamknięto bez rozstrzygających rezultatów. Od 1968 r. zgłoszenia gromadziła NRC.',
    url: 'https://library-archives.canada.ca/',
  },
  {
    country: 'AU', countryName: 'Australia',
    program: 'Raporty obserwacji RAAF',
    years: '1950–1996', status: 'closed',
    institution: 'Royal Australian Air Force',
    publicDb: true,
    volume: 'Kilka tysięcy formularzy i raportów',
    note: 'Wzorowy przykład zdyscyplinowanej procedury: standardowy formularz z listą hipotez do kolejnego odhaczenia, gdzie „flying saucer" jest jedną z rubryk, a nie wnioskiem. Dokładnie tak pracują dziś GEIPAN i AARO.',
    url: 'https://www.naa.gov.au/',
  },
  {
    country: 'SE', countryName: 'Szwecja',
    program: 'Dochodzenie w sprawie Ghost Rockets i późniejszy zbiór FOI',
    years: '1946–obecnie', status: 'closed',
    institution: 'Szwedzkie siły zbrojne / FOI',
    publicDb: false,
    volume: 'Wielotysięczny zbiór dokumentów od 1946 r.',
    note: 'Pierwsze poważne państwowe dochodzenie w sprawie UAP w historii — rok przed obserwacją Kennetha Arnolda. To przesuwa właściwą datę początkową całej dziedziny z 1947 na 1946.',
  },
  {
    country: 'ES', countryName: 'Hiszpania',
    program: 'Akta UFO Ministerstwa Obrony',
    years: '1962–1995', status: 'closed',
    institution: 'Ministerio de Defensa / Ejército del Aire',
    publicDb: true,
    volume: 'Kilkadziesiąt spraw z pełną dokumentacją wojskową',
    note: 'Hiszpania przeprowadziła jedno z najbardziej uporządkowanych odtajnień w Europie i udostępniła akta w cyfrowej bibliotece resortu obrony. Zasób praktycznie nietknięty przez badaczy anglojęzycznych.',
    url: 'https://bibliotecavirtual.defensa.gob.es/',
  },
  {
    country: 'BR', countryName: 'Brazylia',
    program: 'Operação Prato, akta CINDACTA, zbiory FAB',
    years: '1954–obecnie', status: 'transformed',
    institution: 'Força Aérea Brasileira',
    publicDb: true,
    volume: 'Tysiące stron odtajnionych partiami od 2009 r.',
    note: 'Brazylia jest jedynym państwem, które skierowało jednostkę wojskową w teren z zadaniem systematycznego dokumentowania UAP (Operação Prato) i jedynym, którego minister publicznie potwierdził wielokrotne przechwycenia w ciągu dni od zdarzenia (1986).',
  },
  {
    country: 'NO', countryName: 'Norwegia',
    program: 'Project Hessdalen',
    years: '1983–obecnie', status: 'active',
    institution: 'Konsorcjum uczelni (m.in. Østfold University College)',
    publicDb: true,
    volume: 'Dane ekspedycji 1984 oraz ciągły monitoring automatyczny od 1998 r.',
    note: 'Jedyny program na świecie badający UAP jako powtarzalne zjawisko fizyczne, a nie jako zbiór zdarzeń historycznych. Automatyczna stacja pomiarowa rejestruje dolinę w sposób ciągły. To metodologicznie najbardziej zaawansowana inicjatywa w całej dziedzinie.',
  },
  {
    country: 'BE', countryName: 'Belgia',
    program: 'Dokumentacja fali 1989–1990',
    years: '1989–1991', status: 'closed',
    institution: 'Belgijskie siły powietrzne / SOBEPS',
    publicDb: true,
    volume: 'Zapisy radarowe F-16, raporty żandarmerii, tysiące zgłoszeń',
    note: 'Rzadki przypadek współpracy sił powietrznych z cywilnym stowarzyszeniem badawczym przy analizie. Zapisy radarowe F-16 są jednym z najważniejszych zbiorów danych w historii dziedziny — i jednym z najczęściej błędnie interpretowanych.',
  },
  {
    country: 'RU', countryName: 'ZSRR / Rosja',
    program: 'Program „Siatka" (Setka MO / Setka AN)',
    years: '1978–1990', status: 'closed',
    institution: 'Ministerstwo Obrony i Akademia Nauk ZSRR',
    publicDb: false,
    volume: 'Ok. 3000 zgłoszeń wg późniejszych relacji uczestników',
    note: 'Program powstał po fali wywołanej zjawiskiem nad Pietrozawodskiem. Znacząca część zgłoszeń została powiązana ze startami rakiet z kosmodromów — czyli z tajnymi programami własnego państwa. To najlepsza ilustracja mechanizmu, który generuje UAP bez udziału czegokolwiek nieznanego.',
  },
];

export const archivesByCountry = archives.reduce<Record<string, Archive[]>>((acc, a) => {
  (acc[a.country] ??= []).push(a);
  return acc;
}, {});
