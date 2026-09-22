/**
 * Materiał wizualny trzymany u nas: klatka tytułowa i ewentualny skrót nagrania.
 *
 * Pełnych nagrań nie hostujemy. Pojedyncza paczka wideo z jednego wydania waży
 * kilka gigabajtów, a cytować i tak należy u wydawcy. Trzymamy więc klatkę,
 * żeby było co pokazać, i odsyłamy po całość tam, skąd pochodzi.
 *
 * Pliki leżą w public/media/records/ pod identyfikatorem rekordu:
 *   DOW-UAP-PR133.jpg   klatka tytułowa
 *   DOW-UAP-PR133.mp4   skrót, jeżeli ktoś go wygenerował
 * Generuje je tools/make-media.mjs z nagrań pobranych lokalnie.
 */
import { existsSync, readdirSync } from 'node:fs';
import { records } from './records';

const DIR = 'public/media/records';
const held = new Set<string>(existsSync(DIR) ? readdirSync(DIR) : []);

export interface Media { poster: string | null; clip: string | null }

/**
 * Plik nosi identyfikator rekordu, a identyfikator bywa w tym korpusie
 * współdzielony: DOW-UAP-PR057 noszą dwa różne nagrania, bo indeks podał dla
 * obu ten sam adres. Klatka powstała z jednego z nich, więc dostaje ją tylko
 * ten jeden. Drugi mówi, że klatki nie ma, zamiast pokazywać cudzy kadr.
 */
const owner = new Map<string, string>();
for (const r of records) {
  if (r.id && !owner.has(r.id)) owner.set(r.id, r.slug);
}

export function mediaFor(rec: { id: string | null; slug: string }): Media {
  const id = rec.id;
  if (!id || owner.get(id) !== rec.slug) return { poster: null, clip: null };
  const poster = held.has(`${id}.jpg`) ? `/media/records/${id}.jpg` : null;
  const clip = held.has(`${id}.mp4`) ? `/media/records/${id}.mp4` : null;
  return { poster, clip };
}

/** Ile nagrań ma u nas klatkę. Pokazujemy to, zamiast udawać komplet. */
export function mediaCount(): number {
  return [...held].filter(f => f.endsWith('.jpg')).length;
}
