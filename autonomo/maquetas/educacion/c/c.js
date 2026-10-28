// Maqueta C · lógica. Usa el río y mar real (escena + datos) y no guarda nada: ni localStorage ni sessionStorage.
import {
  $, aplicarModelo, setOcultos, medir, pintarUnaVez, arrancar, ponerVisible, ponerFormatoOrigen, puntoDe,
  initEscena, pintarLectura, pintarMareas, estado, D,
} from '../../../../js/modules/libros/agua-viva-escena.js';
import { estadoBase, copia } from '../../../../js/data/agua-viva-data.js';
import { HOY, PDF, intervalo, sumarDias, fechaES, REPASO, CASO, LLEVA } from './datos.mjs';

const g = id => document.getElementById(id);
const NOM = { F: 'Fluidoterapia', S: 'Shock' };
const res = {};                       // id -> { ok, a, f } (solo en memoria)
let pantalla = 0;

// ---------- Escena (la real) ----------
const estadoDe = p => Object.assign(estadoBase(), copia(p || {}));
const TERESA = { paciente: 'mujer', hemorragia: 20, reloj: '1h' };
const SALINO = [{ f: 'salino', ml: 2000 }];
ponerFormatoOrigen(t => t.split(' · ').filter(p => !/^(mar|mc|mr)-/.test(p)).join(' · ').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])));
let escenaLista = false, anilloObj = null;
function anillo(obj) {
  anilloObj = obj;
  const a = g('agv-anillo');
  if (!obj) { a.hidden = true; return; }
  let x, y;
  if (obj === 'lectura') {
    const r = g('agv-lectura').getBoundingClientRect(), r0 = g('agv-escena').getBoundingClientRect();
    x = r.left - r0.left + r.width / 2; y = r.top - r0.top + r.height / 2;
  } else [x, y] = puntoDe(obj);
  const lado = obj === 'lectura' ? 120 : 64;
  Object.assign(a.style, { left: x + 'px', top: y + 'px', width: lado + 'px', height: lado + 'px', margin: `-${lado / 2}px 0 0 -${lado / 2}px` });
  a.hidden = false;
}
function escena(parcial, { ocultos = [], mirar = null } = {}) {
  g('agv-raiz').hidden = false;
  if (!escenaLista) { escenaLista = true; initEscena({ enEstudio: () => true }); new ResizeObserver(() => { medir(); pintarUnaVez(); arrancar(); if (anilloObj) anillo(anilloObj); }).observe(g('agv-escena')); }
  medir();
  aplicarModelo(estadoDe(parcial), { inmediato: true });
  setOcultos(ocultos); pintarLectura(); pintarMareas();
  ponerVisible(true); pintarUnaVez(); arrancar();
  anillo(mirar);
}
const sinEscena = () => { g('agv-raiz').hidden = true; ponerVisible(false); };

// ---------- Piezas de interfaz ----------
const nodo = (html, tag = 'div', cls = '') => { const e = document.createElement(tag); if (cls) e.className = cls; e.innerHTML = html; return e; };
const enlaces = fs => fs.map(([d, p, txt]) => `<a class="biblio-link" href="${PDF[d]}#page=${p}" target="_blank" rel="noopener">${NOM[d]}, pág. ${p}</a>${txt ? ` <span class="c-peq">(${txt})</span>` : ''}`).join(' · ');
const fuentesHTML = fs => `<p class="c-ver"><b>Ver en el texto:</b> ${enlaces(fs)}</p>`;
const notaHTML = (titulo, texto, abierta) => `<details class="nota-plegable"${abierta ? ' open' : ''}><summary>${titulo}</summary><p class="c-nota">${texto}</p></details>`;
function datos(filas, tit = 'Datos de Teresa (inventada; la medicina es del libro)') {
  return `<dl class="c-paciente" aria-label="${tit}">${filas.map(([k, v, nuevo, org]) => `<dt>${k}</dt><dd class="${nuevo ? 'c-nuevo' : ''}">${v}${org ? ` <span class="c-org">${org}</span>` : ''}</dd>`).join('')}</dl>`;
}
function botonSig(texto, fn, cont) {
  const b = nodo(texto, 'button', 'c-b c-prim'); b.type = 'button'; b.hidden = true;
  b.addEventListener('click', () => { b.hidden = true; fn(); }); cont.append(b); return b;
}
const dias = n => n === 1 ? 'mañana' : `en ${n} días`;
function lineaVuelve(q, ok) {
  const p = q.prev || [0, 0], a = p[0] + (ok ? 1 : 0), f = p[1] + (ok ? 0 : 1);
  const n = intervalo(a, f, !ok);
  res[q.id] = { ok, a, f, n };
  return ok ? `Vuelve ${n === 1 ? 'mañana' : 'en ' + n + ' días'}: la has acertado ${a} de ${a + f} veces.` : 'Vuelve mañana: fallada.';
}

/* Una pregunta (test, destapa o error). Los botones se crean una vez; después solo cambian de clase. */
function pregunta(q, { chip, etiqueta, alResponder, comprueba } = {}) {
  const art = nodo('', 'article', 'c-preg');
  const cab = [];
  if (chip) cab.push(`<span class="c-chip">${chip}</span>`);
  cab.push(`<span class="c-eyebrow">${etiqueta}</span>`);
  art.append(nodo(cab.join(''), 'div', 'c-cab'), nodo(q.enunciado, 'p', 'c-enun'));
  const fin = nodo('', 'div', 'c-fin'); fin.hidden = true;
  const expl = nodo(`<p>${q.explicacion}</p>${q.fuentes ? fuentesHTML(q.fuentes) : ''}${q.nota ? notaHTML(q.nota[0], q.nota[1]) : ''}${(q.notas || []).map(n => notaHTML(n[0], n[1])).join('')}`, 'div', 'c-expl');
  const linea = nodo('', 'p', 'c-vuelve');
  const verd = nodo('', 'p', 'c-veredicto');
  let cerrado = false;
  const terminar = ok => {
    if (cerrado) return; cerrado = true;
    linea.textContent = chip ? lineaVuelve(q, ok) : (res[q.id] = { ok, a: ok ? 1 : 0, f: ok ? 0 : 1, n: intervalo(ok ? 1 : 0, ok ? 0 : 1, !ok) }, '');
    linea.hidden = !chip;
    verd.textContent = ok ? 'Acertada.' : 'Fallada.'; verd.className = 'c-veredicto ' + (ok ? 'c-vok' : 'c-vno');
    const seguir = () => { fin.hidden = false; alResponder && alResponder(ok); };
    if (comprueba) {
      const b = nodo(comprueba.texto, 'button', 'c-b c-prim'); b.type = 'button';
      art.append(b);
      b.addEventListener('click', () => { b.hidden = true; comprueba.fn(); seguir(); });
    } else seguir();
  };
  const cuerpo = nodo('', 'div', 'c-cuerpo');
  const pensar = (texto, mostrar) => {
    const b = nodo(texto, 'button', 'c-b c-prim'); b.type = 'button';
    cuerpo.hidden = true; art.append(b); art.append(cuerpo);
    b.addEventListener('click', () => { b.hidden = true; cuerpo.hidden = false; mostrar && mostrar(); });
  };
  if (q.tipo === 'test') {
    const ops = q.opciones.map((o, i) => {
      const b = nodo(`<span>${o.t}</span>`, 'button', 'c-op'); b.type = 'button';
      const por = nodo(o.ok ? '' : o.porque, 'p', 'c-porque'); por.hidden = true;
      return { o, b, por, w: nodo('', 'div', 'c-opw') };
    });
    ops.forEach(x => { x.w.append(x.b, x.por); cuerpo.append(x.w); });
    ops.forEach(x => x.b.addEventListener('click', () => {
      if (cerrado) return;
      ops.forEach(y => { y.b.classList.add(y.o.ok ? 'c-ok' : 'c-no'); if (y === x) y.b.classList.add('c-elegida'); y.por.hidden = !!y.o.ok; y.b.setAttribute('aria-disabled', 'true'); });
      terminar(!!x.o.ok);
    }));
    if (q.piensa) pensar('Ya lo pensé: ver las opciones'); else art.append(cuerpo);
  } else if (q.tipo === 'destapa') {
    const lista = nodo('', 'div', 'c-puntos');
    const cbs = q.puntos.map(p => { const l = nodo(`<input type="checkbox"><span>${p}</span>`, 'label', 'c-punto'); lista.append(l); return l.firstChild; });
    const ok = nodo('Listo: ya marqué los que tenía', 'button', 'c-b c-prim'); ok.type = 'button';
    const ayuda = nodo('Marca los puntos que ya tenías. Si faltó alguno, la pregunta cuenta como fallada.', 'p', 'c-para');
    cuerpo.append(ayuda, lista, ok);
    ok.addEventListener('click', () => { ok.hidden = true; cbs.forEach(c => c.disabled = true); terminar(cbs.every(c => c.checked)); });
    pensar('Ya lo pensé: destapar');
  } else {   // error
    const fr = q.frases.map((f, i) => {
      const b = nodo(`<span class="c-n">${i + 1}</span><span>${f.t}</span>`, 'button', 'c-frase'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      const cor = nodo('', 'div', 'c-corr'); cor.hidden = true;
      const w = nodo('', 'div', 'c-opw'); w.append(b, cor); cuerpo.append(w);
      b.addEventListener('click', () => { if (cerrado) return; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('c-marcada', on); });
      return { f, b, cor };
    });
    const ok = nodo('Comprobar', 'button', 'c-b c-prim'); ok.type = 'button';
    cuerpo.append(ok);
    ok.addEventListener('click', () => {
      ok.hidden = true;
      let todo = true;
      fr.forEach(({ f, b, cor }) => {
        const marcada = b.getAttribute('aria-pressed') === 'true', mal = !!f.mal;
        if (marcada !== mal) todo = false;
        b.setAttribute('aria-disabled', 'true');
        b.classList.add(mal ? (marcada ? 'c-ok' : 'c-no') : (marcada ? 'c-no' : 'c-ok'));
        if (mal) {
          if (q.piensaCorreccion) {
            const bb = nodo('Piensa la frase correcta y destápala', 'button', 'c-b c-sec'); bb.type = 'button';
            const t = nodo(f.c, 'p', 'c-porque'); t.hidden = true; cor.append(bb, t); cor.hidden = false;
            bb.addEventListener('click', () => { bb.hidden = true; t.hidden = false; });
          } else { cor.innerHTML = f.c; cor.hidden = false; cor.className = 'c-porque'; }
          if (!marcada) cor.insertAdjacentHTML('afterbegin', '<b>Te faltó: </b>');
        } else {
          cor.className = 'c-porque'; cor.innerHTML = (marcada ? '<b>Esta estaba bien. </b>' : '') + (f.f ? enlaces(f.f) : ''); cor.hidden = !(marcada || f.f);
        }
      });
      terminar(todo);
    });
    art.append(cuerpo);
  }
  fin.append(verd, expl, linea);
  art.append(fin);
  return art;
}

// ---------- Pantallas ----------
const raiz = () => g('c-pantalla');
function cabecera(n, titulo, sub) {
  g('c-progreso').innerHTML = [1, 2, 3, 4, 5, 6].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('');
  g('c-nummero').textContent = `Pantalla ${n} de 6`;
  return `<span class="c-eyebrow">${sub}</span><h2>${titulo}</h2>`;
}
function abrir(n, html) {
  pantalla = n; const r = raiz(); document.body.append(g('agv-raiz')); r.innerHTML = ''; r.append(nodo(html, 'header', 'c-cabp'));
  r.className = 'c-pant'; window.scrollTo(0, 0); return r;
}

function p1() {
  const r = abrir(1, cabecera(1, 'Antes de empezar: cinco de días atrás', 'Repaso · pregunta 1 de 5') +
    '<p class="c-lead">Cinco preguntas de fichas que ya estudiaste. Volver a contestar días después fija más que releer (Larsen 2009, d = 0,91 en residentes; Kerfoot 2010, 724 residentes). Las elige la fecha de tu último intento.</p>');
  sinEscena();
  const hueco = nodo('', 'div', 'c-hueco'); r.append(hueco);
  const fin = nodo('<p class="c-lead"><b>Repaso hecho.</b> Ahora, Teresa.</p>', 'div', 'c-final'); fin.hidden = true;
  const ir = nodo('Ir a Teresa', 'button', 'c-b c-prim'); ir.type = 'button'; ir.addEventListener('click', p2); fin.append(ir); r.append(fin);
  r.append(nodo(notaHTML('Evidencia: mezclar fichas', 'Mezclar fichas (entrelazado) tiene evidencia contradictoria en medicina: en ECG ayudó (Hatala 2003, 46 % frente a 30 %) y perjudicó (Monteiro 2017, 24 % frente a 34 % a los días). Aquí solo se mezclan conceptos parecidos (Brunmair 2019), y se mide contigo.', true), 'div'));
  const una = i => {
    if (i >= REPASO.length) { fin.hidden = false; return; }
    const q = REPASO[i];
    g('c-nummero').textContent = `Pantalla 1 de 6 · repaso ${i + 1}/5`;
    const hoy = fechaES(sumarDias(HOY, -q.dias));
    const art = pregunta(q, { chip: `${q.chip} (último intento ${hoy})`, etiqueta: `${q.ficha} · ${i + 1}/5`, alResponder: () => {
      const b = botonSig(i < REPASO.length - 1 ? 'Siguiente pregunta' : 'Terminar el repaso', () => { hueco.innerHTML = ''; una(i + 1); }, art);
      b.hidden = false;
    } });
    hueco.innerHTML = ''; hueco.append(art);
  };
  una(0);
}

const P_BASE = [['Edad', '45 años'], ['Peso', '60 kg (volemia ≈ 3,6 L)', 0, 'S pág. 21'], ['Motivo', 'melenas desde la madrugada'], ['FC', '112'], ['PA', '112/68'], ['Diuresis', '40 mL/h (0,67 mL/kg/h)'], ['Lactato', '1,4']];
function pantallaConEscena(n, titulo, sub, extra) {
  const r = abrir(n, cabecera(n, titulo, sub) + (extra || ''));
  r.children[0].after(g('agv-raiz'));
  return r;
}

function p2() {
  const r = pantallaConEscena(2, 'Teresa llega', 'Urgencias · hora 0');
  const fila = [...P_BASE, ['Hto', '?', 0, 'dato del caso; la Fig. 15.1 parte de 45 %, S pág. 24']];
  const d = nodo(datos(fila), 'div'); r.append(d);
  escena(TERESA, { ocultos: ['hto'], mirar: 'herida' });
  const art = pregunta(CASO.P1, { etiqueta: 'Pregunta 1 · piensa antes', alResponder: () => {
    escena(TERESA, { ocultos: [], mirar: null });
    d.innerHTML = datos(fila.map(f => f[0] === 'Hto' ? ['Hto', '45 %', 0, 'dato del caso; Fig. 15.1, S pág. 24'] : f));
    botonSig('Siguiente: cuánto, y adónde va', p3, art).hidden = false;
  } });
  r.append(art);
}

function p3() {
  const r = pantallaConEscena(3, 'Cuánto, y adónde va lo que puso el R1', 'Hora 0-1');
  escena(TERESA, { ocultos: [] });
  const fila = [['Peso', '60 kg'], ['Pérdida estimada', '20 % (clase II)', 1]];
  const d = nodo(datos(fila), 'div'); r.append(d);
  const art2 = pregunta(CASO.P2, { etiqueta: 'Pregunta 2 · piensa antes', alResponder: () => {
    d.innerHTML = datos([...fila.map(f => [f[0], f[1], 0]), ['Fluidos', 'el R1 de guardia puso 2 L de salino 0,9 % a chorro', 1]]);
    escena(TERESA, { ocultos: ['rio', 'marisma', 'mar'], mirar: 'rio' });
    const art3 = pregunta(CASO.P3, { etiqueta: 'Pregunta 3 · piensa antes y comprueba en el modelo',
      comprueba: { texto: 'Compruébalo: infundir 2 L de salino', fn: () => { escena({ ...TERESA, infusiones: SALINO }, { ocultos: [], mirar: 'marisma' }); art3.insertAdjacentHTML('beforeend', `<p class="c-conf">${CASO.P3.confirma}</p>`); } },
      alResponder: () => botonSig('Siguiente: el giro', p4, art3).hidden = false });
    r.append(art3);
  } });
  // calculadora: la regla, sin el resultado (primero predices)
  const calc = nodo('<button type="button" class="c-b c-sec" id="c-calc-b">Abrir la calculadora «Volumen de reanimación»</button><div id="c-calc" class="c-calc" hidden><p><b>Tabla 15.4</b> (S pág. 29): cristaloide = déficit de plasma × 3 («estimación conservadora»); coloide = déficit × 1.</p><p>Plasma: 36 mL/kg en la mujer (S pág. 29).</p><p class="c-para">La calculadora de la app hace la cuenta; aquí primero la predices.</p></div>', 'div', 'c-calcw');
  r.append(art2);
  art2.querySelector('.c-enun').after(calc);
  calc.querySelector('#c-calc-b').addEventListener('click', e => { const c = g('c-calc'); c.hidden = !c.hidden; e.currentTarget.setAttribute('aria-expanded', String(!c.hidden)); });
}

function p4() {
  const r = pantallaConEscena(4, 'El giro', 'Hora 4');
  escena({ ...TERESA, infusiones: SALINO }, { mirar: 'lectura' });
  r.append(nodo(datos([['FC', '118', 1], ['PA', '108/64', 1], ['Hto', '38 %', 1, 'cálculo del modelo · fisiología general'], ['Na⁺/Cl⁻/HCO₃⁻', '140/116/18', 1], ['PaCO₂', '37', 1], ['pH', '7,31', 1], ['Lactato', '1,6', 1], ['Fluidos', '2 L de salino 0,9 %']]), 'div'));
  const art = pregunta(CASO.P4, { etiqueta: 'Pregunta 4 · piensa y destapa', alResponder: () => botonSig('Siguiente: el plan y el día 2', p5, art).hidden = false });
  r.append(art);
}

function p5() {
  const r = pantallaConEscena(5, 'El plan de guardia y el día 2', 'Hora 4 y día 2');
  escena({ ...TERESA, infusiones: SALINO }, { mirar: 'lectura' });
  const q5 = { ...CASO.P5, piensaCorreccion: true };
  const dia2 = () => {
    const sub = nodo('<span class="c-eyebrow">Día 2</span>', 'div', 'c-dia');
    sub.append(nodo(datos([['Endoscopia', 'úlcera tratada, no sangra', 1], ['FC', '88', 1], ['PA', '120/70', 1], ['Hto', '31 %', 1, 'cálculo del caso · fisiología general']]), 'div'));
    r.append(sub);
    escena({ ...TERESA, infusiones: SALINO, reloj: 'dias' }, { mirar: 'marisma' });
    const art6 = pregunta(CASO.P6, { etiqueta: 'Pregunta 6 · piensa antes', alResponder: () => botonSig('Siguiente: lo que te llevas', p6, art6).hidden = false });
    sub.append(art6); sub.scrollIntoView({ block: 'start' });
  };
  const art5 = pregunta(q5, { etiqueta: 'Pregunta 5 · encuentra el error', alResponder: () => botonSig('Pasar al día 2', dia2, art5).hidden = false });
  r.append(art5);
}

function p6() {
  sinEscena();
  const r = abrir(6, cabecera(6, 'Lo que te llevas y cuándo vuelve cada pregunta', 'Resumen'));
  r.append(nodo(`<ol class="c-lleva">${LLEVA.map(x => `<li>${x}</li>`).join('')}</ol>`, 'div'));
  r.append(nodo('<div class="c-fila"><a class="c-b c-sec" href="' + PDF.F + '#page=4" target="_blank" rel="noopener">Ver la ficha: Cristaloides y sueros glucosados</a><button type="button" class="c-b c-sec" id="c-ver-modelo">Ver el modelo en el estado de Teresa</button></div><div id="c-modelo-aviso" class="c-aviso" hidden>En la app este botón abre el río y mar con la hemorragia de una mujer al 20 % y 2 L de salino.</div>', 'div'));
  g('c-ver-modelo').addEventListener('click', () => { g('c-modelo-aviso').hidden = false; escena({ ...TERESA, infusiones: SALINO }, { mirar: null }); });
  const filas = [];
  const dato = (etq, id) => { const x = res[id]; if (!x) return; const n = x.n, f = sumarDias(HOY, n); filas.push(`<tr><td>${etq}</td><td class="${x.ok ? 'c-vok' : 'c-vno'}">${x.ok ? 'Acertada' : 'Fallada'}</td><td>${fechaES(f)}<br><small>${dias(n)}</small></td></tr>`); };
  REPASO.forEach((q, i) => dato(`Repaso ${i + 1} · ${q.ficha}`, q.id));
  [['P1 · la clase de hemorragia', 'P1'], ['P2 · cuánto cristaloide', 'P2'], ['P3 · adónde va el salino', 'P3'], ['P4 · qué le contestas al R1', 'P4'], ['P5 · el plan de guardia', 'P5'], ['P6 · el Hto del día 2', 'P6']].forEach(([e, id]) => dato(e, id));
  r.append(nodo(`<h3>Cuándo vuelve cada pregunta (hoy es ${fechaES(HOY)})</h3><div class="c-tabla"><table class="data-table"><thead><tr><th>Pregunta</th><th>Hoy</th><th>Vuelve el</th></tr></thead><tbody>${filas.join('')}</tbody></table></div>
    <p class="c-para">Regla: fallada, vuelve al día siguiente; acertada, a los 3 días si has acertado una vez más de las que has fallado (o ninguna más), a los 7 si dos más y a los 14 si tres o más. Simulado: la maqueta no guarda nada.</p>
    ${notaHTML('Regla nuestra, no de un ensayo', 'Los intervalos 1/3/7/14 días son una decisión de diseño sin ensayo; Kerfoot espaciaba por calendario fijo.')}`, 'div'));
  r.append(nodo(`<div class="c-elige" id="pie-comun"><b>Elige: A · B · C</b>
    <p class="c-para">¿Con cuál te quedas? A · POE en el shock vivo · B · error productivo en el capilar vivo · C · esta (repaso de días atrás + caso que cruza fichas) · o una mezcla (di cuál).</p>
    <div class="c-abc"><a href="a-poe-shock.html">A<small>predecir antes de ver</small></a><a href="b-error-capilar.html">B<small>error y enseñanza</small></a><a href="c-entrelazado-rio.html" class="c-aqui" aria-current="page">C<small>estás aquí</small></a></div>
    <p class="c-para">Esta maqueta (C) mide: entrelazado y repaso espaciado.</p></div>`, 'div'));
}

p1();
window.__c = { res, ir: n => [null, p1, p2, p3, p4, p5, p6][n](), pantalla: () => pantalla, estado: () => ({ estado, D }) };
