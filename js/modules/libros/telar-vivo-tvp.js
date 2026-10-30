// El telar vivo, vista «eco de compresión» (estado tvp; Marino cap. 22, p. 4): la lupa pasa a ser un corte transversal
// de la vena femoral con la arteria al lado. Se aprieta con la sonda: la vena sana se aplasta, la que tiene trombo no,
// y la arteria nunca. Doppler color y chip «brazo con catéter». Datos y frases: js/data/telar-vivo-data-tvp.js.
// Los botones se crean una vez y se repintan en su sitio. Ids con prefijo tel-eco-.
import { derivarEco, TVP, celdasEco, SELLO_TVP } from '../../data/telar-vivo-data-tvp.js';
import { crearTope } from '../../core/tope.js';
import { citaHTML } from '../../core/citas.js';
import { instalarCss } from '../../core/dibujo-iso.js';

const $ = id => document.getElementById('tel-' + id);
const SVGNS = 'http://www.w3.org/2000/svg';
const reducir = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const n1 = v => +v.toFixed(1);

const CSS = `
.tel-raiz .tel-eco-mandos { display: grid; gap: 6px; padding: 2px 0 4px; }
.tel-raiz .tel-eco-mandos[hidden] { display: none; }
.tel-raiz .tel-escena .tope-sellos { left: 4px; right: auto; transform: none; bottom: 4px; max-width: 46%; align-items: flex-start; }
.tel-raiz .tel-eco-sonda { display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; align-items: center; font: 600 .78rem/1.2 var(--tel-sans, system-ui, sans-serif); }
.tel-raiz .tel-eco-sonda input { grid-column: 1 / -1; width: 100%; min-height: 44px; accent-color: var(--accent-yellow); }
.tel-raiz .tel-eco-sonda small { font-weight: 400; color: var(--text-muted); }
.tel-raiz .tel-eco-botones { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.tel-raiz .tel-eco-botones button[aria-pressed="true"] { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 22%, var(--tel-card2, var(--bg-card))); }
.tel-raiz .tel-eco-fig { display: grid; grid-template-columns: minmax(0, 46%) 1fr; gap: 8px; align-items: center; margin: 0; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 6px; }
.tel-raiz .tel-eco-fig img { width: 100%; height: auto; border-radius: 6px; display: block; }
.tel-raiz .tel-eco-fig figcaption { font-size: .7rem; line-height: 1.3; color: var(--text-dim); }
`;

/* ---------- El dibujo: corte transversal dentro de la lupa (360 × 330; lupa en 236,146, radio 114) ---------- */
export function construirEco() {
    const g = $('v-eco'); if (!g || g.dataset.listo) return;
    g.dataset.listo = '1';
    const pulso = reducir() ? '' : '<animate attributeName="opacity" values=".35;.95;.35" dur="1s" repeatCount="indefinite"/>';
    g.innerHTML = `
      <rect x="110" y="40" width="250" height="230" style="fill:var(--bg-card)"/>
      <path id="tel-eco-piel" d="M120 92 L352 92" style="stroke:var(--text-dim)" stroke-width="1.4" fill="none"/>
      <g id="tel-eco-sonda"><rect x="201" y="52" width="70" height="30" rx="6" style="fill:var(--bg-main);stroke:var(--text-main)" stroke-width="1.6"/>
        <text x="236" y="70" font-size="9.5" text-anchor="middle" style="fill:var(--text-main)">sonda</text></g>
      <g id="tel-eco-vena"><ellipse id="tel-eco-v-pared" cx="204" cy="158" rx="36" ry="30" style="fill:var(--bg-main);stroke:var(--text-main)" stroke-width="2"/>
        <ellipse id="tel-eco-v-trombo" cx="204" cy="158" rx="30" ry="24" style="fill:var(--text-dim);stroke:var(--accent-red)" stroke-width="1.4" stroke-dasharray="4 3" fill-opacity=".6"/>
        <ellipse id="tel-eco-v-flujo" cx="204" cy="158" rx="26" ry="20" style="fill:var(--accent-purple)" opacity=".55"/>
        <circle id="tel-eco-v-cateter" cx="204" cy="158" r="6" style="fill:none;stroke:var(--text-main)" stroke-width="2"/></g>
      <g id="tel-eco-arteria"><circle id="tel-eco-a-pared" cx="276" cy="158" r="19" style="fill:var(--bg-main);stroke:var(--accent-red)" stroke-width="4"/>
        <circle id="tel-eco-a-flujo" cx="276" cy="158" r="13" style="fill:var(--accent-red)" opacity=".7">${pulso}</circle></g>
      <text id="tel-eco-t-vena" x="204" y="214" font-size="9.5" text-anchor="middle" style="fill:var(--text-main)">vena femoral</text>
      <text x="276" y="214" font-size="9.5" text-anchor="middle" style="fill:var(--accent-red)">arteria</text>
      <text id="tel-eco-t-dv" x="204" y="227" font-size="9.5" text-anchor="middle" style="fill:var(--text-dim)"></text>
      <text id="tel-eco-t-da" x="276" y="227" font-size="9.5" text-anchor="middle" style="fill:var(--text-dim)"></text>
      <text id="tel-eco-t-aviso" x="240" y="242" font-size="9.5" text-anchor="middle" style="fill:var(--accent-red)"></text>`;
}

export function pintarEco(e) {
    const d = derivarEco(e), c = d.colapso, desp = d.sonda * 0.12;
    const q = (id, k, v) => $(id).setAttribute(k, v);
    q('eco-sonda', 'transform', `translate(0 ${n1(desp)})`);
    q('eco-piel', 'd', `M120 ${92 + n1(desp * 0.6)} L352 ${92 + n1(desp * 0.6)}`);
    const top = 128 + desp, ry = d.tvp ? 30 : Math.max(1.6, 30 * (1 - 0.95 * c)), rx = 36 * (1 + 0.28 * c);
    const cy = top + ry;
    for (const id of ['eco-v-pared', 'eco-v-trombo', 'eco-v-flujo']) { q(id, 'cy', n1(cy)); }
    q('eco-v-pared', 'ry', n1(ry)); q('eco-v-pared', 'rx', n1(rx));
    q('eco-v-trombo', 'ry', n1(ry * 0.8)); q('eco-v-trombo', 'rx', n1(rx * 0.83)); q('eco-v-flujo', 'ry', n1(ry * 0.66)); q('eco-v-flujo', 'rx', n1(rx * 0.72));
    q('eco-v-cateter', 'cy', n1(cy));
    $('eco-v-trombo').setAttribute('display', d.tvp ? 'inline' : 'none');
    $('eco-v-flujo').setAttribute('display', d.doppler && !d.tvp && !d.venaColapsa ? 'inline' : 'none');
    $('eco-v-cateter').setAttribute('display', d.brazo ? 'inline' : 'none');
    for (const id of ['eco-a-pared', 'eco-a-flujo']) q(id, 'cy', n1(158 + desp * 0.5));
    $('eco-a-flujo').setAttribute('display', d.doppler ? 'inline' : 'none');
    $('eco-t-vena').textContent = d.brazo ? 'vena axilar' : 'vena femoral';
    $('eco-t-dv').textContent = d.doppler ? (d.tvp ? 'lento o ausente' : 'flujo presente') : '';
    $('eco-t-da').textContent = d.doppler ? 'pulsátil' : '';
    $('eco-t-aviso').textContent = d.tvp && d.sonda >= TVP.sondaAviso ? 'no se aplasta' : d.venaColapsa ? 'solo la vena cede' : '';
}

/* ---------- Los mandos (se crean una vez) y el sello ---------- */
let mandos = null, tope = null, cambiar = null;
export function montarMandosEco(cont, accion) {
    if (mandos || !cont) return;
    mandos = cont; cambiar = accion;
    instalarCss('tel-eco', CSS);
    cont.innerHTML = `
      <label class="tel-eco-sonda" for="tel-eco-slider"><span>Presión de la sonda <small>(ilustrativo)</small></span><b id="tel-eco-valor">0 %</b>
        <input type="range" id="tel-eco-slider" min="0" max="${TVP.sondaTope}" step="5" value="0" aria-label="Presión de la sonda, de 0 a 100 por ciento, ilustrativa"></label>
      <div class="tel-eco-botones">
        <button type="button" class="tel-b" id="tel-eco-b-tvp" aria-pressed="false">Vena con trombo</button>
        <button type="button" class="tel-b" id="tel-eco-b-doppler" aria-pressed="false">Doppler color</button>
        <button type="button" class="tel-b" id="tel-eco-b-brazo" aria-pressed="false">Brazo con catéter</button>
        <button type="button" class="tel-b" id="tel-eco-b-soltar">Soltar la sonda</button>
      </div>
      <figure class="tel-eco-fig article-figure"><img src="js/modules/libros/img/mar-fig1-7-compresion-yugular.jpg" alt="Ecografía real: al comprimir, la yugular se colapsa y la carótida no" loading="lazy">
        <figcaption>Imagen real (Marino, Fig. 1.7, p. 15): es la <b>yugular</b> y la carótida, no la femoral. Al comprimir, la vena se colapsa y la arteria no.</figcaption></figure>`;
    $('eco-slider').addEventListener('input', ev => cambiar(s => { s.sonda = +ev.target.value; }));
    $('eco-b-tvp').addEventListener('click', () => cambiar(s => { s.tvp = !s.tvp; }));
    $('eco-b-doppler').addEventListener('click', () => cambiar(s => { s.doppler = !s.doppler; }));
    $('eco-b-brazo').addEventListener('click', () => cambiar(s => { s.brazo = !s.brazo; }));
    $('eco-b-soltar').addEventListener('click', () => cambiar(s => { s.sonda = 0; }));
    tope = crearTope({ monitor: $('escena'), dock: cont, cita: c => citaHTML(c, { clase: 'cita' }) });
}

// Tras cada repintado: muestra u oculta los mandos, los pone al día y aplica el tope de la sonda
export function sincronizarEco(e) {
    if (!mandos) return;
    const ver = e.vista === 'eco';
    mandos.hidden = !ver;
    if (!ver) { tope?.quitar('sonda'); return; }
    const d = derivarEco(e), s = $('eco-slider');
    if (+s.value !== d.sonda) s.value = d.sonda;
    $('eco-valor').textContent = d.sonda + ' %';
    $('eco-b-tvp').setAttribute('aria-pressed', String(d.tvp));
    $('eco-b-doppler').setAttribute('aria-pressed', String(d.doppler));
    $('eco-b-brazo').setAttribute('aria-pressed', String(d.brazo));
    const t = SELLO_TVP(e);
    if (t) tope.poner('sonda', { nivel: t.nivel || 'sello', titulo: t.titulo, texto: t.texto, cita: t.cita, origen: t.origen, deshabilita: t.nivel ? [] : ['#tel-eco-slider'] });
    else tope.quitar('sonda');
}

export const tableroEco = celdasEco;
