<p align="center">
  <img src="docs/banner.png" alt="disclosure.zone — documents, not rumors" width="100%">
</p>

<p align="center">
  <a href="https://disclosure.zone"><b>disclosure.zone</b></a> ·
  <a href="https://disclosure.zone/methodology">Methodology</a> ·
  <a href="https://disclosure.zone/toolkit">Sensor Sanity Toolkit</a> ·
  <a href="https://disclosure.zone/data">Open data</a>
</p>

---

A UAP case database with an explicit evidence methodology.

The premise: **the UAP problem is not a shortage of cases, it is a shortage of data.**

## What is in here

- **80 cases** from 27 countries, from 1561 to cases still open in 2024
- **99 claims** in a myth-versus-document ledger, each with its origin, source tier,
  verification status and the condition that would settle it
- **17 state programmes** across the US, France, the UK, Italy, Chile, Canada,
  Australia, Sweden, Spain, Brazil, Norway, Belgium and the USSR
- **450 records** in a registry of the documents released by the Department of War
  under PURSUE, each with the link to the material at the publisher
- **Sensor Sanity Toolkit** — four modules on parallax, aperture shape, angular size
  and the Earth's shadow, worked on real footage
- **World map** with per-country filtering, rendered at build time
- **Open data** as JSON and CSV, including a [DisclosureOS](https://os.disclosure.org/)
  1.1.0 export so the corpus can be compared with other databases
- **Per-case Open Graph images**
- **Open data** — JSON and CSV under CC BY 4.0

## Methodology

Every case is scored 0–5 on eight independent axes: **S** witnesses, **R** radar/sensor,
**O** optical/IR, **P** physical trace, **M** multi-channel, **T** documentation,
**X** anomalousness, **D** data available today. The axes measure how well documented
a case is, not how anomalous it is.

Every source carries a tier, **T1–T5**, from a contemporaneous operational document down
to a media claim with nothing behind it. A missing link to the material is shown in the
interface, never hidden.

Full description: [`/methodology`](https://disclosure.zone/methodology).

## Languages

English is the primary language (`/`); Polish is the second version (`/pl/`).
The switcher lives in the footer, deliberately understated.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

## Layout

```
src/content/cases/*.md   canonical record: structure + English text
src/content/pl/*.md      Polish overlay: text only, no structure
src/lib/cases.ts         merges the record with its overlay
src/data/sources.ts      registry of verified links (cases refer to it by key)
src/data/records.json    PURSUE document registry, generated and checked in
src/lib/records.ts       registry access: provenance counts, case links, releases
src/data/claims.ts       claim ledger, bilingual
src/data/archives.ts     registry of state archives, bilingual
src/lib/scoring.ts       the S–D scale, weights, evidence classes
src/lib/og.ts            Open Graph image generator (satori + resvg)
src/components/          Logo, WorldPlot (d3-geo + world-atlas), HeroScope, Scorecard, Sources
src/pages/[...lang]/     pages in both language versions
src/pages/api/           cases.json, claims.json, sources.json, records.json, cases.csv
scripts/check-data.mjs   corpus consistency check, runs before every build
scripts/build-records.mjs regenerates the document registry from a harvest manifest
scripts/make-banner.mjs  renders docs/banner.png
```

Stack: Astro 7, no UI framework, static output. The map and the OG images are rendered
at build time, so there is no runtime dependency on the client beyond a little vanilla JS
for the map, the filters and the calculator.

## State of the data

The corpus is a selection of the cases with the highest analytical value. It is not a
complete index, and it does not claim to be.

Links fall into three categories and are **never mixed**:

- **91 of 198** sources have an address for the material itself — the only ones that
  count toward provenance
- **40** point at the archive that holds the document (NARA, TNA Discovery, NAA
  RecordSearch, LAC, GEIPAN, Arquivo Nacional) — useful, but an archive is not a document
- **67** have neither, so far

Every address in the registry was checked against a live source rather than guessed. The
provenance counter is visible on each case and on [`/about`](https://disclosure.zone/about).

`npm run check:data` validates the canonical records against their overlays and the
cross-references between cases and claims. The build fails if anything drifts.

### The document registry

The registry is a separate layer and must not be read as a case base. It holds what the
issuing body itself published — identifier, title, release, address — and nothing we
wrote. A document appearing there proves that the document exists, and nothing beyond
that: it has not been read, scored or summarised.

The same rule about links applies, and the same refusal to round it up:

- **285 of 450** records have an address for the material itself
- **106** point at the publisher's page for that item
- **42** give only the page of the release the document sits inside, which is not an
  address for a document and is not counted as one
- **1** gives an address the publisher does not serve, confirmed by fetching it
- **16** have no link at all
- **31** are cited by a case so far

That last number is the honest one. Reading a document into a case is work a person does,
and the gap between 450 and 31 is the point rather than an embarrassment: the shortage in
this subject was never sightings.

`node scripts/build-records.mjs` regenerates `src/data/records.json` from a harvest
manifest. The generated file is checked in, so the site builds without network access and
every change to the registry shows up in a diff.

## Editorial rules

1. Every claim carries a source tier, T1–T5.
2. "Authentic recording" and "identified object" are never merged.
3. "Unresolved" never means "extraterrestrial".
4. A missing source link is visible in the interface, not hidden.

## Licence

Content under CC BY 4.0. Source documents remain the property of the issuing institutions.
