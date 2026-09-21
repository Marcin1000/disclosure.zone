/**
 * Mapowanie korpusu na DisclosureOS — otwarty standard opisu obserwacji UAP
 * (Disclosure Foundation, MIT). Dzięki niemu nasze sprawy dają się porównać
 * z innymi bazami bez importowania czyjejkolwiek oceny.
 *
 * Mapujemy tylko to, co naprawdę mamy. Pól, których nie mierzymy, nie
 * wypełniamy zgadywaniem: brak pola jest uczciwszy niż wartość „unknown"
 * udająca pomiar. Nasza ocena na ośmiu osiach zostaje w `extensions`,
 * bo jest nasza, a nie częścią standardu.
 */
import { overall, evidenceClass } from './scoring';

const SCHEMA_VERSION = '1.1.0';

type Tier = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

/**
 * Kształt po scaleniu przez getCases, nie surowy rekord z kolekcji: klucze
 * `ref`/`archive` są tam już rozwiązane na adresy. Opisujemy tylko to, co
 * naprawdę czytamy, żeby pomyłka w polu nie przeszła cicho.
 */
export interface ResolvedSource {
  tier: string;
  label: string;
  note?: string;
  /** Adres samego materiału. Tylko to liczy się do proweniencji. */
  url?: string;
  /** Adres instytucji przechowującej, gdy materiału nie ma pod własnym adresem. */
  archiveUrl?: string;
}

export interface ResolvedCase {
  date: Date;
  dateDisplay: string;
  country: string;
  countryName: string;
  location: string;
  witnesses: string;
  duration?: string;
  summary: string;
  subtitle?: string;
  official?: string;
  domain: 'military' | 'civil' | 'mixed' | 'scientific';
  tier: 1 | 2 | 3;
  status: 'unresolved' | 'insufficient' | 'explained' | 'disputed';
  evidence: string[];
  scores: Record<'S' | 'R' | 'O' | 'P' | 'M' | 'T' | 'X' | 'D', number>;
  claims: string[];
  sources: ResolvedSource[];
}

type Case = ResolvedCase;

/**
 * Nasz tier mierzy odległość od zdarzenia, ich `credibility` mierzy zaufanie.
 * To dwie różne osie, więc tier idzie przede wszystkim w `type`
 * i `isPrimarySource`, a `credibility` dostaje wartość najostrożniejszą
 * z możliwych. T5 to „twierdzenie medialne", nie „niewiarygodne".
 */
const SOURCE_TYPE: Record<Tier, string> = {
  T1: 'official_report',
  T2: 'official_statement',
  // Standard zna tylko `congressional_testimony`, a nasze T3 obejmuje też
  // zeznania spoza Kongresu, więc bierzemy wartość ogólniejszą i prawdziwą.
  T3: 'firsthand_witness',
  T4: 'secondhand_account',
  T5: 'news_article',
};

const CREDIBILITY: Record<Tier, string> = {
  T1: 'official',
  T2: 'official',
  T3: 'verified',
  T4: 'credible',
  T5: 'unverified',
};

/** Rodzaj miejsca. Wyprowadzamy tylko z tego, co wiemy: charakter sprawy. */
const SITE_TYPE: Record<Case['domain'], string> = {
  military: 'military_other',
  civil: 'other',
  mixed: 'other',
  scientific: 'research_facility',
};

/**
 * Status w standardzie to etap redakcyjny rekordu, nie rozstrzygnięcie sprawy.
 * Wszystko, co publikujemy, jest opublikowane; nasz status sprawy siedzi
 * w `investigation.conclusion` i w rozszerzeniu.
 */
const CONFIDENCE: Record<Case['status'], string> = {
  explained: 'high',
  disputed: 'low',
  insufficient: 'very_low',
  unresolved: 'unassessed',
};

const SITE = 'https://disclosure.zone';

export interface ObservationOpts {
  /** Znacznik czasu wygenerowania, wspólny dla całego eksportu. */
  generated: string;
}

export function toObservation(
  id: string,
  d: Case,
  pl: { title: string; summary: string } | undefined,
  { generated }: ObservationOpts,
) {
  const iso = d.date.toISOString().slice(0, 10);
  const cls = evidenceClass(d.scores);

  const sources = d.sources.map((s, i) => {
    const tier = s.tier as Tier;
    const ref: Record<string, unknown> = {
      sourceId: `${id}-s${i + 1}`,
      type: SOURCE_TYPE[tier],
      title: s.label,
      credibility: CREDIBILITY[tier],
      isPrimarySource: tier === 'T1',
    };
    // url to adres materiału, archiveUrl to wskazanie, gdzie materiał leży.
    // Rozróżnienie jest u nas nośne, więc nie zlewamy go w jedno pole.
    if (s.url) ref.url = s.url;
    if (s.archiveUrl) ref.archiveUrl = s.archiveUrl;
    if (s.note) ref.notes = s.note;
    return ref;
  });

  const obs: Record<string, unknown> = {
    id: `disclosure-zone:${id}`,
    schemaVersion: SCHEMA_VERSION,
    dataSourceId: 'disclosure.zone',
    status: 'published',
    createdAt: generated,
    updatedAt: generated,

    temporal: {
      date: iso,
      // Część spraw to fale rozciągnięte na miesiące; dateDisplay mówi prawdę,
      // której pojedyncza data nie unosi.
      dateCertainty: /[–-]|wave|\(/i.test(d.dateDisplay) ? 'approximate' : 'exact',
      ...(d.duration ? { durationDescription: d.duration } : {}),
    },

    location: {
      id: `${id}-loc`,
      name: d.location,
      country: d.countryName,
      countryCode: d.country,
      longitude: d.lon,
      latitude: d.lat,
      // Współrzędne są środkiem obszaru zdarzenia, nie punktem pomiaru.
      coordinatePrecision: 'approximate',
      coordinatesApproximate: true,
      siteType: SITE_TYPE[d.domain],
    },

    summary: d.summary,
    eventType: d.evidence.join(' + ') || 'report',

    sourceData: { sources },

    investigation: {
      ...(d.official ? { conclusion: d.official } : {}),
      confidence: CONFIDENCE[d.status],
    },

    witnesses: { descriptions: [d.witnesses] },

    identifiers: {
      primary: { system: 'url', value: `${SITE}/cases/${id}` },
      identifiers: [{ system: 'url', value: `${SITE}/cases/${id}` }],
    },

    /**
     * Nasza metodologia, wyraźnie oddzielona od standardu. Kto konsumuje ten
     * plik, ma od razu widoczne, że ocena jest nasza i czym została policzona.
     */
    extensions: {
      'disclosure.zone': {
        methodology: `${SITE}/methodology`,
        license: 'CC BY 4.0',
        status: d.status,
        domain: d.domain,
        editorialTier: d.tier,
        evidence: d.evidence,
        axes: d.scores,
        overall: overall(d.scores),
        evidenceClass: cls.c,
        sourceTiers: d.sources.map(s => s.tier),
        provenanceLinked: d.sources.filter(s => s.url).length,
        claims: d.claims,
        ...(pl ? { titlePl: pl.title, summaryPl: pl.summary } : {}),
      },
    },
  };

  if (d.subtitle) obs.description = d.subtitle;
  return obs;
}
