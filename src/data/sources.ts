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
  'nara-catalog':         'https://catalog.archives.gov/',
  'nara-washington-1952': 'https://prologue.blogs.archives.gov/2019/12/19/saucers-over-washington-the-history-of-project-blue-book/',

  'aaro':                 'https://www.aaro.mil/',
  'aaro-records':         'https://www.aaro.mil/UAP-Records/',
  'aaro-historical-v1':   'https://media.defense.gov/2024/Mar/08/2003409233/-1/-1/0/DOPSR-2024-0263-AARO-HISTORICAL-RECORD-REPORT-VOLUME-1-2024.PDF',
  'aaro-fy24':            'https://media.defense.gov/2024/Nov/14/2003583603/-1/-1/0/FY24-CONSOLIDATED-ANNUAL-REPORT-ON-UAP-508.PDF',

  'dod-navy-videos-2020': 'https://www.defense.gov/News/Releases/Release/Article/2165713/',
  'navy-uap-foia':        'https://www.secnav.navy.mil/foia/readingroom/CaseFiles/UAP%20INFO/UAP%20DOCUMENTS/PAO%20Briefing%20Card%202020-012022%20and%202022-006563.pdf',

  'odni-2021':            'https://www.dni.gov/files/ODNI/documents/assessments/Prelimary-Assessment-UAP-20210625.pdf',
  'odni-2022':            'https://www.dni.gov/files/ODNI/documents/assessments/Unclassified-2022-Annual-Report-UAP.pdf',

  'nasa-uap-report':      'https://science.nasa.gov/wp-content/uploads/2023/09/uap-independent-study-team-final-report.pdf',
  'nasa-uap':             'https://science.nasa.gov/uap/',

  'condon':               'https://files.ncas.org/condon/',
  'condon-conclusions':   'https://files.ncas.org/condon/text/sec-i.htm',

  'oversight-2023':       'https://oversight.house.gov/hearing/unidentified-anomalous-phenomena-implications-on-national-security-public-safety-and-government-transparency/',
  'oversight-2023-transcript': 'https://www.congress.gov/118/meeting/house/116282/documents/HHRG-118-GO06-Transcript-20230726.pdf',
  'oversight-2023-govinfo':    'https://www.govinfo.gov/content/pkg/CHRG-118hhrg53022/html/CHRG-118hhrg53022.htm',

  'dia-foia-iran':        'https://www.dia.mil/FOIA/FOIA-Electronic-Reading-Room/FOIA-Reading-Room-Iran/',
  'cia-readingroom':      'https://www.cia.gov/readingroom/',
  'cia-mysterious-craft': 'https://www.cia.gov/readingroom/docs/CIA-RDP88-01315R000300070004-1.pdf',

  // ——— Wielka Brytania
  'tna-ufo':              'https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/',
  'tna-ufo-guide':        'https://cdn.nationalarchives.gov.uk/documents/ufo-research-guide-2013.pdf',
  'tna-rendlesham':       'https://discovery.nationalarchives.gov.uk/details/r/C10342055',
  'tna-rendlesham-story': 'https://www.nationalarchives.gov.uk/state-secrets/mysteries/defe-241948/',

  // ——— Francja
  'geipan':               'https://www.geipan.fr/',
  'geipan-mission':       'https://www.geipan.fr/en/missions-methodes-et-resultats',
  'geipan-process':       'https://www.geipan.fr/en/node/422',

  // ——— Włochy
  'am-ovni':              'https://www.aeronautica.difesa.it/en/ovni/',

  // ——— Kanada
  'lac-ufo-timeline':     'https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Pages/timeline.aspx',
  'lac-project-magnet':   'https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Documents/magnet-report.pdf',
  'lac-falcon-lake':      'https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Documents/1967-05-26.pdf',
  'lac-falcon-lake-2':    'https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Documents/1967-08-10.pdf',
  'lac-falcon-podcast':   'https://library-archives.canada.ca/eng/collection/engage-learn/podcast/Pages/ufo-falcon-lake-incident.aspx',

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

  // ——— Chile
  'cl-sefaa':             'https://sefaa.dgac.gob.cl/',
  'cl-cefaa-model':       'https://www.dgac.gob.cl/cefaa-un-modelo-investigativo-de-fenomenos-aereos-anomalos/',

  // ——— Norwegia
  'hessdalen':            'https://www.hessdalen.org/',
  'hessdalen-1984':       'https://old.hessdalen.org/reports/hpreport84.shtml',
  'hessdalen-reports':    'https://old.hessdalen.org/reports/',
};

export function resolveSource(ref?: string, url?: string): string | undefined {
  if (url) return url;
  if (ref && SOURCE_URL[ref]) return SOURCE_URL[ref];
  return undefined;
}

export const SOURCE_COUNT = Object.keys(SOURCE_URL).length;
