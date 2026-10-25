// Filtro vivo: una fibra del filtro de la TRR vista por dentro. La sangre
// entra por la izquierda y vuelve al paciente por la derecha; la membrana
// separa la sangre del compartimento del dializado/ultrafiltrado, que sale
// como efluente. Lo monta la vista Visual de las fichas de TRR como panel
// 'propio', eligiendo qué mandos enseña:
//   modo      Difusión (HD intermitente) / Convección (TRR continua) / Híbrida
//   dosis     flujo del efluente (ml/kg/h)
//   reposicion prefiltro / posfiltro (solo con convección)
//   qb        flujo sanguíneo
//   anticoag  ninguna / heparina / citrato
//
// De la ficha (Valdenebro et al., trr.html): HD = aclaramiento difusivo rápido
// de moléculas pequeñas (3-5 h); TRR continua = convectivo, gradual, también
// moléculas de mayor tamaño (hasta 24 h/día); híbridas 8-16 h; dosis >25
// ml/kg/h asociada a supervivencia solo en observacionales, ningún ensayo con
// beneficio de dosis mayores, ni siquiera hasta 70 ml/kg/h, y riesgo de
// "dialitrauma" y pérdida de citoquinas; la coagulación del circuito es la
// complicación técnica más común, y se reduce subiendo el flujo sanguíneo,
// bajando la fracción de filtración y alternando la reposición pre/posfiltro;
// la heparina anticoagula al paciente, el citrato solo el circuito (Ca iónico
// <0,35 mmol/l, con citrato a 4-6 mmol/l, e infusión de calcio para el
// paciente). La fracción de filtración, el ritmo al que se coagula el filtro
// y cuántas partículas cruzan son ilustrativos, y así se dice.
import { irAlTexto } from '../../core/vista-visual.js';
import { CLARO, alfa } from './potasio-escena.js';
import { clamp } from '../../core/ui.js';
import { pintarFormula } from '../../core/formula.js';
import { pintarParticula, colorParticula, leyendaParticulas } from '../../core/particulas.js';

const W = 360, H = 300;
const FIB = { x0: 44, x1: 316, y0: 128, y1: 172 };           // luz de la fibra (sangre)
const CAJA = { x0: 34, x1: 326, y0: 86, y1: 214 };           // carcasa del filtro
const DREN = 104;                                            // salida del efluente
const PESO = 70, HTO = 0.3;                                  // kg y hematocrito (ilustrativos)

const MODOS = {
    hd: { nombre: 'Difusión (HD intermitente)', dif: 1, conv: 0, texto: 'trr-t-hd' },
    hf: { nombre: 'Convección (TRR continua)', dif: 0, conv: 1, texto: 'trr-t-cont' },
    hib: { nombre: 'Híbrida (SLED/PIRRT)', dif: 0.6, conv: 0.5, texto: 'trr-t-hib' },
};
const ANTICOAG = { no: 'Sin anticoagulación', heparina: 'Heparina', citrato: 'Citrato' };
// Partículas de la sangre: cuánto cruzan por difusión y por convección
// (relativo). `r` = radio de dibujo; la forma y el color, de la tabla única
// (js/data/formas-iones.js).
const TIPOS = {
    rbc: { tasa: 7, dif: 0, conv: 0, r: 1.95 },
    alb: { tasa: 1.4, dif: 0, conv: 0, r: 2.1 },
    urea: { tasa: 7, dif: 1.8, conv: 1, r: 1.6 },
    k: { tasa: 2.5, dif: 1.5, conv: 1, r: 2 },
    cito: { tasa: 2.2, dif: 0.08, conv: 0.85, r: 2.4 },
    ca: { tasa: 2.5, dif: 0, conv: 0, r: 1.9 },
};
// Lo que no viene de la sangre: el agua (ultrafiltrado y reposición) y el Ca²⁺ unido al citrato.
const RADIO_EXTRA = { agua: 1.7, cit: 1.9 };
const CLAVE = { cit: 'citrato' };

export function montarFiltro(cuerpo, { tab }, opciones) {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const tk = v => css.getPropertyValue(v).trim();
    const C = { texto: tk('--text-main'), suave: tk('--text-muted'), verde: tk('--accent-green'), rojo: tk('--accent-red'), amarillo: tk('--accent-yellow'), oro: tk('--accent-blue'), purpura: tk('--accent-purple') };
    // Colores de los rótulos del citrato y del calcio: los de sus partículas.
    const COLOR = { cit: tk('--accent-yellow'), ca: colorParticula('ca'), agua: colorParticula('agua') };
    const LEYENDA = [{ clave: 'rbc' }, { clave: 'alb' }, { clave: 'urea' }, { clave: 'k' }, { clave: 'cito', nombre: 'Citoquinas (mayor tamaño)' }, { clave: 'ca' },
        ...(opciones.mandos.includes('anticoag') ? [{ clave: 'citrato' }, { clave: 'cacit' }] : []), { clave: 'agua', nombre: 'Agua / reposición' }];
    const e = { modo: 'hf', dosis: 25, reposicion: 'post', qb: 150, anticoag: 'citrato', ...opciones.inicial };
    const m = new Set(opciones.mandos);
    // Sin el mando de anticoagulación, el filtro no se coagula ni se dibuja el citrato.
    const conAc = m.has('anticoag');
    const citrato = () => conAc && e.anticoag === 'citrato';
    const textos = opciones.textos || {};
    const enlace = id => id ? ` <button type="button" class="visual-link" data-fv-ver="${id}">Texto ↓</button>` : '';
    const chips = (clave, lista) => `<div class="nv-chips gl-mandos">${Object.entries(lista).map(([k, v]) => `<button type="button" class="visual-mini" data-fv="${clave}" data-valor="${k}" aria-pressed="false">${typeof v === 'string' ? v : v.nombre}</button>`).join('')}</div>`;
    const deslizador = (clave, et, min, max, paso, unidad) => `<div class="tfg-slider-row"><label>${et}</label><input type="range" data-fv-rango="${clave}" min="${min}" max="${max}" step="${paso}" value="${e[clave]}"><span data-fv-out="${clave}">${e[clave]} ${unidad}</span></div>`;

    cuerpo.innerHTML = `
        <div class="gl-escenario"><canvas aria-label="Filtro de la TRR animado"></canvas></div>
        ${leyendaParticulas(LEYENDA)}
        ${m.has('modo') ? chips('modo', MODOS) : ''}
        ${m.has('dosis') ? deslizador('dosis', 'Flujo del efluente', 15, 70, 5, 'ml/kg/h') : ''}
        ${m.has('qb') ? deslizador('qb', 'Flujo sanguíneo', 80, 250, 10, 'ml/min') : ''}
        ${m.has('reposicion') ? chips('reposicion', { pre: 'Reposición prefiltro', post: 'Reposición posfiltro' }) : ''}
        ${m.has('anticoag') ? chips('anticoag', ANTICOAG) : ''}
        ${m.has('anticoag') ? '<div class="nv-chips"><button type="button" class="visual-mini" data-fv-cambiar>Cambiar el filtro</button></div>' : ''}
        <div class="nv-medidores gl-medidores"></div>
        <div class="fml fv-formula" hidden></div>
        <div class="hk-avisos gl-avisos"></div>
        <p class="hk-aviso-modelo">Los mecanismos, las duraciones, las dosis y las cifras del citrato son de la ficha. La fracción de filtración (con un paciente de 70 kg y hematocrito del 30%), lo rápido que se coagula el filtro y cuántas partículas cruzan la membrana son ilustrativos.</p>`;
    const lienzo = cuerpo.querySelector('canvas'), ctx = lienzo.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = W * dpr; lienzo.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ---------- Modelo ----------
    let coag = 0; // 0-1: lo coagulado que está el filtro
    function modelo() {
        const md = MODOS[e.modo];
        const qp = e.qb * (1 - HTO);                                    // ml/min de plasma
        const qef = md.conv ? e.dosis * PESO / 60 : 0;                  // ml/min de ultrafiltrado convectivo
        const pre = md.conv && e.reposicion === 'pre' ? qef : 0;
        const ff = md.conv ? qef / (qp + pre) : 0.03;                   // fracción de filtración
        const riesgoAc = { no: 1, heparina: 0.06, citrato: 0.04 }[e.anticoag];
        const ritmo = !conAc ? 0 : riesgoAc * (0.5 + ff * 3) * (150 / e.qb) / 45;    // fracción del filtro que se coagula por segundo (ilustrativo)
        return { md, qp, qef, ff, ritmo, dilucion: pre ? qp / (qp + pre) : 1 };
    }
    let M = modelo();

    // ---------- Partículas ----------
    let sangre = [], fuera = [], dializado = [], infusion = [];
    const acum = {};
    const vel = () => 34 + e.qb * 0.24;   // px/s por la fibra
    function paso(dt) {
        const v = vel() * (coag >= 1 ? 0.15 : 1);
        for (const [t, d] of Object.entries(TIPOS)) {
            acum[t] = (acum[t] || 0) + d.tasa * (e.qb / 150) * dt;
            while (acum[t] >= 1) { acum[t]--; sangre.push({ t, x: -4, y: FIB.y0 + 5 + Math.random() * (FIB.y1 - FIB.y0 - 10), unido: false }); }
        }
        // Citrato antes del filtro y calcio después; reposición pre o posfiltro.
        if (citrato()) { acum.cit = (acum.cit || 0) + 4 * dt; while (acum.cit >= 1) { acum.cit--; infusion.push({ t: 'cit', x: 18, y: 104, fin: 150 }); } }
        if (citrato()) { acum.cai = (acum.cai || 0) + 2 * dt; while (acum.cai >= 1) { acum.cai--; infusion.push({ t: 'ca', x: 342, y: 104, fin: 150 }); } }
        if (M.md.conv) { acum.rep = (acum.rep || 0) + 6 * M.qef / 30 * dt; while (acum.rep >= 1) { acum.rep--; infusion.push({ t: 'agua', x: e.reposicion === 'pre' ? 28 : 334, y: 104, fin: 150 }); } }
        if (M.md.dif) { acum.dia = (acum.dia || 0) + 10 * dt; while (acum.dia >= 1) { acum.dia--; const arriba = Math.random() < 0.5; dializado.push({ x: CAJA.x1 - 4, y: arriba ? 92 + Math.random() * 30 : 178 + Math.random() * 30 }); } }
        for (const p of infusion) { p.y += 90 * dt; }
        infusion = infusion.filter(p => p.y < p.fin);
        for (const p of sangre) {
            p.x += v * dt * (p.t === 'rbc' ? 1 : 1.05);
            // El citrato atrapa el Ca²⁺ dentro del circuito; la infusión de calcio lo devuelve al salir.
            p.unido = citrato() && p.t === 'ca' && p.x > 18 && p.x < 342;
            if (p.x > FIB.x0 && p.x < FIB.x1 && coag < 1) {
                const d = TIPOS[p.t];
                let k = M.md.dif * d.dif * 0.9 + M.md.conv * d.conv * 0.9 * (e.dosis / 30) * M.dilucion;
                if (p.unido) k = M.md.dif * 0.5 + M.md.conv * 0.4 * (e.dosis / 30); // parte del complejo citrato-calcio se va con el efluente
                if (Math.random() < k * dt) { fuera.push({ t: p.t, unido: p.unido, x: p.x, y: p.y, vy: p.y < 150 ? -1 : 1, fase: 0 }); p.borrar = true; }
            }
        }
        sangre = sangre.filter(p => !p.borrar && p.x < W + 6);
        if (M.md.conv) { acum.agua = (acum.agua || 0) + 8 * M.qef / 30 * dt; while (acum.agua >= 1) { acum.agua--; const x = FIB.x0 + Math.random() * (FIB.x1 - FIB.x0); fuera.push({ t: 'agua', x, y: 150, vy: Math.random() < 0.5 ? -1 : 1, fase: 0 }); } }
        for (const p of fuera) {
            if (p.fase === 0) { p.y += p.vy * 40 * dt; if (p.vy < 0 ? p.y < 112 : p.y > 188) p.fase = 1; }
            else if (p.fase === 1) { const dx = DREN - p.x; p.x += Math.sign(dx) * Math.min(Math.abs(dx), (M.md.dif ? 70 : 40) * dt); if (Math.abs(dx) < 1) p.fase = 2; }
            if (p.fase === 2) { p.y += p.vy * 50 * dt; p.x = DREN; } // sale por el lado de la membrana por el que cruzó
        }
        fuera = fuera.filter(p => p.y < H - 30 && p.y > 40);
        for (const p of dializado) p.x -= 70 * dt;
        dializado = dializado.filter(p => p.x > DREN);
        coag = Math.min(1, coag + M.ritmo * dt);
    }

    // ---------- Dibujo ----------
    const flecha = (x1, y1, x2, y2, color) => {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const a = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 6 * Math.cos(a - 0.4), y2 - 6 * Math.sin(a - 0.4)); ctx.lineTo(x2 - 6 * Math.cos(a + 0.4), y2 - 6 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    };
    function rotulo(t, x, y, color = C.suave, alinea = 'left', size = 8.5) {
        ctx.font = `${size}px Georgia, serif`; ctx.fillStyle = color; ctx.textAlign = alinea; ctx.fillText(t, x, y); ctx.textAlign = 'left';
    }
    function pastilla(t, x, y, color) {
        ctx.font = 'bold 9px Georgia, serif';
        const w = ctx.measureText(t).width + 8;
        ctx.fillStyle = 'rgba(23,20,15,.88)'; ctx.strokeStyle = alfa(color, 0.6); ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.roundRect(x - w / 2, y - 7, w, 13, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(t, x, y + 3); ctx.textAlign = 'left';
    }
    // Una partícula con la forma de la tabla única; el Ca²⁺ atrapado por el citrato, con su anillo.
    function punto(t, x, y, unido) {
        if (unido) { pintarParticula(ctx, 'cacit', x, y, RADIO_EXTRA.cit); return; }
        pintarParticula(ctx, CLAVE[t] ?? t, x, y, TIPOS[t]?.r ?? RADIO_EXTRA[t], { giro: t === 'rbc' ? 0.3 : 0 });
    }
    function dibujar() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1b1510'; ctx.fillRect(0, 0, W, H);
        // Líneas de sangre: del paciente y de vuelta al paciente
        ctx.fillStyle = alfa(C.rojo, 0.28); ctx.fillRect(0, FIB.y0 + 4, FIB.x0, FIB.y1 - FIB.y0 - 8); ctx.fillRect(FIB.x1, FIB.y0 + 4, W - FIB.x1, FIB.y1 - FIB.y0 - 8);
        // Carcasa y compartimento del dializado/ultrafiltrado
        ctx.fillStyle = M.md.dif ? alfa('#8fb8d8', 0.14) : alfa(C.amarillo, 0.08);
        ctx.strokeStyle = alfa(C.texto, 0.5); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(CAJA.x0, CAJA.y0, CAJA.x1 - CAJA.x0, CAJA.y1 - CAJA.y0, 10); ctx.fill(); ctx.stroke();
        // Luz de la fibra: más oscura hacia la salida si se concentra la sangre (posfiltro, fracción de filtración alta)
        const g = ctx.createLinearGradient(FIB.x0, 0, FIB.x1, 0);
        g.addColorStop(0, alfa(C.rojo, 0.3)); g.addColorStop(1, alfa(C.rojo, clamp(0.3 + M.ff * (e.reposicion === 'post' ? 1 : 0.3), 0.3, 0.75)));
        ctx.fillStyle = g; ctx.fillRect(FIB.x0, FIB.y0, FIB.x1 - FIB.x0, FIB.y1 - FIB.y0);
        // Membrana con poros
        ctx.strokeStyle = '#cdb89a'; ctx.lineWidth = 3; ctx.setLineDash([6, 3]);
        for (const y of [FIB.y0, FIB.y1]) { ctx.beginPath(); ctx.moveTo(FIB.x0, y); ctx.lineTo(FIB.x1, y); ctx.stroke(); }
        ctx.setLineDash([]);
        // Fibrina si el filtro se coagula (de la salida hacia la entrada)
        if (coag > 0.02) {
            ctx.strokeStyle = alfa('#e8dcc0', 0.75); ctx.lineWidth = 1;
            const n = Math.floor(coag * 26);
            for (let i = 0; i < n; i++) {
                const x = FIB.x1 - 6 - (i * 37 % 160) * coag, y = FIB.y0 + 4 + (i * 13 % (FIB.y1 - FIB.y0 - 8));
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10, y + ((i % 3) - 1) * 6); ctx.lineTo(x + 18, y + 3); ctx.stroke();
            }
        }
        // Flujos
        flecha(2, 150, 30, 150, C.rojo); flecha(FIB.x1 + 12, 150, W - 4, 150, C.rojo);
        rotulo('← del paciente', 2, 228, C.texto); rotulo('al paciente →', W - 2, 228, C.texto, 'right');
        if (M.md.dif) { flecha(W - 6, 100, CAJA.x1 - 6, 100, '#8fb8d8'); rotulo('dializado', W - 2, 84, '#8fb8d8', 'right'); }
        flecha(DREN, CAJA.y1, DREN, CAJA.y1 + 34, C.amarillo); flecha(DREN, CAJA.y0, DREN, CAJA.y0 - 30, C.amarillo);
        rotulo('efluente', DREN + 7, CAJA.y1 + 32, C.amarillo);
        if (M.md.conv) rotulo(e.reposicion === 'pre' ? 'reposición prefiltro' : 'reposición posfiltro', e.reposicion === 'pre' ? 30 : 330, 66, COLOR.agua, e.reposicion === 'pre' ? 'left' : 'right');
        if (citrato()) { rotulo('citrato', 4, 78, COLOR.cit); rotulo('calcio', W - 4, 78, COLOR.ca, 'right'); }
        // Partículas
        for (const p of dializado) { ctx.globalAlpha = 0.45; ctx.fillStyle = '#8fb8d8'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, 7); ctx.fill(); }
        ctx.globalAlpha = 1;
        for (const p of infusion) punto(p.t, p.x, p.y, false);
        for (const p of sangre) punto(p.t, p.x, p.y, p.unido);
        for (const p of fuera) { ctx.globalAlpha = p.t === 'agua' ? 0.6 : 1; punto(p.t, p.x, p.y, p.unido); }
        ctx.globalAlpha = 1;
        // Rótulos de estado
        rotulo(MODOS[e.modo].nombre, DREN + 10, CAJA.y0 + 12, C.texto, 'left', 9);
        if (conAc && e.anticoag === 'heparina') pastilla('Heparina: anticoagula también al paciente', 180, 282, C.amarillo);
        if (citrato()) pastilla('Ca²⁺ iónico en el circuito <0,35 mmol/l', 180, 282, COLOR.cit);
        if (conAc && e.anticoag === 'no' && coag < 1) pastilla('Sin anticoagulación: se forma fibrina', 180, 282, CLARO.rojo);
        if (coag >= 1) pastilla('Filtro coagulado: hay que cambiar el circuito', 180, 282, CLARO.rojo);
        rotulo('membrana', FIB.x1 - 2, FIB.y0 - 4, '#cdb89a', 'right', 7.5);
    }

    // ---------- Lecturas ----------
    const DUR = { hd: '3-5 h', hf: 'Hasta 24 h/día', hib: '8-16 h' };
    const medidor = ([n, v, ficha, tono = '', nota = '']) => `
        <div class="nv-medidor"><div class="nv-medidor-nombre"><span>${n}</span><span class="nv-fuente${ficha ? ' ficha' : ''}">${ficha ? 'ficha' : 'ilustrativo'}</span></div>
        <div class="nv-medidor-valor ${tono}${String(v).length > 18 ? ' largo' : ''}">${v}</div>${nota ? `<div class="nv-medidor-nota">${nota}</div>` : ''}</div>`;
    function pintarLecturas() {
        const md = M.md, items = [
            ['Mecanismo', md.dif && md.conv ? 'Difusión + convección' : md.dif ? 'Difusión' : 'Convección', true, '', md.dif && md.conv ? 'Gradiente hacia el dializado y arrastre por el agua' : md.dif ? 'El soluto pasa a favor de gradiente hacia el dializado' : 'El agua arrastra lo disuelto a través de la membrana'],
            ['Moléculas pequeñas', { hd: 'Aclaramiento rápido', hf: 'Eliminación gradual', hib: 'Aclaramiento intermedio' }[e.modo], true, '', 'Urea, K⁺'],
            ['Moléculas de mayor tamaño', { hd: 'Poco', hf: 'Sí', hib: 'Algo' }[e.modo], e.modo !== 'hib', e.modo === 'hd' ? 'malo' : '', 'Citoquinas, etc. Albúmina y células no pasan'],
            ['Duración típica', DUR[e.modo], true],
        ];
        if (md.conv && m.has('dosis')) items.push(['Flujo del efluente', `${e.dosis} ml/kg/h`, false, e.dosis > 35 ? 'malo' : '', e.dosis > 35 ? 'Por encima de lo convencional, sin beneficio en los ensayos' : e.dosis > 25 ? '>25 ml/kg/h: solo asociado a supervivencia en observacionales' : 'Dosis convencional baja']);
        if (md.conv && (m.has('reposicion') || m.has('qb'))) items.push(['Fracción de filtración', `${Math.round(M.ff * 100)}%`, false, M.ff > 0.25 ? 'malo' : '', e.reposicion === 'pre' ? 'Con reposición prefiltro la sangre llega diluida' : 'Con reposición posfiltro se concentra en la fibra']);
        if (m.has('anticoag')) {
            items.push(['Anticoagulación', ANTICOAG[e.anticoag], true, e.anticoag === 'no' ? 'malo' : '', e.anticoag === 'heparina' ? 'Sistémica: también el paciente' : e.anticoag === 'citrato' ? 'Regional: solo el circuito' : 'Coagulación del circuito: la complicación técnica más común']);
            if (e.anticoag === 'citrato') items.push(['Ca²⁺ iónico en el circuito', '<0,35 mmol/l', true, '', 'Citrato a 4-6 mmol/l; inhibe la coagulación por debajo de 0,5 y al máximo por debajo de 0,25']);
            items.push(['Filtro coagulado', `${Math.round(coag * 100)}%`, false, coag > 0.5 ? 'malo' : '', coag >= 1 ? 'Sin flujo útil: cambiar el circuito' : 'Avanza más rápido con fracción de filtración alta o flujo bajo']);
        }
        cuerpo.querySelector('.gl-medidores').innerHTML = items.map(medidor).join('');
        pintarFormula(cuerpo.querySelector('.fv-formula'), md.conv && m.has('dosis') ? [{
            titulo: 'Efluente', formula: 'dosis (ml/kg/h) × peso (kg)',
            numeros: `${e.dosis} × ${PESO}`, resultado: Math.round(M.qef * 60).toLocaleString('es-ES', { useGrouping: true, minimumGroupingDigits: 1 }), unidad: 'ml/h',
            origen: 'fisiología general · dosis: ficha · trr-dosis-base · peso de 70 kg: ilustrativo', prefijos: ['trr'],
        }] : null);
        const av = [];
        if (e.modo === 'hd') av.push(['warn', 'Rápida y eficaz, pero su ultrafiltración depende de lo que tolere la tensión: menos estabilidad hemodinámica que la TRR continua.' + enlace(textos.hd)]);
        if (e.modo === 'hib') av.push(['ok', 'Combinan rasgos de la HD y de la TRR continua: 8-16 h, con velocidades de ultrafiltración y aclaramiento intermedias.' + enlace(textos.hib)]);
        if (e.modo === 'hf') av.push(['ok', 'Gradual y estable: mejor control del balance hídrico, a costa de inmovilizar al paciente y del riesgo de hipotermia.' + enlace(textos.cont)]);
        if (md.conv && m.has('dosis') && e.dosis > 35) av.push(['warn', 'Ningún ensayo aleatorizado ha demostrado beneficio de dosis mayores, ni siquiera hasta 70 ml/kg/h; hay que asumir el riesgo de "dialitrauma" y la pérdida de citoquinas beneficiosas en la sepsis.' + enlace(textos.dosis)]);
        if (md.conv && M.ff > 0.25 && m.has('reposicion')) av.push(['warn', 'Para que no se coagule: subir el flujo sanguíneo, bajar la fracción de filtración, alternar la reposición pre y posfiltro.' + enlace(textos.estrategias)]);
        if (citrato()) av.push(['ok', 'El citrato atrapa el Ca²⁺ del circuito; al volver al paciente se repone el calcio, y el complejo citrato-calcio que no se va con el efluente lo metaboliza el hígado a bicarbonato.' + enlace(textos.citrato)]);
        if (conAc && e.anticoag === 'heparina') av.push(['warn', 'La heparina anticoagula también al paciente: índice terapéutico estrecho y más riesgo de sangrado. El citrato se asocia a mejor permeabilidad del circuito y menos sangrado.' + enlace(textos.heparina)]);
        if (conAc && e.anticoag === 'no') av.push(['danger', 'El 30-60% de los pacientes no puede anticoagularse por riesgo de sangrado: la coagulación del circuito es la complicación técnica más común.' + enlace(textos.problema)]);
        cuerpo.querySelector('.gl-avisos').innerHTML = av.map(([t, x]) => `<div class="tfg-estado tfg-estado-${t}">${x}</div>`).join('');
    }
    let ultimaCoag = -1;
    function actualizar() {
        M = modelo();
        cuerpo.querySelectorAll('[data-fv]').forEach(b => { const on = e[b.dataset.fv] === b.dataset.valor; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        cuerpo.querySelectorAll('[data-fv="reposicion"]').forEach(b => { b.disabled = !M.md.conv; });
        const dosis = cuerpo.querySelector('[data-fv-rango="dosis"]'); if (dosis) dosis.disabled = !M.md.conv;
        lienzo.setAttribute('aria-label', `Filtro de la TRR: ${MODOS[e.modo].nombre}${m.has('anticoag') ? ', ' + ANTICOAG[e.anticoag] : ''}.`);
        pintarLecturas(); ultimaCoag = Math.round(coag * 100);
    }
    cuerpo.addEventListener('click', ev => {
        const b = ev.target.closest('[data-fv]');
        if (b) { e[b.dataset.fv] = b.dataset.valor; if (b.dataset.fv === 'anticoag') coag = 0; actualizar(); return; }
        if (ev.target.closest('[data-fv-cambiar]')) { coag = 0; actualizar(); return; }
        const ver = ev.target.closest('[data-fv-ver]');
        if (ver) irAlTexto(tab, document.getElementById(ver.dataset.fvVer));
    });
    cuerpo.querySelectorAll('[data-fv-rango]').forEach(r => r.addEventListener('input', () => {
        const k = r.dataset.fvRango; e[k] = +r.value;
        cuerpo.querySelector(`[data-fv-out="${k}"]`).textContent = `${e[k]} ${k === 'dosis' ? 'ml/kg/h' : 'ml/min'}`;
        actualizar();
    }));

    for (let i = 0; i < 160; i++) paso(0.05);
    coag = 0;
    actualizar(); dibujar();
    let visible = false, raf = 0, ultimo = 0;
    const bucle = ts => {
        raf = 0;
        const dt = Math.min(0.05, (ts - (ultimo || ts)) / 1000); ultimo = ts;
        paso(dt * (reducido ? 0.4 : 1)); dibujar();
        if (m.has('anticoag') && Math.round(coag * 100) !== ultimaCoag) actualizar();
        if (visible) raf = requestAnimationFrame(bucle);
    };
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; ultimo = 0; if (visible && !raf) raf = requestAnimationFrame(bucle); }).observe(lienzo);
}
