/**
 * Lista źródeł bez odnośnika: co zostało do sprawdzenia i podlinkowania ręcznie.
 * Odpalane osobno, nie w buildzie, bo brak linku jest stanem dopuszczalnym,
 * a nie błędem. Build pilnuje tylko spójności liczb.
 *
 *   npm run sources:todo            wszystko, pogrupowane po sprawie
 *   npm run sources:todo -- <id>    jedna sprawa
 *
 * Frontmatter czytamy tak samo minimalnie jak check-data.mjs, bez parsera YAML,
 * żeby skrypty budujące nie ciągnęły zależności, której reszta repo nie używa.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/cases';
const only = process.argv[2];

const unquote = (v) => v.trim().replace(/^["'](.*)["']$/s, '$1');

function sourcesOf(raw) {
  const at = raw.search(/^sources:\s*$/m);
  if (at < 0) return [];
  const block = [];
  for (const line of raw.slice(at).split('\n').slice(1)) {
    if (/^[A-Za-z]/.test(line)) break;   // kolejny klucz frontmatteru
    block.push(line);
  }
  return block.join('\n')
    .split(/^- /m).slice(1)
    .map(entry => ({
      tier: unquote((/"?tier"?:\s*(.+)/.exec(entry) ?? [, '?'])[1]),
      label: unquote((/^\s*"?label"?:\s*(.+)/m.exec(entry) ?? [, '(no label)'])[1]),
      linked: /^\s*"?(?:ref|archive)"?:/m.test(entry),
    }));
}

const byCase = new Map();
let total = 0;
for (const f of readdirSync(DIR).filter(f => f.endsWith('.md'))) {
  const id = f.slice(0, -3);
  if (only && id !== only) continue;
  const t = readFileSync(join(DIR, f), 'utf8');
  const raw = (/^---\n([\s\S]*?)\n---\n/.exec(t) ?? [, ''])[1];
  const date = unquote((/^dateDisplay:\s*(.+)/m.exec(raw) ?? [, ''])[1]);
  const bare = sourcesOf(raw).map((s, i) => ({ ...s, i })).filter(s => !s.linked);
  if (bare.length) { byCase.set(id, { date, bare }); total += bare.length; }
}

if (only && !byCase.size) {
  console.log(`${only}: every source is linked (or the id does not exist)`);
  process.exit(0);
}

const order = [...byCase].sort((a, b) => b[1].bare.length - a[1].bare.length || a[0].localeCompare(b[0]));
for (const [id, { date, bare }] of order) {
  console.log(`\n${id}${date ? '  (' + date + ')' : ''}`);
  for (const s of bare) console.log(`  [${s.i}] ${s.tier}  ${s.label}`);
}

const tiers = {};
for (const [, { bare }] of byCase) for (const s of bare) tiers[s.tier] = (tiers[s.tier] ?? 0) + 1;
const pl = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
console.log(`\n${pl(total, 'source')} without a link, across ${pl(byCase.size, 'case')}`);
console.log('by tier: ' + Object.keys(tiers).sort().map(t => `${t} ${tiers[t]}`).join(' · '));
console.log('add a key in src/data/sources.ts, then point at it with ref: (or archive:) in the case file');
