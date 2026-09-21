import type { APIRoute } from 'astro';
import { getCases } from '../../lib/cases';
import { toObservation } from '../../lib/disclosureos';

export const GET: APIRoute = async () => {
  const en = await getCases('en');
  const pl = new Map((await getCases('pl')).map(c => [c.id, c.data]));
  const generated = new Date().toISOString();

  const observations = en.map(c => {
    const p = pl.get(c.id);
    return toObservation(c.id, c.data, p && { title: p.title, summary: p.summary }, { generated });
  });

  return new Response(JSON.stringify({
    dataset: 'disclosure.zone / observations',
    schema: 'https://os.disclosure.org/schema/records/1.1.0/observation.json',
    standard: 'DisclosureOS 1.1.0',
    license: 'CC BY 4.0',
    note: 'Our own assessment lives under extensions["disclosure.zone"] and is not part of the standard. Fields we do not measure are omitted rather than filled with placeholders.',
    generated,
    count: observations.length,
    observations,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
