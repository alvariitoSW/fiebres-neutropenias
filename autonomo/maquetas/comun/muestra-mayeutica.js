// La muestra de la Mayéutica (pieza común de las maquetas del corazón eléctrico y del receptor vivo; en la app, el
// recorrido de js/core/mayeutica.js). REGLAS §8: las tres partes en orden (el recorrido de la ficha, «Otra vez lo que
// fallaste» y el caso que evoluciona) y los tres formatos (test con «piensa antes», «piensa y destapa» y «encuentra el
// error» con 0, 1 o 2 errores). Las respuestas viven en los datos; el HTML no las lleva hasta que se contesta.
//
// crearMuestra({ cont, dock: { pasos, izq, der }, recorrido, caso: { titulo, pasos, llevas, vuelta }, grupos,
//   preparar(q) (pone el modelo en el estado de la pregunta y tapa lo que se predice), destapar(q) (enseña el modelo),
//   tocar(q, hecho) («compruébalo» en el modelo; hecho(html) al acabar), cita(c), chip(c), medir() (el dock), alVolver(c) })
import { instalarCss } from './dibujo-iso.js';

const CSS = `
.mm-punto { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; }
.mm-frase[aria-pressed="true"] { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 16%, var(--card2)); }
.mm-frase.mm-bien { border-color: var(--accent-green); box-shadow: inset 3px 0 0 var(--accent-green); }
.mm-frase.mm-mal { border-color: var(--accent-red); box-shadow: inset 3px 0 0 var(--accent-red); }
.mm-tenia[aria-pressed="true"] { border-color: var(--accent-green); color: var(--accent-green); }
.mm-llevas { margin: 0; padding-left: 18px; display: grid; gap: 6px; font: .86rem/1.45 var(--sans); }
.grupo.repaso { background: var(--accent-yellow); color: var(--bg-main); }
`;
const barajarFijo = (ops, k) => ops.map((o, i) => [o, i]).sort((a, b) => ((a[1] + k) % ops.length) - ((b[1] + k) % ops.length)).map((x) => x[0]);

export function crearMuestra(o) {
  instalarCss('muestra-mayeutica', CSS);
  const G = { guia: 'Guía socrática', examen: 'Examen · nivel MIR', repaso: 'Otra vez lo que fallaste', caso: 'El caso', ...(o.grupos || {}) };
  let lista = [], i = 0, res = [], ficha = [], repasoHecho = false, q = null, estado = {};
  const $ = (s) => o.cont.querySelector(s);
  function empezar() {
    lista = o.recorrido.map((x) => ({ ...x })); i = 0; res = []; ficha = []; repasoHecho = false; pintar();
  }
  // Al acabar el recorrido: las que fallaste (o sabías a medias), otra vez y con las opciones en otro orden; luego, el caso
  function repaso() {
    repasoHecho = true;
    const malas = lista.map((x, k) => [x, k]).filter(([x, k]) => !res[k]).map(([x], n) => ({ ...x, grupo: 'repaso', num: `${x.num} · otra vez`, origen: x.grupo,
      opciones: x.opciones ? barajarFijo(x.opciones, n + 1) : x.opciones, tocar: null }));
    const aviso = malas.length ? [] : [{ tipo: 'aviso', grupo: 'repaso', num: '·', enunciado: 'No fallaste ninguna del recorrido: no hay nada que repasar. Sigue el caso.' }];
    lista.push(...malas, ...aviso, ...o.caso.pasos.map((x) => ({ ...x, grupo: 'caso' })));
  }
  function dock() {
    const D = o.dock; if (!D) return;
    D.pasos.innerHTML = lista.map((_, k) => `<i class="${k < i ? (res[k] ? 'on' : 'mal') : ''}${k === i ? ' aqui' : ''}"></i>`).join('');
    D.izq.textContent = i < lista.length ? `${i + 1} de ${lista.length}${repasoHecho ? '' : ' del recorrido'}` : 'Hecho';
    D.der.textContent = i < lista.length ? (lista[i].grupo === 'caso' ? `${G.caso}` : G[lista[i].grupo]) : `${res.filter(Boolean).length} de ${lista.length} bien`;
    o.medir?.();
  }
  function pintar() {
    if (i >= lista.length && !repasoHecho) repaso();
    dock();
    q = lista[i]; estado = {};
    if (!q) { o.destapar?.(null); return final(); }
    o.preparar?.(q);
    let h = '';
    if (q.grupo === 'caso') {
      if (q === lista.find((x) => x.grupo === 'caso')) ficha = [];
      const nuevas = q.paciente || [];
      ficha = ficha.concat(nuevas.map(([k, v]) => [k, v, true]));
      h += `<p class="dia">${q.dia}</p><dl class="paciente">${ficha.map(([k, v], n) => `<dt>${k}</dt><dd${n >= ficha.length - nuevas.length ? ' class="cambia"' : ''}>${v}</dd>`).join('')}</dl>`;
      ficha = ficha.map(([k, v]) => [k, v, false]);
    }
    const formato = q.tipo === 'error' ? 'Encuentra el error' : q.tipo === 'destapa' ? 'Piensa y destapa' : q.tipo === 'aviso' ? '' : `Test · piensa antes${q.predice && q.grupo !== 'repaso' ? ' · predice y compruébalo' : ''}`;
    h += `<div class="cab-preg"><span class="num">${q.num}</span><span class="grupo ${q.grupo === 'guia' ? '' : q.grupo}">${q.grupo === 'caso' ? G.caso : G[q.grupo]}</span>${formato ? `<span class="tipo">${formato}</span>` : ''}</div>`;
    h += `<p class="pregunta">${q.enunciado}</p>`;
    if (q.tipo === 'aviso') h += `<div class="fila"><button class="b prim" type="button" data-mm="sig">Al caso →</button></div>`;
    else if (q.tipo === 'error') h += `<div class="op">${q.frases.map((f, k) => `<button class="b mm-frase" type="button" data-fr="${k}" aria-pressed="false">${f.t}</button>`).join('')}</div><div class="fila"><button class="b prim" type="button" data-mm="corregir">Corregir</button></div>`;
    else if (q.tipo === 'destapa') h += `<p class="para">Piénsalo: son ${['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas'][q.puntos.length]}.</p><div class="fila"><button class="b prim" type="button" data-mm="destapar">Destapar</button></div>`;
    else h += `<div id="mm-fmt"><p class="para">Piénsalo antes de ver las opciones.</p><div class="fila" style="margin-top:6px"><button class="b prim" type="button" data-mm="ops">Ya lo tengo: ver opciones</button></div></div><div class="op" id="mm-ops" hidden></div>`;
    h += '<div id="mm-res"></div>';
    o.cont.innerHTML = h; o.cont.classList.remove('entra'); void o.cont.offsetWidth; o.cont.classList.add('entra');
  }
  function final() {
    const c = o.caso;
    o.cont.innerHTML = `<h2>Lo que te llevas</h2><ul class="mm-llevas">${c.llevas.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="fila">${c.vuelta ? o.cita(c.vuelta) : ''}</div>
      <div class="fila">${c.modelo ? `<button class="b prim" type="button" data-mm="modelo">${c.modelo.txt}</button>` : ''}<button class="b" type="button" data-mm="otra">Otra vez</button></div>`;
  }
  const sig = () => { i++; pintar(); scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  const botonSig = () => q.tocar ? `<button class="b prim" type="button" data-mm="tocar">${q.tocar.txt}</button>` : `<button class="b prim" type="button" data-mm="sig">Siguiente →</button>`;
  const citas = (x) => [x.fuente, x.fuente2].filter(Boolean).map((c) => o.cita(c)).join('');
  o.cont.addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b || b.disabled || !q && b.dataset.mm !== 'otra' && b.dataset.mm !== 'modelo') return;
    const a = b.dataset.mm;
    if (a === 'otra') return empezar();
    if (a === 'modelo') return o.caso.modelo.ir();
    if (a === 'sig') return sig();
    if (a === 'ops') { const ops = $('#mm-ops'); ops.innerHTML = q.opciones.map((op, k) => `<button class="b" type="button" data-op="${k}">${op.t}</button>`).join(''); ops.hidden = false; $('#mm-fmt').remove(); return; }
    if (a === 'tocar') { const fila = b.closest('.fila'); fila.innerHTML = '<span class="para">Mira el modelo…</span>'; o.tocar(q, (html) => { fila.outerHTML = `<p class="para"><span class="ok">✓ Mira:</span> ${html}</p><div class="fila"><button class="b prim" type="button" data-mm="sig">Siguiente →</button></div>`; }); return; }
    if (b.dataset.op != null) {
      const op = q.opciones[+b.dataset.op]; res[i] = !!op.ok;
      o.cont.querySelectorAll('#mm-ops button').forEach((x) => { x.disabled = true; }); b.classList.add(op.ok ? 'elegida-bien' : 'elegida-mal');
      o.destapar?.(q);
      $('#mm-res').innerHTML = `<div class="respuesta entra"><span class="${op.ok ? 'ok' : 'mal'}">${op.ok ? '✓ Bien' : '✗ Qué le habría pasado al paciente'}</span>${op.ok ? '' : `<p>${op.porque}</p>`}<p>${q.explicacion}${q.fuente && o.chip ? ' ' + o.chip(q.fuente) : ''}</p>${citas(q)}${q.sigue ? `<p class="para">${q.sigue}</p>` : ''}<div class="fila">${botonSig()}</div></div>`;
      dock(); return;
    }
    if (b.dataset.fr != null && !estado.corregido) { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); return; }
    if (a === 'corregir') {
      estado.corregido = true; let bien = true; b.closest('.fila').remove();
      o.cont.querySelectorAll('[data-fr]').forEach((x, k) => { const f = q.frases[k], m = x.getAttribute('aria-pressed') === 'true'; x.disabled = true; if (!!f.mal !== m) bien = false; x.classList.add(f.mal ? 'mm-mal' : 'mm-bien'); });
      res[i] = bien; o.destapar?.(q);
      const errores = q.frases.map((f, k) => [f, k]).filter(([f]) => f.mal);
      $('#mm-res').innerHTML = `<div class="respuesta entra"><span class="${bien ? 'ok' : 'mal'}">${bien ? '✓ Bien: ' : '✗ '}había ${errores.length === 0 ? 'cero errores' : errores.length === 1 ? 'un error' : 'dos errores'}.</span>
        ${errores.map(([f, k]) => `<div><p>«${f.t}»</p><p class="para">Piensa cómo sería la frase buena.</p><div class="fila"><button class="b" type="button" data-buena="${k}">Ver la frase buena</button></div><div id="mm-buena-${k}"></div></div>`).join('')}
        <p>${q.explicacion}</p>${citas(q)}<div class="fila"><button class="b prim" type="button" data-mm="sig">Siguiente →</button></div></div>`;
      dock(); return;
    }
    if (b.dataset.buena != null) { const f = q.frases[+b.dataset.buena]; $(`#mm-buena-${b.dataset.buena}`).innerHTML = `<p><span class="hl-verde">${f.buena}</span></p>${o.cita(f.cita)}`; b.remove(); return; }
    if (a === 'destapar') {
      o.destapar?.(q);
      b.closest('.fila').outerHTML = `<div class="respuesta entra">${q.puntos.map((p, k) => `<div class="mm-punto"><span>${k + 1}. ${p.t}</span><button class="b mm-tenia" type="button" data-tenia="${k}" aria-pressed="false">La tenía</button></div>${o.cita(p.c)}`).join('')}
        <p class="para">Marca una a una las que tenías.</p><div class="fila"><button class="b prim" type="button" data-mm="destapado">Listo</button></div></div>`;
      return;
    }
    if (b.dataset.tenia != null) { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '✓ La tenía' : 'La tenía'; return; }
    if (a === 'destapado') {
      // si falta alguna, la pregunta vuelve en «Otra vez lo que fallaste» (si es del recorrido)
      res[i] = [...o.cont.querySelectorAll('[data-tenia]')].every((x) => x.getAttribute('aria-pressed') === 'true');
      o.cont.querySelectorAll('[data-tenia]').forEach((x) => { x.disabled = true; });
      b.outerHTML = `${q.explicacion ? `<p>${q.explicacion}</p>` : ''}${botonSig()}`; dock();
    }
  });
  return { empezar, get i() { return i; }, get lista() { return lista; } };
}
