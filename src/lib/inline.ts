/**
 * Odnośniki wewnętrzne w polach tekstowych (twierdzenia): [etykieta](/ścieżka).
 * Ścieżkę piszemy bez prefiksu języka; strona dokłada go przy renderowaniu.
 * Nawiasy kwadratowe bez „(/…)” zaraz za nimi ([sic], […]) zostają tekstem.
 */
export const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export type Piece = string | { label: string; href: string };

export function pieces(text: string): Piece[] {
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_LINK)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ label: m[1], href: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Sam tekst, bez składni odnośników: tam, gdzie odnośnik nie ma sensu (skróty, eksport). */
export function plain(text: string, withUrl?: (href: string) => string): string {
  return text.replace(INLINE_LINK, (_, label, href) => withUrl ? `${label} (${withUrl(href)})` : label);
}
