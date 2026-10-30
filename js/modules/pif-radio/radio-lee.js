// Ficha 6 «Lee esta placa»: tocar en la figura + elegir lectura → «Comprobar con el libro».
// Datos en js/data/pif-radio-lee.js. Ids: radio-f6-<ejercicio>-…
import { EJERCICIOS_LEE } from '../../data/pif-radio-lee.js';

const pct = n => n.toFixed(1) + '%';

function montar(ej, host) {
    const p = `radio-f6-${ej.id}`;
    host.insertAdjacentHTML('beforeend', `
    <div class="card radio-lee" id="${p}" style="padding:12px 14px; margin-bottom:14px;">
        <p class="section-label" style="margin-top:0;">${ej.titulo}</p>
        <p style="font-size:0.88rem; margin:0 0 8px;">${ej.consigna}</p>
        <div class="fig-rot-caja radio-lee-caja" id="${p}-caja"><img id="${p}-img" src="${ej.img}" alt="${ej.alt}" draggable="false"></div>
        <p class="fuente-ficha" style="margin:6px 0;">${ej.pie} <a class="biblio-link" href="${ej.pdf}#page=${ej.pag}" target="_blank" rel="noopener">pág. ${ej.pag}</a></p>
        <p id="${p}-estado" style="font-size:0.85rem; margin:0 0 8px;" aria-live="polite">Aún no has tocado la placa.</p>
        <div id="${p}-ops" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
        <button type="button" class="siguiente-ficha-btn" id="${p}-comprobar" style="margin-top:10px;" disabled>Comprobar con el libro</button>
        <div class="result-box" id="${p}-res" style="display:none; text-align:left; margin-top:12px;"></div>
    </div>`);
    const caja = document.getElementById(`${p}-caja`), img = document.getElementById(`${p}-img`);
    const ops = document.getElementById(`${p}-ops`), btn = document.getElementById(`${p}-comprobar`);
    const estado = document.getElementById(`${p}-estado`), res = document.getElementById(`${p}-res`);
    (ej.tapar || []).forEach(t => { const d = document.createElement('div'); d.className = 'radio-tapa'; d.style.cssText = `left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%`; caja.appendChild(d); });
    let toque = null, eleg = -1, hecho = false;
    const botones = ej.elecciones.map((t, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ecg-chip radio-lee-op'; b.textContent = t; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { if (hecho) return; eleg = i; botones.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i))); listo(); });
        ops.appendChild(b); return b;
    });
    const listo = () => { btn.disabled = !(toque && eleg >= 0) || hecho; };
    const marca = (cls, [x, y], txt) => {
        const m = document.createElement('div'); m.className = cls; m.style.left = pct(x); m.style.top = pct(y);
        if (txt) m.textContent = txt; caja.appendChild(m); return m;
    };
    caja.addEventListener('click', e => {
        if (hecho) return;
        const r = img.getBoundingClientRect();
        toque = [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100];
        caja.querySelectorAll('.radio-toque').forEach(n => n.remove());
        marca('radio-toque', toque).id = `${p}-toque`;
        estado.textContent = 'Has marcado un punto. Puedes tocar otra vez para moverlo.';
        listo();
    });
    btn.addEventListener('click', () => {
        if (btn.disabled) return;
        hecho = true; btn.disabled = true;
        caja.querySelectorAll('.radio-tapa').forEach(n => n.remove());
        const r = img.getBoundingClientRect();
        const dx = (toque[0] - ej.punto[0]) / 100 * r.width, dy = (toque[1] - ej.punto[1]) / 100 * r.height;
        const dist = Math.hypot(dx, dy), cerca = dist <= ej.tolerancia / 100 * r.width;
        marca('fig-rot-punto', ej.punto).id = `${p}-real`;
        const t = marca('fig-rot-txt radio-lee-rot', [Math.min(ej.punto[0] + 4, 52), Math.max(ej.punto[1] - 9, 6)], ej.textoPunto);
        t.id = `${p}-real-txt`;
        if (ej.extra) marca('fig-rot-punto radio-lee-extra', ej.extra.punto);
        const ok = eleg === ej.correcta;
        const v = ej.ver;
        res.style.display = '';
        res.innerHTML = `<p style="margin:0 0 6px;"><strong>${ok ? 'Tu lectura coincide con el libro.' : 'Tu lectura no coincide con el libro.'}</strong> ${ej.respuesta}</p>
            <p style="margin:0 0 6px;"><strong>${cerca ? 'Tu toque cayó cerca de la punta.' : 'Tu toque cayó lejos de la punta.'}</strong> El círculo amarillo marca el punto real.</p>
            <p style="margin:0;">${ej.frase} <a class="biblio-link" href="${ej.pdf}#page=${ej.pag}" target="_blank" rel="noopener">Marino, pág. ${ej.pag}</a></p>
            <button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${v.esp}" data-view="${v.view}" data-panel="${v.panel}" data-tab="${v.tab}" data-resaltar="${v.res}">🔗 Ver en el texto: ${v.rot} →</button>
            <button type="button" class="siguiente-ficha-btn" id="${p}-repetir" style="margin-top:10px;">↺ Repetir</button>`;
        res.dataset.cerca = String(cerca); res.dataset.ok = String(ok);
        document.getElementById(`${p}-repetir`).addEventListener('click', () => {
            hecho = false; toque = null; eleg = -1; res.style.display = 'none'; res.innerHTML = '';
            caja.querySelectorAll('.radio-toque,.fig-rot-punto,.fig-rot-txt').forEach(n => n.remove());
            (ej.tapar || []).forEach(t => { const d = document.createElement('div'); d.className = 'radio-tapa'; d.style.cssText = `left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%`; caja.appendChild(d); });
            botones.forEach(x => x.setAttribute('aria-pressed', 'false'));
            estado.textContent = 'Aún no has tocado la placa.'; listo();
        });
    });
}

export function initLee() {
    const host = document.getElementById('radio-f6-ejercicios');
    if (host) EJERCICIOS_LEE.forEach(ej => montar(ej, host));
}
