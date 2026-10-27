// La consola del balón de contrapulsación «como la real» (maqueta b3-shock, aparato Balón). Genérica: sin marcas ni logos.
// Pantalla oscura con tres trazados (ECG con las marcas de disparo e inflado, presión arterial con el pico de aumento
// diastólico, presión del balón) y el panel táctil de debajo. NO calcula: dibuja lo que da el motor (canales.js le pasa cada
// muestra) y la lectura por latido de soporte.mjs (picoDia/teleDia asistidos y picoNo/teleNo sin asistir).
// Origen de cada cosa: presión arterial y aumento = modelo (fisiología general); el ECG (P-QRS-T) y la forma del balón = ilustrativos;
// volumen 35-40 mL, hinchar en diástole y vaciar en la contracción isovolumétrica = ficha (Marino cap. 16, PDF p. 45).
// Disparo, modo, temporización, alarma, baterías y helio: interfaz ilustrativa. Temporización: la fuente no lo dice.
import { instalarCss } from '../../../core/dibujo-iso.js';

const NP = 180, HUECO = 10;   // la goma de barrido: 10 muestras, para que se lea como goma y no como un corte
const ALTO = { ecg: 44, art: 74, bal: 40 }, PAD = 3, MARGEN = 24;
const ART_MIN = 20, ART_MAX = 140;
const CSS = `
.iabp { --iabp-fondo: #0b1220; --iabp-ecg: var(--accent-green); --iabp-art: var(--accent-red); --iabp-balon: #4ea1ff; --iabp-tinta: #d7e3f4; --iabp-apagado: #7d8da6; --iabp-panel: #14203a;
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--iabp-fondo); color: var(--iabp-tinta); font-family: var(--sans); min-width: 0; }
.iabp-cab { display: flex; justify-content: space-between; gap: 6px; align-items: center; padding: 3px 8px; font: 700 .64rem var(--sans); letter-spacing: .06em; text-transform: uppercase; border-bottom: 1px solid var(--iabp-apagado); }
.iabp-cab .est { color: var(--iabp-balon); } .iabp-cab .est.espera { color: var(--accent-yellow); }
.iabp-trazas { display: block; width: 100%; }
.iabp-trazas .rot { font: 700 8px var(--sans); fill: var(--iabp-tinta); }
.iabp-trazas .esc { font: 8px var(--sans); fill: var(--iabp-apagado); }
.iabp-trazas .rej { stroke: var(--iabp-apagado); stroke-width: .5; stroke-dasharray: 2 3; opacity: .6; }
.iabp-trazas .sis { stroke: var(--iabp-art); stroke-width: .8; stroke-dasharray: 4 3; opacity: .9; }
.iabp-trazas .t-ecg, .iabp-trazas .t-art, .iabp-trazas .t-bal { fill: none; stroke-width: 1.5; stroke-linejoin: round; }
.iabp-trazas .t-ecg { stroke: var(--iabp-ecg); } .iabp-trazas .t-art { stroke: var(--iabp-art); } .iabp-trazas .t-bal { stroke: var(--iabp-balon); }
.iabp-trazas .r-mk { fill: var(--iabp-tinta); } .iabp-trazas .inf-mk, .iabp-trazas .des-mk { fill: var(--iabp-balon); }
.iabp-trazas .tel { font: 700 8px var(--sans); fill: var(--iabp-balon); } .iabp-trazas .tel-mk { fill: var(--iabp-balon); }
.iabp-linea { margin: 0; padding: 4px 8px; font: .66rem/1.35 var(--sans); color: var(--iabp-tinta); border-bottom: 1px solid var(--iabp-apagado); }
.iabp-trazas .lat { font: 700 9px var(--sans); fill: var(--iabp-tinta); text-anchor: middle; } .iabp-trazas .lat.no { fill: var(--iabp-apagado); }
.iabp-cifras { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: var(--iabp-apagado); border-top: 1px solid var(--iabp-apagado); }
.iabp-cifras > div { background: var(--iabp-fondo); padding: 3px 5px; min-width: 0; }
.iabp-cifras .n { font: .56rem/1.2 var(--sans); color: var(--iabp-apagado); text-transform: uppercase; letter-spacing: .04em; }
.iabp-cifras .v { font: 700 1.05rem/1.15 var(--sans); font-variant-numeric: tabular-nums; white-space: nowrap; }
.iabp-cifras .v small { font: 600 .56rem var(--sans); color: var(--iabp-apagado); margin-left: 2px; }
.iabp-cifras .c-ecg .v { color: var(--iabp-ecg); } .iabp-cifras .c-art .v { color: var(--iabp-art); } .iabp-cifras .c-aum .v, .iabp-cifras .c-fre .v { color: var(--iabp-balon); }
.iabp-cifras .c-art { grid-column: span 2; } .iabp-cifras .c-aum { grid-column: span 2; }
.iabp-barra { position: relative; height: 7px; background: color-mix(in srgb, var(--iabp-apagado) 40%, transparent); border-radius: 4px; margin-top: 2px; }
.iabp-barra i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--iabp-balon); border-radius: 4px; }
.iabp-barra b { position: absolute; top: -2px; bottom: -2px; width: 2px; background: var(--iabp-art); }
.iabp-aparte { grid-column: 1 / -1; font: .62rem/1.35 var(--sans); color: var(--iabp-tinta); }
.iabp-aparte b { color: var(--iabp-balon); font-weight: 700; } .iabp-aparte .no { color: var(--iabp-apagado); }
.iabp-ilu { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 2px 10px; font: .6rem var(--sans); color: var(--iabp-apagado); }
.iabp-panel { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px; padding: 6px; background: var(--iabp-panel); }
.iabp-panel .gr { display: grid; gap: 3px; align-content: start; min-width: 0; }
.iabp-panel .gr.ancho { grid-column: 1 / -1; }
.iabp-panel .tit { font: 700 .58rem var(--sans); color: var(--iabp-apagado); text-transform: uppercase; letter-spacing: .05em; }
.iabp-panel .fila { display: flex; gap: 3px; min-width: 0; }
.iabp-panel button { flex: 1 1 0; min-width: 0; min-height: 44px; border: 1px solid var(--iabp-apagado); border-radius: 8px; background: transparent; color: var(--iabp-tinta); font: 700 .68rem/1.1 var(--sans); padding: 2px 3px; cursor: pointer; }
.iabp-panel button small { display: block; font: 400 .54rem/1.15 var(--sans); color: var(--iabp-apagado); }
.iabp-panel button[aria-pressed="true"] { background: var(--iabp-balon); border-color: var(--iabp-balon); color: var(--iabp-fondo); }
.iabp-panel button[aria-pressed="true"] small { color: var(--iabp-fondo); }
.iabp-panel button:disabled { opacity: .5; cursor: default; border-style: dashed; }
.iabp-panel .espera[aria-pressed="true"] { background: var(--accent-yellow); border-color: var(--accent-yellow); }
.iabp-tubo { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--iabp-apagado) 40%, transparent); overflow: hidden; }
.iabp-tubo i { display: block; height: 100%; width: 0; background: var(--iabp-balon); }
.iabp-tubo.llena i { animation: iabp-llena 1.6s ease-out forwards; }
@keyframes iabp-llena { from { width: 0; } to { width: 100%; } }
@media (prefers-reduced-motion: reduce) { .iabp-tubo.llena i { animation: none; width: 100%; } }
.iabp-pie { padding: 4px 8px 6px; display: flex; flex-wrap: wrap; gap: 3px 8px; align-items: center; font: .66rem/1.35 var(--sans); color: var(--iabp-tinta); background: var(--iabp-fondo); }
`;

export function crearConsolaBalon(el, { cab, cita, org, alCambiar, citaIabp }) {
  instalarCss('iabp', CSS);
  const f0 = (x) => (x == null || !isFinite(x) ? '—' : String(Math.round(x)));
  const buf = { ecg: new Array(NP).fill(null), art: new Array(NP).fill(null), bal: new Array(NP).fill(null), mk: new Array(NP).fill(null), lat: new Array(NP).fill(null) };
  let cur = 0, W = 300, vol = 40;
  el.innerHTML = `<p class="iabp-linea" id="iabp-linea"><b>El balón trabaja a contratiempo del corazón:</b> se hincha en la diástole y se vacía justo antes de la sístole. ${org('ficha, p. 45', false)}</p><div class="iabp-cab"><span>Contrapulsación · disparo: ECG</span><span class="est" id="iabp-est">En marcha</span></div>
    <svg class="iabp-trazas" id="iabp-svg" role="img" aria-label="Tres trazados de la consola: ECG con marcas de disparo e inflado, presión arterial con el pico de aumento diastólico y presión del balón"></svg>
    <div class="iabp-cifras" id="iabp-cifras"></div>
    <div class="iabp-panel" id="iabp-panel">
      <div class="gr"><span class="tit">Modo</span><div class="fila"><button type="button" aria-pressed="true" disabled>Automático</button><button type="button" aria-pressed="false" disabled>Semiauto.<small>no en este modelo</small></button></div></div>
      <div class="gr"><span class="tit">Disparo</span><div class="fila"><button type="button" aria-pressed="true" disabled>ECG</button><button type="button" aria-pressed="false" disabled>Presión</button></div><div class="fila"><button type="button" aria-pressed="false" disabled>Marcapasos</button><button type="button" aria-pressed="false" disabled>Interno<small>no en este modelo</small></button></div></div>
      <div class="gr"><span class="tit">Frecuencia del balón</span><div class="fila" id="iabp-razon">${[1, 2, 3].map((n) => `<button type="button" data-razon="${n}" aria-pressed="false">1:${n}</button>`).join('')}</div></div>
      <div class="gr"><span class="tit">Aumento máx.</span><div class="fila"><button type="button" disabled aria-label="Bajar el aumento">▼</button><button type="button" disabled aria-label="Subir el aumento">▲<small>100 % = el volumen</small></button></div></div>
      <div class="gr ancho"><span class="tit">Temporización</span><div class="fila"><button type="button" disabled>◄ Inflado ►</button><button type="button" disabled>◄ Desinflado ►<small>la fuente no lo dice</small></button></div></div>
      <div class="gr"><span class="tit">Bomba</span><div class="fila"><button type="button" class="espera" id="iabp-espera" aria-pressed="false">Espera</button><button type="button" id="iabp-inicio" aria-pressed="true">Inicio</button></div></div>
      <div class="gr"><span class="tit">Llenado</span><div class="fila"><button type="button" id="iabp-llenado">Llenar<small>ilustrativo</small></button></div><div class="iabp-tubo" id="iabp-tubo"><i></i></div></div>
    </div>
    <div class="iabp-pie" id="iabp-pie"></div>`;
  const svg = el.querySelector('#iabp-svg');
  const yA = { ecg: PAD, art: PAD + ALTO.ecg + 6, bal: PAD + ALTO.ecg + ALTO.art + 12 };
  const H = yA.bal + ALTO.bal + PAD;
  const xDe = (i) => MARGEN + (i / (NP - 1)) * (W - MARGEN - 2);

  function montar() {
    W = Math.max(200, Math.round(svg.getBoundingClientRect().width || el.clientWidth || 300));
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('height', H);
    const rej = (y, v) => `<line class="rej" x1="${MARGEN}" x2="${W}" y1="${y}" y2="${y}"/><text class="esc" x="${MARGEN - 2}" y="${y + 3}" text-anchor="end">${v}</text>`;
    const yArt = (v) => yArtV(v);
    svg.innerHTML = `<text class="rot" x="2" y="${yA.ecg + 10}">ECG</text><text class="rot" x="2" y="${yA.art + 9}">ART</text><text class="rot" x="2" y="${yA.bal + 10}">BALÓN</text>`
      + rej(yArt(50), 50) + rej(yArt(100), 100)
      + `<line class="sis" id="iabp-sis" x1="${MARGEN}" x2="${W}" y1="-9" y2="-9"/>`
      + `<path class="t-ecg" id="iabp-pe"/><path class="t-art" id="iabp-pa"/><path class="t-bal" id="iabp-pb"/><g id="iabp-mk"></g><g id="iabp-lat"></g>`;
  }
  function yArtV(v) { return yA.art + ALTO.art * (1 - Math.min(1, Math.max(0, (v - ART_MIN) / (ART_MAX - ART_MIN)))); }
  const yEcg = (v) => yA.ecg + ALTO.ecg * (0.72 - v * 0.55);
  const yBal = (v) => yA.bal + ALTO.bal * (1 - Math.min(1.05, Math.max(0, v)) * 0.9) - 2;

  // una muestra del motor (la manda canales.js, en el mismo orden que al monitor)
  let ultInf = false, desdeR = 99, dInf = 14, iR = -1;
  function muestra(m) {
    const a = cab().ajuste, i = cur;
    buf.ecg[i] = m.ecg; buf.art[i] = m.art; buf.bal[i] = a.balon > 0 ? m.vBalon / a.balon : 0;
    const infla = m.vBalon > 20, mk = [];
    desdeR++;
    if (infla && !ultInf) { mk.push('inf'); if (desdeR >= 3 && desdeR < 60) { dInf = desdeR; if (iR >= 0 && buf.lat[iR]) buf.lat[iR].d = desdeR; } } else if (!infla && ultInf) mk.push('des');
    // (un latido real dura más de 13 muestras: así no hay doble disparo al rellenar la pantalla)
    if (m.r && desdeR >= 13) { mk.push('r'); desdeR = 0; }
    ultInf = infla;
    buf.mk[i] = mk.length ? mk : null;                       // una muestra puede llevar dos marcas (el vaciado coincide con la R)
    buf.lat[i] = mk.includes('r') ? { n: m.lat, d: dInf } : null; if (mk.includes('r')) iR = i;
    // la goma se lleva también la letra que cuelga de una R futura (se dibuja dInf muestras después de su R)
    for (let k = 1; k <= HUECO; k++) { const j = (i + k) % NP; buf.ecg[j] = buf.art[j] = buf.bal[j] = buf.mk[j] = buf.lat[j] = null; }
    cur = (i + 1) % NP;
  }
  function traza(arr, yf) {
    let d = '', pen = false;
    for (let i = 0; i < NP; i++) { const v = arr[i]; if (v == null) { pen = false; continue; } d += `${pen ? 'L' : 'M'}${xDe(i).toFixed(1)} ${yf(v).toFixed(1)}`; pen = true; }
    return d;
  }
  function pintar() {
    if (el.hidden) return;
    const wReal = Math.round(svg.getBoundingClientRect().width); if (wReal > 100 && Math.abs(wReal - W) > 2) montar();   // el ancho real, tras el primer layout
    const g = (id) => svg.querySelector('#' + id); if (!g('iabp-pe')) return;
    g('iabp-pe').setAttribute('d', traza(buf.ecg, yEcg)); g('iabp-pa').setAttribute('d', traza(buf.art, yArtV)); g('iabp-pb').setAttribute('d', traza(buf.bal, yBal));
    let h = '', hl = '', zona = null;
    const razon = cab().ajuste.razon, L = cab().lectura, en = cab().ajuste.balon > 0;
    let ultDes = -1, iInf = -1;
    for (let i = 0; i < NP; i++) {
      const mks = buf.mk[i], x = xDe(i).toFixed(1);
      if (mks) for (const mk of mks) {
        if (mk === 'r') h += `<path class="r-mk" d="M${x} ${yA.ecg} l-2.4 -0.1 l2.4 4.4 l2.4 -4.4z"/>`;
        else if (mk === 'inf') { h += `<path class="inf-mk" d="M${x} ${yA.ecg + ALTO.ecg + 1} l-3 4.4 h6z"/>`; iInf = i; }
        else { h += `<path class="des-mk" d="M${x} ${yA.ecg + ALTO.ecg + 5.4} l-3 -4.4 h6z"/>`; ultDes = i; if (iInf >= 0 && i > iInf && razon > 1) zona = [iInf, i]; }
      }
      // la letra A/n cuelga de su diástole: dInf muestras después de su R, y solo cuando el barrido ya llegó ahí
      const lt = buf.lat[i];
      const d = lt ? lt.d : 0;   // si su diástole queda fuera de la tira, no se dibuja la letra (no se arrima al borde: se amontonaba)
      if (lt && razon > 1 && i + d <= NP - 1 && ((cur - i + NP) % NP) > d + 1) {
        const asis = (((lt.n % razon) + razon) % razon) === 0, xl = xDe(i + d);
        hl += `<text class="lat ${asis ? '' : 'no'}" x="${xl.toFixed(1)}" y="${yA.art + 9}"${xl > W - 8 ? ' style="text-anchor:end"' : ''}>${asis ? 'A' : 'n'}</text>`;
      }
    }
    // la meseta del latido asistido (para señalarla) y la telediastólica: el pico del aumento entre el inflado y el vaciado
    if (zona && L && L.picoDia) hl += `<rect id="iabp-meseta" fill="none" x="${xDe(zona[0]).toFixed(1)}" y="${yArtV(L.picoDia + 4).toFixed(1)}" width="${Math.max(6, xDe(zona[1]) - xDe(zona[0])).toFixed(1)}" height="${(yArtV(L.picoDia - 10) - yArtV(L.picoDia + 4)).toFixed(1)}"/>`;
    if (ultDes >= 0 && razon > 1 && en && L && L.teleDia != null && L.teleNo != null) {
      const xd = xDe(ultDes), yb = yA.art + ALTO.art - 1, anc = xd > W - 62 ? 'end' : 'start';
      hl += `<path class="tel-mk" d="M${xd.toFixed(1)} ${yArtV(L.teleDia).toFixed(1)} l-3 -4.4 h6z"/><text class="tel" id="iabp-tel" x="${(anc === 'end' ? xd + 3 : xd - 3).toFixed(1)}" y="${yb}" text-anchor="${anc === 'end' ? 'end' : 'start'}">tele ${f0(L.teleDia)} ← ${f0(L.teleNo)}</text>`;
    }
    g('iabp-mk').innerHTML = h; g('iabp-lat').innerHTML = hl;
  }

  // las cifras (cada 0,35 s): lectura por latido del modelo
  function cifras() {
    const L = cab().lectura; if (!L) return;
    const a = cab().ajuste, u = L.u, en = a.balon > 0;
    const sis = L.sisPropia || u.pas, dia = u.pad_, pam = u.pam, aum = en ? L.picoDia : null;
    const max = 220, pc = (v) => Math.min(100, Math.max(0, v / max * 100));
    el.querySelector('#iabp-est').textContent = en ? 'En marcha' : 'Espera'; el.querySelector('#iabp-est').classList.toggle('espera', !en);
    el.querySelector('#iabp-espera').setAttribute('aria-pressed', String(!en)); el.querySelector('#iabp-inicio').setAttribute('aria-pressed', String(en));
    for (const b of el.querySelectorAll('[data-razon]')) b.setAttribute('aria-pressed', String(+b.dataset.razon === a.razon));
    const lineaSis = svg.querySelector('#iabp-sis'); if (lineaSis) { const y = yArtV(sis).toFixed(1); lineaSis.setAttribute('y1', y); lineaSis.setAttribute('y2', y); }
    const mas = en && aum != null && aum > sis;
    let aparte = '';
    if (en && a.razon > 1) aparte = `<div class="iabp-aparte">Latido <b>asistido</b> (A): aumento <b>${f0(L.picoDia)}</b>, telediastólica <b>${f0(L.teleDia)}</b> · latido <span class="no">no asistido (n)</span>: pico diastólico ${f0(L.picoNo)}, telediastólica ${f0(L.teleNo)} mmHg (modelo). La telediastólica asistida baja poco en este modelo: el balón se vacía en una fracción de segundo.</div>`;
    el.querySelector('#iabp-cifras').innerHTML = `<div class="c-ecg"><div class="n">FC</div><div class="v">${f0(u.fc)}<small>lpm</small></div></div>`
      + `<div class="c-fre"><div class="n">Frecuencia</div><div class="v">1:${a.razon}</div></div>`
      + `<div class="c-art"><div class="n">Presión arterial · sis / dia (media)</div><div class="v">${f0(sis)}/${f0(dia)} (${f0(pam)})<small>mmHg</small></div></div>`
      + `<div class="c-aum"><div class="n">Aumento · sistólica propia ${f0(sis)}</div><div class="v">${f0(aum)}<small>mmHg${mas ? ' · por encima de la sistólica' : ''}</small></div><div class="iabp-barra"><i style="width:${aum ? pc(aum) : 0}%"></i><b style="left:${pc(sis)}%"></b></div></div>`
      + `<div class="c-fre"><div class="n">Telediast.</div><div class="v">${f0(en ? L.teleDia : dia)}<small>mmHg</small></div></div>`
      + `<div class="c-fre"><div class="n">Balón</div><div class="v">${en ? f0(a.balon) : '0'}<small>mL</small></div></div>`
      + aparte
      + `<div class="iabp-ilu"><span>Alarma aumento: no en este modelo</span><span>Batería ▮▮▮▮ · ▮▮▮▮</span><span>Helio ▮▮▮▮</span><span>(ilustrativo)</span></div>`;
  }
  function pie() {
    el.querySelector('#iabp-pie').innerHTML = `${org('presión, aumento y cifras: el modelo', false)}${org('ECG, forma del balón, batería, helio, disparo: ilustrativo')}${org('volumen 35-40 mL y momento: ficha, p. 45', false)}`
      + `<span>El aumento diastólico sube el flujo coronario y la PAM; el vaciado antes de la sístole baja la poscarga (Marino cap. 16). Las cifras de aumento son del modelo: el libro no las da. La temporización (inflar pronto o tarde) no está en ninguna fuente de la app.</span>${cita(citaIabp)}`;
  }

  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.razon) alCambiar({ razon: +b.dataset.razon });
    else if (b.id === 'iabp-espera') { const a = cab().ajuste; if (a.balon > 0) { vol = a.balon; alCambiar({ balon: 0 }); } }
    else if (b.id === 'iabp-inicio') { if (cab().ajuste.balon === 0) alCambiar({ balon: vol }); }
    else if (b.id === 'iabp-llenado') { const t = el.querySelector('#iabp-tubo'); t.classList.remove('llena'); void t.offsetWidth; t.classList.add('llena'); }
  });
  montar(); pie();
  return { muestra, pintar, cifras, montar, borrar() { for (const k in buf) buf[k].fill(null); cur = 0; ultInf = false; desdeR = 99; iR = -1; } };
}
