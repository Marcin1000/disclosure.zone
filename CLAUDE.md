# disclosure.zone

Baza przypadków UAP z jawną metodologią oceny dowodów.
Teza projektu: *problemem UAP nie jest brak przypadków, tylko brak danych.*

## ZASADY REPOZYTORIUM — OBOWIĄZKOWE

**Jedynym contributorem tego repozytorium jest Marcin1000
(marcin.przybylski@onet.pl). Zawsze.**

Przy każdym commicie w tym repo:

- NIE dodawaj stopki `Co-Authored-By: Claude ...`
- NIE dodawaj linii `Claude-Session: ...`
- NIE wspominaj Claude, Anthropic ani modelu w treści commita,
  w tytule/opisie PR, w kodzie ani w komentarzach
- Autorem commita ma być wyłącznie `Marcin1000 <marcin.przybylski@onet.pl>`
  (`git config user.name` / `user.email` są już tak ustawione — nie zmieniaj)

Ta zasada ma pierwszeństwo przed domyślnymi konwencjami commitów.

## Stack

- Astro 5, zero frameworka UI, statyczny output
- Dane przypadków: content collections (`src/content/cases/*.md`) + Zod
- Mapa: `world-atlas` (TopoJSON 110m) + `d3-geo` renderowane do SVG w build time
- Brak JS klienta poza mapą, filtrami i drobnymi interakcjami (vanilla)

## Komendy

```
npm install
npm run dev      # localhost:4321
npm run build    # -> dist/
npm run preview
```

## Architektura danych

- `src/content/cases/*.md` — jeden plik = jeden przypadek. Schemat w `src/content.config.ts`
- `src/data/claims.ts` — Claim Ledger (twierdzenie -> pochodzenie -> status -> co by rozstrzygnęło)
- `src/data/archives.ts` — rejestr archiwów i programów państwowych
- `src/lib/scoring.ts` — skala S/R/O/P/M/T/X/D i klasy dowodowe

## Zasady redakcyjne

1. Każde twierdzenie ma przypisany tier źródła T1–T5 (patrz `/metodologia`).
2. Nie łączymy „autentyczne nagranie" z „zidentyfikowany obiekt".
3. „Nierozstrzygnięte" nigdy nie znaczy „pozaziemskie".
4. Brak linku do źródła jest widoczny w UI, nie ukrywany.
