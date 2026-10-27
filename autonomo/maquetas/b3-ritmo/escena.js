// El dibujo vivo de la maqueta b3-ritmo: tinta, torniquete, célula y aparatos leen el motor en cada fotograma.
import { embolo } from '../../../js/core/bomba.js';
import { CABLES, CAMINO, G, OB, TORN, VOLT, angV, aparatosEstatico, bombaDe, canalHtml, contornoBanda, dibujoEstatico, f1, fase, pintarTorniquete, polyTesela, potencial, yPA } from './dibujo.js';
import { S, ecgEn, latidos, mo, pend } from './pagina.js';
import { $, NS, clamp } from './datos.js';
/* ---------- El dibujo vivo ---------- */
let ultimoD = null;
export function reiniciarD() { ultimoD = null; }   // pagina.js no puede asignar a una variable importada
const nodoK = id => G.porId[id].k;
function ultimaAct(k, t) { const u = mo.ultimo[k]; return u > t ? mo.previo[k] : u; }
export function montarEscena() {
  $('rtm-svg').innerHTML = dibujoEstatico();
  // las teselas de tinta, repartidas en aurículas y ventrículos (para poder señalarlas)
  let ha = '', hv = '';
  G.teselas.forEach((t, i) => { const p = `<path data-tinta="${i}" d="" fill="var(--accent-yellow)" fill-opacity="0"/>`; if (t.reg === 'a') ha += p; else hv += p; });
  $('rtm-aurs').innerHTML = ha; $('rtm-vents').innerHTML = hv;
  // segmentos del cable que se encienden
  let hl = '';
  for (const cad of CABLES) for (let i = 0; i < cad.ids.length - 1; i++) { const a = G.porId[cad.ids[i]], b = G.porId[cad.ids[i + 1]]; hl += `<path data-seg="${cad.ids[i]}|${cad.ids[i + 1]}" d="M${f1(a.x)} ${f1(a.y)} L${f1(b.x)} ${f1(b.y)}" stroke-width="${cad.ancho + 0.6}" stroke-opacity="0"/>`; }
  for (const n of G.nodos) if (n.tipo === 'pk') hl += `<circle data-pk="${n.k}" cx="${f1(n.x)}" cy="${f1(n.y)}" r="1.5" fill="var(--text-main)" fill-opacity="0" stroke="none"/>`;
  $('rtm-conduccion-luz').innerHTML = hl;
  $('rtm-aparatos-svg').innerHTML = aparatosEstatico();
  // la zona sin riego (anterior y punta) del ST elevado: se dibuja con la pared en reposo
  $('rtm-lesion').innerHTML = G.teselas.filter(t => (t.banda === 'siv' && t.i >= 4) || (t.banda === 'vi' && t.i >= 10) || t.banda === 'pt').map(t => `<path d="${polyTesela(t, 0, 0)}" fill="var(--accent-red)" fill-opacity=".28" stroke="none"/><path d="${polyTesela(t, 0, 0)}" fill="url(#rtm-cicatriz-t)" stroke="none" opacity=".6"/>`).join('');
  cacheEscena();
}
let EL = {};
function cacheEscena() {
  EL = { base: [...document.querySelectorAll('#rtm-teselas-base path')], tinta: [], segs: [...document.querySelectorAll('#rtm-conduccion-luz [data-seg]')].map(e => ({ e, a: nodoK(e.dataset.seg.split('|')[0]), b: nodoK(e.dataset.seg.split('|')[1]) })),
    pk: [...document.querySelectorAll('#rtm-conduccion-luz [data-pk]')].map(e => ({ e, k: +e.dataset.pk })) };
  document.querySelectorAll('[data-tinta]').forEach(e => { EL.tinta[+e.dataset.tinta] = e; });
}
function geometria(dv, da) {
  if (ultimoD && Math.abs(ultimoD[0] - dv) < 0.04 && Math.abs(ultimoD[1] - da) < 0.04) return;
  ultimoD = [dv, da];
  G.teselas.forEach((t, i) => { const d = polyTesela(t, dv, da); EL.base[i].setAttribute('d', d); EL.tinta[i].setAttribute('d', d); });
  $('rtm-trama-musculo').innerHTML = `<path d="${G.teselas.map(t => polyTesela(t, dv, da)).join(' ')}"/>`;
  $('rtm-contornos').innerHTML = G.BANDAS.map(b => contornoBanda(b, b.reg === 'v' ? dv : da)).join('');
}
export function pintarEscenaPendiente() {
  geometria(0, 0);
  for (const e of EL.tinta) e.setAttribute('fill-opacity', 0);
  for (const s of EL.segs) s.e.setAttribute('stroke-opacity', 0);
  ['rtm-ap', 'rtm-circuito-fl', 'rtm-circuito-tv', 'rtm-cicatriz', 'rtm-lesion', 'rtm-parches', 'rtm-puente', 'rtm-cerrojo'].forEach(id => $(id) && $(id).setAttribute('opacity', 0));
  $('rtm-fichas').innerHTML = ''; pintarTorniquete('L', 0, 1, 1, false, false); pintarTorniquete('R', 0, 1, 1, false, false);
  $('escena-lectura').innerHTML = `<b>Pendiente de fuente</b>: el torniquete y el His esperan su guía.`;
}
export function pintarEscena(t) {
  if (!mo) return;
  const lat = latidos(t), sinMec = mo.m.sinMecanica;
  const dv = sinMec ? 0 : mo.contraccion(t, lat) * 3.4, da = mo.m.fa || mo.m.flOn || sinMec ? 0 : mo.contraccionA(t) * 1.8;
  geometria(dv, da);
  // la tinta: el frente (acento), lo despolarizado (refractario) y lo que se recupera
  G.teselas.forEach((ts, i) => {
    const k = ts.nodo.k, u = ultimaAct(k, t), tau = t - u, apd = ts.reg === 'v' ? mo.apdK[k] : 0.15;
    let op = 0, col = 'var(--accent-yellow)';
    if (tau >= 0 && tau < apd) { if (tau < 0.024) { col = 'var(--text-main)'; op = 0.92; } else { const f = tau / apd; op = f < 0.78 ? 0.62 - 0.18 * f : (0.62 - 0.14) * (1 - (f - 0.78) / 0.22); } }
    const e = EL.tinta[i]; e.setAttribute('fill-opacity', op.toFixed(2)); if (e.getAttribute('fill') !== col) e.setAttribute('fill', col);
  });
  for (const s of EL.segs) { const ub = ultimaAct(s.b, t), ua = ultimaAct(s.a, t), d = t - ub; s.e.setAttribute('stroke-opacity', d >= 0 && d < 0.07 && ub >= ua - 0.001 ? (1 - d / 0.07).toFixed(2) : 0); }
  for (const p of EL.pk) { const d = t - ultimaAct(p.k, t); p.e.setAttribute('fill-opacity', d >= 0 && d < 0.05 ? (1 - d / 0.05).toFixed(2) : 0); }
  const brillo = (id, k, dur) => { const d = t - ultimaAct(k, t); $(id).setAttribute('fill-opacity', d >= 0 && d < dur ? (0.8 * (1 - d / dur)).toFixed(2) : 0); };
  brillo('rtm-sa-luz', nodoK('sa'), 0.08); brillo('rtm-nav-luz', nodoK('navC'), 0.1);
  // el atajo, los circuitos, la cicatriz, la lesión, los parches
  $('rtm-ap').setAttribute('opacity', mo.m.apOn ? 1 : 0); $('rtm-puente').setAttribute('opacity', mo.m.apOn ? 1 : 0); $('rtm-txt-puente').setAttribute('opacity', mo.m.apOn ? 1 : 0);
  { const d = t - ultimaAct(nodoK('ap'), t); $('rtm-ap-luz').setAttribute('stroke-opacity', mo.m.apOn && d >= 0 && d < 0.08 ? (1 - d / 0.08).toFixed(2) : 0); }
  $('rtm-circuito-fl').setAttribute('opacity', mo.m.flOn ? 1 : 0); $('rtm-circuito-tv').setAttribute('opacity', mo.m.crOn ? 1 : 0); $('rtm-cicatriz').setAttribute('opacity', S.clave === 'tv' ? 1 : 0);
  if (mo.m.flOn || mo.m.crOn) { const lista = mo.m.flOn ? G.FL : G.CR; let mejor = null, dm = 9; for (const n of lista) { const d = t - ultimaAct(n.k, t); if (d >= 0 && d < dm) { dm = d; mejor = n; } } fichaCircuito(mejor); } else fichaCircuito(null);
  $('rtm-lesion').setAttribute('opacity', S.clave === 'stemi' ? 1 : 0);
  // la rama bloqueada, tachada
  const tach = (x, y) => `<path d="M${x - 4} ${y - 4} L${x + 4} ${y + 4} M${x + 4} ${y - 4} L${x - 4} ${y + 4}" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="6.5" fill="none" stroke="var(--accent-red)" stroke-width=".8"/>`;
  const clave = (mo.m.ramaI ? 'i' : '') + (mo.m.ramaD ? 'd' : '');
  if ($('rtm-rama-tachada').dataset.k !== clave) { $('rtm-rama-tachada').dataset.k = clave; $('rtm-rama-tachada').innerHTML = (mo.m.ramaI ? '' : tach(185, 188)) + (mo.m.ramaD ? '' : tach(165, 199)); }
  const shockVisible = !!(S.desfib && S.desfib.modo);
  $('rtm-parches').setAttribute('opacity', shockVisible ? 1 : 0);
  if (S.desfib && S.desfib.tChoque) { const d = t - S.desfib.tChoque; $('rtm-destello').setAttribute('fill-opacity', d >= 0 && d < 0.25 ? (0.35 * (1 - d / 0.25)).toFixed(2) : 0); }
  // la gota del bolo, bajando por la cava superior
  if (S.bomba && S.bomba.bolo) { const d = (t - S.bomba.t0 - 0.9) / 0.6; $('rtm-gota').setAttribute('opacity', d >= 0 && d < 1 ? 1 : 0); if (d >= 0 && d < 1) $('rtm-gota').setAttribute('transform', `translate(${f1(-2 * d)} ${f1(2 + 54 * d)})`); } else $('rtm-gota').setAttribute('opacity', 0);
  pintarLupaAv(t); pintarCelula(t); pintarAparatosVivos(t);
}
let fichaCirc = null;
function fichaCircuito(n) {
  let g = $('rtm-ficha-circ');
  if (!g) { g = document.createElementNS(NS, 'circle'); g.id = 'rtm-ficha-circ'; g.setAttribute('r', '3'); g.setAttribute('fill', 'var(--text-main)'); $('rtm-svg').insertBefore(g, $('rtm-anillo')); }
  if (!n) { g.setAttribute('opacity', 0); return; }
  g.setAttribute('opacity', 1); g.setAttribute('cx', f1(n.x)); g.setAttribute('cy', f1(n.y));
}

/* ---------- La lupa del nodo AV: lee los pasos y los bloqueos del motor ---------- */
function refrNodo(tipo) { const m = mo.m, b = m.navRef ? { navR: m.navRef.R, navL: m.navRef.L } : { navR: 0.32, navL: 0.22 }; return b[tipo] * m.navF; }
function sobre(camino, f) {   // un punto a lo largo de una polilínea (fracción 0..1)
  const L = []; let tot = 0; for (let i = 1; i < camino.length; i++) { const d = Math.hypot(camino[i][0] - camino[i - 1][0], camino[i][1] - camino[i - 1][1]); L.push(d); tot += d; }
  let s = clamp(f, 0, 1) * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i]) { const r = s / L[i]; return [camino[i][0] + (camino[i + 1][0] - camino[i][0]) * r, camino[i][1] + (camino[i + 1][1] - camino[i][1]) * r]; } s -= L[i]; }
  return camino[camino.length - 1];
}
function pintarLupaAv(t) {
  const m = mo.m, kR = nodoK('navR'), kL = nodoK('navL'), kC = nodoK('navC');
  let fichas = '';
  const ficha = (p, op = 1) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.6" fill="var(--text-main)" fill-opacity="${op}"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.4" fill="var(--text-main)" fill-opacity="${(op * 0.22).toFixed(2)}"/>`;
  const giro = { L: 0, R: 0 }, ult = { L: -9, R: -9 };
  for (const e of mo.pasoNodo) {
    if (e.t > t + 0.3) continue;
    const lado = e.k === kL ? 'L' : e.k === kR ? 'R' : 'P';
    if (lado === 'P') { const f = (t - (e.t - 0.06)) / 0.14; if (e.paso && f >= 0 && f <= 1) fichas += ficha(sobre(CAMINO.puente, f)); continue; }
    const dIn = (lado === 'L' ? 0.12 : 0.06) * m.navRet, retro = e.de === kC;
    if (e.paso && e.t <= t) { giro[lado]++; ult[lado] = e.t; }
    const cIn = lado === 'L' ? CAMINO.Lin : CAMINO.Rin, cOut = (lado === 'L' ? CAMINO.Lout : CAMINO.Rout).concat(CAMINO.com.slice(1));
    if (!retro) {
      const fa = (t - (e.t - dIn)) / dIn; if (fa >= 0 && fa < 1) fichas += ficha(sobre(cIn, fa));
      if (e.paso) { const fb = (t - e.t) / dIn; if (fb >= 0 && fb < 1) fichas += ficha(sobre(cOut, fb)); }
      else { const fb = (t - e.t) / 0.18; if (fb >= 0 && fb < 1) { const T = TORN[lado], y = T.y - 14; fichas += `<g opacity="${(1 - fb).toFixed(2)}"><circle cx="${T.x}" cy="${y}" r="2.4" fill="var(--text-main)"/><path d="M${T.x - 5} ${y - 5} L${T.x + 5} ${y + 5} M${T.x + 5} ${y - 5} L${T.x - 5} ${y + 5}" stroke="var(--accent-red)" stroke-width="1.6" stroke-linecap="round"/></g>`; } }
    } else {
      const fa = (t - (e.t - dIn)) / dIn; if (fa >= 0 && fa < 1) fichas += ficha(sobre([...cOut].reverse(), fa));
      if (e.paso) { const fb = (t - e.t) / dIn; if (fb >= 0 && fb < 1) fichas += ficha(sobre([...cIn].reverse(), fb)); }
    }
  }
  $('rtm-fichas').innerHTML = fichas;
  const cerr = t >= m.cerrojo && t < m.cerrojoFin;
  for (const lado of ['L', 'R']) {
    const R = refrNodo(lado === 'L' ? 'navL' : 'navR'), u = ult[lado], pasando = t - u < 0.09;
    const ang = (giro[lado] - (pasando ? 1 - easeOut((t - u) / 0.09) : 0)) * 2 * Math.PI / 3 + 0.3;
    const rearme = clamp((t - u) / R, 0, 1);
    pintarTorniquete(lado, ang, rearme, m.navF * (lado === 'L' ? 1 : 1), pasando, cerr);
  }
  const c = $('rtm-cerrojo'); c.setAttribute('opacity', cerr ? 1 : 0);
  if (cerr) { const d = clamp((t - m.cerrojo) / 0.25, 0, 1); c.setAttribute('transform', `translate(${f1(30 * (1 - d))} 0)`); }
}
const easeOut = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);

/* ---------- La célula: aguja, potencial de acción y canales ---------- */
function pintarCelula(t) {
  const nodo = ['nodal', 'aberrancia', 'flutter', 'fa', 'wpw'].includes(S.clave);
  $('rtm-cel-tit').textContent = nodo ? 'LA CÉLULA DEL NODO AV' : 'LA CÉLULA DEL VENTRÍCULO';
  $('rtm-electrodo').setAttribute('opacity', nodo ? 0 : 1); $('rtm-electrodo-nodo').setAttribute('opacity', nodo ? 1 : 0);
  const k = nodo ? nodoK('navC') : G.teselas.find(q => q.banda === 'vi' && q.i === 4 && q.c === 2).nodo.k;
  const apdDe = (u) => nodo ? 0.24 * mo.m.navF : (mo.apdK[k] || 0.3);
  const vEn = s => { const u = ultimaAct(k, s); const tau = s - u; if (tau >= 0 && tau < 0.6) return potencial(tau, apdDe(u), nodo, S.clave === 'hiperk' ? S.k : 4.2); const p = mo.previo[k]; return potencial(s - p, apdDe(p), nodo, S.clave === 'hiperk' ? S.k : 4.2); };
  const ventana = 1.1, x0 = 72, x1 = 160; let d = '';
  for (let i = 0; i <= 88; i++) { const s = t - ventana + ventana * i / 88; d += (i ? 'L' : 'M') + f1(x0 + (x1 - x0) * i / 88) + ' ' + f1(yPA(vEn(s))); }
  $('rtm-pa-linea').setAttribute('d', d);
  const V = vEn(t), a = angV(V);
  $('rtm-aguja').setAttribute('d', `M${f1(VOLT.x - 4 * Math.cos(a))} ${f1(VOLT.y - 4 * Math.sin(a))} L${f1(VOLT.x + (VOLT.r - 3) * Math.cos(a))} ${f1(VOLT.y + (VOLT.r - 3) * Math.sin(a))}`);
  // números de las fases sobre el último potencial completo (El Libro Azul: 0 a 4)
  const u = ultimaAct(k, t), apd = apdDe(u), tau = t - u; let hf = '';
  if (tau >= 0 && tau < ventana - 0.05) {
    const xt = s => x0 + (x1 - x0) * (s - (t - ventana)) / ventana;
    const marcas = nodo ? [[0, 0.025, 4], [3, apd * 0.75, 6], [4, apd + 0.1, 0]] : [[0, 0.001, 0], [1, 0.009, -6], [2, apd * 0.35, -5], [3, apd * 0.9, 2], [4, apd + 0.12, 0]];
    for (const [n, s, dy] of marcas) { const ss = u + s; if (ss > t) continue; const x = clamp(xt(ss) + (n === 0 ? -5 : 0), 77, 157), y = clamp(yPA(potencial(s, apd, nodo, S.clave === 'hiperk' ? S.k : 4.2)) + dy - 6, 24, 57);
      hf += `<circle cx="${f1(x)}" cy="${f1(y)}" r="4.6" fill="var(--bg-main)" stroke="var(--accent-yellow)" stroke-width=".6"/><text x="${f1(x)}" y="${f1(y + 2.8)}">${n}</text>`; }
  }
  $('rtm-pa-fases').innerHTML = hf;
  const fz = fase(tau, apd, nodo), luzF = tau >= 0 && tau < 0.03;
  const taponCa = nodo && (S.farmaco === 'dilt' || S.diltNodo || (S.clave === 'wpw' && S.wpwNodo === 'dilt')), taponK = !nodo && S.clave === 'torsade' && Object.values(S.qt || {}).some(Boolean);
  $('rtm-canal-na').innerHTML = canalHtml(!nodo && fz === 0, false, luzF);
  $('rtm-canal-ca').innerHTML = canalHtml(nodo ? fz === 0 : fz === 2, taponCa, false);
  $('rtm-canal-k').innerHTML = canalHtml(fz === 3, taponK, false);
}

/* ---------- Los aparatos ---------- */
export function pintarAparatos() {
  const b = S.bomba, dfb = S.desfib;
  $('rtm-bomba').setAttribute('opacity', b ? 1 : 0.6); $('rtm-desfib').setAttribute('opacity', dfb ? 1 : 0.6); $('rtm-marcapasos').setAttribute('opacity', pend() ? 1 : 0.45);
  $('rtm-bomba-cuerpo').innerHTML = bombaDe(b);
  let lect = '';
  if (b) lect += `Bomba: <b>${b.lectura}</b>. `;
  if (dfb) lect += `Desfibrilador: <b>${dfb.energia} · ${dfb.modo === 'sinc' ? 'sincronizado' : 'no sincronizado'}</b><span id="desfib-est"></span>. `;
  if (pend()) lect += 'Generador de marcapasos: <b>pendiente de fuente</b>.';
  $('aparatos-lectura').innerHTML = lect || 'Ningún aparato en uso.';
  const ang = dfb ? ({ '100 J': -60, '120 J': -30, '200 J': 30, '120-200 J': 0 }[dfb.energia] ?? 0) : -120;
  const mando = $('rtm-mando'); if (mando) mando.setAttribute('transform', `rotate(${ang})`);
  { const tx = $('rtm-desfib-txt1'), txt = dfb ? dfb.energia : 'APAGADO';
    tx.textContent = txt;   // la energía (el modo lo dice la tecla SINC, encendida, y la lectura); si no cabe en 35, se aprieta
    if (txt.length * 5.4 > 35) { tx.setAttribute('textLength', 35); tx.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } else { tx.removeAttribute('textLength'); tx.removeAttribute('lengthAdjust'); } }
}
function pintarAparatosVivos(t) {
  const b = S.bomba;
  // émbolo: el carro empuja mientras dura el bolo
  const empuje = b && b.bolo ? clamp((t - b.t0) / 0.6, 0, 1) : b ? 0.35 : 0;
  $('rtm-embolo').innerHTML = embolo(OB, empuje);
  const bolo = $('rtm-bolo');
  if (b && b.bolo) { const f = (t - b.t0 - 0.3) / 0.6; if (f >= 0 && f < 1) { const L = $('rtm-linea'), len = L.getTotalLength(), p = L.getPointAtLength(len * f); bolo.setAttribute('cx', f1(p.x)); bolo.setAttribute('cy', f1(p.y)); bolo.setAttribute('opacity', 1); } else bolo.setAttribute('opacity', 0); } else bolo.setAttribute('opacity', 0);
  const d = S.desfib;
  if (d) {
    const est2 = d.tChoque && t >= d.tChoque && t < d.tChoque + 0.6 ? 'CHOQUE' : d.cargadoEn && t >= d.cargadoEn && !(d.tChoque && t >= d.tChoque) ? 'CARGADO' : d.cargadoEn && t < d.cargadoEn ? 'CARGANDO' : 'LISTO';
    const de = $('desfib-est'); if (de && de.dataset.e !== est2) { de.dataset.e = est2; de.textContent = ' · ' + est2.toLowerCase(); }
    $('rtm-btn-1').setAttribute('fill', est2 === 'CARGADO' ? 'var(--text-main)' : 'var(--text-muted)');
    $('rtm-btn-0').setAttribute('fill', est2 === 'CARGANDO' ? 'var(--accent-yellow)' : 'var(--text-muted)');
    $('rtm-btn-2').setAttribute('fill', d.modo === 'sinc' ? 'var(--accent-yellow)' : 'var(--text-muted)');
    // el ECG en la pantalla del desfibrilador: el último segundo de la tira
    let p = ''; for (let i = 0; i <= 36; i++) { const s = t - 1 + i / 36; p += (i ? 'L' : 'M') + f1(i * 0.95) + ' ' + f1(7 - clamp(ecgEn(s), -1.2, 1.4) * 3.2); }
    $('rtm-desfib-ecg').setAttribute('d', p);
  } else $('rtm-desfib-ecg').setAttribute('d', '');
}
