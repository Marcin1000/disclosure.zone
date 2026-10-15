import type { APIRoute } from 'astro';
import { claims } from '../../data/claims';
import { plain } from '../../lib/inline';

// Odnośniki wewnętrzne [etykieta](/ścieżka) eksportujemy jako „etykieta (pełny adres)”.
const FIELDS = ['origin', 'verdict', 'resolver'] as const;

export const GET: APIRoute = async ({ site }) => {
  const abs = (href: string) => new URL(href, site).href;
  const out = claims.map(c => ({
    ...c,
    ...Object.fromEntries(FIELDS.map(k => [k, { en: plain(c[k].en, abs), pl: plain(c[k].pl, h => abs(`/pl${h}`)) }])),
  }));
  return new Response(JSON.stringify({
    dataset: 'disclosure.zone / claims',
    license: 'CC BY 4.0',
    generated: new Date().toISOString(),
    count: out.length,
    claims: out,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
