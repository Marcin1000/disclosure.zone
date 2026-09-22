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
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { records } from './records';

const DIR = 'public/media/records';
const held = new Set<string>(existsSync(DIR) ? readdirSync(DIR) : []);

export interface Media { poster: string | null; clip: string | null; w: number | null; h: number | null }

/**
 * Wymiary czytamy z nagłówka pliku. Materiał przychodzi w różnych proporcjach,
 * w tym pionowych, więc wpisanie jednej pary na sztywno przesuwałoby układ
 * strony po doczytaniu obrazka.
 */
const sizes = new Map<string, { w: number; h: number } | null>();
function imageSize(file: string): { w: number; h: number } | null {
  if (sizes.has(file)) return sizes.get(file)!;
  let out: { w: number; h: number } | null = null;
  try {
    const b = readFileSync(file);
    // PNG: szerokość i wysokość stoją w IHDR, zaraz za ośmiobajtowym podpisem
    if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
      out = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
      sizes.set(file, out);
      return out;
    }
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isFrame) { out = { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; break; }
      i += 2 + len;
    }
  } catch { /* nieczytelny plik traktujemy jak brak wymiarów, nie jak błąd budowania */ }
  sizes.set(file, out);
  return out;
}

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

/**
 * Plik nosi identyfikator rekordu albo jego adres. Klatki nagrań zapisuje
 * tools/map-videos.mjs pod identyfikatorem, obrazy z rejestru zapisuje
 * tools/import-images.mjs pod adresem, bo osiem z nich identyfikatora nie ma.
 */
export function mediaFor(rec: { id: string | null; slug: string }): Media {
  const id = rec.id;
  const none: Media = { poster: null, clip: null, w: null, h: null };

  const keys: string[] = [];
  if (id && owner.get(id) === rec.slug) keys.push(id);
  keys.push(rec.slug);

  let poster: string | null = null, file: string | null = null;
  outer: for (const k of keys) {
    for (const ext of ['jpg', 'png']) {
      if (held.has(`${k}.${ext}`)) { poster = `/media/records/${k}.${ext}`; file = `${DIR}/${k}.${ext}`; break outer; }
    }
  }
  const clip = id && owner.get(id) === rec.slug && held.has(`${id}.mp4`) ? `/media/records/${id}.mp4` : null;
  if (!poster && !clip) return none;
  const size = file ? imageSize(file) : null;
  return { poster, clip, w: size?.w ?? null, h: size?.h ?? null };
}

/** Ile nagrań ma u nas klatkę. Pokazujemy to, zamiast udawać komplet. */
export function mediaCount(): number {
  return [...held].filter(f => f.endsWith('.jpg')).length;
}
