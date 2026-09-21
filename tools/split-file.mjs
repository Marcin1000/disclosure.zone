#!/usr/bin/env node
/**
 * Dzieli plik na części mieszczące się w limicie załącznika i składa je z powrotem.
 * Bezstratnie: części to surowe bajty oryginału, a manifest niesie sumę SHA-256,
 * więc po złożeniu da się wykazać, że to dokładnie ten sam plik.
 *
 *   node tools/split-file.mjs <plik> [--size 20] [--out DIR]
 *   node tools/split-file.mjs --join <plik.parts.json> [--out DIR]
 *
 * Rozmiar w MB, domyślnie 20, czyli z zapasem pod limit 30 MB.
 */
import { createHash } from 'node:crypto';
import {
  createReadStream, createWriteStream, existsSync, mkdirSync,
  readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? d);
};
const MB = 1024 * 1024;

const sha256 = (p) => new Promise((ok, bad) => {
  const h = createHash('sha256');
  createReadStream(p).on('data', c => h.update(c)).on('end', () => ok(h.digest('hex'))).on('error', bad);
});

async function split(file) {
  if (!existsSync(file)) { console.error(`${file} not found`); process.exit(1); }
  const outDir = String(flag('out', dirname(file)));
  const chunk = Number(flag('size', 20)) * MB;
  if (!Number.isFinite(chunk) || chunk <= 0) { console.error('--size must be a positive number of MB'); process.exit(1); }

  mkdirSync(outDir, { recursive: true });
  const name = basename(file);
  const total = statSync(file).size;
  const digest = await sha256(file);

  if (total <= chunk) {
    console.log(`${name} is ${(total / MB).toFixed(1)} MB and already fits — nothing to do.`);
    return;
  }

  const parts = [];
  let index = 0;
  for (let at = 0; at < total; at += chunk) {
    index += 1;
    const partName = `${name}.${String(index).padStart(3, '0')}`;
    const dest = join(outDir, partName);
    const end = Math.min(at + chunk, total) - 1;
    await pipeline(createReadStream(file, { start: at, end }), createWriteStream(dest));
    parts.push({ name: partName, bytes: statSync(dest).size });
    console.log(`  ${partName}  ${(parts.at(-1).bytes / MB).toFixed(1)} MB`);
  }

  const manifest = join(outDir, `${name}.parts.json`);
  writeFileSync(manifest, JSON.stringify({
    original: name, bytes: total, sha256: digest, parts,
    note: 'Raw byte ranges. Rejoin in order, then check the sha256.',
  }, null, 1));
  console.log(`\n${name}: ${(total / MB).toFixed(1)} MB in ${parts.length} part(s)`);
  console.log(`sha256 ${digest}`);
  console.log(`manifest ${manifest}`);
}

async function joinParts(manifestPath) {
  const m = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const from = dirname(manifestPath);
  const outDir = String(flag('out', from));
  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, m.original);

  const missing = m.parts.filter(p => !existsSync(join(from, p.name)));
  if (missing.length) {
    console.error(`missing ${missing.length} part(s): ${missing.map(p => p.name).join(', ')}`);
    process.exit(1);
  }

  const out = createWriteStream(dest);
  for (const p of m.parts) await pipeline(createReadStream(join(from, p.name)), out, { end: false });
  out.end();
  await new Promise(r => out.on('close', r));

  const got = await sha256(dest);
  const size = statSync(dest).size;
  console.log(`${m.original}: ${(size / MB).toFixed(1)} MB`);
  if (got === m.sha256 && size === m.bytes) { console.log('sha256 matches the original'); return; }
  console.error(`MISMATCH\n  expected ${m.sha256} (${m.bytes} bytes)\n  got      ${got} (${size} bytes)`);
  process.exit(1);
}

const joinFile = flag('join', null);
if (joinFile && joinFile !== true) await joinParts(String(joinFile));
else if (argv[0] && !argv[0].startsWith('--')) await split(argv[0]);
else {
  console.error('usage:\n  node tools/split-file.mjs <file> [--size 20] [--out DIR]\n' +
                '  node tools/split-file.mjs --join <file.parts.json> [--out DIR]');
  process.exit(1);
}
