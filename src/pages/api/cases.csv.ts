import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { overall, evidenceClass } from '../../lib/scoring';

const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const GET: APIRoute = async () => {
  const cases = (await getCollection('cases')).filter(c => !c.data.draft)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const head = ['id', 'title', 'date', 'country', 'countryName', 'location', 'lat', 'lon',
    'domain', 'tier', 'status', 'witnesses', 'evidence',
    'S', 'R', 'O', 'P', 'M', 'T', 'X', 'D', 'overall', 'class', 'sources', 'sourcesWithUrl'];

  const rows = cases.map(c => {
    const d = c.data, s = d.scores;
    return [c.id, d.title, d.date.toISOString().slice(0, 10), d.country, d.countryName,
      d.location, d.lat, d.lon, d.domain, d.tier, d.status, d.witnesses, d.evidence.join('|'),
      s.S, s.R, s.O, s.P, s.M, s.T, s.X, s.D, overall(s), evidenceClass(s).c,
      d.sources.length, d.sources.filter(x => x.url).length].map(q).join(',');
  });

  return new Response([head.map(q).join(','), ...rows].join('\n'),
    { headers: { 'content-type': 'text/csv; charset=utf-8' } });
};
