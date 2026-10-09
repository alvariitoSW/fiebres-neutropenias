// Vista Visual del Diagnóstico (bloques A, B y C): "las primeras 48 h".
// Cuatro carriles en una sola tarjeta: hemocultivos (diferencial CVC vs
// periférica), biomarcadores (cinética PCT/PCR + PCR actual), técnicas
// rápidas en un eje de minutos y cribado fúngico según profilaxis.
//
// Sin lógica propia: cada control escribe en el input REAL de la vista Texto
// y dispara su evento, y cada lectura copia el resultado que ya pinta
// diagnostico.js. Los textos de técnicas rápidas salen de foco-data.js y los
// de la rama fúngica del propio HTML de la tarjeta B.

import { focoData } from '../../data/foco-data.js';
import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const HORAS_HEMO = 36;   // eje del carril de hemocultivos
const HORAS_BIO = 40;    // escala 0-40 h de la propia tarjeta C
const PCR_MAX = 40;      // mg/dL del deslizador (cortes de la ficha: 20 y 30)
const MIN_RAPIDAS = 60;

function emitir(el, tipo) { el.dispatchEvent(new Event(tipo, { bubbles: true })); }

// Minutos de cada técnica rápida, leídos del texto de foco-data.js
// ("~10 min", "< 20 min", "< 60 min post-positivización"); null si no da cifra.
function minutos(tiempo) {
    const m = /(\d+)\s*min/.exec(tiempo);
    return m ? Number(m[1]) : null;
}

function frasco(clave, nombre) {
    return `
        <div class="hemo-fila">
            <span class="hemo-nombre">${nombre}</span>
            <input type="range" min="0" max="${HORAS_HEMO}" step="0.5" id="linea-${clave}" aria-label="Horas hasta positivización, ${nombre}">
            <span class="hemo-valor" id="linea-${clave}-valor">—</span>
            <button type="button" class="visual-mini" data-accion="vaciar" data-clave="${clave}" id="linea-${clave}-btn">Quitar</button>
        </div>`;
}

function construir(cont) {
    const opciones = [...$('foco-select').options];
    // Una fila por técnica (escalonadas) para que las etiquetas no se pisen;
    // la etiqueta se ancla a su minuto en el eje. Las que no dan cifra en
    // foco-data.js van aparte, sin posición inventada.
    const conTiempo = [], sinTiempo = [];
    opciones.forEach(o => {
        const min = minutos(focoData[o.value].tiempo);
        const etiqueta = o.textContent.replace(/^Sospecha de /, '');
        if (min === null) {
            sinTiempo.push(`<button type="button" class="rapida-chip sin-tiempo" data-foco="${o.value}">${etiqueta} · sin cifra</button>`);
            return;
        }
        const pct = min / MIN_RAPIDAS * 100;
        const lado = pct > 50 ? 'derecha' : 'izquierda';
        conTiempo.push(`<button type="button" class="rapida-chip ${lado}" data-foco="${o.value}" style="left:${pct.toFixed(1)}%;top:${22 + 34 * conTiempo.length}px">${etiqueta}</button>`);
    });
    const altoRapidas = 22 + 34 * conTiempo.length;

    cont.innerHTML = `
        <h3 style="color: var(--accent-blue);">Las primeras 48 h en cuatro carriles</h3>
        <p class="visual-guia">Cada carril es un bloque de la vista Texto. Lo que muevas aquí se escribe en sus calculadoras.</p>

        <section class="carril" style="--carril: var(--accent-red)">
            <div class="carril-cab"><span>A · Hemocultivos (horas hasta positivizar)</span>
                <button type="button" class="visual-link" data-fuente="diag-card-micro">Texto ↓</button></div>
            <div class="hemo-pista">
                <div class="eje-ticks">${[0, 12, 24, 36].map(h => `<span style="left:${h / HORAS_HEMO * 100}%">${h} h</span>`).join('')}</div>
                <div class="hemo-tramo" id="linea-tramo"></div>
                <div class="hemo-frasco cvc" id="linea-frasco-cvc" title="CVC"></div>
                <div class="hemo-frasco peri" id="linea-frasco-peri" title="Periférica"></div>
            </div>
            ${frasco('cvc', 'CVC')}
            ${frasco('peri', 'Periférica')}
            <div class="carril-lectura"><b id="linea-diff"></b> <span id="linea-diff-eval"></span></div>
        </section>

        <section class="carril" style="--carril: var(--accent-purple)">
            <div class="carril-cab"><span>C · Biomarcadores (escala 0-40 h)</span>
                <button type="button" class="visual-link" data-fuente="diag-card-bio">Texto ↓</button></div>
            <div class="bio-leyenda"><span style="color: var(--accent-green)">● PCT · pico ~8 h</span><span style="color: var(--accent-yellow)">● PCR · pico ~36 h</span></div>
            <svg class="bio-curvas" viewBox="0 0 300 90" role="img" aria-label="La PCT sube antes, pico hacia las 8 horas; la PCR llega tarde, pico hacia las 36 horas">
                <line x1="0" y1="84" x2="300" y2="84" stroke="currentColor" stroke-opacity="0.35"/>
                <path d="M0 84 C 25 30, 45 12, ${8 / HORAS_BIO * 300} 12 C 110 18, 150 64, 300 80" fill="none" stroke="var(--accent-green)" stroke-width="2.5"/>
                <path d="M0 84 C 80 82, 160 62, 220 24 C 250 10, ${36 / HORAS_BIO * 300} 10, 300 16" fill="none" stroke="var(--accent-yellow)" stroke-width="2.5"/>
                <circle cx="${8 / HORAS_BIO * 300}" cy="12" r="4" fill="var(--accent-green)"/>
                <circle cx="${36 / HORAS_BIO * 300}" cy="10" r="4" fill="var(--accent-yellow)"/>
            </svg>
            <label class="pcr-fila" for="linea-pcr">PCR actual: <b id="linea-pcr-valor"></b></label>
            <input type="range" min="0" max="${PCR_MAX}" step="0.5" id="linea-pcr" class="pcr-slider">
            <div class="pcr-zonas" aria-hidden="true">
                <div class="pcr-zona" style="left:${20 / PCR_MAX * 100}%;width:${10 / PCR_MAX * 100}%;background:var(--accent-yellow)"></div>
                <div class="pcr-zona" style="left:${30 / PCR_MAX * 100}%;width:${10 / PCR_MAX * 100}%;background:var(--accent-red)"></div>
            </div>
            <div class="eje-ticks estatico">${[0, 20, 30, 40].map(v => `<span style="left:${v / PCR_MAX * 100}%">${v}</span>`).join('')}</div>
            <div class="carril-lectura" id="linea-pcr-texto"></div>
        </section>

        <section class="carril" style="--carril: var(--accent-blue)">
            <div class="carril-cab"><span>A · Técnicas rápidas (minutos)</span>
                <button type="button" class="visual-link" data-fuente="foco-select">Texto ↓</button></div>
            <div class="rapidas-pista" style="height:${altoRapidas}px">
                <div class="eje-ticks">${[0, 15, 30, 45, 60].map(m => `<span style="left:${m / MIN_RAPIDAS * 100}%">${m}</span>`).join('')}</div>
                ${conTiempo.join('')}
            </div>
            <div class="rapidas-sin-tiempo">${sinTiempo.join('')}</div>
            <div class="carril-lectura"><b id="linea-tecnica"></b> <span id="linea-tiempo"></span><div id="linea-nota"></div></div>
        </section>

        <section class="carril" style="--carril: var(--accent-green)">
            <div class="carril-cab"><span>B · Cribado fúngico (días)</span>
                <button type="button" class="visual-link" data-fuente="diag-card-fungico">Texto ↓</button></div>
            <button type="button" class="hongos-toggle" id="linea-profilaxis" aria-pressed="false"></button>
            <div class="hongos-rama" id="linea-rama-sin"><span class="hongos-tag">Sin profilaxis</span><div class="hongos-pasos"></div></div>
            <div class="hongos-rama" id="linea-rama-con"><span class="hongos-tag">Con profilaxis</span><div class="hongos-pasos"></div></div>
        </section>`;

    // Pasos de cada rama fúngica: copiados del HTML de la tarjeta B (fuente).
    [['sin', 'branch-sin'], ['con', 'branch-con']].forEach(([k, id]) => {
        const nodos = [...$(id).querySelectorAll('.flow-node')].map(n => `<span class="hongos-paso">${n.innerHTML}</span>`);
        cont.querySelector(`#linea-rama-${k} .hongos-pasos`).innerHTML = nodos.join('<span class="hongos-flecha">→</span>');
    });
}

function renderHemo() {
    const pares = [['cvc', 'micro-cvc-time'], ['peri', 'micro-periph-time']];
    const valores = {};
    pares.forEach(([k, id]) => {
        const raw = $(id).value;
        const slider = $(`linea-${k}`);
        const frasco = $(`linea-frasco-${k}`);
        valores[k] = raw === '' ? null : Number(raw);
        if (valores[k] !== null && document.activeElement !== slider) slider.value = valores[k];
        slider.classList.toggle('vacio', valores[k] === null);
        $(`linea-${k}-valor`).textContent = valores[k] === null ? 'no extraído' : `${valores[k]} h`;
        $(`linea-${k}-btn`).textContent = valores[k] === null ? 'Añadir' : 'Quitar';
        frasco.hidden = valores[k] === null;
        if (valores[k] !== null) frasco.style.left = `${Math.min(valores[k], HORAS_HEMO) / HORAS_HEMO * 100}%`;
    });
    const tramo = $('linea-tramo');
    if (valores.cvc !== null && valores.peri !== null) {
        const a = Math.min(valores.cvc, valores.peri), b = Math.max(valores.cvc, valores.peri);
        tramo.hidden = false;
        tramo.style.left = `${a / HORAS_HEMO * 100}%`;
        tramo.style.width = `${(b - a) / HORAS_HEMO * 100}%`;
        tramo.style.borderColor = $('micro-diff-display').style.color || 'var(--text-muted)';
    } else {
        tramo.hidden = true;
    }
    const d = $('micro-diff-display');
    $('linea-diff').textContent = d.textContent;
    $('linea-diff').style.color = d.style.color;
    $('linea-diff-eval').innerHTML = $('micro-diff-eval').innerHTML;
}

function renderPcr() {
    const raw = $('pcr-value').value;
    const slider = $('linea-pcr');
    if (document.activeElement !== slider) slider.value = raw === '' ? 0 : raw;
    $('linea-pcr-valor').textContent = raw === '' ? '—' : `${raw} mg/dL`;
    const t = $('pcr-result-text');
    $('linea-pcr-texto').textContent = t.textContent;
    $('linea-pcr-texto').style.color = t.style.color;
}

function renderRapidas() {
    const actual = $('foco-select').value;
    document.querySelectorAll('#diag-linea .rapida-chip').forEach(c => c.classList.toggle('on', c.dataset.foco === actual));
    $('linea-tecnica').textContent = $('foco-tecnica').textContent;
    $('linea-tiempo').textContent = `· ${$('foco-tiempo').textContent}`;
    $('linea-nota').innerHTML = $('foco-nota').innerHTML;
}

function renderHongos() {
    const con = $('gm-profilaxis-toggle').checked;
    const b = $('linea-profilaxis');
    b.setAttribute('aria-pressed', String(con));
    b.textContent = con ? 'En profilaxis frente a filamentosos: sí' : 'En profilaxis frente a filamentosos: no';
    $('linea-rama-sin').classList.toggle('on', !con);
    $('linea-rama-con').classList.toggle('on', con);
}

function renderTodo() { renderHemo(); renderPcr(); renderRapidas(); renderHongos(); }

export function initDiagnosticoLinea() {
    const cont = $('diag-linea');
    if (!cont) return;
    construir(cont);

    cont.addEventListener('input', e => {
        const id = e.target.id;
        if (id === 'linea-cvc' || id === 'linea-peri') {
            const destino = $(id === 'linea-cvc' ? 'micro-cvc-time' : 'micro-periph-time');
            destino.value = e.target.value;
            emitir(destino, 'input');
        } else if (id === 'linea-pcr') {
            $('pcr-value').value = e.target.value;
            emitir($('pcr-value'), 'input');
        }
    });

    cont.addEventListener('click', e => {
        const t = e.target;
        const vaciar = t.closest('[data-accion="vaciar"]');
        if (vaciar) {
            const destino = $(vaciar.dataset.clave === 'cvc' ? 'micro-cvc-time' : 'micro-periph-time');
            // "Añadir" coloca el frasco donde esté su deslizador; "Quitar" lo deja vacío (no extraído).
            destino.value = destino.value === '' ? $(`linea-${vaciar.dataset.clave}`).value : '';
            emitir(destino, 'input');
            return;
        }
        const chip = t.closest('.rapida-chip');
        if (chip) {
            $('foco-select').value = chip.dataset.foco;
            emitir($('foco-select'), 'change');
            return;
        }
        if (t.closest('#linea-profilaxis')) {
            const tog = $('gm-profilaxis-toggle');
            tog.checked = !tog.checked;
            emitir(tog, 'change');
            return;
        }
        const fuente = t.closest('[data-fuente]');
        if (fuente) irAlTexto($('diag-grupo'), $(fuente.dataset.fuente).closest('.form-group, .card'));
    });

    // Repinta tras cualquier cambio en las calculadoras de A, B y C, venga
    // de la vista Texto o de esta (los listeners de diagnostico.js corren antes,
    // porque se registraron antes).
    const fuentes = ['micro-cvc-time', 'micro-periph-time', 'pcr-value', 'foco-select', 'gm-profilaxis-toggle'];
    ['input', 'change'].forEach(tipo => document.addEventListener(tipo, e => {
        if (fuentes.includes(e.target.id)) renderTodo();
    }));
    renderTodo();
}
