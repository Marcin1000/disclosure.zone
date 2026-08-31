import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Czcionki czytane z katalogu projektu — build zawsze startuje z jego korzenia. */
const load = (f: string) => readFile(join(process.cwd(), 'src/assets/fonts', f));

let fonts: Awaited<ReturnType<typeof loadFonts>> | null = null;
async function loadFonts() {
  const [mono, monoB, serif, serifB] = await Promise.all([
    load('CourierPrime-Regular.ttf'), load('CourierPrime-Bold.ttf'),
    load('Newsreader-Regular.ttf'), load('Newsreader-SemiBold.ttf'),
  ]);
  return [
    { name: 'Mono', data: mono, weight: 400 as const, style: 'normal' as const },
    { name: 'Mono', data: monoB, weight: 700 as const, style: 'normal' as const },
    { name: 'Serif', data: serif, weight: 400 as const, style: 'normal' as const },
    { name: 'Serif', data: serifB, weight: 600 as const, style: 'normal' as const },
  ];
}

const C = {
  bg: '#06090A', panel: '#0C1214', line: '#1B2528',
  phos: '#4DE3A0', phosDim: '#2C7F5E', amber: '#F0A93B',
  stamp: '#E05446', fg: '#DCE3E1', dim: '#8D9997', faint: '#5C6866',
};

const el = (type: string, style: Record<string, unknown>, children?: unknown) =>
  ({ type, props: { style, children } }) as never;

const STATUS_COLOR: Record<string, string> = {
  unresolved: C.amber, insufficient: C.faint, explained: C.phos, disputed: C.stamp,
};

export interface OgInput {
  title: string;
  kicker: string;          // np. "14 NOVEMBER 2004 · UNITED STATES"
  statusLabel: string;
  status: string;
  score: string;           // "4.1"
  evidenceClass: string;   // "A"
  chips: string[];
  blurb?: string;
  tagline: string;
  core?: boolean;
}

/** Znak radaru z przerwą — ten sam co w logotypie. */
function mark(size: number) {
  const ring = (r: number, w: number, o: number) =>
    el('div', {
      position: 'absolute', left: size / 2 - r, top: size / 2 - r,
      width: r * 2, height: r * 2, borderRadius: r * 2,
      border: `${w}px solid ${C.phosDim}`, opacity: o,
    });
  return el('div', { display: 'flex', position: 'relative', width: size, height: size }, [
    ring(size * 0.46, 3, 1),
    ring(size * 0.30, 2, 0.62),
    // przerwa redakcyjna
    el('div', {
      position: 'absolute', left: -4, top: size * 0.57,
      width: size + 8, height: size * 0.13, background: C.bg,
    }),
    // Przemiat: start dokładnie w środku, koniec tuż pod zewnętrznym pierścieniem (0.46 promienia)
    el('div', {
      position: 'absolute', left: size / 2, top: size / 2 - 1.5,
      width: size * 0.43, height: 3, background: C.phos,
      transform: 'rotate(-33deg)', transformOrigin: 'left center',
    }),
  ]);
}

export async function renderOg(i: OgInput): Promise<Buffer> {
  fonts ??= await loadFonts();
  const accent = STATUS_COLOR[i.status] ?? C.faint;

  const tree = el('div', {
    display: 'flex', flexDirection: 'column', width: 1200, height: 630,
    background: C.bg, color: C.fg, padding: 64, position: 'relative',
    fontFamily: 'Serif',
  }, [
    // siatka radarowa
    el('div', {
      position: 'absolute', left: 0, top: 0, width: 1200, height: 630,
      display: 'flex', flexDirection: 'column',
    }, [0, 1, 2, 3, 4, 5].map(n =>
      el('div', { position: 'absolute', left: 0, top: 105 * n, width: 1200, height: 1, background: 'rgba(77,227,160,0.05)' })
    )),
    // pasek statusu
    el('div', { position: 'absolute', left: 0, top: 0, width: 10, height: 630, background: accent }),

    // nagłówek
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }, [
      el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 21, letterSpacing: 4, color: C.phosDim }, i.kicker),
      i.core
        ? el('div', {
            display: 'flex', fontFamily: 'Mono', fontSize: 18, letterSpacing: 3,
            color: C.phos, border: `2px solid ${C.phosDim}`, padding: '8px 16px',
          }, 'EVIDENTIAL CORE')
        : el('div', { display: 'flex' }, ''),
    ]),

    // tytuł
    el('div', {
      display: 'flex', fontSize: i.title.length > 44 ? 60 : 74, fontWeight: 600,
      lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 1010,
    }, i.title),

    // podtytuł / zajawka
    i.blurb
      ? el('div', {
          display: 'flex', fontSize: 27, lineHeight: 1.35, color: C.dim,
          maxWidth: 900, marginTop: 22,
        }, i.blurb)
      : el('div', { display: 'flex' }, ''),

    el('div', { display: 'flex', flexGrow: 1 }, ''),

    // znaczniki dowodowe
    el('div', { display: 'flex', gap: 12, marginBottom: 34 },
      i.chips.slice(0, 5).map(c =>
        el('div', {
          display: 'flex', fontFamily: 'Mono', fontSize: 17, letterSpacing: 2,
          color: C.phos, border: `1px solid ${C.phosDim}`, padding: '7px 14px',
          background: 'rgba(77,227,160,0.07)',
        }, c.toUpperCase()))),

    // stopka
    el('div', {
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      borderTop: `1px solid ${C.line}`, paddingTop: 28,
    }, [
      el('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
        mark(52),
        el('div', { display: 'flex', flexDirection: 'column', gap: 6 }, [
          el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.fg }, 'DISCLOSURE.ZONE'),
          el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 15, letterSpacing: 3, color: C.faint }, i.tagline),
        ]),
      ]),
      el('div', { display: 'flex', alignItems: 'flex-end', gap: 34 }, [
        el('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }, [
          el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 14, letterSpacing: 3, color: C.faint }, 'STATUS'),
          el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 22, letterSpacing: 2, color: accent }, i.statusLabel.toUpperCase()),
        ]),
        el('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }, [
          el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 14, letterSpacing: 3, color: C.faint }, `CLASS ${i.evidenceClass}`),
          el('div', { display: 'flex', alignItems: 'baseline', gap: 6 }, [
            el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 54, fontWeight: 700, color: C.phos, letterSpacing: -2 }, i.score),
            el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 20, color: C.faint }, '/5'),
          ]),
        ]),
      ]),
    ]),
  ]);

  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return Buffer.from(png);
}
