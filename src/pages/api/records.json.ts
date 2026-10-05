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
    note: 'Identifiers, titles and links as published by the issuing body. Nothing here is assessed, summarised or rewritten by us. A record in this registry is not a case. Where a published title contradicts the document, the title stays and documentSays records what the document gives (placeFrom: text, or grid for our reading of a grid reference). Where the index gives an address the publisher does not serve and the same file is served elsewhere, source is the working address and sourceAsIndexed the one given. Where the index links a title to a file that holds a different record of the same release, source is the file whose name and content match the title, sourceAsIndexed the one linked, and linkShift is true. Where the index gives only the release page, source is the address the publisher\'s own listing gives for the file or the recording\'s page, sourceAsIndexed the release page, and fromListing is true. Where the index gives no identifier, it is read from the published file name (idFrom). Where the publisher writes a letter after the number (DOW-UAP-PR057a, PR057b), id keeps the number and idSuffix holds the letter. Links between files that hold the same document (related) and files that cannot be read (illegible) are our own observations, checked page by page.',
    index: RECORD_INDEX,
    harvested: RECORDS_HARVESTED,
    generated: new Date().toISOString(),
    count: records.length,
    provenance: provenance(),
    releases: RELEASES,
    records,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
