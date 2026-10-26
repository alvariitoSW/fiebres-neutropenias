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

import { montarVisual } from '../../core/visual-kit.js';
import { clamp, pintarGauge } from '../../core/ui.js';
import {
    tratamientoHiperpotasemia as TABLA, farmacosHiperpotasemia as FARMACOS,
    gruposHiperpotasemia as GRUPOS, causasHiperpotasemia as CAUSAS,
    magnitudesHiperpotasemia as MAG,
} from '../../data/hiperpotasemia-data.js';
import {
    VASO, CEL, actividades, estadoDosis, enlazarTexto, crearPoner, animarMientrasVisible,
    crearEscena, onda, azar, coma, fmtT, enlace, alfa, CLARO,
} from './potasio-escena.js';
import { leyendaParticulas } from '../../core/particulas.js';

const TAB_ID = 'fisio-hiperpotasemia';
const POR_MEQ = 4, K_MIN = 3.5, T_MAX = 720;
const DESPLAZAN = FARMACOS.filter(f => f.grupo === 'desplaza');
const ELIMINAN = FARMACOS.filter(f => f.grupo === 'elimina');
const GRAVEDAD = [['Sin hiperpotasemia', ''], ['Ligera', ''], ['Moderada', 'yellow'], ['Grave', 'red']];
const ESTADO_GAUGE = ['ok', 'ok', 'warn', 'danger'];

// ---------- Vista Texto: la tabla de tratamiento, desde los datos ----------
function renderTablaTratamiento() {
    const tbody = document.getElementById('hk-tto-tabla');
    if (!tbody || tbody.rows.length) return;
    tbody.innerHTML = TABLA.map(f =>
        `<tr id="hk-tto-${f.id}"><td>${f.agente}</td><td>${f.dosis}</td><td>${f.tiempo}</td><td>${f.mecanismo}</td></tr>`).join('');
}

export function initHiperpotasemiaSim() {
    renderTablaTratamiento();
    montarVisual(TAB_ID, montar);
}

// ---------- Marcado de la vista Visual ----------
const MARCADO = `
<p class="visual-guia">El K⁺ es una nube de cuadrados que vive en el plasma, en la célula o sale del cuerpo. Cada medida hace una sola cosa: el calcio <span class="hl hl-azul">protege</span> el corazón (no baja el K⁺), insulina, salbutamol y bicarbonato lo <span class="hl hl-azul">meten</span> en la célula y diuréticos, captores y diálisis lo <span class="hl hl-azul">sacan</span> del cuerpo. Elige la causa, da los fármacos de la tabla y corre el reloj.</p>
<div class="hk-escenario">
  <div class="hk-campo"><label for="hk-causa">Causa</label><select id="hk-causa">${Object.entries(CAUSAS).map(([k, c]) => `<option value="${k}">${c.etiqueta}</option>`).join('')}</select></div>
  <p class="hk-causa-detalle" id="hk-causa-detalle"></p>
  <div class="hk-campo"><label for="hk-renal">Función renal</label><select id="hk-renal"><option value="ok">Conservada</option><option value="ir">Insuficiencia renal grave</option></select></div>
  <div class="hk-campo"><label for="hk-ecg-modo">ECG</label><select id="hk-ecg-modo"><option value="tipico">Cambios típicos para el K⁺ (Fig. 9)</option><option value="ninguno">Normal pese al K⁺ alto</option><option value="precoz">Cambios ya con K⁺ moderado</option></select></div>
</div>
<div class="hk-escena">
  <canvas id="hk-escena" aria-label="Simulación del potasio entre plasma, célula, corazón, analítica y vías de salida"></canvas>
  <canvas id="hk-ecg" class="hk-ecg" aria-label="Electrocardiograma"></canvas>
</div>
${leyendaParticulas([
    { clave: 'k', nombre: 'K⁺ en el plasma', color: '--text-main' },
    { clave: 'k', nombre: 'K⁺ que entra en el plasma', color: '--accent-red' },
    { clave: 'k', nombre: 'K⁺ metido en la célula', color: '--accent-blue', halo: '--accent-blue' },
    { clave: 'k', nombre: 'K⁺ de la célula', color: '--accent-blue', opacidad: 0.4 },
    { clave: 'k', nombre: 'K⁺ fuera del cuerpo', color: '--accent-green' },
    { clave: 'na', nombre: 'Na⁺ que saca la bomba' },
])}
<div class="hk-marcador">
  <div class="hk-k" id="hk-k" aria-live="polite"></div>
  <span class="grade-badge" id="hk-gravedad"></span>
  <div class="hk-k-real hk-fila" id="hk-k-real" hidden><span id="hk-k-real-txt"></span><button type="button" class="visual-mini hk-primario" id="hk-repetir">Repetir la analítica</button></div>
  <div class="hk-nota hk-fila" id="hk-ecg-texto"></div>
  <div class="kinetic-row hk-fila" id="hk-riesgo-row">
    <div class="kinetic-label"><span>Riesgo cardíaco</span><strong id="hk-riesgo-num"></strong></div>
    <div class="kinetic-track"><div class="kinetic-fill" id="hk-riesgo-fill"></div></div>
  </div>
  <div class="hk-nota hk-fila" id="hk-riesgo-txt"></div>
  <div class="hk-nota hk-fila" id="hk-reparto"></div>
</div>
<div class="hk-avisos" id="hk-avisos" aria-live="polite"></div>
<div class="hk-revision" id="hk-revision" aria-live="polite"></div>
<div class="hk-controles">
  <button type="button" class="visual-mini hk-primario" id="hk-play"></button>
  <button type="button" class="visual-mini" id="hk-rapido" aria-pressed="false">×4</button>
  <button type="button" class="visual-mini" id="hk-reiniciar">Reiniciar</button>
  <span class="hk-reloj" id="hk-reloj"></span>
</div>
<div id="hk-farmacos" class="hk-farmacos">${Object.entries(GRUPOS).map(([g, info]) =>
    `<p class="section-label">${info.rotulo}</p>` + FARMACOS.filter(f => f.grupo === g).map(f => `
  <div class="hk-farmaco"><span class="hk-tira" style="background:${info.color}"></span>
    <div><div class="hk-nombre">${f.nombre}</div>
      <div class="hk-meta">${f.tiempo || 'Inicio/duración: ' + TABLA.find(t => t.id === f.fila).tiempo}</div>
      ${f.fidelidad ? `<div class="hk-fidelidad">${f.fidelidad}</div>` : ''}
      <div class="hk-estado" id="hk-estado-${f.id}"></div></div>
    <div class="hk-acciones"><button type="button" class="visual-mini hk-dar" id="hk-dar-${f.id}" data-dar="${f.id}">Dar</button>
      <button type="button" class="visual-link" data-ver="hk-tto-${f.fila}${f.extra ? ',' + f.extra : ''}" aria-label="Ver ${f.nombre} en el texto">Texto ↓</button></div>
    <div class="hk-efecto" id="hk-efecto-${f.id}" aria-live="polite"></div></div>`).join('')).join('')}
</div>
<p class="hk-aviso-modelo">Modelo didáctico. Los tiempos de inicio y duración salen de la tabla de la ficha; la ficha no dice cuántos mEq/l mueve cada medida ni a qué ritmo sale el K⁺ en cada causa, así que esas cantidades son ilustrativas. "Minutos/hora" (diálisis) y "horas" (diuréticos) no son cifras cerradas: en el modelo la diálisis empieza en unos minutos y ambos siguen mientras corre el reloj. Los puntos no están a escala: en la célula hay 150 mEq/l frente a 4 en el plasma.</p>`;

// ---------- Modelo (sin DOM) ----------
const actividadRuta = (act, ruta) => Math.max(...ELIMINAN.filter(f => f.ruta === ruta).map(f => act[f.id]));

function modelo(S, act) {
    const c = S.c;
    const anadido = S.anadido.acido + S.anadido.lisis + S.anadido.aporte;
    const eliminado = S.eliminado.orina + S.eliminado.heces + S.eliminado.dial;
    let desplazado = 0;
    for (const f of DESPLAZAN) {
        const mag = typeof f.magnitud === 'number' ? f.magnitud
            : c.acido ? Math.min(f.magnitud.conAcidosis, S.anadido.acido) : f.magnitud.sinAcidosis;
        desplazado += mag * act[f.id];
    }
    desplazado = clamp(desplazado, 0, Math.max(0, c.base + anadido - eliminado - K_MIN));
    const k = c.base + anadido - eliminado - desplazado;
    return {
        k, desplazado, eliminado,
        medido: k + (c.pseudo && !S.repetido ? c.pseudo : 0),
        calcio: act.calcio,
        bomba: Math.min(1, act.insulina + act.salbutamol),
    };
}

function avanzar(S, dt) {
    const c = S.c;
    if (c.acido) S.anadido.acido = Math.min(c.acido, S.anadido.acido + c.acido * dt / 4);
    if (c.aporte) S.anadido.aporte = Math.min(c.aporte, S.anadido.aporte + c.aporte * dt / 15);
    if (c.lisis) S.anadido.lisis += c.lisis * dt / 60;
    const act = actividades(FARMACOS, S.dados, S.t), m = modelo(S, act);
    if (S.renal === 'ok') S.eliminado.orina += MAG.renalBasal * clamp((m.k - 4.5) / 0.5, 0, 1) * dt / 60;
    const freno = clamp((m.k - K_MIN) / 0.6, 0, 1);
    for (const f of ELIMINAN) {
        if (!act[f.id]) continue;
        const enIR = f.id === 'diuretico' && S.renal === 'ir' ? MAG.diureticoEnIR : 1;
        S.eliminado[f.ruta] += f.magnitud * act[f.id] * (dt / 60) * freno * enIR;
    }
    S.picoDesplazado = Math.max(S.picoDesplazado, m.desplazado);
    S.t += dt;
}

// ---------- ECG y gravedad (Figuras 9 y 7 de la ficha) ----------
// Las T picudas son siempre el primer cambio, así que "hay cambios" = r.t.
function rasgosECG(S, k) {
    if (S.ecg === 'ninguno') return { t: false, qrs: false, fv: false };
    return { t: k >= (S.ecg === 'precoz' ? 5 : 6.2), qrs: k >= 7, fv: k >= 8 };
}
// Figura 7: 5-6 ligera (moderada con ECG), 6,1-6,5 moderada (grave con ECG), >6,5 grave.
const nivelGravedad = (k, ecg) => k > 6.5 ? 3 : k > 6 ? 2 + ecg : k >= 5 ? 1 + ecg : 0;
function textoECG(S, r) {
    if (S.ecg === 'ninguno') return '<strong>ECG sin cambios.</strong> La ficha avisa: baja sensibilidad, puede haber arritmias con cualquier grado.' + enlace('hk-ecg-sensibilidad');
    if (r.fv) return '<strong>Arritmia ventricular</strong> (taquicardia, fibrilación) → paro cardíaco. Figura 9: &gt;8 mEq/l.' + enlace('hk-fig9');
    if (r.qrs) return '<strong>↑PR, se pierde la onda P, ↑QRS</strong>, con T picudas. Figura 9: &gt;7 mEq/l.' + enlace('hk-fig9');
    if (r.t) return (S.ecg === 'precoz' ? '<strong>Ondas T picudas</strong> con un K⁺ por debajo de lo típico: el ECG no sigue al número.' : '<strong>Ondas T picudas.</strong> Figura 9: ≈6,5 mEq/l.') + enlace('hk-fig9');
    return 'Sin cambios típicos. Baja sensibilidad: no descarta riesgo.' + enlace('hk-ecg-sensibilidad');
}

// Frases de la propia ficha que aparecen según lo que se hace.
function avisos(S, m, r, nivel) {
    const a = [], c = S.c, dado = id => (S.dados[id] || []).length > 0;
    if (c.pseudo && !S.repetido) a.push(['danger', 'Antes de tratar, confirma con una nueva analítica: una muestra hemolizada da un K⁺ falsamente alto.' + enlace('hk-confirmar')]);
    if (c.pseudo && Object.keys(S.dados).length) a.push(['danger', 'El K⁺ real del paciente es normal: tratar baja un potasio que no estaba alto.']);
    if (r.t && !dado('calcio')) a.push(['danger', 'Hay cambios en el ECG: la ficha pone el gluconato cálcico como primera medida.' + enlace('hk-tto-nota')]);
    if (r.t && dado('calcio') && m.calcio === 0) a.push(['danger', 'El efecto del calcio (30-60 min) ya ha pasado y el ECG sigue alterado: está sin protección.']);
    if (S.ecg === 'ninguno' && nivel === 3) a.push(['warn', 'ECG normal con K⁺ grave: la gravedad sigue siendo grave (Figura 7).' + enlace('hk-fig7')]);
    if (m.k > 6 && !c.pseudo) a.push(['warn', 'K⁺ &gt;6 mmol/l: monitorización ECG aunque no haya cambios típicos.' + enlace('hk-monitorizacion')]);
    if (dado('salbutamol') && !dado('insulina')) a.push(['warn', 'La monoterapia con β-agonistas falla en el 20-40% de los pacientes; con insulina-glucosa es más eficaz.']);
    if (S.picoDesplazado > 0.3 && m.desplazado < S.picoDesplazado - 0.25 && m.eliminado < 0.5) a.push(['danger', 'El K⁺ vuelve a subir: meterlo en la célula no lo saca del cuerpo.']);
    if (dado('bicarbonato') && !c.acido) a.push(['warn', 'Sin acidosis el bicarbonato aporta poco: la ficha lo reserva para la acidosis metabólica concomitante.']);
    if (dado('diuretico') && S.renal === 'ir') a.push(['warn', 'Con insuficiencia renal grave el diurético apenas saca K⁺: la hemodiálisis es el método más rápido y seguro en IR grave.']);
    if (dado('dialisis')) a.push(['warn', 'Diálisis con baños sin glucosa, para no estimular la liberación de insulina.']);
    if (c.aporte && S.renal === 'ok' && S.t > 30) a.push(['warn', 'Con el riñón conservado, el K⁺ del aporte se va por la orina: la ficha dice que el aporte solo es relevante si hay insuficiencia renal.']);
    if (c.lisis && S.t > 120 && m.eliminado < 0.5) a.push(['warn', 'La célula sigue soltando K⁺: hace falta sacarlo del cuerpo, no solo desplazarlo.']);
    return a.map(([e, x]) => `<div class="tfg-estado tfg-estado-${e}">${x}</div>`).join('');
}

// ---------- Mecanismo prioritario y revisión por objetivos ----------
// Lo prioritario sale del estado que ya calcula el simulador: ECG alterado sin
// protección → calcio; K⁺ ≥5 (Figura 7) → bajarlo; y sin salida iniciada → sacarlo.
const dadoAlguna = (S, lista) => lista.some(f => (S.dados[f.id] || []).length > 0);
const enCurso = (S, f, act) => { const d = S.dados[f.id] || []; return act[f.id] > 0 || (d.length > 0 && S.t - d[d.length - 1] < f.ini[1]); };
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);

// Qué hace la medida `f` sobre el mecanismo, antes de registrar la dosis.
function efectoMedida(S, f, m, r, act) {
    const papel = GRUPOS[f.grupo].papel, fila = 'hk-tto-' + f.fila;
    const salida = dadoAlguna(S, ELIMINAN), alto = m.k >= 5;
    const sin = motivo => ({ util: false, texto: `<strong>${f.nombre}</strong>: no trata el mecanismo prioritario: ${motivo}. No cambia nada.`, ver: fila });
    const verbo = papel.replace(/^(protege|mete|saca)/, '<span class="hl hl-azul">$1</span>');
    const pista = { protege: 'Mira el corazón y el ECG.', desplaza: 'Mira los K⁺ que entran en la célula.', elimina: 'Mira los K⁺ que salen por su vía.' }[f.grupo];
    const si = extra => ({ util: true, texto: `<strong>${f.nombre}</strong>: ${verbo}${extra ? ' ' + extra : ''} <span class="hk-pista">${pista}</span>`, ver: fila });
    if (S.c.pseudo && !S.repetido) return sin('lo primero es confirmar el K⁺ con una nueva analítica, porque el valor puede ser falso');
    if (S.c.pseudo) return sin('el K⁺ real del paciente es normal');
    const ecgSinProteger = r.t && !enCurso(S, FARMACOS.find(x => x.id === 'calcio'), act);
    if (f.grupo === 'protege') {
        if (ecgSinProteger) return si('Es lo prioritario: el ECG está alterado.' + ((S.dados.calcio || []).length ? ' Su efecto anterior ya había terminado (30-60 min, tabla) y el ECG seguía alterado.' : ''));
        return sin(r.t ? 'el ECG ya está protegido' : 'el ECG no tiene cambios que proteger');
    }
    if (f.grupo === 'desplaza') {
        if (f.id === 'bicarbonato' && !S.c.acido) return sin('sin acidosis metabólica el bicarbonato aporta poco: la ficha lo reserva para la acidosis concomitante');
        if (!alto) return sin(salida ? 'la salida ya está iniciada y el K⁺ está en zona' : 'el K⁺ ya está en zona');
        return si(ecgSinProteger ? 'Antes, protege la membrana con calcio.' : salida ? '' : 'Falta la salida del cuerpo.');
    }
    const sostener = m.desplazado > 0.3;
    if (!alto && !sostener) return sin('el K⁺ ya está en zona y no hay nada que sostener');
    if (!alto && salida) return sin('la salida ya está iniciada y el K⁺ está en zona');
    if (f.id === 'diuretico' && S.renal === 'ir') return { util: false, texto: `<strong>${f.nombre}</strong>: saca el K⁺ por el riñón, pero con insuficiencia renal grave apenas actúa; la hemodiálisis es el método más rápido y seguro en IR grave.`, ver: fila };
    // «Evita que vuelva a subir…»: consecuencia de fisiología general, no es una frase de la ficha.
    const dial = f.id === 'dialisis' ? 'La ficha la sitúa en IR grave o si fallan las medidas previas.' : '';
    return si([alto ? '' : 'Evita que vuelva a subir cuando acabe lo desplazado (fisiología general).', dial].filter(Boolean).join(' '));
}

// Tres objetivos al acabar el reloj, sin nota: cumplido (✓) o falta (✗), con el mecanismo.
const ARTICULO = { diuretico: 'los diuréticos de asa', csz: 'el ciclosilicato de zirconio (CSZ)', patiromero: 'el patirómero', dialisis: 'la diálisis' };
// Un ECG alterado sin calcio en curso más de 10 min (el final del «5-10 min» de inicio del calcio en la tabla) cuenta como sin proteger.
const UMBRAL_SIN_PROTEGER = FARMACOS.find(f => f.id === 'calcio').ini[1];
function revision(S, m) {
    const sal = ELIMINAN.filter(f => (S.dados[f.id] || []).length > 0);
    const salEfi = sal.filter(f => !(f.id === 'diuretico' && S.renal === 'ir'));
    const desp = DESPLAZAN.some(f => (S.dados[f.id] || []).length > 0);
    const calcio = (S.dados.calcio || []).length > 0;
    const el = (cumple, titulo, porque, ver) => ({ cumple, titulo, porque, ver });
    // Criterio ilustrativo del simulador: la ficha pone el calcio como «primera medida» ante cambios en el ECG; se da por
    // buena si se da en los primeros minutos de ECG alterado (≤10 min, final del «5-10 min» de inicio del calcio en la tabla).
    const aTiempo = calcio && S.tCalcio0 - S.tECG0 <= UMBRAL_SIN_PROTEGER;
    const largo = `⚠ El efecto del calcio dura 30-60 min (tabla) y el ECG siguió alterado ${fmtT(S.sinProt)} sin protección; lo que lo acorta es bajar el K⁺.${enlace('hk-tto-calcio')}`;
    const ecg = !S.huboECG
        ? el(true, 'ECG protegido', S.c.pseudo ? 'El K⁺ real era normal: no había nada que proteger.' : 'No hubo cambios en el ECG que proteger. Aun así, el ECG tiene baja sensibilidad: no descarta riesgo.', 'hk-ecg-sensibilidad')
        : aTiempo
            ? { ...el(true, 'ECG protegido', 'El calcio se dio en cuanto el ECG se alteró: protege la membrana, aunque no baja el K⁺ (criterio ilustrativo del simulador).', 'hk-tto-calcio'), aviso: S.sinProt > UMBRAL_SIN_PROTEGER ? largo : '' }
            : !calcio && S.sinProt <= UMBRAL_SIN_PROTEGER
                ? el(true, 'ECG protegido', 'El ECG estuvo alterado menos de 10 min (criterio ilustrativo del simulador).', 'hk-tto-calcio')
                : el(false, 'ECG protegido', calcio ? 'El calcio se dio tarde: la ficha lo pone como primera medida ante cambios en el ECG, y antagoniza el efecto cardíaco aunque no baje el K⁺.'
                    : 'Hubo cambios en el ECG y no se protegió la membrana: el calcio antagoniza el efecto cardíaco aunque no baje el K⁺.', 'hk-tto-calcio');
    const zona = m.k < 5
        ? el(true, 'K⁺ por debajo de 5', (S.kMax < 5 ? 'El K⁺ no llegó a 5 mEq/l (umbral de hiperpotasemia de la ficha).' : `El K⁺ ha bajado a ${coma(m.k)} mEq/l, por debajo de 5 (umbral de hiperpotasemia de la ficha, Figura 7).`)
            + (m.k <= 3.6 ? ' Está en el límite de la hipopotasemia (<3,5 en la ficha).' : ''), m.k <= 3.6 ? 'hk-fig7' : 'hk-fig7')
        : el(false, 'K⁺ por debajo de 5', salEfi.length ? `El K⁺ sigue en ${coma(m.k)} mEq/l: la salida iniciada no ha bastado. ${S.renal === 'ir' ? 'La hemodiálisis es el método más rápido y seguro en IR grave.' : 'La ficha reserva la hemodiálisis para IR grave o si fallan las medidas previas.'}`
            : !desp ? `El K⁺ sigue en ${coma(m.k)} mEq/l: el calcio no lo baja y ninguna medida lo metió en la célula ni lo sacó del cuerpo.`
            : `El K⁺ sigue en ${coma(m.k)} mEq/l: lo que se mete en la célula vuelve al plasma cuando acaba su efecto; solo la salida del cuerpo lo baja de forma sostenida.`, salEfi.length ? 'hk-tto-nota' : 'hk-tto-diuretico,hk-tto-captores,hk-tto-dialisis');
    const necesita = S.kMax >= 5 && !S.c.pseudo;
    const salida = salEfi.length ? el(true, 'Salida iniciada', `Has puesto en marcha ${salEfi.map(f => ARTICULO[f.id]).join(' y ')}: saca el K⁺ del cuerpo.`, 'hk-tto-' + salEfi[0].fila)
        : sal.length ? el(false, 'Salida iniciada', 'Solo se dio el diurético y con insuficiencia renal grave apenas saca K⁺: la ficha pone la hemodiálisis como el método más rápido y seguro en IR grave.', 'hk-tto-dialisis')
        : !necesita ? el(true, 'Salida iniciada', 'No hacía falta: el K⁺ no llegó a 5 mEq/l.', 'hk-fig7')
            : el(false, 'Salida iniciada', 'Ninguna medida sacó el K⁺ del cuerpo: solo diuréticos, captores de potasio o diálisis lo eliminan; insulina y salbutamol solo lo guardan en la célula.', 'hk-tto-diuretico,hk-tto-captores,hk-tto-dialisis');
    return [ecg, zona, salida];
}
const htmlRevision = obj => '<p class="section-label">Revisión de las 12 h · sin nota</p>' + obj.map(o =>
    `<div class="tfg-estado tfg-estado-${o.cumple ? 'ok' : 'danger'}"><strong>${o.cumple ? '✓ Cumplido' : '✗ Falta'} · ${o.titulo}.</strong> ${o.porque}${enlace(o.ver)}</div>${o.aviso ? `<div class="tfg-estado tfg-estado-warn">${o.aviso}</div>` : ''}`).join('')
    + '<p class="hk-nota">Orientativa: los criterios (K⁺ por debajo de 5, ECG, salida del cuerpo) salen de la ficha; cuánto mueve cada medida es ilustrativo.</p>'
    + '<div><button type="button" class="visual-mini hk-primario" data-empezar>Empezar de nuevo</button></div>';

// ---------- Montaje de la vista ----------
function montar(tab, texto, visual) {
    visual.innerHTML = MARCADO;
    const $ = id => visual.querySelector('#' + id);
    const E = {}; // referencias a los elementos que se reescriben, buscadas una sola vez
    for (const id of ['hk-k', 'hk-gravedad', 'hk-k-real', 'hk-k-real-txt', 'hk-repetir', 'hk-ecg-texto', 'hk-riesgo-txt',
        'hk-riesgo-fill', 'hk-reparto', 'hk-avisos', 'hk-reloj', 'hk-play', 'hk-rapido', 'hk-revision', 'hk-causa', 'hk-renal', 'hk-ecg-modo', 'hk-causa-detalle']) E[id] = $(id);
    for (const f of FARMACOS) { E['estado-' + f.id] = $('hk-estado-' + f.id); E['efecto-' + f.id] = $('hk-efecto-' + f.id); E['dar-' + f.id] = $('hk-dar-' + f.id); }
    const poner = crearPoner();
    const esc = crearEscena(visual, { escena: 'hk-escena', ecg: 'hk-ecg' });
    const { C, reducido, rotulo, particulas, anillos } = esc;

    // ---------- Estado ----------
    let S, rapido = false;
    let P = [], FONDO = [], HPLUS = [], TUBO_K = [];
    const nacidos = { acido: 0, lisis: 0, aporte: 0 };

    // ---------- Partículas ----------
    const nuevaK = (pos, fuente) => ({ cat: 'plasma', x: pos.x, y: pos.y, ruta: [], vx: azar(0.15, 0.45), fuente });
    function crearParticulas() {
        HPLUS = [];
        nacidos.acido = nacidos.lisis = nacidos.aporte = 0;
        P = Array.from({ length: Math.round(S.c.base * POR_MEQ) }, () => nuevaK(esc.puntoPlasma()));
        FONDO = Array.from({ length: 70 }, () => ({ ...esc.puntoCelula(), fase: Math.random() * 6.28 }));
        TUBO_K = esc.puntosTubo(S.c.pseudo ? 10 : 0);
    }
    const mover = (p, cat) => { p.cat = cat; p.ruta = esc.rutaHacia(p, cat); };
    // K⁺ nuevo de una causa: el aporte entra desde fuera; la acidosis y la
    // lisis lo sacan de la célula por la membrana.
    function nacer(fuente) {
        if (fuente === 'aporte') {
            const { inicio, ruta } = esc.rutaEntrada('arriba');
            P.push({ ...nuevaK(inicio, fuente), ruta });
        } else {
            const p = nuevaK(esc.puntoCelula(), fuente);
            mover(p, 'plasma');
            P.push(p);
        }
    }
    // Recoloca partículas para que cada compartimento tenga las que dice el modelo.
    function cuadrar(m) {
        for (const f of ['acido', 'lisis', 'aporte']) {
            for (const n = Math.round(S.anadido[f] * POR_MEQ); nacidos[f] < n; nacidos[f]++) nacer(f);
        }
        const cuenta = { plasma: 0, celula: 0, orina: 0, heces: 0, dial: 0 }, libres = [];
        for (const p of P) { cuenta[p.cat]++; if (p.cat === 'plasma' && !p.ruta.length) libres.push(p); }
        const quiero = { celula: Math.round(m.desplazado * POR_MEQ) };
        for (const r of ['orina', 'heces', 'dial']) quiero[r] = Math.round(S.eliminado[r] * POR_MEQ);
        for (const cat of ['orina', 'heces', 'dial', 'celula']) {
            for (let falta = quiero[cat] - cuenta[cat]; falta > 0; falta--) {
                const p = libres.length ? libres.splice(Math.floor(Math.random() * libres.length), 1)[0] : P.find(q => q.cat === 'plasma');
                if (!p) break;
                mover(p, cat);
            }
        }
        for (let sobra = cuenta.celula - quiero.celula; sobra > 0; sobra--) mover(P.find(q => q.cat === 'celula'), 'plasma');
    }

    // ---------- Dibujo ----------
    function dibujar(m, act, nivel) {
        const c = S.c, reloj = esc.reloj;
        esc.limpiar();
        if (c.aporte) {
            const entrando = S.anadido.aporte < c.aporte;
            rotulo(entrando ? 'Aporte oral/IV ↓' : 'Aporte oral/IV', VASO.x + 46, 13, entrando ? C.ink : C.muted);
        }
        esc.vaso('PLASMA · ≈4 mEq/l normal · 2% del K⁺');
        const hemolisis = c.pseudo && !S.repetido;
        esc.tubo(m.medido, hemolisis ? { texto: 'hemolizada', puntos: TUBO_K, color: CLARO.rojo } : null);
        esc.celula('CÉLULA · 150 mEq/l · 98% del K⁺');
        if (c.lisis || c.acido) esc.roturas();
        const ir = S.renal === 'ir';
        esc.salidas([
            { clave: 'orina', a: Math.max(ir ? 0 : 0.5, act.diuretico * (ir ? MAG.diureticoEnIR : 1)), cerrado: ir, rot: ir ? 'Orina (IR grave)' : 'Orina' },
            { clave: 'heces', a: actividadRuta(act, 'heces') },
            { clave: 'dial', a: actividadRuta(act, 'dial') },
        ]);
        // K⁺ intracelular de fondo (el 98%)
        particulas(FONDO, 'k', { color: C.oro, r: 2, alfa: 0.3, ox: f => Math.sin(reloj * 0.6 + f.fase) * 1.2, oy: f => Math.cos(reloj * 0.5 + f.fase) * 1.2 });
        esc.bombas(m.bomba);
        // acidosis y lisis
        if (c.acido) {
            const bicarb = act.bicarbonato;
            if (!reducido && Math.random() < 0.1 * (1 - bicarb)) HPLUS.push({ x: azar(CEL.x + 30, CEL.x + CEL.w - 30), y: VASO.y + VASO.h - 2, vida: 1 });
            rotulo(bicarb > 0.5 ? 'Bicarbonato: sale H⁺, vuelve a entrar K⁺' : 'Acidosis: entra H⁺ y sale K⁺', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        }
        if (c.lisis) rotulo('Lisis: la célula rota suelta K⁺', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        HPLUS = HPLUS.filter(h => (h.vida -= 0.012) > 0);
        for (const h of HPLUS) { h.y += 0.7; esc.ctx.globalAlpha = h.vida; rotulo('H⁺', h.x, h.y, CLARO.rojo, 8, 'center'); }
        esc.ctx.globalAlpha = 1;
        // K⁺: mueve y agrupa por color para dibujar cada grupo en un trazado
        esc.moverParticulas(P);
        const grupos = { plasma: [], nuevo: [], celula: [], fuera: [] };
        for (const p of P) grupos[p.cat === 'plasma' ? (p.fuente && p.ruta.length ? 'nuevo' : 'plasma') : p.cat === 'celula' ? 'celula' : 'fuera'].push(p);
        particulas(grupos.plasma, 'k', { color: C.ink, r: 2.8 });
        particulas(grupos.nuevo, 'k', { color: C.rojo, r: 2.8 });
        particulas(grupos.fuera, 'k', { color: C.verde, r: 2.4 });
        particulas(grupos.celula, 'k', { color: C.oro, r: 3.2 });
        anillos(grupos.celula, alfa(C.oro, 0.45), 5.5);
        esc.corazon(nivel / 3, m.calcio);
    }
    const latido = (u, r) => r.fv ? 0.55 * Math.sin(u * 6.28 * 2.2) + 0.25 * Math.sin(u * 6.28 * 5.3 + 1)
        : onda(u, { sinP: r.qrs, qrs: r.qrs ? 2.2 : 1, tAmp: r.t ? 0.8 : 0.26, tAnch: r.t ? 0.026 : 0.055 });

    // ---------- Lecturas (solo se escribe lo que cambia) ----------
    function leer(m, r, nivel, act) {
        const pendiente = S.c.pseudo && !S.repetido;
        const [nombre, color] = GRAVEDAD[nivel];
        poner('k', E['hk-k'], 'innerHTML', `${coma(m.medido)} <small>mEq/l en la analítica</small>`);
        poner('grav', E['hk-gravedad'], 'textContent', pendiente ? 'Sin confirmar' : nombre);
        poner('gravc', E['hk-gravedad'], 'className', 'grade-badge ' + (pendiente ? 'hk-pendiente' : color));
        poner('real', E['hk-k-real'], 'hidden', !S.c.pseudo);
        if (S.c.pseudo) {
            poner('realtxt', E['hk-k-real-txt'], 'textContent', S.repetido ? `Analítica repetida: el K⁺ real es ${coma(m.k)}.` : 'El K⁺ que circula en el plasma es otro.');
            poner('repetir', E['hk-repetir'], 'hidden', S.repetido);
        }
        poner('ecg', E['hk-ecg-texto'], 'innerHTML', textoECG(S, r));
        const protegido = m.calcio > 0.3 && nivel > 0;
        if (poner.cambio('riesgo', `${nivel}${protegido}${pendiente}`)) {
            pintarGauge('hk-riesgo', [8, 33, 66, 100][nivel], 100, ESTADO_GAUGE[nivel], pendiente ? 'sin confirmar' : protegido ? 'protegido' : nombre.toLowerCase());
            if (protegido) Object.assign(E['hk-riesgo-fill'].style, { background: `repeating-linear-gradient(135deg, ${C.ink} 0 4px, ${alfa(C.ink, 0.35)} 4px 8px)`, boxShadow: 'none' });
            E['hk-riesgo-txt'].innerHTML = pendiente ? 'Pendiente de confirmar: el K⁺ de la analítica puede ser falso.'
                : (protegido ? `Membrana protegida por el calcio. El K⁺ y la gravedad (${nombre.toLowerCase()}) no han cambiado.` : `Según la gravedad de la Figura 7: ${nombre.toLowerCase()}.`) + enlace('hk-fig7');
        }
        const e = S.eliminado;
        poner('rep', E['hk-reparto'], 'textContent', `En la célula, de forma temporal: ${coma(m.desplazado)} · Fuera del cuerpo: ${coma(m.eliminado)} (orina ${coma(e.orina)}, heces ${coma(e.heces)}, diálisis ${coma(e.dial)})`);
        poner('reloj', E['hk-reloj'], 'textContent', fmtT(S.t));
        poner('avisos', E['hk-avisos'], 'innerHTML', avisos(S, m, r, nivel));
        poner('play', E['hk-play'], 'textContent', S.t >= T_MAX ? 'Fin del reloj (12 h)' : S.corriendo ? '❚❚ Pausar' : '▶ Correr el reloj');
        poner('revision', E['hk-revision'], 'innerHTML', S.t >= T_MAX ? htmlRevision(revision(S, m)) : '');
        for (const f of FARMACOS) {
            const dosis = S.dados[f.id] || [];
            const ef = S.efectos[f.id];
            poner('efe' + f.id, E['efecto-' + f.id], 'innerHTML', ef ? `<div class="tfg-estado tfg-estado-${ef.util ? 'ok' : 'neutro'}">${ef.util ? '✓' : '○'} ${ef.texto}${enlace(ef.ver)}</div>` : '');
            poner('est' + f.id, E['estado-' + f.id], 'textContent', estadoDosis(dosis, S.t, f, act[f.id]));
            const enCurso = act[f.id] > 0 || (dosis.length && S.t - dosis[dosis.length - 1] < f.ini[1]);
            const [txt, off] = !dosis.length ? ['Dar', false] : f.repetible && !enCurso ? ['Repetir', false] : ['Dado', true];
            poner('dar' + f.id, E['dar-' + f.id], 'textContent', txt);
            poner('off' + f.id, E['dar-' + f.id], 'disabled', off);
        }
    }

    // ---------- Un fotograma: avanza el reloj (si corre), recoloca, lee y dibuja ----------
    let ultimo = 0;
    function paso(ahora = performance.now(), reanudar = false) {
        if (reanudar) ultimo = 0;
        const dt = ultimo ? clamp((ahora - ultimo) / 1000, 0, 0.1) : 0;
        ultimo = ahora;
        esc.tick(dt);
        if (S.corriendo) {
            const sub = (1.5 + S.t / 18) * (rapido ? 4 : 1) * dt / 4;
            for (let i = 0; i < 4 && S.t < T_MAX; i++) avanzar(S, sub);
            if (S.t >= T_MAX) { S.t = T_MAX; S.corriendo = false; }
        }
        const act = actividades(FARMACOS, S.dados, S.t), m = modelo(S, act);
        cuadrar(m);
        const r = rasgosECG(S, m.k), nivel = nivelGravedad(m.k, r.t);
        const dtm = S.t - S.tPrev; S.tPrev = S.t;
        if (r.t) { S.huboECG = true; if (S.tECG0 === null) S.tECG0 = S.t; if (!enCurso(S, FARMACOS.find(x => x.id === 'calcio'), act)) S.sinProt += dtm; }
        S.kMax = Math.max(S.kMax, m.k);
        leer(m, r, nivel, act);
        dibujar(m, act, nivel);
        esc.pintarECG(r, latido, `${r.t}${r.qrs}${r.fv}`);
    }

    function reiniciar(desdeCausa) {
        const c = CAUSAS[E['hk-causa'].value];
        if (desdeCausa) E['hk-renal'].value = c.renal;
        S = {
            c, renal: E['hk-renal'].value, ecg: E['hk-ecg-modo'].value, t: 0, corriendo: false, dados: {}, repetido: false,
            anadido: { acido: 0, lisis: 0, aporte: 0 }, eliminado: { orina: 0, heces: 0, dial: 0 }, picoDesplazado: 0,
            efectos: {}, huboECG: false, tECG0: null, tCalcio0: null, sinProt: 0, tPrev: 0, kMax: 0,
        };
        E['hk-causa-detalle'].innerHTML = c.texto + enlace(c.fuente);
        crearParticulas();
        esc.reiniciarECG();
        paso();
    }

    // ---------- Controles ----------
    E['hk-play'].addEventListener('click', () => { if (S.t < T_MAX) { S.corriendo = !S.corriendo; paso(); } });
    E['hk-rapido'].addEventListener('click', () => {
        rapido = !rapido;
        E['hk-rapido'].setAttribute('aria-pressed', String(rapido));
        E['hk-rapido'].classList.toggle('hk-primario', rapido);
    });
    $('hk-reiniciar').addEventListener('click', () => reiniciar(false));
    E['hk-causa'].addEventListener('change', () => reiniciar(true));
    E['hk-renal'].addEventListener('change', () => { S.renal = E['hk-renal'].value; paso(); });
    E['hk-ecg-modo'].addEventListener('change', () => { S.ecg = E['hk-ecg-modo'].value; paso(); });
    E['hk-repetir'].addEventListener('click', () => { S.repetido = true; paso(); });
    visual.addEventListener('click', e => {
        const dar = e.target.closest('[data-dar]');
        if (dar && !dar.disabled) {
            const f = FARMACOS.find(x => x.id === dar.dataset.dar), act = actividades(FARMACOS, S.dados, S.t), m = modelo(S, act);
            S.efectos[f.id] = efectoMedida(S, f, m, rasgosECG(S, m.k), act);
            if (f.id === 'calcio' && S.tCalcio0 === null) S.tCalcio0 = S.t;
            (S.dados[f.id] ||= []).push(S.t); paso();
        }
        if (e.target.closest('[data-empezar]')) reiniciar(false);
    });
    enlazarTexto(visual, tab, texto);
    animarMientrasVisible(visual, paso);

    reiniciar(true);
}
