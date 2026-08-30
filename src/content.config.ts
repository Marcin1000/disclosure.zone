import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sourceTier = z.enum(['T1', 'T2', 'T3', 'T4', 'T5']);

/** Pola tłumaczalne — obecne w pliku kanonicznym (EN) i w nakładce językowej. */
const translatable = {
  title: z.string(),
  subtitle: z.string().optional(),
  dateDisplay: z.string(),
  countryName: z.string(),
  location: z.string(),
  witnesses: z.string(),
  duration: z.string().optional(),
  summary: z.string(),
  official: z.string().optional(),
  alternatives: z.array(z.string()).default([]),
};

/**
 * Kanoniczny rekord sprawy: dane strukturalne + tekst angielski.
 * Struktura (daty, współrzędne, oceny, klasy źródeł) żyje wyłącznie tutaj,
 * więc nie może rozjechać się między wersjami językowymi.
 */
const cases = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/cases' }),
  schema: z.object({
    ...translatable,
    date: z.coerce.date(),
    country: z.string().length(2),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    domain: z.enum(['military', 'civil', 'mixed', 'scientific']),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    status: z.enum(['unresolved', 'insufficient', 'explained', 'disputed']),
    evidence: z.array(z.enum([
      'visual', 'radar', 'ir', 'elint', 'photo', 'film',
      'trace', 'lab', 'multi-witness', 'intercept', 'instrument',
    ])),
    scores: z.object({
      S: z.number().min(0).max(5), R: z.number().min(0).max(5),
      O: z.number().min(0).max(5), P: z.number().min(0).max(5),
      M: z.number().min(0).max(5), T: z.number().min(0).max(5),
      X: z.number().min(0).max(5), D: z.number().min(0).max(5),
    }),
    claims: z.array(z.string()).default([]),
    sources: z.array(z.object({
      tier: sourceTier,
      label: z.string(),
      note: z.string().optional(),
      /** Klucz do src/data/sources.ts — jedno miejsce prawdy dla adresu. */
      ref: z.string().optional(),
      /** Adres wpisany bezpośrednio, gdy nie ma sensu trzymać go w rejestrze. */
      url: z.string().url().optional(),
      /**
       * Instytucja przechowująca dokument, gdy nie ma bezpośredniego adresu.
       * Nie liczy się do wskaźnika proweniencji — mówi „gdzie szukać", nie „oto materiał".
       */
      archive: z.string().optional(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Nakładka polska: wyłącznie tekst. Struktura pochodzi z rekordu kanonicznego. */
const casesPl = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pl' }),
  schema: z.object({
    ...translatable,
    sources: z.array(z.object({
      label: z.string(),
      note: z.string().optional(),
    })).default([]),
  }),
});

export const collections = { cases, casesPl };
