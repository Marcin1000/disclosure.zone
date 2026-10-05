import type { Lang } from '../i18n';
type Bi = Record<Lang, string>;

export interface Archive {
  country: string;
  countryName: Bi;
  program: string;
  years: string;
  /** unknown: żaden dokument nie mówi, czy program działa, zamknięto go, czy przekształcono. */
  status: 'active' | 'closed' | 'transformed' | 'unknown';
  institution: Bi;
  /** true: zbiór jest publicznie dostępny (baza, katalog albo opublikowane listy); null: nie wiadomo, strona pokazuje to tak samo jak false. */
  publicDb: boolean | null;
  volume: Bi;
  note: Bi;
  ref?: string;
  /** Klucz z sources.ts dla strony z liczbami podanymi we wpisie, gdy to nie ta sama strona co ref. */
  volumeRef?: string;
}

export const archives: Archive[] = [
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'Project SIGN → GRUDGE → BLUE BOOK',
    years: '1947–1969', status: 'closed', publicDb: true,
    institution: { en: 'United States Air Force', pl: 'United States Air Force' },
    volume: { en: '12,618 sightings reported 1947–1969, 701 “Unidentified”', pl: '12 618 zgłoszonych obserwacji z lat 1947–1969, 701 „Unidentified” (niezidentyfikowane)' },
    note: {
      en: 'Project Sign and Project Grudge preceded Blue Book. The National Archives holds about 2 cubic feet of administrative files, 37 of case files and 3 of OSI records, consulted on 94 rolls of microfilm, with film, sound and stills in separate branches; the sanitized case files are in the National Archives Catalog as 10,622 file units with 116,537 digital objects. The 12,618 and 701 come from the Air Force fact sheet of January 1985, which also says that “there has been no evidence indicating that sightings categorized as ‘unidentified’ are extraterrestrial vehicles.”',
      pl: 'Blue Book poprzedziły Project Sign i Project Grudge. National Archives przechowuje ok. 2 stóp sześciennych akt administracyjnych, 37 stóp akt spraw i 3 stopy akt OSI, udostępnianych na 94 rolkach mikrofilmu, a filmy, nagrania i zdjęcia w osobnych działach; oczyszczone akta spraw są w katalogu National Archives jako 10 622 jednostki z 116 537 obiektami cyfrowymi. Liczby 12 618 i 701 pochodzą z karty informacyjnej Sił Powietrznych ze stycznia 1985 r., która stwierdza też: „there has been no evidence indicating that sightings categorized as ‚unidentified’ are extraterrestrial vehicles”, czyli nie ma dowodu, że obserwacje zaliczone do niezidentyfikowanych to pojazdy pozaziemskie.',
    },
    ref: 'nara-bluebook',
    // 12 618 i 701 są na stronie z ref; volumeRef to katalog z liczbą jednostek i obiektów cyfrowych z noty.
    volumeRef: 'nara-bluebook-sanitized',
  },
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'AARO (All-domain Anomaly Resolution Office)',
    years: '2022–present', status: 'active', publicDb: true,
    institution: { en: 'Department of Defense (Department of War)', pl: 'Department of Defense (Department of War)' },
    volume: { en: '319 reports received from 2 June 2024 to 30 May 2025 (FY2025 report): 274 air, 44 space, 1 maritime; 114 resolved', pl: '319 zgłoszeń otrzymanych od 2 czerwca 2024 do 30 maja 2025 r. (raport za rok budżetowy 2025): 274 powietrzne, 44 kosmiczne, 1 morskie; 114 rozstrzygniętych' },
    note: {
      en: 'Established on 15 July 2022. The FY2025 report sorts the 319 reports into resolved (114), “meriting further analysis” (9) and the “active archive”, “a category of UAP reports with insufficient data” (191); three more await closure. The report: “A lack of timely and actionable sensor data continues to constrain AARO’s ability to resolve cases.”',
      pl: 'Utworzone 15 lipca 2022 r. Raport za rok budżetowy 2025 dzieli 319 zgłoszeń na rozstrzygnięte (114), „meriting further analysis”, czyli wymagające dalszej analizy (9), oraz „active archive”, czyli archiwum zgłoszeń z niewystarczającymi danymi (191); trzy kolejne czekają na zamknięcie. Raport stwierdza: „A lack of timely and actionable sensor data continues to constrain AARO’s ability to resolve cases”, czyli brak aktualnych i użytecznych danych z sensorów wciąż ogranicza rozstrzyganie spraw.',
    },
    ref: 'aaro',
    volumeRef: 'aaro-fy25',
  },
  {
    // Liczby rekordów i agencji pochodzą z naszego rejestru (src/data/records.json); po nowym wydaniu poprawić je razem z README.
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'PURSUE (Presidential Unsealing and Reporting System for UAP Encounters)',
    years: '2026–present', status: 'active', publicDb: true,
    institution: { en: 'Department of War', pl: 'Department of War' },
    volume: { en: 'Six tranches between 8 May and 18 September 2026; 450 records in our registry', pl: 'Sześć transz między 8 maja a 18 września 2026 r.; 450 rekordów w naszym rejestrze' },
    note: {
      en: 'The Department of War, with support from ODNI, releases the records “on a rolling basis as they are discovered and declassified, with tranches posted every few weeks”, and describes them as “unresolved cases, meaning the government is unable to make a definitive determination on the nature of the observed phenomena”. In our registry they date from 1944 to 2026: War 250, FBI 103, NASA 41, CIA 23, State 9, Energy 5, other 19.',
      pl: 'Departament Wojny przy wsparciu ODNI publikuje akta „on a rolling basis as they are discovered and declassified, with tranches posted every few weeks”, czyli w miarę odnajdywania i odtajniania, transzami co kilka tygodni, i opisuje je jako „unresolved cases, meaning the government is unable to make a definitive determination on the nature of the observed phenomena”, czyli sprawy, w których rząd nie potrafi jednoznacznie ustalić natury zjawisk. W naszym rejestrze akta pochodzą z lat 1944–2026: Departament Wojny 250, FBI 103, NASA 41, CIA 23, Departament Stanu 9, Departament Energii 5, pozostałe 19.',
    },
    ref: 'pursue',
  },
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'UAP Records Collection (Record Group 615)',
    years: '2023–present', status: 'active', publicDb: true,
    institution: { en: 'National Archives and Records Administration', pl: 'National Archives and Records Administration' },
    volume: { en: 'Series from nine agencies so far (FAA, NRC, ODNI, OSD, NSA, State, FBI, Air Force, CBP); 717 items with 719 digital objects in the Catalog', pl: 'Dotąd serie z dziewięciu instytucji (FAA, NRC, ODNI, OSD, NSA, Departament Stanu, FBI, Siły Powietrzne, CBP); 717 jednostek z 719 obiektami cyfrowymi w katalogu' },
    note: {
      en: 'Established under sections 1841–1843 of the 2024 National Defense Authorization Act, which “requires federal agencies to transfer digital copies of all UAP records to NARA”. NARA set 30 September 2025 as the deadline for releasable records identified by 20 October 2024 and adds series to the online Catalog as they arrive. PURSUE is a release programme of the Department of War; RG 615 is the archive into which agencies must transfer their records.',
      pl: 'Utworzony na mocy sekcji 1841–1843 ustawy budżetowej obronnej z 2024 r., która „requires federal agencies to transfer digital copies of all UAP records to NARA”, czyli zobowiązuje agencje do przekazania NARA cyfrowych kopii wszystkich akt UAP. NARA wyznaczyła termin 30 września 2025 r. dla akt możliwych do ujawnienia, zidentyfikowanych do 20 października 2024 r., i dodaje serie do katalogu online w miarę ich wpływania. PURSUE to program publikacji Departamentu Wojny; RG 615 to archiwum, do którego agencje muszą przekazywać akta.',
    },
    ref: 'nara-rg615',
    volumeRef: 'nara-rg615-catalog',
  },
  {
    country: 'US',
    countryName: { en: 'United States', pl: 'Stany Zjednoczone' },
    program: 'AAWSAP (Advanced Aerospace Weapon System Applications Program)',
    years: '2008–2010', status: 'closed', publicDb: true,
    institution: { en: 'Defense Intelligence Agency', pl: 'Defense Intelligence Agency' },
    volume: { en: 'One contract, HHM402-08-C-0072, and five modifications: $21,948,810 obligated across a base year and one option year', pl: 'Jedna umowa, HHM402-08-C-0072, i pięć modyfikacji: 21 948 810 $ zobowiązane na rok bazowy i jeden rok opcyjny' },
    note: {
      en: 'A contract, not an investigating office. The statement of objectives of 18 July 2008, which names the DIA’s Acquisition Support Division in its background section, sets the goal: “to understand the physics and engineering” of breakthrough aerospace applications “as they apply to the foreign threat out to the far term, i.e., from now through the year 2050”, in twelve technical areas from lift and propulsion to “spatial/temporal translation” and “human effects”, with work classified up to TS/SCI. The solicitation went out on 1 September 2008 as an unrestricted request for proposals with offers due on 10 September; on 22 September 2008 the award went to Bigelow Aerospace Advanced Space Studies of Las Vegas, firm fixed price, a base year whose six line items add up to $10,000,000 (our sum) and four option years anticipated. Modification P00001 (September 2009) exercised the first option “subject to availability of funds”, with line items adding up to $25,000,000 (our sum), and contradicts itself on dates: its text moves the option year to 1 October 2009 – 30 September 2010, its own schedule gives 22 September 2009 – 21 September 2010. P00002 (February 2010) funded the option at $11,948,810 and called for the impacts and technical risks of the “reduced funding”; P00003 changed the contracting officer’s representative; P00005 extended the period to 21 December 2010 with no new money. Clause 52.227-17 gives the government unlimited rights in all data produced under the contract and bars the contractor from publishing any of it without the contracting officer’s written permission. Read the published order with care: it is a conformed copy, not the 2008 document. It already carries the total of $21,948,810, the option-year lines as rewritten by P00002, ending on 21 December 2010 as set by P00005, and a form footer dated 2012. Not released: the BAASS proposal the order incorporates by reference, the P00002 attachment on the impact of the cut, the text of P00004 (only its distribution sheet is out), and anything after 21 December 2010. None of the seven contract documents uses the words UFO, UAP, unidentified, anomalous or paranormal. The contract documents and 37 DIRDs are public in PURSUE release 06 (18 September 2026).',
      pl: 'Umowa, a nie urząd prowadzący badania. Zestawienie celów z 18 lipca 2008 r., które w części wstępnej wymienia wydział wsparcia zamówień DIA, określa cel: „to understand the physics and engineering”, czyli zrozumieć fizykę i inżynierię przełomowych zastosowań lotniczo-kosmicznych „as they apply to the foreign threat out to the far term, i.e., from now through the year 2050”, w odniesieniu do zagrożenia zagranicznego do 2050 r., w dwunastu obszarach technicznych od siły nośnej i napędu po „spatial/temporal translation” i „human effects”, z pracami utajnionymi do poziomu TS/SCI. Zapytanie ofertowe wydano 1 września 2008 r. jako nieograniczone, z terminem składania ofert 10 września. 22 września 2008 r. umowę przyznano firmie Bigelow Aerospace Advanced Space Studies z Las Vegas: cena stała, rok bazowy, którego sześć pozycji daje razem 10 000 000 $ (nasze wyliczenie), i przewidywane cztery lata opcyjne. Modyfikacja P00001 (wrzesień 2009) uruchomiła pierwszą opcję „subject to availability of funds”, z pozycjami dającymi razem 25 000 000 $ (nasze wyliczenie), i sama sobie przeczy co do dat: jej tekst przesuwa rok opcyjny na 1 października 2009 – 30 września 2010, a jej własny harmonogram podaje 22 września 2009 – 21 września 2010. P00002 (luty 2010) sfinansowała opcję kwotą 11 948 810 $ i poleciła wskazać skutki oraz ryzyka techniczne „reduced funding”, czyli zmniejszonego finansowania. P00003 zmieniła przedstawiciela oficera kontraktowego, a P00005 przedłużyła okres do 21 grudnia 2010 r. bez nowych pieniędzy. Klauzula 52.227-17 daje rządowi nieograniczone prawa do wszystkich danych wytworzonych w ramach umowy i zakazuje wykonawcy publikowania czegokolwiek z nich bez pisemnej zgody oficera kontraktowego. Opublikowane zamówienie trzeba czytać ostrożnie: to egzemplarz ujednolicony, a nie dokument z 2008 r. Zawiera już łączną kwotę 21 948 810 $, linie roku opcyjnego w brzmieniu z P00002, z końcem 21 grudnia 2010 r. ustalonym przez P00005, i stopkę formularza z 2012 r. Nie opublikowano: oferty BAASS, którą zamówienie włącza przez odesłanie, załącznika P00002 o skutkach cięcia, treści P00004 (ujawniono tylko jej listę dystrybucyjną) ani niczego po 21 grudnia 2010 r. W żadnym z siedmiu dokumentów umowy nie pada słowo UFO, UAP, unidentified, anomalous ani paranormal. Dokumenty umowy i 37 raportów DIRD są publiczne w wydaniu 06 PURSUE (18 września 2026 r.).',
    },
    ref: 'pursue-d110',
    volumeRef: 'pursue-d113',
  },
  {
    country: 'FR',
    countryName: { en: 'France', pl: 'Francja' },
    program: 'GEPAN → SEPRA → GEIPAN',
    years: '1977–present', status: 'active', publicDb: true,
    institution: { en: 'CNES — the French space agency', pl: 'CNES, francuska agencja kosmiczna' },
    volume: { en: 'Over 3,000 gendarmerie reports forwarded since 1974, as of 1999 (COMETA report); current GEIPAN figure not checked', pl: 'Ponad 3000 raportów żandarmerii przekazanych od 1974 r., stan na 1999 r. (raport COMETA); bieżącej liczby GEIPAN nie sprawdzono' },
    note: {
      en: 'GEPAN, within the French space agency CNES, received a copy of gendarmerie reports from May 1977; SEPRA succeeded it in 1988. Each case goes into one of four categories: A, completely identified; B, probably identified; C, not identifiable for lack of data; D, not identifiable despite the abundance and quality of the data. The COMETA report of 1999, held in release 01, put category D at “4 to 5% of the cases”.',
      pl: 'GEPAN, działający w ramach francuskiej agencji kosmicznej CNES, od maja 1977 r. otrzymywał kopie raportów żandarmerii; w 1988 r. zastąpił go SEPRA. Każda sprawa trafia do jednej z czterech kategorii: A, zjawisko w pełni zidentyfikowane; B, prawdopodobnie zidentyfikowane; C, niemożliwe do zidentyfikowania z braku danych; D, niemożliwe do zidentyfikowania mimo obfitości i jakości danych. Raport COMETA z 1999 r., zawarty w wydaniu 01, określał udział kategorii D na „4 to 5% of the cases”, czyli 4 do 5% przypadków.',
    },
    ref: 'geipan',
    // Strony statystyk i klasyfikacji GEIPAN odpowiadały 5 X 2026 kodem 429, więc liczby pochodzą z raportu COMETA (s. 29, 30, 33).
    volumeRef: 'pursue-rg255-cometa',
  },
  {
    // Status unknown: przewodnik TNA podaje tylko, że ostatnia teczka polityki UFO obejmuje 2009 r., a o zamknięciu nie mówi.
    country: 'GB',
    countryName: { en: 'United Kingdom', pl: 'Wielka Brytania' },
    program: 'Ministry of Defence UFO files / DI55',
    years: '1950–2009', status: 'unknown', publicDb: true,
    institution: { en: 'Ministry of Defence', pl: 'Ministry of Defence' },
    volume: { en: '209 files, about 52,000 pages, opened in ten tranches, 2008–2013', pl: '209 teczek, ok. 52 000 stron, otwartych w dziesięciu transzach w latach 2008–2013' },
    note: {
      en: 'The British government began its first official inquiry in 1950. Until 1967 the MoD destroyed UFO files at five-yearly intervals, so many records from before 1962 are lost; the policy was rescinded in 1970. From 1967 incidents of possible defence significance went to the Defence Intelligence branch DI55; more than 11,000 reports were logged between 1959 and 2007. The final UFO policy file covers 2009.',
      pl: 'Rząd brytyjski rozpoczął pierwsze oficjalne badanie w 1950 r. Do 1967 r. MoD niszczyło teczki UFO co pięć lat, więc wiele akt sprzed 1962 r. przepadło; zasadę uchylono w 1970 r. Od 1967 r. zdarzenia o możliwym znaczeniu obronnym trafiały do wydziału wywiadu obronnego DI55; w latach 1959–2007 zarejestrowano ponad 11 000 zgłoszeń. Ostatnia teczka polityki UFO obejmuje 2009 r.',
    },
    ref: 'tna-ufo-guide',
  },
  {
    country: 'IT',
    countryName: { en: 'Italy', pl: 'Włochy' },
    program: 'Aeronautica Militare sighting register',
    years: '1978–present', status: 'active', publicDb: true,
    institution: { en: 'Aeronautica Militare', pl: 'Aeronautica Militare' },
    volume: { en: 'Sighting lists published by the Air Force: 208 sightings for 1972–1990, 112 for 1991–2000, then one list a year up to 2026', pl: 'Listy obserwacji publikowane przez lotnictwo: 208 obserwacji za lata 1972–1990, 112 za lata 1991–2000, potem lista na każdy rok do 2026 r.' },
    note: {
      en: 'After the wave of sightings in 1978, Prime Minister Giulio Andreotti designated the Air Force “as the institutional body responsible for collecting, verifying, and monitoring UFO-related reports”; today the General Security Department of the Air Force Staff carries it out. A report is made on a form handed in at a Carabinieri station; once the investigation is complete the incident is published, and if no technical or natural explanation is found it is classified as a UFO sighting.',
      pl: 'Po fali obserwacji z 1978 r. premier Giulio Andreotti wyznaczył lotnictwo wojskowe „as the institutional body responsible for collecting, verifying, and monitoring UFO-related reports”, czyli na instytucję odpowiedzialną za zbieranie, weryfikowanie i monitorowanie zgłoszeń; dziś zajmuje się tym Departament Bezpieczeństwa Ogólnego Sztabu Sił Powietrznych. Zgłoszenie składa się na formularzu w posterunku karabinierów; po dochodzeniu zdarzenie jest publikowane, a gdy brak wyjaśnienia technicznego lub naturalnego, zostaje sklasyfikowane jako obserwacja UFO.',
    },
    ref: 'am-ovni',
    // Tabela zbiorcza za lata 1972–1990 (208); liczba 112 jest w osobnej tabeli za lata 1991–2000, podlinkowanej na stronie z ref.
    volumeRef: 'am-ovni-1972-1990',
  },
  {
    country: 'CL',
    countryName: { en: 'Chile', pl: 'Chile' },
    program: 'CEFAA → SEFAA',
    years: '1997–present', status: 'transformed', publicDb: true,
    institution: { en: 'DGAC — the Chilean civil aviation authority', pl: 'DGAC, chilijski urząd lotnictwa cywilnego' },
    volume: { en: 'Resolved cases published monthly; yearly lists 2018–2026', pl: 'Rozstrzygnięte sprawy publikowane co miesiąc; zestawienia roczne 2018–2026' },
    note: {
      en: 'Not a ufology group but a section of the state civil aviation authority: CEFAA was created on 3 October 1997 and became SEFAA on 18 October 2021. Without photographs or video it opens no investigation, and it asks for files “en su estado original” (in their original state): no screenshots, and no files passed through messaging apps such as WhatsApp or social networks, because such apps “alteran el material” (alter the material).',
      pl: 'Nie organizacja ufologiczna, lecz sekcja państwowego urzędu lotnictwa cywilnego: CEFAA powstał 3 października 1997 r., a 18 października 2021 r. stał się SEFAA. Bez zdjęć lub nagrań nie wszczyna dochodzenia i prosi o pliki „en su estado original”, czyli w stanie oryginalnym: bez zrzutów ekranu i bez plików z komunikatorów, takich jak WhatsApp, ani z sieci społecznościowych, bo takie aplikacje „alteran el material”, czyli zmieniają materiał.',
    },
    ref: 'cl-sefaa',
  },
  {
    // Stara strona z osią czasu (lac-ufo-timeline) 5 X 2026 nie odpowiadała; o Project Magnet żadna żywa strona nic nie mówi.
    country: 'CA',
    countryName: { en: 'Canada', pl: 'Kanada' },
    program: 'Canada’s UFOs: The Search for the Unknown (Library and Archives Canada)',
    years: '1947–?', status: 'unknown', publicDb: true,
    institution: { en: 'Department of National Defence, Department of Transport, National Research Council, RCMP; held by Library and Archives Canada', pl: 'Department of National Defence, Department of Transport, National Research Council, RCMP; zbiór w Library and Archives Canada' },
    volume: { en: 'About 9,500 digitized documents accumulated between 1947 and the early 1980s', pl: 'Ok. 9500 zdigitalizowanych dokumentów zgromadzonych od 1947 r. do początku lat 80.' },
    note: {
      en: 'Library and Archives Canada describes the set as “all records filed with the federal government on UFOs”: correspondence, reports, memos and procedures, some on particular sightings, others reporting forms and procedures. About half name a sighting location.',
      pl: 'Library and Archives Canada opisuje zbiór jako „all records filed with the federal government on UFOs”, czyli wszystkie akta w sprawie UFO złożone u rządu federalnego: korespondencję, raporty, notatki i procedury, część o konkretnych obserwacjach, część to formularze i procedury zgłaszania. Mniej więcej połowa podaje miejsce obserwacji.',
    },
    ref: 'lac-ufos',
  },
  {
    country: 'AU',
    countryName: { en: 'Australia', pl: 'Australia' },
    program: 'RAAF sighting reports',
    years: '?–1994', status: 'closed', publicDb: true,
    institution: { en: 'Royal Australian Air Force', pl: 'Royal Australian Air Force' },
    volume: { en: 'Not known: the archive page gives no number', pl: 'Nie wiadomo: strona archiwum nie podaje liczby' },
    note: {
      en: 'People who thought they had seen a flying saucer usually reported it to the RAAF, “which had special forms to document the details”; the records are kept in the National Archives of Australia. The RAAF ceased investigating UFO sightings in 1994, “reasoning that only 3 per cent of reports could not be explained by natural phenomena”.',
      pl: 'Osoby przekonane, że widziały latający spodek, zgłaszały to zwykle RAAF, „which had special forms to document the details”, czyli lotnictwu, które miało specjalne formularze do opisu szczegółów; akta przechowuje National Archives of Australia. RAAF przestał badać zgłoszenia w 1994 r., „reasoning that only 3 per cent of reports could not be explained by natural phenomena”, czyli uznając, że tylko 3 procent zgłoszeń nie dało się wyjaśnić zjawiskami naturalnymi.',
    },
    ref: 'naa-ufo',
  },
  {
    // Wpis z wydań USA (przegląd wywiadu z 9 I 1947, DOW-UAP-D099, s. 18–19; notatka G-2 z 1950 r., teczka FBI 62-HQ-83894,
    // Section 5, s. 157) i z zapisu podcastu Riksarkivet (ra-spokraketer), który jest relacją archiwisty, a nie dokumentem.
    // Lata i status z podcastu: ostatnie posiedzenie komisji 12 XII 1946. Czy akta są publicznie dostępne, nie wiadomo.
    country: 'SE',
    countryName: { en: 'Sweden', pl: 'Szwecja' },
    program: 'Ghost Rockets investigation, 1946',
    years: '1946',
    status: 'closed', publicDb: null,
    institution: { en: 'Swedish Defense Staff', pl: 'Szwedzki sztab obrony' },
    volume: {
      en: 'Not known. The US releases hold no Swedish document. The US review of 9 January 1947 says the Defense Staff had received almost 1,000 reports by the end of July 1946.',
      pl: 'Nie wiadomo. W wydaniach USA nie ma żadnego szwedzkiego dokumentu. Przegląd USA z 9 stycznia 1947 r. podaje, że do końca lipca 1946 r. sztab obrony otrzymał prawie 1000 zgłoszeń.',
    },
    note: {
      en: 'The US Intelligence Review of 9 January 1947 says of the reports of 1946: “Official investigations of these reports were begun by the Swedish authorities in June.” The Defense Staff carried them out and issued communiqués on 6 August and 10 October. A G-2 paper of 1950 says the Swedish Government issued a report by 1947. A Riksarkivet podcast with the head of the War Archives (episode of 27 April 2023, transcript published in 2024) adds that a Defense Staff order of 12 June 1946 (Fst/L 12/6 1946 NR 7:49) told units to report on a set form, that a committee of the Defense Staff with the Air Administration, the Air Staff, the Naval Administration, FRA and FOA met from July and held its last meeting on 12 December 1946, and that it never presented a tenable explanation. The US releases hold no Swedish document.',
      pl: 'Przegląd wywiadu USA z 9 stycznia 1947 r. pisze o doniesieniach z 1946 r.: „Official investigations of these reports were begun by the Swedish authorities in June.”, czyli szwedzkie władze rozpoczęły oficjalne dochodzenie w czerwcu. Prowadził je sztab obrony, który wydał komunikaty 6 sierpnia i 10 października. Notatka G-2 z 1950 r. podaje, że do 1947 r. rząd szwedzki wydał raport. Podcast Riksarkivet z kierownikiem Archiwum Wojennego (odcinek z 27 kwietnia 2023 r., zapis opublikowany w 2024 r.) dodaje, że rozkaz sztabu obrony z 12 czerwca 1946 r. (Fst/L 12/6 1946 NR 7:49) kazał jednostkom meldować obserwacje na ustalonym formularzu, że komisja sztabu obrony z udziałem zarządu lotnictwa, sztabu lotnictwa, zarządu marynarki, FRA i FOA obradowała od lipca, ostatnie posiedzenie odbyła 12 grudnia 1946 r. i nie przedstawiła trwałego wyjaśnienia. W wydaniach USA nie ma żadnego szwedzkiego dokumentu.',
    },
    ref: 'ra-spokraketer',
    volumeRef: 'pursue-d099',
  },
  {
    country: 'ES',
    countryName: { en: 'Spain', pl: 'Hiszpania' },
    program: 'Ministry of Defence UFO files',
    years: '1962–1995', status: 'unknown', publicDb: true,
    institution: { en: 'Ministerio de Defensa / Ejército del Aire', pl: 'Ministerio de Defensa / Ejército del Aire' },
    volume: { en: '80 files, 1,900 pages', pl: '80 akt, 1900 stron' },
    note: {
      en: 'In 1991 the Ministry of Defence began declassifying the files so that the public could consult them; in 1992 a physical copy was deposited in the Air Force Central Library in Madrid. Digitised, they can be read online in the Biblioteca Virtual de Defensa. They cover events in Spanish airspace involving Air Force personnel or equipment, from San Javier (Murcia) in 1962 to Morón (Seville) in 1995; witnesses’ and reporting officers’ details are withheld.',
      pl: 'W 1991 r. Ministerstwo Obrony zaczęło odtajniać akta, by udostępnić je publiczności; w 1992 r. kopię złożono w Centralnej Bibliotece Sił Powietrznych w Madrycie. Po digitalizacji można je czytać online w Biblioteca Virtual de Defensa. Obejmują zdarzenia w hiszpańskiej przestrzeni powietrznej z udziałem personelu lub sprzętu Sił Powietrznych, od San Javier (Murcja) w 1962 r. do Morón (Sewilla) w 1995 r.; dane świadków i oficerów sporządzających raporty usunięto.',
    },
    ref: 'es-ovni',
  },
  {
    country: 'BR',
    countryName: { en: 'Brazil', pl: 'Brazylia' },
    program: 'National Archives UFO fund (BR DFANBSB ARX)',
    years: '1952–2016', status: 'unknown', publicDb: true,
    institution: { en: 'Comando da Aeronáutica / Arquivo Nacional', pl: 'Comando da Aeronáutica / Arquivo Nacional' },
    volume: { en: '743 records, 1952–2016: reports, questionnaires, correspondence, photographs, drawings, video, audio and press cuttings', pl: '743 jednostki z lat 1952–2016: relacje, kwestionariusze, korespondencja, zdjęcia, rysunki, nagrania wideo i audio, wycinki prasowe' },
    note: {
      en: 'Under ordinance 551/GC3 of 9 August 2010 the Air Force command only registers occurrences and forwards them to the National Archives: COMDABRA receives and catalogues the records, and the Air Force documentation centre CENDOC periodically sends the originals to the Archives. The first transfer arrived on 31 October 2008. The fund can be consulted through SIAN, the Archives’ information system.',
      pl: 'Zgodnie z rozporządzeniem nr 551/GC3 z 9 sierpnia 2010 r. dowództwo lotnictwa jedynie rejestruje zdarzenia i przekazuje je do Archiwum Narodowego: COMDABRA przyjmuje i kataloguje zapisy, a centrum dokumentacji lotnictwa CENDOC okresowo przesyła oryginały do Archiwum. Pierwsze przekazanie nastąpiło 31 października 2008 r. Zespół można przeglądać w SIAN, systemie informacyjnym Archiwum.',
    },
    ref: 'br-an-ovni',
    volumeRef: 'br-an-news',
  },
];
