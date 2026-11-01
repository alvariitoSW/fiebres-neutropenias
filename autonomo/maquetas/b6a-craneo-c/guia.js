// Explicación guiada por paciente: 3-5 pasos que encienden una zona del dibujo (.foco). Cada paso: t texto · z zonas · p página · o origen · haz [acción, opciones].
export const GUIAS = {
  herme: ['Hermenegildo · tPA', [
    { t: 'La arteria trae la PAM; la PIC (la mano gris) la aprieta; lo que queda, PPC = PAM − PIC, empuja la sangre por el hemisferio.', z: ['art', 'mano'], p: '45', o: 'ficha' },
    { t: 'En el ictus la autorregulación está alterada: el flujo de la penumbra depende de la presión. El gráfico lo dibuja como una recta; la meseta del cerebro sano es ilustrativa.', z: ['graf', 'pen'], p: '36', o: 'ficha; meseta ilustrativa, otra fuente pendiente' },
    { t: 'Tras la trombólisis la PA debe ser <180/105 durante 24 h (hemorragia 6,4-8,8 % si no). Pulsa «Hazlo»: un bolo de labetalol.', z: ['art'], p: '36', o: 'ficha', haz: ['baja'], btn: 'Bajar PA' },
    { t: 'Pero cada punto que bajas quita flujo a la penumbra, de fuera hacia dentro. Baja tres veces más y mira los anillos.', z: ['pen', 'graf'], p: '36', o: 'ficha (dirección); caída ilustrativa', haz: ['baja', 3], btn: 'Bajar PA ×3' },
    { t: 'El oxígeno al 100 % encoge los vasos cerebrales: el flujo cae 15-30 %. Con SaO₂ >94 % hay peor resultado y el autor prefiere 90-92 %.', z: ['hem', 'dtc'], p: '34', o: 'ficha', haz: ['fio', { v: 60 }], btn: 'O₂ al 60 %' }]],
  petro: ['Petronila · HSA', [
    { t: 'Día 0: PAS ≤140 hasta cerrar el aneurisma y nimodipino oral 60 mg cada 4 h durante 3 semanas (no IV: hipotensión). Aquí la presión sigue siendo la PPC.', z: ['art'], p: '47:mn-hsa-inmediato', o: 'ficha' },
    { t: 'Entre los días 4 y 14 aparece la isquemia diferida por vasoespasmo. Pulsa «Hazlo»: día 8.', z: ['dtc', 'pen'], p: '48', o: 'ficha', haz: ['dia', { v: 8 }], btn: 'Día 8' },
    { t: 'El Doppler transcraneal mide la velocidad de la cerebral media: sube con el vasoespasmo y la GCS cae 2 puntos. Las velocidades son ilustrativas.', z: ['dtc'], p: '48', o: 'ficha; velocidades ilustrativas' },
    { t: 'La PIC se mantiene <20 con drenajes. Pulsa «Hazlo»: la PIC sube y sale el aviso.', z: ['mano'], p: '48', o: 'ficha; magnitud ilustrativa', haz: ['picx', null], btn: 'PIC +15' }]],
};
export function crearGuia({ caja, hacer, cita, setFoco }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); }
    else if (a === 'haz') { const [acc, op] = p.haz; if (typeof op === 'number') for (let n = 0; n < op; n++) hacer(acc); else hacer(acc, op || {}); setFoco(p.z); }
  });
  return { abrir: (clave) => { if (!GUIAS[clave]) return cerrar(); g = GUIAS[clave]; paso(0); }, cerrar };
}
