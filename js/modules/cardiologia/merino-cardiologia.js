// Merino Cardiología — enfoque general del shock, shock hemorrágico,
// shock cardiogénico y síndromes de shock inflamatorio (cuaderno de
// campo). Fuente: Marik PE. Handbook of Evidence-Based Critical Care,
// Cap. 14-17.
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';

// Tabla 15.1 — clasificador de shock hemorrágico por % de volumen perdido.
function calcClaseHemorragia() {
    const input = document.getElementById('mc-clase-perdida');
    const resultado = document.getElementById('mc-clase-resultado');
    if (!input || !resultado) return;
    if (input.value === '') {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Introduce el % de volumen sanguíneo perdido estimado.</span>';
        return;
    }
    let pct = Number(input.value);
    if (pct < 0) { pct = 0; input.value = 0; }
    if (pct > 100) { pct = 100; input.value = 100; }

    let clase, estado, texto;
    if (pct < 15) {
        clase = 'Clase I'; estado = 'tfg-estado-ok';
        texto = 'Fase asintomática. Volumen restaurado por relleno transcapilar — reanimación con volumen no necesaria.';
    } else if (pct <= 30) {
        clase = 'Clase II'; estado = 'tfg-estado-warn';
        texto = 'Fase compensada. PA mantenida por vasoconstricción sistémica; vigilar hipoperfusión esplácnica. Reanimación con cristaloides.';
    } else if (pct <= 40) {
        clase = 'Clase III'; estado = 'tfg-estado-danger';
        texto = 'Shock hemorrágico establecido: la vasoconstricción ya no basta. Hipotensión, hipoperfusión orgánica, lactato elevado. Reanimación con sangre.';
    } else {
        clase = 'Clase IV'; estado = 'tfg-estado-danger';
        texto = 'Shock hemorrágico avanzado, potencialmente irreversible. Fallo multiorgánico y acidosis láctica grave. Transfusión masiva.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${pct}% — ${clase}</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}

function initClaseHemorragia() {
    const input = document.getElementById('mc-clase-perdida');
    if (!input) return;
    input.addEventListener('input', calcClaseHemorragia);
    calcClaseHemorragia();
}

// Tabla 15.5 — intérprete TEG: cada select "anormal" añade su intervención.
const TEG_INTERVENCIONES = {
    r: 'Tiempo R anormal (&gt;9 min) → transfundir plasma, o revertir anticoagulantes (excepto warfarina).',
    k: 'Tiempo k anormal (&gt;2,5 min) → transfundir plasma.',
    alfa: 'Ángulo α anormal (&lt;65°) → crioprecipitado o concentrado de fibrinógeno.',
    ma: 'MA anormal (&lt;55 mm) → transfundir plaquetas.',
    ly30: 'LY30 anormal (&gt;3%) → ácido tranexámico.',
};
function calcTeg() {
    const ids = ['r', 'k', 'alfa', 'ma', 'ly30'];
    const selects = ids.map(id => document.getElementById(`mc-teg-${id}`));
    const resultado = document.getElementById('mc-teg-resultado');
    if (!resultado || selects.some(s => !s)) return;

    const evaluados = selects.filter(s => s.value !== '');
    if (evaluados.length === 0) {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Marca los parámetros TEG disponibles para ver las intervenciones recomendadas.</span>';
        return;
    }
    const anormales = ids.filter((id, i) => selects[i].value === 'anormal');
    if (anormales.length === 0) {
        resultado.className = 'result-box tfg-estado-ok';
        resultado.innerHTML = '<strong>Sin parámetros anormales marcados.</strong> Sin indicación de hemoderivados/antifibrinolítico según la TEG evaluada.';
        resultado.style.textAlign = 'left';
        return;
    }
    resultado.className = 'result-box tfg-estado-danger';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${anormales.length} parámetro${anormales.length > 1 ? 's' : ''} anormal${anormales.length > 1 ? 'es' : ''}:</strong>` +
        anormales.map(id => `<p style="font-size:0.85rem; margin:6px 0 0;">${TEG_INTERVENCIONES[id]}</p>`).join('');
}

function initTeg() {
    const r = document.getElementById('mc-teg-r');
    if (!r) return;
    document.querySelectorAll('.mc-teg-select').forEach(s => s.addEventListener('change', calcTeg));
    calcTeg();
}

// Selector "elección de dispositivo" — informativo, no puntuable (no hay
// un único ganador entre IABP/Impella/ECMO según la fuente).
const DISPOSITIVO_INFO = {
    iabp: {
        estado: 'tfg-estado-warn',
        texto: 'La forma más antigua y disponible de MCS, pese a no haber demostrado mejora en la supervivencia. Reduce el trabajo cardíaco (descarga el VI) y aumenta el flujo coronario/sistémico. Contraindicado en insuficiencia valvular aórtica o disección aórtica. Principal complicación: isquemia de extremidad (fiebre en 50%, bacteriemia en 15%).',
    },
    impella: {
        estado: 'tfg-estado-warn',
        texto: 'Bomba centrífuga percutánea que asiste el gasto ventricular (2,5-5,5 L/min). Efectos hemodinámicos similares al IABP, sin ventaja de supervivencia demostrada sobre él en shock relacionado con infarto — mayor ventaja en fallo del VI terminal (implante a largo plazo). Contraindicado en valvulopatía/prótesis aórtica y trombo del VI. Más sangrado mayor/isquemia de extremidad que el IABP, y mayor incidencia de hemólisis (5-10%).',
    },
    ecmo: {
        estado: 'tfg-estado-ok',
        texto: 'Soporte circulatorio y de intercambio gaseoso combinados — el único que da soporte biventricular completo sin combinar dispositivos. Método de elección si el shock cardiogénico se acompaña de fallo respiratorio. Problema propio: aumenta la poscarga del VI (puede requerir venteo o combinar con IABP/Impella). Complicaciones considerables: sangrado mayor (41%), sepsis (30%), isquemia de extremidad (17%), síndrome compartimental (10%), ictus (6%), amputación (5%). Supervivencia al alta ~42% en el mayor registro disponible.',
    },
};
function initDispositivoSelector() {
    const select = document.getElementById('mc-dispositivo-select');
    const resultado = document.getElementById('mc-dispositivo-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = DISPOSITIVO_INFO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${info.texto}</p>`;
    });
}

// Enlace interno Ficha I → Ficha X (mismo panel, sin depender del
// listener global .tx-link de nefrologia/index.js, que escanea todo el
// DOM y no debe reutilizarse fuera de sus propias claves de vista).
function initLinkASeptico() {
    const btn = document.getElementById('mc-link-a-septico');
    if (!btn) return;
    btn.addEventListener('click', () => openCorkboardTopic('panel-merino-cardio-tabs', 'mc-shock-septico'));
}

export function init() {
    initCorkboard('merino-cardio-corkboard', 'panel-merino-cardio-tabs');
    initClaseHemorragia();
    initTeg();
    initDispositivoSelector();
    initLinkASeptico();
}
