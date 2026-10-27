// Frase viva a la vista: la página sube lo justo para que el elemento no quede bajo la barra de abajo (dock).
// Sin dependencias. Usado por los modelos vivos (agua, ácido-base, telar, muralla, inmersión).
const valor = (v, def) => typeof v === 'function' ? v() : (v ?? def);
const alto = d => { const e = typeof d === 'function' ? d() : d; return e && e.offsetHeight ? e.offsetHeight : (typeof e === 'number' ? e : 0); };
const reducir = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// dock: elemento (o función que lo da). techo: px por debajo de los que el elemento no debe subir (número o función; 8).
// margen: hueco sobre el dock (6). subir: también baja la página si el elemento quedó por encima del techo.
// suave: scroll animado (se anula con «reducir movimiento»). Devuelve true si movió la página.
export function verFrase(el, { dock, techo = 8, margen = 6, subir = false, suave = false } = {}) {
    if (!el || !el.offsetParent) return false;
    const h = alto(dock); if (!h) return false;
    const t = valor(techo, 8), r = el.getBoundingClientRect(), bajo = innerHeight - h - margen;
    const d = r.bottom > bajo ? Math.min(r.bottom - bajo, r.top - t) : (subir && r.top < t ? r.top - t : 0);
    if (Math.abs(d) <= 1) return false;
    scrollBy({ top: d, behavior: suave && !reducir() ? 'smooth' : 'instant' });
    return true;
}

// Tras tocar o escribir en la raíz, y pasados dos fotogramas (el modelo ya repintó), vuelve a comprobar la frase.
export function seguirFrase(raiz, el, opciones) {
    const ir = () => requestAnimationFrame(() => requestAnimationFrame(() => verFrase(typeof el === 'function' ? el() : el, opciones)));
    raiz.addEventListener('click', ir);
    raiz.addEventListener('input', ir);
}
