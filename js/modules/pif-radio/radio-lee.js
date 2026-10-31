// «Lee esta placa»: ejercicio de lectura sobre una imagen real, reutilizable desde cualquier cuaderno.
//   montarLectura(contenedor, ejercicio)  → monta la tarjeta; formato del ejercicio en js/data/pif-radio-lee.js.
// Modos que se combinan: zonas que se destapan al tocar · toque + comparación con una zona · pregunta de lectura ·
// «encuentra el error». Ids del DOM: rl-<id>-… (un id repetido falla en voz alta y no monta nada).
import { EJERCICIOS_LEE } from '../../data/pif-radio-lee.js';

const pct = n => n.toFixed(1) + '%';
const DIANA_MIN = 32;   // px: lado mínimo de la diana efectiva de una zona (dedo a 360 px)
const usados = new Set();
const mal = m => console.error('[radio-lee] ' + m);

function validar(ej) {
    if (!ej || !ej.id) { mal('ejercicio sin id'); return false; }
    if (usados.has(ej.id) || document.getElementById(`rl-${ej.id}`)) { mal(`id repetido: ${ej.id}`); return false; }
    const f = ej.fuente;
    if (!f || !f.texto) { mal(`${ej.id}: falta fuente.texto (crédito obligatorio)`); return false; }
    if (f.url && !(f.licencia && f.autor)) { mal(`${ej.id}: imagen con url sin licencia y autor`); return false; }
    if (!f.url && !(f.pdf && f.pagina)) { mal(`${ej.id}: sin url, la fuente necesita pdf y pagina`); return false; }
    if ((ej.zonas || []).some(z => !z.rotulo || !z.cita)) { mal(`${ej.id}: toda zona lleva rotulo y cita`); return false; }
    if (ej.toque && !(ej.zonas || []).some(z => z.id === ej.toque.zona)) { mal(`${ej.id}: toque.zona no existe`); return false; }
    return true;
}

function credito(f) {
    if (f.url) {
        const lic = f.licenciaUrl ? `<a class="biblio-link" href="${f.licenciaUrl}" target="_blank" rel="noopener">${f.licencia}</a>` : f.licencia;
        return `<a class="biblio-link" href="${f.url}" target="_blank" rel="noopener">${f.texto}</a> · ${f.autor}${f.fecha ? ', ' + f.fecha : ''} · ${lic} · ${f.sitio || (/commons\.wikimedia\.org|upload\.wikimedia\.org/.test(f.url) ? 'Wikimedia Commons' : '')}`.replace(/ · $/, '');
    }
    return `${f.texto} · <a class="biblio-link" href="${f.pdf}#page=${f.pagina}" target="_blank" rel="noopener">pág. ${f.pagina}</a>`;
}

function centro(z) { return z.forma === 'rect' ? [z.x + z.w / 2, z.y + z.h / 2] : [z.x, z.y]; }

export function montarLectura(contenedor, ej) {
    if (!contenedor || !validar(ej)) return null;
    usados.add(ej.id);
    const p = `rl-${ej.id}`, f = ej.fuente, zonas = ej.zonas || [], q = ej.pregunta, er = ej.error, tq = ej.toque;
    const modoZonas = zonas.length > 0 && !tq;
    contenedor.insertAdjacentHTML('beforeend', `
    <div class="card radio-lee" id="${p}" style="padding:12px 14px; margin-bottom:14px;">
        ${ej.titulo ? `<p class="section-label" style="margin-top:0;">${ej.titulo}</p>` : ''}
        ${ej.consigna ? `<p style="font-size:0.88rem; margin:0 0 8px;">${ej.consigna}</p>` : ''}
        <div class="fig-rot-caja radio-lee-caja" id="${p}-caja"><img id="${p}-img" src="${ej.img}" alt="${ej.alt || ''}" draggable="false"></div>
        <p class="fuente-ficha" style="margin:6px 0 2px;" id="${p}-pie">${ej.pieAntes ?? ej.pie ?? ''}</p>
        <p class="fuente-ficha" style="margin:0 0 6px;" id="${p}-credito">${credito(f)}</p>
        <p id="${p}-estado" style="font-size:0.85rem; margin:0 0 8px;" aria-live="polite"></p>
        <ol class="radio-lee-lista" id="${p}-lista" hidden></ol>
        ${modoZonas ? `<div style="display:flex; gap:8px; margin-bottom:8px;"><button type="button" class="ecg-chip" id="${p}-destapar">Destapar todo</button><button type="button" class="ecg-chip" id="${p}-tapar" disabled>Tapar</button></div>` : ''}
        ${(q || er) ? `<p style="font-size:0.88rem; font-weight:600; margin:0 0 6px;">${(q || er).enunciado}</p>` : ''}
        <div id="${p}-ops" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
        ${q ? `<button type="button" class="siguiente-ficha-btn" id="${p}-comprobar" style="margin-top:10px;" disabled>Comprobar con el libro</button>` : ''}
        <div class="result-box" id="${p}-res" style="display:none; text-align:left; margin-top:12px;"></div>
    </div>`);
    const $ = s => document.getElementById(`${p}-${s}`);
    const caja = $('caja'), img = $('img'), ops = $('ops'), btn = $('comprobar'), pie = $('pie'), estado = $('estado'), res = $('res');
    const hint = () => estado.textContent = tq ? 'Aún no has tocado la placa.' : modoZonas ? 'Toca una zona de la placa para destapar su rótulo.' : '';
    const ponerTapas = () => (ej.tapar || []).forEach(t => { const d = document.createElement('div'); d.className = 'radio-tapa'; d.style.cssText = `left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%`; caja.appendChild(d); });
    const quitarTapas = () => caja.querySelectorAll('.radio-tapa').forEach(n => n.remove());

    // Zonas: marco + rótulo, ocultos hasta destaparse
    const dom = {};
    let masivo = false;
    zonas.forEach((z, k) => {
        const m = document.createElement('div'); m.hidden = true; m.id = `${p}-z-${z.id}`;
        m.className = 'radio-zona fig-rot-punto' + (z.id === tq?.confunde ? ' radio-lee-extra' : '');
        if (z.forma === 'rect') { m.classList.add('radio-zona-rect'); m.style.cssText = `left:${pct(z.x)};top:${pct(z.y)};width:${pct(z.w)};height:${pct(z.h)}`; }
        else { m.style.cssText = `left:${pct(z.x)};top:${pct(z.y)};width:${pct(z.r * 2)};aspect-ratio:1;min-width:12px`; m.classList.add('radio-zona-circ'); }
        const [cx, cy] = centro(z);
        const t = document.createElement('div'); t.hidden = true; t.id = `${p}-zt-${z.id}`; t.className = 'fig-rot-txt radio-lee-rot';
        t.style.left = pct(Math.min(cx + 4, 52)); t.style.top = pct(Math.max(cy - (z.forma === 'rect' ? 0 : 9), 6));
        t.innerHTML = `${z.rotulo}<span class="radio-lee-cita">${z.cita}</span>`;
        const nb = document.createElement('span'); nb.className = 'radio-num'; nb.textContent = k + 1; m.appendChild(nb);
        caja.append(m, t); dom[z.id] = { m, t, abierta: false, suelta: false };
    });
    const mostrar = (id, on = true) => { const d = dom[id]; if (!d) return; d.abierta = on; d.suelta = on && !masivo; d.m.hidden = !on; d.t.hidden = !d.suelta; };
    // «Destapar todo»: la imagen solo muestra marcos numerados; los rótulos van en una lista debajo (no tapan la placa)
    const lista = $('lista');
    const destaparTodo = () => {
        masivo = true; caja.classList.add('radio-lee-masivo');
        zonas.forEach(z => mostrar(z.id));
        lista.innerHTML = zonas.map(z => `<li>${z.rotulo}<span class="radio-lee-cita">${z.cita}</span></li>`).join(''); lista.hidden = false;
    };
    const taparTodo = () => { masivo = false; caja.classList.remove('radio-lee-masivo'); lista.hidden = true; lista.innerHTML = ''; zonas.forEach(z => mostrar(z.id, false)); };
    const abiertas = () => Object.values(dom).filter(d => d.abierta).length;
    const sync = () => {
        if (!modoZonas) return;
        estado.textContent = abiertas() ? `Zonas destapadas: ${abiertas()} de ${zonas.length}.` : 'Toca una zona de la placa para destapar su rótulo.';
        $('tapar').disabled = !abiertas();
    };
    // Zona tocada: cae dentro de la zona ampliada a la diana mínima; si hay varias, la de centro más cercano
    const zonaEn = (cx, cy, r) => {
        let mejor = null, dmin = Infinity;
        zonas.forEach(z => {
            const [zx, zy] = centro(z).map((v, i) => v / 100 * (i ? r.height : r.width));
            const hw = Math.max(z.forma === 'rect' ? z.w / 100 * r.width / 2 : z.r / 100 * r.width, DIANA_MIN / 2);
            const hh = Math.max(z.forma === 'rect' ? z.h / 100 * r.height / 2 : z.r / 100 * r.width, DIANA_MIN / 2);
            const dx = Math.abs(cx - zx), dy = Math.abs(cy - zy);
            if (dx <= hw && dy <= hh && dx + dy < dmin) { dmin = dx + dy; mejor = z; }
        });
        return mejor;
    };

    let toque = null, eleg = -1, hecho = false;
    const listo = () => { if (btn) btn.disabled = !((!tq || toque) && eleg >= 0) || hecho; };
    const marcar = (xy) => {
        caja.querySelectorAll('.radio-toque').forEach(n => n.remove());
        const m = document.createElement('div'); m.className = 'radio-toque'; m.id = `${p}-toque`; m.style.left = pct(xy[0]); m.style.top = pct(xy[1]); caja.appendChild(m);
    };
    caja.addEventListener('click', e => {
        if (hecho) return;
        const r = img.getBoundingClientRect();
        if (tq) {
            toque = [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100 - (tq.desplazaY ?? 0)];
            marcar(toque); estado.textContent = 'Has marcado un punto. Puedes tocar otra vez para moverlo.'; listo();
        } else if (modoZonas) {
            const z = zonaEn(e.clientX - r.left, e.clientY - r.top, r);
            if (z && masivo) { const d = dom[z.id]; d.suelta = !d.suelta; d.t.hidden = !d.suelta; }
            else if (z) { mostrar(z.id, !dom[z.id].abierta); sync(); }
        }
    });
    if (modoZonas) {
        $('destapar').addEventListener('click', () => { destaparTodo(); quitarTapas(); sync(); });
        $('tapar').addEventListener('click', () => { taparTodo(); quitarTapas(); ponerTapas(); sync(); });
    }

    const lineaFuente = () => `<a class="biblio-link" href="${f.pdf}#page=${f.pagina}" target="_blank" rel="noopener">${f.corto || 'Fuente'}, pág. ${f.pagina}</a>`;
    const pieYvolver = () => {
        const v = ej.ver;
        return `${ej.frase ? `<p style="margin:0;">${ej.frase} ${f.pdf ? lineaFuente() : ''}</p>` : ''}
            ${v ? `<button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${v.esp}" data-view="${v.view}" data-panel="${v.panel}" data-tab="${v.tab}" data-resaltar="${v.res}">🔗 Ver en el texto: ${v.rot} →</button>` : ''}
            <button type="button" class="siguiente-ficha-btn" id="${p}-repetir" style="margin-top:10px;">↺ Repetir</button>`;
    };
    const repetir = () => {
        hecho = false; toque = null; eleg = -1; res.style.display = 'none'; res.innerHTML = '';
        caja.querySelectorAll('.radio-toque').forEach(n => n.remove());
        taparTodo(); quitarTapas(); ponerTapas();
        botones.forEach(x => { x.setAttribute('aria-pressed', 'false'); x.disabled = false; x.classList.remove('radio-op-error', 'radio-op-ok'); });
        pie.textContent = ej.pieAntes ?? ej.pie ?? ''; hint(); listo(); sync();
    };

    // Opciones: elecciones de la pregunta, o lecturas de «encuentra el error»
    const textos = q ? q.elecciones : er ? er.opciones.map(o => o.texto) : [];
    const botones = textos.map((t, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ecg-chip radio-lee-op'; b.textContent = t; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => {
            if (hecho) return;
            eleg = i; botones.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i)));
            if (er) corregirError(i); else listo();
        });
        ops.appendChild(b); return b;
    });

    function corregirError(i) {
        hecho = true; if (ej.pie) pie.textContent = ej.pie;
        destaparTodo(); quitarTapas();
        const elegida = er.opciones[i];
        botones.forEach((b, j) => { b.disabled = true; b.classList.add(er.opciones[j].esError ? 'radio-op-error' : 'radio-op-ok'); });
        const lista = er.opciones.map(o => `<li style="margin-bottom:4px;"><strong>${o.esError ? '✗ Aquí está el error.' : '✓ Correcta.'}</strong> «${o.texto}» ${o.explicacion}</li>`).join('');
        res.style.display = '';
        res.innerHTML = `<p style="margin:0 0 6px;"><strong>${elegida.esError ? 'Has encontrado el error.' : 'Esa lectura es correcta; el error está en otra.'}</strong></p>
            <ul style="margin:0 0 8px; padding-left:18px;">${lista}</ul>${pieYvolver()}`;
        res.dataset.ok = String(!!elegida.esError);
        $('repetir').addEventListener('click', repetir);
        sync();
    }

    if (btn) btn.addEventListener('click', () => {
        if (btn.disabled) return;
        hecho = true; btn.disabled = true; if (ej.pie) pie.textContent = ej.pie;
        quitarTapas(); destaparTodo();
        const ok = eleg === q.correcta;
        let linea = '';
        if (tq) {
            const r = img.getBoundingClientRect(), tol = tq.tolerancia / 100 * r.width;
            const dist = id => { const [zx, zy] = centro(zonas.find(z => z.id === id)); return Math.hypot((toque[0] - zx) / 100 * r.width, (toque[1] - zy) / 100 * r.height); };
            const cerca = dist(tq.zona) <= tol, carina = !cerca && tq.confunde && dist(tq.confunde) <= tol;
            const nom = id => zonas.find(z => z.id === id).rotulo.toLowerCase();
            marcar(toque);
            estado.textContent = `Comprobado: el círculo amarillo marca ${nom(tq.zona)}; el discontinuo, ${tq.confunde ? nom(tq.confunde) : 'lo que se confunde'}; el morado, tu toque.`;
            linea = `<p style="margin:0 0 6px;"><strong>${cerca ? 'Tu toque cayó cerca de la punta.' : carina ? 'Has tocado la carina, no la punta.' : 'Tu toque cayó lejos de la punta.'}</strong> ${carina && tq.regla ? tq.regla + ' ' : ''}El círculo amarillo marca ${nom(tq.zona)}; el discontinuo, ${tq.confunde ? nom(tq.confunde) : 'lo que se confunde'}; el morado, tu toque.</p>`;
            res.dataset.cerca = String(cerca); res.dataset.carina = String(!!carina);
        }
        res.style.display = '';
        res.innerHTML = `<p style="margin:0 0 6px;"><strong>${ok ? 'Tu lectura coincide con el libro.' : 'Tu lectura no coincide con el libro.'}</strong> ${q.explicacion}${!ok && q.porque && q.porque[eleg] ? ' ' + q.porque[eleg] : ''}</p>${linea}${pieYvolver()}`;
        res.dataset.ok = String(ok);
        $('repetir').addEventListener('click', repetir);
    });

    ponerTapas(); hint();
    return { id: ej.id, repetir };
}

export function initLee() {
    const host = document.getElementById('radio-f6-ejercicios');
    if (host) EJERCICIOS_LEE.forEach(ej => montarLectura(host, ej));
}
