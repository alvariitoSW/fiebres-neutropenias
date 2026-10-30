// Maqueta C «Lee esta placa generada». Usa la pieza común y radio-rx/caso.js. Nada se guarda: ni localStorage ni cookies.
// Los botones (opciones, frases del informe, siguiente) se crean una vez y se repintan en su sitio.
import { pintarRx, describir } from './escena.js';
import { generar, preguntas, informe, LETRAS } from './caso.js';

const $ = (id) => document.getElementById(id);
let p, qs, inf, paso, aciertos, respondidas, marcadas, zonaOk;
const N = () => qs.length; // 6 o 7 preguntas: C2 solo si hay vía; D2 es la de las cúpulas

// Indicador A-E · Error · Resumen
const pasos = {};
for (const x of [...LETRAS.map(l => l.id), 'Error', 'Resumen']) { const s = document.createElement('span'); s.textContent = x; $('rx-pasos').append(s); pasos[x] = s; }
const ops = [];
for (let i = 0; i < 4; i++) { const b = document.createElement('button'); b.type = 'button'; b.id = `rx-op-${i}`; b.addEventListener('click', () => responder(i)); $('rx-opciones').append(b); ops.push(b); }
const infs = [];
for (let i = 0; i < 7; i++) { const b = document.createElement('button'); b.type = 'button'; b.id = `rx-inf-${i}`; b.addEventListener('click', () => { if (!$('rx-comprobar').hidden) { marcadas[i] = !marcadas[i]; pintarInforme(); } }); $('rx-informe').append(b); infs.push(b); }

// Zonas de la placa: se toca primero la zona de la letra (dedo o botón equivalente) y luego se elige el hallazgo.
const ZONAS = {
  traquea: { nombre: 'tráquea y tubo', letra: 'A', r: [[168, 0, 54, 125]], punto: [195, 60] },
  pulmones: { nombre: 'campos pulmonares', letra: 'B', r: [[62, 78, 116, 150], [212, 78, 116, 150]], punto: [120, 150] },
  mediastino: { nombre: 'mediastino', letra: 'C', r: [[150, 125, 90, 103]], punto: [195, 175] },
  diafragmas: { nombre: 'diafragmas y abdomen alto', letra: 'D', r: [[40, 228, 310, 100]], punto: [195, 280] },
  huesos: { nombre: 'huesos y partes blandas', letra: 'E', r: [[10, 70, 52, 260], [328, 70, 52, 260], [62, 38, 106, 40], [222, 38, 106, 40]], punto: [30, 200] },
};
const ZONA_DE = { A: 'traquea', B: 'pulmones', C: 'mediastino', D: 'diafragmas', E: 'huesos' };
const NS = 'http://www.w3.org/2000/svg', zonaRects = {}, zonaBtns = {};
const placa = $('rx-placa'), envol = document.createElement('div'), cap = document.createElementNS(NS, 'svg');
envol.style.position = 'relative'; placa.before(envol); envol.append(placa);
cap.setAttribute('viewBox', '0 0 390 330'); cap.setAttribute('aria-hidden', 'true'); cap.id = 'rx-zonas-placa';
cap.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:manipulation';
for (const [z, v] of Object.entries(ZONAS)) {
  zonaRects[z] = v.r.map(([x, y, w, h]) => { const e = document.createElementNS(NS, 'rect');
    e.setAttribute('x', x); e.setAttribute('y', y); e.setAttribute('width', w); e.setAttribute('height', h); e.setAttribute('rx', 8);
    e.setAttribute('fill', 'transparent'); e.setAttribute('stroke', 'none'); e.dataset.z = z; cap.append(e); return e; });
}
cap.addEventListener('pointerup', (ev) => { const z = ev.target.dataset && ev.target.dataset.z; if (z) tocarZona(z); });
envol.append(cap);
const zmsg = document.createElement('p'); zmsg.id = 'rx-zona-msg'; zmsg.setAttribute('aria-live', 'polite');
const zfila = document.createElement('div'); zfila.className = 'rx-fila'; zfila.id = 'rx-zonas'; zfila.style.flexWrap = 'wrap';
for (const [z, v] of Object.entries(ZONAS)) { const b = document.createElement('button'); b.type = 'button'; b.id = `rx-zona-${z}`; b.textContent = v.nombre; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => tocarZona(z)); zfila.append(b); zonaBtns[z] = b; }
$('rx-enunciado').after(zmsg, zfila);
function marcar(z, estado) {
  for (const k of Object.keys(ZONAS)) { const ok = k === z && estado;
    zonaRects[k].forEach(e => { e.setAttribute('stroke', ok ? (estado === 'bien' ? 'var(--accent-yellow)' : 'var(--accent-red)') : 'none'); e.setAttribute('stroke-width', ok ? '2.5' : '0'); e.setAttribute('stroke-dasharray', estado === 'mal' ? '6 4' : ''); });
    zonaBtns[k].setAttribute('aria-pressed', String(ok && estado === 'bien')); }
}
function tocarZona(z) {
  if (respondidas || zonaOk || paso >= N()) return;
  const q = qs[paso], buena = ZONA_DE[q.letra[0]];
  if (z === buena) { zonaOk = true; marcar(z, 'bien'); zmsg.textContent = `Bien: ahí se mira. Ahora elige lo que ves.`; $('rx-opciones').hidden = false; }
  else { marcar(z, 'mal'); zmsg.textContent = `Ahí se mira ${ZONAS[z].nombre} (letra ${ZONAS[z].letra}), no ${q.letra[0]}. Prueba otra zona.`; }
}
$('rx-otro').addEventListener('click', nuevo);
$('rx-siguiente').addEventListener('click', () => { paso++; pintar(); });
$('rx-comprobar').addEventListener('click', comprobar);
$('rx-otro2').addEventListener('click', nuevo);

function nuevo() {
  p = generar(); qs = preguntas(p); inf = informe(qs);
  paso = 0; aciertos = []; respondidas = false; marcadas = [false, false, false, false, false];
  $('rx-ctx').textContent = p.ctx;
  pintar();
}
// El rótulo «Tumbado/Sentado» se oculta hasta contestar la E: la postura se lee por lo que se ve.
const estadoPlaca = (senal) => ({ ...p.e, foco: 'postura', senal, ocultarPostura: aciertos[N() - 1] === undefined });
function filas(r, ul) {
  ul.replaceChildren(...r.cifras.map(cf => {
    const li = document.createElement('li');
    const o = document.createElement('span'); o.className = 'rx-origen'; o.dataset.o = cf.origen; o.textContent = cf.origen;
    li.append(o, ' ', cf.texto);
    if (cf.cita) { const ci = document.createElement('span'); ci.className = 'rx-cita'; ci.append(' · ');
      if (cf.href) { const a = document.createElement('a'); a.href = cf.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = cf.cita; ci.append(a); } else ci.append(cf.cita);
      li.append(ci); }
    return li;
  }));
}

function pintar() {
  const q = qs[paso];
  const enRecorrido = paso < N();
  pintarRx($('rx-placa'), estadoPlaca(null));
  const ya = enRecorrido ? LETRAS.findIndex(l => l.id === q.letra[0]) : 9;
  for (const l of LETRAS) pasos[l.id].dataset.s = LETRAS.indexOf(l) < ya ? 'hecho' : LETRAS.indexOf(l) === ya ? 'ahora' : '';
  pasos.Error.dataset.s = paso === N() ? 'ahora' : paso > N() ? 'hecho' : ''; pasos.Resumen.dataset.s = paso === N() + 1 ? 'ahora' : '';
  $('rx-recorrido').hidden = !enRecorrido; $('rx-cierre').hidden = paso !== N(); $('rx-llevas-caja').hidden = paso !== N() + 1;
  cap.style.pointerEvents = enRecorrido ? 'auto' : 'none'; zonaOk = false; marcar(null, null);
  $('rx-res').hidden = true; respondidas = false;
  if (enRecorrido) {
    $('rx-letra').textContent = `${q.letra} · ${LETRAS.find(l => l.id === q.letra[0]).titulo}`;
    zmsg.textContent = 'Toca en la placa la zona donde se mira esto (o elígela con los botones).'; $('rx-opciones').hidden = true;
    $('rx-enunciado').textContent = q.enunciado;
    ops.forEach((b, i) => { const o = q.opciones[i]; b.hidden = !o; if (o) { b.textContent = o.rotulo; b.removeAttribute('data-r'); b.setAttribute('aria-disabled', 'false'); } });
    $('rx-siguiente').hidden = true;
  } else if (paso === N()) {
    $('rx-comprobar').hidden = false; $('rx-ver-resumen').hidden = true; $('rx-inf-res').hidden = true; $('rx-inf-res').replaceChildren();
    pintarInforme();
  } else resumen();
}

function responder(i) {
  if (respondidas || !zonaOk) return;
  respondidas = true;
  const q = qs[paso], o = q.opciones[i], ok = o.id === q.correcta;
  aciertos[paso] = ok;
  ops.forEach((b, j) => { const x = q.opciones[j]; if (!x) return; b.setAttribute('aria-disabled', 'true'); b.dataset.r = x.id === q.correcta ? 'bien' : (j === i ? 'mal' : ''); if (!b.dataset.r) b.removeAttribute('data-r'); });
  const r = pintarRx($('rx-placa'), { ...p.e, foco: q.foco, senal: q.foco, ocultarPostura: paso !== N() - 1 }), r2 = describir({ ...p.e, foco: q.foco });
  const caja = $('rx-res'); caja.hidden = false;
  $('rx-veredicto').textContent = ok ? 'Correcto.' : `No: es «${q.tabla[q.correcta].rotulo}». Si lo leyeras como «${o.rotulo}», ${o.pasa}.`;
  $('rx-frase').textContent = r2.frase + (q.extra ? ` ${q.extra}` : '');
  filas(r2, $('rx-cifras'));
  const sello = r2.sellos.find(s => s.mando === q.foco);
  $('rx-sello').hidden = !sello; $('rx-sello').textContent = sello ? `▲ Peligro. ${sello.texto}` : '';
  $('rx-ver').dataset.resaltar = r2.ficha.resaltar; $('rx-ver').textContent = `Ver en la ficha: ${r2.ficha.nombre}`;
  $('rx-siguiente').hidden = false; $('rx-siguiente').textContent = paso === N() - 1 ? 'Ir a «Encuentra el error»' : `Siguiente: ${qs[paso + 1].letra}`;
}
$('rx-ver').addEventListener('click', () => { const n = $('rx-ver-nota'); n.hidden = false; n.textContent = 'En la app, este botón abre la ficha y resalta el párrafo de este hallazgo.'; });
$('rx-ver').addEventListener('blur', () => { $('rx-ver-nota').hidden = true; });

function pintarInforme() {
  const hecho = $('rx-comprobar').hidden;
  infs.forEach((b, i) => { b.hidden = i >= inf.length; });
  inf.forEach((x, i) => {
    const b = infs[i]; b.textContent = `${x.texto}`;
    b.setAttribute('aria-pressed', String(!!marcadas[i]));
    if (hecho) b.dataset.r = x.error ? (marcadas[i] ? 'bien' : 'mal') : (marcadas[i] ? 'mal' : ''); else b.removeAttribute('data-r');
    if (!b.dataset.r) b.removeAttribute('data-r');
  });
}
function comprobar() {
  $('rx-comprobar').hidden = true; pintarInforme();
  const errores = inf.filter(x => x.error), bien = inf.every((x, i) => x.error === !!marcadas[i]);
  const lis = [];
  const t = document.createElement('p');
  t.textContent = errores.length === 0 ? (bien ? 'Correcto: este informe no tenía ningún error.' : 'Este informe no tenía ningún error: lo que marcaste era cierto.')
    : (bien ? `Correcto: había ${errores.length} frase${errores.length > 1 ? 's' : ''} mala${errores.length > 1 ? 's' : ''}.` : `El informe tenía ${errores.length} frase${errores.length > 1 ? 's' : ''} mala${errores.length > 1 ? 's' : ''}.`);
  lis.push(t);
  inf.forEach((x, i) => {
    if (!x.error && !marcadas[i]) return;
    const r = describir({ ...p.e, foco: x.foco }), pr = document.createElement('p');
    pr.textContent = x.error ? `${x.letra}: decía «${x.texto}» pero la placa muestra «${x.real}». ${r.cifras.find(c => c.origen === 'ficha')?.texto || r.frase}` : `${x.letra}: esa frase era cierta.`;
    lis.push(pr);
  });
  $('rx-inf-res').hidden = false; $('rx-inf-res').replaceChildren(...lis);
  $('rx-ver-resumen').hidden = false;
}
$('rx-ver-resumen').addEventListener('click', () => { paso = N() + 1; pintar(); });

function resumen() {
  const n = aciertos.filter(Boolean).length;
  $('rx-puntos').textContent = `Aciertos del recorrido: ${n} de ${N()}. (No se guarda: al cerrar la página se pierde.)`;
  $('rx-llevas').replaceChildren(...qs.map((q, i) => {
    const r = describir({ ...p.e, foco: q.foco }), li = document.createElement('li'), c = r.cifras.find(x => x.origen === 'ficha') || r.cifras[0];
    const o = document.createElement('span'); o.className = 'rx-origen'; o.dataset.o = c.origen; o.textContent = c.origen;
    li.append(`${q.letra} · ${q.tabla[q.correcta].rotulo}. ${c.texto} `, o);
    if (c.href) { const a = document.createElement('a'); a.href = c.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = c.cita; li.append(' ', a); }
    return li;
  }));
  pintarRx($('rx-placa'), { ...p.e, foco: 'postura', senal: null });
}
nuevo();
