import type { Lang } from '../i18n';

export type Scores = {
  S: number; R: number; O: number; P: number;
  M: number; T: number; X: number; D: number;
};

type Bi = Record<Lang, string>;

export const AXES: { k: keyof Scores; name: Bi; desc: Bi }[] = [
  { k: 'S', name: { en: 'Witnesses', pl: 'Świadkowie' },
    desc: { en: 'Qualifications and independence of the observers.', pl: 'Kwalifikacje i niezależność obserwatorów.' } },
  { k: 'R', name: { en: 'Radar / sensor', pl: 'Radar / sensor' },
    desc: { en: 'Independent instrumental measurement — radar, ELINT, sonar.', pl: 'Niezależny pomiar instrumentalny (radar, ELINT, sonar).' } },
  { k: 'O', name: { en: 'Optics / IR', pl: 'Optyka / IR' },
    desc: { en: 'Imaging record: photography, film, infrared.', pl: 'Zapis obrazowy: fotografia, film, podczerwień.' } },
  { k: 'P', name: { en: 'Physical trace', pl: 'Ślad fizyczny' },
    desc: { en: 'Material, ground trace, measurable effect on the environment.', pl: 'Materiał, ślad w terenie, mierzalny wpływ na środowisko.' } },
  { k: 'M', name: { en: 'Multi-channel', pl: 'Wielokanałowość' },
    desc: { en: 'How many mutually independent information channels exist.', pl: 'Liczba wzajemnie niezależnych źródeł informacji.' } },
  { k: 'T', name: { en: 'Documentation', pl: 'Dokumentacja' },
    desc: { en: 'Quality of the timeline and the surviving case file.', pl: 'Jakość chronologii i zachowanych akt sprawy.' } },
  { k: 'X', name: { en: 'Anomaly', pl: 'Anomalność' },
    desc: { en: 'Strength of unusual features AFTER obvious errors are removed.', pl: 'Siła cech nietypowych PO odrzuceniu oczywistych błędów.' } },
  { k: 'D', name: { en: 'Data today', pl: 'Dane dzisiaj' },
    desc: { en: 'Whether the case can be independently reconstructed now.', pl: 'Czy da się sprawę niezależnie zrekonstruować dzisiaj.' } },
];

/** Instrumental evidence and present-day verifiability weigh more than judged anomaly. */
const W: Record<keyof Scores, number> = { S: 1.0, R: 1.35, O: 1.1, P: 1.35, M: 1.25, T: 1.1, X: 0.9, D: 1.15 };

export function overall(s: Scores): number {
  let num = 0, den = 0;
  for (const k of Object.keys(W) as (keyof Scores)[]) { num += s[k] * W[k]; den += 5 * W[k]; }
  return Math.round((num / den) * 50) / 10;
}

export type EvidenceClass = 'A' | 'B' | 'C' | 'D';

export function evidenceClass(s: Scores): { c: EvidenceClass; label: Bi } {
  const o = overall(s);
  const instrumental = s.R >= 3 || s.O >= 3 || s.P >= 3;
  if (o >= 3.6 && instrumental && s.M >= 4) return { c: 'A', label: { en: 'Evidential core', pl: 'Sprawa kluczowa' } };
  if (o >= 2.8 && instrumental)             return { c: 'B', label: { en: 'Strong documentation', pl: 'Mocna dokumentacja' } };
  if (o >= 2.0)                             return { c: 'C', label: { en: 'Material gaps', pl: 'Istotne luki' } };
  return { c: 'D', label: { en: 'Testimony only', pl: 'Głównie relacja' } };
}

export const STATUS: Record<string, { label: Bi; cls: string }> = {
  unresolved:   { label: { en: 'Unresolved', pl: 'Nierozstrzygnięty' }, cls: 'st-unresolved' },
  insufficient: { label: { en: 'Insufficient data', pl: 'Brak danych' }, cls: 'st-insufficient' },
  explained:    { label: { en: 'Explained', pl: 'Wyjaśniony' }, cls: 'st-explained' },
  disputed:     { label: { en: 'Disputed', pl: 'Sporny' }, cls: 'st-disputed' },
};

export const DOMAIN: Record<string, Bi> = {
  military:   { en: 'Military', pl: 'Wojskowy' },
  civil:      { en: 'Civil', pl: 'Cywilny' },
  mixed:      { en: 'Mixed', pl: 'Mieszany' },
  scientific: { en: 'Scientific', pl: 'Naukowy' },
};

export const EVIDENCE: Record<string, Bi> = {
  visual:          { en: 'Visual', pl: 'Obserwacja' },
  radar:           { en: 'Radar', pl: 'Radar' },
  ir:              { en: 'IR / FLIR', pl: 'IR / FLIR' },
  elint:           { en: 'ELINT', pl: 'ELINT' },
  photo:           { en: 'Photograph', pl: 'Fotografia' },
  film:            { en: 'Film', pl: 'Film' },
  trace:           { en: 'Ground trace', pl: 'Ślad w terenie' },
  lab:             { en: 'Lab analysis', pl: 'Analiza lab.' },
  'multi-witness': { en: 'Multiple witnesses', pl: 'Wielu świadków' },
  intercept:       { en: 'Intercept', pl: 'Przechwycenie' },
  instrument:      { en: 'Instrumented', pl: 'Aparatura' },
};

export const TIER_LABEL: Record<string, Bi> = {
  T1: { en: 'Primary document', pl: 'Dokument pierwotny' },
  T2: { en: 'Official statement', pl: 'Oficjalne oświadczenie' },
  T3: { en: 'Sworn testimony', pl: 'Zeznanie pod przysięgą' },
  T4: { en: 'Later account / reconstruction', pl: 'Późniejsza relacja / rekonstrukcja' },
  T5: { en: 'Media claim', pl: 'Twierdzenie medialne' },
};

export const TIER_DESC: Record<string, Bi> = {
  T1: { en: 'Operational report, case file, gendarmerie protocol, lab result — produced close to the event.',
        pl: 'Raport operacyjny, akta sprawy, protokół żandarmerii, wynik laboratoryjny, dokument powstały blisko zdarzenia.' },
  T2: { en: 'Institutional confirmation: ministry statement, authenticity release, agency determination.',
        pl: 'Potwierdzenie instytucji: komunikat resortu, oświadczenie o autentyczności materiału, rozstrzygnięcie agencji.' },
  T3: { en: 'Witness account given under legal weight — congressional testimony, sworn statement.',
        pl: 'Relacja świadka złożona z rygorem prawnym, zeznanie przed komisją, oświadczenie pod przysięgą.' },
  T4: { en: 'Interview, memoir or reconstruction produced years after the event. The layer most prone to growth.',
        pl: 'Wywiad, wspomnienie lub rekonstrukcja powstała lata po zdarzeniu. Warstwa najbardziej podatna na narastanie.' },
  T5: { en: 'A claim circulating without documentary backing. Recorded because it shapes how a case is read.',
        pl: 'Twierdzenie funkcjonujące w obiegu bez zaplecza dokumentowego. Odnotowywane, bo wpływa na postrzeganie sprawy.' },
};

export const bi = (v: Bi, lang: Lang) => v[lang] ?? v.en;
