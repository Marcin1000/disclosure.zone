import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { overall, evidenceClass } from '../../lib/scoring';

export const GET: APIRoute = async () => {
  const cases = (await getCollection('cases')).filter(c => !c.data.draft);
  const data = cases
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
    .map(c => ({
      id: c.id,
      url: `https://disclosure.zone/akta/${c.id}`,
      ...c.data,
      date: c.data.date.toISOString().slice(0, 10),
      overall: overall(c.data.scores),
      evidenceClass: evidenceClass(c.data.scores).c,
    }));
  return new Response(JSON.stringify({
    dataset: 'disclosure.zone / cases',
    license: 'CC BY 4.0',
    generated: new Date().toISOString(),
    count: data.length,
    cases: data,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
