// Vista Visual de la ficha "Hiperpotasemia" (Nefrología → Fisiología): una
// simulación del K⁺ entre plasma, célula y salidas (riñón, intestino,
// diálisis), con el corazón y su ECG, que arranca desde la causa y responde a
// cada fármaco de la tabla de tratamiento con su mecanismo y sus tiempos.
//
// Reglas (las mismas que el resto de vistas Visual de la app):
// - Una sola fuente de datos: la tabla de tratamiento de la vista Texto y la
//   simulación salen de js/data/hiperpotasemia-data.js.
// - Lo que la ficha no da (cuántos mEq/l mueve cada medida, a qué ritmo sale
//   el K⁺ en cada causa) es ILUSTRATIVO y la propia vista lo avisa.
// - Cada "Texto ↓" lleva a su línea real de la ficha (irAlTexto).
// - La animación solo corre mientras la vista Visual está en pantalla.

import { envolver } from '../../core/visual-kit.js';
import { irAlTexto } from '../../core/vista-visual.js';
import {
    tratamientoHiperpotasemia as TABLA, farmacosHiperpotasemia as FARMACOS,
    gruposHiperpotasemia as GRUPOS, causasHiperpotasemia as CAUSAS,
    magnitudesHiperpotasemia as MAG,
} from '../../data/hiperpotasemia-data.js';

const TAB_ID = 'fisio-hiperpotasemia';
const POR_MEQ = 4, K_MIN = 3.5, T_MAX = 720;
const RUTA = { diuretico: 'orina', csz: 'heces', patiromero: 'heces', dialisis: 'dial' };

const farmaco = id => FARMACOS.find(f => f.id === id);
const azar = (a, b) => a + Math.random() * (b - a);
const coma = n => n.toFixed(1).replace('.', ',');
const fmtT = m => { m = Math.round(m); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`; };

// ---------- Vista Texto: la tabla de tratamiento, desde los datos ----------
function renderTablaTratamiento() {
    const tbody = document.getElementById('hk-tto-tabla');
    if (!tbody || tbody.rows.length) return;
    tbody.innerHTML = TABLA.map(f =>
        `<tr id="hk-tto-${f.id}"><td>${f.agente}</td><td>${f.dosis}</td><td>${f.tiempo}</td><td>${f.mecanismo}</td></tr>`).join('');
}

// ---------- Marcado de la vista Visual ----------
const MARCADO = `
<p class="visual-guia">El K⁺ es una nube de puntos que vive en el plasma, en la célula o sale del cuerpo. Elige la causa, da los fármacos de la tabla y corre el reloj.</p>
<div class="hk-escenario">
  <div class="hk-campo"><label for="hk-causa">Causa</label><select id="hk-causa">${Object.entries(CAUSAS).map(([k, c]) => `<option value="${k}">${c.etiqueta}</option>`).join('')}</select></div>
  <p class="hk-causa-detalle" id="hk-causa-detalle"></p>
  <div class="hk-campo"><label for="hk-renal">Función renal</label><select id="hk-renal"><option value="ok">Conservada</option><option value="ir">Insuficiencia renal grave</option></select></div>
  <div class="hk-campo"><label for="hk-ecg-modo">ECG</label><select id="hk-ecg-modo"><option value="tipico">Cambios típicos para el K⁺ (Fig. 9)</option><option value="ninguno">Normal pese al K⁺ alto</option><option value="precoz">Cambios ya con K⁺ moderado</option></select></div>
</div>
<div class="hk-escena">
  <canvas id="hk-escena" aria-label="Simulación del potasio entre plasma, célula, corazón, analítica y vías de salida"></canvas>
  <canvas id="hk-ecg" aria-label="Electrocardiograma"></canvas>
</div>
<div class="hk-marcador">
  <div class="hk-k" id="hk-k" aria-live="polite"></div>
  <div class="hk-gravedad" id="hk-gravedad"></div>
  <div class="hk-k-real hk-fila" id="hk-k-real" hidden><span id="hk-k-real-txt"></span><button type="button" class="hk-btn hk-peq hk-primario" id="hk-repetir">Repetir la analítica</button></div>
  <div class="hk-nota hk-fila" id="hk-ecg-texto"></div>
  <div class="hk-riesgo hk-fila"><span>Riesgo cardíaco</span><div class="hk-riesgo-barra"><i id="hk-riesgo-fill"></i></div><span class="hk-riesgo-txt" id="hk-riesgo-txt"></span></div>
  <div class="hk-nota hk-fila" id="hk-reparto"></div>
</div>
<div class="hk-avisos" id="hk-avisos" aria-live="polite"></div>
<div class="hk-controles">
  <button type="button" class="hk-btn hk-primario" id="hk-play">▶ Correr el reloj</button>
  <button type="button" class="hk-btn" id="hk-rapido" aria-pressed="false">×4</button>
  <button type="button" class="hk-btn" id="hk-reiniciar">Reiniciar</button>
  <span class="hk-reloj" id="hk-reloj">0 min</span>
</div>
<div class="hk-farmacos" id="hk-farmacos"></div>
<p class="hk-aviso-modelo">Modelo didáctico. Los tiempos de inicio y duración salen de la tabla de la ficha; la ficha no dice cuántos mEq/l mueve cada medida ni a qué ritmo sale el K⁺ en cada causa, así que esas cantidades son ilustrativas. "Minutos/hora" (diálisis) y "horas" (diuréticos) no son cifras cerradas: en el modelo la diálisis empieza en unos minutos y ambos siguen mientras corre el reloj. Los puntos no están a escala: en la célula hay 150 mEq/l frente a 4 en el plasma.</p>`;

// ---------- Geometría de la escena (coordenadas lógicas 360×320) ----------
const W = 360, H = 320, EW = 360, EH = 74;
const VASO = { x: 10, y: 22, w: 282, h: 50 };
const CEL = { x: 10, y: 108, w: 228, h: 110 };
const BOMBAS = [62, 124, 186];
const ROTURAS = [93, 155];
const CORAZON = { x: 302, y: 160 };
const TUBO = { x: 326, y: 20 };
const SALIDAS = { orina: 62, heces: 180, dial: 298 };
const CANAL_X = 252, Y_REPARTO = 236, Y_ICONO = 262;

export function initHiperpotasemiaSim() {
    renderTablaTratamiento();
    const tab = document.getElementById(TAB_ID);
    if (!tab || tab.hasAttribute('data-visual')) return;
    const { texto, visual } = envolver(tab);
    let construida = false;
    const construir = () => { if (!construida) { construida = true; montar(tab, texto, visual); } };
    tab.addEventListener('vistachange', e => { if (e.detail.vista === 'visual') construir(); });
    if (tab.classList.contains('modo-visual')) construir();
}

function montar(tab, texto, visual) {
    visual.classList.add('hk');
    visual.innerHTML = MARCADO;
    const $ = id => visual.querySelector('#' + id);
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const C = {
        ink: css.getPropertyValue('--text-main').trim() || '#ece3cc',
        muted: css.getPropertyValue('--text-muted').trim() || '#a5967c',
        rojo: css.getPropertyValue('--accent-red').trim() || '#b85c3e',
        oro: css.getPropertyValue('--accent-blue').trim() || '#d4af37',
        verde: css.getPropertyValue('--accent-green').trim() || '#90a06a',
        rojoClaro: '#e08a6c', oroClaro: '#f0cf5a', verdeClaro: '#a8b97c', na: '#c882aa',
    };

    // ---------- Estado y modelo ----------
    let S, avisosPrevios = '';
    const nacidos = { acido: 0, lisis: 0, aporte: 0 };
    let P = [], FONDO = [], NA = [], HPLUS = [], TUBO_K = [];
    const trazo = new Float32Array(EW).fill(NaN);

    function actividadDosis(f, u) {
        const [a, b] = f.ini;
        const subida = b > a ? b - a : Math.max(2, a * 0.3);
        const ini0 = b > a ? a : a - subida;
        if (u < ini0) return 0;
        if (u < ini0 + subida) return (u - ini0) / subida;
        if (!f.fin) return 1;
        const [c, d] = f.fin;
        if (u <= c) return 1;
        if (u < d) return 1 - (u - c) / (d - c);
        return 0;
    }
    // Varias dosis no suman: cuenta la que más actúa en ese momento.
    const actividad = id => (S.dados[id] || []).reduce((m, td) => Math.max(m, S.t >= td ? actividadDosis(farmaco(id), S.t - td) : 0), 0);

    function modelo() {
        const c = S.c;
        const anadido = S.anadido.acido + S.anadido.lisis + S.anadido.aporte;
        const eliminado = S.eliminado.orina + S.eliminado.heces + S.eliminado.dial;
        let desplazado = MAG.desplaza.insulina * actividad('insulina') + MAG.desplaza.salbutamol * actividad('salbutamol');
        desplazado += (c.acido ? Math.min(MAG.bicarbonato.conAcidosis, S.anadido.acido) : MAG.bicarbonato.sinAcidosis) * actividad('bicarbonato');
        desplazado = Math.max(0, Math.min(desplazado, c.base + anadido - eliminado - K_MIN));
        const k = c.base + anadido - eliminado - desplazado;
        return {
            k, desplazado, eliminado,
            medido: k + (c.pseudo && !S.repetido ? c.pseudo : 0),
            calcio: actividad('calcio'),
            bomba: Math.min(1, actividad('insulina') + actividad('salbutamol')),
        };
    }

    function avanzar(dt) {
        const c = S.c;
        if (c.acido) S.anadido.acido = Math.min(c.acido, S.anadido.acido + c.acido * dt / 4);
        if (c.aporte) S.anadido.aporte = Math.min(c.aporte, S.anadido.aporte + c.aporte * dt / 15);
        if (c.lisis) S.anadido.lisis += c.lisis * dt / 60;
        if (S.renal === 'ok') S.eliminado.orina += MAG.renalBasal * Math.max(0, Math.min(1, (modelo().k - 4.5) / 0.5)) * dt / 60;
        for (const id of Object.keys(MAG.elimina)) {
            const a = actividad(id);
            if (!a) continue;
            let ef = MAG.elimina[id] * a * (dt / 60) * Math.max(0, Math.min(1, (modelo().k - K_MIN) / 0.6));
            if (id === 'diuretico' && S.renal === 'ir') ef *= MAG.diureticoEnIR;
            S.eliminado[RUTA[id]] += ef;
        }
        S.t += dt;
        S.picoDesplazado = Math.max(S.picoDesplazado, modelo().desplazado);
    }

    // ---------- ECG y gravedad (Figuras 9 y 7 de la ficha) ----------
    function rasgosECG(k) {
        if (S.ecg === 'ninguno') return { t: false, qrs: false, fv: false };
        return { t: k >= (S.ecg === 'precoz' ? 5 : 6.2), qrs: k >= 7, fv: k >= 8 };
    }
    const hayECG = r => r.t || r.qrs || r.fv;
    function gravedad(k, ecg) {
        if (k > 6.5) return ['Grave', 'grave', 3];
        if (k > 6) return ecg ? ['Grave', 'grave', 3] : ['Moderada', 'moderada', 2];
        if (k >= 5) return ecg ? ['Moderada', 'moderada', 2] : ['Ligera', 'ligera', 1];
        return ['Sin hiperpotasemia', 'ok', 0];
    }
    function textoECG(r) {
        if (S.ecg === 'ninguno') return '<strong>ECG sin cambios.</strong> La ficha avisa: baja sensibilidad, puede haber arritmias con cualquier grado.';
        if (r.fv) return '<strong>Arritmia ventricular</strong> (taquicardia, fibrilación) → paro cardíaco. Figura 9: &gt;8 mEq/l.';
        if (r.qrs) return '<strong>↑PR, se pierde la onda P, ↑QRS</strong>, con T picudas. Figura 9: &gt;7 mEq/l.';
        if (r.t) return S.ecg === 'precoz' ? '<strong>Ondas T picudas</strong> con un K⁺ por debajo de lo típico: el ECG no sigue al número.' : '<strong>Ondas T picudas.</strong> Figura 9: ≈6,5 mEq/l.';
        return 'Sin cambios típicos. Baja sensibilidad: no descarta riesgo.';
    }

    // ---------- Partículas ----------
    const puntoPlasma = () => ({ x: azar(VASO.x + 18, VASO.x + VASO.w - 16), y: azar(VASO.y + 20, VASO.y + VASO.h - 7) });
    const puntoCelula = () => ({ x: azar(CEL.x + 16, CEL.x + CEL.w - 16), y: azar(CEL.y + 44, CEL.y + CEL.h - 24) });
    const puntoSalida = r => ({ x: SALIDAS[r] + azar(-22, 22), y: Y_ICONO + azar(18, 32) });

    function crearParticulas() {
        P = []; NA = []; HPLUS = [];
        nacidos.acido = nacidos.lisis = nacidos.aporte = 0;
        for (let i = 0, n = Math.round(S.c.base * POR_MEQ); i < n; i++) P.push({ cat: 'plasma', ...puntoPlasma(), ruta: [], vx: azar(0.15, 0.45) });
        FONDO = Array.from({ length: 70 }, () => ({ ...puntoCelula(), fase: Math.random() * 6.28 }));
        TUBO_K = Array.from({ length: S.c.pseudo ? 10 : 0 }, () => ({ x: TUBO.x + azar(-4, 4), y: TUBO.y + azar(18, 42), fase: Math.random() * 6.28 }));
    }
    function nacer(fuente) {
        if (fuente === 'aporte') {
            const x = VASO.x + 30 + azar(-8, 8);
            P.push({ cat: 'plasma', x, y: 2, ruta: [{ x, y: VASO.y + 10 }, puntoPlasma()], vx: azar(0.15, 0.45), fuente });
        } else {
            const gx = ROTURAS[Math.floor(Math.random() * 2)], p = puntoCelula();
            P.push({ cat: 'plasma', ...p, ruta: [{ x: gx, y: CEL.y + 2 }, { x: gx, y: VASO.y + VASO.h - 4 }, puntoPlasma()], vx: azar(0.15, 0.45), fuente });
        }
    }
    const cuenta = cat => P.filter(p => p.cat === cat).length;
    function mover(p, cat) {
        const desde = p.x;
        p.cat = cat;
        if (cat === 'celula') {
            const bx = BOMBAS.reduce((m, b) => Math.abs(b - desde) < Math.abs(m - desde) ? b : m);
            p.ruta = [{ x: bx, y: VASO.y + VASO.h + 4 }, { x: bx, y: CEL.y }, puntoCelula()];
        } else if (cat === 'plasma') {
            const gx = ROTURAS[Math.floor(Math.random() * 2)];
            p.ruta = [{ x: gx, y: CEL.y + 4 }, { x: gx, y: VASO.y + VASO.h - 4 }, puntoPlasma()];
        } else {
            p.ruta = [{ x: CANAL_X, y: VASO.y + VASO.h }, { x: CANAL_X, y: Y_REPARTO }, { x: SALIDAS[cat], y: Y_REPARTO }, puntoSalida(cat)];
        }
    }
    function cuadrar(m) {
        for (const f of ['acido', 'lisis', 'aporte']) {
            while (nacidos[f] < Math.round(S.anadido[f] * POR_MEQ)) { nacer(f); nacidos[f]++; }
        }
        const quiero = { celula: Math.round(m.desplazado * POR_MEQ) };
        for (const r of ['orina', 'heces', 'dial']) quiero[r] = Math.round(S.eliminado[r] * POR_MEQ);
        for (const cat of ['orina', 'heces', 'dial', 'celula']) {
            for (let falta = quiero[cat] - cuenta(cat); falta > 0; falta--) {
                const libres = P.filter(p => p.cat === 'plasma' && !p.ruta.length);
                const p = libres[Math.floor(Math.random() * libres.length)] || P.find(q => q.cat === 'plasma');
                if (!p) break;
                mover(p, cat);
            }
        }
        for (let sobra = cuenta('celula') - quiero.celula; sobra > 0; sobra--) mover(P.find(q => q.cat === 'celula'), 'plasma');
    }

    // ---------- Dibujo ----------
    const cv = $('hk-escena'), ctx = cv.getContext('2d');
    const ecv = $('hk-ecg'), ectx = ecv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ecv.width = EW * dpr; ecv.height = EH * dpr; ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
    function rotulo(txt, x, y, color = C.muted, size = 9.5, align = 'left', peso = '') {
        ctx.fillStyle = color; ctx.font = `${peso} ${size}px Georgia, serif`; ctx.textAlign = align; ctx.fillText(txt, x, y);
    }
    let giroBomba = 0, reloj = 0, barrido = 0;

    function dibujar(m, nivel) {
        const c = S.c;
        ctx.clearRect(0, 0, W, H);
        if (c.aporte) rotulo(S.anadido.aporte < c.aporte ? 'Aporte oral/IV ↓' : 'Aporte oral/IV', VASO.x + 46, 13, S.anadido.aporte < c.aporte ? C.ink : C.muted);
        // plasma
        rr(VASO.x, VASO.y, VASO.w, VASO.h, 24); ctx.fillStyle = 'rgba(184,92,62,0.13)'; ctx.fill();
        ctx.strokeStyle = 'rgba(184,92,62,0.55)'; ctx.lineWidth = 1.2; ctx.stroke();
        rotulo('PLASMA · ≈4 mEq/l normal · 2% del K⁺', VASO.x + 16, VASO.y + 14, C.muted, 9);
        dibujarTubo(m);
        // célula
        rr(CEL.x, CEL.y, CEL.w, CEL.h, 16); ctx.fillStyle = 'rgba(212,175,55,0.06)'; ctx.fill();
        ctx.strokeStyle = 'rgba(212,175,55,0.5)'; ctx.lineWidth = 2; ctx.stroke();
        rotulo('CÉLULA · 150 mEq/l · 98% del K⁺', CEL.x + 12, CEL.y + CEL.h - 9, C.muted, 9);
        if (c.lisis || c.acido) for (const gx of ROTURAS) {
            ctx.strokeStyle = C.rojoClaro; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(gx - 7, CEL.y - 3); ctx.lineTo(gx - 3, CEL.y + 3); ctx.lineTo(gx + 1, CEL.y - 3); ctx.lineTo(gx + 5, CEL.y + 3); ctx.stroke();
        }
        // canal y salidas
        ctx.strokeStyle = 'rgba(144,160,106,0.3)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(CANAL_X, VASO.y + VASO.h - 2); ctx.lineTo(CANAL_X, Y_REPARTO);
        ctx.moveTo(SALIDAS.orina, Y_REPARTO); ctx.lineTo(SALIDAS.dial, Y_REPARTO);
        for (const x of Object.values(SALIDAS)) { ctx.moveTo(x, Y_REPARTO); ctx.lineTo(x, Y_ICONO - 12); }
        ctx.stroke(); ctx.lineCap = 'butt';
        const ir = S.renal === 'ir';
        dibujarRinon(SALIDAS.orina, Y_ICONO, Math.max(ir ? 0 : 0.5, actividad('diuretico') * (ir ? MAG.diureticoEnIR : 1)), ir);
        dibujarIntestino(SALIDAS.heces, Y_ICONO, Math.max(actividad('csz'), actividad('patiromero')));
        dibujarDializador(SALIDAS.dial, Y_ICONO, actividad('dialisis'));
        rotulo(ir ? 'Orina (IR grave)' : 'Orina', SALIDAS.orina, 314, C.muted, 9.5, 'center');
        rotulo('Heces', SALIDAS.heces, 314, C.muted, 9.5, 'center');
        rotulo('Diálisis', SALIDAS.dial, 314, C.muted, 9.5, 'center');
        // K⁺ intracelular de fondo (el 98%)
        ctx.fillStyle = 'rgba(212,175,55,0.3)';
        for (const f of FONDO) { ctx.beginPath(); ctx.arc(f.x + Math.sin(reloj * 0.6 + f.fase) * 1.2, f.y + Math.cos(reloj * 0.5 + f.fase) * 1.2, 2, 0, 6.29); ctx.fill(); }
        // bombas Na⁺/K⁺
        const activa = m.bomba > 0.05, vel = 0.4 + 3.2 * m.bomba;
        if (!reducido) giroBomba += 0.03 * vel;
        BOMBAS.forEach((bx, i) => {
            ctx.save(); ctx.translate(bx, CEL.y);
            if (activa) { ctx.shadowColor = C.oro; ctx.shadowBlur = 8 * m.bomba; }
            rr(-9, -8, 18, 16, 5); ctx.fillStyle = activa ? '#5a4a1f' : '#3a3122'; ctx.fill();
            ctx.strokeStyle = C.oro; ctx.lineWidth = 1; ctx.stroke(); ctx.shadowBlur = 0;
            ctx.rotate(giroBomba + i); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, 4.4); ctx.stroke();
            ctx.restore();
            if (activa && !reducido && Math.random() < 0.03 * vel) NA.push({ x: bx + azar(-4, 4), y: CEL.y - 8, vy: -azar(0.4, 0.8), vida: 1 });
        });
        NA = NA.filter(n => (n.vida -= 0.02) > 0);
        for (const n of NA) { n.y += n.vy; ctx.globalAlpha = n.vida; ctx.fillStyle = C.na; ctx.beginPath(); ctx.arc(n.x, n.y, 1.7, 0, 6.29); ctx.fill(); }
        ctx.globalAlpha = 1;
        if (activa) BOMBAS.forEach(bx => rotulo('Na⁺↑', bx + 12, CEL.y - 12, C.na, 8.5));
        rotulo(activa ? 'Bomba Na⁺/K⁺ acelerada: salen 3 Na⁺, entran 2 K⁺' : 'Bomba Na⁺/K⁺ a ritmo basal', CEL.x + 12, CEL.y + 20, activa ? C.ink : C.muted);
        // acidosis y lisis
        if (c.acido) {
            const bicarb = actividad('bicarbonato');
            if (!reducido && Math.random() < 0.1 * (1 - bicarb)) HPLUS.push({ x: azar(CEL.x + 30, CEL.x + CEL.w - 30), y: VASO.y + VASO.h - 2, vida: 1 });
            rotulo(bicarb > 0.5 ? 'Bicarbonato: sale H⁺, vuelve a entrar K⁺' : 'Acidosis: entra H⁺ y sale K⁺', CEL.x + 12, CEL.y + 34, C.rojoClaro);
        }
        if (c.lisis) rotulo('Lisis: la célula rota suelta K⁺', CEL.x + 12, CEL.y + 34, C.rojoClaro);
        HPLUS = HPLUS.filter(h => (h.vida -= 0.012) > 0);
        for (const h of HPLUS) { h.y += 0.7; ctx.globalAlpha = h.vida; rotulo('H⁺', h.x, h.y, C.rojoClaro, 8, 'center'); }
        ctx.globalAlpha = 1;
        // K⁺
        for (const p of P) {
            if (p.ruta.length) {
                const d = p.ruta[0], dx = d.x - p.x, dy = d.y - p.y, dist = Math.hypot(dx, dy), v = reducido ? 999 : 2.2;
                if (dist <= v) { p.x = d.x; p.y = d.y; p.ruta.shift(); } else { p.x += dx / dist * v; p.y += dy / dist * v; }
            } else if (p.cat === 'plasma' && !reducido) {
                p.x += p.vx; if (p.x > VASO.x + VASO.w - 14) p.x = VASO.x + 14;
            }
            const recien = p.fuente && p.cat === 'plasma' && p.ruta.length;
            ctx.fillStyle = p.cat === 'celula' ? C.oroClaro : p.cat === 'plasma' ? (recien ? C.rojoClaro : C.ink) : C.verdeClaro;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.cat === 'celula' ? 3.2 : p.cat === 'plasma' ? 2.8 : 2.4, 0, 6.29); ctx.fill();
            if (p.cat === 'celula') { ctx.strokeStyle = 'rgba(240,207,90,0.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 5.5, 0, 6.29); ctx.stroke(); }
        }
        dibujarCorazon(m, nivel);
    }
    function dibujarTubo(m) {
        const { x, y } = TUBO, hemolisis = S.c.pseudo && !S.repetido;
        ctx.strokeStyle = C.muted; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 8, y + 40); ctx.arc(x, y + 40, 8, Math.PI, 0, true); ctx.lineTo(x + 8, y); ctx.stroke();
        ctx.fillStyle = hemolisis ? 'rgba(184,92,62,0.55)' : 'rgba(184,92,62,0.25)';
        ctx.beginPath(); ctx.moveTo(x - 7, y + 14); ctx.lineTo(x - 7, y + 40); ctx.arc(x, y + 40, 7, Math.PI, 0, true); ctx.lineTo(x + 7, y + 14); ctx.fill();
        if (hemolisis) {
            ctx.fillStyle = C.rojoClaro;
            for (const k of TUBO_K) { ctx.beginPath(); ctx.arc(k.x + Math.sin(reloj + k.fase), k.y, 1.8, 0, 6.29); ctx.fill(); }
            rotulo('hemolizada', x, y + 62, C.rojoClaro, 8.5, 'center');
        }
        rotulo('Analítica', x, y + 74, C.muted, 9, 'center');
        rotulo(coma(m.medido), x, y + 86, hemolisis ? C.rojoClaro : C.ink, 10, 'center', 'bold');
    }
    function dibujarCorazon(m, nivel) {
        const { x, y } = CORAZON, latido = 1 + 0.05 * Math.max(0, Math.sin(reloj * 7));
        ctx.save(); ctx.translate(x, y); ctx.scale(latido, latido);
        ctx.beginPath(); ctx.moveTo(0, 24); ctx.bezierCurveTo(-32, 4, -24, -24, 0, -11); ctx.bezierCurveTo(24, -24, 32, 4, 0, 24);
        ctx.fillStyle = `rgba(184,92,62,${0.3 + 0.55 * (nivel / 3) * (1 - 0.6 * m.calcio)})`; ctx.fill();
        ctx.strokeStyle = C.rojo; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
        if (m.calcio > 0.02) {
            ctx.save(); ctx.globalAlpha = m.calcio;
            ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.lineDashOffset = -reloj * 8;
            ctx.beginPath(); ctx.arc(x, y + 2, 36, 0, 6.29); ctx.stroke();
            ctx.restore();
            rotulo('Ca²⁺', x + 34, y - 30, C.ink, 9.5, 'center', 'bold');
        }
        rotulo('Corazón', x, y + 50, C.muted, 9.5, 'center');
        if (m.calcio > 0.3) rotulo('membrana protegida', x, y + 62, C.ink, 9, 'center');
    }
    const brillo = a => { if (a > 0.05) { ctx.shadowColor = C.verde; ctx.shadowBlur = 10 * a; } };
    function dibujarRinon(x, y, a, cerrado) {
        ctx.save(); brillo(a);
        ctx.beginPath(); ctx.moveTo(x + 2, y - 11);
        ctx.bezierCurveTo(x - 18, y - 14, x - 18, y + 14, x + 2, y + 11);
        ctx.bezierCurveTo(x + 8, y + 9, x + 4, y + 3, x + 7, y);
        ctx.bezierCurveTo(x + 4, y - 3, x + 8, y - 9, x + 2, y - 11);
        ctx.fillStyle = a > 0.05 ? '#6b7a48' : '#3d4230'; ctx.fill();
        ctx.restore();
        if (cerrado) { ctx.strokeStyle = C.rojoClaro; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 8, y - 8); ctx.lineTo(x + 6, y + 8); ctx.moveTo(x + 6, y - 8); ctx.lineTo(x - 8, y + 8); ctx.stroke(); }
    }
    function dibujarIntestino(x, y, a) {
        ctx.save(); brillo(a); ctx.strokeStyle = a > 0.05 ? C.verde : '#4d5338'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 16, y - 6); ctx.bezierCurveTo(x - 4, y - 14, x + 4, y + 2, x + 16, y - 6);
        ctx.moveTo(x - 16, y + 4); ctx.bezierCurveTo(x - 4, y - 4, x + 4, y + 12, x + 16, y + 4); ctx.stroke(); ctx.restore();
    }
    function dibujarDializador(x, y, a) {
        ctx.save(); brillo(a);
        rr(x - 8, y - 12, 16, 24, 5); ctx.fillStyle = a > 0.05 ? '#55603b' : '#33382a'; ctx.fill();
        ctx.strokeStyle = C.verde; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
        ctx.strokeStyle = 'rgba(236,227,204,0.4)'; ctx.lineWidth = 1;
        for (let i = -4; i <= 4; i += 4) { ctx.beginPath(); ctx.moveTo(x + i, y - 9); ctx.lineTo(x + i, y + 9); ctx.stroke(); }
    }
    const gauss = (u, c, w) => Math.exp(-((u - c) ** 2) / (2 * w * w));
    function latido(u, r) {
        if (r.fv) return 0.55 * Math.sin(u * 6.28 * 2.2) + 0.25 * Math.sin(u * 6.28 * 5.3 + 1);
        const qrsW = r.qrs ? 2.2 : 1, q = 0.32 + (r.qrs ? 0.04 : 0);
        return (r.qrs ? 0 : 0.13) * gauss(u, 0.16, 0.025) - 0.1 * gauss(u, q - 0.025 * qrsW, 0.008 * qrsW) + gauss(u, q, 0.011 * qrsW)
            - 0.25 * gauss(u, q + 0.03 * qrsW, 0.01 * qrsW) + (r.t ? 0.8 : 0.26) * gauss(u, 0.62, r.t ? 0.026 : 0.055);
    }
    function dibujarECG(r) {
        if (!reducido) {
            for (let i = 0; i < 3; i++) {
                const col = Math.floor(barrido) % EW;
                trazo[col] = latido((barrido % 120) / 120, r);
                for (let j = 1; j < 12; j++) trazo[(col + j) % EW] = NaN;
                barrido += 1;
            }
        } else for (let c = 0; c < EW; c++) trazo[c] = latido((c % 120) / 120, r);
        ectx.clearRect(0, 0, EW, EH);
        ectx.strokeStyle = 'rgba(144,160,106,0.12)'; ectx.lineWidth = 1;
        for (let x = 0; x < EW; x += 15) { ectx.beginPath(); ectx.moveTo(x, 0); ectx.lineTo(x, EH); ectx.stroke(); }
        ectx.strokeStyle = C.verdeClaro; ectx.lineWidth = 1.6; ectx.beginPath();
        let abierto = false;
        for (let c = 0; c < EW; c++) {
            if (Number.isNaN(trazo[c])) { abierto = false; continue; }
            const y = 50 - trazo[c] * 32;
            if (abierto) ectx.lineTo(c, y); else { ectx.moveTo(c, y); abierto = true; }
        }
        ectx.stroke();
        ectx.fillStyle = C.muted; ectx.font = '9px Georgia, serif'; ectx.textAlign = 'left'; ectx.fillText('ECG', 6, 12);
    }

    // ---------- Avisos (frases de la propia ficha) ----------
    function avisos(m, r, nivel) {
        const a = [], c = S.c, dado = id => (S.dados[id] || []).length > 0;
        if (c.pseudo && !S.repetido) a.push(['alarma', 'Antes de tratar, confirma con una nueva analítica: una muestra hemolizada da un K⁺ falsamente alto.']);
        if (c.pseudo && Object.keys(S.dados).length) a.push(['alarma', 'El K⁺ real del paciente es normal: tratar baja un potasio que no estaba alto.']);
        if (hayECG(r) && !dado('calcio')) a.push(['alarma', 'Hay cambios en el ECG: la ficha pone el gluconato cálcico como primera medida.']);
        if (hayECG(r) && dado('calcio') && m.calcio === 0) a.push(['alarma', 'El efecto del calcio (30-60 min) ya ha pasado y el ECG sigue alterado. Puedes repetir la dosis.']);
        if (S.ecg === 'ninguno' && nivel === 3) a.push(['', 'ECG normal con K⁺ grave: la gravedad sigue siendo grave (Figura 7).']);
        if (m.k > 6 && !c.pseudo) a.push(['', 'K⁺ &gt;6 mmol/l: monitorización ECG aunque no haya cambios típicos.']);
        if (dado('salbutamol') && !dado('insulina')) a.push(['', 'La monoterapia con β-agonistas falla en el 20-40% de los pacientes; con insulina-glucosa es más eficaz.']);
        if (S.picoDesplazado > 0.3 && m.desplazado < S.picoDesplazado - 0.25 && m.eliminado < 0.5) a.push(['alarma', 'El K⁺ vuelve a subir: meterlo en la célula no lo saca del cuerpo.']);
        if (dado('bicarbonato') && !c.acido) a.push(['', 'Sin acidosis el bicarbonato aporta poco: la ficha lo reserva para la acidosis metabólica concomitante.']);
        if (dado('diuretico') && S.renal === 'ir') a.push(['', 'Con insuficiencia renal grave el diurético apenas saca K⁺: la hemodiálisis es el método más rápido y seguro en IR grave.']);
        if (dado('dialisis')) a.push(['', 'Diálisis con baños sin glucosa, para no estimular la liberación de insulina.']);
        if (c.aporte && S.renal === 'ok' && S.t > 30) a.push(['', 'Con el riñón conservado, el K⁺ del aporte se va por la orina: la ficha dice que el aporte solo es relevante si hay insuficiencia renal.']);
        if (c.lisis && S.t > 120 && m.eliminado < 0.5) a.push(['', 'La célula sigue soltando K⁺: hace falta sacarlo del cuerpo, no solo desplazarlo.']);
        return a;
    }

    // ---------- Lecturas ----------
    function estadoTexto(f) {
        const dosis = S.dados[f.id] || [];
        if (!dosis.length) return '';
        const td = dosis[dosis.length - 1], u = S.t - td, a = actividad(f.id);
        const veces = dosis.length > 1 ? ` (${dosis.length}ª dosis)` : '';
        const empieza = f.ini[0] >= 60 ? fmtT(f.ini[0]) : `${f.ini[0]}${f.ini[1] > f.ini[0] ? '-' + f.ini[1] : ''} min`;
        if (u < f.ini[0] && a === 0) return `Dado a los ${fmtT(td)}${veces}. Empieza a los ${empieza}.`;
        if (a === 0) return `Dado a los ${fmtT(td)}${veces}. Efecto terminado.`;
        if (f.fin && u > f.fin[0]) return `Actuando, pero se está acabando (${Math.round(a * 100)}%).`;
        return `Actuando (${Math.round(a * 100)}%)${veces}.`;
    }
    function leer(m, r) {
        const [g, cls, nivel] = gravedad(m.k, hayECG(r));
        const pendiente = S.c.pseudo && !S.repetido;
        $('hk-k').innerHTML = `${coma(m.medido)} <small>mEq/l en la analítica</small>`;
        $('hk-gravedad').textContent = pendiente ? 'Sin confirmar' : g;
        $('hk-gravedad').className = 'hk-gravedad hk-g-' + (pendiente ? 'pendiente' : cls);
        $('hk-k-real').hidden = !S.c.pseudo;
        if (S.c.pseudo) {
            $('hk-k-real-txt').textContent = S.repetido ? `Analítica repetida: el K⁺ real es ${coma(m.k)}.` : 'El K⁺ que circula en el plasma es otro.';
            $('hk-repetir').hidden = S.repetido;
        }
        $('hk-ecg-texto').innerHTML = textoECG(r);
        const protegido = m.calcio > 0.3 && nivel > 0;
        const fill = $('hk-riesgo-fill');
        fill.style.width = [8, 33, 66, 100][nivel] + '%';
        fill.className = protegido ? 'protegido' : 'nivel-' + nivel;
        $('hk-riesgo-txt').textContent = pendiente ? 'Pendiente de confirmar: el K⁺ de la analítica puede ser falso.'
            : protegido ? `Membrana protegida por el calcio. El K⁺ y la gravedad (${g.toLowerCase()}) no han cambiado.`
            : `Según la gravedad de la Figura 7: ${g.toLowerCase()}.`;
        const e = S.eliminado;
        $('hk-reparto').textContent = `En la célula, de forma temporal: ${coma(m.desplazado)} · Fuera del cuerpo: ${coma(m.eliminado)} (orina ${coma(e.orina)}, heces ${coma(e.heces)}, diálisis ${coma(e.dial)})`;
        $('hk-reloj').textContent = fmtT(S.t);
        const html = avisos(m, r, nivel).map(([t, x]) => `<div class="hk-aviso ${t}">${x}</div>`).join('');
        if (html !== avisosPrevios) { $('hk-avisos').innerHTML = html; avisosPrevios = html; }
        for (const f of FARMACOS) {
            $('hk-estado-' + f.id).textContent = estadoTexto(f);
            const b = $('hk-dar-' + f.id), dosis = S.dados[f.id] || [];
            const enCurso = actividad(f.id) > 0 || (dosis.length && S.t - dosis[dosis.length - 1] < f.ini[1]);
            const [txt, off] = !dosis.length ? ['Dar', false] : f.repetible && !enCurso ? ['Repetir', false] : ['Dado', true];
            if (b.textContent !== txt) b.textContent = txt;
            b.disabled = off;
        }
        return nivel;
    }

    // ---------- Fármacos ----------
    $('hk-farmacos').innerHTML = Object.entries(GRUPOS).map(([g, info]) =>
        `<p class="hk-grupo">${info.rotulo}</p>` + FARMACOS.filter(f => f.grupo === g).map(f => {
            const fila = TABLA.find(t => t.id === f.fila);
            return `<div class="hk-farmaco"><span class="hk-tira" style="background:${info.color}"></span>
                <div><div class="hk-nombre">${f.nombre}</div>
                    <div class="hk-meta">${f.tiempo || 'Inicio/duración: ' + fila.tiempo}</div>
                    ${f.fidelidad ? `<div class="hk-fidelidad">${f.fidelidad}</div>` : ''}
                    <div class="hk-estado" id="hk-estado-${f.id}"></div></div>
                <div class="hk-acciones"><button type="button" class="hk-btn hk-dar" id="hk-dar-${f.id}" data-dar="${f.id}">Dar</button>
                    <button type="button" class="hk-link" data-ver="hk-tto-${f.fila}${f.extra ? ',' + f.extra : ''}" aria-label="Ver ${f.nombre} en el texto">Texto ↓</button></div></div>`;
        }).join('')).join('');

    // ---------- Reinicio, controles y bucle ----------
    function reiniciar(desdeCausa) {
        const c = CAUSAS[$('hk-causa').value];
        if (desdeCausa) $('hk-renal').value = c.renal;
        S = {
            c, renal: $('hk-renal').value, ecg: $('hk-ecg-modo').value, t: 0, corriendo: false, dados: {}, repetido: false,
            anadido: { acido: 0, lisis: 0, aporte: 0 }, eliminado: { orina: 0, heces: 0, dial: 0 }, picoDesplazado: 0,
        };
        $('hk-causa-detalle').innerHTML = `${c.texto} <button type="button" class="hk-link" data-ver="${c.fuente}">Texto ↓</button>`;
        crearParticulas();
        trazo.fill(NaN);
        $('hk-play').textContent = '▶ Correr el reloj';
        avisosPrevios = '';
        paso();
    }
    let rapido = false;
    $('hk-play').addEventListener('click', () => {
        if (S.t >= T_MAX) return;
        S.corriendo = !S.corriendo;
        $('hk-play').textContent = S.corriendo ? '❚❚ Pausar' : '▶ Correr el reloj';
    });
    $('hk-rapido').addEventListener('click', () => {
        rapido = !rapido;
        $('hk-rapido').setAttribute('aria-pressed', String(rapido));
        $('hk-rapido').classList.toggle('hk-primario', rapido);
    });
    $('hk-reiniciar').addEventListener('click', () => reiniciar(false));
    $('hk-causa').addEventListener('change', () => reiniciar(true));
    $('hk-renal').addEventListener('change', () => { S.renal = $('hk-renal').value; });
    $('hk-ecg-modo').addEventListener('change', () => { S.ecg = $('hk-ecg-modo').value; });
    $('hk-repetir').addEventListener('click', () => { S.repetido = true; paso(); });
    visual.addEventListener('click', e => {
        const dar = e.target.closest('[data-dar]');
        if (dar && !dar.disabled) { (S.dados[dar.dataset.dar] ||= []).push(S.t); paso(); return; }
        const ver = e.target.closest('[data-ver]');
        if (!ver) return;
        const els = ver.dataset.ver.split(',').map(id => texto.querySelector('#' + id)).filter(Boolean);
        irAlTexto(tab, els[0]);
        // Si hay una segunda línea relacionada (p. ej. la tabla de quelantes), también se resalta.
        els.slice(1).forEach(el => { el.classList.add('vista-resaltado'); setTimeout(() => el.classList.remove('vista-resaltado'), 2200); });
    });

    // Un fotograma: avanza el reloj (si corre), recoloca partículas, dibuja y lee.
    let previo = 0;
    function paso(ahora = performance.now()) {
        const dt = previo ? Math.min(0.1, Math.max(0, (ahora - previo) / 1000)) : 0;
        previo = ahora;
        reloj += dt;
        if (S.corriendo) {
            const sub = (1.5 + S.t / 18) * (rapido ? 4 : 1) * dt / 4;
            for (let i = 0; i < 4 && S.t < T_MAX; i++) avanzar(sub);
            if (S.t >= T_MAX) { S.t = T_MAX; S.corriendo = false; $('hk-play').textContent = 'Fin del reloj (12 h)'; }
        }
        const m = modelo();
        cuadrar(m);
        const r = rasgosECG(m.k);
        const nivel = leer(m, r);
        dibujar(m, nivel);
        dibujarECG(r);
    }
    // La animación solo corre mientras alguna parte de la vista Visual está en
    // pantalla (la ficha vive en el DOM aunque esté oculta, como todas las de
    // la app). Se observa el bloque entero, no solo el dibujo: así el reloj
    // sigue corriendo al bajar a pulsar los fármacos.
    let visible = false, raf = 0;
    const bucle = t => { paso(t); raf = visible ? requestAnimationFrame(bucle) : 0; };
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) { previo = 0; raf = requestAnimationFrame(bucle); }
    }).observe(visual);

    reiniciar(true);
}
