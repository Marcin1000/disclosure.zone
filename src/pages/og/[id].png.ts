import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { overall, evidenceClass, STATUS, EVIDENCE, bi } from '../../lib/scoring';
import { renderOg } from '../../lib/og';

export async function getStaticPaths() {
  const cases = (await getCollection('cases')).filter(c => !c.data.draft);
  return cases.map(c => ({ params: { id: c.id }, props: { c } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { c } = props as { c: Awaited<ReturnType<typeof getCollection<'cases'>>>[number] };
  const d = c.data;
  const png = await renderOg({
    title: d.title,
    kicker: `${d.dateDisplay} · ${d.countryName}`.toUpperCase(),
    statusLabel: bi(STATUS[d.status].label, 'en'),
    status: d.status,
    score: overall(d.scores).toFixed(1),
    evidenceClass: evidenceClass(d.scores).c,
    chips: d.evidence.map(e => bi(EVIDENCE[e], 'en')),
    blurb: d.subtitle && d.subtitle.length <= 128 ? d.subtitle : undefined,
    tagline: 'DOCUMENTS, NOT RUMORS',
    core: d.tier === 1,
  });
  return new Response(new Uint8Array(png), {
    headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=31536000, immutable' },
  });
};
