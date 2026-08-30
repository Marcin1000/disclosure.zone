import type { APIRoute } from 'astro';
import { getCases } from '../../lib/cases';
import { overall, evidenceClass } from '../../lib/scoring';

const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const GET: APIRoute = async () => {
  const all = await getCases('en');
  const head = ['id', 'title', 'date', 'country', 'countryName', 'location', 'lat', 'lon',
    'domain', 'tier', 'status', 'witnesses', 'evidence',
    'S', 'R', 'O', 'P', 'M', 'T', 'X', 'D', 'overall', 'class', 'sources', 'sourcesWithUrl'];

  const rows = all.map(c => {
    const d = c.data, s = d.scores;
    return [c.id, d.title, d.date.toISOString().slice(0, 10), d.country, d.countryName,
      d.location, d.lat, d.lon, d.domain, d.tier, d.status, d.witnesses, d.evidence.join('|'),
      s.S, s.R, s.O, s.P, s.M, s.T, s.X, s.D, overall(s), evidenceClass(s).c,
      d.sources.length, d.sources.filter(x => x.url).length].map(q).join(',');
  });

  return new Response([head.map(q).join(','), ...rows].join('\n'),
    { headers: { 'content-type': 'text/csv; charset=utf-8' } });
};
