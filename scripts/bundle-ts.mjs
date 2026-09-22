/**
 * Wczytuje moduł TypeScript z src/data do skryptu kontrolnego.
 *
 * Wołamy esbuilda przez jego API w Node, a nie przez `npx esbuild`. Powód jest
 * systemowy: na Windowsie npx to npx.cmd, którego spawn bez powłoki nie
 * znajduje, a ścieżka do binarki esbuilda różni się między platformami. API nie
 * uruchamia niczego przez powłokę, więc ten problem znika w całości.
 *
 * Plik pośredni idzie do katalogu tymczasowego systemu, bo /tmp na Windowsie
 * nie istnieje, a import dostaje adres file://, bo „C:\\Users\\..." nie jest
 * poprawnym specyfikatorem modułu.
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

let esbuild;
try {
  esbuild = await import('esbuild');
} catch {
  console.error('esbuild is missing. Run `npm install` first.');
  process.exit(1);
}

let dir = null;
const workdir = () => {
  if (dir) return dir;
  dir = mkdtempSync(join(tmpdir(), 'disclosure-zone-'));
  // Sprzątamy także przy przerwanym przebiegu, żeby katalogi się nie zbierały.
  process.on('exit', cleanupTs);
  return dir;
};

/** Buduje jeden moduł ze źródła TypeScript i zwraca go. */
export async function loadTs(src, name, { bundle = false, external = [] } = {}) {
  const outfile = join(workdir(), `${name}.mjs`);
  await esbuild.build({ entryPoints: [src], outfile, format: 'esm', bundle, external, logLevel: 'error' });
  return import(pathToFileURL(outfile).href);
}

/** Sprząta katalog roboczy. Nie jest konieczne do poprawności wyniku. */
export function cleanupTs() {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = null;
}
