// Las gráficas vivas de la maqueta b3-ritmo (lecturas de las figuras del libro).
import { $, clamp, org } from './ayudas.js';
import { F195, F211, F213, F214, NOMBRE_F, fcFig, sup211 } from '../../../data/ritmo-vivo-data.js';
import { S, tapado } from './pagina.js';
/* ---------- Las gráficas vivas (lecturas de las figuras del libro) ---------- */
const tx = (x, y, t, a = 'start', c = 'var(--text-muted)', fw = '') => `<text x="${x}" y="${y}" font-size="9" fill="${c}" text-anchor="${a}" font-family="system-ui, sans-serif" ${fw}>${t}</text>`;
export function pintarGraficas() {
  let h = '';
  if (tapado) { $('graficas').innerHTML = ''; return; }
  if (S.clave === 'fa') h += grafica195();
  if (S.clave === 'fv') h += grafica211() + grafica213() + grafica214();
  if ((S.clave === 'aesp' || S.clave === 'asistolia') && S.parada && S.parada.adrenalina.length) h += grafica213();
  $('graficas').innerHTML = h;
}
const x195 = h => 34 + h / 6 * 300, y195 = f => 112 - (f - 80) / 60 * 96;
function grafica195() {
  let s = `<svg id="rtv-g195" viewBox="0 0 360 140" role="img" aria-label="Frecuencia en las 6 horas tras cada fármaco">`;
  for (let f = 80; f <= 140; f += 20) s += `<line x1="34" x2="334" y1="${y195(f)}" y2="${y195(f)}" stroke="var(--border-color)" stroke-opacity=".5"/>` + tx(30, y195(f) + 3, f, 'end');
  for (let h = 0; h <= 6; h++) s += tx(x195(h), 128, h + ' h', 'middle');
  s += `<line x1="34" x2="334" y1="${y195(100)}" y2="${y195(100)}" stroke="var(--accent-yellow)" stroke-dasharray="4 3"/>` + tx(40, y195(100) - 3, '100 lpm', 'start', 'var(--accent-yellow)');
  const col = { dilt: 'var(--accent-red)', amio: 'var(--accent-yellow)', digo: 'var(--accent-green)' }, dash = { dilt: '', amio: '6 3', digo: '2 3' };
  for (const k of ['dilt', 'amio', 'digo']) { const sel = S.farmaco === k; s += `<polyline points="${F195[k].map((f, i) => `${x195(i)},${y195(f).toFixed(1)}`).join(' ')}" fill="none" stroke="${col[k]}" stroke-width="${sel ? 3 : 1.6}" stroke-dasharray="${dash[k]}" stroke-opacity="${S.farmaco && !sel ? .45 : 1}"/>`; }
  if (F195[S.farmaco]) s += `<circle cx="${x195(S.horas)}" cy="${y195(fcFig(S.farmaco, S.horas)).toFixed(1)}" r="5" fill="var(--text-main)" stroke="var(--bg-main)" stroke-width="2"/>`;
  s += `</svg>`;
  const ley = ['dilt', 'amio', 'digo'].map(k => `<span style="white-space:nowrap"><svg class="rtv-ley" width="18" height="6" viewBox="0 0 18 6"><line x1="0" y1="3" x2="18" y2="3" stroke="${col[k]}" stroke-width="2.4" stroke-dasharray="${dash[k]}"/></svg> ${NOMBRE_F[k]}${S.farmaco === k ? ' (el elegido)' : ''}</span>`).join(' · ');
  return `<div class="rtv-grafica"><p>La Fig. 19.5, viva: la FC media de la FA tras cada fármaco ${org('lectura del gráfico · ficha · p. 24')}. Su número fija el muelle del torniquete de arriba.</p>${s}<p>${ley}</p></div>`;
}
const x211 = m => 34 + m / 22 * 300, y211 = s => 88 - s / 50 * 76;
function grafica211() {
  const mi = S.parada.minuto, sv = sup211(mi);
  let s = `<svg id="rtv-g211" viewBox="0 0 360 108" role="img" aria-label="Supervivencia según el minuto del primer choque">`;
  for (let v = 0; v <= 50; v += 25) s += `<line x1="34" x2="334" y1="${y211(v)}" y2="${y211(v)}" stroke="var(--border-color)" stroke-opacity=".5"/>` + tx(30, y211(v) + 3, v + ' %', 'end');
  for (const m of [5, 10, 15, 20]) s += tx(x211(m), 102, 'min ' + m, 'middle');
  s += `<polyline points="${F211.map(([m, v]) => `${x211(m)},${y211(v)}`).join(' ')}" fill="none" stroke="var(--accent-red)" stroke-width="2"/>` + F211.map(([m, v]) => `<circle cx="${x211(m)}" cy="${y211(v)}" r="3" fill="var(--accent-red)"/>`).join('');
  s += `<circle cx="${x211(mi)}" cy="${y211(sv)}" r="6" fill="var(--text-main)" stroke="var(--bg-main)" stroke-width="2"/>` + tx(clamp(x211(mi) + 9, 40, 290), y211(sv) - 6, Math.round(sv) + ' %', 'start', 'var(--text-main)', 'font-weight="700"') + `</svg>`;
  return `<div class="rtv-grafica"><p>Si el primer choque llega en el minuto ${mi}: sobrevive ~${Math.round(sv)} % ${org('lectura de la Fig. 21.1 · ficha · p. 59')}</p>${s}</div>`;
}
const x213 = m => 34 + (m - 3) / 5 * 300, y213 = v => 92 - (v - 15) / 20 * 80;
function grafica213() {
  let s = `<svg id="rtv-g213" viewBox="0 0 360 112" role="img" aria-label="Presión de perfusión coronaria y adrenalina">`;
  for (let v = 15; v <= 35; v += 10) s += `<line x1="34" x2="334" y1="${y213(v)}" y2="${y213(v)}" stroke="var(--border-color)" stroke-opacity=".5"/>` + tx(30, y213(v) + 3, v, 'end');
  for (let m = 3; m <= 8; m++) s += tx(x213(m), 106, 'min ' + m, 'middle');
  s += `<line x1="${x213(5)}" x2="${x213(5)}" y1="12" y2="92" stroke="var(--accent-yellow)" stroke-dasharray="3 3"/>` + tx(x213(5) + 4, 20, 'adrenalina', 'start', 'var(--accent-yellow)');
  s += `<polyline points="${F213.map(([m, v]) => `${x213(m)},${y213(v).toFixed(1)}`).join(' ')}" fill="none" stroke="var(--accent-red)" stroke-width="2"/>`;
  const dada = S.parada && S.parada.adrenalina.length; if (dada) s += tx(x213(6.2), y213(33) - 6, '+30 % en el texto', 'start', 'var(--text-main)');
  s += `</svg>`;
  return `<div class="rtv-grafica"><p>La Fig. 21.3: presión de perfusión coronaria (mmHg) durante la RCP; adrenalina en el minuto 5 ${org('lectura del gráfico · ficha · p. 62')}. El texto dice +30 %; la figura sube más (ver la nota).</p>${s}</div>`;
}
const x214 = m => 34 + m / 22 * 300, y214 = v => 92 - v / 40 * 80;
function grafica214() {
  let s = `<svg id="rtv-g214" viewBox="0 0 360 112" role="img" aria-label="ETCO2 durante la RCP, con y sin recuperación del pulso">`;
  for (let v = 0; v <= 40; v += 20) s += `<line x1="34" x2="334" y1="${y214(v)}" y2="${y214(v)}" stroke="var(--border-color)" stroke-opacity=".5"/>` + tx(30, y214(v) + 3, v, 'end');
  for (const m of [0, 10, 20]) s += tx(x214(m), 106, 'min ' + m, 'middle');
  s += `<rect x="${x214(19)}" y="${y214(15)}" width="${x214(21) - x214(19)}" height="${y214(10) - y214(15)}" fill="var(--accent-yellow)" fill-opacity=".35"/>`;
  s += `<polyline points="${F214.rce.map(([m, v]) => `${x214(m)},${y214(v)}`).join(' ')}" fill="none" stroke="var(--accent-green)" stroke-width="2"/><polyline points="${F214.no.map(([m, v]) => `${x214(m)},${y214(v)}`).join(' ')}" fill="none" stroke="var(--accent-red)" stroke-width="2" stroke-dasharray="5 3"/>`;
  s += tx(x214(1), y214(36), 'recuperan el pulso', 'start', 'var(--accent-green)') + tx(x214(11), y214(13) + 2, 'no lo recuperan', 'start', 'var(--accent-red)') + tx(x214(15.8), y214(17.5), '10-15', 'start', 'var(--accent-yellow)') + `</svg>`;
  return `<div class="rtv-grafica"><p>La ETCO₂ en 20 min de RCP: si no pasa de 10-15 mmHg, el pulso no suele volver ${org('lectura de la Fig. 21.4 · ficha · p. 63')}</p>${s}</div>`;
}

