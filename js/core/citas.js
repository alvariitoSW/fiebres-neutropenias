// La cita que lleva a la app (REGLAS §7.9, decisión del usuario del 20/10/2026: «quiero ir ya a la aplicación y que me
// lleve al sitio exacto donde está ese concepto»). Una sola pieza para los modelos vivos, las maquetas y las preguntas:
// a partir de una fuente (la ficha, el id del párrafo y la página del PDF) pinta «Ver en la ficha», el enlace cruzado
// de siempre al párrafo exacto (data-resaltar), y, de segunda opción, el PDF en su página. El PDF nunca va solo.
//
// Una cita es un objeto (las fuentes de un estado son una lista de citas, REGLAS §7.11):
//   { ficha: 'merino-anemia', id: 'mh-limite-compensacion', pag: '6-7', pdf: 'docs/….pdf', libro: 'Marino' }
//   - ficha: el id de la ficha (.tab-content). Si el párrafo no existe todavía, la cita lleva a la ficha entera.
//   - id: el id del párrafo, la tabla o la figura dentro de la ficha (opcional).
//   - pag: la página del PDF (número o «6-7»; el enlace va a la primera). pdf: la ruta del PDF desde la raíz.
//   - libro: el nombre del libro, para la lista de fuentes (no se pinta en el botón).
//   - nombre: el rótulo del sitio, si el del texto no sirve (opcional).
//
// Además, el formato de texto de siempre de los modelos vivos de Libros («ficha#elemento · #elemento · texto»):
// enlacesFuente() pinta un botón por cada sitio citado y origenEnlazado() convierte en enlace cada ficha nombrada en
// un chip de origen («ficha · mar-fig-9-4 · lactato: ilustrativo»). Antes, cada modelo llevaba su copia.
//
// Lo que se ve nunca lleva ids: el botón dice el título de la ficha y el nombre que el sitio tiene en el texto.
import { rutaDe, atributosFicha } from './mayeutica-motor.js';
import { escapeHtml } from './ui.js';

export const limpio = t => String(t || '').replace(/\s+/g, ' ').trim();
const corto = (t, n) => (t.length > n ? t.slice(0, n - 2).trim() + '…' : t);

// El título de una ficha: su <h3>. `corto`: solo hasta los dos puntos («Anemia en el crítico: …» → «Anemia en el crítico»).
export function tituloFicha(tab, { corto: hastaDosPuntos = false } = {}) {
    const t = limpio(tab.querySelector('h3')?.textContent || tab.id);
    return hastaDosPuntos ? t.split(':')[0].trim() : t;
}

// El nombre que un sitio tiene en el texto: su data-nombre, el <dt> de su campo, la cabecera de su acordeón, el rótulo
// de su sección, la primera negrita de un recuadro, el pie de su figura, el resumen de su plegable o «Tabla 12.2».
// null si no tiene nombre propio (la cita dice entonces solo la ficha). `corta`: solo el <dt> y la cabecera del
// acordeón (para los chips de origen de una frase, que tienen que caber en una línea).
export function etiquetaDe(el, { corta = false } = {}) {
    if (!el) return null;
    if (el.matches('dl')) return limpio(el.querySelector('dt')?.textContent) || null;
    if (el.matches('.micro-prof-item')) return limpio(el.querySelector('.micro-prof-head span')?.textContent).replace(/^[^\p{L}\d«(¿]+/u, '').replace(/\s*[+−]$/, '') || null;
    if (corta) return null;
    if (el.dataset?.nombre) return el.dataset.nombre;
    const prev = el.previousElementSibling;
    if (el.matches('table, ol, ul, p') && prev?.matches('.section-label')) return corto(limpio(prev.textContent).split(' — ')[0], 48);
    const fuerte = el.matches('.warning-box') && el.querySelector(':scope > strong');
    if (fuerte) return corto(limpio(fuerte.textContent).replace(/[.:]\s*$/, ''), 48);
    if (el.matches('.article-figure')) return limpio(el.querySelector('.article-figure-caption')?.textContent).split('—')[0].trim() || null;
    if (el.matches('details')) return limpio(el.querySelector('summary')?.textContent).replace(/^[^\p{L}\d«(¿]+/u, '') || null;
    const num = el.id && el.id.match(/-(tabla|fig|img)-(\d+)-(\d+)$/);
    if (num) return `${num[1] === 'tabla' ? 'Tabla' : 'Figura'} ${num[2]}.${num[3]}`;
    return null;
}

/* ---------- La cita estructurada ---------- */
// Dónde lleva una cita: el párrafo si existe; si no, la ficha entera (r.el === r.tab). null si tampoco hay ficha.
export function rutaCita(c) {
    if (!c) return null;
    return (c.id && rutaDe(c.id)) || (c.ficha && rutaDe(c.ficha)) || null;
}
// ¿El párrafo exacto de la cita está en la app? (para las pruebas: cada «Ver en la ficha» a un id que existe)
export const citaExacta = c => !!(c && c.id && rutaDe(c.id));

const primeraPag = p => String(p ?? '').match(/\d+/)?.[0];
export const hrefPdf = c => (c && c.pdf && primeraPag(c.pag) ? `${c.pdf}#page=${primeraPag(c.pag)}` : null);
const textoPag = p => (/[-–,]| y /.test(String(p)) ? `pp. ${p}` : `p. ${p}`);

// El rótulo del botón: «Título de la ficha · nombre del sitio».
export function nombreCita(c, { max = 70 } = {}) {
    const r = rutaCita(c);
    if (!r) return null;
    const sub = c.nombre || (r.el !== r.tab ? etiquetaDe(r.el) : null);
    return corto(tituloFicha(r.tab, { corto: true }) + (sub ? ' · ' + sub : ''), max);
}

// Una cita en HTML: «Ver en la ficha: … →» (enlace cruzado al párrafo) y, detrás, «PDF, p. N» (segunda opción).
// Opciones: clase (prefijo de las clases; por defecto «cita»), pdf (false = sin el PDF), texto (el principio del
// botón; por defecto «Ver en la ficha»), max (largo del rótulo).
export function citaHTML(c, { clase = 'cita', pdf = true, texto = 'Ver en la ficha', max = 70 } = {}) {
    const r = rutaCita(c), href = pdf ? hrefPdf(c) : null;
    const boton = r ? `<button type="button" class="${clase}-ir" ${atributosFicha(r)}>${escapeHtml(texto)}: ${escapeHtml(nombreCita(c, { max }))} →</button>` : '';
    const enlacePdf = href ? `<a class="${clase}-pdf" href="${href}" target="_blank" rel="noopener">PDF, ${textoPag(c.pag)}</a>` : '';
    return boton || enlacePdf ? `<span class="${clase}">${boton}${enlacePdf}</span>` : '';
}
// Varias citas (las fuentes de un estado): una por línea, sin repetir el mismo sitio.
export function citasHTML(lista, opciones = {}) {
    const vistos = new Set();
    return (lista || []).filter(c => { const k = `${c.ficha}|${c.id}|${c.pag}`; if (vistos.has(k)) return false; vistos.add(k); return true; })
        .map(c => citaHTML(c, opciones)).join('');
}

/* ---------- El formato de texto de siempre de los modelos de Libros ---------- */
// «Ver en el texto: ficha#elemento · #elemento resto»: cada sitio citado es un botón con su nombre (el «#» suelto
// es de la ficha anterior). Lo que no lleva a ningún sitio se queda como texto. Opciones: clase del botón y de lo
// que se queda como texto, prefijo («Ver en el texto: »), max (largo del rótulo).
export function enlacesFuente(fuente, { clase = 'cita-ir', claseOrg = 'cita-org', prefijo = 'Ver en el texto: ', max = 70 } = {}) {
    let tabPrevio = null; const vistosTab = new Set();
    const trozos = String(fuente || '').split(' · ').map(t => {
        const m = t.trim().match(/^(#?)([a-z0-9-]+)(?:#([a-z0-9-]+))?\s*(.*)$/i);
        if (!m) return `<span class="${claseOrg}">${t}</span>`;
        const [, rel, a, b, resto] = m;
        const idEl = rel ? a : b || a, idTab = rel ? tabPrevio : a;
        const r = rutaDe(idEl) || rutaDe(idTab);
        if (!r) return `<span class="${claseOrg}">${t}</span>`;
        tabPrevio = r.tab.id;
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : null;
        let texto = vistosTab.has(r.tab.id) ? (sub || tituloFicha(r.tab)) : tituloFicha(r.tab) + (sub ? ' · ' + sub : '');
        vistosTab.add(r.tab.id);
        if (resto) texto += ' ' + resto;
        return `<button type="button" class="${clase}" ${atributosFicha(r)}>${escapeHtml(corto(texto, max))} →</button>`;
    });
    return `${prefijo}${trozos.join(' ')}`;
}
// Un texto de origen («ficha · mar-fig-9-4 · lactato: ilustrativo»): cada ficha citada pasa a ser un enlace a ella con
// su título; lo demás («ficha», «ilustrativo», «sin cifra», «p. 6»…) queda como texto. `prefijos`: los de los ids que
// se reconocen (los de Marino: mar-, mr-, mc-; los de Merino HEMATO: mh-; y las fichas merino-).
export function origenEnlazado(texto, { clase = 'cita-org-ir', prefijos = ['mar', 'mr', 'mc', 'mh', 'merino'], corta = false } = {}) {
    const vistosTab = new Set();
    const re = new RegExp(`^(.*?)((?:${prefijos.join('|')})-[a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9-]+))?(\\s.*)?$`);
    return String(texto).split(' · ').map(t => {
        const m = t.trim().match(re);
        const r = m && (rutaDe(m[3] || m[2]) || rutaDe(m[2]));
        if (!r) return escapeHtml(t);
        const antes = m[1] ? escapeHtml(m[1]) : '', resto = m[4] ? escapeHtml(m[4]) : '';
        if (vistosTab.has(r.tab.id)) return (antes + resto).trim() || null;   // la misma ficha, un solo enlace
        vistosTab.add(r.tab.id);
        const sub = r.el !== r.tab ? etiquetaDe(r.el, { corta }) : null;
        return `${antes}<button type="button" class="${clase}" ${atributosFicha(r)}>${escapeHtml(tituloFicha(r.tab) + (sub ? ' · ' + sub : ''))}</button>${resto}`;
    }).filter(x => x !== null).join(' · ');
}
// Los chips de origen escritos en el HTML o en los textos de las preguntas se enlazan al pintarse (una sola vez).
export function enlazarOrigenes(cont, { selector, clase, prefijos, corta = false } = {}) {
    const ids = prefijos || ['mar', 'mr', 'mc', 'mh', 'merino'];
    const hay = new RegExp(`(${ids.join('|')})-[a-z0-9]`);
    cont.querySelectorAll(selector).forEach(sp => {
        if (sp.dataset.enlazado !== undefined || sp.children.length || !hay.test(sp.textContent)) return;
        sp.innerHTML = origenEnlazado(sp.textContent, { clase, prefijos: ids, corta });
        sp.dataset.enlazado = '';
    });
}
