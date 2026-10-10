// Glomérulo vivo: la arteriola aferente, el ovillo capilar dentro de la
// cápsula de Bowman y la arteriola eferente, con la sangre circulando y el
// filtrado saliendo hacia el túbulo proximal. Lo monta cualquier ficha de
// Nefrología como panel 'propio' de su vista Visual, eligiendo qué mandos
// enseña (PAM, IECA/ARA-II, iSGLT2, depleción de volumen, AINE, estenosis de
// arteria renal, obstrucción, albuminuria) y a qué línea de la propia ficha
// lleva cada "Texto ↓".
//
// Modelo (presiones de la ficha "Filtración glomerular": capilar 55,
// Bowman 15, oncótica 30, neta 10 mmHg; TFG 125 ml/min; autorregulación
// entre 80 y 180 mmHg de PAM): la parte de la autorregulación es la misma
// que la del simulador de la ficha "Regulación del filtrado"; cuánto mueve
// cada fármaco o situación la presión capilar es ilustrativo, y así se dice.
import { irAlTexto } from '../../core/vista-visual.js';
import { CLARO, alfa } from './potasio-escena.js';
import { clamp } from '../../core/ui.js';

const W = 360, H = 300;
const B = { x: 224, y: 150, r: 78, ovillo: 50 };
const AFERENTE = [[-4, 240], [56, 230], [110, 202], [150, 172], [176, 160]];
const EFERENTE = [[176, 138], [150, 120], [110, 94], [56, 70], [-4, 60]];
const DISTAL = [[-4, 150], [70, 149], [128, 147]];
const PROXIMAL = [[300, 150], [322, 162], [344, 152], [364, 160]];
const LOBULOS = [0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2 + 0.3; return { x: B.x + Math.cos(a) * 26, y: B.y + Math.sin(a) * 26 }; }).concat([{ x: B.x, y: B.y }]);

export const MANDOS = {
    ieca: 'IECA / ARA-II',
    isglt2: 'iSGLT2',
    deplecion: 'Depleción de volumen',
    aine: 'AINE',
    estenosis: 'Estenosis de arteria renal',
    obstruccion: 'Obstrucción urinaria',
    albuminuria: 'Albuminuria (barrera dañada)',
};

// Presión capilar glomerular y resto del glomérulo para un estado dado.
function modelo(e) {
    let pa = e.pam - (e.deplecion ? 25 : 0);
    if (e.estenosis) pa *= 0.7; // bilateral o riñón único: ilustrativo
    // Autorregulación (mismo modelo que el simulador de la ficha).
    let pcg, aferente;
    if (pa >= 80 && pa <= 180) { pcg = 55; aferente = 70 - (pa - 80) / 100 * 30; }
    else if (pa < 80) { pcg = 0.6875 * pa; aferente = Math.min(85, 70 + (80 - pa) * 0.5); }
    else { pcg = 55 + (pa - 180) * 0.15; aferente = Math.max(20, 40 - (pa - 180) * 0.5); }
    const renina = pa < 90 || e.deplecion;
    let deficit = Math.max(0, 55 - pcg);
    // Angiotensina II: contrae la eferente y sostiene la presión (si no hay IECA/ARA-II).
    const angII = renina && !e.ieca;
    if (angII) { const s = Math.min(4, deficit * 0.7); pcg += s; deficit -= s; }
    // Prostaglandinas: dilatan la aferente cuando hay hipoperfusión (si no hay AINE).
    const pg = renina && !e.aine;
    if (pg) pcg += Math.min(3, deficit * 0.5);
    if (e.ieca) pcg -= 1.5;
    if (e.isglt2) pcg -= 1;
    const pb = 15 + (e.obstruccion ? 8 : 0);
    const pnf = Math.max(0, pcg - pb - 30);
    const tfg = 125 * pnf / 10;
    const eferente = 45 * (angII ? 0.75 : 1) * (e.ieca ? 1.2 : 1);
    if (e.isglt2) aferente *= 0.85;
    if (pg && pa < 80) aferente = Math.min(90, aferente * 1.06);
    const albumina = e.albuminuria ? Math.max(0, pcg - 45) / 10 : 0; // 1 = barrera dañada con presión normal
    return { pa, pcg, pb, pnf, tfg, aferente, eferente, renina, angII, pg, albumina };
}

function camino(pts, paso = 3) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / paso));
        for (let k = 0; k < n; k++) out.push([x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n]);
    }
    out.push(pts[pts.length - 1]);
    return out;
}
const RUTA_AF = camino(AFERENTE), RUTA_EF = camino(EFERENTE), RUTA_PT = camino(PROXIMAL);
const enRuta = (r, u) => r[Math.min(r.length - 1, Math.max(0, Math.floor(u * (r.length - 1))))];

// opciones: { mandos: ['pam', 'ieca', ...], inicial: { albuminuria: true, ... },
//             textos: { pam: 'id', ieca: 'id', ..., 'ieca-menos30': 'id', 'ieca-mas30': 'id' } }
export function montarGlomerulo(cuerpo, { tab }, opciones) {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const tk = v => css.getPropertyValue(v).trim();
    const C = { texto: tk('--text-main'), suave: tk('--text-muted'), verde: tk('--accent-green'), rojo: tk('--accent-red'), amarillo: tk('--accent-yellow'), oro: tk('--accent-blue'), purpura: tk('--accent-purple') };
    const e = { pam: 100, ieca: false, isglt2: false, deplecion: false, aine: false, estenosis: false, obstruccion: false, albuminuria: false, ...opciones.inicial };
    const textos = opciones.textos || {};
    const enlace = clave => textos[clave] ? ` <button type="button" class="visual-link" data-gl-ver="${textos[clave]}">Texto ↓</button>` : '';
    const toggles = opciones.mandos.filter(m => m !== 'pam');

    cuerpo.innerHTML = `
        <div class="gl-escenario"><canvas aria-label="Glomérulo animado: sangre por las arteriolas y filtrado hacia el túbulo"></canvas></div>
        ${opciones.mandos.includes('pam') ? `<div class="tfg-slider-row"><label>Presión arterial media</label><input type="range" class="gl-pam" min="40" max="220" step="5" value="${e.pam}"><span class="gl-pam-out">${e.pam} mmHg</span></div>` : ''}
        ${toggles.length ? `<div class="nv-chips gl-mandos">${toggles.map(m => `<button type="button" class="visual-mini" data-gl="${m}" aria-pressed="false">${MANDOS[m]}</button>`).join('')}</div>` : ''}
        <div class="nv-medidores gl-medidores"></div>
        <div class="hk-avisos gl-avisos"></div>
        <p class="hk-aviso-modelo">Presiones de la ficha "Filtración glomerular" (capilar 55, Bowman 15, oncótica 30, neta 10 mmHg) y autorregulación entre 80 y 180 mmHg del simulador de "Regulación del filtrado". Cuánto mueve cada fármaco o situación la presión es ilustrativo: sirve para ver el sentido del cambio, no para calcularlo.</p>`;
    const lienzo = cuerpo.querySelector('canvas'), ctx = lienzo.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = W * dpr; lienzo.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fondo = document.createElement('canvas'); fondo.width = W * dpr; fondo.height = H * dpr;
    const f = fondo.getContext('2d'); f.setTransform(dpr, 0, 0, dpr, 0, 0);
    let M = modelo(e);
    const REF = modelo({ pam: 100 });

    const trazar = (c, pts) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) c.lineTo(p[0], p[1]); c.stroke(); };
    function rotulo(c, t, x, y, color = C.suave, alinea = 'left', size = 9) {
        c.font = `${size}px Georgia, serif`; c.fillStyle = color; c.textAlign = alinea; c.fillText(t, x, y); c.textAlign = 'left';
    }
    function pastilla(c, t, x, y, color) {
        c.font = 'bold 9px Georgia, serif';
        const w = c.measureText(t).width + 8;
        c.fillStyle = 'rgba(23,20,15,.85)'; c.strokeStyle = alfa(color, 0.6); c.lineWidth = 0.8;
        c.beginPath(); c.roundRect(x - w / 2, y - 7, w, 13, 4); c.fill(); c.stroke();
        c.fillStyle = color; c.textAlign = 'center'; c.fillText(t, x, y + 3); c.textAlign = 'left';
    }
    // Arteriola con pared de músculo liso: el anillo engorda cuando se contrae.
    function arteriola(c, ruta, diam, color) {
        c.lineCap = 'round'; c.lineJoin = 'round';
        const muro = 3 + (20 - diam) * 0.25;
        c.strokeStyle = alfa(C.rojo, 0.45); c.lineWidth = diam + muro * 2; trazar(c, ruta);
        c.strokeStyle = color; c.lineWidth = diam; trazar(c, ruta);
        c.strokeStyle = alfa(CLARO.rojo, 0.5); c.lineWidth = 1;
        for (let i = 4; i < ruta.length - 2; i += 4) {
            const [x1, y1] = ruta[i - 1], [x2, y2] = ruta[i + 1], l = Math.hypot(x2 - x1, y2 - y1) || 1;
            const nx = -(y2 - y1) / l, ny = (x2 - x1) / l, [x, y] = ruta[i], r = diam / 2 + muro * 0.6;
            c.beginPath(); c.moveTo(x - nx * r, y - ny * r); c.lineTo(x - nx * (diam / 2), y - ny * (diam / 2));
            c.moveTo(x + nx * r, y + ny * r); c.lineTo(x + nx * (diam / 2), y + ny * (diam / 2)); c.stroke();
        }
    }
    const diamAf = () => 5 + M.aferente * 0.16, diamEf = () => 5 + M.eferente * 0.16;
    function pintarFondo() {
        f.clearRect(0, 0, W, H);
        f.fillStyle = '#2a1712'; f.fillRect(0, 0, W, H);
        // Túbulo distal con la mácula densa entre las dos arteriolas
        f.lineCap = 'round'; f.strokeStyle = '#c9a678'; f.lineWidth = 12; trazar(f, DISTAL);
        f.strokeStyle = 'rgba(207,154,62,.75)'; f.lineWidth = 5; trazar(f, DISTAL);
        f.fillStyle = C.verde; for (let i = 0; i < 4; i++) { f.beginPath(); f.arc(122 + i * 3, 141 + (i % 2) * 12, 3.2, 0, 7); f.fill(); }
        // Arteriolas
        arteriola(f, AFERENTE, diamAf(), '#a23d28');
        arteriola(f, EFERENTE, diamEf(), '#8f4530');
        // Células yuxtaglomerulares (renina) en la pared de la aferente
        f.fillStyle = M.renina ? CLARO.na : alfa(C.purpura, 0.6);
        for (const [x, y] of [[140, 186], [148, 180], [134, 192]]) { f.beginPath(); f.arc(x, y, 3, 0, 7); f.fill(); }
        // Cápsula de Bowman
        f.fillStyle = M.pb > 15 ? alfa(C.amarillo, 0.32) : alfa(C.amarillo, 0.16);
        f.beginPath(); f.arc(B.x, B.y, B.r, 0, 7); f.fill();
        f.strokeStyle = alfa(C.texto, 0.75); f.lineWidth = 4;
        f.beginPath(); f.arc(B.x, B.y, B.r, Math.PI + 0.25, Math.PI * 2 - 0.15); f.stroke();
        f.beginPath(); f.arc(B.x, B.y, B.r, 0.15, Math.PI - 0.25); f.stroke();
        // Túbulo proximal (y la obstrucción, si la hay)
        f.strokeStyle = '#c9a678'; f.lineWidth = 14; trazar(f, PROXIMAL);
        f.strokeStyle = alfa(C.amarillo, M.pb > 15 ? 0.9 : 0.7); f.lineWidth = 6; trazar(f, PROXIMAL);
        if (e.obstruccion) { f.fillStyle = '#3b2a1c'; f.fillRect(346, 146, 14, 20); rotulo(f, 'obstrucción', 356, 182, CLARO.rojo, 'right', 8); }
        // Ovillo capilar
        for (const l of LOBULOS) {
            f.fillStyle = '#7d3020'; f.beginPath(); f.arc(l.x, l.y, 15, 0, 7); f.fill();
            f.strokeStyle = alfa(CLARO.rojo, 0.55); f.lineWidth = 1.2; f.beginPath(); f.arc(l.x, l.y, 11, 0, 7); f.stroke();
        }
        // Podocitos sobre el ovillo
        f.fillStyle = 'rgba(205,184,154,.55)';
        for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; f.beginPath(); f.arc(B.x + Math.cos(a) * 44, B.y + Math.sin(a) * 44, 2.4, 0, 7); f.fill(); }
        // Rótulos
        rotulo(f, 'aferente', 8, 258, C.texto); rotulo(f, 'eferente', 8, 48, C.texto);
        rotulo(f, 'mácula densa', 70, 140, C.verde, 'left', 8);
        rotulo(f, 'cápsula de Bowman', B.x, B.y - B.r - 8, C.suave, 'center');
        rotulo(f, 'túbulo proximal', 358, 126, C.suave, 'right', 7.5);
        if (M.renina) rotulo(f, 'renina', 150, 232, CLARO.na, 'left', 8.5);
        if (M.angII) pastilla(f, 'Angiotensina II: contrae la eferente', 120, 22, CLARO.na);
        if (e.ieca) pastilla(f, 'IECA/ARA-II: eferente dilatada', 120, 22, C.verde);
        if (e.isglt2) pastilla(f, 'iSGLT2: aferente contraída', 104, 280, C.verde);
        else if (M.pg) pastilla(f, 'Prostaglandinas: aferente dilatada', 104, 280, C.amarillo);
        else if (e.aine && M.renina) pastilla(f, 'AINE: sin prostaglandinas', 104, 280, CLARO.rojo);
        // Presiones
        pastilla(f, `Capilar ${Math.round(M.pcg)}`, B.x, B.y - 4, C.texto);
        pastilla(f, `Bowman ${Math.round(M.pb)}`, B.x + 50, B.y + 62, C.texto);
    }

    // ---------- Partículas ----------
    let sangre = [], filtrado = [], renina = [];
    const acum = { s: 0, f: 0, a: 0, r: 0 };
    function paso(dt) {
        const flujo = clamp(M.aferente / 64, 0.4, 1.4);
        acum.s += 9 * flujo * dt; while (acum.s >= 1) { acum.s--; sangre.push({ t: 0, lob: LOBULOS[Math.floor(Math.random() * LOBULOS.length)], fase: 0, lat: Math.random() - 0.5 }); }
        acum.f += 16 * M.tfg / 125 * dt; while (acum.f >= 1) { acum.f--; const a = Math.random() * Math.PI * 2; filtrado.push({ a, t: 0, fase: 0, alb: false }); }
        acum.a += 5 * M.albumina * dt; while (acum.a >= 1) { acum.a--; const a = Math.random() * Math.PI * 2; filtrado.push({ a, t: 0, fase: 0, alb: true }); }
        if (M.renina) { acum.r += 3 * dt; while (acum.r >= 1) { acum.r--; renina.push({ x: 140 + Math.random() * 10, y: 186, t: 0 }); } }
        for (const s of sangre) {
            s.t += dt * flujo;
            if (s.fase === 0 && s.t > 1.4) { s.fase = 1; s.t = 0; }
            else if (s.fase === 1 && s.t > 1.2) { s.fase = 2; s.t = 0; }
        }
        sangre = sangre.filter(s => !(s.fase === 2 && s.t > 1.4));
        const atasco = e.obstruccion;
        for (const p of filtrado) {
            p.t += dt;
            if (p.fase === 0 && p.t > 0.8) { p.fase = 1; p.t = 0; }
            else if (p.fase === 1 && p.t > 0.9) { p.fase = 2; p.t = 0; }
            else if (p.fase === 2 && atasco && p.t > 0.85) p.t = 0.85;
        }
        filtrado = filtrado.filter(p => !(p.fase === 2 && p.t > 1.6));
        if (filtrado.length > 140) filtrado.splice(0, filtrado.length - 140);
        for (const r of renina) { r.t += dt; r.x -= 14 * dt; r.y += 10 * dt; }
        renina = renina.filter(r => r.t < 1.5);
    }
    function dibujar() {
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(fondo, 0, 0, W, H);
        ctx.fillStyle = '#d9604a';
        for (const s of sangre) {
            let x, y;
            if (s.fase === 0) { const [px, py] = enRuta(RUTA_AF, s.t / 1.4); x = px; y = py + s.lat * 3; }
            else if (s.fase === 1) { const a = s.t / 1.2 * Math.PI * 2; x = s.lob.x + Math.cos(a) * 10; y = s.lob.y + Math.sin(a) * 10; }
            else { const [px, py] = enRuta(RUTA_EF, s.t / 1.4); x = px; y = py + s.lat * 2; }
            ctx.beginPath(); ctx.ellipse(x, y, 2.6, 1.7, 0.4, 0, 7); ctx.fill();
        }
        for (const p of filtrado) {
            let x, y, al = 1;
            if (p.fase === 0) { const r = 40 + p.t / 0.8 * 22; x = B.x + Math.cos(p.a) * r; y = B.y + Math.sin(p.a) * r; al = Math.min(1, p.t * 3); }
            else if (p.fase === 1) { const u = p.t / 0.9, x0 = B.x + Math.cos(p.a) * 62, y0 = B.y + Math.sin(p.a) * 62; x = x0 + (300 - x0) * u; y = y0 + (150 - y0) * u; }
            else { const [px, py] = enRuta(RUTA_PT, p.t / 1.6); x = px; y = py; al = 1 - p.t / 1.8; }
            ctx.globalAlpha = Math.max(0, al);
            ctx.fillStyle = p.alb ? C.purpura : C.texto;
            ctx.beginPath(); ctx.arc(x, y, p.alb ? 3.2 : 1.8, 0, 7); ctx.fill();
        }
        ctx.fillStyle = CLARO.na;
        for (const r of renina) { ctx.globalAlpha = 1 - r.t / 1.5; ctx.beginPath(); ctx.arc(r.x, r.y, 1.8, 0, 7); ctx.fill(); }
        ctx.globalAlpha = 1;
    }

    // ---------- Lecturas ----------
    const fuente = ficha => `<span class="nv-fuente${ficha ? ' ficha' : ''}">${ficha ? 'ficha' : 'ilustrativo'}</span>`;
    function pintarLecturas() {
        const normal = Math.abs(M.pcg - 55) < 0.5 && M.pb === 15;
        const d = (M.tfg - REF.tfg) / REF.tfg * 100;
        // [nombre, valor, de la ficha, dirección, nota, tono (el color dice si es bueno o malo)]
        const dir = (v, ref, t) => v > ref + t ? 'sube' : v < ref - t ? 'baja' : '';
        const items = [
            ['Presión capilar', `${Math.round(M.pcg)} mmHg`, normal, dir(M.pcg, 55, 0.5), 'Dentro del ovillo glomerular', ''],
            ['Presión neta', `${M.pnf.toFixed(1).replace('.', ',')} mmHg`, normal, dir(M.pnf, 10, 0.5), `Capilar − Bowman ${Math.round(M.pb)} − oncótica 30`, M.pnf < 9.5 ? 'malo' : ''],
            ['TFG', `${Math.round(M.tfg)} ml/min`, normal, dir(d, 0, 3), Math.abs(d) < 3 ? 'Como la normal' : `${d > 0 ? '+' : ''}${Math.round(d)}% respecto a la normal`, d < -3 ? 'malo' : ''],
        ];
        if (opciones.mandos.includes('albuminuria')) items.push(['Albúmina que se escapa', e.albuminuria ? `${Math.round(M.albumina * 100)}%` : 'Nada', !e.albuminuria,
            e.albuminuria ? dir(M.albumina, 1, 0.05) : '', e.albuminuria ? 'Respecto a la barrera dañada sin tratar' : 'Barrera sana', e.albuminuria ? (M.albumina < 0.95 ? 'bueno' : 'malo') : '']);
        cuerpo.querySelector('.gl-medidores').innerHTML = items.map(([n, v, ficha, s, nota, tono]) => `
            <div class="nv-medidor"><div class="nv-medidor-nombre"><span>${n}</span>${fuente(ficha)}</div>
            <div class="nv-medidor-valor ${tono}">${s === 'sube' ? '↑ ' : s === 'baja' ? '↓ ' : ''}${v}</div><div class="nv-medidor-nota">${nota}</div></div>`).join('');
        const av = [];
        if (opciones.mandos.includes('pam')) {
            if (M.pa >= 80 && M.pa <= 180) av.push(['ok', 'Entre 80 y 180 mmHg la arteriola aferente se contrae o se dilata y la TFG apenas cambia.' + enlace('pam')]);
            else if (M.pa < 80) av.push(['danger', 'Por debajo de 80 mmHg la aferente ya está dilatada al máximo y la TFG cae.' + enlace('pam')]);
            else av.push(['warn', 'Por encima de 180 mmHg la aferente se contrae con fuerza: la TFG sube, pero poco.' + enlace('pam')]);
        }
        if (e.ieca) {
            const sin = modelo({ ...e, ieca: false }).tfg, caida = sin > 0 ? (sin - M.tfg) / sin * 100 : 0;
            if (caida < 30) av.push(['ok', `Al iniciar el IECA/ARA-II el FG baja un ${Math.round(caida)}%: menos del 30%, aceptable, continuar.` + enlace('ieca-menos30')]);
            else if (e.estenosis) av.push(['danger', `Con la estenosis, el IECA/ARA-II hace caer el FG un ${Math.round(caida)}%: es el escenario en que el bloqueo del SRAA puede reducir drásticamente el filtrado.` + enlace('ieca-mas30')]);
            else av.push(['danger', `Al iniciar el IECA/ARA-II el FG baja un ${Math.round(caida)}%: 30% o más, buscar depleción de volumen, AINE o estenosis de arteria renal antes de suspender.` + enlace('ieca-mas30')]);
        }
        if (e.isglt2) av.push(['ok', 'La retroalimentación tubuloglomerular contrae la aferente: baja la presión dentro del glomérulo.' + enlace('isglt2')]);
        if (e.estenosis) av.push(['warn', e.ieca ? 'Sin angiotensina II la eferente se relaja y la presión que sostenía el filtrado se pierde.' + enlace('estenosis') : 'Detrás de la estenosis cae la presión; la renina sube y la angiotensina II contrae la eferente para sostener el filtrado.' + enlace('estenosis')]);
        if (e.deplecion && !e.ieca) av.push(['warn', e.aine ? 'Con AINE no hay prostaglandinas que dilaten la aferente: solo queda la angiotensina II para sostener el filtrado.' + enlace('aine') : 'Con poco volumen, la angiotensina II (eferente) y las prostaglandinas (aferente) sostienen el filtrado.' + enlace('deplecion')]);
        if (e.obstruccion) av.push(['danger', 'La presión de la vía urinaria llega a la cápsula de Bowman: sube la presión que se opone a filtrar y la TFG cae.' + enlace('obstruccion')]);
        cuerpo.querySelector('.gl-avisos').innerHTML = av.map(([t, x]) => `<div class="tfg-estado tfg-estado-${t}">${x}</div>`).join('');
    }
    function actualizar() {
        M = modelo(e);
        cuerpo.querySelectorAll('[data-gl]').forEach(b => { b.classList.toggle('on', !!e[b.dataset.gl]); b.setAttribute('aria-pressed', !!e[b.dataset.gl]); });
        pintarFondo(); pintarLecturas(); dibujar();
    }
    cuerpo.addEventListener('click', ev => {
        const b = ev.target.closest('[data-gl]');
        if (b) { e[b.dataset.gl] = !e[b.dataset.gl]; actualizar(); return; }
        const ver = ev.target.closest('[data-gl-ver]');
        if (ver) irAlTexto(tab, document.getElementById(ver.dataset.glVer));
    });
    const pam = cuerpo.querySelector('.gl-pam');
    if (pam) pam.addEventListener('input', () => { e.pam = +pam.value; cuerpo.querySelector('.gl-pam-out').textContent = `${e.pam} mmHg`; actualizar(); });

    // Arranca con el dibujo ya poblado y solo anima mientras se ve.
    for (let i = 0; i < 120; i++) paso(0.05);
    actualizar();
    let visible = false, raf = 0, ultimo = 0;
    const bucle = ts => { raf = 0; const dt = Math.min(0.05, (ts - (ultimo || ts)) / 1000); ultimo = ts; paso(dt * (reducido ? 0.4 : 1)); dibujar(); if (visible) raf = requestAnimationFrame(bucle); };
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; ultimo = 0; if (visible && !raf) raf = requestAnimationFrame(bucle); }).observe(lienzo);
}
