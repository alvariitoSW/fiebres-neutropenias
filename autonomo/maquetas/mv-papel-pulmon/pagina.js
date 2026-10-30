// Maqueta mv-papel-pulmon: tres láminas (Entrada · Histéresis · Asincronías). Motores sin DOM: histeresis.mjs, asincronias.mjs.
import { crearMonitor, canalesRespiratorios, instalarMonitor, instalarMonitorResp } from '../../../js/core/monitor.js';
import { instalarCss, f1 } from '../../../js/core/dibujo-iso.js';
import { pbw } from '../b3-pulmon/pulmon.mjs';
import { simularHisteresis, selloHisteresis, TOPES as TH } from './histeresis.mjs';
import { simularAsinc, selloAsinc, ESCENARIOS, TOPES as TA } from './asincronias.mjs';
import { correr } from './pruebas.mjs';
import * as D from './datos.js';

const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const num = (n, d = 1) => String(Math.round(n * 10 ** d) / 10 ** d).replace('.', ',');
const org = (t, ilu = true) => `<span class="org${ilu ? ' ilu' : ''}">${t}</span>`;
const el = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); e.innerHTML = html; return e; };
instalarMonitor(); instalarMonitorResp();
instalarCss('guia-anillo-html', '.anillo { position: absolute; border: 2px dashed var(--accent-blue); border-radius: 8px; pointer-events: none; z-index: 6; }');

const S = { tab: 1, nivel: 1, ins: 0, hold: false, perfil: 'sdra', peep: 5, vtKg: 6, as: 'sincronico', esf: ESCENARIOS.sincronico.a, adivina: false, resuelto: false, secreto: null, bloqueo: null };
const PBW = pbw(175, 'v');   // Isidro, 1,75 m: el mismo del modelo de la app (70,5 kg)

// ------------------------------------------------------------------ citas, fuentes y toast
let toastT = 0;
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.cita-ir'); if (!b) return;
  const t = $('toast'); t.hidden = false; t.textContent = `En la app, este botón abre «${b.dataset.sitio}» y lo resalta. Al volver, regresas aquí.`;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3400);
});
function pintarFuentes() {
  $('fuentes').innerHTML = D.FUENTES[S.tab].map((f) => {
    const pdf = f.pdf ? ` <a href="${D.PDF[f.pdf]}#page=${String(f.p).match(/\d+/)[0]}" target="_blank" rel="noopener">PDF ${f.pdf === 'LA1' || f.pdf === 'LA2' ? 'Libro Azul' : 'Marino'}, pág. ${f.p}${f.imp ? ` (impresa ${f.imp})` : ''}</a>` : '';
    const ir = f.f ? ` <button type="button" class="cita-ir" data-especialidad="${D.NEUMO[0]}" data-view="${D.NEUMO[1]}" data-panel="${D.NEUMO[2]}" data-tab="${f.f}" data-resaltar="#${f.id}" data-sitio="${f.sitio}">Ver en la ficha: ${f.sitio} →</button>` : '';
    return `<li>${f.t} ${org(f.o, f.o === 'ilustrativo')}${pdf}${ir}${f.nota ? `<br><em>${f.nota}</em>` : ''}</li>`;
  }).join('');
  $('profundizar').innerHTML = ['<li>Fisiología del intercambio de gases y de la difusión: esta lámina solo enseña el camino del aire hasta la membrana.</li>',
    '<li>Índice de estrés y maniobra de reclutamiento (Libro Azul, p. 551): fuera de esta lámina. Posición en prono: otra ficha.</li>',
    '<li>Autodisparo, asincronía de flujo y de ciclado, y fugas (Libro Azul, p. 558-559): no se modelan aquí.</li>'][S.tab - 1];
}

// ------------------------------------------------------------------ pestañas
function ver(t) {
  S.tab = t; cerrarGuia();
  [1, 2, 3].forEach((i) => { $('lam-' + i).hidden = i !== t; $('dock-' + i).hidden = i !== t; $('tab-' + i).setAttribute('aria-selected', String(i === t)); });
  pintarFuentes();
  if (t === 3) { if (!mon) montar3(); pintar3(); } if (t === 2) pintar2(); if (t === 1) pintar1();
}
[1, 2, 3].forEach((i) => $('tab-' + i).addEventListener('click', () => ver(i)));

// ------------------------------------------------------------------ guía (Explícame): pasos que señalan la pieza
let guia = null;
const anillos = [];
function ring(e) {
  const host = e.closest('.fig, .foto'); if (!host) return; const h = host.getBoundingClientRect(), r = e.getBoundingClientRect();
  const a = el('div', { class: 'anillo' }); a.style.left = (r.left - h.left - 3) + 'px'; a.style.top = (r.top - h.top - 3) + 'px'; a.style.width = (r.width + 6) + 'px'; a.style.height = (r.height + 6) + 'px';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative'; host.append(a); anillos.push(a);
}
function limpiarAnillos() { anillos.splice(0).forEach((a) => a.remove()); if (mon) mon.borrarTramos(); }
function abrirGuia(pasos) { guia = { pasos, i: 0 }; $('dock-' + S.tab).hidden = true; $('dock-guia').hidden = false; pintarGuia(); }
function cerrarGuia() { guia = null; limpiarAnillos(); $('dock-guia').hidden = true; $('dock-' + S.tab).hidden = false; }
function pintarGuia() {
  const { pasos, i } = guia, p = pasos[i]; limpiarAnillos(); if (p.fn) p.fn();
  $('dock-guia').innerHTML = `<div class="guia"><div class="guia-cab"><span class="guia-n">Paso ${i + 1} de ${pasos.length}</span><span class="guia-tit">${p.tit}</span><button type="button" class="guia-x" id="g-x" aria-label="Cerrar la explicación">×</button></div>
    <p class="guia-txt">${p.txt}</p><div class="guia-nav"><button type="button" class="guia-b" id="g-a" ${i ? '' : 'disabled'}>← Anterior</button><span class="guia-puntos">${pasos.map((_, k) => `<i class="${k < i ? 'hecho' : k === i ? 'aqui' : ''}"></i>`).join('')}</span><button type="button" class="guia-b prim" id="g-s">${i === pasos.length - 1 ? 'Terminar' : 'Siguiente →'}</button></div></div>`;
  $('g-x').onclick = cerrarGuia; $('g-a').onclick = () => { guia.i--; pintarGuia(); };
  $('g-s').onclick = () => { if (guia.i === pasos.length - 1) cerrarGuia(); else { guia.i++; pintarGuia(); } };
  requestAnimationFrame(() => { for (const s of p.sel || []) { const e = document.querySelector(s); if (e) { if (e.tagName === 'IMG') e.scrollIntoView({ block: 'center' }); ring(e); } } if (p.tramo) p.tramo(); });
}
const botonGuia = (pasosFn) => { const b = el('button', { type: 'button', class: 'btn-guia' }, 'Explícame'); b.addEventListener('click', () => abrirGuia(pasosFn())); return b; };

// ------------------------------------------------------------------ construcción de los controles (una vez)
const seg = (items, clic, sel) => { const d = el('div', { class: 'seg' }); items.forEach((it) => { const b = el('button', { type: 'button', 'aria-pressed': 'false', 'data-k': it.k }, it.t); b.addEventListener('click', () => clic(it.k)); d.append(b); }); d.pintar = (k) => d.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === String(k)))); d.pintar(sel); return d; };
const desliz = (id, et, min, max, paso, valor, alCambiar) => { const w = el('div', { class: 'deslizador' }, `<label for="${id}">${et}</label><input type="range" id="${id}" min="${min}" max="${max}" step="${paso}" value="${valor}"><output for="${id}"></output>`); w.querySelector('input').addEventListener('input', (e) => alCambiar(+e.target.value)); return w; };

// ---- lámina 1
const segN = seg(D.NIVELES.map((n, i) => ({ k: i + 1, t: `${i + 1} ${n.n}` })), (k) => { S.nivel = k; pintar1(); }, 1);
const bIns = el('button', { type: 'button', class: 'tog', id: 'b-inspira' }, 'Inspira<small>mantén pulsado</small>');
const soltar = () => { S.hold = false; };
bIns.addEventListener('pointerdown', (e) => { e.preventDefault(); S.hold = true; anim1(); });
['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => bIns.addEventListener(ev, soltar));
bIns.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); S.hold = true; anim1(); } });
bIns.addEventListener('keyup', soltar);
const r1 = el('div', { class: 'fila2' }); r1.append(bIns, botonGuia(() => pasos1()));
$('dock-1').append(segN, r1, el('p', { class: 'dock-nota' }, 'Vt fijo en 500 mL (ejemplo de la ficha). Sin más mandos: el tope es el propio ejemplo.'));

// ---- lámina 2
const segP = seg([{ k: 'normal', t: 'Pulmón normal' }, { k: 'sdra', t: 'SDRA reclutable' }], (k) => { S.perfil = k; S.bloqueo = null; pintar2(); }, 'sdra');
const dPeep = desliz('s-peep', 'PEEP', 0, TH.peepMax, 1, S.peep, (v) => { S.peep = v; pintar2(); });
const dVt = desliz('s-vt', 'Vt', TH.vtMin, TH.vtTope, 0.5, S.vtKg, (v) => { S.vtKg = v; pintar2(); });
const nota2 = el('p', { class: 'dock-nota', id: 'nota-2' });
const volver2 = el('button', { type: 'button', class: 'volver', hidden: '' }); volver2.addEventListener('click', () => { if (S.bloqueo === 'vt') S.vtKg = 6; if (S.bloqueo === 'peep') S.peep = 10; S.bloqueo = null; pintar2(); });
const f2 = el('div', { class: 'fila2' }); f2.append(segP, botonGuia(() => pasos2()));
$('dock-2').append(f2, dPeep, dVt, nota2, volver2);

// ---- lámina 3
const segA = seg(Object.entries(D.NOMBRES_AS).map(([k, t]) => ({ k, t })), (k) => { if (S.adivina) return; S.as = k; S.esf = ESCENARIOS[k].a; S.bloqueo = null; pintar3(); }, 'sincronico');
const dEsf = desliz('s-esf', 'Esfuerzo', 0, TA.esfuerzoMax, 0.5, S.esf, (v) => { S.esf = v; pintar3(); });
const bAdi = el('button', { type: 'button', class: 'tog', id: 'b-adivina', 'aria-pressed': 'false' }, 'Adivina<small>la curva sin nombre</small>');
bAdi.addEventListener('click', () => { S.adivina = !S.adivina; bAdi.setAttribute('aria-pressed', String(S.adivina)); if (S.adivina) nuevaAdivina(); else { S.esf = ESCENARIOS[S.as].a; } pintar3(); });
const nota3 = el('p', { class: 'dock-nota', id: 'nota-3' });
const volver3 = el('button', { type: 'button', class: 'volver', hidden: '' }, 'Bajar el esfuerzo a 8'); volver3.addEventListener('click', () => { S.esf = 8; S.bloqueo = null; pintar3(); });
const f3 = el('div', { class: 'fila2' }); f3.append(bAdi, botonGuia(() => pasos3()));
$('dock-3').append(segA, dEsf, f3, nota3, volver3);
const salida = (d, txt) => { d.querySelector('output').innerHTML = txt; };

// ------------------------------------------------------------------ LÁMINA 1: del tórax al capilar
const C1 = [[160, 8, 160, 50], [160, 50, 110, 90], [160, 50, 210, 90], [110, 90, 82, 124], [110, 90, 132, 124], [210, 90, 188, 124], [210, 90, 238, 124]];
const ramas = (lista) => lista.map((r) => `M${r.join(' ').replace(/(\d+) (\d+) (\d+) (\d+)/, '$1 $2 L$3 $4')}`).join(' ');
const finales = [[82, 124], [132, 124], [188, 124], [238, 124]], hojas = finales.flatMap(([x, y]) => [[x - 12, y + 26], [x + 12, y + 26]]);
const arbol = ramas(C1) + ' ' + finales.map(([x, y]) => `M${x} ${y} L${x - 12} ${y + 26} M${x} ${y} L${x + 12} ${y + 26}`).join(' ');
$('svg-1').innerHTML = `
<g id="g1-1"><path id="n1-torax" class="tr-f" d="M96 22 Q62 34 64 96 L68 168 Q160 190 252 168 L256 96 Q258 34 224 22 Z"/>
 <ellipse id="n1-pi" class="tr-f" cx="118" cy="98" rx="40" ry="54"/><ellipse id="n1-pd" class="tr-f" cx="202" cy="98" rx="40" ry="54"/>
 <path class="tr" d="M160 4 V60 M160 60 L128 86 M160 60 L192 86"/><path id="n1-flecha" class="aire" d="M154 8 h12 v34 h10 l-16 16 l-16 -16 h10z"/>
 <path id="n1-diafragma" class="tr" stroke-width="3.2" d="M68 160 Q160 160 252 160"/>
 <text x="4" y="200" class="t10">diafragma</text><text x="4" y="82" class="t10">pulmón</text><text x="216" y="224" class="t10" text-anchor="end">Vt 500 mL</text></g>
<g id="g1-2" hidden><path class="tr" d="${arbol}" stroke-width="2"/><path id="n2-muerto" d="${arbol}" fill="none" stroke="var(--accent-red)" stroke-opacity=".32" stroke-width="9" stroke-linecap="round"/>
 ${hojas.map(([x, y]) => `<circle cx="${x}" cy="${y + 6}" r="7" class="tr-f"/>`).join('')}
 <text x="4" y="40" class="t10" fill="var(--accent-red)" style="fill:var(--accent-red)">espacio muerto</text><text x="4" y="52" class="t10" style="fill:var(--accent-red)">(vía que conduce)</text>
 <text x="268" y="180" class="t10" text-anchor="end">alvéolos</text><text x="316" y="40" class="gran" text-anchor="end">150 + 350</text>
 <rect id="n2-barra" x="20" y="196" width="280" height="16" class="tr-f"/><rect x="20" y="196" width="84" height="16" class="muerto"/>
 <rect id="n2-aire1" x="20" y="196" width="0" height="16" class="aire"/><rect id="n2-aire2" x="104" y="196" width="0" height="16" class="aire"/>
 <text x="24" y="226" class="t10">150 mL muerto</text><text x="296" y="226" class="t10" text-anchor="end">350 mL al alvéolo</text></g>
<g id="g1-3" hidden><path class="tr" d="M160 6 V62" stroke-width="2.4"/><path class="tr" d="M160 62 L112 96 M160 62 L208 96"/>
 <g id="n3-racimo">${[[112, 112], [150, 124], [188, 118], [226, 112], [96, 150], [134, 164], [172, 160], [210, 164], [248, 150], [118, 196], [160, 202], [200, 196]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="19" class="tr-f"/>`).join('')}</g>
 <text x="4" y="30" class="t10">conducto</text><text x="316" y="228" class="t10" text-anchor="end">racimo de alvéolos</text></g>
<g id="g1-4" hidden><rect x="20" y="10" width="280" height="76" class="aire" fill-opacity=".3"/><text x="28" y="26" class="t10">aire del alvéolo</text>
 <rect id="n4-membrana" x="20" y="86" width="280" height="9" style="fill:var(--text-dim)" fill-opacity=".55"/><text x="304" y="108" class="gran" text-anchor="end">~0,6 µm</text>
 <rect x="20" y="95" width="280" height="84" style="fill:color-mix(in srgb,var(--accent-red) 14%,transparent)" stroke="var(--accent-red)" stroke-opacity=".5"/>
 <ellipse cx="160" cy="138" rx="34" ry="16" style="fill:var(--accent-red)" fill-opacity=".55" id="n4-hematie"/><text x="160" y="142" text-anchor="middle" class="t10" style="fill:var(--text-main)">hematíe</text>
 <g id="n4-o2">${[96, 160, 224].map((x) => `<path d="M${x} 44 V80 M${x - 6} 72 L${x} 80 L${x + 6} 72" class="tr" style="stroke:var(--accent-yellow)"/><text x="${x + 8}" y="56" class="t10" style="fill:var(--accent-yellow)">O₂</text>`).join('')}</g>
 <g id="n4-co2">${[128, 192].map((x) => `<path d="M${x} 172 V104 M${x - 6} 112 L${x} 104 L${x + 6} 112" class="tr" style="stroke:var(--accent-green)"/><text x="${x + 8}" y="168" class="t10" style="fill:var(--accent-green)">CO₂</text>`).join('')}</g>
 <text x="20" y="198" class="t10">capilar</text><text x="20" y="214" class="t10">50-100 m² de superficie en ambos pulmones</text></g>`;
D.TARJETAS.forEach((t, i) => { $('tarjetas').append(el('div', { class: 'tarjeta' }, `<b>${t.q}</b><button type="button" class="btn" id="tj-b${i}" aria-expanded="false">Destapar</button><div class="resp" id="tj-r${i}" hidden>${t.a} ${org(t.o, false)}</div>`)); });
D.TARJETAS.forEach((t, i) => $('tj-b' + i).addEventListener('click', () => { const r = $('tj-r' + i); r.hidden = !r.hidden; $('tj-b' + i).setAttribute('aria-expanded', String(!r.hidden)); $('tj-b' + i).textContent = r.hidden ? 'Destapar' : 'Tapar'; }));
function pintar1() {
  const n = D.NIVELES[S.nivel - 1], g = S.ins;
  segN.pintar(S.nivel); [1, 2, 3, 4].forEach((i) => $('g1-' + i).toggleAttribute('hidden', i !== S.nivel));
  $('foto-1').hidden = S.nivel !== 3;
  $('fv-1').innerHTML = `<span class="estado">Nivel ${S.nivel} · ${n.n}</span>${n.fr} ${org(n.o, false)}`;
  $('n1-diafragma').setAttribute('d', `M68 160 Q160 ${f1(160 + 24 * g)} 252 160`);
  ['n1-pi', 'n1-pd'].forEach((id) => { $(id).setAttribute('ry', f1(54 + 12 * g)); $(id).setAttribute('cy', f1(98 + 6 * g)); });
  $('n1-flecha').setAttribute('opacity', f1(g));
  $('n2-aire1').setAttribute('width', f1(Math.min(84, 280 * g))); $('n2-aire2').setAttribute('width', f1(Math.max(0, Math.min(196, 280 * g - 84))));
  $('n3-racimo').setAttribute('transform', `translate(${f1(-16 * g)} ${f1(-12 * g)}) scale(${f1(1 + 0.1 * g)})`);
  $('n4-o2').setAttribute('opacity', f1(0.35 + 0.65 * g)); $('n4-co2').setAttribute('opacity', f1(0.35 + 0.65 * g));
  bIns.setAttribute('aria-pressed', String(S.hold));
}
let raf1 = 0;
function anim1() {
  if (REDUCIR) { S.ins = S.hold ? 1 : 0; pintar1(); return; }
  if (raf1) return; let ult = 0;
  const f = (t) => { const dt = ult ? Math.min((t - ult) / 1000, 0.05) : 0.016; ult = t; S.ins = Math.max(0, Math.min(1, S.ins + (S.hold ? dt / 0.9 : -dt / 0.9))); pintar1();
    raf1 = (S.hold && S.ins < 1) || (!S.hold && S.ins > 0) ? requestAnimationFrame(f) : 0; };
  raf1 = requestAnimationFrame(f);
}
const pasos1 = () => [
  { tit: 'El tórax', txt: 'Al inspirar baja el diafragma y los pulmones se llenan con un Vt de 500 mL. Mantén «Inspira» y mira cómo baja la cúpula.', fn: () => { S.nivel = 1; S.hold = true; S.ins = 1; S.hold = false; pintar1(); }, sel: ['#n1-diafragma'] },
  { tit: 'La vía aérea', txt: 'De esos 500 mL, 150 se quedan en la vía que solo conduce (espacio muerto anatómico) y 350 llegan al alvéolo. La barra de abajo lo reparte.', fn: () => { S.nivel = 2; S.ins = 1; pintar1(); }, sel: ['#n2-barra'] },
  { tit: 'Los alvéolos', txt: 'La vía acaba en racimos de alvéolos. A la derecha de la lámina, la foto real de un pulmón normal (Fig. 24.1): espacios aéreos separados por tabiques finos con el capilar.', fn: () => { S.nivel = 3; S.ins = 1; pintar1(); }, sel: ['#img-1'] },
  { tit: 'La membrana', txt: 'El O₂ cruza la membrana (~0,6 µm) hacia el hematíe y el CO₂ hace el camino inverso, sobre 50-100 m² en ambos pulmones.', fn: () => { S.nivel = 4; S.ins = 1; pintar1(); }, sel: ['#n4-membrana'] },
];

// ------------------------------------------------------------------ LÁMINA 2: histéresis P-V
const X = (p) => 40 + p * 6.75, Y = (v) => 176 - v * 0.2;
$('svg-2').innerHTML = `<g class="lamina-svg">
 <line class="eje" x1="40" y1="176" x2="312" y2="176"/><line class="eje" x1="40" y1="10" x2="40" y2="176"/>
 ${[0, 10, 20, 30, 40].map((p) => `<line class="eje" x1="${X(p)}" y1="176" x2="${X(p)}" y2="180"/><text x="${X(p)}" y="190" text-anchor="middle" class="t9">${p}</text>`).join('')}
 ${[0, 200, 400, 600, 800].map((v) => `<line class="eje" x1="36" y1="${Y(v)}" x2="40" y2="${Y(v)}"/><text x="34" y="${Y(v) + 3}" text-anchor="end" class="t9">${v}</text>`).join('')}
 <text x="312" y="202" text-anchor="end" class="t9">presión (cmH₂O)</text><text x="44" y="16" class="t9">volumen (mL)</text>
 <line id="h-peep" class="l-peep" x1="40" y1="10" x2="40" y2="176"/><text id="h-peep-t" x="42" y="36" class="t9" style="fill:var(--accent-blue)">PEEP</text>
 <path id="h-ins" class="l-ins" d=""/><path id="h-esp" class="l-esp" d=""/>
 <circle id="h-pii" r="4.5" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:1.6"/><text id="h-pii-t" class="t9" style="fill:var(--text-main)">inflexión inf.</text>
 <circle id="h-pis" r="4.5" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:1.6"/><text id="h-pis-t" class="t9" style="fill:var(--text-main)">inflexión sup.</text>
 <line id="h-mes" class="l-peep" style="stroke:var(--accent-red)" x1="0" y1="176" x2="0" y2="176"/><text id="h-mes-t" class="t9" style="fill:var(--accent-red)">meseta</text>
 <line x1="46" y1="214" x2="76" y2="214" class="l-ins"/><text x="80" y="217" class="t9">inspiración</text><line x1="150" y1="214" x2="180" y2="214" class="l-esp"/><text x="184" y="217" class="t9">espiración</text><text x="312" y="217" text-anchor="end" class="t9" style="fill:var(--text-muted)">ilustrativo</text>
 ${[0, 1, 2, 3].map((i) => `<g id="al-${i}"><ellipse id="al-e${i}" cx="${40 + i * 80}" cy="248" rx="12" ry="5" class="tr-f"/><text id="al-t${i}" x="${40 + i * 80}" y="274" text-anchor="middle" class="t9"></text></g>`).join('')}</g>`;
const ESTADO_AL = { cerrado: { rx: 12, ry: 5, t: 'cerrado' }, abierto: { rx: 14, ry: 14, t: 'abierto' }, 'abre-cierra': { rx: 14, ry: 14, t: 'abre y cierra' }, sobre: { rx: 19, ry: 19, t: 'sobredistendido' } };
const tray = (a) => a.map((q, i) => `${i ? 'L' : 'M'}${f1(X(q.p))} ${f1(Y(Math.min(q.v, 800)))}`).join('');
let ult2 = null;
function pintar2() {
  if (S.bloqueo === 'vt' && S.vtKg <= TH.vtSello) S.bloqueo = null;
  const c = simularHisteresis({ perfil: S.perfil, peep: S.peep, vtKg: S.vtKg }); ult2 = c;
  const sello = selloHisteresis(c, { vtKg: S.vtKg, peep: S.peep });
  if (sello && (sello.clave === 'vt' || sello.clave === 'peep')) S.bloqueo = sello.clave; else S.bloqueo = null;
  segP.pintar(S.perfil);
  $('h-ins').setAttribute('d', tray(c.insp)); $('h-esp').setAttribute('d', tray(c.esp));
  $('h-peep').setAttribute('x1', X(S.peep)); $('h-peep').setAttribute('x2', X(S.peep)); $('h-peep-t').setAttribute('x', X(S.peep) + 3);
  const vEn = (p) => { const a = c.insp.reduce((b, q) => (Math.abs(q.p - p) < Math.abs(b.p - p) ? q : b)); return a.v; };
  for (const [id, p, txt] of [['h-pii', c.infInf, 'inf.'], ['h-pis', c.infSup, 'sup.']]) {
    const dentro = p >= c.peep && p <= c.pMeseta; $(id).toggleAttribute('hidden', !dentro); $(id + '-t').toggleAttribute('hidden', !dentro);
    $(id).setAttribute('cx', X(p)); $(id).setAttribute('cy', Y(vEn(p))); $(id + '-t').setAttribute('x', txt === 'inf.' ? X(p) - 8 : X(p) + 7); $(id + '-t').setAttribute('text-anchor', txt === 'inf.' ? 'end' : 'start'); $(id + '-t').setAttribute('y', Y(vEn(p)) - (txt === 'inf.' ? 8 : -3)); $(id + '-t').textContent = txt === 'inf.' ? 'inflexión inf.' : 'inflexión sup.';
  }
  $('h-mes').setAttribute('x1', X(c.pMeseta)); $('h-mes').setAttribute('x2', X(c.pMeseta)); $('h-mes').setAttribute('y1', Y(c.vt)); $('h-mes-t').setAttribute('x', X(c.pMeseta) - 3); $('h-mes-t').setAttribute('text-anchor', 'end'); $('h-mes-t').setAttribute('y', Math.max(22, Y(c.vt) - 4));
  c.unidades.forEach((u, i) => { const m = ESTADO_AL[u.estado], e = $('al-e' + i); e.setAttribute('rx', m.rx); e.setAttribute('ry', m.ry); e.setAttribute('cy', 248); e.setAttribute('class', 'tr-f' + (u.estado === 'abre-cierra' ? ' alv-cierra' : ''));
    e.style.stroke = u.estado === 'abre-cierra' ? 'var(--accent-red)' : u.estado === 'sobre' ? 'var(--accent-red)' : ''; $('al-t' + i).textContent = m.t; });
  salida(dPeep, `<b>${S.peep}</b> cmH₂O`); salida(dVt, `<b>${num(S.vtKg)}</b> mL/kg<small>${Math.round(S.vtKg * PBW)} mL</small>`);
  dPeep.querySelector('input').disabled = S.bloqueo === 'peep' || S.bloqueo === 'vt'; dVt.querySelector('input').disabled = S.bloqueo === 'peep' || S.bloqueo === 'vt';
  dPeep.querySelector('input').value = S.peep; dVt.querySelector('input').value = S.vtKg;
  nota2.textContent = S.peep >= TH.peepAviso && S.peep < TH.peepMax ? `Aviso: PEEP ${S.peep}, cerca del tope de 20 (Marino, PDF 10). ` : S.vtKg >= TH.vtSello && !S.bloqueo ? 'Aviso: 8 mL/kg es el borde de la protectora (Tabla 27.1). ' : 'Tope PEEP 20 (ficha: 10-20 abre lo colapsado) · Vt 4-8 mL/kg PBW (Tabla 27.1) · PBW 70,5 kg, paciente de 1,75 m.';
  volver2.hidden = !S.bloqueo; volver2.textContent = S.bloqueo === 'vt' ? 'Volver a 6 mL/kg' : 'Bajar la PEEP a 10';
  const st = $('sello-2'); st.hidden = !sello; if (sello) { st.style.cssText = 'left:22%;top:5%;transform:rotate(-4deg);max-width:44%;font-size:.7rem;padding:3px 8px'; st.innerHTML = `${sello.titulo}<small>${sello.origen}</small>`; }
  const dpTxt = `ΔP ${num(c.dp)} cmH₂O`, n = c.nAbreCierra;
  const base = 'Abrir cuesta más que mantener abierto: la PEEP por encima del cierre guarda lo que la inspiración abrió.';
  $('fv-2').innerHTML = sello ? `<span class="estado">${sello.titulo}</span>${sello.texto} ${org(sello.origen, sello.origen === 'ilustrativo')}`
    : `<span class="estado">${D.NIVELES ? (S.perfil === 'sdra' ? 'SDRA reclutable' : 'Pulmón normal') : ''} · PEEP ${S.peep}</span>${base}${S.perfil === 'sdra' && n === 0 && S.peep >= 8 ? ' Con esta PEEP, ninguna unidad se cierra al espirar.' : ''} ${org('ficha: Libro Azul p. 450-451 · cifras ilustrativas')}`;
  const celda = (et, g, t, cls = '') => `<div class="celda ${cls}"><span class="k">${et}</span><span class="g">${g}</span><span class="t">${t}</span></div>`;
  $('calc-2').innerHTML = [celda('Meseta', num(c.pMeseta), 'cmH₂O · ilustrativo', c.pMeseta > 30 ? 'no' : 'si'), celda('ΔP (meseta − PEEP)', num(c.dp), 'sin objetivo: la ficha no lo da'), celda('Cstat', c.cstat ? Math.round(c.cstat) : '—', 'mL/cmH₂O · ilustrativo'),
    celda('Unidades que abren y cierran', `${n}/4`, 'ilustrativo', n ? 'no' : 'si'), celda('Vt del ciclo', Math.round(c.vt), `mL · ${num(c.vt / PBW)} mL/kg`), celda('Sobredistendidas', `${c.unidades.filter((u) => u.estado === 'sobre').length}/4`, 'ilustrativo')].join('');
}
const pasos2 = () => [
  { tit: 'El bucle', txt: 'Cada ciclo dibuja un bucle: la inspiración sube por la línea continua y la espiración baja por la discontinua. No coinciden: eso es la histéresis.', fn: () => { S.perfil = 'sdra'; S.peep = 0; S.vtKg = 6; pintar2(); }, sel: ['#h-ins', '#h-esp'] },
  { tit: 'Los puntos de inflexión', txt: 'El inferior marca dónde se abre mucho pulmón de golpe; el superior, dónde empieza la sobredistensión. El reclutamiento empieza al pasar el inferior (Libro Azul, p. 551). Posiciones ilustrativas.', sel: ['#h-pii', '#h-pis'] },
  { tit: 'PEEP por debajo del cierre', txt: 'Con PEEP 0 las unidades se cierran al espirar (alvéolos discontinuos abajo) y la siguiente inspiración tiene que volver a abrirlas: atelectrauma.', sel: ['#al-e0', '#al-e1'] },
  { tit: 'PEEP por encima del cierre', txt: 'Con PEEP 10 nada se cierra: lo que abrió la inspiración se queda abierto y baja la presión necesaria. Abrir cuesta más que mantener abierto.', fn: () => { S.peep = 10; pintar2(); }, sel: ['#h-peep', '#al-e0'] },
];

// ------------------------------------------------------------------ LÁMINA 3: asincronías
let mon = null, ult3 = null;
let VENT0 = 0, VENT = 4;   // ventana de 4 s que se mueve hasta el primer esfuerzo propio de la asincronía elegida
function montar3() {
  const base = canalesRespiratorios({ peep: () => 5, pawMax: 40, flujoMax: 90, volMax: 1000 }).map((c) => ({ ...c, marcas: [], alto: { paw: 50, flujo: 44, vol: 30 }[c.k] }));
  mon = crearMonitor($('svg-3'), { canales: [...base, { k: 'esf', rot: 'esfuerzo', alto: 26, min: 0, max: 16, col: 'var(--accent-purple)' }], margen: 26, hueco: 3, borrar: 0 });
  mon.montar();
}
addEventListener('resize', () => { if (mon && S.tab === 3) { mon.montar(); pintar3(); } });
function nombreReal(r) {
  const ef = r.esfuerzos.filter((e) => e.t0 >= VENT0 && e.t0 < VENT);
  return (ef.find((e) => e.tipo !== 'sincronico') || ef[0] || { tipo: 'sincronico' }).tipo;
}
function nuevaAdivina() {
  const ks = Object.keys(D.NOMBRES_AS).filter((k) => k !== S.secreto); S.secreto = ks[Math.floor(Math.random() * ks.length)];
  S.as = S.secreto; S.esf = ESCENARIOS[S.as].a; S.resuelto = false; S.opciones = null;
}
function pintar3() {
  if (!mon) return;
  const r = simularAsinc(S.as, { esfuerzo: S.esf, duracion: 16 }); ult3 = r;
  const e0 = r.esfuerzos.find((e) => e.tipo === S.as) || r.esfuerzos.find((e) => e.tipo !== 'sincronico') || r.esfuerzos[0];
  VENT0 = e0 ? Math.max(0, e0.t0 - 1) : 0; VENT = VENT0 + 4;
  const NP = mon.NP, dt = r.params.dt, tIni = VENT0, ven = VENT - VENT0;
  mon.llenar((i) => { const k = Math.min(r.t.length - 1, Math.round((tIni + i * ven / NP) / dt)); return { paw: r.paw[k], flujo: r.flujo[k], vol: r.vol[k], esf: r.pmus[k] }; }); mon.pintar();
  segA.pintar(S.adivina && !S.resuelto ? null : S.as); segA.querySelectorAll('button').forEach((b) => { b.disabled = S.adivina; });
  const real = nombreReal(r), sello = selloAsinc(r, { esfuerzo: S.esf });
  S.bloqueo = sello ? 'esfuerzo' : null;
  dEsf.querySelector('input').disabled = S.adivina || !!sello; dEsf.querySelector('input').value = S.esf; salida(dEsf, `<b>${num(S.esf)}</b> cmH₂O<small>ilustrativo</small>`);
  nota3.textContent = S.esf >= TA.esfuerzoAviso && !sello ? `Aviso: esfuerzo de ${num(S.esf)} cmH₂O, cerca del tope de ${TA.esfuerzoMax} (ilustrativo; la PImax media reportada es −120/−84, Marino PDF 58).` : 'Esfuerzo 0-15 cmH₂O (ilustrativo) · disparo a −2 cmH₂O (ficha: 2-3) · Vt 400 mL, flujo 60 L/min.';
  volver3.hidden = !sello; const st = $('sello-3'); st.hidden = !sello; if (sello) { st.style.cssText = 'left:34%;top:6%;transform:rotate(-4deg);max-width:50%;font-size:.7rem;padding:3px 8px'; st.innerHTML = `${sello.titulo}<small>${sello.origen}</small>`; }
  const ef = r.esfuerzos.filter((e) => e.t0 >= VENT0 && e.t0 < VENT).find((e) => e.tipo === real) || r.esfuerzos.find((e) => e.t0 >= VENT0);
  const tramo = (nombre) => { if (!ef) return; const i0 = Math.round((ef.t0 - tIni) / ven * NP), i1 = Math.round((Math.min(ef.t1 + 0.4, VENT) - tIni) / ven * NP); ['paw', 'esf'].forEach((k) => mon.tramo(k, nombre, i0, i1)); };
  mon.borrarTramos(); S.tramo = tramo;
  const oculto = S.adivina && !S.resuelto;
  if (!oculto) tramo('as');
  $('adivina').hidden = !S.adivina; if (S.adivina) pintarAdivina(real);
  $('fv-3').innerHTML = sello ? `<span class="estado">${sello.titulo}</span>${sello.texto} ${org(sello.origen)}`
    : oculto ? `<span class="estado">¿Qué ves?</span>Primero predices: mira la presión, el flujo y el esfuerzo, y elige abajo. El nombre sale al contestar. ${org('ilustrativo')}`
    : `<span class="estado">${D.NOMBRES_AS[real]}</span>${D.EXPL[real]} ${ef ? `Ese ciclo recibe ${Math.round(ef.vt)} mL.` : ''} ${org('ficha: Libro Azul p. 557-559 · modelo ilustrativo')}`;
}
function pintarAdivina(real) {
  const A = $('adivina');
  if (!S.opciones) { const otras = Object.keys(D.NOMBRES_AS).filter((k) => k !== real).sort(() => Math.random() - 0.5).slice(0, 2); S.opciones = [real, ...otras].sort(() => Math.random() - 0.5); A.innerHTML = ''; S.elegida = null;
    A.append(el('b', {}, 'Piensa antes: ¿qué asincronía es?'));
    S.opciones.forEach((k) => { const b = el('button', { type: 'button', class: 'op-as', 'data-k': k }, D.NOMBRES_AS[k]); b.addEventListener('click', () => { S.elegida = k; S.resuelto = true; pintar3(); }); A.append(b); });
    A.append(el('p', { id: 'adi-res', class: 'resp' }), el('button', { type: 'button', class: 'btn', id: 'adi-otra', hidden: '' }, 'Otra curva'));
    $('adi-otra').addEventListener('click', () => { nuevaAdivina(); S.opciones = null; pintar3(); }); }
  A.querySelectorAll('.op-as').forEach((b) => { const k = b.dataset.k; b.disabled = S.resuelto; b.classList.toggle('elegida-bien', S.resuelto && k === real); b.classList.toggle('elegida-mal', S.resuelto && k === S.elegida && k !== real);
    b.innerHTML = `${D.NOMBRES_AS[k]}${S.resuelto ? `<small>${k === real ? 'Correcta. ' : ''}${D.OPCIONES_AS[k]}</small>` : ''}`; });
  $('adi-res').hidden = !S.resuelto; $('adi-otra').hidden = !S.resuelto;
  if (S.resuelto) $('adi-res').innerHTML = `${S.elegida === real ? 'Bien.' : 'No: era ' + D.NOMBRES_AS[real] + '.'} ${D.EXPL[real]} ${org('ficha: Libro Azul p. 557-559', false)}`;
}
const pasos3 = () => [
  { tit: 'Las curvas', txt: 'Arriba la presión de la vía aérea (Paw), luego el flujo, el volumen y, abajo, el esfuerzo del paciente (ilustrativo). Con el mismo esfuerzo, la forma de Paw cambia según responda el respirador.', fn: () => { S.adivina = false; bAdi.setAttribute('aria-pressed', 'false'); S.as = 'sincronico'; S.esf = 8; pintar3(); }, sel: ['#tr-paw', '#tr-esf'] },
  { tit: 'Esfuerzo ineficaz', txt: 'Un esfuerzo de 3 cmH₂O baja la Paw menos de 2: no llega al umbral y el respirador no responde. La Paw solo hace una muesca y el flujo casi no se mueve. Sube el esfuerzo para ver cuándo dispara.', fn: () => { S.as = 'ineficaz'; S.esf = 3; pintar3(); }, tramo: () => S.tramo && S.tramo('guia') },
  { tit: 'Doble disparo', txt: 'Dos inspiraciones en menos de la mitad del tiempo inspiratorio (Libro Azul, p. 558): el respirador entrega dos ciclos seguidos y el volumen se apila.', fn: () => { S.as = 'doble'; S.esf = 11; pintar3(); }, tramo: () => S.tramo && S.tramo('guia') },
  { tit: 'Disparo inverso', txt: 'Nuevo disparo dentro de un ciclo inspiratorio, con riesgo de sobredistensión por el mayor volumen (Libro Azul, p. 558-559). En la curva, la insuflación empieza por tiempo y el esfuerzo llega después; el mecanismo está en investigación.', fn: () => { S.as = 'inverso'; S.esf = 11; pintar3(); }, tramo: () => S.tramo && S.tramo('guia') },
];

// ------------------------------------------------------------------ arranque y prueba
const { out, fallos } = correr();
$('pruebas-res').innerHTML = out.map((l) => `<span class="${l[0] === '✓' ? 'ok-g' : 'mal-g'}">${l}</span>`).join('\n') + `\n${fallos ? fallos + ' fallos' : 'todo en orden'}`;
ver(1);
window.__mv = { S, pintar1, pintar2, pintar3, ver, get mon() { return mon; }, get c2() { return ult2; }, get r3() { return ult3; } };
