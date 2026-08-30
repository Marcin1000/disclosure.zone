import type { APIRoute } from 'astro';
import { claims } from '../../data/claims';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({
    dataset: 'disclosure.zone / claims',
    license: 'CC BY 4.0',
    generated: new Date().toISOString(),
    count: claims.length,
    claims,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
