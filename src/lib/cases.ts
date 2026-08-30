import { getCollection, getEntry, render } from 'astro:content';
import type { Lang } from '../i18n';
import { resolveSource } from '../data/sources';

export type CaseData = Awaited<ReturnType<typeof getCases>>[number];

/** Scala rekord kanoniczny z nakładką językową. Struktura zawsze z kanonu. */
export async function getCases(lang: Lang) {
  const canon = (await getCollection('cases')).filter(c => !c.data.draft);
  const overlay = lang === 'en' ? [] : await getCollection('casesPl');
  const byId = new Map(overlay.map(o => [o.id, o]));

  return canon
    .map(c => {
      const o = byId.get(c.id);
      const t = o?.data;
      return {
        id: c.id,
        entry: c,
        overlay: o,
        data: {
          ...c.data,
          ...(t
            ? {
                title: t.title, subtitle: t.subtitle, dateDisplay: t.dateDisplay,
                countryName: t.countryName, location: t.location, witnesses: t.witnesses,
                duration: t.duration, summary: t.summary, official: t.official,
                alternatives: t.alternatives,
              }
            : {}),
          sources: c.data.sources.map((s, i) => ({
            tier: s.tier,
            label: t?.sources?.[i]?.label ?? s.label,
            note: t?.sources?.[i]?.note ?? s.note,
            url: resolveSource(s.ref, s.url),
          })),
        },
      };
    })
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

export async function getCaseBody(id: string, lang: Lang) {
  if (lang !== 'en') {
    const pl = await getEntry('casesPl', id);
    if (pl) return render(pl);
  }
  const en = await getEntry('cases', id);
  return render(en!);
}
