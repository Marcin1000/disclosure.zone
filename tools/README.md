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

Matching is deliberately cautious and never decides for you. A record counts as
covered only on a year agreement plus a word that points at exactly one case.
Everything weaker goes to a separate "needs a human" list rather than being
asserted. That split came out of the first real run: on one shared word,
"East China Sea" attached itself to the US East Coast, "Persian Gulf" to the
Gulf of Mexico, and "airport" joined Kazakhstan to Hangzhou. Place names collide
constantly in this material, and no token matcher resolves them — a person has
to read the list. Even the strict rule lets one through: Washington State 1952
looks exactly like Washington DC 1952.

Events are grouped by place and year when the title carries them, which
archival titles usually do in the form `id, kind, place, date`. Titles without
that shape fall back to year plus the rarest word. Records sharing an
identifier are collapsed, since the same record turns up under several URLs.
