export type Scores = {
  S: number; R: number; O: number; P: number;
  M: number; T: number; X: number; D: number;
};

export const AXES: { k: keyof Scores; name: string; desc: string }[] = [
  { k: 'S', name: 'Świadkowie',        desc: 'Kwalifikacje i niezależność obserwatorów.' },
  { k: 'R', name: 'Radar / sensor',    desc: 'Niezależny pomiar instrumentalny (radar, ELINT, sonar).' },
  { k: 'O', name: 'Optyka / IR',       desc: 'Zapis obrazowy: fotografia, film, podczerwień.' },
  { k: 'P', name: 'Ślad fizyczny',     desc: 'Materiał, ślad w terenie, mierzalny wpływ na środowisko.' },
  { k: 'M', name: 'Wielokanałowość',   desc: 'Liczba wzajemnie niezależnych źródeł informacji.' },
  { k: 'T', name: 'Dokumentacja',      desc: 'Jakość chronologii i zachowanych akt sprawy.' },
  { k: 'X', name: 'Anomalność',        desc: 'Siła cech nietypowych PO odrzuceniu oczywistych błędów.' },
  { k: 'D', name: 'Dane dzisiaj',      desc: 'Czy da się sprawę niezależnie zrekonstruować w 2026 r.' },
];

/** Wagi: dowód instrumentalny i możliwość weryfikacji ważą więcej niż sama anomalność. */
const W: Record<keyof Scores, number> = { S: 1.0, R: 1.35, O: 1.1, P: 1.35, M: 1.25, T: 1.1, X: 0.9, D: 1.15 };

export function overall(s: Scores): number {
  let num = 0, den = 0;
  for (const k of Object.keys(W) as (keyof Scores)[]) { num += s[k] * W[k]; den += 5 * W[k]; }
  return Math.round((num / den) * 50) / 10; // 0.0 – 5.0
}

export type EvidenceClass = 'A' | 'B' | 'C' | 'D';

/** Klasa dowodowa — świadomie wzorowana na skali GEIPAN, ale liczona z naszych osi. */
export function evidenceClass(s: Scores): { c: EvidenceClass; label: string } {
  const o = overall(s);
  const instrumental = s.R >= 3 || s.O >= 3 || s.P >= 3;
  if (o >= 3.6 && instrumental && s.M >= 4) return { c: 'A', label: 'Rdzeń dowodowy' };
  if (o >= 2.8 && instrumental)             return { c: 'B', label: 'Mocna dokumentacja' };
  if (o >= 2.0)                             return { c: 'C', label: 'Istotne luki' };
  return { c: 'D', label: 'Głównie relacja' };
}

export const STATUS: Record<string, { pl: string; cls: string }> = {
  unresolved:   { pl: 'Nierozstrzygnięty',      cls: 'st-unresolved' },
  insufficient: { pl: 'Brak danych',            cls: 'st-insufficient' },
  explained:    { pl: 'Wyjaśniony',             cls: 'st-explained' },
  disputed:     { pl: 'Sporny / zakwestionowany', cls: 'st-disputed' },
};

export const DOMAIN: Record<string, string> = {
  military: 'Wojskowy', civil: 'Cywilny', mixed: 'Mieszany', scientific: 'Naukowy',
};

export const EVIDENCE: Record<string, string> = {
  visual: 'Obserwacja', radar: 'Radar', ir: 'IR / FLIR', elint: 'ELINT',
  photo: 'Fotografia', film: 'Film', trace: 'Ślad w terenie', lab: 'Analiza lab.',
  'multi-witness': 'Wielu świadków', intercept: 'Przechwycenie', instrument: 'Aparatura',
};

export const TIER_LABEL: Record<string, string> = {
  T1: 'Dokument pierwotny',
  T2: 'Oficjalne oświadczenie',
  T3: 'Zeznanie pod przysięgą',
  T4: 'Późniejsza relacja / rekonstrukcja',
  T5: 'Twierdzenie medialne',
};
