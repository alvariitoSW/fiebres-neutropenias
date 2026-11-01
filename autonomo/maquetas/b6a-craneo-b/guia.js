// Explicación guiada de 3-5 pasos que señalan el dibujo (.foco sobre #cr-svg).
import { GUIAS } from './datos.js';
import { ZONAS } from './corte.js';
export const focoSvg = (zs = []) => zs.map((z) => { const [x, y, w, h] = ZONAS[z]; return `<rect class="foco" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`; }).join('');
export function crearGuia({ caja, hacer, setFoco, cita }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${p.url ? cita(p.p, p.f).replace(/href="[^"]*"/, `href="${p.url}"`).replace(/PDF p\. \d+/, p.uw) : cita(p.p, p.f)}</p>
      <div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); } else if (a === 'haz') { hacer(...p.haz); setFoco(p.z); }
  });
  return { abrir: (c) => { if (!GUIAS[c]) return cerrar(); g = GUIAS[c]; paso(0); }, cerrar };
}
