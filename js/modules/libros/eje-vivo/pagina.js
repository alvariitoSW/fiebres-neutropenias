// Eje hormonal vivo · la página: estado de la sesión, monitor, dock de mandos (se crean UNA vez y se repintan), topes, guía por paciente y plegables.
// Reutiliza core/tope.js, core/frase-vista.js y core/motion.js (vía dibujo.js). Lo que hace cada mando vive en acciones.js; la física, en modelo.js.
import { crearTope } from '../../../core/tope.js';
import { seguirFrase, verFrase } from '../../../core/frase-vista.js';
import { PRES, CLAVES_PACIENTE, GUIAS, IDEA, IMG, PDF, REF, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, cita } from '../../../data/eje-vivo-data.js';
import { nuevo, leer, topes, clamp, PROD } from './modelo.js';
import { hacer } from './acciones.js';
import { escena, focoSvg, animarEje } from './dibujo.js';
import { montarMayeutica } from './mayeutica.js';
import { montarPruebas } from './pruebas.js';

const num = (x) => String(x).replace('.', ',');
const $ = (id) => document.getElementById('eje-' + id);
const org = (t) => `<span class="org${/ilustrativ/.test(t) ? ' ilu' : ''}">${t}</span>`;
const cit = (c) => (c && c.p ? cita(c.p, c.f) : '');

export function montar(R) {
  let s = nuevo('toribio'), lup = 'sr', vista = 'eje', paso = 0, oculto = false, topeApi = null, firma = '', activos = new Set(), guiaOn = true, may = null, pru = null;
  const todos = (q) => R.querySelectorAll(q);
  const frase = (t, o) => { $('frase-txt').innerHTML = `${t} ${org(o)}`; };

  // Los avisos y sellos de los topes van bajo el monitor y bajo el dibujo, nunca encima ni en el dock (que no pasa de 1/3 de la pantalla).
  function aplicarTopes(L) {
    const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.titulo, t.texto])), nuevas = new Set(lista.map((t) => t.c));
    if (f === firma) { topeApi.refrescar?.(); return lista; } firma = f;
    for (const c of activos) if (!nuevas.has(c)) topeApi.quitar(c);
    for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag ? { p: t.pag, f: t.ficha } : null, origen: t.origen, deshabilita: t.off });
    activos = nuevas;
    // un solo sello a la vista: el primero; los demás quedan como cola (su texto sigue en los avisos y en la frase)
    const ss = [...todos('#eje-sello-zona .tope-sello')]; ss.forEach((e, i) => e.classList.toggle('cola', i > 0));
    plegarAvisos(); topeApi.refrescar?.(); return lista;
  }
  // El aviso que no es el tope abierto (el sello) va plegado en una línea: solo su título; al tocarlo se abre con el texto y la cita.
  function plegarAvisos() {
    for (const a of todos('#eje-avisos-zona .tope-aviso:not([data-plegado])')) {
      const b = a.querySelector('b'), sm = a.querySelector('small'), txt = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.replace(/^⚠\s*/, '')).join('').trim();
      const d = document.createElement('details'), r = document.createElement('summary'), cuerpo = document.createElement('div');
      r.textContent = '⚠ ' + (b ? b.textContent : txt); cuerpo.append(txt); if (sm) cuerpo.append(sm);
      d.append(r, cuerpo); a.replaceChildren(d); a.dataset.plegado = '1';
    }
  }
  function pintar(anima) {
    const L = leer(s), lista = aplicarTopes(L), P = PRES[s.pac], G = GUIAS[s.pac][1], p = G[paso], q = oculto;
    R.classList.toggle('oculta', !!q);   // en una apuesta, los sellos y avisos (que dirían la respuesta) esperan a que contestes
    $('svg').innerHTML = escena(s, L, { lup, vista }) + focoSvg(guiaOn && p ? p.z : null);
    $('m-pa').textContent = q ? '?' : `${L.pas}/${L.pad}`; $('m-pam').textContent = q ? '?' : L.pam.toFixed(0); $('m-fc').textContent = L.fc; $('m-rit').textContent = L.ritmo;
    $('m-t').textContent = num(L.t); $('m-na').textContent = L.na; $('m-gl').textContent = L.gluc; $('m-lac').textContent = num(L.lact); $('m-nor').textContent = num(s.na.toFixed(1)); $('m-dia').textContent = s.dia;
    $('m-pa').parentElement.className = !q && L.pam < 65 ? 'mal' : ''; $('m-pam').parentElement.className = !q && L.pam < 65 ? 'mal' : ''; $('m-t').parentElement.className = L.t > 40 || L.t < 35 ? 'mal' : '';
    for (const b of todos('#eje-chips [data-pre]')) b.setAttribute('aria-pressed', String(b.dataset.pre === s.pac));
    for (const b of todos('[data-lup]')) b.setAttribute('aria-pressed', String(b.dataset.lup === lup));
    for (const b of todos('[data-atd]')) b.setAttribute('aria-pressed', String(b.dataset.atd === s.atd));
    for (const b of todos('[data-bb]')) b.setAttribute('aria-pressed', String(b.dataset.bb === s.bb));
    for (const b of todos('[data-farm]')) b.setAttribute('aria-pressed', String(b.dataset.farm === s.farm));
    for (const b of todos('[data-pat]')) { b.hidden = (b.dataset.pat === 't3tox' && s.pac !== 'sinforoso') || (b.dataset.pat === 'hipoS' && s.pac !== 'obdulia'); b.setAttribute('aria-pressed', String(b.dataset.pat === s.pat)); }
    $('mando-pat').hidden = !(s.pac === 'sinforoso' || s.pac === 'obdulia'); $('mando-farm').hidden = s.pac !== 'policarpo'; $('mando-es').hidden = s.pac !== 'bibiana';
    $('mando-acth').hidden = !['bibiana', 'fulgencio', 'policarpo'].includes(s.pac);
    $('b-vol').textContent = `Suero +500 mL · ${num(s.vol / 1000)} L`; $('o-na').textContent = `NA ${num(s.na.toFixed(1))}`;
    $('o-es').textContent = `Estrés ${s.estres} · ≈${PROD[s.estres]} mg/día`;
    $('b-hc').textContent = s.hc ? 'Hidrocortisona dada ✔' : s.pac === 'lucrecia' ? 'Hidrocortisona 300 mg + 100 mg/8 h' : 'Hidrocortisona 100 mg/8 h'; $('b-hc').setAttribute('aria-pressed', String(!!s.hc));
    $('b-ret').hidden = s.pac !== 'toribio'; $('b-ret').setAttribute('aria-pressed', String(s.ret)); $('b-ret').textContent = s.ret ? 'Retirada gradual en curso ✔' : 'Retirar poco a poco';
    $('b-acth').setAttribute('aria-pressed', String(s.acth)); $('b-acth').textContent = s.acth ? 'Prueba de ACTH hecha ✔' : 'Prueba de ACTH 250 µg';
    $('b-yodo').setAttribute('aria-pressed', String(s.yodo)); $('b-yodo').textContent = s.yodo ? 'Yodo puesto ✔' : 'Yodo 5 gotas/6 h';
    $('b-levo').setAttribute('aria-pressed', String(s.hor === 'levo')); $('b-lio').setAttribute('aria-pressed', String(s.hor === 'lio'));
    $('b-asma').hidden = s.pac !== 'lucrecia'; $('b-asma').setAttribute('aria-pressed', String(s.crisis)); $('b-asma').textContent = s.crisis ? 'Crisis de asma: sí' : 'Crisis de asma: no';
    $('b-mapa').setAttribute('aria-pressed', String(vista === 'mapa')); $('b-mapa').textContent = vista === 'mapa' ? 'Ver el eje' : 'Ver el mapa';
    // las pausas del tope y los botones propios conviven: hc ya dado se apaga solo si no lo apagó otro tope
    $('b-hc').disabled = !!s.hc || $('b-hc').classList.contains('tope-apagado'); $('b-acth').disabled = !!s.acth || $('b-acth').classList.contains('tope-apagado');
    $('fig-cap').innerHTML = `${IMG.pie} ${cita(IMG.pag, IMG.ficha)}`;
    pintarGuia(); if (anima) animarEje($('svg'));
    window.__eje.lista = lista;
  }
  function pintarGuia() {
    const caja = $('guia'), G = GUIAS[s.pac], p = G[1][paso], P = PRES[s.pac]; $('idea').innerHTML = IDEA;
    caja.hidden = !guiaOn || !p; if (caja.hidden) return;
    const k = G[1].length;
    caja.innerHTML = `<h3>${G[0]}</h3><p class="eje-paso">Paso ${paso + 1} de ${k} · ${P.caso}, ${P.e} años</p><p>${p.t}</p><p class="eje-org">${p.o}</p><p>${cita(p.p, p.f)}${p.x ? ' ' + REF[p.x] : ''}</p>`
      + `<div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" class="b" data-g="ant" ${paso ? '' : 'disabled'}>‹ Anterior</button><button type="button" class="b" data-g="sig">${paso < k - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  function irPaso(k) { const G = GUIAS[s.pac][1]; paso = clamp(k, 0, G.length - 1); guiaOn = true; vista = G[paso].v || 'eje'; pintar(true); verFoco(); }
  // Tras cambiar de paso, la página sube lo justo para que la zona señalada quede sobre el dock.
  function verFoco() { requestAnimationFrame(() => requestAnimationFrame(() => { const e = $('svg').querySelector('.foco'), d = $('dock'); if (!e || !d.offsetHeight) return;
    const r = e.getBoundingClientRect(), bajo = innerHeight - d.offsetHeight - 8, dy = r.bottom > bajo ? Math.min(r.bottom - bajo, r.top - 8) : r.top < 8 ? r.top - 8 : 0;
    if (Math.abs(dy) > 1) scrollBy({ top: dy, behavior: 'instant' }); })); }
  function hacerYa(a, v) {
    const r = hacer(s, a, v); if (r.lup) lup = r.lup; if (r.frase) frase(...r.frase); pintar(r.anima); return r;
  }
  function elegir(clave, n = 0, anima = true) {
    if (!PRES[clave]) clave = 'toribio';
    s = nuevo(clave); lup = PRES[clave].lup; oculto = false; guiaOn = true; paso = clamp(n | 0, 0, GUIAS[clave][1].length - 1); vista = GUIAS[clave][1][paso].v || 'eje';
    frase(`${PRES[clave].n}, ${PRES[clave].e} años · ${PRES[clave].caso}. Toca una lupa para ver qué eje falla.`, 'caso inventado · constantes: ilustrativo');
    pintar(anima);
  }
  // Para la prueba y para la Mayéutica (pieza 2): cambia lo que se pide de golpe. `hacer: [mando, valor]` pulsa un mando; `set` fija campos del enfermo.
  function ir(o = {}) {
    if (o.pac) elegir(o.pac, o.paso || 0, false); else if (o.paso != null) { paso = clamp(o.paso, 0, GUIAS[s.pac][1].length - 1); vista = GUIAS[s.pac][1][paso].v || 'eje'; }
    if (o.lup) lup = o.lup; if (o.vista) vista = o.vista; if (o.oculto != null) oculto = !!o.oculto; if (o.guia != null) guiaOn = !!o.guia; if (o.set) Object.assign(s, o.set);
    if (o.frase) frase(...o.frase);
    if (o.hacer) hacerYa(...o.hacer); else pintar(!!o.anima); return leer(s);
  }
  // Explorar | Apuesta | Error | Caso | Preguntas (Mayéutica del motor común). `n` es la apuesta, nota o caso que toca.
  function modoPrueba(m, n = 0) {
    for (const b of todos('[data-modo]')) b.setAttribute('aria-pressed', String(b.dataset.modo === m));
    may?.enPreguntas(m === 'preguntas'); pru?.salir();
    if (m === 'preguntas') { elegir('toribio', 0, false); guiaOn = false; pintar(false); return may.entrar(); }
    if (m === 'explorar') { oculto = false; guiaOn = true; vista = GUIAS[s.pac][1][paso]?.v || 'eje'; return pintar(false); }
    pru.entrar(m, n);
  }

  // ---- montaje (una vez) ----
  $('chips').innerHTML = CLAVES_PACIENTE.map((c) => `<button type="button" class="b" data-pre="${c}" aria-pressed="false">${PRES[c].n}</button>`).join('');
  $('fig-img').src = IMG.ruta;
  $('fuentes').innerHTML = FUENTES.map(([t, o]) => `<li>${t} ${org(o)}</li>`).join('') + `<li><a href="${PDF}" target="_blank" rel="noopener">Abrir el PDF de Marino</a></li>`;
  $('notas').innerHTML = NOTAS.map(([k, t]) => `<p class="para"><b>${k}.</b> ${t}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  topeApi = crearTope({ monitor: $('sello-zona'), dock: $('avisos-zona'), cita: cit });   // los avisos van bajo el dibujo
  R.addEventListener('click', (ev) => {
    const g = ev.target.closest('[data-g]');
    if (g && R.contains(g)) { const a = g.dataset.g, G = GUIAS[s.pac][1], p = G[paso];
      if (a === 'ant') return irPaso(paso - 1);
      if (a === 'sig') { if (paso < G.length - 1) return irPaso(paso + 1); guiaOn = false; return pintar(false); }
      if (a === 'haz') { for (const h of [p.haz]) hacerYa(...h); if (p.z) vista = p.v || vista; return pintar(false); } }
    const t = ev.target.closest('button'); if (!t || !R.contains(t) || t.disabled) return;
    if (t.dataset.modo) return modoPrueba(t.dataset.modo);
    if (t.dataset.pre) { if (R.querySelector('#eje-modos [aria-pressed="true"]:not([data-modo="explorar"])')) modoPrueba('explorar'); return elegir(t.dataset.pre); }
    if (t.dataset.lup) { lup = t.dataset.lup; return pintar(true); }
    if (t.id === 'eje-b-mapa') { vista = vista === 'mapa' ? 'eje' : 'mapa'; return pintar(false); }
    if (t.id === 'eje-paso-a-paso') return animarEje($('svg'));
    if (t.dataset.pest) { for (const x of todos('[data-pest]')) x.setAttribute('aria-selected', String(x === t)); $('dock-circ').hidden = t.dataset.pest !== 'circ'; $('dock-tiro').hidden = t.dataset.pest === 'circ'; return; }
    if (t.id === 'eje-mas') { const ab = $('dock').classList.toggle('abierto'); t.setAttribute('aria-expanded', String(ab)); t.textContent = ab ? 'Menos mandos ▴' : 'Más mandos ▾'; return; }
    if (t.dataset.a && t.closest('#eje-dock')) return hacerYa(t.dataset.a);
    if (t.dataset.farm) return hacerYa('farm', t.dataset.farm);
    if (t.dataset.atd) return hacerYa('atd', t.dataset.atd);
    if (t.dataset.bb) return hacerYa('bb', t.dataset.bb);
    if (t.dataset.pat != null && t.closest('#eje-dock')) return hacerYa('pat', t.dataset.pat);
  });
  const ajustar = () => R.style.setProperty('--eje-dock-h', $('dock').offsetHeight + 'px');
  new ResizeObserver(ajustar).observe($('dock')); ajustar();
  seguirFrase(R, () => $('frase'), { dock: () => $('dock') });
  // al tocar un mando o un paciente, el dibujo sigue a la vista sobre el dock; los sellos y avisos nuevos empujan el dibujo hacia abajo un instante después, por eso se mira otra vez
  R.addEventListener('click', () => { for (const ms of [0, 160]) setTimeout(() => verFrase($('svg').parentElement, { dock: () => $('dock'), subir: true }), ms); });
  window.__eje = { get s() { return s; }, get vista() { return vista; }, get lup() { return lup; }, leer: () => leer(s), topes: () => topes(s, leer(s)), ir, ESTADOS: PRES, modoPrueba, pintar, elegir };
  pru = montarPruebas({ $, ir }); may = montarMayeutica({ R, $, org, ir, leer, modoPrueba }); may.cargar();
  return { abrir: (clave, n) => { if (R.querySelector('#eje-modos [aria-pressed="true"]:not([data-modo="explorar"])')) modoPrueba('explorar'); elegir(clave, n, true); }, pintar };
}
