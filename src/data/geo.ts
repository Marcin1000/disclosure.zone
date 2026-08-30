/** ISO alpha-2 -> numeryczny kod ISO 3166-1 używany przez world-atlas (countries-110m). */
export const ISO_N: Record<string, string> = {
  US: '840', GB: '826', FR: '250', IT: '380', ES: '724', CA: '124', AU: '036',
  NZ: '554', NO: '578', SE: '752', BE: '056', BR: '076', CL: '152', IR: '364',
  ZW: '716', RU: '643', JP: '392', DE: '276', IQ: '368', MX: '484', PR: '630',
  DK: '208', FI: '246', AR: '032', PT: '620', IN: '356', CN: '156', ZA: '710',
  NL: '528', PL: '616', UA: '804', TR: '792', EG: '818', PE: '604',
};

/** Odwrotnie — do podświetlania krajów na mapie. */
export const N_ISO: Record<string, string> = Object.fromEntries(
  Object.entries(ISO_N).map(([a2, n]) => [n, a2]),
);
