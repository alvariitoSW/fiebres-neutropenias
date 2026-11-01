// «Explícame este estado»: 3-5 pasos que encienden una zona del dibujo. Cada paso lleva su página y su origen.
export const GUIAS = {
  segismundo: ['Segismundo · hematoma con sangre ventricular', [
    { t: 'El cráneo no se estira: cerebro, sangre y LCR comparten una caja rígida. La masa ocupa sitio y los demás se encogen.', z: ['craneo'], p: 14, o: 'ficha (la PIC sube hasta detener el flujo); forma ilustrativa' },
    { t: 'Al principio sale LCR y se vacían los senos venosos: la PIC apenas sube (parte plana de la curva). Aquí ya está en la parte vertical: PIC 30.', z: ['curva'], p: 45, o: 'ficha: PIC <20; la forma de la curva, ilustrativa' },
    { t: 'La PPC es PAM − PIC = 95 − 30 = 65: dentro del 50-70, con la PIC por encima de 20 (aviso «drenar LCR»).', z: ['craneo'], p: 45, o: 'ficha' },
    { t: 'Pulsa «Drenar LCR»: sale líquido, el punto baja por la curva y la PIC cede. Mira el ventrículo encogerse.', z: ['craneo', 'curva'], p: 45, o: 'ficha (drenar); magnitud ilustrativa', haz: ['dren', 1], btn: 'Drenar LCR' }]],
  abundio: ['Abundio · hematoma subdural tras un TCE', [
    { t: 'El hematoma es una masa sólida que empuja cerebro, LCR y sangre venosa; el cerebro de ese lado se aplasta.', z: ['craneo'], p: 14, o: 'ficha (PIC sube hasta detener el flujo); forma ilustrativa' },
    { t: 'Pupila: una dilatada y fija = masa en expansión (herniación uncal). Se cuenta con las pupilas, este corte no ve el uncus.', z: ['pupilas'], p: 10, o: 'ficha (Tabla 45.4)' },
    { t: 'Pulsa «Masa +10» hasta el tope: la PIC iguala a la PAM, la PPC es 0 y el sello dice que el flujo se ha detenido.', z: ['curva', 'pupilas'], p: 14, o: 'ficha; cifras ilustrativas', haz: ['masa', 30], btn: 'Masa +30' }]],
  clotilde: ['Clotilde · infarto con edema', [
    { t: 'El edema del infarto es citotóxico (necrosis) y vasogénico (barrera): es una masa difusa, dibujada punteada.', z: ['craneo'], p: 40, o: 'ficha' },
    { t: 'El hipertónico en bolos saca agua del edema; el objetivo de Na⁺ es 145-155. Pulsa «Hipertónico».', z: ['craneo', 'curva'], p: 41, o: 'ficha (objetivo); efecto ilustrativo', haz: ['hiper'], btn: 'Hipertónico' },
    { t: 'Con Na⁺ 158 se pasa del objetivo: sello y mando apagado. En el ictus no se monitoriza la PIC; aquí es la caja de ejemplo.', z: ['craneo'], p: 40, o: 'ficha' }]],
};
export function crearGuia({ caja, hacer, setFoco, cita }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); } else if (a === 'haz') { hacer(p.haz[0], p.haz[1]); setFoco(p.z); }
  });
  return { abrir: (c) => { if (!GUIAS[c]) return cerrar(); g = GUIAS[c]; paso(0); }, cerrar };
}
