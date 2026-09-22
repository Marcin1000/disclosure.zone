/**
 * Rejestr dokumentów PURSUE.
 *
 * To nie jest baza spraw i nie wolno go z nią mylić. Sprawa ma ocenę na ośmiu
 * osiach, hipotezy alternatywne i tekst, który ktoś napisał po przeczytaniu
 * materiału. Rekord w rejestrze ma tylko to, co podał wydawca: identyfikator,
 * tytuł, wydanie i adres. Obecność dokumentu w rejestrze nie mówi nic o tym,
 * co ten dokument zawiera ani czy cokolwiek potwierdza.
 *
 * Dane pochodzą z src/data/records.json, generowanego przez
 * scripts/build-records.mjs. Plik jest w repozytorium, więc build nie chodzi
 * do sieci, a każda zmiana rejestru jest widoczna w diffie.
 */
import data from '../data/records.json';
import type { Lang } from '../i18n';

export type SourceKind = 'file' | 'page' | 'landing' | 'none';
export type RecordKind = 'document' | 'recording' | 'image' | 'unknown';

export interface Rec {
  slug: string;
  id: string | null;
  title: string;
  agency: string | null;
  agencyName: string | null;
  series: { rg: number; name: string } | null;
  place: string | null;
  year: number | null;
  yearEnd: number | null;
  kind: RecordKind;
  release: string | null;
  publisher: string | null;
  source: string | null;
  sourceKind: SourceKind;
  format: string | null;
  cases: string[];
}

export const records: Rec[] = data.records as Rec[];
export const RECORDS_HARVESTED: string = data.harvested ?? '';
export const RECORD_INDEX: string | null = data.index ?? null;

export const recordBySlug = new Map(records.map(r => [r.slug, r]));

/** Wydania PURSUE. Daty pięciu pierwszych są ze strony wydawcy. */
export const RELEASES: Record<string, { date: string; dateKnown: boolean }> = {
  '01': { date: '2026-05-08', dateKnown: true },
  '02': { date: '2026-05-22', dateKnown: true },
  '03': { date: '2026-06-12', dateKnown: true },
  '04': { date: '2026-07-10', dateKnown: true },
  '05': { date: '2026-08-07', dateKnown: true },
  /** Szósta paczka nie była wymieniona na stronie wykazu, gdy ją zbierano.
   *  Datę czytamy ze ścieżki adresu (sept-18), więc jest odczytem, nie deklaracją. */
  '06': { date: '2026-09-18', dateKnown: false },
};

/** Dokumenty, na które powołuje się dana sprawa. */
export function recordsForCase(caseId: string): Rec[] {
  return records.filter(r => r.cases.includes(caseId));
}

/**
 * Proweniencja rejestru. „Linked" znaczy: adres prowadzi do samego materiału.
 * Strona wydania to za mało, żeby uznać dokument za dostępny, i liczymy ją osobno.
 */
export function provenance() {
  const n = (k: SourceKind) => records.filter(r => r.sourceKind === k).length;
  return {
    total: records.length,
    file: n('file'),
    page: n('page'),
    landing: n('landing'),
    none: n('none'),
    cited: records.filter(r => r.cases.length > 0).length,
  };
}

export function counts<K extends keyof Rec>(key: K): { k: string; n: number }[] {
  const m = new Map<string, number>();
  for (const r of records) {
    const v = r[key];
    if (v == null || v === '') continue;
    const s = String(v);
    m.set(s, (m.get(s) ?? 0) + 1);
  }
  return [...m].map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n || a.k.localeCompare(b.k));
}

/** Zakres lat rekordu, gdy dokument obejmuje więcej niż jeden rok. */
export function yearLabel(r: Rec): string {
  if (!r.year) return '';
  return r.yearEnd ? `${r.year}–${r.yearEnd}` : String(r.year);
}

/** Etykieta wydania: „Release 03 · 12 June 2026". */
export function releaseLabel(rel: string | null, lang: Lang): string {
  if (!rel) return '';
  const meta = RELEASES[rel];
  if (!meta) return rel;
  const d = new Date(`${meta.date}T00:00:00Z`);
  const fmt = new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return fmt.format(d);
}
