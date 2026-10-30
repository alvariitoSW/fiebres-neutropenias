// El vaso que sangra: la herida y la red (Libros → Marino, bloque «Sangre y hemostasia», cap. 13; sus fichas son las
// 4-6 de Hematología → Merino HEMATO). Modelo por concepto (REGLAS §7.11): la hemostasia de una herida, la red de
// capilares que se tapa (CID, PTT, SHU) y lo que se repone (plaquetas, plasma, crio, CCP4F).
// Interfaz del modelo vivo: frase viva, dock de 5 pestañas (herida, plaquetas, causa, plasma, fármaco), lupas,
// interruptor Explorar | Mayéutica, la explicación guiada de cada estado (core/explicacion-guiada.js) y la capa de
// estudio con el motor común (core/mayeutica-motor.js): las preguntas de las fichas 4-6 (una sola fuente) más 4 de
// «predice y compruébalo», el repaso de lo fallado y los 3 casos. Mismo patrón que el capilar (capilar-vivo.js). La
// escena vive en vaso-vivo-escena.js; los datos, en js/data/vaso-vivo-data.js.
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="vasoVivo" data-vaso-vivo="hit">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica guarda aciertos y fallos en localStorage (como el quiz), con su clave propia y
// siempre dentro de try/catch. Cada cita lleva a su sitio de la ficha (core/citas.js).
import { cargarMotion } from '../../core/motion.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { crearMayeuticaModelo, pintarDock as pintarDockComun, rutaDe, atributosFicha } from '../../core/mayeutica-motor.js';
import { enlacesFuente, origenEnlazado, enlazarOrigenes as enlazarCitas, citaExacta, hrefPdf } from '../../core/citas.js';
import { crearExplicacion } from '../../core/explicacion-guiada.js';
import { iconoParticula } from '../../core/particulas.js';
import { crearTope } from '../../core/tope.js';
import { pintarMandosTep, engancharTep } from './vaso-vivo-tep.js';
import { ESTADOS, GRUPOS_CHIPS, GUIAS, PREGUNTAS, CASOS, NOTAS, NOTA_TIPO, LAMINAS, PDF, PLAQ_CAUSA, estadoBase, estadoDe, derivar, fraseDe, copia, plaqDe, vDe, mil, MAT, claveDe, pruebasVaso, RELOJ, topesReloj, PESO, tnkMg } from '../../data/vaso-vivo-data.js';
import { $, estado, REDUCIR, ocultos, initEscena, aplicarModelo, ponerLupa, setOcultos, mirar, arrancar, pintarUnaVez, ponerVisible, estadoBucle, vaciarFotogramas, lupaActual, fijar, LUPAS_GRANDES, ponerEstudio } from './vaso-vivo-escena.js';

let raiz = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   Frase viva (con su origen) y aplicar un estado
   ============================================================ */
let fraseActual = '';
// El origen de la frase, corto: «ficha · p. 20 →» es el enlace cruzado al párrafo exacto (REGLAS §7.9); lo que no
// es de la ficha («60.000: ilustrativo») queda como texto.
function origenCorto(fuente) {
    const m = String(fuente).match(/([a-z0-9-]+)#((?:mh|mar|mc)-[a-z0-9-]+)/);
    const r = m && (rutaDe(m[2]) || rutaDe(m[1]));
    const partes = String(fuente).replace(/\s*·?\s*[a-z0-9-]+#(?:mh|mar|mc)-[a-z0-9-]+/g, '').split(' · ').map(t => t.trim()).filter(Boolean);
    const k = partes.findIndex(t => /^pp?\. /.test(t)), enlace = partes.slice(0, k + 1).join(' · '), resto = partes.slice(k + 1).join(' · ');
    return r ? `<button type="button" class="vso-org-ir" ${atributosFicha(r)}>${enlace} →</button>${resto ? ' · ' + resto : ''}` : partes.join(' · ');
}
function decir(html, fuente, ilu) {
    const el = $('frase');
    const esIlu = ilu || /ilustrativ/.test(fuente || '');
    const guia = claveActual && GUIAS[claveActual] && !Guia.activo ? `<button type="button" class="vso-ir-estado" data-vso-guia="${claveActual}">Explícamelo →</button>` : '';
    const nuevo = `<span class="vso-frase-txt">${html}</span><span class="vso-frase-pie">${fuente ? `<span class="vso-org${esIlu ? ' vso-ilu' : ''}">${origenCorto(fuente)}</span>` : ''}${guia}</span>`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    el.innerHTML = nuevo;
    el.classList.remove('vso-abierta');
    $('lamina').setAttribute('aria-label', el.textContent);
    if (!REDUCIR && el.animate) el.animate([{ opacity: 0.3, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
}
function aplicar(nuevo, op = {}) {
    aplicarModelo(nuevo, 'lupa' in op ? { lupa: op.lupa } : {});
    sincronizarMandos();
    pintarLibro();
    if (op.frase !== false && modo === 'explorar') decir(...fraseDe(estado));
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

/* ============================================================
   Los 4 tiempos de la herida (▶): cada 2,7 s el siguiente; con «reducir movimiento», el tiempo 4 quieto
   ============================================================ */
let reproduciendo = null;
function pararPlay() { if (reproduciendo) { clearInterval(reproduciendo); reproduciendo = null; } $('m-play')?.setAttribute('aria-pressed', 'false'); $('m-play-placa')?.setAttribute('aria-pressed', 'false'); }
function reproducir() {
    pararPlay();
    const lesion = estado.lesion === 'ninguna' ? 'herida' : estado.lesion, lupa = lesion === 'placa' ? 'placa' : 'herida';
    if (REDUCIR) { cambiar(e => { e.lesion = lesion; e.t = 4; }, { lupa }); return; }
    let t = 1;
    cambiar(e => { e.lesion = lesion; e.t = t; }, { lupa });
    $(lupa === 'placa' ? 'm-play-placa' : 'm-play').setAttribute('aria-pressed', 'true');
    reproduciendo = setInterval(() => { t++; if (t > 4) { pararPlay(); return; } cambiar(e => { e.t = t; }, { lupa }); $(lupa === 'placa' ? 'm-play-placa' : 'm-play').setAttribute('aria-pressed', 'true'); }, 2700);
}

/* ============================================================
   Mandos del dock
   ============================================================ */
function pestana(tab) {
    enRaiz('.vso-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.vsoTab === tab)));
    enRaiz('#vso-dock-explorar .vso-dock-panel').forEach(p => { p.hidden = p.dataset.vsoPanel !== tab; });
}
const marcar = (sel, fn) => enRaiz(sel).forEach(b => b.setAttribute('aria-pressed', String(!!fn(b))));
function sincronizarMandos() {
    const e = estado;
    marcar('#vso-m-lesion button', b => b.dataset.v === e.lesion);
    marcar('#vso-m-tiempo button', b => e.lesion !== 'ninguna' && +b.dataset.v === e.t);
    $('m-plaq').value = vDe(e.plaq);
    $('m-plaq-out').innerHTML = MAT(e.causa) ? '↓ <small>bajas</small>' : `${mil(e.plaq)} <small>/µL</small>`;
    marcar('#vso-m-transfundir', () => e.rep === 'plaquetas' && e.previas === 1 && !e.abo);
    marcar('[data-vso-previas]', b => e.rep === 'plaquetas' && +b.dataset.vsoPrevias === e.previas);
    marcar('#vso-m-abo', () => e.rep === 'plaquetas' && e.abo);
    marcar('[data-vso-causa]', b => b.dataset.vsoCausa === e.causa && (!b.dataset.var || b.dataset.var === e.vari));
    marcar('[data-vso-rep]', b => b.dataset.vsoRep === e.rep);
    marcar('[data-vso-hep]', b => e.causa === 'hit' && b.dataset.vsoHep === e.hep);
    $('farmaco-nota').hidden = e.causa === 'hit';
    // La arteria que se tapa: tiempo, oclusión, reloj, NTG y el ECG (solo con el ST elevado)
    const pl = e.lesion === 'placa' && !e.emb;
    pintarMandosTep($, e);
    marcar('#vso-m-tiempo-placa button', b => pl && +b.dataset.v === e.t);
    marcar('#vso-m-ocl button', b => pl && e.t === 4 && b.dataset.v === e.ocl);
    $('m-horas').value = e.horas; $('m-horas-out').innerHTML = `${e.horas} <small>h</small>`;
    marcar('#vso-m-ntg', () => pl && e.ntg);
    $('m-ntg').disabled = pl && e.t === 4 && e.ocl === 'completa';   // en el STEMI decide el ECG: la NTG no prueba nada (p. 40)
    $('m-ntg').classList.toggle('tope-apagado', $('m-ntg').disabled);
    $('m-ecg').hidden = !(pl && e.t === 4 && e.ocl === 'completa');
    marcar('#vso-m-asa', () => e.asa);
    marcar('#vso-m-p2y button', b => e.p2y === b.dataset.v);
    marcar('#vso-m-iib button', b => e.iib === b.dataset.v);
    marcar('#vso-m-lisis', () => e.lisis);
    marcar('#vso-m-pac button', b => e[b.dataset.v]);
    marcar('#vso-m-clcr button', b => +b.dataset.v === e.clcr);
    $('m-peso').value = e.peso; $('m-peso-out').innerHTML = `${e.peso} <small>kg · ${tnkMg(e.peso)} mg</small>`;
    pintarTopes();
    enRaiz('#vso-chips-estado [data-vso-estado]').forEach(b => b.setAttribute('aria-pressed', String(enEstado(b.dataset.vsoEstado))));
    if (claveActual && !enEstado(claveActual) && !reproduciendo && !Guia.activo) claveActual = null;
    const g = $('guia-abrir');
    g.disabled = !claveActual || !GUIAS[claveActual];
    $('guia-de').textContent = claveActual ? `«${ESTADOS[claveActual].n}»` : 'Elige antes un estado';
}
// ¿Está el vaso en este estado con nombre? La herida lo está en cualquiera de sus 4 tiempos.
function enEstado(k) {
    const s = ESTADOS[k];
    if (!s) return false;
    if (s.play) return estado.lesion === s.p.lesion && JSON.stringify({ ...estado, t: 1 }) === JSON.stringify(estadoDe(s.p));
    return JSON.stringify(estado) === JSON.stringify(estadoDe(s.p));
}
// Los topes del reloj (tope.js): aviso al acercarse a las 12 h, sello «lisis sin beneficio» al pasarlas
let topes = null;
const topesPuestos = new Map();
function pintarTopes() {
    if (!topes) return;
    const lista = topesReloj(estado), claves = new Set(lista.map(x => x.clave));
    for (const k of [...topesPuestos.keys()]) if (!claves.has(k)) { topes.quitar(k); topesPuestos.delete(k); }
    for (const x of lista) { const j = JSON.stringify(x); if (topesPuestos.get(x.clave) !== j) { topes.poner(x.clave, x); topesPuestos.set(x.clave, j); } }
}
const aPlaca = e => { if (e.lesion !== 'placa' || e.emb) Object.assign(e, estadoBase(), { lesion: 'placa' }); };
function engancharDock() {
    enRaiz('.vso-dock-tabs button').forEach(b => b.addEventListener('click', () => pestana(b.dataset.vsoTab)));
    $('m-lesion').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; pararPlay(); cambiar(e => { e.lesion = b.dataset.v; if (e.lesion !== 'ninguna' && e.causa !== 'cid') e.t = 4; }, { lupa: b.dataset.v === 'ninguna' ? null : 'herida' }); });
    $('m-tiempo').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; pararPlay(); cambiar(e => { e.t = +b.dataset.v; if (e.lesion === 'ninguna') e.lesion = 'herida'; }, { lupa: 'herida' }); });
    $('m-play').addEventListener('click', () => { if (reproduciendo) { pararPlay(); return; } reproducir(); });
    $('m-tiempo-placa').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; pararPlay(); cambiar(e => { aPlaca(e); e.t = +b.dataset.v; }, { lupa: 'placa' }); });
    $('m-play-placa').addEventListener('click', () => { if (reproduciendo) { pararPlay(); return; } if (estado.lesion !== 'placa') cambiar(e => { aPlaca(e); }, { lupa: 'placa' }); reproducir(); });
    $('m-ocl').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; pararPlay(); cambiar(e => { aPlaca(e); e.t = 4; e.ocl = b.dataset.v; if (e.ocl === 'completa') e.ntg = false; }, { lupa: 'placa' }); });
    $('m-horas').addEventListener('input', ev => { pararPlay(); cambiar(e => { aPlaca(e); e.t = 4; e.horas = Math.max(RELOJ.min, Math.min(RELOJ.max, Math.round(+ev.target.value))); }, { lupa: 'placa' }); });
    // Tratar el SCA (5b y 5c): cada mando se crea una vez en el HTML y solo se repinta; actúan sobre la placa en su tiempo 3 o 4
    const trat = fn => { pararPlay(); cambiar(e => { aPlaca(e); if (e.t < 3) e.t = 4; fn(e); }, { lupa: 'placa' }); };
    $('m-asa').addEventListener('click', () => trat(e => { e.asa = !e.asa; }));
    $('m-p2y').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) trat(e => { e.p2y = e.p2y === b.dataset.v ? null : b.dataset.v; }); });
    $('m-iib').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) trat(e => { e.iib = e.iib === b.dataset.v ? null : b.dataset.v; }); });
    $('m-lisis').addEventListener('click', () => trat(e => { e.t = 4; e.lisis = !e.lisis; }));
    $('m-peso').addEventListener('input', ev => trat(e => { e.peso = Math.max(PESO.min, Math.min(PESO.max, Math.round(+ev.target.value))); }));
    $('m-pac').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) trat(e => { e[b.dataset.v] = !e[b.dataset.v]; }); });
    $('m-clcr').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) trat(e => { e.clcr = +b.dataset.v; }); });
    engancharTep($, cambiar, pararPlay);
    $('m-ntg').addEventListener('click', () => { pararPlay(); cambiar(e => { aPlaca(e); e.t = 4; e.ntg = e.ocl !== 'completa' && !e.ntg; }, { lupa: 'placa' }); });
    $('m-plaq').addEventListener('input', ev => { pararPlay(); cambiar(e => { e.plaq = plaqDe(+ev.target.value); if (e.rep === 'plaquetas') e.rep = null; if (MAT(e.causa)) { e.causa = 'ninguna'; e.vari = null; e.rep = null; } }); });
    $('m-transfundir').addEventListener('click', () => { pararPlay(); cambiar(e => { Object.assign(e, estadoBase(), { rep: 'plaquetas', previas: 1, plaq: Math.min(e.plaq, 20000) }); }); });
    enRaiz('[data-vso-previas]').forEach(b => b.addEventListener('click', () => { pararPlay(); cambiar(e => { Object.assign(e, estadoBase(), { rep: 'plaquetas', previas: +b.dataset.vsoPrevias, plaq: estado.rep === 'plaquetas' ? estado.plaq : 20000 }); }); }));
    $('m-abo').addEventListener('click', () => { pararPlay(); cambiar(e => { const ya = e.rep === 'plaquetas' && e.abo; Object.assign(e, estadoBase(), { rep: 'plaquetas', previas: estado.rep === 'plaquetas' ? estado.previas : 5, plaq: 20000, abo: !ya }); }); });
    $('m-causa').addEventListener('click', ev => {
        const b = ev.target.closest('[data-vso-causa]'); if (!b) return;
        pararPlay();
        const c = b.dataset.vsoCausa;
        cambiar(e => { Object.assign(e, estadoBase(), { causa: c, vari: b.dataset.var || null, plaq: PLAQ_CAUSA[c] }); if (c === 'cid') { e.lesion = 'herida'; e.t = 4; } });
    });
    $('m-rep').addEventListener('click', ev => {
        const b = ev.target.closest('[data-vso-rep]'); if (!b) return;
        pararPlay();
        const r = b.dataset.vsoRep;
        const extra = r === 'recambio' ? { causa: 'ptt', plaq: PLAQ_CAUSA.ptt } : r === 'lena' ? { causa: 'cid', vari: 'septica', plaq: PLAQ_CAUSA.cid, lesion: 'herida', t: 4 }
            : ['masiva', 'crio', 'fibconc'].includes(r) ? { lesion: 'grande', t: 4, plaq: 46000 } : {};
        cambiar(e => { Object.assign(e, estadoBase(), { rep: r }, extra); });
    });
    $('m-hep').addEventListener('click', ev => { const b = ev.target.closest('[data-vso-hep]'); if (!b) return; pararPlay(); cambiar(e => { Object.assign(e, estadoBase(), { causa: 'hit', hep: b.dataset.vsoHep, plaq: PLAQ_CAUSA.hit }); }); });
    $('chips-estado').addEventListener('click', ev => { const b = ev.target.closest('[data-vso-estado]'); if (b) ponerEnEstado(b.dataset.vsoEstado); });
    enRaiz('[data-vso-lupa]').forEach(b => b.addEventListener('click', () => {
        const l = b.dataset.vsoLupa;
        if (lupaActual() === l) { ponerLupa(false); return; }
        // la herida y la cascada piden una herida en la pared: si no la hay, se abre (tiempo 4)
        if (l === 'placa' && estado.lesion !== 'placa') { pararPlay(); cambiar(e => { aPlaca(e); e.t = 4; }, { lupa: 'placa' }); return; }
        if (LUPAS_GRANDES.has(l) && estado.lesion === 'ninguna') { pararPlay(); cambiar(e => { e.lesion = 'herida'; e.t = l === 'cascada' ? 3 : 4; }, { lupa: l }); return; }
        ponerLupa(l); pintarLibro();
    }));
    // La pared se toca: abre una herida (y sus 4 tiempos) o, si ya la hay, su lupa
    $('lamina').addEventListener('click', ev => {
        if (modo !== 'explorar' || Guia.activo || !ev.target.closest('[data-vso-toca="herida"]')) return;
        if (estado.lesion === 'ninguna') { reproducir(); return; }
        if (lupaActual() !== 'herida') { ponerLupa('herida'); pintarLibro(); }
    });
    for (const k of ['explorar', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
    // La frase viva se lee entera al tocarla (cerrada, 3 líneas: el dock no tapa la lámina)
    $('frase').addEventListener('click', ev => { if (ev.target.closest('.vso-frase-txt')) $('frase').classList.toggle('vso-abierta'); });
    raiz.addEventListener('click', ev => {
        const g = ev.target.closest('[data-vso-guia]');
        if (g && modo === 'explorar') explicar(g.dataset.vsoGuia);
    });
    $('guia-abrir').addEventListener('click', () => { if (claveActual) explicar(claveActual); });
    // Tras «Ya lo tengo: ver opciones», el enunciado queda justo bajo el dibujo fijo y las opciones debajo
    $('preg').addEventListener('click', ev => {
        if (!ev.target.closest('[data-accion="ops"]')) return;
        requestAnimationFrame(() => {
            const en = $('preg').querySelector('.vso-pregunta');
            if (!en) return;
            const d = en.getBoundingClientRect().top - ($('escena-bloque').getBoundingClientRect().height + 8);
            if (Math.abs(d) > 2) window.scrollBy({ top: d, behavior: 'auto' });
        });
    });
}

/* ============================================================
   Las láminas del libro al lado del dibujo vivo (el lightbox de la app las amplía al tocarlas)
   ============================================================ */
function pintarLibro() {
    const L = lupaActual(), d = derivar(estado);
    const lams = [];
    if (L === 'frotis' || (d.mat && !L)) lams.push(LAMINAS.frotis);
    if (d.pie === 'fig132') lams.push(LAMINAS.fig132);
    if (estado.rep === 'pfc') lams.push(LAMINAS.balanza);
    if (estado.emb) lams.push(LAMINAS.fig222);
    const el = $('libro'), clave = lams.map(l => l[0]).join('|');
    el.hidden = !lams.length || modo !== 'explorar';
    if (el.dataset.clave === clave) return;
    el.dataset.clave = clave;
    $('libro-lams').innerHTML = lams.map(([src, alt]) => `<div class="article-figure vso-lam"><img loading="lazy" src="${src}" alt="${alt}"></div>`).join('');
    $('libro-txt').innerHTML = lams.length ? `<b>${lams.map(l => l[2]).join(' · ')}.</b> La lámina del libro, al lado de la viva: tócala para verla grande.` : '';
}

/* ============================================================
   La explicación guiada de cada estado: sus pasos van en el dock, en el sitio de los mandos; cada paso pone el vaso
   como lo cuenta, abre su lupa y señala en el dibujo lo que cuenta. «Ver en la ficha» lleva al párrafo exacto.
   ============================================================ */
let claveActual = null, guia = null;
const Guia = { get activo() { return !!guia && guia.activo; } };
function crearGuia() {
    guia = crearExplicacion({
        cont: $('dock-guia'), raiz,
        alPaso(paso) {
            const clave = guia.datos.clave, base = ESTADOS[clave];
            pararPlay();
            const est = typeof paso.estado === 'string' ? estadoDe(ESTADOS[paso.estado].p) : paso.estado ? estadoDe(paso.estado) : estadoDe(base.p);
            if (base.play && !paso.estado) est.t = 4;
            aplicar(est, { frase: false, lupa: 'lupa' in paso ? paso.lupa : null });
            fijar();
            mirar(null);
            subirEscena();
        },
        alSalir(d) {
            mirar(null);
            $('dock-explorar').hidden = modo !== 'explorar';
            fraseActual = ''; decir(...fraseDe(estado));
            sincronizarMandos();
            if (d && d.clave) requestAnimationFrame(() => $('guia-abrir').focus({ preventScroll: true }));
        },
        citaOpciones: { clase: 'cita', max: 90 },
    });
}
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
   Modos: Explorar | Mayéutica
   ============================================================ */
let modo = 'explorar';
function subir() { const r = raiz.getBoundingClientRect(); if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' }); }
function setModo(m) {
    if (guia && guia.activo) guia.cerrar();
    pararPlay();
    modo = m;
    for (const k of ['explorar', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('vso-estudio', m !== 'explorar');
    raiz.classList.toggle('vso-mayeutica', m === 'preguntas');   // la entradilla daría respuestas
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    mirar(null); ponerEstudio(m !== 'explorar'); setOcultos([]);
    if (m === 'preguntas') Mayeutica.entrar();
    if (m === 'explorar') { fraseActual = ''; decir(...fraseDe(estado)); }
    pintarLibro();
    if (REDUCIR) pintarUnaVez(); else arrancar();
    subir();
}

/* ============================================================
   «Ver en el texto» y los chips de origen (core/citas.js)
   ============================================================ */
const verEnTexto = (fuente, origen) => `<p class="vso-fuente-p">${origen ? `<span class="vso-org">${origen}</span> ` : ''}${enlacesFuente(fuente, { clase: 'vso-ir-texto', claseOrg: 'vso-org' })}</p>`;
const enlazarOrigenes = cont => enlazarCitas(cont, { selector: 'span.vso-org', clase: 'vso-org-ir', corta: true });

/* ============================================================
   Mayéutica: el motor común con los enganches del vaso
   ============================================================ */
// El vaso en el estado de la pregunta (sin pistas) y, al contestar, en el de su tema
function ponerModelo(q) {
    aplicar(estadoDe(q.estado), { frase: false, lupa: q.lupa === undefined ? null : q.lupa });
    fijar();
    mirar(q.mirar || null);
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || []);
}
function despues(q) {
    if (q.despuesP) aplicar(estadoDe(q.despuesP), { frase: false, lupa: null });
    else if (q.despues && ESTADOS[q.despues]) { aplicar(estadoDe(ESTADOS[q.despues].p), { frase: false, lupa: null }); if (ESTADOS[q.despues].play) cambiar(e => { e.t = 4; }, { frase: false, lupa: 'herida' }); }
    fijar();
}
const pintarDock = (items, izq, der) => pintarDockComun('vso', items, izq, der);
function mandoHTML(t) {
    const partes = [`<p class="vso-para"><b>Compruébalo en el vaso:</b> ${t.instruccion || ''}</p>`];
    for (const m of t.mandos) {
        if (m === 'tiempo') partes.push(`<div class="vso-seg" role="group" aria-label="Tiempo de la herida">${[1, 2, 3, 4].map(n => `<button type="button" data-mando="tiempo" data-v="${n}" aria-pressed="${estado.t === n && estado.lesion !== 'ninguna'}">${n}</button>`).join('')}</div>`);
        else if (m.startsWith('estado|')) { const [, k, txt] = m.split('|'); partes.push(`<button type="button" class="vso-b" data-mando="estado" data-v="${k}" aria-pressed="false">${txt}</button>`); }
    }
    return partes.join('');
}
function accionMando(m, cont) {
    if (m.dataset.mando === 'tiempo') {
        cambiar(e => { e.t = +m.dataset.v; if (e.lesion === 'ninguna') e.lesion = 'herida'; }, { frase: false, lupa: 'herida' }); fijar();
        cont.querySelectorAll('[data-mando="tiempo"]').forEach(b => b.setAttribute('aria-pressed', String(b === m)));
        return;
    }
    if (m.dataset.mando === 'estado') {
        aplicar(estadoDe(ESTADOS[m.dataset.v].p), { frase: false, lupa: null }); fijar();
        m.setAttribute('aria-pressed', 'true');
    }
}
const Mayeutica = crearMayeuticaModelo({
    p: 'vso', cont: () => $('preg'), clave: 'vaso-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { aplicar(estadoBase(), { frase: false, lupa: null }); setOcultos([]); },
    volverPor: 'El vaso que sangra',
    pregunta: {
        alEmpezar: q => ponerModelo(q),
        enlazar: enlazarOrigenes,
        verEnTexto: q => verEnTexto(q.fuente, q.origen),
        alCerrar: q => { setOcultos([]); despues(q); },
        alSalir: () => { mirar(null); setOcultos([]); },
        tocar: {
            mandoHTML,
            alMostrar: () => {},
            comprobar: q => q.tocar.comprobar(estado),
            confirma: q => q.tocar.confirma,
            ponerBueno: (q, cont) => {
                aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), { frase: false, lupa: q.tocar.mandos.includes('tiempo') ? 'herida' : null }); fijar();
                cont.querySelectorAll('[data-mando]').forEach(b => { if (b.dataset.mando === 'estado' || (b.dataset.mando === 'tiempo' && +b.dataset.v === estado.t)) b.setAttribute('aria-pressed', 'true'); });
            },
            alComprobar: () => setOcultos([]),
            accion: accionMando,
        },
    },
    textos: {
        ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): las preguntas de las fichas de la hemostasia, en su orden, y 4 que se predicen y se comprueban en el vaso.</span>
            <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de las propias fichas.</span>
            <span><b>3.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>4.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span>`,
        empezar: 'Empezar la guía socrática', seguir: 'Seguir',
        pie: 'Son las mismas preguntas del botón «Estudiar» de las fichas: aquí cada una mueve el vaso. El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde.',
        conModelo: 'el vaso',
        casos: 'El vaso se pone en el estado de cada paso antes de la pregunta y, al contestar, en el de su tema. Lo nuevo de la ficha del paciente sale en rojo.',
        abrirPaciente: 'Abrir el vaso en el estado del paciente',
    },
    preguntaDePaso: paso => ({ estado: paso.estado, ocultar: paso.ocultar }),
    abrirPaciente: C => { setModo('explorar'); ponerEnEstado(C.vaso); },
});

/* ============================================================
   Abrir en un estado (los chips, los botones de las fichas, los menús y el buscador)
   ============================================================ */
function ponerEnEstado(clave) {
    const k = ESTADOS[clave] ? clave : 'sano', s = ESTADOS[k];
    pararPlay();
    fraseActual = '';
    claveActual = k;
    aplicar(estadoDe(s.p), { lupa: null });
    if (s.play) reproducir();
    pestana(s.pestana || 'herida');
    sincronizarMandos();
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú): se abre como estaba.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('vso-volver'), raiz, origen);
    if (!clave) { requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' })); return; }
    if (guia && guia.activo) guia.cerrar();
    if (modo !== 'explorar') setModo('explorar');
    ponerEnEstado(clave);
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
const FORMAS = [
    ['rbc', 'Hematíe'], ['esquisto', 'Esquistocito: el hematíe roto en la red llena de coágulos'], ['plaqueta', 'Plaqueta'], ['plaquetaActiva', 'Plaqueta activada (con espinas)'],
    ['fvw', 'Factor de von Willebrand (FvW): ancla el tapón; en la PTT, sin cortar'], ['adamts13', 'ADAMTS-13: la tijera que corta el FvW'], ['fibrinogeno', 'Fibrinógeno (factor I)'], ['fibrina', 'Fibrina: el hilo de la red'],
    ['dimero', 'Dímero-D'], ['ft', 'Factor tisular: la chispa'], ['ca', 'Ca²⁺'], ['at', 'Antitrombina'], ['fII', 'Factores que dependen de la vitamina K (II, VII, IX y X), con su número'],
    ['fp4', 'Factor plaquetario 4 (FP4)'], ['heparina', 'Heparina'], ['igg', 'IgG (anticuerpo)'], ['macrofago', 'Macrófago'], ['agua', 'Sueros (agua)'],
];
function fijos() {
    $('leyenda-mini').innerHTML = [['plaqueta', 'plaqueta'], ['rbc', 'hematíe'], ['fibrina', 'fibrina'], ['fvw', 'FvW'], ['esquisto', 'esquistocito']].map(([k, t]) => `<li>${iconoParticula(k, 13)}${t}</li>`).join('');
    $('leyenda').innerHTML = FORMAS.map(([k, t]) => `<li>${iconoParticula(k, 22)}<span>${t}</span></li>`).join('');
    const chip = k => { const s = ESTADOS[k]; return `<button type="button" class="vso-chip-f" data-vso-estado="${k}" aria-pressed="false">${s.n}${s.s ? `<small>${s.s}</small>` : ''}</button>`; };
    $('chips-estado').innerHTML = GRUPOS_CHIPS.map(([g, t]) => `<div class="vso-grupo-chips"><h4>${t}</h4><div class="vso-chips-estado">${Object.keys(ESTADOS).filter(k => ESTADOS[k].grupo === g).map(chip).join('')}</div></div>`).join('');
    $('notas').innerHTML = NOTAS.map(n => `<div class="vso-nota-fuentes"><span class="vso-tipo-nota">${NOTA_TIPO[n.tipo]}</span>${n.txt} <span class="vso-org">ficha · ${n.fuente}</span></div>`).join('');
}
export function init() {
    raiz = document.getElementById('vso-raiz');
    if (!raiz) return null;
    initEscena();
    fijos(); engancharDock(); crearGuia();
    topes = crearTope({ monitor: $('escena'), dock: $('dock'), cita: c => { const r = rutaDe(c.id); return r ? `<span class="cita"><button type="button" class="vso-org-ir" ${atributosFicha(r)}>Ver en la ficha · p. ${c.pag} →</button></span>` : ''; } });
    $('escena').querySelector('.tope-linea')?.style.setProperty('display', 'none', 'important'); // el aviso ya vive en el dock; la tira tapaba la fila de abajo
    enRaiz('.vso-lead .vso-org').forEach(sp => { sp.innerHTML = origenCorto(sp.textContent); sp.dataset.enlazado = ''; });
    enlazarOrigenes(raiz);
    enRaiz('[data-vso-fuente]').forEach(sp => { sp.innerHTML = enlacesFuente(sp.dataset.vsoFuente, { clase: 'vso-ir-texto', claseOrg: 'vso-org' }); });
    Mayeutica.cargar();
    aplicar(estadoBase(), { frase: false }); decir(...fraseDe(estado));

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--vso-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    let anchoVisible = 0, motionPedido = false;
    const caja = $('escena');
    new ResizeObserver(() => {
        const a = Math.round(caja.clientWidth);
        document.body.classList.toggle('vso-activo', a > 0);
        if (!a) { anchoVisible = 0; return; }
        if (!anchoVisible) { const v = document.getElementById('vaso-vivo-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, nada cambia: el vaso no lo necesita */ }); }
        if (REDUCIR) pintarUnaVez(); else arrancar();
    }).observe(caja);
    new IntersectionObserver(es => ponerVisible(es[es.length - 1].isIntersecting)).observe(caja);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado, el estado del bucle y las citas de las explicaciones
    window.__vsoPruebas = () => {
        const r = pruebasVaso();
        const celdas = Object.fromEntries([...raiz.querySelectorAll('.vso-celda')].map(c => [c.id.replace('vso-c-', ''), c.querySelector('b').textContent]));
        return { ...r, bucle: estadoBucle(), modo, fase: Mayeutica.fase, estado: copia(estado), clave: claveActual, lupa: lupaActual(), celdas, ocultos: [...ocultos],
            guardado: Mayeutica.prog.g.leer(), vaciarFotogramas, reproduciendo: !!reproduciendo,
            guia: guia && guia.activo ? { clave: guia.datos.clave, paso: guia.paso, n: guia.datos.pasos.length } : null,
            citas: Object.entries(GUIAS).flatMap(([k, ps]) => ps.flatMap(pa => [].concat(pa.cita || []).map(c => ({ estado: k, ficha: c.ficha, id: c.id, exacta: citaExacta(c), ficha_existe: !!document.getElementById(c.ficha), pdf: hrefPdf(c) })))),
            enEstado: k => enEstado(k), pdf: PDF };
    };
    return { abrir: abrirEstado };
}
