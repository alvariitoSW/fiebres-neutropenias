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
// Las preguntas las pinta el motor común de la Mayéutica (core/mayeutica-motor.js), el mismo de los modelos vivos
// de Libros: los tres formatos (test con «piensa antes», piensa y destapa, encuentra el error), el repaso de lo
// fallado, los casos con «Lo que te llevas», el guardado y el barajado. Aquí van solo los enganches de las fichas:
// su «Ver en el texto» y, solo después de contestar, el botón «Compruébalo en…» de lo que se comprueba en un modelo
// (primero predices, luego compruebas), que es el enlace cruzado de siempre.
//
// Uso (después de montarVisual de la ficha):  montarMayeutica('mar-cristaloides', datos)
// Los datos viven en js/data/mayeutica/<bloque>-<grupo>.js (formato al principio de b1-fluidos.js). Las respuestas
// no van en el HTML: se miran en los datos al contestar. Aciertos y fallos se guardan en este dispositivo
// (localStorage, como el quiz), siempre dentro de try/catch.
import { initVistaVisual, irAlTexto } from './vista-visual.js';
import { escapeHtml } from './ui.js';
import { pintarPregunta, pintarRepaso, Progreso, Casos, rutaDe, entrar as entrarMotor, CLASES_FICHA } from './mayeutica-motor.js';

/* ---------- Utilidades ---------- */
// Aciertos y fallos de las fichas: en este dispositivo, con su clave de siempre (el motor los guarda).
const CLAVE_GUARDADO = 'mayeutica-fichas-v1';
const REDUCIR = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const entrar = el => entrarMotor(el, 'may');
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
    vasoVivo: { especialidad: 'libros', view: 'vasoVivo', nombre: '🩹 el vaso que sangra' },
    ritmoVivo: { especialidad: 'libros', view: 'ritmoVivo', nombre: '⚡ el corazón eléctrico' },
    shockVivo: { especialidad: 'libros', view: 'shockVivo', nombre: '🫀 el shock a pie de cama' },
    receptorVivo: { especialidad: 'libros', view: 'receptorVivo', nombre: '💊 el receptor vivo' },
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

/* ---------- Una pregunta: el motor común con los enganches de la ficha ---------- */
const preguntaFicha = tab => ({
    p: 'may', clases: CLASES_FICHA,
    verEnTexto: q => verEnTexto(q.fuente, tab, q.origen),
    trasRespuesta: q => { const m = botonesModelo(modelosDe(q)); return m ? `<div class="may-fila">${m}</div>` : ''; },
});

/* ---------- Juega con el modelo: los estados que ya enlaza la ficha y sus preguntas ---------- */
const CLAVES_MODELO = Object.keys(MODELOS);
const claveDe = datos => CLAVES_MODELO.find(k => datos[k] !== undefined);
const sinAdorno = t => limpio(t).replace(/\s*→\s*$/, '').replace(/^[^\p{L}\p{N}¿¡«(]+/u, '').trim();
// Mayúscula solo si lo primero es una letra (tras «¿», «(»…): «5.000 plaquetas» se queda como está.
const mayuscula = t => t.replace(/^([^\p{L}\p{N}]*)(\p{L})/u, (_, a, c) => a + c.toUpperCase());
// Lista de { clave, datos (atributos del enlace cruzado), que: ['qué mirar'…], deFicha }, sin estados repetidos.
function estadosParaJugar(tab, d) {
    const lista = [], vistos = new Map();
    const poner = (datos, que, deFicha, texto, generico) => {
        const clave = claveDe(datos);
        if (!clave) return;
        const id = `${clave}=${datos[clave]}${datos.ecoPanel ? '/' + datos.ecoPanel : ''}`;
        const ya = vistos.get(id);
        // Un estado que ya enlaza la ficha se queda con el texto de la ficha.
        // Si el enlace de la ficha solo dice el nombre del modelo, el texto de la pregunta lo distingue de los otros estados (fa, fa:dilt…).
        if (ya) { if (ya.generico && texto && !deFicha) { ya.que = [texto]; ya.generico = false; return; }
            if (ya.deFicha === deFicha && !ya.que.includes(que)) ya.que.push(que); if (texto && !ya.texto) ya.texto = texto; return; }
        const e = { clave, datos, que: [que], deFicha, texto, generico };
        vistos.set(id, e); lista.push(e);
    };
    // 1. Los enlaces de la propia ficha, en el orden del texto: su texto ya dice qué mirar
    //    («💉 Ver en el catéter vivo: el catéter manda; la vena no cuenta →»).
    tab.querySelectorAll(':scope > .vista-texto button').forEach(b => {
        const datos = { ...b.dataset };
        if (!claveDe(datos)) return;
        const t = limpio(b.textContent).replace(/\s*→\s*$/, '');
        const tras = t.match(/^\S+\s+Ver en [^:]+:\s*(.+)$/);
        poner(datos, mayuscula(tras ? tras[1] : sinAdorno(t)), true, null, !tras && sinAdorno(t).toLowerCase() === sinAdorno(MODELOS[claveDe(datos)].nombre).toLowerCase());
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
        this.prog = new Progreso(CLAVE_GUARDADO, this.preguntas);
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
    }
    // Lo guardado de las preguntas de la ficha (el Progreso del motor).
    get resultados() { return this.prog.resultados; }
    get fallos() { return this.prog.fallos; }

    /* --- El resumen de los cinco pasos y la navegación entre ellos --- */
    hechos() {
        const g = this.prog.g.leer();
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
            if (ir === 'cero') { this.prog.borrar(P.map(q => q.id)); this.pintarResumen(); this.inicioParte(parte); return; }
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
        pintarPregunta(this.zona(paso), { ...q, num: k + 1 }, { ...preguntaFicha(this.tab), alFinal: r => {
            this.prog.anotar(q, r);
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
        const lista = this.prog.pendientes(), irCaso = `Paso 5 · ${this.titulos.caso} →`;
        const num = q => this.lista(q.parte).findIndex(x => x.id === q.id) + 1;
        this.barra('examen', lista.map(() => 'mal'), lista.length ? `Otra vez lo que fallaste · quedan ${lista.length}` : 'Otra vez lo que fallaste');
        pintarRepaso(this.zona('examen'), {
            p: 'may', prog: this.prog, lista, num,
            chip: q => `${q.parte === 'guia' ? 'Guía' : 'Examen'} ${num(q)} · ${q.corto}`,
            html: (n, chips) => `<span class="may-eyebrow">Otra vez lo que fallaste</span>` + (n
                ? `<h4 class="may-titulo">Te quedan ${n}</h4>
                    <p class="may-para">En las de destapar, solo vuelve lo que no marcaste. Un acierto la saca de la lista.</p>
                    ${chips}<div class="may-fila"><button class="may-b may-link" type="button" data-ir-paso="caso">Saltar al ${irCaso}</button></div>`
                : `<h4 class="may-titulo">No queda nada por repasar</h4>
                    <p class="may-para">Has acertado todo, o ya lo repasaste.</p><div class="may-fila"><button class="may-b may-prim" type="button" data-ir-paso="caso">${irCaso}</button></div>`),
            pregunta: () => preguntaFicha(this.tab),
            alAcabar: () => { this.pintarResumen(); this.repaso(); this.subir(this.sec.examen); },
        });
    }

    /* --- Paso 5: los casos (el motor común) --- */
    listaCasos() {
        this.casos ??= new Casos(this.zona('caso'), {
            p: 'may', prog: this.prog, casos: this.d.casos,
            pregunta: () => preguntaFicha(this.tab),
            barra: (items, izq, der) => this.barra('caso', items, [izq, der].filter(Boolean).join(' · ')),
            subir: () => this.subir(this.sec.caso),
            titulo: n => `<h4 class="may-titulo">${n === 1 ? 'Un paciente que evoluciona' : `${n} pacientes que evolucionan`}</h4>`,
            intro: 'Lo nuevo de la ficha del paciente sale en rojo y marcado. El paciente se inventa; la medicina sale de la ficha, y cada paso dice dónde.',
            // La vuelta: a la ficha y, si lo hay, al modelo vivo en el estado del paciente.
            botonesFin: C => `<button class="may-b may-link" type="button" data-may-texto="${C.volver?.ancla || this.tab.id}">📖 Repasar en la ficha${C.volver?.nombre ? `: ${C.volver.nombre}` : ''}</button>
                ${botonesModelo(modelosDe(C.volver), 'Abrir en el estado del paciente:')}`,
            alFin: () => this.pintarResumen(),
        });
        this.casos.lista();
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
