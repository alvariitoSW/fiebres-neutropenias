// Helpers de UI compartidos por las calculadoras/selectores de toda la
// app. Cada uno existía antes copiado en 2-5 módulos distintos.

// Selector `<select>` → caja de explicación: al cambiar, pinta
// `render(datos[valor])` en la caja (o la oculta si no hay entrada).
export function wireSelectExplicacion(selectId, boxId, datos, render = item => item) {
    const select = document.getElementById(selectId);
    const box = document.getElementById(boxId);
    if (!select || !box) return;
    select.addEventListener('change', () => {
        const item = datos[select.value];
        if (!item) {
            box.style.display = 'none';
            return;
        }
        box.style.display = 'block';
        box.innerHTML = render(item);
    });
}

// Gauge visual (.kinetic-row/.kinetic-fill): rellena `${prefijo}-fill` en
// proporción valor/max, lo colorea según el estado (ok/warn/danger, mismos
// 3 acentos que .tfg-estado-*), escribe `texto` en `${prefijo}-num` y, si
// existe `${prefijo}-row`, lo muestra.
const GAUGE_COLORES = { ok: 'var(--accent-green)', warn: 'var(--accent-yellow)', danger: 'var(--accent-red)' };
const GAUGE_GLOWS = { ok: 'var(--glow-green)', warn: 'none', danger: 'var(--glow-red)' };
export function pintarGauge(prefijo, valor, max, estado, texto = String(valor)) {
    const fill = document.getElementById(`${prefijo}-fill`);
    const num = document.getElementById(`${prefijo}-num`);
    if (!fill || !num) return;
    const row = document.getElementById(`${prefijo}-row`);
    if (row) row.style.display = 'block';
    fill.style.width = `${clamp((valor / max) * 100, 0, 100)}%`;
    fill.style.background = GAUGE_COLORES[estado] || GAUGE_COLORES.ok;
    fill.style.boxShadow = GAUGE_GLOWS[estado] || 'none';
    num.textContent = texto;
}

export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Para texto que viene del usuario (nunca del propio HTML de la app) antes
// de insertarlo vía innerHTML.
export function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
