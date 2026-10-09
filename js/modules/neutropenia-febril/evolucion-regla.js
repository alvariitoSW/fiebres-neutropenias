// Vista Visual de "3. Evolución y suspensión": diez días en una regla.
// Reúne en un solo eje los umbrales de tiempo que la ficha reparte entre la
// tarjeta 3, el empírico (§3 sin foco y §5 antifúngico) y el cribado fúngico
// del diagnóstico. Arriba de la regla, cuándo parar el antibiótico; debajo,
// cuándo pensar en hongos. Cada marca cita su texto y lleva a su fuente,
// aunque esté en otra subvista.
//
// El veredicto "¿se puede parar hoy?" no se calcula aquí: el día y los días
// afebril que se mueven en la regla se escriben en la calculadora que toca
// (empírico §3 para fiebre sin foco; reloj del tratamiento dirigido para
// infección clínica o microbiológicamente documentada) y se copia su resultado.

import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const DIAS = 10;

// Textos literales de la fuente indicada en `fuente`.
const MARCAS = [
    { id: 'sinfoco', fila: 'arriba', dia: 2, color: 'var(--accent-green)', titulo: 'Fiebre sin foco (ECIL-10)',
      texto: 'Afebril ≥48h + estable hemodinámicamente desde el inicio + ≥72h acumuladas de tratamiento antibiótico. La suspensión no exige recuperación de neutrófilos.',
      fuente: { vista: 'trat', id: 'empirico-suspension-card' } },
    { id: 'clinica', fila: 'arriba', dia: 3, color: 'var(--accent-green)', titulo: 'Clínicamente documentada',
      texto: 'Sin aislamiento microbiológico: ≥72h afebril + resolución clínica.',
      fuente: { vista: 'main', id: 'evol-clinica' } },
    { id: 'micro', fila: 'arriba', dia: 7, color: 'var(--accent-blue)', titulo: 'Microbiológicamente documentada',
      texto: '≥72h afebril + mínimo 7 días de tratamiento + erradicación microbiológica (ECIL-10, 2025).',
      fuente: { vista: 'main', id: 'evol-micro' } },
    { id: 'af-sin', fila: 'abajo', dia: 4.5, color: 'var(--accent-yellow)', titulo: 'Antifúngico empírico (sin profilaxis)',
      texto: 'Fiebre sin causa 4-5 días con ABT de amplio espectro + inestabilidad → iniciar antifúngico empírico (B-II). Elección: equinocandina (si riesgo de filamentosos: anfotericina B liposomal).',
      fuente: { vista: 'trat', id: 'empirico-antifungico-card' } },
    { id: 'tc-con', fila: 'abajo', dia: 7.5, color: 'var(--accent-purple)', titulo: 'TC con profilaxis',
      texto: 'Con profilaxis antifúngica frente a filamentosos: fiebre >7 días sin causa → TC de tórax directo (las técnicas séricas dan falsos positivos).',
      fuente: { vista: 'diag', id: 'diag-card-fungico' } },
    { id: 'af-con', fila: 'abajo', dia: 10, color: 'var(--accent-red)', titulo: 'Rescate antifúngico (con profilaxis)',
      texto: 'Fiebre >10 días sin causa + inestabilidad → considerar como rescate, cambiando de familia de antifúngico respecto a la profilaxis. Antes, generalmente NO indicado (A-II).',
      fuente: { vista: 'trat', id: 'empirico-antifungico-card' } }
];

const TIPOS = {
    sinfoco: 'Sin foco',
    clinica: 'Clínica',
    micro: 'Microbiológica'
};

// Estado de los controles de la regla (día y días afebril). Es solo la
// posición de los mandos: la decisión vive en las calculadoras.
const estado = { tipo: 'sinfoco', dia: 3, afebril: 1, estable: false, neutro: false, marca: null };

const pct = d => `${(d / DIAS * 100).toFixed(2)}%`;

function poner(id, valor, evento = 'change') {
    const el = $(id);
    if (el.type === 'checkbox') { if (el.checked === valor) return; el.checked = valor; }
    else { if (el.value === String(valor)) return; el.value = String(valor); }
    el.dispatchEvent(new Event(evento, { bubbles: true }));
}

function construir(cont) {
    const ticks = Array.from({ length: DIAS + 1 }, (_, d) => `<span style="left:${pct(d)}">${d}</span>`).join('');
    const marcas = MARCAS.map(m =>
        `<button type="button" class="regla-marca ${m.fila}" data-id="${m.id}" style="left:${pct(m.dia)};--marca:${m.color}" aria-label="${m.titulo}">${MARCAS.indexOf(m) + 1}</button>`).join('');
    const tipos = Object.entries(TIPOS).map(([k, t]) => `<button type="button" data-tipo="${k}">${t}</button>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Arriba de la regla, cuándo parar el antibiótico. Debajo, cuándo pensar en hongos. Mueve el día y toca las marcas.</p>
        <div class="regla">
            <div class="regla-banda" style="width:${pct(5)}" title="Defervescencia media"></div>
            <span class="regla-banda-texto">defervescencia media: hasta 5 días</span>
            <div class="regla-linea"></div>
            <div class="eje-ticks">${ticks}</div>
            ${marcas}
            <div class="regla-cursor" id="regla-cursor"></div>
        </div>
        <label class="regla-dia" for="regla-dia">Día de antibiótico: <b id="regla-dia-num"></b> · afebril desde hace <b id="regla-afebril-num"></b> d</label>
        <input type="range" min="0" max="${DIAS}" step="1" id="regla-dia">
        <div class="regla-mandos">
            <button type="button" class="visual-mini" data-afebril="-1">− 1 d afebril</button>
            <button type="button" class="visual-mini" data-afebril="1">+ 1 d afebril</button>
        </div>
        <div class="regla-tipos" role="group" aria-label="Tipo de infección">${tipos}</div>
        <label class="checkbox-label puntuable regla-check" id="regla-estable-label"><input type="checkbox" id="regla-estable"> Estable hemodinámicamente desde el inicio</label>
        <label class="checkbox-label puntuable regla-check" id="regla-neutro-label"><input type="checkbox" id="regla-neutro"> Persiste neutropenia profunda al suspender</label>
        <div class="visual-veredicto" id="regla-veredicto"></div>
        <div class="visual-detalle" id="regla-detalle" hidden></div>`;
}

// Escribe la posición de la regla en la calculadora correspondiente.
function aplicar() {
    const { tipo, dia, afebril } = estado;
    if (tipo === 'sinfoco') {
        // La calculadora sin foco trabaja con casillas: se traducen los días.
        poner('susp-48h-emp', afebril >= 2);
        poner('susp-72h-tto-emp', dia >= 3);
        poner('susp-estable-emp', estado.estable);
        return;
    }
    const pestana = document.querySelector(`#panel-suspension-perfiles .tab[data-tab="tab-${tipo === 'clinica' ? 'clinica' : 'micro'}"]`);
    if (!pestana.classList.contains('active')) pestana.click();
    if (tipo === 'clinica') {
        poner('susp-afebrile-days-clin', afebril, 'input');
    } else {
        poner('susp-abt-days-micro', dia, 'input');
        poner('susp-afebrile-days-micro', afebril, 'input');
    }
    poner('susp-neutro-persists', estado.neutro);
}

function render() {
    const cont = $('evolucion-regla');
    $('regla-dia').value = estado.dia;
    $('regla-dia-num').textContent = estado.dia;
    $('regla-afebril-num').textContent = estado.afebril;
    $('regla-cursor').style.left = pct(estado.dia);
    cont.querySelectorAll('.regla-tipos button').forEach(b => {
        const on = b.dataset.tipo === estado.tipo;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
    });
    $('regla-estable').checked = estado.estable;
    $('regla-neutro').checked = estado.neutro;
    $('regla-estable-label').hidden = estado.tipo !== 'sinfoco';
    $('regla-neutro-label').hidden = estado.tipo === 'sinfoco';
    cont.querySelectorAll('.regla-marca').forEach(m => m.classList.toggle('sel', m.dataset.id === estado.marca));

    // Veredicto copiado de la calculadora que manda para este tipo.
    const v = $('regla-veredicto');
    if (estado.tipo === 'sinfoco') {
        const r = $('susp-resultado-empirico');
        v.innerHTML = `<strong>¿Se puede parar hoy? · sin foco</strong>${r.innerHTML}`;
        v.style.borderColor = r.style.color;
        v.style.color = r.style.color;
    } else {
        const r = $('susp-final-result'), sub = $('susp-final-sub');
        v.innerHTML = `<strong>¿Se puede parar hoy? · ${TIPOS[estado.tipo].toLowerCase()}</strong>${r.textContent}<div class="regla-sub">${sub.innerHTML}</div>`;
        v.style.borderColor = r.style.color;
        v.style.color = r.style.color;
    }

    const d = $('regla-detalle');
    const m = MARCAS.find(x => x.id === estado.marca);
    if (!m) { d.hidden = true; return; }
    d.hidden = false;
    d.style.borderColor = m.color;
    const donde = { main: 'esta pantalla', trat: 'Tratamiento empírico', diag: 'Diagnóstico' }[m.fuente.vista];
    d.innerHTML = `
        <div class="visual-detalle-titulo" style="color:${m.color}">${MARCAS.indexOf(m) + 1} · ${m.titulo} · día ${String(m.dia).replace('.', ',')}</div>
        <div class="visual-detalle-fuente">${m.texto}</div>
        <button type="button" class="visual-link" data-accion="fuente">Ver en el texto (${donde}) ↓</button>`;
}

// Lleva a la fuente de una marca, cambiando de subvista si hace falta.
function irAFuente(m) {
    const el = $(m.fuente.id);
    if (m.fuente.vista === 'main') { irAlTexto($('evolucion-card'), el); return; }
    $(m.fuente.vista === 'trat' ? 'btn-tratamiento' : 'btn-diagnostico').click();
    irAlTexto(m.fuente.vista === 'diag' ? $('diag-grupo') : null, el);
}

function actualizar() { aplicar(); render(); }

export function initEvolucionRegla() {
    const cont = $('evolucion-regla');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('input', e => {
        if (e.target.id === 'regla-dia') {
            estado.dia = Number(e.target.value);
            estado.afebril = Math.min(estado.afebril, estado.dia);
            actualizar();
        }
    });
    cont.addEventListener('change', e => {
        if (e.target.id === 'regla-estable') { estado.estable = e.target.checked; actualizar(); }
        if (e.target.id === 'regla-neutro') { estado.neutro = e.target.checked; actualizar(); }
    });
    cont.addEventListener('click', e => {
        const t = e.target;
        const af = t.closest('[data-afebril]');
        if (af) { estado.afebril = Math.max(0, Math.min(estado.dia, estado.afebril + Number(af.dataset.afebril))); actualizar(); return; }
        const tipo = t.closest('[data-tipo]');
        if (tipo) { estado.tipo = tipo.dataset.tipo; actualizar(); return; }
        const marca = t.closest('.regla-marca');
        if (marca) { estado.marca = marca.dataset.id; render(); return; }
        if (t.closest('[data-accion="fuente"]')) irAFuente(MARCAS.find(x => x.id === estado.marca));
    });
    // Si las calculadoras cambian desde la vista Texto, la regla se repinta.
    const FUENTES = ['susp-48h-emp', 'susp-estable-emp', 'susp-72h-tto-emp', 'susp-afebrile-days-clin',
        'susp-abt-days-micro', 'susp-afebrile-days-micro', 'susp-neutro-persists'];
    ['input', 'change'].forEach(tipo => document.addEventListener(tipo, e => {
        if (!FUENTES.includes(e.target.id)) return;
        estado.estable = $('susp-estable-emp').checked;
        estado.neutro = $('susp-neutro-persists').checked;
        render();
    }));
    // Solo se escribe en las calculadoras cuando se usa la regla; al cargar,
    // se toman sus casillas actuales y se pinta el veredicto que ya tengan.
    estado.estable = $('susp-estable-emp').checked;
    estado.neutro = $('susp-neutro-persists').checked;
    render();
}
