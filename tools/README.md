# tools

Requires Node 20 or newer (the tools use `fetch`, `AbortSignal.timeout` and
`fs.statfs`). Windows, macOS and Linux all work.

They import nothing but Node built-ins, so they run from a fresh clone without
`npm install`. `match-records.mjs` reads the corpus and has to be run from the
repository root; the other two can run anywhere.

Operator tooling, run by hand. Not part of the build and not imported by the
site. Everything here works on material outside the repository.

The rule these tools exist to enforce: an aggregator is where you **find** a
document, never where you **cite** it. The corpus takes primary documents read
at the publisher. Indexes shorten the search and nothing else.

## harvest-archive.mjs

Collects the discovery layer from Disclosure Archive: title, record URL, and the
record's link to an official source. It does not save their pages and does not
download files from their server.

```
node tools/harvest-archive.mjs [--out DIR] [--limit N] [--index URL] [--probe]
```

`robots.txt` is fetched and honoured; a disallowed index exits 2. Requests are
spaced ~0.9 s apart and identify this project.

The site's markup has not been inspected, so the link patterns are informed
guesses. When nothing matches, the tool prints the anchors it actually found and
exits 1 — paste that output and the patterns can be corrected instead of guessed
at again. `--probe` prints the same diagnostic on a successful run.

Output: `manifest.json` with `{ title, recordUrl, officialSourceUrl }` per record,
plus `failures.json` when anything failed.

## fetch-pursue.mjs

Downloads the official PURSUE bundles from war.gov. US government work, public
domain, and the original that the indexes point at.

```
node tools/fetch-pursue.mjs [--out DIR] [--release 03] [--videos] [--extract]
```

Documents only by default, about 2.4 GB across the five releases. Videos add
roughly 13.4 GB and need `--videos`. Free space is checked before anything is
fetched, counting the extracted copy when `--extract` is passed. Downloads
resume after an interruption and every bundle gets a SHA-256, so the exact bytes
behind a citation can be shown later.

Free space is read with `fs.statfs`, which behaves the same on Windows and
Unix. Extraction shells out to `tar` on Windows (bsdtar reads zip since Windows
10) and to `unzip` elsewhere, trying the other if the first is missing. If
neither works the bundle is still downloaded and hashed, and the error says so.

Release dates and bundle URLs live in `pursue-releases.json`. The dates were
checked against the department's own release announcements; the bundle URLs were
not opened. If one 404s, take the current address from war.gov/ufo and update
that file.

## match-records.mjs

Turns a harvest manifest into a reading plan.

```
node tools/match-records.mjs harvest/disclosure-archive/manifest.json [--json out.json]
```

Reports which records belong to cases already in the corpus, which describe
events that are not, grouped so that a document, its analysis and its film land
together as one event, and in what order they are worth reading — records
carrying a government source first, since those can become a case with real
provenance.

Matching is deliberately cautious and never decides for you. A record joins an
existing case on a year agreement plus a shared word, on a single word that
points at exactly one case and is long enough not to be an abbreviation, or on
two shared words. A bare year is not enough, and neither is `afb`. Every match
is labelled high, medium or low so the weak ones can be checked by hand.
