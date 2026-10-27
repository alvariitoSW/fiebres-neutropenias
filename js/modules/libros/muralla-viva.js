// La muralla de papel (Libros → Marino → Fundamentos, cap. 4: el intestino como origen de infección y la lesión
// mucosa por estrés). Escena del vientre de «La cama 7». Interfaz del modelo vivo: la cama 7 (cama7.js), la frase
// viva, la hoja de órdenes (dock de 5 pestañas: paciente, estómago, intestino, boca y unidad), los toques en la
// lámina, el interruptor Explorar | Conceptos | Mayéutica y la capa de estudio (guía socrática y examen, repaso de lo
// fallado y 3 casos clínicos). Mismo patrón que el capilar y oxígeno (capilar-vivo.js). La escena vive en
// muralla-viva-escena.js; los datos, en js/data/muralla-viva-data.js. Viene de la maqueta aprobada
// autonomo/maquetas/b1-muralla.html (vuelta 2).
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="murallaViva" data-muralla-viva="ulcera">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica guarda aciertos y fallos en localStorage (como el quiz y el capilar), con
// clave propia y siempre dentro de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { verFrase as verFraseComun } from '../../core/frase-vista.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { crearMayeuticaModelo, barajar, rutaDe, atributosFicha, entrar, pintarDock as pintarDockComun } from '../../core/mayeutica-motor.js';
import { citaHTML, citaExacta, hrefPdf } from '../../core/citas.js';
import { crearExplicacion } from '../../core/explicacion-guiada.js';
import { iconoParticula } from '../../core/particulas.js';
import { montarCama7 } from './cama7.js';
import {
    ESTADOS, CONCEPTOS, PREGUNTAS, CASOS, PROFUNDIZAR, LAMINAS, GUIAS, PAGINAS, PDF_A, estadoBase, estadoDe, derivar, copia, clamp, chipTxt, pruebasMuralla,
} from '../../data/muralla-viva-data.js';
import {
    $, estado, D, REDUCIR, ocultos, initEscena, aplicarModelo, setOcultos, arrancar, ponerVisible, anillo, anilloObj,
    estadoBucle, vaciarFotogramas,
} from './muralla-viva-escena.js';

let raiz = null, cama = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   «Ver en el texto» y el chip de origen. Una fuente es «ficha#elemento · #elemento · texto (A p. N)»: cada id lleva
   a su sitio de la ficha (enlace cruzado de siempre) con el nombre que tiene en el texto; el chip dice solo «ficha»,
   «fisiología general» o «ilustrativo» y la página del PDF. Ningún id interno a la vista.
   ============================================================ */
// Lo que la fuente nombra sin id (acordeones y figuras) y dónde está en la ficha
const ALIAS = { '«Sucralfato»': 'mar-sucralfato', '«IBP»': 'mar-ibp', '«Anti-H2»': 'mar-anti-h2', '«Clorhexidina oral»': 'mar-clorhexidina-oral',
    '«SOD»': 'mar-sod', '«Riesgos de suprimir el ácido»': 'mar-acido-riesgos', '«Riesgos»': 'mar-acido-riesgos', 'Fig. 4.6': 'mar-img-4-6',
    'Fig. 4.5': 'mar-fig-4-5', 'Fig. 4.4': 'mar-fig-4-4', 'Fig. 4.3': 'mar-fig-4-3', 'Fig. 4.1': 'mar-img-4-1', 'Fig. 4.2': 'mar-disbiosis' };
// Los ids (y los alias) que cita una fuente, en orden y sin repetir
function idsDe(fuente) {
    const ids = [];
    for (const t of String(fuente || '').split(' · ')) {
        const m = t.trim().match(/^#?(mar-[a-z0-9-]+)(?:#(mar-[a-z0-9-]+))?/);
        if (m) ids.push(m[2] || m[1]);
        for (const [k, id] of Object.entries(ALIAS)) if (t.includes(k)) ids.push(id);
    }
    return [...new Set(ids)];
}
// Cada sitio citado, con la pieza común (core/citas.js): «Ver en la ficha» al párrafo exacto y, de segunda opción, el PDF
// en su página (PAGINAS). Lo que no lleva a ningún sitio no se pinta.
const citaDeId = id => { const r = rutaDe(id); return r && { libro: 'Marino, cap. 4', ficha: r.tab.id, id, pag: PAGINAS[id], pdf: PDF_A }; };
const enlacesTexto = fuente => idsDe(fuente).map(citaDeId).filter(Boolean).map(c => citaHTML(c, { max: 80 })).join('');
const verEnTexto = fuente => `<div class="mur-fuente-p">${enlacesTexto(fuente)} ${chipSpan(fuente)}</div>`;
const esIlu = f => /ilustrativ/.test(f) && !/mar-|Fig|Tabla/.test(f);
const chipSpan = f => f ? `<span class="mur-org${esIlu(f) ? ' mur-ilu' : ''}">${chipTxt(f)}</span>` : '';
// El chip de la frase viva: un enlace a su sitio en la ficha, si lo tiene
function chip(f) {
    if (!f) return '';
    const r = idsDe(f).map(rutaDe).find(Boolean);
    return r ? `<button type="button" class="mur-org mur-org-ir${esIlu(f) ? ' mur-ilu' : ''}" ${atributosFicha(r)}>${chipTxt(f)}</button>` : chipSpan(f);
}

/* ============================================================
   Frase viva (con su origen) y aplicar un estado
   ============================================================ */
let fraseActual = '';
function decir(html, fuente) {
    const fraseEl = $('frase');
    const guiaBtn = claveActual && GUIAS[claveActual] && !Guia.activo && modo === 'explorar' ? `<button type="button" class="mur-ir-estado" data-mur-guia="${claveActual}">Explícamelo →</button> ` : '';
    const nuevo = `${guiaBtn}${html} ${chip(fuente)}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('lamina').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
}
function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo, { sinAnim: op.sinAnim });
    sincronizarMandos();
    if (op.frase !== false && modo === 'explorar') decir(...fraseDe(viejo, nuevo));
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

/* ---------- La frase viva: traduce cada orden ---------- */
const NOMBRE_EST = { boca: 'la boca', estomago: 'el estómago', intestino: 'el intestino' };
function fraseEstacion(est) {
    return {
        boca: ['La boca: <span class="hl">750 mL de saliva al día</span>, con un millón de microbios por mL. En el grave, las cerraduras del epitelio cambian de forma y <span class="hl-rojo">los bacilos gramnegativos se pegan</span>.', 'ficha · mar-saliva · mar-colonizacion-orofaringe (A p. 62-63)'],
        estomago: ['El estómago, la zona menos poblada (<10³ por mL): <span class="hl">el ácido (pH 1-2) es un antiséptico</span>. Un moco con bicarbonato (pH 7) protege el epitelio, y el capilar de la mucosa lo sostiene.', 'ficha · mar-acido-antiseptico · mar-ulcera-patogenia (A p. 60-62, 67)'],
        intestino: ['El intestino: la flora residente <span class="hl-verde">ocupa todos los huecos</span> y alimenta a las células con cadenas cortas. El 99 % de los microbios vive en el colon.', 'ficha · mar-microbioma-cifras · mar-microbioma-proteccion (A p. 58-59)'],
    }[est];
}
function fraseRiesgo() {
    const R = D.riesgo, mot = [...R.maximos, ...R.altos, ...R.moderados];
    return `Tabla 4.2: riesgo <span class="${R.profilaxis ? 'hl-rojo' : 'hl-verde'}">${R.nombre.toLowerCase()} (${R.pct})</span>${mot.length ? ` por ${mot.join(' + ')}` : ''}: ${R.profilaxis ? 'profilaxis sí' : 'sin profilaxis'}.`;
}
function fraseDe(v, n) {
    if (v.estacion !== n.estacion) return fraseEstacion(n.estacion);
    if (v.paciente !== n.paciente) {
        if (n.estacion === 'boca') return [`${{ sano: 'Sano', planta: 'Paciente de planta', uci: 'Paciente de UCI' }[n.paciente]}: <span class="hl">~${D.bgnPct} %</span> lleva bacilos gramnegativos en la boca. <span class="hl-azul">No depende del entorno, sino de la enfermedad</span>: los empleados del hospital, ~2-3 %.`, 'ficha · mar-fig-4-4 (lectura aproximada) · mar-colonizacion-orofaringe'];
        return [`${{ sano: 'Sano', planta: 'Paciente de planta', uci: 'Paciente de UCI' }[n.paciente]}. ${n.estacion === 'estomago' ? fraseRiesgo() : 'En la boca, cambia la colonización (Fig. 4.4).'}`, 'ficha · mar-tabla-4-2 · mar-fig-4-4'];
    }
    if (v.riego !== n.riego) {
        if (n.estacion === 'intestino') return n.riego === 'normal' ? ['Riego normal: la barrera aguanta.', 'ficha · mar-motor-fmo'] : ['Hipoperfusión esplácnica: <span class="hl-rojo">rompe la barrera sin necesidad de antibiótico</span>, pasan microbios o mediadores y la rueda del FMO arranca.', 'ficha · mar-motor-fmo (A p. 60)'];
        if (n.riego === 'normal') return ['Riego normal: <span class="hl-verde">aunque el pH esté en 1-2, no aparece erosión</span>. El moco con bicarbonato y el flujo bastan.', 'ficha · mar-ulcera-patogenia (A p. 67)'];
        if (n.riego === 'oculta') return ['<span class="hl-rojo">Sin hipotensión también puede faltar riego</span>: hipoperfusión gástrica oculta, sobre todo con VM. El moco adelgaza y aparece una erosión que rezuma (en el 75-100 % en las primeras 24 h).', 'ficha · mar-ulcera-patogenia · mar-ulcera-frecuencia (A p. 67)'];
        return [`Shock: el moco casi desaparece y la erosión se hace <span class="hl-rojo">úlcera hasta la submucosa, que sangra</span>${D.supresor || n.enteral ? ' (sigue apareciendo; su tamaño en la lámina es ilustrativo)' : ''}. Para el autor, la causa es la hipoperfusión, no el ácido.`, 'ficha · mar-ulcera-patogenia · mar-acidofobia (A p. 67, 72-73)'];
    }
    if (v.vm !== n.vm) return [`${n.vm ? 'VM más de 24 h.' : 'Sin ventilación mecánica.'} ${fraseRiesgo()}`, 'ficha · mar-tabla-4-2 (A p. 68)'];
    if (v.proteccion !== n.proteccion) {
        const p = n.proteccion;
        if (p === 'nada') return ['Sin protección: pH 1-2, <span class="hl-verde">la <i>Salmonella</i> muere en 1 hora</span>.', 'ficha · mar-fig-4-3 (A p. 61-62)'];
        if (p === 'famotidina') return [`Famotidina 20 mg cada 12 h (anti-H2): menos ácido; objetivo pH ≥4, casi nunca se mide.${n.clcr50 ? ' <span class="hl-rojo">Con ClCr <50, la mitad de la dosis</span>: puede ser neurotóxica.' : ''} Más neumonía y <i>C. difficile</i>, menos que con IBP.`, 'ficha · mar-tabla-4-3 · mar-profilaxis-uso (A p. 68-71)'];
        if (p === 'pantoprazol') return [`Pantoprazol 40 mg IV al día: inhibición completa del ácido. Las cruces H⁺ desaparecen y <span class="hl-rojo">la <i>Salmonella</i> deja de morir</span>${D.lesion.nivel ? '; la lesión sigue (el libro solo da el efecto sobre el sangrado: 4,2 → 2,5 %)' : ''}. Mira la balanza: <span class="hl-purpura">sin beneficio neto</span>.`, 'ficha · mar-fig-4-3 · Fig. 4.6 (A p. 69-71)'];
        return ['Sucralfato 1 g cada 6 h: <span class="hl">una capa sobre la mucosa dañada; la acidez sigue</span> (lo más deseable). Reduce el sangrado y hay menos neumonía que con los supresores.', 'ficha · acordeón «Sucralfato» (A p. 71)'];
    }
    if (v.enteral !== n.enteral) {
        if (n.enteral) return [`Enteral completa: <span class="hl-verde">trófica (moco más grueso) y sube el pH</span>.${v.proteccion === 'sucralfato' ? ' El sucralfato se retira: necesita el estómago vacío y, con la nutrición, bezoares.' : ''} ${fraseRiesgo()}`, 'ficha · mar-enteral-protege · mar-tabla-4-2 (A p. 68, 72)'];
        return [`Sin nutrición enteral. ${fraseRiesgo()}`, 'ficha · mar-tabla-4-2'];
    }
    if (v.corticoides !== n.corticoides || v.anticoag !== n.anticoag) return [`${n.corticoides !== v.corticoides ? 'Corticoides' : 'Anticoagulación'}: <span class="hl-azul">no mueven nada</span>. Son riesgo bajo; el mito de los corticoides: 25 estudios, sin efecto sobre el sangrado. ${fraseRiesgo()}`, 'ficha · mar-mito-corticoides (A p. 68)'];
    if (v.coag !== n.coag) return [`${n.coag ? 'Coagulopatía preocupante (plaquetas <50 × 10⁹/L, INR >1,5 o TP >20 s).' : 'Sin coagulopatía.'} ${fraseRiesgo()}`, 'ficha · mar-tabla-4-2'];
    if (v.cirrosis !== n.cirrosis) return [`${n.cirrosis ? 'Cirrosis con hipertensión portal.' : 'Sin cirrosis.'} ${fraseRiesgo()}`, 'ficha · mar-tabla-4-2'];
    if (v.clcr50 !== n.clcr50) return [n.clcr50 ? 'ClCr <50 mL/min: la famotidina se elimina por el riñón: <span class="hl-rojo">la mitad de la dosis</span>. Los IBP no necesitan ajuste.' : 'ClCr ≥50: sin ajuste.', 'ficha · mar-tabla-4-3 · acordeón «Anti-H2» (A p. 68-69)'];
    if (v.antibiotico !== n.antibiotico) return n.antibiotico ? ['Antibiótico de amplio espectro: <span class="hl-rojo">disbiosis</span>. ① sobrecrecimiento, ② rotura de la mucosa y ③ aclaramiento linfático alterado: los microbios cruzan (translocación) y la rueda del FMO arranca.', 'ficha · mar-disbiosis · Fig. 4.2 (A p. 59-61)'] : ['Sin antibiótico: la flora vuelve a ocupar los huecos (el ritmo, ilustrativo).', 'ficha · mar-microbioma-proteccion · ritmo ilustrativo'];
    if (v.probiotico !== n.probiotico) return n.probiotico === 'temprano' ? ['Probiótico en los 2 primeros días de antibiótico: <span class="hl-verde">previene <i>C. difficile</i></span> (19 estudios). Es su uso principal en la UCI.', 'ficha · mar-probioticos (A p. 66)'] : n.probiotico === 'tarde' ? ['Probiótico desde el día 3: <span class="hl-rojo">ya no previene <i>C. difficile</i></span>. Solo sirve si se empieza en los 2 primeros días.', 'ficha · mar-probioticos (A p. 66)'] : ['Sin probiótico.', ''];
    if (v.sdd !== n.sdd || v.dia !== n.dia) {
        if (!n.sdd) return ['Sin SDD.', ''];
        return [`SDD, día ${n.dia}: boca, tubo y cefuroxima IV los 4 primeros días. <span class="hl">Descontaminar el intestino tarda 5-7 días</span>; la flora anaerobia se respeta.${n.mr ? ' <span class="hl-rojo">Con multirresistentes, pierde el efecto.</span>' : ''}`, 'ficha · mar-sdd (A p. 65-66) · ritmo ilustrativo'];
    }
    if (v.descontaminacion !== n.descontaminacion) {
        if (n.descontaminacion === 'clorhexidina') return ['Clorhexidina al 0,12 % cada 6 h: <span class="hl-rojo">mueren sobre todo los grampositivos (los cocos del dibujo); los bacilos gramnegativos siguen pegados</span>. Las guías de NAV retiraron su recomendación.', 'ficha · mar-tabla-4-1 · acordeón «Clorhexidina oral» (A p. 63-64)'];
        if (n.descontaminacion === 'sod') return ['SOD (gentamicina, colistina y vancomicina al 2 % cada 6 h): <span class="hl-verde">mueren estafilococos, bacilos gramnegativos y <i>Candida</i></span>; quedan los anaerobios, la flora normal.', 'ficha · mar-tabla-4-1 · acordeón «SOD» (A p. 63-64)'];
        return ['Sin descontaminación oral.', ''];
    }
    if (v.gota !== n.gota && n.gota) return ['Aspirar el 0,13 % de 750 mL (≈1 mL) <span class="hl-rojo">mete un millón de microbios en la vía aérea</span>. En el sano no importa; en el grave, con la boca llena de gramnegativos, sí.', 'ficha · mar-saliva (A p. 62)'];
    if (v.mr !== n.mr) return n.mr ? ['Gramnegativos multirresistentes en la unidad (resistencias problemáticas): <span class="hl-rojo">la SDD pierde su efecto</span>; no es apropiada en UCI con resistencias problemáticas.', 'ficha · mar-sdd (A p. 66)'] : ['Sin multirresistentes en la unidad.', ''];
    return fraseEstacion(n.estacion);
}

/* ============================================================
   Toques en la lámina y en la cama
   ============================================================ */
const TOQUES = {
    regla: () => ['Una sola capa de células cilíndricas de <span class="hl-rojo">0,1 mm</span>: nuestra «piel interna». La piel de fuera tiene muchas capas y queratina.', 'ficha · mar-piel-interna (A p. 58)'],
    rueda: () => ['El motor del FMO: la barrera rota deja pasar microbios o mediadores → inflamación sistémica → <span class="hl-rojo">el simpático cierra los vasos esplácnicos</span> → la barrera se rompe más. <span class="hl-purpura">Se autoalimenta</span>. Lo arranca una disbiosis o una hipoperfusión esplácnica.', 'ficha · mar-motor-fmo (A p. 60) · velocidad ilustrativa'],
    fig43: () => ['Fig. 4.3: la <i>Salmonella typhimurium</i> <span class="hl">crece a pH 4</span>, cae de forma progresiva a pH 3 y <span class="hl-verde">desaparece en 1 hora a pH 2</span>. El jugo gástrico tiene pH 1-2.', 'ficha · mar-fig-4-3 (A p. 61-62)'],
    balanza: () => ['Fig. 4.6 (3.298 pacientes de alto riesgo): el pantoprazol bajó el sangrado de 4,2 a 2,5 % (<span class="hl">solo un 1,7 %</span>). Sumando neumonía, <i>C. difficile</i> e isquemia miocárdica: 21,9 % frente a 22,6 %. <span class="hl-purpura">Sin beneficio neto</span>.', 'ficha · mar-img-4-6 (A p. 69-71)'],
    escalera: () => [fraseRiesgo() + ' La regla: un factor máximo o alto, o dos o más moderados.', 'ficha · mar-tabla-4-2 · mar-ulcera-calc (A p. 68)'],
    cateter: () => ['Vía 4 del catéter: los microbios de la sangre se pegan a la parte intravascular. Para el autor, muchos vendrían del intestino; en un estudio, la SDD eliminó las bacteriemias por catéter. <button type="button" class="mur-org-ir" data-especialidad="libros" data-view="cateterVivo" data-cateter-vivo="colonizacion">Abrir el catéter vivo →</button>', 'ficha · mar-bac-vias · mar-bac-intestino · opinión del autor (A p. 47, 53-54, 66)'],
    cerraduras: () => [D.cerradurasCambiadas ? 'En el grave, las proteínas de adhesión <span class="hl-rojo">cambian de forma y pasan a unir patógenos</span>. Lo que decide la colonización no es que el germen esté, sino que <span class="hl-azul">pueda pegarse</span>.' : 'En el sano, las cerraduras no encajan con los bacilos gramnegativos: la flora de la boca es poco dañina.', 'ficha · mar-colonizacion-orofaringe (A p. 63)'],
};
let alTocar = null;
function tocarLamina(ev) {
    const t = ev.target.closest('[data-toca]'); if (!t) return;
    const k = t.dataset.toca;
    if (k.startsWith('est:')) { const est = k.slice(4); if (alTocar) { alTocar(est); return; } if (est !== estado.estacion) { cambiar(s => { s.estacion = est; }); elegirPestana(est); } return; }
    if (TOQUES[k] && modo === 'explorar') decir(...TOQUES[k]());
}
// La cama 7: el zoom de entrada abre la lámina; el respirador recuerda que la VM es una orden de la hoja
function revelar() {
    const esc = $('escena');
    if (REDUCIR || !window.Motion) return;
    window.Motion.animate(0, 1, { duration: 0.8, ease: 'easeOut', onUpdate: v => { esc.style.clipPath = `circle(${+(8 + v * 120).toFixed(2)}% at 58% 30%)`; } }).finished.then(() => { esc.style.clipPath = ''; });
}

/* ============================================================
   Dock: la hoja de órdenes
   ============================================================ */
const DE_ESTACION = { proteccion: 'estomago', enteral: 'estomago', coag: 'estomago', cirrosis: 'estomago', corticoides: 'estomago', anticoag: 'estomago', clcr50: 'estomago',
    antibiotico: 'intestino', probiotico: 'intestino', sdd: 'intestino', descontaminacion: 'boca', aspirar: 'boca' };
function ordenar(s, m, v) {
    if (m === 'paciente') { s.paciente = v; if (v === 'sano') { s.vm = false; if (s.riego === 'oculta') s.riego = 'normal'; } }
    else if (m === 'vm') { s.vm = v === '1'; if (s.vm && s.paciente === 'sano') s.paciente = 'uci'; if (!s.vm && s.riego === 'oculta') s.riego = 'normal'; }
    else if (m === 'riego') { s.riego = v; if (v !== 'normal' && s.paciente === 'sano') s.paciente = 'uci'; if (v === 'oculta') s.vm = true; }
    else if (m === 'proteccion') { if (v === 'sucralfato' && s.enteral) return; s.proteccion = v; }
    else if (m === 'enteral') { s.enteral = !s.enteral; if (s.enteral && s.proteccion === 'sucralfato') s.proteccion = 'nada'; }
    else if (['coag', 'cirrosis', 'corticoides', 'anticoag', 'clcr50', 'antibiotico'].includes(m)) s[m] = !s[m];
    else if (m === 'probiotico') s.probiotico = v;
    else if (m === 'sdd') { if (v === 'no') { s.sdd = false; s.dia = 0; } else { s.sdd = true; s.dia = +v; } }
    else if (m === 'descontaminacion') s.descontaminacion = v;
    else if (m === 'aspirar') s.gota = s.gota ? 0 : 1;
    else if (m === 'mr') s.mr = v === '1';
    if (DE_ESTACION[m]) s.estacion = DE_ESTACION[m];
}
function elegirPestana(tab, soloMarcar) {
    const actual = raiz.querySelector('.mur-dock-tabs [aria-selected="true"]')?.dataset.murTab;
    if (soloMarcar && !['estomago', 'intestino', 'boca'].includes(actual)) return;
    enRaiz('.mur-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.murTab === tab)));
    enRaiz('#mur-dock-explorar .mur-dock-panel').forEach(p => { p.hidden = p.dataset.murPanel !== tab; });
}
function pulsado(m, v) {
    const e = estado;
    switch (m) {
        case 'paciente': return e.paciente === v; case 'vm': return String(+e.vm) === v; case 'riego': return e.riego === v;
        case 'proteccion': return e.proteccion === v; case 'probiotico': return e.probiotico === v; case 'descontaminacion': return e.descontaminacion === v;
        case 'sdd': return v === 'no' ? !e.sdd : e.sdd && e.dia === +v; case 'mr': return String(+e.mr) === v; case 'aspirar': return !!e.gota;
        case 'reinicio': return false;
        default: return !!e[m];
    }
}
function sincronizarMandos() {
    enRaiz('#mur-dock-explorar [data-m]').forEach(b => {
        b.setAttribute('aria-pressed', String(pulsado(b.dataset.m, b.dataset.v)));
        if (b.dataset.m === 'proteccion' && b.dataset.v === 'sucralfato') { b.disabled = estado.enteral; b.title = estado.enteral ? 'Necesita el estómago vacío; con la nutrición, bezoares' : ''; }
    });
    sincronizarGuia();
}
// La pestaña del dock que tiene la orden de cada estado con nombre
const PESTANA_DE = { riego: 'paciente', paciente: 'paciente', proteccion: 'estomago', enteral: 'estomago', antibiotico: 'intestino', sdd: 'intestino', mr: 'unidad', descontaminacion: 'boca' };
function engancharDock() {
    $('dock-explorar').addEventListener('click', ev => {
        const b = ev.target.closest('[data-m]'); if (!b || b.disabled) return;
        const m = b.dataset.m;
        if (m === 'reinicio') { aplicar(estadoBase(), { frase: false }); decir(...fraseEstacion('intestino')); return; }
        const antes = estado.estacion;
        cambiar(s => ordenar(s, m, b.dataset.v));
        if (estado.estacion !== antes) elegirPestana(estado.estacion, true);
    });
    $('m-estado').addEventListener('change', ev => { const k = ev.target.value; if (!k) return; if (guia.activo) guia.cerrar(); ponerEnEstado(k); ev.target.value = ''; });
    $('chips-estado').addEventListener('click', ev => { const b = ev.target.closest('[data-estado]'); if (!b) return; if (guia.activo) guia.cerrar(); ponerEnEstado(b.dataset.estado); $('escena-bloque').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' }); });
    enRaiz('.mur-dock-tabs button').forEach(b => b.addEventListener('click', () => {
        elegirPestana(b.dataset.murTab);
        if (['estomago', 'intestino', 'boca'].includes(b.dataset.murTab) && b.dataset.murTab !== estado.estacion) cambiar(s => { s.estacion = b.dataset.murTab; });
    }));
    $('frase').addEventListener('click', ev => { if (ev.target.closest('[data-especialidad], [data-mur-guia]')) return; $('frase').classList.toggle('mur-abierta'); });
    $('lamina').addEventListener('click', tocarLamina);
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
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
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('mur-estudio', m !== 'explorar');
    raiz.classList.toggle('mur-mayeutica', m === 'preguntas');   // la entradilla daría respuestas
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    $('cama7').hidden = m !== 'explorar';
    if (m !== 'explorar') cama?.parar();
    alTocar = null; anillo(null); setOcultos([], false);
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    else if (m === 'preguntas') Mayeutica.entrar();
    else { aplicar(estado, { frase: false }); fraseActual = ''; decir(...fraseEstacion(estado.estacion)); }
    subir();
}

/* ============================================================
   Capa de estudio: Conceptos (aquí) y Mayéutica (recorrido, repaso de lo fallado y casos: el motor común,
   core/mayeutica-motor.js; aquí, sus enganches con el modelo).
   Pregunta: { id, grupo: 'guia'|'examen', tipo: 'test'|'destapa'|'error', fuente, estado,
   tocar: { mandos, mirar, ocultar, comprobar, pista, bueno, confirma }, enunciado, opciones: [{ t, ok, porque }],
   puntos: [], frases: [{ t, mal, c }], explicacion, despues, mirar, mirarDespues, ocultar, nota }
   ============================================================ */
function ponerModelo(q) {
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || [], false);
    aplicar(estadoDe(q.estado), { frase: false });
    requestAnimationFrame(() => anillo(q.mirar || null));
}
const pintarDock = (items, izq, der) => pintarDockComun('mur', items, izq, der);
// Deja el elemento a la vista entre la lámina fija de arriba y el dock de abajo (scrollIntoView no cuenta con el dock)
const asomar = el => verFraseComun(el, { dock: $('dock'), margen: 12, subir: true, suave: true, techo: () => raiz.classList.contains('mur-estudio') ? $('escena-bloque').getBoundingClientRect().bottom + 8 : 8 });

const MANDOS = {
    estacion: { nombre: 'Estación', ops: [['boca', 'Boca'], ['estomago', 'Estómago'], ['intestino', 'Intestino']], m: 'estacion' },
    riego: { nombre: 'Riego', ops: [['normal', 'Normal'], ['oculta', 'PA normal con VM'], ['shock', 'Shock']], m: 'riego' },
    proteccion: { nombre: 'Protección', ops: [['nada', 'Nada'], ['famotidina', 'Famotidina'], ['pantoprazol', 'Pantoprazol'], ['sucralfato', 'Sucralfato']], m: 'proteccion' },
    antibiotico: { nombre: 'Antibiótico', ops: [['0', 'Sin antibiótico'], ['1', 'Antibiótico amplio']], m: 'antibiotico' },
    paciente: { nombre: 'Paciente', ops: [['sano', 'Sano'], ['planta', 'Planta'], ['uci', 'UCI']], m: 'paciente' },
    descontaminacion: { nombre: 'Boca', ops: [['nada', 'Nada'], ['clorhexidina', 'Clorhexidina 0,12 %'], ['sod', 'SOD']], m: 'descontaminacion' },
    dia: { nombre: 'Día de SDD', ops: [['0', 'Día 0'], ['2', 'Día 2'], ['4', 'Día 4'], ['7', 'Día 7']], m: 'dia' },
    aspirar: { nombre: 'Aspirar', ops: [['0', 'Sin aspirar'], ['1', 'Aspirar el 0,13 %']], m: 'aspirar' },
    enteral: { nombre: 'Enteral', ops: [['0', 'Sin enteral'], ['1', 'Enteral completa']], m: 'enteral' },
};
function valorMando(m) { const e = estado; return m === 'antibiotico' ? String(+e.antibiotico) : m === 'aspirar' ? String(+!!e.gota) : m === 'enteral' ? String(+e.enteral) : m === 'dia' ? String(e.dia) : String(e[m]); }
function mandoHTML(t) {
    return `<p class="mur-para"><b>Compruébalo en el modelo:</b> ${t.instruccion || ''}</p>` + t.mandos.map(k => {
        const M = MANDOS[k];
        return `<div class="mur-seg" data-grupo="${k}" role="group" aria-label="${M.nombre}">${M.ops.map(([v, txt]) => `<button type="button" data-mando="${k}" data-v="${v}" aria-pressed="${valorMando(M.m) === v}">${txt}</button>`).join('')}</div>`;
    }).join('') + (t.mandos.includes('estacion') ? '<p class="mur-para">o toca la tira, a la izquierda de la lámina.</p>' : '');
}
function sincronizarMandoPregunta(cont) { cont.querySelectorAll('[data-mando]').forEach(b => b.setAttribute('aria-pressed', String(valorMando(MANDOS[b.dataset.mando].m) === b.dataset.v))); }
function accionMando(b, cont) {
    const k = b.dataset.mando, v = b.dataset.v;
    cambiar(s => {
        if (k === 'antibiotico') s.antibiotico = v === '1';
        else if (k === 'aspirar') s.gota = +v;
        else if (k === 'enteral') { s.enteral = v === '1'; if (s.enteral && s.proteccion === 'sucralfato') s.proteccion = 'nada'; }
        else if (k === 'dia') { s.sdd = true; s.dia = +v; }
        else if (k === 'estacion') s.estacion = v;
        else ordenar(s, k, v);
    }, { frase: false });
    sincronizarMandoPregunta(cont);
    if (anilloObj) anillo(anilloObj);
}

// «Para profundizar»: lo que no se pregunta, con su sitio en la ficha y en el libro
const profundizarHTML = () => PROFUNDIZAR.map(p => `<section>${p.html} <span class="mur-fuente-p">${idsDe(p.donde).map(citaDeId).filter(Boolean).map(c => citaHTML(c, { pdf: false, max: 80 })).join('')} <a class="mur-pdf" href="${p.href}" target="_blank" rel="noopener">Ver en el libro (${chipTxt(p.donde).replace('ficha · ', '')}) →</a></span></section>`).join('');

const Estudio = {
    c: 0,
    concepto(i) {
        this.c = clamp(i, 0, CONCEPTOS.length - 1);
        const k = CONCEPTOS[this.c], cont = $('concepto');
        setOcultos([], false); aplicar(estadoDe(k.estado), { frase: false });
        requestAnimationFrame(() => anillo(k.mirar || null));
        cont.innerHTML = `<div class="mur-cab-preg"><span class="mur-concepto-n">${this.c + 1}</span><h3>${k.titulo}</h3></div>
            <p class="mur-pregunta">${k.texto}</p>
            <div class="mur-mando"><p class="mur-para"><b>Tócalo:</b> ${k.hacer}</p><div class="mur-fila">${k.acciones.map((a, j) => `<button class="mur-b" type="button" data-acc="${j}" aria-pressed="false">${a.t}</button>`).join('')}</div></div>
            <p class="mur-para"><b>Mira:</b> ${k.mira}</p>
            ${verEnTexto(k.fuente)}
            <div class="mur-nav-c"><button class="mur-b" type="button" data-nav="-1" ${this.c === 0 ? 'disabled' : ''}>← Anterior</button><button class="mur-b mur-prim" type="button" data-nav="1">${this.c === CONCEPTOS.length - 1 ? 'A la Mayéutica →' : 'Siguiente →'}</button></div>`;
        entrar(cont, 'mur');
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]');
            if (a) { const ac = CONCEPTOS[this.c].acciones[+a.dataset.acc]; aplicar(estadoDe({ ...k.estado, ...ac.e }), { frase: false }); requestAnimationFrame(() => anillo(ac.mirar || k.mirar || null)); cont.querySelectorAll('[data-acc]').forEach(b => b.setAttribute('aria-pressed', String(b === a))); return; }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); subir(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve la lámina');
    },
};

/* ---------- Mayéutica: el motor común (core/mayeutica-motor.js) con los enganches de la lámina ---------- */
// Aciertos y fallos en localStorage con su clave de siempre (como el quiz: solo en este dispositivo).
const Mayeutica = crearMayeuticaModelo({
    p: 'mur', cont: () => $('preg'), clave: 'muralla-viva-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { setOcultos([], false); aplicar(estadoBase(), { frase: false }); },
    volverPor: 'La muralla de papel',
    pregunta: {
        alEmpezar: ponerModelo,
        alConsecuencia: c => { setOcultos([], false); aplicar(estadoDe(c.estado), { frase: false }); requestAnimationFrame(() => anillo(c.mirar || null)); },
        asomar,
        verEnTexto: q => verEnTexto(q.fuente),
        alCerrar: q => { if (q.despues) aplicar(estadoDe(q.despues), { frase: false }); setOcultos([]); if (q.mirarDespues) anillo(q.mirarDespues); },
        alSalir: () => { anillo(null); alTocar = null; setOcultos([], false); },
        tocar: {
            mandoHTML,
            alMostrar: (q, cont) => {
                anillo(q.tocar.mirar || null);
                alTocar = q.tocar.mandos.includes('estacion') ? est => { cambiar(e => { e.estacion = est; }, { frase: false }); sincronizarMandoPregunta(cont); } : null;
            },
            comprobar: q => q.tocar.comprobar(estado),
            ponerBueno: (q, cont) => { aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), { frase: false }); sincronizarMandoPregunta(cont); anillo(q.tocar.mirar || null); },
            alComprobar: () => { setOcultos([]); alTocar = null; },
            accion: accionMando,
        },
    },
    textos: {
        ruta: (nG, nE) => `<span><b>1.</b> Recorrido, en el orden de las fichas: <b>${nG} de guía socrática</b> (varias se responden tocando la lámina: primero predices, luego compruebas) y <b>${nE} de examen</b>, nivel MIR, con sus trampas.</span>
            <span><b>2.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>3.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span>`,
        empezar: 'Empezar el recorrido', seguir: 'Seguir',
        pie: 'El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde.',
        conModelo: 'la lámina',
        casos: 'La lámina se mueve al estado de cada paso antes de la pregunta, y el día de la hoja es el del caso. Lo nuevo de la ficha del paciente sale en rojo.',
        abrirPaciente: 'Abrir la lámina en el estado del paciente',
    },
    preguntaDePaso: paso => ({ estado: paso.estado, mirar: paso.mirar }),
    alTerminarCaso: C => aplicar(estadoDe(C.volver.estado), { frase: false }),
    abrirPaciente: C => { setModo('explorar'); aplicar(estadoDe(C.volver.estado)); elegirPestana(estado.estacion); },
});

/* Revisión automática de la forma de las preguntas (REGLAS §8), para __murPruebas() */
function revisarMayeutica() {
    const todas = [...PREGUNTAS, ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta))];
    const tests = todas.filter(x => x.tipo === 'test'), errores = todas.filter(x => x.tipo === 'error');
    const r = { fallos: [], tests: tests.length, correctaMasLarga: 0, correctaMasCorta: 0, posiciones: [0, 0, 0, 0], errores: errores.map(x => x.frases.filter(f => f.mal).length),
        destapas: todas.filter(x => x.tipo === 'destapa').length, guia: PREGUNTAS.filter(x => x.grupo === 'guia').length, examen: PREGUNTAS.filter(x => x.grupo === 'examen').length,
        casos: CASOS.length, predice: todas.filter(x => x.tocar).length, pasos: CASOS.map(c => c.pasos.length) };
    const largo = s => s.replace(/<[^>]+>/g, '').length;
    for (const x of tests) {
        const ok = x.opciones.find(o => o.ok), max = Math.max(...x.opciones.map(o => largo(o.t)));
        if (largo(ok.t) === max) r.correctaMasLarga++;
        if (largo(ok.t) === Math.min(...x.opciones.map(o => largo(o.t)))) r.correctaMasCorta++;
        r.posiciones[barajar(x.opciones, x.id).findIndex(o => o.ok)]++;
        if (x.opciones.filter(o => o.ok).length !== 1) r.fallos.push(x.id + ': una sola correcta');
        if (x.opciones.some(o => !o.ok && !(o.porque && o.porque.length > 40))) r.fallos.push(x.id + ': opción falsa sin «qué le pasaría»');
    }
    if (r.correctaMasLarga > tests.length / 3) r.fallos.push(`la correcta es la más larga en ${r.correctaMasLarga} de ${tests.length} (> 1/3)`);
    if (r.correctaMasCorta > tests.length / 3) r.fallos.push(`la correcta es la más corta en ${r.correctaMasCorta} de ${tests.length} (> 1/3)`);
    if (r.posiciones.filter(n => n > 0).length < 3) r.fallos.push('la correcta no varía de posición');
    if (r.errores.some(n => n > 2)) r.fallos.push('«encuentra el error» con más de 2 errores');
    if (!r.guia || !r.examen) r.fallos.push('faltan Guía o Examen');
    for (const c of CASOS) {
        const tipos = new Set(c.pasos.map(p => p.pregunta.tipo));
        if (!tipos.has('error') || !tipos.has('destapa')) r.fallos.push(c.id + ': falta error o destapa');
        if (c.lleva.length !== 3) r.fallos.push(c.id + ': «Lo que te llevas» no tiene 3 puntos');
        if (c.pasos.length < 5 || c.pasos.length > 8) r.fallos.push(c.id + ': de 5 a 8 pasos');
        if (!c.pasos.some(p => /giro/.test(p.momento))) r.fallos.push(c.id + ': sin giro');
        for (const ob of c.objetivos || []) {
            if (!ob.texto || !ob.si || !ob.no || !ob.pasos?.length || ob.pasos.some(i => !c.pasos[typeof i === "number" ? i : i.paso])) r.fallos.push(c.id + ': objetivo ' + ob.id + ' incompleto');
            if (!idsDe(ob.fuente).some(id => rutaDe(id))) r.fallos.push(c.id + ': objetivo ' + ob.id + ' sin «Ver en el texto»');
            for (const id of idsDe(ob.fuente)) if (!document.getElementById(id)) r.fallos.push(`${c.id}: la fuente ${id} no existe`);
        }
        for (const p of c.pasos) for (const o of p.pregunta.opciones || []) if (o.consecuencia) {
            const k = o.consecuencia;
            if (o.ok || !k.texto || !k.fuente || !k.estado) r.fallos.push(p.pregunta.id + ': consecuencia incompleta');
            else for (const id of idsDe(k.fuente)) if (!document.getElementById(id)) r.fallos.push(`${p.pregunta.id}: la fuente ${id} no existe`);
        }
        if (!rutaDe(c.volver.ancla)) r.fallos.push(c.id + ': «Repasar en la ficha» sin destino');
        for (const p of c.pasos) { const m = /D[ií]a (\d+)/.exec(p.momento); if (m && estadoDe(p.estado).dia !== +m[1]) r.fallos.push(c.id + ': el día del paso no coincide con la hoja (' + p.momento + ')'); }
    }
    if (todas.some(x => !x.fuente)) r.fallos.push('pregunta sin fuente');
    for (const x of [...todas, ...CONCEPTOS]) if (!idsDe(x.fuente).some(id => rutaDe(id))) r.fallos.push((x.id || x.titulo) + ': «Ver en el texto» sin destino');
    for (const x of todas) for (const id of idsDe(x.fuente)) if (!document.getElementById(id)) r.fallos.push(`${x.id}: la fuente ${id} no existe`);
    const ids = todas.map(x => x.id); if (new Set(ids).size !== ids.length) r.fallos.push('ids de pregunta repetidos');
    for (const x of todas.filter(x => x.tocar)) { if (x.tocar.comprobar(estadoDe(x.estado))) r.fallos.push(x.id + ': el modelo ya enseña la respuesta antes de tocar'); if (!x.tocar.comprobar(estadoDe({ ...x.estado, ...x.tocar.bueno }))) r.fallos.push(x.id + ': «bueno» no pasa la comprobación'); }
    return r;
}

/* ============================================================
   La explicación guiada de cada estado (core/explicacion-guiada.js): sus pasos van en el dock, en el sitio de la hoja
   de órdenes; cada paso pone la escena como lo cuenta (paso.e sobre el estado) y señala lo que cuenta (el anillo de
   la escena con paso.mirar, o un marco con paso.resalta). «Ver en la ficha» lleva al párrafo exacto (core/citas.js).
   ============================================================ */
let claveActual = null, guia = null;
const APLICAR_GUIA = { frase: false }, SUBIR_A = 'tablero';
const Guia = { get activo() { return !!guia && guia.activo; } };
// ¿Está la escena en este estado con nombre?
const enEstado = k => !!ESTADOS[k] && JSON.stringify(estado) === JSON.stringify(estadoDe(ESTADOS[k].e));
function sincronizarGuia() {
    if (claveActual && !enEstado(claveActual) && !Guia.activo) claveActual = null;
    const g = $('guia-abrir');
    if (g) { g.disabled = !claveActual || !GUIAS[claveActual]; $('guia-de').textContent = claveActual ? `«${ESTADOS[claveActual].nombre}»` : 'Elige antes un estado'; }
    enRaiz('#mur-chips-estado [data-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === claveActual)));
}
function crearGuia() {
    guia = crearExplicacion({
        cont: $('dock-guia'), raiz,
        alPaso(paso) {
            const p = copia(ESTADOS[guia.datos.clave].e);
            for (const [k, v] of Object.entries(paso.e || {})) p[k] = v && typeof v === 'object' && !Array.isArray(v) ? Object.assign(p[k] || {}, copia(v)) : copia(v);
            aplicar(estadoDe(p), APLICAR_GUIA);
            requestAnimationFrame(() => anillo(paso.mirar || null));
            subirEscena(paso);
        },
        alSalir(d) {
            anillo(null);
            $('dock-explorar').hidden = modo !== 'explorar';
            if (d && d.clave && modo === 'explorar') { ponerEnEstado(d.clave); requestAnimationFrame(() => $('guia-abrir').focus({ preventScroll: true })); }
            sincronizarGuia();
        },
        citaOpciones: { clase: 'cita', max: 90 },
    });
}
// La escena (sin la cama de arriba) queda arriba; el dock, con la explicación, abajo
function subirEscena(paso) {
    const r = $(typeof SUBIR_A === 'function' ? SUBIR_A(paso) : SUBIR_A).getBoundingClientRect();
    if (Math.abs(r.top) > 4) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function explicar(clave) {
    if (!GUIAS[clave] || modo !== 'explorar') return;
    if (claveActual !== clave || !enEstado(clave)) ponerEnEstado(clave);
    claveActual = clave;
    $('dock-explorar').hidden = true;
    guia.abrir({ clave, titulo: ESTADOS[clave].nombre, pasos: GUIAS[clave], fuentes: ESTADOS[clave].fuentes });
    sincronizarGuia();
}

/* ============================================================
   Abrir en un estado (el menú de estados del dock, los botones de las fichas, el menú de Libros y el buscador)
   ============================================================ */
function ponerEnEstado(clave) {
    claveActual = ESTADOS[clave] ? clave : null;
    const s = ESTADOS[clave] || ESTADOS.sano;
    aplicar(estadoDe(s.e), { frase: false });
    const c = s.clave, v = copia(estado); if (c) v[c] = estadoBase()[c];
    const [fh, ff] = c ? fraseDe(v, estado) : fraseEstacion(estado.estacion);
    fraseActual = '';
    decir(`<b>${s.nombre}.</b> ` + fh, ff);
    elegirPestana(PESTANA_DE[c] || estado.estacion);
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú o ventana de la
// cama): la cama 7 grande y su zoom de entrada; con estado, la cama compacta y la lámina en ese estado.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('mur-volver'), raiz, origen);
    if (guia && guia.activo) guia.cerrar();
    if (modo !== 'explorar') setModo('explorar');
    if (clave && ESTADOS[clave]) ponerEnEstado(clave);
    cama?.mostrar({ intro: !clave });
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
function leyendas() {
    const ley = [['h', 'H⁺: el ácido del estómago'], ['hco3', 'HCO₃⁻: el moco que protege (pH 7)'], ['rbc', 'hematíes'], ['cito', 'citoquinas: mediadores de la inflamación'], ['agua', 'saliva'],
        ['bacilo', 'bacilo gramnegativo (<i>Salmonella</i>, <i>Pseudomonas</i>)'], ['coco', 'coco grampositivo (estafilococos)'], ['huso', 'flora residente (anaerobios)'], ['linfocito', 'linfocito del GALT'], ['cadena', 'ácidos grasos de cadena corta']];
    $('leyenda').innerHTML = ley.map(([k, txt]) => `<li>${iconoParticula(k, 16)}<span>${txt}</span></li>`).join('')
        + `<li>${iconoParticula('bacilo', 16, { halo: '--accent-red' })}<span>con halo: multirresistente</span></li><li>${iconoParticula('coco', 16, { hueco: true })}<span>discontinuo: muerto o lo que falta</span></li>`;
    $('laminas').innerHTML = LAMINAS.map(([f, n, c]) => `<figure class="mur-lam-item"><div class="article-figure mur-lam"><img loading="lazy" src="js/modules/libros/img/${f}" alt="${n} del libro: ${c}"></div><figcaption>${n}</figcaption></figure>`).join('');
    $('prof-lista').innerHTML = profundizarHTML();
    $('prof-may').innerHTML = profundizarHTML();
    $('chips-estado').innerHTML = Object.entries(ESTADOS).map(([k, st]) => `<button type="button" data-estado="${k}" aria-pressed="false">${st.nombre}</button>`).join('');
    $('m-estado').innerHTML = '<option value="">Ir a un estado con nombre…</option>' + Object.entries(ESTADOS).map(([k, s]) => `<option value="${k}">${s.nombre}</option>`).join('');
}
export function init() {
    raiz = document.getElementById('mur-raiz');
    if (!raiz) return null;
    initEscena();
    leyendas(); engancharDock(); crearGuia();
    raiz.addEventListener('click', ev => { const g = ev.target.closest('[data-mur-guia]'); if (g && modo === 'explorar') explicar(g.dataset.murGuia); });
    $('guia-abrir').addEventListener('click', () => { if (claveActual) explicar(claveActual); });
    Mayeutica.cargar();
    aplicar(estadoBase(), { frase: false }); decir(...fraseEstacion('intestino'));
    // La cama 7: su zoom de entrada abre la lámina; el respirador es una orden de la hoja
    cama = montarCama7($('cama7'), 'muralla');
    raiz.addEventListener('c7-entrada', () => { revelar(); fraseActual = ''; decir(...fraseEstacion(estado.estacion)); });
    raiz.addEventListener('c7-aparato', ev => { if (ev.detail === 'respirador') decir('El respirador: en esta escena, la ventilación mecánica es una orden de la hoja (pestaña Paciente).', ''); });

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--mur-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    // La vista se ve o deja de verse (todas las vistas están en el DOM): medir al aparecer.
    let anchoVisible = 0, motionPedido = false;
    const caja = $('escena');
    new ResizeObserver(() => {
        const a = Math.round(caja.clientWidth);
        document.body.classList.toggle('mur-activo', a > 0);
        if (!a) { anchoVisible = 0; cama?.parar(); return; }
        if (!anchoVisible) { const v = document.getElementById('muralla-viva-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, sin zoom ni balanza animada */ }); }
        if (anilloObj) anillo(anilloObj);
        arrancar();
    }).observe(caja);
    new IntersectionObserver(es => ponerVisible(es[0].isIntersecting)).observe(caja);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado, los estados pintados, la Mayéutica y el bucle.
    window.__murGuias = () => ({ clave: claveActual, guia: guia && guia.activo ? { clave: guia.datos.clave, paso: guia.paso, n: guia.datos.pasos.length } : null,
        citas: Object.entries(GUIAS).flatMap(([k, ps]) => ps.flatMap(pa => [].concat(pa.cita || []).map(c => ({ estado: k, ficha: c.ficha, id: c.id, exacta: citaExacta(c), ficha_existe: !!document.getElementById(c.ficha), pdf: hrefPdf(c) })))) });
    window.__murPruebas = () => {
        const r = pruebasMuralla();
        r.regla = raiz.querySelector('#mur-lamina [data-regla]')?.dataset.regla || null;
        r.estados = {};
        const guardado = copia(estado);
        for (const k of Object.keys(ESTADOS)) {
            try { aplicarModelo(estadoDe(ESTADOS[k].e), { sinAnim: true }); r.estados[k] = !!raiz.querySelector('#mur-lamina [data-estacion]'); if (!r.estados[k]) { r.fallos.push('estado ' + k); r.todoCoincide = false; } }
            catch (err) { r.estados[k] = String(err); r.fallos.push('estado ' + k); r.todoCoincide = false; }
        }
        aplicarModelo(guardado, { sinAnim: true }); sincronizarMandos();
        r.mayeutica = revisarMayeutica();
        if (r.mayeutica.fallos.length) { r.todoCoincide = false; r.fallos.push(...r.mayeutica.fallos); }
        const celdas = [...raiz.querySelectorAll('#mur-tablero .mur-celda')].map(c => ({ k: c.querySelector('.mur-k').textContent, v: c.querySelector('b').textContent }));
        return { ...r, estado: copia(estado), D: derivar(estado), modo, fase: Mayeutica.fase, ocultos: [...ocultos], celdas, bucle: estadoBucle(), vaciarFotogramas,
            guardado: Mayeutica.prog.g.leer(), cama: $('cama7').classList.contains('c7-compacta') ? 'compacta' : 'grande' };
    };

    return { abrir: abrirEstado };
}
