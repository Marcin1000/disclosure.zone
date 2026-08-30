import type { APIRoute } from 'astro';
import { getCases } from '../../lib/cases';
import { overall, evidenceClass } from '../../lib/scoring';

export const GET: APIRoute = async () => {
  const en = await getCases('en');
  const pl = new Map((await getCases('pl')).map(c => [c.id, c.data]));

  const cases = en.map(c => {
    const p = pl.get(c.id)!;
    return {
      id: c.id,
      url: `https://disclosure.zone/cases/${c.id}`,
      date: c.data.date.toISOString().slice(0, 10),
      country: c.data.country, lat: c.data.lat, lon: c.data.lon,
      domain: c.data.domain, tier: c.data.tier, status: c.data.status,
      evidence: c.data.evidence, scores: c.data.scores,
      overall: overall(c.data.scores),
      evidenceClass: evidenceClass(c.data.scores).c,
      claims: c.data.claims,
      sources: c.data.sources.map((s, i) => ({
        tier: s.tier, url: s.url ?? null,
        label: { en: s.label, pl: p.sources[i]?.label ?? s.label },
      })),
      en: {
        title: c.data.title, subtitle: c.data.subtitle ?? null, dateDisplay: c.data.dateDisplay,
        countryName: c.data.countryName, location: c.data.location, witnesses: c.data.witnesses,
        duration: c.data.duration ?? null, summary: c.data.summary,
        official: c.data.official ?? null, alternatives: c.data.alternatives,
      },
      pl: {
        title: p.title, subtitle: p.subtitle ?? null, dateDisplay: p.dateDisplay,
        countryName: p.countryName, location: p.location, witnesses: p.witnesses,
        duration: p.duration ?? null, summary: p.summary,
        official: p.official ?? null, alternatives: p.alternatives,
      },
    };
  });

  return new Response(JSON.stringify({
    dataset: 'disclosure.zone / cases',
    license: 'CC BY 4.0',
    generated: new Date().toISOString(),
    count: cases.length,
    cases,
  }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
