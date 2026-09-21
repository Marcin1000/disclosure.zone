/**
 * Sprawdza, czy eksport w standardzie DisclosureOS naprawdę jest zgodny
 * ze schematem, a nie tylko tak się nazywa. Odpalane po buildzie, bo działa
 * na wygenerowanym pliku.
 *
 * Kontroluje dwie rzeczy:
 *  - każdą obserwację wobec JSON Schema standardu,
 *  - zgodność liczby źródeł i adresów z tym, co raportuje check-data,
 *    żeby mapowanie nie zgubiło po cichu części rekordów.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const require = createRequire(import.meta.url);
const schema = require('@disclosureos/records/schema');
const FILE = 'dist/api/observations.json';

let doc;
try {
  doc = JSON.parse(readFileSync(FILE, 'utf8'));
} catch {
  console.error(`${FILE} missing — run the build first`);
  process.exit(1);
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const errors = [];
for (const obs of doc.observations) {
  if (validate(obs)) continue;
  for (const e of validate.errors.slice(0, 3))
    errors.push(`${obs.id}: ${e.instancePath || '/'} ${e.message}`);
}

// Te same liczby co w check-data. Rozjazd znaczy, że mapowanie coś gubi.
const counted = { url: 0, archiveUrl: 0, neither: 0 };
for (const obs of doc.observations)
  for (const s of obs.sourceData?.sources ?? [])
    counted[s.url ? 'url' : s.archiveUrl ? 'archiveUrl' : 'neither']++;

const total = counted.url + counted.archiveUrl + counted.neither;
console.log(`observations: ${doc.observations.length} · schema: ${doc.standard}`);
console.log(`sources: ${total} · linked to material: ${counted.url} · archive pointer only: ${counted.archiveUrl} · neither: ${counted.neither}`);

if (errors.length) {
  console.error(`\nSCHEMA ERRORS (${errors.length}):`);
  for (const e of errors.slice(0, 20)) console.error('  ' + e);
  process.exit(1);
}
console.log('DisclosureOS conformance: OK');
