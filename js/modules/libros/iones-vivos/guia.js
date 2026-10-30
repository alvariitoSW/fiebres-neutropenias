// Explicación guiada por paciente: 3-5 pasos que encienden una zona del dibujo (.foco sobre #ion-svg). Injertada de A (GUIAS/guia()).
// Cada paso: t texto · ion (el que se dibuja) · z zonas · p página del PDF (E) · o origen · haz [acción, opciones] + btn (el botón «Hazlo»).
const ZONAS = { dep: [8, 24, 228, 214], fuera: [12, 42, 220, 26], dentro: [12, 72, 220, 160], ven: [250, 24, 102, 128], fig: [4, 250, 352, 190] };
export const GUIAS = {
  damian: ['Damián · desnutrido que empieza nutrición', [
    { t: 'El 98 % del K⁺ está dentro de las células; fuera queda el 2 % (todo el líquido extracelular) y el suero es solo ~0,4 %. Por eso un 3,5 no dice cuánto falta.', ion: 'k', z: ['fuera', 'dentro', 'ven'], p: 18, o: 'ficha' },
    { t: 'El punto está en la parte plana de la curva: bajar 1 mEq/L cuesta un déficit de 200-400 mEq.', ion: 'k', z: ['fig'], p: 19, o: 'ficha' },
    { t: 'Pulsa «Realimentar»: la insulina mete K⁺ en la célula, el suero baja y el total no cambia. Mira las partículas pasar.', ion: 'k', z: ['fuera', 'dentro'], p: 21, o: 'ficha (dirección); cifra ilustrativa', haz: ['real'], btn: 'Realimentar' },
    { t: 'El fosfato también cae: por debajo de 1 mg/dL es grave (sello). El salto de una dosis es ilustrativo: en el libro baja en días de nutrición parenteral (Fig. 38.2).', ion: 'p', z: ['fig', 'ven'], p: 49, o: 'ficha (dirección); tiempo ilustrativo', haz: ['real'], btn: 'Realimentar otra vez' }]],
  rufino: ['Rufino · sonda nasogástrica y furosemida', [
    { t: 'Con el K⁺ bajo, el suero ya está en la parte plana de la curva: el déficit total es de cientos de mEq.', ion: 'k', z: ['fig', 'ven'], p: 19, o: 'ficha' },
    { t: 'Pulsa «Furosemida»: el riñón pierde K⁺ y Mg²⁺; el total baja y el suero apenas lo nota.', ion: 'k', z: ['dentro', 'ven'], p: 34, o: 'ficha (dirección); cantidades ilustrativas', haz: ['furo'], btn: 'Furosemida' },
    { t: 'El Mg²⁺ del suero es el 0,3 % del total del cuerpo: puede salir normal con el depósito vacío.', ion: 'mg', z: ['dep', 'ven'], p: 32, o: 'ficha' },
    { t: 'Pulsa «Dar MgSO₄»: el suero sube rápido y se pierde la mitad por la orina (8 mEq por gramo).', ion: 'mg', z: ['ven', 'fig'], p: 37, o: 'ficha (dirección); subida ilustrativa', haz: ['mg'], btn: 'Dar MgSO₄' }]],
  valentin: ['Valentín · transfusión masiva', [
    { t: 'El Ca total de 8,4 parece casi normal: mide las tres fracciones juntas (iónico, albúmina y complejos).', ion: 'ca', z: ['fig'], p: 43, o: 'ficha' },
    { t: 'El citrato de las bolsas se pega al calcio: baja la parte iónica (la que actúa) y el total apenas se mueve.', ion: 'ca', z: ['fig', 'ven'], p: 44, o: 'ficha' },
    { t: 'Cada concentrado de 18 días trae 2-3 mEq de K⁺ y se acumula si el riñón no filtra. Añade 4 concentrados.', ion: 'k', z: ['ven', 'fig'], p: 25, o: 'ficha', haz: ['unidades', 14], btn: '+4 concentrados' },
    { t: 'Calcio IV: gluconato 9 mg/mL, bolo recomendado de 200 mg y luego 1-2 mg/kg/h. Pulsa «Dar 200 mg de calcio».', ion: 'ca', z: ['ven', 'fig'], p: 45, o: 'ficha', haz: ['ca', { mg: 200 }], btn: 'Dar 200 mg de calcio' }]],
  adela: ['Adela · enalapril + espironolactona', [
    { t: 'En el lado del exceso la curva sube más deprisa: con 100-200 mEq de más el suero sube 1 mEq/L.', ion: 'k', z: ['fig'], p: 19, o: 'ficha' },
    { t: 'Los fármacos que frenan el eje renina-angiotensina-aldosterona dejan al riñón sin eliminar potasio: es la causa habitual.', ion: 'k', z: ['dentro', 'ven'], p: 25, o: 'ficha' },
    { t: 'No hay relación previsible entre el K⁺ y el ECG: solo 40 % de los que pasan de 7 mEq/L tienen cambios.', ion: 'k', z: ['ven', 'fig'], p: 26, o: 'ficha' },
    { t: 'Pulsa «Dar 90 mg de calcio» (10 mL de gluconato al 10 % en 3 min, repetible a los 5): antagoniza la despolarización y el efecto cede en 30-60 min, así que se combina con las demás medidas. Que el K⁺ del suero no baje se deduce de la Tabla 36.3.', ion: 'k', z: ['ven'], p: 27, o: 'ficha; «el K⁺ no baja»: se deduce de la Tabla 36.3', haz: ['ca', { mg: 90 }], btn: 'Dar 90 mg de calcio' }]],
};
export const focoSvg = (zs = []) => zs.map((z) => { const [x, y, w, h] = ZONAS[z]; return `<rect class="foco" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`; }).join('');
// api: { caja, hacer(a, o), unidades(n), ponerIon(i), setFoco(zs), cita(p) }. Devuelve { abrir(preset), cerrar() }.
import { verFrase } from '../../../core/frase-vista.js';
export function crearGuia({ dock, caja, hacer, unidades, ponerIon, setFoco, cita }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; ponerIon(p.ion); setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p>
      <div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-paso="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-paso="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-paso="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
    verFrase(caja, { dock, techo: 8, margen: 6 });
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-paso]'); if (!b || !g) return; const a = b.dataset.paso, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); }
    else if (a === 'haz') { if (p.haz[0] === 'unidades') unidades(p.haz[1]); else hacer(p.haz[0], p.haz[1]); ponerIon(p.ion); setFoco(p.z); }
  });
  return { abrir: (clave, k = 0) => { if (!GUIAS[clave]) return cerrar(); g = GUIAS[clave]; paso(k); }, cerrar };
}
