// El neumotórax a tensión en el ventilado (E4b; par 9 de papel-pulmon.md §6). Panel bajo el del corazón, solo en el estado
// `neumotorax-tension`. La presión del neumotórax (ilustrativo) crece 1,5 cmH₂O en cada insuflación: endurece el sistema (la
// compliance efectiva baja, así pico y meseta suben juntos: deducción de la Ec. 27.1-27.3, Marino no lo dice) y se suma a la
// presión torácica que recibe el motor del corazón (corazon.js, `pTorax`; no hay corazón propio). En el tope sale el sello y
// solo queda la descompresión. Los botones se crean una vez y se repintan.
import { instalarCss } from '../../../core/dibujo-iso.js';
import * as D from '../../../data/pulmon-vivo-data.js';

const N = D.NEUMOTORAX, CLAVE = 'neumotorax-tension';
const CSS = `
#pul-neumo { display: grid; gap: 6px; background: var(--bg-card); border: 1px solid var(--card2); border-radius: 12px; padding: 8px 10px; }
#pul-neumo[hidden] { display: none; }
#pul-neumo h3 { margin: 0; font: 700 .84rem/1.3 var(--sans); color: var(--text-main); }
#pul-neumo .nx-fila { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
#pul-neumo .nx-c { border: 1px solid var(--border-color); border-radius: 10px; padding: 4px 6px; background: var(--bg-main); min-width: 0; }
#pul-neumo .nx-c .t { display: block; font: .66rem/1.2 var(--sans); color: var(--text-muted); }
#pul-neumo .nx-c .v { font: 700 1.05rem/1.2 var(--sans); color: var(--text-main); }
#pul-neumo .nx-c.baja .v { color: var(--accent-red); }
#pul-neumo button { min-height: 44px; border-radius: 10px; border: 1px solid var(--border-color); background: transparent; color: var(--text-main); font: 600 .74rem/1.25 var(--sans); cursor: pointer; padding: 4px 8px; text-align: left; }
#pul-neumo button[aria-pressed="true"] { border-color: var(--accent-yellow); color: var(--accent-yellow); }
#pul-neumo button:disabled { opacity: .45; cursor: default; }
#pul-neumo .nx-act { color: var(--accent-yellow); }
#pul-neumo .nx-msg { margin: 0; font: .76rem/1.4 var(--sans); color: var(--text-dim); }
#pul-neumo .nx-msg .ok { color: var(--accent-green); font-weight: 700; }
#pul-neumo .nx-msg .mal { color: var(--accent-red); font-weight: 700; }
#pul-neumo figure { margin: 0; } #pul-neumo figure img { width: 100%; border-radius: 8px; display: block; } #pul-neumo figcaption { font: .7rem/1.35 var(--sans); color: var(--text-dim); }
#pul-raiz[data-neumo-sello] #pul-dock-panel { opacity: .45; }
`;
const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const f0 = (n) => String(Math.round(n));

let sec = null, ctx = null, activo = false;
const nx = { ptx: 0, desc: false, sitio: null, msg: '' };
const el = {};

export const ptx = () => (activo ? nx.ptx : 0);
export const spo2 = () => Math.round(N.spo2Base - N.spo2PorCmH2O * ptx());
export const estaActivo = () => activo;
let selloAct = null;
export const selloFrase = () => selloAct;   // la frase viva dice lo que le pasa al paciente (pagina.js la pinta)

// compliance efectiva: la meseta sube en la presión del neumotórax a igual Vt (Pel = Vt/C + Ptx)
function aplicar() {
  const { P } = ctx, E = D.ESTADOS[CLAVE], vt = P.S.resp.vt || 500;
  P.pulmonAjustar({ c: nx.ptx > 0 ? vt / (vt / E.pulmon.c + nx.ptx) : E.pulmon.c });
}
function pintar() {
  if (!sec) return;
  const p = nx.ptx, baja = p > 0;
  el.p.textContent = f1(p); el.s.textContent = f0(spo2()) + ' %';
  el.pc.classList.toggle('baja', baja); el.sc.classList.toggle('baja', baja);
  el.pas.disabled = nx.desc || p >= N.tope;
  el.desc.disabled = !nx.sitio || nx.desc;
  for (const k of Object.keys(N.sitios)) { el['s_' + k].setAttribute('aria-pressed', String(nx.sitio === k)); el['s_' + k].disabled = nx.desc; }
  if (el.msg.innerHTML !== nx.msg) el.msg.innerHTML = nx.msg;
}
function sello() {
  const { tope, ultima } = ctx, T = nx.ptx >= N.tope && !nx.desc;
  ctx.raiz.toggleAttribute('data-neumo-sello', T);
  ctx.dockPanel.inert = T;   // solo queda la descompresión: los mandos del respirador no se tocan
  if (!T) { tope.quitar('neumo-tope'); if (selloAct) { selloAct = null; ctx.frase(); } return; }
  const u = ultima(), S = { titulo: 'Neumotórax a tensión: gasto en caída',
    texto: `Con ${f1(nx.ptx)} cmH₂O de aire a presión en la pleura, la PAM es ${u ? f0(u.pam) : '—'} mmHg, el gasto ${u ? f1(u.gc) : '—'} L/min (el volumen sistólico ${u ? f0(u.vs) : '—'} mL) y la SpO₂ ${f0(spo2())} %. El respirador no arregla esto: solo la descompresión. Elige el sitio y descomprime.`,
    origen: 'ficha · neumotórax a tensión y descompresión: cap. 28 p. 28-29 · las cifras: modelo ilustrativo' };
  tope.poner('neumo-tope', { nivel: 'sello', ...S });
  if (!selloAct || selloAct.texto !== S.texto) { selloAct = S; ctx.frase(); }
}

// Una insuflación más: la presión del neumotórax crece (lo llama pagina.js al empezar cada inspiración)
export function ciclo() {
  if (!activo || nx.desc || nx.ptx >= N.tope) return;
  nx.ptx = Math.min(N.tope, nx.ptx + N.paso); aplicar(); pintar();
}
// Al poner un estado: este se activa y empieza sin aire pleural; cualquier otro lo apaga
export function estado(clave) {
  activo = clave === CLAVE; if (!sec) return;
  sec.hidden = !activo;
  if (activo) { nx.ptx = 0; nx.desc = false; nx.sitio = null; nx.msg = ''; aplicar(); }
  sello(); pintar();
}
export function vigilar() { if (activo) { sello(); pintar(); } }

export function montarNeumotorax(c) {
  ctx = c; if (sec) return;
  const calc = document.getElementById('pul-corazon') || document.getElementById('pul-calc'); if (!calc) return;
  instalarCss('pul-neumo', CSS);
  sec = document.createElement('section'); sec.id = 'pul-neumo'; sec.hidden = true; sec.setAttribute('aria-label', 'El neumotórax a tensión');
  sec.innerHTML = `<h3>Neumotórax a tensión</h3>
    <div class="nx-fila">
      <div class="nx-c" data-fila="neumo-p"><span class="t">Presión del neumotórax</span><span class="v">0</span> <span class="t">cmH₂O · ilustrativo</span></div>
      <div class="nx-c" data-fila="neumo-spo2"><span class="t">SpO₂</span><span class="v">98 %</span> <span class="t">ilustrativo</span></div>
    </div>
    <button type="button" data-nx="pasar">Dejar pasar 5 respiraciones</button>
    <div id="pul-neumo-sitios" style="display:grid; gap:4px" role="group" aria-label="Sitio de la descompresión">
      ${Object.values(N.sitios).map((s) => `<button type="button" data-nx="sitio" data-sitio="${s.k}" aria-pressed="false">${s.et}</button>`).join('')}
    </div>
    <button type="button" class="nx-act" data-nx="desc" disabled>Descomprimir con aguja</button>
    <p class="nx-msg" role="status" aria-live="polite" data-nx="msg"></p>
    <details class="plegable" id="pul-neumo-fig"><summary>La radiografía del neumotórax a tensión (Fig. 28.7)</summary>
      <figure><img loading="lazy" src="${N.figura}" alt="Radiografía portátil de un neumotórax a tensión: sin marcas pulmonares en el hemitórax izquierdo, hemidiafragma deprimido y mediastino desplazado al lado contrario"><figcaption>Fig. 28.7 de Marino. Sin marcas pulmonares a la izquierda, hemidiafragma izquierdo deprimido y mediastino desplazado a la derecha.</figcaption></figure>
      <span data-nx="cita"></span></details>
    <button type="button" data-nx="otra">Empezar otra vez</button>`;
  calc.after(sec);
  const q = (s) => sec.querySelector(s);
  el.pc = q('[data-fila="neumo-p"]'); el.p = el.pc.querySelector('.v'); el.sc = q('[data-fila="neumo-spo2"]'); el.s = el.sc.querySelector('.v');
  el.pas = q('[data-nx="pasar"]'); el.desc = q('[data-nx="desc"]'); el.msg = q('[data-nx="msg"]');
  for (const k of Object.keys(N.sitios)) el['s_' + k] = q(`[data-sitio="${k}"]`);
  q('[data-nx="cita"]').innerHTML = ctx.cita(D.C.tension);
  sec.addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-nx]'); if (!b || b.disabled) return;
    const a = b.dataset.nx;
    if (a === 'pasar') { for (let i = 0; i < 5; i++) ciclo(); ctx.llenar(); }
    else if (a === 'sitio') { nx.sitio = b.dataset.sitio; nx.msg = ''; }
    else if (a === 'desc') {
      const s = N.sitios[nx.sitio]; if (!s) return;
      nx.msg = `<span class="${s.ok ? 'ok' : 'mal'}">${s.ok ? 'Descomprimido.' : 'No descomprime.'}</span> ${s.e} ${ctx.cita(s.c)}`;
      if (s.ok) { nx.desc = true; nx.ptx = 0; aplicar(); ctx.llenar(); }
    } else if (a === 'otra') { estado(CLAVE); ctx.llenar(); return; }
    sello(); pintar();
  });
  estado(ctx.clave());
}
