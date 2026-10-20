// Catéter vivo: flujo, piel y biopelícula (Libros → Marino → Fundamentos, grupo accesos vasculares, caps. 1-3).
// Interfaz del modelo vivo: frase viva, dock de 4 pestañas (catéter, empujar, tiempo, problema) más la de la lupa
// abierta, lupas B, C y D, tira de láminas del libro con su visor, interruptor Explorar | Conceptos | Mayéutica y la
// capa de estudio (guía socrática y examen, repaso de lo fallado y 3 casos clínicos). Mismo patrón que el río y mar
// (agua-viva.js) y el capilar (capilar-vivo.js). La escena vive en cateter-vivo-escena.js; los datos, en
// js/data/cateter-vivo-data.js. Viene de la maqueta aprobada autonomo/maquetas/b1-cateter-vivo.html (vuelta 2).
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="cateterVivo" data-cateter-vivo="calibre">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica es el motor común (core/mayeutica-motor.js): guarda aciertos y fallos en
// localStorage (como el quiz), con su clave propia y siempre dentro de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { crearMayeuticaModelo, entrar, pintarDock as pintarDockComun } from '../../core/mayeutica-motor.js';
import { enlacesFuente, origenEnlazado, enlazarOrigenes as enlazarCitas } from '../../core/citas.js';
import { iconoParticula } from '../../core/particulas.js';
import {
    CAT, ORDEN_CAT, OCLUSIONES, INSTILAR, ORDEN_PUNTA, FIGS, TIRA, ESTADOS, FICHAS_ESTADO, NOMBRE_ESTADO,
    CONCEPTOS, PREGUNTAS, CASOS, PROFUNDIZAR, PDF, estadoBase, estadoDe, derivar, resuelta, copia, clamp, dec,
    pruebasCateter,
} from '../../data/cateter-vivo-data.js';
import {
    $, estado, D, REDUCIR, Anim, PUNTA_XY, ocultos, aplicarModelo, setOcultos, anillo, initEscena, medir, arrancar,
    pintarUnaVez, ponerVisible, estadoBucle, vaciarFotogramas,
} from './cateter-vivo-escena.js';

let raiz = null;
const enRaiz = sel => raiz.querySelectorAll(sel);
const IMG = 'js/modules/libros/img/';

/* ============================================================
   Frase viva (con su origen) y aplicar un estado
   ============================================================ */
let fraseActual = '';
function decir(html, fuente) {
    const fraseEl = $('frase');
    const ilu = /ilustrativo|sin cifra/.test(fuente || '');
    const nuevo = `<span class="ctv-frase-txt">${html} ${fuente ? `<span class="ctv-org${ilu ? ' ctv-ilu' : ''}">${origenHTML(fuente)}</span>` : ''}</span>`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('lamina').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
}
function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo, op);
    sincronizarMandos(); pintarMandosLupa(); pintarTira();
    if (op.frase !== false && modo === 'explorar') { const [h, f] = fraseDe(viejo, nuevo) || FRASE_INICIO(); if (h) decir(h, f); }
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

/* ---------- La frase viva ---------- */
function fraseCat(e) {
    const c = CAT[e.cat], fu = `ficha · ${c.tabla}`;
    const alt = e.altura === 68 ? ` A 68 cm (50 mmHg), calculado: × 50/75 = <span class="hl">${D.texto} L/h</span>.` : e.altura === 0 ? ' Con la bolsa a 0 cm, sin gradiente: sin flujo.' : '';
    const txt = {
        pc: 'Periférico corto de 18 G y 3 cm: <span class="hl">6,0 L/h</span> por gravedad. Supera de largo a una bomba volumétrica (1 L/h).',
        pl: 'Periférico largo de 8 cm: <span class="hl">3,7 L/h</span>. Dura más: unos 7-9 días.',
        midline: 'Midline de 15 cm: <span class="hl">1,3 L/h por luz</span>, un 20 % del periférico corto; aun así, más que una bomba volumétrica.',
        'picc-d': 'PICC de 50 cm: <span class="hl-rojo">0,26 L/h</span>; el midline, 1,3. <span class="hl-rojo">La longitud le cuesta el 80 %</span>, y ese flujo pobre podría explicar sus oclusiones.',
        'picc-p': 'PICC, luz proximal: <span class="hl-rojo">0,27 L/h</span>. Mide más del triple que el midline y da un 20 % de su flujo.',
        'cvc-d': 'CVC triple luz, luz distal (16 G): <span class="hl">2,28 L/h</span>, más del doble que las de 18 G. Es la luz para el volumen rápido.',
        'cvc-m': 'CVC, luz medial (18 G): <span class="hl-rojo">0,91 L/h</span>, menos de la mitad que la distal.',
        'cvc-p': 'CVC, luz proximal (18 G): <span class="hl-rojo">0,99 L/h</span>, menos de la mitad que la distal.',
        rapido: 'Catéter de infusión rápida (7-8 Fr, 2-2,5″): el que pide el infusor rápido. Por gravedad, la ficha no da su flujo.'
    }[e.cat];
    return [txt + (c.lh != null ? alt : ''), fu + (e.altura !== 100 && c.lh != null ? ' · mar-poiseuille' : '')];
}
function fraseFig(e) {
    if (e.figExp === 'calibre') return [{
        16: '16 G: <span class="hl">220 mL/min</span>. Más del doble que el 18 G (105) y <span class="hl">casi cuatro veces</span> el 20 G (60), con menos de 1 mm de diferencia.',
        18: '18 G: <span class="hl">105 mL/min</span>. El 16 G, de la misma longitud, pasa más del doble (220).',
        20: '20 G: <span class="hl-rojo">60 mL/min</span>, casi cuatro veces menos que el 16 G (220). El radio pesa a la cuarta potencia.'
    }[e.figCal], 'ficha · mar-fig-1-1-calibre (Fig. 1.1) · mar-poiseuille'];
    return [{
        2: '16 G de 2 pulgadas (lo habitual en un periférico): <span class="hl">151 mL/min</span>.',
        6: 'De 2 a 6 pulgadas (de periférico a CVC): <span class="hl-rojo">−40 %</span>, de 151 a 91 mL/min.',
        12: 'A 12 pulgadas, <span class="hl-rojo">otro −40 %</span>: 54 mL/min. Para correr: corto y grueso.'
    }[e.figLong], 'ficha · mar-fig-1-1-longitud (Fig. 1.1) · mar-corto-grueso'];
}
const FRASE_INICIO = () => ['La velocidad la marca el catéter: elige calibre y longitud, cambia la vena, sube la bolsa. Las lupas enseñan la piel, la punta y el eco.', 'ficha · mar-flujo-cateter'];
function fraseDe(v, n) {
    if (v.lupa !== n.lupa) return {
        A: FRASE_INICIO(),
        B: ['Lupa B: las cuatro vías del germen (Fig. 3.2). En los catéteres percutáneos no tunelizados, la principal es <span class="hl-rojo">la piel, por el trayecto</span>.', 'ficha · mar-bac-vias'],
        C: ['Lupa C: la punta va en la cava superior, <span class="hl">1-2 cm por encima de la aurícula</span>, a la altura de la carina. Arrástrala.', 'ficha · mar-punta-objetivo · mar-punta-rx'],
        D: ['Lupa D: ¿vena o arteria? Comprime y enciende el Doppler. Esquema 2D, no el ecógrafo.', 'ficha · mar-eco-cual · mar-eco-aguja']
    }[n.lupa];
    if (n.oclusion !== v.oclusion) {
        if (!n.oclusion) return ['Sin oclusión: el catéter vuelve a pasar.', ''];
        const t0 = { trombo: 'Un <span class="hl-rojo">trombo</span> (el 60 %)', alcalino: 'Un precipitado de un fármaco alcalino (aciclovir, ampicilina, diazepam, ganciclovir, heparina, imipenem, fenitoína)', acido: 'Un precipitado de un fármaco ácido (gluconato cálcico, ceftriaxona, NPT, vancomicina)', mineral: 'Un precipitado mineral: NPT rica en Ca²⁺ y PO₄', lipidos: 'Residuos de lípidos o proteínas (NPT, propofol)' }[n.oclusion];
        return [`${t0}: flujo lento o nulo, ${n.bomba !== 'gravedad' ? 'la bomba alarma por presión' : 'alarmas de la bomba si la hubiera'} y cuesta aspirar.`, 'ficha · mar-oclusion-causas · mar-tabla-3-3'];
    }
    if (n.instilado !== v.instilado && n.instilado) {
        if (n.instilado === 'guia') return ['<span class="hl-rojo">No se aconseja pasar una guía</span>: puede soltar la masa y embolizarla.', 'ficha · mar-permeabilidad'];
        if (!n.oclusion) return ['No hay nada que disolver.', ''];
        if (resuelta(n)) return n.instilado === 'alteplasa'
            ? ['Alteplasa 2 mg (2 mL): esperar 30 min; si no, otros 90 (120 en total). Recupera el <span class="hl">80-90 %</span>. Si vuelve, extraer 5 mL.', 'ficha · mar-alteplasa']
            : ['Disuelto. La regla: <span class="hl">lo alcalino con un álcali, lo ácido con un ácido y los lípidos con etanol</span>. Instilar, dejar actuar y lavar con 10-20 mL de salino.', 'ficha · mar-tabla-3-3'];
        return ['No lo disuelve. Si la alteplasa no basta, piensa <span class="hl">qué pasaba por esa luz</span> (Tabla 3.3).', 'ficha · mar-alteplasa · mar-tabla-3-3'];
    }
    if (n.io !== v.io) return n.io ? ['La médula <span class="hl">no se colapsa</span> en el shock, pero da un <span class="hl-rojo">25 % de una periférica</span> y empuja con unos 30 mmHg: se presuriza de rutina.', 'ficha · mar-io-flujo · mar-io-indicaciones'] : FRASE_INICIO();
    if (n.banco !== v.banco) return ['<span class="hl">Dos experimentos distintos</span>: la Fig. 1.1 en mL/min y las Tablas 1.2-1.3 en L/h. No se mezclan sus cifras.', 'ficha · mar-fig-1-1-calibre · mar-tabla-1-2'];
    if (n.banco === 'fig' && (n.figExp !== v.figExp || n.figCal !== v.figCal || n.figLong !== v.figLong)) return fraseFig(n);
    if (n.cat !== v.cat && n.banco === 'tablas') return fraseCat(n);
    if (n.vena !== v.vena) return ['Has cambiado la vena y <span class="hl">el flujo no se ha movido</span>: lo marca el catéter, no la vena.', 'ficha · mar-flujo-cateter'];
    if (n.altura !== v.altura) {
        if (n.altura === 0) return ['Bolsa a la altura del brazo: <span class="hl-rojo">sin gradiente, sin flujo</span>.', 'ficha · mar-poiseuille'];
        if (n.altura === 68) return [`A 68 cm la presión es <span class="hl">50 mmHg</span>: el flujo cae a dos tercios del de la tabla (calculado: ${D.texto} L/h).`, 'ficha · mar-altura-bolsa · mar-poiseuille · calculado'];
        return ['A 100 cm, <span class="hl">75 mmHg</span>: la cifra de la tabla (medida desde 40 pulgadas).', 'ficha · mar-altura-bolsa · mar-tabla-1-2'];
    }
    if (n.bomba !== v.bomba) {
        if (n.bomba === 'volumetrica') return [`La volumétrica no pasa de <span class="hl-rojo">1.000 mL/h</span>; por gravedad, este catéter da ${n.banco === 'fig' ? `${D.grav.texto} mL/min (Fig. 1.1)` : n.io ? 'un 25 % de una periférica' : D.grav.valor != null ? `${D.grav.texto} L/h` : 'una cifra que la ficha no da'}. Sirve para dosificar, no para correr.`, 'ficha · mar-bombas'];
        if (n.bomba === 'jeringa') return ['Jeringa: hasta 100 mL, a 0,1-100 mL/h; populares para la analgesia controlada por el paciente.', 'ficha · mar-bombas'];
        if (n.bomba === 'infusor') return D.cat.rapido ? ['Infusor rápido: <span class="hl">hasta 1,5 L/min</span> de fluidos o hemoderivados calientes, con su catéter de 7-8 Fr y 2-2,5″.', 'ficha · mar-bombas'] : [`<span class="hl-rojo">${D.avisos[0]}</span>`, 'ficha · mar-bombas'];
        return ['Por gravedad: manda la altura de la bolsa.', 'ficha · mar-altura-bolsa'];
    }
    if (n.tiempo !== v.tiempo) return n.tiempo >= 168 ? [`Día ${Math.round(n.tiempo / 24)}: la biopelícula sigue creciendo. El ritmo que ves es ilustrativo.`, 'ficha · mar-biofilm · ritmo ilustrativo'] : {
        0: ['Catéter recién puesto: aún nada pegado.', 'ilustrativo'],
        24: ['A las 24 h <span class="hl">ya hay biopelícula</span> al microscopio electrónico; la clínica no aparece antes de 48 h.', 'ficha · mar-biofilm · mar-bac-clinica'],
        48: ['Desde las 48 h puede haber clínica, pero es inespecífica: la fiebre y la leucocitosis son inflamación, no prueba de infección.', 'ficha · mar-bac-clinica'],
        168: ['Día 7: la biopelícula sigue creciendo. El ritmo que ves es ilustrativo.', 'ficha · mar-biofilm · ritmo ilustrativo'],
        336: ['Día 14: más biopelícula. El ritmo que ves es ilustrativo.', 'ficha · mar-biofilm · ritmo ilustrativo']
    }[n.tiempo];
    for (const k of Object.keys(n.paquete)) if (n.paquete[k] !== v.paquete[k]) {
        const txt = { manos: 'Higiene de manos: una de las medidas más importantes y más olvidadas, antes y después de tocar el punto.', barreras: 'Barreras máximas: gorro, mascarilla, guantes estériles, bata estéril y paño estéril de cuerpo entero.', clorhex: 'Clorhexidina al 2 % en alcohol al 70 %: frotar 30 s y dejar secar (hasta 2 min en piel húmeda); dura ≥6 h.', femoral: 'Evitar la femoral: hoy, sobre todo por la trombosis. El riesgo de infección depende de cómo se cuida el punto, no del sitio: no cierra ninguna puerta de la piel.' }[k];
        if (k === 'femoral') return [txt, 'ficha · mar-tabla-2-1 · mar-sitio-femoral · mar-femoral-segura'];
        return [(n.paquete[k] ? 'Cierras una puerta. ' : 'Abres una puerta. ') + txt, `ficha · mar-tabla-2-1 · ${{ manos: 'mar-higiene-manos', barreras: 'mar-barreras', clorhex: 'mar-clorhexidina', femoral: 'mar-sitio-femoral' }[k]} · cuántas puertas: ilustrativo`];
    }
    if (n.aposito !== v.aposito) return {
        transparente: ['Transparente: deja ver el punto y lo sella. Cambiarlo al menos cada 7 días.', 'ficha · mar-tabla-3-1'],
        gasa: ['Gasa: mejor si la piel no se mantiene seca. Cambiarla al menos cada 48 h. Igual de eficaz que el transparente.', 'ficha · mar-tabla-3-1'],
        esponja: ['Esponja de clorhexidina: la que mejor protege; hoy, solo donde la infección por catéter es un problema.', 'ficha · mar-cateter-cuidados'],
        humedo: ['Con humedad o sangre debajo, <span class="hl-rojo">el oclusivo favorece la colonización</span>: cámbialo.', 'ficha · mar-aposito-paradoja']
    }[n.aposito];
    if (n.antibiotico !== v.antibiotico) return n.antibiotico ? ['Mata a las libres; para las de la biopelícula haría falta <span class="hl-rojo">de 100 a 1.000 veces más</span>: una dosis tóxica.', 'ficha · mar-biofilm'] : ['Sin antibiótico.', ''];
    if (n.manejo !== v.manejo) return {
        dejar: ['Dejarlo mientras llegan los cultivos: de 1.527 retirados por sospecha, <span class="hl">solo 169 (11 %)</span> lo estaban. Si se confirma y se deja, <span class="hl-rojo">el antibiótico apenas lo descontamina</span> (biopelícula): son de esperar recurrencias.', 'ficha · mar-bac-no-retirar · mar-bac-guia'],
        retirar: ['Retirar y poner otro <span class="hl">en un sitio nuevo</span>: la biopelícula se va con el catéter.', 'ficha · mar-bac-guia'],
        guia: ['<span class="hl-rojo">No sobre guía</span>: retirar y poner otro en un sitio nuevo. Sobre guía puede ser la mejor opción si el acceso venoso es muy limitado; también tiene complicaciones. El libro no da el porqué: el dibujo no lo inventa.', 'ficha · mar-bac-guia'],
        null: ['', '']
    }[n.manejo];
    if (n.zoomB !== v.zoomB) return {
        vias: ['Las cuatro vías de la Fig. 3.2, con sus números.', 'ficha · mar-bac-vias'],
        punta: ['La punta, de cerca: los cocos se pegan con adhesinas y se envuelven en su matriz.', 'ficha · mar-biofilm'],
        micro: ['Así es de verdad: <i>S. epidermidis</i> en su biopelícula (Fig. 3.3).', 'ficha · mar-biofilm (Fig. 3.3)'],
        frascos: ['Dos frascos a la vez: del catéter y periférico. Incúbalos.', 'ficha · mar-tabla-3-4']
    }[n.zoomB];
    if (n.hcIncubado !== v.hcIncubado && n.hcIncubado) return ['El mismo germen en los dos; el del catéter crece <span class="hl">2,5 h antes</span>: el catéter es la fuente (≥2 h, 91 %).', 'ficha · mar-tabla-3-4 · horas ilustrativas · 2,5 h del caso'];
    if (n.izquierdo !== v.izquierdo) return n.izquierdo ? ['Un catéter izquierdo que no gira hacia abajo <span class="hl-rojo">apoya en la pared de la cava</span> y puede erosionarla: la pista es un mediastino ancho y un derrame nuevo.', 'ficha · mar-perforacion-vcs (Fig. 3.1)'] : ['Catéter derecho otra vez.', ''];
    if (n.punta !== v.punta) return {
        yugular: ['<span class="hl-rojo">Malposición</span>: ha subido a la yugular. Con un subclavio, mira las dos yugulares con eco. Las malposiciones, de cualquier tipo, son el 15-18 %, sobre todo con la subclavia.', 'ficha · mar-punta-eco · mar-punta-objetivo'],
        'vcs-alta': ['En la cava, algo por encima de la carina: <span class="hl">sigue siendo aceptable</span>. El objetivo, 1-2 cm por encima de la aurícula.', 'ficha · mar-punta-rx · mar-punta-objetivo'],
        carina: ['<span class="hl">Bien</span>: a la altura de la carina, que queda justo encima de la unión cava-aurícula.', 'ficha · mar-punta-rx (Fig. 2.6)'],
        auricula: ['En la aurícula: en 2.348 pacientes así, <span class="hl">ninguna perforación</span> ni arritmia relevante. Se está dejando de recolocar.', 'ficha · mar-punta-auricula']
    }[n.punta];
    if (n.aire.postura !== v.aire.postura || n.aire.abierto !== v.aire.abierto) {
        if (!n.aire.abierto) return [{ espontanea: 'Respira solo, semiincorporado: la presión intratorácica es negativa.', trendelenburg: 'Trendelenburg: sube la presión venosa.', femoral: 'Catéter femoral: no entra en el tórax.' }[n.aire.postura], 'ficha · mar-aire-fisio · mar-aire-prevencion'];
        if (n.aire.postura === 'espontanea') return ['Con 5 mmHg, por un 14 G entran <span class="hl-rojo">100 mL de aire por segundo</span>; 200-300 mL en pocos segundos matan.', 'ficha · mar-aire-fisio'];
        return n.aire.postura === 'trendelenburg' ? ['Trendelenburg: sube la presión venosa y <span class="hl">reduce el riesgo</span> de embolia aérea. No lo anula: el conector se cierra igual. Cuánto entra, el libro no lo dice (burbujas lentas: ilustrativo). No hace falta, y no se tolera, con congestión venosa; no se aconseja con hipertensión intracraneal.', 'ficha · mar-aire-prevencion · mar-yugular · ritmo ilustrativo'] : ['Femoral: el catéter no entra en el tórax ni sufre presión negativa: <span class="hl">el libro no lo considera un riesgo</span> (el contador a 0 es del modelo).', 'ficha · mar-aire-prevencion'];
    }
    const E0 = v.eco, E1 = n.eco;
    if (E1.eje !== E0.eje) return E1.eje === 'largo' ? ['Eje largo: se ven la aguja, la guía y el catéter enteros, pero <span class="hl-rojo">no la arteria vecina</span>.', 'ficha · mar-eco-ejes'] : ['Eje corto: localizas la vena y ves la arteria vecina; la aguja es solo un punto brillante.', 'ficha · mar-eco-ejes'];
    if (E1.comprimir !== E0.comprimir || E1.trombosada !== E0.trombosada) return E1.comprimir ? (E1.trombosada ? ['<span class="hl-rojo">Una vena trombosada no se comprime</span>.', 'ficha · mar-eco-intraosea (Compresibilidad)'] : ['Al apretar, <span class="hl">la vena se colapsa mucho antes que la arteria</span> (Fig. 1.7).', 'ficha · mar-eco-intraosea (Compresibilidad)']) : ['Sin comprimir.', ''];
    if (E1.girada !== E0.girada) return ['Has girado la sonda: <span class="hl-rojo">los colores se intercambian</span>. El color es la dirección respecto a la sonda; el rojo no es la arteria.', 'ficha · mar-eco-intraosea (Doppler color, Fig. 1.8)'];
    if (E1.doppler !== E0.doppler) return E1.doppler ? ['El Doppler color pinta la <span class="hl">dirección del flujo respecto a la sonda</span>, no si es arteria o vena: mira la escala.', 'ficha · mar-eco-intraosea (Doppler color)'] : ['Doppler apagado.', ''];
    if (E1.aguja !== E0.aguja) return E1.eje === 'corto' ? ['En eje corto, la aguja es <span class="hl">un punto brillante</span> cuando llega a la luz. Las venas se colapsan: perforación de la pared posterior en el 40 % (18 % en eje largo).', 'ficha · mar-eco-aguja · mar-eco-pared-posterior'] : ['En eje largo ves avanzar la aguja entera. Confirma primero la guía en la luz y después el catéter (Fig. 1.9).', 'ficha · mar-eco-cual · mar-eco-pared-posterior'];
    return FRASE_INICIO();
}

/* ============================================================
   Mandos del dock y de las lupas
   ============================================================ */
function marcarSeg(id, v) { $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(v)))); }
function chipsCatalogo() {
    $('m-catalogo').innerHTML = ORDEN_CAT.map(k => { const c = CAT[k]; return `<button type="button" class="ctv-chip-f" data-ctv-cat="${k}" aria-pressed="false"><span>${c.nombre}<small>${c.sub}${c.lh != null ? ` · ${dec(c.lh, c.lh < 1 ? 2 : 1)} L/h` : ''}</small></span></button>`; }).join('');
    $('m-oclusion').innerHTML = `<option value="">Sin oclusión</option>` + Object.entries(OCLUSIONES).map(([k, o]) => `<option value="${k}">${o.nombre} (${o.sub})</option>`).join('');
    $('m-instilar').innerHTML = `<option value="">Instilar…</option>` + Object.entries(INSTILAR).map(([k, o]) => `<option value="${k}">${o.nombre}${o.sub ? ` (${o.sub})` : ''}</option>`).join('');
}
function sincronizarMandos() {
    const e = estado;
    marcarSeg('m-banco', e.banco);
    $('banco-fig').hidden = e.banco !== 'fig'; $('m-catalogo').hidden = e.banco !== 'tablas';
    marcarSeg('m-calibre', e.figExp === 'calibre' ? e.figCal : '-'); marcarSeg('m-longitud', e.figExp === 'longitud' ? e.figLong : '-');
    enRaiz('#ctv-m-catalogo [data-ctv-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ctvCat === e.cat)));
    marcarSeg('m-vena', e.vena);
    marcarSeg('m-altura', e.altura);
    $('m-altura').querySelectorAll('button').forEach(b => { b.disabled = e.banco === 'fig' || e.io; });
    $('m-altura').title = e.io ? 'Intraósea: se presuriza con bomba o manguito' : e.banco === 'fig' ? 'La Fig. 1.1 no dice la altura: elige las Tablas para subir la bolsa' : '';
    marcarSeg('m-bomba', e.bomba);
    $('m-io').setAttribute('aria-pressed', String(e.io));
    marcarSeg('m-tiempo', e.tiempo);
    enRaiz('[data-ctv-paq]').forEach(b => b.setAttribute('aria-pressed', String(!!e.paquete[b.dataset.ctvPaq])));
    marcarSeg('m-problema', e.problema);
    ['biopelicula', 'hemocultivos', 'oclusion', 'aire'].forEach(k => { $('sub-' + k).hidden = e.problema !== k; });
    $('m-antibiotico').setAttribute('aria-pressed', String(e.antibiotico));
    enRaiz('[data-ctv-manejo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ctvManejo === e.manejo)));
    $('m-oclusion').value = e.oclusion || ''; $('m-instilar').value = e.instilado || ''; $('m-instilar').disabled = !e.oclusion;
    marcarSeg('m-postura', e.aire.postura);
    $('m-conector').textContent = e.aire.abierto ? 'Cerrar conector' : 'Abrir conector';
    $('m-incubar').textContent = e.hcIncubado ? 'Incubar otra vez' : 'Incubar los dos frascos';
    enRaiz('#ctv-lupas [data-ctv-lupa]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ctvLupa === e.lupa)));
}
function segClick(id, fn) { $(id).addEventListener('click', ev => { const b = ev.target.closest('button'); if (b && !b.disabled) fn(b.dataset.v); }); }
function elegirPestana(tab) {
    enRaiz('.ctv-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.ctvTab === tab)));
    enRaiz('#ctv-dock-explorar > .ctv-dock-panel').forEach(p => { p.hidden = p.dataset.ctvPanel !== tab; });
}
const pestanaActual = () => raiz.querySelector('.ctv-dock-tabs [aria-selected="true"]')?.dataset.ctvTab;
function pintarMandosLupa() {
    const e = estado, m = $('mandos-lupa');
    const seg = (grupo, ops, act) => `<div class="ctv-seg" data-grupo="${grupo}">${ops.map(([v, txt]) => `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(act)}">${txt}</button>`).join('')}</div>`;
    const tog = (k, txt, on) => `<button type="button" class="ctv-tog" data-tog="${k}" aria-pressed="${on}">${txt}</button>`;
    let h = '';
    if (e.lupa === 'B') h = seg('zoomB', [['vias', 'Fig. 3.2<small>las 4 vías</small>'], ['punta', 'La punta<small>de cerca</small>'], ['micro', 'Micros&shy;copio<small>foto real</small>'], ['frascos', 'Hemo&shy;cultivos']], e.zoomB)
        + seg('aposito', [['transparente', 'Apósito<small>transparente</small>'], ['gasa', 'Gasa'], ['esponja', 'Esponja<small>clorhexidina</small>'], ['humedo', 'Humedad<small>debajo</small>']], e.aposito);
    else if (e.lupa === 'C') h = seg('punta', ORDEN_PUNTA.map(p => [p, { yugular: 'Yugular', 'vcs-alta': 'Cava alta', carina: 'Carina', auricula: 'Aurícula' }[p]]), e.izquierdo ? '-' : e.punta)
        + `<div class="ctv-fila-io">${tog('izquierdo', 'Catéter izquierdo (Fig. 3.1)', e.izquierdo)}<span class="ctv-nota-mini">o arrastra la punta en la lámina</span></div>`;
    else if (e.lupa === 'D') h = `<div class="ctv-fila-io">${seg('eje', [['corto', 'Eje corto'], ['largo', 'Eje largo']], e.eco.eje)}${tog('comprimir', 'Comprimir', e.eco.comprimir)}</div>`
        + `<div class="ctv-rejilla4">${tog('trombosada', 'Vena trombosada', e.eco.trombosada)}${tog('aguja', 'Aguja', e.eco.aguja)}${tog('doppler', 'Doppler color', e.eco.doppler)}${tog('girada', 'Girar la sonda', e.eco.girada)}</div>`;
    if (m._h !== h) { m._h = h; m.innerHTML = h; }
    const tl = $('tab-lupa'); tl.hidden = e.lupa === 'A'; tl.textContent = 'Lupa ' + e.lupa;
    if (e.lupa === 'A' && pestanaActual() === 'lupa') elegirPestana('cateter');
    const nota = {
        B: e.zoomB === 'vias' ? '<b>1</b> infusión contaminada (rara) · <b>2</b> conector y luz interna (quizá destacada en los tunelizados) · <b>3</b> piel, por el trayecto subcutáneo (la principal en los percutáneos no tunelizados) · <b>4</b> sangre: los microbios circulantes se pegan a la parte intravascular. <span class="ctv-org">ficha · mar-bac-vias · mar-bac-intestino</span>'
            : e.zoomB === 'frascos' ? 'Tiempo diferencial: el mismo germen en los dos y el del catéter ≥2 h antes (91 %). Las horas de los frascos son ilustrativas; la diferencia de 2,5 h es la del caso. <span class="ctv-org">ficha · mar-tabla-3-4</span>'
            : 'Biopelícula: adhesinas y una matriz de polisacáridos, proteínas, fibrina y ADN. Visible al microscopio electrónico tras un solo día. <span class="ctv-org">ficha · mar-biofilm</span>',
        C: 'Punta: en la cava superior, 1-2 cm por encima de la aurícula, a la altura de la carina; malposición en el 15-18 %. <b>Arrástrala</b> o usa los botones. <span class="ctv-org">ficha · mar-punta-objetivo · mar-punta-rx</span>',
        D: 'Esquema 2D, no el ecógrafo. El color es la dirección respecto a la sonda (mira la escala); el punto de la sonda marca su lado. <span class="ctv-org">ficha · mar-eco-intraosea (Figs. 1.6-1.8)</span>'
    }[e.lupa] || '';
    const nl = $('nota-lupa'); if (nl._h !== nota) { nl._h = nota; nl.innerHTML = nota; enlazarOrigenes(nl); } nl.hidden = !nota;
}
const svg = () => $('lamina');
function puntoSvg(ev) { const r = svg().getBoundingClientRect(); return [(ev.clientX - r.left) * 360 / r.width, (ev.clientY - r.top) * 330 / r.height]; }
let arrastrando = false;
function puntaCercana([x, y]) { let mejor = null, dm = 1e9; for (const [k, [px, py]] of Object.entries(PUNTA_XY)) { const dd = Math.hypot(px - x, py - y); if (dd < dm) { dm = dd; mejor = k; } } return dm < 60 ? mejor : null; }

function engancharDock() {
    segClick('m-banco', v => cambiar(e => { e.banco = v; e.lupa = 'A'; e.io = false; if (v === 'tablas' && e.bomba === 'infusor' && !CAT[e.cat].rapido) e.bomba = 'gravedad'; }));
    segClick('m-calibre', v => cambiar(e => { e.banco = 'fig'; e.figExp = 'calibre'; e.figCal = +v; e.lupa = 'A'; e.io = false; }));
    segClick('m-longitud', v => cambiar(e => { e.banco = 'fig'; e.figExp = 'longitud'; e.figLong = +v; e.lupa = 'A'; e.io = false; }));
    $('m-catalogo').addEventListener('click', ev => { const b = ev.target.closest('[data-ctv-cat]'); if (b) cambiar(e => { e.banco = 'tablas'; e.cat = b.dataset.ctvCat; e.lupa = 'A'; e.io = false; }); });
    segClick('m-vena', v => cambiar(e => { e.vena = v; e.lupa = 'A'; }));
    segClick('m-altura', v => cambiar(e => { e.altura = +v; e.lupa = 'A'; }));
    segClick('m-bomba', v => cambiar(e => { e.bomba = v; e.lupa = 'A'; }));
    $('m-io').addEventListener('click', () => cambiar(e => { e.io = !e.io; e.lupa = 'A'; }));
    segClick('m-tiempo', v => cambiar(e => { e.tiempo = +v; e.lupa = 'B'; if (e.zoomB === 'frascos' || e.zoomB === 'micro') e.zoomB = 'vias'; }));
    enRaiz('[data-ctv-paq]').forEach(b => b.addEventListener('click', () => cambiar(e => { e.paquete[b.dataset.ctvPaq] = !e.paquete[b.dataset.ctvPaq]; e.lupa = 'B'; e.zoomB = 'vias'; })));
    segClick('m-problema', v => cambiar(e => {
        e.problema = v;
        if (v === 'biopelicula') { e.lupa = 'B'; e.zoomB = 'punta'; if (!e.tiempo) e.tiempo = 24; }
        if (v === 'hemocultivos') { e.lupa = 'B'; e.zoomB = 'frascos'; }
        if (v === 'oclusion') { e.lupa = 'A'; if (!e.oclusion) { e.oclusion = 'trombo'; e.instilado = null; } }
        if (v === 'aire') { e.lupa = 'C'; }
    }));
    $('m-antibiotico').addEventListener('click', () => cambiar(e => { e.antibiotico = !e.antibiotico; e.lupa = 'B'; if (e.zoomB !== 'vias') e.zoomB = 'punta'; if (!e.tiempo) e.tiempo = 48; }));
    enRaiz('[data-ctv-manejo]').forEach(b => b.addEventListener('click', () => cambiar(e => { const v = b.dataset.ctvManejo; e.manejo = e.manejo === v ? null : v; e.lupa = 'B'; if (e.zoomB === 'frascos' || e.zoomB === 'micro') e.zoomB = 'punta'; })));
    $('m-incubar').addEventListener('click', () => { cambiar(e => { e.hcIncubado = false; }, { frase: false }); cambiar(e => { e.hcIncubado = true; e.lupa = 'B'; e.zoomB = 'frascos'; e.problema = 'hemocultivos'; }); });
    $('m-oclusion').addEventListener('change', ev => cambiar(e => { e.oclusion = ev.target.value || null; e.instilado = null; e.lupa = 'A'; }));
    $('m-instilar').addEventListener('change', ev => cambiar(e => { e.instilado = ev.target.value || null; e.lupa = 'A'; }));
    segClick('m-postura', v => cambiar(e => { e.aire.postura = v; e.aire.abierto = false; e.lupa = 'C'; }));
    $('m-conector').addEventListener('click', () => cambiar(e => { e.aire.abierto = !e.aire.abierto; e.lupa = 'C'; e.izquierdo = false; }));
    enRaiz('.ctv-dock-tabs button').forEach(b => b.addEventListener('click', () => {
        elegirPestana(b.dataset.ctvTab);
        if (b.dataset.ctvTab === 'lupa') return;
        const lupa = { cateter: 'A', empujar: 'A', tiempo: 'B', problema: { biopelicula: 'B', hemocultivos: 'B', oclusion: 'A', aire: 'C' }[estado.problema] }[b.dataset.ctvTab];
        if (lupa !== estado.lupa) cambiar(e => { e.lupa = lupa; if (lupa === 'B' && b.dataset.ctvTab === 'tiempo' && (e.zoomB === 'frascos' || e.zoomB === 'micro')) e.zoomB = 'vias'; });
    }));
    $('lupas').addEventListener('click', ev => { const b = ev.target.closest('[data-ctv-lupa]'); if (!b) return; cambiar(e => { e.lupa = b.dataset.ctvLupa; }); elegirPestana(b.dataset.ctvLupa === 'A' ? 'cateter' : 'lupa'); });
    $('lupa-cerrar').addEventListener('click', () => { cambiar(e => { e.lupa = 'A'; }); if (pestanaActual() === 'lupa') elegirPestana('cateter'); });
    $('mandos-lupa').addEventListener('click', ev => {
        const b = ev.target.closest('button'); if (!b) return;
        const grupo = b.closest('[data-grupo]')?.dataset.grupo, k = b.dataset.tog;
        if (grupo === 'zoomB') cambiar(e => { e.zoomB = b.dataset.v; if (b.dataset.v === 'frascos') e.problema = 'hemocultivos'; if (b.dataset.v === 'punta' && !e.tiempo) e.tiempo = 24; });
        else if (grupo === 'aposito') cambiar(e => { e.aposito = b.dataset.v; e.zoomB = 'vias'; });
        else if (grupo === 'punta') cambiar(e => { e.punta = b.dataset.v; e.izquierdo = false; });
        else if (grupo === 'eje') cambiar(e => { e.eco.eje = b.dataset.v; });
        else if (k === 'izquierdo') cambiar(e => { e.izquierdo = !e.izquierdo; e.aire.abierto = false; });
        else if (k) cambiar(e => { e.eco[k] = !e.eco[k]; if (k === 'girada' && !e.eco.doppler) e.eco.doppler = true; });
    });
    svg().addEventListener('pointerdown', ev => {
        if (estado.lupa !== 'C' || estado.izquierdo || modo !== 'explorar') return;
        const p = puntoSvg(ev); const k = puntaCercana(p); if (!k) return;
        arrastrando = true; svg().setPointerCapture?.(ev.pointerId);
        if (k !== estado.punta) cambiar(e => { e.punta = k; });
    });
    svg().addEventListener('pointermove', ev => { if (!arrastrando) return; const k = puntaCercana(puntoSvg(ev)); if (k && k !== estado.punta) cambiar(e => { e.punta = k; }); });
    ['pointerup', 'pointercancel'].forEach(t0 => svg().addEventListener(t0, () => { arrastrando = false; }));
}

/* ============================================================
   La tira de láminas del libro (figuras reales) y su visor, con el enlace a su página del PDF
   ============================================================ */
function pintarTira() {
    const el = $('tira'), clave = estado.lupa;
    if (el._k === clave) return; el._k = clave;
    el.innerHTML = TIRA[clave].map(k => { const f = FIGS[k]; return `<button type="button" class="ctv-lamina-libro${f.midio ? ' ctv-midio' : ''}" data-ctv-fig="${k}" aria-label="Ampliar la ${f.n} del libro"><img src="${IMG}${f.src}" alt="" loading="lazy"><span>${f.n} · libro</span></button>`; }).join('');
}
function abrirVisor(k) {
    const f = FIGS[k];
    $('visor-img').src = IMG + f.src; $('visor-img').alt = f.pie;
    $('visor-pie').textContent = f.pie + ` Marino, cap. ${f.n.slice(5, 6)} (PDF, p. ${f.pag}).`;
    $('visor-pdf').href = `${PDF}#page=${f.pag}`;
    $('visor').showModal();
}

/* ============================================================
   Leyendas: las formas de la tabla única
   ============================================================ */
function leyendas() {
    const items = [['agua', 'Agua del suero: <b>gota</b>.'], ['rbc', 'Hematíes de la vena: <b>disco</b>. No dependen del catéter.'], ['ca', 'Ca²⁺ del precipitado mineral: <b>óvalo</b>.'], ['p', 'Fosfato del precipitado mineral: <b>triángulo invertido</b>.'],
        ['coco', 'Coco (bacteria): <b>círculo con adhesinas</b>, la única forma con ellas. En <b>contorno</b>, la que mata el antibiótico. Forma nueva de la tabla, pendiente de que la confirmes.'],
        ['burbuja', 'Burbuja de aire: <b>aro con un reflejo</b>. Solo sale en la lupa C, donde no hay glucosado (su anillo). Forma nueva de la tabla, pendiente de que la confirmes.']];
    $('leyenda').innerHTML = items.map(([k, txt]) => `<li${k === 'coco' || k === 'burbuja' ? ' class="ctv-propuesta"' : ''}>${iconoParticula(k, 18)}<span>${txt}</span></li>`).join('')
        + `<li><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><rect x="1" y="3" width="14" height="10" rx="3" fill="url(#ctv-p-rayado)" style="stroke:var(--accent-yellow)" stroke-dasharray="2 1.5"/></svg><span>Biopelícula: la matriz (<i>slime</i>), rayada y con borde discontinuo.</span></li>`
        + `<li><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><rect x="1" y="6" width="14" height="4" rx="2" style="fill:var(--accent-yellow)"/></svg><span>El catéter, en oro: su longitud real a escala y su grosor ×4.</span></li>`;
    $('leyenda-mini').innerHTML = [['agua', 'agua'], ['rbc', 'hematíes'], ['coco', 'coco'], ['burbuja', 'aire']].map(([k, txt]) => `<li>${iconoParticula(k, 12)}${txt}</li>`).join('');
}

/* ============================================================
   Estados con nombre (los chips y los botones de las fichas: data-cateter-vivo="<estado>")
   ============================================================ */
function pestanaDe(st) {
    if (st.lupa === 'B' && st.problema !== 'hemocultivos' && st.zoomB === 'vias') return 'tiempo';
    if (st.lupa === 'A' && !st.oclusion) return st.io || st.bomba !== 'gravedad' || st.altura !== 100 ? 'empujar' : 'cateter';
    if (st.lupa === 'D' || (st.lupa === 'C' && st.problema !== 'aire')) return 'lupa';
    return 'problema';
}
// La frase de un estado con nombre: lo que lo distingue del catéter de partida con la misma lupa (si no hay nada,
// la frase de la lupa).
function fraseDeEstado(st) {
    const inicio = FRASE_INICIO()[0];
    const desde = extra => estadoDe(Object.assign({ lupa: st.lupa, zoomB: st.zoomB, problema: st.problema, banco: st.banco }, extra));
    for (const base of [desde({ tiempo: st.tiempo }), desde({})]) {
        const f = fraseDe(base, st);
        if (f && f[0] && f[0] !== inicio) return f;
    }
    return fraseDe(estadoDe({}), estadoDe({ lupa: st.lupa })) || FRASE_INICIO();
}
function ponerEnEstado(clave) {
    const st = estadoDe(ESTADOS[clave]?.e || {});
    medir();
    fraseActual = '';
    aplicar(st, { forzar: true, frase: false });
    decir(...fraseDeEstado(st));
    elegirPestana(pestanaDe(st));
    const actual = JSON.stringify(st);
    enRaiz('[data-ctv-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ctvEstado === clave && JSON.stringify(estadoDe(ESTADOS[clave].e)) === actual)));
}
function pintarEstados() {
    $('lista-estados').innerHTML = FICHAS_ESTADO.map(([nom, id, ests]) => `<li><b>${nom}</b> <span class="ctv-org">ficha · ${id}</span><div class="ctv-fila ctv-chips-estado">${ests.map(k => `<button type="button" class="ctv-chip-f" data-ctv-estado="${k}" aria-pressed="false">${NOMBRE_ESTADO[k]}</button>`).join('')}</div></li>`).join('');
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
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('ctv-estudio', m !== 'explorar');
    raiz.classList.toggle('ctv-mayeutica', m === 'preguntas');   // la entradilla daría respuestas
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    anillo(null); setOcultos([]);
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    if (m === 'preguntas') Mayeutica.entrar();
    if (m === 'explorar') { fraseActual = ''; decir(...FRASE_INICIO()); }
    if (REDUCIR) pintarUnaVez(); else arrancar();
    subir();
}

/* ============================================================
   «Ver en el texto» y los chips de origen: la pieza común de las citas (core/citas.js), la misma del capilar. Cada
   fuente (ficha#elemento · #elemento) es un enlace cruzado a su sitio de la ficha, con el nombre que tiene en el texto.
   ============================================================ */
const verEnTexto = fuente => `<p class="ctv-fuente-p">${enlacesFuente(fuente, { clase: 'ctv-ir-texto', claseOrg: 'ctv-org' })}</p>`;
const origenHTML = texto => origenEnlazado(texto, { clase: 'ctv-org-ir' });
// Los chips de origen escritos en el HTML o en los textos se enlazan al pintarse.
const enlazarOrigenes = cont => enlazarCitas(cont, { selector: 'span.ctv-org', clase: 'ctv-org-ir' });

/* ============================================================
   Capa de estudio: Conceptos (aquí) y Mayéutica (recorrido, repaso de lo fallado y casos: el motor común,
   core/mayeutica-motor.js; aquí solo sus enganches con el catéter)
   ============================================================ */
function ponerModelo(q) {
    aplicar(estadoDe(q.estado), { frase: false, forzar: true });
    anillo(q.mirar || null);
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || []);
}
const pintarDock = (items, izq, der) => pintarDockComun('ctv', items, izq, der);

/* Mandos dentro de una pregunta («compruébalo en el modelo») */
const NOMBRE_PUNTA = { yugular: 'Yugular', 'vcs-alta': 'Cava alta', carina: 'Carina', auricula: 'Aurícula' };
function mandoHTML(t0) {
    const e = estado;
    const seg = (mando, ops, act) => `<div class="ctv-seg">${ops.map(([v, txt]) => `<button type="button" data-mando="${mando}" data-v="${v}" aria-pressed="${String(v) === String(act)}">${txt}</button>`).join('')}</div>`;
    const partes = [`<p class="ctv-para"><b>Compruébalo en el modelo:</b> ${t0.instruccion}</p>`];
    for (const m of t0.mandos) {
        if (m === 'calibre') partes.push(seg('calibre', [[16, '16 G'], [18, '18 G'], [20, '20 G']], e.figCal));
        else if (m === 'longitud') partes.push(seg('longitud', [[2, '2″'], [6, '6″'], [12, '12″']], e.figLong));
        else if (m === 'vena') partes.push(seg('vena', [['pequena', 'Vena pequeña'], ['grande', 'Vena grande']], e.vena));
        else if (m === 'altura') partes.push(seg('altura', [[0, '0 cm'], [68, '68 cm'], [100, '100 cm']], e.altura));
        else if (m === 'cvc-luces') partes.push(seg('cat', [['cvc-d', 'Distal'], ['cvc-m', 'Medial'], ['cvc-p', 'Proximal']], e.cat));
        else if (m === 'punta') partes.push(seg('punta', ORDEN_PUNTA.map(p => [p, NOMBRE_PUNTA[p]]), e.punta));
        else if (m === 'conector') partes.push(`<button type="button" class="ctv-b" data-mando="conector">${e.aire.abierto ? 'Cerrar conector' : 'Abrir conector'}</button>`);
        else if (m === 'incubar') partes.push('<button type="button" class="ctv-b" data-mando="incubar">Incubar los dos frascos</button>');
    }
    return partes.join('');
}
function accionMando(m, cont) {
    const tipo = m.dataset.mando, v = m.dataset.v;
    if (tipo === 'calibre') cambiar(e => { e.banco = 'fig'; e.figExp = 'calibre'; e.figCal = +v; }, { frase: false });
    else if (tipo === 'longitud') cambiar(e => { e.banco = 'fig'; e.figExp = 'longitud'; e.figLong = +v; }, { frase: false });
    else if (tipo === 'vena') cambiar(e => { e.vena = v; }, { frase: false });
    else if (tipo === 'altura') cambiar(e => { e.altura = +v; }, { frase: false });
    else if (tipo === 'cat') cambiar(e => { e.banco = 'tablas'; e.cat = v; }, { frase: false });
    else if (tipo === 'punta') cambiar(e => { e.punta = v; e.izquierdo = false; }, { frase: false });
    else if (tipo === 'conector') cambiar(e => { e.lupa = 'C'; e.aire.abierto = !e.aire.abierto; e.izquierdo = false; }, { frase: false });
    else if (tipo === 'incubar') { cambiar(e => { e.hcIncubado = false; }, { frase: false }); cambiar(e => { e.hcIncubado = true; e.lupa = 'B'; e.zoomB = 'frascos'; }, { frase: false }); }
    sincronizarMandoPregunta(cont);
}
function sincronizarMandoPregunta(cont) {
    const e = estado, actual = { calibre: e.figExp === 'calibre' ? e.figCal : null, longitud: e.figExp === 'longitud' ? e.figLong : null, vena: e.vena, altura: e.altura, cat: e.banco === 'tablas' ? e.cat : null, punta: e.izquierdo ? null : e.punta };
    cont.querySelectorAll('#ctv-mando [data-mando][data-v]').forEach(b => b.setAttribute('aria-pressed', String(String(actual[b.dataset.mando]) === b.dataset.v)));
    cont.querySelectorAll('#ctv-mando [data-mando="conector"]').forEach(b => { b.textContent = e.aire.abierto ? 'Cerrar conector' : 'Abrir conector'; });
}

/* ---------- Conceptos ---------- */
const Estudio = {
    c: 0,
    concepto(i) {
        this.c = clamp(i, 0, CONCEPTOS.length - 1);
        const k = CONCEPTOS[this.c], cont = $('concepto');
        aplicar(estadoDe(k.estado), { frase: false, forzar: true });
        anillo(k.mirar || null);
        cont.innerHTML = `<div class="ctv-cab-preg"><span class="ctv-concepto-n">${this.c + 1}</span><h3>${k.titulo}</h3></div>
            <p class="ctv-pregunta">${k.texto}</p>
            <div class="ctv-mando"><p class="ctv-para"><b>Tócalo:</b> ${k.hacer}</p><div class="ctv-fila">${k.acciones.map((a, j) => `<button class="ctv-b" type="button" data-acc="${j}">${a.t}</button>`).join('')}</div></div>
            <p class="ctv-para"><b>Mira:</b> ${k.mira}</p>
            ${verEnTexto(k.fuente)}
            <div class="ctv-nav-c"><button class="ctv-b" type="button" data-nav="-1" ${this.c === 0 ? 'disabled' : ''}>← Anterior</button><button class="ctv-b ctv-prim" type="button" data-nav="1">${this.c === CONCEPTOS.length - 1 ? 'A la Mayéutica →' : 'Siguiente →'}</button></div>`;
        entrar(cont, 'ctv');
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]');
            if (a) { const acc = CONCEPTOS[this.c].acciones[+a.dataset.acc]; aplicar(estadoDe(Object.assign(copia(CONCEPTOS[this.c].estado), copia(acc.e))), { frase: false, forzar: true }); if (acc.mirar !== undefined) anillo(acc.mirar); return; }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); subir(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve el catéter');
    },
};

/* ---------- Mayéutica: el motor común con los enganches del catéter ---------- */
// Aciertos y fallos en localStorage con su clave de siempre (como el quiz: solo en este dispositivo).
const Mayeutica = crearMayeuticaModelo({
    p: 'ctv', cont: () => $('preg'), clave: 'cateter-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => aplicar(estadoBase(), { frase: false, forzar: true }),
    volverPor: 'Catéter vivo',
    pregunta: {
        alEmpezar: ponerModelo,
        enlazar: enlazarOrigenes,
        verEnTexto: q => verEnTexto(q.fuente),
        alCerrar: q => { if (q.despues) aplicar(estadoDe(q.despues), { frase: false, forzar: true }); setOcultos([]); },
        alSalir: () => { anillo(null); setOcultos([]); },
        tocar: {
            mandoHTML,
            alMostrar: q => anillo(q.tocar.mirar || q.mirar || null),
            comprobar: q => q.tocar.comprobar(estado),
            ponerBueno: (q, cont) => {
                aplicar(estadoDe(Object.assign(copia(q.estado), copia(q.tocar.bueno))), { frase: false, forzar: true });
                sincronizarMandoPregunta(cont);   // el mando de la pregunta enseña lo mismo que el modelo
            },
            alComprobar: () => setOcultos([]),
            accion: accionMando,
        },
    },
    textos: {
        ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): preguntas encadenadas que te llevan de la mano, del calibre a la hemorragia masiva; varias se predicen y se comprueban tocando el catéter.</span>
            <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de la propia ficha.</span>
            <span><b>3.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>4.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span>`,
        empezar: 'Empezar la guía socrática', seguir: 'Seguir',
        pie: 'El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde. Lo que no se pregunta está en «Para profundizar», abajo.',
        conModelo: 'el catéter',
        casos: 'El catéter se mueve al estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
        abrirPaciente: 'Abrir el catéter en el estado del paciente',
    },
    preguntaDePaso: paso => ({ estado: paso.estado, mirar: paso.mirar }),
    abrirPaciente: C => { setModo('explorar'); const st = estadoDe(C.volver.estado); aplicar(st, { forzar: true, frase: false }); decir(...fraseDeEstado(st)); elegirPestana(pestanaDe(st)); },
});

/* ============================================================
   Para profundizar: lo que el modelo y la Mayéutica no cubren, con su sitio en el texto y en el PDF
   ============================================================ */
function pintarProfundizar() {
    const html = PROFUNDIZAR.map(([txt, ids, pag]) => `<li>${txt} <span class="ctv-org">ficha · ${ids}</span> <a class="ctv-pdf" href="${PDF}#page=${pag}" target="_blank" rel="noopener">PDF, p. ${pag} →</a></li>`).join('');
    $('lista-profundizar').innerHTML = html; $('lista-profundizar-2').innerHTML = html;
}

/* ============================================================
   Abrir en un estado (los botones de las fichas, el menú y el buscador)
   ============================================================ */
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú): se abre como estaba.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('ctv-volver'), raiz, origen);
    if (!clave) { requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' })); return; }
    if (modo !== 'explorar') setModo('explorar');
    ponerEnEstado(clave === 'inicio' ? null : clave);
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
export function init() {
    raiz = document.getElementById('ctv-raiz');
    if (!raiz) return null;
    initEscena();
    chipsCatalogo(); leyendas(); pintarProfundizar(); pintarEstados(); engancharDock();
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
    $('lista-estados').addEventListener('click', ev => { const b = ev.target.closest('[data-ctv-estado]'); if (b) { ponerEnEstado(b.dataset.ctvEstado); subir(); } });
    $('tira').addEventListener('click', ev => { const b = ev.target.closest('[data-ctv-fig]'); if (b) abrirVisor(b.dataset.ctvFig); });
    $('visor-cerrar').addEventListener('click', () => $('visor').close());
    $('visor').addEventListener('click', ev => { if (ev.target === $('visor')) $('visor').close(); });
    $('frase').addEventListener('click', ev => { if (!ev.target.closest('button')) $('frase').classList.toggle('ctv-abierta'); });
    enlazarOrigenes(raiz);
    Mayeutica.cargar();
    aplicar(estadoBase(), { frase: false, forzar: true }); decir(...FRASE_INICIO());

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--ctv-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    // La vista se ve o deja de verse (todas las vistas están en el DOM): medir al aparecer.
    let anchoVisible = 0, motionPedido = false;
    const esc = $('escena');
    new ResizeObserver(() => {
        const a = Math.round(esc.clientWidth);
        document.body.classList.toggle('ctv-activo', a > 0);
        if (!a) { anchoVisible = 0; return; }
        if (!anchoVisible) { const v = document.getElementById('cateter-vivo-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, la lupa abre sin muelle */ }); }
        medir();
        if (REDUCIR) pintarUnaVez(); else arrancar();
    }).observe(esc);
    new IntersectionObserver(es => ponerVisible(es[0].isIntersecting)).observe(esc);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado frente a la cobertura §6.2 y el estado del bucle.
    window.__ctvPruebas = () => {
        const r = pruebasCateter();
        const lectura = $('lectura').textContent;
        return { ...r, bucle: estadoBucle(), modo, fase: Mayeutica.fase, estado: copia(estado),
            D: { valor: D.valor, unidad: D.unidad, texto: D.texto, org: D.org, ocluido: D.ocluido, alarma: D.alarma, rel: D.rel, presion: D.presion, presionMedula: D.presionMedula, aire: D.aire, punta: D.punta, bio: D.bio, eco: D.eco },
            aireMl: Math.round(Anim.aireMl), ocultos: [...ocultos], lectura, guardado: Mayeutica.prog.g.leer(), vaciarFotogramas };
    };

    return { abrir: abrirEstado };
}
