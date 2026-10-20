// Estudiar: el recorrido de una ficha (REGLAS §8). El segundo botón del interruptor Texto | Estudiar.
//
// Decisión del usuario (20/10/2026, «opción 2: recorrido por pasos»), en las fichas del bloque 1: el interruptor
// «Texto | Visual | Mayéutica» pasa a «Texto | Estudiar». Estudiar es una lista de cinco pasos, con su marca de
// hecho, que abre lo que ya existía sin rehacerlo:
//   1. Mira: la vista Visual de la ficha, la misma de siempre, metida dentro del paso (el nodo `.vista-visual` se
//      mueve aquí la primera vez y se construye entonces: evento vistachange con `mira: true`, core/visual-kit.js).
//      Ya no hay botón «Visual» en estas fichas: el «🖼️ Visual» de la cabecera, irAlVisual() y los enlaces
//      `data-en-visual` abren Estudiar en este paso (core/vista-visual.js).
//   2. Juega con el modelo: un botón por estado de modelo vivo que ya enlaza la ficha (data-agua-viva,
//      data-capilar-vivo, data-cateter-vivo, data-eco-escenario…, con su «qué mirar», que es el texto del propio
//      enlace) más los `modeloVivo`/`modelo` de sus preguntas que no estén ya. Es el enlace cruzado de siempre: el
//      «← VOLVER A LA FICHA» del modelo deja la ficha en Estudiar y en este paso (el DOM no se rehace).
//   3. Piensa: la Guía socrática, preguntas encadenadas en el orden de la ficha.
//   4. Examínate: el Examen (nivel MIR u oposición) y, después, otra vez lo que fallaste (de la guía o del examen).
//   5. El caso: los casos clínicos que evolucionan, con «Lo que te llevas» y la vuelta a la ficha y al modelo vivo.
// Al final, siempre, «Para profundizar»: un plegable con los trozos de la ficha que no se cubren, copiados del DOM
// por id (sin duplicar el texto en los datos) y con su «Ver en el texto».
// Arriba, el resumen de los cinco pasos para saltar a cualquiera. Se ve un paso a la vez y cada uno se construye la
// primera vez que se abre. Marcas de hecho: Mira y Juega, solo en memoria (esta sesión); Piensa, Examínate y El caso
// salen de lo que ya se guardaba (no se guarda nada nuevo).
//
// Las preguntas son el motor de la Mayéutica del río y mar (js/modules/libros/agua-viva.js): los mismos tres
// formatos (test con «piensa antes», piensa y destapa, encuentra el error), el mismo repaso y los mismos casos. Lo
// que se comprueba en un modelo sale con el botón «Compruébalo en…», solo después de contestar (primero predices,
// luego compruebas), y es el enlace cruzado de siempre.
//
// Uso (después de montarVisual de la ficha):  montarMayeutica('mar-cristaloides', datos)
// Los datos viven en js/data/mayeutica/<bloque>-<grupo>.js (formato al principio de b1-fluidos.js). Las respuestas
// no van en el HTML: se miran en los datos al contestar. Aciertos y fallos se guardan en este dispositivo
// (localStorage, como el quiz), siempre dentro de try/catch.
import { initVistaVisual, irAlTexto } from './vista-visual.js';
import { rutaDePanel } from './search.js';
import { escapeHtml } from './ui.js';

/* ---------- Aciertos y fallos guardados (solo en este dispositivo) ---------- */
const CLAVE_GUARDADO = 'mayeutica-fichas-v1';
function leerGuardado() {
    try { return JSON.parse(localStorage.getItem(CLAVE_GUARDADO)) ?? {}; }
    catch { return {}; }
}
// Por pregunta: { aciertos, fallos, resultado ('on'|'mal'), repasar, faltan }.
function guardar(id, ok, { resultado, fallo } = {}) {
    try {
        const g = leerGuardado();
        const a = g[id] ?? { aciertos: 0, fallos: 0 };
        ok ? a.aciertos++ : a.fallos++;
        if (resultado) a.resultado = resultado;
        a.repasar = !!fallo; a.faltan = fallo?.faltan ?? [];
        g[id] = a;
        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(g));
    } catch { /* localStorage no disponible */ }
}
function borrarGuardado(ids) {
    try {
        const g = leerGuardado();
        ids.forEach(id => delete g[id]);
        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(g));
    } catch { /* localStorage no disponible */ }
}

/* ---------- Utilidades ---------- */
const TIPO_TXT = { test: 'Test · piensa antes', destapa: 'Piensa y destapa', error: 'Encuentra el error' };
const CUANTAS = ['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas', 'cinco cosas'];
const REDUCIR = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
// Orden fijo por pregunta, para que la buena no salga siempre en el mismo sitio (lo usa también la prueba).
export function barajar(ops, id) {
    const a = ops.map((o, i) => ({ ...o, i })); const h = hash(id);
    for (let i = a.length - 1; i > 0; i--) { const j = (h >>> (i * 3)) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}
function entrar(el) { el.classList.remove('may-entra'); void el.offsetWidth; el.classList.add('may-entra'); }
const verAbajo = el => el?.scrollIntoView?.({ block: 'nearest', behavior: REDUCIR ? 'auto' : 'smooth' });
const kebab = k => k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
const atributos = datos => Object.entries(datos).map(([k, v]) => ` data-${kebab(k)}="${escapeHtml(String(v))}"`).join('');

/* ---------- Modelos vivos: «Compruébalo en el modelo» ---------- */
// Cada clave es el atributo del enlace cruzado (data-agua-viva…); aquí van su especialidad, su vista y su nombre.
// Un modelo nuevo se añade con una línea. En los datos: modelo: { aguaViva: 'salino' } (o una lista de ellos).
const MODELOS = {
    aguaViva: { especialidad: 'libros', view: 'aguaViva', nombre: '🌊 el río y mar' },
    acidobaseVivo: { especialidad: 'nefrologia', nombre: '🧪 el ácido-base vivo' },
    ecoEscenario: { especialidad: 'eco', nombre: '🫀 la circulación viva' },
    capilarVivo: { especialidad: 'libros', view: 'capilarVivo', nombre: '🩸 el capilar vivo' },
    cateterVivo: { especialidad: 'libros', view: 'cateterVivo', nombre: '💉 el catéter vivo' },
    murallaViva: { especialidad: 'libros', view: 'murallaViva', nombre: '🧱 la muralla viva' },
    telarVivo: { especialidad: 'libros', view: 'telarVivo', nombre: '🧵 el telar vivo' },
    inmersionViva: { especialidad: 'libros', view: 'inmersionViva', nombre: '🤿 la inmersión' },
};
// modeloVivo (el modelo grande de la pregunta) sale primero; modelo (p. ej. la vista Visual de la ficha), detrás.
const modelosDe = o => [].concat(o?.modeloVivo || [], o?.modelo || []);
function botonesModelo(modelo, verbo = 'Compruébalo en') {
    if (!modelo || !modelo.length) return '';
    return [].concat(modelo).map(m => {
        const clave = Object.keys(m).find(k => MODELOS[k]);
        const base = clave ? MODELOS[clave] : {};
        const { texto, nombre, ...datos } = { especialidad: base.especialidad, ...(base.view ? { view: base.view } : {}), ...m };
        const etiqueta = texto || `${verbo} ${nombre || base.nombre || 'el modelo'}`;
        return `<button type="button" class="may-b may-modelo"${atributos(datos)}>${etiqueta} →</button>`;
    }).join('');
}

/* ---------- «Ver en el texto» ---------- */
function rutaDe(id) {
    const el = id && document.getElementById(id);
    if (!el) return null;
    const tab = el.classList.contains('tab-content') ? el : el.closest('.tab-content');
    const panel = tab?.closest('[id^="panel-"]');
    const nav = panel && rutaDePanel(panel.id);
    return nav ? { el, tab, panel: panel.id, nav } : null;
}
const limpio = t => (t || '').replace(/\s+/g, ' ').replace(/[+−]\s*$/, '').trim();
const tituloFicha = tab => limpio(tab.querySelector('h3')?.textContent || tab.id);
// Cómo se llama un trozo de la ficha: su <dt>, la cabecera de su acordeón, el rótulo de su tabla o su pie de figura.
// Si el rótulo del texto es ambiguo fuera de su ficha («Adónde va»), el trozo lleva su nombre en data-nombre.
function etiquetaDe(el) {
    if (el.dataset.nombre) return el.dataset.nombre;
    if (el.matches('dl')) return limpio(el.querySelector('dt')?.textContent);
    if (el.matches('.micro-prof-item')) return limpio(el.querySelector('.micro-prof-head span')?.textContent);
    if (el.matches('.article-figure')) return limpio(el.querySelector('.article-figure-caption')?.textContent).split('—')[0].trim();
    if (el.matches('details')) return limpio(el.querySelector('summary')?.textContent);
    // Tablas y figuras con id «…-tabla-10-2», «…-fig-10-1», «…-img-10-3»: «Tabla 10.2», «Figura 10.1».
    const num = el.id.match(/-(tabla|fig|img)-(\d+)-(\d+)$/);
    if (num) return `${num[1] === 'tabla' ? 'Tabla' : 'Figura'} ${num[2]}.${num[3]}`;
    const caja = el.parentElement?.matches('div[style*="overflow"]') ? el.parentElement : el;
    const previo = caja.previousElementSibling;
    if (el.matches('table, ul, ol') && previo?.matches('.section-label')) return limpio(previo.textContent);
    const t = limpio(el.textContent);
    return t.length > 48 ? t.slice(0, 46).replace(/\s+\S*$/, '') + '…' : t;
}
// fuente: ids separados por « · » («mar-salino · mar-tabla-10-2»); lo que no es un id queda como texto.
function verEnTexto(fuente, tab, origen) {
    if (!fuente) return '';
    const vistos = new Set();
    const trozos = String(fuente).split(' · ').map(t => {
        const m = t.trim().match(/^([a-z0-9]+(?:-[a-z0-9]+)+)(\s.*)?$/i);
        const r = m && rutaDe(m[1]);
        if (!r) return `<span class="may-org">${escapeHtml(t)}</span>`;
        const resto = m[2] ? escapeHtml(m[2]) : '';
        if (r.tab === tab) {
            const etq = r.el === r.tab ? 'esta ficha' : etiquetaDe(r.el);
            return `<button type="button" class="may-ir" data-may-texto="${r.el.id}">${escapeHtml(etq)}${resto}</button>`;
        }
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : '';
        const texto = (vistos.has(r.tab.id) ? (sub || tituloFicha(r.tab)) : tituloFicha(r.tab) + (sub ? ' · ' + sub : '')) + resto;
        vistos.add(r.tab.id);
        return `<button type="button" class="may-ir" data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}"${r.el !== r.tab ? ` data-resaltar="#${r.el.id}"` : ''}>${escapeHtml(texto.length > 70 ? texto.slice(0, 68) + '…' : texto)} ↗</button>`;
    });
    return `<p class="may-fuente"><span class="may-org">${escapeHtml(origen || 'ficha')}</span> Ver en el texto: ${trozos.join(' ')}</p>`;
}

/* ---------- Una pregunta (guía, examen, repaso y pasos de un caso) ---------- */
function pintarPregunta(cont, q, { tab, cabecera = '', repaso = null, alFinal }) {
    const res = { ok: true, faltan: [] };
    let h = cabecera;
    h += `<div class="may-cab">${q.num ? `<span class="may-num">${q.num}</span>` : ''}<span class="may-tipo">${TIPO_TXT[q.tipo]}</span></div>`;
    h += `<p class="may-pregunta">${q.enunciado}</p>`;
    if (q.calculadora) {
        const r = rutaDe(q.calculadora.ir);
        if (r) h += `<div class="may-fila"><button type="button" class="may-b may-link" data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}" data-resaltar="#${r.el.id}">🧮 Abrir la calculadora «${q.calculadora.nombre}»</button></div>`;
    }
    h += '<div class="may-fmt"></div><div class="may-res"></div>';
    cont.innerHTML = h; entrar(cont);
    const fmtEl = cont.querySelector('.may-fmt');
    const orden = q.tipo === 'test' ? barajar(q.opciones, q.id) : null;

    // Las respuestas buenas no están en el HTML: se miran en los datos al contestar.
    if (q.tipo === 'test') {
        fmtEl.innerHTML = `<p class="may-para">Piénsalo antes de ver las opciones.</p><div class="may-fila"><button class="may-b may-prim" type="button" data-accion="ops">Ya lo tengo: ver opciones</button></div>
            <div class="may-ops" hidden>${orden.map((o, k) => `<button class="may-b may-op" type="button" data-op="${k}">${o.t}</button>`).join('')}</div>`;
    } else if (q.tipo === 'destapa') {
        const vuelven = repaso?.faltan?.length ? repaso.faltan : null;
        const idx = vuelven || q.puntos.map((_, i) => i);
        fmtEl.innerHTML = `<p class="may-para">${vuelven ? `Vuelve${idx.length === 1 ? ' solo lo que te faltó' : `n los ${idx.length} que te faltaron`}.` : `Contesta en la cabeza: ${q.cuantas || `son ${CUANTAS[q.puntos.length]}`}. Luego destápalo.`}</p>
            <div class="may-fila"><button class="may-b may-prim" type="button" data-accion="destapa">Ya lo tengo: destapar</button></div>
            <div class="may-respuesta may-pts" hidden><p class="may-para">Marca, uno a uno, lo que tenías:</p>
            ${idx.map(i => `<label class="may-punto"><input type="checkbox" data-p="${i}"> <span>${q.puntos[i]}</span></label>`).join('')}
            <div class="may-fila"><button class="may-b" type="button" data-accion="puntos">Hecho</button></div></div>`;
    } else if (q.tipo === 'error') {
        fmtEl.innerHTML = `<p class="may-para">Toca las frases que creas falsas: puede haber 0, 1 o 2 errores.</p><div class="may-frases">${q.frases.map((f, i) =>
            `<button class="may-frase" type="button" data-fr="${i}"><span class="may-n">${i + 1}</span><span>${f.t}</span></button><div class="may-correccion" data-cfr="${i}" hidden></div>`).join('')}</div>
            <div class="may-fila"><button class="may-b may-prim" type="button" data-accion="corregir">Corregir</button></div>`;
    }
    entrar(fmtEl);

    function cerrar(htmlRes) {
        const r = cont.querySelector('.may-res');
        const modelo = botonesModelo(modelosDe(q));
        r.innerHTML = `<div class="may-respuesta may-entra">${htmlRes}
            ${q.nota ? `<div class="may-nota-fuentes">${q.nota}</div>` : ''}
            ${modelo ? `<div class="may-fila">${modelo}</div>` : ''}
            ${verEnTexto(q.fuente, tab, q.origen)}
            <div class="may-fila"><button class="may-b may-prim" type="button" data-accion="sig">${q.ultimo ? 'Ver lo que te llevas' : 'Siguiente →'}</button></div></div>`;
        verAbajo(r.querySelector('[data-accion="sig"]'));
    }

    cont.onclick = e => {
        const a = e.target.closest('[data-accion]')?.dataset.accion;
        if (a === 'ops') { cont.querySelector('.may-ops').hidden = false; e.target.closest('.may-fila').remove(); return; }
        if (a === 'destapa') { cont.querySelector('.may-pts').hidden = false; e.target.closest('.may-fila').remove(); return; }
        if (a === 'puntos') {
            const cajas = [...cont.querySelectorAll('.may-pts input')];
            const faltan = cajas.filter(c => !c.checked).map(c => +c.dataset.p);
            cajas.forEach(c => { c.disabled = true; });
            e.target.closest('button').disabled = true;
            if (faltan.length) { res.ok = false; res.faltan = faltan; }
            const n = cajas.length - faltan.length;
            cerrar(`<span class="${faltan.length ? 'may-mal' : 'may-ok'}">${faltan.length ? `✗ ${n} de ${cajas.length}. Lo que te faltó vuelve en el repaso.` : `✓ ${cajas.length === 1 ? 'La tenías' : 'Todas'}. Esta no vuelve.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'corregir') {
            let bien = 0;
            cont.querySelectorAll('.may-frase').forEach(b => {
                const f = q.frases[b.dataset.fr], marcada = b.classList.contains('may-marcada'), ok = marcada === !!f.mal;
                if (ok) bien++;
                b.classList.remove('may-marcada'); b.classList.add(ok ? 'may-acierto' : 'may-fallo'); b.disabled = true;
                b.querySelector('.may-n').textContent = `${+b.dataset.fr + 1} ${ok ? '✓' : '✗'}`;
                if (f.mal) { const c = cont.querySelector(`[data-cfr="${b.dataset.fr}"]`); c.hidden = false; c.innerHTML = `<b>Era falsa.</b> ¿Cómo sería la frase buena? <button class="may-b may-link" type="button" data-ver="${b.dataset.fr}">Pensado: ver</button>`; }
            });
            e.target.closest('button').disabled = true;
            const malas = q.frases.map((f, i) => f.mal ? i + 1 : 0).filter(Boolean);
            if (bien < q.frases.length) res.ok = false;
            cerrar(`<span class="${bien === q.frases.length ? 'may-ok' : 'may-mal'}">${bien === q.frases.length ? '✓' : '✗'} ${bien} de ${q.frases.length} bien juzgadas. ${malas.length === 0 ? 'No había ningún error.' : malas.length === 1 ? `Había un error: la ${malas[0]}.` : `Había ${malas.length} errores: la ${malas.join(' y la ')}.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'sig') { alFinal(res); return; }
        const ver = e.target.closest('[data-ver]');
        if (ver) { ver.parentElement.innerHTML = '<b>Corrección:</b> ' + q.frases[ver.dataset.ver].c; return; }
        const fr = e.target.closest('[data-fr]');
        if (fr && !fr.disabled) { fr.classList.toggle('may-marcada'); fr.setAttribute('aria-pressed', String(fr.classList.contains('may-marcada'))); return; }
        const op = e.target.closest('[data-op]');
        if (op && !op.disabled) {
            const o = orden[op.dataset.op];
            cont.querySelectorAll('.may-op').forEach(b => { b.disabled = true; });
            op.classList.add(o.ok ? 'may-elegida-ok' : 'may-elegida-mal');
            op.insertAdjacentHTML('afterbegin', o.ok ? '✓ ' : '✗ ');
            if (!o.ok) res.ok = false;
            cerrar(`<span class="${o.ok ? 'may-ok' : 'may-mal'}">${o.ok ? '✓ Bien' : '✗ Qué le habría pasado al paciente'}</span>${o.ok ? '' : `<p>${o.porque}</p>`}<p>${q.explicacion}</p>`);
        }
    };
}

/* ---------- Juega con el modelo: los estados que ya enlaza la ficha y sus preguntas ---------- */
const CLAVES_MODELO = Object.keys(MODELOS);
const claveDe = datos => CLAVES_MODELO.find(k => datos[k] !== undefined);
const sinAdorno = t => limpio(t).replace(/\s*→\s*$/, '').replace(/^[^\p{L}\p{N}¿¡«(]+/u, '').trim();
const mayuscula = t => t.replace(/\p{L}/u, c => c.toUpperCase());
// Lista de { clave, datos (atributos del enlace cruzado), que: ['qué mirar'…], deFicha }, sin estados repetidos.
function estadosParaJugar(tab, d) {
    const lista = [], vistos = new Map();
    const poner = (datos, que, deFicha, texto) => {
        const clave = claveDe(datos);
        if (!clave) return;
        const id = `${clave}=${datos[clave]}${datos.ecoPanel ? '/' + datos.ecoPanel : ''}`;
        const ya = vistos.get(id);
        // Un estado que ya enlaza la ficha se queda con el texto de la ficha.
        if (ya) { if (ya.deFicha === deFicha && !ya.que.includes(que)) ya.que.push(que); if (texto && !ya.texto) ya.texto = texto; return; }
        const e = { clave, datos, que: [que], deFicha, texto };
        vistos.set(id, e); lista.push(e);
    };
    // 1. Los enlaces de la propia ficha, en el orden del texto: su texto ya dice qué mirar
    //    («💉 Ver en el catéter vivo: el catéter manda; la vena no cuenta →»).
    tab.querySelectorAll(':scope > .vista-texto button').forEach(b => {
        const datos = { ...b.dataset };
        if (!claveDe(datos)) return;
        const t = limpio(b.textContent).replace(/\s*→\s*$/, '');
        const tras = t.match(/^\S+\s+Ver en [^:]+:\s*(.+)$/);
        poner(datos, mayuscula(tras ? tras[1] : sinAdorno(t)), true);
    });
    // 2. Los de las preguntas que no estén ya: su qué mirar es el texto de su botón o, si no lo tiene, la pregunta
    //    que lo usa («Guía 4 («el cloro»)»).
    const desde = (q, donde) => modelosDe(q).forEach(m => {
        const clave = claveDe(m);
        if (!clave) return;   // p. ej. la vista Visual de la propia ficha: ya es el paso «Mira»
        const base = MODELOS[clave];
        const { texto, nombre, ...resto } = { especialidad: base.especialidad, ...(base.view ? { view: base.view } : {}), ...m };
        poner(resto, donde, false, texto ? mayuscula(sinAdorno(texto)) : null);
    });
    d.guia.forEach((q, k) => desde(q, `Guía ${k + 1} («${q.corto}»)`));
    d.examen.forEach((q, k) => desde(q, `Examen ${k + 1} («${q.corto}»)`));
    d.casos.forEach(c => c.pasos.forEach((p, j) => desde(p.pregunta, `Caso, paso ${j + 1}`)));
    return lista;
}

/* ---------- Estudiar: el recorrido de la ficha ---------- */
const PASOS = [
    { id: 'mira', titulo: 'Mira' },
    { id: 'juega', titulo: 'Juega con el modelo' },
    { id: 'piensa', titulo: 'Piensa' },
    { id: 'examen', titulo: 'Examínate' },
    { id: 'caso', titulo: 'El caso' },
];
// Pasos vistos en esta sesión (Mira y Juega), por ficha. Solo en memoria: no se guarda nada nuevo.
const SESION = new Map();
const ZONA = '<div class="may-barra"><span class="may-etq"></span><span class="may-pasos" aria-hidden="true"></span></div><div class="may-zona" aria-live="polite"></div>';

class Estudiar {
    constructor(tab, raiz, datos) {
        this.tab = tab; this.raiz = raiz; this.d = datos;
        this.preguntas = [...datos.guia.map(q => ({ ...q, parte: 'guia' })), ...datos.examen.map(q => ({ ...q, parte: 'examen' }))];
        this.idsCasos = datos.casos.flatMap(c => c.pasos.map(p => p.pregunta.id));
        if (!SESION.has(tab.id)) SESION.set(tab.id, new Set());
        this.visto = SESION.get(tab.id);
        this.estados = estadosParaJugar(tab, datos);
        this.abierto = null; this.construidos = new Set();
        this.titulos = Object.fromEntries(PASOS.map(p => [p.id, p.id === 'caso' && datos.casos.length > 1 ? 'Los casos' : p.titulo]));
        raiz.innerHTML = `<div class="est-cabeza"><span class="may-eyebrow">Estudiar · tu recorrido</span>${datos.entrada ? `<p class="may-para">${datos.entrada}</p>` : ''}</div>
            <ol class="est-resumen">${PASOS.map(p => `<li><button type="button" class="est-ir" data-ir-paso="${p.id}"><span class="est-marca" aria-hidden="true"></span><span class="est-txt"><b></b><small></small></span></button></li>`).join('')}</ol>
            ${PASOS.map(p => `<section class="est-paso" data-paso="${p.id}" hidden></section>`).join('')}
            ${datos.profundizar?.length ? `<details class="may-profundizar"><summary>📚 Para profundizar: lo que no entra en el recorrido (${datos.profundizar.length})</summary><div class="may-prof-lista"></div></details>` : ''}`;
        this.sec = Object.fromEntries([...raiz.querySelectorAll('.est-paso')].map(s => [s.dataset.paso, s]));
        raiz.querySelector('.may-profundizar')?.addEventListener('toggle', e => { if (e.target.open) this.profundizar(); });
        raiz.addEventListener('click', e => {
            // «Ver en el texto» dentro de la propia ficha: vuelve a Texto y resalta la línea.
            const t = e.target.closest('[data-may-texto]');
            if (t) {
                const el = document.getElementById(t.dataset.mayTexto);
                irAlTexto(tab, el === tab ? (tab.querySelector('.vista-texto h3') || tab) : el);
                return;
            }
            const ir = e.target.closest('[data-ir-paso]');
            if (ir) { this.abrir(ir.dataset.irPaso); return; }
            // Abrir un modelo desde «Juega» marca el paso (el salto lo hace el enlace cruzado de siempre).
            if (e.target.closest('.est-juega')) { this.visto.add('juega'); this.pintarResumen(); return; }
            if (e.target.closest('[data-ir-prof]')) {
                const det = raiz.querySelector('.may-profundizar');
                det.open = true; det.scrollIntoView({ block: 'start', behavior: REDUCIR ? 'auto' : 'smooth' });
            }
        });
        this.cargar();
    }
    cargar() {
        const g = leerGuardado();
        this.resultados = {}; this.fallos = {};
        for (const q of this.preguntas) {
            const a = g[q.id]; if (!a) continue;
            if (a.resultado) this.resultados[q.id] = a.resultado;
            if (a.repasar) this.fallos[q.id] = { faltan: a.faltan || [] };
        }
    }

    /* --- El resumen de los cinco pasos y la navegación entre ellos --- */
    hechos() {
        const g = leerGuardado();
        return {
            mira: this.visto.has('mira'),
            juega: this.visto.has('juega'),
            piensa: this.d.guia.every(q => this.resultados[q.id]),
            examen: this.d.examen.every(q => this.resultados[q.id]) && !Object.keys(this.fallos).length,
            caso: this.idsCasos.every(id => g[id]),
        };
    }
    pintarResumen() {
        const hecho = this.hechos();
        const nG = this.d.guia.length, hG = this.d.guia.filter(q => this.resultados[q.id]).length;
        const nE = this.d.examen.length, nF = Object.keys(this.fallos).length;
        const modelos = [...new Set(this.estados.map(e => e.clave))].map(k => MODELOS[k].nombre);
        const sub = {
            mira: 'Los dibujos de la ficha: su vista Visual',
            juega: this.estados.length ? `${modelos.join(' · ')} · ${this.estados.length} estado${this.estados.length === 1 ? '' : 's'}` : 'Esta ficha no enlaza ningún modelo vivo',
            piensa: `Guía socrática · ${nG} preguntas${hG && hG < nG ? ` · llevas ${hG}` : ''}`,
            examen: `Examen MIR · ${nE} preguntas · repaso de lo fallado${nF ? ` (${nF} pendiente${nF === 1 ? '' : 's'})` : ''}`,
            caso: this.d.casos.map(c => c.titulo).join(' · '),
        };
        this.raiz.querySelectorAll('.est-ir').forEach((b, i) => {
            const id = b.dataset.irPaso, aqui = this.abierto === id;
            b.classList.toggle('est-hecho', hecho[id]);
            b.classList.toggle('est-aqui', aqui);
            if (aqui) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
            b.querySelector('.est-marca').textContent = hecho[id] ? '✓' : String(i + 1);
            b.querySelector('b').textContent = `${i + 1} · ${this.titulos[id]}${hecho[id] ? ' (hecho)' : ''}`;
            b.querySelector('small').textContent = sub[id];
        });
    }
    // Al pulsar «Estudiar»: el paso pedido (Mira, si viene de «Visual»), el que estaba abierto o el primero sin hacer.
    entrar(paso) {
        if (paso) this.abrir(paso, paso === 'mira' && this.abierto && this.abierto !== 'mira' ? this.abierto : null);
        else if (!this.abierto) { const h = this.hechos(); this.abrir(PASOS.find(p => !h[p.id])?.id || 'mira'); }
        else this.pintarResumen();
    }
    abrir(paso, desde = null) {
        if (!this.sec[paso]) return;
        for (const [id, s] of Object.entries(this.sec)) s.hidden = id !== paso;
        this.abierto = paso;
        if (!this.construidos.has(paso)) { this.construidos.add(paso); this.construir(paso); }
        if (paso === 'mira') {
            this.visto.add('mira');
            const v = this.sec.mira.querySelector('.est-volver-a');
            v.innerHTML = desde ? `<button type="button" class="may-b may-link" data-ir-paso="${desde}">← Volver a «${this.titulos[desde]}», donde estabas</button>` : '';
            v.hidden = !desde;
        }
        this.pintarResumen();
        this.subir(this.sec[paso]);
    }
    cabecera(paso) {
        const i = PASOS.findIndex(p => p.id === paso);
        return `<h4 class="est-paso-t"><span class="est-paso-n" aria-hidden="true">${i + 1}</span>Paso ${i + 1} · ${this.titulos[paso]}</h4>`;
    }
    pie(paso) {
        const i = PASOS.findIndex(p => p.id === paso), sig = PASOS[i + 1];
        if (sig) return `<div class="may-fila est-pie"><button type="button" class="may-b may-link" data-ir-paso="${sig.id}">Paso ${i + 2} · ${this.titulos[sig.id]} →</button></div>`;
        return this.d.profundizar?.length ? '<div class="may-fila est-pie"><button type="button" class="may-b may-link" data-ir-prof>📚 Al final: Para profundizar ↓</button></div>' : '';
    }
    construir(paso) {
        const s = this.sec[paso];
        if (paso === 'mira') {
            s.innerHTML = `${this.cabecera(paso)}<div class="may-fila est-volver-a" hidden></div>
                <p class="may-para">La vista Visual de la ficha. Cada marcador lleva su «Ver en el texto».</p><div class="est-lienzo"></div>${this.pie(paso)}`;
            const visual = this.tab.querySelector(':scope > .vista-visual');
            const lienzo = s.querySelector('.est-lienzo');
            if (visual) {
                lienzo.append(visual);
                // core/visual-kit.js la construye ahora, ya visible dentro del paso.
                this.tab.dispatchEvent(new CustomEvent('vistachange', { detail: { vista: 'estudiar', mira: true } }));
            } else lienzo.innerHTML = '<p class="may-para">Esta ficha no tiene dibujos propios: su modelo vivo está en el paso 2.</p>';
            return;
        }
        if (paso === 'juega') {
            const grupos = new Map();
            this.estados.forEach(e => { if (!grupos.has(e.clave)) grupos.set(e.clave, []); grupos.get(e.clave).push(e); });
            s.innerHTML = `${this.cabecera(paso)}
                <p class="may-para">Abre el modelo en el estado de la ficha y mira lo que dice cada botón. Su «← VOLVER A LA FICHA» te deja aquí, en este paso.</p>
                ${grupos.size ? [...grupos].map(([clave, es]) => {
                    const boton = e => `<button type="button" class="est-juega"${atributos(e.datos)}>${escapeHtml(e.deFicha ? e.que.join(' · ') : e.texto || e.que.join(', '))} →</button>`;
                    const deFicha = es.filter(e => e.deFicha), dePreguntas = es.filter(e => !e.deFicha);
                    return `<div class="est-grupo"><h5 class="est-grupo-t">${escapeHtml(mayuscula(MODELOS[clave].nombre))}</h5>${deFicha.map(boton).join('')}
                        ${dePreguntas.length ? `<p class="may-para">${deFicha.length ? 'Y los' : 'Los'} estados que usan sus preguntas (mejor después de contestarlas):</p>${dePreguntas.map(boton).join('')}` : ''}</div>`;
                }).join('') : '<p class="may-para">Esta ficha no enlaza ningún modelo vivo.</p>'}
                ${this.pie(paso)}`;
            return;
        }
        s.innerHTML = this.cabecera(paso) + ZONA + this.pie(paso);
        if (paso === 'piensa') this.inicioParte('guia');
        if (paso === 'examen') this.inicioParte('examen');
        if (paso === 'caso') this.listaCasos();
    }
    zona(paso) { return this.sec[paso].querySelector('.may-zona'); }
    barra(paso, items, etiqueta) {
        this.sec[paso].querySelector('.may-etq').textContent = etiqueta;
        this.sec[paso].querySelector('.may-pasos').innerHTML = items.map(c => `<i class="${c.split(' ').filter(Boolean).map(x => 'may-' + x).join(' ')}"></i>`).join('');
    }
    subir(el) {
        const r = el.getBoundingClientRect();
        if (r.top < 0 || r.top > window.innerHeight - 120) el.scrollIntoView({ block: 'start', behavior: 'auto' });
    }

    /* --- Pasos 3 y 4: Guía socrática y Examen --- */
    lista(parte) { return parte === 'guia' ? this.d.guia : this.d.examen; }
    pasoDe(parte) { return parte === 'guia' ? 'piensa' : 'examen'; }
    inicioParte(parte) {
        const P = this.lista(parte), paso = this.pasoDe(parte), zona = this.zona(paso), guia = parte === 'guia';
        const n = P.length, hechas = P.filter(q => this.resultados[q.id]).length, bien = P.filter(q => this.resultados[q.id] === 'on').length;
        const nF = Object.keys(this.fallos).length;
        zona.innerHTML = `<span class="may-eyebrow">${guia ? 'Guía socrática' : 'Examen'}</span>
            <h4 class="may-titulo">${guia ? `${n} preguntas encadenadas, en el orden de la ficha` : `${n} preguntas de nivel MIR`}</h4>
            <p class="may-para">${guia ? 'Te llevan de la mano: predice, contesta y mira por qué. Las que se ven en un modelo vivo traen, tras contestar, «Compruébalo en…»; su «← VOLVER» te deja aquí.'
                : 'Con trampas que salen de la propia ficha. Después, otra vez lo que fallaste (de la guía o del examen), solo eso.'}</p>
            <div class="may-fila"><button class="may-b may-prim" type="button" data-ir="seguir">${hechas === n ? 'Otra vez desde la primera' : hechas ? `Seguir (${hechas} de ${n})` : guia ? 'Empezar la guía socrática' : 'Empezar el examen'}</button>
                ${!guia && nF ? `<button class="may-b" type="button" data-ir="repaso">Otra vez lo que fallaste (${nF})</button>` : ''}</div>
            ${hechas ? `<p class="may-para">Guardado en este dispositivo: ${bien} de ${hechas} bien a la primera. <button class="may-b may-link" type="button" data-ir="cero">Empezar de cero</button></p>` : ''}`;
        entrar(zona);
        zona.onclick = e => {
            const ir = e.target.closest('[data-ir]')?.dataset.ir;
            if (ir === 'cero') { borrarGuardado(P.map(q => q.id)); this.cargar(); this.pintarResumen(); this.inicioParte(parte); return; }
            if (ir === 'seguir') { const i = P.findIndex(q => !this.resultados[q.id]); this.recorrido(parte, i < 0 ? 0 : i); }
            if (ir === 'repaso') this.repaso();
        };
        this.barra(paso, P.map(q => this.resultados[q.id] || ''), guia ? 'Guía socrática' : 'Examen');
    }
    recorrido(parte, k) {
        const P = this.lista(parte), paso = this.pasoDe(parte);
        if (k >= P.length) { if (parte === 'guia') this.finGuia(); else this.repaso(); return; }
        const q = P[k], nF = Object.keys(this.fallos).length;
        this.barra(paso, P.map((p, j) => (this.resultados[p.id] === 'mal' ? 'mal' : this.resultados[p.id] ? 'on' : '') + (j === k ? ' aqui' : '')),
            `${parte === 'guia' ? 'Guía socrática' : 'Examen'} · ${k + 1} de ${P.length}${nF ? ` · para repasar: ${nF}` : ''}`);
        pintarPregunta(this.zona(paso), { ...q, num: k + 1 }, { tab: this.tab, alFinal: r => {
            this.resultados[q.id] = r.ok ? 'on' : 'mal';
            if (!r.ok) this.fallos[q.id] = { faltan: r.faltan }; else delete this.fallos[q.id];
            guardar(q.id, r.ok, { resultado: this.resultados[q.id], fallo: this.fallos[q.id] });
            this.pintarResumen();
            this.recorrido(parte, k + 1); this.subir(this.sec[paso]);
        } });
    }
    finGuia() {
        const G = this.d.guia, zona = this.zona('piensa');
        const bien = G.filter(q => this.resultados[q.id] === 'on').length, nF = G.filter(q => this.fallos[q.id]).length;
        zona.innerHTML = `<span class="may-eyebrow">Guía socrática hecha</span><h4 class="may-titulo">${bien} de ${G.length} a la primera</h4>
            <p class="may-para">Ahora, el <b>Examen</b>: ${this.d.examen.length} preguntas de nivel MIR. Las opciones falsas son las confusiones que la propia ficha aclara.${nF ? ` Lo que fallaste aquí (${nF}) vuelve después del examen.` : ''}</p>
            <div class="may-fila"><button class="may-b may-prim" type="button" data-ir-paso="examen">Paso 4 · ${this.titulos.examen} →</button></div>`;
        entrar(zona); zona.onclick = null;
        this.barra('piensa', G.map(q => this.resultados[q.id] === 'mal' ? 'mal' : 'on'), 'Guía socrática hecha');
    }
    // Otra vez lo que fallaste (de la guía o del examen), al final del paso 4.
    repaso() {
        const zona = this.zona('examen');
        const lista = this.preguntas.filter(q => this.fallos[q.id]);
        const irCaso = `Paso 5 · ${this.titulos.caso} →`;
        this.barra('examen', lista.map(() => 'mal'), lista.length ? `Otra vez lo que fallaste · quedan ${lista.length}` : 'Otra vez lo que fallaste');
        if (!lista.length) {
            zona.innerHTML = `<span class="may-eyebrow">Otra vez lo que fallaste</span><h4 class="may-titulo">No queda nada por repasar</h4>
                <p class="may-para">Has acertado todo, o ya lo repasaste.</p><div class="may-fila"><button class="may-b may-prim" type="button" data-ir-paso="caso">${irCaso}</button></div>`;
        } else {
            zona.innerHTML = `<span class="may-eyebrow">Otra vez lo que fallaste</span><h4 class="may-titulo">Te quedan ${lista.length}</h4>
                <p class="may-para">En las de destapar, solo vuelve lo que no marcaste. Un acierto la saca de la lista.</p>
                <div class="may-repaso-chips">${lista.map(q => { const k = this.lista(q.parte).findIndex(x => x.id === q.id); return `<button class="may-b" type="button" data-rep="${q.id}">${q.parte === 'guia' ? 'Guía' : 'Examen'} ${k + 1} · ${q.corto}</button>`; }).join('')}</div>
                <div class="may-fila"><button class="may-b may-link" type="button" data-ir-paso="caso">Saltar al ${irCaso}</button></div>`;
        }
        entrar(zona);
        zona.onclick = e => {
            const b = e.target.closest('[data-rep]');
            if (!b) return;
            const q = this.preguntas.find(x => x.id === b.dataset.rep);
            const k = this.lista(q.parte).findIndex(x => x.id === q.id);
            pintarPregunta(zona, { ...q, num: k + 1 }, { tab: this.tab, repaso: this.fallos[q.id], cabecera: '<span class="may-eyebrow">Repaso</span>', alFinal: r => {
                if (r.ok) delete this.fallos[q.id];
                else if (q.tipo === 'destapa' && this.fallos[q.id].faltan?.length) this.fallos[q.id].faltan = r.faltan.length ? r.faltan : this.fallos[q.id].faltan;
                else this.fallos[q.id] = { faltan: r.faltan };
                guardar(q.id, r.ok, { fallo: this.fallos[q.id] });
                this.pintarResumen();
                this.repaso(); this.subir(this.sec.examen);
            } });
        };
    }

    /* --- Paso 5: los casos --- */
    listaCasos() {
        const C = this.d.casos, zona = this.zona('caso');
        zona.innerHTML = `<span class="may-eyebrow">Casos clínicos</span><h4 class="may-titulo">${C.length === 1 ? 'Un paciente que evoluciona' : `${C.length} pacientes que evolucionan`}</h4>
            <p class="may-para">Lo nuevo de la ficha del paciente sale en rojo y marcado. El paciente se inventa; la medicina sale de la ficha, y cada paso dice dónde.</p>
            <div class="may-casos-lista">${C.map((c, k) => `<button class="may-b" type="button" data-caso="${k}">${c.titulo}<small>${c.sub} · ${c.pasos.length} pasos</small></button>`).join('')}</div>`;
        entrar(zona);
        this.barra('caso', C.map(() => ''), 'Casos clínicos');
        zona.onclick = e => { const b = e.target.closest('[data-caso]'); if (b) this.caso(+b.dataset.caso); };
    }
    caso(k) { this.k = k; this.p = 0; this.ficha = {}; this.pasoCaso(); }
    pasoCaso() {
        const C = this.d.casos[this.k], paso = C.pasos[this.p];
        if (this.p === 0) this.ficha = { ...C.paciente };
        Object.assign(this.ficha, paso.datos || {});
        const nuevos = paso.nuevo || [];
        this.barra('caso', C.pasos.map((_, j) => j < this.p ? 'on' : j === this.p ? 'on aqui' : ''), `${C.corto} · paso ${this.p + 1} de ${C.pasos.length}`);
        const cab = `<span class="may-dia">${paso.momento}</span>
            <dl class="may-paciente">${Object.entries(this.ficha).map(([kk, v]) => `<dt>${kk}</dt><dd${nuevos.includes(kk) ? ' class="may-cambia"' : ''}>${v}${nuevos.includes(kk) ? ' <small class="may-nuevo">nuevo</small>' : ''}</dd>`).join('')}</dl>`;
        const q = { ...paso.pregunta, ultimo: this.p === C.pasos.length - 1, calculadora: paso.calculadora };
        pintarPregunta(this.zona('caso'), q, { tab: this.tab, cabecera: cab, alFinal: r => {
            guardar(q.id, r.ok);
            if (this.p < C.pasos.length - 1) { this.p++; this.pasoCaso(); this.subir(this.sec.caso); }
            else this.finCaso();
        } });
    }
    finCaso() {
        const C = this.d.casos[this.k], zona = this.zona('caso');
        zona.innerHTML = `<div class="may-respuesta may-entra"><span class="may-eyebrow">Lo que te llevas · ${C.corto}</span>
            <ol class="may-lleva">${C.lleva.map(t => `<li>${t}</li>`).join('')}</ol>
            <div class="may-fila"><button class="may-b may-link" type="button" data-may-texto="${C.volver?.ancla || this.tab.id}">📖 Repasar en la ficha${C.volver?.nombre ? `: ${C.volver.nombre}` : ''}</button>
            ${botonesModelo(modelosDe(C.volver), 'Abrir en el estado del paciente:')}
            <button class="may-b" type="button" data-fin="otro">Otro caso</button></div></div>`;
        entrar(zona); this.subir(this.sec.caso);
        this.barra('caso', C.pasos.map(() => 'on'), `${C.corto} · hecho`);
        this.pintarResumen();
        zona.onclick = e => { if (e.target.closest('[data-fin="otro"]')) { this.listaCasos(); this.subir(this.sec.caso); } };
    }

    // «Para profundizar»: cada trozo se copia del texto de la ficha la primera vez que se abre (sin ids repetidos).
    profundizar() {
        const lista = this.raiz.querySelector('.may-prof-lista');
        if (lista.dataset.hecho) return;
        lista.dataset.hecho = '';
        for (const p of this.d.profundizar) {
            const el = document.getElementById(p.id);
            if (!el) { console.warn(`[mayeutica] ${this.tab.id}: «Para profundizar» sin su trozo →`, p.id); continue; }
            const sec = document.createElement('section');
            sec.className = 'may-prof-item';
            sec.innerHTML = `<h5>${escapeHtml(p.titulo || etiquetaDe(el))}</h5>${p.nota ? `<p class="may-para">${p.nota}</p>` : ''}<div class="may-prof-cuerpo"></div>
                <div class="may-fila"><button type="button" class="may-b may-link" data-may-texto="${p.id}">Ver en el texto →</button></div>`;
            const cuerpo = sec.querySelector('.may-prof-cuerpo');
            const origen = el.matches('.micro-prof-item') ? el.querySelector('.micro-prof-body') : null;
            const copias = origen ? [...origen.children].map(n => n.cloneNode(true)) : [el.cloneNode(true)];
            for (const c of copias) {
                c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
                if (c.matches('table')) { const caja = document.createElement('div'); caja.style.overflowX = 'auto'; caja.append(c); cuerpo.append(caja); }
                else cuerpo.append(c);
            }
            lista.append(sec);
        }
    }
}

// Añade Estudiar a una ficha que ya tiene su interruptor Texto | Visual (llámese después de montarVisual): el
// interruptor pasa a Texto | Estudiar. Se construye la primera vez que se pulsa «Estudiar» (o se pide su Visual).
export function montarMayeutica(tabId, datos) {
    const tab = document.getElementById(tabId);
    if (!tab || tab.querySelector(':scope > .vista-estudiar')) return;
    const previo = tab.querySelector(':scope > .vista-visual') || tab.querySelector(':scope > .vista-texto');
    if (!tab.hasAttribute('data-visual') || !previo) { console.warn('[mayeutica] la ficha no tiene su interruptor Texto | Visual:', tabId); return; }
    const raiz = document.createElement('div');
    raiz.className = 'vista-estudiar may';
    previo.after(raiz);
    initVistaVisual(tab.parentElement);
    let estudiar = null;
    const abrir = paso => { estudiar ??= new Estudiar(tab, raiz, datos); estudiar.entrar(paso); };
    // vista 'estudiar' (con paso: 'mira' si se pidió la Visual); el aviso con mira: true es el propio paso Mira.
    tab.addEventListener('vistachange', e => { if (e.detail.vista === 'estudiar' && !e.detail.mira) abrir(e.detail.paso); });
    if (tab.classList.contains('modo-estudiar')) abrir();
}
