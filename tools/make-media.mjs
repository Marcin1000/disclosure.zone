#!/usr/bin/env node
/**
 * Robi z lokalnie pobranych nagrań to, co można u nas pokazać: klatkę tytułową
 * i krótki fragment. Całych nagrań nie hostujemy, bo jedno wydanie wideo to
 * kilka gigabajtów, a wydawca i tak je udostępnia.
 *
 *   node tools/make-media.mjs --videos harvest\pursue --dry-run
 *   node tools/make-media.mjs --videos harvest\pursue
 *   node tools/make-media.mjs --videos harvest\pursue --clip 12
 *   node tools/make-media.mjs --videos harvest\pursue --id DOW-UAP-PR024
 *
 * Pliki lokalne nazywają się numerem zasobu DOD, a rekordy identyfikatorem
 * PURSUE, więc jedno z drugim wiąże mapa z tools/map-videos.mjs. Bez mapy nie
 * zgadujemy, który plik jest którym rekordem: nazwanie kadru cudzym
 * identyfikatorem byłoby fałszywym przypisaniem materiału do sprawy.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, extname, basename } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : (argv[i + 1]?.startsWith('--') ? true : argv[i + 1] ?? true);
};
const many = (n) => argv.reduce((a, v, i) => (v === `--${n}` && argv[i + 1] ? [...a, argv[i + 1]] : a), []);

const VIDEOS = flag('videos', null);
const MAP = String(flag('map', 'harvest/video-map.json'));
const OUT = String(flag('out', 'public/media/records'));
const CLIP = Number(flag('clip', 0)) || 0;
const IDS = many('id').map(s => s.toUpperCase());
const DRY = argv.includes('--dry-run');

if (!VIDEOS || VIDEOS === true) {
  console.error('say where the recordings are:  --videos harvest\\pursue');
  process.exit(1);
}
if (!existsSync(MAP)) {
  console.error(`no recording map at ${MAP}. Build it first:\n  node tools/map-videos.mjs --browser`);
  process.exit(1);
}

/** Numer zasobu -> identyfikator rekordu. Jedno źródło przypisania. */
const map = JSON.parse(readFileSync(MAP, 'utf8'));
const byAsset = new Map();
for (const v of map.videos ?? []) {
  if (!v.id) continue;
  for (const a of v.assets ?? []) byAsset.set(a.toUpperCase(), v.id);
}
if (!byAsset.size) {
  console.error(`${MAP} ties no asset number to a record. Run: node tools/map-videos.mjs --probe`);
  process.exit(1);
}

const VIDEO_EXT = new Set(['.mp4', '.mov', '.m4v', '.mpg', '.mpeg', '.avi', '.wmv', '.mkv']);
function walk(dir, hits = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === '__MACOSX') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, hits);
    else if (VIDEO_EXT.has(extname(e.name).toLowerCase())) hits.push(p);
  }
  return hits;
}

const files = existsSync(String(VIDEOS)) ? walk(String(VIDEOS)) : [];
if (!files.length) {
  console.error(`no video file under ${VIDEOS}. Extract the video bundles first.`);
  process.exit(1);
}

/** Numer zasobu czytamy z nazwy pliku, bo tak wydawca nazywa to, co wydaje. */
const jobs = [];
let unmatched = 0;
for (const f of files) {
  const m = /DOD[_-](\d{6,})/i.exec(basename(f));
  const id = m ? byAsset.get(`DOD_${m[1]}`) : null;
  if (!id) { unmatched++; continue; }
  if (IDS.length && !IDS.includes(id)) continue;
  jobs.push({ file: f, id });
}

console.log(`${files.length} video file(s) found · ${jobs.length} tied to a record${IDS.length ? ' and selected' : ''} · ${unmatched} not in the map`);
if (unmatched) {
  console.log('   Files not in the map are left alone. A frame named with somebody else\'s');
  console.log('   identifier would be a false attribution, so guessing is not on offer.');
}
if (!jobs.length) process.exit(1);

if (DRY) {
  for (const j of jobs) console.log(`  ${j.id.padEnd(16)} ${j.file}`);
  process.exit(0);
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
}
try {
  execFileSync('ffmpeg', ['-hide_banner', '-version'], { stdio: 'ignore' });
} catch {
  console.error('\nffmpeg is not on PATH. On Windows:  winget install Gyan.FFmpeg');
  console.error('then open a new terminal so PATH picks it up.');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
let stills = 0, clips = 0, skipped = 0, failed = 0;

for (const { file, id } of jobs) {
  const jpg = join(OUT, `${id}.jpg`);
  const mp4 = join(OUT, `${id}.mp4`);

  if (!existsSync(jpg)) {
    try {
      // sekunda trzecia, a nie zerowa: pierwsze klatki bywają czarne albo to plansza
      ffmpeg(['-ss', '3', '-i', file, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '4', jpg]);
      console.log(`${id.padEnd(16)} still  ${(statSync(jpg).size / 1024).toFixed(0)} kB`);
      stills++;
    } catch (e) {
      console.log(`${id.padEnd(16)} still FAILED  ${String(e.stderr ?? e.message ?? e).trim().split('\n').pop()}`);
      failed++;
    }
  } else skipped++;

  if (CLIP && !existsSync(mp4)) {
    try {
      ffmpeg(['-ss', '0', '-t', String(CLIP), '-i', file,
              '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
              '-movflags', '+faststart', '-an', mp4]);
      console.log(`${id.padEnd(16)} clip   ${(statSync(mp4).size / 1e6).toFixed(1)} MB`);
      clips++;
    } catch (e) {
      console.log(`${id.padEnd(16)} clip FAILED  ${String(e.stderr ?? e.message ?? e).trim().split('\n').pop()}`);
      failed++;
    }
  }
}

console.log(`\nstills ${stills} · clips ${clips} · already held ${skipped} · failed ${failed}`);
console.log(`wrote into ${OUT}. Commit what you want the site to serve.`);
process.exit(failed && !stills && !clips ? 1 : 0);
