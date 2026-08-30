import type { APIRoute } from 'astro';
import { SOURCE_URL } from '../../data/sources';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({
    dataset: 'disclosure.zone / source registry',
    license: 'CC BY 4.0',
    note: 'Every URL here was checked against a live source rather than inferred.',
    generated: new Date().toISOString(),
    count: Object.keys(SOURCE_URL).length,
    sources: SOURCE_URL,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
