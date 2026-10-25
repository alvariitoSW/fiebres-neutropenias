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
import { construirCorazon, LIMITES, TAPSE_POR_ML, recortar, planoCorte } from './corazon-geo.mjs';
import { construirAbdomen, anatomiaAbdomen, modeloVci, ARRIBA } from './abdomen.mjs';
import { crearCamara, m4, MODELO, nrm } from './mat.mjs';
import { crearWebGL } from './render-webgl.mjs';
import { ESCENARIOS, evaluarForma, aplicarEscenario } from './escenarios.mjs';
import { crearFlujo } from './flujo-sangre.mjs';
import { COLOR_FASE, segmentosFase, estadoRevision, crearDiagramas, crearPanelesHemo } from './diagramas.mjs';
import { VALVULAS, apertura, estadoGeo, crearTablaFormas, semejantes, extraDeMotor } from './formas.mjs';
import { VISTAS, planoVista, medidasCorazon, enPlano, crearEcografo, abanicoVista, direccionHaz, anguloHacia, planoLibre, SONDA_CERO, sondaMovida, desviacion, vistaMasParecida } from './ecografia.mjs';
import { crearModoM } from './modo-m.mjs';
import { areasAnillo, fuentesFlujo, fuenteEnMuestra, curvaLatido, medidasLatido, puntosMuestra, velocidadesMuestra, columnaEspectro, mapaColor } from './doppler.mjs';

export const NOMBRE_VISTA = { a4c: 'A4C', a2c: 'A2C', a3c: 'A3C', plax: 'PLAX', psaxAo: 'PSAX Ao', psaxMv: 'PSAX mitral', psaxPm: 'PSAX papilares', sc4c: 'SC 4C', scVci: 'SC VCI', sse: 'Supraesternal' };
// orden de los chips: apicales, paraesternal largo, ejes cortos de la base al ápex
const ORDEN_VISTAS = ['a4c', 'a2c', 'a3c', 'plax', 'psaxAo', 'psaxMv', 'psaxPm', 'sc4c', 'scVci', 'sse'];
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
  const ro = new ResizeObserver(() => { ajustarLienzo(); ajustarDiagramas(); ajustarEco(); if (modoM.ajustar()) ultimoTM = null; if (espectro.ajustar()) ultimoTD = null; });
  ro.observe(escena); ro.observe($('#cv-wig')); ro.observe($('#cv-eco')); ro.observe($('#cv-m')); ro.observe($('#cv-d'));
  const abierto = (id) => $(id).open;
  $('#cv-plegable-diag').addEventListener('toggle', () => { ajustarDiagramas(); diag.invalidar(); });

  let vel = 0.25, calidad = 1, pausa = false, tPrev = performance.now(), frames = 0, tFps = tPrev, simAcum = 0, realAcum = 0;
  const opciones = { corte: null, pericardio: true, detalle: true };
  // La geometría solo se reconstruye si ha cambiado algo (la simulación avanzó o una opción).
  let sucio = true, geo = null; const ensuciar = () => { sucio = true; };
  const sangre = crearFlujo(); let verSangre = true, verAbdomen = true, abd = null, abd3d = [];
  // presión de la AD para la VCI: la media del último latido (PVC) y la instantánea (la onda que llega a la vena).
  // La respiración va con el reloj del motor: al revisar el último latido (s es una muestra, con t dentro del latido)
  // el motor está en pausa y la VCI se queda quieta en su punto del ciclo respiratorio.
  const datosVci = (s) => ({ pvc: motor.ultimo ? motor.ultimo.pvc : s.pad, pad: s.pad, t: motor.s.t });
  // en el 3D, el abdomen entero con «Hígado y diafragma» marcado y sin corte; si no, solo la VCI (es la entrada de
  // la AD: sin ella, la sangre de las cavas saldría de la nada), recortada como el corazón cuando hay corte
  const partesAbd3d = (a) => {
    if (!a) return [];
    if (verAbdomen && !opciones.corte) return a.partes;
    const vci = a.partes.filter(p => p.clave === 'abd:vci'), c = planoCorte(opciones.corte);
    return c ? vci.map(p => ({ ...p, ...recortar(p, c), normales: undefined })).filter(p => p.idx.length) : vci;
  };
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
  let revision = null, lado = 'izquierdo', paneles = null;
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
  let vistaEco = 'a4c', ecografo = null, ecoImg = null, planoEco = null, planoBase = null, claveTd = '', refEco = null, refGeoTd = null, claveRef = '', fanEco = null, fanBase = null;
  const sonda = { ...SONDA_CERO };
  let reto = null;
  let ecoVisible = true, ultimoEco = -1e9, ecoInfo = null, ecoPendiente = true, ecoMs = 0;
  $('#cv-vistas').innerHTML = ORDEN_VISTAS.filter(k => VISTAS[k]).map(k => `<button type="button" class="cv-mini${k === vistaEco ? ' on' : ''}" data-eco="${k}" title="${VISTAS[k].nombre}">${NOMBRE_VISTA[k]}</button>`).join('');
  function elegirVista(k) {
    if (!VISTAS[k]) return;
    vistaEco = k; claveTd = ''; ecoPendiente = true; img.prof = null; ponerMandosImg();
    $$('[data-eco]').forEach(b => b.classList.toggle('on', b.dataset.eco === k));
    // la muestra Doppler estaba en el plano de la vista anterior: se quita y, en modo D, va a la de esta vista
    reto = null; gate = null; marcarPreset(null); ponerSonda(SONDA_CERO);
    if (modoEco === 'D') muestraPorDefecto();
    if (MEDIDAS[medir].vista && MEDIDAS[medir].vista !== k) elegirMedida('libre', false);
    else colocarLineaM();
    opc.onVista?.(k);
  }
  $('#cv-vistas').addEventListener('click', (e) => { const b = e.target.closest('[data-eco]'); if (b) elegirVista(b.dataset.eco); });
  // calidad automática de la imagen: cuatro niveles de haces × muestras; si la imagen tarda más de 40 ms (25 por segundo),
  // baja un nivel, y sube si el de arriba cabría en 32 ms. No cuenta el fotograma que construye la rejilla.
  const NIVELES_ECO = [{ nb: 192, ns: 448 }, { nb: 160, ns: 384 }, { nb: 128, ns: 320 }, { nb: 96, ns: 256 }];
  let ecosNivel = [], nivelEco = 0, emaEco = 0, desdeCambioEco = 0;
  const ecoDeNivel = () => (ecosNivel[nivelEco] ||= crearEcografo({ ancho: ecoC.width, alto: ecoC.height, ...NIVELES_ECO[nivelEco] }));
  function calidadAutomaticaEco(ms) {
    emaEco = emaEco ? emaEco * 0.7 + ms * 0.3 : ms; desdeCambioEco++;
    if (desdeCambioEco < 6) return;
    const coste = (n) => NIVELES_ECO[n].nb * NIVELES_ECO[n].ns;
    if (emaEco > 40 && nivelEco < NIVELES_ECO.length - 1) nivelEco++;
    else if (nivelEco > 0 && emaEco * coste(nivelEco - 1) / coste(nivelEco) < 32) nivelEco--;
    else return;
    emaEco = 0; desdeCambioEco = 0; ecografo = ecoDeNivel(); ecoPendiente = true;
  }
  // ---- Mandos de imagen (ganancia, TGC, profundidad, foco), ventana pobre y «Señálalo». Origen: ilustrativo y fisiología general.
  const img = { gan: 0, tgc: [0, 0, 0, 0], foco: 80, prof: null, ventana: false, senal: null };
  const FRASES_SENAL = {
    sombra: 'Sombra: detrás de la costilla no llega sonido. Ahí no falta tejido.',
    refuerzo: 'Refuerzo: el líquido apenas frena el sonido y lo de detrás brilla más. No es tejido más denso.',
    reverb: 'Rebote del sonido en la pared del tórax. No se mueve con el corazón: no es un trombo.',
    especular: 'Pared lateral gris: el haz le pasa paralelo. No es que no se contraiga.',
    especularOtra: 'El haz pasa paralelo a este músculo: se ve más gris, no está enfermo.',
    foco: 'Foco: el haz es más estrecho a esta profundidad y la imagen es más nítida. Por delante y por detrás se ensancha y emborrona. Mira el tabique al mover el foco de 4 a 12 cm.',
    ventana: 'Aire del pulmón: tapa el sonido. La ganancia no lo arregla; cambia de ventana.',
  };
  const ROTULOS_SENAL = { sombra: 'sombra de la costilla', refuerzo: 'refuerzo detrás de la sangre', reverb: 'rebotes a 2× y 3× la pared', ventana: 'pulmón' };
  const FRASE_VENTANA = 'Paciente obeso o ventilado: la grasa y el pulmón se interponen. Llega menos señal y hay más ruido y neblina; el pulmón tapa un lado de la imagen y entra y sale con la respiración. La ganancia y la profundidad ayudan algo; si el pulmón tapa la imagen, cambia de ventana o recoloca al paciente.';
  const cm = (mm) => (mm / 10).toFixed(0) + ' cm', signo = (v) => (v > 0 ? '+' : '') + v;
  function ponerMandosImg() {
    $('#cv-img-gan').value = img.gan; $('#cv-img-gan-v').textContent = signo(img.gan) + ' dB';
    const pr = img.prof ?? VISTAS[vistaEco].prof; $('#cv-img-prof').value = pr; $('#cv-img-prof-v').textContent = cm(pr);
    $('#cv-img-foco').value = img.foco; $('#cv-img-foco-v').textContent = cm(img.foco);
    img.tgc.forEach((v, i) => { $('#cv-img-tgc' + i).value = v; $('#cv-img-tgc' + i + '-v').textContent = signo(v); });
  }
  function mandoImg(id, fn) { $(id).addEventListener('input', (e) => { fn(+e.target.value); ponerMandosImg(); ecoPendiente = true; }); }
  mandoImg('#cv-img-gan', (v) => { img.gan = v; });
  mandoImg('#cv-img-prof', (v) => { img.prof = v === VISTAS[vistaEco].prof ? null : v; });
  mandoImg('#cv-img-foco', (v) => { img.foco = v; });
  for (let i = 0; i < 4; i++) mandoImg('#cv-img-tgc' + i, (v) => { img.tgc[i] = v; });
  $('#cv-img-cero').addEventListener('click', () => { Object.assign(img, { gan: 0, tgc: [0, 0, 0, 0], foco: 80, prof: null }); ponerMandosImg(); ecoPendiente = true; });
  function ponerVentana(on) {
    img.ventana = on; const b = $('#cv-img-ventana');
    b.setAttribute('aria-pressed', String(on)); b.textContent = '🫁 Ventana pobre: ' + (on ? 'encendida' : 'apagada');
    $('#cv-img-ventana-txt').hidden = !on; $('#cv-img-ventana-txt').textContent = on ? FRASE_VENTANA : '';
    $('#cv-senalalo [data-senal="ventana"]').hidden = !on; if (!on && img.senal === 'ventana') ponerSenal(null);
    ecoPendiente = true;
  }
  $('#cv-img-ventana').addEventListener('click', () => ponerVentana(!img.ventana));
  function ponerSenal(k) {
    img.senal = img.senal === k ? null : k;
    $$('#cv-senalalo [data-senal]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.senal === img.senal)));
    if (!img.senal) { $('#cv-senal-frase').hidden = true; $('#cv-senal-frase').textContent = ''; }
    ecoPendiente = true;
  }
  $('#cv-senalalo').addEventListener('click', (e) => { const b = e.target.closest('[data-senal]'); if (b) ponerSenal(b.dataset.senal); });
  const ficha = (n) => getComputedStyle(document.body).getPropertyValue(n).trim();
  // marca del foco: un triángulo pequeño en el borde izquierdo del abanico, a la profundidad del foco
  function marcaFoco(im, P) {
    const px = ecoC.width / ecoC.clientWidth, r = Math.min(img.foco, P.prof - 6), dx = Math.sin(P.mitad), dy = Math.cos(P.mitad);
    const x = im.cx - r * dx * im.escala - 3 * px, y = im.arriba + r * dy * im.escala, t = 5 * px;
    ecoCtx.save(); ecoCtx.fillStyle = ficha('--accent-yellow') || 'white';
    ecoCtx.beginPath(); ecoCtx.moveTo(x, y); ecoCtx.lineTo(x - t * 1.3, y - t); ecoCtx.lineTo(x - t * 1.3, y + t); ecoCtx.closePath(); ecoCtx.fill(); ecoCtx.restore();
  }
  // «Señálalo»: contorno de la zona del artefacto y un rótulo que se coloca donde menos corazón tapa
  function senalar(tipo, b) {
    const px = ecoC.width / ecoC.clientWidth, W = ecoC.width, H = ecoC.height;
    const pt = (r, th) => [b.cx + b.escala * r * Math.sin(th), b.arriba + b.escala * r * Math.cos(th)];
    const sector = (t0, t1, r0, r1) => { const p = []; for (let k = 0; k <= 12; k++) p.push(pt(r0, t0 + (t1 - t0) * k / 12)); for (let k = 12; k >= 0; k--) p.push(pt(r1, t0 + (t1 - t0) * k / 12)); return p; };
    const M = b.mitad, sub = VISTAS[vistaEco].ventana === 'subcostal', a4 = vistaEco === 'a4c';
    let forma = null, aviso = '', rotulo = ROTULOS_SENAL[tipo], ancla = null;
    if (tipo === 'sombra') { if (sub) aviso = 'En la subcostal el haz no cruza costillas: mira otra vista.'; else { forma = sector(-M, -0.74 * M, b.pared - 6, b.prof - 2); ancla = pt(b.prof * 0.55, -0.9 * M); } }
    else if (tipo === 'reverb') { forma = { varias: [2, 3].map(k => sector(-0.95 * M, 0.95 * M, k * b.pared - 3, k * b.pared + 3)) }; ancla = pt(3 * b.pared, -0.95 * M); }
    else if (tipo === 'ventana') { if (!b.pulmon) aviso = 'En esta vista el pulmón no se interpone.'; else { forma = sector(b.pulmon.borde * M, M, b.pulmon.rl, b.prof - 2); ancla = pt(b.prof * 0.6, 0.9 * M); } }
    else if (tipo === 'foco') {
      const r = Math.min(img.foco, b.prof - 6), arco = []; for (let k = 0; k <= 24; k++) arco.push(pt(r, -M + 2 * M * k / 24));
      forma = { linea: arco }; rotulo = 'foco a ' + cm(img.foco); ancla = pt(r, -0.9 * M);
    } else if (tipo === 'refuerzo') {
      // la tira más larga de haces centrales con sangre: de 3 a 28 mm por debajo de la sangre más profunda
      const tiras = [[]];
      for (let i = 0; i < b.nb; i++) { const e = (i + 0.5) / b.nb * 2 - 1; let jj = -1;
        if (Math.abs(e) < 0.6) for (let j = b.ns - 1; j >= 0; j--) if (b.tag[j * b.nb + i] === 255) { jj = j; break; }
        if (jj < 0) { if (tiras.at(-1).length) tiras.push([]); continue; }
        tiras.at(-1).push([-M + (i + 0.5) * b.dth, (jj + 0.5) * b.dr]); }
      const t = tiras.reduce((a, x) => (x.length > a.length ? x : a), []);
      if (t.length > 3) { forma = t.map(([th, r]) => pt(Math.min(b.prof - 2, r + 3), th)).concat(t.slice().reverse().map(([th, r]) => pt(Math.min(b.prof - 2, r + 28), th))); ancla = forma[Math.floor(forma.length / 4)]; }
      else aviso = 'Sin sangre en el centro de la imagen: no hay refuerzo que señalar.';
    } else if (tipo === 'especular') {
      // músculo que el haz roza en paralelo. En el apical de 4 cámaras, solo la pared lateral del VI; en las demás vistas, el lado con más
      const tVi = b.etiquetas && b.etiquetas.get('VI'), a4v = a4 && tVi, P2 = [];
      let sx0 = 0, n0 = 0;
      if (a4v) for (let q = 0; q < b.tag.length; q++) if (b.tag[q] === tVi) { sx0 += pt(((q / b.nb) | 0) * b.dr, -M + (q % b.nb + 0.5) * b.dth)[0]; n0++; }
      const xc = n0 ? sx0 / n0 : 0, lado = [[], []];
      for (let q = 0; q < b.tag.length; q++) if (b.apagado(q)) { const i = q % b.nb, j = (q / b.nb) | 0, p = pt((j + 0.5) * b.dr, -M + (i + 0.5) * b.dth);
        if (a4v) { if (b.tag[q] === tVi && p[0] > xc + 6) P2.push(p); } else lado[i < b.nb / 2 ? 0 : 1].push(p); }
      const L = a4v ? P2 : (lado[1].length >= lado[0].length ? lado[1] : lado[0]);
      rotulo = a4v ? 'pared lateral del VI' : 'músculo paralelo al haz';
      if (L.length > 20) { const mx = L.reduce((a, p) => a + p[0], 0) / L.length, my = L.reduce((a, p) => a + p[1], 0) / L.length;
        const sx = Math.sqrt(L.reduce((a, p) => a + (p[0] - mx) ** 2, 0) / L.length), sy = Math.sqrt(L.reduce((a, p) => a + (p[1] - my) ** 2, 0) / L.length);
        forma = { elipse: [mx, my, Math.max(10 * px, 1.8 * sx), Math.max(14 * px, 1.8 * sy)] }; ancla = [mx, my]; }
      else aviso = 'En esta vista ninguna pared queda paralela al haz.';
    }
    const caja = $('#cv-senal-frase'); caja.hidden = false;
    caja.textContent = aviso || (tipo === 'especular' && !a4 ? FRASES_SENAL.especularOtra : FRASES_SENAL[tipo]);
    if (!forma) return;
    ecoCtx.save(); ecoCtx.strokeStyle = ficha('--accent-yellow') || 'white'; ecoCtx.lineWidth = 2 * px; ecoCtx.setLineDash([6 * px, 4 * px]); ecoCtx.beginPath();
    if (forma.elipse) { const [x, y, rx, ry] = forma.elipse; ecoCtx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI); }
    else if (forma.linea) forma.linea.forEach(([x, y], k) => (k ? ecoCtx.lineTo(x, y) : ecoCtx.moveTo(x, y)));
    else for (const f of forma.varias || [forma]) { f.forEach(([x, y], k) => (k ? ecoCtx.lineTo(x, y) : ecoCtx.moveTo(x, y))); ecoCtx.closePath(); }
    ecoCtx.stroke(); ecoCtx.setLineDash([]);
    // rótulo: se prueba una rejilla de sitios y gana el que tapa menos corazón (celdas con tejido o sangre), sin pisar las
    // esquinas de abajo (título y fase de la imagen), el vértice ni el borde; entre los que tapan igual, el más cercano al sitio
    ecoCtx.font = `600 ${Math.round(12 * px)}px system-ui, sans-serif`; const w = ecoCtx.measureText(rotulo).width + 10 * px, h = 18 * px;
    const ocupado = (x, y) => { const rr = Math.hypot(x - b.cx, y - b.arriba) / b.escala, th = Math.atan2(x - b.cx, y - b.arriba); if (rr >= b.prof || Math.abs(th) >= M) return 0;
      const i = Math.min(b.nb - 1, ((th + M) / b.dth) | 0), j = Math.min(b.ns - 1, (rr / b.dr) | 0); return b.tag[j * b.nb + i] ? 1 : 0; };
    const [ax, ay] = ancla || [W / 2, H / 2]; let mejor = null;
    for (let y = 6 * px; y <= H - 26 * px - h; y += 8 * px) for (let x = 3 * px; x <= W - w - 3 * px; x += 10 * px) {
      let n = 0; for (let iy = 0; iy < 3; iy++) for (let ix = 0; ix < 6; ix++) n += ocupado(x + w * (ix + 0.5) / 6, y + h * (iy + 0.5) / 3);
      const vertice = Math.abs(x + w / 2 - b.cx) < w / 2 + 14 * px && y < b.arriba + 24 * px ? 1 : 0;
      const costo = n * 1000 + vertice * 5000 + Math.hypot(x + w / 2 - ax, y + h / 2 - ay);
      if (!mejor || costo < mejor.costo) mejor = { x, y, costo };
    }
    const { x: lx, y: ly } = mejor || { x: 3 * px, y: 6 * px };
    ecoCtx.fillStyle = ficha('--bg-main') || 'black'; ecoCtx.globalAlpha = 0.8; ecoCtx.fillRect(lx, ly, w, h);
    ecoCtx.globalAlpha = 1; ecoCtx.fillStyle = ficha('--accent-yellow') || 'white'; ecoCtx.textAlign = 'left'; ecoCtx.textBaseline = 'middle'; ecoCtx.fillText(rotulo, lx + 5 * px, ly + h / 2 + px); ecoCtx.restore();
  }
  function ajustarEco() {
    const w = Math.round(ecoC.clientWidth * Math.min(dpr(), 1.5)), h = Math.round(w * 0.8);
    if (!w || (ecografo && ecoC.width === w)) return;
    ecoC.width = w; ecoC.height = h; ecosNivel = []; nivelEco = 0; emaEco = 0; desdeCambioEco = 0; ecografo = ecoDeNivel(); ecoImg = ecoCtx.createImageData(w, h); ecoPendiente = true;
  }
  // ---- Modo M (modo-m.mjs): una línea del modo B a lo largo del tiempo, con calibres
  let modoEco = 'B', thetaM = 0, medir = 'libre', ultimoTM = null, ecoGeom = null;
  const guardado = { lvdd: null, lvsd: null, dmax: null, dmin: null };
  const MEDIDAS = {
    libre: { vista: null, guia: 'Mueve la línea M arrastrando en horizontal sobre la imagen. Pulsa ⏸ Pausa para congelar el trazado y toca dos puntos sobre él: la distancia vertical son mm de profundidad y la horizontal, ms.' },
    tapse: { vista: 'a4c', guia: 'Línea M sobre el anillo tricuspídeo lateral (apical 4 cámaras). Pulsa ⏸ Pausa, pon un calibre en el punto más alto del anillo (telediástole) y otro en el más bajo (telesístole): la distancia vertical es el TAPSE.' },
    vi: { vista: 'plax', guia: 'Línea M por el VI en el eje largo paraesternal, a la altura de las cuerdas. Pulsa ⏸ Pausa y mide del endocardio del tabique al de la pared posterior: con el VI más grande (telediástole), «Guardar como LVDd»; con el más pequeño (telesístole), «Guardar como LVSd».' },
    vci: { vista: 'scVci', guia: 'Línea M cruzando la VCI unos 2 cm por debajo del diafragma, donde ya no le llegan las suprahepáticas (subcostal VCI). El barrido abarca 6 s, más de una respiración. Pulsa ⏸ Pausa y mide de pared a pared: con la vena más ancha (espiración), «Guardar como Dmáx»; con la más estrecha (final de la inspiración), «Guardar como Dmín».' },
  };
  const modoM = crearModoM($('#cv-m'), $('#cv-m-capa'), { onMedida: pintarMedida });
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // un punto del eje de la VCI a `alto` mm del hiato (negativo: por debajo); el eje es fijo al cuerpo
  const puntoVci = (alto) => { const A = anatomiaAbdomen(), H = A.hiato, h = (p) => (p[0] - H[0]) * ARRIBA[0] + (p[1] - H[1]) * ARRIBA[1] + (p[2] - H[2]) * ARRIBA[2];
    return A.ejeVci.reduce((a, p) => (Math.abs(h(p) - alto) < Math.abs(h(a) - alto) ? p : a)); };
  function colocarLineaM() {
    ultimoTM = null; modoM.limpiar(); ecoPendiente = true;
    if (medir === 'libre' || !prepararPlanoEco()) return;
    const p = medir === 'tapse' ? refGeoTd.anilloTricLateral : medir === 'vci' ? puntoVci(-20) : refGeoTd.flujo.transformar([0, 0, -0.3 * refGeoTd.vi.L]);
    thetaM = clamp(anguloHacia(planoEco, p), -planoEco.mitad + 0.02, planoEco.mitad - 0.02);
  }
  function elegirModo(m) {
    modoEco = m; $$('[data-modo]').forEach(b => b.classList.toggle('on', b.dataset.modo === m));
    $('#cv-m-zona').hidden = m !== 'M'; $('#cv-d-zona').hidden = m !== 'D';
    if (m === 'M') { modoM.ajustar(); colocarLineaM(); pintarGuia(); }
    if (m === 'D') { espectro.ajustar(); if (!gate) muestraPorDefecto(); else reiniciarD(); }
    ecoPendiente = true;
  }
  function elegirMedida(k, cambiarVista = true) {
    medir = k; $$('[data-medir]').forEach(b => b.classList.toggle('on', b.dataset.medir === k));
    $('#cv-m-vi').hidden = k !== 'vi'; $('#cv-m-vci').hidden = k !== 'vci';
    modoM.setBarrido(k === 'vci' ? 6 : 2);
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
    if (medir === 'vci') enl.innerHTML = enlace('Colapsabilidad de la VCI (FATE)', 'umi-fate', '#umi-fate-vci', 'panel-manual-umi-tabs', 'sobrevivirUmi', 'manualUmi')
      + (guardado.dmax && guardado.dmin ? `<button type="button" class="especialidad-link" id="cv-m-a-vci" data-especialidad="sobrevivirUmi" data-view="manualUmi" data-panel="panel-manual-umi-tabs" data-tab="umi-fate" data-resaltar="#umi-vci-resultado">Llevar Dmáx y Dmín a la calculadora de la VCI (FATE) →</button>` : '');
    if (!m) { poner('', medir === 'vi' ? textoVi() : medir === 'vci' ? textoVci()[1] : 'Sin medida: toca dos puntos sobre el trazado.'); return; }
    if (medir === 'vci') { const [estado, txt] = textoVci(); poner(estado, `Medida: <b>${f1(m.mm)} mm</b> (${f1(m.mm / 10)} cm) · Δ tiempo ${Math.round(m.ms)} ms<br>` + txt); return; }
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
  // VCI: las dos tablas de FATE (Manual UMI): banda de la PAD por diámetro y colapso, y el índice de colapsabilidad
  // en ventilación espontánea (el modelo respira solo); y lo que hace el modelo con su PVC
  function textoVci() {
    const a = guardado.dmax, b = guardado.dmin, cm = (x) => x == null ? '—' : f1(x / 10) + ' cm';
    let t = `Dmáx ${cm(a)} · Dmín ${cm(b)}`, estado = '';
    if (a && b && a > b) {
      const col = (a - b) / a * 100, ancha = a > 21, colapsa = col > 50;
      const banda = !ancha && colapsa ? 'normal (0-5 mmHg; PAD ≈ 3)' : ancha && !colapsa ? 'alta (10-20 mmHg; PAD ≈ 15)' : 'intermedia (5-10 mmHg; PAD ≈ 8)';
      estado = !ancha && colapsa ? 'ok' : ancha && !colapsa ? 'danger' : 'warn';
      t += ` · <b>colapso ${Math.round(col)}%</b> → banda ${banda} (FATE: diámetro &lt;2,1 / &gt;2,1 cm y colapso &gt;50 / &lt;50%)`
        + `<br>Índice de colapsabilidad en ventilación espontánea ${Math.round(col)}%: ${col > 40 ? 'por encima' : 'por debajo'} del 40% con el que FATE considera al paciente respondedor a volumen.`;
    } else if (a && b) t += ' · Dmín tiene que ser menor que Dmáx.';
    const u = motor.ultimo; if (u) { const v = modeloVci(u.pvc);
      t += `<br><span class="cv-muted">En el modelo, con PVC ${f1(u.pvc)} mmHg: Dmáx ${f1(v.dmax)} mm y colapso ${Math.round(v.colapso * 100)}% (calibre ilustrativo, elegido para caer en las bandas de FATE).</span>`; }
    return [estado, t];
  }
  function guardarVci(k) { const m = modoM.medida(); if (!m) return; guardado[k] = m.mm; modoM.borrarCalibres(); pintarMedida(null); }
  $('#cv-m-dmax').addEventListener('click', () => guardarVci('dmax'));
  $('#cv-m-dmin').addEventListener('click', () => guardarVci('dmin'));
  $('#cv-m-borrar-vci').addEventListener('click', () => modoM.borrarCalibres());
  function guardarVi(k) { const m = modoM.medida(); if (!m) return; guardado[k] = m.mm; modoM.borrarCalibres(); pintarMedida(null); }
  $('#cv-m-lvdd').addEventListener('click', () => guardarVi('lvdd'));
  $('#cv-m-lvsd').addEventListener('click', () => guardarVi('lvsd'));
  $('#cv-m-borrar').addEventListener('click', () => modoM.borrarCalibres());
  // antes de que el enlace navegue (lo hace el listener de [data-especialidad] de home, en document), se
  // escriben los diámetros en la calculadora de FS de FATE y se recalcula
  $('#cv-m-enlaces').addEventListener('click', (e) => {
    if (e.target.closest('#cv-m-a-vci')) {
      const modo = document.getElementById('umi-vci-modo'), a = document.getElementById('umi-vci-dmax'), b = document.getElementById('umi-vci-dmin'); if (!modo || !a || !b) return;
      modo.value = 'espontanea'; a.value = (guardado.dmax / 10).toFixed(1); b.value = (guardado.dmin / 10).toFixed(1);
      for (const el of [modo, a, b]) el.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
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

  // ---- Doppler (doppler.mjs): pulsado (el espectro usa el mismo barrido que el modo M, con eje de velocidades) y
  // color sobre la imagen B. Las velocidades salen del flujo del motor en ese instante; las medidas (E/A, TDE, ITV…),
  // de las muestras del último latido.
  const sumV = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], escV = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  let colorOn = false, nyq = 60, gate = null, ultimoTD = null, fuenteD = null, medD = null, latidoD = -1, frameD = 0, angD = null;
  const espectro = crearModoM($('#cv-d'), $('#cv-d-capa'), { eje: 'vel', onMedida: pintarCalibresD });
  espectro.setEscala(+$('#cv-d-escala').value);
  const datosFlujo = () => ({ rRetorno: motor.p.rRetorno, pvc: motor.ultimo ? motor.ultimo.pvc : motor.s.pad });
  const areasD = () => areasAnillo(refGeoTd.geo);
  // dónde va la muestra en cada caso: justo pasadas las valvas en las AV; justo por debajo en las sigmoideas
  const PRESETS = { mitral: { vista: 'a4c', n: 'mitral', off: 8 }, tsvi: { vista: 'a3c', n: 'aortica', off: -7 },
    tricus: { vista: 'a4c', n: 'tricus', off: 8 }, pulmonar: { vista: 'psaxAo', n: 'pulmonar', off: -6 },
    // subcostal VCI: la VCI 3 cm por debajo del hiato y la suprahepática que mejor cae en el corte (VExUS)
    vci: { vista: 'scVci', vaso: 'vci' }, suprahep: { vista: 'scVci', vaso: 'hepatica' } };
  const PRESET_VISTA = { a4c: 'mitral', a3c: 'tsvi', psaxAo: 'pulmonar', scVci: 'suprahep' };
  // un punto de un vaso del abdomen dentro del corte: en la suprahepática, el más alejado de la VCI de los que
  // quedan a menos de 2,5 mm del plano (lejos de la confluencia, donde la muestra cogería la VCI)
  function puntoVaso(tipo) {
    if (tipo === 'vci') return puntoVci(-30);
    const A = anatomiaAbdomen(), lejos = (p) => Math.hypot(p[0] - A.J[0], p[1] - A.J[1], p[2] - A.J[2]);
    let mejor = null, cerca = null;
    for (const v of A.suprahepaticas) for (const p of v.eje) { const dd = Math.abs(enPlano(planoEco, p)[2]);
      if (dd < 2.5 && (!mejor || lejos(p) > lejos(mejor))) mejor = p;
      if (!cerca || dd < cerca.dd) cerca = { p, dd }; }
    return mejor && lejos(mejor) > 12 ? mejor : cerca.p;
  }
  // nueva muestra, vista o sonda: el espectro empieza de cero y las medidas se rehacen (con el último latido) en el
  // fotograma siguiente
  function reiniciarD() {
    ultimoTD = null; espectro.limpiar(); latidoD = -1; fuenteD = null; medD = null; ecoPendiente = true;
    const box = $('#cv-d-resultado'); box.className = 'tfg-estado'; box.textContent = 'Midiendo…'; $('#cv-d-enlaces').innerHTML = '';
  }
  function marcarPreset(k) { $$('[data-muestra]').forEach(b => b.classList.toggle('on', b.dataset.muestra === k)); }
  // la muestra de partida de cada vista: su preajuste si lo tiene; si no, en el centro del haz, a media profundidad
  function muestraPorDefecto() {
    if (PRESET_VISTA[vistaEco]) { ponerMuestra(PRESET_VISTA[vistaEco]); return; }
    if (prepararPlanoEco()) { gate = { u: 0, v: planoEco.prof * 0.5 }; reiniciarD(); }
  }
  function ponerMuestra(k) {
    const pr = PRESETS[k]; if (!pr) return;
    if (vistaEco !== pr.vista) elegirVista(pr.vista);
    if (!prepararPlanoEco()) return;
    let p;
    if (pr.vaso) p = puntoVaso(pr.vaso);
    else { const F = fuentesFlujo(refGeoTd.flujo, muestraTd(), areasD(), [], datosFlujo()), j = F.geom.find(x => x.n === pr.n); p = sumV(j.c, escV(j.dir, pr.off)); }
    const [u, v] = enPlano(planoEco, p);
    gate = { u, v }; reiniciarD(); marcarPreset(k);
  }
  $('#cv-d-presets').addEventListener('click', (e) => { const b = e.target.closest('[data-muestra]'); if (b) ponerMuestra(b.dataset.muestra); });
  $('#cv-d-escala').addEventListener('change', () => { espectro.setEscala(+$('#cv-d-escala').value); ultimoTD = null; });
  $('#cv-color').addEventListener('change', () => { colorOn = $('#cv-color').checked; $('#cv-nyquist').hidden = !colorOn; ecoPendiente = true; });
  $('#cv-nyquist').addEventListener('change', () => { nyq = +$('#cv-nyquist').value; ecoPendiente = true; });
  // tocar (o arrastrar) sobre la imagen B en modo Doppler pone el volumen de muestra
  const muestraDe = (ev) => { const r = ecoC.getBoundingClientRect(), px = ecoC.width / r.width, x = (ev.clientX - r.left) * px, y = (ev.clientY - r.top) * px;
    let u = (x - ecoGeom.cx) / ecoGeom.k, v = (y - ecoGeom.arriba) / ecoGeom.k; const th = clamp(Math.atan2(u, Math.max(1, v)), -planoEco.mitad + 0.02, planoEco.mitad - 0.02);
    const rr = clamp(Math.hypot(u, v), 8, planoEco.prof - 4); return { u: rr * Math.sin(th), v: rr * Math.cos(th) }; };
  let moviendoD = false;
  ecoC.addEventListener('pointerdown', (ev) => { if (modoEco !== 'D' || !ecoGeom || !planoEco) return; moviendoD = true; ecoC.setPointerCapture?.(ev.pointerId); gate = muestraDe(ev); marcarPreset(null); reiniciarD(); });
  ecoC.addEventListener('pointermove', (ev) => { if (!moviendoD) return; gate = muestraDe(ev); reiniciarD(); });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) ecoC.addEventListener(t, () => { moviendoD = false; });
  const fx = (x, d = 0) => x == null ? '—' : x.toFixed(d).replace('.', ',');
  function actualizarMedidasD(pts, haz, F) {
    latidoD = motor.s.nLatido; fuenteD = fuenteEnMuestra(pts, haz, F); angD = null;
    if (fuenteD && fuenteD.tipo === 'valvula') { const j = F.geom.find(x => x.n === fuenteD.n); angD = Math.acos(Math.min(1, Math.abs(haz[0] * j.dir[0] + haz[1] * j.dir[1] + haz[2] * j.dir[2]))) * 180 / Math.PI; }
    medD = fuenteD ? medidasLatido(curvaLatido(motor.onda, fuenteD, fuenteD.factor, areasD(), datosFlujo()), fuenteD) : null;
    pintarResultadoD();
  }
  function pintarResultadoD() {
    const box = $('#cv-d-resultado'), enl = $('#cv-d-enlaces'), poner = (estado, html) => { box.className = 'tfg-estado' + (estado ? ' tfg-estado-' + estado : ''); box.innerHTML = html; };
    enl.innerHTML = '';
    if (!fuenteD || !medD) { poner('', 'La muestra no cae en ningún flujo: sangre quieta, pared o fuera del corazón. Muévela o elige dónde ponerla.'); return; }
    const ang = angD == null ? '' : ` · ángulo haz-flujo ${Math.round(angD)}° (se mide v·cos θ)`;
    const cab = `<b>${fuenteD.nombre}</b>${ang}<br>`;
    if (medD.tipo === 'llenado') {
      if (fuenteD.n === 'mitral') {
        enl.innerHTML = enlace('E/A y TDE en la Ficha 5', 'cardio-monitorizacion-hemodinamica', '#cardio-eco-diastolica');
        const okEA = medD.ea >= 1 && medD.ea <= 1.5, okT = medD.tde >= 140 && medD.tde <= 250;
        poner(okEA && okT ? 'ok' : 'warn', cab + `E ${fx(medD.E)} cm/s · A ${fx(medD.A)} cm/s · <b>E/A ${fx(medD.ea, 2)}</b> (normal 1-1,5) · TDE ${fx(medD.tde)} ms (normal 140-250)`
          + `<br><span class="cv-muted">Referencias de la Ficha 5 de Fisiopatología UCI · Cardiología. Las velocidades son del modelo (flujo del motor entre el área del anillo); el TDE sale de la inercia de la sangre que cruza la mitral (calibrada en el motor).</span>`);
      } else poner('', cab + `E ${fx(medD.E)} cm/s · A ${fx(medD.A)} cm/s · E/A ${fx(medD.ea, 2)}<br><span class="cv-muted">La app no tiene todavía cifras de referencia del llenado tricuspídeo. Ilustrativo.</span>`);
      return;
    }
    if (medD.tipo === 'eyeccion') {
      const u = motor.ultimo, aCm2 = areasD()[fuenteD.n] / 100, gc = medD.itv * aCm2 * u.fc / 1000;
      if (fuenteD.n === 'aortica' && fuenteD.tubo) {
        enl.innerHTML = enlace('ITV en la Ficha 11', 'cardio-interaccion-corazon-pulmon', '#cardio-eco-itv');
        poner(medD.itv >= 18 && medD.itv <= 22 ? 'ok' : 'warn', cab + `<b>ITV ${fx(medD.itv, 1)} cm</b> (normal 18-22 cm, Ficha 11) · pico ${fx(medD.pico)} cm/s`
          + `<br>GC ≈ ITV × área del TSVI (${fx(aCm2, 2)} cm²) × FC = <b>${fx(gc, 1)} L/min</b> (el motor: ${fx(u.gc, 1)} L/min)`
          + `<br><span class="cv-muted">El pico es del modelo: su eyección es más afilada de lo normal (pendiente de calibrar); el ITV no depende de eso.</span>`);
      } else poner('', cab + `ITV ${fx(medD.itv, 1)} cm · pico ${fx(medD.pico)} cm/s · GC ≈ ${fx(gc, 1)} L/min<br><span class="cv-muted">${fuenteD.tubo ? 'En el tracto de salida.' : 'Por encima de la válvula: es la velocidad del chorro, no la del tracto de salida.'} Ilustrativo.</span>`);
      return;
    }
    if (medD.tipo === 'hepatica') {
      enl.innerHTML = enlace('Onda de la vena hepática (VExUS)', 'vexus-fisiologia-doppler', '#vexus-onda-hepatica', 'panel-vexus-tabs', 'uciPapers', 'vexus');
      poner('', cab + `S ${fx(medD.S)} · D ${fx(medD.D)} cm/s hacia el corazón · A ${fx(medD.A)} cm/s retrógrada<br><span class="cv-muted">Sale de la onda de presión de la AD del motor. Ilustrativo.</span>`); return;
    }
    if (fuenteD.vasoTipo === 'porta') enl.innerHTML = enlace('Onda de la vena porta (VExUS)', 'vexus-fisiologia-doppler', '#vexus-onda-porta', 'panel-vexus-tabs', 'uciPapers', 'vexus');
    poner('', cab + `Velocidad media ${fx(medD.media)} cm/s · pulsatilidad ${medD.pulsatilidad == null ? '—' : Math.round(medD.pulsatilidad * 100) + '%'}<br><span class="cv-muted">Ilustrativo.</span>`);
  }
  function pintarCalibresD(m) {
    const box = $('#cv-d-calibres'); box.hidden = !m; if (!m) return;
    box.innerHTML = `Calibres: ${fx(m.va)} y ${fx(m.vb)} cm/s · cociente ${m.vb ? fx(Math.abs(m.va / m.vb), 2) : '—'} · Δ tiempo ${Math.round(m.ms)} ms`;
  }

  // ---- Sonda libre (planoLibre de ecografia.mjs): cuatro movimientos a partir de la vista estándar
  const MOVS = { rot: '°', incl: '°', bal: '°', desl: ' mm' };
  function ponerSonda(nueva) {
    Object.assign(sonda, SONDA_CERO, nueva);
    for (const [k, u] of Object.entries(MOVS)) { $('#cv-sonda-' + k).value = sonda[k]; $('#cv-sonda-' + k + '-v').textContent = sonda[k] + u; }
    claveTd = ''; ultimoTM = null; modoM.limpiar(); ecoPendiente = true; sondaMovidaD();
  }
  for (const k of Object.keys(MOVS)) $('#cv-sonda-' + k).addEventListener('input', (e) => {
    sonda[k] = +e.target.value; $('#cv-sonda-' + k + '-v').textContent = sonda[k] + MOVS[k];
    ultimoTM = null; modoM.limpiar(); ecoPendiente = true; sondaMovidaD();
  });
  // la muestra Doppler va con la sonda (misma posición en el haz), pero ya mira a otro sitio: espectro y medidas
  // nuevos, y el preajuste deja de estar marcado (ya no está en su sitio)
  function sondaMovidaD() { if (!gate) return; marcarPreset(null); reiniciarD(); }
  $('#cv-sonda-toggle').addEventListener('click', () => { const p = $('#cv-sonda'); p.hidden = !p.hidden; $('#cv-sonda-toggle').setAttribute('aria-expanded', String(!p.hidden)); });
  $('#cv-sonda-cero').addEventListener('click', () => { reto = null; ponerSonda(SONDA_CERO); });
  // Reto: o volver a la vista estándar desde una sonda desordenada, o pasar a otra vista de la misma ventana. En la
  // subcostal no hay paso entre vistas: la de la VCI pone la sonda en otro sitio de la piel (más abajo y vertical),
  // y eso no se alcanza solo girando e inclinando
  function iniciarReto() {
    const ventana = VISTAS[vistaEco].ventana, otras = ventana === 'subcostal' ? [] : ORDEN_VISTAS.filter(k => VISTAS[k].ventana === ventana && k !== vistaEco);
    const azar = (a, b) => Math.round((a + Math.random() * (b - a)) * (Math.random() < 0.5 ? -1 : 1));
    if (otras.length && Math.random() < 0.5) { reto = { objetivo: otras[Math.floor(Math.random() * otras.length)], desde: vistaEco }; ponerSonda(SONDA_CERO); }
    else { reto = { objetivo: vistaEco, desde: vistaEco }; ponerSonda({ rot: azar(20, 50), incl: azar(8, 20), bal: azar(5, 12), desl: azar(0, 10) }); }
    $('#cv-sonda').hidden = false; $('#cv-sonda-toggle').setAttribute('aria-expanded', 'true');
  }
  $('#cv-sonda-reto').addEventListener('click', iniciarReto);
  const PISTA = {
    apical: 'Pista: desde el ápex, el 2 y el 3 cámaras se consiguen sobre todo rotando la sonda.',
    paraesternal: 'Pista: desde el eje largo, los ejes cortos se consiguen rotando la sonda unos 90° y llevando el corte hacia la base o el ápex (deslizar o inclinar).',
  };
  // qué vista se ve y, en un reto, cuánto falta; se calcula al cambiar el plano (no en cada fotograma)
  function estadoSonda(td) {
    const movida = sondaMovida(sonda), ventana = VISTAS[vistaEco].ventana;
    if (!movida) $('#cv-sonda-estado').textContent = 'Vista estándar';
    else { const vp = vistaMasParecida(planoEco, td, ventana);
      $('#cv-sonda-estado').textContent = `Sonda movida · se parece más a ${NOMBRE_VISTA[vp.clave]} (${Math.round(vp.grados)}°, ${Math.round(vp.mm)} mm)`; }
    const box = $('#cv-sonda-reto-txt'); box.hidden = !reto; if (!reto) return;
    const dv = desviacion(planoEco, planoVista(reto.objetivo, td)), hecho = dv.grados < 7 && dv.mm < 6;
    const objetivo = `<b>${NOMBRE_VISTA[reto.objetivo]}</b> (${VISTAS[reto.objetivo].nombre})`;
    box.className = 'tfg-estado tfg-estado-' + (hecho ? 'ok' : 'warn');
    box.innerHTML = hecho
      ? `🎯 ¡Encontrada! Estás en ${objetivo}: ${Math.round(dv.grados)}° y ${Math.round(dv.mm)} mm de la vista estándar.`
      : `Objetivo: ${objetivo}${reto.objetivo === reto.desde ? ', partiendo de una sonda desordenada' : ', desde ' + NOMBRE_VISTA[reto.desde]}. Te faltan <b>${Math.round(dv.grados)}°</b> y <b>${Math.round(dv.mm)} mm</b> (hay que bajar de 7° y 6 mm).` + (reto.objetivo !== reto.desde ? `<br><span class="cv-muted">${PISTA[ventana]}</span>` : '');
  }

  const io = new IntersectionObserver((e) => { ecoVisible = e[0].isIntersecting; if (ecoVisible) ecoPendiente = true; });
  io.observe($('#cv-tarjeta-eco'));
  $('#cv-eco-rotulos').addEventListener('change', () => { ecoPendiente = true; });
  const muestraTd = () => motor.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), motor.onda[0]);
  function prepararPlanoEco() {
    if (!motor.onda.length) return null;
    // la muestra telediastólica, con la masa del VI de la forma de enfermedad (fija la posición del ápex)
    const mioVi = motor.p.mioVi ?? 1, td = { ...muestraTd(), mioVi };
    const clave = [vistaEco, img.prof, Math.round(td.vvi / 3), Math.round(td.vvd / 3), mioVi, sonda.rot, sonda.incl, sonda.bal, sonda.desl].join('|');
    if (clave !== claveTd) {
      // el plano de la vista estándar y, encima, el movimiento de la sonda (sonda libre)
      planoBase = planoVista(vistaEco, td); planoEco = planoLibre(planoBase, sonda); claveTd = clave;
      if (img.prof) planoEco = { ...planoEco, prof: img.prof };   // el mando de profundidad
      fanEco = abanicoVista(planoEco); fanBase = sondaMovida(sonda) ? abanicoVista(planoBase) : null;
      modoM.setProf(planoEco.prof); estadoSonda(td);
    }
    // forma de referencia para que el moteado siga al tejido: la telediastólica, con las mismas opciones
    // (el derrame mientras entra, de 10 en 10 mL: la forma de referencia no se rehace en cada fotograma)
    const cr = [Math.round(td.vvi), Math.round(td.vvd), opciones.pericardio, opciones.detalle, calidad, Math.round(motor.s.liquidoPeri / 10), mioVi].join('|');
    if (cr !== claveRef) { refGeoTd = construirCorazon(estadoGeo(td, extraGeo()), { pericardio: opciones.pericardio, detalle: opciones.detalle, calidad }); claveRef = cr;
      // el abdomen de referencia: en espiración (la VCI en su diámetro máximo), con la misma topología
      const pvc = motor.ultimo ? motor.ultimo.pvc : td.pad; refEco = refGeoTd.partes.concat(construirAbdomen(refGeoTd, { pvc, pad: pvc, t: 0 }).partes); }
    return td;
  }
  function pintarEco(s, g, est) {
    if (!ecoVisible || !ecografo || !g) return;
    const ahora = performance.now(), propia = !!(opciones.corte || opciones.vistaBase);
    // hasta ~30 imágenes por segundo (~12 con una geometría propia); en pausa, solo si algo cambió
    if (!ecoPendiente || ahora - ultimoEco < (propia ? 80 : modoEco === 'M' ? 20 : 30)) return;
    if (!prepararPlanoEco()) return;
    const geoEco = propia ? construirCorazon(est, { pericardio: opciones.pericardio, detalle: opciones.detalle, calidad }) : g;
    // el corte lleva siempre el abdomen (aunque en el 3D esté oculto): es anatomía, no una opción de dibujo
    const abdEco = !propia && abd ? abd : construirAbdomen(geoEco, datosVci(s));
    const im = ecografo.formar(geoEco.partes.concat(abdEco.partes), planoEco, { ref: refEco, t: s.t ?? 0, ventanaVista: VISTAS[vistaEco].ventana, ganancia: img.gan, tgc: img.tgc, focoMm: img.foco, m: { ventana: img.ventana ? 0.7 : 0 } });
    // Doppler: las velocidades de este instante (las mismas piezas, el mismo estado)
    const Fd = colorOn || (modoEco === 'D' && gate) ? fuentesFlujo(geoEco.flujo, s, areasD(), abdEco.vasos, datosFlujo()) : null;
    if (colorOn) ecografo.colorear(mapaColor(planoEco, im, Fd), nyq);
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
    if (modoEco === 'D' && gate) {
      const P = planoEco, g = sumV(P.O, sumV(escV(P.r, gate.u), escV(P.d, gate.v))), haz = nrm(sumV(escV(P.r, gate.u), escV(P.d, gate.v)));
      const pts = puntosMuestra(P, g, haz), us = velocidadesMuestra(pts, haz, Fd);
      if (!revision && s === motor.s && ultimoTD !== s.t) { espectro.anadir(s.t, (f) => columnaEspectro(us, f, espectro.estado.vmax, ++frameD)); ultimoTD = s.t; }
      if (motor.s.nLatido !== latidoD) actualizarMedidasD(pts, haz, Fd);
      // haz punteado y volumen de muestra (dos marcas cruzadas al haz)
      const pxm = ecoC.width / ecoC.clientWidth, X = (u) => im.cx + u * im.escala, Y = (v) => im.arriba + v * im.escala, L = Math.hypot(gate.u, gate.v), tu = gate.u / L, tv = gate.v / L;
      ecoCtx.save(); ecoCtx.strokeStyle = 'rgba(241,201,74,.9)'; ecoCtx.lineWidth = 1.5 * pxm; ecoCtx.setLineDash([5 * pxm, 4 * pxm]);
      ecoCtx.beginPath(); ecoCtx.moveTo(im.cx, im.arriba); ecoCtx.lineTo(X(gate.u + tu * 6), Y(gate.v + tv * 6)); ecoCtx.stroke(); ecoCtx.setLineDash([]); ecoCtx.lineWidth = 2 * pxm;
      for (const k of [-1.5, 1.5]) { ecoCtx.beginPath(); ecoCtx.moveTo(X(gate.u + tu * k - tv * 4), Y(gate.v + tv * k + tu * 4)); ecoCtx.lineTo(X(gate.u + tu * k + tv * 4), Y(gate.v + tv * k - tu * 4)); ecoCtx.stroke(); }
      ecoCtx.restore();
    }
    ecoMs = 0.8 * ecoMs + 0.2 * im.tiempos.total; ultimoEco = ahora; ecoPendiente = false;
    if (!im.geometriaNueva) calidadAutomaticaEco(im.tiempos.total);
    const P = planoEco, k = im.escala, X = (u) => im.cx + u * k, Y = (v) => im.arriba + v * k, px = ecoC.width / ecoC.clientWidth;
    ecoCtx.font = `${Math.round(11 * px)}px system-ui,sans-serif`; ecoCtx.textAlign = 'center'; ecoCtx.textBaseline = 'middle';
    // escala de profundidad: un punto por centímetro junto al borde derecho del sector; cifra cada 5 cm
    const dx = Math.sin(P.mitad), dy = Math.cos(P.mitad);
    for (let cm = 1; cm * 10 < P.prof; cm++) { const r = cm * 10, x = X(r * dx) + 6 * px, y = Y(r * dy);
      ecoCtx.fillStyle = 'rgba(220,214,196,.8)'; ecoCtx.fillRect(x - 1, y - 1, cm % 5 ? 2 : 4, 2);
      if (cm % 5 === 0) { const dentro = x + 20 * px < ecoC.width; ecoCtx.textAlign = dentro ? 'left' : 'right'; ecoCtx.fillText(cm + '', dentro ? x + 6 * px : x - 4 * px, y - (dentro ? 0 : 9 * px)); ecoCtx.textAlign = 'center'; } }
    marcaFoco(im, P);
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
        ['Ao', T([f.valvulas.aortica[0], f.valvulas.aortica[1], f.valvulas.aortica[2] + 14])],
        // fuera del corazón, solo en su ventana: la VCI bajo el diafragma (fija al cuerpo) en la subcostal; el arco
        // aórtico y la AP derecha bajo él en la supraesternal
        ...(VISTAS[vistaEco].ventana === 'subcostal' ? [['VCI', puntoVci(-25)]] : []),
        ...(VISTAS[vistaEco].ventana === 'supraesternal' ? [['Arco', T([0, -14, 75])], ['APD', T([-12, -15, 56])]] : [])];
      for (const [n, p] of marcas) { const [u, v, dd] = enPlano(P, p), r = Math.hypot(u, v);
        if (Math.abs(dd) > 14 || r > P.prof - 5 || Math.abs(Math.atan2(u, v)) > P.mitad - 0.04) continue;
        rot.push(n); const w = (n.length > 2 ? 34 : 24) * px; ecoCtx.fillStyle = 'rgba(0,0,0,.55)'; ecoCtx.fillRect(X(u) - w / 2, Y(v) - 8 * px, w, 16 * px);
        ecoCtx.fillStyle = '#e8e3d5'; ecoCtx.fillText(n, X(u), Y(v)); }
    }
    if (img.senal) senalar(img.senal, im);
    $('#cv-eco-titulo').textContent = NOMBRE_VISTA[vistaEco] + (sondaMovida(sonda) ? ' · sonda libre' : '');
    ecoC.setAttribute('aria-label', `Ecografía reconstruida, ${VISTAS[vistaEco].nombre}, fase ${s.fase}`);
    $('#cv-eco-fase').textContent = `${s.fase} · ${FASES[s.fase]}`;
    $('#cv-eco-nombre').textContent = VISTAS[vistaEco].nombre;
    ecoInfo = { t: s.tLatido, tMotor: s.t, vista: vistaEco, rotulos: rot, propia, abiertos: im.abiertos, modo: modoEco, theta: thetaM, sonda: { ...sonda }, plano: planoEco,
      color: colorOn, muestra: gate ? { ...gate } : null, fuente: fuenteD ? fuenteD.nombre : null, medidas: medD };
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
      // el abdomen (fijo al cuerpo, con la VCI que late) no va con la vista de la base, que retira los grandes vasos
      abd = !opciones.vistaBase ? construirAbdomen(geo, datosVci(s)) : null; abd3d = partesAbd3d(abd);
    }
    const g = geo;
    if (rgl && abierto('#cv-plegable-3d')) {
      // al revisar un instante pasado, la sangre (que vive en el tiempo del motor) no se dibuja
      const puntos = verSangre && !revision ? sangre.puntos(g.flujo, { vistaBase: opciones.vistaBase }) : null;
      let partes = verSangre ? g.partes.filter(p => !p.nombre.endsWith('sangre')) : g.partes;
      if (abd3d.length) partes = partes.concat(abd3d);
      let conPlano = partes;
      if ($('#cv-eco-plano').checked && fanEco) {
        conPlano = partes.concat([{ nombre: 'Plano eco', pos: fanEco.pos, idx: fanEco.idx, color: [0.35, 0.78, 0.95], alfa: 0.22, dobleCara: true }]);
        if (fanBase) conPlano.push({ nombre: 'Plano estándar', pos: fanBase.pos, idx: fanBase.idx, color: [0.7, 0.7, 0.7], alfa: 0.1, dobleCara: true });
      }
      rgl.dibujar(conPlano, cam, undefined, puntos);
    }
    if (sucioEco) { ecoPendiente = true; sucioEco = false; }
    pintarEco(s, g, estGeo);
    pintarCiclo(s);
    const cursor = abierto('#cv-plegable-diag') ? diag.pintar(s, motor, lado) : null;
    paneles?.pintar(s);   // Guyton, catéter y termodilución: el mismo estado de este fotograma
    ultimo = { estado: s, est: estGeo, cursor, modo: modoGeo, eco: ecoInfo, vci: abd ? abd.vci : null, abdomen3d: abd3d.map(p => [p.nombre, p.idx.length / 3]) };
    if (opc.depuracion) window.__ultimoDibujo = ultimo;
    const fase = `${s.fase} · ${FASES[s.fase]}`;
    const fuera = s.vvi < LIMITES.vi[0] || s.vvi > LIMITES.vi[1] || s.vvd < LIMITES.vd[0] || s.vvd > LIMITES.vd[1] || Math.min(s.vai, s.vad) < LIMITES.au[0] || Math.max(s.vai, s.vad) > LIMITES.au[1];
    poner('#cv-hud', (revision ? '<span class="cv-revisando">⏸ revisando el último latido</span><br>' : '') + `t = ${s.tLatido.toFixed(2)} s · FC ${Math.round(revision ? motor.ultimo.fc : s.fc)} · <b>${fase}</b>` + (g ? `<br>base ${g.descenso >= 0 ? '+' : ''}${g.descenso.toFixed(0)} mm` : '') + (abd ? `<br>VCI ${abd.vci.d.toFixed(0)} mm · colapso ${Math.round(abd.vci.colapso * 100)}% (ilustrativo)` : '') + (fuera ? '<br><span class="cv-aviso">⚠ volumen fuera del rango del dibujo: se muestra en su límite</span>' : ''));
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
    pintarForma(u);
  }
  // Formas de enfermedad: sus cifras (las del último latido y las que mediría un ecografista en la telediástole)
  // frente a los criterios de las fichas (escenarios.mjs, CRITERIOS_FORMA). La referencia normal se calcula una vez.
  let normalRef = null;
  const medidasDe = (m) => medidasCorazon(estadoGeo(m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), m.onda[0]), extraDeMotor(m)), m.p.sc);
  function pintarForma(u) {
    const caja = $('#cv-forma-medidas');
    if (!ESCENARIOS[escenario]?.forma) { caja.hidden = true; return; }
    if (!normalRef) { const m0 = crearMotor({ barorreflejo: motor.p.barorreflejo }); m0.correr(12); normalRef = { u: m0.ultimo, md: medidasDe(m0) }; }
    const res = evaluarForma(escenario, u, medidasDe(motor), normalRef.u, normalRef.md);
    caja.hidden = false;
    caja.innerHTML = `<p class="cv-titulo">Lo que mide el modelo frente a las fichas</p>` + res.map(r =>
      `<div class="cv-criterio${r.ok ? ' ok' : ''}"><span class="cv-criterio-marca">${r.ok ? '✅' : '⚠️'}</span>
        <span class="cv-criterio-txt">${r.texto}: <b>${r.v}</b>${r.nota ? `<br><span class="cv-muted">${r.nota}</span>` : ''}</span>
        <button type="button" class="especialidad-link cv-criterio-ir" data-especialidad="${r.fuente.especialidad}" data-view="${r.fuente.view}" data-panel="${r.fuente.panel}" data-tab="${r.fuente.tab}" data-resaltar="${r.fuente.sel}">${r.fuente.ficha} →</button></div>`).join('') +
      `<p class="cv-muted">Las cifras se cotejan con las fichas; los parámetros del modelo que producen la forma (masa, rigidez, contractilidad, resistencias, volumen retenido) son ilustrativos.</p>`;
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
  $('#cv-abdomen').addEventListener('change', () => { verAbdomen = $('#cv-abdomen').checked; ensuciar(); });
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
  const chipEsc = ([k, e]) => `<button type="button" class="cv-mini${k === 'normal' ? ' on' : ''}" data-c="${k}">${e.nombre}</button>`;
  $('#cv-escenarios').innerHTML = Object.entries(ESCENARIOS).filter(([, e]) => !e.forma).map(chipEsc).join('');
  $('#cv-enfermedad').innerHTML = Object.entries(ESCENARIOS).filter(([, e]) => e.forma).map(chipEsc).join('');
  function elegirEscenario(k) {
    if (!ESCENARIOS[k]) return;
    escenario = k;
    // que se vea ya el efecto (y el barorreflejo respondiendo); una forma de enfermedad, ya asentada (escenarios.mjs)
    motor = crearMotor({ barorreflejo: $('#cv-baro').checked }); motor.correr(12); aplicarEscenario(motor, k);
    if (opc.depuracion) window.__motor = motor;
    revision = null; ponerPausa(false); sangre.reiniciar(); latidoTexto = -1; claveTd = ''; ensuciar(); colocarLineaM(); reiniciarD();
    paneles?.alCambiarMotor();
    $$('[data-c]').forEach(x => x.classList.toggle('on', x.dataset.c === k));
    opc.onEscenario?.(k);
  }
  for (const id of ['#cv-escenarios', '#cv-enfermedad']) $(id).addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) elegirEscenario(b.dataset.c); });
  $('#cv-baro').addEventListener('change', () => { motor.p.barorreflejo = $('#cv-baro').checked; });
  function avanzarSeg(seg) { revision = null; ponerPausa(false); motor.correr(seg); sangre.reiniciar(); latidoTexto = -1; ensuciar(); }
  $('#cv-avanzar').addEventListener('click', () => avanzarSeg(10));

  // Hemodinámica de Marino (diagramas.mjs): Guyton con la EPP y el bolo, el catéter que avanza y la termodilución
  paneles = crearPanelesHemo(raiz, {
    motor: () => motor, escenario: () => escenario, correr: avanzarSeg,
    paciente: () => elegirEscenario(escenario),
    verTsvi: () => { elegirModo('D'); ponerMuestra('tsvi'); $('#cv-tarjeta-eco').scrollIntoView({ block: 'start' }); },
  });

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
    window.__eco = { info: () => ecoInfo, vista: elegirVista, plano: () => planoEco, modo: elegirModo, medir: elegirMedida, modoM, sonda: ponerSonda,
      doppler: { muestra: ponerMuestra, ponerEn: (u, v) => { gate = { u, v }; reiniciarD(); }, color: (on, n) => { $('#cv-color').checked = on; colorOn = on; if (n) nyq = n; ecoPendiente = true; }, espectro, medidas: () => medD, fuente: () => fuenteD }, reto: (r) => { reto = r ?? null; claveTd = ''; ecoPendiente = true; } };
    window.__ensuciar = ensuciar; window.__sangre = sangre; window.__motor = motor; window.__cam = cam; window.__tabla = tabla;
  }

  return {
    vista: elegirVista,
    modo: elegirModo,
    sonda: ponerSonda,
    medir: elegirMedida,
    muestraDoppler: ponerMuestra,
    escenario: elegirEscenario,
    panel: (k) => paneles?.abrir(k),
    activo: setActivo,
    get vistaActual() { return vistaEco; },
    get escenarioActual() { return escenario; },
    get ultimoDibujo() { return ultimo; },
    webgl: !!rgl,
  };
}
