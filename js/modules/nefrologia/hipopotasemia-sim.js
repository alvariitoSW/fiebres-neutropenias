// Vista Visual de la ficha "Hipopotasemia" (Nefrología → Fisiología): el
// mismo escenario que la hiperpotasemia (plasma, célula, salidas, corazón,
// analítica y ECG; potasio-escena.js), pero mirando el otro lado — el K⁺ que
// se pierde o se mete en la célula y el que se repone.
//
// La idea central que enseña: el K⁺ del plasma es una ventana pequeña a un
// depósito grande. Cada hueco de la célula son 20 mEq que faltan en el
// cuerpo; el ClK que entra va casi todo a rellenarlos, y por eso el K⁺ del
// plasma sube despacio (200-400 mEq por cada 1 mEq/l, según la ficha).
//
// Reglas (las mismas que el resto de vistas Visual de la app):
// - Datos en js/data/hipopotasemia-data.js; lo que la ficha no da es
//   ILUSTRATIVO y la propia vista lo avisa.
// - Cada "Texto ↓" lleva a su línea real de la ficha.
// - La animación solo corre mientras la vista Visual está en pantalla.

import { montarVisual } from '../../core/visual-kit.js';
import { clamp, pintarGauge } from '../../core/ui.js';
import {
    causasHipopotasemia as CAUSAS, accionesHipopotasemia as ACCIONES, gruposHipopotasemia as GRUPOS,
    perfusionHipopotasemia as PERF, magnitudesHipopotasemia as MAG,
} from '../../data/hipopotasemia-data.js';
import {
    VASO, CEL, actividades, estadoDosis, enlazarTexto, crearPoner, animarMientrasVisible,
    crearEscena, onda, azar, coma, fmtT, enlace, alfa, CLARO,
} from './potasio-escena.js';

const TAB_ID = 'fisio-hipopotasemia';
const POR_MEQ = 4, T_MAX = 720, MEQ_HUECO = 20, HUECOS = 48, K_MIN = 1.2;
const CON_TIEMPO = ACCIONES.filter(a => a.ini);
// En la cetoacidosis la insulina es el tratamiento, en perfusión: no se acaba.
const CON_TIEMPO_CAD = CON_TIEMPO.map(a => a.id === 'insulina' ? { ...a, fin: null } : a);
const RUTAS = ['orina', 'heces'];

// ---------- Déficit corporal ↔ K⁺ plasmático (magnitudes en los datos) ----------
const kDesdeDeficit = d => d <= MAG.porMeqAlto
    ? MAG.normal - d / MAG.porMeqAlto
    : MAG.normal - 1 - (d - MAG.porMeqAlto) / MAG.porMeqBajo;
const deficitDesdeK = k => k >= MAG.normal - 1
    ? (MAG.normal - k) * MAG.porMeqAlto
    : MAG.porMeqAlto + (MAG.normal - 1 - k) * MAG.porMeqBajo;

// Gravedad según los cortes de la ficha (leve 3-3,5, moderada 2,5-3, grave <2,5).
function gravedad(k) {
    if (k < 2.5) return { nombre: 'Grave', color: 'red', nivel: 3 };
    if (k < 3) return { nombre: 'Moderada', color: 'yellow', nivel: 2 };
    if (k < 3.5) return { nombre: 'Leve', color: '', nivel: 1 };
    if (k <= 5) return { nombre: 'Sin hipopotasemia', color: '', nivel: 0 };
    return { nombre: 'K⁺ alto', color: 'red', nivel: 2 };
}

// ---------- Vista Texto: nada que generar (la ficha no tiene tabla de dosis) ----------
export function initHipopotasemiaSim() {
    montarVisual(TAB_ID, montar);
}

// ---------- Marcado ----------
const opciones = (lista, fmt) => lista.map(o => `<option value="${o.v ?? o}">${fmt(o)}</option>`).join('');
function tarjetaAccion(a) {
    const g = GRUPOS[a.grupo];
    const extraIv = a.id !== 'iv' ? '' : `
    <div class="hp-perfusion">
      <label>Ritmo <select id="hp-iv-ritmo">${opciones(PERF.ritmos, r => `${r} mEq/h${r > PERF.ritmoMax ? ' (sobre el límite)' : r === PERF.ritmoMax ? ' (en el límite)' : ''}`)}</select></label>
      <label>Bolsa <select id="hp-iv-conc">${opciones(PERF.concentraciones, c => c.txt)}</select></label>
      <label>Suero <select id="hp-iv-suero"><option value="salino">Salino</option><option value="glucosado">Glucosado</option></select></label>
    </div>`;
    return `
  <div class="hk-farmaco"><span class="hk-tira" style="background:${g.color}"></span>
    <div><div class="hk-nombre" id="hp-nombre-${a.id}">${a.nombre}</div>
      <div class="hk-meta">${a.tiempo}</div>
      <div class="hk-estado" id="hp-estado-${a.id}"></div></div>
    <div class="hk-acciones"><button type="button" class="visual-mini hk-dar" id="hp-dar-${a.id}" data-dar="${a.id}"></button>
      <button type="button" class="visual-link" data-ver="${a.fuente}${a.extra ? ',' + a.extra : ''}" aria-label="Ver ${a.nombre} en el texto">Texto ↓</button></div>${extraIv}</div>`;
}
const MARCADO = `
<p class="visual-guia">El K⁺ del plasma es una ventana pequeña a un depósito grande: cada hueco ○ de la célula son 20 mEq que faltan en el cuerpo. Elige la causa, repón y corre el reloj.</p>
<div class="hk-escenario">
  <div class="hk-campo"><label for="hp-causa">Causa</label><select id="hp-causa">${Object.entries(CAUSAS).map(([k, c]) => `<option value="${k}">${c.etiqueta}</option>`).join('')}</select></div>
  <p class="hk-causa-detalle" id="hp-causa-detalle"></p>
  <div class="hk-campo"><label for="hp-oral">Vía oral</label><select id="hp-oral"><option value="si">Tolera</option><option value="no">Intolerancia oral o íleo</option></select></div>
  <div class="hk-campo"><label for="hp-digoxina">Digoxina</label><select id="hp-digoxina"><option value="no">No</option><option value="si">Sí, digitalizado</option></select></div>
  <div class="hk-campo"><label for="hp-ecg-modo">ECG</label><select id="hp-ecg-modo"><option value="progresivo">Sigue al K⁺ (umbral ilustrativo)</option><option value="ninguno">Sin cambios</option></select></div>
</div>
<div class="hk-escena">
  <canvas id="hp-escena" aria-label="Simulación del potasio entre plasma, célula, corazón, analítica y vías de pérdida y de reposición"></canvas>
  <canvas id="hp-ecg" class="hk-ecg" aria-label="Electrocardiograma"></canvas>
</div>
<div class="hk-marcador">
  <div class="hk-k" id="hp-k" aria-live="polite"></div>
  <span class="grade-badge" id="hp-gravedad"></span>
  <div class="hk-k-real hk-fila" id="hp-k-real" hidden><span id="hp-k-real-txt"></span><button type="button" class="visual-mini hk-primario" id="hp-repetir">Repetir separando pronto el plasma</button></div>
  <div class="hk-nota hk-fila" id="hp-ecg-texto"></div>
  <div class="kinetic-row hk-fila" id="hp-deficit-row">
    <div class="kinetic-label"><span>Déficit corporal estimado</span><strong id="hp-deficit-num"></strong></div>
    <div class="kinetic-track"><div class="kinetic-fill" id="hp-deficit-fill"></div></div>
  </div>
  <div class="hk-nota hk-fila" id="hp-deficit-txt"></div>
  <div class="hk-nota hk-fila" id="hp-via"></div>
  <div class="hk-nota hk-fila" id="hp-pistas"></div>
  <div class="hk-nota hk-fila" id="hp-reparto"></div>
</div>
<div class="hk-avisos" id="hp-avisos" aria-live="polite"></div>
<div class="hk-controles">
  <button type="button" class="visual-mini hk-primario" id="hp-play"></button>
  <button type="button" class="visual-mini" id="hp-rapido" aria-pressed="false">×4</button>
  <button type="button" class="visual-mini" id="hp-reiniciar">Reiniciar</button>
  <span class="hk-reloj" id="hp-reloj"></span>
</div>
<div class="hk-farmacos">${Object.entries(GRUPOS).map(([g, info]) =>
    `<p class="section-label">${info.rotulo}</p>` + ACCIONES.filter(a => a.grupo === g).map(tarjetaAccion).join('')).join('')}
</div>
<p class="hk-aviso-modelo">Modelo didáctico. De la ficha salen los cortes de gravedad, el tamaño del déficit (200-400 mEq por cada 1 mEq/l; más de 800-1.000 con K⁺ &lt;2: el modelo usa 300 entre 4 y 3 y 600 por debajo de 3), los límites del ClK i.v., las pistas diagnósticas y los tiempos de la insulina y el salbutamol (tabla de la ficha de hiperpotasemia). Son ilustrativos: el ritmo de pérdida de cada causa, cuánto K⁺ mete cada desencadenante en la célula, la absorción del ClK oral, cuándo actúan la corrección del magnesio y los ahorradores, la parte del ClK que se pierde con el magnesio bajo, la duración del ataque de parálisis (dentro de las 6-24 h de la ficha) y los umbrales de K⁺ a los que aparece cada cambio del ECG, que la ficha no da.</p>`;

// ---------- Montaje ----------
function montar(tab, texto, visual) {
    visual.innerHTML = MARCADO;
    const $ = id => visual.querySelector('#' + id);
    const E = {};
    for (const id of ['hp-k', 'hp-gravedad', 'hp-k-real', 'hp-k-real-txt', 'hp-repetir', 'hp-ecg-texto', 'hp-deficit-txt', 'hp-via', 'hp-pistas',
        'hp-reparto', 'hp-avisos', 'hp-reloj', 'hp-play', 'hp-rapido', 'hp-causa', 'hp-oral', 'hp-digoxina', 'hp-ecg-modo', 'hp-causa-detalle',
        'hp-iv-ritmo', 'hp-iv-conc', 'hp-iv-suero', 'hp-nombre-insulina']) E[id] = $(id);
    for (const a of ACCIONES) { E['estado-' + a.id] = $('hp-estado-' + a.id); E['dar-' + a.id] = $('hp-dar-' + a.id); }
    const poner = crearPoner();
    const esc = crearEscena(visual, { escena: 'hp-escena', ecg: 'hp-ecg' });
    const { C, rotulo, puntos, anillos } = esc;

    let S, rapido = false;
    let P = [], TOKENS = [], TUBO_K = [], GOTAS = [];
    // Huecos de la célula: posiciones fijas, rellenadas en orden aleatorio.
    const HUECO = Array.from({ length: HUECOS }, (_, i) => ({ x: CEL.x + 22 + (i % 12) * 17, y: CEL.y + 50 + Math.floor(i / 12) * 11 }))
        .sort(() => Math.random() - 0.5);

    // ---------- Modelo ----------
    const tiempos = () => S.c.cad ? CON_TIEMPO_CAD : CON_TIEMPO;
    function ataque(t) {
        const a = S.c.ataque;
        if (!a) return 1;
        return t <= a[0] ? 1 : t >= a[1] ? 0 : 1 - (t - a[0]) / (a[1] - a[0]);
    }
    function modelo(act) {
        const c = S.c;
        const salido = c.salido ? c.salido * (1 - act.insulina) : 0;
        const glucosado = S.iv.activa && E['hp-iv-suero'].value === 'glucosado' ? MAG.glucosado : 0;
        const desplazado = (c.desplazado || 0) * ataque(S.t)
            + (c.cad ? 0 : act.insulina * ACCIONES.find(a => a.id === 'insulina').magnitud)
            + act.salbutamol * ACCIONES.find(a => a.id === 'salbutamol').magnitud + glucosado;
        const kb = kDesdeDeficit(S.D);
        const k = Math.max(K_MIN, kb + salido - desplazado);
        return { k, kb, salido, desplazado: kb + salido - k, medido: k - (c.pseudo && !S.repetido ? c.pseudo : 0) };
    }
    // mEq de ClK oral absorbidos entre t0 y t1.
    function absorbido(t0, t1) {
        const a = ACCIONES.find(x => x.id === 'oral');
        let total = 0;
        for (const td of S.dados.oral || []) {
            const i = td + a.absorcion[0], f = td + a.absorcion[1];
            total += a.meq * Math.max(0, Math.min(t1, f) - Math.max(t0, i)) / (f - i);
        }
        return total;
    }
    function avanzar(dt) {
        const c = S.c, act = actividades(tiempos(), S.dados, S.t), m = modelo(act);
        const iv = S.iv.activa ? Number(E['hp-iv-ritmo'].value) * dt / 60 : 0;
        const oral = absorbido(S.t, S.t + dt);
        // Con el magnesio bajo, parte del K⁺ que entra se va por la orina.
        const fuga = c.magnesio ? (iv + oral) * MAG.fugaMagnesio * (1 - act.magnesio) : 0;
        const perdida = { orina: fuga, heces: 0 };
        const freno = clamp((m.kb - K_MIN) / 0.6, 0, 1);
        for (const r of RUTAS) {
            let v = (c.perdidas?.[r] || 0) * dt / 60 * freno;
            if (r === 'orina') {
                if (c.magnesio) v *= 1 - act.magnesio;
                const ahorra = c.ahorrador === 'todos' ? Math.max(act.espironolactona, act.triamtereno)
                    : c.ahorrador === 'enac' ? act.triamtereno : 0;
                v *= 1 - MAG.ahorrador * ahorra;
                // Con el K⁺ por encima de lo normal, el riñón saca el exceso.
                v += MAG.excrecionExceso * clamp((m.k - 4.5) / 0.5, 0, 1) * dt / 60;
            }
            perdida[r] += v;
        }
        S.D += perdida.orina + perdida.heces - iv - oral;
        S.entrado.iv += iv; S.entrado.oral += oral; S.entrado.fuga += fuga;
        S.perdido.orina += perdida.orina; S.perdido.heces += perdida.heces;
        S.t += dt;
    }

    // ---------- ECG (umbrales ilustrativos: la ficha no los da) ----------
    function rasgosECG(k) {
        if (S.ecg === 'ninguno' || k >= 3) return { u: false, st: false, arr: false };
        return { u: true, st: k < 2.5, arr: k < 2, irregular: k < 2 };
    }
    const latido = (u, r, x) => {
        const y = onda(u, { sinP: r.arr, pr: r.st ? 0.04 : 0, tAmp: r.u ? 0.07 : 0.26, tAnch: r.u ? 0.07 : 0.055, tPos: r.st ? 0.66 : 0.62, st: r.st ? 0.09 : 0, uAmp: r.u ? 0.2 : 0 });
        return r.arr ? y + 0.05 * Math.sin(x * 0.9) + 0.03 * Math.sin(x * 2.3) : y;
    };
    function textoECG(r) {
        if (S.ecg === 'ninguno') return '<strong>ECG sin cambios.</strong> La gravedad se correlaciona con la concentración y con la velocidad de instauración.' + enlace('hp-clinica');
        if (r.arr) return '<strong>Arritmia</strong> (aquí, fibrilación auricular). La hipopotasemia aumenta el riesgo de FA; la infusión de K⁺ puede revertirla a ritmo sinusal.' + enlace('hp-fa,hp-clinica-cardiaca');
        if (r.st) return '<strong>↓ST, ↑QT y PR</strong>, con T aplanada y onda U.' + enlace('hp-clinica-cardiaca');
        if (r.u) return '<strong>Onda T aplanada y onda U prominente</strong> (Figura 4).' + enlace('hp-fig4');
        return 'Sin cambios en el ECG.' + enlace('hp-clinica-cardiaca');
    }

    // ---------- Criterios de vía i.v. (Figura 6 y la ficha) ----------
    function motivosIV(m, r) {
        const mot = [];
        if (m.medido < 2.5) mot.push('K⁺ &lt;2,5');
        if (r.arr) mot.push('arritmia');
        else if (r.u) mot.push('cambios en el ECG');
        if (S.digoxina) mot.push('digitalización');
        if (S.c.cad) mot.push('cetoacidosis');
        if (!S.tolera) mot.push('intolerancia oral o íleo');
        return mot;
    }

    // ---------- Avisos: frases de la ficha según lo que se hace ----------
    function avisos(m, r) {
        const a = [], c = S.c, dado = id => (S.dados[id] || []).length > 0;
        const repuesto = S.entrado.iv + S.entrado.oral > 0 || S.iv.activa;
        const ritmo = Number(E['hp-iv-ritmo'].value), conc = Number(E['hp-iv-conc'].value);
        if (c.pseudo && !S.repetido) a.push(['danger', 'Antes de reponer, confirma: con leucocitosis extrema o una muestra procesada tarde, el K⁺ baja dentro del tubo. Se corrige separando pronto el plasma de las células.' + enlace('hp-pseudo')]);
        if (c.pseudo && repuesto) a.push(['danger', 'El K⁺ real del paciente es normal: estás reponiendo un potasio que no falta.']);
        if (S.iv.activa && ritmo > PERF.ritmoMax) a.push(['danger', `Ritmo de ${ritmo} mEq/h: la ficha pone el límite por debajo de 20 mEq/hora.` + enlace('hp-precauciones')]);
        if (S.iv.activa && conc > PERF.concMax) a.push(['danger', `Concentración de ${conc} mEq/l: la ficha pone el límite por debajo de 50 mEq/l.` + enlace('hp-precauciones')]);
        if (S.iv.activa && E['hp-iv-suero'].value === 'glucosado') a.push(['warn', 'Suero glucosado: la glucosa estimula la insulina y mete más K⁺ en la célula. La ficha pide solución no glucosada.' + enlace('hp-precauciones')]);
        if (S.entrado.iv > PERF.maxDia) a.push(['danger', `Ya van ${Math.round(S.entrado.iv)} mEq de ClK i.v.: la ficha pone un máximo de 200 mEq al día.` + enlace('hp-precauciones')]);
        const mot = motivosIV(m, r);
        if (mot.length && dado('oral') && !S.iv.activa && !(c.pseudo && !S.repetido)) a.push(['warn', `Con ${mot.join(', ')}, la ficha indica ClK i.v.` + enlace('hp-via-iv,hp-fig6')]);
        if (!S.tolera && dado('oral')) a.push(['warn', 'Con intolerancia oral o íleo, la vía es intravenosa.' + enlace('hp-via-iv')]);
        if (c.magnesio && !dado('magnesio') && repuesto) a.push(['danger', 'Refractaria: sin corregir el magnesio, buena parte del ClK se pierde por la orina.' + enlace('hp-mg')]);
        if (c.ahorrador === 'enac' && dado('espironolactona')) a.push(['warn', 'El Liddle no responde a espironolactona: el defecto está en el canal ENaC, no en la aldosterona. Triamtereno sí.' + enlace('hp-liddle')]);
        if (!c.perdidas?.orina && (dado('espironolactona') || dado('triamtereno'))) a.push(['warn', 'Aquí el riñón no pierde K⁺: la ficha reserva los ahorradores para las pérdidas renales persistentes.' + enlace('hp-orales')]);
        if (c.cad && !dado('insulina')) a.push(['warn', 'K⁺ normal o alto, pero con depleción corporal verdadera: mira los huecos de la célula.' + enlace('hp-mecanismos')]);
        if (c.cad && dado('insulina') && m.k < 3.5) a.push(['danger', 'La insulina mete el K⁺ en la célula y aflora el déficit que tapaba la cetoacidosis.' + enlace('hp-causa-redistribucion')]);
        if (c.ataque && S.D < -MAG.porMeqAlto * 0.3) a.push(['warn', 'Con redistribución el depósito no estaba vacío: el K⁺ repuesto se suma al que vuelve de la célula al acabar el ataque.' + enlace('hp-mecanismos')]);
        if (dado('salbutamol')) a.push(['warn', 'β2-agonista: mete K⁺ en la célula. La ficha avisa del riesgo de hipopotasemia grave con β-adrenérgicos agudos en broncópatas con esteroides y teofilina.' + enlace('hp-farmacos')]);
        if (S.digoxina) a.push(['warn', 'Digitalizado: la hipopotasemia predispone a la toxicidad digitálica. Es criterio de gravedad.' + enlace('hp-clinica-cardiaca,hp-fig6')]);
        if (m.k > 5) a.push(['danger', 'El K⁺ ha pasado de lo normal.']);
        return a.map(([e, x]) => `<div class="tfg-estado tfg-estado-${e}">${x}</div>`).join('');
    }

    // ---------- Partículas ----------
    const nuevaK = (pos, extra) => ({ cat: 'plasma', x: pos.x, y: pos.y, ruta: [], vx: azar(0.15, 0.45), ...extra });
    function crearParticulas(m) {
        TOKENS = [];
        P = Array.from({ length: Math.round(m.k * POR_MEQ) }, () => nuevaK(esc.puntoPlasma()));
        // Las que la cetoacidosis ha sacado de la célula salen por la membrana.
        P.slice(0, Math.round(m.salido * POR_MEQ)).forEach(p => { p.salido = true; Object.assign(p, esc.puntoCelula()); p.ruta = esc.rutaHacia(p, 'plasma'); });
        for (let i = Math.round(m.desplazado * POR_MEQ); i > 0; i--) P.push({ ...nuevaK(esc.puntoCelula()), cat: 'celula' });
        TUBO_K = esc.puntosTubo(S.c.pseudo ? 10 : 0);
    }
    // Recoloca las del plasma y las metidas en la célula según el modelo.
    function cuadrar(m) {
        const plasma = [], celula = [];
        for (const p of P) (p.cat === 'celula' ? celula : p.cat === 'plasma' && !p.sale ? plasma : []).push(p);
        const quieroCel = Math.round(m.desplazado * POR_MEQ), quieroPla = Math.round(m.k * POR_MEQ);
        const libres = plasma.filter(p => !p.ruta.length);
        // a la célula por las bombas, o de vuelta por la membrana
        for (let n = quieroCel - celula.length; n > 0 && libres.length; n--) {
            const p = libres.splice(Math.floor(Math.random() * libres.length), 1)[0];
            p.cat = 'celula'; p.salido = false; p.ruta = esc.rutaHacia(p, 'celula');
            plasma.splice(plasma.indexOf(p), 1);
        }
        for (let n = celula.length - quieroCel; n > 0; n--) {
            const p = celula.pop(); p.cat = 'plasma'; p.ruta = esc.rutaHacia(p, 'plasma'); plasma.push(p);
        }
        // el plasma, al nivel del modelo. Sobran: las que había sacado la
        // cetoacidosis vuelven a la célula y se funden con ella; el resto se
        // quita sin más (la pérdida ya la dibujan las fichas de salida).
        // Faltan: aparecen (la entrada ya la dibujan las fichas de ClK).
        for (let n = plasma.length - quieroPla; n > 0; n--) {
            const p = plasma.find(q => q.salido) || plasma[Math.floor(Math.random() * plasma.length)];
            plasma.splice(plasma.indexOf(p), 1);
            if (p.salido) { p.sale = true; p.ruta = esc.rutaHacia(p, 'celula'); } else p.quitar = true;
        }
        for (let n = quieroPla - plasma.length; n > 0; n--) P.push(nuevaK(esc.puntoPlasma()));
        P = P.filter(p => !p.quitar && !(p.sale && !p.ruta.length));
    }
    // Fichas de 20 mEq que entran (ClK) o salen (pérdidas), al cruzar cada múltiplo.
    const contados = { iv: 0, oral: 0, fuga: 0, orina: 0, heces: 0 };
    function fichas(huecos) {
        const sale = (r) => { const p = { ...esc.puntoPlasma(), cat: r }; p.ruta = esc.rutaHacia(p, r); TOKENS.push(p); };
        for (const r of RUTAS) {
            const debidos = r === 'orina' ? S.perdido.orina - S.entrado.fuga : S.perdido.heces;
            for (const n = Math.floor(debidos / MEQ_HUECO); contados[r] < n; contados[r]++) sale(r);
        }
        for (const v of ['iv', 'oral']) {
            for (const n = Math.floor(S.entrado[v] / MEQ_HUECO); contados[v] < n; contados[v]++) {
                const { inicio, ruta } = esc.rutaEntrada(v === 'iv' ? 'arriba' : 'intestino');
                const fuga = S.c.magnesio && contados.fuga < Math.floor(S.entrado.fuga / MEQ_HUECO);
                if (fuga) contados.fuga++;
                const fin = ruta[ruta.length - 1];
                const destino = fuga ? 'orina' : 'hueco';
                const resto = destino === 'orina' ? esc.rutaHacia(fin, 'orina') : esc.rutaHacia(fin, 'celula', HUECO[clamp(huecos - 1, 0, HUECOS - 1)]);
                TOKENS.push({ x: inicio.x, y: inicio.y, cat: destino === 'orina' ? 'orina' : 'entra', ruta: [...ruta, ...resto], nuevo: true });
            }
        }
        // las que llegan a un hueco se funden con la célula; las pilas de salida no crecen sin fin
        TOKENS = TOKENS.filter(p => p.ruta.length || p.cat !== 'entra');
        for (const r of RUTAS) {
            const pila = TOKENS.filter(p => p.cat === r && !p.ruta.length);
            if (pila.length > 24) TOKENS.splice(TOKENS.indexOf(pila[0]), 1);
        }
    }

    // ---------- Dibujo ----------
    function dibujar(m, act, g, huecos) {
        const c = S.c, reloj = esc.reloj;
        esc.limpiar();
        if (S.iv.activa) {
            rotulo(`ClK i.v. ↓ ${E['hp-iv-ritmo'].value} mEq/h`, VASO.x + 46, 13, C.ink);
            // gotero: gotas de adorno (la cantidad la cuentan las fichas de 20 mEq)
            if (!esc.reducido && Math.random() < 0.12) GOTAS.push({ x: VASO.x + 30 + azar(-5, 5), y: 6, vida: 1 });
        }
        GOTAS = GOTAS.filter(g => (g.y += 0.9) < VASO.y + 26);
        puntos(GOTAS, alfa(C.verde, 0.8), 1.6);
        esc.vaso('PLASMA · ≈4 mEq/l normal · 2% del K⁺');
        esc.tubo(m.medido, c.pseudo && !S.repetido ? { texto: 'leucocitos', puntos: TUBO_K, color: CLARO.rojo } : null);
        esc.celula('CÉLULA · 98% del K⁺ · ○ = 20 mEq que faltan');
        if (m.salido > 0.05) esc.roturas();
        const absorbiendo = absorbido(S.t, S.t + 1) > 0;
        esc.salidas([
            { clave: 'orina', a: c.perdidas?.orina || c.magnesio ? 0.6 : m.k > 4.5 ? 0.5 : 0.1 },
            { clave: 'heces', a: c.perdidas?.heces ? 0.6 : absorbiendo ? 0.4 : 0.1, rot: absorbiendo ? 'Intestino (absorbe ↑)' : 'Heces' },
        ]);
        // depósito: huecos vacíos y llenos
        const llenos = [], vacios = [];
        HUECO.forEach((h, i) => (i < huecos ? vacios : llenos).push(h));
        puntos(llenos, alfa(C.oro, 0.5), 2.6, h => Math.sin(reloj * 0.6 + h.x) * 0.8);
        esc.ctx.setLineDash([2, 2]); anillos(vacios, alfa(CLARO.oro, 0.85), 3.2); esc.ctx.setLineDash([]);
        esc.bombas(clamp(act.insulina + act.salbutamol + (S.iv.activa && E['hp-iv-suero'].value === 'glucosado' ? 0.3 : 0) + (c.ataque ? ataque(S.t) * 0.6 : 0), 0, 1));
        if (c.ataque) rotulo(ataque(S.t) > 0.05 ? 'Ataque: el K⁺ entra en masa en la célula' : 'Fin del ataque: el K⁺ vuelve al plasma', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        if (c.cad) rotulo(act.insulina > 0.5 ? 'Insulina: el K⁺ vuelve a entrar en la célula' : 'Sin insulina: el K⁺ sale de la célula', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        if (c.magnesio) rotulo(act.magnesio > 0.5 ? 'Magnesio corregido: el túbulo retiene K⁺' : 'Mg bajo: el túbulo deja escapar K⁺', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        esc.moverParticulas(P);
        esc.moverParticulas(TOKENS, () => false);
        const grupos = { plasma: [], salido: [], celula: [], entra: [], fuera: [] };
        for (const p of P) grupos[p.cat === 'celula' || p.sale ? 'celula' : p.salido ? 'salido' : 'plasma'].push(p);
        for (const p of TOKENS) grupos[p.cat === 'entra' || (p.nuevo && p.ruta.length > 4) ? 'entra' : 'fuera'].push(p);
        puntos(grupos.plasma, C.ink, 2.8);
        puntos(grupos.salido, CLARO.rojo, 2.8);
        puntos(grupos.fuera, CLARO.verde, 2.6);
        puntos(grupos.entra, C.ink, 3.4);
        anillos(grupos.entra, alfa(C.verde, 0.9), 5.5);
        puntos(grupos.celula, CLARO.oro, 3.2);
        anillos(grupos.celula, alfa(CLARO.oro, 0.45), 5.5);
        esc.corazon(g.nivel / 3);
    }

    // ---------- Lecturas ----------
    function leer(m, r, act) {
        const c = S.c, pendiente = c.pseudo && !S.repetido, gm = gravedad(m.medido);
        poner('k', E['hp-k'], 'innerHTML', `${coma(m.medido)} <small>mEq/l en la analítica</small>`);
        poner('grav', E['hp-gravedad'], 'textContent', pendiente ? 'Sin confirmar' : gm.nombre);
        poner('gravc', E['hp-gravedad'], 'className', 'grade-badge ' + (pendiente ? 'hk-pendiente' : gm.color));
        poner('real', E['hp-k-real'], 'hidden', !c.pseudo);
        if (c.pseudo) {
            poner('realtxt', E['hp-k-real-txt'], 'textContent', S.repetido ? `Analítica repetida: el K⁺ real es ${coma(m.k)}.` : 'El K⁺ que circula en el plasma es otro.');
            poner('repetir', E['hp-repetir'], 'hidden', S.repetido);
        }
        poner('ecg', E['hp-ecg-texto'], 'innerHTML', textoECG(r));
        const D = Math.round(S.D);
        if (poner.cambio('deficit', D)) {
            pintarGauge('hp-deficit', Math.max(0, D), 1000, D < 200 ? 'ok' : D < 600 ? 'warn' : 'danger', D > 0 ? `≈${D} mEq` : 'sin déficit');
            E['hp-deficit-txt'].innerHTML = (D > 0
                ? `Faltan ≈${D} mEq en el cuerpo, aunque el plasma solo muestre ${coma(m.kb)} mEq/l sin las redistribuciones.`
                : D < -10 ? `Sobran ≈${-D} mEq: más K⁺ del que el cuerpo había perdido.` : 'El depósito corporal está lleno.')
                + ' La ficha: 200-400 mEq por cada 1 mEq/l; más de 800-1.000 con K⁺ &lt;2.' + enlace('hp-deficit');
        }
        const mot = motivosIV(m, r);
        poner('via', E['hp-via'], 'innerHTML', (pendiente ? 'Primero confirmar el K⁺. ' : '') + (mot.length
            ? `<strong>Vía i.v. indicada</strong>: ${mot.join(' · ')}.` : '<strong>Vía oral</strong>: sin criterios de vía i.v. de la ficha.') + enlace('hp-via-iv,hp-fig6'));
        const pistas = [];
        if (c.orina) pistas.push(`K⁺ en orina <strong>${c.orina === 'baja' ? 'bajo (&lt;15 mmol/l)' : 'alto (&gt;15 mmol/l)'}</strong> → ${c.orina === 'baja' ? 'el riñón lo maneja bien (extrarrenal o paso a la célula)' : 'pérdida renal'}`);
        if (c.gaso) pistas.push(`Gasometría: ${c.gaso}`);
        if (c.ta) pistas.push(`TA: ${c.ta}`);
        poner('pistas', E['hp-pistas'], 'innerHTML', pistas.length ? 'Pistas: ' + pistas.join(' · ') + enlace('hp-dx-orina,hp-dx-gaso') : 'Pistas diagnósticas: la ficha no las da para esta causa.');
        const e = S.entrado, p = S.perdido;
        poner('rep', E['hp-reparto'], 'textContent', `Repuesto: i.v. ${Math.round(e.iv)} mEq (máx. ${PERF.maxDia}/día) · oral ${Math.round(e.oral)} mEq · Perdido: orina ${Math.round(p.orina)}, heces ${Math.round(p.heces)} mEq`);
        poner('reloj', E['hp-reloj'], 'textContent', fmtT(S.t));
        poner('avisos', E['hp-avisos'], 'innerHTML', avisos(m, r));
        poner('play', E['hp-play'], 'textContent', S.t >= T_MAX ? 'Fin del reloj (12 h)' : S.corriendo ? '❚❚ Pausar' : '▶ Correr el reloj');
        for (const a of ACCIONES) {
            const dosis = S.dados[a.id] || [];
            let estado, txt, off = false;
            if (a.id === 'iv') {
                estado = S.iv.activa ? `En curso desde ${fmtT(S.iv.desde)}.` : e.iv ? `Parada. Van ${Math.round(e.iv)} mEq.` : '';
                txt = S.iv.activa ? 'Parar' : e.iv ? 'Reanudar' : 'Iniciar';
            } else if (a.id === 'oral') {
                estado = dosis.length ? `${dosis.length} comprimido${dosis.length > 1 ? 's' : ''} (${dosis.length * a.meq} mEq). Absorbidos ≈${Math.round(e.oral)} mEq.` : '';
                txt = dosis.length ? 'Otro' : 'Dar'; off = !S.tolera;
            } else {
                const ac = act[a.id] ?? 0;
                estado = estadoDosis(dosis, S.t, S.c.cad && a.id === 'insulina' ? { ...a, fin: null } : a, ac);
                const enCurso = ac > 0 || (dosis.length && S.t - dosis[dosis.length - 1] < a.ini[1]);
                [txt, off] = !dosis.length ? ['Dar', false] : a.repetible && !enCurso && !(S.c.cad && a.id === 'insulina') ? ['Repetir', false] : ['Dado', true];
            }
            poner('est' + a.id, E['estado-' + a.id], 'textContent', estado);
            poner('dar' + a.id, E['dar-' + a.id], 'textContent', txt);
            poner('off' + a.id, E['dar-' + a.id], 'disabled', off);
        }
    }

    // ---------- Fotograma ----------
    let ultimo = 0;
    function paso(ahora = performance.now(), reanudar = false) {
        if (reanudar) ultimo = 0;
        const dt = ultimo ? clamp((ahora - ultimo) / 1000, 0, 0.1) : 0;
        ultimo = ahora;
        esc.tick(dt);
        if (S.corriendo) {
            const sub = (1.5 + S.t / 18) * (rapido ? 4 : 1) * dt / 4;
            for (let i = 0; i < 4 && S.t < T_MAX; i++) avanzar(sub);
            if (S.t >= T_MAX) { S.t = T_MAX; S.corriendo = false; }
        }
        const act = actividades(tiempos(), S.dados, S.t), m = modelo(act);
        const huecos = clamp(Math.round(S.D / MEQ_HUECO), 0, HUECOS);
        cuadrar(m);
        fichas(huecos);
        const r = rasgosECG(m.k), g = gravedad(m.k);
        leer(m, r, act);
        dibujar(m, act, g, huecos);
        esc.pintarECG(r, latido, `${r.u}${r.st}${r.arr}`);
    }

    function reiniciar() {
        const c = CAUSAS[E['hp-causa'].value];
        S = {
            c, t: 0, corriendo: false, dados: {}, repetido: false,
            tolera: E['hp-oral'].value === 'si', digoxina: E['hp-digoxina'].value === 'si', ecg: E['hp-ecg-modo'].value,
            iv: { activa: false, desde: 0 }, entrado: { iv: 0, oral: 0, fuga: 0 }, perdido: { orina: 0, heces: 0 },
            // el déficit inicial sale del K⁺ sin las redistribuciones de la causa
            D: deficitDesdeK(c.k + (c.desplazado || 0) - (c.salido || 0)),
        };
        Object.keys(contados).forEach(k => { contados[k] = 0; });
        E['hp-causa-detalle'].innerHTML = c.texto + enlace(c.fuente + (c.extra ? ',' + c.extra : ''));
        E['hp-nombre-insulina'].textContent = c.cad ? 'Insulina en perfusión (tratamiento de la cetoacidosis)' : 'Insulina';
        crearParticulas(modelo(actividades(tiempos(), S.dados, 0)));
        esc.reiniciarECG();
        paso();
    }

    // ---------- Controles ----------
    E['hp-play'].addEventListener('click', () => { if (S.t < T_MAX) { S.corriendo = !S.corriendo; paso(); } });
    E['hp-rapido'].addEventListener('click', () => {
        rapido = !rapido;
        E['hp-rapido'].setAttribute('aria-pressed', String(rapido));
        E['hp-rapido'].classList.toggle('hk-primario', rapido);
    });
    $('hp-reiniciar').addEventListener('click', reiniciar);
    E['hp-causa'].addEventListener('change', reiniciar);
    E['hp-oral'].addEventListener('change', () => { S.tolera = E['hp-oral'].value === 'si'; paso(); });
    E['hp-digoxina'].addEventListener('change', () => { S.digoxina = E['hp-digoxina'].value === 'si'; paso(); });
    E['hp-ecg-modo'].addEventListener('change', () => { S.ecg = E['hp-ecg-modo'].value; paso(); });
    for (const id of ['hp-iv-ritmo', 'hp-iv-conc', 'hp-iv-suero']) E[id].addEventListener('change', () => paso());
    E['hp-repetir'].addEventListener('click', () => { S.repetido = true; paso(); });
    visual.addEventListener('click', e => {
        const dar = e.target.closest('[data-dar]');
        if (!dar || dar.disabled) return;
        const id = dar.dataset.dar;
        if (id === 'iv') { S.iv.activa = !S.iv.activa; if (S.iv.activa) S.iv.desde = S.t; }
        else (S.dados[id] ||= []).push(S.t);
        paso();
    });
    enlazarTexto(visual, tab, texto);
    animarMientrasVisible(visual, paso);

    reiniciar();
}
