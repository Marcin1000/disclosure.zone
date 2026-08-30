# disclosure.zone

Baza przypadków UAP z jawną metodologią oceny dowodów.

**Documents, not rumors.**

Teza projektu: *problemem UAP nie jest brak przypadków, tylko brak danych.*

## Co to jest

- **55 spraw** z 19 państw, od 1561 r. po sprawy aktywne w 2025 r.
- **68 twierdzeń** w rejestrze „mit kontra dokument" — każde z pochodzeniem,
  klasą źródła, statusem i warunkiem rozstrzygnięcia
- **14 programów państwowych** — USA, Francja, Wielka Brytania, Włochy, Chile,
  Kanada, Australia, Szwecja, Hiszpania, Brazylia, Norwegia, Belgia, ZSRR
- **Mapa świata** z filtrowaniem po państwie
- **Dane otwarte** — JSON i CSV na licencji CC BY 4.0

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
src/content/cases/*.md   jeden plik = jedna sprawa (schemat w src/content.config.ts)
src/data/claims.ts       rejestr twierdzeń
src/data/archives.ts     rejestr archiwów państwowych
src/lib/scoring.ts       skala S–D, wagi, klasy dowodowe
src/components/          Logo, WorldPlot (d3-geo + world-atlas), Scorecard, Sources
src/pages/api/           cases.json, claims.json, cases.csv
```

Stack: Astro 7, zero frameworka UI, statyczny output. Mapa renderowana do SVG
w build time — brak zależności runtime po stronie klienta.

## Status danych

Korpus jest selekcją spraw o najwyższej wartości analitycznej, nie kompletnym spisem.
Uzupełnianie bezpośrednich odnośników do materiałów archiwalnych jest zadaniem bieżącym —
wskaźnik proweniencji jest widoczny przy każdej sprawie i w `/o-projekcie`.

## Licencja

Treść: CC BY 4.0. Dokumenty źródłowe pozostają własnością wydających je instytucji.
