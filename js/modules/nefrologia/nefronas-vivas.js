// Nefronas que quedan: un riñón con 40 nefronas. Al perder nefronas, las que
// quedan trabajan más: cada una secreta más K⁺ y excreta más fosfato, y el
// K⁺ en sangre apenas cambia hasta que la adaptación llega a su techo. Se
// monta como panel 'propio' de la vista Visual de ERC · Acidosis e
// hiperpotasemia (Ficha 7).
//
// Qué sale de dónde (líneas «Qué hacen las nefronas que quedan» de la ficha):
// - De la ficha: la pérdida se compensa (Carracedo 2020); las nefronas que
//   quedan secretan más K⁺, con techo: riesgo de hiperpotasemia sobre todo
//   con FGe <15, antes con inhibidores del SRAA o con una carga de K⁺
//   (Nefrología al día 2021 y de Sequera 2024); la FEP pasa de 5-20% a 50% en
//   la ERC avanzada (Rodelo-Haad 2025); IECA/ARA-II e iSGLT2 bajan la presión
//   intraglomerular (Gorostidi 2014, KDIGO 2024).
// - Fisiología general: que el glomérulo de cada nefrona restante filtre más
//   con más presión (hiperfiltración). Ninguna fuente de la app lo explica.
// - Ilustrativo: todas las cifras intermedias (cuánto filtra cada nefrona,
//   el techo de secreción de K⁺, el K⁺ en sangre, la FEP entre sus extremos).
import { irAlTexto } from '../../core/vista-visual.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { alfa } from './potasio-escena.js';
import { categoriaG } from './erc-cga.js';
import { pintarParticula, leyendaParticulas } from '../../core/particulas.js';

const W = 360, H = 290, N = 40, COLS = 10;
const X0 = 22, DX = 35, Y0 = 82, DY = 48;
const COLECTOR_Y = 270;
// Orden fijo en que se pierden las nefronas (mezclado, pero igual siempre).
const ORDEN = (() => {
    const o = Array.from({ length: N }, (_, i) => i);
    let semilla = 7;
    for (let i = N - 1; i > 0; i--) { semilla = (semilla * 1103515245 + 12345) % 2147483648; const j = semilla % (i + 1); [o[i], o[j]] = [o[j], o[i]]; }
    return o;
})();

export const MANDOS_NEFRONAS = { ieca: 'IECA / ARA-II', isglt2: 'iSGLT2', dieta: 'Dieta rica en K⁺' };

// Techo de secreción de K⁺ de cada nefrona (×lo normal), ajustado para que
// sin fármacos el K⁺ empiece a subir con FGe ~15, como dice la ficha.
const TECHO_K = 11.4;

export function modeloNefronas(e) {
    const n = e.nefronas / 100;
    const hf = (e.ieca ? 0.55 : 1) * (e.isglt2 ? 0.7 : 1);
    const h = 1 + 0.8 * (1 - n) * hf;                 // filtrado por nefrona (×), fisiología general
    const fge = 100 * n * h;
    const pcg = 55 + 12 * (1 - n) * hf - (e.ieca ? 3 : 0) - (e.isglt2 ? 2 : 0);
    const carga = e.dieta ? 2 : 1;                  // K⁺ que hay que eliminar (× lo normal)
    const techo = TECHO_K * (e.ieca ? 0.4 : 1);
    const pide = carga / n;                           // lo que tendría que secretar cada nefrona
    const secreta = Math.min(pide, techo);
    const exceso = pide / techo;
    const k = exceso <= 1 ? 4.2 + 0.3 * exceso * exceso : Math.min(8, 4.5 + 2.2 * (exceso - 1));
    const fep = 12 + 38 * Math.min(1, ((1 - n) / 0.9) ** 2); // 5-20% normal → 50% en ERC avanzada
    return { n, h, fge, pcg, carga, techo, pide, secreta, exceso, k, fep, vivas: Math.round(N * n) };
}

export function montarNefronas(cuerpo, { tab }, opciones = {}) {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const tk = v => css.getPropertyValue(v).trim();
    const C = { texto: tk('--text-main'), suave: tk('--text-muted'), verde: tk('--accent-green'), rojo: tk('--accent-red'), amarillo: tk('--accent-yellow'), purpura: tk('--accent-purple') };
    const e = { nefronas: 100, ieca: false, isglt2: false, dieta: false, ...opciones.inicial };

    cuerpo.innerHTML = `
        <div class="gl-escenario nf-escenario"><canvas aria-label="Riñón con 40 nefronas"></canvas></div>
        ${leyendaParticulas([{ clave: 'k', nombre: 'K⁺ (en sangre, teja si está alto)' }, 'p'])}
        <div class="tfg-slider-row"><label for="nf-nefronas-${tab.id}">Nefronas que funcionan</label><input type="range" id="nf-nefronas-${tab.id}" class="nf-nefronas" min="5" max="100" step="5" value="${e.nefronas}"><span class="nf-nefronas-out">${e.nefronas}%</span></div>
        <div class="nv-chips gl-mandos">${Object.entries(MANDOS_NEFRONAS).map(([k, t]) => `<button type="button" class="visual-mini" data-nf="${k}" aria-pressed="false">${t}</button>`).join('')}</div>
        <div class="nv-medidores gl-medidores"></div>
        <div class="hk-avisos gl-avisos"></div>
        <p class="hk-aviso-modelo">Que las nefronas que quedan compensan, que secretan más K⁺ hasta un techo y que la FEP llega al 50% es de la ficha. Que el glomérulo de cada una filtre más con más presión (hiperfiltración) es fisiología general. Las cifras intermedias son ilustrativas: sirven para ver el sentido del cambio, no para calcularlo.</p>`;
    const lienzo = cuerpo.querySelector('canvas'), ctx = lienzo.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = W * dpr; lienzo.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let M = modeloNefronas(e);

    const pos = i => ({ x: X0 + (i % COLS) * DX, y: Y0 + Math.floor(i / COLS) * DY });
    const perdida = new Set();
    const recalcularPerdidas = () => { perdida.clear(); ORDEN.slice(0, N - M.vivas).forEach(i => perdida.add(i)); };

    // ---------- Partículas ----------
    let tubo = [], sangre = [];
    const acum = { k: 0, p: 0 };
    function paso(dt) {
        const vivas = [...Array(N).keys()].filter(i => !perdida.has(i));
        if (vivas.length) {
            // Lo que sale en total es lo que se consigue eliminar; se reparte entre las que quedan.
            acum.k += 7 * (M.carga * Math.min(1, 1 / M.exceso)) * dt;
            acum.p += 3 * dt;
            while (acum.k >= 1) { acum.k--; const i = vivas[Math.floor(Math.random() * vivas.length)]; tubo.push({ i, t: 0, tipo: 'k' }); }
            while (acum.p >= 1) { acum.p--; const i = vivas[Math.floor(Math.random() * vivas.length)]; tubo.push({ i, t: 0, tipo: 'p' }); }
        }
        for (const p of tubo) p.t += dt * 0.7;
        tubo = tubo.filter(p => p.t < 1.6);
        if (tubo.length > 220) tubo.splice(0, tubo.length - 220);
        // K⁺ en sangre: cuántos cuadrados hay en la banda de arriba.
        const objetivo = Math.round(4 + (M.k - 4) * 9);
        while (sangre.length < objetivo) sangre.push({ x: 10 + Math.random() * (W - 20), y: 26 + Math.random() * 16, v: 6 + Math.random() * 10 });
        if (sangre.length > objetivo) sangre.length = objetivo;
        for (const s of sangre) { s.x += s.v * dt; if (s.x > W - 8) s.x = 8; }
    }
    function dibujar() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#211814'; ctx.fillRect(0, 0, W, H);
        // Sangre
        const kAlto = M.k > 5.5;
        ctx.fillStyle = alfa('#a23d28', kAlto ? 0.55 : 0.35); ctx.fillRect(0, 16, W, 34);
        ctx.font = '9px Georgia, serif'; ctx.fillStyle = C.texto; ctx.textAlign = 'left';
        ctx.fillText(`Sangre · K⁺ ${M.k.toFixed(1).replace('.', ',')} mEq/l`, 8, 12);
        // K⁺ en sangre: la forma de la tabla; el color avisa cuando está alto.
        for (const s of sangre) pintarParticula(ctx, 'k', s.x, s.y, 2.2, kAlto ? { color: '--accent-red' } : {});
        // Nefronas
        const r = 4.5 + 3 * (M.h - 1);
        const rojo = Math.min(1, 0.45 + (M.pcg - 55) / 25);
        for (let i = 0; i < N; i++) {
            const { x, y } = pos(i);
            if (perdida.has(i)) {
                ctx.strokeStyle = 'rgba(150,140,125,.35)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x, y + 26); ctx.stroke();
                continue;
            }
            // Túbulo (más grueso si la nefrona se ha hipertrofiado)
            ctx.strokeStyle = '#c9a678'; ctx.lineWidth = 2.5 + Math.min(3, (M.secreta - 1) * 0.35); ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x, y + r); ctx.lineTo(x, y + 26); ctx.quadraticCurveTo(x, y + 32, x + 6, y + 32); ctx.stroke();
            // Glomérulo
            ctx.fillStyle = alfa('#c0412a', rojo); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
            ctx.strokeStyle = alfa(C.amarillo, 0.55); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r + 2, 0, 7); ctx.stroke();
        }
        // Colector y orina
        ctx.strokeStyle = alfa(C.amarillo, 0.5); ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(14, COLECTOR_Y); ctx.lineTo(W - 60, COLECTOR_Y); ctx.stroke();
        ctx.fillStyle = C.suave; ctx.font = '9px Georgia, serif'; ctx.textAlign = 'right'; ctx.fillText('orina →', W - 4, COLECTOR_Y + 3); ctx.textAlign = 'left';
        // Partículas: bajan por su túbulo y salen por el colector hacia la orina
        for (const p of tubo) {
            const { x, y } = pos(p.i);
            let px, py;
            if (p.t < 1) { px = x + (p.t > 0.8 ? (p.t - 0.8) * 30 : 0); py = y + 8 + p.t * 24; }
            else {
                // Cae recto hasta el colector y sigue por él hacia la orina.
                const u = (p.t - 1) / 0.6, xi = x + 6, yi = y + 32;
                if (u < 0.35) { px = xi; py = yi + (COLECTOR_Y - yi) * u / 0.35; }
                else { px = xi + (W - 64 - xi) * (u - 0.35) / 0.65; py = COLECTOR_Y; }
            }
            ctx.globalAlpha = p.t > 1.45 ? (1.6 - p.t) / 0.15 : 1;
            pintarParticula(ctx, p.tipo, px, py, 2);
        }
        ctx.globalAlpha = 1;
        // Rótulos
        ctx.font = '9px Georgia, serif'; ctx.fillStyle = C.suave;
        ctx.fillText(`${M.vivas} de ${N} nefronas · FGe ≈ ${Math.round(M.fge)}`, 8, 66);
        if (e.ieca) { ctx.fillStyle = C.verde; ctx.textAlign = 'right'; ctx.fillText('IECA/ARA-II: eferente dilatada', W - 8, 66); ctx.textAlign = 'left'; }
        else if (e.isglt2) { ctx.fillStyle = C.verde; ctx.textAlign = 'right'; ctx.fillText('iSGLT2: aferente contraída', W - 8, 66); ctx.textAlign = 'left'; }
    }

    // ---------- Lecturas ----------
    const ETQ = { ficha: 'ficha', general: 'fisiología general', ilustrativo: 'ilustrativo' };
    const fuente = t => `<span class="nv-fuente ${t === 'ilustrativo' ? '' : t}">${ETQ[t]}</span>`;
    const enlace = (id, t = 'Texto ↓') => ` <button type="button" class="visual-link" data-nf-ver="${id}">${t}</button>`;
    const num = (v, d = 1) => v.toFixed(d).replace('.', ',');
    function pintarLecturas() {
        const sin = modeloNefronas({ ...e, ieca: false, isglt2: false });
        const caida = sin.fge > 0 ? (sin.fge - M.fge) / sin.fge * 100 : 0;
        const items = [
            ['FGe', `${Math.round(M.fge)} ml/min/1,73m²`, 'ilustrativo', `Categoría ${categoriaG(M.fge)} · nefronas × filtrado de cada una`, M.fge < 15 ? 'malo' : ''],
            ['Filtrado por nefrona', `×${num(M.h)}`, 'general', M.h > 1.05 ? 'Hiperfiltración de las que quedan' : 'Como el normal', M.h > 1.3 ? 'malo' : ''],
            ['Presión capilar', `${Math.round(M.pcg)} mmHg`, 'general', 'Dentro de cada glomérulo (normal 55)', M.pcg > 60 ? 'malo' : ''],
            ['K⁺ secretado por nefrona', `×${num(M.secreta)}`, 'ilustrativo', M.exceso > 1 ? 'En su techo: no puede más' : 'La ficha: las que quedan secretan más', M.exceso > 1 ? 'malo' : ''],
            ['K⁺ en sangre', `${num(M.k)} mEq/l`, 'ilustrativo', M.exceso > 1 ? 'Sube: la adaptación no alcanza' : 'Apenas cambia', M.k > 5.5 ? 'malo' : ''],
            ['FE de fosfato', `${Math.round(M.fep)}%`, 'ilustrativo', 'La ficha: 5-20% normal, 50% en ERC avanzada', ''],
        ];
        cuerpo.querySelector('.gl-medidores').innerHTML = items.map(([n, v, f, nota, tono]) => `
            <div class="nv-medidor"><div class="nv-medidor-nombre"><span>${n}</span>${fuente(f)}</div>
            <div class="nv-medidor-valor ${tono}">${v}</div><div class="nv-medidor-nota">${nota}</div></div>`).join('');
        const av = [];
        if (M.n < 1) av.push(['ok', `Quedan el ${e.nefronas}% de las nefronas y el FGe es ${Math.round(M.fge)}: las que quedan compensan parte de la pérdida.${enlace('erc-n-compensa')}`]);
        if (M.exceso <= 1) av.push(['ok', `Cada nefrona secreta ×${num(M.secreta)} K⁺ y el K⁺ en sangre apenas cambia.${enlace('erc-n-k')}`]);
        else if (e.ieca || e.dieta) av.push(['danger', `La secreción de cada nefrona ha llegado a su techo y el K⁺ sube, con un FGe de ${Math.round(M.fge)}: ${e.ieca ? 'el inhibidor del SRAA' : 'la carga de potasio'} adelanta el problema.${enlace('erc-n-k-limite')}`]);
        else av.push(['danger', `Con FGe ${Math.round(M.fge)} la secreción de cada nefrona ha llegado a su techo: cada pequeña pérdida de función sube más el K⁺.${enlace('erc-n-k')}`]);
        if (e.ieca) av.push([caida < 30 ? 'warn' : 'danger', `IECA/ARA-II: baja la presión dentro de cada glomérulo (${Math.round(M.pcg)} mmHg), con una caída del FGe del ${Math.round(caida)}%, pero reduce la capacidad de eliminar K⁺.${enlace('erc-n-pig', 'Presión ↓')}${enlace('erc-n-k-limite', 'Potasio ↓')}`]);
        if (e.isglt2) av.push(['ok', `iSGLT2: baja la presión dentro del glomérulo sin subir el K⁺.${enlace('erc-n-pig')}`]);
        if (e.dieta) av.push(['warn', `Con una carga de potasio, la capacidad de aumentar la secreción es limitada.${enlace('erc-n-k-limite')}`]);
        if (M.fep > 20) av.push(['warn', `La FE de fosfato sube al ${Math.round(M.fep)}%: menos nefronas deben excretar una porción mayor del fosfato filtrado.${enlace('erc-n-p')}`]);
        cuerpo.querySelector('.gl-avisos').innerHTML = av.map(([t, x]) => `<div class="tfg-estado tfg-estado-${t}">${x}</div>`).join('');
    }
    function actualizar() {
        M = modeloNefronas(e);
        recalcularPerdidas();
        cuerpo.querySelector('.nf-nefronas-out').textContent = `${e.nefronas}%`;
        cuerpo.querySelectorAll('[data-nf]').forEach(b => { b.classList.toggle('on', !!e[b.dataset.nf]); b.setAttribute('aria-pressed', !!e[b.dataset.nf]); });
        lienzo.setAttribute('aria-label', `Riñón con ${M.vivas} de ${N} nefronas funcionando${Object.keys(MANDOS_NEFRONAS).filter(k => e[k]).map(k => ', ' + MANDOS_NEFRONAS[k]).join('')}. FGe ${Math.round(M.fge)}, K⁺ ${num(M.k)} mEq/l.`);
        pintarLecturas(); dibujar();
    }
    // "Texto ↓": la línea puede estar en otra ficha del mismo cuaderno.
    function irA(id) {
        const el = document.getElementById(id);
        if (!el) return;
        const destino = el.closest('.tab-content');
        if (destino && destino !== tab) {
            openCorkboardTopic(destino.closest('[id^="panel-"]').id, destino.id);
            requestAnimationFrame(() => irAlTexto(destino, el));
        } else irAlTexto(tab, el);
    }
    cuerpo.addEventListener('click', ev => {
        const b = ev.target.closest('[data-nf]');
        if (b) { e[b.dataset.nf] = !e[b.dataset.nf]; actualizar(); return; }
        const ver = ev.target.closest('[data-nf-ver]');
        if (ver) irA(ver.dataset.nfVer);
    });
    cuerpo.querySelector('.nf-nefronas').addEventListener('input', ev => { e.nefronas = +ev.target.value; actualizar(); });

    recalcularPerdidas();
    for (let i = 0; i < 80; i++) paso(0.05);
    actualizar();
    let visible = false, raf = 0, ultimo = 0;
    const bucle = ts => { raf = 0; const dt = Math.min(0.05, (ts - (ultimo || ts)) / 1000); ultimo = ts; paso(dt * (reducido ? 0.4 : 1)); dibujar(); if (visible) raf = requestAnimationFrame(bucle); };
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; ultimo = 0; if (visible && !raf) raf = requestAnimationFrame(bucle); }).observe(lienzo);
}
