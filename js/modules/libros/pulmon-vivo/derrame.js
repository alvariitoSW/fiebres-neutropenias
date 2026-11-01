// El derrame paraneumónico (Marino cap. 29 p. 45-46, Tabla 29.5). Panel bajo el del corazón, solo en el estado
// `derrame-paraneumonico`. Los datos del líquido (tamaño, pH, glucosa, Gram o cultivo, pus) encienden la categoría y dicen «tubo»
// o «no tubo»; con tubo, el mando de horas muestra que el derrame libre drena y el loculado deja bolsas (drenaje ineficaz).
// No toca el motor del respirador. Los botones se crean una vez y se repintan.
import { instalarCss } from '../../../core/dibujo-iso.js';
import * as D from '../../../data/pulmon-vivo-data.js';

const R = D.DERRAME, CLAVE = 'derrame-paraneumonico';
const CSS = `
#pul-derrame { display: grid; gap: 6px; background: var(--bg-card); border: 1px solid var(--card2); border-radius: 12px; padding: 8px 10px; }
#pul-derrame[hidden] { display: none; }
#pul-derrame h3 { margin: 0; font: 700 .84rem/1.3 var(--sans); color: var(--text-main); }
#pul-derrame .dr-fila { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
#pul-derrame .dr-c { border: 1px solid var(--border-color); border-radius: 10px; padding: 4px 6px; background: var(--bg-main); min-width: 0; }
#pul-derrame .dr-c .t { display: block; font: .66rem/1.2 var(--sans); color: var(--text-muted); }
#pul-derrame .dr-c .v { font: 700 1.05rem/1.2 var(--sans); color: var(--text-main); }
#pul-derrame .dr-g { display: grid; gap: 4px; }
#pul-derrame .dr-g > span { font: 600 .7rem/1.2 var(--sans); color: var(--text-muted); }
#pul-derrame .dr-g > div { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 4px; }
#pul-derrame button { min-height: 44px; border-radius: 10px; border: 1px solid var(--border-color); background: transparent; color: var(--text-main); font: 600 .74rem/1.25 var(--sans); cursor: pointer; padding: 4px 8px; text-align: left; }
#pul-derrame button[aria-pressed="true"] { border-color: var(--accent-yellow); color: var(--accent-yellow); }
#pul-derrame button:disabled { opacity: .45; cursor: default; }
#pul-derrame .dr-cat { font: 700 .86rem/1.35 var(--sans); color: var(--text-main); border: 1px solid var(--accent-yellow); border-radius: 10px; padding: 6px 8px; }
#pul-derrame .dr-cat.si { border-color: var(--accent-red); }
#pul-derrame input[type=range] { width: 100%; min-height: 44px; accent-color: var(--accent-yellow); }
#pul-derrame .dr-msg { margin: 0; font: .76rem/1.4 var(--sans); color: var(--text-dim); }
#pul-derrame .dr-msg .ok { color: var(--accent-green); font-weight: 700; } #pul-derrame .dr-msg .mal { color: var(--accent-red); font-weight: 700; }
#pul-derrame svg.dr-dib { width: 100%; height: auto; display: block; background: var(--bg-main); border-radius: 10px; }
#pul-derrame svg.dr-dib text { font-family: var(--sans); }
`;
const f0 = (n) => String(Math.round(n));
let sec = null, ctx = null, activo = false;
const dr = { tam: 'libre', ph: 'alto', glu: 'alta', gram: 'neg', pus: false, tubo: false, h: 0, segundo: false, msg: '' };
const el = {};
export const estaActivo = () => activo;

// Tabla 29.5 (p. 45). 0 = la tabla no define esa mezcla.
export function categoria(d = dr) {
  if (d.pus) return 4;
  if (d.tam === 'peq') return 1;
  const inf = (d.ph === 'bajo') + (d.glu === 'baja') + (d.gram === 'pos');
  if (d.tam === 'libre' && inf === 0) return 2;
  if (d.tam === 'locu' && inf === 3) return 3;
  return 0;
}
// fracción del líquido que queda tras las horas con tubo (ilustrativo)
export function resto(d = dr) {
  if (!d.tubo) return 1;
  const t = Math.min(1, d.h / R.aviso);
  if (d.segundo) return 0.1;
  return d.tam === 'locu' ? 1 - 0.3 * t : 1 - t * 0.95;
}
export const ineficaz = (d = dr) => d.tubo && d.tam === 'locu' && !d.segundo && d.h >= R.aviso;
const indicaTubo = (c) => c === 3 || c === 4;

function pintar() {
  if (!sec) return;
  const c = categoria(), base = R.nivelBase[c || 3] * (c === 0 ? 0.8 : 1), q = resto(), frac = base * q;
  const spo2c = c ? R.spo2[c] : 95, sp = Math.round(spo2c + (97 - spo2c) * (1 - q));
  el.liq.textContent = f0(frac * 100) + ' %'; el.sp.textContent = f0(sp) + ' %';
  const t = c === 0 ? 'La tabla no define esta mezcla de datos.' : `Categoría ${c} · ${indicaTubo(c) ? 'TUBO' : 'NO tubo'}`;
  el.cat.textContent = t; el.cat.classList.toggle('si', indicaTubo(c));
  const g = { tam: dr.tam, ph: dr.ph, glu: dr.glu, gram: dr.gram, pus: dr.pus ? 'si' : 'no' };
  for (const b of el.bots) b.setAttribute('aria-pressed', String(g[b.dataset.g] === b.dataset.v));
  const sinTam = dr.tam === 'peq';
  for (const b of el.bots) b.disabled = sinTam && ['ph', 'glu', 'gram'].includes(b.dataset.g);   // <10 mm: no se pincha (Tabla 29.5)
  el.tubo.setAttribute('aria-pressed', String(dr.tubo)); el.tubo.textContent = dr.tubo ? 'Tubo de 8,5-14 Fr puesto' : 'Poner tubo de 8,5-14 Fr';
  el.h.disabled = !dr.tubo; el.h.value = String(dr.h); el.hv.textContent = dr.h + ' h';
  el.seg.hidden = !ineficaz(); el.seg.disabled = dr.segundo;
  if (el.msg.innerHTML !== dr.msg) el.msg.innerHTML = dr.msg;
  dibujo(frac, ineficaz() ? 'bolsas' : '');
  sello();
}
// El líquido sube desde el seno; loculado = bolsas con tabiques; el tubo entra por el lado y va a un frasco con sello de agua
function dibujo(frac, bolsas) {
  const H = 78, y = 12 + H * (1 - frac);
  el.liquido.setAttribute('y', y.toFixed(1)); el.liquido.setAttribute('height', (H * frac).toFixed(1));
  const loc = dr.tam === 'locu';
  el.tab.setAttribute('opacity', loc && frac > 0.05 ? '1' : '0');
  el.pus.setAttribute('opacity', dr.pus ? '.55' : '0');
  el.tubo_.setAttribute('opacity', dr.tubo ? '1' : '0'); el.frasco.setAttribute('opacity', dr.tubo ? '1' : '0');
  const drenado = dr.tubo ? (1 - resto()) : 0;
  el.agua.setAttribute('height', (6 + 22 * drenado * (R.nivelBase[categoria() || 3])).toFixed(1));
  el.agua.setAttribute('y', (116 - (6 + 22 * drenado * R.nivelBase[categoria() || 3])).toFixed(1));
  el.tl.textContent = bolsas ? 'bolsas sin drenar' : frac > 0.05 ? 'líquido pleural' : 'sin líquido';
}
function sello() {
  const { tope } = ctx;
  if (!activo || !ineficaz()) { tope.quitar('derrame-tope'); return; }
  const fuerte = dr.h >= R.sello;
  tope.poner('derrame-tope', fuerte
    ? { nivel: 'sello', titulo: 'Drenaje ineficaz', texto: `Con ${dr.h} h de tubo, el derrame loculado sigue en bolsas: el primer tubo no alcanza. La ficha pide otro tubo, preferiblemente guiado por TC, y consulta quirúrgica (VATS) si persiste; los fibrinolíticos no se aconsejan en general. El paciente sigue con la SpO₂ baja y la infección sin drenar.`, origen: 'ficha · cap. 29 p. 46 · las horas: ilustrativo' }
    : { nivel: 'aviso', titulo: 'Posible drenaje ineficaz', texto: `A las ${dr.h} h el líquido loculado casi no ha bajado. Si no mejora, el drenaje es inadecuado: piensa en un segundo tubo.`, origen: 'ficha · cap. 29 p. 46 · las horas: ilustrativo' });
}
export function estado(clave) {
  activo = clave === CLAVE; if (!sec) return;
  sec.hidden = !activo;
  Object.assign(dr, { tam: 'libre', ph: 'alto', glu: 'alta', gram: 'neg', pus: false, tubo: false, h: 0, segundo: false, msg: '' });
  pintar();
}
const mensaje = () => {
  const c = categoria();
  dr.msg = c === 0 ? 'Libre con datos de infección, o loculado con datos incompletos: la Tabla 29.5 no define esa mezcla. Marino solo clasifica los dos extremos.'
    : c === 1 ? '<span class="ok">Categoría 1:</span> menos de 10 mm; no hace falta toracocentesis, solo vigilar.'
    : c === 2 ? '<span class="ok">Categoría 2:</span> sin infección; toracocentesis con el máximo de líquido y sin tubo.'
    : c === 3 ? '<span class="mal">Categoría 3:</span> derrame complicado; drenaje con tubo de 8,5-14 Fr.'
    : '<span class="mal">Categoría 4:</span> empiema; drenaje inmediato (el tubo fino drena igual que el de 28-36 Fr).';
  if (c) dr.msg += ' ' + ctx.cita(c === 4 ? D.C.derrameCat4 : c === 3 ? D.C.derrameCat3 : D.C.derrameTabla);
};
export function montarDerrame(c) {
  ctx = c; if (sec) return;
  const calc = document.getElementById('pul-neumo') || document.getElementById('pul-corazon') || document.getElementById('pul-calc'); if (!calc) return;
  instalarCss('pul-derrame', CSS);
  sec = document.createElement('section'); sec.id = 'pul-derrame'; sec.hidden = true; sec.setAttribute('aria-label', 'El derrame paraneumónico');
  const grupo = (id, et, g, ops) => `<div class="dr-g" id="${id}" role="group" aria-label="${et}"><span>${et}</span><div>${ops.map(([v, t]) => `<button type="button" data-g="${g}" data-v="${v}" aria-pressed="false">${t}</button>`).join('')}</div></div>`;
  sec.innerHTML = `<h3>Derrame paraneumónico</h3>
    <svg class="dr-dib" id="pul-derrame-dib" viewBox="0 0 200 124" role="img" aria-label="Hemitórax con el líquido pleural en la base, el tubo y el frasco con sello de agua">
      <path d="M12 8 H110 Q116 8 116 14 V94 Q116 100 110 100 H18 Q12 100 12 94 Z" fill="none" stroke="var(--border-color)" stroke-width="2"/>
      <ellipse cx="64" cy="48" rx="40" ry="34" fill="var(--text-dim)" opacity=".3"/>
      <rect id="pul-dr-liq" x="14" y="12" width="100" height="0" fill="var(--accent-blue)" opacity=".5"/>
      <rect id="pul-dr-pus" x="14" y="12" width="100" height="86" fill="var(--accent-yellow)" opacity="0"/>
      <g id="pul-dr-tab" opacity="0" stroke="var(--text-main)" stroke-width="1.2"><line x1="14" y1="72" x2="114" y2="66"/><line x1="52" y1="98" x2="56" y2="70"/><line x1="86" y1="98" x2="84" y2="68"/></g>
      <path id="pul-dr-tubo" d="M116 80 H132 V104 H152" fill="none" stroke="var(--text-main)" stroke-width="3" opacity="0"/>
      <g id="pul-dr-frasco" opacity="0"><path d="M152 78 H190 V118 H152 Z" fill="none" stroke="var(--text-main)" stroke-width="1.6"/>
        <rect id="pul-dr-agua" x="153.5" y="110" width="35" height="6" fill="var(--accent-blue)" opacity=".6"/>
        <text x="171" y="74" text-anchor="middle" font-size="7.5" fill="var(--text-main)">sello de agua</text></g>
      <text id="pul-dr-tl" x="64" y="116" text-anchor="middle" font-size="7.5" fill="var(--text-main)">líquido pleural</text>
      <text x="64" y="6" text-anchor="middle" font-size="7.5" fill="var(--text-muted)">pulmón</text>
    </svg>
    <div class="dr-fila">
      <div class="dr-c" data-fila="der-liq"><span class="t">Líquido pleural · ilustrativo</span><span class="v">0 %</span></div>
      <div class="dr-c" data-fila="der-spo2"><span class="t">SpO₂ · ilustrativo</span><span class="v">96 %</span></div>
    </div>
    ${grupo('pul-derrame-tam', 'Tamaño y carácter', 'tam', [['peq', '<10 mm, libre'], ['libre', '>10 mm, <50 %, libre'], ['locu', 'Loculado o >50 %']])}
    <div id="pul-derrame-liq" style="display:grid; gap:6px">
      ${grupo('pul-derrame-ph', 'pH del líquido', 'ph', [['alto', 'pH >7,20'], ['bajo', 'pH <7,20']])}
      ${grupo('pul-derrame-glu', 'Glucosa del líquido', 'glu', [['alta', '>60 mg/dL'], ['baja', '<60 mg/dL']])}
      ${grupo('pul-derrame-gram', 'Gram o cultivo', 'gram', [['neg', 'Negativos'], ['pos', 'Positivo']])}
    </div>
    ${grupo('pul-derrame-pus', 'Aspecto', 'pus', [['no', 'Seroso'], ['si', 'Pus a simple vista']])}
    <div class="dr-cat" id="pul-derrame-cat" role="status" aria-live="polite"></div>
    <button type="button" data-dr="tubo" aria-pressed="false">Poner tubo de 8,5-14 Fr</button>
    <div class="dr-g" id="pul-derrame-horas"><span>Horas con tubo · <output data-dr="hv">0 h</output> · ilustrativo</span><input type="range" min="0" max="${R.tope}" step="${R.pasoH}" value="0" aria-label="Horas con tubo" disabled></div>
    <button type="button" data-dr="seg" hidden>Segundo tubo guiado por TC</button>
    <p class="dr-msg" id="pul-derrame-msg" role="status" aria-live="polite"></p>`;
  calc.after(sec);
  const q = (s) => sec.querySelector(s);
  el.liquido = q('#pul-dr-liq'); el.pus = q('#pul-dr-pus'); el.tab = q('#pul-dr-tab'); el.tubo_ = q('#pul-dr-tubo'); el.frasco = q('#pul-dr-frasco'); el.agua = q('#pul-dr-agua'); el.tl = q('#pul-dr-tl');
  el.liq = q('[data-fila="der-liq"] .v'); el.sp = q('[data-fila="der-spo2"] .v'); el.cat = q('#pul-derrame-cat'); el.msg = q('#pul-derrame-msg');
  el.tubo = q('[data-dr="tubo"]'); el.seg = q('[data-dr="seg"]'); el.h = q('input[type=range]'); el.hv = q('[data-dr="hv"]'); el.bots = [...sec.querySelectorAll('button[data-g]')];
  sec.addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.g) {
      const v = b.dataset.v; dr[b.dataset.g] = b.dataset.g === 'pus' ? v === 'si' : v;
      if (dr.tubo && !indicaTubo(categoria())) dr.tubo = false;   // si ya no hay indicación, el tubo se quita
      if (dr.tubo === false) { dr.h = 0; dr.segundo = false; }
      mensaje();
    } else if (b.dataset.dr === 'tubo') {
      dr.tubo = !dr.tubo; dr.h = 0; dr.segundo = false;
      const c = categoria();
      dr.msg = dr.tubo ? (indicaTubo(c) ? 'Tubo puesto. Deja pasar las horas y mira si el líquido baja.' : '<span class="mal">Sin indicación:</span> en las categorías 1 y 2 la Tabla 29.5 no pide tubo. (p. 45).') : ''; if (!dr.tubo) mensaje();
    } else if (b.dataset.dr === 'seg') {
      dr.segundo = true;
      dr.msg = `<span class="ok">Segundo tubo bajo TC.</span> Drena las bolsas del loculado. Si siguiera sin bastar, consulta a cirugía para VATS (rompe las adherencias sin toracotomía). ${ctx.cita(D.C.derrameDrenaje)}`;
    }
    pintar();
  });
  el.h.addEventListener('input', () => {
    dr.h = Math.min(R.tope, +el.h.value || 0);
    dr.msg = ineficaz() ? `A las ${dr.h} h el derrame loculado sigue en bolsas: <span class="mal">drenaje ineficaz</span>. ${ctx.cita(D.C.derrameDrenaje)}`
      : dr.h > 0 ? `A las ${dr.h} h el líquido ${dr.tam === 'locu' ? 'baja poco' : 'drena'}.` : '';
    pintar();
  });
  estado(ctx.clave());
}
