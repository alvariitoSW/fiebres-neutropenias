// El telar de la trombina (Libros → Marino → Fundamentos, cap. 5: tromboprofilaxis). Escena de la pierna de
// «La cama 7». Interfaz del modelo vivo: la cama 7 (cama7.js), la frase viva, la hoja de órdenes (dock de 5 pestañas:
// paciente, fármaco, riñón, pierna y reloj), los toques en la lámina, la caja de la calculadora de la ficha, el
// interruptor Explorar | Conceptos | Mayéutica y la capa de estudio (guía socrática y examen, repaso de lo fallado y
// 3 casos clínicos). Mismo patrón que la muralla de papel (muralla-viva.js). La escena vive en telar-vivo-escena.js;
// los datos, en js/data/telar-vivo-data.js. Viene de la maqueta aprobada autonomo/maquetas/b1-telar.html (vuelta 2).
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="telarVivo" data-telar-vivo="tih">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica guarda aciertos y fallos en localStorage (como el quiz y la muralla), con
// clave propia y siempre dentro de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { escapeHtml } from '../../core/ui.js';
import { crearMayeuticaModelo, barajar, rutaDe, atributosFicha, entrar, pintarDock as pintarDockComun } from '../../core/mayeutica-motor.js';
import { iconoParticula } from '../../core/particulas.js';
import { montarCama7 } from './cama7.js';
import {
    ESTADOS, RIESGOS, FARMACOS, CONCEPTOS, PREGUNTAS, CASOS, PROFUNDIZAR, LAMINAS, NEURO, NEURO_NOMBRE, ORDEN_NEURO, ES_HBPM, ES_HEPARINA,
    estadoBase, estadoDe, copia, clamp, chipTxt, profilaxis, pruebasTelar, PDF,
} from '../../data/telar-vivo-data.js';
import {
    $, estado, D, REDUCIR, ocultos, ganchos, initEscena, aplicarModelo, setOcultos, arrancar, ponerVisible, anillo, anilloObj,
    estadoBucle, vaciarFotogramas, engranaje, llave, xRojaIcono,
} from './telar-vivo-escena.js';

let raiz = null, cama = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   «Ver en el texto» y el chip de origen. Una fuente es «mar-elemento · mar-elemento (p. N)»: cada id lleva a su sitio
   de la ficha (enlace cruzado de siempre) con el nombre que tiene en el texto; el chip dice solo «ficha»,
   «fisiología general» o «ilustrativo» y la página del PDF. Ningún id interno a la vista.
   ============================================================ */
const ALIAS = { 'Fig. 5.2': 'mar-img-5-2', 'Fig. 5.1': 'mar-img-5-1' };
const limpio = t => (t || '').replace(/\s+/g, ' ').replace(/[+−]\s*$/, '').trim();
const tituloFicha = tab => limpio(tab.querySelector('h3')?.textContent || tab.id).split(':')[0];
function etiquetaDe(el) {
    if (el.dataset.nombre) return el.dataset.nombre;
    if (el.matches('dl')) return limpio(el.querySelector('dt')?.textContent);
    if (el.matches('.micro-prof-item')) return limpio(el.querySelector('.micro-prof-head span')?.textContent).replace(/^[^\p{L}\d«(]+/u, '');
    if (el.matches('.article-figure')) return limpio(el.querySelector('.article-figure-caption')?.textContent).split('—')[0].trim();
    if (el.matches('details')) return limpio(el.querySelector('summary')?.textContent).replace(/^📝\s*/, '');
    if (el.matches('.agua-simulador')) return limpio(el.querySelector('h4')?.textContent).replace(/^🧮\s*/, '');
    const num = el.id.match(/-(tabla|fig|img)-(\d+)-(\d+)$/);
    if (num) return `${num[1] === 'tabla' ? 'Tabla' : 'Figura'} ${num[2]}.${num[3]}`;
    const t = limpio(el.textContent);
    return t.length > 40 ? t.slice(0, 38).replace(/\s+\S*$/, '') + '…' : t;
}
// Los ids (y los alias) que cita una fuente, en orden y sin repetir
function idsDe(fuente) {
    const ids = [];
    for (const t of String(fuente || '').split(' · ')) {
        const m = t.trim().match(/^#?(mar-[a-z0-9-]+)/);
        if (m) ids.push(m[1]);
        for (const [k, id] of Object.entries(ALIAS)) if (t.includes(k)) ids.push(id);
    }
    return [...new Set(ids)];
}
function enlacesTexto(fuente) {
    const vistosTab = new Set(), botones = [];
    for (const id of idsDe(fuente)) {
        const r = rutaDe(id); if (!r) continue;
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : null;
        let texto = vistosTab.has(r.tab.id) ? (sub || tituloFicha(r.tab)) : tituloFicha(r.tab) + (sub ? ' · ' + sub : '');
        vistosTab.add(r.tab.id);
        texto = texto.length > 64 ? texto.slice(0, 62) + '…' : texto;
        botones.push(`<button type="button" class="tel-ir-texto" ${atributosFicha(r)}>${escapeHtml(texto)} →</button>`);
    }
    return botones.join(' ');
}
const esIlu = f => /ilustrativ|fisiología general/.test(f) && !/mar-/.test(f);
const chipSpan = f => f ? `<span class="tel-org${esIlu(f) ? ' tel-ilu' : ''}">${chipTxt(f)}</span>` : '';
const verEnTexto = fuente => `<p class="tel-fuente-p">Ver en el texto: ${enlacesTexto(fuente)} ${chipSpan(fuente)}</p>`;
// El chip de la frase viva: un enlace a su sitio en la ficha, si lo tiene
function chip(f) {
    if (!f) return '';
    const r = idsDe(f).map(rutaDe).find(Boolean);
    return r ? `<button type="button" class="tel-org tel-org-ir${esIlu(f) ? ' tel-ilu' : ''}" ${atributosFicha(r)}>${chipTxt(f)}</button>` : chipSpan(f);
}

/* ============================================================
   Frase viva (con su origen) y aplicar un estado
   ============================================================ */
let fraseActual = '';
function decir(html, fuente) {
    const fraseEl = $('frase');
    const nuevo = `${html} ${chip(fuente)}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('lamina').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
}
function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo, op);
    sincronizarMandos();
    if (op.frase !== false && modo === 'explorar') { const r = fraseDe(viejo, nuevo); if (r) decir(...r); }
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

/* ---------- La frase viva: traduce cada orden ---------- */
const FRASE_INICIO = () => ['La femoral de la cama 7 y, en la lupa, el bolsillo de una válvula. Enciende la inflamación, pon un fármaco, pásalo por el riñón… y prueba a dejarle inmóvil.', 'mar-tev-intro (p. 1)'];
const FRASE_FARMACO = {
    hnf: ['HNF: cadenas <span class="hl">largas y de largos distintos</span> (3.000-30.000 Da). Atan a la vez la AT y la trombina: frenan el Xa y la IIa, y el anti-IIa es <span class="hl">10 veces</span> el anti-Xa. Cada cadena mide distinto: <span class="hl-rojo">efecto variable</span>.', 'mar-hnf · mar-img-5-2 (p. 4-6)'],
    enoxaparina: ['Enoxaparina (HBPM): cadenas <span class="hl">cortas y uniformes</span> (4.500 Da). Despiertan la AT contra el Xa, pero <span class="hl">apenas alcanzan la trombina</span>: respuesta predecible. Biodisponibilidad del 90 % frente al 15-30 % de la HNF.', 'mar-hbpm (p. 6)'],
    dalteparina: ['Dalteparina (HBPM): igual de eficaz que la enoxaparina y <span class="hl-verde">sin ajuste renal</span>. Cadenas cortas: el Xa sí, la trombina apenas.', 'mar-hbpm (p. 6-7)'],
    fondaparinux: ['Fondaparinux: <span class="hl">5 cuentas</span>, el pentasacárido que une la heparina a la AT. Solo frena el Xa. Vida media de 17 h; lo elimina el riñón.', 'mar-fondaparinux (p. 8)'],
    apixaban: ['Apixabán: <span class="hl">una llave sin AT</span> que bloquea el Xa directamente (la X de la Fig. 5.2). Los ACOD actúan en 1-4 h y no necesitan controles.', 'mar-acod-puntos · mar-img-5-2 (p. 6, 8)'],
    rivaroxaban: ['Rivaroxabán: <span class="hl">una llave sin AT</span> sobre el Xa. Aprobado en la enfermedad médica aguda, pero un metaanálisis de los ACOD frente a HBPM en estos pacientes ve la misma eficacia <span class="hl-rojo">con más sangrado</span>.', 'mar-acod-puntos (p. 8-9)'],
    dabigatran: ['Dabigatrán: la llave va a <span class="hl">la trombina</span>: la tejedora se para.', 'mar-acod-puntos · mar-img-5-2 (p. 6, 8)'],
    warfarina: ['Warfarina: <span class="hl-rojo">tarda 5-7 días</span>, muchas interacciones y controles de INR: ya no se prefiere. En la insuficiencia renal grave es el único oral seguro. Su mecanismo no está en la ficha: no se dibuja.', 'mar-acod-puntos (p. 8-9)'],
};
function fraseDosis(e) {
    const d = profilaxis(e.farmaco, e.clcr, e.imc), f = FARMACOS[e.farmaco];
    let txt = `${f.largo[0].toUpperCase() + f.largo.slice(1)} con ClCr ${e.clcr} e IMC ${e.imc}: <span class="${d.estado === 'ok' ? 'hl-verde' : d.estado === 'warn' ? 'hl' : 'hl-rojo'}">${d.corta}</span>.`;
    if (D.notaFonda) txt += ' La <span class="hl-purpura">tabla y el texto discrepan</span> aquí: se muestran las dos.';
    if (d.aviso15) txt += ' La p. 11: con ClCr &lt;15, solo HNF o warfarina.';
    if (e.farmaco === 'enoxaparina' && e.clcr < 20) txt += ' Con ClCr &lt;20, la HNF parece la mejor opción.';
    return [txt, 'mar-tabla-5-2 · mar-tabla-5-3 · mar-profilaxis-calc (p. 4, 7-9)'];
}
const FRASE_VISTA = {
    tih: () => ['TIH: la heparina se une al <span class="hl">factor plaquetario 4</span>; el complejo atrae <span class="hl-rojo">IgG</span> que activan la plaqueta: <span class="hl-rojo">trombosis y trombocitopenia</span>. No depende de la dosis.', 'mar-hnf (p. 5)'],
    reloj: () => ['El reloj neuroaxial: horas desde la última dosis antes de una punción o un catéter epidural. El riesgo: un hematoma espinal y la parálisis.', 'mar-neuroeje (p. 9-10)'],
};
function fraseDe(v, n) {
    if (v.vista !== n.vista) {
        if (FRASE_VISTA[n.vista]) return FRASE_VISTA[n.vista]();
        if (v.vista !== 'telar') return FRASE_INICIO();
    }
    if (n.vista === 'tih' && n.farmaco !== v.farmaco) {
        if (n.farmaco === 'fondaparinux') return ['Fondaparinux: el libro dice que <span class="hl">puede usarse para la profilaxis con TIH sospechada o previa</span> (y se ha usado en la confirmada), y que el tratamiento aprobado de la TIH es el <span class="hl">argatrobán</span>. Cómo se relaciona con el FP4, no lo dice: no se dibuja.', 'mar-fondaparinux (p. 8)'];
        if (ES_HBPM(n.farmaco)) return ['HBPM: se une menos a las plaquetas: <span class="hl">TIH en el 0,2 %</span>, frente al 2,6 % con HNF (diez veces menos). Menos, no cero.', 'mar-hbpm (p. 7)'];
        if (n.farmaco === 'hnf') return ['HNF: se une al FP4 (los lazos son una imagen): <span class="hl-rojo">TIH en el 2,6 %</span>, también con dosis profilácticas.', 'mar-hnf · mar-hbpm (p. 5, 7)'];
        return ['Sin heparina no hay complejo con el FP4.', 'mar-hnf (p. 5)'];
    }
    if (n.riesgo !== v.riesgo) { const r = RIESGOS[n.riesgo]; return r.frase ? [r.frase, r.fuente] : FRASE_INICIO(); }
    if (n.inmovil !== v.inmovil) return n.inmovil
        ? [`Tres semanas inmóvil, y <span class="hl">los hematíes siguen al mismo ritmo</span>: el sistema es cerrado y, con el gasto normal, el retorno venoso también lo es. ${n.inflamacion ? 'La red crece por la inflamación, no por la cama.' : 'El telar no teje.'} Según el autor, creer lo contrario <span class="hl-rojo">lleva a usar anticoagulantes de más</span>.`, 'mar-inmovilidad (p. 13)']
        : ['Se levanta. El flujo de la femoral no cambia: lo marca el gasto.', 'mar-inmovilidad (p. 13)'];
    if (n.inflamacion !== v.inflamacion) return n.inflamacion
        ? ['Inflamación (las citoquinas, en trébol): <span class="hl-rojo">la tejedora se pone a trabajar</span> con el flujo intacto. Inflamación y coagulación están muy unidas: según el autor, lo que dispara la TVP en el alto riesgo es probablemente la inflamación.', 'mar-inmovilidad (p. 13) · ritmo ilustrativo']
        : ['Sin inflamación, el telar se para. La red que ya hay se deshace despacio (ritmo ilustrativo).', 'mar-inmovilidad (p. 13) · ilustrativo'];
    if (n.gastoBajo !== v.gastoBajo) return n.gastoBajo
        ? ['Gasto bajo: <span class="hl">aquí sí hay estasis</span>, el flujo se enlentece. Es la única estasis que dibuja el modelo (su 35 %, ilustrativo).', 'fisiología general · 35 % ilustrativo']
        : ['Gasto normal: el retorno venoso, también.', 'mar-inmovilidad (p. 13)'];
    if (n.tih !== v.tih) return n.tih ? FRASE_VISTA.tih() : FRASE_INICIO();
    if (n.farmaco !== v.farmaco) return n.farmaco ? FRASE_FARMACO[n.farmaco] : ['Sin fármaco: las antitrombinas, dormidas.', 'ilustrativo'];
    if (n.antiXa !== v.antiXa) return !n.antiXa ? ['Sin medir el anti-Xa.', ''] : ES_HBPM(n.farmaco)
        ? ['Anti-Xa: no de rutina, pero útil si la dosis fija es dudosa (obesidad). Objetivo profiláctico: <span class="hl">pico de 0,2-0,5 UI/mL</span>. En el trauma grave se recomienda (la función renal cambia mucho). El valor de un paciente no se simula.', 'mar-hbpm · mar-esc-trauma (p. 7, 12)']
        : ['El anti-Xa se mide con una HBPM: elige enoxaparina o dalteparina.', 'mar-hbpm (p. 7)'];
    if ((n.clcr !== v.clcr || n.imc !== v.imc) && !n.farmaco) return ['Elige un fármaco: el riñón y el IMC cambian su dosis, no el telar.', 'mar-tabla-5-2 (p. 4)'];
    if (n.clcr !== v.clcr || n.imc !== v.imc) return fraseDosis(n);
    if (n.mecanica !== v.mecanica || n.diastolica !== v.diastolica) {
        if (n.mecanica === 'cni' && D.cni?.aprietaArteria) return ['<span class="hl-rojo">La CNI aprieta a 35-40 mmHg en el tobillo, por encima de una diastólica de 34</span>: comprime la arteria. La presión nunca debe superar la diastólica. (El pie pálido, fisiología general.)', 'mar-cni-pegas (p. 10)'];
        if (n.mecanica === 'cni') return ['CNI: 2-3 cámaras que se inflan <span class="hl">de distal a proximal</span>, 35-40 mmHg en el tobillo y 20 en el muslo, <span class="hl">cada 10 s</span>. Mueve sangre y además <span class="hl-verde">activa la fibrinólisis</span> (los puntos verdes).', 'mar-mecanica (p. 10) · reparto del ciclo ilustrativo'];
        if (n.mecanica === 'medias') return ['Medias: <span class="hl">18 mmHg en el tobillo y 8 en el muslo</span>, un gradiente de 10. El método menos eficaz: <span class="hl-rojo">nunca solas</span> en el hospitalizado.', 'mar-mecanica (p. 10)'];
        if (n.diastolica !== v.diastolica) return [n.diastolica < 35 ? 'Diastólica de 34 mmHg: importa con la CNI. Pruébala.' : 'Diastólica de 70: la CNI no la supera.', 'mar-cni-pegas (p. 10)'];
        return ['Sin profilaxis mecánica.', ''];
    }
    if (n.filtro !== v.filtro) return n.filtro
        ? ['Filtro de vena cava: atrapa los émbolos que suben, pero <span class="hl-rojo">la red de abajo sigue creciendo</span>. No previene la TVP: no es profilaxis.', 'mar-filtro-vci (p. 11)']
        : ['Sin filtro: lo que se suelta sube al pulmón.', 'mar-tev-intro (p. 1)'];
    if (n.horas !== v.horas) {
        const listos = ORDEN_NEURO.filter(k => D.reloj[k]).map(k => NEURO_NOMBRE[k].toLowerCase()), esperar = ORDEN_NEURO.filter(k => !D.reloj[k]).map(k => `${NEURO_NOMBRE[k].toLowerCase()} (≥${NEURO[k]} h)`);
        return [`A las ${n.horas} h: ${listos.length ? `<span class="hl-verde">ya se puede</span> con ${listos.join(', ')}` : 'aún con ninguno'}${esperar.length ? `; <span class="hl-rojo">esperar</span> con ${esperar.join(', ')}` : ''}. Función renal normal o algo reducida.`, 'mar-neuroeje (p. 9-10)'];
    }
    return null;
}

/* ============================================================
   Toques en la lámina y en la cama
   ============================================================ */
const TOQUES = {
    pierna: () => ['La femoral y la ilíaca: ahí se forman sobre todo los trombos, <span class="hl-rojo">silentes hasta que embolizan</span>. Los hematíes suben al ritmo del gasto: con el gasto normal, el retorno venoso también lo es.', 'mar-tev-intro · mar-inmovilidad (p. 1, 13)'],
    lupa: () => estado.vista !== 'telar' ? FRASE_VISTA[estado.vista]() : ['La lupa: el bolsillo de una válvula, la Fig. 5.2 hecha máquina. El <span class="hl">Xa</span> convierte la protrombina (II) en <span class="hl">trombina (IIa)</span>, y la trombina teje la fibrina: la red atrapa hematíes. La <span class="hl-azul">antitrombina</span> es la guardiana.', 'mar-hnf · mar-img-5-2 (p. 4-6)'],
    rinon: () => estado.farmaco ? fraseDosis(estado) : ['El riñón: la enoxaparina y el fondaparinux los elimina el riñón; la HNF no tiene ajuste renal. Elige un fármaco y mira si lo acumula.', 'mar-hbpm · mar-fondaparinux · mar-tabla-5-2 (p. 4, 7-8)'],
};
let alTocar = null;
function tocarLamina(ev) {
    const t = ev.target.closest('[data-toca]'); if (!t) return;
    if (TOQUES[t.dataset.toca] && modo === 'explorar') decir(...TOQUES[t.dataset.toca]());
}
// La cama 7: el zoom de entrada abre la lámina por la pierna
function revelar() {
    const esc = $('escena');
    if (REDUCIR || !window.Motion) return;
    window.Motion.animate(0, 1, { duration: 0.8, ease: 'easeOut', onUpdate: v => { esc.style.clipPath = `circle(${+(8 + v * 120).toFixed(2)}% at 17% 36%)`; } }).finished.then(() => { esc.style.clipPath = ''; });
}

/* ============================================================
   Dock: la hoja de órdenes
   ============================================================ */
function ordenar(s, m, v) {
    const aTelar = () => { s.vista = 'telar'; s.tih = false; };
    if (m === 'riesgo') { s.riesgo = v; s.inflamacion = !!RIESGOS[v].inflama; aTelar(); }
    else if (m === 'inflamacion' || m === 'inmovil') { s[m] = !s[m]; aTelar(); }
    else if (m === 'gasto') { s.gastoBajo = !s.gastoBajo; aTelar(); }
    else if (m === 'tih') { s.tih = !s.tih; s.vista = s.tih ? 'tih' : 'telar'; if (s.tih && !ES_HEPARINA(s.farmaco)) s.farmaco = 'hnf'; }
    else if (m === 'farmaco') { s.farmaco = v || null; if (s.vista === 'reloj') s.vista = s.tih ? 'tih' : 'telar'; if (!ES_HBPM(s.farmaco)) s.antiXa = false; }
    else if (m === 'antixa') { s.antiXa = !s.antiXa; if (s.antiXa && !ES_HBPM(s.farmaco)) s.farmaco = 'enoxaparina'; }
    else if (m === 'clcr' || m === 'imc') { s[m] = +v; if (s.vista === 'reloj') s.vista = s.tih ? 'tih' : 'telar'; }
    else if (m === 'mecanica') { s.mecanica = v; aTelar(); }
    else if (m === 'diastolica') { s.diastolica = +v; aTelar(); }
    else if (m === 'filtro') { s.filtro = !s.filtro; aTelar(); }
    else if (m === 'horas') { s.horas = +v; s.vista = 'reloj'; }
}
const pestanaDe = st => st.vista === 'reloj' ? 'reloj' : st.vista === 'tih' ? 'paciente' : st.mecanica !== 'nada' || st.filtro ? 'pierna' : st.clcr !== 90 || st.imc !== 25 ? 'rinon' : st.farmaco ? 'farmaco' : 'paciente';
function elegirPestana(tab) {
    enRaiz('.tel-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.telTab === tab)));
    enRaiz('#tel-dock-explorar .tel-dock-panel').forEach(p => { p.hidden = p.dataset.telPanel !== tab; });
}
function pulsado(m, v) {
    const e = estado;
    switch (m) {
        case 'gasto': return e.gastoBajo; case 'antixa': return e.antiXa;
        case 'farmaco': return (v || null) === e.farmaco;
        case 'clcr': case 'imc': case 'diastolica': case 'horas': return String(e[m]) === v;
        case 'mecanica': return e.mecanica === v;
        default: return !!e[m];
    }
}
function sincronizarMandos() {
    enRaiz('#tel-dock-explorar [data-m]').forEach(b => b.setAttribute('aria-pressed', String(pulsado(b.dataset.m, b.dataset.v))));
    $('m-riesgo').value = estado.riesgo;
}
function engancharDock() {
    $('dock-explorar').addEventListener('click', ev => {
        const b = ev.target.closest('[data-m]'); if (!b || b.disabled) return;
        cambiar(s => ordenar(s, b.dataset.m, b.dataset.v));
    });
    $('m-riesgo').addEventListener('change', ev => cambiar(s => ordenar(s, 'riesgo', ev.target.value)));
    $('m-estado').addEventListener('change', ev => { const k = ev.target.value; if (!k) return; ponerEnEstado(k); ev.target.value = ''; });
    enRaiz('.tel-dock-tabs button').forEach(b => b.addEventListener('click', () => {
        const tab = b.dataset.telTab;
        elegirPestana(tab);
        if (tab === 'reloj' && estado.vista !== 'reloj') cambiar(e => { e.vista = 'reloj'; });
        else if (tab !== 'reloj' && estado.vista === 'reloj') cambiar(e => { e.vista = e.tih ? 'tih' : 'telar'; });
    }));
    $('vista-cerrar').addEventListener('click', () => {
        cambiar(e => { e.vista = 'telar'; e.tih = false; });
        if (raiz.querySelector('.tel-dock-tabs [aria-selected="true"]')?.dataset.telTab === 'reloj') elegirPestana('paciente');
    });
    $('frase').addEventListener('click', ev => { if (ev.target.closest('[data-especialidad]')) return; $('frase').classList.toggle('tel-abierta'); });
    $('lamina').addEventListener('click', tocarLamina);
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
}

/* ---------- La caja de la calculadora de la ficha (debajo de la lámina) ---------- */
function pintarDosis() {
    const e = estado, box = $('dosis');
    if (!e.farmaco || e.vista === 'reloj' || ocultos.has('dosis')) { box.hidden = true; return; }
    box.hidden = false; box.className = 'tel-dosis tel-' + D.dosis.estado;
    const r = rutaDe('mar-profilaxis-calc');
    let h = `<span class="tel-cab">Lo que diría la calculadora de la ficha · ClCr ${e.clcr} · IMC ${e.imc}</span>${D.f.largo[0].toUpperCase() + D.f.largo.slice(1)}: ${D.dosis.html}`;
    if (e.farmaco === 'enoxaparina' && e.clcr < 20) h += ' <span class="tel-gris">El texto añade: con ClCr &lt;20, la HNF parece la mejor opción (p. 7).</span>';
    if (D.notaDalte) h += ' <span class="tel-gris">La Tabla 5.2 (p. 4) y el texto (p. 7) dicen «sin ajuste»; la p. 11, no. No se elige.</span>';
    if (D.notaFonda) h += ' <span class="tel-gris">Nota de fidelidad: la tabla (35-50) y el texto (20-50) discrepan; se dan las dos.</span>';
    if (e.antiXa) h += ES_HBPM(e.farmaco) ? '<br><b>Anti-Xa</b>: no de rutina; útil si la dosis fija es dudosa (obesidad). Objetivo profiláctico: pico de <b>0,2-0,5 UI/mL</b>. El valor de este paciente no se simula.' : '<br>El anti-Xa se mide con una HBPM.';
    h += ` ${r ? `<button type="button" class="tel-org tel-org-ir" ${atributosFicha(r)}>${chipTxt('mar-profilaxis-calc')} · abrir la calculadora</button>` : chipSpan('mar-profilaxis-calc')}`;
    box.innerHTML = h;
}

/* ============================================================
   Modos: Explorar | Conceptos | Mayéutica
   ============================================================ */
let modo = 'explorar';
function subir() {
    const r = raiz.getBoundingClientRect();
    if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function setModo(m) {
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('tel-estudio', m !== 'explorar');
    raiz.classList.toggle('tel-mayeutica', m === 'preguntas');   // la entradilla daría respuestas
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    $('cama7').hidden = m !== 'explorar';
    if (m !== 'explorar') cama?.parar();
    alTocar = null; anillo(null); setOcultos([], false);
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    else if (m === 'preguntas') Mayeutica.entrar();
    else { aplicar(estado, { frase: false }); fraseActual = ''; decir(...(fraseDe(estadoBase(), estado) || FRASE_INICIO())); elegirPestana(pestanaDe(estado)); }
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
    aplicar(estadoDe(q.estado), { frase: false, forzar: true, reiniciar: true });
    requestAnimationFrame(() => anillo(q.mirar || null));
}
const pintarDock = (items, izq, der) => pintarDockComun('tel', items, izq, der);
// Deja el elemento a la vista entre la lámina fija de arriba y el dock de abajo (scrollIntoView no cuenta con el dock)
function asomar(el) {
    if (!el) return;
    const r = el.getBoundingClientRect(), abajo = innerHeight - $('dock').offsetHeight - 12;
    const arriba = raiz.classList.contains('tel-estudio') ? $('escena-bloque').getBoundingClientRect().bottom + 8 : 8;
    const d = r.bottom > abajo ? Math.min(r.bottom - abajo, r.top - arriba) : r.top < arriba ? r.top - arriba : 0;
    if (Math.abs(d) > 1) window.scrollBy({ top: d, behavior: REDUCIR ? 'auto' : 'smooth' });
}

// Mandos dentro de una pregunta («Compruébalo en el modelo»)
const MANDOS = {
    farmaco: { nombre: 'Fármaco', ops: [['hnf', 'HNF'], ['enoxaparina', 'Enoxaparina'], ['fondaparinux', 'Fondaparinux']] },
    clcr: { nombre: 'ClCr', ops: [['90', 'ClCr 90'], ['50', '50'], ['25', '25'], ['12', '12']] },
    imc: { nombre: 'IMC', ops: [['25', 'IMC 25'], ['42', '42'], ['52', '52']] },
    diastolica: { nombre: 'Diastólica', ops: [['70', 'PAD 70'], ['34', 'PAD 34']] },
    horas: { nombre: 'Horas', ops: [['6', '6 h'], ['12', '12 h'], ['24', '24 h'], ['48', '48 h']] },
    inmovil: { nombre: 'Movilidad', bool: true, ops: [['0', 'Se mueve'], ['1', 'Inmóvil, 3 semanas']] },
    inflamacion: { nombre: 'Inflamación', bool: true, ops: [['0', 'Sin inflamación'], ['1', 'Inflamación']] },
};
const valorMando = k => MANDOS[k].bool ? String(+estado[k]) : String(estado[k]);
function mandoHTML(t) {
    return `<p class="tel-para"><b>Compruébalo en el modelo:</b> ${t.instruccion || ''}</p>` + t.mandos.map(k => {
        const M = MANDOS[k];
        return `<div class="tel-seg" data-grupo="${k}" role="group" aria-label="${M.nombre}">${M.ops.map(([v, txt]) => `<button type="button" data-mando="${k}" data-v="${v}" aria-pressed="${valorMando(k) === v}">${txt}</button>`).join('')}</div>`;
    }).join('');
}
function sincronizarMandoPregunta(cont) { cont.querySelectorAll('[data-mando]').forEach(b => b.setAttribute('aria-pressed', String(valorMando(b.dataset.mando) === b.dataset.v))); }
function accionMando(b, cont) {
    const k = b.dataset.mando, v = b.dataset.v;
    cambiar(s => { if (MANDOS[k].bool) { s[k] = v === '1'; if (s.vista === 'reloj') s.vista = 'telar'; } else ordenar(s, k, v); }, { frase: false });
    sincronizarMandoPregunta(cont);
    if (anilloObj) anillo(anilloObj);
}

// «Para profundizar»: lo que no se pregunta, con su sitio en la ficha y en el libro
const profundizarHTML = () => PROFUNDIZAR.map(p => `<section>${p.html} <span class="tel-fuente-p">${enlacesTexto(p.donde)} <a class="tel-pdf" href="${PDF(p.pag)}" target="_blank" rel="noopener">Ver en el libro (p. ${p.pag}) →</a></span></section>`).join('');

const Estudio = {
    c: 0,
    concepto(i) {
        this.c = clamp(i, 0, CONCEPTOS.length - 1);
        const k = CONCEPTOS[this.c], cont = $('concepto');
        setOcultos([], false); aplicar(estadoDe(k.estado), { frase: false, forzar: true, reiniciar: true });
        requestAnimationFrame(() => anillo(k.mirar || null));
        cont.innerHTML = `<div class="tel-cab-preg"><span class="tel-concepto-n">${this.c + 1}</span><h3>${k.titulo}</h3></div>
            <p class="tel-pregunta">${k.texto}</p>
            <div class="tel-mando"><p class="tel-para"><b>Tócalo:</b> ${k.hacer}</p><div class="tel-fila">${k.acciones.map((a, j) => `<button class="tel-b" type="button" data-acc="${j}" aria-pressed="false">${a.t}</button>`).join('')}</div></div>
            <p class="tel-para"><b>Mira:</b> ${k.mira}</p>
            ${verEnTexto(k.fuente)}
            <div class="tel-nav-c"><button class="tel-b" type="button" data-nav="-1" ${this.c === 0 ? 'disabled' : ''}>← Anterior</button><button class="tel-b tel-prim" type="button" data-nav="1">${this.c === CONCEPTOS.length - 1 ? 'A la Mayéutica →' : 'Siguiente →'}</button></div>`;
        entrar(cont, 'tel');
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]');
            if (a) { const ac = CONCEPTOS[this.c].acciones[+a.dataset.acc]; aplicar(estadoDe({ ...k.estado, ...ac.e }), { frase: false }); requestAnimationFrame(() => anillo(ac.mirar !== undefined ? ac.mirar : k.mirar || null)); cont.querySelectorAll('[data-acc]').forEach(b => b.setAttribute('aria-pressed', String(b === a))); return; }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); subir(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve la lámina');
    },
};

/* ---------- Mayéutica: el motor común (core/mayeutica-motor.js) con los enganches del telar ---------- */
// Aciertos y fallos en localStorage con su clave de siempre (como el quiz: solo en este dispositivo).
const Mayeutica = crearMayeuticaModelo({
    p: 'tel', cont: () => $('preg'), clave: 'telar-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { setOcultos([], false); aplicar(estadoBase(), { frase: false, forzar: true, reiniciar: true }); },
    volverPor: 'El telar de la trombina',
    pregunta: {
        alEmpezar: ponerModelo,
        asomar,
        verEnTexto: q => verEnTexto(q.fuente),
        alCerrar: q => { if (q.despues) aplicar(estadoDe(q.despues), { frase: false }); setOcultos([]); anillo(q.mirarDespues || anilloObj); },
        alSalir: () => { anillo(null); alTocar = null; setOcultos([], false); },
        tocar: {
            mandoHTML,
            alMostrar: q => anillo(q.tocar.mirar || null),
            comprobar: q => q.tocar.comprobar(estado),
            ponerBueno: (q, cont) => { aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), { frase: false }); sincronizarMandoPregunta(cont); anillo(q.tocar.mirar || null); },
            alComprobar: () => { setOcultos([]); alTocar = null; },
            accion: accionMando,
        },
    },
    textos: {
        ruta: (nG, nE) => `<span><b>1.</b> Recorrido, en el orden de las fichas: <b>${nG} de guía socrática</b> (varias se responden tocando el telar: primero predices, luego compruebas) y <b>${nE} de examen</b>, nivel MIR, con sus trampas.</span>
            <span><b>2.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>3.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span>`,
        empezar: 'Empezar el recorrido', seguir: 'Seguir',
        pie: 'El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde. Lo que no se pregunta está en «Para profundizar», abajo.',
        conModelo: 'el telar',
        casos: 'El telar se mueve al estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
        abrirPaciente: 'Abrir el telar en el estado del paciente',
    },
    preguntaDePaso: paso => ({ estado: paso.estado, mirar: paso.mirar }),
    alTerminarCaso: C => aplicar(estadoDe(C.volver.estado), { frase: false, forzar: true, reiniciar: true }),
    abrirPaciente: C => { setModo('explorar'); aplicar(estadoDe(C.volver.estado), { forzar: true, reiniciar: true }); elegirPestana(pestanaDe(estado)); },
});

/* Revisión automática de la forma de las preguntas (REGLAS §8), para __telPruebas() */
function revisarMayeutica() {
    const todas = [...PREGUNTAS, ...CASOS.flatMap(c => c.pasos.map(p => ({ ...p.pregunta, estado: p.estado })))];
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
        if (!rutaDe(c.volver.ancla)) r.fallos.push(c.id + ': «Repasar en la ficha» sin destino');
    }
    if (todas.some(x => !x.fuente)) r.fallos.push('pregunta sin fuente');
    for (const x of [...todas, ...CONCEPTOS]) if (!idsDe(x.fuente).some(id => rutaDe(id))) r.fallos.push((x.id || x.titulo) + ': «Ver en el texto» sin destino');
    for (const x of [...todas, ...CONCEPTOS]) for (const id of idsDe(x.fuente)) if (!document.getElementById(id)) r.fallos.push(`${x.id || x.titulo}: la fuente ${id} no existe`);
    for (const p of PROFUNDIZAR) if (!idsDe(p.donde).some(id => rutaDe(id))) r.fallos.push('«Para profundizar» sin destino: ' + p.donde);
    const ids = todas.map(x => x.id); if (new Set(ids).size !== ids.length) r.fallos.push('ids de pregunta repetidos');
    for (const x of todas.filter(x => x.tocar)) { if (x.tocar.comprobar(estadoDe(x.estado))) r.fallos.push(x.id + ': el modelo ya enseña la respuesta antes de tocar'); if (!x.tocar.comprobar(estadoDe({ ...x.estado, ...x.tocar.bueno }))) r.fallos.push(x.id + ': «bueno» no pasa la comprobación'); for (const k of x.tocar.mandos) if (!MANDOS[k]) r.fallos.push(x.id + ': mando ' + k); }
    return r;
}

/* ============================================================
   Abrir en un estado (el menú de estados del dock, los botones de las fichas, el menú de Libros y el buscador)
   ============================================================ */
function ponerEnEstado(clave) {
    const s = ESTADOS[clave] || ESTADOS.sano;
    const nuevo = estadoDe(s.e);
    aplicar(nuevo, { frase: false, forzar: true, reiniciar: true });
    const c = s.clave, v = copia(nuevo);
    if (c) v[c] = c === 'farmaco' && nuevo.vista === 'tih' ? 'hnf' : estadoBase()[c];
    fraseActual = '';
    const [fh, ff] = (c && fraseDe(v, nuevo)) || FRASE_INICIO();
    decir(`<b>${s.nombre}.</b> ` + fh, ff);
    elegirPestana(pestanaDe(nuevo));
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú o ventana de la
// cama): la cama 7 grande y su zoom de entrada; con estado, la cama compacta y el telar en ese estado.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('tel-volver'), raiz, origen);
    if (modo !== 'explorar') setModo('explorar');
    if (clave && ESTADOS[clave]) ponerEnEstado(clave);
    cama?.mostrar({ intro: !clave });
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
function leyendas() {
    const ley = [['rbc', 'hematíe'], ['cito', 'citoquinas: la inflamación'], ['at', 'antitrombina (AT): escudo'], ['heparina', 'heparina: collar de cuentas (larga, corta o de 5)'], ['fibrina', 'fibrina: el hilo de la red'],
        ['fp4', 'factor plaquetario 4 (FP4)'], ['igg', 'anticuerpo IgG'], ['plaqueta', 'plaqueta'], ['plaquetaActiva', 'plaqueta activada: con espinas']];
    $('leyenda').innerHTML = ley.map(([k, txt]) => `<li>${iconoParticula(k, 18)}<span>${txt}</span></li>`).join('')
        + `<li><svg viewBox="-10 -10 20 20" width="18" height="18" aria-hidden="true"><path d="${engranaje(5.5, 8)}" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1"/></svg><span>factor Xa: la rueda</span></li>`
        + `<li><svg viewBox="-10 -10 20 20" width="18" height="18" aria-hidden="true"><path d="M-9 0 Q0 -5 9 0 Q0 5 -9 0 Z" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1"/></svg><span>trombina (IIa): la tejedora</span></li>`
        + `<li><svg viewBox="-10 -10 20 20" width="18" height="18" aria-hidden="true">${llave(4, 0, 0, 0.75)}</svg><span>ACOD: llave sin AT</span></li>`
        + `<li><svg viewBox="-10 -10 20 20" width="18" height="18" aria-hidden="true">${xRojaIcono()}</svg><span>X: inhibición, como en la Fig. 5.2</span></li>`;
    $('laminas').innerHTML = LAMINAS.map(([f, n, c]) => `<figure class="tel-lam-item"><div class="article-figure tel-lam"><img loading="lazy" src="js/modules/libros/img/${f}" alt="${n} del libro: ${c}"></div><figcaption>${n}</figcaption></figure>`).join('');
    $('prof-lista').innerHTML = profundizarHTML();
    $('prof-may').innerHTML = profundizarHTML();
    $('m-estado').innerHTML = '<option value="">Estados con nombre…</option>' + Object.entries(ESTADOS).map(([k, s]) => `<option value="${k}">${s.nombre}</option>`).join('');
}
export function init() {
    raiz = document.getElementById('tel-raiz');
    if (!raiz) return null;
    initEscena();
    ganchos.despues = pintarDosis;
    leyendas(); engancharDock();
    Mayeutica.cargar();
    aplicar(estadoBase(), { frase: false, forzar: true }); decir(...FRASE_INICIO());
    // La cama 7: su zoom de entrada abre la lámina por la pierna; el respirador recuerda un factor de riesgo de la UCI
    cama = montarCama7($('cama7'), 'telar');
    raiz.addEventListener('c7-entrada', () => {
        revelar(); fraseActual = ''; decir(...FRASE_INICIO());
        setTimeout(() => { if (modo === 'explorar') anillo('valvula'); }, REDUCIR ? 0 : 750);
        setTimeout(() => { if (modo === 'explorar' && anilloObj === 'valvula') anillo(null); }, 3200);
    });
    raiz.addEventListener('c7-aparato', ev => { if (ev.detail === 'respirador') decir('El respirador: la ventilación prolongada (&gt;48 h) es uno de los factores de riesgo propios de la UCI. En esta escena, el paciente de UCI se elige en la pestaña Paciente.', 'mar-tev-uci (p. 2-3)'); });

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--tel-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    // La vista se ve o deja de verse (todas las vistas están en el DOM): medir al aparecer.
    let anchoVisible = 0, motionPedido = false;
    const caja = $('escena');
    new ResizeObserver(() => {
        const a = Math.round(caja.clientWidth);
        document.body.classList.toggle('tel-activo', a > 0);
        if (!a) { anchoVisible = 0; cama?.parar(); return; }
        if (!anchoVisible) { const v = document.getElementById('telar-vivo-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, sin zoom */ }); }
        if (anilloObj) anillo(anilloObj);
        arrancar();
    }).observe(caja);
    new IntersectionObserver(es => ponerVisible(es[es.length - 1].isIntersecting)).observe(caja);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado, los estados pintados, la Mayéutica y el bucle.
    window.__telPruebas = () => {
        const r = pruebasTelar();
        r.estados = {};
        const guardado = copia(estado);
        for (const k of Object.keys(ESTADOS)) {
            try { aplicarModelo(estadoDe(ESTADOS[k].e), { forzar: true }); r.estados[k] = !!$('lamina').querySelector('#tel-lupa') && JSON.stringify(estado) === JSON.stringify(estadoDe(ESTADOS[k].e)); if (!r.estados[k]) { r.fallos.push('estado ' + k); r.todoCoincide = false; } }
            catch (err) { r.estados[k] = String(err); r.fallos.push('estado ' + k); r.todoCoincide = false; }
        }
        aplicarModelo(guardado, { forzar: true }); sincronizarMandos();
        r.mayeutica = revisarMayeutica();
        if (r.mayeutica.fallos.length) { r.todoCoincide = false; r.fallos.push(...r.mayeutica.fallos); }
        const celdas = [...raiz.querySelectorAll('#tel-tablero .tel-celda')].map(c => ({ k: c.querySelector('.tel-k').textContent, v: c.querySelector('b').textContent }));
        const rotulos = [...$('lamina').querySelectorAll('text')].filter(t => t.getBBox && t.getClientRects().length).map(t => +t.getAttribute('font-size'));
        return { ...r, estado: copia(estado), D: { velocidad: D.velocidad, teje: D.teje, tendencia: D.tendencia, dosis: D.dosis && { corta: D.dosis.corta, estado: D.dosis.estado }, plaquetasCaen: D.plaquetasCaen, aprieta: !!D.cni?.aprietaArteria, reloj: D.reloj },
            modo, fase: Mayeutica.fase, ocultos: [...ocultos], celdas, bucle: estadoBucle(), vaciarFotogramas, rotuloMin: rotulos.length ? Math.min(...rotulos) : null,
            guardado: Mayeutica.prog.g.leer(), cama: $('cama7').classList.contains('c7-compacta') ? 'compacta' : 'grande' };
    };

    return { abrir: abrirEstado };
}
