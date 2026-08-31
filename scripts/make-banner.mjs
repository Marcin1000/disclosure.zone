/* Repository banner. Rendered to PNG so GitHub and npm display it identically. */
import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const F = (f) => readFile(join(process.cwd(), 'src/assets/fonts', f));
const [mono, monoB, serif] = await Promise.all([
  F('CourierPrime-Regular.ttf'), F('CourierPrime-Bold.ttf'), F('Newsreader-SemiBold.ttf'),
]);

const W = 1280, H = 420;
const PHOS = '#4DE3A0', DIM = '#32916B', FG = '#DCE3E1', FAINT = '#758482';

const ring = (r, o, w = 1.4) =>
  `<circle cx="96" cy="210" r="${r}" fill="none" stroke="${DIM}" stroke-width="${w}" opacity="${o}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#06090A"/>
  <g opacity=".5">${[0, 1, 2, 3].map(n =>
    `<line x1="0" y1="${105 * n}" x2="${W}" y2="${105 * n}" stroke="rgba(77,227,160,.06)" stroke-width="1"/>`).join('')}</g>
  <rect x="0" y="0" width="6" height="${H}" fill="${DIM}"/>

  <g mask="url(#gap)">
    ${ring(52, .85)}${ring(34, .55, 1)}${ring(16, .35, 1)}
    <path d="M96 210 L136.5 183.8" stroke="${PHOS}" stroke-width="2" opacity=".9"/>
    <g stroke="${PHOS}" stroke-width="2" opacity=".8">
      <path d="M96 152v14M96 254v14M42 210h14M136 210h14"/>
    </g>
  </g>
  <mask id="gap">
    <rect width="${W}" height="${H}" fill="#fff"/>
    <rect x="30" y="223" width="134" height="12" fill="#000" transform="rotate(-4 96 229)"/>
  </mask>

  <text x="186" y="200" font-family="Courier Prime" font-weight="700" font-size="46" letter-spacing="7" fill="${FG}">DISCLOSURE<tspan fill="${PHOS}">.ZONE</tspan></text>
  <text x="188" y="244" font-family="Courier Prime" font-size="19" letter-spacing="6" fill="${FAINT}">DOCUMENTS, NOT RUMORS</text>
  <text x="188" y="304" font-family="Newsreader" font-size="21" fill="#C9D3D0">A UAP case database with an explicit evidence methodology.</text>
  <text x="188" y="338" font-family="Newsreader" font-size="21" fill="#8D9997">Unresolved never means extraterrestrial.</text>

  <g font-family="Courier Prime" font-size="17" letter-spacing="3">
    <text x="188" y="392" fill="${DIM}">74 CASES  ·  24 COUNTRIES  ·  89 CLAIMS  ·  1561–2024  ·  CC BY 4.0</text>
  </g>
</svg>`;

const png = new Resvg(svg, {
  // bez tego resvg dobiera krój systemowy i banner wygląda inaczej na każdej maszynie
  font: { fontBuffers: [mono, monoB, serif], defaultFontFamily: 'Courier Prime', loadSystemFonts: false },
  fitTo: { mode: 'width', value: W },
}).render().asPng();

await writeFile(join(process.cwd(), 'docs/banner.png'), png);
console.log('docs/banner.png', (png.length / 1024).toFixed(0) + ' kB');
