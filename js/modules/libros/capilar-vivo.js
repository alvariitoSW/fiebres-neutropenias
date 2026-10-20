// Capilar y oxígeno: del pulmón a la mitocondria (Libros → Marino → Fundamentos, grupo oxígeno, caps. 7 y 9).
// Interfaz del modelo vivo: frase viva, dock de 5 pestañas (sangre, pulmón, corazón, tejido, mido en), lupas,
// interruptor Explorar | Conceptos | Mayéutica y la capa de estudio (guía socrática y examen, repaso de lo fallado y
// 4 casos clínicos). Mismo patrón que el río y mar (agua-viva.js). La escena vive en capilar-vivo-escena.js; los
// datos, en js/data/capilar-vivo-data.js.
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="capilarVivo" data-capilar-vivo="anemia">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica es el motor común (core/mayeutica-motor.js): guarda aciertos y fallos en
// localStorage (como el quiz), con su clave propia y siempre dentro de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { escapeHtml } from '../../core/ui.js';
import { crearMayeuticaModelo, rutaDe, atributosFicha, entrar, pintarDock as pintarDockComun } from '../../core/mayeutica-motor.js';
import {
    ESTADOS, ESTADOS_CHIPS, CONCEPTOS, PREGUNTAS, CASOS, estadoBase, estadoDe, derivar, copia, clamp, dec, mil, pruebasCapilar,
} from '../../data/capilar-vivo-data.js';
import {
    $, estado, D, REDUCIR, Lupa, ocultos, vistos, initEscena, aplicarModelo, setOcultos, mirar, ponerCamas, pintarCamas,
    arrancar, pintarUnaVez, ponerVisible, medir, estadoBucle, vaciarFotogramas, hematieSVG, iconoHematie, iconoParticula, CELDAS,
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
    const nuevo = `${html} ${fuente ? `<span class="cpv-org${esIlu ? ' cpv-ilu' : ''}">${origenHTML(fuente)}</span>` : ''}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('lamina').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
}
function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo);
    sincronizarMandos();
    if (op.frase !== false && modo === 'explorar') decir(...fraseDe(viejo, nuevo));
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

function fraseDe(prev, e) {
    // sin estado anterior (al abrir en un estado), se cuenta lo que cambia respecto al sano
    if (!prev && JSON.stringify(e) !== JSON.stringify(estadoBase())) return fraseDe(estadoBase(), e);
    const R = D.R, cambio = k => prev && prev[k] !== e[k];
    if (e.rcp) return ['Parada con RCP: con una <span class="hl-rojo">PETCO₂ ≤10 mmHg tras 20 min</span> de RCP, es improbable recuperar la circulación espontánea.', 'ficha · mar-capno-rcp'];
    if (e.esofago) return ['<span class="hl-rojo">Sin CO₂ espirado: el tubo está en el esófago</span> (o hay una parada, sin retorno venoso). La intubación esofágica no reconocida se da en 1 de cada 18 intubaciones urgentes del crítico.', 'ficha · mar-capno-intubacion'];
    if (cambio('sedacion') && e.sedacion) return [`Hipoventila: <span class="hl-rojo">la PETCO₂ sube</span> (${R.petco2} mmHg); la SpO₂ todavía no ha bajado (${R.spo2 ?? '—'} %).`, 'ficha · mar-capno-sedacion · PETCO₂ ilustrativa'];
    if (cambio('espacio') && e.espacio !== 'no') return [`Alvéolos ventilados sin sangre: la PETCO₂ (${R.petco2}) se queda <span class="hl">por debajo de la PaCO₂</span> (${R.paco2}).${e.espacio === 'epoc' ? ' En la EPOC, además, la fase II sube despacio.' : ''}`, 'ficha · mar-gradiente-co2 · mar-tabla-7-1 · mar-capno-f2 · PETCO₂ ilustrativa'];
    if (cambio('co') && e.co) return [`La SpO₂ sigue en ${R.spo2 ?? '—'} %: <span class="hl-rojo">el pulsioxímetro no ve la COHb</span>; la SaO₂ real ha caído a ${R.sao2} %. Pide gasometría con cooximetría.`, 'ficha · mar-cooximetria · COHb 25 % ilustrativa'];
    if ((cambio('frio') || cambio('sensor')) && e.frio) return e.sensor === 'dedo' ? ['Dedo frío: <span class="hl-rojo">la onda se aplana</span> y la SpO₂ deja de ser fiable. Pon el sensor en la frente.', 'ficha · mar-oxi-frente · onda plana: ilustrativa', true] : [`En la frente (carótida interna) los vasos se contraen menos: <span class="hl-verde">la SpO₂ vuelve</span> (${R.spo2} %).`, 'ficha · mar-oxi-frente'];
    if (cambio('util') && e.util === 'sepsis') return [`Llega O₂ pero la PDH está bloqueada: los hematíes <span class="hl-rojo">salen casi llenos</span> (SvO₂ ${R.svo2} %, &gt;80 %) y la célula suelta lactato. Es el defecto de utilización.`, 'cortes: ficha · mar-sao2-svo2-guia · las cifras: ilustrativas', true];
    if (cambio('util') && e.util === 'tiamina') return ['Sin pirofosfato de tiamina la PDH no trabaja: el piruvato se desvía a <span class="hl-rojo">lactato</span>. La SvO₂ no se toca: la ficha no la da.', 'ficha · mar-extraccion-lactato (acordeón «Déficit de tiamina»)'];
    if (cambio('estres') && e.estres) return ['El estrés fisiológico (más transportadores de glucosa y catecolaminas) sube la glucólisis aerobia <span class="hl">un 40-50 %</span>, y con ella el lactato.', 'ficha · mar-extraccion-lactato (acordeón «Estrés fisiológico») · lactato: ilustrativo'];
    if (cambio('consumo') && e.consumo === 'fiebre') return [`Más consumo con el mismo aporte: <span class="hl">sube la extracción</span> (O₂ER ${dec(R.o2er, 2)}) y baja la SvO₂ (${R.svo2} %).`, 'ilustrativo: 300 mL/min', true];
    if (cambio('toma')) return e.toma === 'scvo2' ? (D.shock ? [`En el crítico la ScvO₂ sale <span class="hl-rojo">más alta que la SvO₂</span>: de media un 7 %; en el shock, hasta un 18 %. Aquí, ${R.scvo2} % frente a ${R.svo2} %.`, 'ficha · mar-scvo2-9 · +7 en el shock: ilustrativo', true] : [`Fuera del shock la ScvO₂ es algo menor que la SvO₂; la ficha no da cuánto: el modelo las iguala (${R.scvo2} %).`, 'ficha · mar-scvo2-9 · igualdad ilustrativa', true]) : [`La SvO₂ mixta, en la arteria pulmonar: la media de todos los retornos venosos (${R.svo2} %).`, 'ficha · mar-svo2-mixta'];
    if (cambio('hb')) return e.hb === 7.5 && e.pao2 === 90 ? [`Con la Hb a la mitad, <span class="hl-rojo">la fila tiene huecos</span> y el contenido cae a la mitad: de 20 a ${Math.round(D.cao2)} mL/dL. Cada hematíe suelta más: la extracción llega al ${R.dif} %.`, 'ficha · mar-anemia-hipoxemia (Fig. 9.2) · la fila: ilustrativa'] : [`Hb ${dec(e.hb, 1)}: CaO₂ ${dec(R.cao2, 1)} mL/dL y aporte ${mil(R.do2)} mL/min (con Hb 15, 20 y 985).`, 'ficha · mar-cao2-9 · mar-do2'];
    if (cambio('pao2')) return e.pao2 === 45 ? [`PaO₂ a la mitad: SaO₂ ${R.sao2} %, CaO₂ ${Math.round(D.cao2)} mL/dL: <span class="hl">solo un 20 % menos</span>.`, 'ficha · mar-anemia-hipoxemia (Fig. 9.2)'] : e.pao2 >= 60 ? [`PaO₂ ${e.pao2}: SaO₂ ${R.sao2} %. <span class="hl">Casi no cambia: estás en la parte plana</span> de la curva.`, 'ficha · mar-curva-forma · curva: fisiología general'] : [`PaO₂ ${e.pao2}: ya en la parte empinada; la SaO₂ cae deprisa (${R.sao2} %).`, 'ficha · mar-curva-forma · curva: fisiología general'];
    if (cambio('gc') || (prev && prev.frio !== e.frio)) {
        if (D.porAporte) return [`El aporte cayó a ${mil(R.do2)} mL/min: los hematíes <span class="hl-rojo">salen con la mitad de las perlas vacías</span> (extracción del 50 %, SvO₂ ${R.svo2} %) y el consumo ya depende del aporte (VO₂ ${R.vo2}).`, 'ficha · mar-extraccion-curva (Fig. 9.3)'];
        return [`Gasto ${dec(e.gc, 1)} L/min: aporte ${mil(R.do2)} mL/min; el tejido sigue cogiendo ${R.vo2} subiendo la extracción (${R.dif} %). Gap de PCO₂ ${R.gap} mmHg.`, 'ficha · mar-extraccion-curva · mar-gap-co2 · gap ilustrativo'];
    }
    if (D.porAporte) return [`El aporte (${mil(R.do2)} mL/min) no llega: la extracción tocó el 50 % y <span class="hl-rojo">el consumo depende del aporte</span> (VO₂ ${R.vo2}).`, 'ficha · mar-extraccion-curva (Fig. 9.3)'];
    return [`Hb ${dec(e.hb, 1)}, PaO₂ ${e.pao2} y gasto ${dec(e.gc, 1)}: llegan <span class="hl">${mil(R.do2)} mL/min</span> de O₂ y el tejido usa ${R.vo2}: ${R.dif <= 26 && R.dif >= 24 ? 'una cuarta parte; cada hematíe suelta una perla de cada cuatro' : `la extracción es del ${R.dif} %`} (SvO₂ ${R.svo2} %).`, 'ficha · mar-tabla-9-1 · mar-o2er'];
}

/* ============================================================
   Mandos del dock
   ============================================================ */
function pestana(tab) {
    enRaiz('.cpv-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.cpvTab === tab)));
    enRaiz('#cpv-dock-explorar .cpv-dock-panel').forEach(p => { p.hidden = p.dataset.cpvPanel !== tab; });
}
function sincronizarMandos() {
    const e = estado;
    $('m-hb').value = e.hb; $('o-hb').innerHTML = `${dec(e.hb, 1)} <small>g/dL</small>`;
    $('m-pao2').value = e.pao2; $('o-pao2').innerHTML = `${e.pao2} <small>mmHg</small>`;
    $('m-gc').value = e.gc; $('o-gc').innerHTML = `${dec(e.gc, 1)} <small>L/min</small>`;
    const pr = (el, v) => el.setAttribute('aria-pressed', String(!!v));
    pr($('m-co'), e.co); pr($('m-sedacion'), e.sedacion); pr($('m-esofago'), e.esofago); pr($('m-rcp'), e.rcp); pr($('m-frio'), e.frio);
    pr($('m-fiebre'), e.consumo === 'fiebre'); pr($('m-estres'), e.estres);
    enRaiz('[data-cpv-espacio]').forEach(b => pr(b, e.espacio === b.dataset.cpvEspacio));
    for (const [id, k] of [['m-util', 'util'], ['m-toma', 'toma'], ['m-sensor', 'sensor']]) $(id).querySelectorAll('button').forEach(b => pr(b, b.dataset.v === e[k]));
    const actual = JSON.stringify(e);
    enRaiz('#cpv-chips-estado [data-cpv-estado]').forEach(b => pr(b, JSON.stringify(estadoDe(ESTADOS[b.dataset.cpvEstado].p)) === actual));
}
function engancharDock() {
    enRaiz('.cpv-dock-tabs button').forEach(b => b.addEventListener('click', () => pestana(b.dataset.cpvTab)));
    $('m-hb').addEventListener('input', ev => cambiar(e => { e.hb = +ev.target.value; }));
    $('m-pao2').addEventListener('input', ev => cambiar(e => { e.pao2 = +ev.target.value; }));
    $('m-gc').addEventListener('input', ev => cambiar(e => { e.gc = +ev.target.value; }));
    $('m-co').addEventListener('click', () => cambiar(e => { e.co = !e.co; }));
    enRaiz('[data-cpv-espacio]').forEach(b => b.addEventListener('click', () => cambiar(e => { e.espacio = e.espacio === b.dataset.cpvEspacio ? 'no' : b.dataset.cpvEspacio; })));
    $('m-sedacion').addEventListener('click', () => cambiar(e => { e.sedacion = !e.sedacion; }));
    $('m-esofago').addEventListener('click', () => cambiar(e => { e.esofago = !e.esofago; }));
    $('m-rcp').addEventListener('click', () => cambiar(e => { e.rcp = !e.rcp; }));
    $('m-frio').addEventListener('click', () => cambiar(e => { e.frio = !e.frio; }));
    $('m-fiebre').addEventListener('click', () => cambiar(e => { e.consumo = e.consumo === 'fiebre' ? 'reposo' : 'fiebre'; }));
    $('m-estres').addEventListener('click', () => cambiar(e => { e.estres = !e.estres; }));
    $('m-util').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) cambiar(e => { e.util = b.dataset.v; }); });
    $('m-toma').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) cambiar(e => { e.toma = b.dataset.v; }); });
    $('m-sensor').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) cambiar(e => { e.sensor = b.dataset.v; }); });
    $('chips-estado').addEventListener('click', ev => { const b = ev.target.closest('[data-cpv-estado]'); if (b) ponerEnEstado(b.dataset.cpvEstado); });
    enRaiz('[data-cpv-lupa]').forEach(b => b.addEventListener('click', () => { Lupa.abierta === b.dataset.cpvLupa ? Lupa.cerrar() : Lupa.abrir(b.dataset.cpvLupa); }));
    $('lupa-cerrar').addEventListener('click', () => Lupa.cerrar());
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
   «Ver en el texto»: cada fuente (ficha#elemento) es un enlace cruzado a su ficha (como en el río y mar)
   ============================================================ */
const tituloFicha = tab => (tab.querySelector('h3')?.textContent || tab.id).replace(/\s+/g, ' ').trim();
function etiquetaDe(el) {
    const dt = el.matches('dl') && el.querySelector('dt');
    if (dt) return dt.textContent.trim();
    const cab = el.matches('.micro-prof-item') && el.querySelector('.micro-prof-head span');
    if (cab) return cab.textContent.trim();
    return null;
}
function enlacesTexto(fuente) {
    let tabPrevio = null; const vistosTab = new Set();
    const trozos = fuente.split(' · ').map(t => {
        const m = t.trim().match(/^(#?)([a-z0-9-]+)(?:#([a-z0-9-]+))?\s*(.*)$/i);
        if (!m) return `<span class="cpv-org">${t}</span>`;
        const [, rel, a, b, resto] = m;
        const idEl = rel ? a : b || a, idTab = rel ? tabPrevio : a;
        const r = rutaDe(idEl) || rutaDe(idTab);
        if (!r) return `<span class="cpv-org">${t}</span>`;
        tabPrevio = r.tab.id;
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : null;
        let texto = vistosTab.has(r.tab.id) ? (sub || tituloFicha(r.tab)) : tituloFicha(r.tab) + (sub ? ' · ' + sub : '');
        vistosTab.add(r.tab.id);
        if (resto) texto += ' ' + resto;
        texto = texto.length > 70 ? texto.slice(0, 68) + '…' : texto;
        return `<button type="button" class="cpv-ir-texto" ${atributosFicha(r)}>${escapeHtml(texto)} →</button>`;
    });
    return `Ver en el texto: ${trozos.join(' ')}`;
}
const verEnTexto = fuente => `<p class="cpv-fuente-p">${enlacesTexto(fuente)}</p>`;
// Un texto de origen («ficha · mar-fig-9-4 · lactato: ilustrativo»): cada ficha citada pasa a ser un enlace a ella
// con su título; lo demás («ficha», «ilustrativo», «sin cifra»…) queda como texto.
function origenHTML(texto) {
    const vistosTab = new Set();
    return String(texto).split(' · ').map(t => {
        const m = t.trim().match(/^(.*?)((?:mar|mr|mc)-[a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9-]+))?(\s.*)?$/);
        const r = m && (rutaDe(m[3] || m[2]) || rutaDe(m[2]));
        if (!r) return escapeHtml(t);
        const antes = m[1] ? escapeHtml(m[1]) : '', resto = m[4] ? escapeHtml(m[4]) : '';
        if (vistosTab.has(r.tab.id)) return (antes + resto).trim() || null;   // la misma ficha, un solo enlace
        vistosTab.add(r.tab.id);
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : null;
        return `${antes}<button type="button" class="cpv-org-ir" ${atributosFicha(r)}>${escapeHtml(tituloFicha(r.tab) + (sub ? ' · ' + sub : ''))}</button>${resto}`;
    }).filter(x => x !== null).join(' · ');
}
// Los chips de origen escritos en el HTML o en los textos de las preguntas se enlazan al pintarse.
function enlazarOrigenes(cont) {
    cont.querySelectorAll('span.cpv-org').forEach(sp => {
        if (sp.dataset.enlazado !== undefined || sp.children.length || !/(mar|mr|mc)-[a-z0-9]/.test(sp.textContent)) return;
        sp.innerHTML = origenHTML(sp.textContent);
        sp.dataset.enlazado = '';
    });
}

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
            if (a) { const ac = CONCEPTOS[this.c].acciones[+a.dataset.acc]; aplicar(estadoDe(ac.p), { frase: false }); if (ac.lupa) Lupa.abrir(ac.lupa); mirar(ac.mirar || k.mirar || null); return; }
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
        alEmpezar: q => { ponerCamas(q.camas); ponerModelo(q); },
        alPintar: () => pintarCamas(),
        enlazar: enlazarOrigenes,
        verEnTexto: q => verEnTexto(q.fuente),
        alCerrar: q => { if (q.despues) { aplicar(estadoDe(q.despues), { frase: false }); if (q.lupaDespues) Lupa.abrir(q.lupaDespues); } setOcultos([]); },
        alSalir: () => { mirar(null); setOcultos([]); ponerCamas(null); },
        // Las camas del caso: «Ver cama 1 / cama 2» pone el modelo en cada una
        alClic: (e, q) => { const cm = e.target.closest('[data-cama]'); if (!cm) return false; aplicar(estadoDe(q.camas[+cm.dataset.cama].e), { frase: false }); return true; },
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
    preguntaDePaso: (paso, C) => ({ estado: paso.estado, lupa: paso.lupa, mirar: paso.mirar, ocultar: paso.ocultar || paso.pregunta.ocultar, camas: paso.camas || C.camas }),
    // Si el paso compara camas, sus botones van bajo la ficha del paciente
    cabeceraPaso: (paso, C) => {
        const camas = paso.camas || C.camas;
        return camas ? `<div class="cpv-camas"><div class="cpv-seg" role="group" aria-label="Qué cama ves en el modelo">${camas.map((c, i) => `<button type="button" data-cama="${i}" aria-pressed="false">Ver ${c.n}</button>`).join('')}</div><div id="cpv-camas-tabla"></div></div>` : '';
    },
    abrirPaciente: C => { setModo('explorar'); ponerEnEstado(C.volver.estado); },
});

/* ============================================================
   Abrir en un estado (los chips, los botones de las fichas, los menús y el buscador)
   ============================================================ */
function ponerEnEstado(clave) {
    const s = ESTADOS[clave] || ESTADOS.normal;
    medir();
    aplicar(estadoBase(), { frase: false });
    fraseActual = '';
    aplicar(estadoDe(s.p));
    if (!Object.keys(s.p).length) decir(...fraseDe(null, estado));
    pestana(s.pestana || 'sangre');
    if (s.lupa) Lupa.abrir(s.lupa); else if (Lupa.abierta) Lupa.cerrar();
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú): se abre como estaba.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('cpv-volver'), raiz, origen);
    if (!clave) { requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' })); return; }
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
    ].map(([i, t]) => `<li>${i}<span>${t}</span></li>`).join('');
    $('chips-estado').innerHTML = ESTADOS_CHIPS.map(k => { const s = ESTADOS[k]; return `<button type="button" class="cpv-chip-f" data-cpv-estado="${k}" aria-pressed="false">${s.n}${s.s ? `<small>${s.s}</small>` : ''}</button>`; }).join('');
}
export function init() {
    raiz = document.getElementById('cpv-raiz');
    if (!raiz) return null;
    initEscena();
    leyendas(); engancharDock();
    enlazarOrigenes(raiz);
    enRaiz('[data-cpv-fuente]').forEach(sp => { sp.innerHTML = enlacesTexto(sp.dataset.cpvFuente); });
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
    new IntersectionObserver(es => ponerVisible(es[0].isIntersecting)).observe($('escena'));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado frente a cobertura §6.1 y el estado del bucle.
    window.__cpvPruebas = () => {
        const r = pruebasCapilar();
        const celdas = Object.fromEntries(CELDAS.map(c => [c.k, $('c-' + c.k).querySelector('b').textContent]));
        return { ...r, bucle: estadoBucle(), modo, fase: Mayeutica.fase, estado: copia(estado), R: derivar(estado).R, ocultos: [...ocultos],
            lupa: Lupa.abierta, celdas, guardado: Mayeutica.prog.g.leer(), vaciarFotogramas, hematie: hematieSVG().length > 0 };
    };

    return { abrir: abrirEstado };
}
