// Mayéutica de una ficha (REGLAS §8): el tercer botón del interruptor Texto | Visual | Mayéutica.
//
// Aprender a base de preguntas, sin salir de la ficha, en cuatro partes:
//   1. Guía socrática: preguntas encadenadas, en el orden de la ficha;
//   2. Examen: nivel MIR u oposición;
//   3. Otra vez lo que fallaste (o sabías a medias), solo eso;
//   4. Casos clínicos que evolucionan, con «Lo que te llevas» y la vuelta a la ficha y al modelo vivo.
// Al final, «Para profundizar»: un plegable con los trozos de la ficha que no se cubren, copiados del DOM por id
// (sin duplicar el texto en los datos) y con su «Ver en el texto».
//
// Es el motor de la Mayéutica del río y mar (js/modules/libros/agua-viva.js), sacado del modelo vivo: los mismos
// tres formatos (test con «piensa antes», piensa y destapa, encuentra el error), el mismo repaso y los mismos casos.
// Lo que en el río y mar se comprueba tocando el estuario, aquí se comprueba con el botón «Compruébalo en el modelo»,
// que sale solo después de contestar (primero predices, luego compruebas) y es el enlace cruzado de siempre
// (data-agua-viva, data-acidobase-vivo…): el «← VOLVER» del modelo vuelve a esta ficha.
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

/* ---------- La Mayéutica de una ficha ---------- */
const PARTES = { guia: 'Guía socrática', examen: 'Examen' };

class Mayeutica {
    constructor(tab, raiz, datos) {
        this.tab = tab; this.raiz = raiz; this.d = datos;
        this.preguntas = [...datos.guia.map(q => ({ ...q, parte: 'guia' })), ...datos.examen.map(q => ({ ...q, parte: 'examen' }))];
        this.idsCasos = datos.casos.flatMap(c => c.pasos.map(p => p.pregunta.id));
        this.fase = 'inicio';
        raiz.innerHTML = `<div class="may-barra"><span class="may-etq"></span><span class="may-pasos" aria-hidden="true"></span></div>
            <div class="may-zona" aria-live="polite"></div>
            ${datos.profundizar?.length ? `<details class="may-profundizar"><summary>📚 Para profundizar: lo que la Mayéutica no cubre (${datos.profundizar.length})</summary><div class="may-prof-lista"></div></details>` : ''}`;
        this.zona = raiz.querySelector('.may-zona');
        raiz.querySelector('.may-profundizar')?.addEventListener('toggle', e => { if (e.target.open) this.profundizar(); });
        // «Ver en el texto» dentro de la propia ficha: vuelve a Texto y resalta la línea.
        raiz.addEventListener('click', e => {
            const b = e.target.closest('[data-may-texto]');
            if (!b) return;
            const el = document.getElementById(b.dataset.mayTexto);
            irAlTexto(tab, el === tab ? (tab.querySelector('.vista-texto h3') || tab) : el);
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
    barra(items, etiqueta) {
        this.raiz.querySelector('.may-etq').textContent = etiqueta;
        this.raiz.querySelector('.may-pasos').innerHTML = items.map(c => `<i class="${c.split(' ').filter(Boolean).map(x => 'may-' + x).join(' ')}"></i>`).join('');
    }
    subir() {
        const r = this.raiz.getBoundingClientRect();
        if (r.top < 0) this.raiz.scrollIntoView({ block: 'start', behavior: 'auto' });
    }

    inicio() {
        this.fase = 'inicio';
        const n = this.preguntas.length, hechas = this.preguntas.filter(q => this.resultados[q.id]).length;
        const bien = this.preguntas.filter(q => this.resultados[q.id] === 'on').length;
        const nG = this.d.guia.length, nE = this.d.examen.length, nC = this.d.casos.length;
        this.zona.innerHTML = `<span class="may-eyebrow">Mayéutica</span><h4 class="may-titulo">Aprende la ficha a base de preguntas</h4>
            ${this.d.entrada ? `<p class="may-para">${this.d.entrada}</p>` : ''}
            <ol class="may-ruta">
                <li><b>Guía socrática</b>: ${nG} preguntas encadenadas, en el orden de la ficha.</li>
                <li><b>Examen</b>: ${nE} preguntas de nivel MIR, con trampas que salen de la propia fuente.</li>
                <li><b>Otra vez lo que fallaste</b> o sabías a medias, solo eso.</li>
                <li><b>Caso${nC === 1 ? '' : 's'} clínico${nC === 1 ? '' : 's'}</b>: ${nC} paciente${nC === 1 ? '' : 's'} que evoluciona${nC === 1 ? '' : 'n'}.</li>
            </ol>
            <div class="may-fila"><button class="may-b may-prim" type="button" data-ir="seguir">${hechas ? `Seguir (${hechas} de ${n})` : 'Empezar la guía socrática'}</button>
                <button class="may-b" type="button" data-ir="examen">Ir al examen</button><button class="may-b" type="button" data-ir="casos">Ir a los casos</button></div>
            ${hechas ? `<p class="may-para">Guardado en este dispositivo: ${bien} de ${hechas} bien a la primera. <button class="may-b may-link" type="button" data-ir="cero">Empezar de cero</button></p>` : ''}
            <p class="may-para">Las preguntas que se ven en un modelo vivo traen, tras contestar, el botón «Compruébalo en el modelo»; su «← VOLVER» te deja aquí.</p>`;
        entrar(this.zona);
        this.zona.onclick = e => {
            const b = e.target.closest('[data-ir]'); if (!b) return;
            const ir = b.dataset.ir;
            if (ir === 'cero') { borrarGuardado([...this.preguntas.map(q => q.id), ...this.idsCasos]); this.cargar(); this.inicio(); return; }
            if (ir === 'seguir') this.recorrido(this.siguientePendiente());
            if (ir === 'examen') this.recorrido(this.d.guia.length);
            if (ir === 'casos') this.listaCasos();
        };
        this.barra(this.preguntas.map(q => this.resultados[q.id] || ''), 'Mayéutica');
    }
    siguientePendiente() { const i = this.preguntas.findIndex(q => !this.resultados[q.id]); return i < 0 ? this.preguntas.length : i; }

    // Guía socrática y examen, seguidos; entre los dos, un respiro que dice qué viene.
    recorrido(i, sinPausa = false) {
        this.fase = 'recorrido'; this.i = i;
        if (i >= this.preguntas.length) { this.repaso(); return; }
        const q = this.preguntas[i], nG = this.d.guia.length;
        if (i === nG && i > 0 && !sinPausa && this.resultados[this.preguntas[i - 1].id]) { this.pausaExamen(); return; }
        const enParte = q.parte === 'guia' ? this.d.guia : this.d.examen, k = q.parte === 'guia' ? i : i - nG;
        const nFallos = Object.keys(this.fallos).length;
        this.barra(enParte.map((p, j) => (this.resultados[p.id] === 'mal' ? 'mal' : this.resultados[p.id] ? 'on' : '') + (j === k ? ' aqui' : '')),
            `${PARTES[q.parte]} · ${k + 1} de ${enParte.length}${nFallos ? ` · para repasar: ${nFallos}` : ''}`);
        pintarPregunta(this.zona, { ...q, num: k + 1 }, { tab: this.tab, alFinal: r => {
            this.resultados[q.id] = r.ok ? 'on' : 'mal';
            if (!r.ok) this.fallos[q.id] = { faltan: r.faltan }; else delete this.fallos[q.id];
            guardar(q.id, r.ok, { resultado: this.resultados[q.id], fallo: this.fallos[q.id] });
            this.recorrido(i + 1); this.subir();
        } });
    }
    pausaExamen() {
        const nG = this.d.guia.length, bien = this.d.guia.filter(q => this.resultados[q.id] === 'on').length;
        this.zona.innerHTML = `<span class="may-eyebrow">Guía socrática hecha</span><h4 class="may-titulo">${bien} de ${nG} a la primera</h4>
            <p class="may-para">Ahora el <b>Examen</b>: ${this.d.examen.length} preguntas de nivel MIR. Las opciones falsas son las confusiones que la propia ficha aclara.</p>
            <div class="may-fila"><button class="may-b may-prim" type="button" data-ir="examen">Empezar el examen →</button></div>`;
        entrar(this.zona);
        this.zona.onclick = e => { if (e.target.closest('[data-ir="examen"]')) { this.recorrido(nG, true); this.subir(); } };
        this.barra(this.d.guia.map(q => this.resultados[q.id] === 'mal' ? 'mal' : 'on'), 'Guía socrática hecha');
    }

    repaso() {
        this.fase = 'repaso';
        const lista = this.preguntas.filter(q => this.fallos[q.id]);
        this.barra(lista.map(() => 'mal'), lista.length ? `Otra vez lo que fallaste · quedan ${lista.length}` : 'Otra vez lo que fallaste');
        if (!lista.length) {
            this.zona.innerHTML = `<span class="may-eyebrow">Otra vez lo que fallaste</span><h4 class="may-titulo">No queda nada por repasar</h4>
                <p class="may-para">Has acertado todo, o ya lo repasaste.</p><div class="may-fila"><button class="may-b may-prim" type="button" data-ir="casos">Ir a los casos clínicos →</button></div>`;
        } else {
            this.zona.innerHTML = `<span class="may-eyebrow">Otra vez lo que fallaste</span><h4 class="may-titulo">Te quedan ${lista.length}</h4>
                <p class="may-para">En las de destapar, solo vuelve lo que no marcaste. Un acierto la saca de la lista.</p>
                <div class="may-repaso-chips">${lista.map(q => { const k = (q.parte === 'guia' ? this.d.guia : this.d.examen).findIndex(x => x.id === q.id); return `<button class="may-b" type="button" data-rep="${q.id}">${q.parte === 'guia' ? 'Guía' : 'Examen'} ${k + 1} · ${q.corto}</button>`; }).join('')}</div>
                <div class="may-fila"><button class="may-b may-link" type="button" data-ir="casos">Saltar a los casos →</button></div>`;
        }
        entrar(this.zona);
        this.zona.onclick = e => {
            const b = e.target.closest('[data-rep]');
            if (b) {
                const q = this.preguntas.find(x => x.id === b.dataset.rep);
                const k = (q.parte === 'guia' ? this.d.guia : this.d.examen).findIndex(x => x.id === q.id);
                pintarPregunta(this.zona, { ...q, num: k + 1 }, { tab: this.tab, repaso: this.fallos[q.id], cabecera: '<span class="may-eyebrow">Repaso</span>', alFinal: r => {
                    if (r.ok) delete this.fallos[q.id];
                    else if (q.tipo === 'destapa' && this.fallos[q.id].faltan?.length) this.fallos[q.id].faltan = r.faltan.length ? r.faltan : this.fallos[q.id].faltan;
                    else this.fallos[q.id] = { faltan: r.faltan };
                    guardar(q.id, r.ok, { fallo: this.fallos[q.id] });
                    this.repaso(); this.subir();
                } });
                return;
            }
            if (e.target.closest('[data-ir="casos"]')) { this.listaCasos(); this.subir(); }
        };
    }

    listaCasos() {
        this.fase = 'casos';
        const C = this.d.casos;
        this.zona.innerHTML = `<span class="may-eyebrow">Casos clínicos</span><h4 class="may-titulo">${C.length === 1 ? 'Un paciente que evoluciona' : `${C.length} pacientes que evolucionan`}</h4>
            <p class="may-para">Lo nuevo de la ficha del paciente sale en rojo y marcado. El paciente se inventa; la medicina sale de la ficha, y cada paso dice dónde.</p>
            <div class="may-casos-lista">${C.map((c, k) => `<button class="may-b" type="button" data-caso="${k}">${c.titulo}<small>${c.sub} · ${c.pasos.length} pasos</small></button>`).join('')}</div>`;
        entrar(this.zona);
        this.barra(C.map(() => ''), 'Casos clínicos');
        this.zona.onclick = e => { const b = e.target.closest('[data-caso]'); if (b) this.caso(+b.dataset.caso); };
    }
    caso(k) { this.fase = 'caso'; this.k = k; this.p = 0; this.ficha = {}; this.pasoCaso(); }
    pasoCaso() {
        const C = this.d.casos[this.k], paso = C.pasos[this.p];
        if (this.p === 0) this.ficha = { ...C.paciente };
        Object.assign(this.ficha, paso.datos || {});
        const nuevos = paso.nuevo || [];
        this.barra(C.pasos.map((_, j) => j < this.p ? 'on' : j === this.p ? 'on aqui' : ''), `${C.corto} · paso ${this.p + 1} de ${C.pasos.length}`);
        const cab = `<span class="may-dia">${paso.momento}</span>
            <dl class="may-paciente">${Object.entries(this.ficha).map(([kk, v]) => `<dt>${kk}</dt><dd${nuevos.includes(kk) ? ' class="may-cambia"' : ''}>${v}${nuevos.includes(kk) ? ' <small class="may-nuevo">nuevo</small>' : ''}</dd>`).join('')}</dl>`;
        const q = { ...paso.pregunta, ultimo: this.p === C.pasos.length - 1, calculadora: paso.calculadora };
        pintarPregunta(this.zona, q, { tab: this.tab, cabecera: cab, alFinal: r => {
            guardar(q.id, r.ok);
            if (this.p < C.pasos.length - 1) { this.p++; this.pasoCaso(); this.subir(); }
            else this.finCaso();
        } });
    }
    finCaso() {
        const C = this.d.casos[this.k];
        this.fase = 'casos';
        this.zona.innerHTML = `<div class="may-respuesta may-entra"><span class="may-eyebrow">Lo que te llevas · ${C.corto}</span>
            <ol class="may-lleva">${C.lleva.map(t => `<li>${t}</li>`).join('')}</ol>
            <div class="may-fila"><button class="may-b may-link" type="button" data-may-texto="${C.volver?.ancla || this.tab.id}">📖 Repasar en la ficha${C.volver?.nombre ? `: ${C.volver.nombre}` : ''}</button>
            ${botonesModelo(modelosDe(C.volver), 'Abrir en el estado del paciente:')}
            <button class="may-b" type="button" data-fin="otro">Otro caso</button></div></div>`;
        entrar(this.zona); this.subir();
        this.barra(C.pasos.map(() => 'on'), `${C.corto} · hecho`);
        this.zona.onclick = e => { if (e.target.closest('[data-fin="otro"]')) { this.listaCasos(); this.subir(); } };
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

// Añade la Mayéutica a una ficha que ya tiene su interruptor Texto | Visual (llámese después de montarVisual).
// Se construye la primera vez que se pulsa «Mayéutica».
export function montarMayeutica(tabId, datos) {
    const tab = document.getElementById(tabId);
    if (!tab || tab.querySelector(':scope > .vista-mayeutica')) return;
    const previo = tab.querySelector(':scope > .vista-visual') || tab.querySelector(':scope > .vista-texto');
    if (!tab.hasAttribute('data-visual') || !previo) { console.warn('[mayeutica] la ficha no tiene su interruptor Texto | Visual:', tabId); return; }
    const raiz = document.createElement('div');
    raiz.className = 'vista-mayeutica may';
    previo.after(raiz);
    initVistaVisual(tab.parentElement);
    let hecho = false;
    const construir = () => { if (hecho) return; hecho = true; new Mayeutica(tab, raiz, datos).inicio(); };
    tab.addEventListener('vistachange', e => { if (e.detail.vista === 'mayeutica') construir(); });
    if (tab.classList.contains('modo-mayeutica')) construir();
}
