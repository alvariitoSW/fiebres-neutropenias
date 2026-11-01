// Explicación guiada de Casimira: 4 pasos que señalan el dibujo (.foco). Cada paso lleva su página y su origen.
import { ZONAS } from './dibujo.js';
export const GUIA_SANO = ['Hígado sano · el camino del amonio', [
  { t: 'El amonio (NH₃) se fabrica sobre todo en el intestino: las bacterias del colon lo producen y la porta lo lleva al hígado.', z: ['colon'], p: 6, o: 'ficha' },
  { t: 'En el hepatocito, el NH₃ entra por el carril de la urea (cuatro pasos, los cuatro encendidos): con el hígado entero casi todo se procesa.', z: ['carril'], p: 6, o: 'ficha' },
  { t: 'Sale como urea a la sangre y el amonio arterial queda por debajo de 60 µmol/L; el astrocito sigue de tamaño normal.', z: ['carril', 'arterial'], p: 7, o: 'ficha (normal <60) · cifra del modelo ilustrativa' }]];
export const GUIA_EDEMA = ['Edema cerebral · el astrocito se hincha', [
  { t: 'Casi sin hepatocitos el carril de la urea está apagado (aspas rojas): el NH₃ no se procesa y pasa a la sangre arterial.', z: ['carril', 'arterial'], p: 6, o: 'ficha' },
  { t: 'El astrocito usa el amonio para hacer glutamina, que arrastra agua: se hincha (edema citotóxico). Con >150 µmol/L arteriales el riesgo de edema es alto; la TC muestra los surcos borrados (Fig. 39.2).', z: ['astro'], p: 7, o: 'ficha' },
  { t: 'Lactulosa y rifaximina no bastan en el fallo agudo: la CVVH saca el NH₃ de la sangre (las partículas pasan a su caja). Pulsa «Hazlo» y míralo.', z: ['cvvh', 'arterial'], p: 8, o: 'ficha', haz: 'cvvh', btn: 'Encender la CVVH' }]];
export const GUIA = ['Casimira · fallo hepático agudo', [
  { t: 'El amonio se fabrica sobre todo en el intestino (el músculo y el riñón, menos) y viaja por la porta hasta el hepatocito, que lo convierte en urea por el ciclo de la urea.', z: ['colon', 'carril'], p: 6, o: 'ficha' },
  { t: 'En el fallo hepático quedan pocos hepatocitos: el carril de la urea se apaga paso a paso y el NH₃ que no se procesa pasa a la sangre arterial.', z: ['carril', 'arterial'], p: 6, o: 'ficha' },
  { t: 'El amonio cruza la barrera hematoencefálica; el astrocito lo usa para hacer glutamina, que arrastra agua y lo hincha (edema citotóxico). Con más de 150 µmol/L arteriales el riesgo de edema cerebral es alto (normal <60).', z: ['astro'], p: 7, o: 'ficha' },
  { t: 'Lactulosa y rifaximina frenan la producción en el colon; en el fallo agudo la CVVH es superior y se empieza cuanto antes. Pulsa «Hazlo»: enciende la CVVH y mira bajar el amonio.', z: ['cvvh', 'colon'], p: 8, o: 'ficha', haz: 'cvvh', btn: 'Encender la CVVH' },
]];
export const focoSvg = (zs = []) => zs.map((z) => { const [x, y, w, h] = ZONAS[z]; return `<rect class="foco" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`; }).join('');
export function crearGuia({ caja, hacer, setFoco, cita }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g;
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); } else if (a === 'haz') { hacer(g[1][i].haz); setFoco(g[1][i].z); }
  });
  return { abrir: (clave) => { g = { casimira: GUIA, sano: GUIA_SANO, edema: GUIA_EDEMA }[clave]; if (!g) return cerrar(); paso(0); }, cerrar };
}
