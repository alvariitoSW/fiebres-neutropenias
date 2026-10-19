// Río y mar: el agua del cuerpo (Libros → Marino → Fundamentos, junto a la
// fluidoterapia). Interfaz del modelo vivo: frase viva, dock de 5 pestañas
// (sueros, sangrado, sodio, solutos, paciente), lupas, interruptor
// Explorar | Conceptos | Mayéutica y la capa de estudio (recorrido de 14
// preguntas, repaso de lo fallado y 3 casos clínicos). La escena vive en
// agua-viva-escena.js; los datos, en js/data/agua-viva-data.js.
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="aguaViva" data-agua-viva="salino">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`).
// La Mayéutica guarda aciertos y fallos en localStorage (como el quiz), con
// clave propia y siempre dentro de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { iconoParticula } from '../../core/particulas.js';
import { escapeHtml } from '../../core/ui.js';
import { rutaDePanel } from '../../core/search.js';
import {
    FLUIDOS, ORDEN_FLUIDOS, PACIENTES, PERDIDAS, BUN_ALTO, CONCEPTOS, PREGUNTAS, CASOS, ESTADOS_ANCLA,
    estadoBase, copia, clamp, fmt, fmtL, dec, pruebasAguaViva,
} from '../../data/agua-viva-data.js';
import {
    $, estado, D, REDUCIR, Lupa, ocultos, initEscena, aplicarModelo, setOcultos, pintarLectura, medir, dibujar,
    arrancar, pintarUnaVez, ponerVisible, zonaEn, puntoDe, estadoBucle, vaciarFotogramas, SVG_BRILLO,
} from './agua-viva-escena.js';

let raiz = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   Frase viva, aplicar un estado y frases de cada cambio
   ============================================================ */
let fraseActual = '';
function decir(html, fuente) {
    const fraseEl = $('frase');
    const ilu = /ilustrativo|sin cifra/.test(fuente || '');
    const nuevo = `${html} ${fuente ? `<span class="agv-org${ilu ? ' agv-ilu' : ''}">${fuente}</span>` : ''}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('lienzo').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
}

function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo, op);
    sincronizarMandos();
    $('puente').hidden = !(D.salino > 0);
    if (op.frase !== false) { const [h, f] = fraseDe(viejo, nuevo); decir(h, f); }
    if (REDUCIR) pintarUnaVez(); else arrancar();
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };
const estadoDe = parcial => Object.assign(estadoBase(), copia(parcial || {}));

const FRASE_INICIO = () => estado.paciente === 'varon'
    ? ['Varón de 75 kg: 45 L de agua. <span class="hl">El río lleva solo 3 L</span>; la marisma, 13 L, y el mar de las células, 29 L.', 'ficha · mar-tabla-10-1']
    : ['Mujer de 60 kg: 30 L de agua. <span class="hl">El río es de 2 L</span>; la marisma, 8 L, y el mar, 20 L.', 'ficha · mar-tabla-10-1'];

function fraseHemorragia() {
    const c = D.clase, pct = estado.hemorragia;
    if (!c.n) return ['Sin hemorragia.', ''];
    const mlkg = Math.round(D.perdidaSangre / D.P.peso);
    const txt = {
        1: 'el relleno transcapilar la repone del todo; no hace falta volumen.',
        2: 'la PA se mantiene por vasoconstricción; la diuresis puede caer, sin llegar a oliguria. Se reanima con <span class="hl">cristaloides</span>.',
        3: '<span class="hl-rojo">shock</span>: hipotensión, oliguria y lactato alto. Se reanima con <span class="hl-rojo">sangre</span>.',
        4: '<span class="hl-rojo">shock avanzado</span>, puede ser irreversible. Transfusión masiva.',
    }[c.n];
    let reloj = '';
    if (estado.reloj === '1h') reloj = ` A la hora, <span class="hl-rojo">el Hto sigue en ${Math.round(D.hto)} %</span>: se pierde sangre entera.`;
    else if (estado.reloj === '8-12h') reloj = ` A las 8-12 h la marisma cede agua al río (${fmt(D.relleno)} mL): <span class="hl">el Hto baja a ${Math.round(D.hto)} %</span>.`;
    else reloj = ` En días, ADH y aldosterona retienen agua y sodio: el Hto sigue bajando (${Math.round(D.hto)} % solo con el relleno).`;
    const nota = c.n === 4 ? ' <span class="agv-org agv-ilu">Nota de fidelidad: la Tabla 15.1 da dos criterios para la clase IV, >40 % y >30 mL/kg, que no casan con una volemia de 66 mL/kg; aquí manda el %.</span>' : '';
    return [`${c.nombre} (${pct} %, ${fmt(D.perdidaSangre)} mL${c.n === 4 ? '' : `, ${mlkg} mL/kg`}): ${txt}${reloj}${nota}`, 'ficha · mc-hemorragico-clasificacion (Tabla 15.1, Fig. 15.1)'];
}
function fraseNa() {
    const na = Math.round(D.naMed);
    if (na < 135) return [`Na⁺ ${na}: plasma hipotónico, <span class="hl-rojo">el agua entra en las células</span>: el mar y la neurona se hinchan. Es exceso de agua, no falta de sodio.`, 'ficha · mr-osm-efectiva · mr-hiponatremia-tto'];
    if (na > 145) {
        const r = estado.reloj === '1h' ? ' Las neuronas empiezan a recuperar volumen a las 9 h.' : estado.reloj === '8-12h' ? ' Desde las 9 h, <span class="hl-azul">osmolitos</span>: la neurona empieza a recuperarse.' : ' En 48 h los osmolitos le devuelven el volumen: <span class="hl-rojo">corregir deprisa ahora daría edema</span>.';
        return [`Na⁺ ${na}: plasma hipertónico, <span class="hl-rojo">el agua sale de las células</span>.${r}`, 'ficha · mr-hiperna-cerebro'];
    }
    return [`Na⁺ ${na}: entre 135 y 145, el agua no entra ni sale de las células.`, 'ficha · mr-hiponatremia-dx · mr-hipernatremia'];
}

function fraseDe(v, n) {
    if (v.paciente !== n.paciente) {
        const [h, f] = FRASE_INICIO(); return [h + ` Volemia ≈ ${dec(D.V0 / 1000)} L.`, f + ' · mc-hemorragico-clasificacion'];
    }
    if (n.infusiones.length > v.infusiones.length) {
        const inf = n.infusiones[n.infusiones.length - 1], f = FLUIDOS[inf.f];
        let h = f.frase(inf.ml), fu = f.fuente;
        if (f.ref && inf.ml !== f.ref) { h += ' Cifras proporcionales a la Fig. 10.1.'; fu += ' · proporcional, ilustrativo'; }
        if (n.adh && f.hipotonico) { h += ' <span class="hl-rojo">Con ADH, ese agua se queda: el Na⁺ tiende a bajar</span> (la ficha no da cuánto).'; fu += ' · mr-estres-adh'; }
        if (inf.f.startsWith('alb') && n.albBaja) { h += ' Toda albúmina expande más si hay hipoalbuminemia.'; fu += ' · mar-albumina'; }
        if (n.hemorragia > 0 && inf.f !== 'sangre') { h += ` Hto ${Math.round(D.hto)} %: el fluido sin hematíes lo diluye.`; }
        return [h, fu];
    }
    if (n.bolos3 !== v.bolos3) {
        const f = FLUIDOS.salino3;
        if (n.bolos3 === 0) return ['Sin bolos de salino al 3 %.', ''];
        const av = D.avisos.length ? ' <span class="hl-rojo">' + D.avisos.join(' ') + '</span>' : ` Llevas +${D.subida} como mucho: dentro de los límites.`;
        return [f.frase() + av, f.fuente + ' · mr-sdo'];
    }
    if (n.periodo3 !== v.periodo3 && n.bolos3) { const av = D.avisos.length ? '<span class="hl-rojo">' + D.avisos.join(' ') + '</span>' : `+${D.subida} mEq/L: dentro de los límites.`; return [av, 'ficha · mr-tabla-35-3']; }
    if (n.hemorragia !== v.hemorragia || (n.reloj !== v.reloj && n.hemorragia > 0)) return fraseHemorragia();
    if (n.na0 !== v.na0 || (n.reloj !== v.reloj && D.posmEf > 295)) return fraseNa();
    if (n.reloj !== v.reloj) return ['El reloj cuenta en la hemorragia (Hto y relleno) y en la hipernatremia (osmolitos).', 'ficha · mc-hemorragico-clasificacion · mr-hiperna-cerebro'];
    if (n.glucosa !== v.glucosa) {
        if (n.glucosa <= 100) return [`Glucosa ${n.glucosa}: no cambia el Na⁺ medido (${Math.round(D.naMed)}).`, 'ficha · mr-hiperglucemia-na'];
        return [`Glucosa ${n.glucosa} sin insulina: no entra en las células y <span class="hl">les saca agua</span>. El Na⁺ medido baja a ${Math.round(D.naMed)}; <span class="hl-azul">corregido ${Math.round(D.naCorr)}</span> (2,4 por cada 100 mg/dL).`, 'ficha · mr-hiperglucemia-na (Ec. 35.5)'];
    }
    if (n.urea !== v.urea) {
        if (!n.urea) return [`Urea normal: Posm ${Math.round(D.posm)}, efectiva ${Math.round(D.posmEf)}.`, 'ficha · mr-osm-efectiva-calc'];
        return [`Urea alta (BUN ${BUN_ALTO}, valor de ejemplo): la Posm sube a ${Math.round(D.posm)}, pero la efectiva sigue en ${Math.round(D.posmEf)}. <span class="hl-azul">La urea cruza las membranas: hiperosmótica, no hipertónica.</span>`, 'ficha · mr-osm-efectiva-calc · BUN ilustrativo'];
    }
    if (n.adh !== v.adh) {
        if (!n.adh) return ['ADH en reposo.', ''];
        return ['Estrés: se libera ADH y el riñón retiene agua. <span class="hl-rojo">Los sueros hipotónicos, como el Ringer o el glucosado, añaden riesgo</span> de hiponatremia.', 'ficha · mr-estres-adh'];
    }
    if (n.perdida !== v.perdida) {
        if (!n.perdida) return ['Sin pérdidas.', ''];
        const p = PERDIDAS[n.perdida];
        return [`Pérdida de ${p.nombre}: Na⁺ ${p.na} frente a 140 del plasma. <span class="hl">Se pierde más agua que sal</span>: todo encoge y el Na⁺ tiende a subir (sin cifra).`, 'ficha · mr-tabla-35-1 · tamaño ilustrativo'];
    }
    if (n.albBaja !== v.albBaja || n.inflamacion !== v.inflamacion) {
        if (n.albBaja && n.inflamacion) return ['Albúmina baja e inflamación, que suelen ir juntas: <span class="hl-rojo">la marisma desborda los prados</span>.', 'ilustrativo · mar-agravantes'];
        if (n.albBaja) return ['Albúmina baja: hace el 80 % de la presión oncótica; si baja, <span class="hl-rojo">el agua pasa del río a la marisma</span>.', 'ilustrativo · mar-agravantes'];
        if (n.inflamacion) return ['Inflamación (shock séptico, SDRA): <span class="hl-rojo">la orilla deja pasar</span> más de lo normal.', 'ilustrativo · mar-agravantes'];
        return ['La orilla vuelve a la normalidad.', ''];
    }
    return FRASE_INICIO();
}

/* ============================================================
   Dock: fluidos, cantidad, infundir y el resto de mandos
   ============================================================ */
let fluidoSel = 'salino';
const cantidadSel = {};
ORDEN_FLUIDOS.forEach(k => { const f = FLUIDOS[k]; cantidadSel[k] = f.cantidades.includes(f.ref) ? f.cantidades.indexOf(f.ref) : 0; });
function chipsFluido() {
    $('chips-fluido').innerHTML = ORDEN_FLUIDOS.map(k => {
        const f = FLUIDOS[k];
        return `<button type="button" class="agv-chip-f" data-fluido="${k}" aria-pressed="${k === fluidoSel}">${iconoParticula(f.particula, 16)}<span>${f.corto}<small>${f.sub}</small></span></button>`;
    }).join('');
}
function mlSel() { const f = FLUIDOS[fluidoSel]; return f.bolo ? (estado.paciente === 'varon' ? 150 : 2 * PACIENTES[estado.paciente].peso) : f.cantidades[cantidadSel[fluidoSel]]; }
function pintarInfundir() {
    const f = FLUIDOS[fluidoSel]; const caja = $('cant-val');
    const infus = estado.infusiones.length;
    const b = $('btn-infundir');
    if (f.bolo) {
        $('cant-menos').disabled = estado.periodo3 === '2h'; $('cant-mas').disabled = estado.periodo3 === '24h';
        caja.innerHTML = `${estado.bolos3} bolo${estado.bolos3 === 1 ? '' : 's'}<br><small style="font-weight:400">− / + : en ${estado.periodo3 === '24h' ? '24 h' : estado.periodo3.replace('h', ' h')}</small>`;
        b.innerHTML = `Bolo de ${mlSel()} mL<small>2 mL/kg o 150 mL · Na⁺ hasta +2 por bolo</small>`;
        b.disabled = estado.bolos3 >= 6;
        return;
    }
    const i = cantidadSel[fluidoSel];
    $('cant-menos').disabled = i <= 0; $('cant-mas').disabled = i >= f.cantidades.length - 1;
    caja.textContent = fmtL(f.cantidades[i]);
    const hiperUsado = f.unaVez && estado.infusiones.some(x => x.f === fluidoSel);
    const tope = infus >= 8;
    b.disabled = hiperUsado || tope;
    b.innerHTML = `Infundir ${fmtL(f.cantidades[i])}` + (hiperUsado ? '<small>una sola dosis, como en la Fig. 10.1</small>' : tope ? '<small>tope del modelo: 8 infusiones</small>' : `<small>${f.dato}</small>`);
}
function elegirFluido(k) {
    fluidoSel = k;
    enRaiz('.agv-chip-f').forEach(o => o.setAttribute('aria-pressed', String(o.dataset.fluido === k)));
    pintarInfundir();
    raiz.querySelector(`.agv-chip-f[data-fluido="${k}"]`)?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
}
function pestana(tab) {
    enRaiz('.agv-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.agvTab === tab)));
    enRaiz('#agv-dock-explorar .agv-dock-panel').forEach(p => { p.hidden = p.dataset.agvPanel !== tab; });
}
function sincronizarMandos() {
    if ($('m-hemorragia').value != estado.hemorragia) $('m-hemorragia').value = estado.hemorragia;
    $('o-hemorragia').textContent = estado.hemorragia + ' %';
    const c = D.clase; const oc = $('o-clase'); oc.textContent = c.n ? `${c.nombre} · Hto ${Math.round(D.hto)} %` : 'Sin pérdida'; oc.className = 'agv-clase agv-c' + c.n;
    for (const id of ['m-reloj', 'm-reloj2']) $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === estado.reloj)));
    $('m-na').value = estado.na0; $('o-na').textContent = estado.na0;
    $('m-glucosa').value = estado.glucosa; $('o-glucosa').textContent = estado.glucosa;
    $('m-adh').setAttribute('aria-pressed', String(estado.adh)); $('m-urea').setAttribute('aria-pressed', String(estado.urea));
    enRaiz('[data-agv-perdida]').forEach(b => b.setAttribute('aria-pressed', String(estado.perdida === b.dataset.agvPerdida)));
    $('m-albbaja').setAttribute('aria-pressed', String(estado.albBaja)); $('m-inflamacion').setAttribute('aria-pressed', String(estado.inflamacion));
    $('m-paciente').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === estado.paciente)));
    pintarInfundir();
}
function engancharDock() {
    $('chips-fluido').addEventListener('click', e => { const b = e.target.closest('.agv-chip-f'); if (b) elegirFluido(b.dataset.fluido); });
    const PERIODOS = ['2h', '5h', '24h'];
    $('cant-menos').addEventListener('click', () => {
        if (FLUIDOS[fluidoSel].bolo) { cambiar(e => { e.periodo3 = PERIODOS[Math.max(0, PERIODOS.indexOf(e.periodo3) - 1)]; }); return; }
        cantidadSel[fluidoSel] = Math.max(0, cantidadSel[fluidoSel] - 1); pintarInfundir();
    });
    $('cant-mas').addEventListener('click', () => {
        if (FLUIDOS[fluidoSel].bolo) { cambiar(e => { e.periodo3 = PERIODOS[Math.min(2, PERIODOS.indexOf(e.periodo3) + 1)]; }); return; }
        cantidadSel[fluidoSel] = Math.min(FLUIDOS[fluidoSel].cantidades.length - 1, cantidadSel[fluidoSel] + 1); pintarInfundir();
    });
    $('btn-infundir').addEventListener('click', () => {
        const f = FLUIDOS[fluidoSel];
        if (f.bolo) { cambiar(e => { e.bolos3++; }); return; }
        cambiar(e => { e.infusiones.push({ f: fluidoSel, ml: f.cantidades[cantidadSel[fluidoSel]] }); });
    });
    enRaiz('.agv-dock-tabs button').forEach(b => b.addEventListener('click', () => pestana(b.dataset.agvTab)));
    $('m-hemorragia').addEventListener('input', e => cambiar(s => { s.hemorragia = +e.target.value; }));
    for (const id of ['m-reloj', 'm-reloj2']) $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (b) cambiar(s => { s.reloj = b.dataset.v; }); });
    $('m-na').addEventListener('input', e => cambiar(s => { s.na0 = +e.target.value; s.bolos3 = 0; s.fijo = {}; }));
    $('m-glucosa').addEventListener('input', e => cambiar(s => { s.glucosa = +e.target.value; }));
    $('m-adh').addEventListener('click', () => cambiar(s => { s.adh = !s.adh; }));
    $('m-urea').addEventListener('click', () => cambiar(s => { s.urea = !s.urea; }));
    enRaiz('[data-agv-perdida]').forEach(b => b.addEventListener('click', () => cambiar(s => { s.perdida = s.perdida === b.dataset.agvPerdida ? null : b.dataset.agvPerdida; })));
    $('m-albbaja').addEventListener('click', () => cambiar(s => { s.albBaja = !s.albBaja; }));
    $('m-inflamacion').addEventListener('click', () => cambiar(s => { s.inflamacion = !s.inflamacion; }));
    $('m-paciente').addEventListener('click', e => { const b = e.target.closest('button'); if (b && b.dataset.v !== estado.paciente) cambiar(s => { s.paciente = b.dataset.v; s.infusiones = []; s.hemorragia = 0; s.bolos3 = 0; s.fijo = {}; }); });
    $('m-reinicio').addEventListener('click', () => { const p = estado.paciente; const e = estadoBase(); e.paciente = p; aplicar(e, { reiniciar: true, frase: false }); decir(...FRASE_INICIO()); });

    // Lupas y toques en el estuario
    $('lupa-orilla').addEventListener('click', () => Lupa.abierta === 'orilla' ? Lupa.cerrar() : Lupa.abrir('orilla'));
    $('lupa-neurona').addEventListener('click', () => Lupa.abierta === 'neurona' ? Lupa.cerrar() : Lupa.abrir('neurona'));
    $('lupa-cerrar').addEventListener('click', () => Lupa.cerrar());
    $('lienzo').addEventListener('click', e => {
        const r = $('lienzo').getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
        let z = zonaEn(x, y); if (z === 'duna') z = 'mar';
        if (alTocar) { alTocar(z); return; }
        if (z === 'rio' || z === 'marisma') Lupa.abrir('orilla');
        else if (z === 'mar') Lupa.abrir('neurona');
    });
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
}
let alTocar = null;    // una pregunta puede pedir que se toque un sitio

/* Anillo dorado que late sobre lo que hay que mirar */
let anilloAnim = null;
function anillo(obj) {
    const a = $('anillo');
    if (anilloAnim) { anilloAnim.stop?.(); anilloAnim = null; }
    if (!obj) { a.hidden = true; return; }
    let x, y;
    const enLectura = obj === 'lectura' || obj === 'hto' || obj === 'na';
    if (enLectura) {
        const r = $('lectura').getBoundingClientRect(), r0 = $('escena').getBoundingClientRect();
        x = r.left - r0.left + r.width / 2; y = r.top - r0.top + r.height / 2;
    } else [x, y] = puntoDe(obj);
    const lado = enLectura ? 120 : 64;
    Object.assign(a.style, { left: x + 'px', top: y + 'px', width: lado + 'px', height: lado + 'px', margin: `-${lado / 2}px 0 0 -${lado / 2}px` });
    a.hidden = false;
    if (!REDUCIR && window.Motion) anilloAnim = window.Motion.animate(a, { transform: ['scale(0.85)', 'scale(1.12)', 'scale(0.85)'], opacity: [0.95, 0.5, 0.95] }, { duration: 1.4, repeat: Infinity, easing: 'ease-in-out' });
}

/* Iconos de las partículas: los de la tabla única (core/particulas.js) */
function iconos(cont) {
    cont.querySelectorAll('[data-agv-particula]').forEach(sp => {
        const k = sp.dataset.agvParticula;
        sp.classList.add('agv-icono');
        sp.innerHTML = k === 'brillo' ? SVG_BRILLO(16) : iconoParticula(k, 16);
    });
}

/* ============================================================
   Modos: Explorar | Conceptos | Mayéutica
   ============================================================ */
let modo = 'explorar';
const enEstudio = () => modo !== 'explorar';
// Sube hasta el principio de la herramienta si se ha bajado de ella.
function subir() {
    const r = raiz.getBoundingClientRect();
    if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function setModo(m) {
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('agv-estudio', m !== 'explorar');
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    alTocar = null; anillo(null); setOcultos([]);
    medir();
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    if (m === 'preguntas') Estudio.inicioPreguntas();
    if (m === 'explorar') decir(...fraseDe(estado, estado));
    if (REDUCIR) pintarUnaVez(); else arrancar();
    subir();
}

/* ============================================================
   «Ver en el texto»: cada fuente (ficha#elemento) es un enlace cruzado a su ficha
   ============================================================ */
function rutaDe(id) {
    const el = id && document.getElementById(id);
    if (!el) return null;
    const tab = el.classList.contains('tab-content') ? el : el.closest('.tab-content');
    const panel = tab?.closest('[id^="panel-"]');
    const nav = panel && rutaDePanel(panel.id);
    return nav ? { el, tab, panel: panel.id, nav } : null;
}
const tituloFicha = tab => (tab.querySelector('h3')?.textContent || tab.id).replace(/\s+/g, ' ').trim();
function etiquetaDe(el) {
    const dt = el.matches('dl') && el.querySelector('dt');
    if (dt) return dt.textContent.trim();
    const cab = el.matches('.micro-prof-item') && el.querySelector('.micro-prof-head span');
    if (cab) return cab.textContent.trim();
    return null;
}
function botonFicha(r, texto) {
    return `<button type="button" class="agv-ir-texto" data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}"${r.el !== r.tab ? ` data-resaltar="#${r.el.id}"` : ''}>${escapeHtml(texto)} →</button>`;
}
function verEnTexto(fuente) {
    let tabPrevio = null; const vistos = new Set();
    const trozos = fuente.split(' · ').map(t => {
        const m = t.trim().match(/^(#?)([a-z0-9-]+)(?:#([a-z0-9-]+))?\s*(.*)$/i);
        if (!m) return `<span class="agv-org">${t}</span>`;
        const [, rel, a, b, resto] = m;
        const idEl = rel ? a : b || a, idTab = rel ? tabPrevio : a;
        const r = rutaDe(idEl) || rutaDe(idTab);
        if (!r) return `<span class="agv-org">${t}</span>`;
        tabPrevio = r.tab.id;
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : null;
        let texto = vistos.has(r.tab.id) ? (sub || tituloFicha(r.tab)) : tituloFicha(r.tab) + (sub ? ' · ' + sub : '');
        vistos.add(r.tab.id);
        if (resto) texto += ' ' + resto;
        return botonFicha(r, texto.length > 70 ? texto.slice(0, 68) + '…' : texto);
    });
    return `<p class="agv-fuente-p">Ver en el texto: ${trozos.join(' ')}</p>`;
}

/* ============================================================
   Capa de estudio: Conceptos y Mayéutica (recorrido, repaso de lo fallado y casos)
   ============================================================ */
const TIPO_TXT = { test: 'Test · piensa antes', destapa: 'Piensa y destapa', error: 'Encuentra el error' };
function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
function barajar(ops, id) {   // orden fijo por pregunta, para que la buena no sea siempre la primera
    const a = ops.map((o, i) => ({ ...o, i })); const h = hash(id);
    for (let i = a.length - 1; i > 0; i--) { const j = (h >>> (i * 3)) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}
function ponerModelo(q) {
    aplicar(estadoDe(q.estado), { frase: false });
    if (q.lupa) Lupa.abrir(q.lupa); else if (Lupa.abierta) Lupa.cerrar();
    anillo(q.mirar || null);
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || []);
}
function pintarDock(items, izq, der) {
    $('dock-pasos').innerHTML = items.map(c => `<i class="${c.split(' ').filter(Boolean).map(x => 'agv-' + x).join(' ')}"></i>`).join('');
    $('dock-est-izq').textContent = izq || ''; $('dock-est-der').textContent = der || '';
}
function entrar(el) { el.classList.remove('agv-entra'); void el.offsetWidth; el.classList.add('agv-entra'); }
const verAbajo = el => el?.scrollIntoView?.({ block: 'nearest', behavior: REDUCIR ? 'auto' : 'smooth' });
const enlaceAcidobase = paso => `<div class="agv-fila"><button type="button" class="agv-b agv-link" data-especialidad="nefrologia" data-acidobase-vivo="${paso}">Ver en el ácido-base vivo →</button></div>`;

/* ---------- Una pregunta (sirve para el recorrido, el repaso y los pasos de un caso) ---------- */
function pintarPregunta(cont, q, { cabecera = '', repaso = null, alFinal }) {
    ponerModelo(q);
    const res = { ok: true, faltan: [] };
    let h = cabecera;
    h += `<div class="agv-cab-preg">${q.num ? `<span class="agv-num">${q.num}</span>` : ''}<span class="agv-tipo">${TIPO_TXT[q.tipo]}${q.tocar ? ' · predice y compruébalo' : ''}</span></div>`;
    h += `<p class="agv-pregunta">${q.enunciado}</p>`;
    if (q.calculadora) {
        const r = rutaDe(q.calculadora.ir);
        if (r) h += `<div class="agv-fila"><button type="button" class="agv-b agv-link" data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}" data-resaltar="#${r.el.id}">🧮 Abrir la calculadora «${q.calculadora.nombre}»<small>el caso te espera aquí: vuelve por Libros → Río y mar</small></button></div>`;
    }
    if (q.acidobase) h += enlaceAcidobase(q.acidobase);
    h += '<div id="agv-fmt"></div><div id="agv-q-res"></div>';
    if (q.tocar) h += `<div class="agv-mando" id="agv-mando" hidden>${mandoHTML(q.tocar)}<div class="agv-fila"><button class="agv-b agv-prim" type="button" data-accion="comprobar">Comprobar</button></div><p class="agv-pista" id="agv-pista" hidden></p></div><div id="agv-q-fin"></div>`;
    cont.innerHTML = h; entrar(cont);
    const fmtEl = cont.querySelector('#agv-fmt');
    let intentos = 0, piePendiente = '';

    // Las respuestas buenas no están en el HTML: se miran en los datos al contestar.
    if (q.tipo === 'test') {
        fmtEl.innerHTML = `<p class="agv-para">Piénsalo antes de ver las opciones.</p><div class="agv-fila"><button class="agv-b agv-prim" type="button" data-accion="ops">Ya lo tengo: ver opciones</button></div>
            <div class="agv-op" id="agv-ops" hidden>${barajar(q.opciones, q.id).map(o => `<button class="agv-b" type="button" data-op="${o.i}">${o.t}</button>`).join('')}</div>`;
    } else if (q.tipo === 'destapa') {
        const idx = repaso && repaso.faltan && repaso.faltan.length ? repaso.faltan : q.puntos.map((_, i) => i);
        fmtEl.innerHTML = `<p class="agv-para">${repaso && repaso.faltan && repaso.faltan.length ? `Vuelven solo los ${idx.length === 1 ? 'que te faltó' : idx.length + ' que te faltaron'}.` : `Contesta en la cabeza: ${q.cuantas || `son ${['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas', 'cinco cosas'][q.puntos.length]}`}. Luego destápalo.`}</p>
            <div class="agv-fila"><button class="agv-b agv-prim" type="button" data-accion="destapa">Ya lo tengo: destapar</button></div>
            <div class="agv-respuesta agv-entra" id="agv-pts" hidden><p class="agv-para">Marca, uno a uno, lo que tenías:</p>
            ${idx.map(i => `<label class="agv-punto"><input type="checkbox" data-p="${i}"> <span>${q.puntos[i]}</span></label>`).join('')}
            <div class="agv-fila"><button class="agv-b" type="button" data-accion="puntos">Hecho</button></div></div>`;
    } else if (q.tipo === 'error') {
        fmtEl.innerHTML = `<p class="agv-para">Toca las frases que creas falsas: puede haber 0, 1 o 2 errores.</p><div class="agv-op">${q.frases.map((f, i) =>
            `<button class="agv-frase-e" type="button" data-fr="${i}"><span class="agv-n">${i + 1}</span><span>${f.t}</span></button><div class="agv-correccion" id="agv-cfr${i}" hidden></div>`).join('')}</div>
            <div class="agv-fila"><button class="agv-b agv-prim" type="button" data-accion="corregir">Corregir</button></div>`;
    }
    entrar(fmtEl);
    const botonSig = () => `<div class="agv-fila"><button class="agv-b agv-prim" type="button" data-accion="sig">${q.ultimo ? 'Ver lo que te llevas' : 'Siguiente →'}</button></div>`;

    function cerrar(htmlRes) {
        const r = cont.querySelector('#agv-q-res');
        const pie = `${q.nota ? `<div class="agv-nota-fuentes">${q.nota}</div>` : ''}${verEnTexto(q.fuente)}`;
        if (q.tocar) {
            // primero se predice; ahora se comprueba en el modelo, y las cifras tapadas se destapan al comprobar
            r.innerHTML = `<div class="agv-respuesta agv-entra">${htmlRes}</div>`;
            const m = cont.querySelector('#agv-mando'); m.hidden = false; entrar(m);
            anillo(q.tocar.mirar || null);
            alTocar = q.tocar.mandos.includes('compartimento') ? z => { if (!z) return; cambiar(e => { e.tocado = z; }, { frase: false }); marcarTocado(cont); anillo(z); } : null;
            verAbajo(m);
            piePendiente = pie;
            return;
        }
        if (q.despues) aplicar(estadoDe(q.despues));
        setOcultos([]);
        r.innerHTML = `<div class="agv-respuesta agv-entra">${htmlRes}${pie}${botonSig()}</div>`;
        verAbajo(r.querySelector('[data-accion="sig"]'));
    }
    function finComprobar(html) {
        setOcultos([]); alTocar = null; cont.querySelectorAll('#agv-mando [data-mando]').forEach(b => { b.disabled = true; });
        const f = cont.querySelector('#agv-q-fin');
        f.innerHTML = `<div class="agv-respuesta agv-entra">${html}${piePendiente}${botonSig()}</div>`;
        verAbajo(f.querySelector('[data-accion="sig"]'));
    }

    cont.onclick = e => {
        const a = e.target.closest('[data-accion]')?.dataset.accion;
        if (a === 'comprobar') {
            const p = cont.querySelector('#agv-pista');
            if (q.tocar.comprobar(estado)) { p.hidden = true; e.target.closest('.agv-fila').remove(); finComprobar(`<span class="agv-ok">✓ Comprobado: ${q.tocar.confirma || 'el modelo lo confirma.'}</span>`); return; }
            intentos++;
            p.hidden = false;
            if (intentos < 2) { p.textContent = 'Aún no. ' + q.tocar.pista; return; }
            aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), {});
            if (q.tocar.bueno.tocado) anillo(q.tocar.bueno.tocado);
            p.textContent = q.tocar.pista + ' Te lo pongo en el modelo.';
            e.target.closest('.agv-fila').remove(); finComprobar(`<span class="agv-ok">Así queda: ${q.tocar.confirma || 'míralo en el modelo.'}</span>`); return;
        }
        if (a === 'ops') { cont.querySelector('#agv-ops').hidden = false; e.target.closest('.agv-fila').remove(); return; }
        if (a === 'destapa') { cont.querySelector('#agv-pts').hidden = false; e.target.closest('.agv-fila').remove(); return; }
        if (a === 'puntos') {
            const cajas = [...cont.querySelectorAll('#agv-pts input')];
            const faltan = cajas.filter(c => !c.checked).map(c => +c.dataset.p);
            cajas.forEach(c => { c.disabled = true; });
            e.target.closest('button').disabled = true;
            if (faltan.length) { res.ok = false; res.faltan = faltan; }
            const n = cajas.length - faltan.length;
            cerrar(`<span class="${faltan.length ? 'agv-mal' : 'agv-ok'}">${faltan.length ? `${n} de ${cajas.length}. Lo que te faltó vuelve en el repaso.` : `✓ ${cajas.length === 1 ? 'La tenías' : 'Todas'}. Esta no vuelve.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'corregir') {
            let bien = 0;
            cont.querySelectorAll('.agv-frase-e').forEach(b => {
                const f = q.frases[b.dataset.fr], m = b.classList.contains('agv-marcada'), ok = m === !!f.mal; if (ok) bien++;
                b.classList.remove('agv-marcada'); b.classList.add(ok ? 'agv-acierto' : 'agv-fallo'); b.disabled = true;
                if (f.mal) { const c = cont.querySelector('#agv-cfr' + b.dataset.fr); c.hidden = false; c.innerHTML = `<b>Era falsa.</b> ¿Cómo sería la frase buena? <button class="agv-b agv-link" type="button" data-ver="${b.dataset.fr}">Pensado: ver</button>`; }
            });
            e.target.closest('button').disabled = true;
            const nMal = q.frases.filter(f => f.mal).length;
            if (bien < q.frases.length) res.ok = false;
            cerrar(`<span class="${bien === q.frases.length ? 'agv-ok' : 'agv-mal'}">${bien} de ${q.frases.length} bien juzgadas. ${nMal === 0 ? 'No había ningún error.' : nMal === 1 ? 'Había un error.' : `Había ${nMal} errores: la ${q.frases.map((f, i) => f.mal ? i + 1 : 0).filter(Boolean).join(' y la ')}.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'sig') { anillo(null); alTocar = null; setOcultos([]); alFinal(res); return; }
        const ver = e.target.closest('[data-ver]');
        if (ver) { ver.parentElement.innerHTML = '<b>Corrección:</b> ' + q.frases[ver.dataset.ver].c; return; }
        const fr = e.target.closest('[data-fr]');
        if (fr && !fr.disabled) { fr.classList.toggle('agv-marcada'); return; }
        const op = e.target.closest('[data-op]');
        if (op && !op.disabled) {
            const o = q.opciones[op.dataset.op];
            cont.querySelectorAll('#agv-ops button').forEach(b => { b.disabled = true; });
            op.style.borderColor = o.ok ? 'var(--accent-green)' : 'var(--accent-red)'; op.style.opacity = 1;
            if (!o.ok) res.ok = false;
            cerrar(`<span class="${o.ok ? 'agv-ok' : 'agv-mal'}">${o.ok ? '✓ Bien' : '✗ Qué habría pasado'}</span>${o.ok ? '' : `<p>${o.porque}</p>`}<p>${q.explicacion}</p>`);
            return;
        }
        const m = e.target.closest('[data-mando]');
        if (m && !m.disabled) accionMando(m, cont);
    };
    cont.oninput = e => { const m = e.target.closest('[data-mando]'); if (m) accionMando(m, cont); };
}

function mandoHTML(t) {
    const partes = [`<p class="agv-para"><b style="color:var(--text-main)">Compruébalo en el modelo:</b> ${t.instruccion || ''}</p>`];
    for (const m of t.mandos) {
        if (m === 'compartimento') partes.push('<div class="agv-seg" data-grupo="tocado"><button type="button" data-mando="tocado" data-v="rio" aria-pressed="false">Río</button><button type="button" data-mando="tocado" data-v="marisma" aria-pressed="false">Marisma</button><button type="button" data-mando="tocado" data-v="mar" aria-pressed="false">Mar</button></div><p class="agv-para">o toca el estuario, arriba.</p>');
        else if (m === 'hemorragia') partes.push(`<label class="agv-desliza"><span>Hemorragia</span><input type="range" min="0" max="45" step="1" value="${estado.hemorragia}" data-mando="hemorragia" aria-label="Hemorragia, % de la volemia"><output>${estado.hemorragia} %</output></label>`);
        else if (m === 'reloj') partes.push(`<div class="agv-seg" data-grupo="reloj">${['1h', '8-12h', 'dias'].map(v => `<button type="button" data-mando="reloj" data-v="${v}" aria-pressed="${estado.reloj === v}">${v === 'dias' ? 'Días' : v.replace('h', ' h')}</button>`).join('')}</div>`);
        else if (m === 'glucosa') partes.push(`<label class="agv-desliza"><span>Glucosa</span><input type="range" min="90" max="600" step="10" value="${estado.glucosa}" data-mando="glucosa" aria-label="Glucosa sin insulina"><output>${estado.glucosa}</output></label>`);
        else if (m.startsWith('infundir:')) {
            const [, f, ml] = m.split(':'); const F = FLUIDOS[f];
            partes.push(`<button type="button" class="agv-b" data-mando="infundir" data-f="${f}" data-ml="${ml}"><span class="agv-icono" style="vertical-align:-3px;margin-right:6px">${iconoParticula(F.particula, 14)}</span>Infundir ${fmtL(+ml)} de ${F.nombre}</button>`);
        }
    }
    return partes.join('');
}
function accionMando(m, cont) {
    const tipo = m.dataset.mando;
    if (tipo === 'tocado') { cambiar(e => { e.tocado = m.dataset.v; }, { frase: false }); marcarTocado(cont); anillo(m.dataset.v); return; }
    if (tipo === 'hemorragia') { m.parentElement.querySelector('output').textContent = m.value + ' %'; cambiar(e => { e.hemorragia = +m.value; }); return; }
    if (tipo === 'glucosa') { m.parentElement.querySelector('output').textContent = m.value; cambiar(e => { e.glucosa = +m.value; }); return; }
    if (tipo === 'reloj') { cambiar(e => { e.reloj = m.dataset.v; }); m.parentElement.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === m))); return; }
    if (tipo === 'infundir') { cambiar(e => { e.infusiones.push({ f: m.dataset.f, ml: +m.dataset.ml }); }); }
}
function marcarTocado(cont) { cont.querySelectorAll('[data-mando="tocado"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === estado.tocado))); }

/* ---------- Aciertos y fallos guardados (como el quiz: solo en este dispositivo) ---------- */
const CLAVE_GUARDADO = 'agua-viva-mayeutica-v1';
function leerGuardado() {
    try { return JSON.parse(localStorage.getItem(CLAVE_GUARDADO)) ?? {}; }
    catch { return {}; }
}
// Por pregunta: { aciertos, fallos, resultado ('on'|'mal'), repasar, faltan }.
function guardar(id, ok, { resultado, fallo } = {}) {
    try {
        const g = leerGuardado();
        const a = g[id] ?? { aciertos: 0, fallos: 0 };
        ok ? a.aciertos++ : a.fallos++;
        if (resultado) a.resultado = resultado;
        a.repasar = !!fallo; a.faltan = fallo?.faltan ?? [];
        g[id] = a;
        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(g));
    } catch { /* localStorage no disponible */ }
}
function borrarGuardado() { try { localStorage.removeItem(CLAVE_GUARDADO); } catch { /* localStorage no disponible */ } }

/* ---------- Conceptos ---------- */
function accionConcepto(a) {
    if (a.anillo) { anillo(a.anillo); return; }
    if (a.poner) aplicar(estadoDe(a.poner));
    else if (a.cambiar) cambiar(e => Object.assign(e, copia(a.cambiar)));
    else if (a.sumar) cambiar(e => { e.infusiones.push({ ...a.sumar }); });
    else if (a.bolo) cambiar(e => { e.bolos3++; });
    if (a.lupa) Lupa.abrir(a.lupa);
}
const Estudio = {
    c: 0, i: 0, resultados: {}, fallos: {}, fase: 'inicio',
    cargar() {
        const g = leerGuardado();
        this.resultados = {}; this.fallos = {};
        for (const q of PREGUNTAS) {
            const a = g[q.id]; if (!a) continue;
            if (a.resultado) this.resultados[q.id] = a.resultado;
            if (a.repasar) this.fallos[q.id] = { faltan: a.faltan || [] };
        }
    },
    concepto(i) {
        this.c = clamp(i, 0, CONCEPTOS.length - 1);
        const k = CONCEPTOS[this.c], cont = $('concepto');
        aplicar(estadoDe(k.estado), { frase: false });
        if (k.lupa) Lupa.abrir(k.lupa); else if (Lupa.abierta) Lupa.cerrar();
        anillo(k.mirar || null);
        cont.innerHTML = `<div class="agv-cab-preg"><span class="agv-concepto-n">${this.c + 1}</span><h3>${k.titulo}</h3></div>
            <p class="agv-pregunta">${k.texto}</p>
            <div class="agv-mando"><p class="agv-para"><b style="color:var(--text-main)">Tócalo:</b> ${k.hacer}</p><div class="agv-fila">${k.acciones.map((a, j) => `<button class="agv-b" type="button" data-acc="${j}">${a.t}</button>`).join('')}</div></div>
            <p class="agv-para"><b style="color:var(--text-main)">Mira:</b> ${k.mira}</p>
            ${verEnTexto(k.fuente)}
            <div class="agv-nav-c"><button class="agv-b" type="button" data-nav="-1" ${this.c === 0 ? 'disabled' : ''}>← Anterior</button><button class="agv-b agv-prim" type="button" data-nav="1">${this.c === CONCEPTOS.length - 1 ? 'A la mayéutica →' : 'Siguiente →'}</button></div>`;
        entrar(cont);
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]'); if (a) { accionConcepto(CONCEPTOS[this.c].acciones[+a.dataset.acc]); return; }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); subir(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve el modelo');
    },

    /* ---------- Mayéutica ---------- */
    inicioPreguntas() {
        if (this.fase === 'caso' || this.fase === 'recorrido' || this.fase === 'repaso') { this.reanudar(); return; }
        this.fase = 'inicio';
        aplicar(estadoBase(), { frase: false }); if (Lupa.abierta) Lupa.cerrar();
        const cont = $('preg');
        const hechas = Object.keys(this.resultados).length;
        const bien = Object.values(this.resultados).filter(r => r === 'on').length;
        cont.innerHTML = `<div><span class="agv-eyebrow">Mayéutica</span><h2 style="margin:2px 0 0">Preguntas para pensar, como Sócrates</h2></div>
            <div class="agv-ruta"><span><b>1.</b> Recorrido: ${PREGUNTAS.length} preguntas, en el orden de las fichas; varias se responden tocando el estuario.</span>
            <span><b>2.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>3.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span></div>
            <div class="agv-fila"><button class="agv-b agv-prim" type="button" data-ir="recorrido">${hechas ? `Seguir el recorrido (${hechas} de ${PREGUNTAS.length})` : 'Empezar el recorrido'}</button><button class="agv-b" type="button" data-ir="casos">Ir a los casos</button></div>
            ${hechas ? `<p class="agv-para">Guardado en este dispositivo: ${bien} de ${hechas} bien a la primera. <button class="agv-b agv-link" type="button" data-ir="cero">Empezar de cero</button></p>` : ''}
            <p class="agv-para">El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde.</p>`;
        entrar(cont);
        cont.onclick = e => {
            const b = e.target.closest('[data-ir]'); if (!b) return;
            if (b.dataset.ir === 'cero') { borrarGuardado(); this.resultados = {}; this.fallos = {}; this.inicioPreguntas(); return; }
            b.dataset.ir === 'recorrido' ? this.recorrido(this.siguientePendiente()) : this.listaCasos();
        };
        pintarDock(PREGUNTAS.map(q => this.resultados[q.id] || ''), 'Mayéutica', '');
    },
    reanudar() {
        if (this.fase === 'caso') this.pasoCaso(); else if (this.fase === 'repaso') this.repaso(); else this.recorrido(this.i);
    },
    siguientePendiente() { const i = PREGUNTAS.findIndex(q => !this.resultados[q.id]); return i < 0 ? PREGUNTAS.length : i; },
    recorrido(i) {
        this.fase = 'recorrido'; this.i = i;
        if (i >= PREGUNTAS.length) { this.repaso(); return; }
        const q = PREGUNTAS[i];
        const nFallos = Object.keys(this.fallos).length;
        pintarDock(PREGUNTAS.map((p, j) => (this.resultados[p.id] === 'mal' ? 'mal' : this.resultados[p.id] ? 'on' : '') + (j === i ? ' aqui' : '')), `Recorrido · ${i + 1} de ${PREGUNTAS.length}`, nFallos ? `para repasar: ${nFallos}` : '');
        pintarPregunta($('preg'), { ...q, num: i + 1 }, { alFinal: r => {
            this.resultados[q.id] = r.ok ? 'on' : 'mal';
            if (!r.ok) this.fallos[q.id] = { faltan: r.faltan }; else delete this.fallos[q.id];
            guardar(q.id, r.ok, { resultado: this.resultados[q.id], fallo: this.fallos[q.id] });
            this.recorrido(i + 1); subir();
        } });
    },
    repaso() {
        this.fase = 'repaso';
        aplicar(estadoBase(), { frase: false }); if (Lupa.abierta) Lupa.cerrar();
        const ids = PREGUNTAS.filter(q => this.fallos[q.id]).map(q => q.id);
        const cont = $('preg');
        pintarDock(ids.map(() => 'mal'), 'Otra vez lo que fallaste', ids.length ? `quedan ${ids.length}` : '');
        if (!ids.length) {
            cont.innerHTML = '<span class="agv-eyebrow">Parte 2</span><h2 style="margin:0">No queda nada por repasar</h2><p class="agv-para">Has acertado todo, o ya lo repasaste.</p><div class="agv-fila"><button class="agv-b agv-prim" type="button" data-ir="casos">Ir a los casos clínicos →</button></div>';
        } else {
            cont.innerHTML = `<span class="agv-eyebrow">Parte 2</span><h2 style="margin:0">Otra vez lo que fallaste: ${ids.length}</h2>
                <p class="agv-para">Cada pregunta vuelve con el estuario en su estado. En las de destapar, solo vuelve lo que no marcaste. Un acierto la saca de la lista.</p>
                <div class="agv-repaso-chips">${ids.map(id => { const n = PREGUNTAS.findIndex(q => q.id === id); return `<button class="agv-b" type="button" data-rep="${id}">${n + 1} · ${PREGUNTAS[n].corto}</button>`; }).join('')}</div>
                <div class="agv-fila"><button class="agv-b agv-link" type="button" data-ir="casos">Saltar a los casos →</button></div>`;
        }
        entrar(cont);
        cont.onclick = e => {
            const b = e.target.closest('[data-rep]');
            if (b) {
                const n = PREGUNTAS.findIndex(q => q.id === b.dataset.rep), q = PREGUNTAS[n];
                pintarPregunta(cont, { ...q, num: n + 1 }, { repaso: this.fallos[q.id], cabecera: '<span class="agv-eyebrow">Repaso</span>', alFinal: r => {
                    if (r.ok) delete this.fallos[q.id];
                    else if (q.tipo === 'destapa' && this.fallos[q.id].faltan?.length) this.fallos[q.id].faltan = r.faltan.length ? r.faltan : this.fallos[q.id].faltan;
                    else this.fallos[q.id] = { faltan: r.faltan };
                    guardar(q.id, r.ok, { fallo: this.fallos[q.id] });
                    this.repaso(); subir();
                } });
                return;
            }
            if (e.target.closest('[data-ir="casos"]')) this.listaCasos();
        };
    },

    /* ---------- Casos clínicos ---------- */
    listaCasos() {
        this.fase = 'casos';
        aplicar(estadoBase(), { frase: false }); if (Lupa.abierta) Lupa.cerrar();
        const cont = $('preg');
        cont.innerHTML = `<span class="agv-eyebrow">Parte 3</span><h2 style="margin:0">Casos clínicos</h2>
            <p class="agv-para">El estuario se mueve al estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.</p>
            <div class="agv-casos-lista">${CASOS.map((c, k) => `<button class="agv-b" type="button" data-caso="${k}">${c.titulo}<small>${c.sub} · ${c.pasos.length} pasos</small></button>`).join('')}</div>`;
        entrar(cont);
        pintarDock(CASOS.map(() => ''), 'Casos clínicos', '');
        cont.onclick = e => { const b = e.target.closest('[data-caso]'); if (b) this.caso(+b.dataset.caso); };
    },
    caso(k) { this.fase = 'caso'; this.k = k; this.p = 0; this.ficha = {}; this.pasoCaso(); },
    pasoCaso() {
        const C0 = CASOS[this.k], paso = C0.pasos[this.p];
        if (this.p === 0) this.ficha = { ...C0.paciente };
        Object.assign(this.ficha, paso.datos || {});
        const nuevos = paso.nuevo || [];
        pintarDock(C0.pasos.map((_, j) => j < this.p ? 'on' : j === this.p ? 'on aqui' : ''), C0.corto, `paso ${this.p + 1} de ${C0.pasos.length}`);
        const cab = `<span class="agv-dia">${paso.momento}</span>
            <dl class="agv-paciente">${Object.entries(this.ficha).map(([kk, v]) => `<dt>${kk}</dt><dd class="${nuevos.includes(kk) ? 'agv-cambia' : ''}">${v}</dd>`).join('')}</dl>`;
        const q = { ...paso.pregunta, estado: paso.estado, lupa: paso.lupa, mirar: paso.mirar, ultimo: this.p === C0.pasos.length - 1,
            calculadora: paso.calculadora, acidobase: paso.acidobase };
        pintarPregunta($('preg'), q, { cabecera: cab, alFinal: r => {
            guardar(q.id, r.ok);
            if (this.p < C0.pasos.length - 1) { this.p++; this.pasoCaso(); subir(); }
            else this.finCaso();
        } });
    },
    finCaso() {
        const C0 = CASOS[this.k], cont = $('preg');
        this.fase = 'casos';
        const r = rutaDe(C0.volver.ficha.split(' ')[0]);
        cont.innerHTML = `<div class="agv-respuesta agv-entra"><span class="agv-eyebrow">Lo que te llevas · ${C0.corto}</span>
            <ol class="agv-lleva">${C0.lleva.map(t => `<li>${t}</li>`).join('')}</ol>
            <div class="agv-fila">${r ? `<button class="agv-b agv-link" type="button" data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}">📖 Repasar en la ficha: ${C0.volver.nombre}</button>` : ''}
            <button class="agv-b" type="button" data-fin="modelo">Abrir el modelo en el estado del paciente</button>
            <button class="agv-b" type="button" data-fin="otro">Otro caso</button></div></div>`;
        entrar(cont); subir();
        pintarDock(C0.pasos.map(() => 'on'), C0.corto, 'hecho');
        cont.onclick = e => {
            const a = e.target.closest('[data-fin]')?.dataset.fin;
            if (a === 'modelo') { const st = estadoDe(C0.volver.estado); setModo('explorar'); aplicar(st); }
            if (a === 'otro') this.listaCasos();
        };
    },
};

/* ============================================================
   Abrir en un estado (los botones de las fichas, los menús y el buscador)
   ============================================================ */
export function abrirEstado(clave) {
    const a = ESTADOS_ANCLA[clave] || ESTADOS_ANCLA.inicio;
    if (modo !== 'explorar') setModo('explorar');
    medir();
    if (Lupa.abierta) Lupa.cerrar();
    aplicar(estadoBase(), { reiniciar: true, frase: false });
    aplicar(estadoDe(a.estado));
    if (!a.estado || !Object.keys(a.estado).length) decir(...FRASE_INICIO());
    pestana(a.pestana || 'sueros');
    if (a.fluido) elegirFluido(a.fluido);
    if (a.lupa) Lupa.abrir(a.lupa);
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
export function init() {
    raiz = document.getElementById('agv-raiz');
    if (!raiz) return null;
    initEscena({ enEstudio });
    chipsFluido(); iconos(raiz); engancharDock();
    Estudio.cargar();
    pintarLectura(); sincronizarMandos(); decir(...FRASE_INICIO());

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--agv-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    // La vista se ve o deja de verse (todas las vistas están en el DOM): medir al aparecer.
    let anchoPrevio = 0, anchoVisible = 0, motionPedido = false;
    const lienzo = $('lienzo');
    new ResizeObserver(() => {
        const a = Math.round(lienzo.parentElement.clientWidth);
        document.body.classList.toggle('agv-activo', a > 0);
        if (!a) { anchoVisible = 0; return; }
        // Al aparecer la vista (desde un menú), se empieza por arriba.
        if (!anchoVisible) { const v = document.getElementById('agua-viva-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, la lupa abre sin muelle */ }); }
        if (a !== anchoPrevio) { anchoPrevio = a; medir(); if (REDUCIR) pintarUnaVez(); else arrancar(); }
    }).observe(lienzo.parentElement);
    new IntersectionObserver(es => ponerVisible(es[0].isIntersecting)).observe($('escena'));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada fluido frente al anexo de la maqueta y el estado del bucle.
    window.__agvPruebas = () => ({ ...pruebasAguaViva(), bucle: estadoBucle(), modo, fase: Estudio.fase, estado: copia(estado),
        ocultos: [...ocultos], guardado: leerGuardado(), vaciarFotogramas, dibujar });

    return { abrir: abrirEstado };
}
