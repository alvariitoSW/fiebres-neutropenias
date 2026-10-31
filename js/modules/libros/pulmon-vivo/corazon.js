// El corazón con la presión del pulmón (E3-enganche; par 7 de papel-pulmon.md §6). Panel bajo la pantalla del respirador:
// la presión media de la vía aérea del pulmón (lectura L.pMedia de pulmon.mjs) se escribe como presión torácica en el motor
// del corazón del shock vivo (eco/motor.mjs vía shock-vivo/soporte.mjs; no se copia) y el panel enseña VS, GC y PAM.
// Lo monta index.js al arrancar. Solo se ve en los estados que llevan `corazon` (cpap-eap, vpp-corazon-normal).
// Lee la página por los eventos `pul:estado` y `pul:lectura` de #pul-raiz (su `detail` trae la lectura). Los botones y las cifras se crean una vez y se repintan.
import { instalarCss } from '../../../core/dibujo-iso.js';
import * as D from '../../../data/pulmon-vivo-data.js';
import * as NX from './neumotorax.js';

const CSS = `
#pul-corazon { display: grid; gap: 6px; background: var(--bg-card); border: 1px solid var(--card2); border-radius: 12px; padding: 8px 10px; }
#pul-corazon[hidden] { display: none; }
#pul-corazon h3 { margin: 0; font: 700 .84rem/1.3 var(--sans); color: var(--text-main); }
#pul-corazon .cor-pm { margin: 0; font: .78rem/1.4 var(--sans); color: var(--text-dim); }
#pul-corazon .cor-fila { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }
#pul-corazon .cor-c { border: 1px solid var(--border-color); border-radius: 10px; padding: 4px 6px; background: var(--bg-main); min-width: 0; }
#pul-corazon .cor-c .t { display: block; font: .66rem/1.2 var(--sans); color: var(--text-muted); }
#pul-corazon .cor-c .v { font: 700 1.05rem/1.2 var(--sans); color: var(--text-main); }
#pul-corazon .cor-c .u { font: .66rem/1.2 var(--sans); color: var(--text-muted); margin-left: 2px; }
#pul-corazon .cor-c .sub { display: block; font: .66rem/1.25 var(--sans); color: var(--text-dim); }
#pul-corazon .cor-c.sube .sub { color: var(--accent-green); }
#pul-corazon .cor-c.baja .sub { color: var(--accent-red); }
#pul-corazon .cor-nota { margin: 0; font: .72rem/1.4 var(--sans); color: var(--text-dim); }
#pul-corazon .cor-ir { min-height: 44px; border-radius: 10px; border: 1px solid var(--border-color); background: transparent; color: var(--accent-yellow); font: 600 .72rem/1.2 var(--sans); cursor: pointer; padding: 2px 8px; text-align: left; }
`;
const ORIGEN = 'ilustrativo · motor del corazón del shock vivo';
const LIMITE = 'Bradley 1992 (PMID 1736745): con CPAP 5, +22 % del VS indexado con PCP ≥12; con PCP <12 el gasto bajó (IC 3,14→2,89). El modelo da el sentido y el orden de magnitud (CPAP 5: +8,5 % en este corazón, por debajo del +22 % de Bradley; de 5 a 10 ya no sube más, porque el alivio se aplana con la presión; tope 10, como en el shock vivo). La retirada simpática, el menor trabajo respiratorio y la apertura de los alvéolos no están en el modelo.';
const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const f0 = (n) => String(Math.round(n));
const pct = (a, b) => { const d = Math.round(100 * (a / b - 1)); return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + ' %'; };

let desconectar = () => {};
let ultimo = null, qUlt = null, pendiente = 0, sec = null, S = null, cargando = null, clave = '', pedido = '', tope10 = false;
const motores = new Map();   // tipo → { cab, res: Map(presión entera → lectura) }
const celdas = {};

export function montarCorazon() {
  const calc = document.getElementById('pul-calc'); if (!calc || sec) return;
  instalarCss('pul-corazon', CSS);
  sec = document.createElement('section'); sec.id = 'pul-corazon'; sec.hidden = true; sec.setAttribute('aria-label', 'El corazón con la presión del pulmón');
  sec.innerHTML = `<h3 id="pul-cor-tit">El corazón con esta presión</h3>
    <p class="cor-pm" data-fila="cor-pm">Presión media de la vía aérea → pleura: <b class="v">—</b> cmH₂O <span class="org ilu">${ORIGEN}</span></p>
    <div class="cor-fila">
      <div class="cor-c" data-fila="cor-vs"><span class="t">Volumen sistólico</span><span class="v">—</span><span class="u">mL</span><span class="sub"></span></div>
      <div class="cor-c" data-fila="cor-gc"><span class="t">Gasto cardíaco</span><span class="v">—</span><span class="u">L/min</span><span class="sub"></span></div>
      <div class="cor-c" data-fila="cor-pam"><span class="t">PAM</span><span class="v">—</span><span class="u">mmHg</span><span class="sub"></span></div>
    </div>
    <details class="plegable" id="pul-cor-limite"><summary>Límites del modelo y de la CPAP</summary><p class="cor-nota">${LIMITE}</p></details>
    <button type="button" class="cor-ir" data-especialidad="libros" data-view="shockVivo" data-shock-vivo="ic-cpap">Ver en el shock vivo →</button>`;
  calc.after(sec);
  for (const k of ['vs', 'gc', 'pam']) { const e = sec.querySelector(`[data-fila="cor-${k}"]`); celdas[k] = { e, v: e.querySelector('.v'), sub: e.querySelector('.sub') }; }
  celdas.pm = sec.querySelector('[data-fila="cor-pm"] .v');
  // Se entera por los eventos de pagina.js (`pul:estado`, `pul:lectura`), no por sondeo; agrupa los avisos (150 ms)
  const raiz = document.getElementById('pul-raiz');
  const aviso = (ev) => { qUlt = ev.detail; if (!pendiente) pendiente = setTimeout(() => { pendiente = 0; vigilar(); }, 150); };
  raiz?.addEventListener('pul:estado', aviso); raiz?.addEventListener('pul:lectura', aviso);
  raiz?.dispatchEvent(new CustomEvent('pul:pedir'));   // pagina.js contesta con `pul:estado`
  desconectar = () => { raiz?.removeEventListener('pul:estado', aviso); raiz?.removeEventListener('pul:lectura', aviso); clearTimeout(pendiente); pendiente = 0; };
}

function receta(tipo) { return tipo === 'ic' ? { ...S.RECETA_IC, g: 1 } : { esc: 'normal', hb: 14 }; }
function leer(c) { const L = c.lectura, u = L.u; return { vs: u.vs, gc: L.gcTotal, pam: u.pam }; }
// Lectura del corazón con esa presión en la pleura (cmH₂O enteros); la de 0 es la del motor recién asentado
// x = presión media de la vía aérea (entra como CPAP: fPleura y kAbdomen); pl = aire a presión en la pleura (neumotórax; entra
// directa, sin fPleura ni kAbdomen: el aire pleural no infla el pulmón ni empuja las venas del abdomen)
function corazon(tipo, x, pl = 0) {
  let m = motores.get(tipo);
  const k = x + ':' + pl;
  if (!m) { const cab = S.crearCabecera(receta(tipo)); m = { cab, res: new Map([['0:0', leer(cab)]]) }; motores.set(tipo, m); }
  if (!m.res.has(k)) { m.cab.ajustar({ cpap: x, pleura: pl }); m.cab.correr(30); m.res.set(k, leer(m.cab)); }
  return m.res.get(k);
}

function pintar(tipo, x, nombre, pl = 0) {
  const a = corazon(tipo, 0), b = corazon(tipo, x, pl);
  celdas.pm.textContent = f0(x + pl);
  sec.dataset.presion = String(x);   // la prueba espera a que el panel llegue a esta presión
  for (const [k, f] of [['vs', f0], ['gc', f1], ['pam', f0]]) {
    const c = celdas[k], d = b[k] / a[k] - 1;
    const u = c.e.querySelector('.u'); if (u) u.hidden = NX.parada();
    if (NX.parada()) { c.v.textContent = 'sin pulso'; c.sub.textContent = 'parada: actividad eléctrica sin pulso'; c.e.classList.remove('sube'); c.e.classList.add('baja'); continue; }
    c.v.textContent = f(b[k]);
    c.sub.textContent = x === 0 ? 'sin presión positiva' : `sin presión: ${f(a[k])} (${pct(b[k], a[k])})`;
    c.e.classList.toggle('sube', d > 0.005); c.e.classList.toggle('baja', d < -0.005);
  }
  ultimo = b;
  document.getElementById('pul-cor-tit').textContent = `El corazón de ${nombre} con esta presión`;
  return b;
}

function vigilar() {
  const q = qUlt; if (!q || !sec) return;
  const E = D.ESTADOS[q.est.clave], visible = document.getElementById('pul-raiz').offsetParent !== null;
  if (!E?.corazon || !visible) { if (!sec.hidden) sec.hidden = true; return; }
  if (q.est.clave !== clave) { clave = q.est.clave; pedido = ''; tope10 = false; q.tope.quitar('cpap-tope'); }
  const pm = q.L?.pMedia; if (pm == null || !isFinite(pm)) return;
  sec.hidden = false;
  // El tope de la CPAP (10): el mando vuelve a 10 y sale el sello con las constantes de ese paciente (REGLAS §1.14)
  const T = E.corazon.tope, peep = q.P.S.resp.peep;
  if (T && peep > T) {
    const i = document.querySelector('#pul-dock-panel input[data-m="peep"]');
    if (i) { i.value = T; i.dispatchEvent(new Event('input', { bubbles: true })); }
    tope10 = true;
    const b = S ? corazon(E.corazon.tipo, T) : null;
    q.tope.poner('cpap-tope', { nivel: 'sello', titulo: 'CPAP por encima de 10',
      texto: `CPAP ${peep}: Marino da 5-10 para la CPAP y, en la ventilación no invasiva con dos niveles, desaconseja presiones mayores (mal toleradas, fugas por la mascarilla); aquí se aplica el mismo límite por analogía. El mando vuelve a ${T}${b ? `: VS ${f0(b.vs)} mL, GC ${f1(b.gc)} L/min, PAM ${f0(b.pam)}` : ''}.`,
      origen: 'ficha · resp. p. 77 (5-10 para la CPAP; el tope, por analogía) · las cifras: modelo ilustrativo' });
    return;
  }
  if (tope10 && peep < T) { tope10 = false; q.tope.quitar('cpap-tope'); }
  const x = Math.round(pm), pl = E.corazon.neumo ? Math.round(NX.ptx()) : 0, firma = clave + ':' + x + ':' + pl + (NX.parada() ? ':p' : '');
  if (firma === pedido) return;
  pedido = firma;
  const hacer = () => { if (pedido !== firma) return; pintar(E.corazon.tipo, x, q.est.pac.nombre, pl); };
  if (S) { setTimeout(hacer, 0); return; }
  celdas.vs.v.textContent = '…';
  cargando = cargando || import('../shock-vivo/soporte.mjs').then((m) => { S = m; });
  cargando.then(() => setTimeout(hacer, 0));
}

// Para las pruebas: las cifras del panel tal como están en pantalla
export function parar() { desconectar(); }

// Para el neumotórax: la última lectura del corazón (VS, GC, PAM)
window.__pulCorazon = () => ultimo;
