import { initCorkboard } from '../../core/corkboard.js';

// ============================================================
// ESTADO FISIOLÓGICO COMPARTIDO DEL CICLO CARDÍACO (Ficha 1)
// ============================================================
// Un único objeto en memoria (fc/edv/contractilidad/pam/pad) que alimenta
// el panel de control, el simulador de Frank-Starling, la calculadora de
// Fick, la de resistencias vasculares, el demo del artefacto RVS y la
// duración/escala de la animación del ciclo de Wiggers — en vez de que
// cada widget guarde su propia copia desconectada del mismo dato
// fisiológico. set() nunca dispara eventos DOM (las funciones de
// renderizado escriben .value directamente sobre los campos), así que no
// hay riesgo de bucles de actualización cruzada entre widgets. Las
// notificaciones se agrupan en un único requestAnimationFrame aunque
// cambien varios campos en el mismo tick (p. ej. el propio panel
// reescribiendo los 5 campos a la vez), para no repetir el recálculo de
// cada widget suscrito una vez por campo modificado.
const CicloEstado = {
    fc: 75, edv: 115, contractilidad: 'normal', pam: 80, pad: 5,
    _listeners: [], _pending: false,
    on(fn) { this._listeners.push(fn); },
    set(patch) {
        Object.assign(this, patch);
        if (this._pending) return;
        this._pending = true;
        requestAnimationFrame(() => {
            this._pending = false;
            this._listeners.forEach(fn => fn(this));
        });
    },
};

// Simulador de la curva de Frank-Starling (Ficha 1) — modelo ilustrativo
// "pico con reducción posterior" (f(x) = A * (x/xp) * e^(1-x/xp)), elegido
// porque la propia fuente describe la curva como una meseta con posterior
// reducción de la fuerza ante presión/volumen excesivos (no una recta ni
// una simple saturación monótona). NO es una fórmula clínica real de la
// fuente — es puramente cualitativo, como el .tfg-simulador de Nefrología.
const FS_CURVAS = {
    aumentada: { A: 118, xp: 55 },
    normal: { A: 100, xp: 70 },
    disminuida: { A: 62, xp: 85 },
};
// Explicación fisiopatológica según la zona de la curva en la que cae el
// punto de trabajo (r = precarga/xp del estado seleccionado) — qué
// significa, qué mecanismo lo mantiene ahí, y cómo se descompensa. Devuelve
// HTML esquematizado (kv-row Zona/Mecanismo/Riesgo) en vez de un párrafo
// corrido, con <strong>/.hl para las palabras clave.
function textoZonaFrankStarling(r) {
    if (r < 0.35) {
        return `<dl class="kv-row"><dt>Zona</dt><dd>Ascendente pronunciada — el ventrículo es muy <strong>dependiente de la precarga</strong>: pequeños aumentos de volumen producen grandes aumentos del volumen sistólico (<span class="hl">paciente que sí responde a líquidos</span>).</dd></dl>
        <dl class="kv-row"><dt>Mecanismo</dt><dd>Acoplamiento actina-miosina de Frank-Starling — a mayor longitud de la fibra en reposo, más puentes cruzados eficaces se forman.</dd></dl>
        <dl class="kv-row"><dt>Riesgo</dt><dd>No el exceso, sino el <strong>defecto</strong>: si la precarga sigue cayendo (hemorragia, deshidratación, venodilatación por sepsis/anestesia), el volumen sistólico y el gasto cardíaco caen en paralelo, sin más mecanismo compensador que la taquicardia.</dd></dl>`;
    }
    if (r < 1.0) {
        return `<dl class="kv-row"><dt>Zona</dt><dd>Meseta/eficiencia — el ventrículo trabaja cerca de su <strong>punto óptimo</strong>: el volumen sistólico se mantiene relativamente estable ante cambios moderados de precarga.</dd></dl>
        <dl class="kv-row"><dt>Mecanismo</dt><dd>Regulación renal del volumen circulante (eje renina-angiotensina-aldosterona) y tono venoso simpático, que ajustan el retorno venoso para no sobrepasar el pico de la curva.</dd></dl>
        <dl class="kv-row"><dt>Riesgo</dt><dd><span class="hl">Bajo riesgo</span> — es el rango de trabajo habitual del corazón sano en reposo.</dd></dl>`;
    }
    return `<dl class="kv-row"><dt>Zona</dt><dd><strong>Sobredistensión</strong> — se ha sobrepasado el pico de la curva: pese a seguir aumentando el volumen de fin de diástole, la fuerza de contracción empieza a declinar.</dd></dl>
    <dl class="kv-row"><dt>Mecanismo</dt><dd>El sarcómero se ha estirado más allá de su longitud óptima de solapamiento actina-miosina.</dd></dl>
    <dl class="kv-row"><dt>Riesgo</dt><dd>Seguir administrando líquidos <span class="hl">deja de aumentar el gasto cardíaco</span> (o incluso lo reduce) mientras la presión de llenado sigue subiendo — el círculo vicioso de la Ficha 3, que termina en edema pulmonar/sistémico. La estrategia debe cambiar de volumen a diuréticos/vasodilatadores.</dd></dl>`;
}
function textoEstadoFrankStarling(estado) {
    if (estado === 'disminuida') {
        return `<dl class="kv-row"><dt>Contractilidad</dt><dd><strong style="color:var(--accent-red);">Disminuida</strong> (falla sistólica) — toda la curva se desplaza abajo y a la derecha: para el mismo volumen de fin de diástole, el corazón genera menos volumen sistólico. El organismo compensa reteniendo líquido (sistema simpático + eje renina-angiotensina-aldosterona) para elevar la precarga — pero esa misma compensación, sostenida en el tiempo, produce la congestión y el remodelamiento ventricular de la Ficha 3.</dd></dl>`;
    }
    if (estado === 'aumentada') {
        return `<dl class="kv-row"><dt>Contractilidad</dt><dd><strong style="color:var(--accent-green);">Aumentada</strong> (inotrópico, catecolaminas) — la curva se desplaza arriba y a la izquierda: mayor volumen sistólico con menos precarga. El costo (Ficha 2) es un mayor consumo miocárdico de oxígeno — sostenerlo con dosis altas puede desencadenar isquemia o arritmias.</dd></dl>`;
    }
    return `<dl class="kv-row"><dt>Contractilidad</dt><dd><strong style="color:var(--accent-blue);">Normal</strong> — comportamiento fisiológico de base, el punto de referencia frente al que se comparan los desplazamientos por falla sistólica o estímulo inotrópico.</dd></dl>`;
}
// Escala de precarga del simulador — mapeo % ↔ mL, consistente con el rango
// EDV (70-160 mL) ya usado en el asa presión-volumen de la Ficha 3.
const FS_EDV_MIN = 70;
const FS_EDV_MAX = 160;
function fsPrecargaToEdv(precarga) { return FS_EDV_MIN + (precarga / 100) * (FS_EDV_MAX - FS_EDV_MIN); }
function fsEdvToPrecarga(edv) { return ((edv - FS_EDV_MIN) / (FS_EDV_MAX - FS_EDV_MIN)) * 100; }

// Lee y escribe directamente sobre CicloEstado.edv/contractilidad (el
// panel de control y este simulador son, a todos los efectos, la misma
// variable) — sustituye al antiguo parámetro `origen` que distinguía
// "vengo del slider" vs. "vengo del campo mL": ahora cualquier control que
// cambie el EDV (slider, campo mL, o el panel de arriba) simplemente llama
// a CicloEstado.set({edv}) y esta función, suscrita como listener, se
// encarga de re-sincronizar los 3 sitios donde se ve ese mismo valor.
function renderFrankStarling() {
    const precargaEl = document.getElementById('cardio-fs-precarga');
    const edvMlEl = document.getElementById('cardio-fs-edv-ml');
    const estadoEl = document.getElementById('cardio-fs-estado');
    const marker = document.getElementById('cardio-fs-marker');
    const guideV = document.getElementById('cardio-fs-guia-v');
    const guideH = document.getElementById('cardio-fs-guia-h');
    const valorEl = document.getElementById('cardio-fs-precarga-valor');
    const salidaEl = document.getElementById('cardio-fs-resultado');
    const interpretacionEl = document.getElementById('cardio-fs-interpretacion');
    if (!precargaEl || !estadoEl || !marker) return;

    const edvMl = CicloEstado.edv;
    const precarga = fsEdvToPrecarga(edvMl);
    // No reescribir el campo que el usuario tiene activo en ese instante:
    // evita que, mientras escribe varios dígitos en el mL, la sincronización
    // le "corrija" el valor a mitad de tecleo.
    if (document.activeElement !== precargaEl) precargaEl.value = precarga;
    if (edvMlEl && document.activeElement !== edvMlEl) edvMlEl.value = edvMl.toFixed(0);
    estadoEl.value = CicloEstado.contractilidad;

    const curva = FS_CURVAS[CicloEstado.contractilidad];
    const vsRaw = curva.A * (precarga / curva.xp) * Math.exp(1 - precarga / curva.xp);
    const vs = Math.max(0, Math.min(vsRaw, 130));

    const svgX = 40 + (precarga / 100) * 260;
    const svgY = 140 - vs;

    marker.setAttribute('cx', svgX);
    marker.setAttribute('cy', svgY);
    if (guideV) { guideV.setAttribute('x1', svgX); guideV.setAttribute('x2', svgX); guideV.setAttribute('y2', svgY); }
    if (guideH) { guideH.setAttribute('y1', svgY); guideH.setAttribute('y2', svgY); guideH.setAttribute('x2', svgX); }
    if (valorEl) valorEl.textContent = `${precarga.toFixed(0)}%`;

    document.querySelectorAll('.cardio-fs-curva').forEach(p => p.classList.remove('cardio-fs-curva-activa'));
    const activa = document.getElementById(`cardio-fs-curva-${CicloEstado.contractilidad}`);
    if (activa) activa.classList.add('cardio-fs-curva-activa');

    const etiquetaEstado = { aumentada: 'aumentada (inotrópico +)', normal: 'normal', disminuida: 'disminuida (falla sistólica)' }[CicloEstado.contractilidad];
    if (salidaEl) {
        salidaEl.innerHTML = `EDV ≈ <strong>${edvMl.toFixed(0)} mL</strong> · Volumen sistólico estimado ≈ <strong>${vs.toFixed(0)} mL</strong> (contractilidad ${etiquetaEstado}) — modelo ilustrativo, no una cifra clínica real.`;
    }
    if (interpretacionEl) {
        const r = precarga / curva.xp;
        interpretacionEl.innerHTML = textoZonaFrankStarling(r) + textoEstadoFrankStarling(CicloEstado.contractilidad);
    }
}

// Diagrama interactivo de la ley de Laplace (Ficha 1, dentro de "Poscarga"):
// a presión constante, un slider de radio mueve un círculo (corte del
// ventrículo) y una barra de tensión relativa T=P×r — versión visual y
// más simple que la calculadora numérica completa de la Ficha 3
// (T=(P×R)/2t, con grosor de pared incluido).
function calcLaplaceMiniDiagrama() {
    const rEl = document.getElementById('cardio-laplace-mini-r');
    const pEl = document.getElementById('cardio-laplace-mini-p');
    const rValorEl = document.getElementById('cardio-laplace-mini-r-valor');
    const circulo = document.getElementById('cardio-laplace-mini-circulo');
    const radioLinea = document.getElementById('cardio-laplace-mini-radio');
    const radioLabel = document.getElementById('cardio-laplace-mini-radio-label');
    const barra = document.getElementById('cardio-laplace-mini-barra');
    const tTexto = document.getElementById('cardio-laplace-mini-t');
    const interpEl = document.getElementById('cardio-laplace-mini-interpretacion');
    if (!rEl || !circulo) return;

    const frac = Number(rEl.value) / 100;
    const rCm = 1.5 + frac * 3.5;
    const pxRadio = 15 + frac * 35;
    const p = pEl && pEl.value !== '' ? Number(pEl.value) : 120;

    if (rValorEl) rValorEl.textContent = `${rCm.toFixed(1)} cm`;
    circulo.setAttribute('r', pxRadio);
    if (radioLinea) radioLinea.setAttribute('x2', 70 + pxRadio);
    if (radioLabel) radioLabel.setAttribute('x', 70 + pxRadio / 2);

    // T = P × r (versión simple de la ley de Laplace de esta ficha, sin
    // grosor de pared — ver la calculadora completa T=(P×R)/2t de la Ficha 3).
    // Unidades ilustrativas (mmHg·cm), escala 0-700 solo para la barra visual.
    const tension = p * rCm;
    const ESCALA_MAX = 700;
    let color = 'var(--accent-green)';
    let estado = 'ok';
    if (tension > 450) { color = 'var(--accent-red)'; estado = 'danger'; }
    else if (tension > 280) { color = 'var(--accent-yellow)'; estado = 'warn'; }
    circulo.setAttribute('stroke', color);

    const pctBarra = Math.max(0, Math.min(100, (tension / ESCALA_MAX) * 100));
    if (barra) { barra.setAttribute('width', 10 + (pctBarra / 100) * 90); barra.setAttribute('fill', color); }
    if (tTexto) tTexto.textContent = `T = P×r = ${tension.toFixed(0)}`;

    if (interpEl) {
        interpEl.className = `tfg-estado tfg-estado-${estado}`;
        let texto;
        if (estado === 'danger') {
            texto = 'Tensión de pared <strong>muy elevada</strong> — dilatación y/o presión intraventricular altas combinadas. Es el escenario que más eleva el consumo miocárdico de oxígeno (ver doble/triple producto, Ficha 2) y el estímulo que dispara la hipertrofia compensadora (↑ grosor de pared) para intentar normalizar la tensión.';
        } else if (estado === 'warn') {
            texto = 'Tensión de pared <strong>por encima de lo habitual</strong> — dilatación o presión moderadamente elevadas; el ventrículo aún compensa, pero con un coste energético mayor.';
        } else {
            texto = 'Tensión de pared <strong>dentro de un rango habitual</strong> para un ventrículo de tamaño y presión normales.';
        }
        interpEl.innerHTML = texto;
    }
}

// Demostración interactiva del artefacto de acoplamiento matemático de la
// RVS/RVP (Ficha 1, dentro de "Poscarga"): PAM y PAD fijas (ahora las del
// panel de control compartido, no un 80/5 hardcodeado), solo cambia el GC
// — la RVS "calculada" sube o baja aunque el tono vascular real (barra fija
// de abajo) no se haya movido, ilustrando la advertencia de la fuente.
const RVS_ARTEFACTO_MAX = 25;
function calcRVSArtefactoDiagrama() {
    const gcEl = document.getElementById('cardio-laplace-mini-gc');
    const gcValorEl = document.getElementById('cardio-laplace-mini-gc-valor');
    const rvsValorEl = document.getElementById('cardio-laplace-mini-rvs-valor');
    const rvsFill = document.getElementById('cardio-laplace-mini-rvs-fill');
    const pamPadLabel = document.getElementById('cardio-rv-artefacto-pam-pad');
    if (!gcEl || !rvsFill) return;

    const gc = Number(gcEl.value) / 10;
    if (gcValorEl) gcValorEl.textContent = `${gc.toFixed(1)} L/min`;
    if (pamPadLabel) pamPadLabel.textContent = `${CicloEstado.pam}/${CicloEstado.pad}`;

    const rvs = (CicloEstado.pam - CicloEstado.pad) / gc;
    if (rvsValorEl) rvsValorEl.textContent = `${rvs.toFixed(1)} UW`;
    rvsFill.style.width = `${Math.max(0, Math.min(100, (rvs / RVS_ARTEFACTO_MAX) * 100))}%`;
}

// Traduce el EDV compartido (70-160 mL) a un radio ventricular fisiológico
// ilustrativo (2,0-4,5 cm, el mismo rango citado en la nota de la propia
// ficha) y lo aplica como valor de partida del slider del mini-diagrama de
// Laplace — acción puntual (botón), no una atadura continua: tras pulsarlo
// el slider sigue siendo libremente explorable, como el resto del diagrama.
function sincronizarLaplaceMiniConEdv() {
    const rEl = document.getElementById('cardio-laplace-mini-r');
    if (!rEl) return;
    const rCm = 2.0 + ((CicloEstado.edv - FS_EDV_MIN) / (FS_EDV_MAX - FS_EDV_MIN)) * 2.5;
    const frac = (rCm - 1.5) / 3.5;
    rEl.value = Math.max(0, Math.min(100, frac * 100));
    calcLaplaceMiniDiagrama();
}

// Autorrelleno de un solo clic: usa el GC ya calculado en la calculadora de
// Fick (GC = FC × VS) como punto de partida de la calculadora de
// resistencias vasculares, en vez de tener que volver a teclear el mismo
// dato — no ata ambos campos de forma continua (el usuario puede seguir
// explorando un GC hipotético distinto en la RVS después de pulsarlo).
function usarGcDeFickEnRvs() {
    const fcEl = document.getElementById('cardio-fick-fc');
    const vsEl = document.getElementById('cardio-fick-vs');
    const gcRvEl = document.getElementById('cardio-rv-gc');
    if (!fcEl || !vsEl || !gcRvEl || fcEl.value === '' || vsEl.value === '') return;
    const gc = (Number(fcEl.value) * Number(vsEl.value)) / 1000;
    gcRvEl.value = gc.toFixed(2);
    calcResistenciasVasculares();
}

// Controles de la animación del ciclo cardíaco (Ficha 1) — la animación en
// sí es 100% CSS (@keyframes sobre x del cursor, opacity de las etiquetas
// de fase y r de los pulsos de tonos cardíacos), sin requestAnimationFrame;
// aquí solo se conecta el botón pausa/reanuda, el selector de velocidad
// (ahora un MULTIPLICADOR sobre la duración real del ciclo, no una duración
// absoluta en segundos: duración = 60/FC × multiplicador, con la FC leída
// del panel de control compartido — "Tiempo real" ya no es una opción fija
// de ~800 ms, sino que se recalcula si el usuario cambia la FC) y el
// selector de fase a fase (que sí usa JS: reposiciona el currentTime de
// cada Animation vía la Web Animations API, dejando el estado en la
// misma clase .paused que ya controla el botón de pausa normal — nunca
// se llama a .play()/.pause() de la API, solo se fija currentTime con el
// contenedor ya en pausa por CSS, así que el botón "Reanudar" normal
// sigue funcionando después de usar los saltos de fase sin más lógica).
const WIGGERS_FASES = [
    { nombre: 'A — Sístole auricular', frac: 0.0575 },
    { nombre: 'B — Contracción isovolumétrica', frac: 0.1575 },
    { nombre: 'C — Eyección rápida', frac: 0.2575 },
    { nombre: 'D — Eyección lenta', frac: 0.37 },
    { nombre: 'E — Relajación isovolumétrica', frac: 0.4575 },
    { nombre: 'F — Llenado rápido', frac: 0.57 },
    { nombre: 'G — Diástasis', frac: 0.8225 },
];
const WIGGERS_MULTIPLICADORES = { '1': 1, '2': 2, '4': 4, '8': 8 };
function initCicloCardiacoAnimado() {
    const container = document.getElementById('cardio-wiggers-anim');
    if (!container) return;
    // Contenedor de toda la ficha: aquí se replican --ciclo-duracion y la
    // clase .paused para que cualquier .mini-ciclo incrustado en otra
    // sección de la Ficha 1 (Frank-Starling, Fick, Laplace...) quede
    // sincronizado por pura herencia de CSS, sin JS adicional por instancia.
    const fichaRoot = document.getElementById('cardio-fisiologia-aplicada');
    // Optimización: cachear una sola vez la lista de nodos animados del
    // contenedor, en vez de volver a recorrer todo el DOM
    // (container.querySelectorAll('*')) en cada clic del stepper de fases
    // — la estructura del diagrama es estática (no se crean/destruyen
    // nodos tras el render inicial), así que la lista sigue siendo válida
    // durante toda la vida de la página.
    const nodosAnimados = Array.from(container.querySelectorAll('*'));

    const btn = document.getElementById('cardio-wiggers-playpause');
    if (btn) btn.setAttribute('aria-label', 'Pausar o reanudar la animación del ciclo cardíaco');
    if (btn) {
        btn.addEventListener('click', () => {
            container.classList.toggle('paused');
            if (fichaRoot) fichaRoot.classList.toggle('paused', container.classList.contains('paused'));
            btn.textContent = container.classList.contains('paused') ? '▶ Reanudar' : '⏸ Pausar';
        });
    }

    const faseLabel = document.getElementById('cardio-wiggers-fase-actual');
    if (faseLabel) faseLabel.setAttribute('aria-live', 'polite');
    const duracionLabel = document.getElementById('cardio-wiggers-duracion-actual');
    const speedSel = document.getElementById('cardio-wiggers-velocidad');
    let faseIdx = 0;
    // Si el usuario ha saltado a una fase concreta (el gráfico está pausado
    // EN esa fase), se guarda como fracción del ciclo, no como currentTime
    // en ms absolutos — así, si luego cambia la FC o la velocidad sin
    // volver a tocar el stepper, se puede recalcular el ms correcto para la
    // nueva duración en vez de dejar el currentTime viejo apuntando a una
    // fracción distinta del ciclo.
    let faseFijada = false;

    function duracionMs() {
        const mult = speedSel ? (WIGGERS_MULTIPLICADORES[speedSel.value] || 1) : 1;
        return (60 / CicloEstado.fc) * 1000 * mult;
    }
    function aplicarFaseActual() {
        const durMs = duracionMs();
        const targetMs = WIGGERS_FASES[faseIdx].frac * durMs;
        nodosAnimados.forEach(el => {
            el.getAnimations().forEach(a => { a.currentTime = targetMs; });
        });
        if (faseLabel) faseLabel.textContent = `Fase: ${WIGGERS_FASES[faseIdx].nombre}`;
        // El stepper deja el diagrama grande fijo en una fase exacta, pero
        // los .mini-ciclo de otras secciones de la ficha corren con su
        // propio reloj (aunque se congelan por CSS al mismo tiempo, vía la
        // clase .paused heredada) — sin este resync se quedarían
        // congelados en la fase que tuvieran en ese instante, no en la
        // fase a la que se acaba de saltar.
        sincronizarMiniCiclosConMaestro();
    }
    function actualizarDuracion() {
        const ms = duracionMs();
        container.style.setProperty('--ciclo-duracion', `${(ms / 1000).toFixed(3)}s`);
        if (fichaRoot) fichaRoot.style.setProperty('--ciclo-duracion', `${(ms / 1000).toFixed(3)}s`);
        if (duracionLabel) duracionLabel.textContent = `≈ ${ms.toFixed(0)} ms/ciclo (FC ${CicloEstado.fc} lpm)`;
        if (faseFijada) aplicarFaseActual();
    }
    function irAFase(idx) {
        faseIdx = ((idx % WIGGERS_FASES.length) + WIGGERS_FASES.length) % WIGGERS_FASES.length;
        faseFijada = true;
        container.classList.add('paused');
        if (fichaRoot) fichaRoot.classList.add('paused');
        if (btn) btn.textContent = '▶ Reanudar';
        aplicarFaseActual();
    }
    if (speedSel) {
        speedSel.setAttribute('aria-label', 'Velocidad de la animación del ciclo cardíaco');
        speedSel.addEventListener('change', actualizarDuracion);
    }
    const prevBtn = document.getElementById('cardio-wiggers-fase-prev');
    const nextBtn = document.getElementById('cardio-wiggers-fase-next');
    if (prevBtn) { prevBtn.setAttribute('aria-label', 'Fase anterior del ciclo cardíaco'); prevBtn.addEventListener('click', () => irAFase(faseIdx - 1)); }
    if (nextBtn) { nextBtn.setAttribute('aria-label', 'Fase siguiente del ciclo cardíaco'); nextBtn.addEventListener('click', () => irAFase(faseIdx + 1)); }
    // Al reanudar manualmente tras usar los saltos de fase, el indicador de
    // texto deja de tener sentido (vuelve a estar "en marcha" libremente).
    if (btn) {
        btn.addEventListener('click', () => {
            if (!container.classList.contains('paused')) {
                faseFijada = false;
                if (faseLabel) faseLabel.textContent = 'Fase: en marcha';
            }
        });
    }

    CicloEstado.on(actualizarDuracion);
    actualizarDuracion();
}

// El EDV compartido modula, además de la curva de Frank-Starling, un
// multiplicador de escala ADICIONAL sobre la propia animación del
// ventrículo (que ya oscila 0,6-1,0 por sus @keyframes) — vía la
// propiedad CSS `scale` independiente, que compone con el
// transform:scale() de las keyframes en vez de sustituirlo. Un EDV alto
// se ve, en todo el ciclo, algo más grande; uno bajo, algo más pequeño.
function actualizarEscalaVentriculoPorEdv() {
    const container = document.getElementById('cardio-wiggers-anim');
    if (!container) return;
    const mult = 0.85 + ((CicloEstado.edv - FS_EDV_MIN) / (FS_EDV_MAX - FS_EDV_MIN)) * 0.3;
    container.style.setProperty('--wiggers-edv-mult', mult.toFixed(3));
}

// Los .mini-ciclo incrustados dentro de un acordeón colapsado (Frank-Starling
// vive dentro de "Precarga", el mini-diagrama de Laplace dentro de
// "Poscarga") heredan --ciclo-duracion por CSS, pero su animación no
// arranca hasta que el elemento deja de estar display:none — y en ese
// instante el navegador reinicia su propio reloj interno desde cero, en
// vez de seguir el mismo punto del ciclo que el cursor grande (que lleva
// corriendo desde la carga de la página). El resultado, sin este ajuste:
// un mini-ciclo recién revelado muestra una fase distinta a la del resto,
// pese a compartir la misma duración. Se corrige leyendo el currentTime
// real del cursor maestro (vía Web Animations API, funciona esté o no en
// marcha) y aplicándolo a los mini-ciclo del ámbito indicado.
function sincronizarMiniCiclosConMaestro(scope) {
    const masterCursor = document.querySelector('#cardio-wiggers-anim .wiggers-cursor');
    if (!masterCursor) return;
    const masterAnim = masterCursor.getAnimations()[0];
    if (!masterAnim) return;
    const t = masterAnim.currentTime;
    (scope || document).querySelectorAll('.mini-ciclo-cursor, .mini-ciclo-label .wiggers-fase').forEach(el => {
        el.getAnimations().forEach(a => { a.currentTime = t; });
    });
}
function initMiniCiclosSync() {
    // Sincroniza de entrada los mini-ciclo que ya son visibles al cargar
    // (Fick y RVS/RVP, fuera de cualquier acordeón).
    requestAnimationFrame(() => sincronizarMiniCiclosConMaestro());
    // Y cualquiera que se revele después al abrir un acordeón de la ficha.
    document.querySelectorAll('#cardio-fisiologia-aplicada .micro-prof-head').forEach(head => {
        head.addEventListener('click', () => {
            requestAnimationFrame(() => sincronizarMiniCiclosConMaestro(head.nextElementSibling));
        });
    });
}

// Interpretación fisiopatológica del DO2I calculado: qué significa la
// cifra, qué mecanismo compensador está (o no) en marcha para sostenerla,
// y qué implica que ese mecanismo se agote (descompensación). Cruza con
// el concepto de DO2 crítico y extracción máxima (60-70%) ya desarrollado
// en la Ficha 5.
function textoZonaDO2I(do2i) {
    if (do2i < 350) {
        return 'Por debajo del <strong>DO₂ crítico</strong> habitual — el aporte de oxígeno ya no cubre la demanda ni siquiera con la extracción tisular al máximo (60-70%). El metabolismo celular se vuelve <strong>dependiente del aporte</strong>: el VO₂ empieza a caer en paralelo al DO₂, forzando la vía anaeróbica (ácido láctico, acidosis metabólica) y con riesgo real de disfunción orgánica múltiple si no se corrige con urgencia la causa (gasto cardíaco, hemoglobina u oxigenación).';
    }
    if (do2i < 450) {
        return 'Por debajo del rango normal. El mecanismo compensador ya en marcha es el <strong>aumento de la extracción tisular de oxígeno</strong> (↑EO₂, hasta un máximo fisiológico de 60-70%) para mantener constante el VO₂ — así puede haber un paciente hemodinámicamente "compensado" con un DO₂ bajo. Si la causa de fondo (anemia, hipoxemia, bajo gasto) no se corrige y la extracción llega a su límite, el siguiente paso es la caída del VO₂ y la aparición de hiperlactatemia.';
    }
    if (do2i < 530) {
        return 'En el límite inferior de la normalidad — todavía dentro de un rango en el que la extracción de oxígeno puede compensar variaciones moderadas de la demanda, pero con poco margen de reserva ante un aumento brusco del consumo (fiebre, dolor, agitación, destete de la ventilación mecánica).';
    }
    if (do2i <= 600) {
        return 'Dentro del rango normal de referencia (Tabla 3) — el aporte de oxígeno cubre la demanda metabólica basal con margen de extracción de reserva (EO₂ normal 25-35%), sin necesitar mecanismos compensadores adicionales.';
    }
    if (do2i <= 750) {
        return 'Por encima del rango de referencia. Puede ser una respuesta fisiológica apropiada (ejercicio, fiebre, embarazo, anemia crónica compensada con gasto cardíaco elevado) o el reflejo de un estado hiperdinámico temprano (sepsis, hipertiroidismo) — el número por sí solo no distingue entre ambos escenarios; hay que interpretarlo junto con la saturación venosa y el lactato.';
    }
    return 'Marcadamente elevado, sugestivo de un estado <strong>hiperdinámico</strong> franco (fase inicial de la sepsis, anemia grave con gasto cardíaco muy aumentado, tirotoxicosis). Un DO₂ alto no garantiza una oxigenación tisular adecuada: en el shock distributivo puede coexistir con hipoxia celular real por alteración de la microcirculación y del shunt arteriovenoso (Ficha 4) — el escenario clásico en el que "los números se ven bien" en el monitor pero el paciente sigue hipoperfundido a nivel tisular.';
}

// Principio de Fick (Ficha 1: Fisiología cardíaca aplicada) — CaO2, DO2 y,
// si se dan datos venosos, CvO2/VO2/EO2. DO2/VO2 se multiplican x10 para
// convertir el CaO2 (mL/dL) x GC (L/min) a mL/min, igual que la Tabla 12
// del Capítulo 5 (ver Ficha 5, IDO2).
function calcFickTransporte() {
    const ids = ['cardio-fick-hb', 'cardio-fick-sao2', 'cardio-fick-pao2', 'cardio-fick-fc', 'cardio-fick-vs', 'cardio-fick-sc'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('cardio-fick-resultado');
    const interpretacionEl = document.getElementById('cardio-fick-interpretacion');
    if (els.some(e => !e) || !box) return;
    if (els.some(e => e.value === '')) {
        box.style.display = 'none';
        const gaugeRow = document.getElementById('cardio-fick-gauge-row');
        if (gaugeRow) gaugeRow.style.display = 'none';
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }

    const [hb, sao2, pao2, fc, vs, sc] = els.map(e => Number(e.value));
    if (sc === 0) {
        box.style.display = 'none';
        const gaugeRow = document.getElementById('cardio-fick-gauge-row');
        if (gaugeRow) gaugeRow.style.display = 'none';
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }
    // La saturación es un % de sitios de la Hb ocupados: no puede ser
    // negativa ni superar el 100%, con independencia de lo que permitan
    // las flechas del campo (escribir a mano sí puede saltarse min/max).
    if (sao2 < 0 || sao2 > 100) {
        box.style.display = 'block';
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '<strong>⚠️ Valor no fisiológico</strong> — la SaO₂ es un porcentaje de saturación y no puede ser negativa ni superar el 100%. Revisa el dato.';
        const gaugeRow = document.getElementById('cardio-fick-gauge-row');
        if (gaugeRow) gaugeRow.style.display = 'none';
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }
    const gc = (fc * vs) / 1000;
    const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.003;
    const do2 = gc * cao2 * 10;
    const ic = gc / sc;
    const do2i = do2 / sc;

    let lineas = [
        `GC = FC × VS = ${gc.toFixed(2)} L/min (IC = ${ic.toFixed(2)} L/min/m²)`,
        `CaO₂ = Hb×1,34×SaO₂ + PaO₂×0,003 = ${cao2.toFixed(1)} mL/dL`,
        `DO₂ = GC × CaO₂ × 10 = ${do2.toFixed(0)} mL/min (DO₂I = ${do2i.toFixed(0)} mL/min/m²)`,
    ];

    let estado = 'ok';
    if (do2i < 450) estado = 'danger';
    else if (do2i < 530) estado = 'warn';

    let textoInterpretacion = textoZonaDO2I(do2i);

    let avisoVenoso = '';
    const svo2El = document.getElementById('cardio-fick-svo2');
    const pvo2El = document.getElementById('cardio-fick-pvo2');
    if (svo2El && pvo2El && svo2El.value !== '' && pvo2El.value !== '') {
        const svo2 = Number(svo2El.value);
        const pvo2 = Number(pvo2El.value);
        // La sangre venosa mixta no puede estar MÁS oxigenada que la
        // arterial (el O2 se extrae, no se añade, al pasar por los
        // tejidos) — SvO2>SaO2 o PvO2>PaO2 son combinaciones no
        // fisiológicas, casi siempre un error de entrada de datos.
        if (svo2 < 0 || svo2 > 100) {
            estado = 'danger';
            avisoVenoso = '<br><strong>⚠️ Valor no fisiológico</strong> — la SvO₂ es un porcentaje y no puede ser negativa ni superar el 100%.';
        } else if (svo2 > sao2 || pvo2 > pao2) {
            estado = 'danger';
            avisoVenoso = '<br><strong>⚠️ Combinación de valores no fisiológica</strong> — la sangre venosa (SvO₂/PvO₂) no puede estar más oxigenada que la arterial (SaO₂/PaO₂): el oxígeno se extrae en los tejidos, no se añade. Revisa esos datos.';
        }
        const cvo2 = hb * 1.34 * (svo2 / 100) + pvo2 * 0.003;
        const vo2 = gc * (cao2 - cvo2) * 10;
        const eo2 = do2 > 0 ? (vo2 / do2) * 100 : 0;
        lineas.push(`CvO₂ = ${cvo2.toFixed(1)} mL/dL`);
        lineas.push(`VO₂ = GC × (CaO₂ − CvO₂) × 10 = ${vo2.toFixed(0)} mL/min`);
        lineas.push(`EO₂ = VO₂/DO₂ = ${eo2.toFixed(1)}%`);
        if (eo2 > 35 && estado === 'ok') estado = 'warn';
        if (eo2 >= 50 && !avisoVenoso) {
            textoInterpretacion += ' Con una extracción de oxígeno (EO₂) del ' + eo2.toFixed(0) + '%, el organismo ya está usando gran parte de su reserva de extracción (el máximo fisiológico ronda el 60-70%) — queda poco margen de compensación antes de que el VO₂ empiece a depender directamente del DO₂.';
        }
    }

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>') + avisoVenoso +
        `<br><span style="font-size:0.72rem;opacity:0.85;">Valores normales de referencia (Tabla 3): DO₂I 530-600 mL/min/m², EO₂ 25-35%.</span>`;

    if (interpretacionEl) {
        interpretacionEl.style.display = 'block';
        interpretacionEl.className = `tfg-estado tfg-estado-${estado}`;
        interpretacionEl.innerHTML = textoInterpretacion;
    }

    actualizarGaugeDO2I(do2i, estado);
}

// Gauge visual del DO2I (escala 0-800 mL/min/m², banda normal 530-600
// marcada con 2 marcadores) — mismo patrón .kinetic-row/.kinetic-fill/
// .kinetic-marker ya usado en las calculadoras ISTH de Síndromes Urgentes.
const DO2I_GAUGE_MAX = 800;
function actualizarGaugeDO2I(do2i, estado) {
    const row = document.getElementById('cardio-fick-gauge-row');
    const fill = document.getElementById('cardio-fick-gauge-fill');
    const num = document.getElementById('cardio-fick-gauge-num');
    if (!row || !fill || !num) return;

    row.style.display = 'block';
    fill.style.width = `${Math.max(0, Math.min(100, (do2i / DO2I_GAUGE_MAX) * 100))}%`;
    const colores = { ok: 'var(--accent-green)', warn: 'var(--accent-yellow)', danger: 'var(--accent-red)' };
    const glows = { ok: 'var(--glow-green)', warn: 'none', danger: 'var(--glow-red)' };
    fill.style.background = colores[estado] || colores.ok;
    fill.style.boxShadow = glows[estado] || 'none';
    num.textContent = `${do2i.toFixed(0)}`;
}

// Interpretación fisiopatológica de la RVS: qué significa cada zona, qué
// mecanismo reflejo la sostiene, y qué implica que ese mecanismo se agote
// o se vuelva insuficiente (paso de shock compensado a descompensado).
function zonaRVS(rvs) {
    if (rvs < 8) {
        return {
            estado: 'danger',
            texto: 'Resistencia vascular muy baja — <strong>vasoplejía</strong>. Es el patrón característico del shock distributivo (séptico, anafiláctico, neurogénico): pérdida del tono vasomotor por sobreproducción de óxido nítrico y otros mediadores inflamatorios, con hiporrespuesta del músculo liso vascular a las catecolaminas. Mientras puede, el organismo compensa aumentando el gasto cardíaco de forma refleja (PAM = GC × RVS) — el patrón hiperdinámico típico del shock séptico precoz. Cuando ni el aumento del GC compensa la caída de RVS, o esta se hace refractaria a vasopresores en dosis crecientes, se habla de <strong>shock vasopléjico</strong>, de mal pronóstico.',
        };
    }
    if (rvs < 10) {
        return {
            estado: 'warn',
            texto: 'Resistencia vascular por debajo de lo habitual — vasodilatación relativa, que puede ser un signo precoz de un proceso distributivo, un efecto de sedación/anestesia/fármacos vasodilatadores, o parte de una respuesta fisiológica normal (fiebre, ejercicio, embarazo avanzado).',
        };
    }
    if (rvs <= 15) {
        return {
            estado: 'ok',
            texto: 'Dentro del rango de referencia habitual — el tono vasomotor sostiene la perfusión tisular sin imponer una poscarga excesiva al ventrículo izquierdo.',
        };
    }
    if (rvs <= 20) {
        return {
            estado: 'warn',
            texto: 'Resistencia vascular elevada — <strong>vasoconstricción compensadora</strong>, el reflejo (barorreceptores → sistema simpático → eje renina-angiotensina-aldosterona) que el organismo activa para sostener la PAM cuando el gasto cardíaco cae (hipovolemia, disfunción sistólica). Es útil a corto plazo, pero aumenta la poscarga del VI y, sostenida, puede comprometer aún más un corazón con reserva contráctil limitada — además reduce el flujo esplácnico y renal, con riesgo de isquemia mesentérica y lesión renal aguda.',
        };
    }
    return {
        estado: 'danger',
        texto: 'Vasoconstricción extrema — el organismo está sacrificando el flujo a órganos no vitales (piel, músculo, esplácnico, renal) para sostener la presión arterial central (cerebro, corazón). Si el gasto cardíaco sigue cayendo pese a esta vasoconstricción máxima, la RVS no puede seguir aumentando indefinidamente y la presión arterial empieza a caer también — es el paso de <strong>shock compensado a shock descompensado</strong>.',
    };
}

// Resistencias vasculares (ley de Hagen-Poiseuille), Ficha 1.
function calcResistenciasVasculares() {
    const gcEl = document.getElementById('cardio-rv-gc');
    const pamEl = document.getElementById('cardio-rv-pam');
    const padEl = document.getElementById('cardio-rv-pad');
    const box = document.getElementById('cardio-rv-resultado');
    const interpretacionEl = document.getElementById('cardio-rv-interpretacion');
    if (!gcEl || !pamEl || !padEl || !box) return;
    if (gcEl.value === '' || pamEl.value === '' || padEl.value === '') {
        box.style.display = 'none';
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }

    const gc = Number(gcEl.value);
    const pam = Number(pamEl.value);
    const pad = Number(padEl.value);
    if (gc === 0) { box.style.display = 'none'; return; }

    const rvs = (pam - pad) / gc;
    let lineas = [`RVS = (PAM − PAD) / GC = ${rvs.toFixed(1)} unidades de Wood (mmHg·min/L) ≈ ${(rvs * 80).toFixed(0)} dyn·s·cm⁻⁵`];

    const pampEl = document.getElementById('cardio-rv-pamp');
    const paiEl = document.getElementById('cardio-rv-pai');
    let avisoRvp = '';
    if (pampEl && paiEl && pampEl.value !== '' && paiEl.value !== '') {
        const pamp = Number(pampEl.value);
        const pai = Number(paiEl.value);
        const rvp = (pamp - pai) / gc;
        lineas.push(`RVP = (PAMP − PAI) / GC = ${rvp.toFixed(2)} unidades de Wood ≈ ${(rvp * 80).toFixed(0)} dyn·s·cm⁻⁵`);
        // Igual que con PAD/PAM: la PAI (presión de la aurícula izquierda/
        // enclavamiento) no puede igualar o superar a la PAMP en un
        // paciente estable — sin gradiente anterógrado no hay flujo
        // pulmonar posible.
        if (pamp <= pai) {
            avisoRvp = '<br><strong>⚠️ RVP no fisiológica</strong> — la PAI introducida es igual o mayor que la PAMP. Sin gradiente de presión anterógrado no puede haber flujo pulmonar; revisa esos 2 datos.';
        }
    }

    // PAD > PAM da una RVS ≤0, una combinación no fisiológica (la presión
    // en la aurícula derecha no puede superar a la presión arterial media
    // en un paciente estable) — se avisa de la revisión de los datos en
    // vez de interpretarlo como "vasoplejía extrema", que sería engañoso.
    if (rvs <= 0) {
        box.style.display = 'block';
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = lineas.join('<br>') +
            '<br><strong>⚠️ Combinación de valores no fisiológica</strong> — la PAD (presión de la aurícula derecha) introducida es igual o mayor que la PAM. Revisa los datos: en un paciente estable la PAM siempre supera a la PAD.' +
            avisoRvp;
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }

    const zona = zonaRVS(rvs);

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${avisoRvp ? 'danger' : zona.estado}`;
    box.innerHTML = lineas.join('<br>') +
        '<br><span style="font-size:0.72rem;opacity:0.85;">Recuerda: la fuente advierte que RVS/RVP no reflejan fielmente la poscarga real, por el acoplamiento matemático con el propio GC.</span>' +
        avisoRvp;

    if (interpretacionEl) {
        interpretacionEl.style.display = 'block';
        interpretacionEl.className = `tfg-estado tfg-estado-${zona.estado}`;
        interpretacionEl.innerHTML = zona.texto;
    }
}

// Costo de funcionamiento miocárdico (doble/triple producto, presión de
// perfusión coronaria, índice aporte-consumo), Ficha 2.
// Gauges de doble/triple producto (Ficha 2) — mismo patrón .kinetic-row/
// .kinetic-fill que el DO2I de la Ficha 1, escala con margen sobre el
// límite normal (12.000/120.000) para que la barra nunca se sature de
// golpe al superar el corte.
const COSTO_DP_MAX = 15000;
const COSTO_TP_MAX = 150000;
function actualizarGaugeCosto(dp, tp) {
    const dpRow = document.getElementById('cardio-costo-gauge-dp-row');
    const dpFill = document.getElementById('cardio-costo-gauge-dp-fill');
    const dpNum = document.getElementById('cardio-costo-gauge-dp-num');
    const tpRow = document.getElementById('cardio-costo-gauge-tp-row');
    const tpFill = document.getElementById('cardio-costo-gauge-tp-fill');
    const tpNum = document.getElementById('cardio-costo-gauge-tp-num');
    if (!dpRow || !dpFill || !dpNum || !tpRow || !tpFill || !tpNum) return;

    const colores = { ok: 'var(--accent-green)', warn: 'var(--accent-yellow)', danger: 'var(--accent-red)' };
    const glows = { ok: 'var(--glow-green)', warn: 'none', danger: 'var(--glow-red)' };
    const estadoDp = dp > 12000 ? 'danger' : (dp > 10200 ? 'warn' : 'ok');
    const estadoTp = tp > 120000 ? 'danger' : (tp > 102000 ? 'warn' : 'ok');

    dpRow.style.display = 'block';
    dpFill.style.width = `${Math.max(0, Math.min(100, (dp / COSTO_DP_MAX) * 100))}%`;
    dpFill.style.background = colores[estadoDp];
    dpFill.style.boxShadow = glows[estadoDp];
    dpNum.textContent = dp.toLocaleString('es');

    tpRow.style.display = 'block';
    tpFill.style.width = `${Math.max(0, Math.min(100, (tp / COSTO_TP_MAX) * 100))}%`;
    tpFill.style.background = colores[estadoTp];
    tpFill.style.boxShadow = glows[estadoTp];
    tpNum.textContent = tp.toLocaleString('es');
}

function calcCostoFuncionamiento() {
    const fcEl = document.getElementById('cardio-costo-fc');
    const pasEl = document.getElementById('cardio-costo-pas');
    const cunaEl = document.getElementById('cardio-costo-cuna');
    const padEl = document.getElementById('cardio-costo-pad-sist');
    const ladoEl = document.getElementById('cardio-costo-lado');
    const pvcEl = document.getElementById('cardio-costo-pvc');
    const pvcGroup = document.getElementById('cardio-costo-pvc-group');
    const box = document.getElementById('cardio-costo-resultado');
    if (!fcEl || !pasEl || !cunaEl || !padEl || !ladoEl || !pvcEl || !box) return;

    const esDerecho = ladoEl.value === 'der';
    if (pvcGroup) pvcGroup.style.display = esDerecho ? 'block' : 'none';

    if (fcEl.value === '' || pasEl.value === '' || cunaEl.value === '' || padEl.value === '' || (esDerecho && pvcEl.value === '')) {
        box.style.display = 'none';
        const dpRow = document.getElementById('cardio-costo-gauge-dp-row');
        const tpRow = document.getElementById('cardio-costo-gauge-tp-row');
        if (dpRow) dpRow.style.display = 'none';
        if (tpRow) tpRow.style.display = 'none';
        return;
    }

    const fc = Number(fcEl.value);
    const pas = Number(pasEl.value);
    const cuna = Number(cunaEl.value);
    const padSist = Number(padEl.value);
    const referencia = esDerecho ? Number(pvcEl.value) : cuna;

    const dobleProducto = fc * pas;
    const tripleProducto = dobleProducto * cuna;
    const ppc = padSist - referencia;
    const indiceAporteConsumo = tripleProducto > 0 ? ppc / (tripleProducto / 1000) : null;

    let estado = 'ok';
    if (dobleProducto > 12000 || tripleProducto > 120000) estado = 'danger';
    else if (ppc < 60 || (indiceAporteConsumo !== null && indiceAporteConsumo < 0.6)) estado = 'warn';

    // La presión diastólica sistémica (donde nace el flujo coronario) debe
    // superar a la presión de referencia (cuña/PVC, aguas abajo) para que
    // exista gradiente anterógrado — una PPC ≤0 sostenida es incompatible
    // con la perfusión miocárdica, no solo "baja".
    let avisoPpc = '';
    if (ppc <= 0) {
        estado = 'danger';
        avisoPpc = `<br><strong>⚠️ Combinación de valores no fisiológica</strong> — la presión de referencia (${esDerecho ? 'PVC' : 'cuña/POAP'}) es igual o mayor que la PAD sistémica. Sin gradiente anterógrado no hay perfusión coronaria posible; revisa esos 2 datos.`;
    }

    const lineas = [
        `Doble producto = FC × PAS = ${dobleProducto.toLocaleString('es')} (normal máx. 12.000)`,
        `Triple producto = doble producto × presión en cuña = ${tripleProducto.toLocaleString('es')} (normal máx. 120.000)`,
        `Presión de perfusión coronaria (${esDerecho ? 'VD, PAD−PVC' : 'VI, PAD−cuña'}) = ${ppc.toFixed(0)} mmHg (objetivo &gt;60 mmHg)`,
        indiceAporteConsumo !== null ? `Índice de aporte-consumo = PPC / (triple producto/1000) = ${indiceAporteConsumo.toFixed(2)} (normal &gt;0,6)` : '',
    ].filter(Boolean);

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>') + avisoPpc;

    actualizarGaugeCosto(dobleProducto, tripleProducto);
}

// Gauge visual del IDO2 de la Ficha 2 (escala 0-800, banda normal 520-650
// de la Tabla 12) — mismo patrón .kinetic-row que el gauge de DO2I de la
// Ficha 1, reutilizando la misma escala máxima para que ambas calculadoras
// se lean con el mismo lenguaje visual.
const IDO2_F2_GAUGE_MAX = 800;
function actualizarGaugeIDO2Ficha2(ido2, estado) {
    const row = document.getElementById('cardio-ido2-gauge-row');
    const fill = document.getElementById('cardio-ido2-gauge-fill');
    const num = document.getElementById('cardio-ido2-gauge-num');
    if (!row || !fill || !num) return;

    row.style.display = 'block';
    fill.style.width = `${Math.max(0, Math.min(100, (ido2 / IDO2_F2_GAUGE_MAX) * 100))}%`;
    const colores = { ok: 'var(--accent-green)', warn: 'var(--accent-yellow)', danger: 'var(--accent-red)' };
    const glows = { ok: 'var(--glow-green)', warn: 'none', danger: 'var(--glow-red)' };
    fill.style.background = colores[estado] || colores.ok;
    fill.style.boxShadow = glows[estado] || 'none';
    num.textContent = `${ido2.toFixed(0)}`;
}

// Índice de aporte de oxígeno (IDO2 = IC x CaO2), Ficha 2 — versión x10
// (mL/min/m²) cruzada con el rango normal 520-650 de la Tabla 12 del
// Capítulo 5 (ver Ficha 5).
function calcIDO2Ficha2() {
    const ids = ['cardio-ido2-gc', 'cardio-ido2-sc', 'cardio-ido2-hb', 'cardio-ido2-sao2', 'cardio-ido2-pao2'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('cardio-ido2-resultado');
    if (els.some(e => !e) || !box) return;
    if (els.some(e => e.value === '')) {
        box.style.display = 'none';
        const gaugeRow = document.getElementById('cardio-ido2-gauge-row');
        if (gaugeRow) gaugeRow.style.display = 'none';
        return;
    }

    const [gc, sc, hb, sao2, pao2] = els.map(e => Number(e.value));
    if (sc === 0) { box.style.display = 'none'; return; }
    if (sao2 < 0 || sao2 > 100) {
        box.style.display = 'block';
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '<strong>⚠️ Valor no fisiológico</strong> — la SaO₂ es un porcentaje de saturación y no puede ser negativa ni superar el 100%. Revisa el dato.';
        const gaugeRow = document.getElementById('cardio-ido2-gauge-row');
        if (gaugeRow) gaugeRow.style.display = 'none';
        return;
    }

    const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.003;
    const ic = gc / sc;
    const ido2 = ic * cao2 * 10;

    let estado = 'ok';
    if (ido2 < 450) estado = 'danger';
    else if (ido2 < 520) estado = 'warn';

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `IC = GC/SC = ${ic.toFixed(2)} L/min/m²<br>` +
        `CaO₂ = ${cao2.toFixed(1)} mL/dL<br>` +
        `IDO₂ = IC × CaO₂ × 10 = ${ido2.toFixed(0)} mL/min/m²` +
        '<br><span style="font-size:0.72rem;opacity:0.85;">Valor normal de referencia (Tabla 12, Capítulo 5): 520-650 mL/min/m².</span>';

    actualizarGaugeIDO2Ficha2(ido2, estado);
}

// Esquema circular de la calculadora de Laplace de la Ficha 3 (radio/grosor
// de pared reales, no un slider ilustrativo como el mini-diagrama de la
// Ficha 1) — el círculo interior representa la cavidad (escalado con R), el
// anillo su pared (grosor de trazo escalado con t), y la barra la tensión
// calculada en una escala ilustrativa (no clínica).
function calcLaplaceCirculoFicha3(r, t, tension) {
    const luz = document.getElementById('cardio-laplace-t3-luz');
    const pared = document.getElementById('cardio-laplace-t3-pared');
    const radioLinea = document.getElementById('cardio-laplace-t3-radio');
    const radioLabel = document.getElementById('cardio-laplace-t3-radio-label');
    const barra = document.getElementById('cardio-laplace-t3-barra');
    const tTexto = document.getElementById('cardio-laplace-t3-t');
    if (!luz || !pared) return;

    if (r === null || t === null) {
        if (tTexto) tTexto.textContent = 'T = —';
        return;
    }

    const rPx = Math.max(10, Math.min(55, 8 + r * 8));
    const tPx = Math.max(2, Math.min(24, t * 8));

    luz.setAttribute('r', rPx);
    pared.setAttribute('r', rPx + tPx / 2);
    pared.setAttribute('stroke-width', tPx);
    if (radioLinea) radioLinea.setAttribute('x2', 75 + rPx);
    if (radioLabel) radioLabel.setAttribute('x', 75 + rPx / 2);

    let color = 'var(--accent-green)';
    let pctBarra = 0;
    if (tension !== null) {
        const escalaMax = 300; // escala ilustrativa de la barra, no un umbral clínico
        pctBarra = Math.max(0, Math.min(100, (tension / escalaMax) * 100));
        if (tension > 200) color = 'var(--accent-red)';
        else if (tension > 100) color = 'var(--accent-yellow)';
    }
    pared.setAttribute('stroke', color);
    if (barra) { barra.setAttribute('width', 10 + (pctBarra / 100) * 90); barra.setAttribute('fill', color); }
    if (tTexto) tTexto.textContent = tension !== null ? `T = ${tension.toFixed(1)}` : 'T = —';
}

// Tensión de la pared ventricular, ley de Laplace (Ficha 3): T = (P×R)/2t.
function calcLaplaceTension() {
    const pEl = document.getElementById('cardio-laplace-p');
    const rEl = document.getElementById('cardio-laplace-r');
    const tEl = document.getElementById('cardio-laplace-t');
    const box = document.getElementById('cardio-laplace-resultado');
    if (!pEl || !rEl || !tEl || !box) return;

    const rVal = rEl.value !== '' ? Number(rEl.value) : null;
    const tVal = tEl.value !== '' ? Number(tEl.value) : null;

    if (pEl.value === '' || rEl.value === '' || tEl.value === '') {
        box.style.display = 'none';
        calcLaplaceCirculoFicha3(rVal, tVal, null);
        return;
    }

    const p = Number(pEl.value);
    const r = Number(rEl.value);
    const t = Number(tEl.value);
    if (t === 0) {
        box.style.display = 'none';
        calcLaplaceCirculoFicha3(r, t, null);
        return;
    }

    const tension = (p * r) / (2 * t);

    box.style.display = 'block';
    box.className = 'tfg-estado tfg-estado-ok';
    box.innerHTML = `T = (P × R) / 2t = (${p} × ${r}) / (2 × ${t}) = <strong>${tension.toFixed(1)}</strong> (unidades de presión×longitud/longitud)` +
        '<br><span style="font-size:0.72rem;opacity:0.85;">A mayor radio (dilatación) o menor grosor de pared, mayor tensión para la misma presión — la hipertrofia (↑t) es el mecanismo compensador que busca normalizarla.</span>';

    calcLaplaceCirculoFicha3(r, t, tension);
}

// Simulador del asa presión-volumen (Ficha 3) — modelo ilustrativo del
// método de elastancia de un solo latido (Ees/Ea/V0), estándar en
// fisiología cardiovascular didáctica. El capítulo solo describe el asa de
// forma cualitativa (los patrones ya recogidos en la tabla de la propia
// ficha), así que las constantes de aquí NO son cifras literales de la
// fuente — igual que el modelo del simulador de Frank-Starling de la
// Ficha 1, es puramente ilustrativo.
const PV_V0 = 20;   // volumen teórico a presión 0 (constante del modelo)
const PV_PD0 = 1;   // constante de escala de la curva diastólica exponencial
const PV_ESTADOS = {
    normal: { ees: 2.2, beta: 0.022 },
    sistolica: { ees: 0.9, beta: 0.022 },
    diastolica: { ees: 2.2, beta: 0.040 },
};
function pvMapV(vol) { return 45 + (vol / 220) * 275; }
function pvMapP(pres) { return 195 - (pres / 180) * 175; }

function calcAsaPresionVolumen() {
    const precargaEl = document.getElementById('cardio-pv-precarga');
    const poscargaEl = document.getElementById('cardio-pv-poscarga');
    const estadoEl = document.getElementById('cardio-pv-estado');
    const loopPath = document.getElementById('cardio-pv-loop-path');
    if (!precargaEl || !poscargaEl || !estadoEl || !loopPath) return;

    const precarga = Number(precargaEl.value);
    const poscarga = Number(poscargaEl.value);
    const { ees, beta } = PV_ESTADOS[estadoEl.value];

    const edv = 70 + precarga * 0.9;    // 70-160 mL
    const ea = 0.6 + poscarga * 0.018;  // 0.6-2.4 (elastancia arterial efectiva)

    const esv = (ea * edv + ees * PV_V0) / (ees + ea);
    const esp = ees * (esv - PV_V0);
    // Clamp: con precarga alta + disfunción diastólica la exponencial puede
    // disparar la presión de llenado muy por encima del lienzo — se limita
    // a 170 mmHg (aun así "fuera de escala", pero mantiene el asa dibujable).
    const edp = Math.min(170, PV_PD0 * (Math.exp(beta * (edv - PV_V0)) - 1));
    const edpEsv = Math.min(170, PV_PD0 * (Math.exp(beta * (esv - PV_V0)) - 1));
    const pao = 0.35 * esp + 20; // presión de apertura aórtica aproximada (< esp)
    const sv = edv - esv;
    const ef = edv > 0 ? (sv / edv) * 100 : 0;

    const ax = pvMapV(edv), ay = pvMapP(edp);
    const bx = pvMapV(edv), by = pvMapP(pao);
    const cx = pvMapV(esv), cy = pvMapP(esp);
    const dx = pvMapV(esv), dy = pvMapP(edpEsv);

    const ejeccionCtrlX = (bx + cx) / 2;
    const ejeccionCtrlY = Math.min(by, cy) - 12;
    const llenadoCtrlX = dx + (ax - dx) * 0.7;
    const llenadoCtrlY = dy + (ay - dy) * 0.15;

    loopPath.setAttribute('d', `M ${ax},${ay} L ${bx},${by} Q ${ejeccionCtrlX},${ejeccionCtrlY} ${cx},${cy} L ${dx},${dy} Q ${llenadoCtrlX},${llenadoCtrlY} ${ax},${ay} Z`);

    const colores = { normal: 'var(--accent-blue)', sistolica: 'var(--accent-red)', diastolica: 'var(--accent-purple)' };
    const color = colores[estadoEl.value];
    loopPath.setAttribute('stroke', color);
    loopPath.setAttribute('fill', color);
    loopPath.style.fillOpacity = '0.15';

    // Línea ESPVR (Ees): desde V0 hasta el borde del lienzo.
    const pMaxCanvas = 180;
    const vEnPMax = PV_V0 + pMaxCanvas / ees;
    const vFinLinea = Math.min(220, vEnPMax);
    const pFinLinea = ees * (vFinLinea - PV_V0);
    const espvrLine = document.getElementById('cardio-pv-espvr-line');
    if (espvrLine) {
        espvrLine.setAttribute('x1', pvMapV(PV_V0));
        espvrLine.setAttribute('y1', pvMapP(0));
        espvrLine.setAttribute('x2', pvMapV(vFinLinea));
        espvrLine.setAttribute('y2', pvMapP(pFinLinea));
    }
    // La etiqueta "Ees" queda fija en la esquina superior derecha (ver HTML)
    // — anclarla al extremo dinámico de la línea la hacía chocar con el
    // título del diagrama cuando Ees es alto (línea casi vertical).

    // Curva FRPVD (llenado diastólico), muestreada desde V0 hasta EDV+30.
    const frpvdPuntos = [];
    const vMaxFrpvd = Math.min(220, edv + 30);
    for (let v = PV_V0; v <= vMaxFrpvd; v += (vMaxFrpvd - PV_V0) / 20) {
        const p = PV_PD0 * (Math.exp(beta * (v - PV_V0)) - 1);
        if (p > 180) break;
        frpvdPuntos.push(`${pvMapV(v)},${pvMapP(p)}`);
    }
    const frpvdPath = document.getElementById('cardio-pv-frpvd-path');
    if (frpvdPath) frpvdPath.setAttribute('d', frpvdPuntos.length ? 'M ' + frpvdPuntos.join(' L ') : '');
    const frpvdLabel = document.getElementById('cardio-pv-frpvd-label');
    if (frpvdLabel && frpvdPuntos.length) {
        const [lx, ly] = frpvdPuntos[frpvdPuntos.length - 1].split(',');
        frpvdLabel.setAttribute('x', Number(lx) - 26);
        frpvdLabel.setAttribute('y', Number(ly) - 6);
    }

    const puntoA = document.getElementById('cardio-pv-punto-a');
    if (puntoA) { puntoA.setAttribute('cx', ax); puntoA.setAttribute('cy', ay); }
    const puntoC = document.getElementById('cardio-pv-punto-c');
    if (puntoC) { puntoC.setAttribute('cx', cx); puntoC.setAttribute('cy', cy); }

    const precargaValorEl = document.getElementById('cardio-pv-precarga-valor');
    if (precargaValorEl) precargaValorEl.textContent = `${precarga}%`;
    const poscargaValorEl = document.getElementById('cardio-pv-poscarga-valor');
    if (poscargaValorEl) poscargaValorEl.textContent = `${poscarga}%`;

    const resultadoEl = document.getElementById('cardio-pv-resultado');
    if (resultadoEl) {
        let estadoBox = 'ok';
        if (ef < 30) estadoBox = 'danger';
        else if (ef < 45) estadoBox = 'warn';
        const etiquetaEstado = { normal: 'normal', sistolica: 'disfunción sistólica', diastolica: 'disfunción diastólica' }[estadoEl.value];
        resultadoEl.className = `tfg-estado tfg-estado-${estadoBox}`;
        resultadoEl.innerHTML = `EDV ≈ ${edv.toFixed(0)} mL · ESV ≈ ${esv.toFixed(0)} mL · Volumen sistólico ≈ ${sv.toFixed(0)} mL · FE ≈ ${ef.toFixed(0)}% (${etiquetaEstado})` +
            '<br><span style="font-size:0.72rem;opacity:0.85;">Modelo ilustrativo — fíjate en cómo la línea azul discontinua (Ees) se desplaza abajo/derecha en disfunción sistólica, y la línea amarilla discontinua (FRPVD) se desplaza arriba/izquierda en disfunción diastólica, tal como describe la tabla de patrones de arriba.</span>';
    }
}

// Simulador de fuerzas de Starling a lo largo del capilar (Ficha 4):
// presión hidrostática decreciente linealmente del extremo arteriolar al
// venular (diferencial fijo de 17 mmHg, valores de partida clásicos de la
// docencia fisiológica ~32→15 mmHg) frente a una presión oncótica
// plasmática constante — encuentra el punto donde se cruzan (filtración →
// reabsorción). Modelo simplificado: la fuente no da esta fórmula, solo
// describe el balance en prosa (ver el texto que precede al simulador).
function calcFuerzasStarlingCapilar() {
    const phEl = document.getElementById('cardio-starling-ph');
    const oncEl = document.getElementById('cardio-starling-onc');
    const flechasG = document.getElementById('cardio-starling-flechas');
    const cruceLinea = document.getElementById('cardio-starling-cruce');
    const cruceLabel = document.getElementById('cardio-starling-cruce-label');
    const resultadoEl = document.getElementById('cardio-starling-resultado');
    if (!phEl || !oncEl || !flechasG) return;

    const phArt = Number(phEl.value);
    const onc = Number(oncEl.value);
    const phVen = Math.max(5, phArt - 17);

    const phValorEl = document.getElementById('cardio-starling-ph-valor');
    if (phValorEl) phValorEl.textContent = `${phArt} mmHg`;
    const oncValorEl = document.getElementById('cardio-starling-onc-valor');
    if (oncValorEl) oncValorEl.textContent = `${onc} mmHg`;

    const pendiente = phVen - phArt;
    let x0 = pendiente !== 0 ? (onc - phArt) / pendiente : 0.5;
    x0 = Math.max(0, Math.min(1, x0));
    const todoFiltra = (phVen - onc) >= 0;
    const todoReabsorbe = (phArt - onc) <= 0;

    // Ambas flechas viven en la misma banda (el espacio intersticial, debajo
    // del tubo capilar) para que la dirección sea lo único que cambia: hacia
    // abajo/afuera = filtración (sale del vaso), hacia arriba/adentro =
    // reabsorción (entra al vaso) — antes usaban bandas opuestas (una
    // arriba, otra abajo) y las dos apuntaban "hacia afuera" de su propia
    // banda, sin transmitir realmente "entra" vs. "sale" del capilar.
    const nPuntos = 5;
    let svgFlechas = '';
    for (let i = 0; i < nPuntos; i++) {
        const frac = i / (nPuntos - 1);
        const ph = phArt + (phVen - phArt) * frac;
        const neto = ph - onc;
        const x = 55 + frac * 210;
        if (neto > 0.5) {
            svgFlechas += `<line x1="${x}" y1="76" x2="${x}" y2="90" stroke="var(--accent-red)" stroke-width="2"/><polygon points="${x - 4},90 ${x + 4},90 ${x},98" fill="var(--accent-red)"/>`;
        } else if (neto < -0.5) {
            svgFlechas += `<line x1="${x}" y1="98" x2="${x}" y2="84" stroke="var(--accent-green)" stroke-width="2"/><polygon points="${x - 4},84 ${x + 4},84 ${x},76" fill="var(--accent-green)"/>`;
        } else {
            svgFlechas += `<circle cx="${x}" cy="87" r="2.5" fill="var(--text-muted)"/>`;
        }
    }
    flechasG.innerHTML = svgFlechas;

    let cruceX = 55 + x0 * 210;
    if (todoFiltra) { cruceX = 280; if (cruceLabel) cruceLabel.textContent = 'filtración en todo el capilar'; }
    else if (todoReabsorbe) { cruceX = 40; if (cruceLabel) cruceLabel.textContent = 'reabsorción en todo el capilar'; }
    else if (cruceLabel) cruceLabel.textContent = 'punto de equilibrio';
    if (cruceLinea) { cruceLinea.setAttribute('x1', cruceX); cruceLinea.setAttribute('x2', cruceX); }

    if (resultadoEl) {
        const netoArt = phArt - onc;
        const netoVen = phVen - onc;
        resultadoEl.className = 'tfg-estado tfg-estado-ok';
        resultadoEl.innerHTML = `Presión neta en el extremo arteriolar: ${netoArt.toFixed(1)} mmHg (${netoArt > 0 ? 'filtración' : 'reabsorción'}) · Presión neta en el extremo venular: ${netoVen.toFixed(1)} mmHg (${netoVen > 0 ? 'filtración' : 'reabsorción'})` +
            (todoFiltra || todoReabsorbe ? '' : ` · Punto de equilibrio a ≈${Math.round(x0 * 100)}% del trayecto`) +
            '<br><span style="font-size:0.72rem;opacity:0.85;">Modelo simplificado (presión oncótica constante a lo largo del capilar) — en la realidad la oncótica también sube ligeramente al concentrarse las proteínas conforme el capilar filtra líquido.</span>';
    }
}

// Panel de control unificado del ciclo cardíaco (Ficha 1) — los 5 campos
// leen y escriben directamente sobre CicloEstado; el propio panel se
// suscribe a sí mismo como listener para reflejar los cambios que lleguen
// desde cualquier otro widget (Frank-Starling, Fick, RVS/RVP). No se
// reescribe el campo que el usuario tiene activo en ese instante, para no
// interrumpirle a mitad de tecleo.
function initPanelControl() {
    const fcEl = document.getElementById('ciclo-panel-fc');
    const edvEl = document.getElementById('ciclo-panel-edv');
    const contrEl = document.getElementById('ciclo-panel-contractilidad');
    const pamEl = document.getElementById('ciclo-panel-pam');
    const padEl = document.getElementById('ciclo-panel-pad');
    if (!fcEl || !edvEl || !contrEl || !pamEl || !padEl) return;

    fcEl.addEventListener('input', () => { if (fcEl.value !== '') CicloEstado.set({ fc: Number(fcEl.value) }); });
    edvEl.addEventListener('input', () => {
        if (edvEl.value === '') return;
        CicloEstado.set({ edv: Math.max(FS_EDV_MIN, Math.min(FS_EDV_MAX, Number(edvEl.value))) });
    });
    contrEl.addEventListener('change', () => CicloEstado.set({ contractilidad: contrEl.value }));
    pamEl.addEventListener('input', () => { if (pamEl.value !== '') CicloEstado.set({ pam: Number(pamEl.value) }); });
    padEl.addEventListener('input', () => { if (padEl.value !== '') CicloEstado.set({ pad: Number(padEl.value) }); });

    CicloEstado.on((s) => {
        if (document.activeElement !== fcEl) fcEl.value = s.fc;
        if (document.activeElement !== edvEl) edvEl.value = s.edv.toFixed(0);
        contrEl.value = s.contractilidad;
        if (document.activeElement !== pamEl) pamEl.value = s.pam;
        if (document.activeElement !== padEl) padEl.value = s.pad;
    });
}

export function init() {
    initCorkboard('cardio-corkboard', 'panel-cardio-tabs');

    initPanelControl();

    const fsPrecargaEl = document.getElementById('cardio-fs-precarga');
    const fsEdvMlEl = document.getElementById('cardio-fs-edv-ml');
    const fsEstadoEl = document.getElementById('cardio-fs-estado');
    if (fsPrecargaEl) fsPrecargaEl.addEventListener('input', () => CicloEstado.set({ edv: fsPrecargaToEdv(Number(fsPrecargaEl.value)) }));
    if (fsEdvMlEl) fsEdvMlEl.addEventListener('input', () => {
        if (fsEdvMlEl.value === '') return;
        CicloEstado.set({ edv: Math.max(FS_EDV_MIN, Math.min(FS_EDV_MAX, Number(fsEdvMlEl.value))) });
    });
    if (fsEstadoEl) fsEstadoEl.addEventListener('change', () => CicloEstado.set({ contractilidad: fsEstadoEl.value }));
    CicloEstado.on(renderFrankStarling);
    renderFrankStarling();

    document.querySelectorAll('#cardio-laplace-mini-r, #cardio-laplace-mini-p')
        .forEach(el => el && el.addEventListener('input', calcLaplaceMiniDiagrama));
    calcLaplaceMiniDiagrama();
    const laplaceSyncBtn = document.getElementById('cardio-laplace-mini-sync-edv');
    if (laplaceSyncBtn) laplaceSyncBtn.addEventListener('click', sincronizarLaplaceMiniConEdv);
    CicloEstado.on((s) => {
        const valorEl = document.getElementById('cardio-laplace-mini-sync-edv-valor');
        if (valorEl) valorEl.textContent = s.edv.toFixed(0);
    });

    const laplaceMiniGc = document.getElementById('cardio-laplace-mini-gc');
    if (laplaceMiniGc) laplaceMiniGc.addEventListener('input', calcRVSArtefactoDiagrama);
    CicloEstado.on(calcRVSArtefactoDiagrama);
    calcRVSArtefactoDiagrama();

    initCicloCardiacoAnimado();
    CicloEstado.on(actualizarEscalaVentriculoPorEdv);
    actualizarEscalaVentriculoPorEdv();
    initMiniCiclosSync();

    document.querySelectorAll('#cardio-fick-hb, #cardio-fick-sao2, #cardio-fick-pao2, #cardio-fick-vs, #cardio-fick-sc, #cardio-fick-svo2, #cardio-fick-pvo2')
        .forEach(el => el && el.addEventListener('input', calcFickTransporte));
    const fickFcEl = document.getElementById('cardio-fick-fc');
    if (fickFcEl) fickFcEl.addEventListener('input', () => { if (fickFcEl.value !== '') CicloEstado.set({ fc: Number(fickFcEl.value) }); });
    CicloEstado.on((s) => {
        if (fickFcEl && document.activeElement !== fickFcEl) fickFcEl.value = s.fc;
        calcFickTransporte();
    });
    calcFickTransporte();

    document.querySelectorAll('#cardio-rv-gc, #cardio-rv-pamp, #cardio-rv-pai')
        .forEach(el => el && el.addEventListener('input', calcResistenciasVasculares));
    const rvPamEl = document.getElementById('cardio-rv-pam');
    const rvPadEl = document.getElementById('cardio-rv-pad');
    if (rvPamEl) rvPamEl.addEventListener('input', () => { if (rvPamEl.value !== '') CicloEstado.set({ pam: Number(rvPamEl.value) }); });
    if (rvPadEl) rvPadEl.addEventListener('input', () => { if (rvPadEl.value !== '') CicloEstado.set({ pad: Number(rvPadEl.value) }); });
    CicloEstado.on((s) => {
        if (rvPamEl && document.activeElement !== rvPamEl) rvPamEl.value = s.pam;
        if (rvPadEl && document.activeElement !== rvPadEl) rvPadEl.value = s.pad;
        calcResistenciasVasculares();
    });
    const rvSyncGcBtn = document.getElementById('cardio-rv-sync-gc');
    if (rvSyncGcBtn) rvSyncGcBtn.addEventListener('click', usarGcDeFickEnRvs);
    calcResistenciasVasculares();

    document.querySelectorAll('#cardio-costo-fc, #cardio-costo-pas, #cardio-costo-cuna, #cardio-costo-pad-sist, #cardio-costo-pvc')
        .forEach(el => el && el.addEventListener('input', calcCostoFuncionamiento));
    const ladoEl = document.getElementById('cardio-costo-lado');
    if (ladoEl) ladoEl.addEventListener('change', calcCostoFuncionamiento);
    calcCostoFuncionamiento();

    document.querySelectorAll('#cardio-laplace-p, #cardio-laplace-r, #cardio-laplace-t')
        .forEach(el => el && el.addEventListener('input', calcLaplaceTension));
    calcLaplaceTension();

    document.querySelectorAll('#cardio-ido2-gc, #cardio-ido2-sc, #cardio-ido2-hb, #cardio-ido2-sao2, #cardio-ido2-pao2')
        .forEach(el => el && el.addEventListener('input', calcIDO2Ficha2));
    calcIDO2Ficha2();

    document.querySelectorAll('#cardio-pv-precarga, #cardio-pv-poscarga')
        .forEach(el => el && el.addEventListener('input', calcAsaPresionVolumen));
    const pvEstadoEl = document.getElementById('cardio-pv-estado');
    if (pvEstadoEl) pvEstadoEl.addEventListener('change', calcAsaPresionVolumen);
    calcAsaPresionVolumen();

    document.querySelectorAll('#cardio-starling-ph, #cardio-starling-onc')
        .forEach(el => el && el.addEventListener('input', calcFuerzasStarlingCapilar));
    calcFuerzasStarlingCapilar();
}
