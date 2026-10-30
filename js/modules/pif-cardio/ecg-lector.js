// Lector de ECG (PIF Cardiología): el trazado real de una ficha con chips que encienden sus derivaciones o su zona.
// Tres grupos: «metodo» (cada chip es un paso de FREHIII: toca y mira dónde), «guardia» (primero eliges
// rápido/lento, estrecho/ancho, regular/irregular y solo después se comprueba con el libro) y «orden» (los seis pasos
// de FREHIII en orden fijo: piensas, destapas lo que dice el libro y solo entonces se abre el siguiente).
// La imagen no calcula: un chip con `calc` escribe en la calculadora real de la ficha y copia su resultado.
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed., 2012 (páginas en cada chip).
import { irAlTexto } from '../../core/vista-visual.js';

const FILAS_12 = [['I', 'aVR', 'V1', 'V4'], ['II', 'aVL', 'V2', 'V5'], ['III', 'aVF', 'V3', 'V6']];

// Página impresa → PDF de la fuente (parte 1: p+10; parte 2: p−59; parte 3: p−127).
export function hrefPagina(n) {
    if (n <= 59) return `docs/lopez-ramirez-2012-alegria-leer-ecg-parte1.pdf#page=${n + 10}`;
    if (n <= 125) return `docs/lopez-ramirez-2012-alegria-leer-ecg-parte2.pdf#page=${n - 59}`;
    return `docs/lopez-ramirez-2012-alegria-leer-ecg-parte3.pdf#page=${n - 127}`;
}
const enlacePagina = (n, texto) => `<a class="biblio-link" href="${hrefPagina(n)}" target="_blank" rel="noopener">${texto || `p. ${n}`}</a>`;
const caja = z => `left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%`;

// Cuadrícula de 3 filas × 4 columnas sobre el área de la imagen que ocupa el ECG de 12 derivaciones.
function celdas(rej) {
    const { x = 0, y = 0, w = 100, h = 100 } = rej;
    const cw = w / 4, ch = h / 3, out = [];
    FILAS_12.forEach((fila, r) => fila.forEach((d, c) => out.push({ d, caja: { x: x + c * cw, y: y + r * ch, w: cw, h: ch } })));
    return out;
}

// def: { figura: '#id', grupo: 'metodo'|'guardia', rejilla?: {x,y,w,h}, pregunta, chips: [...], fuente, pagina, libro?, respuesta? }
// chip: { etiqueta, derivs?: ['V1','aVR'], zona?: {x,y,w,h} | [{…}], frase, fuente: '#id', pagina?: n, calc?: {…} }
// ctx: { tab } (la ficha, para «Ver en el texto»). Devuelve { reset, elecciones }.
export function crearLectorEcg(cuerpo, def, ctx = {}) {
    const fig = document.querySelector(def.figura);
    const img = fig?.querySelector('img');
    if (!img) { console.warn('[ecg-lector] figura no encontrada →', def.figura); return null; }
    const guardia = def.grupo === 'guardia';
    const cels = def.rejilla ? celdas(def.rejilla) : [];
    const raiz = document.createElement('div');
    raiz.className = 'ecg-lector';
    const zonasHtml = cels.map(c => `<span class="ecg-celda" data-d="${c.d}" style="${caja(c.caja)}"><span class="ecg-celda-rotulo">${c.d}</span></span>`).join('');
    raiz.innerHTML = `
        <div class="ecg-lector-fig"><img src="${img.getAttribute('src')}" alt="${(img.alt || '').replace(/"/g, '&quot;')}" loading="lazy"><div class="ecg-lector-capa">${zonasHtml}</div></div>
        ${def.titulo ? `<p class="ecg-lector-titulo">${def.titulo}</p>` : ''}
        <p class="ecg-lector-frase" aria-live="polite"></p>
        <div class="ecg-lector-chips"></div>
        <p class="ecg-lector-calculo" hidden></p>
        <div class="ecg-lector-pie"></div>`;
    cuerpo.appendChild(raiz);
    const capa = raiz.querySelector('.ecg-lector-capa');
    const frase = raiz.querySelector('.ecg-lector-frase');
    const chipsEl = raiz.querySelector('.ecg-lector-chips');
    const calculo = raiz.querySelector('.ecg-lector-calculo');
    const pie = raiz.querySelector('.ecg-lector-pie');

    const verEnTexto = (fuente, etiqueta = 'Ver en el texto ↓') => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'visual-link'; b.textContent = etiqueta;
        b.addEventListener('click', () => irAlTexto(ctx.tab, document.querySelector(fuente)));
        return b;
    };
    const pintarPie = (fuente, pagina) => {
        pie.innerHTML = '';
        if (pagina) { const s = document.createElement('span'); s.className = 'ecg-lector-pagina'; s.innerHTML = enlacePagina(pagina); pie.appendChild(s); }
        if (fuente) pie.appendChild(verEnTexto(fuente));
    };
    const pintarFrase = (txt, pagina) => { frase.innerHTML = txt + (pagina ? ` (${enlacePagina(pagina)})` : ''); };

    // Enciende lo que dice el chip y atenúa el resto; sin chip, todo a la vista.
    function iluminar(chip) {
        capa.querySelectorAll('.ecg-zona').forEach(z => z.remove());
        const lit = new Set(chip?.derivs || []);
        capa.querySelectorAll('.ecg-celda').forEach(c => {
            c.classList.toggle('encendida', lit.has(c.dataset.d));
            c.classList.toggle('atenuada', !!chip && cels.length > 0 && !lit.has(c.dataset.d));
        });
        const zonas = chip?.zona ? [].concat(chip.zona) : [];
        zonas.forEach(z => {
            const s = document.createElement('span');
            s.className = 'ecg-zona'; s.style.cssText = caja(z);
            if (z.rotulo) s.innerHTML = `<span class="ecg-celda-rotulo">${z.rotulo}</span>`;
            capa.appendChild(s);
        });
    }

    // ---------- calculadora real: escribe y copia ----------
    let previo = null;
    function aplicarCalc(calc) {
        if (!document.getElementById(calc.campos?.[0]?.campo || calc.campo)) return;
        if (!previo) previo = (calc.campos || [{ campo: calc.campo }]).map(c => { const e = document.getElementById(c.campo); return [e, e.value]; });
        (calc.campos || [{ campo: calc.campo, valor: calc.valor }]).forEach(c => {
            const e = document.getElementById(c.campo);
            if (!e) return;
            e.value = String(c.valor);
            e.dispatchEvent(new Event(e.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
        });
        const res = document.getElementById(calc.resultado);
        calculo.hidden = false;
        calculo.innerHTML = `<span class="ecg-lector-calculo-rot">Calculadora de la ficha</span> ${res ? res.innerHTML : ''}`;
    }
    function soltarCalc() {
        if (previo) {
            previo.forEach(([e, v]) => { e.value = v; e.dispatchEvent(new Event(e.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); });
            previo = null;
        }
        calculo.hidden = true; calculo.innerHTML = '';
    }

    // ---------- grupo método ----------
    function montarMetodo() {
        let activo = -1;
        const botones = def.chips.map((c, k) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'ecg-chip'; b.setAttribute('aria-pressed', 'false');
            b.innerHTML = c.paso ? `<b class="ecg-chip-paso">${c.paso}</b> ${c.etiqueta}` : c.etiqueta;
            b.addEventListener('click', () => elegir(activo === k ? -1 : k));
            chipsEl.appendChild(b);
            return b;
        });
        function elegir(k) {
            activo = k;
            botones.forEach((b, i) => { b.setAttribute('aria-pressed', String(i === k)); b.classList.toggle('active', i === k); });
            soltarCalc();
            const c = def.chips[k];
            iluminar(c);
            if (!c) { pintarFrase(def.pregunta); pintarPie(def.fuente, def.pagina); return; }
            pintarFrase(c.frase, c.pagina);
            pintarPie(c.fuente, null);
            if (c.calc) aplicarCalc(c.calc);
        }
        elegir(-1);
        return { reset: () => elegir(-1), elecciones: () => null };
    }

    // ---------- grupo guardia: primero eliges, luego se comprueba ----------
    const PREGUNTAS_TODAS = [
        { clave: 'ritmo', texto: '¿Rápido o lento?', opciones: ['Rápido', 'Lento'] },
        { clave: 'qrs', texto: '¿QRS estrecho o ancho?', opciones: ['Estrecho', 'Ancho'] },
        { clave: 'rr', texto: '¿R-R regular o irregular?', opciones: ['Regular', 'Irregular'] }
    ];
    function montarGuardia() {
        const PREGUNTAS = PREGUNTAS_TODAS.filter(p => def.respuesta[p.clave]);
        const elegido = {};
        let comprobado = false;
        chipsEl.classList.add('ecg-lector-guardia');
        const filas = PREGUNTAS.map(p => {
            const fila = document.createElement('div');
            fila.className = 'ecg-guardia-fila';
            fila.innerHTML = `<span class="ecg-guardia-pregunta">${p.texto}</span>`;
            const bs = p.opciones.map(o => {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'ecg-chip'; b.setAttribute('aria-pressed', 'false'); b.textContent = o;
                b.addEventListener('click', () => {
                    if (comprobado) return;
                    elegido[p.clave] = elegido[p.clave] === o ? undefined : o;
                    bs.forEach(x => { const on = x.textContent === elegido[p.clave]; x.setAttribute('aria-pressed', String(on)); x.classList.toggle('active', on); });
                    comprobar.disabled = !PREGUNTAS.every(q => elegido[q.clave]);
                });
                fila.appendChild(b);
                return b;
            });
            chipsEl.appendChild(fila);
            return { p, bs };
        });
        const comprobar = document.createElement('button');
        comprobar.type = 'button'; comprobar.className = 'ecg-comprobar'; comprobar.textContent = 'Comprobar con el libro'; comprobar.disabled = true;
        chipsEl.appendChild(comprobar);
        pintarFrase(def.pregunta);
        comprobar.addEventListener('click', () => {
            comprobado = true; comprobar.hidden = true;
            let bien = 0;
            filas.forEach(({ p, bs }) => {
                bs.forEach(b => {
                    const es = b.textContent === def.respuesta[p.clave];
                    b.classList.toggle('ecg-correcta', es);
                    b.classList.toggle('ecg-fallada', b.classList.contains('active') && !es);
                    if (b.classList.contains('active')) b.textContent += es ? ' ✓' : ' ✗';
                });
                if (elegido[p.clave] === def.respuesta[p.clave]) bien++;
            });
            pintarFrase(`<strong>${bien} de 3.</strong> ${def.libro}`, def.pagina);
            pintarPie(def.fuente, null);
            if (def.alComprobar) def.alComprobar({ ...elegido }, bien);
        });
        return { reset() { }, elecciones: () => ({ ...elegido }) };
    }

    // ---------- grupo orden: F→R→E→H→I→I; el paso siguiente se abre al destapar el anterior ----------
    // def.pasos: [{ letra, nombre, piensa, libro, pags: [n], fuente: '#id', derivs?, zona?, sinDato? }]
    function montarOrden() {
        const pasos = def.pasos;
        let abiertos = 0, sel = 0;
        const botones = pasos.map((p, k) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'ecg-chip'; b.setAttribute('aria-pressed', 'false'); b.disabled = k > 0;
            b.innerHTML = `<b class="ecg-chip-paso">${p.letra}</b> ${p.nombre}`;
            b.addEventListener('click', () => mostrar(k));
            chipsEl.appendChild(b);
            return b;
        });
        const accion = document.createElement('button');
        accion.type = 'button'; accion.className = 'ecg-comprobar'; accion.style.flexBasis = '100%';
        chipsEl.appendChild(accion);
        const lleva = p => (p.pags || []).map(n => enlacePagina(n)).join(' · ');
        function mostrar(k) {
            sel = k;
            const p = pasos[k], hecho = k < abiertos;
            botones.forEach((b, i) => { b.setAttribute('aria-pressed', String(i === k)); b.classList.toggle('active', i === k); b.disabled = i > abiertos; b.style.opacity = i > abiertos ? '.45' : ''; });
            iluminar(hecho ? p : null);
            if (hecho) {
                frase.innerHTML = `<strong>${p.letra} · ${p.nombre}.</strong> ${p.libro}${p.pags?.length ? ` (${lleva(p)})` : ''}`;
                pintarPie(p.fuente, null);
                accion.textContent = k + 1 < pasos.length ? `Siguiente: ${pasos[k + 1].nombre} →` : 'Hecho: los seis pasos';
                accion.disabled = k + 1 >= pasos.length;
            } else {
                frase.innerHTML = `<strong>${p.letra} · ${p.nombre}. Piensa:</strong> ${p.piensa}`;
                pintarPie(null, null);
                accion.textContent = 'Ya lo pensé: destapar lo que dice el libro'; accion.disabled = false;
            }
        }
        accion.addEventListener('click', () => {
            if (sel >= abiertos) { abiertos = sel + 1; mostrar(sel); } else mostrar(sel + 1);
        });
        mostrar(0);
        return { reset() { abiertos = 0; mostrar(0); }, elecciones: () => null };
    }

    if (!guardia && def.grupo !== 'orden') pintarPie(def.fuente, def.pagina);
    return guardia ? montarGuardia() : def.grupo === 'orden' ? montarOrden() : montarMetodo();
}
