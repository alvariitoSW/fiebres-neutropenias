// Maqueta A «Placa con capas y mandos». Los botones se crean una vez y se repintan en su sitio.
import { pintarRx, describir, ESTADOS, MANDOS, ESTADO_INICIAL, MAX_PATOLOGIAS, patologiasEncendidas } from './escena.js';

const $ = (id) => document.getElementById(id);
const svg = $('rx-placa');
let estado = { ...ESTADO_INICIAL };
let rechazo = null; // estado que pasaría de 3 patologías: no se aplica, solo saca su sello

const chips = {}, segs = {};
for (const k of MANDOS) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'rx-chip'; b.id = `rx-chip-${k}`; b.textContent = ESTADOS[k].titulo;
  b.addEventListener('click', () => { estado.foco = k; if (estado.senal) estado.senal = k; rechazo = null; pintar(); });
  $('rx-chips').append(b); chips[k] = b;
  const g = document.createElement('div');
  g.className = 'rx-seg'; g.id = `rx-seg-${k}`; g.setAttribute('role', 'group'); g.setAttribute('aria-label', ESTADOS[k].titulo); g.hidden = true;
  for (const s of ESTADOS[k].estados) {
    const sb = document.createElement('button');
    sb.type = 'button'; sb.dataset.estado = s.id; sb.id = `rx-${k}-${s.id}`; sb.textContent = s.rotulo;
    sb.addEventListener('click', () => elegir(k, s.id));
    g.append(sb);
  }
  $('rx-estados').append(g); segs[k] = g;
}

function elegir(k, id) {
  const nuevo = { ...estado, [k]: id, foco: k };
  if (estado.senal) nuevo.senal = k;
  if (patologiasEncendidas(nuevo).length > MAX_PATOLOGIAS) { rechazo = nuevo; pintar(); return; }
  rechazo = null; estado = nuevo; pintar();
}

$('rx-senalalo').addEventListener('click', () => { estado.senal = estado.senal ? null : estado.foco; pintar(); });
$('rx-sano').addEventListener('click', () => { estado = { ...ESTADO_INICIAL, foco: estado.foco }; rechazo = null; pintar(); });
$('rx-ver').addEventListener('click', () => {
  const f = ESTADOS[estado.foco].ficha, n = $('rx-ver-nota');
  n.hidden = false; n.textContent = `En la app, este botón abre «${f.nombre}» y resalta el párrafo de este estado.`;
});
$('rx-ver').addEventListener('blur', () => { $('rx-ver-nota').hidden = true; });

function pintar() {
  const r = pintarRx(svg, estado);
  const imp = rechazo ? describir(rechazo) : null;
  const llenas = patologiasEncendidas(estado).length >= MAX_PATOLOGIAS;
  for (const k of MANDOS) {
    chips[k].setAttribute('aria-pressed', String(k === estado.foco));
    const est = ESTADOS[k].estados.find(s => s.id === r.estado[k]);
    chips[k].dataset.cambiado = String(r.estado[k] !== ESTADO_INICIAL[k] && !est.peligro);
    chips[k].dataset.peligro = String(!!est.peligro);
    segs[k].hidden = k !== estado.foco;
    for (const b of segs[k].children) {
      b.setAttribute('aria-pressed', String(b.dataset.estado === r.estado[k]));
      const bloqueado = ESTADOS[k].patologia && llenas && r.estado[k] === 'no' && b.dataset.estado !== 'no';
      b.setAttribute('aria-disabled', String(bloqueado));
    }
  }
  $('rx-senalalo').setAttribute('aria-pressed', String(!!estado.senal));
  $('rx-senalalo').textContent = estado.senal ? 'Quitar el señalado' : 'Señálalo en la placa';
  $('rx-frase').textContent = r.frase;
  $('rx-aviso').hidden = !r.aviso; $('rx-aviso').textContent = r.aviso ? `Atención: ${r.aviso}` : '';
  $('rx-cifras').replaceChildren(...r.cifras.map(cf => {
    const li = document.createElement('li');
    const o = document.createElement('span'); o.className = 'rx-origen'; o.dataset.o = cf.origen; o.textContent = cf.origen;
    li.append(o, ' ', cf.texto);
    if (cf.cita) {
      const ci = document.createElement('span'); ci.className = 'rx-cita'; ci.append(' · ');
      if (cf.href) { const a = document.createElement('a'); a.href = cf.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = cf.cita; ci.append(a); }
      else ci.append(cf.cita);
      li.append(ci);
    }
    return li;
  }));
  $('rx-ver').dataset.resaltar = ESTADOS[estado.foco].ficha.resaltar;
  $('rx-ver').textContent = `Ver en la ficha: ${ESTADOS[estado.foco].ficha.nombre}`;
  const sello = imp ? { texto: imp.sello, href: null } : (r.sello ? { texto: r.sello, href: r.selloHref } : null);
  const caja = $('rx-sello');
  caja.hidden = !sello;
  if (sello) {
    caja.replaceChildren();
    const s = document.createElement('strong'); s.textContent = '▲ Peligro. ';
    caja.append(s, sello.texto);
    if (sello.href) { const a = document.createElement('a'); a.href = sello.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = ' Fuente'; caja.append(' ·', a); }
    const otros = (imp ? r.sellos.length : r.sellos.length - 1);
    if (otros > 0) caja.append(` (y ${otros} aviso${otros > 1 ? 's' : ''} más en otros mandos)`);
  }
  const fig = r.figura;
  $('rx-fig').hidden = !fig;
  if (fig) {
    const img = $('rx-fig-img');
    if (img.getAttribute('src') !== fig.src) { img.src = fig.src; img.alt = fig.pie; }
    $('rx-fig-pie').textContent = fig.pie; $('rx-fig-pag').href = fig.href; $('rx-fig-pag').textContent = fig.pag;
  }
}
pintar();
