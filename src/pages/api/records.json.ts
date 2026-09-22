import type { APIRoute } from 'astro';
import { records, provenance, RECORDS_HARVESTED, RECORD_INDEX, RELEASES } from '../../lib/records';

/**
 * Rejestr dokumentów PURSUE. Wydajemy go w całości, razem z liczbami mówiącymi,
 * dokąd sięgają odnośniki, bo bez nich rejestr można wziąć za komplet materiału.
 */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify({
    dataset: 'disclosure.zone / PURSUE document registry',
    license: 'CC BY 4.0',
    note: 'Identifiers, titles and links as published by the issuing body. Nothing here is assessed, summarised or rewritten by us. A record in this registry is not a case.',
    index: RECORD_INDEX,
    harvested: RECORDS_HARVESTED,
    generated: new Date().toISOString(),
    count: records.length,
    provenance: provenance(),
    releases: RELEASES,
    records,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
