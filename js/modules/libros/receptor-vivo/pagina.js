// La página del receptor vivo (maqueta b3-receptor): estado, mandos, dock, guía, fichas, bucle y Mayéutica. Es el punto de entrada.
import { crearPlanoGrande } from '../../../core/plano-grande.js';
import * as I from '../../../core/dibujo-iso.js';
import { instalarMonitor } from '../../../core/monitor.js';
import { bombaMini } from '../../../core/bomba.js';
import { $, REDUCIR } from './util.js';
import { C, CELULAS, ESTADO, ESTADOS, FAMILIAS, FARMACOS, FICHA, IMG52, NS, OBJETIVOS, PACIENTES, RECEPTORES, UMI, chip, cita, citaCorta, clamp, coma, efecto, org, pag } from '../../../data/receptor-vivo-data.js';
import { AC, BANCO, R_REF, VIA, actualizarEscena, cilindro, cuenta, dibHaz, f2, geomTubo, icoForma, llaveMini, marcas, montarEscena, part } from './dibujos.js';
import { animarLupa, aplicarCascada, granulos, heroe, heroeActual, heroeDe, lupaCel, lupaHecha, montarLupa, objetivosLupa, prensa, seguir, setHeroe, setLupaCel } from './lupa.js';
import { R, SEG, llenarEstatico, monitor, montarTrazas, muestra, pausado, pintarCifras, pintarTrazas, seguirLactato, setPausado, setR, setTapado, tapado } from './trazas.js';
import { crearTope } from '../../../core/tope.js';
import { calcularTopes, fraseTope } from './topes.js';
/* ============================================================
   9. Estados, lupas, bombas (pieza común dibujada), frase viva, explicación guiada, fichas y notas
   ============================================================ */
I.instalarGrabado(); instalarMonitor();
export const ST = { id: 'na-baja', pac: 'paulino', f: {}, reg: {}, cas: 'facil' };
export function ponerEstado(id, conservar) {
  const E = ESTADO[id]; if (!E) return;
  pararPasoAPaso();
  Object.assign(ST, { id, pac: E.pac, f: { ...E.f }, reg: { ...E.reg } });
  setHeroe(null); setLupaCel(E.lupa); V.rl = null;
  $('pieza-info').innerHTML = ''; $('detalle-fila').hidden = true;
  setR(efecto(ST));
  montarEscena(R, rlObjetivo(R)); montarLupa(lupaCel, R);
  pintarFamilias(); pintarCelulas(); pintarDock(); actualizar(); llenarEstatico();
  if (!conservar) infoCelula();
}
export function rlObjetivo(R) { return R.P.organo === 'bronquio' ? 30 * R.radioBDib : R_REF * R.radioDib; }
export function pintarFamilias() {
  // si ya están dibujados, solo se cambia cuál está marcado (el botón tocado no se sustituye)
  const ya = $('familias').querySelectorAll('[data-estado]');
  if (ya.length === ESTADOS.length) { ya.forEach(b => b.setAttribute('aria-pressed', String(ST.id === b.dataset.estado))); return; }
  $('familias').innerHTML = Object.entries(FAMILIAS).map(([k, nom]) => `<div class="rcv-familia"><h3>${nom}</h3><div class="rcv-estados">${ESTADOS.filter(e => e.fam === k).map(e => `<button type="button" data-estado="${e.id}" aria-pressed="${ST.id === e.id}">${e.tit}<small>${e.sub}</small></button>`).join('')}</div></div>`).join('');
}
$('familias').addEventListener('click', ev => { const b = ev.target.closest('[data-estado]'); if (b) { ponerEstado(b.dataset.estado); verLupa(); } });
export function celulasDe(R) {
  const l = [R.P.organo === 'bronquio' ? 'liso-bronquio' : 'liso-arteriola', 'miocito', 'nodo'];
  if (R.P.mediadores) l.push('mastocito');
  return l;
}
export function pintarCelulas() {
  $('celulas').innerHTML = celulasDe(R).map(c => `<button type="button" data-cel="${c}" aria-pressed="${lupaCel === c}">${CELULAS[c].corto}</button>`).join('');
  $('fig2-tit').textContent = CELULAS[lupaCel].nombre;
  $('fig524').hidden = lupaCel !== 'miocito';
}
export function ponerLupa(cel) {
  if (!CELULAS[cel]) return;
  setLupaCel(cel); setHeroe(null); montarLupa(cel, R); pintarCelulas(); infoCelula(); pintarLeyenda(); lecturas();
}
$('celulas').addEventListener('click', ev => { const b = ev.target.closest('[data-cel]'); if (b) ponerLupa(b.dataset.cel); });
$('escena').addEventListener('click', ev => {
  const g = ev.target.closest('[data-celula]'); if (!g || tapado) return;
  ponerLupa(g.dataset.celula === 'liso-arteriola' && R.P.organo === 'bronquio' ? 'liso-bronquio' : g.dataset.celula);
  $('zona-lupa').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' });
});
// Las piezas de la lámina 2: tocar una dice su nombre y una línea, con su cita
export const PIEZAS = {
  cerradura: () => { const r = RECEPTORES[heroeActual]; return [`<b>La cerradura ${r.nombre}.</b> ${r.linea} Los pines y la línea de corte son la imagen: la llave buena los alinea y el cilindro gira; el tapón entra y no.`, r.c, r.c2, 'la imagen de los pines: ilustrativo']; },
  carro: () => [`<b>El carro: la proteína G.</b> Une la cerradura con la máquina de dentro. En el corazón, la proteína Gs (la nombra el Manual UMI; Marino dice que el receptor está «unido» a la adenilato ciclasa); en la célula lisa, la Gq.`, C.glucMec, C.umi, 'la Gq: fisiología general'],
  prensa: () => [`<b>La prensa: la adenilato ciclasa.</b> En la cara interna de la membrana, convierte el ATP en AMPc.`, C.glucMec],
  bandeja: () => [`<b>La bandeja del AMPc.</b> Cuanto más AMPc, más sube el flotador y más se abre la puerta del calcio.`, C.glucMec],
  pde: () => [`<b>La trituradora: la fosfodiesterasa (PDE).</b> Degrada el AMPc a AMP. La milrinona la atasca (la cuña de oro): el AMPc se acumula, también con el β tapado.`, C.ipde, C.milri],
  mano: () => [`<b>La palanca: la proteína cinasa.</b> El AMPc la activa y favorece la entrada de calcio por la membrana.`, C.glucMec],
  canal: () => [`<b>El canal de calcio.</b> Por aquí entra el calcio que hace tirar a las proteínas contráctiles. Los calcioantagonistas lo cierran (Fig. 52.4).`, C.fig524],
  fuerza: () => [`<b>El sarcómero.</b> El calcio hace interactuar a las proteínas contráctiles: más fuerza de contracción. Aquí se acorta en cada latido.`, C.glucMec],
  ritmo: () => [`<b>El péndulo del nodo.</b> La misma cadena da al β su efecto cronotrópico: el nodo late más deprisa.`, C.glucMec],
  reticulo: () => [`<b>El depósito de calcio (el retículo).</b> El IP₃ abre su válvula y el calcio sale a la célula.`, C.naRec, null, 'fisiología general: Marino no dibuja esta cadena'],
  acorta: () => [`<b>El trinquete de la miosina.</b> Con el calcio, la miosina tira de la actina y la célula se acorta: el anillo se cierra. El β₂ (y más AMPc) levanta el gatillo y la célula se afloja.`, C.naRec, null, 'fisiología general'],
  granulos: () => [`<b>Los gránulos del mastocito.</b> La adrenalina, por sus receptores β, frena la salida de sus mediadores: es el único fármaco que para la reacción.`, C.anaGluc, C.anaAdre],
  duda: () => [`<b>Lo de en medio.</b> Qué hay entre la cerradura β y los gránulos, y cómo devuelve aquí el glucagón la respuesta: la fuente no lo dice.`, C.anaGluc, null, 'la fuente no lo dice'],
};
export function infoCelula() {
  const c = CELULAS[lupaCel];
  $('pieza-info').innerHTML = `<span><b>${c.nombre}:</b> lleva ${c.receptores.map(r => RECEPTORES[r].nombre).join(', ')}${c.canal ? ' y el canal de calcio' : ''}; lo que hace sale por ${c.salida}. ${chip(c.c)}</span>${cita(c.c)}`;
}
$('lupa').addEventListener('click', ev => {
  if (tapado) return;
  const sec = ev.target.closest('[data-pieza="sec"]');
  if (sec) { setHeroe(sec.dataset.cerr); montarLupa(lupaCel, R); mostrarPieza('cerradura'); lecturas(); return; }
  const p = ev.target.closest('[data-pieza]'); if (p) mostrarPieza(p.dataset.pieza);
});
export function mostrarPieza(k) {
  const fn = PIEZAS[k]; if (!fn) return;
  const [t, c1, c2, o] = fn();
  $('pieza-info').innerHTML = `<span>${t} ${chip(c1)}${c2 ? ' ' + chip(c2) : ''}${o ? ' ' + org(o, o.includes('ilustrativo')) : ''}</span>${cita(c1)}${c2 ? cita(c2) : ''}`;
}
export function pintarLeyenda() {
  const recs = CELULAS[lupaCel].receptores;
  $('leyenda').innerHTML = recs.map(r => `<span>${icoForma(RECEPTORES[r].forma, 'boca')}${RECEPTORES[r].nombre}</span>`).join('')
    + `<span>${icoForma('triangulo', 'oro')}fármaco</span><span>${icoForma('triangulo', 'crema')}del propio cuerpo</span><span>${icoForma('triangulo', 'ciega')}tapón (no abre)</span>`
    + `<span><svg viewBox="-6 -6 12 12" aria-hidden="true">${part('ca', 0, 0, 3.4)}</svg>Ca²⁺</span>`
    + `<span>${org('cuántas llaves: ilustrativo', true)}</span>`;
}
/* ---- La cascada: Fácil | Completa y el paso a paso (recorre las piezas en orden) ---- */
document.querySelector('.rcv-barra-lupa .rcv-seg').addEventListener('click', ev => {
  const b = ev.target.closest('[data-cas]'); if (!b) return;
  pararPasoAPaso(); ST.cas = b.dataset.cas;
  document.querySelectorAll('[data-cas]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cas === ST.cas)));
  aplicarCascada(); borrarSenal();
});
export const RECORRIDO = { gs: ['cerradura', 'carro', 'prensa', 'bandeja', 'pde', 'mano', 'canal'], gq: ['cerradura', 'carro', 'reticulo', 'acorta'], 'gs-relaja': ['cerradura', 'carro', 'prensa', 'bandeja', 'acorta'], duda: ['cerradura', 'duda', 'granulos'] };
export const SEL_PIEZA = { cerradura: '#rcv-l-cerr', carro: '#rcv-l-carro', prensa: '#rcv-l-prensa', bandeja: '#rcv-l-bandeja', pde: '#rcv-l-pde', mano: '#rcv-l-mano', canal: '#rcv-l-canal', reticulo: '#rcv-l-ret', acorta: '#rcv-l-trinq', fuerza: '#rcv-l-trinq', ritmo: '#rcv-l-trinq', granulos: '#rcv-l-gran', duda: '#rcv-l-duda' };
export let pasoTimer = null, pasoI = 0;
export function pararPasoAPaso() { clearInterval(pasoTimer); pasoTimer = null; $('paso-a-paso').textContent = '▶ Paso a paso'; }
export function darPaso() {
  const C2 = CELULAS[lupaCel], lista = [...RECORRIDO[C2.maquinaria]];
  if (C2.efector === 'fuerza' || C2.efector === 'ritmo') lista.push(C2.efector);
  const k = lista[pasoI % lista.length]; mostrarPieza(k); senalar([SEL_PIEZA[k]], true); pasoI++;
  return pasoI >= lista.length;
}
$('paso-a-paso').addEventListener('click', () => {
  if (pasoTimer) { pararPasoAPaso(); return; }
  if (ST.cas !== 'completa') { ST.cas = 'completa'; document.querySelectorAll('[data-cas]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cas === 'completa'))); aplicarCascada(); }
  if (REDUCIR) { darPaso(); return; }
  pasoI = 0; darPaso(); $('paso-a-paso').textContent = '■ Parar';
  pasoTimer = setInterval(() => { if (darPaso()) { setTimeout(pararPasoAPaso, 2400); clearInterval(pasoTimer); } }, 2600);
});
/* ---- Las bombas de jeringa: la pieza común (js/core/bomba.js), de frente; aquí, los tramos de la fuente, el conversor
   por kilo y el candado ---- */
export const bombaDib = (valorTxt, unidad, avance, candado) => bombaMini({ l1: unidad, l2: valorTxt, avance, candado });
// El HTML de la bomba (o del interruptor) de un fármaco del estado: lo usan el dock y la explicación guiada
export function bombaHTML(k) {
  const E = ESTADO[ST.id], P = PACIENTES[ST.pac], F = FARMACOS[k], reg = F.regimen[E.reg[k]];
  if (reg.tog) return `<button type="button" class="rcv-tog" data-tog="${k}" id="rcv-bomba-${k}" aria-pressed="${!!ST.f[k]}">${F.corto}<small>${reg.txt}</small></button>`;
  if (reg.candado && F.unidad === 'on') return `<div class="rcv-bomba" id="rcv-bomba-${k}">${bombaDib(ST.f[k] ? 'en casa' : 'sin él', 'oral', ST.f[k] ? 0.6 : 0, true)}
      <div class="rcv-bomba-mando"><div class="rcv-bomba-cab"><b>${F.corto} · ${ST.f[k] ? 'lo toma' : 'apartado (solo en la explicación)'}</b></div><div class="rcv-candado"><span>${reg.txt} ${org(reg.chip)}</span></div></div></div>`;
  if (reg.candado) return `<div class="rcv-bomba" id="rcv-bomba-${k}">${bombaDib(ST.f[k] ? coma(reg.fija, 2) : '0', F.unidad, ST.f[k] ? 0.6 : 0, true)}
      <div class="rcv-bomba-mando"><div class="rcv-bomba-cab"><b>${F.corto} · ${ST.f[k] ? coma(reg.fija, 2) + ' ' + F.unidad : 'apagada'}</b></div><div class="rcv-candado"><span>${reg.txt} ${org(reg.chip)}</span><button type="button" class="rcv-tog" data-fija="${k}" aria-pressed="${!!ST.f[k]}" style="margin-left:auto">${ST.f[k] ? 'Quitar' : 'Añadir'}</button></div></div></div>`;
  if (reg.fija !== undefined) return '';
  const d = ST.f[k] ?? 0, pct = v => ((v - reg.min) / (reg.max - reg.min) * 100).toFixed(1) + '%';
  const uVista = reg.unidadVista || F.unidad, conv = conversor(k, d, reg, P), dec = reg.paso < 0.05 ? 3 : reg.paso < 1 ? 2 : 0;
  const tramo = reg.tramos.find(([a, b]) => d >= a && d <= b) || reg.tramos[0];
  return `<div class="rcv-bomba" id="rcv-bomba-${k}">${bombaDib(coma(d, dec), uVista, clamp((d - reg.min) / (reg.max - reg.min), 0, 1), false)}
      <div class="rcv-bomba-mando"><div class="rcv-bomba-cab"><b>${F.corto} · ${coma(d, dec)} ${uVista}</b><span>${conv}</span></div>
      <div class="rcv-tramos" aria-hidden="true">${reg.tramos.map(([a, b, , col]) => `<i style="width:${pct(b - a + reg.min)};background:var(${col});opacity:.55"></i>`).join('')}</div>
      <input type="range" data-dosis="${k}" min="${reg.min}" max="${reg.max}" step="${reg.paso}" value="${d}" aria-label="${F.nombre} en ${uVista}">
      <div class="rcv-bomba-marcas" aria-hidden="true">${reg.marcas.map(v => `<span style="left:${pct(v)}">${coma(v, v < 1 && v > 0 ? (v * 100 % 10 ? 3 : 1) : 0)}</span>`).join('')}</div>
      <span class="rcv-bomba-tramo-txt">${tramo[2] || '&nbsp;'} ${org(reg.chip)}</span></div></div>`;
}
export function pintarDock() {
  const E = ESTADO[ST.id], h = [], togs = [], fijas = [];
  if (E.pacientes) h.push(`<div class="rcv-seg" role="group" aria-label="Paciente">${E.pacientes.map(p => `<button type="button" data-pac="${p}" aria-pressed="${ST.pac === p}">${PACIENTES[p].nombre}<small>${PACIENTES[p].chip}</small></button>`).join('')}</div>`);
  for (const k of Object.keys(E.reg)) {
    const F = FARMACOS[k], reg = F.regimen[E.reg[k]], fijo = (E.fijos || []).includes(k);
    if (fijo || (reg.fija !== undefined && !reg.candado)) {
      const val = reg.fija !== undefined && !reg.candado ? coma(reg.fija) : coma(ST.f[k], ST.f[k] < 1 ? 2 : 0);
      fijas.push(`${F.corto} ${val} ${F.unidad} ${org(reg.fija !== undefined && !reg.candado ? reg.chip : 'del caso')}`); continue; }
    if (reg.tog) togs.push(bombaHTML(k)); else h.push(bombaHTML(k));
  }
  if (togs.length) h.push(`<div class="rcv-fila">${togs.join('')}</div>`);
  if (fijas.length) h.push(`<p class="rcv-dock-nota">Fijas en este estado: ${fijas.join(' · ')}</p>`);
  $('dock-explorar').innerHTML = h.join('');
  medirDock();
}
// El conversor por kilo: µg/min ↔ µg/kg/min con el peso del paciente
export function conversor(k, d, reg, P) {
  const F = FARMACOS[k];
  if (reg.porKg && F.unidad === 'µg/min') return `= ${coma(d * P.peso, 0)} µg/min con ${P.peso} kg`;
  if (reg.porKg) return `= ${coma(d * P.peso, d * P.peso < 100 ? 1 : 0)} µg/min con ${P.peso} kg`;
  if (F.unidad === 'µg/min') return `= ${coma(d / P.peso, 2)} µg/kg/min con ${P.peso} kg`;
  return '';
}
// En el móvil, lo que cambia al tocar un mando (la lupa) tiene que verse sin desplazarse: si queda bajo el pliegue o bajo la barra, se acerca de golpe
function verLupa() {
  const f = $('fig2').getBoundingClientRect(), tope = $('frase').getBoundingClientRect().top;
  const vis = Math.max(0, Math.min(f.bottom, tope) - Math.max(f.top, 0)) / f.height;
  if (vis >= 0.6) return;
  const libre = tope; scrollBy({ top: f.top - Math.max(0, (libre - f.height) / 2), behavior: 'instant' });
}
['dock-explorar'].forEach(id => $(id).addEventListener('click', () => verLupa()));
$('monitor').addEventListener('click', () => verLupa());
$('dock-explorar').addEventListener('input', ev => {
  verLupa();
  const i = ev.target.closest('[data-dosis]'); if (!i) return;
  ST.f[i.dataset.dosis] = +i.value; actualizar(); refrescarBomba(i.dataset.dosis);
});
export function refrescarBomba(k) {
  const b = $('bomba-' + k); if (!b) return;
  const E = ESTADO[ST.id], reg = FARMACOS[k].regimen[E.reg[k]], d = ST.f[k], F = FARMACOS[k], uVista = reg.unidadVista || F.unidad, P = PACIENTES[ST.pac];
  const tramo = reg.tramos.find(([a, bb]) => d >= a && d <= bb) || reg.tramos[0];
  const txt = coma(d, reg.paso < 0.05 ? 3 : reg.paso < 1 ? 2 : 0);
  b.querySelector('.rcv-bomba-cab').innerHTML = `<b>${F.corto} · ${txt} ${uVista}</b><span>${conversor(k, d, reg, P)}</span>`;
  b.querySelector('.rcv-bomba-tramo-txt').innerHTML = `${tramo[2] || '&nbsp;'} ${org(reg.chip)}`;
  b.querySelector('svg').outerHTML = bombaDib(txt, uVista, clamp((d - reg.min) / (reg.max - reg.min), 0, 1), false);
}
$('dock-explorar').addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.tog) ST.f[b.dataset.tog] = ST.f[b.dataset.tog] ? 0 : (FARMACOS[b.dataset.tog].regimen[ESTADO[ST.id].reg[b.dataset.tog]].dosisModelo ?? 1);
  else if (b.dataset.fija) { const reg = FARMACOS[b.dataset.fija].regimen[ESTADO[ST.id].reg[b.dataset.fija]]; ST.f[b.dataset.fija] = ST.f[b.dataset.fija] ? 0 : reg.fija; }
  else if (b.dataset.pac) { ST.pac = b.dataset.pac; }
  else return;
  actualizar(); pintarDock();
});
$('frase').addEventListener('click', () => { $('frase').classList.toggle('rcv-abierta'); medirDock(); });
$('pausa').addEventListener('click', () => { setPausado(!pausado); $('pausa').setAttribute('aria-pressed', String(pausado)); $('pausa').textContent = pausado ? 'Seguir' : 'Pausa'; });
export function medirDock() { requestAnimationFrame(() => { document.documentElement.style.setProperty('--rcv-dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--rcv-frase-h', ($('frase').hidden ? 0 : $('frase').offsetHeight) + 'px'); }); }
export function pintarFrase() {
  const E = ESTADO[ST.id], [t, c] = E.frase(ST, R);
  let extra = '';
  if (ST.id === 'vasopresina-sano' && ST.pac === 'paulino') extra = ' (En el séptico se añade a la noradrenalina; aquí va sola para ver su efecto.)';
  if (ST.id === 'vasopresina-sano' && ST.pac === 'sano') extra = ' La dosis de los voluntarios, la fuente no la da.';
  $('frase-txt').innerHTML = `${t}${extra} ${chip(c)}${fraseTope(calcularTopes(ST))}`;
  medirDock();
}
export function lecturas() {
  const bron = R.P.organo === 'bronquio', cel = bron ? 'liso-bronquio' : 'liso-arteriola';
  if (tapado) { $('fig1-lect').innerHTML = '?'; $('fig2-lect').innerHTML = '?'; return; }
  if (bron) { const c = cuenta(R, cel, 'beta2', 10); $('fig1-lect').innerHTML = `β₂ con llave ${c.llaves}/10<small>luz ${Math.round(100 * R.radioB)} % de la de un bronquio relajado · ilustrativo</small>`; }
  else { const a = cuenta(R, cel, 'alfa1', 12), b = cuenta(R, 'miocito', 'beta1', 6);
    const txt = (nom, c, n) => c.tapones ? `${nom} tapadas ${c.tapones}/${n}` : `${nom} ${c.llaves}/${n}`;
    $('fig1-lect').innerHTML = `${txt('α₁', a, 12)} · ${txt('β₁', b, 6)}<small>radio ${Math.round(100 * R.radio)} % · fuerza ×${coma(R.F, 2)} · ilustrativo</small>`; }
  const O = objetivosLupa(R), est = O.tapon ? 'tapada' : O.llave && O.giro ? 'gira' : O.llave ? 'llave sin giro' : 'cerrada';
  const m = R.A.maq[lupaCel] || {}, maq = CELULAS[lupaCel].maquinaria;
  const sub = maq === 'gs' ? `AMPc ×${coma(m.ampc / 0.2, 1)}` : maq === 'gq' ? `calcio del depósito ×${coma((m.ca ?? 0.2) / 0.2, 1)}` : maq === 'gs-relaja' ? `AMPc ×${coma(m.ampc / 0.2, 1)}` : `gránulos fuera ${Math.round(100 * R.A.maq.mastocito.suelta)} %`;
  $('fig2-lect').innerHTML = `${RECEPTORES[heroeActual].nombre}: ${est}<small>${sub} · ilustrativo</small>`;
}
// Los topes de los mandos (topes.js): avisos ámbar bajo los mandos y sellos en el monitor, con su origen
const cajaTope = document.createElement('div'); cajaTope.className = 'rcv-dock-in'; cajaTope.id = 'rcv-dock-topes'; $('dock').append(cajaTope);
const tope = crearTope({ monitor: $('monitor'), dock: cajaTope, cita });
const topeVisto = {};
function aplicarTopes() {
  const hay = calcularTopes(ST), claves = new Set([...Object.keys(hay), ...Object.keys(topeVisto)]);
  for (const k of claves) {
    const t = hay[k], firma = t ? JSON.stringify(t) : '';
    if (topeVisto[k] === firma || (!t && !topeVisto[k])) continue;
    if (t) { topeVisto[k] = firma; tope.poner(k, t); } else { delete topeVisto[k]; tope.quitar(k); }
  }
  medirDock();
}
export function actualizar() {
  setR(efecto(ST));
  pintarCifras();
  if (lupaHecha !== lupaCel + heroeDe(lupaCel, R)) { if (!heroe) montarLupa(lupaCel, R); }
  if (modo === 'explorar') { pintarFrase(); pintarFuentes(); pintarFichas(); }
  $('mon-quien').textContent = `Monitor · ${R.P.nombre}`;
  $('ficha-pac').innerHTML = `${R.P.corta} ${org(R.P.del === 'caso' ? 'cifras de partida: del caso' : 'cifras: ilustrativo', true)}`;
  $('fig1-tit').textContent = R.P.organo === 'bronquio' ? 'El bronquio y el corazón, una misma vía' : R.P.lecho === 'coronaria' ? 'La coronaria y el corazón' : R.P.mediadores ? 'Arteriola con su mastocito, y el corazón' : 'Dos órganos, una misma vía';
  lecturas(); pintarLeyenda(); aplicarTopes();
  if (REDUCIR || pausado) { llenarEstatico(); }
}
/* ---- La explicación guiada (como core/explicacion-guiada.js): cada paso pone el estado y señala el dibujo ---- */
export let guia = null, gi = 0, modo = 'explorar';
export function abrirGuia(g) { pararPasoAPaso(); guia = g; gi = 0; $('dock-explorar').innerHTML = ''; $('dock-explorar').hidden = true; $('dock-estudio').hidden = true; $('dock-guia').hidden = false; $('frase').hidden = true; pintarGuia(); }
export function cerrarGuia() { borrarSenal(); guia = null; $('dock-guia').hidden = true; $('frase').hidden = modo !== 'explorar'; if (modo === 'explorar') { $('dock-explorar').hidden = false; pintarDock(); } else $('dock-estudio').hidden = false; medirDock(); }
export function aplicarSet(set) {
  if (!set) return;
  if (set.pac) ST.pac = set.pac;
  if (set.f) Object.assign(ST.f, set.f);
  if (set.cas && set.cas !== ST.cas) { ST.cas = set.cas; document.querySelectorAll('[data-cas]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cas === ST.cas))); }
  setR(efecto(ST));
  if (set.lupa && set.lupa !== lupaCel) { setLupaCel(set.lupa); setHeroe(null); montarLupa(lupaCel, R); pintarCelulas(); infoCelula(); pintarLeyenda(); }
  else if (set.f || set.pac) { setHeroe(null); montarLupa(lupaCel, R); }
  aplicarCascada(); actualizar(); llenarEstatico();
}
export function pintarGuia() {
  const p = guia.pasos[gi], n = guia.pasos.length;
  aplicarSet(p.set);
  $('dock-guia').innerHTML = `<div class="rcv-guia rcv-entra"><div class="rcv-guia-cab"><span class="rcv-guia-n">Paso ${gi + 1} de ${n}</span><span class="rcv-guia-tit">${guia.tit}</span><button type="button" class="rcv-guia-x" id="rcv-guia-x" aria-label="Cerrar la explicación">×</button></div>
    <p class="rcv-guia-txt">${p.t} ${chip(p.c)}${p.c2 ? ' ' + chip(p.c2) : ''}${p.org ? ' ' + org(p.org, p.org === 'ilustrativo') : ''}</p>${cita(p.c)}${bombasDelPaso(p)}
    <div class="rcv-guia-nav"><button type="button" class="rcv-guia-b" id="rcv-guia-ant" ${gi === 0 ? 'disabled' : ''}>← Atrás</button><span class="rcv-guia-puntos">${guia.pasos.map((_, i) => `<i class="${i < gi ? 'rcv-hecho' : i === gi ? 'rcv-aqui' : ''}"></i>`).join('')}</span><button type="button" class="rcv-guia-b rcv-prim" id="rcv-guia-sig">${gi === n - 1 ? 'Hecho' : 'Siguiente →'}</button></div></div>`;
  $('dock-guia').querySelectorAll('.rcv-guia-bomba input, .rcv-guia-bomba button').forEach(e => { e.disabled = true; });
  $('guia-x').onclick = cerrarGuia; $('guia-ant').onclick = () => { gi--; pintarGuia(); };
  $('guia-sig').onclick = () => { if (gi === n - 1) cerrarGuia(); else { gi++; pintarGuia(); } };
  medirDock();
  // señalar cuando el dibujo ya está en su sitio (las piezas se mueven con calma)
  setTimeout(() => senalar(p.r), REDUCIR ? 30 : 420);
}
export function bombasDelPaso(p) {
  const ks = (p.r || []).filter(r => r.startsWith('#rcv-bomba-')).map(r => r.slice(11)).filter(k => ESTADO[ST.id].reg[k]);
  return ks.length ? `<div class="rcv-guia-bomba">${ks.map(bombaHTML).join('')}</div>` : '';
}
export function borrarSenal() { document.querySelectorAll('.rcv-guia-anillo').forEach(e => e.remove()); document.querySelectorAll('.rcv-guia-marco').forEach(e => e.classList.remove('rcv-guia-marco')); }
export function senalar(sels, sinScroll) {
  borrarSenal(); let primero = null;
  for (const s of sels || []) {
    for (const el of document.querySelectorAll(s)) {
      if (!el.getClientRects().length) continue;
      const svg = el.ownerSVGElement;
      if (svg && svg.closest('.rcv-dock')) { el.closest('.rcv-bomba, .rcv-tog')?.classList.add('rcv-guia-marco'); continue; }
      if (svg) {
        let b; try { b = el.getBBox(); } catch { continue; }
        if (!b.width && !b.height) continue;
        const m = svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
        const xs = [b.x, b.x + b.width].flatMap(x => [b.y, b.y + b.height].map(y => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]));
        const x0 = Math.min(...xs.map(p => p[0])), x1 = Math.max(...xs.map(p => p[0])), y0 = Math.min(...xs.map(p => p[1])), y1 = Math.max(...xs.map(p => p[1]));
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('class', 'rcv-guia-anillo'); r.setAttribute('x', x0 - 3); r.setAttribute('y', y0 - 3); r.setAttribute('width', x1 - x0 + 6); r.setAttribute('height', y1 - y0 + 6); r.setAttribute('rx', 6);
        svg.appendChild(r); primero = primero || r;
      } else { el.classList.add('rcv-guia-marco'); primero = primero || el; }
    }
  }
  if (primero && !sinScroll) {
    const caja2 = primero.getBoundingClientRect(), alto = innerHeight - $('dock').offsetHeight;
    if (caja2.top < 8 || caja2.bottom > alto - 8) scrollBy({ top: caja2.top - (alto - caja2.height) / 2, behavior: REDUCIR ? 'auto' : 'smooth' });
  }
}
$('explicame').addEventListener('click', () => abrirGuia(ESTADO[ST.id].guia));
/* ---- Las fichas de los fármacos del estado, las fuentes (lista), notas, profundizar, crecimiento y decidir ---- */
export function pintarFichas() {
  const E = ESTADO[ST.id];
  $('fichas-farmaco').innerHTML = Object.keys(E.reg).map(k => {
    const F = FARMACOS[k], fi = F.ficha;
    const rec = fi.receptores.map(([t, ...cs]) => `<span>${t} ${cs.map(citaCorta).join(' ')}</span>`);
    const [fun, ...fc] = fi.funcion, [adv, ...ac] = fi.adversos;
    return `<details class="rcv-plegable rcv-farmaco"><summary>${F.nombre}<small>${F.sub}</small></summary><dl class="rcv-kv">
      <dt>Qué cerradura abre o tapa</dt><dd>${rec.join('')}</dd>
      <dt>Dosis</dt><dd><ul class="rcv-dosis-lista">${fi.dosis.map(([t, ...cs]) => `<li><span>${t} ${cs.map(citaCorta).join(' ')}</span></li>`).join('')}</ul></dd>
      <dt>Para qué</dt><dd><span>${fun} ${fc.map(citaCorta).join(' ')}</span></dd>
      <dt>Efectos adversos</dt><dd><span>${adv} ${ac.map(citaCorta).join(' ')}</span></dd>
      <dt>Otra fuente</dt><dd>${fi.umi ? `<div class="rcv-otra-fuente"><span><b>Manual UMI:</b> ${fi.umi} <span class="rcv-org rcv-otra">otra fuente</span> ${citaCorta(C.umi)}</span></div>` : '<span>El Manual UMI no lo trata en su tabla.</span>'}</dd>
    </dl></details>`;
  }).join('');
}
export function pintarFuentes() {
  const E = ESTADO[ST.id], vistos = new Set(), items = [];
  const mete = c => { if (!c) return; const k = c.f + c.id + c.sitio; if (vistos.has(k)) return; vistos.add(k); items.push(c); };
  E.guia.pasos.forEach(p => { mete(p.c); mete(p.c2); });
  if (OBJETIVOS[R.P.obj]) mete(OBJETIVOS[R.P.obj].cita);
  $('lista-fuentes').innerHTML = items.map(c => `<li><span>${FICHA[c.f][3] ? `Marino, ${c.sitio} (${FICHA[c.f][4]}${pag(c.p)})` : 'Manual UMI, fármacos vasoactivos (otra fuente)'}</span>${cita(c)}</li>`).join('');
  $('explicame-txt').textContent = `${E.guia.pasos.length} pasos: ${E.guia.tit}`;
}
export const NOTAS = [
  { tipo: 'discrepan', txt: '<b>El rango de la noradrenalina.</b> Marino: 5-40 µg/min (Tabla 14.4) y 5-30 µg/min en el shock cardiogénico. El Manual UMI: 0,2-1,3 µg/kg/min, que en Amparo (76 kg) son 15-99 µg/min. Ninguna se elige: cada una con su chip.', c: [C.t144, C.csNa, C.umi] },
  { tipo: 'discrepan', txt: '<b>Cuándo añadir vasopresina.</b> El cap. 14 dice con NA ≥0,2 µg/kg/min; la Tabla 17.2 y el texto del cap. 17, con 0,25-0,5. Para la hidrocortisona, la Tabla 17.2 dice «>0,25» y el texto, «≥0,25».', c: [C.vasopresina, C.t172, C.cortic] },
  { tipo: 'discrepan', txt: '<b>La adrenalina en el séptico.</b> Segunda línea en el cap. 14; tercer vasopresor en la Tabla 17.2.', c: [C.adre, C.t172] },
  { tipo: 'errata', titulo: 'Errata de dosis', txt: '<b>La unidad de la vasopresina.</b> El libro imprime «U/h» (0,01-0,04 en la Tabla 14.4; 0,03-0,04 en la p. 16). La bomba usa 0,03 U/min, la dosis habitual (conocimiento general, no del libro: compruébalo en la ficha técnica).', c: [C.vasoNota] },
  { tipo: 'calla', txt: '<b>Las equivalencias del shock cardiogénico.</b> El libro escribe «5 µg/min (0,05 µg/kg/min)» y «5-30 µg/min (0,05-0,5)» sin decir para qué peso: la primera cuadra con 100 kg y la segunda, con 60. La bomba calcula con el peso del paciente.', c: [C.csNa] },
  { tipo: 'calla', txt: '<b>El subtipo de cada receptor.</b> Marino dice que la NA es un «β débil» y que la adrenalina actúa en el mastocito por receptores β, sin subtipo. El β₁ de la NA, su «sin β₂» y el β₂ del mastocito, de la dobutamina y de los vasos son del Manual UMI, con su chip. Las cadenas Gq e IP₃ son fisiología general.', c: [C.naRec, C.umi] },
  { tipo: 'calla', txt: '<b>El corte β/α de la adrenalina.</b> Marino no da a qué dosis pasa de β a α; el Manual UMI, sí: β a 1-4 µg/min, α por encima de 20.', c: [C.adre, C.umi] },
  { tipo: 'calla', txt: '<b>Por qué la vasopresina no sube la PA en el sano.</b> El libro lo afirma y no lo explica; el dibujo no inventa la causa.', c: [C.vasopresina] },
  { tipo: 'calla', txt: '<b>El lactato de la adrenalina.</b> El libro lo atribuye a más producción aeróbica, sin decir por qué cerradura: el dibujo no le pone llave.', c: [C.adre] },
  { tipo: 'calla', txt: '<b>La dopamina «renal».</b> El libro dice que a ≤3 µg/kg/min sube el flujo del riñón y del intestino; no dice que proteja el riñón.', c: [C.dopa] },
  { tipo: 'calla', txt: '<b>Qué betabloqueante.</b> El libro habla de «betabloqueantes» sin distinguir. El bisoprolol de Begoña es cardioselectivo (fisiología general): cuánto tapa el β del mastocito, la fuente no lo dice. En la isquemia por cocaína tampoco dice cuál: el dibujo tapa β₁ y β₂.', c: [C.anaGluc, C.cocaina] },
  { tipo: 'calla', txt: '<b>El glucagón en el mastocito.</b> El cap. 17 dice que el glucagón puede devolver la respuesta a la adrenalina y remite al cap. 52, que lo explica en el corazón. Cómo lo hace en el mastocito, la fuente no lo dice: el dibujo pone una interrogación.', c: [C.anaGluc, C.glucMec] },
  { tipo: 'calla', txt: '<b>La obstrucción del tracto de salida.</b> El libro contraindica los inotrópicos y prefiere la fenilefrina, sin explicar el mecanismo; que la dobutamina baje aquí la PA es fisiología general, con cifras ilustrativas.', c: [C.csIno, C.csFenil] },
  { tipo: 'calla', txt: '<b>Cuánto mueve cada fármaco.</b> La ficha da la dirección (la NA sube la RVS, la dobutamina sube el gasto y la FC, la milrinona baja la PA), no cuánto. Las cifras tras cada cambio son ilustrativas; las de partida de Amparo, Aurelio y Begoña, de sus casos. El dibujo exagera el cambio de calibre para que se vea: el radio verdadero sale en la lectura.', c: [C.naDosis] },
  { tipo: 'autor', txt: '<b>La fenilefrina en el séptico con FA rápida.</b> «Útil», dice el autor: es su observación, no una recomendación.', c: [C.fenil] },
  { tipo: 'errata', titulo: 'Posible errata', txt: '<b>El potasio del levosimendán.</b> Marino escribe que vasodilata «facilitando la entrada de potasio en el músculo liso vascular». Abrir canales de K⁺ suele describirse como salida de potasio (conocimiento general, no de la fuente; está por comprobar en otra fuente).', c: [C.levo] },
];
export const NOTA_TIPO = { discrepan: ['Las fuentes discrepan', ''], calla: ['La fuente no lo dice', 'rcv-calla'], autor: ['Opinión del autor', 'rcv-autor'], errata: ['Errata de dosis', 'rcv-errata'] };
export const PROFUNDIZAR = [
  { t: 'La angiotensina II: libera vasopresina y frena la fibrinólisis (trombosis 13 % frente a 5 %).', c: C.angio },
  { t: 'El levosimendán: sensibiliza los miofilamentos al calcio y dilata las coronarias; semivida de 80 h.', c: C.levo },
  { t: 'La extravasación de un vasopresor y la fentolamina en la zona, antes de 12 h.', c: C.extrav },
  { t: 'La hidrocortisona en el séptico: facilita la respuesta a las catecolaminas.', c: C.cortic },
  { t: 'La midodrina: oral, para la hipotensión de la diálisis; no acelera la retirada de los vasopresores.', c: C.midodrina },
  { t: 'Los antihistamínicos en la anafilaxia: alivian el picor y la rinorrea, no cambian el curso.', c: C.anaSeg },
];
export const CRECE = [
  ['Manual UMI y El Libro Azul', 'La segunda fuente de cada cerradura, con su chip; la noradrenalina, la angiotensina y la vasopresina del propio cuerpo (llaves crema).'],
  ['Merino Neumología y Marino, potasio', 'El bronquio entero (β₂ y muscarínico) y la célula muscular que mete K⁺ con el salbutamol: enlace con la escena del potasio.'],
  ['Marino, sedación y tóxicos', 'Una célula nueva, la neurona: GABA, opioides y α₂; la naloxona y el flumazenil como tapones que desplazan.'],
  ['Marino, relajantes y miastenia', 'La placa motora: succinilcolina frente a rocuronio; el dantroleno cierra la válvula del depósito.'],
  ['PIF y Guía ESC de IC', 'El túbulo colector (V₂, desmopresina, vaptanes, mineralocorticoide), enlazado con la nefrona viva; betabloqueantes e ivabradina de la IC crónica.'],
  ['Marino, abdomen', 'El lecho esplácnico: terlipresina en el V₁ y el octreótido.'],
  ['El Libro Azul y UCI papers', 'La arteriola pulmonar: el óxido nítrico y el sildenafilo, la misma trituradora que la PDE de la milrinona.'],
];
export function pintarFijos() {
  $('lista-notas').innerHTML = NOTAS.map(n => `<div class="rcv-nota-fuentes"><span class="rcv-nota-tipo ${NOTA_TIPO[n.tipo][1]}">${n.titulo || NOTA_TIPO[n.tipo][0]}</span><span>${n.txt}</span>${n.c.map(cita).join('')}</div>`).join('');
  $('lista-profundizar').innerHTML = PROFUNDIZAR.map(p => `<li><span>${p.t}</span>${cita(p.c)}</li>`).join('');
  $('tabla-crece').innerHTML = `<thead><tr><th>Fuente de la app</th><th>Qué añade al modelo</th></tr></thead><tbody>${CRECE.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody>`;
  const abrir = () => { $('visor-img').src = IMG52; $('visor-img').alt = 'Fig. 52.4 de Marino';
    $('visor-txt').textContent = 'Fig. 52.4: el receptor de glucagón y el receptor β están unidos a la adenilato ciclasa: el ATP pasa a AMPc. El AMPc activa una proteína cinasa que abre la entrada de calcio, y el calcio llega a las proteínas contráctiles. La PDE degrada el AMPc a AMP; la milrinona la frena. Los betabloqueantes tapan el β y los calcioantagonistas cierran el canal.';
    $('visor-cita').innerHTML = cita(C.fig524); $('visor').showModal(); };
  $('fig524').onclick = abrir; $('visor-cerrar').onclick = () => $('visor').close();
}
/* ---- El bucle: curvas, llaves en la vía, latido del haz, medidor, péndulo, calibre y la lámina 2 ---- */
export const V = { rl: null, acorta: -1 };
export let ultimoT = 0, acum = 0;
export function bucle(t) {
  if (!ultimoT) ultimoT = t;
  const dt = Math.min(0.1, (t - ultimoT) / 1000); ultimoT = t;
  if (!pausado && !REDUCIR) {
    const paso = SEG / monitor.NP; acum += dt;
    while (acum >= paso) { muestra(paso); acum -= paso; }
    pintarTrazas();
  }
  seguirLactato(dt);
  pintarVivo(t, dt);
  if (!$('raiz').getClientRects().length) { corriendo = false; return; }
  requestAnimationFrame(bucle);
}
export function pintarVivo(t, dt) {
  if (!R) return;
  const obj = rlObjetivo(R);
  V.rl = V.rl == null ? obj : seguir(V.rl, obj, dt, 2.2);
  actualizarEscena(R, V.rl);
  // el latido: el haz se acorta, la aguja sube y el péndulo marca el ritmo
  const T = 60000 / R.fc, fase = REDUCIR || pausado ? 0.2 : (t % T) / T, sist = Math.max(0, Math.sin(clamp(fase / 0.4, 0, 1) * Math.PI));
  const Fn = clamp(R.F, 0.6, 1.7), acorta = 0.02 + 0.075 * sist * Fn;
  if (Math.abs(acorta - V.acorta) > 0.002) { $('haz').innerHTML = dibHaz(R, acorta); V.acorta = acorta; }
  $('dial-aguja').setAttribute('transform', `rotate(${f2(-60 + 80 * sist * Fn)} ${BANCO.dial.x} ${BANCO.dial.y})`);
  const fp = REDUCIR || pausado ? 0.25 : (t % (2 * T)) / (2 * T), ang = 16 * Math.sin(fp * 2 * Math.PI), M = BANCO.met;
  const lw = clamp(120 - (R.fc - 50) * 0.75, 50, 128);
  $('pendulo').setAttribute('transform', `rotate(${f2(ang)} ${M.x} ${M.piv})`);
  $('pesa').setAttribute('transform', `translate(0 ${f2(M.piv - lw)})`);
  // el calibre: su aguja gira con el diámetro
  const ca = $('cal-aguja'); if (ca) ca.setAttribute('transform', `rotate(${f2(-150 + V.rl * 6)} 30 252)`);
  // las llaves por la vía (tantas como dosis: ilustrativo)
  let h = ''; const E = ESTADO[ST.id];
  Object.keys(E.reg).forEach((k, j) => {
    const d = ST.f[k]; if (!d) return; const F = FARMACOS[k], reg = F.regimen[E.reg[k]];
    if ((F.llaves.length === 0 && !F.dentro) || (F.via && F.via !== 'iv')) return;   // lo oral y lo inhalado no van por la vía
    const frac = reg.tog || reg.fija !== undefined ? 0.5 : clamp((d - reg.min) / (reg.max - reg.min), 0.1, 1), n = Math.round(2 + 5 * frac);
    const ll = F.llaves[0], forma = ll ? RECEPTORES[ll.rec].forma : null, mat = F.material === 'ciega' ? 'ciega' : 'oro';
    for (let i = 0; i < n; i++) {
      const u = REDUCIR || pausado ? (i + 0.5) / n : ((t / 7000 + i / n + j * 0.13) % 1);
      const rama = (i + j) % 2, xA = VIA.a, xB = VIA.b;
      let x, y, rot = 0;
      const fin = rama ? xA : xB, s1 = (fin - 8) / ((fin - 8) + 70), gA = geomTubo(V.rl, R.P.organo === 'bronquio'), finA = AC.y - 12 - gA.ao + 6;
      if (u < s1) { x = 8 + (u / s1) * (fin - 8); y = VIA.y; }
      else { const v = (u - s1) / (1 - s1); x = fin; rot = 90;
        if (rama) { y = VIA.y + v * (finA - VIA.y); }
        else { y = VIA.y + v * 210; if (y > BANCO.hazY - 8) { const resto = y - (BANCO.hazY - 8); y = BANCO.hazY - 8; x = fin - resto; rot = 180; if (x < BANCO.haz0 + 6) continue; } } }
      h += forma ? `<g transform="translate(${f2(x + (rot ? 0 : 5))} ${f2(y + (rot === 90 ? 5 : 0))}) rotate(${rot}) scale(.75)">${llaveMini(forma, mat)}</g>` : `<path class="rcv-oro" d="M${f2(x)} ${f2(y - 2.2)}l4 2.2l-4 2.2Z"/>`;
    }
  });
  $('via-llaves').innerHTML = h;
  animarLupa(t, dt, R);
}

// Mientras se predice, el monitor y los dibujos se esconden del todo (nada de 600 px de figura velada bajo la pregunta)
export function tapar(si) { setTapado(si); $('aviso-tapa').hidden = !si; if (si) { $('fig1').hidden = true; $('monitor').hidden = true; $('zona-lupa').hidden = true; } }
export function verModelo(si) { $('fig1').hidden = !si; $('monitor').hidden = !si; $('zona-lupa').hidden = !si; }
export function subirBomba(k, de, a, alFin) {
  if (REDUCIR) { ST.f[k] = a; actualizar(); pintarDock(); alFin(); return; }
  let v = de; const pasoB = a > de ? Math.max(1, Math.round((a - de) / 20)) : 1;
  const t = setInterval(() => { v = Math.min(a, v + pasoB); ST.f[k] = v; actualizar(); if (v >= a) { clearInterval(t); alFin(); } }, 140);
}
// La lupa en grande: la lámina 2 se mueve a un plano a pantalla completa por encima del dock (la pieza común)
export const planoLupa = crearPlanoGrande({ titulo: 'La cerradura, de cerca', nota: 'Sigue moviéndose con la bomba: cámbiala abajo.', piezas: [{ nodo: () => $('lupa') }, { nodo: () => $('leyenda') }] });
$('lupa-grande').addEventListener('click', () => planoLupa.abrir());
// [HUECO receptor parte 2: Mayéutica] (preguntas, caso de Begoña y el interruptor Explorar | Mayéutica)
/* ============================================================
   11. Modos y arranque
   ============================================================ */
addEventListener('resize', () => { montarTrazas(); llenarEstatico(); medirDock(); });
setR(efecto({ ...ST, id: 'na-baja', pac: 'paulino', f: { na: 8 }, reg: { na: 'shock' } }));
montarTrazas();
pintarFijos();
ponerEstado('na-baja');
llenarEstatico();
medirDock();
let corriendo = false;
// El bucle de dibujo solo corre mientras el modelo está a la vista (al salir, se para; al volver, se reanuda).
export function reanudar() { montarTrazas(); llenarEstatico(); if (!corriendo) { corriendo = true; ultimoT = 0; requestAnimationFrame(bucle); } medirDock(); }
window.__receptor = { efecto, ESTADOS, FARMACOS, ST, get R() { return R; }, ponerEstado };
