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
#pul-neumo svg.nx-dib text { font-family: var(--sans); }
#pul-neumo svg.nx-dib { width: 100%; height: auto; display: block; background: var(--bg-main); border-radius: 10px; }
#pul-neumo figure { margin: 0; } #pul-neumo figure img { width: 100%; border-radius: 8px; display: block; } #pul-neumo figcaption { font: .7rem/1.35 var(--sans); color: var(--text-dim); }
#pul-raiz[data-neumo-sello] #pul-dock-panel { opacity: .45; }
`;
const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const f0 = (n) => String(Math.round(n));

let sec = null, ctx = null, activo = false;
const nx = { ptx: 0, ptx0: 0, desc: false, sitio: null, msg: '', pend: null };
const el = {};

export const ptx = () => (activo ? nx.ptx : 0);
// la parada llega cuando el corazón ya no bombea (desde N.parada; el motor da GC 0,2 L/min y PAM 18 a 13,5), no solo en el tope
export function parada() { return activo && nx.ptx >= (N.parada ?? N.tope) && !nx.desc; }
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
  el.p.textContent = f1(p); el.s.textContent = parada() ? 'sin lectura' : f0(spo2()) + ' %';
  el.pc.classList.toggle('baja', baja); el.sc.classList.toggle('baja', baja);
  el.pas.disabled = nx.desc || p >= N.tope;
  el.desc.disabled = !nx.sitio || nx.desc;
  for (const k of Object.keys(N.sitios)) { el['s_' + k].setAttribute('aria-pressed', String(nx.sitio === k)); el['s_' + k].disabled = nx.desc; }
  if (el.msg.innerHTML !== nx.msg) el.msg.innerHTML = nx.msg;
  dibujo();
}
// El aire pleural crece (t de 0 a 1 hasta el tope), el pulmón del lado afectado se retrae hacia el hilio, el mediastino se va al lado contrario y el diafragma baja
function dibujo() {
  const t = Math.min(1, nx.ptx / N.tope), rx = 38 * (1 - 0.8 * t), ry = 40 * (1 - 0.6 * t), cx = 112 + rx, cy = 50;
  const set = (k, o) => { for (const a in o) el[k].setAttribute(a, o[a]); };
  set('pulmon', { cx: cx.toFixed(1), cy, rx: rx.toFixed(1), ry: ry.toFixed(1) });
  set('medi', { cx: (100 - 16 * t).toFixed(1) }); set('trq', { x1: (100 - 12 * t).toFixed(1), x2: (100 - 12 * t).toFixed(1) });
  el.diaf.setAttribute('d', `M104 ${(92 + 10 * t).toFixed(1)} Q150 ${(78 + 10 * t).toFixed(1)} 190 ${(92 + 10 * t).toFixed(1)}`);
  el.aire.setAttribute('opacity', t > 0.04 ? '1' : '0'); el.ta.setAttribute('opacity', t > 0.04 ? '1' : '0');
  set('tl', { y: Math.min(cy + ry + 9, 96).toFixed(1), x: cx.toFixed(1) });
  el.tl.textContent = t > 0.3 ? 'pulmón colapsado' : 'pulmón';
  el.tm.textContent = t > 0.2 ? 'mediastino desplazado' : 'mediastino';
}
function sello() {
  const { tope, ultima } = ctx, par = parada(), T = activo && nx.ptx >= N.shock && !nx.desc;
  ctx.raiz.toggleAttribute('data-neumo-sello', T);
  ctx.dockPanel.inert = T;   // solo queda la descompresión: los mandos del respirador no se tocan
  if (!T) { tope.quitar('neumo-tope'); if (selloAct) { selloAct = null; ctx.frase(); } return; }
  const u = ultima(), pam = u ? f0(u.pam) : '—', gc = u ? f1(u.gc) : '—', vs = u ? f0(u.vs) : '—';   // la parada no usa estas cifras
  const S = par
    ? { titulo: 'Parada: actividad eléctrica sin pulso',
      texto: `Con ${f1(nx.ptx)} cmH₂O de aire a presión en la pleura no hay pulso: sin PAM ni gasto medibles, y la SpO₂ ya no se lee. Marino describe que el neumotórax a tensión acaba en shock obstructivo y paro por actividad eléctrica sin pulso. Solo queda la descompresión: elige el sitio y descomprime.`,
      origen: 'ficha · shock obstructivo y paro por actividad eléctrica sin pulso: cap. 28 p. 28 · las cifras: modelo ilustrativo' }
    : { titulo: 'Neumotórax a tensión: shock obstructivo',
      texto: `Con ${f1(nx.ptx)} cmH₂O de aire a presión en la pleura, la PAM cae a ${pam} mmHg, el gasto a ${gc} L/min (el volumen sistólico ${vs} mL) y la SpO₂ a ${f0(spo2())} %. El respirador no arregla esto: solo la descompresión. Elige el sitio y descomprime antes de que llegue a la parada.`,
      origen: 'ficha · neumotórax a tensión, shock obstructivo y descompresión: cap. 28 p. 28-29 · las cifras: modelo ilustrativo' };
  tope.poner('neumo-tope', { nivel: 'sello', ...S });
  if (!selloAct || selloAct.texto !== S.texto) { selloAct = S; ctx.frase(); }
}

// Una insuflación más: la presión del neumotórax crece (lo llama pagina.js al empezar cada inspiración)
export function ciclo() {
  if (activo && nx.desc && nx.ptx > 0) {   // recuperación tras descomprimir: el aire pleural baja linealmente en N.recuperacion respiraciones (ilustrativo)
    nx.ptx = Math.max(0, nx.ptx - nx.ptx0 / N.recuperacion); if (nx.ptx < 1e-6) nx.ptx = 0; aplicar(); pintar(); return;
  }
  if (!activo || nx.desc || nx.ptx >= N.tope) return;
  nx.ptx = Math.min(N.tope, nx.ptx + N.paso); aplicar(); pintar();
}
// Al poner un estado: este se activa y empieza sin aire pleural; cualquier otro lo apaga
export function estado(clave) {
  activo = clave === CLAVE; if (!sec) return;
  sec.hidden = !activo;
  nx.pend = null;
  if (activo) { nx.ptx = 0; nx.desc = false; nx.sitio = null; nx.msg = ''; aplicar(); }
  else { nx.ptx = 0; nx.msg = ''; }   // fuera del estado, las filas ocultas no guardan la presión ni la SpO₂ de la última vez
  sello(); pintar();
}
export function vigilar() { if (activo) { sello(); pintar(); } }

export function montarNeumotorax(c) {
  ctx = c; if (sec) return;
  const calc = document.getElementById('pul-corazon') || document.getElementById('pul-calc'); if (!calc) return;
  instalarCss('pul-neumo', CSS);
  sec = document.createElement('section'); sec.id = 'pul-neumo'; sec.hidden = true; sec.setAttribute('aria-label', 'El neumotórax a tensión');
  sec.innerHTML = `<h3>Neumotórax a tensión</h3>
    <svg class="nx-dib" id="pul-nx-svg" viewBox="0 0 200 124" role="img" aria-label="Tórax de frente: el aire pleural a la derecha de la imagen crece, retrae el pulmón y desplaza el mediastino">
      <path d="M12 10 H188 Q192 10 192 16 V96 Q192 104 184 104 H16 Q8 104 8 96 V16 Q8 10 12 10 Z" fill="none" stroke="var(--border-color)" stroke-width="2"/>
      <ellipse cx="56" cy="50" rx="38" ry="40" fill="var(--text-dim)" opacity=".35"/>
      <rect id="pul-nx-aire" x="106" y="12" width="84" height="90" rx="4" fill="none" stroke="var(--accent-yellow)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0"/>
      <ellipse id="pul-nx-pulmon" cx="150" cy="50" rx="38" ry="40" fill="var(--text-dim)" opacity=".35"/>
      <line id="pul-nx-trq" x1="100" y1="10" x2="100" y2="38" stroke="var(--text-main)" stroke-width="3"/>
      <ellipse id="pul-nx-medi" cx="100" cy="62" rx="14" ry="22" fill="var(--accent-red)" opacity=".6"/>
      <path id="pul-nx-diaf" d="M104 92 Q150 78 190 92" fill="none" stroke="var(--text-muted)" stroke-width="2"/>
      <text x="150" y="23" text-anchor="middle" font-size="6.5" fill="var(--accent-yellow)" id="pul-nx-ta">aire pleural</text>
      <text id="pul-nx-tl" x="150" y="96" text-anchor="middle" font-size="6.5" fill="var(--text-main)">pulmón</text>
      <text x="56" y="96" text-anchor="middle" font-size="6.5" fill="var(--text-main)">pulmón sano</text>
      <text id="pul-nx-tm" x="100" y="118" text-anchor="middle" font-size="6.5" fill="var(--text-main)">mediastino</text>
    </svg>
    <div class="nx-fila">
      <div class="nx-c" data-fila="neumo-p"><span class="t">Presión del neumotórax</span><span class="v">0</span> <span class="t">cmH₂O · ilustrativo</span></div>
      <div class="nx-c" data-fila="neumo-spo2"><span class="t">SpO₂</span><span class="v">98 %</span> <span class="t">ilustrativo</span></div>
    </div>
    <button type="button" data-nx="pasar">Dejar pasar 2 respiraciones</button>
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
  el.pulmon = q('#pul-nx-pulmon'); el.medi = q('#pul-nx-medi'); el.trq = q('#pul-nx-trq'); el.diaf = q('#pul-nx-diaf'); el.aire = q('#pul-nx-aire'); el.tl = q('#pul-nx-tl'); el.tm = q('#pul-nx-tm'); el.ta = q('#pul-nx-ta');
  el.pas = q('[data-nx="pasar"]'); el.desc = q('[data-nx="desc"]'); el.msg = q('[data-nx="msg"]');
  for (const k of Object.keys(N.sitios)) el['s_' + k] = q(`[data-sitio="${k}"]`);
  q('[data-nx="cita"]').innerHTML = ctx.cita(D.C.tension);
  sec.addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-nx]'); if (!b || b.disabled) return;
    const a = b.dataset.nx;
    if (a === 'pasar') { for (let i = 0; i < 2; i++) ciclo(); nx.pend = Math.round(nx.ptx); ctx.llenar(); }
    else if (a === 'sitio') { nx.sitio = b.dataset.sitio; nx.msg = ''; nx.pend = null; }
    else if (a === 'desc') {
      const s = N.sitios[nx.sitio]; if (!s) return;
      nx.pend = null;
      nx.msg = `<span class="${s.ok ? 'ok' : 'mal'}">${s.ok ? 'Descomprimido.' : 'No descomprime.'}</span> ${s.e}${s.ok ? ` Las constantes no vuelven de golpe: en unas ${N.recuperacion} respiraciones (ilustrativo) la presión pleural, la PAM y la SpO₂ regresan a lo normal.` : ''} ${ctx.cita(s.c)}`;
      if (s.ok) { nx.desc = true; nx.ptx0 = nx.ptx; if (matchMedia('(prefers-reduced-motion: reduce)').matches) nx.ptx = 0; aplicar(); ctx.llenar(); }   // con «reducir movimiento» el reloj no corre: se muestra el estado final
    } else if (a === 'otra') { estado(CLAVE); ctx.llenar(); return; }
    sello(); pintar();
  });
  // Una frase por pulsación, con las cifras que el monitor ya enseña (las escribe el corazón al pintar)
  document.addEventListener('pul:corazon', () => {
    const u = ctx.ultima(); if (!activo || nx.desc || nx.pend == null || !u || u.pl !== nx.pend) return;
    nx.pend = null;
    const p = f1(nx.ptx), sp = f0(spo2());
    nx.msg = parada() ? `Aire pleural ${p} cmH₂O: sin pulso (actividad eléctrica sin pulso), la SpO₂ ya no se lee. Solo queda descomprimir.`
      : nx.ptx >= N.shock ? `<span class="mal">Shock obstructivo.</span> Aire pleural ${p} cmH₂O: PAM ${f0(u.pam)}, gasto ${f1(u.gc)} L/min, SpO₂ ${sp} %. Descomprime ya.`
      : `Aire pleural ${p} cmH₂O: PAM ${f0(u.pam)}, gasto ${f1(u.gc)} L/min, SpO₂ ${sp} %.`;
    pintar();
  });
  estado(ctx.clave());
}
