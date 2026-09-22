/**
 * Jedno miejsce, w którym liczy się korpus. Banner i kontrola spójności biorą
 * liczby stąd, żeby nie rozjechały się z rzeczywistością przy dodaniu sprawy.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadTs } from './bundle-ts.mjs';

const CANON = 'src/content/cases';

export async function corpusStats() {
  const files = readdirSync(CANON).filter(f => f.endsWith('.md'));
  const countries = new Set();
  const years = [];
  for (const f of files) {
    const raw = readFileSync(join(CANON, f), 'utf8');
    const c = /^country:\s*"([A-Z]{2})"/m.exec(raw);
    if (c) countries.add(c[1]);
    const d = /^date:\s*(\d{4})-/m.exec(raw);
    if (d) years.push(+d[1]);
  }

  const load = (src, out) =>
    loadTs(src, out, { bundle: true, external: ['../i18n', 'astro:content'] });
  const { claims } = await load('src/data/claims.ts', 'claims');
  const { archives } = await load('src/data/archives.ts', 'archives');

  return {
    cases: files.length,
    countries: countries.size,
    claims: claims.length,
    archives: archives.length,
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}
