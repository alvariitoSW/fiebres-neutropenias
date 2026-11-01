// Capilar y oxígeno: del pulmón a la mitocondria (Libros → Marino → Fundamentos, grupo oxígeno, caps. 7 y 9).
// Ampliado con el cap. 12 (anemia y transfusión, Merino HEMATO del bloque 2): el corazón que compensa, la volemia,
// «Transfundir 1 CH», las lupas del tubo y del alvéolo.
// Interfaz del modelo vivo: frase viva, dock de 5 pestañas (sangre, pulmón, corazón, tejido, mido en), lupas,
// interruptor Explorar | Conceptos | Mayéutica y la capa de estudio (guía socrática y examen, repaso de lo fallado y
// 4 casos clínicos). Mismo patrón que el río y mar (agua-viva.js). La escena vive en capilar-vivo-escena.js; los
// datos, en js/data/capilar-vivo-data.js.
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="capilarVivo" data-capilar-vivo="anemia">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica es el motor común (core/mayeutica-motor.js): guarda aciertos y fallos en
// localStorage (como el quiz), con su clave propia y siempre dentro de try/catch. Cada estado con nombre tiene su
// explicación guiada (core/explicacion-guiada.js, «Explícame este estado») y cada cita lleva a su sitio de la ficha
// (core/citas.js).
import { cargarMotion } from '../../core/motion.js';
import { verFrase } from '../../core/frase-vista.js';
import { ENSENANZA } from '../../data/capilar-vivo-caso-carmen.js';
import { crearTope } from '../../core/tope.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { crearMayeuticaModelo, entrar, pintarDock as pintarDockComun } from '../../core/mayeutica-motor.js';
import { enlacesFuente, origenEnlazado, enlazarOrigenes as enlazarCitas, citaExacta } from '../../core/citas.js';
import { crearExplicacion } from '../../core/explicacion-guiada.js';
import {
    ESTADOS, ESTADOS_CHIPS, CARMEN, CARMEN_UMBRAL, CARMEN_TACO, CARMEN_TACO_CONSTANTES, GRUPOS_CHIPS, CONCEPTOS, PREGUNTAS, CASOS, GUIAS, TUBOS, HB_POR_CH, estadoBase, estadoDe, estadoFinal, hbDeHto,
    gastoDe, derivar, copia, clamp, dec, mil, pruebasCapilar,
} from '../../data/capilar-vivo-data.js';
import {
    $, estado, D, REDUCIR, Lupa, ocultos, vistos, initEscena, aplicarModelo, setOcultos, mirar, ponerCamas, pintarCamas,
    arrancar, pintarUnaVez, ponerVisible, medir, estadoBucle, vaciarFotogramas, hematieSVG, iconoHematie, iconoParticula, CELDAS, ponerGoteo,
} from './capilar-vivo-escena.js';

let raiz = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   Frase viva (con su origen) y aplicar un estado
   ============================================================ */
let fraseActual = '';
function decir(html, fuente, ilu) {
    const fraseEl = $('frase');
    const esIlu = ilu || /ilustrativ|sin cifra/.test(fuente || '');
    const guia = claveActual && GUIAS[claveActual] && !Guia.activo ? ` <button type="button" class="cpv-ir-estado" data-cpv-guia="${claveActual}">Explícamelo →</button>` : '';
    const nuevo = `${html} ${fuente ? `<span class="cpv-org${esIlu ? ' cpv-ilu' : ''}">${origenHTML(fuente)}</span>` : ''}${guia}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('lamina').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
}
// El tope del O₂ (Tabla 21.4, p. 66-67): solo en el estado del posparo (reperfusión), no en el estallido del neutrófilo, O₂ de más con SaO₂ ≥90 % agrava la lesión neurológica
let tope = null, topeVisto = '';
function topeOxigeno() {
    const bn = document.querySelector('[data-cpv-lupa="neutrofilo"]'); if (bn) bn.hidden = !estado.ros;
    if (!tope) return;
    const exceso = estado.ros === 'reperfusion' && estado.pao2 > estadoBase().pao2 && D.R.sao2 >= 90;
    const firma = estado.ros === 'reperfusion' ? (exceso ? 'sello' : 'aviso') : '';
    if (firma === topeVisto) return; topeVisto = firma;
    tope.quitar('hiperoxia');
    // solo aviso, nunca sello: la fuente no da un techo de PaO₂ ni una consecuencia medida; da el criterio de uso (O₂ solo si SaO₂ <90 %)
    if (firma) tope.poner('hiperoxia', { nivel: 'aviso', titulo: 'No subas el O₂', texto: firma === 'sello' ? `O₂ sin indicación: solo si SaO₂ <90 % (Tabla 21.4, p. 66). Ahora la SaO₂ es ${D.R.sao2} %.` : 'Solo si la SaO₂ es <90 % (Tabla 21.4, p. 66).', cita: 'mc-posresucitacion#mc-tabla-21-4', origen: 'ficha · cap. 21, p. 66' });
}
function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo);
    sincronizarMandos(); topeOxigeno();
    if (op.frase !== false && modo === 'explorar') decir(...fraseDe(viejo, nuevo));
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

function fraseDe(prev, e) {
    // sin estado anterior (al abrir en un estado), se cuenta lo que cambia respecto al sano
    if (!prev && JSON.stringify(e) !== JSON.stringify(estadoBase())) return fraseDe(estadoBase(), e);
    const R = D.R, cambio = k => prev && JSON.stringify(prev[k]) !== JSON.stringify(e[k]);
    // ---- Cap. 17: el neutrófilo y las ROS (el modelo no calcula nada nuevo: es la lupa y el tope del O₂) ----
    if (e.ros === 'toxicidad' && cambio('ros')) return ['El O₂ llega a agua con <span class="hl">4 electrones, de uno en uno</span>, y por el camino deja radicales; los antioxidantes los frenan. <span class="hl-rojo">Sube la FiO₂ y las horas</span> y mira qué vence.', 'ficha · neumo-o2-toxicidad#nep-tox-metabolismo · #nep-tox-fio2 · p. 66-72 · barras: ilustrativas'];
    if (e.ros && cambio('ros')) return e.ros === 'neutrofilo'
        ? ['El neutrófilo <span class="hl-rojo">multiplica por 20 su consumo de O₂</span> durante 15-20 min, pero <span class="hl">no fabrica ATP</span>: la NADPH oxidasa añade electrones al O₂ de uno en uno (superóxido → H₂O₂) y de ahí salen hidroxilo (con Fe²⁺) o hipoclorito (con mieloperoxidasa).', 'ficha · mc-inflamacion-ros#mc-estallido · #mc-fig-17-1 · p. 53-54']
        : ['El H₂O₂ <span class="hl">cruza membranas</span> y viaja por la sangre hasta <span class="hl-rojo">otro órgano</span>, donde el Fe²⁺ lo vuelve radical hidroxilo. El O₂ solo se da si la SaO₂ es &lt;90 %.', 'ficha · mc-inflamacion-ros#mc-lesion-oxidante-foco · p. 55 · mc-posresucitacion#mc-tabla-21-4 · p. 66'];
    // ---- Cap. 12: anemia y transfusión ----
    const FA = 'ficha · merino-anemia', FU = 'ficha · merino-transfusion', FR = 'ficha · merino-riesgos';
    if (e.alveolo && cambio('alveolo')) return e.alveolo === 'trali'
        ? ['En el 80 % de los casos los anticuerpos vienen en la bolsa (en el otro ≈20 % no hay anticuerpos): <span class="hl-rojo">los neutrófilos se quedan en el pulmón</span> y lo inflaman. Uno de cada 12.000 CH; la primera causa de muerte por transfusión.', `${FR}#mh-trali · p. 14 · PaO₂ 55: ilustrativa`, true]
        : ['Aquí el agua entra <span class="hl">por presión</span>: edema hidrostático, más frecuente con insuficiencia cardíaca o renal previas. Se para la transfusión y va bien un <span class="hl-verde">diurético de asa</span>.', `${FR}#mh-taco · p. 15-16 · PaO₂ 55: ilustrativa`, true];
    if (e.dil && cambio('dil')) {
        const t = TUBOS[e.dil];
        if (t[1] == null) return [`Hto ${dec(t[0], 1)} %. ${e.dil === 'antes' ? 'Pon el bolo de 20 mL/kg' : 'Túmbalo'} y mira el tubo: ¿cuánto bajará sin perder un hematíe?`, `${FA}#mh-trampa-volumen · p. 2-3 (Fig. 12.1)`];
        return [`Ni un hematíe perdido y el Hto cae ${dec(t[0] - t[1], 1)} puntos (${dec(t[0], 1)} → ${dec(t[1], 1)} %), como si hubiera perdido <span class="hl-rojo">una unidad de sangre (500 mL)</span>: el Hto <span class="hl-purpura">mide una concentración</span>.${e.dil === 'tumbado' ? ' Al tumbarse entran 420 mL de plasma.' : ''}`, `${FA}#mh-trampa-volumen · p. 2-3 (Fig. 12.1)`];
    }
    if (e.transf && cambio('transf')) {
        if (e.transf.a == null) return [`Gotea la bolsa: Hb ${dec(e.hb, 1)} g/dL, con el gasto quieto.`, `${FU}#mh-efecto-transfusion · p. 10 · gasto quieto: ilustrativo`, true];
        const pre = derivar(Object.assign(copia(e), { hb: e.transf.de })), sube = Math.round((R.do2 / Math.round(pre.do2) - 1) * 100);
        return [`Hb ${dec(e.transf.de, 1)} → ${dec(e.hb, 1)}: <span class="hl">sube el aporte</span> (${mil(pre.do2)} → ${mil(R.do2)} mL/min, +${sube} % con el gasto quieto; en el dibujo del libro, ≈+17 %), <span class="hl-rojo">el consumo no cambia</span> (${R.vo2}): cae la extracción (${pre.R.ext} → ${R.ext} %). No es un método absoluto para oxigenar.`, `${FU}#mh-efecto-transfusion · p. 10-11 (Fig. 12.4) · aporte: ilustrativo`, true];
    }
    if ((cambio('volemia') && e.volemia === 'baja') || (e.volemia === 'baja' && (cambio('hb') || cambio('gc')))) return e.hb < 13
        ? [`Sin volumen el corazón no puede compensar (gasto ${dec(R.gc, 1)}): el aporte cae a ${mil(R.do2)} y ${D.porAporte ? `<span class="hl-rojo">el consumo ya depende del aporte</span> (VO₂ ${R.vo2})` : `la extracción sube al ${R.ext} %`}. La volemia puede pesar más que la Hb: la hipovolemia causa shock; la anemia, no.`, `${FU}#mh-volumen-vs-celulas · p. 16-17 (Fig. 12.6) · gasto: ilustrativo`, true]
        : [`Volemia baja: el gasto no puede subir de 5 (ahora ${dec(R.gc, 1)}). Baja la Hb y mira qué pasa sin el corazón que compensa.`, `${FU}#mh-volumen-vs-celulas · p. 16-17 · gasto: ilustrativo`, true];
    if (e.compensa && (cambio('compensa') || cambio('hb') || cambio('volemia') || cambio('gcFijo'))) {
        if (e.hb < 3) return [`Por debajo de Hb 3 la extracción ya no da más: <span class="hl-rojo">el consumo cae</span> (VO₂ ${R.vo2}) y sube el lactato (${dec(R.lact, 1)}).`, `${FA}#mh-limite-compensacion · p. 6 (Fig. 12.3) · gasto y lactato: ilustrativos`, true];
        if (e.hb <= 3) return [`Hasta un Hto del 10 % (Hb ≈3) la extracción compensa; aquí <span class="hl-rojo">llega al 50 %</span> (gasto ${dec(R.gc, 1)} L/min). Por debajo, el consumo cae y empieza el lactato.`, `${FA}#mh-limite-compensacion · p. 6 (Fig. 12.3) · gasto: ilustrativo`, true];
        if (e.hb === 7) return [`Hb 7: <span class="hl">el umbral de las guías</span> en el estable sin cardiopatía isquémica. Mira la extracción: ${R.ext} %, lejos del 50 %. El número de Hb no dice si el tejido sufre.`, `${FU}#mh-umbrales-guias · p. 8 · extracción: ilustrativa`, true];
        if (e.hb === 8) return [`Hb 8: el umbral con <span class="hl">cardiopatía isquémica, cirugía cardíaca u ortopédica</span>. La extracción, ${R.ext} %.`, `${FU}#mh-umbrales-guias · p. 8 · extracción: ilustrativa`, true];
        if (e.hb < 15) return [`Menos hematíes, <span class="hl-azul">sangre menos viscosa</span> (×${dec(R.visc, 1)} el agua): el corazón bombea más (${dec(R.gc, 1)} L/min) y la extracción sube (${R.ext} %) <span class="hl-verde">sin llegar al techo</span>.`, `${FA}#mh-limite-compensacion · p. 4-6 (Tabla 12.2, Figs. 12.2-12.3) · gasto: ilustrativo`, true];
        return ['Con la Hb normal el corazón no tiene que compensar: gasto 5 L/min. Baja la Hb.', `${FA}#mh-anemia-compensacion · p. 4`];
    }
    // ---- Caps. 7 y 9 ----
    if (e.rcp) return ['Parada con RCP: con una <span class="hl-rojo">PETCO₂ ≤10 mmHg tras 20 min</span> de RCP, es improbable recuperar la circulación espontánea.', 'ficha · mar-capno-rcp'];
    if (e.esofago) return ['<span class="hl-rojo">Sin CO₂ espirado: el tubo está en el esófago</span> (o hay una parada, sin retorno venoso). La intubación esofágica no reconocida se da en 1 de cada 18 intubaciones urgentes del crítico.', 'ficha · mar-capno-intubacion'];
    if (cambio('sedacion') && e.sedacion) return [`Hipoventila: <span class="hl-rojo">la PETCO₂ sube</span> (${R.petco2} mmHg); la SpO₂ todavía no ha bajado (${R.spo2 ?? '—'} %).`, 'ficha · mar-capno-sedacion · PETCO₂ ilustrativa'];
    if (cambio('espacio') && e.espacio !== 'no') return [`Alvéolos ventilados sin sangre: la PETCO₂ (${R.petco2}) se queda <span class="hl">por debajo de la PaCO₂</span> (${R.paco2}).${e.espacio === 'epoc' ? ' En la EPOC, además, la fase II sube despacio.' : ''}`, 'ficha · mar-gradiente-co2 · mar-tabla-7-1 · mar-capno-f2 · PETCO₂ ilustrativa'];
    if (cambio('co') && e.co) return [`La SpO₂ sigue en ${R.spo2 ?? '—'} %: <span class="hl-rojo">el pulsioxímetro no ve la COHb</span>; la SaO₂ real ha caído a ${R.sao2} %. Pide gasometría con cooximetría.`, 'ficha · mar-cooximetria · COHb 25 % ilustrativa'];
    if ((cambio('frio') || cambio('sensor')) && e.frio) return e.sensor === 'dedo' ? ['Dedo frío: <span class="hl-rojo">la onda se aplana</span> y la SpO₂ deja de ser fiable. Pon el sensor en la frente.', 'ficha · mar-oxi-frente · onda plana: ilustrativa', true] : [`En la frente (carótida interna) los vasos se contraen menos: <span class="hl-verde">la SpO₂ vuelve</span> (${R.spo2} %).`, 'ficha · mar-oxi-frente'];
    if (cambio('util') && e.util === 'sepsis') return [`Llega O₂ pero la PDH está bloqueada: los hematíes <span class="hl-rojo">salen casi llenos</span> (SvO₂ ${R.svo2} %, &gt;80 %) y la célula suelta lactato. Es el defecto de utilización.`, 'cortes: ficha · mar-sao2-svo2-guia · las cifras: ilustrativas', true];
    if (cambio('util') && e.util === 'tiamina') return ['Sin pirofosfato de tiamina la PDH no trabaja: el piruvato se desvía a <span class="hl-rojo">lactato</span>. La SvO₂ no se toca: la ficha no la da.', 'ficha · mar-extraccion-lactato (acordeón «Déficit de tiamina»)'];
    if (cambio('estres') && e.estres) return ['El estrés fisiológico (más transportadores de glucosa y catecolaminas) sube la glucólisis aerobia <span class="hl">un 40-50 %</span>, y con ella el lactato.', 'ficha · mar-extraccion-lactato (acordeón «Estrés fisiológico») · lactato: ilustrativo'];
    if (cambio('consumo') && e.consumo === 'fiebre') return [`Más consumo con el mismo aporte: <span class="hl">sube la extracción</span> (${R.ext} %) y baja la SvO₂ (${R.svo2} %).`, 'ilustrativo: 300 mL/min', true];
    if (cambio('toma')) return e.toma === 'scvo2' ? (D.shock ? [`En el crítico la ScvO₂ sale <span class="hl-rojo">más alta que la SvO₂</span>: de media un 7 %; en el shock, hasta un 18 %. Aquí, ${R.scvo2} % frente a ${R.svo2} %.`, 'ficha · mar-scvo2-9 · +7 en el shock: ilustrativo', true] : [`Fuera del shock la ScvO₂ es algo menor que la SvO₂; la ficha no da cuánto: el modelo las iguala (${R.scvo2} %).`, 'ficha · mar-scvo2-9 · igualdad ilustrativa', true]) : [`La SvO₂ mixta, en la arteria pulmonar: la media de todos los retornos venosos (${R.svo2} %).`, 'ficha · mar-svo2-mixta'];
    // La anemia con el gasto fijo (la cuenta del cap. 9): el cap. 12 dice que el corazón compensa (corrección del bloque 2)
    const siCompensa = ' <button type="button" class="cpv-ir-estado" data-cpv-ir-estado="anemia-compensada">¿Y si el corazón compensa? →</button>';
    if (cambio('hb')) return e.hb === 7.5 && e.pao2 === 90 ? [`Con la Hb a la mitad, <span class="hl-rojo">la fila tiene huecos</span> y el contenido cae a la mitad: de 20 a ${Math.round(D.cao2)} mL/dL. <b>Con el gasto fijo</b> (si el corazón no compensara), cada hematíe soltaría más: la extracción llegaría al ${R.dif} %.${siCompensa}`, 'ficha · mar-anemia-hipoxemia (Fig. 9.2) · la fila: ilustrativa'] : [`Hb ${dec(e.hb, 1)} con el gasto fijo: CaO₂ ${dec(R.cao2, 1)} mL/dL y aporte ${mil(R.do2)} mL/min (con Hb 15, 20 y 985).${e.hb < 15 ? siCompensa : ''}`, 'ficha · mar-cao2-9 · mar-do2'];
    if (e.ros === 'reperfusion' && cambio('pao2') && e.pao2 > estadoBase().pao2 && R.sao2 >= 90) return [`PaO₂ ${e.pao2}, SaO₂ ${R.sao2} %: <span class="hl-rojo">O₂ sin indicación</span>: solo si la SaO₂ es &lt;90 % (Tabla 21.4).`, 'ficha · mc-posresucitacion#mc-tabla-21-4 · p. 66 · PaO₂ por encima de la base: ilustrativa'];
    if (cambio('pao2')) return e.pao2 === 45 ? [`PaO₂ a la mitad: SaO₂ ${R.sao2} %, CaO₂ ${Math.round(D.cao2)} mL/dL: <span class="hl">solo un 20 % menos</span>.`, 'ficha · mar-anemia-hipoxemia (Fig. 9.2)'] : e.pao2 >= 60 ? [`PaO₂ ${e.pao2}: SaO₂ ${R.sao2} %. <span class="hl">Casi no cambia: estás en la parte plana</span> de la curva.`, 'ficha · mar-curva-forma · curva: fisiología general'] : [`PaO₂ ${e.pao2}: ya en la parte empinada; la SaO₂ cae deprisa (${R.sao2} %).`, 'ficha · mar-curva-forma · curva: fisiología general'];
    if (cambio('gc') || (prev && prev.frio !== e.frio)) {
        if (D.porAporte) return [`El aporte cayó a ${mil(R.do2)} mL/min: los hematíes <span class="hl-rojo">salen con la mitad de las perlas vacías</span> (extracción del 50 %, SvO₂ ${R.svo2} %) y el consumo ya depende del aporte (VO₂ ${R.vo2}).`, 'ficha · mar-extraccion-curva (Fig. 9.3)'];
        return [`Gasto ${dec(R.gc, 1)} L/min: aporte ${mil(R.do2)} mL/min; el tejido sigue cogiendo ${R.vo2} subiendo la extracción (${R.dif} %). Gap de PCO₂ ${R.gap} mmHg.`, 'ficha · mar-extraccion-curva · mar-gap-co2 · gap ilustrativo'];
    }
    if (D.porAporte) return [`El aporte (${mil(R.do2)} mL/min) no llega: la extracción tocó el 50 % y <span class="hl-rojo">el consumo depende del aporte</span> (VO₂ ${R.vo2}).`, 'ficha · mar-extraccion-curva (Fig. 9.3)'];
    return [`Hb ${dec(e.hb, 1)}, PaO₂ ${e.pao2} y gasto ${dec(R.gc, 1)}: llegan <span class="hl">${mil(R.do2)} mL/min</span> de O₂ y el tejido usa ${R.vo2}: ${R.dif <= 26 && R.dif >= 24 ? 'una cuarta parte; cada hematíe suelta una perla de cada cuatro' : `la extracción es del ${R.dif} %`} (SvO₂ ${R.svo2} %).`, 'ficha · mar-tabla-9-1 · mar-o2er'];
}

/* ============================================================
   Mandos del dock
   ============================================================ */
function pestana(tab) {
    enRaiz('.cpv-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.cpvTab === tab)));
    enRaiz('#cpv-dock-explorar .cpv-dock-panel').forEach(p => { p.hidden = p.dataset.cpvPanel !== tab; });
}
// ¿El modelo está en este estado con nombre? La transfusión lo está mientras gotea su bolsa y al acabar; la dilución,
// con cualquiera de sus tubos (de pie, tumbado, antes o después del bolo).
function enEstado(e, k) {
    const s = ESTADOS[k];
    if (s.transfundir && e.transf && e.transf.de === s.p.hb) return true;
    if (s.p.dil && e.dil) return true;
    return JSON.stringify(e) === JSON.stringify(estadoDe(s.p));
}
function sincronizarMandos() {
    const e = estado;
    // la Hb baja hasta 2 solo con el corazón que compensa y el volumen mantenido (anemia extrema, Fig. 12.3)
    $('m-hb').min = e.compensa && e.volemia === 'mantenida' ? 2 : 5;
    $('m-hb').value = e.hb; $('o-hb').innerHTML = `${dec(e.hb, 1)} <small>g/dL</small>`;
    $('m-pao2').value = e.pao2; $('o-pao2').innerHTML = `${e.pao2} <small>mmHg</small>`;
    // con el corazón que compensa (y volumen) o mientras gotea la bolsa, el gasto lo pone el modelo: el mando lo enseña
    const auto = (e.compensa && e.volemia === 'mantenida') || e.gcFijo != null;
    $('m-gc').disabled = auto; $('m-gc').max = e.volemia === 'baja' ? 5 : 8;
    $('m-gc').value = auto ? Math.min(D.gc, 8) : e.gc; $('o-gc').innerHTML = `${dec(auto ? D.gc : e.gc, 1)} <small>L/min</small>`;
    const pr = (el, v) => el.setAttribute('aria-pressed', String(!!v));
    pr($('m-co'), e.co); pr($('m-sedacion'), e.sedacion); pr($('m-esofago'), e.esofago); pr($('m-rcp'), e.rcp); pr($('m-frio'), e.frio);
    pr($('m-fiebre'), e.consumo === 'fiebre'); pr($('m-estres'), e.estres);
    pr($('m-compensa'), e.compensa); pr($('m-volemia'), e.volemia === 'baja');
    pr($('m-tumbar'), e.dil === 'tumbado'); pr($('m-bolo'), e.dil === 'bolo');
    $('m-transf').disabled = goteando || e.hb >= 17;
    enRaiz('[data-cpv-alveolo]').forEach(b => pr(b, e.alveolo === b.dataset.cpvAlveolo));
    enRaiz('[data-cpv-espacio]').forEach(b => pr(b, e.espacio === b.dataset.cpvEspacio));
    for (const [id, k] of [['m-util', 'util'], ['m-toma', 'toma'], ['m-sensor', 'sensor']]) $(id).querySelectorAll('button').forEach(b => pr(b, b.dataset.v === e[k]));
    enRaiz('#cpv-chips-estado [data-cpv-estado]').forEach(b => pr(b, enEstado(e, b.dataset.cpvEstado)));
    // el estado con nombre en el que está el modelo (para «Explícame este estado»)
    if (claveActual && !enEstado(e, claveActual) && !goteando && !Guia.activo) claveActual = null;
    const g = $('guia-abrir'), de = $('guia-de');
    g.disabled = !claveActual || !GUIAS[claveActual];
    de.textContent = claveActual ? `«${ESTADOS[claveActual].n}»` : 'Elige antes un estado';
}
// Mover la Hb, el gasto o el corazón deja atrás la bolsa y el tubo
const soltar = e => { e.gcFijo = null; e.transf = null; e.dil = null; };

/* ============================================================
   Carmen: el tope clínico de «Transfundir 1 CH» (diseno-b, REGLAS §1.14)
   Tope: Hb ≥7 g/dL en el crítico estable sin cardiopatía isquémica = fuera de indicación (merino-transfusion, p. 8, #mh-umbral-7).
   1.ª bolsa: la Hb llega a 8,4 y sale el dato de las guías, sin consejo. 2.ª bolsa: sello TACO, mando apagado, constantes.
   ============================================================ */
const rama = { b1: false, b2: false };   // caso de Carmen: ¿puso la 1.ª bolsa? ¿y la 2.ª?
let carmen = null;    // { bolsas } mientras el modelo es Carmen; null en cualquier otro caso
const CITA_TACO = 'merino-riesgos#mh-taco', CITA_UMBRAL = 'merino-transfusion#mh-umbral-7';
function salirDeCarmen() {
    carmen = null;
    if (tope) { tope.quitar('carmen-umbral'); tope.quitar('carmen-taco'); }
    const n = document.getElementById('cpv-carmen-nota'); if (n) n.hidden = true;
}
function transfundirCarmen() {
    if (carmen.bolsas >= 2) return;
    const n = ++carmen.bolsas;
    // las dos bolsas pasan el tope (Hb ≥7): son las dos «sin indicación»
    transfundir(Math.min(17, estado.hb + HB_POR_CH), { alAcabar: n === 1 ? avisoCarmen : selloCarmen });
}
function avisoCarmen() {
    tope.poner('carmen-umbral', { nivel: 'aviso', titulo: '', texto: `Hb ${dec(estado.hb, 1)} · umbrales de las guías: 7 y 8 g/dL (p. 8)`, cita: CITA_UMBRAL, origen: 'ficha · p. 8' });
}
function selloCarmen() {
    tope.quitar('carmen-umbral');
    aplicar(Object.assign(copia(estado), CARMEN_TACO, { transf: null }), { frase: false });
    claveActual = null;
    decir('La transfusión que no hacía falta le ha llenado el pulmón de agua.', 'ficha · merino-riesgos#mh-taco · p. 15-16 · PaO₂ 55: ilustrativa', true);
    Lupa.abrir('alveolo');
    ponerSelloTaco();
}
// El sello y sus constantes (también los usa el caso de Carmen en su pantalla del sello)
function ponerSelloTaco(sinNombre = false) {
    // en el caso de Carmen el sello no da el diagnóstico hasta que contestas «¿qué le ha pasado?»
    tope.poner('carmen-taco', { nivel: 'sello', titulo: sinNombre ? 'Edema pulmonar' : 'TACO', texto: 'Sin indicación: edema pulmonar en 6 h', cita: sinNombre ? null : CITA_TACO, origen: 'ficha · p. 8 y 15-16', deshabilita: ['#cpv-m-transf'] });
    let n = document.getElementById('cpv-carmen-nota');
    if (!n) { n = document.createElement('div'); n.id = 'cpv-carmen-nota'; n.className = 'cpv-carmen-nota'; $('lamina-caja').after(n); }
    n.hidden = false;
    n.innerHTML = `<p class="cpv-carmen-cts" role="status">${CARMEN_TACO_CONSTANTES.map(([k, v]) => `<b>${k} ${v}</b>`).join(' · ')} <span class="cpv-org cpv-ilu">fisiología general · ilustrativas</span></p>`
        + '<p class="cpv-carmen-honesta">El libro: ≈1 %, más con IC previa (p. 15); la app castiga la bolsa sin indicación (p. 8). En una IC real el gasto caería; el modelo lo deja fijo (ilustrativo).</p>';
    setTimeout(() => verFrase(n, { dock: $('dock'), techo: 8 }), 450);   // tras abrirse la lupa
}
// Abre el modelo como Carmen (lo usa el caso de Carmen; también sirve de punto de entrada para la prueba)
export function ponerCarmen() {
    ponerEnEstado('normal');
    carmen = { bolsas: 0 };
    aplicar(estadoDe(CARMEN), { frase: false });
    decir('Carmen, Hb 7,4 g/dL: el corazón compensa la anemia.', 'ilustrativo', true);
    pestana('sangre');
}

// «Transfundir 1 CH»: la Hb sube en unas «2 h» (2 s en pantalla) con el gasto quieto (Fig. 12.4, decisión del usuario)
let goteando = false, transfusionN = 0;
function transfundir(hasta, op = {}) {
    const e0 = copia(estado), de = e0.hb, gc = gastoDe(e0), a = Math.min(17, hasta);
    if (a <= de) return;
    const n = ++transfusionN;
    const fin = () => { if (n !== transfusionN) return; goteando = false; ponerGoteo(false); aplicar(Object.assign(copia(e0), { hb: a, gcFijo: gc, transf: { de, a }, dil: null }), op); if (op.alAcabar) op.alAcabar(); };
    if (REDUCIR) { fin(); return; }
    goteando = true; ponerGoteo(true);
    const t0 = performance.now(), dur = 2000;
    const paso = ahora => {
        if (n !== transfusionN) return;
        const u = Math.min(1, (ahora - t0) / dur);
        if (u < 1) { aplicar(Object.assign(copia(e0), { hb: +(de + (a - de) * u).toFixed(1), gcFijo: gc, transf: { de, a: null }, dil: null }), op.frase === false ? op : (u === 0 ? op : { frase: false })); requestAnimationFrame(paso); }
        else fin();
    };
    requestAnimationFrame(paso);
}
const pararTransfusion = () => { if (goteando) { transfusionN++; goteando = false; ponerGoteo(false); } };

function engancharDock() {
    enRaiz('.cpv-dock-tabs button').forEach(b => b.addEventListener('click', () => pestana(b.dataset.cpvTab)));
    const suelto = fn => { pararTransfusion(); salirDeCarmen(); cambiar(fn); };
    $('m-hb').addEventListener('input', ev => suelto(e => { soltar(e); e.hb = +ev.target.value; }));
    $('m-pao2').addEventListener('input', ev => cambiar(e => { e.pao2 = +ev.target.value; }));
    $('m-gc').addEventListener('input', ev => suelto(e => { e.gcFijo = null; e.transf = null; e.gc = +ev.target.value; }));
    $('m-co').addEventListener('click', () => cambiar(e => { e.co = !e.co; }));
    $('m-transf').addEventListener('click', () => { if (goteando) return; if (carmen) transfundirCarmen(); else transfundir(Math.min(17, estado.hb + HB_POR_CH)); });
    // el tubo (Fig. 12.1): tumbarse y el bolo cambian el Hto sin cambiar la masa; la Hb del tablero es Hto / 3
    const tubo = (dil, otro) => { suelto(e => { soltar(e); e.dil = estado.dil === dil ? otro : dil; e.hb = hbDeHto(TUBOS[e.dil][1] ?? TUBOS[e.dil][0]); }); if (Lupa.abierta !== 'tubo') Lupa.abrir('tubo'); };
    $('m-tumbar').addEventListener('click', () => tubo('tumbado', 'pie'));
    $('m-bolo').addEventListener('click', () => tubo('bolo', 'antes'));
    enRaiz('[data-cpv-alveolo]').forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.cpvAlveolo;
        if (estado.alveolo === k) { cambiar(e => { e.alveolo = null; }); return; }
        ponerEnEstado(k);
    }));
    enRaiz('[data-cpv-espacio]').forEach(b => b.addEventListener('click', () => cambiar(e => { e.espacio = e.espacio === b.dataset.cpvEspacio ? 'no' : b.dataset.cpvEspacio; })));
    $('m-sedacion').addEventListener('click', () => cambiar(e => { e.sedacion = !e.sedacion; }));
    $('m-esofago').addEventListener('click', () => cambiar(e => { e.esofago = !e.esofago; }));
    $('m-compensa').addEventListener('click', () => suelto(e => { e.gcFijo = null; e.transf = null; e.compensa = !e.compensa; if (!e.compensa && e.hb < 5) e.hb = 5; }));
    $('m-volemia').addEventListener('click', () => suelto(e => { e.gcFijo = null; e.transf = null; e.volemia = e.volemia === 'baja' ? 'mantenida' : 'baja'; if (e.volemia === 'baja') { e.gc = Math.min(e.gc, 5); if (e.hb < 5) e.hb = 5; } }));
    $('m-rcp').addEventListener('click', () => cambiar(e => { e.rcp = !e.rcp; }));
    $('m-frio').addEventListener('click', () => cambiar(e => { e.frio = !e.frio; }));
    $('m-fiebre').addEventListener('click', () => cambiar(e => { e.consumo = e.consumo === 'fiebre' ? 'reposo' : 'fiebre'; }));
    $('m-estres').addEventListener('click', () => cambiar(e => { e.estres = !e.estres; }));
    $('m-util').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) cambiar(e => { e.util = b.dataset.v; }); });
    $('m-toma').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) cambiar(e => { e.toma = b.dataset.v; }); });
    $('m-sensor').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) cambiar(e => { e.sensor = b.dataset.v; }); });
    $('chips-estado').addEventListener('click', ev => { const b = ev.target.closest('[data-cpv-estado]'); if (b) { ponerEnEstado(b.dataset.cpvEstado); requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' })); } });
    enRaiz('[data-cpv-lupa]').forEach(b => b.addEventListener('click', () => {
        if (Lupa.abierta === b.dataset.cpvLupa) { Lupa.cerrar(); return; }
        // la lupa del tubo sin un tubo puesto enseña el de la Fig. 12.1, de pie
        if (b.dataset.cpvLupa === 'tubo' && !estado.dil) suelto(e => { soltar(e); e.dil = 'pie'; e.hb = hbDeHto(TUBOS.pie[0]); });
        Lupa.abrir(b.dataset.cpvLupa);
    }));
    $('lupa-cerrar').addEventListener('click', () => Lupa.cerrar());
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
    // Los enlaces a un estado (en la frase viva y en «Antes y después») y «Explícamelo»
    raiz.addEventListener('click', ev => {
        const ir = ev.target.closest('[data-cpv-ir-estado]');
        if (ir && modo === 'explorar') { ponerEnEstado(ir.dataset.cpvIrEstado); return; }
        const g = ev.target.closest('[data-cpv-guia]');
        if (g && modo === 'explorar') explicar(g.dataset.cpvGuia);
    });
    $('guia-abrir').addEventListener('click', () => { if (claveActual) explicar(claveActual); });
}

/* ============================================================
   La explicación guiada de cada estado (core/explicacion-guiada.js): sus pasos van en el dock, en el sitio de los
   mandos; cada paso pone el modelo como lo cuenta (el estado de la explicación, salvo que el paso diga otro), abre
   su lupa y señala en el dibujo lo que cuenta. «Ver en la ficha» lleva al párrafo exacto (core/citas.js).
   ============================================================ */
let claveActual = null;   // el estado con nombre en el que está el modelo (null si se ha movido un mando)
let guia = null;
const Guia = { get activo() { return !!guia && guia.activo; } };
function crearGuia() {
    guia = crearExplicacion({
        cont: $('dock-guia'), raiz,
        alPaso(paso) {
            const clave = guia.datos.clave, base = ESTADOS[clave];
            const est = typeof paso.estado === 'string' ? (ESTADOS[paso.estado].transfundir ? estadoFinal(paso.estado) : estadoDe(ESTADOS[paso.estado].p))
                : paso.estado ? estadoDe(paso.estado) : (base.transfundir ? estadoFinal(clave) : estadoDe(base.p));
            pararTransfusion();
            aplicar(est, { frase: false });
            const lupa = 'lupa' in paso ? paso.lupa : (typeof paso.estado === 'string' ? ESTADOS[paso.estado].lupa : base.lupa);
            if (lupa) Lupa.abrir(lupa); else if (Lupa.abierta) Lupa.cerrar();
            mirar(paso.mirar || null);
            subirEscena();
        },
        alSalir(d) {
            mirar(null);
            $('dock-explorar').hidden = modo !== 'explorar';
            fraseActual = ''; decir(...fraseDe(null, estado));
            sincronizarMandos();
            if (d && d.clave) requestAnimationFrame(() => $('guia-abrir').focus({ preventScroll: true }));
        },
        citaOpciones: { clase: 'cita', max: 90 },
    });
}
// Sube la escena a la vista (la explicación señala en el dibujo, que tiene que verse con el dock abajo)
function subirEscena() {
    const r = $('escena-bloque').getBoundingClientRect();
    if (Math.abs(r.top) > 4) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function explicar(clave) {
    if (!GUIAS[clave] || modo !== 'explorar') return;
    if (claveActual !== clave) ponerEnEstado(clave);
    claveActual = clave;
    $('dock-explorar').hidden = true;
    guia.abrir({ clave, titulo: ESTADOS[clave].n, pasos: GUIAS[clave], fuentes: ESTADOS[clave].fuentes });
}

/* ============================================================
   Modos: Explorar | Conceptos | Mayéutica
   ============================================================ */
let modo = 'explorar';
// Sube hasta el principio de la herramienta si se ha bajado de ella.
function subir() {
    const r = raiz.getBoundingClientRect();
    if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function setModo(m) {
    if (guia && guia.activo) guia.cerrar();
    pararTransfusion();
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('cpv-estudio', m !== 'explorar');
    raiz.classList.toggle('cpv-mayeutica', m === 'preguntas');   // la entradilla daría respuestas
    // en Conceptos y Mayéutica la lámina se recorta por abajo: el capilar y las mitocondrias, sin el núcleo
    $('lamina').setAttribute('preserveAspectRatio', m === 'explorar' ? 'xMidYMid meet' : 'xMidYMin slice');
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    mirar(null); setOcultos([]); ponerCamas(null);
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    if (m === 'preguntas') Mayeutica.entrar();
    if (m === 'explorar') { fraseActual = ''; decir(...fraseDe(null, estado)); }
    requestAnimationFrame(() => Lupa.colocar());
    if (REDUCIR) pintarUnaVez(); else arrancar();
    subir();
}

/* ============================================================
   «Ver en el texto» y los chips de origen: la pieza común de las citas (core/citas.js). Cada fuente
   (ficha#elemento · #elemento) es un enlace cruzado a su sitio de la ficha, con el nombre que tiene en el texto.
   ============================================================ */
const verEnTexto = fuente => `<p class="cpv-fuente-p">${enlacesFuente(fuente, { clase: 'cpv-ir-texto', claseOrg: 'cpv-org' })}</p>`;
const origenHTML = texto => origenEnlazado(texto, { clase: 'cpv-org-ir', corta: true });
// Los chips de origen escritos en el HTML o en los textos de las preguntas se enlazan al pintarse.
const enlazarOrigenes = cont => enlazarCitas(cont, { selector: 'span.cpv-org', clase: 'cpv-org-ir', corta: true });

/* ============================================================
   Capa de estudio: Conceptos (aquí) y Mayéutica (guía, examen, repaso de lo fallado y casos: el motor común,
   core/mayeutica-motor.js; aquí solo sus enganches con el capilar)
   ============================================================ */
function ponerModelo(q) {
    vistos.clear();
    aplicar(estadoDe(q.estado), { frase: false });
    if (q.lupa) Lupa.abrir(q.lupa); else if (Lupa.abierta) Lupa.cerrar();
    mirar(q.mirar || null);
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || []);
}
const pintarDock = (items, izq, der) => pintarDockComun('cpv', items, izq, der);

/* Mandos de «Compruébalo en el modelo» */
const UNIDAD = { hb: 'g/dL', pao2: 'mmHg', gc: 'L/min' };
const valorMando = k => `${k === 'pao2' ? estado[k] : dec(estado[k], 1)} <small>${UNIDAD[k]}</small>`;
function mandoHTML(t) {
    const partes = [`<p class="cpv-para"><b>Compruébalo en el modelo:</b> ${t.instruccion || ''}</p>`];
    const desl = (k, n, min, max, st) => `<label class="cpv-desliza"><span>${n}</span><input type="range" min="${min}" max="${max}" step="${st}" value="${estado[k]}" data-mando="${k}" aria-label="${n}"><output>${valorMando(k)}</output></label>`;
    for (const m of t.mandos) {
        if (m === 'hb') partes.push(desl('hb', 'Hb', 5, 17, 0.5));
        else if (m === 'pao2') partes.push(desl('pao2', 'PaO₂', 40, 100, 1));
        else if (m === 'gc') partes.push(desl('gc', 'Gasto', 1.5, 8, 0.1));
        else if (m === 'toma') partes.push(`<div class="cpv-seg"><button type="button" data-mando="toma" data-v="svo2" aria-pressed="${estado.toma === 'svo2'}">A. pulmonar · SvO₂</button><button type="button" data-mando="toma" data-v="scvo2" aria-pressed="${estado.toma === 'scvo2'}">Cava sup. · ScvO₂</button></div>`);
        else if (m.startsWith('estado|')) { const [, k, txt] = m.split('|'); partes.push(`<button type="button" class="cpv-b" data-mando="estado" data-v="${k}" aria-pressed="false">${txt}</button>`); }
    }
    return partes.join('');
}
// El mando de la pregunta enseña lo mismo que el modelo (también tras «Te lo pongo en el modelo»)
function sincronizarMandoPregunta(cont, visitar = []) {
    cont.querySelectorAll('#cpv-mando input[data-mando]').forEach(r => {
        const k = r.dataset.mando; r.value = estado[k];
        r.parentElement.querySelector('output').innerHTML = valorMando(k);
    });
    cont.querySelectorAll('#cpv-mando [data-mando="toma"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === estado.toma)));
    cont.querySelectorAll('#cpv-mando [data-mando="estado"]').forEach(b => { if (visitar.includes(b.dataset.v)) b.setAttribute('aria-pressed', 'true'); });
}
function accionMando(m, cont) {
    const tipo = m.dataset.mando;
    if (tipo === 'hb' || tipo === 'pao2' || tipo === 'gc') {
        const v = +m.value; cambiar(e => { e[tipo] = v; }, { frase: false });
        m.parentElement.querySelector('output').innerHTML = valorMando(tipo); return;
    }
    if (tipo === 'toma') { cambiar(e => { e.toma = m.dataset.v; }, { frase: false }); cont.querySelectorAll('[data-mando="toma"]').forEach(b => b.setAttribute('aria-pressed', String(b === m))); return; }
    if (tipo === 'estado') {
        const s = ESTADOS[m.dataset.v];
        aplicar(estadoDe(Object.assign({}, s.p, { toma: estado.toma })), { frase: false });
        if (s.lupa) Lupa.abrir(s.lupa);
        m.setAttribute('aria-pressed', 'true');
    }
}

/* ---------- Conceptos ---------- */
const Estudio = {
    c: 0,
    concepto(i) {
        this.c = clamp(i, 0, CONCEPTOS.length - 1);
        const k = CONCEPTOS[this.c], cont = $('concepto');
        vistos.clear();
        aplicar(estadoDe(k.estado), { frase: false });
        if (k.lupa) Lupa.abrir(k.lupa); else if (Lupa.abierta) Lupa.cerrar();
        mirar(k.mirar || null);
        cont.innerHTML = `<div class="cpv-cab-preg"><span class="cpv-concepto-n">${this.c + 1}</span><h3>${k.titulo}</h3></div>
            <p class="cpv-pregunta">${k.texto}</p>
            <div class="cpv-mando"><p class="cpv-para"><b>Tócalo:</b> ${k.hacer}</p><div class="cpv-fila">${k.acciones.map((a, j) => `<button class="cpv-b" type="button" data-acc="${j}">${a.t}</button>`).join('')}</div></div>
            <p class="cpv-para"><b>Mira:</b> ${k.mira}</p>
            ${verEnTexto(k.fuente)}
            <div class="cpv-nav-c"><button class="cpv-b" type="button" data-nav="-1" ${this.c === 0 ? 'disabled' : ''}>← Anterior</button><button class="cpv-b cpv-prim" type="button" data-nav="1">${this.c === CONCEPTOS.length - 1 ? 'A la Mayéutica →' : 'Siguiente →'}</button></div>`;
        entrar(cont, 'cpv');
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]');
            if (a) {
                const ac = CONCEPTOS[this.c].acciones[+a.dataset.acc];
                pararTransfusion();
                // `estado`: un estado con nombre (con su lupa; la transfusión, con la bolsa ya puesta); `p`: un estado parcial
                const s = ac.estado && ESTADOS[ac.estado];
                aplicar(s ? (s.transfundir ? estadoFinal(ac.estado) : estadoDe(s.p)) : estadoDe(ac.p), { frase: false });
                const lupa = ac.lupa || (s && s.lupa);
                if (lupa) Lupa.abrir(lupa); else if (Lupa.abierta) Lupa.cerrar();
                mirar(ac.mirar || k.mirar || null); return;
            }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); subir(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve el modelo');
    },
};

/* ---------- Mayéutica: el motor común con los enganches del capilar ---------- */
// Aciertos y fallos en localStorage con su clave de siempre (como el quiz: solo en este dispositivo).
const Mayeutica = crearMayeuticaModelo({
    p: 'cpv', cont: () => $('preg'), clave: 'capilar-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { aplicar(estadoBase(), { frase: false }); if (Lupa.abierta) Lupa.cerrar(); },
    volverPor: 'Capilar y oxígeno',
    pregunta: {
        alEmpezar: q => { salirDeCarmen(); ponerCamas(q.camas); ponerModelo(q); if (q.carmen === 'taco') ponerSelloTaco(!!q.sinNombre); },
        // Al elegir una opción con consecuencia, el modelo pasa a su estado; en el caso de Carmen se recuerda la rama
        alConsecuencia: (c, q) => { if (q.id === 'cm-1') rama.b1 = true; if (q.id === 'cm-2') rama.b2 = true; ponerModelo({ ...q, estado: c.estado, lupa: c.lupa, mirar: c.mirar || q.mirar }); },
        antes: q => (typeof q.antes === 'function' ? q.antes() : ''),
        alPintar: () => pintarCamas(),
        enlazar: enlazarOrigenes,
        verEnTexto: q => verEnTexto(q.fuente),
        alCerrar: q => { if (q.carmen === 'taco' && q.sinNombre) ponerSelloTaco(); if (q.despues) { aplicar(estadoDe(q.despues), { frase: false }); if (q.lupaDespues) Lupa.abrir(q.lupaDespues); } setOcultos([]); },
        alSalir: () => { salirDeCarmen(); mirar(null); setOcultos([]); ponerCamas(null); },
        // Las camas del caso: «Ver cama 1 / cama 2» pone el modelo en cada una
        alClic: (e, q) => {
            const ens = e.target.closest('[data-cm-paso]');
            if (ens) { const p = ENSENANZA[+ens.dataset.cmPaso]; ponerModelo({ estado: p.estado, lupa: p.lupa, mirar: p.mirar }); return true; }
            const cm = e.target.closest('[data-cama]'); if (!cm) return false; aplicar(estadoDe(q.camas[+cm.dataset.cama].e), { frase: false }); return true; },
        tocar: {
            mandoHTML,
            alMostrar: q => mirar(q.tocar.mirar || q.mirar || null),
            comprobar: q => q.tocar.comprobar(estado, vistos),
            confirma: q => typeof q.tocar.confirma === 'function' ? q.tocar.confirma(D.R) : (q.tocar.confirma || 'míralo en el modelo.'),
            ponerBueno: (q, cont) => {
                aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), { frase: false });
                for (const k of q.tocar.visitar || []) vistos.add(k);
                sincronizarMandoPregunta(cont, q.tocar.visitar);
            },
            alComprobar: () => setOcultos([]),
            accion: accionMando,
        },
    },
    textos: {
        ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): preguntas encadenadas que te llevan de la mano, de la Hb al consumo; varias se predicen y se comprueban en el modelo.</span>
            <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de la propia ficha.</span>
            <span><b>3.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>4.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span>`,
        empezar: 'Empezar la guía socrática', seguir: 'Seguir',
        pie: 'El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde.',
        conModelo: 'el modelo',
        casos: 'El modelo se mueve al estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
        abrirPaciente: 'Abrir el modelo en el estado del paciente',
    },
    preguntaDePaso: (paso, C) => (paso.pregunta.id === 'cm-1' && (rama.b1 = rama.b2 = false), { carmen: paso.carmen, sinNombre: paso.sinNombre, antes: paso.antes, estado: rama.b1 && paso.estadoB1 ? paso.estadoB1 : paso.estado, lupa: paso.lupa, mirar: paso.mirar, ocultar: paso.ocultar || paso.pregunta.ocultar, camas: paso.camas || C.camas }),
    // Si el paso compara camas, sus botones van bajo la ficha del paciente
    cabeceraPaso: (paso, C) => {
        const camas = paso.camas || C.camas, ramaHtml = paso.cab ? paso.cab(rama) : '';
        return ramaHtml + (camas ? `<div class="cpv-camas"><div class="cpv-seg" role="group" aria-label="Qué cama ves en el modelo">${camas.map((c, i) => `<button type="button" data-cama="${i}" aria-pressed="false">Ver ${c.n}</button>`).join('')}</div><div id="cpv-camas-tabla"></div></div>` : '');
    },
    // «Lo que te llevas» se pinta justo después: sus «Ver en la ficha» se rellenan en cuanto está en la página
    alTerminarCaso: () => queueMicrotask(() => $('preg').querySelectorAll('[data-cpv-fuente]').forEach(sp => { sp.innerHTML = enlacesFuente(sp.dataset.cpvFuente, { clase: 'cpv-ir-texto', claseOrg: 'cpv-org', prefijo: 'Ver en la ficha: ' }); })),
    abrirPaciente: C => { setModo('explorar'); ponerEnEstado(C.volver.estado); },
});

/* ============================================================
   Abrir en un estado (los chips, los botones de las fichas, los menús y el buscador)
   ============================================================ */
function ponerEnEstado(clave) {
    const k = ESTADOS[clave] ? clave : 'normal', s = ESTADOS[k];
    medir();
    pararTransfusion(); salirDeCarmen();
    aplicar(estadoBase(), { frase: false });
    fraseActual = '';
    claveActual = k;
    // la transfusión: la bolsa gotea desde la Hb de partida hasta la de llegada (con «reducir movimiento», ya puesta)
    aplicar(estadoDe(s.p), s.transfundir ? { frase: false } : {});
    if (s.transfundir) transfundir(s.transfundir);
    if (!Object.keys(s.p).length) decir(...fraseDe(null, estado));
    pestana(s.pestana || 'sangre');
    if (s.lupa) Lupa.abrir(s.lupa); else if (Lupa.abierta) Lupa.cerrar();
    sincronizarMandos();
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú): se abre como estaba.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('cpv-volver'), raiz, origen);
    if (!clave) { requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' })); return; }
    if (guia && guia.activo) guia.cerrar();
    if (modo !== 'explorar') setModo('explorar');
    ponerEnEstado(clave === 'inicio' ? 'normal' : clave);
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
function leyendas() {
    $('leyenda-mini').innerHTML = [
        `${iconoHematie(['', '', '', ''], 13)}hematíe: 4 perlas = 4 sitios del hemo`,
        `${iconoHematie(['', 'vacia', '', 'vacia'], 13, '--accent-purple')}anillo: sitio sin O₂ (venoso)`,
        `${iconoParticula('o2', 13)}O₂`, `${iconoParticula('co2', 13)}CO₂`, `${iconoParticula('lact', 13)}lactato`,
    ].map(t => `<li>${t}</li>`).join('');
    $('leyenda').innerHTML = [
        [iconoHematie(['', '', '', ''], 20), 'Hematíe arterial (el disco de la tabla) con sus <b>4 perlas</b>, los 4 sitios del hemo: <b>bolitas llenas</b> = O₂ unido. Con SaO₂ 98 % casi todas.'],
        [iconoHematie(['', 'vacia', '', 'vacia'], 20, '--accent-purple'), 'Hematíe venoso: las perlas que soltaron su O₂ quedan como <b>anillos huecos</b>. Con SvO₂ 73 %, una de cada cuatro; la sangre venosa se reconoce por la forma, no solo por el color (ciruela).'],
        [iconoHematie(['co', '', 'co', ''], 20), 'Perla gris tachada: sitio ocupado por CO. El pulsioxímetro la cuenta como llena.'],
        [iconoParticula('o2', 20), 'O₂: <b>pesa</b>, dos átomos unidos (O=O). Forma nueva de la tabla, pendiente de que la confirmes.'],
        [iconoParticula('lact', 20), 'Lactato: <b>trípode</b>, medio copo: una glucosa (copo) da dos lactatos. Forma nueva de la tabla, pendiente de que la confirmes.'],
        [iconoParticula('glu', 20), 'Glucosa: copo. Sale en la lupa de la mitocondria.'],
        [iconoParticula('co2', 20), 'CO₂: voluta, como en el ácido-base vivo.'],
        [iconoParticula('neutrofilo', 20), 'Neutrófilo (lupa del alvéolo): célula clara con el núcleo en <b>tres lóbulos</b>.'],
        [iconoParticula('igg', 20), 'Anticuerpo (lupa del alvéolo): la <b>Y</b> de la IgG, la misma de la TIH. En el TRALI viene en la bolsa, del donante; el libro no dice de qué clase es.'],
        [iconoParticula('agua', 20), 'Agua (lupa del alvéolo): <b>gota</b>. En el TACO cruza al alvéolo por presión.'],
    ].map(([i, t]) => `<li>${i}<span>${t}</span></li>`).join('');
    const chip = k => { const s = ESTADOS[k]; return `<button type="button" class="cpv-chip-f" data-cpv-estado="${k}" aria-pressed="false">${s.n}${s.s ? `<small>${s.s}</small>` : ''}</button>`; };
    $('chips-estado').innerHTML = GRUPOS_CHIPS.map(([g, t]) => `<div class="cpv-grupo-chips"><h4>${t}</h4><div class="cpv-chips-estado">${ESTADOS_CHIPS.filter(k => ESTADOS[k].grupo === g).map(chip).join('')}</div></div>`).join('');
}
export function init() {
    raiz = document.getElementById('cpv-raiz');
    if (!raiz) return null;
    initEscena();
    tope = crearTope({ monitor: $('lamina-caja'), dock: $('dock'), cita: c => enlacesFuente(c, { clase: 'cpv-ir-texto', claseOrg: 'cpv-org', prefijo: 'Ver en la ficha: ' }) });
    leyendas(); engancharDock(); crearGuia();
    enlazarOrigenes(raiz);
    enRaiz('[data-cpv-fuente]').forEach(sp => { sp.innerHTML = enlacesFuente(sp.dataset.cpvFuente, { clase: 'cpv-ir-texto', claseOrg: 'cpv-org' }); });
    Mayeutica.cargar();
    aplicar(estadoBase(), { frase: false }); decir(...fraseDe(null, estado));

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--cpv-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    // La vista se ve o deja de verse (todas las vistas están en el DOM): medir al aparecer.
    let anchoVisible = 0, motionPedido = false;
    const caja = $('lamina-caja');
    new ResizeObserver(() => {
        const a = Math.round(caja.clientWidth);
        document.body.classList.toggle('cpv-activo', a > 0);
        if (!a) { anchoVisible = 0; return; }
        if (!anchoVisible) { const v = document.getElementById('capilar-vivo-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, la lupa abre sin muelle */ }); }
        medir(); Lupa.colocar();
        if (REDUCIR) pintarUnaVez(); else arrancar();
    }).observe(caja);
    new IntersectionObserver(es => ponerVisible(es[es.length - 1].isIntersecting)).observe($('escena'));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado frente a cobertura §6.1 y el estado del bucle.
    window.__cpvPonerCarmen = ponerCarmen;
    window.__cpvPruebas = () => {
        const r = pruebasCapilar();
        const celdas = Object.fromEntries(CELDAS.map(c => [c.k, $('c-' + c.k).querySelector('b').textContent]));
        return { ...r, bucle: estadoBucle(), modo, fase: Mayeutica.fase, estado: copia(estado), R: derivar(estado).R, ocultos: [...ocultos],
            lupa: Lupa.abierta, celdas, guardado: Mayeutica.prog.g.leer(), vaciarFotogramas, hematie: hematieSVG().length > 0,
            clave: claveActual, goteando, guia: guia && guia.activo ? { clave: guia.datos.clave, paso: guia.paso, n: guia.datos.pasos.length } : null,
            // cada cita de las explicaciones: ¿su párrafo está en la app?
            citas: Object.entries(GUIAS).flatMap(([k, ps]) => ps.flatMap(pa => [].concat(pa.cita || []).map(c => ({ estado: k, ficha: c.ficha, id: c.id, exacta: citaExacta(c), ficha_existe: !!document.getElementById(c.ficha) })))) };
    };

    return { abrir: abrirEstado };
}
