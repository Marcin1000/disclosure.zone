import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg } from '../../lib/og';
import { isCountry } from '../../data/geo';

export const GET: APIRoute = async () => {
  const cases = (await getCollection('cases')).filter(c => !c.data.draft);
  const countries = new Set(cases.map(c => c.data.country).filter(isCountry)).size;
  // Zakres lat bierzemy z korpusu, jak banner repozytorium. Stałe „since 1946”
  // przeczyło sprawom starszym niż 1946.
  const years = cases.map(c => c.data.date.getUTCFullYear());
  const span = `${Math.min(...years)}–${Math.max(...years)}`;
  const png = await renderOg({
    title: 'Unresolved does not mean extraterrestrial.',
    kicker: `${cases.length} DOCUMENTED CASES · ${countries} COUNTRIES · ${span}`,
    statusLabel: 'Open archive',
    status: 'unresolved',
    score: '—',
    evidenceClass: 'A–D',
    chips: ['Radar', 'IR / FLIR', 'Physical trace', 'Multiple witnesses'],
    tagline: 'DOCUMENTS, NOT RUMORS',
  });
  return new Response(new Uint8Array(png), {
    headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=31536000, immutable' },
  });
};
