/**
 * Rejestr zweryfikowanych odnośników źródłowych.
 * Jedno miejsce prawdy — sprawy odwołują się kluczem, więc link poprawiony tutaj
 * naprawia się we wszystkich wersjach językowych naraz.
 *
 * Zasada: wpisujemy wyłącznie adresy potwierdzone. Brak wpisu jest widoczny w UI.
 */
export const SOURCE_URL: Record<string, string> = {
  // ——— Stany Zjednoczone: archiwa i programy
  'nara-bluebook':        'https://www.archives.gov/research/military/air-force/ufos',
  'nara-uap':             'https://www.archives.gov/research/topics/uaps',
  'nara-uap-microfilm':   'https://www.archives.gov/research/topics/uaps/textual-and-microfilm',
  // Seria oczyszczonych akt spraw Blue Book w katalogu NARA (10 622 jednostki, 116 537 obiektów cyfrowych, 5 X 2026)
  'nara-bluebook-sanitized': 'https://catalog.archives.gov/id/597821',
  'nara-rg615':           'https://www.archives.gov/research/topics/uaps/rg-615',
  // Rekord RG 615 w katalogu NARA: 9 serii, 717 jednostek z 719 obiektami cyfrowymi (5 X 2026)
  'nara-rg615-catalog':   'https://catalog.archives.gov/id/445887258',
  'nara-catalog':         'https://catalog.archives.gov/',
  // Kelly–Hopkinsville 1955: papiery leżą na obrazach 42–117 jednostki Blue Book NAID 28963358, którą katalog
  // tytułuje „OLD GREENWICH, CONNECTICUT, August 1955”. Adres ?objectPage=N otwiera obraz N; każdy otwarty
  // w przeglądarce 15 X 2026 i sprawdzony po pliku, który strona ładuje (obraz N to plik 1350+N.jpg do N=106,
  // dalej 1457a, 1457b, 1458…, więc 110 to 1459.jpg, 113 to 1461.jpg, 114 to 1462.jpg, 115 to 1463.jpg)
  'nara-bb-kelly-file':   'https://catalog.archives.gov/id/28963358?objectPage=43',
  'nara-bb-kelly-campbell': 'https://catalog.archives.gov/id/28963358?objectPage=46',
  'nara-bb-kelly-albert': 'https://catalog.archives.gov/id/28963358?objectPage=48',
  'nara-bb-kelly-newera': 'https://catalog.archives.gov/id/28963358?objectPage=52',
  'nara-bb-kelly-statement': 'https://catalog.archives.gov/id/28963358?objectPage=53',
  'nara-bb-kelly-atic-1957': 'https://catalog.archives.gov/id/28963358?objectPage=56',
  'nara-bb-kelly-hynek':  'https://catalog.archives.gov/id/28963358?objectPage=57',
  'nara-bb-kelly-edwards': 'https://catalog.archives.gov/id/28963358?objectPage=68',
  'nara-bb-kelly-radio':  'https://catalog.archives.gov/id/28963358?objectPage=79',
  'nara-bb-kelly-atic-1956': 'https://catalog.archives.gov/id/28963358?objectPage=110',
  'nara-bb-kelly-csi':    'https://catalog.archives.gov/id/28963358?objectPage=113',
  'nara-bb-kelly-levity': 'https://catalog.archives.gov/id/28963358?objectPage=114',
  'nara-bb-kelly-up':     'https://catalog.archives.gov/id/28963358?objectPage=115',
  // Boianai 1959: karta Blue Book i raport attaché lotniczego USA w Australii nr 1,403,022 z 21 I 1960
  // na obrazach 1–17 jednostki NAID 28983630 „New Guinea, June 1959” (obraz N to plik 0511+N.jpg).
  // List RAAF bez zaczernień drukuje „The A.P.R.O. Bulletin” z marca 1960, s. 2: obraz 26 jednostki
  // NAID 28976909 „Albuquerque, N.M., January 1958” (plik 0182.jpg). Każdy adres otwarty w przeglądarce
  // 15 X 2026 i sprawdzony po pliku, który strona ładuje
  'nara-bb-boianai-card': 'https://catalog.archives.gov/id/28983630?objectPage=1',
  'nara-bb-boianai-report': 'https://catalog.archives.gov/id/28983630?objectPage=2',
  'nara-bb-boianai-vfsrs': 'https://catalog.archives.gov/id/28983630?objectPage=3',
  'nara-bb-boianai-method': 'https://catalog.archives.gov/id/28983630?objectPage=6',
  'nara-bb-boianai-data': 'https://catalog.archives.gov/id/28983630?objectPage=8',
  'nara-bb-boianai-sketch': 'https://catalog.archives.gov/id/28983630?objectPage=11',
  'nara-bb-boianai-june27': 'https://catalog.archives.gov/id/28983630?objectPage=12',
  'nara-bb-boianai-signatures': 'https://catalog.archives.gov/id/28983630?objectPage=14',
  'nara-bb-boianai-evaluation': 'https://catalog.archives.gov/id/28983630?objectPage=16',
  'apro-1960-03-p2':      'https://catalog.archives.gov/id/28976909?objectPage=26',
  // Ubatuba 1957: wykaz Blue Book „1 - 17 SEPTEMBER 1957 SIGHTINGS” (NAID 28971479, obraz 20 = plik 1218.jpg),
  // biuletyny APRO z marca i maja 1960 r. w jednostce NAID 28976909 (obrazy 27, 29, 36 = pliki 0183, 0185,
  // 0192) oraz list APRO z 20 IV 1960 i notatka ATIC z 4 V 1960 w jednostce NAID 28956049 „Peoria, Illinois,
  // August 1953” (obrazy 36, 37 = pliki 0739, 0740). Każdy adres otwarty w przeglądarce 15 X 2026
  'nara-bb-ubatuba-list': 'https://catalog.archives.gov/id/28971479?objectPage=20',
  'nara-bb-ubatuba-atic-1960': 'https://catalog.archives.gov/id/28956049?objectPage=37',
  'nara-bb-ubatuba-apro-1960': 'https://catalog.archives.gov/id/28956049?objectPage=36',
  'nara-bb-ubatuba-apro-letter': 'https://catalog.archives.gov/id/28976909?objectPage=27',
  'nara-bb-ubatuba-apro-analyses': 'https://catalog.archives.gov/id/28976909?objectPage=29',
  'nara-bb-ubatuba-apro-atic': 'https://catalog.archives.gov/id/28976909?objectPage=36',
  // Bentwaters–Lakenheath 1956: jednostka Blue Book NAID 28966873 „Bentwaters-Lakenheath, England, August 1956”
  // (44 obrazy, obraz N to plik 0013+N.jpg). Karta z uwagami ATIC 1–3, IR-1-56 4–9, list kierownika zmiany 11–14,
  // notatka Hynka 27, 26, 25, AFOIN-4E1 33, dalekopisy 36–43 (BOI-485 zaczyna się na 41, fragment o Venomie
  // na 38), szkic 44. Każdy adres otwarty w przeglądarce 16 X 2026 i sprawdzony po pliku, który strona ładuje
  'nara-bb-lakenheath-card': 'https://catalog.archives.gov/id/28966873?objectPage=1',
  'nara-bb-lakenheath-ir': 'https://catalog.archives.gov/id/28966873?objectPage=4',
  'nara-bb-lakenheath-letter': 'https://catalog.archives.gov/id/28966873?objectPage=11',
  'nara-bb-lakenheath-hynek': 'https://catalog.archives.gov/id/28966873?objectPage=27',
  'nara-bb-lakenheath-afoin': 'https://catalog.archives.gov/id/28966873?objectPage=33',
  'nara-bb-lakenheath-message': 'https://catalog.archives.gov/id/28966873?objectPage=38',
  // Minot AFB 1968: jednostka Blue Book NAID 302580672 „Minot AFB. North Dakota, October 1968” (107 obrazów,
  // obraz N to plik 0100+N.jp2, katalog bez warstwy tekstu). Karta 1, dopisek o 13 zdjęciach 2, pierwsze zgłoszenie
  // 3–4, depesza bazy z 29 X 8–15, notatka o rozmowie z płk. Pullenem 18, rozmowa z Werlichem 19–25, notatka
  // o Goffie 26, taśma RAPCON 30–34, kwestionariusz pilota 86–94, depesza Quintanilli 95, pismo FTD z 13 XI 98–106.
  // Każdy adres otwarty w przeglądarce 16 X 2026 i sprawdzony po pliku, który strona ładuje
  'nara-bb-minot-card':   'https://catalog.archives.gov/id/302580672?objectPage=1',
  'nara-bb-minot-first-report': 'https://catalog.archives.gov/id/302580672?objectPage=3',
  'nara-bb-minot-message': 'https://catalog.archives.gov/id/302580672?objectPage=8',
  'nara-bb-minot-pullen': 'https://catalog.archives.gov/id/302580672?objectPage=18',
  'nara-bb-minot-werlich': 'https://catalog.archives.gov/id/302580672?objectPage=19',
  'nara-bb-minot-goff':   'https://catalog.archives.gov/id/302580672?objectPage=26',
  'nara-bb-minot-transcript': 'https://catalog.archives.gov/id/302580672?objectPage=30',
  'nara-bb-minot-pilot':  'https://catalog.archives.gov/id/302580672?objectPage=86',
  'nara-bb-minot-quintanilla': 'https://catalog.archives.gov/id/302580672?objectPage=95',
  'nara-bb-minot-ftd':    'https://catalog.archives.gov/id/302580672?objectPage=98',
  // RB-47 1957: jednostka Blue Book NAID 28970538, którą katalog tytułuje „Forbes AFB, Kansas, July 1957”
  // (56 obrazów, obraz N to plik 0355+N.jpg). Karta 1, depesza z Duncanville 2–6 (nie po kolei, pierwsza strona
  // na 6), AFCIN-4E1 7, list CAA 9, pisma ADC 10–11, odręczne podsumowanie 12–13, McDonald 1971 14–19, Klass 1971
  // 21–38, list HRD 1972 39, meldunek 55. skrzydła 41–44, arkusz Chase'a 45–56 (strona pierwsza to 46).
  // Każdy adres otwarty w przeglądarce 16 X 2026 i sprawdzony po pliku, który strona ładuje
  'nara-bb-rb47-card':    'https://catalog.archives.gov/id/28970538?objectPage=1',
  'nara-bb-rb47-duncanville': 'https://catalog.archives.gov/id/28970538?objectPage=6',
  'nara-bb-rb47-afcin':   'https://catalog.archives.gov/id/28970538?objectPage=7',
  'nara-bb-rb47-caa':     'https://catalog.archives.gov/id/28970538?objectPage=9',
  'nara-bb-rb47-adc':     'https://catalog.archives.gov/id/28970538?objectPage=10',
  'nara-bb-rb47-summary': 'https://catalog.archives.gov/id/28970538?objectPage=12',
  'nara-bb-rb47-mcdonald': 'https://catalog.archives.gov/id/28970538?objectPage=14',
  'nara-bb-rb47-klass':   'https://catalog.archives.gov/id/28970538?objectPage=21',
  'nara-bb-rb47-hrd':     'https://catalog.archives.gov/id/28970538?objectPage=39',
  'nara-bb-rb47-wing':    'https://catalog.archives.gov/id/28970538?objectPage=41',
  'nara-bb-rb47-chase':   'https://catalog.archives.gov/id/28970538?objectPage=45',
  // JAL 1628, 17 XI 1986: teczka regionu Alaska FAA w NARA, RG 237, seria NAID 733667 (41 jednostek,
  // 1569 obiektów, w całości w katalogu). Adres ?objectPage=N otwiera obraz N jednostki; każdy otwarty
  // w przeglądarce 15 X 2026 i sprawdzony po pliku, który strona wyświetla (prosi o jego info.json IIIF).
  // List Klassa (40586911, obrazy 24–25) ma na s. 1 datę 21 III 1987, a na s. 2 nagłówek „May 21, 1987”
  'nara-faa-jal-series':  'https://catalog.archives.gov/id/733667',
  'nara-faa-jal-release': 'https://catalog.archives.gov/id/40587486?objectPage=3',
  'nara-faa-jal-no-analysis': 'https://catalog.archives.gov/id/40587486?objectPage=6',
  'nara-faa-jal-uncorrelated': 'https://catalog.archives.gov/id/40587480?objectPage=1',
  'nara-faa-jal-simantel': 'https://catalog.archives.gov/id/40587480?objectPage=4',
  'nara-faa-jal-chronology': 'https://catalog.archives.gov/id/40587180?objectPage=2',
  'nara-faa-jal-pa-chronology': 'https://catalog.archives.gov/id/40587537?objectPage=30',
  'nara-faa-jal-incident': 'https://catalog.archives.gov/id/40586906?objectPage=1',
  'nara-faa-jal-controllers': 'https://catalog.archives.gov/id/40587240?objectPage=1',
  'nara-faa-jal-alert':   'https://catalog.archives.gov/id/40587497?objectPage=2',
  'nara-faa-jal-af-notes': 'https://catalog.archives.gov/id/40587497?objectPage=3',
  'nara-faa-jal-derry':   'https://catalog.archives.gov/id/40586960?objectPage=3',
  'nara-faa-jal-terauchi': 'https://catalog.archives.gov/id/40586988?objectPage=1',
  'nara-faa-jal-terauchi-interview': 'https://catalog.archives.gov/id/40587003?objectPage=11',
  'nara-faa-jal-tamefuji': 'https://catalog.archives.gov/id/40587024?objectPage=21',
  'nara-faa-jal-transcript': 'https://catalog.archives.gov/id/40587205?objectPage=1',
  'nara-faa-jal-radar-printout': 'https://catalog.archives.gov/id/40587258?objectPage=1',
  'nara-faa-jal-klass':   'https://catalog.archives.gov/id/40586911?objectPage=32',
  'nara-faa-jal-klass-letter': 'https://catalog.archives.gov/id/40586911?objectPage=25',
  'nara-faa-jal-ap-jupiter': 'https://catalog.archives.gov/id/40587582?objectPage=8',
  'nara-faa-jal-upi-caption': 'https://catalog.archives.gov/id/40587537?objectPage=29',
  'nara-washington-1952': 'https://prologue.blogs.archives.gov/2019/12/19/saucers-over-washington-the-history-of-project-blue-book/',

  'aaro':                 'https://www.aaro.mil/',
  'aaro-records':         'https://www.aaro.mil/UAP-Records/',
  'aaro-historical-v1':   'https://www.aaro.mil/Portals/136/PDFs/AARO_Historical_Record_Report_Vol_1_2024.pdf',
  'aaro-fy24':            'https://media.defense.gov/2024/Nov/14/2003583603/-1/-1/0/FY24-CONSOLIDATED-ANNUAL-REPORT-ON-UAP-508.PDF',

  'dod-navy-videos-2020': 'https://www.defense.gov/News/Releases/Release/Article/2165713/',
  // Czytelnia FOIA Marynarki Wojennej (SECNAV), folder „UAP INFO” i podfolder „UAP DOCUMENTS”. Każdy adres
  // otwarty na żywo 16 X 2026 (200; nagranie 206 na zapytanie o fragment, 5 619 302 B) i bajt w bajt zgodny
  // z kopią czytaną w audycie nimitz-2004 i roosevelt-2014.
  // navy-uap-foia to karta informacyjna CHINFO z 24 VII 2020 (odpowiedź A2 o nagraniu z 2004 r.), nie nagranie
  'navy-uap-foia':        'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/PAO%20Briefing%20Card%202020-012022%20and%202022-006563.pdf',
  'navy-flir1-video':     'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/1%20-%20FLIR.mp4',
  // nagranie GIMBAL (13 517 612 B, 34,5 s); otwarte na żywo 16 X 2026 (200) i bajt w bajt zgodne z kopią z audytu
  'navy-gimbal-video':    'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/2%20-%20GIMBAL.wmv',
  // nagranie GOFAST (13 509 612 B, 34,5 s); otwarte na żywo 16 X 2026 (200) i bajt w bajt zgodne z kopią z audytu
  'navy-gofast-video':    'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/3%20-%20GOFAST.wmv',
  'navy-tictac-slide':    'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/2004%20TIC%20TAC%20Slide.pdf',
  // briefing UAP Task Force z 31 VIII 2020 z e-mailami do NASA z IX 2020; slajd 4 „Tic Tac” to s. 6 pliku
  'navy-uaptf-nasa-brief': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/NASA%20Brief%20Redacted.pdf',
  // briefing Naval Intelligence Activity z 17 V 2021 (plik „UAPTF HPSCI Brief”); ten sam plik leży też
  // bezpośrednio w folderze „UAP INFO”
  'navy-nia-hpsci-brief': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/UAPTF%20HPSCI%20Brief%20Redacted.PDF',
  // briefingi ONI „Task Force Overview” z 27 II 2020 (plik „DDNI Brief”) i z 11 III 2020 (plik „HASC Brief”)
  'navy-oni-brief-2020-02': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/DDNI%20Brief%20Redacted.PDF',
  'navy-oni-brief-2020-03': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/HASC%20Brief%20Redacted.PDF',
  // e-maile Marynarki Wojennej: zapytanie o pilota VT-9 z 9 V 2019 (s. 32); sprawozdanie z briefingu dla
  // sen. Warnera z 20 VI 2019 (s. 1–2); odpowiedź dla Politico z 23 IV 2019 (s. 6–7) i tekst J. Strattona
  // z 24 IV 2019 (s. 22)
  'navy-emails-ufo':      'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/UFO_Redacted.pdf',
  'navy-emails-sipr':     'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/From%20SIPR_REDACTED.pdf',
  'navy-emails-unidentified-aircraft': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/Unidentified%20Aircraft_Redacted.pdf',
  // raporty zagrożeń (hazard reports) eskadr F/A-18 z W-72 i VX-23 z W-386, wydruki Naval Safety Center z 29 V 2019
  'navy-hazard-vfa11-2013-06-27': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20Hazard_BUNO%20166631_VFA11_27JUN2013(2).PDF',
  'navy-hazard-vfa143-2013-11-18': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20Hazard_BUNO%20166602%20aUNO%20unkown_VFA143_18NOV2013(2).PDF',
  'navy-hazard-vfa143-2013-12-18': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20Hazard_BUNO%20166608%20ad%20BUNO%20unk_VFA143_18DEC2013(2).PDF',
  'navy-hazard-vfa106-2014-03-26': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20hazard_BUNO%20168482%20aNO%20unknown_VFA106_26MAR2014(2).PDF',
  'navy-hazard-vfa11-2014-04-23': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20Hazard_BUNO%20166623_VFA-11_23Apr14(2).PDF',
  'navy-hazard-vfa11-2014-04-24': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20Hazard_BUNO%20166634%20aBUNO%20166624_VFA11_24APR2014(2).PDF',
  'navy-hazard-vfa11-2014-04-27': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20Hazard_BUNO%20Unknown%20F18_VFA11_27APR2014(2).PDF',
  'navy-hazard-vx23-2019-02-13': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/r_copy%20of%20hazard_BUNO%20169125_VX23_13FEB2019(2).PDF',
  // San Diego, lipiec 2019: dziennik CIC USS Rafael Peralta 14–16 VII (s. 12 i 14: drony), odprawa USS Paul Hamilton
  // z 17 VII (s. 2), baza incydentów 2017–2021 (wpis 19-095, s. 38) i dziennik pokładowy USS Russell z lipca 2019
  // (kopia z adnotacją (b)(3) przy zaczernieniu 15 VII, s. 43). Otwarte na żywo 16 X 2026 (200), bajt w bajt
  // zgodne z kopiami czytanymi w audycie
  'navy-rpr-cic-log':     'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/RPR%20CIC%20Log%2014-16JUL19%20PROP%20REDS_Redacted.pdf',
  'navy-phm-uas-brief':   'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/FLIR%20PHOTO_Brief_Redacted.pdf',
  'navy-incident-db':     'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/Incident%20databas%202017-2021.pdf',
  'navy-russell-deck-log': 'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/2019-07%20RUSSEL_Redacted.pdf',

  'odni-2021':            'https://www.dni.gov/files/ODNI/documents/assessments/Prelimary-Assessment-UAP-20210625.pdf',
  'odni-2022':            'https://www.dni.gov/files/ODNI/documents/assessments/Unclassified-2022-Annual-Report-UAP.pdf',

  'nasa-uap-report':      'https://science.nasa.gov/wp-content/uploads/2023/09/uap-independent-study-team-final-report.pdf',
  'nasa-uap':             'https://science.nasa.gov/uap/',

  'condon':               'https://files.ncas.org/condon/',
  'condon-conclusions':   'https://files.ncas.org/condon/text/sec-i.htm',

  // Druk przesłuchania z 26 VII 2023 (Serial No. 118-53): numer strony drukowanej = strona PDF − 4.
  // Pisemne oświadczenia Fravora i Gravesa na stronie komisji. Wszystkie otwarte na żywo 16 X 2026 (200)
  // i bajt w bajt zgodne z kopiami czytanymi w audycie nimitz-2004 i roosevelt-2014
  'oversight-2023-transcript': 'https://www.congress.gov/118/meeting/house/116282/documents/HHRG-118-GO06-Transcript-20230726.pdf',
  'oversight-2023-govinfo':    'https://www.govinfo.gov/content/pkg/CHRG-118hhrg53022/html/CHRG-118hhrg53022.htm',
  'oversight-2023-fravor':     'https://oversight.house.gov/wp-content/uploads/2023/07/David-Fravor-Statement-for-House-Oversight-Committee.pdf',
  'oversight-2023-graves':     'https://oversight.house.gov/wp-content/uploads/2023/07/Ryan-HOC-Testimony.pdf',

  // Teheran 1976: depesza biura attaché z 23 IX 1976 (IR 6 846 0139 76) w czytelni DIA; te same skany z kartą
  // obiegową z 8 XII 1978 i oceną DIA w aktach NSA w NARA (RG 615, s. 3–6 pliku); ta sama depesza przekazana
  // przez JCS; raport attaché z VII 1978 z odpowiedzią na ocenę (plik 237664, s. PDF 25–26); w Roswell Report
  // Source Files (RG 341) nota „MIJI Quarterly” z X 1978 (obraz 3), artykuł Shieldsa (obrazy 3–5) i wywiady
  // z Perouzim (obrazy 1, 6). Pliki DIA i PDF z NARA pobrane 16 X 2026 (200), bajt w bajt zgodne z pobranymi
  // 15 X; strony katalogu NARA otwarte w przeglądarce 16 X 2026 i sprawdzone po pliku, który ładują
  'dia-iran-ufo-1976':    'https://www.dia.mil/FOIA/FOIA-Electronic-Reading-Room/FileId/238156/',
  'dia-ufo-reports':      'https://www.dia.mil/FOIA/FOIA-Electronic-Reading-Room/FileId/237664/',
  'nara-dia-tehran-eval': 'https://catalog.archives.gov/id/596347947',
  'nara-nsa-tehran-copy': 'https://catalog.archives.gov/id/596347929',
  'nara-af-miji-1978':    'https://catalog.archives.gov/id/40989205?objectPage=3',
  'nara-af-cockpit-1976': 'https://catalog.archives.gov/id/40989206?objectPage=3',
  'nara-af-perouzi':      'https://catalog.archives.gov/id/40989204?objectPage=1',
  'cia-readingroom':      'https://www.cia.gov/readingroom/',
  // Wycinek „The Washington Post” z 19 I 1979, s. A-1 (kopia ma tylko pierwszą stronę), nie wywiady z uczestnikami
  'cia-mysterious-craft': 'https://www.cia.gov/readingroom/docs/CIA-RDP88-01315R000300070004-1.pdf',

  // ——— Wielka Brytania
  'tna-ufo':              'https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/',
  'tna-ufo-guide':        'https://cdn.nationalarchives.gov.uk/documents/ufo-research-guide-2013.pdf',
  'tna-rendlesham':       'https://discovery.nationalarchives.gov.uk/details/r/C10342055',
  'tna-rendlesham-story': 'https://www.nationalarchives.gov.uk/state-secrets/mysteries/defe-241948/',

  // ——— Francja
  'geipan':               'https://www.geipan.fr/',
  'geipan-process':       'https://www.geipan.fr/en/node/422',
  // Trans-en-Provence 1981: nota techniczna GEPAN nr 16 i broszura CNES o SEPRA. Oficjalne adresy
  // https://www.geipan.fr/sites/default/files/note_tech_16.pdf i …/sepra.pdf odpowiadały 429 na każdą próbę
  // 15 X 2026 (osiem prób co 3 min) i 16 X 2026 (skrypt co kilka minut i zwykły Edge), więc tymczasowo kopie
  // Internet Archive dokładnie tych adresów: otwarte na żywo 16 X 2026 (200), pliki bajt w bajt zgodne
  // z pobranymi 15 X (2 445 614 B i 9 997 769 B). Przy każdej kolejnej rundzie próbować oficjalnych adresów
  'geipan-nt16':          'https://web.archive.org/web/20240718123710/https://www.geipan.fr/sites/default/files/note_tech_16.pdf',
  'geipan-sepra':         'https://web.archive.org/web/20240712043433/https://www.geipan.fr/sites/default/files/sepra.pdf',

  // ——— Włochy
  'am-ovni':              'https://www.aeronautica.difesa.it/en/ovni/',
  // Tabela zbiorcza obserwacji 1972–1990 według regionów i lat (razem 208), podlinkowana na stronie am-ovni
  'am-ovni-1972-1990':    'https://www.aeronautica.difesa.it/wp-content/uploads/2023/05/INT.Dperiodo1972-1990.pdf',

  // ——— Kanada
  // Archiwalna baza UFO Library and Archives Canada (collectionscanada.gc.ca); stare adresy bac-lac.gc.ca 5 X 2026 zrywały połączenie.
  // Teczka RCMP HQ-400-Q-5 (MIKAN 134176): raport o Stefanie Michalaku, s. 1 z datą 26 V 1967 i strona „5” z datą 10 VIII 1967.
  'lac-falcon-lake':      'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8332&record_id=37024-8332-6343',
  'lac-falcon-lake-2':    'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8291&record_id=37024-8291-6311',
  // Falcon Lake 1967: kolejne strony teczki RCMP HQ-400-Q-5 (isn 37024) i teczki NRC (RG 77, Vol. 311, isn 4731).
  // 119.01 to opis pozycji z odnośnikiem do obrazu, 119.02 sam obraz strony. Każdy adres otwarty 15 X 2026 i
  // sprawdzony po pliku JPG, który pokazuje strona obrazu. W teczce NRC numer strony bazy rozjeżdża się z numerem
  // pliku po lukach: strona 3865 to e002749689.jpg (teleks z 22 V 1968), 3873 to e002749698.jpg (Traill, s. 1)
  'lac-falcon-rcmp-0526-2': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8333&record_id=37024-8333-6344',
  'lac-falcon-rcmp-0526-4': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8335&record_id=37024-8335-6346',
  'lac-falcon-interview': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.02-e.php?isn_id_nbr=37024&page_id_nbr=8313&record_id=37024-8314-6326',
  'lac-falcon-rcmp-0810': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8287&record_id=37024-8287-6307',
  'lac-falcon-rcmp-0810-3': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8289&record_id=37024-8289-6309',
  'lac-falcon-rcmp-0810-6': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8292&record_id=37024-8292-18',
  'lac-falcon-rcmp-0810-8': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8294&record_id=37024-8294-6314',
  'lac-falcon-hunt':      'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=37024&page_id_nbr=8280&record_id=37024-8280-13029',
  'lac-falcon-bissky':    'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.02-e.php?isn_id_nbr=4731&page_id_nbr=3791&record_id=4731-3789-9918',
  'lac-falcon-annex-a':   'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=4731&page_id_nbr=3797&record_id=4731-3797-9924',
  'lac-falcon-cfhq':      'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.02-e.php?isn_id_nbr=4731&page_id_nbr=3795&record_id=4731-3789-9918',
  'lac-falcon-oatway':    'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.01-e.php?isn_id_nbr=4731&page_id_nbr=3831&record_id=4731-3831-9942',
  'lac-falcon-telex-1968': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.02-e.php?isn_id_nbr=4731&page_id_nbr=3865&record_id=4731-3863-13768',
  'lac-falcon-traill':    'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.02-e.php?isn_id_nbr=4731&page_id_nbr=3873&record_id=4731-3874-13778',
  'lac-falcon-millman':   'https://www.collectionscanada.gc.ca/databases/ufo/001057-119.02-e.php?isn_id_nbr=4731&page_id_nbr=3876&record_id=4731-3874-13778',
  // Podcast LAC z 15 V 2019, część 1, z zapisem rozmowy: relacja, nie dokument
  'lac-falcon-podcast':   'https://www.canada.ca/en/library-archives/collection/engage-learn/podcasts/discover/episode-053.html',
  // Część 2 z 29 V 2019: jedyne źródło zdania, że DND wciąż uznaje sprawę za nierozwiązaną (narracja prowadzącej)
  'lac-falcon-podcast-2': 'https://www.canada.ca/en/library-archives/collection/engage-learn/podcasts/discover/episode-054.html',
  // Wyszukiwanie w bazie po dacie obserwacji 4 X 1967: relacje świadków w aktach NRC i korespondencja w aktach RCMP
  'lac-ufo-search-1967-10-04': 'https://www.collectionscanada.gc.ca/databases/ufo/001057-110.01-e.php?interval=50&q2=10/4/1967',
  // Opis zbioru UFO Library and Archives Canada na canada.ca; adresy bac-lac.gc.ca 5 X 2026 zrywały połączenie
  'lac-ufos':             'https://www.canada.ca/en/library-archives/collection/research-help/science-technology/ufos.html',

  // ——— Australia
  'naa-ufo':              'https://www.naa.gov.au/blog/flying-saucers-fact-or-fiction',
  'naa-woomera':          'https://www.naa.gov.au/students-and-teachers/student-research-portal/learning-resource-themes/war/defence-equipment-and-weapons/ufo-sightings-weapons-testing-site-woomera',

  // ——— Hiszpania
  'es-ovni':              'https://bibliotecavirtual.defensa.gob.es/BVMDefensa/exp_ovni/es/micrositios/inicio.do',
  'es-ovni-listado':      'https://bibliotecavirtual.defensa.gob.es/BVMDefensa/es/consulta/registro.do?control=BMDB20170010265',

  // ——— Brazylia
  'br-an-ovni':           'https://dibrarq.arquivonacional.gov.br/index.php/objeto-voador-nao-identificado-ovni',
  'br-an-news':           'https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/conheca-o-fundo-sobre-ovnis-do-arquivo-nacional',
  'br-ufo-night':         'https://www.gov.br/en/government-of-brazil/latest-news/2022/official-ufo-night-in-brazil',
  'br-varginha-file':     'http://imagem.sian.an.gov.br/acervo/derivadas/BR_DFANBSB_ARX/0/0/0443/BR_DFANBSB_ARX_0_0_0443_d0001de0001.pdf',
  'br-1977-file':         'http://imagem.sian.an.gov.br/acervo/derivadas/br_dfanbsb_v8/mic/gnc/kkk/83003252/br_dfanbsb_v8_mic_gnc_kkk_83003252_d0001de0001.pdf',

  // ——— Szwecja
  // Zapis podcastu Riksarkivet (Arkivpodden, odcinek 33 z 27 IV 2023, zapis opublikowany 15 XI 2024): rozmowa
  // z kierownikiem Krigsarkivet. To relacja archiwisty, a nie dokument; jedyna sygnatura w tekście to rozkaz Fst/L 12/6 1946 NR 7:49.
  'ra-spokraketer':       'https://riksarkivet.se/resurser/spokraketer',

  // ——— Chile
  'cl-sefaa':             'https://sefaa.dgac.gob.cl/',

  // ——— Norwegia
  // Strona główna Project Hessdalen: opis projektu przez sam projekt („A non-profit volunteer Citizen Science
  // organization”, Blue Box od 1998 r., obserwacja z 1 IX 2026). Strona się zmienia, sprawa cytuje stan z 16 X 2026
  'hessdalen':            'https://www.hessdalen.org/',
  // Raport z kampanii 1984 r. (E. Strand, podpisany 5 I 1985) z aneksami; otwarty na żywo 16 X 2026, tekst zgodny z 15 X
  'hessdalen-1984':       'https://old.hessdalen.org/reports/hpreport84.shtml',
  // Vargemezis i in., J. Appl. Geophys. 226 (2024) 105398. DOI otwarty 16 X 2026: prowadzi do strony artykułu
  // w ScienceDirect (pii S0926985124001149), która automatom pokazuje test „Are you a robot?”; tekst czytany z kopii
  // opublikowanego PDF na stronie projektu (old.hessdalen.org/reports/Geophysics-2024.pdf, 200, 20 603 496 B)
  'hessdalen-vlf-2024':   'https://doi.org/10.1016/j.jappgeo.2024.105398',

  // ——— Dodane w drugiej rundzie weryfikacji
  'nara-uap-bulk':        'https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download',
  'nara-citizen-archivist': 'https://www.archives.gov/citizen-archivist/missions',
  'nara-unwritten-record':  'https://unwritten-record.blogs.archives.gov/tag/project-blue-book/',
  'dtic-special-report-14': 'https://apps.dtic.mil/sti/tr/pdf/AD0069211.pdf',
  'ia-special-report-14':   'https://archive.org/details/ProjectBlueBookSpecialReport14',

  // ——— Biblioteka Kongresu: prasa z epoki
  'loc-airship-subject':  'https://id.loc.gov/authorities/sh2008006799',
  'loc-chronicling':      'https://www.loc.gov/collections/chronicling-america/',
  'loc-airship-1897':     'https://chroniclingamerica.loc.gov/lccn/sn85054468/1897-04-20/ed-1/seq-3/',

  // ——— Zentralbibliothek Zürich: oryginalna ulotka z 1561 r.
  'zb-nuremberg-1561':    'https://www.e-manuscripta.ch/zuzneb/doi/10.7891/e-manuscripta-91897',
  'zb-wickiana':          'https://www.zb.uzh.ch/en/news/wickiana',

  // ——— 2023: balon i strącenia
  'norad-vanherck-2023':  'https://www.norad.mil/Newsroom/Press-Releases/Article/3288728/statement-from-gen-glen-vanherck-commander-north-american-aerospace-defense-com/',
  'northcom-vanherck-2023': 'https://www.northcom.mil/Newsroom/News/Article/Article/3288730/statement-from-gen-glen-vanherck-commander-north-american-aerospace-defense-com/',
  'dod-briefing-2023':    'https://www.defense.gov/News/Transcripts/Transcript/Article/3296177/melissa-dalton-assistant-secretary-of-defense-for-homeland-defense-and-hemisphe/',

  // ——— Drony nad Kolorado 2019/2020
  'co-drone-taskforce':   'https://publicsafety.colorado.gov/press-release/updates-on-investigations-into-suspicious-drone-activity-in-ne-colorado',
  'faa-uas-sightings':    'https://www.faa.gov/uas/resources/public_records/uas_sightings_report',

  // ——— Pomoce archiwalne (wskazują, gdzie dokument leży — nie sam dokument)
  'naa-recordsearch':     'https://recordsearch.naa.gov.au/',
  'tna-discovery':        'https://discovery.nationalarchives.gov.uk/',

  // ——— AARO: raporty rozstrzygnięcia poszczególnych spraw
  'aaro-case-reports':    'https://www.aaro.mil/UAP-Cases/UAP-Case-Resolution-Reports/',
  'aaro-case-aguadilla':  'https://www.aaro.mil/Portals/136/PDFs/case_resolution_reports/AARO_Puerto_Rico_UAP_Case_Resolution.pdf',
  'aaro-case-gofast':     'https://www.aaro.mil/Portals/136/PDFs/case_resolution_reports/AARO_GoFast_Case_Resolution_Card_Methodology_Final.pdf',
  // slajdy AARO dla senackiej podkomisji, 19 XI 2024 (RG 615, NAID 499915941, plik 09_Open_Hearing_Slides.pdf);
  // slajd 5 to GO FAST. Rekord sprawdzony przez API katalogu, plik pobrany 16 X 2026 (200, 3 266 777 B)
  'nara-aaro-sasc-2024-slides': 'https://catalog.archives.gov/id/499915941',
  'aaro-case-taqaddam':   'https://www.aaro.mil/Portals/136/PDFs/case_resolution_reports/AARO_Al_Taqaddam_Case_Resolution_Final.pdf',
  'aaro-case-wakes':      'https://www.aaro.mil/Portals/136/PDFs/case_resolution_reports/Case_Resolution_of_Atmospheric_Wakes_508-02262024.pdf',
  'aaro-imagery':         'https://www.aaro.mil/UAP-Cases/Official-UAP-Imagery/',
  'aaro-trends':          'https://www.aaro.mil/UAP-Cases/UAP-Reporting-Trends/',
  'aaro-fy25':            'https://www.aaro.mil/Portals/136/PDFs/FY25%20UAP%20Annual%20Report/AARO_FY2025_Consolidated_Annual_Report_on_UAP.pdf',
  'aaro-mission-brief':   'https://www.aaro.mil/Portals/136/PDFs/AARO_Mission_Brief_2025.pdf',
  'geipan-search':        'https://geipan.fr/en/recherche/cas/tab',

  // ——— PURSUE: dokumenty pobrane od wydawcy, adresy sprawdzone pobraniem pliku
  'pursue':               'https://www.war.gov/ufo/',
  'pursue-d077':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DOW-UAP-D077_Unresolved-Case-Analysis-Update_Western-United-States-Event.pdf',
  'pursue-d078':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DOW-UAP-D078_Notional-Map_Western-United-States-Event.pdf',
  'pursue-d079':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DoW-UAP-D079_Narrative-1_Western-US-Event.pdf',
  'pursue-d080':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DoW-UAP-D080_Narrative-2_Western-US-Event.pdf',
  'pursue-d081':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DoW-UAP-D081_Narrative-3_Western-US-Event.pdf',
  'pursue-d082':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DoW-UAP-D082_Narrative-4_Western-US-Event.pdf',
  'pursue-d083':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DoW-UAP-D083_Narrative-5_Western-US-Event.pdf',
  'pursue-d087':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DOW-UAP-D087_US-AirForce_Analysis-of-Flying-Objects-in-the-US_1-100.pdf',
  'pursue-d088':          'https://www.war.gov/medialink/ufo/061226/release_03/documents/DOW-UAP-D088_US-AirForce_Analysis-of-Flying-Objects-in-the-US_101-172.pdf',
  'pursue-d094':          'https://www.war.gov/medialink/ufo/071026/release_04/documents/DOW-UAP-D094_Analysis-of-Flying-Object-Incidents-in-the-US_1949.pdf',
  'pursue-d095':          'https://www.war.gov/medialink/ufo/071026/release_04/documents/DOW-UAP-D095_Joint-US-Canadian-Aviation-Projects-and-UFO-Sighting-Reports_1954-1955.pdf',
  'pursue-d110':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D110_AAWSAP-Statement-of-Objectives-July-18-2008.pdf',
  'pursue-d111':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D111_AAWSAP-Solicitation-and-Original-Order-September-22-2008.pdf',
  'pursue-d112':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D112_AAWSAP-Contract-Modification-P00001-September-2-2009.pdf',
  'pursue-d113':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D113_AAWSAP-Contract-Modification-P00002-February-2-2010.pdf',
  'pursue-d114':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D114_AAWSAP-Contract-Modification-P00003-May-18-%202010.pdf',
  'pursue-d115':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D115_AAWSAP-Contract-Modification-P00004-May-18-2010.pdf',
  'pursue-d116':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D116_AAWSAP-Contract-Modification-P00005-September-28-2010.pdf',
  'pursue-d102':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D102_Project-Blue-Book-File-on-Tremonton-Film-Utah-1952.pdf',
  'pursue-d103':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D103_Project-Blue-Book-Photo-File-Relating-to-Tremonton-Film-Utah-1952.pdf',
  'pursue-d104':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D104_Final-Personnel-Record-for-Newhouse-Delbert-C-US-Navy-1957.pdf',
  'pursue-ica-d001':      'https://www.war.gov/medialink/ufo/061226/release_03/documents/ICA-UAP-D001_Analysis_Colorado-Springs-UAP-Incident.pdf',
  'pursue-fbi-d001':      'https://www.war.gov/medialink/ufo/061226/release_03/documents/FBI-UAP-D001_FD-302_Unresolved-UAP-Report_ColoradoSprings_2022.pdf',
  'pursue-fbi-d002':      'https://www.war.gov/medialink/ufo/061226/release_03/documents/FBI-UAP-D002_FD-1057_Unresolved-UAP-Report_ColoradoSprings_2022.pdf',
  // FBI, obserwacja z września 2023 (wydanie 01): trzy FD-302 i szkic, otwarte na żywo 4 X 2026
  // i porównane bajt w bajt z paczką; uap-data.csv to wykaz, z którego war.gov/ufo buduje tabelę
  'pursue-fbi-sep2023-serial-3': 'https://www.war.gov/medialink/ufo/release_1/serial-3_redacted.pdf',
  'pursue-fbi-sep2023-serial-4': 'https://www.war.gov/medialink/ufo/release_1/serial-4-redacted_redacted.pdf',
  'pursue-fbi-sep2023-serial-5': 'https://www.war.gov/medialink/ufo/release_1/serial%205%20redacted_redacted.pdf',
  'pursue-fbi-sep2023-sketch':   'https://www.war.gov/medialink/ufo/release_1/2024-04-30-composite-sketch.pdf',
  'pursue-uap-data-csv':         'https://www.war.gov/Portals/1/Interactive/2026/UFO/uap-data.csv',
  // Wydanie 05, Conde w Bahii, listopad 1963: adresy ze spisu wydawcy (uap-data.csv), pobrane
  // 5 X 2026 i porównane bajt w bajt z paczką release_05_Aug_07_documents.zip
  'pursue-eop-d001':      'https://www.war.gov/medialink/ufo/release_05/Aug_07/documents/EOP-UAP-D001_NASC-Inquiry-into-Bahia-Brazil-Incident_November-13-1963.pdf',
  'pursue-dos-d001':      'https://www.war.gov/medialink/ufo/release_05/Aug_07/documents/DOS-UAP-D001_Diplomatic-Cable_Brazil_November-14-1963.pdf',
  'pursue-dos-d002':      'https://www.war.gov/medialink/ufo/release_05/Aug_07/documents/DOS-UAP-D002_Diplomatic-Cable_Brazil_November-20-1963.pdf',
  // Rakiety widma 1946: przegląd wywiadu USA z 9 I 1947 (D099), prośba AMC o plik „Swedish Incidents”
  // (D100) i raport COMETA z 1999 r. w przekładzie złożonym w wydaniu 01; pobrane 5 X 2026 i porównane
  // bajt w bajt z paczkami wydań 05 i 01
  'pursue-d099':          'https://www.war.gov/medialink/ufo/release_05/Aug_07/documents/DOW-UAP-D099_Intelligence-Review-of-Ghost-Rocket-Incidents_1947.pdf',
  'pursue-d100':          'https://www.war.gov/medialink/ufo/release_05/Aug_07/documents/DOW-UAP-D100_Air-Materiel-Command-Report-on-UFOs_1947-1948.pdf',
  // Plik RG 255 413270 ma 94 strony PDF, a raport COMETA to tylko s. 5–86. S. 1–4 i 87–94 to okładka
  // teczki, list, odręczna notatka i wycinki prasowe (z arkuszem NARCAP, depeszą AFP i życiorysem
  // Leslie Kean); s. 91 to artykuł z „The Boston Sunday Globe”. Przed cytowaniem strony zobacz jej obraz
  'pursue-rg255-cometa':  "https://www.war.gov/medialink/ufo/release_1/255_413270_ufo's_and_defense_what_should_we_prepare_for.pdf",
  // Foo fighters 1944–45: teczka SHAEF 37153 (RG 331) z wydania 01, pod adresem z półpauzą, jak w spisie
  // wydawcy; to inny PDF tych samych 17 skanów niż w paczce (bez warstwy tekstu), porównany strona po stronie
  // 15 X 2026. D092: jawna kopia sprawozdania Duranta z 1953 r. w teczce komitetu z lat 1966–67, pobrana
  // 15 X 2026 i bajt w bajt zgodna z paczką wydania 04
  'pursue-rg331-37153':   'https://www.war.gov/medialink/ufo/release_1/331_120752_numeric_files_1944%E2%80%931945_37153_german_armament_equipment_documents.pdf',
  'pursue-d092':          'https://www.war.gov/medialink/ufo/071026/release_04/documents/DOW-UAP-D092_DAF-Committee-to-Review-Project-Bluebook_1966-1967.pdf',
  'pursue-cia-d020':      'https://www.war.gov/medialink/ufo/071026/release_04/documents/CIA-UAP-D020_Memorandum-on-Unconventional-Aircraft-Sightings_1955.pdf',
  'pursue-cia-d021':      'https://www.war.gov/medialink/ufo/071026/release_04/documents/CIA-UAP-D021_Analysis-of-Unconventional-Aircraft-Sightings_1955.pdf',
  'pursue-cia-006':       'https://www.war.gov/medialink/ufo/061226/release_03/documents/CIA-UAP-006_Sighting_of_Unconventional_Aircraft.pdf',
  'pursue-cia-002':       'https://www.war.gov/medialink/ufo/061226/release_03/documents/CIA-UAP-002_Scientific-Advisory-Panel-on-Unidentified-Flying-Objects_Report_1952-1953.pdf',
  // Historia programów U-2 i OXCART (History Staff CIA, 1992); s. 94–95 druku to s. PDF 107–108
  // (oddział A w Lakenheath od 4 V 1956, w Wiesbaden od 11 VI 1956). Pobrana 16 X 2026, zgodna z paczką
  'pursue-cia-003':       'https://www.war.gov/medialink/ufo/061226/release_03/documents/CIA-UAP-003-THE_CENTRAL_INTELLIGENCE_AGENCY_AND_OVERHEAD_RECONNAISSANCE-THE_U-2_AND_OXCART_PROGRAMS_1954-1974.pdf',
  'pursue-cia-014':       'https://www.war.gov/medialink/ufo/061226/release_03/documents/CIA-UAP-014_British_Activity_in_the_Field_of_Unidentified_Flying_Objects.pdf',
  'pursue-cia-016':       'https://www.war.gov/medialink/ufo/061226/release_03/documents/CIA-UAP-016-Sightings_of_Unidentified_Flying_Ojbects_in_Ladakh_Nepal_Sikkim_and_Bhutan.pdf',
  'pursue-cia-017':       'https://www.war.gov/medialink/ufo/061226/release_03/documents/CIA-UAP-017_Placement_on_High_Alert_Due_to_Perceived_Aggressive_Foreign_Posturing.pdf',
  // Wydanie 06: DIRD z 11 III 2010 r. o skutkach pól dla tkanek (D128), pochodzenie twierdzenia
  // cash-landrum-radiation (s. 15, 19, 23, 26, 28). Otwarta na żywo 15 X 2026: 200, 45 830 558 B, warstwa
  // tekstu zgodna na wszystkich 38 stronach z przeszukiwaną; bajtów nie porównano z paczką wydania 06
  'pursue-d128':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D128_AAWSAP-DIRD-Anomalous-Acute-and-Subacute-Field-Effects-on-Human-Biological-Tissues-March-11-2010.pdf',
  // Wydanie 01: raporty z misji porównane bajt w bajt z paczką, nagrania na stronach DVIDS
  // otwartych na żywo; tytuł strony zgadza się z nagłówkiem XMP pliku z paczki uapvideos.zip
  'pursue-d25':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d25-mission-report-greece-january-2024.pdf',
  'pursue-d27':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d27-mission-report-united-arab-emirates-october-2023.pdf',
  'pursue-pr28':          'https://www.dvidshub.net/video/1006073/dow-uap-pr28-unresolved-uap-report-greece-january-2024',
  'pursue-pr29':          'https://www.dvidshub.net/video/1006074/dow-uap-pr29-unresolved-uap-report-united-arab-emirates-june-2024',
  // 33 SOS nad Morzem Egejskim, 27 i 29 października 2023: raporty z wydania 01 porównane bajt
  // w bajt z paczką i z plikiem na żywo, nagrania na stronach DVIDS otwartych na żywo
  'pursue-d33':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d33-mission-report-greece-october-2023.pdf',
  'pursue-d35':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d35-mission-report-greece-october-2023.pdf',
  'pursue-pr34':          'https://www.dvidshub.net/video/1006080/dow-uap-pr34-unresolved-uap-report-greece-october-2023',
  'pursue-pr35':          'https://www.dvidshub.net/video/1006082/dow-uap-pr35-unresolved-uap-report-greece-october-2023',
  // Irak, 5 maja 2022: raporty 20 ATKS (D109) i 196 ATKS (D106) z tym samym akapitem, nagrania
  // PR140/PR141 (należą do D109), stopklatki PR130/PR131 (tylko kolejność stron przed D106) i D10
  // do porównania; pliki porównane bajt w bajt z paczkami, strony DVIDS otwarte na żywo
  'pursue-d106':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D106_Mission-Report-Iraq-2022.pdf',
  'pursue-d109':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D109_Mission-Report-Middle-East-2022.pdf',
  'pursue-pr130':         'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-PR130_Unresolved-UAP-Report-Iraq-2022.pdf',
  'pursue-pr131':         'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-PR131_Unresolved-UAP-Report-Iraq-2022.pdf',
  'pursue-pr140':         'https://www.dvidshub.net/video/1023398/dow-uap-pr140-unresolved-uap-report-middle-east-2022',
  'pursue-pr141':         'https://www.dvidshub.net/video/1023400/dow-uap-pr141-unresolved-uap-report-middle-east-2022',
  'pursue-d10':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d10-mission-report-middle-east-may-2022.pdf',
  // 65 SOS, 29 lipca 2025: raport D108 (porównany bajt w bajt z paczką wydania 06, CRC 5f85ae27)
  // i nagranie PR135 (strona DVIDS otwarta na żywo)
  'pursue-d108':          'https://www.war.gov/medialink/ufo/sept-18/release-06/assets/DOW-UAP-D108_Mission-Report-Middle-East-2025.pdf',
  'pursue-pr135':         'https://www.dvidshub.net/video/1023397/dow-uap-pr135-unresolved-uap-report-middle-east-2025',
  // 482 ATKS nad Zatoką Perską, lipiec–listopad 2020: raporty z wydania 01 (porównane bajt w bajt
  // z paczką) i nagrania z wydania 02 na stronach DVIDS (otwarte na żywo)
  'pursue-d42':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d42-range-fouler-debrief-japan-2023.pdf',
  'pursue-d60':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d60-mission-report-persian-gulf-august-2020.pdf',
  'pursue-d61':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d61-mission-report-persian-gulf-august-2020.pdf',
  'pursue-d62':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d62-mission-report-strait-of-hormuz-september-2020.pdf',
  'pursue-d63':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d63-mission-report-strait-of-hormuz-october-2020.pdf',
  'pursue-d64':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d64-mission-report-iran-november-2020.pdf',
  'pursue-d65':           'https://www.war.gov/medialink/ufo/release_1/dow-uap-d65-mission-report-persian-gulf-july-2020.pdf',
  'pursue-pr077':         'https://www.dvidshub.net/video/1007809/dow-uap-pr077-2-november-2020-callsign-callsign-observes-and-tracks-uap-1-2',
  'pursue-pr078':         'https://www.dvidshub.net/video/1007812/dow-uap-pr078-2-november-2020-callsign-callsign-observes-and-tracks-uap-2-2',
  'pursue-pr088':         'https://www.dvidshub.net/video/1007800/dow-uap-pr088-31-aug-callsign-callsign-observes-uap',
  'pursue-pr089':         'https://www.dvidshub.net/video/1007712/dow-uap-pr089-31-aug-callsign-callsign-observes-uap-part2',
  // wydanie 05: jedno z pięciu nagrań „Unresolved UAP Report, Pacific Ocean, 2019” (PR123–PR127); strona DVIDS
  // otwarta na żywo 16 X 2026 (200)
  'pursue-pr124':         'https://www.dvidshub.net/video/1017806/dow-uap-pr124-unresolved-uap-report-pacific-ocean-2019',

  // ——— Condon Report: konkretne sprawy, nie tylko tom
  'condon-contents':      'https://files.ncas.org/condon/text/contents.htm',
  'condon-case02':        'https://files.ncas.org/condon/text/case02.htm',
  'condon-case05':        'https://files.ncas.org/condon/text/case05.htm',
  'condon-case49':        'https://files.ncas.org/condon/text/case49.htm',
  'condon-photo':         'https://files.ncas.org/condon/text/s3chap02.htm',
  'condon-radar':         'https://files.ncas.org/condon/text/s6chap05.htm',
  // Thayer, „Optical and Radar Analyses of Field Cases” (Section III, rozdz. 5): Lakenheath jako Case 2,
  // RB-47 jako Case 5 z datą 19 IX 1957
  'condon-optical-radar': 'https://files.ncas.org/condon/text/s3chap05.htm',

  // ——— Roswell: oficjalne raporty USAF i GAO
  'roswell-case-closed':  'https://www.govinfo.gov/content/pkg/GOVPUB-D301-PURL-gpo92195/pdf/GOVPUB-D301-PURL-gpo92195.pdf',
  'roswell-fact-fiction': 'https://apps.dtic.mil/sti/pdfs/ADA326148.pdf',
  // teczka FBI 62-HQ-83894 z wydania 01, pliki porównane bajt w bajt z paczką
  'pursue-fbi-62-83894-s1': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_1.pdf',
  'pursue-fbi-62-83894-s5': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_5.pdf',
  'pursue-fbi-62-83894-s6': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_6.pdf',
  'pursue-fbi-62-83894-serial-153': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_serial_153.pdf',
  'pursue-fbi-62-83894-s4': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_4.pdf',
  'pursue-fbi-62-83894-s9': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_9.pdf',
  // Section 10, s. 29: wycinek z 16 X 1966 r., który opowiada Kelly wśród obserwacji z 1966 r.; otwarty na żywo
  // 15 X 2026 i bajt w bajt zgodny z paczką wydania 01
  'pursue-fbi-62-83894-s10': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_10.pdf',
  'pursue-fbi-62-83894-serial-438': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_serial_438.pdf',
  // Maury Island 1947: Section 2 i 3 oraz SUB_A, otwarte na żywo 5 X 2026 i zgodne bajt w bajt z paczką
  'pursue-fbi-62-83894-s2': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_2.pdf',
  'pursue-fbi-62-83894-s3': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_section_3.pdf',
  'pursue-fbi-62-83894-sub-a': 'https://www.war.gov/medialink/ufo/release_1/65_hs1-834228961_62-hq-83894_sub_a.pdf',
  'roswell-af':           'https://www.af.mil/The-Roswell-Report/',
  'gao-roswell-1995':     'https://www.govinfo.gov/content/pkg/GAOREPORTS-NSIAD-95-187/pdf/GAOREPORTS-NSIAD-95-187.pdf',
  'nara-roswell-vol1':    'https://archive.org/details/gov.archives.341-roswell-1',
};

export function resolveSource(ref?: string, url?: string): string | undefined {
  if (url) return url;
  if (ref && SOURCE_URL[ref]) return SOURCE_URL[ref];
  return undefined;
}

/**
 * Pomoce archiwalne. Wskazują instytucję przechowującą dokument, a nie sam dokument,
 * więc NIE liczą się do wskaźnika proweniencji. Rozróżnienie jest celowe:
 * „wiemy, gdzie to leży” to nie to samo co „oto materiał”.
 */
export const FINDING_AIDS = new Set([
  'naa-recordsearch', 'tna-discovery', 'nara-catalog',
  'nara-uap', 'nara-uap-microfilm', 'cia-readingroom',
  'geipan', 'br-an-ovni', 'es-ovni', 'aaro-records', 'loc-chronicling',
  'nara-citizen-archivist', 'nara-unwritten-record', 'zb-wickiana',
  'faa-uas-sightings',
  'aaro-case-reports', 'aaro-imagery', 'aaro-trends', 'geipan-search',
  'condon-contents', 'roswell-af', 'nara-rg615', 'lac-ufos',
  'lac-ufo-search-1967-10-04',
  // Strona główna AARO. Sprawy podpisywały nią konkretny materiał (nagranie CBP,
  // raporty marynarki), którego pod tym adresem nie ma, więc do czasu audytu tych
  // spraw liczy się jako wskazanie archiwum. Strona główna Project Hessdalen wyszła
  // z tej listy po audycie hessdalen-1984: sprawa cytuje ją jako opis projektu (T4)
  'aaro',
]);

export function isFindingAid(ref?: string): boolean {
  return !!ref && FINDING_AIDS.has(ref);
}

export const SOURCE_COUNT = Object.keys(SOURCE_URL).length;
