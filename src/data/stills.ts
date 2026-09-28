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
  // 1:04,5: biały punkt w małym celowniku tuż pod krzyżem; znak N u góry to nakładka, nie obiekt
  'DOW-UAP-PR34': shown(64.5),
  // 0:12,5: mały punkt tuż przy krzyżu, po prawej u dołu. Biały kłębiasty kształt, który płynie
  // z chmurami, nie jest obiektem i siedzi teraz pod górnym zaczernieniem (widać jego odłamki);
  // punkt dalej w prawo to drugi punkt, którego wydawca nie wymienia
  'DOW-UAP-PR35': shown(12.5),
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
  // Wydanie 02 (paczka uap052226.zip), nagrania PR050–PR099. Plakat wydawcy to klatka z 0:03
  // (PR072: z 0:12); tam, gdzie nie pokazywał opisanego obiektu, klatkę wzięto z nagrania na nowo.
  // Obiekty mają często po kilka pikseli; znak N, narożniki, krzyż i ramki to nakładka.
  // PR077–PR092 sprawa persian-gulf-2020 łączy z raportami 482 ATKS albo omawia jako słabe pary.
  // trzy ciemne obiekty z jasnymi smugami; wydawca opisuje cztery obszary kontrastu
  'DOW-UAP-PR050': shown(3),
  // jasny obiekt w narożnikach celownika, we fragmencie przed powtórkami przesyłającego
  'DOW-UAP-PR051': shown(16),
  'DOW-UAP-PR052': shown(3),
  // ciemna podłużna smuga na prawo od samochodu; samochód to nie obiekt
  'DOW-UAP-PR053': shown(3.5),
  // klatka z części, którą wydawca opisuje jako zmienioną cyfrowo (0:00–0:45)
  'DOW-UAP-PR054': shown(3),
  // czarna kropka u góry nad krzyżem, w części oryginalnej (od 0:30); w części „zoomed in”
  // przesyłającego ta sama kula jest duża
  'DOW-UAP-PR055': shown(41),
  'DOW-UAP-PR056': shown(3),
  // Klatka z pliku DOD_111719752, który strona DVIDS 1007720 podaje jako nagranie PR057a
  // („Spherical UAP in clouds”), czyli rekordu a (dow-uap-pr057); tylko on ją pokazuje
  // (src/lib/media.ts). Rekord b („[Platform] Observes UAP in East China Sea 05 JAN 2023
  // INDOPACOM”) wskazuje tę samą stronę, a AARO pisze na niej, że PR057a to duplikat PR57b pod
  // innym tytułem; osobnego pliku b w paczce nie ma. Biała kreska na lewo od krzyża, wchodzi z lewej.
  'DOW-UAP-PR057': shown(8),
  // fragment „original clip” (od 5:49), nie wersja stabilizowana i wyostrzona przez przesyłającego:
  // biała plamka nad krzyżem; wiatrak i jasny słup u góry to nie obiekt
  'DOW-UAP-PR058': shown(420),
  // biała plama w małych narożnikach celownika w prawym górnym rogu; napis 2M to nakładka
  'DOW-UAP-PR059': shown(160),
  // mała czarna kropka przy lewym górnym narożniku ramki, widać ją dopiero po powiększeniu
  'DOW-UAP-PR060': shown(3),
  // mały biały punkt w ciemnym żlebie pod krzyżem; teren się przesuwa, punkt zostaje w kadrze
  'DOW-UAP-PR061': shown(203),
  // ciemna kula tuż na prawo od krzyża
  'DOW-UAP-PR062': shown(60),
  // mała ciemna kropka na lewo i poniżej krzyża, widać ją dopiero po powiększeniu
  'DOW-UAP-PR063': shown(12),
  // ciemna podłużna smuga pod krzyżem w prawo, przelot 0:14,6–0:14,9
  'DOW-UAP-PR064': shown(14.8),
  // mały jasny podłużny punkt na prawo od środka, widać go dopiero po powiększeniu
  'DOW-UAP-PR065': shown(3),
  // dwa kształty przesuwające się z prawej na lewo: ciemna sylwetka u góry i mały biały punkt pod
  // nią; opis wydawcy mówi o jednym obszarze kontrastu i nie mówi, o który chodzi
  'DOW-UAP-PR066': shown(12),
  // mały biały punkt u dołu kadru na lewo od środka, przelot 0:45–0:50; w pojedynczej klatce
  // podobny do błysków fal, rozpoznaje się go w ruchu. Okręt podwodny na środku to nie obiekt
  'DOW-UAP-PR067': shown(47.6),
  'DOW-UAP-PR068': shown(3),
  // ciemna kropka między pionowymi kreskami pod znacznikiem celowania
  'DOW-UAP-PR069': shown(20),
  'DOW-UAP-PR070': shown(3),
  // ciemny okrągły obiekt w ramce śledzenia na krzyżu
  'DOW-UAP-PR071': shown(17),
  // plakat wydawcy z 0:12; nagranie telefonem
  'DOW-UAP-PR072': shown(12),
  // nagranie pionowe: pierwszy obiekt w ramce na krzyżu, drugi to biała kropka w prawo w dół
  'DOW-UAP-PR073': shown(55),
  // ciemny owalny obiekt pod krzyżem w lewo
  'DOW-UAP-PR074': shown(45),
  // śledzonego obszaru kontrastu nie dało się oddzielić od chmur i smug w żadnym miejscu nagrania
  'DOW-UAP-PR075': { at: 3, object: 'not-found' },
  // mały biały punkt na lewo od krzyża; teren przesuwa się pod nim
  'DOW-UAP-PR076': shown(132),
  // 3:16,5: punkt przy krzyżu i drugi przecinający prawy górny róg, jak w opisie wydawcy
  'DOW-UAP-PR077': shown(196.5),
  // opis wydawcy powtarza opis PR077; przelotu przez prawy górny róg w 3:15–3:17 w tym pliku
  // nie ma, klatka pokazuje punkt trzymany przy krzyżu
  'DOW-UAP-PR078': shown(215),
  // mały biały punkt przy końcu prawego ramienia krzyża
  'DOW-UAP-PR079': shown(17),
  // jasny obiekt z ciemną smugą po lewej, na prawo od krzyża; wchodzi z prawego górnego rogu
  // 1:17,5–1:21,2. Mała ciemna kreska w lewo nad krzyżem to osobny punkt
  'DOW-UAP-PR080': shown(80.4),
  // blada kropka tuż pod jasnym budynkiem; widać ją dopiero po powiększeniu, a jako ruchomy punkt
  // rozpoznaje się ją w ruchu (przelot po przekątnej 1:00,8–1:02,9)
  'DOW-UAP-PR081': shown(61.5),
  // mała jasna smuga na lewo od krzyża
  'DOW-UAP-PR082': shown(28.8),
  // czarna okrągła plama na prawo od krzyża; zmienia położenie względem krzyża, więc to nie ślad
  // optyki
  'DOW-UAP-PR083': shown(75),
  // mała biała kropka nad chmurami
  'DOW-UAP-PR084': shown(26.4),
  // jasna plamka przy prawej krawędzi jest w każdej klatce: to ślad czujnika, nie obiekt
  'DOW-UAP-PR085': shown(150),
  'DOW-UAP-PR086': shown(3),
  // krótka jasna smuga pod krzyżem w prawo; cały przelot od dołu do góry trwa pół sekundy
  'DOW-UAP-PR087': shown(83.3),
  // dwa punkty naraz; ciemny kształt z 0:39–1:49 wygląda na łódź z kilwaterem
  'DOW-UAP-PR088': shown(171),
  'DOW-UAP-PR089': shown(15),
  // ląd; biała okrągła plama po lewej to śledzony obszar kontrastu
  'DOW-UAP-PR090': shown(3),
  // mała ciemna owalna plamka nad krzyżem; statek z kilwaterem z 3:08–3:10 to nie ona
  'DOW-UAP-PR091': shown(191.5),
  // punkt widać dopiero po powiększeniu; szary znak N krążący wokół krzyża to nakładka, nie obiekt
  'DOW-UAP-PR092': shown(94),
  // biały punkt z krótkim śladem pod krzyżem w prawo
  'DOW-UAP-PR093': shown(21),
  // biała plamka tuż przy prawym ramieniu krzyża, w obrazie elektrooptycznym
  'DOW-UAP-PR094': shown(230),
  // dwie jasne plamki obok siebie na prawo od znaku N
  'DOW-UAP-PR095': shown(25),
  // trzy ciemne kropki w linii na lewo i poniżej krzyża
  'DOW-UAP-PR096': shown(40),
  // dwie białe kropki obok siebie nad krzyżem
  'DOW-UAP-PR097': shown(100),
  // biała podłużna plamka tuż nad prawym ramieniem krzyża
  'DOW-UAP-PR098': shown(61),
  // mała biała kropka tuż pod prawym ramieniem krzyża
  'DOW-UAP-PR099': shown(84),
  // Rekonstrukcje, które FBI przygotowało dla wydawcy z relacji świadka 3 (western-us-2023):
  // ilustracja relacji, nie zapis zjawiska. „Shown” znaczy tu, że widać to, co opisuje relacja.
  // 0:35: pomarańczowa kula i trzy czerwone kule w linii tuż po wyrzuceniu
  'FBI-UAP-PR005': shown(35),
  // plakat wydawcy, około 0:03: trzy z czterech czerwonych świateł, czwarte wchodzi chwilę później
  'FBI-UAP-PR006': shown(3),
};

/** 135 -> "2:15", 2.6 -> "0:02.6" (po polsku "0:02,6") */
export function stillTime(at: number, lang: 'en' | 'pl' = 'en'): string {
  const m = Math.floor(at / 60);
  const s = at - m * 60;
  const whole = Math.floor(s);
  const frac = Math.round((s - whole) * 10);
  return `${m}:${String(whole).padStart(2, '0')}${frac ? `${lang === 'pl' ? ',' : '.'}${frac}` : ''}`;
}
