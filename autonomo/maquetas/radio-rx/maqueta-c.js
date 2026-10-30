// Maqueta C «Lee esta placa generada». Usa la pieza común y radio-rx/caso.js. Nada se guarda: ni localStorage ni cookies.
// Los botones (opciones, frases del informe, siguiente) se crean una vez y se repintan en su sitio.
import { pintarRx, describir } from './escena.js';
import { generar, preguntas, informe, LETRAS } from './caso.js';

const $ = (id) => document.getElementById(id);
let p, qs, inf, paso, aciertos, respondidas, marcadas;

// Indicador A-E · Error · Resumen
const pasos = {};
for (const x of [...LETRAS.map(l => l.id), 'Error', 'Resumen']) { const s = document.createElement('span'); s.textContent = x; $('rx-pasos').append(s); pasos[x] = s; }
const ops = [];
for (let i = 0; i < 4; i++) { const b = document.createElement('button'); b.type = 'button'; b.id = `rx-op-${i}`; b.addEventListener('click', () => responder(i)); $('rx-opciones').append(b); ops.push(b); }
const infs = [];
for (let i = 0; i < 5; i++) { const b = document.createElement('button'); b.type = 'button'; b.id = `rx-inf-${i}`; b.addEventListener('click', () => { if (!$('rx-comprobar').hidden) { marcadas[i] = !marcadas[i]; pintarInforme(); } }); $('rx-informe').append(b); infs.push(b); }
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
const estadoPlaca = (senal) => ({ ...p.e, foco: 'postura', senal });
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
  const enRecorrido = paso < 5;
  pintarRx($('rx-placa'), estadoPlaca(null));
  for (const l of LETRAS) pasos[l.id].dataset.s = LETRAS.indexOf(l) < paso ? 'hecho' : LETRAS.indexOf(l) === paso ? 'ahora' : '';
  pasos.Error.dataset.s = paso === 5 ? 'ahora' : paso > 5 ? 'hecho' : ''; pasos.Resumen.dataset.s = paso === 6 ? 'ahora' : '';
  $('rx-recorrido').hidden = !enRecorrido; $('rx-cierre').hidden = paso !== 5; $('rx-llevas-caja').hidden = paso !== 6;
  $('rx-res').hidden = true; respondidas = false;
  if (enRecorrido) {
    $('rx-letra').textContent = `${q.letra} · ${LETRAS[paso].titulo}`;
    $('rx-enunciado').textContent = q.enunciado;
    ops.forEach((b, i) => { const o = q.opciones[i]; b.hidden = !o; if (o) { b.textContent = o.rotulo; b.removeAttribute('data-r'); b.setAttribute('aria-disabled', 'false'); } });
    $('rx-siguiente').hidden = true;
  } else if (paso === 5) {
    $('rx-comprobar').hidden = false; $('rx-ver-resumen').hidden = true; $('rx-inf-res').hidden = true; $('rx-inf-res').replaceChildren();
    pintarInforme();
  } else resumen();
}

function responder(i) {
  if (respondidas) return;
  respondidas = true;
  const q = qs[paso], o = q.opciones[i], ok = o.id === q.correcta;
  aciertos[paso] = ok;
  ops.forEach((b, j) => { const x = q.opciones[j]; if (!x) return; b.setAttribute('aria-disabled', 'true'); b.dataset.r = x.id === q.correcta ? 'bien' : (j === i ? 'mal' : ''); if (!b.dataset.r) b.removeAttribute('data-r'); });
  const r = pintarRx($('rx-placa'), { ...p.e, foco: q.foco, senal: q.foco }), r2 = describir({ ...p.e, foco: q.foco });
  const caja = $('rx-res'); caja.hidden = false;
  $('rx-veredicto').textContent = ok ? 'Correcto.' : `No: es «${q.tabla[q.correcta].rotulo}». Si lo leyeras como «${o.rotulo}», ${o.pasa}.`;
  $('rx-frase').textContent = r2.frase + (q.extra ? ` ${q.extra}` : '');
  filas(r2, $('rx-cifras'));
  const sello = r2.sellos.find(s => s.mando === q.foco);
  $('rx-sello').hidden = !sello; $('rx-sello').textContent = sello ? `▲ Peligro. ${sello.texto}` : '';
  $('rx-ver').dataset.resaltar = r2.ficha.resaltar; $('rx-ver').textContent = `Ver en la ficha: ${r2.ficha.nombre}`;
  $('rx-siguiente').hidden = false; $('rx-siguiente').textContent = paso === 4 ? 'Ir a «Encuentra el error»' : `Siguiente letra: ${LETRAS[paso + 1].id}`;
}
$('rx-ver').addEventListener('click', () => { const n = $('rx-ver-nota'); n.hidden = false; n.textContent = 'En la app, este botón abre la ficha y resalta el párrafo de este hallazgo.'; });
$('rx-ver').addEventListener('blur', () => { $('rx-ver-nota').hidden = true; });

function pintarInforme() {
  const hecho = $('rx-comprobar').hidden;
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
$('rx-ver-resumen').addEventListener('click', () => { paso = 6; pintar(); });

function resumen() {
  const n = aciertos.filter(Boolean).length;
  $('rx-puntos').textContent = `Aciertos del recorrido: ${n} de 5. (No se guarda: al cerrar la página se pierde.)`;
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
