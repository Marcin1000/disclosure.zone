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

- Astro 7, zero frameworka UI, statyczny output
- Dane przypadków: content collections + Zod
- Mapa: `world-atlas` (TopoJSON 110m) + `d3-geo` renderowane do SVG w build time
- OG image per sprawa: `satori` + `@resvg/resvg-js`, czcionki w `src/assets/fonts`
- Brak JS klienta poza mapą, filtrami, kalkulatorem i drobnymi interakcjami (vanilla)

## Języki

- **Angielski jest językiem głównym** (`/`), polski jest drugą wersją (`/pl/`)
- Przełącznik języka siedzi w stopce — celowo dyskretny
- Strony żyją w `src/pages/[...lang]/`; `getStaticPaths` musi zwracać
  `langParams()` (funkcję, nie stałą — współdzielony obiekt psuje routing)

## Komendy

```
npm install
npm run dev      # localhost:4321
npm run build    # -> dist/
npm run preview
```

## Architektura danych

- `src/content/cases/*.md` — **rekord kanoniczny**: dane strukturalne + tekst angielski.
  Współrzędne, oceny, klasy źródeł żyją wyłącznie tutaj
- `src/content/pl/*.md` — **nakładka polska**: wyłącznie tekst (tytuł, streszczenie,
  alternatywy, etykiety źródeł, treść). Struktury tu nie ma i nie może być
- `src/lib/cases.ts` — scala rekord z nakładką (`getCases(lang)`)
- `src/data/sources.ts` — **rejestr zweryfikowanych odnośników**. Sprawa odwołuje się
  kluczem (`ref`), więc poprawka adresu działa od razu w obu językach.
  Wpisujemy wyłącznie adresy sprawdzone wobec żywego źródła
- `src/data/claims.ts` — Claim Ledger, dwujęzyczny
- `src/data/archives.ts` — rejestr archiwów państwowych, dwujęzyczny
- `src/lib/scoring.ts` — skala S/R/O/P/M/T/X/D, wagi, klasy dowodowe
- `src/lib/og.ts` — generator OG image

## Zasady redakcyjne

1. Każde twierdzenie ma przypisany tier źródła T1–T5 (patrz `/metodologia`).
2. Nie łączymy „autentyczne nagranie" z „zidentyfikowany obiekt".
3. „Nierozstrzygnięte" nigdy nie znaczy „pozaziemskie".
4. Brak linku do źródła jest widoczny w UI, nie ukrywany.
