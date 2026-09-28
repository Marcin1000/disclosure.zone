/**
 * Skąd wzięto klatkę i co na niej jest. Klatka z nagrania wygląda jak zdjęcie
 * obiektu, więc tam, gdzie obiektu w kadrze nie ma, strona musi to powiedzieć.
 *
 * at: sekunda nagrania, z której wzięto klatkę (make-media --at).
 * object: shown, czyli widać to, co opisuje wydawca; not-found, czyli w tej
 * klatce tego nie znaleźliśmy; absent, czyli nie ma tego w żadnej klatce pliku.
 * Wpisy dotyczą klatek sprawdzonych na powiększeniu, bez nich strona podaje
 * tylko ogólny podpis.
 */
export type StillObject = 'shown' | 'not-found' | 'absent';
export interface StillInfo { at: number; object: StillObject }

const shown = (at: number): StillInfo => ({ at, object: 'shown' });

export const STILLS: Record<string, StillInfo> = {
  'DOW-UAP-PR19': shown(2.6),
  'DOW-UAP-PR21': shown(3),
  'DOW-UAP-PR22': { at: 3, object: 'not-found' },
  'DOW-UAP-PR23': shown(3),
  'DOW-UAP-PR26': shown(3),
  'DOW-UAP-PR27': shown(135),
  'DOW-UAP-PR28': shown(20),
  'DOW-UAP-PR29': shown(6),
  'DOW-UAP-PR31': shown(0.5),
  // opisanego biało-czerwonego półowalu nie ma w żadnej z 198 klatek pliku z paczki
  'DOW-UAP-PR32': { at: 3, object: 'absent' },
  'DOW-UAP-PR33': shown(1.5),
  'DOW-UAP-PR34': shown(30),
  'DOW-UAP-PR35': shown(3),
  'DOW-UAP-PR36': shown(50),
  // w każdym kadrze jednostka pływająca, której opis wydawcy nie wymienia
  'DOW-UAP-PR37': { at: 3, object: 'not-found' },
  'DOW-UAP-PR38': shown(16),
  'DOW-UAP-PR39': shown(3.6),
  // stopklatka z kółkiem i dopiskiem zgłaszającego „U/I SMALL THERMAL SIGNATURE”
  'DOW-UAP-PR40': shown(12),
  'DOW-UAP-PR41': shown(3),
  'DOW-UAP-PR42': shown(3),
  'DOW-UAP-PR43': shown(2.1),
  'DOW-UAP-PR44': shown(105),
  'DOW-UAP-PR45': shown(3),
  'DOW-UAP-PR46': shown(3),
  'DOW-UAP-PR47': shown(40),
  'DOW-UAP-PR48': shown(3),
  'DOW-UAP-PR49': shown(25),
};

/** 135 -> "2:15", 2.6 -> "0:02.6" */
export function stillTime(at: number): string {
  const m = Math.floor(at / 60);
  const s = at - m * 60;
  const whole = Math.floor(s);
  const frac = Math.round((s - whole) * 10);
  return `${m}:${String(whole).padStart(2, '0')}${frac ? `.${frac}` : ''}`;
}
