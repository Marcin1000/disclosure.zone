import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sourceTier = z.enum(['T1', 'T2', 'T3', 'T4', 'T5']);

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    /** Data zdarzenia (ISO). Dla fal wieloletnich: początek fali. */
    date: z.coerce.date(),
    dateDisplay: z.string(),
    /** ISO 3166-1 alpha-2 */
    country: z.string().length(2),
    countryName: z.string(),
    location: z.string(),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    /** military | civil | mixed | scientific */
    domain: z.enum(['military', 'civil', 'mixed', 'scientific']),
    /** 1 = rdzeń kanonu dowodowego, 3 = wyłącznie relacja */
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    status: z.enum(['unresolved', 'insufficient', 'explained', 'disputed']),
    duration: z.string().optional(),
    witnesses: z.string(),
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
    summary: z.string(),
    official: z.string().optional(),
    alternatives: z.array(z.string()).default([]),
    /** Twierdzenia, które ta sprawa generuje — spinane z Claim Ledger */
    claims: z.array(z.string()).default([]),
    sources: z.array(z.object({
      tier: sourceTier,
      label: z.string(),
      url: z.string().url().optional(),
      note: z.string().optional(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
