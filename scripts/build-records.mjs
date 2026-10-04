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
  // List Markhama z 14 III 1948 (D088 s. 9) zestawia pościg Mantella z historią z Maury Island
  'DOW-UAP-D088': ['chiles-whitted-1948', 'gorman-1948', 'maury-island-1947', 'mantell-1948'],
  // Studium nr 203 z 10 grudnia 1948: Wenus nad Godman i odesłanie do incydentu z 7 stycznia 1948
  'DOW-UAP-D094': ['mantell-1948'],
  // Teczka zarządu wywiadu USAF, s. 37–46: KC-97 i radar naziemny nad Nową Fundlandią, 6 lipca 1955
  'DOW-UAP-D095': ['newfoundland-1955'],
  // Misja 33 SOS z 25 stycznia 2024: raport D25 i nagranie PR28. D27 i PR29 (czerwiec 2024,
  // Zatoka Omańska) sprawa cytuje do porównania: ta sama sylwetka, inne zdarzenie.
  'DOW-UAP-D25': ['eastern-mediterranean-2024'],
  'DOW-UAP-PR28': ['eastern-mediterranean-2024'],
  'DOW-UAP-D27': ['eastern-mediterranean-2024'],
  'DOW-UAP-PR29': ['eastern-mediterranean-2024'],
  // 482 ATKS nad Zatoką Perską, lipiec–listopad 2020: sześć raportów z misji i formularz Range Fouler
  // (wydanie 01) oraz cztery nagrania z wydania 02, sparowane przez nas z D64 i D42 po dacie i treści
  'DOW-UAP-D42': ['persian-gulf-2020'],
  'DOW-UAP-D60': ['persian-gulf-2020'],
  'DOW-UAP-D61': ['persian-gulf-2020'],
  'DOW-UAP-D62': ['persian-gulf-2020'],
  'DOW-UAP-D63': ['persian-gulf-2020'],
  'DOW-UAP-D64': ['persian-gulf-2020'],
  'DOW-UAP-D65': ['persian-gulf-2020'],
  'DOW-UAP-PR077': ['persian-gulf-2020'],
  'DOW-UAP-PR078': ['persian-gulf-2020'],
  'DOW-UAP-PR088': ['persian-gulf-2020'],
  'DOW-UAP-PR089': ['persian-gulf-2020'],
  // Misje 33 SOS z 27 i 29 października 2023: D33 z nagraniem PR34 (zwroty nad północnym Morzem
  // Egejskim) i D35 z PR35 (lot prosto ku Krecie), które sprawa cytuje do porównania
  'DOW-UAP-D33': ['north-aegean-2023'],
  'DOW-UAP-PR34': ['north-aegean-2023'],
  'DOW-UAP-D35': ['north-aegean-2023'],
  'DOW-UAP-PR35': ['north-aegean-2023'],
  // Irak, 5 maja 2022: D109 i D106 opisują obiekty tym samym akapitem; PR140 i PR141 należą do
  // D109 (światło dnia, pył), PR130 i PR131 łączy z D106 tylko kolejność stron w przesyłce MDR;
  // D10 (nazajutrz, 60 km dalej, „POSSIBLE BIRDS”) sprawa cytuje do porównania
  'DOW-UAP-D106': ['iraq-2022'],
  'DOW-UAP-D109': ['iraq-2022'],
  'DOW-UAP-PR130': ['iraq-2022'],
  'DOW-UAP-PR131': ['iraq-2022'],
  'DOW-UAP-PR140': ['iraq-2022'],
  'DOW-UAP-PR141': ['iraq-2022'],
  'DOW-UAP-D10': ['iraq-2022'],
  // 65 SOS, 29 lipca 2025: sześć punktów bez miejsca, wszystkie położenia zaczernione
  'DOW-UAP-D108': ['six-spheres-2025'],
  'DOW-UAP-PR135': ['six-spheres-2025'],
  // teczka FBI 62-HQ-83894: teleks Dallas z 8 VII 1947 o Roswell (s. 70) i dopisek dyrektora (s. 127, 131);
  // Maury Island: teleks z Portland z 5 VIII 1947 (s. 139–143) i z Seattle z 14 VIII (s. 119)
  '65-hs1-834228961-62-hq-83894-section-1@01': ['roswell-1947', 'maury-island-1947'],
  // Maury Island 1947: teleksy z Seattle z 6, 7, 12 VIII i depesza dyrektora z 14 VIII (S2); raport A-2,
  // oświadczenie z 7 VIII, zeznanie Smitha, list z Seattle, notatki z Butte i Chicago (S3); list Palmera
  // do Arnolda z 22 VII i przesłuchanie Arnolda (S3) cytuje też arnold-1947; wycinek z 1950 (SUB_A);
  // druga kopia listu Markhama w streszczeniach incydentów RG 38
  '65-hs1-834228961-62-hq-83894-section-2@01': ['maury-island-1947'],
  '65-hs1-834228961-62-hq-83894-section-3@01': ['maury-island-1947', 'arnold-1947'],
  '65-hs1-834228961-62-hq-83894-sub-a@01': ['maury-island-1947'],
  '38-143685-box-incident-summaries-101-172@01': ['maury-island-1947'],
  // zielone kule ognia: depesza dowódcy Kirtland z 31 I 1949 (Section 4, s. 106)
  '65-hs1-834228961-62-hq-83894-section-4@01': ['green-fireballs-1948', 'oak-ridge-1950'],
  // Oak Ridge 1947–1951: zdjęcia Presleya (Section 4, Serial 153), radar Adcocka z marca 1950 (Section 5),
  // radar lotnictwa, „radar jamming” i obserwacja z 18 XII 1950 (Section 6)
  '65-hs1-834228961-62-hq-83894-section-5@01': ['oak-ridge-1950'],
  '65-hs1-834228961-62-hq-83894-section-6@01': ['oak-ridge-1950'],
  '65-hs1-834228961-62-hq-83894-serial-153@01': ['oak-ridge-1950'],
  // Socorro 1964: raport agenta Byrnesa z relacją Zamory (Serial 438) i teleksy z Albuquerque (Section 9, s. 221–263)
  '65-hs1-834228961-62-hq-83894-serial-438@01': ['socorro-1964'],
  '65-hs1-834228961-62-hq-83894-section-9@01': ['socorro-1964'],
  // obserwacja z września 2023: trzy FD-302 (pliki według LINK_SHIFTS) i szkic, datowany tylko nazwą pliku
  'fbi-september-2023-sighting-serial-3@01': ['test-site-2023'],
  'fbi-september-2023-sighting-serial-4@01': ['test-site-2023'],
  'fbi-september-2023-sighting-serial-5@01': ['test-site-2023'],
  'fbi-september-2023-sighting-composite-sketch@01': ['test-site-2023'],
  'sandia-base-correspondence-new-mexico-aerial-phenomena-and-green-fireballs-1948': ['green-fireballs-1948'],
};

/**
 * Adresy, które indeks podaje, a wydawca ich nie obsługuje, i dla których nie
 * znaleźliśmy działającej ścieżki. Wpisujemy tu tylko to, co sprawdzone
 * pobraniem. Poprawnego adresu nie zgadujemy, pokazujemy stan faktyczny.
 * DOW-UAP-D134 przeszedł do SOURCE_FIXES, gdy znalazł się działający adres.
 */
const DEAD_SOURCES = new Set([]);

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
  // indeks: …/DOW-UAP-D134_%20AAWSAP-DIRD-… (404), ze spacją po „D134_”; ten sam plik
  // bez spacji, tak jak nazywa go paczka wydania 06 (25 627 490 B, CRC32 3cad1f4a)
  'DOW-UAP-D134@06': 'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D134_AAWSAP-DIRD-Maverick-Inventor-Versus-Corporate-Inventor-Where-Will-the-Next-Major-Innovations-Arise-March-30-2010.pdf',
  // indeks: …/65_hs1-8342289+M5+M11 (404): nazwa ucięta w pół numeru, a „+M5+M11” to ślad
  // odwołań do komórek arkusza; ten sam plik pod pełną nazwą, jak w paczce wydania 01
  // (1 082 077 B, identyczny bajt w bajt)
  '65-hs1-834228961-62-hq-83894-serial-153@01': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_serial_153.pdf',
};

/**
 * Indeks wydawcy łączy trzy tytuły z tego zestawu z plikami przesuniętymi o jeden.
 * Tytuł, opis w uap-data.csv i nazwa pliku zgadzają się ze sobą, nie zgadza się
 * tylko link. Oba adresy działają, a pliki są bajt w bajt zgodne z paczką wydania 01.
 * Rekord dostaje plik zgodny z tytułem, a adres z indeksu zostaje w sourceAsIndexed.
 */
const LINK_SHIFTS = {
  'fbi-september-2023-sighting-serial-3@01': 'https://www.war.gov/medialink/ufo/release_1/serial-3_redacted.pdf',
  'fbi-september-2023-sighting-serial-4@01': 'https://www.war.gov/medialink/ufo/release_1/serial-4-redacted_redacted.pdf',
  'fbi-september-2023-sighting-serial-5@01': 'https://www.war.gov/medialink/ufo/release_1/serial%205%20redacted_redacted.pdf',
};

/**
 * Filmy wydania 01. Indeks podaje przy nich albo raport z misji (PDF), albo nic,
 * a same nagrania wydawca trzyma na DVIDS. Każdy adres otwarty na żywo; tytuł
 * strony zgadza się z nagłówkiem XMP pliku z paczki uapvideos.zip wydania 01.
 * Rekord dostaje stronę nagrania, a adres z indeksu zostaje w sourceAsIndexed.
 */
const RECORDING_PAGES = {
  'DOW-UAP-PR19': 'https://www.dvidshub.net/video/1006056/dow-uap-pr19-unresolved-uap-report-middle-east-may-2022',
  'DOW-UAP-PR21': 'https://www.dvidshub.net/video/1006059/dow-uap-pr21-unresolved-uap-report-iraq-may-2022',
  'DOW-UAP-PR22': 'https://www.dvidshub.net/video/1006060/dow-uap-pr22-unresolved-uap-report-syria-july-2022',
  'DOW-UAP-PR23': 'https://www.dvidshub.net/video/1006062/dow-uap-pr23-unresolved-uap-report-iraq-december-2022',
  'DOW-UAP-PR26': 'https://www.dvidshub.net/video/1006063/dow-uap-pr26-unresolved-uap-report-united-arab-emirates-october-2023',
  'DOW-UAP-PR27': 'https://www.dvidshub.net/video/1006067/dow-uap-pr27-unresolved-uap-report-united-arab-emirates-october-2023',
  'DOW-UAP-PR28': 'https://www.dvidshub.net/video/1006073/dow-uap-pr28-unresolved-uap-report-greece-january-2024',
  'DOW-UAP-PR29': 'https://www.dvidshub.net/video/1006074/dow-uap-pr29-unresolved-uap-report-united-arab-emirates-june-2024',
  'DOW-UAP-PR31': 'https://www.dvidshub.net/video/1006076/dow-uap-pr31-unresolved-uap-report-syria-october-2024',
  'DOW-UAP-PR32': 'https://www.dvidshub.net/video/1006078/dow-uap-pr32-unresolved-uap-report-syria-october-2024',
  'DOW-UAP-PR33': 'https://www.dvidshub.net/video/1006079/dow-uap-pr33-unresolved-uap-report-syria-october-2024',
  'DOW-UAP-PR34': 'https://www.dvidshub.net/video/1006080/dow-uap-pr34-unresolved-uap-report-greece-october-2023',
  'DOW-UAP-PR35': 'https://www.dvidshub.net/video/1006082/dow-uap-pr35-unresolved-uap-report-greece-october-2023',
  'DOW-UAP-PR36': 'https://www.dvidshub.net/video/1006083/dow-uap-pr36-unresolved-uap-report-middle-east-may-2020',
  'DOW-UAP-PR37': 'https://www.dvidshub.net/video/1006087/dow-uap-pr37-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR38': 'https://www.dvidshub.net/video/1006088/dow-uap-pr38-unresolved-uap-report-middle-east-2013',
  'DOW-UAP-PR39': 'https://www.dvidshub.net/video/1006089/dow-uap-pr39-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR40': 'https://www.dvidshub.net/video/1006093/dow-uap-pr40-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR41': 'https://www.dvidshub.net/video/1006094/dow-uap-pr41-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR42': 'https://www.dvidshub.net/video/1006097/dow-uap-pr42-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR43': 'https://www.dvidshub.net/video/1006159/dow-uap-pr43-unresolved-uap-report-africa-2025',
  'DOW-UAP-PR44': 'https://www.dvidshub.net/video/1006104/dow-uap-pr44-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR45': 'https://www.dvidshub.net/video/1006105/dow-uap-pr45-unresolved-uap-report-middle-east-2020',
  'DOW-UAP-PR46': 'https://www.dvidshub.net/video/1006106/dow-uap-pr46-unresolved-uap-report-indopacom-2024',
  'DOW-UAP-PR47': 'https://www.dvidshub.net/video/1006107/dow-uap-pr47-unresolved-uap-report-indopacom-2023',
  'DOW-UAP-PR48': 'https://www.dvidshub.net/video/1006110/dow-uap-pr48-unresolved-uap-report-indopacom-2024',
  'DOW-UAP-PR49': 'https://www.dvidshub.net/video/1006111/dow-uap-pr49-unresolved-uap-report-department-army-2026',
};

/**
 * Nagranie i raport z misji, który je opisuje. Tylko pary potwierdzone treścią
 * (opis, data, czujnik, kierunek), nie tytułem; opisy wydawcy mylą się przy
 * PR26, PR28 i PR29. PR21 pomijamy: ta sama misja co D14, ale nie wiadomo,
 * którą z dwóch obserwacji pokazuje film.
 */
const REPORT_PAIRS = [
  ['DOW-UAP-PR19', 'DOW-UAP-D10'], ['DOW-UAP-PR20', 'DOW-UAP-D12'],
  ['DOW-UAP-PR22', 'DOW-UAP-D16'], ['DOW-UAP-PR23', 'DOW-UAP-D18'],
  ['DOW-UAP-PR26', 'dow-uap-d23'], ['DOW-UAP-PR27', 'dow-uap-d23'],
  ['DOW-UAP-PR28', 'DOW-UAP-D25'], ['DOW-UAP-PR29', 'DOW-UAP-D27'],
  ['DOW-UAP-PR31', 'dow-uap-d32'], ['DOW-UAP-PR32', 'dow-uap-d32'], ['DOW-UAP-PR33', 'dow-uap-d32'],
  ['DOW-UAP-PR34', 'DOW-UAP-D33'], ['DOW-UAP-PR35', 'DOW-UAP-D35'], ['DOW-UAP-PR36', 'DOW-UAP-D38'],
  // PR140 i PR141 należą do D109, nie do D106: oba mają kolorowy obraz dzienny terenu w słońcu,
  // a D109 obserwuje 05:24–07:04Z (dzień), D106 o 20:26Z (noc); do tego pył na obrazie i „DUST STORMS”
  // w D109 wobec „WEATHER WAS NOT A FACTOR” w D106. Para z treści, nie z tytułu
  ['DOW-UAP-PR140', 'DOW-UAP-D109'], ['DOW-UAP-PR141', 'DOW-UAP-D109'],
  // PR135 należy do D108 z treści, nie z tytułu: raport opisuje sześć małych kulistych obiektów o 20:22Z,
  // nagranie jest w samej podczerwieni i pokazuje grupę, w której od 0:39,8 widać sześć osobnych punktów
  ['DOW-UAP-PR135', 'DOW-UAP-D108'],
  // PR133 należy do D107 z treści, nie z tytułu: raport opisuje jeden obiekt, „A WHITE ROUND ORBIT”,
  // śledzony od 01:41Z do 01:50Z; nagranie w samej podczerwieni pokazuje jeden biały okrągły punkt,
  // śledzony przez 4 min 58 s, co mieści się w tych 9 minutach. Daty nagranie nie pokazuje (nakładka
  // zaczerniona), a opis wydawcy podaje rok 2024 wbrew tytułowi i raportowi (2025)
  ['DOW-UAP-PR133', 'DOW-UAP-D107'],
];

/**
 * Tytuł wydawcy przeczy treści dokumentu. Tytuł zostawiamy dosłownie i miejsce
 * „z tytułu” też; obok zapisujemy, co mówi sam dokument. placeFrom mówi, skąd
 * miejsce: text to słowa dokumentu, grid to nasze przeliczenie siatki MGRS z dokumentu.
 * Rok, jeśli podany, to data zdarzenia z dokumentu; zastępuje rok z tytułu w filtrach.
 */
const DOCUMENT_SAYS = {
  'DOW-UAP-D20@01': { place: 'Syria', year: 2023, placeFrom: 'text' },
  'DOW-UAP-D14@01': { place: 'Syrian coast near Hmeimim air base, south-east of Latakia', placeFrom: 'grid' },
  'DOW-UAP-PR21@01': { place: 'Syrian coast near Hmeimim air base, south-east of Latakia', placeFrom: 'grid' },
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
  const rel0 = parseSource(r.officialSourceUrl || null).release;
  const fixKey = idPre && `${idPre}@${rel0}`;
  // rekordy bez identyfikatora (np. teczki FBI) poprawiamy po slugu z tytułu
  const fixedUrl = (fixKey ? SOURCE_FIXES[fixKey] : undefined) ?? SOURCE_FIXES[`${slugify(t.title)}@${rel0}`];
  const shiftedUrl = LINK_SHIFTS[`${slugify(t.title)}@${rel0}`];
  const s = parseSource(shiftedUrl ?? fixedUrl ?? r.officialSourceUrl ?? null);
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
    cases: CASE_LINKS[`${id}@${s.release}`] ?? CASE_LINKS[`${slug}@${s.release}`] ?? CASE_LINKS[slug] ?? CASE_LINKS[id] ?? [],
    illegible: (id && ILLEGIBLE[id]) ?? null,
    documentSays: DOCUMENT_SAYS[`${id}@${s.release}`] ?? null,
    sourceAsIndexed: shiftedUrl || fixedUrl ? r.officialSourceUrl : null,
    linkShift: Boolean(shiftedUrl),
    related: [],
  });
}

/**
 * Klucz bez wydania, który trafia w kilka rekordów, jest błędem, a nie
 * niejednoznacznością do rozstrzygnięcia na chybił trafił.
 */
/**
 * Nagrania, których indeks nie przypisuje do wydania, a które leżą w paczce
 * wideo wydania. Sprawdzone na plikach, nie po dacie publikacji na DVIDS:
 * numer zasobu ze strony DVIDS zgadza się z nazwą pliku w paczce, a na
 * próbkach z każdej grupy dane obrazu (mdat) są identyczne. Paczka wydania 03
 * trzyma przekodowane wersje tych samych klatek, nie te same bajty.
 * Paczka wydania 06 jest tylko na stronie wydawcy; jej spis czytano zdalnie.
 */
const BUNDLE_RELEASE = [
  { prefix: 'DOW-UAP-PR', nums: [[50, 99]], release: '02' },               // uap052226.zip
  { prefix: 'NASA-UAP-D', nums: [[8, 14]], release: '02' },                // uap052226.zip
  { prefix: 'FBI-UAP-PR', nums: [[1, 6]], release: '03' },                 // uap_videos_061226.zip
  { prefix: 'NASA-UAP-D', nums: [[23, 25]], release: '03' },               // uap_videos_061226.zip
  { prefix: 'DOW-UAP-PR', nums: [[24, 24], [30, 30], [100, 116]], release: '04' }, // uap_release04_videos_071026.zip
  { prefix: 'NASA-UAP-D', nums: [[26, 29]], release: '04' },               // uap_release04_videos_071026.zip
  { prefix: 'DOW-UAP-PR', nums: [[133, 133], [135, 135], [140, 141], [143, 144], [148, 148], [150, 152], [159, 160]], release: '06' }, // pursue_vids_091826.zip
  { prefix: 'LLE-UAP-PR', nums: [[1, 4]], release: '06' },                 // pursue_vids_091826.zip
];
const bundleRelease = (id) => {
  for (const b of BUNDLE_RELEASE) {
    if (!id.startsWith(b.prefix)) continue;
    const n = /^\d+$/.test(id.slice(b.prefix.length)) ? +id.slice(b.prefix.length) : NaN;
    if (b.nums.some(([lo, hi]) => n >= lo && n <= hi)) return b.release;
  }
  return null;
};
/**
 * Rok nagrania tam, gdzie tytuł w indeksie go ucina. PR088 i PR089: indeks
 * podaje „31 AUG”, a tytuł nadany przez użytkownika, cytowany przez AARO na
 * stronie DVIDS, brzmi „31 AUG 2020”, i opis mówi o nagraniu z 2020 r.
 */
const RECORDING_YEARS = { 'DOW-UAP-PR088': 2020, 'DOW-UAP-PR089': 2020 };

for (const r of records) {
  const b = r.id && !r.release ? bundleRelease(r.id) : null;
  if (b) r.release = b;
  if (r.id && RECORDING_YEARS[r.id] && !r.year) r.year = RECORDING_YEARS[r.id];
}

for (const r of records) {
  const page = r.id && RECORDING_PAGES[r.id];
  if (!page) continue;
  r.sourceAsIndexed = r.source;
  r.source = page;
  r.sourceKind = 'page';
  r.format = 'video';
  r.kind = 'recording';
  r.publisher = 'dvidshub.net';
  r.release ??= '01';
}

const lookup = (key) => {
  const [id, rel] = key.split('@');
  return records.filter(r => (rel ? r.release === rel : true) && (r.id === id || r.slug === id));
};
const ambiguous = [], unused = [];
for (const key of [...Object.keys(CASE_LINKS), ...Object.keys(ILLEGIBLE), ...Object.keys(SOURCE_FIXES), ...Object.keys(LINK_SHIFTS), ...Object.keys(DOCUMENT_SAYS), ...Object.keys(RECORDING_PAGES), ...Object.keys(RECORDING_YEARS), ...SAME_DOCUMENT.flatMap(([a, , b]) => [a, b]), ...REPORT_PAIRS.flat()]) {
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
const INVERSE = { same: 'same', part: 'whole', edition: 'edition', next: 'prev', report: 'recording' };
for (const [a, rel, b] of SAME_DOCUMENT) {
  const [ra] = lookup(a), [rb] = lookup(b);
  ra.related.push({ slug: rb.slug, rel });
  rb.related.push({ slug: ra.slug, rel: INVERSE[rel] });
}
for (const [a, b] of REPORT_PAIRS) {
  const [ra] = lookup(a), [rb] = lookup(b);
  ra.related.push({ slug: rb.slug, rel: 'report' });
  rb.related.push({ slug: ra.slug, rel: 'recording' });
}

// stała kolejność, żeby diff pokazywał zmiany w danych, a nie w sortowaniu
records.sort((a, b) =>
  (a.release ?? 'zz').localeCompare(b.release ?? 'zz') ||
  a.slug.localeCompare(b.slug));

const out = {
  dataset: 'disclosure.zone / PURSUE document registry',
  note: 'Identifiers, titles and links as published. Nothing here is assessed, summarised or rewritten by us. Where a published title contradicts the document, the title stays and documentSays records what the document gives. Where the index gives an address the publisher does not serve and the same file is served elsewhere, source is the working address and sourceAsIndexed the one given. Where the index links a title to another file of the same set, source is the file whose name and content match the title, sourceAsIndexed the one linked, and linkShift is true. Where the index gives no identifier, it is read from the published file name (idFrom). Links between files that hold the same document, and files that cannot be read, are our own observations, checked page by page.',
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
