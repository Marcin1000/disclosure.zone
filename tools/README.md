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
checked against the department's own release announcements; the bundle URLs came
from a third-party pack and were never opened, so treat them as unverified.

```
node tools/fetch-pursue.mjs --check
```

checks every address with a one-byte range request and downloads nothing, and
separates the two reasons a bundle fails — per host, which is the part that
matters. Five differently shaped paths on one host do not all go wrong at once,
so when every address on a host fails while another host answers, that host is
refusing the client. When some paths on the *same* host answer and others do
not, those paths really are wrong: take the current one from war.gov/ufo by
right-clicking the download link.

For a refused client, `--browser` sends the header set a browser sends, and
`--ua "..."` changes only the signature. These are public-domain files the
department publishes for download, so this is getting past a header check, not
past an access control.

## index-bundles.mjs

Indexes what the download actually contains and cross-references it with the
harvest manifest.

```
node tools/index-bundles.mjs [--dir harvest/pursue]
                             [--manifest harvest/disclosure-archive/manifest.json]
                             [--out harvest/inventory.json]
```

It does not extract anything — it reads the name list out of each zip, so 16 GB
takes seconds and needs no second copy on disk. The output holds file names
only, never document content, which makes it small enough to pass around.

Entries left behind by packing on macOS are skipped. In the real bundles they
were 180 of 554 names, a third of the listing, each shadowing a real file.

The cross-reference answers the question the rest depends on: how many of the
indexed records are now held as primary files. Identifiers are matched with a
boundary, because `D10` is a prefix of `D102` and this corpus has 54 such pairs;
without that the coverage figure is inflated and the wrong document gets picked.

Documents and recordings are reported apart, and only documents are searched for
identifiers. Recordings are named by DOD asset number — `DOD_111688723.mp4` —
which carries no record identifier and does not appear in the index links
either, so they cannot be tied to a record by name. Counting them as missing
would understate coverage by a third.

## split-file.mjs

Splits a file into parts that fit an attachment limit, and puts them back.

```
node tools/split-file.mjs <file> [--size 20] [--out DIR]
node tools/split-file.mjs --join <file.parts.json> [--out DIR]
```

The parts are raw byte ranges, so nothing is lost and no format is touched. The
manifest carries the original's SHA-256, and rejoining verifies it, so a
truncated or out-of-order part is caught rather than producing a file that looks
fine and is not. Rejoining is also just concatenation in order, which means the
parts can be put back with any tool.

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

Pass `--files harvest/inventory.json` and each event also reports how many of
its records are held locally. `--event "Gulf of Oman"` prints one event in full
with the exact path of every file, including the archive it sits in — which is
the list to read when writing that case.
