// Simulador de eco cardíaca: el corazón 3D movido por el motor del latido, la ecografía modo B cortada de ese
// mismo corazón, la barra del ciclo A-G, el Wiggers y el asa presión-volumen.
//
// montarSimulador(raiz, opciones) engancha el marcado de eco.html que vive dentro de `raiz` (ids con prefijo cv-)
// y devuelve una API pequeña. Lo usan la app (index.js, que lo importa la primera vez que la vista se ve) y la
// página del laboratorio (laboratorio.html, con las pruebas de navegador).
//
// Regla: UN ESTADO POR FOTOGRAMA. En cada fotograma se decide un único estado (estadoMostrado(): el del motor
// mientras corre, o una muestra del último latido al revisar) y con ese objeto se construye la geometría y se
// dibujan la eco, el cursor del Wiggers, el punto del asa, la barra A-G y las cifras.
import { crearMotor, FASES } from './motor.mjs';
import { construirCorazon, LIMITES, TAPSE_POR_ML } from './corazon-geo.mjs';
import { crearCamara, m4, MODELO } from './mat.mjs';
import { crearWebGL } from './render-webgl.mjs';
import { ESCENARIOS } from './escenarios.mjs';
import { crearFlujo } from './flujo-sangre.mjs';
import { COLOR_FASE, segmentosFase, estadoRevision, crearDiagramas } from './diagramas.mjs';
import { VALVULAS, apertura, estadoGeo, crearTablaFormas, semejantes, extraDeMotor } from './formas.mjs';
import { VISTAS, planoVista, enPlano, crearEcografo, abanicoVista, direccionHaz, anguloHacia } from './ecografia.mjs';
import { crearModoM } from './modo-m.mjs';

export const NOMBRE_VISTA = { a4c: 'A4C', a2c: 'A2C', a3c: 'A3C', plax: 'PLAX', psaxAo: 'PSAX Ao', psaxMv: 'PSAX mitral', psaxPm: 'PSAX papilares' };
// orden de los chips: apicales, paraesternal largo, ejes cortos de la base al ápex
const ORDEN_VISTAS = ['a4c', 'a2c', 'a3c', 'plax', 'psaxAo', 'psaxMv', 'psaxPm'];
export { VISTAS, ESCENARIOS };

/**
 * @param {Element} raiz contenedor con el marcado de eco.html
 * @param {{ depuracion?: boolean, onVista?: (k: string) => void, onEscenario?: (k: string) => void }} opc
 */
export function montarSimulador(raiz, opc = {}) {
  const $ = (s) => raiz.querySelector(s);
  const $$ = (s) => raiz.querySelectorAll(s);
  const dpr = () => window.devicePixelRatio || 1;

  let motor = crearMotor(); motor.correr(12);           // hasta régimen estable
  const cam = crearCamara();
  const glC = $('#cv-gl'), escena = $('.cv-escena');
  // Solo WebGL. Sin WebGL se ve una imagen fija y no se construye geometría (la eco tampoco).
  const rgl = crearWebGL(glC);
  if (!rgl) {
    glC.hidden = true;
    const img = $('#cv-estatico'); img.src = new URL('./img/corazon-estatico.jpg', import.meta.url).href; img.hidden = false;
    $('#cv-sinwebgl').hidden = false; $('#cv-tarjeta-eco').querySelector('.cv-eco').hidden = true;
  }
  cam.enganchar(escena);

  // ---- tamaño de los lienzos: ancho en CSS × densidad (hasta 2×). Plegados miden 0: no se tocan.
  function ajustarLienzo() {
    const ancho = escena.clientWidth; if (!ancho) return;
    const n = Math.round(ancho * Math.min(dpr(), 2)); if (glC.width !== n) { glC.width = n; glC.height = n; }
  }
  const diag = crearDiagramas($('#cv-wig'), $('#cv-pvc'));
  function ajustarDiagramas() {
    const w = $('#cv-wig'), p = $('#cv-pvc'), n = Math.round(w.clientWidth * Math.min(dpr(), 2));
    if (!n || w.width === n) return;
    w.width = n; w.height = Math.round(n * 0.62); p.width = n; p.height = Math.round(n * 0.7); diag.invalidar();
  }
  const ro = new ResizeObserver(() => { ajustarLienzo(); ajustarDiagramas(); ajustarEco(); if (modoM.ajustar()) ultimoTM = null; });
  ro.observe(escena); ro.observe($('#cv-wig')); ro.observe($('#cv-eco')); ro.observe($('#cv-m'));
  const abierto = (id) => $(id).open;
  $('#cv-plegable-diag').addEventListener('toggle', () => { ajustarDiagramas(); diag.invalidar(); });

  let vel = 0.25, calidad = 1, pausa = false, tPrev = performance.now(), frames = 0, tFps = tPrev, simAcum = 0, realAcum = 0;
  const opciones = { corte: null, pericardio: true, detalle: true };
  // La geometría solo se reconstruye si ha cambiado algo (la simulación avanzó o una opción).
  let sucio = true, geo = null; const ensuciar = () => { sucio = true; };
  const sangre = crearFlujo(); let verSangre = true;
  // avanza el motor n pasos de 0,1 ms sumando los mL que pasan por cada válvula y vena, y mueve la sangre
  const FLUJOS = ['qMit', 'qTri', 'qAo', 'qPul', 'qVp', 'qRet'];
  function avanzar(n) {
    const pasado = { qMit: 0, qTri: 0, qAo: 0, qPul: 0, qVp: 0, qRet: 0 }, s = motor.s;
    for (let i = 0; i < n; i++) { motor.paso(0.0001); for (const k of FLUJOS) if (s[k] > 0) pasado[k] += s[k] * 0.0001; }
    if (geo) sangre.actualizar(n * 0.0001, s, geo.flujo, pasado);
  }
  function sim(dtReal) {
    const dtSim = dtReal * vel, n = Math.round(dtSim / 0.0001);
    avanzar(n);
    simAcum += n * 0.0001; realAcum += dtReal; sucio = true;
  }

  // ---- Barra del ciclo: fases A-G del último latido, con su duración real, y un cursor en el instante actual
  let cicloLatido = -1, cicloPeriodo = 0.857, cicloSeg = [];
  function construirCiclo() {
    const o = motor.onda, u = motor.ultimo; if (!o.length || !u) return;
    cicloLatido = motor.s.nLatido; cicloPeriodo = u.periodo;
    const seg = segmentosFase(o, cicloPeriodo); cicloSeg = seg;
    const pc = (t) => (t / cicloPeriodo * 100).toFixed(2) + '%';
    $('#cv-ciclo').innerHTML = seg.map(g => `<button type="button" data-fase="${g.f}" style="width:${pc(g.t1 - g.t0)};background:${COLOR_FASE[g.f]}" title="${g.f} · ${FASES[g.f]}" aria-label="Ir a ${g.f}: ${FASES[g.f]}">${(g.t1 - g.t0) / cicloPeriodo > 0.045 ? g.f : ''}</button>`).join('') + '<div class="cv-cur" id="cv-ciclo-cur"></div>';
    const tB = seg.find(g => g.f === 'B')?.t0, tE = seg.find(g => g.f === 'E')?.t0;
    $('#cv-ciclo-pie').innerHTML = (tB != null && tE != null)
      ? `<span style="left:${pc(tB)}">▲S1</span><span style="left:calc(${pc((tB + tE) / 2)} - 2.2em)">sístole</span><span style="left:${pc(tE)}">▲S2</span><span style="left:calc(${pc((tE + cicloPeriodo) / 2)} - 2.4em)">diástole</span>` : '';
  }
  $('#cv-ciclo').addEventListener('click', (e) => { const b = e.target.closest('button[data-fase]'); if (b) irAFase(b.dataset.fase); });
  function pintarCiclo(e) {
    if (motor.s.nLatido !== cicloLatido) construirCiclo();
    const cur = $('#cv-ciclo-cur'); if (cur) cur.style.left = Math.min(100, e.tLatido / cicloPeriodo * 100) + '%';
    $$('#cv-ciclo button').forEach(b => b.classList.toggle('on', b.dataset.fase === e.fase));
  }

  // ---- Un solo estado por fotograma
  let revision = null, lado = 'izquierdo';
  const estadoMostrado = () => revision || motor.s;
  function ponerPausa(p) { pausa = p; $('#cv-pausa').textContent = pausa ? '▶ Reanudar' : '⏸ Pausa'; }
  function revisar(e) { if (!e) return; revision = e; ponerPausa(true); ensuciar(); }
  function volverAlMotor() { if (!revision) return; revision = null; ensuciar(); }
  // Lleva al centro de la fase pedida (o de la siguiente a la que se ve) en el último latido, sin hacer correr el motor
  function irAFase(objetivo) {
    if (!cicloSeg.length) construirCiclo();
    const e = estadoMostrado(), i = cicloSeg.findIndex(g => g.f === e.fase);
    const g = objetivo ? cicloSeg.find(x => x.f === objetivo) : cicloSeg[(i + 1) % cicloSeg.length];
    if (g) revisar(estadoRevision(motor.onda, (g.t0 + g.t1) / 2));
  }

  // ---- Formas precalculadas (formas.mjs): con el latido estable se mezclan en la tarjeta gráfica
  const tabla = crearTablaFormas(); let usarFormas = true, latidoVisto = -1, ondaPrevia = null, estable = false, modoGeo = 'exacta';
  const extraGeo = () => extraDeMotor(motor);
  const opcionesGeo = () => ({ ...opciones, calidad });
  function olvidarFormas() { if (rgl) rgl.liberar('f' + tabla.olvidar() + ':'); ensuciar(); }
  function gestionarFormas() {
    if (!rgl || !usarFormas || opciones.corte) { if (tabla.lista || tabla.construyendo) olvidarFormas(); return; }
    if (motor.s.nLatido !== latidoVisto) {
      latidoVisto = motor.s.nLatido; estable = semejantes(ondaPrevia, motor.onda); ondaPrevia = motor.onda;
      if (estable && !tabla.construyendo && tabla.caduca(motor.onda)) tabla.pedir(motor.onda, motor.ultimo, opcionesGeo(), extraGeo());
    } else if (estable && !tabla.lista && !tabla.construyendo) tabla.pedir(motor.onda, motor.ultimo, opcionesGeo(), extraGeo());
    const vieja = tabla.trabajar(); if (vieja != null) { rgl.liberar('f' + vieja + ':'); ensuciar(); }
  }

  // ---- Ecografía (ecografia.mjs): el plano corta las MISMAS piezas que dibuja el corazón en este fotograma
  const ecoC = $('#cv-eco'), ecoCtx = ecoC.getContext('2d');
  let vistaEco = 'a4c', ecografo = null, ecoImg = null, planoEco = null, claveTd = '', refEco = null, refGeoTd = null, claveRef = '', fanEco = null;
  let ecoVisible = true, ultimoEco = -1e9, ecoInfo = null, ecoPendiente = true, ecoMs = 0;
  $('#cv-vistas').innerHTML = ORDEN_VISTAS.filter(k => VISTAS[k]).map(k => `<button type="button" class="cv-mini${k === vistaEco ? ' on' : ''}" data-eco="${k}" title="${VISTAS[k].nombre}">${NOMBRE_VISTA[k]}</button>`).join('');
  function elegirVista(k) {
    if (!VISTAS[k]) return;
    vistaEco = k; claveTd = ''; ecoPendiente = true;
    $$('[data-eco]').forEach(b => b.classList.toggle('on', b.dataset.eco === k));
    if (MEDIDAS[medir].vista && MEDIDAS[medir].vista !== k) elegirMedida('libre', false);
    else colocarLineaM();
    opc.onVista?.(k);
  }
  $('#cv-vistas').addEventListener('click', (e) => { const b = e.target.closest('[data-eco]'); if (b) elegirVista(b.dataset.eco); });
  function ajustarEco() {
    const w = Math.round(ecoC.clientWidth * Math.min(dpr(), 1.5)), h = Math.round(w * 0.8);
    if (!w || (ecografo && ecoC.width === w)) return;
    ecoC.width = w; ecoC.height = h; ecografo = crearEcografo({ ancho: w, alto: h }); ecoImg = ecoCtx.createImageData(w, h); ecoPendiente = true;
  }
  // ---- Modo M (modo-m.mjs): una línea del modo B a lo largo del tiempo, con calibres
  let modoEco = 'B', thetaM = 0, medir = 'libre', ultimoTM = null, ecoGeom = null;
  const guardado = { lvdd: null, lvsd: null };
  const MEDIDAS = {
    libre: { vista: null, guia: 'Mueve la línea M arrastrando en horizontal sobre la imagen. Pulsa ⏸ Pausa para congelar el trazado y toca dos puntos sobre él: la distancia vertical son mm de profundidad y la horizontal, ms.' },
    tapse: { vista: 'a4c', guia: 'Línea M sobre el anillo tricuspídeo lateral (apical 4 cámaras). Pulsa ⏸ Pausa, pon un calibre en el punto más alto del anillo (telediástole) y otro en el más bajo (telesístole): la distancia vertical es el TAPSE.' },
    vi: { vista: 'plax', guia: 'Línea M por el VI en el eje largo paraesternal, a la altura de las cuerdas. Pulsa ⏸ Pausa y mide del endocardio del tabique al de la pared posterior: con el VI más grande (telediástole), «Guardar como LVDd»; con el más pequeño (telesístole), «Guardar como LVSd».' },
  };
  const modoM = crearModoM($('#cv-m'), $('#cv-m-capa'), { onMedida: pintarMedida });
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function colocarLineaM() {
    ultimoTM = null; modoM.limpiar(); ecoPendiente = true;
    if (medir === 'libre' || !prepararPlanoEco()) return;
    const p = medir === 'tapse' ? refGeoTd.anilloTricLateral : refGeoTd.flujo.transformar([0, 0, -0.3 * refGeoTd.vi.L]);
    thetaM = clamp(anguloHacia(planoEco, p), -planoEco.mitad + 0.02, planoEco.mitad - 0.02);
  }
  function elegirModo(m) {
    modoEco = m; $$('[data-modo]').forEach(b => b.classList.toggle('on', b.dataset.modo === m));
    $('#cv-m-zona').hidden = m !== 'M';
    if (m === 'M') { modoM.ajustar(); colocarLineaM(); pintarGuia(); }
    ecoPendiente = true;
  }
  function elegirMedida(k, cambiarVista = true) {
    medir = k; $$('[data-medir]').forEach(b => b.classList.toggle('on', b.dataset.medir === k));
    $('#cv-m-vi').hidden = k !== 'vi';
    const v = MEDIDAS[k].vista;
    if (cambiarVista && v && v !== vistaEco) elegirVista(v); else colocarLineaM();
    modoM.borrarCalibres(); pintarGuia();
  }
  function pintarGuia() { $('#cv-m-guia').textContent = MEDIDAS[medir].guia; pintarMedida(modoM.medida()); }
  const enlace = (texto, tab, resaltar, panel = 'panel-cardio-tabs', esp = 'fisioUci', view = 'cardiologia') =>
    `<button type="button" class="especialidad-link" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${tab}" data-resaltar="${resaltar}">${texto} →</button>`;
  const f1 = (x) => x.toFixed(1).replace('.', ',');
  function pintarMedida(m) {
    const box = $('#cv-m-resultado'), enl = $('#cv-m-enlaces');
    const poner = (estado, html) => { box.className = 'tfg-estado' + (estado ? ' tfg-estado-' + estado : ''); box.innerHTML = html; };
    enl.innerHTML = '';
    if (medir === 'tapse') enl.innerHTML = enlace('TAPSE en la Ficha 5', 'cardio-monitorizacion-hemodinamica', '#cardio-eco-tapse') + enlace('VD en la Ficha 11', 'cardio-interaccion-corazon-pulmon', '#cardio-eco-vd');
    if (medir === 'vi') enl.innerHTML = enlace('Dimensiones normales (FATE)', 'umi-fate', '#umi-fate-dimensiones', 'panel-manual-umi-tabs', 'sobrevivirUmi', 'manualUmi')
      + (guardado.lvdd && guardado.lvsd ? `<button type="button" class="especialidad-link" id="cv-m-a-fs" data-especialidad="sobrevivirUmi" data-view="manualUmi" data-panel="panel-manual-umi-tabs" data-tab="umi-fate" data-resaltar="#umi-fs-resultado">Llevar LVDd y LVSd a la calculadora de FS (FATE) →</button>` : '');
    if (!m) { poner('', medir === 'vi' ? textoVi() : 'Sin medida: toca dos puntos sobre el trazado.'); return; }
    if (medir === 'libre') { poner('', `Δ profundidad <b>${f1(m.mm)} mm</b> · Δ tiempo <b>${Math.round(m.ms)} ms</b>`); return; }
    if (medir === 'vi') { poner('', `Medida: <b>${f1(m.mm)} mm</b> (${f1(m.mm / 10)} cm) · Δ tiempo ${Math.round(m.ms)} ms<br>` + textoVi()); return; }
    // TAPSE: las dos cifras de normalidad que cita la app; y lo que hace el modelo en este latido
    const t = m.mm, u = motor.ultimo, dir = planoEco ? direccionHaz(planoEco, thetaM) : [0, 0, 1];
    const exc = u ? Math.min(35, TAPSE_POR_ML * (u.edvD - u.esvD)) : 0;
    const lectura = t > 17 ? ['ok', 'por encima de las dos cifras de normalidad que cita la app (&gt;16 mm, Ficha 5; &gt;17 mm, Ficha 11).']
      : t > 16 ? ['warn', 'entre las dos cifras de la app: normal según la Ficha 5 (&gt;16 mm), no según la Ficha 11 (&gt;17 mm).']
      : ['danger', 'por debajo de las dos cifras de normalidad que cita la app (&gt;16 mm, Ficha 5; &gt;17 mm, Ficha 11).'];
    poner(lectura[0], `TAPSE medido: <b>${f1(t)} mm</b> — ${lectura[1]}<br><span class="cv-muted">En el modelo, el anillo lateral recorre ${f1(exc)} mm en este latido (${f1(exc * Math.abs(dir[2]))} mm a lo largo de esta línea). Su TAPSE sale de lo que se vacía el VD, así que también baja si baja la precarga (hemorragia, vasoplejía): el simulador aún no tiene un escenario de fallo del VD. Ilustrativo.</span>`);
  }
  function textoVi() {
    const d = guardado.lvdd, sv = guardado.lvsd, cm = (x) => x == null ? '—' : f1(x / 10) + ' cm';
    let t = `LVDd ${cm(d)} · LVSd ${cm(sv)}`;
    if (d && sv) { const fs = (d - sv) / d * 100; t += ` · <b>FS ${Math.round(fs)}%</b> (FA normal 28-41%, Teichholz, Ficha 5 de Fisiopatología UCI · Cardiología; en FATE, FEVI ≈ 2 × FS)`; }
    return t;
  }
  function guardarVi(k) { const m = modoM.medida(); if (!m) return; guardado[k] = m.mm; modoM.borrarCalibres(); pintarMedida(null); }
  $('#cv-m-lvdd').addEventListener('click', () => guardarVi('lvdd'));
  $('#cv-m-lvsd').addEventListener('click', () => guardarVi('lvsd'));
  $('#cv-m-borrar').addEventListener('click', () => modoM.borrarCalibres());
  // antes de que el enlace navegue (lo hace el listener de [data-especialidad] de home, en document), se
  // escriben los diámetros en la calculadora de FS de FATE y se recalcula
  $('#cv-m-enlaces').addEventListener('click', (e) => {
    if (!e.target.closest('#cv-m-a-fs')) return;
    const a = document.getElementById('umi-fs-lvdd'), b = document.getElementById('umi-fs-lvsd'); if (!a || !b) return;
    a.value = (guardado.lvdd / 10).toFixed(1); b.value = (guardado.lvsd / 10).toFixed(1);
    a.dispatchEvent(new Event('input', { bubbles: true })); b.dispatchEvent(new Event('input', { bubbles: true }));
  });
  $$('[data-modo]').forEach(b => b.addEventListener('click', () => elegirModo(b.dataset.modo)));
  $('#cv-medir').addEventListener('click', (e) => { const b = e.target.closest('[data-medir]'); if (b) elegirMedida(b.dataset.medir); });
  // arrastrar en horizontal sobre la imagen B mueve la línea M (en vertical, la página se desplaza)
  ecoC.style.touchAction = 'pan-y';
  let moviendoM = false;
  const thetaDe = (ev) => { const r = ecoC.getBoundingClientRect(), px = ecoC.width / r.width, x = (ev.clientX - r.left) * px, y = (ev.clientY - r.top) * px;
    return clamp(Math.atan2(x - ecoGeom.cx, Math.max(1, y - ecoGeom.arriba)), -planoEco.mitad + 0.02, planoEco.mitad - 0.02); };
  ecoC.addEventListener('pointerdown', (ev) => { if (modoEco !== 'M' || !ecoGeom || !planoEco) return; moviendoM = true; ecoC.setPointerCapture?.(ev.pointerId); thetaM = thetaDe(ev); ultimoTM = null; modoM.limpiar(); ecoPendiente = true; });
  ecoC.addEventListener('pointermove', (ev) => { if (!moviendoM) return; thetaM = thetaDe(ev); ultimoTM = null; modoM.limpiar(); ecoPendiente = true; });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) ecoC.addEventListener(t, () => { moviendoM = false; });

  const io = new IntersectionObserver((e) => { ecoVisible = e[0].isIntersecting; if (ecoVisible) ecoPendiente = true; });
  io.observe($('#cv-tarjeta-eco'));
  $('#cv-eco-rotulos').addEventListener('change', () => { ecoPendiente = true; });
  const muestraTd = () => motor.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), motor.onda[0]);
  function prepararPlanoEco() {
    if (!motor.onda.length) return null;
    const td = muestraTd(), clave = vistaEco + '|' + Math.round(td.vvi / 3) + '|' + Math.round(td.vvd / 3);
    if (clave !== claveTd) { planoEco = planoVista(vistaEco, td); claveTd = clave; fanEco = abanicoVista(planoEco); modoM.setProf(planoEco.prof); }
    // forma de referencia para que el moteado siga al tejido: la telediastólica, con las mismas opciones
    const cr = [Math.round(td.vvi), Math.round(td.vvd), opciones.pericardio, opciones.detalle, calidad, motor.p.liquidoPeri].join('|');
    if (cr !== claveRef) { refGeoTd = construirCorazon(estadoGeo(td, extraGeo()), { pericardio: opciones.pericardio, detalle: opciones.detalle, calidad }); refEco = refGeoTd.partes; claveRef = cr; }
    return td;
  }
  function pintarEco(s, g, est) {
    if (!ecoVisible || !ecografo || !g) return;
    const ahora = performance.now(), propia = !!(opciones.corte || opciones.vistaBase);
    // hasta ~30 imágenes por segundo (~12 con una geometría propia); en pausa, solo si algo cambió
    if (!ecoPendiente || ahora - ultimoEco < (propia ? 80 : modoEco === 'M' ? 20 : 30)) return;
    if (!prepararPlanoEco()) return;
    const geoEco = propia ? construirCorazon(est, { pericardio: opciones.pericardio, detalle: opciones.detalle, calidad }) : g;
    const im = ecografo.formar(geoEco.partes, planoEco, { ref: refEco, t: s.t ?? 0 });
    ecoImg.data.set(im.pix); ecoCtx.putImageData(ecoImg, 0, 0);
    ecoGeom = { cx: im.cx, arriba: im.arriba, k: im.escala };
    if (modoEco === 'M') {
      // la columna del modo M sale de esta misma imagen; al revisar un instante pasado no se escribe (el trazado
      // vive en el tiempo del motor)
      if (!revision && s === motor.s && ultimoTM !== s.t) { modoM.anadir(s.t, (f) => im.columna(thetaM, f)); ultimoTM = s.t; }
      const pxm = ecoC.width / ecoC.clientWidth, L = planoEco.prof * im.escala;
      ecoCtx.save(); ecoCtx.strokeStyle = 'rgba(241,201,74,.9)'; ecoCtx.lineWidth = 1.5 * pxm; ecoCtx.setLineDash([5 * pxm, 4 * pxm]);
      ecoCtx.beginPath(); ecoCtx.moveTo(im.cx, im.arriba); ecoCtx.lineTo(im.cx + Math.sin(thetaM) * L, im.arriba + Math.cos(thetaM) * L); ecoCtx.stroke(); ecoCtx.restore();
    }
    ecoMs = 0.8 * ecoMs + 0.2 * im.tiempos.total; ultimoEco = ahora; ecoPendiente = false;
    const P = planoEco, k = im.escala, X = (u) => im.cx + u * k, Y = (v) => im.arriba + v * k, px = ecoC.width / ecoC.clientWidth;
    ecoCtx.font = `${Math.round(11 * px)}px system-ui,sans-serif`; ecoCtx.textAlign = 'center'; ecoCtx.textBaseline = 'middle';
    // escala de profundidad: un punto por centímetro junto al borde derecho del sector; cifra cada 5 cm
    const dx = Math.sin(P.mitad), dy = Math.cos(P.mitad);
    for (let cm = 1; cm * 10 < P.prof; cm++) { const r = cm * 10, x = X(r * dx) + 6 * px, y = Y(r * dy);
      ecoCtx.fillStyle = 'rgba(220,214,196,.8)'; ecoCtx.fillRect(x - 1, y - 1, cm % 5 ? 2 : 4, 2);
      if (cm % 5 === 0) { const dentro = x + 20 * px < ecoC.width; ecoCtx.textAlign = dentro ? 'left' : 'right'; ecoCtx.fillText(cm + '', dentro ? x + 6 * px : x - 4 * px, y - (dentro ? 0 : 9 * px)); ecoCtx.textAlign = 'center'; } }
    // marca de orientación (el lado de la muesca del transductor) a la derecha del vértice
    ecoCtx.fillStyle = '#d4af37'; ecoCtx.beginPath(); ecoCtx.arc(im.cx + 18 * px, im.arriba + 8 * px, 3 * px, 0, Math.PI * 2); ecoCtx.fill();
    // rótulos de las cavidades que el plano corta (centros que se mueven con las paredes)
    const rot = [];
    if ($('#cv-eco-rotulos').checked && geoEco.flujo) {
      const f = geoEco.flujo, T = (p) => f.transformar(p);
      const cerca = (pts) => pts.map(T).reduce((a, b) => (Math.abs(enPlano(P, b)[2]) < Math.abs(enPlano(P, a)[2]) ? b : a));
      const alto = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85];
      const marcas = [['VI', cerca(alto.map(u => f.enCamara.vi([u, 0, 0])))], ['VD', cerca(alto.flatMap(u => [0.15, 0.4, 0.65, 0.9].map(fv => f.enCamara.vd([u, fv, 0.55]))))],
        ['AI', cerca(alto.map(u => f.enCamara.ai([u, 0, 0])))], ['AD', cerca(alto.map(u => f.enCamara.ad([u, 0, 0])))],
        ['Ao', T([f.valvulas.aortica[0], f.valvulas.aortica[1], f.valvulas.aortica[2] + 14])]];
      for (const [n, p] of marcas) { const [u, v, dd] = enPlano(P, p), r = Math.hypot(u, v);
        if (Math.abs(dd) > 14 || r > P.prof - 5 || Math.abs(Math.atan2(u, v)) > P.mitad - 0.04) continue;
        rot.push(n); ecoCtx.fillStyle = 'rgba(0,0,0,.55)'; ecoCtx.fillRect(X(u) - 12 * px, Y(v) - 8 * px, 24 * px, 16 * px);
        ecoCtx.fillStyle = '#e8e3d5'; ecoCtx.fillText(n, X(u), Y(v)); }
    }
    $('#cv-eco-titulo').textContent = NOMBRE_VISTA[vistaEco];
    ecoC.setAttribute('aria-label', `Ecografía reconstruida, ${VISTAS[vistaEco].nombre}, fase ${s.fase}`);
    $('#cv-eco-fase').textContent = `${s.fase} · ${FASES[s.fase]}`;
    $('#cv-eco-nombre').textContent = VISTAS[vistaEco].nombre;
    ecoInfo = { t: s.tLatido, tMotor: s.t, vista: vistaEco, rotulos: rot, propia, abiertos: im.abiertos, modo: modoEco, theta: thetaM };
  }

  // ---- Dibujo de un fotograma
  let estGeo = null, sucioEco = false, ultimo = null;
  const poner = (() => { const cache = new Map(); return (sel, html) => { if (cache.get(sel) === html) return; cache.set(sel, html); $(sel).innerHTML = html; }; })();
  function dibujar() {
    const s = estadoMostrado();          // EL estado de este fotograma: todo lo de abajo lee este objeto
    if (rgl && (sucio || !geo)) {
      const extra = extraGeo(), est = estadoGeo(s, extra);
      const mz = usarFormas && !opciones.corte ? tabla.mezclar(s, extra) : null;
      geo = mz ? { partes: mz.partes, flujo: mz.flujo, descenso: mz.descenso } : construirCorazon(est, opcionesGeo());
      modoGeo = mz ? 'mezcla' : 'exacta'; sucio = false; estGeo = est; sucioEco = true;
    }
    const g = geo;
    if (rgl && abierto('#cv-plegable-3d')) {
      // al revisar un instante pasado, la sangre (que vive en el tiempo del motor) no se dibuja
      const puntos = verSangre && !revision ? sangre.puntos(g.flujo, { vistaBase: opciones.vistaBase }) : null;
      const partes = verSangre ? g.partes.filter(p => !p.nombre.endsWith('sangre')) : g.partes;
      const conPlano = $('#cv-eco-plano').checked && fanEco ? partes.concat([{ nombre: 'Plano eco', pos: fanEco.pos, idx: fanEco.idx, color: [0.35, 0.78, 0.95], alfa: 0.22, dobleCara: true }]) : partes;
      rgl.dibujar(conPlano, cam, undefined, puntos);
    }
    if (sucioEco) { ecoPendiente = true; sucioEco = false; }
    pintarEco(s, g, estGeo);
    pintarCiclo(s);
    const cursor = abierto('#cv-plegable-diag') ? diag.pintar(s, motor, lado) : null;
    ultimo = { estado: s, est: estGeo, cursor, modo: modoGeo, eco: ecoInfo };
    if (opc.depuracion) window.__ultimoDibujo = ultimo;
    const fase = `${s.fase} · ${FASES[s.fase]}`;
    const fuera = s.vvi < LIMITES.vi[0] || s.vvi > LIMITES.vi[1] || s.vvd < LIMITES.vd[0] || s.vvd > LIMITES.vd[1] || Math.min(s.vai, s.vad) < LIMITES.au[0] || Math.max(s.vai, s.vad) > LIMITES.au[1];
    poner('#cv-hud', (revision ? '<span class="cv-revisando">⏸ revisando el último latido</span><br>' : '') + `t = ${s.tLatido.toFixed(2)} s · FC ${Math.round(revision ? motor.ultimo.fc : s.fc)} · <b>${fase}</b>` + (g ? `<br>base ${g.descenso >= 0 ? '+' : ''}${g.descenso.toFixed(0)} mm` : '') + (fuera ? '<br><span class="cv-aviso">⚠ volumen fuera del rango del dibujo: se muestra en su límite</span>' : ''));
    if (!abierto('#cv-plegable-cifras')) return;
    poner('#cv-l-fase', fase);
    poner('#cv-l-vi', `${s.vvi.toFixed(0)} mL · ${s.pvi.toFixed(0)} mmHg`);
    poner('#cv-l-vd', `${s.vvd.toFixed(0)} mL · ${s.pvd.toFixed(0)} mmHg`);
    poner('#cv-l-ao', `${s.pao.toFixed(0)} mmHg · AP ${s.pap.toFixed(0)}`);
    poner('#cv-l-au', `AI ${s.vai.toFixed(0)} · AD ${s.vad.toFixed(0)} mL`);
    for (const v of VALVULAS) {
      const el = $('#cv-v-' + v.n), abierta = s[v.abierta];
      el.classList.toggle('ab', abierta);
      poner('#cv-v-' + v.n, `${v.nombre}<small>${abierta ? 'abierta ' + Math.round(apertura(v, s) * 100) + '%' : 'cerrada · ' + Math.max(0, s[v.abajo] - s[v.arriba]).toFixed(0) + ' mmHg'}</small>`);
    }
  }
  // Cifras del último latido y del barorreflejo: cambian una vez por latido
  let latidoTexto = -1;
  function pintarLatido() {
    const u = motor.ultimo; if (!u || motor.s.nLatido === latidoTexto) return; latidoTexto = motor.s.nLatido;
    $('#cv-l-lat').textContent = `PA ${u.pas.toFixed(0)}/${u.pad_.toFixed(0)} (PAM ${u.pam.toFixed(0)}) · FC ${u.fc.toFixed(0)} · GC ${u.gc.toFixed(1)} L/min · PVC ${u.pvc.toFixed(0)}`;
    const pc = (x) => (x >= 0 ? '+' : '−') + Math.abs(Math.round(x * 100)) + '%', b = u.baro;
    $('#cv-baro-txt').innerHTML = motor.p.barorreflejo
      ? `PA ${u.pas.toFixed(0)}/${u.pad_.toFixed(0)} · FC ${u.fc.toFixed(0)} · GC ${u.gc.toFixed(1)} L/min · PVC ${u.pvc.toFixed(0)}. Barorreflejo (PAM que siente ${b.sensor.toFixed(0)} mmHg, consigna ${motor.p.pamConsigna}): FC <b>${pc(b.fc)}</b> · resistencias <b>${pc(b.r)}</b> · venoconstricción <b>${pc(b.vu)}</b> · contractilidad <b>${pc(b.ees)}</b>. Ilustrativo.`
      : `PA ${u.pas.toFixed(0)}/${u.pad_.toFixed(0)} · FC ${u.fc.toFixed(0)} · GC ${u.gc.toFixed(1)} L/min · PVC ${u.pvc.toFixed(0)}. Barorreflejo apagado: nada compensa los cambios.`;
  }

  // ---- Bucle: solo corre mientras está activo (la app lo para cuando la vista no se ve o la pestaña se oculta)
  let activo = false, rafId = 0;
  function bucle(t) {
    rafId = 0; if (!activo) return;
    const dt = Math.min(0.25, (t - tPrev) / 1000); tPrev = t;   // tras una pausa larga no salta segundos
    if (!pausa) sim(dt);
    gestionarFormas(); dibujar(); pintarLatido(); frames++;
    if (t - tFps > 1000) { const ritmo = realAcum > 0 ? simAcum / realAcum : 0;
      const formas = !usarFormas ? 'sin formas' : tabla.construyendo ? 'calculando formas' : tabla.lista ? `${tabla.numero} formas · ${modoGeo}` : 'geometría exacta';
      $('#cv-eco-tiempo').textContent = ecoVisible && ecoMs ? `· imagen en ${ecoMs.toFixed(0)} ms` : '';
      $('#cv-fps').textContent = `${frames} fps` + (pausa ? '' : ` · reloj ×${ritmo.toFixed(2).replace('.', ',')}`) + ` · ${formas}`; frames = 0; tFps = t; simAcum = 0; realAcum = 0; }
    rafId = requestAnimationFrame(bucle);
  }
  function setActivo(si) {
    si = !!si; if (si === activo) return; activo = si;
    if (activo) { tPrev = performance.now(); tFps = tPrev; ensuciar(); ecoPendiente = true; if (!rafId) rafId = requestAnimationFrame(bucle); }
    else if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  // ---- Controles
  const vistas3d = { frontal: { yaw: 0, pitch: 0.12, corte: false }, izq: { yaw: -1.4, pitch: 0.1, corte: false }, arriba: { yaw: 0.2, pitch: 1.3, corte: false }, valvulas: { corte: false, base: true, dist: 245, desde: [0, -0.15, 1] }, '4c': { corte: true, phi: 2.6, alzar: 0.15 }, largo: { corte: true, phi: 2.234 + Math.PI, alzar: 0.2 } };
  // En las vistas de corte, la cámara se pone de frente a la cara cortada (lado que se quita del plano)
  function camaraHaciaCorte(phi, alzar) {
    const n = [-Math.sin(phi), Math.cos(phi), 0];
    const d = m4.apply3(MODELO, [-n[0], -n[1], alzar]);
    const l = Math.hypot(...d); cam.yaw = Math.atan2(d[0] / l, d[1] / l); cam.pitch = Math.asin(d[2] / l);
  }
  let alzarCorte = 0.15;
  function actCorte() { ensuciar(); const on = $('#cv-corte').checked; $('#cv-fila-corte').hidden = !on; opciones.corte = on ? { phi: $('#cv-phi').value / 100 } : null; }
  $$('[data-v]').forEach(b => b.addEventListener('click', () => { const v = vistas3d[b.dataset.v]; $('#cv-corte').checked = v.corte;
    opciones.vistaBase = !!v.base; cam.dist = v.dist || 330; $('#cv-orienta').hidden = !v.base;
    if (v.desde) { const d = m4.apply3(MODELO, v.desde), l = Math.hypot(...d); cam.yaw = Math.atan2(d[0] / l, d[1] / l); cam.pitch = Math.asin(d[2] / l); cam.centro = [0, 0, 6]; cam.arriba = m4.apply3(MODELO, [0, 1, 0]); } else { cam.centro = [0, 0, -22]; cam.arriba = null; }
    if (v.corte) { $('#cv-phi').value = Math.round(v.phi * 100); alzarCorte = v.alzar; camaraHaciaCorte(v.phi, v.alzar); } else if (!v.desde) { cam.yaw = v.yaw; cam.pitch = v.pitch; }
    actCorte(); olvidarFormas(); }));
  $('#cv-corte').addEventListener('change', () => { actCorte(); if ($('#cv-corte').checked) camaraHaciaCorte($('#cv-phi').value / 100, alzarCorte); });
  // al mover el ángulo del corte la cámara lo acompaña, para mirar siempre a la cara cortada
  $('#cv-phi').addEventListener('input', () => { actCorte(); camaraHaciaCorte($('#cv-phi').value / 100, alzarCorte); });
  $('#cv-sangre').addEventListener('change', () => { verSangre = $('#cv-sangre').checked; });
  $('#cv-peri').addEventListener('change', () => { opciones.pericardio = $('#cv-peri').checked; olvidarFormas(); });
  $('#cv-det').addEventListener('change', () => { opciones.detalle = $('#cv-det').checked; olvidarFormas(); });
  $('#cv-formas').addEventListener('change', () => { usarFormas = $('#cv-formas').checked; olvidarFormas(); });
  $('#cv-vel').addEventListener('change', () => { vel = +$('#cv-vel').value; });
  $('#cv-cal').addEventListener('change', () => { calidad = +$('#cv-cal').value; olvidarFormas(); });
  $('#cv-pausa').addEventListener('click', () => { ponerPausa(!pausa); if (!pausa) volverAlMotor(); });
  $('#cv-fase').addEventListener('click', () => irAFase(null));
  $('#cv-plegable-cifras').addEventListener('toggle', () => { latidoTexto = -1; });

  // Escenarios: parten siempre del estado normal estable (escenarios.mjs, los mismos que comprueban las pruebas)
  let escenario = 'normal';
  $('#cv-escenarios').innerHTML = Object.entries(ESCENARIOS).map(([k, e]) => `<button type="button" class="cv-mini${k === 'normal' ? ' on' : ''}" data-c="${k}">${e.nombre}</button>`).join('');
  function elegirEscenario(k) {
    if (!ESCENARIOS[k]) return;
    escenario = k;
    motor = crearMotor({ barorreflejo: $('#cv-baro').checked }); motor.correr(12); ESCENARIOS[k].aplicar(motor);
    if (k !== 'normal') motor.correr(10);          // que se vea ya el efecto (y el barorreflejo respondiendo)
    if (opc.depuracion) window.__motor = motor;
    revision = null; ponerPausa(false); sangre.reiniciar(); latidoTexto = -1; claveTd = ''; ensuciar(); colocarLineaM();
    $$('[data-c]').forEach(x => x.classList.toggle('on', x.dataset.c === k));
    opc.onEscenario?.(k);
  }
  $('#cv-escenarios').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) elegirEscenario(b.dataset.c); });
  $('#cv-baro').addEventListener('change', () => { motor.p.barorreflejo = $('#cv-baro').checked; });
  $('#cv-avanzar').addEventListener('click', () => { revision = null; motor.correr(10); sangre.reiniciar(); latidoTexto = -1; ensuciar(); });

  // Wiggers y asa: deslizar o tocar elige un instante del último latido
  $$('[data-lado]').forEach(b => b.addEventListener('click', () => { lado = b.dataset.lado; $$('[data-lado]').forEach(x => x.classList.toggle('on', x === b)); }));
  function arrastre(el, alElegir) {
    let on = false;
    const elegir = (ev) => { const r = el.getBoundingClientRect(); alElegir(ev.clientX - r.left, ev.clientY - r.top); };
    el.addEventListener('pointerdown', (ev) => { on = true; el.setPointerCapture?.(ev.pointerId); elegir(ev); });
    el.addEventListener('pointermove', (ev) => { if (on) elegir(ev); });
    for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(t, () => { on = false; });
  }
  arrastre($('#cv-wig'), (x) => revisar(estadoRevision(motor.onda, diag.tiempoEnX(x))));
  arrastre($('#cv-pvc'), (x, y) => revisar(diag.muestraEnPV(motor, lado, x, y)));

  ajustarLienzo(); ajustarDiagramas(); ajustarEco();

  if (opc.depuracion) {
    window.__revisar = (t) => revisar(estadoRevision(motor.onda, t)); window.__estado = () => estadoMostrado();
    window.__eco = { info: () => ecoInfo, vista: elegirVista, plano: () => planoEco, modo: elegirModo, medir: elegirMedida, modoM };
    window.__ensuciar = ensuciar; window.__sangre = sangre; window.__motor = motor; window.__cam = cam; window.__tabla = tabla;
  }

  return {
    vista: elegirVista,
    modo: elegirModo,
    medir: elegirMedida,
    escenario: elegirEscenario,
    activo: setActivo,
    get vistaActual() { return vistaEco; },
    get escenarioActual() { return escenario; },
    get ultimoDibujo() { return ultimo; },
    webgl: !!rgl,
  };
}
