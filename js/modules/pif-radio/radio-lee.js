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
        <div class="radio-lee-scroll"><div class="fig-rot-caja radio-lee-caja" id="${p}-caja"><img id="${p}-img" src="${ej.img}" alt="${ej.alt || ''}" draggable="false"></div></div>
        <p class="fuente-ficha" style="margin:6px 0 2px;" id="${p}-pie">${ej.pieAntes ?? ej.pie ?? ''}</p>
        <p class="fuente-ficha" style="margin:0 0 6px;" id="${p}-credito">${credito(f)}</p>
        <p id="${p}-estado" style="font-size:0.85rem; margin:0 0 8px;" aria-live="polite"></p>
        <ol class="radio-lee-lista" id="${p}-lista" hidden></ol>
        ${modoZonas ? `<div style="display:flex; gap:8px; margin-bottom:8px;"><button type="button" class="ecg-chip" id="${p}-destapar">Destapar todo</button><button type="button" class="ecg-chip" id="${p}-tapar" disabled>Tapar</button></div>` : ''}
        ${q ? `<p style="font-size:0.88rem; font-weight:600; margin:0 0 6px;">${q.enunciado}</p><div id="${p}-ops" style="display:flex; flex-wrap:wrap; gap:8px;"></div>` : ''}
        ${q ? `<button type="button" class="siguiente-ficha-btn" id="${p}-comprobar" style="margin-top:10px;" disabled>Comprobar con el libro</button>` : ''}
        <div class="result-box" id="${p}-res" style="display:none; text-align:left; margin-top:12px;"></div>
        <div id="${p}-err"></div>
    </div>`);
    const $ = s => document.getElementById(`${p}-${s}`);
    const caja = $('caja'), img = $('img'), ops = $('ops'), errDiv = $('err'), btn = $('comprobar'), pie = $('pie'), estado = $('estado'), res = $('res');
    const hint = () => estado.textContent = tq ? 'Aún no has tocado la placa.' : modoZonas ? 'Toca una zona de la placa para destapar su rótulo.' : '';
    const ponerTapas = () => (ej.tapar || []).forEach(t => { const d = document.createElement('div'); d.className = 'radio-tapa'; d.style.cssText = `left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%`; img.after(d); });
    const quitarTapas = () => caja.querySelectorAll('.radio-tapa').forEach(n => n.remove());

    // Tiras finas (varios cortes en fila): la imagen corre en horizontal con altura mínima legible y los rótulos van a la lista
    let tira = false;
    const medirTira = () => {
        if (tira || !img.naturalWidth) return;
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio > 2.1) { tira = true; caja.style.minWidth = Math.round(180 * ratio) + 'px'; caja.classList.add('radio-lee-masivo'); }
    };
    img.addEventListener('load', medirTira); if (img.complete) medirTira();
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
    const mostrar = (id, on = true) => { const d = dom[id]; if (!d) return; d.abierta = on; d.suelta = on && !masivo && !tira; d.m.hidden = !on; d.t.hidden = !d.suelta; if (tira) pintarLista(); };
    // «Destapar todo»: la imagen solo muestra marcos numerados; los rótulos van en una lista debajo (no tapan la placa)
    const lista = $('lista');
    function pintarLista() {
        const ver = zonas.map((z, k) => [z, k]).filter(([z]) => masivo || (tira && dom[z.id].abierta));
        lista.innerHTML = ver.map(([z, k]) => `<li value="${k + 1}">${z.rotulo}<span class="radio-lee-cita">${z.cita}</span></li>`).join(''); lista.hidden = !ver.length;
    }
    const destaparTodo = () => { masivo = true; caja.classList.add('radio-lee-masivo'); zonas.forEach(z => mostrar(z.id)); pintarLista(); };
    const taparTodo = () => { masivo = false; if (!tira) caja.classList.remove('radio-lee-masivo'); zonas.forEach(z => mostrar(z.id, false)); pintarLista(); };
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
            if (z && masivo && !tira) { const d = dom[z.id]; d.suelta = !d.suelta; d.t.hidden = !d.suelta; }
            else if (z) { mostrar(z.id, !dom[z.id].abierta); sync(); }
        }
    });
    if (modoZonas) {
        $('destapar').addEventListener('click', () => { destaparTodo(); quitarTapas(); sync(); });
        $('tapar').addEventListener('click', () => { taparTodo(); quitarTapas(); ponerTapas(); sync(); });
    }

    const lineaFuente = () => `<a class="biblio-link" href="${f.pdf}#page=${f.pagina}" target="_blank" rel="noopener">${f.corto || 'Fuente'}, ${f.diap ? 'diapositiva ' + f.diap : 'pág. ' + f.pagina}</a>`;
    const pieYvolver = (modo = 'todo') => {
        const v = ej.ver, rep = `<button type="button" class="siguiente-ficha-btn" id="${p}-repetir" style="margin-top:10px;">↺ Repetir</button>`;
        if (modo === 'repetir') return rep;
        return `${ej.frase ? `<p style="margin:0;">${ej.frase} ${f.pdf ? lineaFuente() : ''}</p>` : ''}
            ${v ? `<button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${v.esp}" data-view="${v.view}" data-panel="${v.panel}" data-tab="${v.tab}"${v.res ? ` data-resaltar="${v.res}"` : ''}>🔗 Ver en el texto: ${v.rot} →</button>` : ''}
            ${modo === 'sin-repetir' ? '' : rep}`;
    };
    const repetir = () => {
        hecho = false; toque = null; eleg = -1; res.style.display = 'none'; res.innerHTML = '';
        caja.querySelectorAll('.radio-toque').forEach(n => n.remove());
        taparTodo(); quitarTapas(); ponerTapas();
        botones.forEach(x => { x.setAttribute('aria-pressed', 'false'); x.disabled = false; x.classList.remove('radio-op-error', 'radio-op-ok'); });
        errDiv.innerHTML = ''; if (!q) faseError();
        pie.textContent = ej.pieAntes ?? ej.pie ?? ''; hint(); listo(); sync();
    };

    // Opciones de la pregunta de lectura
    const botones = (q ? q.elecciones : []).map((t, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ecg-chip radio-lee-op'; b.textContent = t; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => {
            if (hecho) return;
            eleg = i; botones.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i))); listo();
        });
        ops.appendChild(b); return b;
    });

    // «Encuentra el error»: puede haber 0, 1 o 2 lecturas falsas. Se marcan las que se creen falsas (o «Todas son correctas») y se corrige.
    // Con pregunta de lectura es la segunda fase, tras «Comprobar con el libro».
    let corregido = false;
    function faseError() {
        if (!er) return;
        corregido = false;
        const opc = [...er.opciones, { texto: 'Todas son correctas', todas: true }];
        const sel = new Set();
        errDiv.innerHTML = `<p style="font-size:0.88rem; font-weight:600; margin:${q ? '12px' : '0'} 0 6px;">Encuentra el error: puede haber 0, 1 o 2 lecturas falsas. Marca las que creas falsas, o «Todas son correctas», y corrige.</p>
            <div id="${p}-eops" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            <button type="button" class="siguiente-ficha-btn" id="${p}-corregir" style="margin-top:10px;" disabled>Corregir</button>`;
        const eops = $('eops'), cb = $('corregir');
        const bs = opc.map((o, i) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'ecg-chip radio-lee-op'; b.textContent = o.texto; b.setAttribute('aria-pressed', 'false');
            b.addEventListener('click', () => {
                if (corregido) return;
                if (sel.has(i)) sel.delete(i);
                else { if (o.todas) sel.clear(); else sel.delete(opc.length - 1); sel.add(i); }
                bs.forEach((x, j) => x.setAttribute('aria-pressed', String(sel.has(j))));
                cb.disabled = !sel.size;
            });
            eops.appendChild(b); return b;
        });
        cb.addEventListener('click', () => {
            if (cb.disabled || corregido) return;
            corregido = true; cb.disabled = true;
            const errores = er.opciones.map((o, i) => o.esError ? i : -1).filter(i => i >= 0);
            const marcadas = [...sel].filter(i => i < er.opciones.length), todas = sel.has(opc.length - 1);
            const ok = todas ? !errores.length : (marcadas.length === errores.length && errores.every(i => sel.has(i)));
            corregirError(bs, errores, ok, todas);
        });
    }
    function corregirError(bs, errores, ok, todas) {
        if (ej.pie) pie.textContent = ej.pie;
        destaparTodo(); quitarTapas();
        bs.forEach((b, j) => { b.disabled = true; if (j < er.opciones.length) b.classList.add(er.opciones[j].esError ? 'radio-op-error' : 'radio-op-ok'); else b.classList.add(errores.length ? 'radio-op-error' : 'radio-op-ok'); });
        const lista = er.opciones.map(o => `<li style="margin-bottom:4px;"><strong>${o.esError ? '✗ Aquí está el error.' : '✓ Correcta.'}</strong> «${o.texto}» ${o.explicacion}</li>`).join('');
        const msg = ok ? (errores.length ? `Has encontrado ${errores.length === 1 ? 'el error' : 'los dos errores'}.` : 'Correcto: todas las lecturas coinciden con la fuente.')
            : errores.length ? (todas ? `No: hay ${errores.length === 1 ? 'una lectura falsa' : 'dos lecturas falsas'}.` : 'No coincide con los errores del texto: marcar una lectura verdadera también es fallo, y quedarse corto con dos errores también.') : 'No: ninguna lectura era falsa. Marcar una verdadera también es fallo.';
        const sin = errores.length ? '' : `<li style="margin-bottom:4px;"><strong>✓ Todas son correctas.</strong> ${er.todas || 'Ninguna de estas lecturas contradice la fuente.'}</li>`;
        const bloque = document.createElement('div');
        bloque.id = `${p}-errres`; bloque.dataset.ok = String(ok);
        bloque.innerHTML = `<p style="margin:12px 0 6px;"><strong>${msg}</strong></p><ul style="margin:0 0 8px; padding-left:18px;">${lista}${sin}</ul>${pieYvolver(q ? 'repetir' : 'todo')}`;
        errDiv.appendChild(bloque);
        if (!q) { res.dataset.ok = String(ok); res.style.display = 'none'; hecho = true; } else bloque.dataset.ok = String(ok);
        bloque.querySelector(`#${p}-repetir`).addEventListener('click', repetir);
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
        res.innerHTML = `<p style="margin:0 0 6px;"><strong>${ok ? 'Tu lectura coincide con el libro.' : 'Tu lectura no coincide con el libro.'}</strong> ${q.explicacion}${!ok && q.porque && q.porque[eleg] ? ' ' + q.porque[eleg] : ''}</p>${linea}${pieYvolver(er ? 'sin-repetir' : 'todo')}`;
        res.dataset.ok = String(ok);
        if (er) faseError(); else $('repetir').addEventListener('click', repetir);
    });

    ponerTapas(); hint(); if (!q) faseError();
    return { id: ej.id, repetir };
}

export function initLee() {
    const host = document.getElementById('radio-f6-ejercicios');
    if (host) EJERCICIOS_LEE.forEach(ej => montarLectura(host, ej));
}
