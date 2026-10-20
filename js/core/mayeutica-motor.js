// El motor de la Mayéutica (REGLAS §8): una sola pieza para las preguntas de las fichas (core/mayeutica.js, el
// recorrido Estudiar) y de todos los modelos vivos de Libros (agua-viva, capilar-vivo, cateter-vivo, muralla-viva,
// telar-vivo, inmersion-viva). Antes cada uno llevaba su copia; ahora cada uno le pasa sus datos y sus enganches
// (mover su dibujo al estado de la pregunta, sus mandos de «Compruébalo en el modelo», su «Ver en el texto»…).
//
// Lo que hace el motor:
//   - pintarPregunta(): una pregunta en sus tres formatos (test con «piensa antes», piensa y destapa, encuentra el
//     error) y, si la pregunta lo pide (q.tocar), «predice y compruébalo» en el modelo. Sirve para el recorrido,
//     el repaso y los pasos de un caso. Las respuestas no van en el HTML: se miran en los datos al contestar (las
//     opciones y los puntos de destapar se escriben al pulsar «Ya lo tengo»).
//   - barajar(): el orden fijo de las opciones de cada test (lo lee también autonomo/jueces-forma.mjs).
//   - crearGuardado() y Progreso: aciertos y fallos en este dispositivo (localStorage, como el quiz), cada banco con
//     su clave de siempre y el mismo formato: por pregunta { aciertos, fallos, resultado ('on'|'mal'), repasar, faltan }.
//   - pintarRepaso(): «Otra vez lo que fallaste» (solo lo fallado; en destapar, solo los puntos que faltaron).
//   - Casos: los casos clínicos que evolucionan (la ficha del paciente se rellena, lo nuevo en rojo y marcado) y
//     «Lo que te llevas».
//   - crearMayeuticaModelo(): el modo Mayéutica entero de un modelo vivo (inicio, recorrido de guía y examen, repaso
//     y casos), con su dock de progreso.
// El ácido-base vivo (js/modules/nefrologia/acidobase-vivo.js) tiene su motor propio, anterior a este: guarda en
// otro formato, compara el modelo por etapas y no baraja. No usa esta pieza.
//
// Clases: cada modelo tiene su prefijo de CSS (agv-, cpv-, ctv-, mur-, tel-, inm-; las fichas, may-). El motor
// escribe `${p}-…`; las pocas clases que cambian entre modelos y fichas van en `clases` (CLASES_MODELO abajo).
import { rutaDePanel } from './search.js';

/* ---------- Barajar: orden fijo por pregunta, para que la buena no salga siempre en el mismo sitio ---------- */
export function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
export function barajar(ops, id) {
    const a = ops.map((o, i) => ({ ...o, i })); const h = hash(id);
    for (let i = a.length - 1; i > 0; i--) { const j = (h >>> (i * 3)) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

/* ---------- Aciertos y fallos guardados (solo en este dispositivo, siempre dentro de try/catch) ---------- */
export function crearGuardado(clave) {
    const leer = () => {
        try { return JSON.parse(localStorage.getItem(clave)) ?? {}; }
        catch { return {}; }
    };
    return {
        leer,
        // Por pregunta: { aciertos, fallos, resultado ('on'|'mal'), repasar, faltan }.
        guardar(id, ok, { resultado, fallo } = {}) {
            try {
                const g = leer();
                const a = g[id] ?? { aciertos: 0, fallos: 0 };
                ok ? a.aciertos++ : a.fallos++;
                if (resultado) a.resultado = resultado;
                a.repasar = !!fallo; a.faltan = fallo?.faltan ?? [];
                g[id] = a;
                localStorage.setItem(clave, JSON.stringify(g));
            } catch { /* localStorage no disponible */ }
        },
        // Sin ids, borra todo lo de esta clave; con ids, solo esas preguntas.
        borrar(ids) {
            try {
                if (!ids) { localStorage.removeItem(clave); return; }
                const g = leer();
                ids.forEach(id => delete g[id]);
                localStorage.setItem(clave, JSON.stringify(g));
            } catch { /* localStorage no disponible */ }
        },
    };
}

// El progreso de un banco: resultado de cada pregunta del recorrido y lo que queda por repasar.
export class Progreso {
    constructor(clave, preguntas) { this.g = crearGuardado(clave); this.preguntas = preguntas; this.cargar(); }
    cargar() {
        const g = this.g.leer();
        this.resultados = {}; this.fallos = {};
        for (const q of this.preguntas) {
            const a = g[q.id]; if (!a) continue;
            if (a.resultado) this.resultados[q.id] = a.resultado;
            if (a.repasar) this.fallos[q.id] = { faltan: a.faltan || [] };
        }
    }
    // Una respuesta del recorrido (guía o examen).
    anotar(q, r) {
        this.resultados[q.id] = r.ok ? 'on' : 'mal';
        if (!r.ok) this.fallos[q.id] = { faltan: r.faltan }; else delete this.fallos[q.id];
        this.g.guardar(q.id, r.ok, { resultado: this.resultados[q.id], fallo: this.fallos[q.id] });
    }
    // Una respuesta del repaso: un acierto la saca; en destapar, solo quedan los puntos que siguen faltando.
    anotarRepaso(q, r) {
        if (r.ok) delete this.fallos[q.id];
        else if (q.tipo === 'destapa' && this.fallos[q.id]?.faltan?.length) this.fallos[q.id].faltan = r.faltan.length ? r.faltan : this.fallos[q.id].faltan;
        else this.fallos[q.id] = { faltan: r.faltan };
        this.g.guardar(q.id, r.ok, { fallo: this.fallos[q.id] });
    }
    // Un paso de un caso: cuenta, pero no entra en el repaso.
    anotarCaso(q, r) { this.g.guardar(q.id, r.ok); }
    borrar(ids) { this.g.borrar(ids); this.cargar(); }
    get hechas() { return Object.keys(this.resultados).length; }
    get bien() { return Object.values(this.resultados).filter(r => r === 'on').length; }
    get nFallos() { return Object.keys(this.fallos).length; }
    pendientes(lista = this.preguntas) { return lista.filter(q => this.fallos[q.id]); }
    // La primera sin contestar (o el final de la lista).
    siguiente(lista = this.preguntas) { const i = lista.findIndex(q => !this.resultados[q.id]); return i < 0 ? lista.length : i; }
    // Las marcas del dock: hecha, fallada y dónde estás.
    marcas(lista, aqui = -1) { return lista.map((q, j) => (this.resultados[q.id] === 'mal' ? 'mal' : this.resultados[q.id] ? 'on' : '') + (j === aqui ? ' aqui' : '')); }
}

/* ---------- Utilidades comunes ---------- */
const TIPO_TXT = { test: 'Test · piensa antes', destapa: 'Piensa y destapa', error: 'Encuentra el error' };
export const GRUPO_TXT = { guia: 'Guía socrática', examen: 'Examen · nivel MIR' };
const CUANTAS = ['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas', 'cinco cosas'];
const REDUCIR = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const verAbajo = el => el?.scrollIntoView?.({ block: 'nearest', behavior: REDUCIR ? 'auto' : 'smooth' });
export function entrar(el, p) { el.classList.remove(p + '-entra'); void el.offsetWidth; el.classList.add(p + '-entra'); }
// Clases con prefijo: cls('agv', 'b prim') → «agv-b agv-prim».
const cls = (p, ...n) => n.join(' ').split(' ').filter(Boolean).map(x => `${p}-${x}`).join(' ');

// Dónde está un id del texto (su ficha, su panel y cómo llegar) y los atributos del enlace cruzado de siempre.
export function rutaDe(id) {
    const el = id && document.getElementById(id);
    if (!el) return null;
    const tab = el.classList.contains('tab-content') ? el : el.closest('.tab-content');
    const panel = tab?.closest('[id^="panel-"]');
    const nav = panel && rutaDePanel(panel.id);
    return nav ? { el, tab, panel: panel.id, nav } : null;
}
export const atributosFicha = r => `data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}"${r.el !== r.tab ? ` data-resaltar="#${r.el.id}"` : ''}`;

// El dock de progreso de un modelo vivo (#<p>-dock-pasos, -dock-est-izq, -dock-est-der).
export function pintarDock(p, items, izq, der) {
    document.getElementById(`${p}-dock-pasos`).innerHTML = items.map(c => `<i class="${cls(p, c)}"></i>`).join('');
    document.getElementById(`${p}-dock-est-izq`).textContent = izq || '';
    document.getElementById(`${p}-dock-est-der`).textContent = der || '';
}

/* ---------- Una pregunta (recorrido, repaso y pasos de un caso) ---------- */
// Las clases que cambian entre los modelos vivos y las fichas (cada una con el prefijo delante).
export const CLASES_MODELO = { cab: 'cab-preg', op: 'b', ops: 'op', frases: 'op', frase: 'frase-e', pts: 'respuesta entra' };
export const CLASES_FICHA = { cab: 'cab', op: 'b op', ops: 'ops', frases: 'frases', frase: 'frase', pts: 'respuesta pts' };

// o: { p, clases, ids, cabecera, repaso, alFinal(res), volverPor, y los enganches (todos opcionales):
//   alEmpezar(q)          antes de pintar: el modelo se pone en el estado de la pregunta
//   alPintar(cont)        después de pintar la pregunta
//   enlazar(el)           cada trozo pintado (la pregunta y su respuesta): enlazar chips de origen…
//   antes(q)              HTML bajo el enunciado (p. ej. un enlace a otro modelo)
//   verEnTexto(q)         el «Ver en el texto» de la respuesta
//   trasRespuesta(q)      HTML tras la nota de fuentes (p. ej. «Compruébalo en…»)
//   alCerrar(q)           al contestar una pregunta sin «tocar» (el estado «después»)
//   asomar(el)            dejar a la vista un elemento (por defecto, scrollIntoView)
//   alSalir()             al pulsar «Siguiente»
//   alClic(e, q, cont)    otros clics de la pregunta (devuelve true si los atendió)
//   tocar: { mandoHTML(t, q), alMostrar(q, cont), comprobar(q), confirma(q), ponerBueno(q, cont),
//            alComprobar(q, cont), accion(mando, cont, q) }   «predice y compruébalo» en el modelo }
// ids: true pone además id="<p>-fmt", "<p>-ops", "<p>-pts", "<p>-mando"… (los modelos vivos: uno por vista).
export function pintarPregunta(cont, q, o) {
    const { p, cabecera = '', repaso = null, alFinal } = o;
    const K = { ...CLASES_MODELO, ...o.clases };
    const c = (...n) => cls(p, ...n);
    const id = n => o.ids ? ` id="${p}-${n}"` : '';
    const hueco = n => cont.querySelector(`[data-hueco="${n}"]`);
    const asomar = o.asomar || verAbajo;
    const enlazar = el => o.enlazar?.(el);
    const t = q.tocar, T = o.tocar || {};
    o.alEmpezar?.(q);
    const res = { ok: true, faltan: [] };
    const grupo = GRUPO_TXT[q.grupo || q.serie] ? q.grupo || q.serie : null;
    let h = cabecera;
    h += `<div class="${c(K.cab)}">${q.num ? `<span class="${c('num')}">${q.num}</span>` : ''}${grupo ? `<span class="${c('serie', grupo)}">${GRUPO_TXT[grupo]}</span>` : ''}<span class="${c('tipo')}">${TIPO_TXT[q.tipo]}${t ? ' · predice y compruébalo' : ''}</span></div>`;
    h += `<p class="${c('pregunta')}">${q.enunciado}</p>`;
    if (q.calculadora) {
        const r = rutaDe(q.calculadora.ir);
        if (r) h += `<div class="${c('fila')}"><button type="button" class="${c('b link')}" ${atributosFicha(r)}>🧮 Abrir la calculadora «${q.calculadora.nombre}»${o.volverPor ? `<small>el caso te espera aquí: vuelve por Libros → ${o.volverPor}</small>` : ''}</button></div>`;
    }
    h += o.antes?.(q) || '';
    h += `<div class="${c('fmt')}" data-hueco="fmt"${id('fmt')}></div><div class="${c('res')}" data-hueco="res"${id('q-res')}></div>`;
    if (t) h += `<div class="${c('mando')}" data-hueco="mando"${id('mando')} hidden>${T.mandoHTML(t, q)}<div class="${c('fila')}"><button class="${c('b prim')}" type="button" data-accion="comprobar">Comprobar</button></div><p class="${c('pista')}" data-hueco="pista"${id('pista')} hidden></p></div><div data-hueco="fin"${id('q-fin')}></div>`;
    cont.innerHTML = h; entrar(cont, p); o.alPintar?.(cont); enlazar(cont);
    const fmt = hueco('fmt');
    let orden = null, intentos = 0, piePendiente = '';

    // Las respuestas buenas no están en el HTML: las opciones y los puntos se escriben al pulsar «Ya lo tengo» y se
    // juzgan mirando los datos.
    const vuelven = q.tipo === 'destapa' && repaso?.faltan?.length ? repaso.faltan : null;
    const idx = q.tipo === 'destapa' ? vuelven || q.puntos.map((_, i) => i) : [];
    if (q.tipo === 'test') {
        fmt.innerHTML = `<p class="${c('para')}">Piénsalo antes de ver las opciones.</p><div class="${c('fila')}"><button class="${c('b prim')}" type="button" data-accion="ops">Ya lo tengo: ver opciones</button></div>
            <div class="${c(K.ops)}" data-hueco="ops"${id('ops')} hidden></div>`;
    } else if (q.tipo === 'destapa') {
        fmt.innerHTML = `<p class="${c('para')}">${vuelven ? (idx.length === 1 ? 'Vuelve solo lo que te faltó.' : `Vuelven solo los ${idx.length} que te faltaron.`) : `Contesta en la cabeza: ${q.cuantas || `son ${CUANTAS[q.puntos.length]}`}. Luego destápalo.`}</p>
            <div class="${c('fila')}"><button class="${c('b prim')}" type="button" data-accion="destapa">Ya lo tengo: destapar</button></div>
            <div class="${c(K.pts)}" data-hueco="pts"${id('pts')} hidden></div>`;
    } else if (q.tipo === 'error') {
        fmt.innerHTML = `<p class="${c('para')}">Toca las frases que creas falsas: puede haber 0, 1 o 2 errores.</p><div class="${c(K.frases)}">${q.frases.map((f, i) =>
            `<button class="${c(K.frase)}" type="button" data-fr="${i}" aria-pressed="false"><span class="${c('n')}">${i + 1}</span><span>${f.t}</span></button><div class="${c('correccion')}" data-cfr="${i}"${id('cfr' + i)} hidden></div>`).join('')}</div>
            <div class="${c('fila')}"><button class="${c('b prim')}" type="button" data-accion="corregir">Corregir</button></div>`;
    }
    entrar(fmt, p);
    const botonSig = () => `<div class="${c('fila')}"><button class="${c('b prim')}" type="button" data-accion="sig">${q.ultimo ? 'Ver lo que te llevas' : 'Siguiente →'}</button></div>`;
    const confirma = ok => T.confirma ? T.confirma(q) : t.confirma || (ok ? 'el modelo lo confirma.' : 'míralo en el modelo.');

    function cerrar(htmlRes) {
        const r = hueco('res');
        const pie = `${q.nota ? `<div class="${c('nota-fuentes')}">${q.nota}</div>` : ''}${o.trasRespuesta?.(q) || ''}${o.verEnTexto?.(q) || ''}`;
        if (t) {
            // Primero se predice; ahora se comprueba en el modelo (las cifras tapadas se destapan al comprobar).
            r.innerHTML = `<div class="${c('respuesta entra')}">${htmlRes}</div>`;
            const m = hueco('mando'); m.hidden = false; entrar(m, p);
            T.alMostrar?.(q, cont);
            asomar(m);
            piePendiente = pie;
            return;
        }
        o.alCerrar?.(q);
        r.innerHTML = `<div class="${c('respuesta entra')}">${htmlRes}${pie}${botonSig()}</div>`;
        enlazar(r);
        asomar(r.querySelector('[data-accion="sig"]'));
    }
    function finComprobar(html) {
        T.alComprobar?.(q, cont);
        hueco('mando').querySelectorAll('[data-mando]').forEach(b => { b.disabled = true; });
        const f = hueco('fin');
        f.innerHTML = `<div class="${c('respuesta entra')}">${html}${piePendiente}${botonSig()}</div>`;
        enlazar(f);
        asomar(f.querySelector('[data-accion="sig"]'));
    }

    cont.onclick = e => {
        const a = e.target.closest('[data-accion]')?.dataset.accion;
        const fila = () => e.target.closest('.' + c('fila'));
        if (a === 'comprobar') {
            const pista = hueco('pista');
            if (T.comprobar(q)) { pista.hidden = true; fila().remove(); finComprobar(`<span class="${c('ok')}">✓ Comprobado: ${confirma(true)}</span>`); return; }
            intentos++;
            pista.hidden = false;
            if (intentos < 2) { pista.textContent = 'Aún no. ' + t.pista; return; }
            res.ok = false;   // no supo ponerlo en el modelo: cuenta como fallo y vuelve en el repaso
            T.ponerBueno?.(q, cont);
            pista.textContent = t.pista + ' Te lo pongo en el modelo.';
            fila().remove(); finComprobar(`<span class="${c('mal')}">Así queda (cuenta como fallo: vuelve en el repaso): ${confirma(false)}</span>`);
            return;
        }
        if (a === 'ops') {
            orden = barajar(q.opciones, q.id);
            const ops = hueco('ops');
            ops.innerHTML = orden.map((x, k) => `<button class="${c(K.op)}" type="button" data-op="${k}">${x.t}</button>`).join('');
            ops.hidden = false; fila().remove(); return;
        }
        if (a === 'destapa') {
            const pts = hueco('pts');
            pts.innerHTML = `<p class="${c('para')}">Marca, uno a uno, lo que tenías:</p>
                ${idx.map(i => `<label class="${c('punto')}"><input type="checkbox" data-p="${i}"> <span>${q.puntos[i]}</span></label>`).join('')}
                <div class="${c('fila')}"><button class="${c('b')}" type="button" data-accion="puntos">Hecho</button></div>`;
            pts.hidden = false; fila().remove(); return;
        }
        if (a === 'puntos') {
            const cajas = [...hueco('pts').querySelectorAll('input')];
            const faltan = cajas.filter(x => !x.checked).map(x => +x.dataset.p);
            cajas.forEach(x => { x.disabled = true; });
            e.target.closest('button').disabled = true;
            if (faltan.length) { res.ok = false; res.faltan = faltan; }
            const n = cajas.length - faltan.length;
            cerrar(`<span class="${c(faltan.length ? 'mal' : 'ok')}">${faltan.length ? `✗ ${n} de ${cajas.length}. Lo que te faltó vuelve en el repaso.` : `✓ ${cajas.length === 1 ? 'La tenías' : 'Todas'}. Esta no vuelve.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'corregir') {
            let bien = 0;
            cont.querySelectorAll('[data-fr]').forEach(b => {
                const i = +b.dataset.fr, f = q.frases[i], ok = b.classList.contains(c('marcada')) === !!f.mal;
                if (ok) bien++;
                b.classList.remove(c('marcada')); b.classList.add(c(ok ? 'acierto' : 'fallo')); b.disabled = true;
                b.querySelector('.' + c('n')).textContent = `${i + 1} ${ok ? '✓' : '✗'}`;
                if (f.mal) { const x = cont.querySelector(`[data-cfr="${i}"]`); x.hidden = false; x.innerHTML = `<b>Era falsa.</b> ¿Cómo sería la frase buena? <button class="${c('b link')}" type="button" data-ver="${i}">Pensado: ver</button>`; }
            });
            e.target.closest('button').disabled = true;
            const malas = q.frases.map((f, i) => f.mal ? i + 1 : 0).filter(Boolean), todas = bien === q.frases.length;
            if (!todas) res.ok = false;
            cerrar(`<span class="${c(todas ? 'ok' : 'mal')}">${todas ? '✓' : '✗'} ${bien} de ${q.frases.length} bien juzgadas. ${malas.length === 0 ? 'No había ningún error.' : malas.length === 1 ? `Había un error: la ${malas[0]}.` : `Había ${malas.length} errores: la ${malas.join(' y la ')}.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'sig') { o.alSalir?.(); alFinal(res); return; }
        if (o.alClic?.(e, q, cont)) return;
        const ver = e.target.closest('[data-ver]');
        // La corrección alarga la respuesta: «Siguiente» sigue a la vista.
        if (ver) { ver.parentElement.innerHTML = '<b>Corrección:</b> ' + q.frases[ver.dataset.ver].c; asomar(cont.querySelector('[data-accion="sig"]')); return; }
        const fr = e.target.closest('[data-fr]');
        if (fr && !fr.disabled) { fr.classList.toggle(c('marcada')); fr.setAttribute('aria-pressed', String(fr.classList.contains(c('marcada')))); return; }
        const op = e.target.closest('[data-op]');
        if (op && !op.disabled && orden) {
            const x = orden[+op.dataset.op];
            hueco('ops').querySelectorAll('button').forEach(b => { b.disabled = true; });
            op.classList.add(c(x.ok ? 'elegida-ok' : 'elegida-mal'));
            op.style.borderColor = x.ok ? 'var(--accent-green)' : 'var(--accent-red)'; op.style.opacity = 1;
            op.insertAdjacentHTML('afterbegin', x.ok ? '✓ ' : '✗ ');
            if (!x.ok) res.ok = false;
            cerrar(`<span class="${c(x.ok ? 'ok' : 'mal')}">${x.ok ? '✓ Bien' : '✗ Qué le habría pasado al paciente'}</span>${x.ok ? '' : `<p>${x.porque}</p>`}<p>${q.explicacion}</p>`);
            return;
        }
        const m = e.target.closest('[data-mando]');
        if (m && !m.disabled && m.tagName !== 'INPUT') T.accion?.(m, cont, q);
    };
    // Los deslizadores de «Compruébalo en el modelo» mueven el modelo al arrastrar.
    cont.oninput = e => { const m = e.target.closest('[data-mando]'); if (m) T.accion?.(m, cont, q); };
}

/* ---------- Otra vez lo que fallaste ---------- */
// r: { p, lista (las falladas, en orden), chip(q) (su rótulo), html(n, chips) (el bloque entero), num(q) (su número
// en el recorrido), pregunta() (las opciones de pintarPregunta), prog (Progreso), alAcabar() (tras cada repaso),
// alClic(e) }
export function pintarRepaso(zona, r) {
    const chips = `<div class="${r.p}-repaso-chips">${r.lista.map(q => `<button class="${r.p}-b" type="button" data-rep="${q.id}">${r.chip(q)}</button>`).join('')}</div>`;
    zona.innerHTML = r.html(r.lista.length, chips);
    entrar(zona, r.p);
    zona.onclick = e => {
        const b = e.target.closest('[data-rep]');
        if (!b) { r.alClic?.(e); return; }
        const q = r.lista.find(x => x.id === b.dataset.rep);
        pintarPregunta(zona, { ...q, num: r.num(q) }, { ...r.pregunta(), repaso: r.prog.fallos[q.id], cabecera: `<span class="${r.p}-eyebrow">Repaso</span>`, alFinal: res => {
            r.prog.anotarRepaso(q, res);
            r.alAcabar();
        } });
    };
}

/* ---------- Los casos clínicos que evolucionan ---------- */
// cfg: { p, prog, casos, pregunta(q) (opciones de pintarPregunta), barra(items, izq, der), subir(),
//   titulo(n) (el encabezado de la lista), intro (su párrafo), extraLista(), alClicLista(e),
//   preguntaDePaso(paso, C) (lo que el paso añade a su pregunta: estado del modelo…), cabeceraPaso(paso, C),
//   alTerminar(C), botonesFin(C) (repasar en la ficha, abrir el modelo…), alClicFin(e, C), alFin(C), alAbrir() }
export class Casos {
    constructor(zona, cfg) { this.zona = zona; this.cfg = cfg; this.k = 0; this.p = 0; this.ficha = {}; }
    lista() {
        this.cfg.alAbrir?.();
        const { p, casos: C } = this.cfg, zona = this.zona;
        zona.innerHTML = `<span class="${p}-eyebrow">Casos clínicos</span>${this.cfg.titulo(C.length)}
            <p class="${p}-para">${this.cfg.intro}</p>
            <div class="${p}-casos-lista">${C.map((c, k) => `<button class="${p}-b" type="button" data-caso="${k}">${c.titulo}<small>${c.sub} · ${c.pasos.length} pasos</small></button>`).join('')}</div>${this.cfg.extraLista?.() || ''}`;
        entrar(zona, p);
        this.cfg.barra(C.map(() => ''), 'Casos clínicos', '');
        zona.onclick = e => {
            const b = e.target.closest('[data-caso]');
            if (b) { this.empezar(+b.dataset.caso); return; }
            this.cfg.alClicLista?.(e);
        };
    }
    empezar(k) { this.k = k; this.p = 0; this.ficha = {}; this.paso(); this.cfg.subir(); }
    paso() {
        const { p } = this.cfg, C = this.cfg.casos[this.k], paso = C.pasos[this.p];
        if (this.p === 0) this.ficha = { ...C.paciente };
        Object.assign(this.ficha, paso.datos || {});
        const nuevos = paso.nuevo || [];
        this.cfg.barra(C.pasos.map((_, j) => j < this.p ? 'on' : j === this.p ? 'on aqui' : ''), C.corto, `paso ${this.p + 1} de ${C.pasos.length}`);
        // Lo nuevo de este paso, en rojo y con su marca «nuevo» (no solo por el color).
        const cab = `<span class="${p}-dia">${paso.momento}</span>
            <dl class="${p}-paciente">${Object.entries(this.ficha).map(([kk, v]) => `<dt>${kk === 'SpO2' ? 'SpO₂' : kk}</dt><dd${nuevos.includes(kk) ? ` class="${p}-cambia"` : ''}>${v}${nuevos.includes(kk) ? ` <small class="${p}-nuevo">nuevo</small>` : ''}</dd>`).join('')}</dl>${this.cfg.cabeceraPaso?.(paso, C) || ''}`;
        const q = { ...paso.pregunta, ...this.cfg.preguntaDePaso?.(paso, C), ultimo: this.p === C.pasos.length - 1, calculadora: paso.calculadora };
        pintarPregunta(this.zona, q, { ...this.cfg.pregunta(q), cabecera: cab, alFinal: r => {
            this.cfg.prog.anotarCaso(q, r);
            if (this.p < C.pasos.length - 1) { this.p++; this.paso(); this.cfg.subir(); }
            else this.fin();
        } });
    }
    fin() {
        const { p } = this.cfg, C = this.cfg.casos[this.k], zona = this.zona;
        this.cfg.alTerminar?.(C);
        zona.innerHTML = `<div class="${p}-respuesta ${p}-entra"><span class="${p}-eyebrow">Lo que te llevas · ${C.corto}</span>
            <ol class="${p}-lleva">${C.lleva.map(t => `<li>${t}</li>`).join('')}</ol>
            ${C.hueco ? `<p class="${p}-para">${C.hueco}</p>` : ''}
            <div class="${p}-fila">${this.cfg.botonesFin(C)}
            <button class="${p}-b" type="button" data-fin="otro">Otro caso</button></div></div>`;
        entrar(zona, p); this.cfg.subir();
        this.cfg.barra(C.pasos.map(() => 'on'), C.corto, 'hecho');
        this.cfg.alFin?.(C);
        zona.onclick = e => {
            if (e.target.closest('[data-fin="otro"]')) { this.lista(); this.cfg.subir(); return; }
            this.cfg.alClicFin?.(e, C);
        };
    }
}

/* ---------- El modo Mayéutica de un modelo vivo ---------- */
// Inicio → recorrido (guía socrática y examen, en el orden de las fichas) → otra vez lo que fallaste → casos.
// Recuerda dónde estabas al cambiar de modo (fase). cfg: {
//   p, cont() (el contenedor de la pregunta), clave (localStorage), preguntas, casos, subir(), reiniciar() (el
//   modelo en su estado de partida), pregunta: enganches de pintarPregunta (alEmpezar, verEnTexto, tocar…),
//   volverPor (nombre del modelo en el menú de Libros), textos: { ruta(nG, nE) (los pasos del inicio, HTML),
//   empezar, seguir, pie, conModelo («el modelo» en «Cada pregunta vuelve con … en su estado»), casos (párrafo de
//   la lista), abrirPaciente (rótulo del botón final) }, preguntaDePaso, cabeceraPaso, extraCasos(), alClicCasos(e),
//   alTerminarCaso(C), abrirPaciente(C) }
export function crearMayeuticaModelo(cfg) {
    const { p, preguntas: P, casos: CASOS } = cfg, X = cfg.textos;
    const prog = new Progreso(cfg.clave, P);
    const dock = (items, izq, der) => pintarDock(p, items, izq, der);
    const opciones = () => ({ p, ids: true, volverPor: cfg.volverPor, ...cfg.pregunta });
    const h2 = txt => `<h2 class="${p}-h">${txt}</h2>`;
    const M = {
        fase: 'inicio', i: 0, prog,
        cargar() { prog.cargar(); },
        // Al entrar en el modo: donde estabas o el inicio.
        entrar() {
            if (['caso', 'recorrido', 'repaso'].includes(M.fase)) { M.reanudar(); return; }
            M.fase = 'inicio';
            cfg.reiniciar();
            const cont = cfg.cont(), hechas = prog.hechas;
            const nG = P.filter(q => (q.grupo || q.serie) === 'guia').length, nE = P.filter(q => (q.grupo || q.serie) === 'examen').length;
            cont.innerHTML = `<div><span class="${p}-eyebrow">Mayéutica</span>${h2('Preguntas para pensar, como Sócrates')}</div>
                <div class="${p}-ruta">${X.ruta(nG, nE)}</div>
                <div class="${p}-fila"><button class="${p}-b ${p}-prim" type="button" data-ir="recorrido">${hechas ? `${X.seguir} (${hechas} de ${P.length})` : X.empezar}</button><button class="${p}-b" type="button" data-ir="casos">Ir a los casos</button></div>
                ${hechas ? `<p class="${p}-para">Guardado en este dispositivo: ${prog.bien} de ${hechas} bien a la primera. <button class="${p}-b ${p}-link" type="button" data-ir="cero">Empezar de cero</button></p>` : ''}
                <p class="${p}-para">${X.pie}</p>`;
            entrar(cont, p);
            cont.onclick = e => {
                const b = e.target.closest('[data-ir]'); if (!b) return;
                if (b.dataset.ir === 'cero') { prog.borrar(); M.entrar(); return; }
                b.dataset.ir === 'recorrido' ? M.recorrido(prog.siguiente()) : M.listaCasos();
            };
            dock(P.map(q => prog.resultados[q.id] || ''), 'Mayéutica', '');
        },
        reanudar() { if (M.fase === 'caso') casos.paso(); else if (M.fase === 'repaso') M.repaso(); else M.recorrido(M.i); },
        recorrido(i) {
            M.fase = 'recorrido'; M.i = i;
            if (i >= P.length) { M.repaso(); return; }
            const q = P[i], nF = prog.nFallos;
            dock(prog.marcas(P, i), `${GRUPO_TXT[q.grupo || q.serie] || 'Recorrido'} · ${i + 1} de ${P.length}`, nF ? `para repasar: ${nF}` : '');
            pintarPregunta(cfg.cont(), { ...q, num: i + 1 }, { ...opciones(), alFinal: r => {
                prog.anotar(q, r);
                M.recorrido(i + 1); cfg.subir();
            } });
        },
        repaso() {
            M.fase = 'repaso';
            cfg.reiniciar();
            const lista = prog.pendientes();
            dock(lista.map(() => 'mal'), 'Otra vez lo que fallaste', lista.length ? `quedan ${lista.length}` : '');
            pintarRepaso(cfg.cont(), {
                p, prog, lista,
                chip: q => `${P.indexOf(q) + 1} · ${q.corto}`,
                html: (n, chips) => `<span class="${p}-eyebrow">Repaso</span>` + (n
                    ? `${h2(`Otra vez lo que fallaste: ${n}`)}
                        <p class="${p}-para">Cada pregunta vuelve con ${X.conModelo} en su estado. En las de destapar, solo vuelve lo que no marcaste. Un acierto la saca de la lista.</p>
                        ${chips}<div class="${p}-fila"><button class="${p}-b ${p}-link" type="button" data-ir="casos">Saltar a los casos →</button></div>`
                    : `${h2('No queda nada por repasar')}<p class="${p}-para">Has acertado todo, o ya lo repasaste.</p><div class="${p}-fila"><button class="${p}-b ${p}-prim" type="button" data-ir="casos">Ir a los casos clínicos →</button></div>`),
                num: q => P.indexOf(q) + 1,
                pregunta: opciones,
                alAcabar: () => { M.repaso(); cfg.subir(); },
                alClic: e => { if (e.target.closest('[data-ir="casos"]')) M.listaCasos(); },
            });
        },
        listaCasos() { M.fase = 'casos'; casos.lista(); },
    };
    const casos = new Casos(null, {
        p, prog, casos: CASOS, subir: cfg.subir,
        pregunta: opciones,
        barra: dock,
        titulo: () => h2('Pacientes que evolucionan'),
        intro: X.casos,
        extraLista: cfg.extraCasos,
        alClicLista: cfg.alClicCasos,
        alAbrir: () => { cfg.reiniciar(); casos.zona = cfg.cont(); },
        preguntaDePaso: cfg.preguntaDePaso || (paso => ({ estado: paso.estado, lupa: paso.lupa, mirar: paso.mirar })),
        cabeceraPaso: cfg.cabeceraPaso,
        alTerminar: C => { M.fase = 'casos'; cfg.alTerminarCaso?.(C); },
        botonesFin: C => {
            const r = rutaDe((C.volver.ancla || C.volver.ficha || '').split(' ')[0]), ex = C.extra?.ir;
            return `${r ? `<button class="${p}-b ${p}-link" type="button" ${atributosFicha(r)}>📖 Repasar en la ficha: ${C.volver.nombre}</button>` : ''}
                ${ex ? `<button class="${p}-b ${p}-link" type="button" data-especialidad="${ex.especialidad}" data-view="${ex.view}" data-panel="${ex.panel}" data-tab="${ex.tab}">${C.extra.texto}</button>` : ''}
                <button class="${p}-b" type="button" data-fin="modelo">${X.abrirPaciente}</button>`;
        },
        alClicFin: (e, C) => { if (e.target.closest('[data-fin="modelo"]')) cfg.abrirPaciente(C); },
    });
    const empezar = casos.empezar.bind(casos);
    casos.empezar = k => { M.fase = 'caso'; casos.zona = cfg.cont(); empezar(k); };
    return M;
}
