// La cara y la mano del enfermo (Glasgow + pupilas de la Tabla 45.4). Funciones puras: devuelven formas SVG sin texto.
// TODO pieza común dibujarCara: copiada de js/modules/libros/visual-marino-piezas-45-53.js (caraGlasgow/PUP, que leen del DOM de la ficha).
export const PUP = { normal: [4, 4, true, 'Reactivas'], perez: [6, 4, true, 'D algo mayor, reactiva'], uni: [9, 3.5, false, 'D dilatada y fija; I reactiva'],
  dilNR: [9, 9, false, 'Dilatadas y fijas'], medNR: [5, 5, false, 'Medias y fijas'] };
// o 1-4, v 1-5 | 'T', m 1-6, pup clave de PUP, lock = locked-in (ojos abiertos, mirada vertical, boca sin voz)
export function dibujarCara({ o, v, m, pup, lock = false }) {
  const p = PUP[pup] || PUP.normal, ab = o >= 4 ? 1 : o === 3 ? 0.75 : o === 2 ? 0.45 : 0;
  const ojo = (cx, r) => ab
    ? `<ellipse cx="${cx}" cy="70" rx="17" ry="${(10 * ab).toFixed(1)}" fill="var(--bg-card)" stroke="var(--text-main)"/><circle cx="${cx}" cy="${lock ? 63 : 70}" r="${Math.min(r, 10 * ab)}" fill="var(--text-main)"/>`
    : `<path d="M${cx - 17},70 Q${cx},78 ${cx + 17},70" fill="none" stroke="var(--text-main)" stroke-width="2"/>`;
  const boca = lock || v <= 1 ? `<path d="M88,118 L132,118" stroke="var(--text-main)" stroke-width="2"/>` : `<path d="M88,116 Q110,${v >= 4 ? 128 : 121} 132,116" fill="none" stroke="var(--text-main)" stroke-width="2"/>`;
  const pu = (cx, r) => `<ellipse cx="${cx}" cy="190" rx="17" ry="10" fill="var(--bg-card)" stroke="var(--text-muted)"/><circle cx="${cx}" cy="190" r="${r}" fill="${p[2] ? 'var(--text-main)' : 'var(--accent-red)'}" ${p[2] ? '' : 'stroke="var(--text-main)" stroke-dasharray="2 2"'}/>`;
  const flechas = lock ? `<path d="M85,40 l0,-14 m-4,5 l4,-5 l4,5 M135,40 l0,-14 m-4,5 l4,-5 l4,5" fill="none" stroke="var(--accent-yellow)" stroke-width="2"/>` : '';
  return `<ellipse cx="110" cy="85" rx="62" ry="72" fill="none" stroke="var(--border-color)" stroke-width="2"/>${ojo(85, p[0])}${ojo(135, p[1])}${boca}${flechas}${pu(85, p[0])}${pu(135, p[1])}`;
}
export const textoPupila = (pup) => (PUP[pup] || PUP.normal)[3];
export const MANO = { 6: 'Obedece', 5: 'Localiza', 4: 'Retira', 3: 'Decorticación', 2: 'Descerebración', 1: 'Flácida' };
const ARM = { 6: [[20, 26], [36, 8]], 5: [[20, 26], [36, 8]], 4: [[24, 46], [40, 34]], 3: [[24, 50], [10, 22]], 2: [[30, 42], [56, 44]], 1: [[12, 54], [14, 68]] };
export const dibujarMano = (m) => { const [c, h] = ARM[m] || ARM[6]; return `<path d="M6,34 L${c[0]},${c[1] + (m === 2 ? 0 : 0)} L${h[0]},${h[1]}" fill="none" stroke="var(--text-main)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${h[0]}" cy="${h[1]}" r="4" fill="var(--text-main)"/><circle cx="6" cy="34" r="4" fill="none" stroke="var(--text-muted)"/>`; };
