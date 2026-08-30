# disclosure.zone

Baza przypadków UAP z jawną metodologią oceny dowodów.

**Documents, not rumors.**

Teza projektu: *problemem UAP nie jest brak przypadków, tylko brak danych.*

## Co to jest

- **74 sprawy** z 25 państw, od 1561 r. po sprawy aktywne w 2025 r.
- **89 twierdzeń** w rejestrze „mit kontra dokument" — każde z pochodzeniem,
  klasą źródła, statusem i warunkiem rozstrzygnięcia
- **14 programów państwowych** — USA, Francja, Wielka Brytania, Włochy, Chile,
  Kanada, Australia, Szwecja, Hiszpania, Brazylia, Norwegia, Belgia, ZSRR
- **Sensor Sanity Toolkit** — interaktywny kalkulator paralaksy na przykładzie GOFAST
- **Mapa świata** z filtrowaniem po państwie
- **OG image** generowany per sprawa
- **Dane otwarte** — JSON i CSV na licencji CC BY 4.0

## Języki

Angielski jest językiem głównym (`/`), polski drugą wersją (`/pl/`).
Przełącznik siedzi w stopce.

## Metodologia

Każda sprawa dostaje ocenę 0–5 na ośmiu osiach: **S** świadkowie, **R** radar/sensor,
**O** optyka/IR, **P** ślad fizyczny, **M** wielokanałowość, **T** dokumentacja,
**X** anomalność, **D** dane dzisiaj. Osie mierzą jakość udokumentowania,
nie stopień niezwykłości.

Każde źródło ma klasę **T1–T5** — od dokumentu operacyjnego z epoki po twierdzenie
medialne bez zaplecza. Brak odnośnika do materiału jest widoczny w UI, nie ukrywany.

Pełny opis: `/metodologia`.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

## Struktura

```
src/content/cases/*.md   rekord kanoniczny: struktura + tekst angielski
src/content/pl/*.md      nakładka polska: wyłącznie tekst
src/lib/cases.ts         scalanie rekordu z nakładką
src/data/sources.ts      rejestr zweryfikowanych odnośników (sprawy odwołują się kluczem)
src/data/claims.ts       rejestr twierdzeń, dwujęzyczny
src/data/archives.ts     rejestr archiwów państwowych, dwujęzyczny
src/lib/scoring.ts       skala S–D, wagi, klasy dowodowe
src/lib/og.ts            generator OG image (satori + resvg)
src/components/          Logo, WorldPlot (d3-geo + world-atlas), Scorecard, Sources
src/pages/[...lang]/     strony w obu wersjach językowych
src/pages/api/           cases.json, claims.json, sources.json, cases.csv
scripts/check-data.mjs   kontrola spójności korpusu, uruchamiana przed buildem
```

Stack: Astro 7, zero frameworka UI, statyczny output. Mapa i OG renderowane
w build time — brak zależności runtime po stronie klienta.

## Status danych

Korpus jest selekcją spraw o najwyższej wartości analitycznej, nie kompletnym spisem.

Odnośniki: **80 ze 170 źródeł** ma zweryfikowany adres. Każdy z nich został sprawdzony
wobec żywego źródła, nie zgadnięty. Uzupełnianie reszty jest zadaniem bieżącym —
wskaźnik proweniencji jest widoczny przy każdej sprawie i na `/about`.

`npm run check:data` waliduje spójność rekordów kanonicznych z nakładkami i wzajemne
referencje spraw oraz twierdzeń. Build nie przejdzie, jeśli coś się rozjedzie.

## Licencja

Treść: CC BY 4.0. Dokumenty źródłowe pozostają własnością wydających je instytucji.
