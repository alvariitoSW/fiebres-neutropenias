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
// La Mayéutica es el motor común (core/mayeutica-motor.js): guarda aciertos y
// fallos en localStorage (como el quiz), con su clave propia y siempre dentro
// de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { verFrase as verFraseComun } from '../../core/frase-vista.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { iconoParticula } from '../../core/particulas.js';
import { crearMayeuticaModelo, entrar, pintarDock as pintarDockComun, crearGuardado, elegirDiasAtras, pintarDiasAtras, hoyLocal } from '../../core/mayeutica-motor.js';
import { MAYEUTICA_B1 } from '../../data/mayeutica/b1.js';
import { MAYEUTICA_B3 } from '../../data/mayeutica/b3.js';
import { enlacesFuente, origenEnlazado, citaExacta, hrefPdf } from '../../core/citas.js';
import { crearExplicacion } from '../../core/explicacion-guiada.js';
import {
    FLUIDOS, ORDEN_FLUIDOS, PACIENTES, PERDIDAS, BUN_ALTO, CONCEPTOS, PREGUNTAS, CASOS, ESTADOS_ANCLA, GUIAS, NOMBRE_ESTADO,
    estadoBase, copia, clamp, fmt, fmtL, dec, pruebasAguaViva, ORINA,
} from '../../data/agua-viva-data.js';
import {
    $, estado, D, REDUCIR, Lupa, ocultos, initEscena, aplicarModelo, setOcultos, pintarLectura, medir, dibujar,
    arrancar, pintarUnaVez, ponerVisible, ponerFormatoOrigen, zonaEn, puntoDe, estadoBucle, vaciarFotogramas, SVG_BRILLO,
} from './agua-viva-escena.js';

let raiz = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   Frase viva, aplicar un estado y frases de cada cambio
   ============================================================ */
let fraseActual = '';
// Que la frase viva quede a la vista sobre el dock (si no, sube la página lo justo).
const verFrase = () => verFraseComun($('frase'), { dock: $('dock'), margen: 6 });
function decir(html, fuente) {
    const fraseEl = $('frase');
    const ilu = /ilustrativo|sin cifra/.test(fuente || '');
    const guiaBtn = claveActual && GUIAS[claveActual] && !Guia.activo && modo === 'explorar' ? `<button type="button" class="agv-ir-estado" data-agv-guia="${claveActual}">Explícamelo →</button> ` : '';
    const nuevo = `${guiaBtn}${html} ${fuente ? `<span class="agv-org${ilu ? ' agv-ilu' : ''}">${origenHTML(fuente)}</span>` : ''}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    verFrase();
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
function fraseSeudo() {
    return [`Na⁺ medido ${Math.round(D.naMed)}, pero <span class="hl-azul">el del agua sigue en ${Math.round(estado.na0)}</span>: con proteínas de 12 g/dL o triglicéridos de 1.500 mg/dL la fase no acuosa del plasma crece. La Posm medida es normal (${Math.round(D.posm)}) y <span class="hl">la neurona no cambia</span>: no hay que tratarla. La ficha no dice cuánto baja el Na⁺.`, 'ficha · mr-pseudohipona · mr-pseudo-dx · dato del caso'];
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

function fraseOrina(o) {
    if (!o) return ['Sin dato de orina.', ''];
    if (o.vaso) return [o.subeMin
        ? `Con vasopresina la osmolalidad de la orina sube al menos un 50 % (de ${o.osm} a ≥ ${o.osmVaso}): <span class="hl-verde">DI central</span>; el riñón responde, falta la hormona.`
        : `Con vasopresina la orina no cambia (${o.osm}): <span class="hl-rojo">DI nefrogénica</span>; el riñón no responde a la ADH.`, 'ficha · mr-di-dx'];
    const na = Math.round(D.naMed);
    return [o.tipo === 'central'
        ? `Orina de ${o.osm} mOsm/kg y ${o.mlh} mL/h con Na⁺ ${na}: <span class="hl-rojo">orina casi sin solutos con plasma hipertónico</span>. En la central suele ser <200; la neurona se encoge.`
        : `Orina de ${o.osm} mOsm/kg (cifra ilustrativa): la nefrogénica da 200-500. <span class="hl-rojo">Orina diluida con plasma hipertónico</span>; falla la respuesta a la ADH.`, 'ficha · mr-di-dx · diuresis y Posm: dato del caso'];
}
function fraseDesmo(v, n) {
    if (n.desmo && n.adh) return [`Desmopresina con ADH por estrés: la Tabla 35.4 no la aconseja si la ADH no está regulada, y el estrés libera ADH sin control osmótico. <span class="hl-rojo">La tabla no dice si el estrés cuenta aquí: valóralo.</span>`, 'ficha · mr-tabla-35-4 · mr-estres-adh · las fuentes discrepan'];
    if (n.desmo && !n.restr) return [`Desmopresina 2 μg SC sin restricción hídrica: <span class="hl-rojo">la restricción es obligatoria</span>; sin ella el agua retenida puede dar una hiponatremia grave.`, 'ficha · mr-tabla-35-4'];
    if (n.desmo) return [`Desmopresina 2 μg SC cada 12 h con restricción hídrica: <span class="hl-verde">frena la diuresis acuosa</span>; la orina baja y el Na⁺ deja de subir (${Math.round(D.naMed)}). Cuánto baja la diuresis, la ficha no lo dice.`, 'ficha · mr-tabla-35-4 · sin cifra'];
    if (v.desmo) return ['Sin desmopresina: la diuresis acuosa sigue concentrando el sodio.', 'ficha · mr-sobrecorreccion'];
    return n.restr ? ['Restricción hídrica: se limita el agua que entra. Con desmopresina es obligatoria.', 'ficha · mr-tabla-35-4'] : ['Sin restricción hídrica.', ''];
}
function fraseSobre() {
    return [`Na⁺ ${Math.round(D.naMed)}${D.subida ? ` (+${D.subida})` : ''} con <span class="hl-rojo">diuresis acuosa de ${estado.orina.mlh} mL/h</span>: el agua que se pierde concentra el sodio y sube más de lo que dan los bolos (hasta 2 cada uno). Es más frecuente con tiazidas e intoxicación hídrica; la desmopresina la frena.`, 'ficha · mr-sobrecorreccion · mr-tabla-35-3 · Na⁺ y diuresis: dato del caso'];
}
function fraseDe(v, n) {
    if (n.desmo !== v.desmo || (n.restr !== v.restr && (n.desmo || v.desmo))) return fraseDesmo(v, n);
    if (n.orina && n.orina.tipo === 'acuosa' && (!v.orina || v.orina.tipo !== 'acuosa')) return fraseSobre();
    if (n.perdida === 'diuretico' && v.perdida !== 'diuretico') return [`Orina con furosemida: ~80 mEq/L de Na⁺, menos que el plasma (${Math.round(D.naMed)}). <span class="hl-rojo">Pierde más agua que sal: sola, la diuresis agrava la hipernatremia</span>; se combina con glucosado al 5 % (sin cifra de cuánto sube).`, 'ficha · mr-hiperna-hiper · mr-tabla-35-1'];
    if (JSON.stringify(v.orina) !== JSON.stringify(n.orina)) return fraseOrina(n.orina);
    if (n.pseudo !== v.pseudo && n.pseudo) return fraseSeudo();
    if (v.paciente !== n.paciente) {
        const [h, f] = FRASE_INICIO(); return [h + ` Volemia ≈ ${dec(D.V0 / 1000)} L.`, f + ' · mc-hemorragico-clasificacion'];
    }
    if (n.infusiones.length > v.infusiones.length) {
        const inf = n.infusiones[n.infusiones.length - 1], f = FLUIDOS[inf.f];
        let h = f.frase(inf.ml), fu = f.fuente;
        if (f.ref && inf.ml !== f.ref) { h += ' Cifras proporcionales a la Fig. 10.1.'; fu += ' · proporcional, ilustrativo'; }
        if (n.adh && f.hipotonico) { h += ' <span class="hl-rojo">Con ADH, ese agua se queda: el Na⁺ tiende a bajar</span> (la ficha no da cuánto).'; fu += ' · mr-estres-adh'; }
        if (inf.f.startsWith('alb') && n.albBaja) { h += ' Toda albúmina expande más si hay hipoalbuminemia.'; fu += ' · mar-albumina'; }
        if (n.perdida === 'diuretico' && inf.f === 'glucosado') { h += ' <span class="hl-verde">Con la diuresis de furosemida, repone el agua que se lleva</span>: la tendencia del Na⁺ deja de subir (sin cifra).'; fu += ' · mr-hiperna-hiper'; }
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
    $('m-orina').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === (estado.orina ? estado.orina.tipo : ''))));
    $('m-vaso').disabled = !estado.orina || estado.orina.tipo === 'acuosa'; $('m-vaso').setAttribute('aria-pressed', String(!!(estado.orina && estado.orina.vaso)));
    $('m-desmo').disabled = !estado.orina || estado.orina.tipo !== 'acuosa'; $('m-desmo').setAttribute('aria-pressed', String(estado.desmo));
    $('m-restr').setAttribute('aria-pressed', String(estado.restr));
    pintarSello();
    $('m-glucosa').value = estado.glucosa; $('o-glucosa').textContent = estado.glucosa;
    $('m-adh').setAttribute('aria-pressed', String(estado.adh)); $('m-urea').setAttribute('aria-pressed', String(estado.urea));
    enRaiz('[data-agv-perdida]').forEach(b => b.setAttribute('aria-pressed', String(estado.perdida === b.dataset.agvPerdida)));
    $('m-albbaja').setAttribute('aria-pressed', String(estado.albBaja)); $('m-inflamacion').setAttribute('aria-pressed', String(estado.inflamacion));
    $('m-paciente').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === estado.paciente)));
    pintarInfundir();
    sincronizarGuia();
}
// El sello de las consecuencias clínicas del sodio (REGLAS §1.14): sale solo, sin rehacer nada (el <p> existe desde el principio).
function pintarSello() {
    let t = '';
    if (D.sinRestr) t = 'Desmopresina sin restricción hídrica: el paciente retiene agua y puede caer en una hiponatremia grave (Marino, p. 14). La restricción es obligatoria.';
    else if (D.sobrecorr && !estado.desmo) t = `Sube ${D.subida} mEq/L: más de lo que dan los bolos. Con diuresis acuosa, el riesgo es la desmielinización osmótica (disartria, tetraparesia, enclaustramiento; Marino, p. 13-14).`;
    else if (D.avisos.some(a => /pasa del límite/.test(a))) t = 'Pasa del límite de la Tabla 35.3: riesgo de desmielinización osmótica (Marino, p. 13).';
    const sello = $('sello'); sello.hidden = !t; if (sello.textContent !== t) sello.textContent = t;
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
    $('m-na').addEventListener('input', e => cambiar(s => { s.na0 = +e.target.value; s.bolos3 = 0; s.pseudo = false; s.fijo = {}; s.desmo = false; s.restr = false; }));
    $('m-orina').addEventListener('click', e => { const b = e.target.closest('button'); if (b) cambiar(s => { s.desmo = false; s.orina = b.dataset.v ? { tipo: b.dataset.v, osm: ORINA[b.dataset.v].osm, mlh: ORINA[b.dataset.v].mlh, vaso: false } : null; }); });
    $('m-vaso').addEventListener('click', () => cambiar(s => { if (s.orina) s.orina.vaso = !s.orina.vaso; }));
    $('m-desmo').addEventListener('click', () => cambiar(s => { if (s.orina && s.orina.tipo === 'acuosa') s.desmo = !s.desmo; }));
    $('m-restr').addEventListener('click', () => cambiar(s => { s.restr = !s.restr; }));
    $('m-glucosa').addEventListener('input', e => cambiar(s => { s.glucosa = +e.target.value; }));
    $('m-adh').addEventListener('click', () => cambiar(s => { s.adh = !s.adh; }));
    $('m-urea').addEventListener('click', () => cambiar(s => { s.urea = !s.urea; }));
    enRaiz('[data-agv-perdida]').forEach(b => b.addEventListener('click', () => cambiar(s => { s.perdida = s.perdida === b.dataset.agvPerdida ? null : b.dataset.agvPerdida; })));
    $('m-albbaja').addEventListener('click', () => cambiar(s => { s.albBaja = !s.albBaja; }));
    $('m-inflamacion').addEventListener('click', () => cambiar(s => { s.inflamacion = !s.inflamacion; }));
    $('m-paciente').addEventListener('click', e => { const b = e.target.closest('button'); if (b && b.dataset.v !== estado.paciente) cambiar(s => { s.paciente = b.dataset.v; s.infusiones = []; s.hemorragia = 0; s.bolos3 = 0; s.pseudo = false; s.fijo = {}; s.desmo = false; s.restr = false; }); });
    $('m-reinicio').addEventListener('click', () => { const p = estado.paciente; const e = estadoBase(); e.paciente = p; aplicar(e, { reiniciar: true, frase: false }); decir(...FRASE_INICIO()); });

    // Lupas y toques en el estuario
    $('lupa-orilla').addEventListener('click', () => Lupa.abierta === 'orilla' ? Lupa.cerrar() : Lupa.abrir('orilla'));
    $('lupa-neurona').addEventListener('click', () => Lupa.abierta === 'neurona' ? Lupa.cerrar() : Lupa.abrir('neurona'));
    $('lupa-tubo').addEventListener('click', () => Lupa.abierta === 'tubo' ? Lupa.cerrar() : Lupa.abrir('tubo'));
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
    if (guia && guia.activo) guia.cerrar();
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('agv-estudio', m !== 'explorar');
    raiz.classList.toggle('agv-mayeutica', m === 'preguntas');   // la entradilla da la respuesta de la ag-01
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    alTocar = null; anillo(null); setOcultos([]);
    medir();
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    if (m === 'preguntas') entrarMayeutica();
    if (m === 'explorar') decir(...fraseDe(estado, estado));
    if (REDUCIR) pintarUnaVez(); else arrancar();
    subir();
}

/* ============================================================
   «Ver en el texto» y los chips de origen: la pieza común de las citas (core/citas.js)
   ============================================================ */
const verEnTexto = fuente => `<p class="agv-fuente-p">${enlacesFuente(fuente, { clase: 'agv-ir-texto', claseOrg: 'agv-org' })}</p>`;
// Un texto de origen («ficha · mar-fig-10-1 · proporcional: ilustrativo»): cada ficha citada pasa a ser un enlace a
// ella con su título; lo demás («ficha», «ilustrativo», «sin cifra»…) queda como texto (core/citas.js).
const origenHTML = texto => origenEnlazado(texto, { clase: 'agv-org-ir', corta: true });
// Los chips de origen escritos en el HTML o en los textos de las preguntas («ficha · …») se enlazan al pintarse.
// En los datos, los ids van en data-org (<span class="agv-org" data-org="ficha · mr-…">ficha</span>): nunca se leen.
function enlazarOrigenes(cont) {
    cont.querySelectorAll('span.agv-org').forEach(sp => {
        const org = sp.dataset.org || sp.textContent;
        if (sp.dataset.enlazado !== undefined || sp.children.length || !/^ficha · /.test(org)) return;
        sp.innerHTML = origenHTML(org);
        sp.dataset.enlazado = '';
    });
}

/* ============================================================
   Capa de estudio: Conceptos (aquí) y Mayéutica (recorrido, repaso de lo fallado y casos: el motor común,
   core/mayeutica-motor.js; aquí solo sus enganches con el estuario)
   ============================================================ */
function ponerModelo(q) {
    aplicar(estadoDe(q.estado), { frase: false });
    if (q.lupa) Lupa.abrir(q.lupa); else if (Lupa.abierta) Lupa.cerrar();
    anillo(q.mirar || null);
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || []);
}
const pintarDock = (items, izq, der) => pintarDockComun('agv', items, izq, der);
const enlaceAcidobase = paso => `<div class="agv-fila"><button type="button" class="agv-b agv-link" data-especialidad="nefrologia" data-acidobase-vivo="${paso}">Ver en el ácido-base vivo →</button></div>`;

/* Mandos de «Compruébalo en el modelo» */
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
    c: 0,
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
        entrar(cont, 'agv');
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]'); if (a) { accionConcepto(CONCEPTOS[this.c].acciones[+a.dataset.acc]); return; }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); subir(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve el modelo');
    },
};

/* ---------- Mayéutica: el motor común con los enganches del estuario ---------- */
// Aciertos y fallos en localStorage con su clave de siempre (como el quiz: solo en este dispositivo).
let salinoDeTeresa = false;   // ¿eligió el salino en el paso 3 de Teresa? (su historia sigue sobre el salino)
const enganchesPregunta = {
    alEmpezar: ponerModelo,
    // Elegir una opción con consecuencia: el modelo pasa a ese estado; en el paso 3 de Teresa (el salino) se
    // recuerda para que los pasos siguientes sigan sobre el salino.
    alConsecuencia: (c, q) => { if (q.id === 'w4-3') salinoDeTeresa = true; ponerModelo({ ...q, estado: c.estado, mirar: c.mirar || q.mirar }); },
    enlazar: enlazarOrigenes,
    antes: q => q.acidobase ? enlaceAcidobase(q.acidobase) : '',
    verEnTexto: q => verEnTexto(q.fuente),
    alCerrar: q => { if (q.despues) aplicar(estadoDe(q.despues)); setOcultos([]); },
    alSalir: () => { anillo(null); alTocar = null; setOcultos([]); },
    tocar: {
        mandoHTML,
        alMostrar: (q, cont) => {
            anillo(q.tocar.mirar || null);
            alTocar = q.tocar.mandos.includes('compartimento') ? z => { if (!z) return; cambiar(e => { e.tocado = z; }, { frase: false }); marcarTocado(cont); anillo(z); } : null;
        },
        comprobar: q => q.tocar.comprobar(estado),
        ponerBueno: q => { aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), {}); if (q.tocar.bueno.tocado) anillo(q.tocar.bueno.tocado); },
        alComprobar: () => { setOcultos([]); alTocar = null; },
        accion: accionMando,
    },
};
const Mayeutica = crearMayeuticaModelo({
    p: 'agv', cont: () => $('preg'), clave: 'agua-viva-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { aplicar(estadoBase(), { frase: false }); if (Lupa.abierta) Lupa.cerrar(); },
    volverPor: 'Río y mar',
    pregunta: enganchesPregunta,
    textos: {
        ruta: () => `<span><b>1.</b> Recorrido: ${PREGUNTAS.length} preguntas, en el orden de las fichas; varias se responden tocando el estuario.</span>
            <span><b>2.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>3.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan.</span>`,
        empezar: 'Empezar el recorrido', seguir: 'Seguir el recorrido',
        pie: 'El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde.',
        conModelo: 'el estuario',
        casos: 'El estuario se mueve al estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
        abrirPaciente: 'Abrir el modelo en el estado del paciente',
    },
    preguntaDePaso: paso => {
        if (paso.pregunta.id === 'w4-3') salinoDeTeresa = false;
        return { estado: salinoDeTeresa && paso.estadoSalino ? paso.estadoSalino : paso.estado, lupa: paso.lupa, mirar: paso.mirar, acidobase: paso.acidobase };
    },
    abrirPaciente: C => { setModo('explorar'); ponerEnEstado(C.volver); },
});

/* ---------- Al abrir la Mayéutica: lo de días atrás (repaso espaciado) ---------- */
// Preguntas de las fichas de conceptos parecidos que el usuario ya contestó (lo guardan las fichas, en
// 'mayeutica-fichas-v1'). Solo si la Mayéutica empieza desde su inicio y la sesión aún no lo enseñó hoy.
const FICHAS_PARECIDAS = ['mar-cristaloides', 'mar-coloides', 'mar-retorno-venoso', 'mar-respuesta-fluidos', 'mc-hemorragico-clasificacion', 'mc-hemorragico-fluidos'];
let diasAtrasEnsenado = null;   // el día (local) en que esta sesión lo enseñó
function itemsDiasAtras() {
    const g = crearGuardado('mayeutica-fichas-v1').leer(), banco = { ...MAYEUTICA_B1, ...MAYEUTICA_B3 };
    const items = FICHAS_PARECIDAS.flatMap(f => [...(banco[f]?.guia || []), ...(banco[f]?.examen || [])].filter(q => g[q.id]).map(q => ({ q, ficha: f, a: g[q.id] })));
    return elegirDiasAtras(items, { hoy: hoyLocal(), max: 5 });
}
function entrarMayeutica() {
    const hoy = hoyLocal();
    if (!['caso', 'recorrido', 'repaso'].includes(Mayeutica.fase) && diasAtrasEnsenado !== hoy) {
        const items = itemsDiasAtras();
        if (items.length) {
            diasAtrasEnsenado = hoy;
            aplicar(estadoBase(), { frase: false }); if (Lupa.abierta) Lupa.cerrar();
            pintarDock(items.map(() => ''), 'Mayéutica', 'repaso de días atrás');
            const ficha = crearGuardado('mayeutica-fichas-v1');
            pintarDiasAtras($('preg'), items, {
                p: 'agv', hoy, pregunta: () => ({ ids: true, ...enganchesPregunta }),
                // sin `resultado`: no pisa el del recorrido de la ficha
                guardar: (q, r) => ficha.guardar(q.id, r.ok, { fallo: r.ok ? undefined : { faltan: r.faltan } }),
                alFinal: () => Mayeutica.entrar(),
            });
            return;
        }
    }
    Mayeutica.entrar();
}

/* ============================================================
   Abrir en un estado (los botones de las fichas, los menús y el buscador)
   ============================================================ */
// Deja el modelo en un estado, con el dock en su pestaña y su fluido y la lupa que toque:
// { estado, pestana, fluido, lupa }. Lo usan los estados con nombre y la vuelta de un caso.
function ponerEnEstado(a) {
    medir();
    if (Lupa.abierta) Lupa.cerrar();
    aplicar(estadoBase(), { reiniciar: true, frase: false });
    aplicar(estadoDe(a.estado));
    if (!a.estado || !Object.keys(a.estado).length) decir(...FRASE_INICIO());
    pestana(a.pestana || 'sueros');
    if (a.fluido) elegirFluido(a.fluido);
    if (a.lupa) Lupa.abrir(a.lupa);
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde el otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú): se abre como estaba.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('agv-volver'), raiz, origen);
    if (!clave) { requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' })); return; }
    if (guia && guia.activo) guia.cerrar();
    if (modo !== 'explorar') setModo('explorar');
    ponerEnClave(ESTADOS_ANCLA[clave] ? clave : 'inicio');
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

// Un estado con nombre: el modelo en ese estado y la clave recordada (su explicación guiada).
let poniendo = false;
function ponerEnClave(k) {
    poniendo = true; claveActual = k;
    try { ponerEnEstado(ESTADOS_ANCLA[k]); } finally { poniendo = false; }
    sincronizarGuia();
    decirConGuia();
}
// La pastilla «Explícamelo» delante de la frase que dejó el estado (si la frase no cambió, no se repinta sola)
function decirConGuia() {
    const f = $('frase');
    if (!claveActual || !GUIAS[claveActual] || Guia.activo || modo !== 'explorar' || f.querySelector('[data-agv-guia]')) return;
    f.insertAdjacentHTML('afterbegin', `<button type="button" class="agv-ir-estado" data-agv-guia="${claveActual}">Explícamelo →</button> `);
    fraseActual = f.innerHTML;
}

/* ============================================================
   La explicación guiada de cada estado (core/explicacion-guiada.js): sus pasos van en el dock, en el sitio de los
   mandos; cada paso pone el estuario como lo cuenta (paso.e sobre el estado), abre su lupa y señala lo que cuenta
   (el anillo del estuario con paso.mirar, o un marco con paso.resalta). «Ver en la ficha» lleva al párrafo exacto.
   ============================================================ */
let claveActual = null, guia = null;
const Guia = { get activo() { return !!guia && guia.activo; } };
// ¿Está el estuario en este estado con nombre?
const enEstado = k => !!ESTADOS_ANCLA[k] && JSON.stringify(estado) === JSON.stringify(estadoDe(ESTADOS_ANCLA[k].estado));
function sincronizarGuia() {
    if (claveActual && !poniendo && !enEstado(claveActual) && !Guia.activo) claveActual = null;
    const g = $('guia-abrir');
    if (g) { g.disabled = !claveActual || !GUIAS[claveActual]; $('guia-de').textContent = claveActual ? `«${NOMBRE_ESTADO[claveActual]}»` : 'Elige antes un estado'; }
    enRaiz('#agv-chips-estado [data-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === claveActual)));
}
function crearGuia() {
    guia = crearExplicacion({
        cont: $('dock-guia'), raiz,
        alPaso(paso) {
            const a = ESTADOS_ANCLA[guia.datos.clave];
            aplicar(estadoDe(Object.assign(copia(a.estado || {}), copia(paso.e || {}))), { frase: false });
            const lupa = 'lupa' in paso ? paso.lupa : a.lupa;
            if (lupa) { if (Lupa.abierta !== lupa) Lupa.abrir(lupa); } else if (Lupa.abierta) Lupa.cerrar();
            anillo(paso.mirar || null);
            subirEscena();
        },
        alSalir(d) {
            anillo(null);
            $('dock-explorar').hidden = modo !== 'explorar';
            if (d && d.clave && modo === 'explorar') { ponerEnClave(d.clave); requestAnimationFrame(() => $('guia-abrir').focus({ preventScroll: true })); }
            sincronizarGuia();
        },
        citaOpciones: { clase: 'cita', max: 90 },
    });
}
function subirEscena() {
    const r = $('escena-bloque').getBoundingClientRect();
    if (Math.abs(r.top) > 4) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function explicar(clave) {
    if (!GUIAS[clave] || modo !== 'explorar') return;
    if (claveActual !== clave || !enEstado(clave)) ponerEnClave(clave);
    claveActual = clave;
    $('dock-explorar').hidden = true;
    $('frase').querySelector('[data-agv-guia]')?.remove();   // mientras explica, la pastilla sobra
    guia.abrir({ clave, titulo: NOMBRE_ESTADO[clave], pasos: GUIAS[clave], fuentes: ESTADOS_ANCLA[clave].fuentes });
    sincronizarGuia();
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
export function init() {
    raiz = document.getElementById('agv-raiz');
    if (!raiz) return null;
    initEscena({ enEstudio });
    chipsFluido(); iconos(raiz); engancharDock(); crearGuia();
    $('chips-estado').innerHTML = Object.keys(ESTADOS_ANCLA).map(k => `<button type="button" data-estado="${k}" aria-pressed="false">${NOMBRE_ESTADO[k]}</button>`).join('');
    $('chips-estado').addEventListener('click', ev => { const b = ev.target.closest('[data-estado]'); if (!b) return; if (guia.activo) guia.cerrar(); ponerEnClave(b.dataset.estado); $('escena-bloque').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' }); });
    raiz.addEventListener('click', ev => { const g = ev.target.closest('[data-agv-guia]'); if (g && modo === 'explorar') explicar(g.dataset.agvGuia); });
    $('guia-abrir').addEventListener('click', () => { if (claveActual) explicar(claveActual); });
    enlazarOrigenes(raiz);
    ponerFormatoOrigen(origenHTML);   // los orígenes de los mareógrafos, también con su enlace
    Mayeutica.cargar();
    pintarLectura(); sincronizarMandos(); decir(...FRASE_INICIO());

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--agv-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    raiz.addEventListener('click', () => requestAnimationFrame(() => requestAnimationFrame(verFrase)));
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
    new IntersectionObserver(es => ponerVisible(es[es.length - 1].isIntersecting)).observe($('escena'));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada fluido frente al anexo de la maqueta y el estado del bucle.
    window.__agvPruebas = () => ({ ...pruebasAguaViva(), bucle: estadoBucle(), modo, fase: Mayeutica.fase, estado: copia(estado),
        ocultos: [...ocultos], guardado: Mayeutica.prog.g.leer(), vaciarFotogramas, dibujar });
    window.__agvGuias = () => ({ clave: claveActual, guia: guia && guia.activo ? { clave: guia.datos.clave, paso: guia.paso, n: guia.datos.pasos.length } : null,
        citas: Object.entries(GUIAS).flatMap(([k, ps]) => ps.flatMap(pa => [].concat(pa.cita || []).map(c => ({ estado: k, ficha: c.ficha, id: c.id, exacta: citaExacta(c), ficha_existe: !!document.getElementById(c.ficha), pdf: hrefPdf(c) })))) });

    return { abrir: abrirEstado };
}
