// La inmersión (Libros → Marino → Fundamentos, cap. 6: analgesia y sedación). Escena de la cabeza de «La cama 7».
// Interfaz del modelo vivo: la cama 7 (cama7.js), la frase viva, la hoja de órdenes (dock de 6 pestañas: dolor,
// analgesia, sedante, despertar, paciente y delirio), los toques en la lámina, los estados con nombre, el interruptor
// Explorar | Conceptos | Mayéutica y la capa de estudio (guía socrática y examen, repaso de lo fallado y 2 casos
// clínicos). Mismo patrón que la muralla de papel (muralla-viva.js). La escena vive en inmersion-viva-escena.js; los
// datos, en js/data/inmersion-viva-data.js. Viene de la maqueta aprobada autonomo/maquetas/b1-inmersion.html (vuelta 2).
//
// Se abre en un estado con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="inmersionViva" data-inmersion-viva="diazepam">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`). Su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). La Mayéutica guarda aciertos y fallos en localStorage (como el quiz y la muralla), con
// clave propia y siempre dentro de try/catch.
import { cargarMotion } from '../../core/motion.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { escapeHtml } from '../../core/ui.js';
import { rutaDePanel } from '../../core/search.js';
import { barajar } from '../../core/mayeutica.js';
import { iconoParticula } from '../../core/particulas.js';
import { montarCama7 } from './cama7.js';
import {
    ESTADOS, CONCEPTOS, PREGUNTAS, CASOS, PROFUNDIZAR, LAMINAS, OPIOIDES, AHORRO, SEDANTES, TABLA_6_7,
    estadoBase, estadoDe, derivar, copia, clamp, chipTxt, pruebasInmersion,
} from '../../data/inmersion-viva-data.js';
import {
    $, estado, D, REDUCIR, ocultos, initEscena, aplicarModelo, setOcultos, arrancar, ponerVisible, mirar, anilloObj,
    estadoBucle, vaciarFotogramas, llamar, respuestaVoz, sumergir, caraGrabado, lastreSVG, SUPERFICIE,
} from './inmersion-viva-escena.js';

let raiz = null, cama = null;
const enRaiz = sel => raiz.querySelectorAll(sel);

/* ============================================================
   «Ver en el texto» y el chip de origen. Una fuente es «ficha#elemento · #elemento · texto»: cada id lleva a su sitio
   de la ficha (enlace cruzado de siempre) con el nombre que tiene en el texto; el chip dice solo «ficha»,
   «fisiología general» o «ilustrativo» y la página del PDF. Ningún id interno a la vista.
   ============================================================ */
function rutaDe(id) {
    const el = id && document.getElementById(id);
    if (!el) return null;
    const tab = el.classList.contains('tab-content') ? el : el.closest('.tab-content');
    const panel = tab?.closest('[id^="panel-"]');
    const nav = panel && rutaDePanel(panel.id);
    return nav ? { el, tab, panel: panel.id, nav } : null;
}
const limpio = t => (t || '').replace(/\s+/g, ' ').trim();
const tituloFicha = tab => limpio(tab.querySelector('h3')?.textContent || tab.id).split(':')[0];
function etiquetaDe(el) {
    if (el.dataset.nombre) return el.dataset.nombre;
    if (el.matches('dl')) return limpio(el.querySelector('dt')?.textContent);
    if (el.matches('.micro-prof-item')) return limpio(el.querySelector('.micro-prof-head span')?.textContent).replace(/^\S+\s/, '');
    if (el.matches('.article-figure')) return limpio(el.querySelector('.article-figure-caption')?.textContent).split('—')[0].trim();
    const num = el.id.match(/-(tabla|fig|img)-(\d+)-(\d+)$/);
    if (num) return `${num[1] === 'tabla' ? 'Tabla' : 'Figura'} ${num[2]}.${num[3]}`;
    if (el.matches('.agua-simulador')) return limpio(el.querySelector('h4')?.textContent).replace(/^\S+\s/, '');
    const t = limpio(el.textContent);
    return t.length > 40 ? t.slice(0, 38).replace(/\s+\S*$/, '') + '…' : t;
}
const atributosFicha = r => `data-especialidad="${r.nav.especialidad}" data-view="${r.nav.view}" data-panel="${r.panel}" data-tab="${r.tab.id}"${r.el !== r.tab ? ` data-resaltar="#${r.el.id}"` : ''}`;
// Los ids que cita una fuente, en orden y sin repetir
function idsDe(fuente) {
    const ids = [];
    for (const t of String(fuente || '').split(' · ')) {
        const m = t.trim().match(/^#?(mar-[a-z0-9-]+)(?:#(mar-[a-z0-9-]+))?/);
        if (m) ids.push(m[2] || m[1]);
    }
    return [...new Set(ids)];
}
function enlacesTexto(fuente) {
    const vistosTab = new Set(), botones = [];
    for (const id of idsDe(fuente)) {
        const r = rutaDe(id); if (!r) continue;
        const sub = r.el !== r.tab ? etiquetaDe(r.el) : null;
        let texto = vistosTab.has(r.tab.id) ? (sub || tituloFicha(r.tab)) : tituloFicha(r.tab) + (sub ? ' · ' + sub : '');
        vistosTab.add(r.tab.id);
        texto = texto.length > 64 ? texto.slice(0, 62) + '…' : texto;
        botones.push(`<button type="button" class="inm-ir-texto" ${atributosFicha(r)}>${escapeHtml(texto)} →</button>`);
    }
    return botones.join(' ');
}
const esIlu = f => /ilustrativ|sin cifra|hueco/.test(f) && !/mar-|Fig|Tabla/.test(f);
const chipSpan = f => f ? `<span class="inm-org${esIlu(f) ? ' inm-ilu' : ''}">${chipTxt(f)}</span>` : '';
const verEnTexto = fuente => `<p class="inm-fuente-p">Ver en el texto: ${enlacesTexto(fuente)} ${chipSpan(fuente)}</p>`;
// El chip de la frase viva: un enlace a su sitio en la ficha, si lo tiene
function chip(f) {
    if (!f) return '';
    const r = idsDe(f).map(rutaDe).find(Boolean);
    return r ? `<button type="button" class="inm-org inm-org-ir${esIlu(f) ? ' inm-ilu' : ''}" ${atributosFicha(r)}>${chipTxt(f)}</button>` : chipSpan(f);
}

/* ============================================================
   Frase viva (con su origen) y aplicar un estado
   ============================================================ */
let fraseActual = '';
function decir(html, fuente) {
    const fraseEl = $('frase');
    const nuevo = `${html} ${chip(fuente)}`;
    if (nuevo === fraseActual) return; fraseActual = nuevo;
    fraseEl.innerHTML = nuevo;
    $('mar').setAttribute('aria-label', fraseEl.textContent);
    if (!REDUCIR && fraseEl.animate) fraseEl.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
}
function aplicar(nuevo, op = {}) {
    const viejo = aplicarModelo(nuevo, { inmediato: op.inmediato });
    sincronizarMandos();
    if (op.frase !== false && modo === 'explorar') decir(...fraseDe(viejo, nuevo));
}
const cambiar = (fn, op) => { const e = copia(estado); fn(e); aplicar(e, op); };

/* ---------- La frase viva: traduce cada orden ---------- */
const A = t => `<span class="hl">${t}</span>`, R = t => `<span class="hl-rojo">${t}</span>`;
const FRASE_INICIO = () => [`Un intubado bajo el agua. La ${R('tormenta')} es su dolor (la cara: BPS); la ${A('profundidad')}, su sedación (RASS). Toca la hoja de órdenes.`, 'ficha · mar-bps-intro · mar-tabla-6-4'];
function frasePar() {
    const e = estado, t = TABLA_6_7[e.horas];
    if (e.sedante === 'propofol') {
        if (!t) return ['Esa duración no está en la Tabla 6.7: la ficha no da su despertar.', 'hueco · mar-tabla-6-7'];
        return e.subido ? [`Propofol ${t.n}: la ligera despierta en ${A(t.lig)}; la profunda, en ${R(t.prof)}. Lo que más alarga el despertar es ${A('la profundidad')}.`, 'ficha · mar-tabla-6-7']
            : [`Dos camas con propofol ${t.n}: una ligera y otra profunda. Predice quién llega antes y pulsa «Despertar».`, 'ficha · mar-tabla-6-7'];
    }
    if (e.sedante === 'midazolam' || e.sedante === 'lorazepam') return [`En un estudio, 30 h para salir con midazolam frente a 4-5 h con lorazepam. Pero las guías más recientes: ${R('evitar las BZD')} en el ventilado.`, 'ficha · mar-bzd-proscontras · mar-bzd-prevencion'];
    if (e.sedante === 'dexmedetomidina') return ['Dexmedetomidina: despertar en 6-10 min (Tabla 6.6); y sin pararla, se despierta al llamarle.', 'ficha · mar-tabla-6-6'];
    return ['Diazepam: vida media de 90 h y metabolitos activos; la ficha no da cuánto tarda en despertar.', 'ficha · mar-bzd-intro · hueco'];
}
function fraseDe(v, n) {
    const av = D.av, o = n.opioide ? OPIOIDES[n.opioide] : null;
    if (n.par) return frasePar();
    const claves = ['delirio', 'bradi', 'halo', 'qtcLargo', 'dosisAlta', 'horas', 'sedante', 'prof', 'opioide', 'ahorro', 'renal', 'volemia', 'inflamacion', 'estimulo'];
    const cambio = v ? claves.find(k => JSON.stringify(v[k]) !== JSON.stringify(n[k])) : null;
    switch (cambio) {
        case 'delirio': return n.delirio ? [`Delirio (no por abstinencia): ${A('la dexmedetomidina es la de elección')}; lo sufre un 40 % de los mayores de 65 años en la UCI.`, 'ficha · mar-dexmedetomidina'] : ['Sin delirio.', ''];
        case 'bradi': return n.bradi ? [`Bradicardia o hipotensión: la dexmedetomidina es simpaticolítica. Si no se tolera, ${A('haloperidol')}.`, 'ficha · mar-dexmedetomidina · mar-haloperidol-intro'] : ['FC y PA de nuevo estables.', ''];
        case 'halo': case 'qtcLargo':
            if (av.haloBloq) return [`QTc >500 ms: ${R('no usar el haloperidol')}. Torsade de pointes en el 3-4 %, sobre todo con QTc >500 o >35 mg al día.`, 'ficha · mar-haloperidol-qtc'];
            if (n.halo && !n.delirio) return ['El haloperidol es para la agitación y el delirio que no son por abstinencia: activa «Agitación por delirio».', 'ficha · mar-haloperidol-intro'];
            if (n.halo) return [`Haloperidol 5 mg IV: efecto a los 10-20 min, dura 3-4 h. Si no responde, ${A('10 mg')}; si responde, el 25 % de la dosis eficaz cada 6 h.`, 'ficha · mar-tabla-6-8'];
            return [n.qtcLargo ? 'QTc >500 ms: si llega el delirio, el haloperidol queda fuera.' : 'QTc por debajo de 500 ms.', 'ficha · mar-haloperidol-qtc'];
        case 'dosisAlta': case 'horas':
            if (av.pris) return [`Propofol >5 mg/kg/h más de 48 h: ${R('síndrome de infusión')}. IC sistólica brusca, acidosis láctica que no cede, rabdomiólisis. 3 %; mortalidad 30-35 %.`, 'ficha · mar-pris'];
            if (av.pg) return [`Lorazepam >10 mg/h (o >0,1 mg/kg/h) más de 48 h: el ${R('propilenglicol')} se vuelve ácido láctico. Vigila el hiato osmolar (>10): el lactato no lo predice.`, 'ficha · mar-lorazepam'];
            if (av.midaz) return [`Midazolam más de 48 h: muy liposoluble, ${R('se acumula en el SNC')}: más hondo de lo pedido. Limitar a ≤48 h.`, 'ficha · mar-midazolam'];
            if (n.dosisAlta && n.sedante === 'propofol') return ['Propofol a dosis alta: el SIP es típico a partir de las 48 h (descrito incluso con 36 µg/kg/min).', 'ficha · mar-pris'];
            if (n.dosisAlta && n.sedante === 'lorazepam') return ['Lorazepam a dosis alta: el riesgo del propilenglicol aparece tras 48 h.', 'ficha · mar-lorazepam'];
            if (cambio === 'dosisAlta') return ['La dosis alta solo cambia algo con el propofol (SIP) y el lorazepam (propilenglicol).', 'ficha · mar-pris · mar-lorazepam'];
            if (n.sedante === 'propofol' && TABLA_6_7[n.horas]) { const t = TABLA_6_7[n.horas]; return [`Propofol ${t.n}: si lo paras, ligera ${t.lig} y profunda ${t.prof}. Pulsa «Despertar».`, 'ficha · mar-tabla-6-7']; }
            return [`Perfusión de ${TABLA_6_7[n.horas]?.n || n.horas + ' h'}.`, ''];
        case 'sedante':
            if (n.sedante === 'diazepam') return [`Diazepam: le hunde (RASS −3), pero ${R('la tormenta sigue')}. La Fig. 6.1 da por mala la respuesta «sí, alivia el dolor»: falló el ~80 % de los residentes.`, 'ficha · mar-fig-6-1 · mar-bzd-intro'];
            if (n.sedante === 'propofol') return av.sinAnalgesia ? [`Propofol: sedante y amnésico, ${R('sin efecto analgésico')}: le hunde y le sigue doliendo.`, 'ficha · mar-propofol'] : [`Propofol: plomo liso; seda en 1-2 min. Titula a ${A('RASS −1/−2')}.`, 'ficha · mar-propofol · mar-escalas-sedacion'];
            if (n.sedante === 'midazolam') return [`Midazolam: lastre de esponja. Muy liposoluble: en perfusión, ${A('≤48 h')}.`, 'ficha · mar-midazolam'];
            if (n.sedante === 'lorazepam') return [`Lorazepam: acumula menos, pero ${R('lleva un barril de propilenglicol')} (su disolvente).`, 'ficha · mar-lorazepam'];
            if (n.sedante === 'dexmedetomidina') return [`Dexmedetomidina: una boya. ${A('Sedación cooperativa')}, sin depresión respiratoria; baja la FC y la PA. Llámale (en «Despertar»).`, 'ficha · mar-dexmedetomidina'];
            return ['Sin sedante: el paciente sube a su sitio.', ''];
        case 'prof': return n.prof === 'ligera' ? [`Sedación ligera: ${A('RASS −1 a −2')}, el objetivo de la perfusión; el óptimo es 0.`, 'ficha · mar-escalas-sedacion'] : [`Sedación profunda (RASS −4): no responde a la voz. ${R('Cuanto más hondo, más tarda en subir')}.`, 'ficha · mar-tabla-6-4 · mar-tabla-6-7'];
        case 'opioide': {
            if (!o) return ['Sin opioide: la tormenta vuelve.', ''];
            const extra = { fentanilo: '600 veces más liposoluble, sin histamina.', morfina: 'Libera histamina: hipotensión (no broncoespasmo).', hidromorfona: 'Sin ajuste en la insuficiencia renal.', remifentanilo: 'Se va a los 10 min de pararlo: combínalo con uno largo.' }[n.opioide];
            return [`${o.n}: inicio ${o.inicio}. ${A('Calma la tormenta')} y apenas baja al paciente (sedación leve, sin amnesia). ${extra}${n.renal === 'ir' ? ` IR: ${o.irC}.` : ''}`, `ficha · mar-tabla-6-2 · mar-${n.opioide} · mar-opioide-definiciones`];
        }
        case 'ahorro': {
            const k = n.ahorro.find(x => !v.ahorro.includes(x));
            if (k === 'ketorolaco') return [`Ketorolaco 30 mg/6 h (${A('15 mg')} con IR, ≥65 años o <50 kg): ${A('reduce el opioide un 25-50 %')}.`, 'ficha · mar-tabla-6-3'];
            if (k === 'paracetamol') return ['Paracetamol 1 g IV/6 h, sin pasar de 4 g al día; sin efecto antiinflamatorio. Ahorra opioide.', 'ficha · mar-tabla-6-3'];
            if (k === 'ketamina') return [`Ketamina 60-120 µg/kg/h con un opioide (la tabla imprime µg/h: errata). ${R('En general, no en la isquemia miocárdica')}.`, 'ficha · mar-tabla-6-3 · mar-ketamina-errata · mar-ketamina'];
            return ['Sin ese ahorrador.', ''];
        }
        case 'renal':
            if (n.renal !== 'ir') return ['Riñón normal.', ''];
            if (n.opioide === 'morfina') return [`Morfina con IR: sus metabolitos se acumulan (la M3G da mioclonías y convulsiones): ${R('−50 % el mantenimiento')}.`, 'ficha · mar-tabla-6-2 · mar-morfina'];
            return o ? [`IR con ${o.n.toLowerCase()}: ${A(o.irC)}.`, 'ficha · mar-tabla-6-2'] : ['Insuficiencia renal: cambia la elección del opioide. Elige uno en «Analgesia».', 'ficha · mar-tabla-6-2'];
        case 'volemia':
            return av.hipoPA ? [`Hipovolemia con opioide y benzodiacepina, o con propofol: ${R('la PA puede caer de forma marcada')}.${n.opioide ? ' La hipotensión por opioides responde a líquidos o a pequeños bolos de vasopresor.' : ' De la hipotensión por propofol, la ficha no da tratamiento.'}`, 'ficha · mar-opioide-cardio · mar-propofol']
                : [n.volemia === 'hipovolemia' ? 'Hipovolemia: con un opioide más una benzodiacepina, o con propofol, la PA cae.' : 'Volemia normal.', 'ficha · mar-opioide-cardio'];
        case 'inflamacion': return n.inflamacion ? [`Inflamación sistémica: ${R('hipernocicepción')}. El mismo gesto duele más: BPS ${D.bps}.`, 'ficha · mar-hipernocicepcion'] : [`Sin inflamación: BPS ${D.bps}.`, ''];
        case 'estimulo': return n.estimulo === 'mover' ? [`Moverle en la cama: una causa frecuente de dolor. BPS ${D.bps}; ${R('la FC apenas cambia')}.`, 'ficha · mar-hipernocicepcion · mar-constantes-dolor'] : [`En reposo: un 50 % de los críticos tiene dolor (lumbar, piernas). BPS ${D.bps}.`, 'ficha · mar-hipernocicepcion'];
    }
    return FRASE_INICIO();
}

/* ============================================================
   Toques en la lámina y en la cama
   ============================================================ */
const TOQUES = {
    regla: () => [`El profundímetro: la RASS, de +4 (combativo) a −5 (no despertable). El óptimo es 0; en perfusión se titula a ${A('−1 a −2')}. Tres pasos: observar, la voz y el estímulo físico.`, 'ficha · mar-tabla-6-4 · mar-rass-pasos · mar-escalas-sedacion'],
    monitor: () => [`El monitor: la correlación entre la intensidad del dolor y la FC o la PA es ${R('mala')}: abandona esa práctica. Mira la cara (BPS).`, 'ficha · mar-constantes-dolor'],
    medallon: () => [`La cara: BPS ${D.bps} (cara ${D.items.cara}, miembros superiores ${D.items.brazos}, ventilador ${D.items.vent}). De 3 a 12; ${R('≥6 es dolor inaceptable')}.`, 'ficha · mar-bps-intro · mar-bps-calc'],
    aceite: () => estado.opioide ? fraseDe({ ...estado, opioide: null }, estado) : FRASE_INICIO(),
};
function tocarLamina(ev) {
    const t = ev.target.closest('[data-toca]'); if (!t) return;
    const k = t.dataset.toca;
    if (TOQUES[k] && modo === 'explorar') { fraseActual = ''; decir(...TOQUES[k]()); }
}
function decirVoz(res) { if (res && modo === 'explorar') { fraseActual = ''; decir(res.txt, res.f); } }

/* ============================================================
   Dock: la hoja de órdenes
   ============================================================ */
function chipsDock() {
    $('m-opioide').innerHTML = `<button type="button" class="inm-tog" data-op="">Sin opioide</button>` +
        Object.entries(OPIOIDES).map(([k, o]) => `<button type="button" class="inm-tog" data-op="${k}">${o.n} <small>${o.inicio}</small></button>`).join('');
    $('m-ahorro').innerHTML = Object.entries(AHORRO).map(([k, o]) => `<button type="button" class="inm-tog" data-ah="${k}">${o.n} <small>${o.s}</small></button>`).join('');
    $('m-sedante').innerHTML = `<button type="button" class="inm-tog" data-sed="">Sin sedante</button>` +
        Object.entries(SEDANTES).map(([k, o]) => `<button type="button" class="inm-tog" data-sed="${k}">${o.n} <small>${o.s}</small></button>`).join('');
}
const TOGS = [['m-inflamacion', 'inflamacion'], ['m-dosis', 'dosisAlta'], ['m-delirio', 'delirio'], ['m-bradi', 'bradi'], ['m-halo', 'halo'], ['m-qtc', 'qtcLargo']];
function sincronizarMandos() {
    const pr = (sel, fn) => enRaiz(sel).forEach(b => b.setAttribute('aria-pressed', String(fn(b))));
    pr('#inm-m-estimulo button', b => b.dataset.v === estado.estimulo);
    pr('#inm-m-prof button', b => b.dataset.v === estado.prof);
    pr('#inm-m-horas button', b => +b.dataset.v === estado.horas);
    pr('#inm-m-renal button', b => b.dataset.v === estado.renal);
    pr('#inm-m-volemia button', b => b.dataset.v === estado.volemia);
    pr('#inm-m-opioide [data-op]', b => (b.dataset.op || null) === estado.opioide);
    pr('#inm-m-sedante [data-sed]', b => (b.dataset.sed || null) === estado.sedante);
    pr('#inm-m-ahorro [data-ah]', b => estado.ahorro.includes(b.dataset.ah));
    for (const [id, k] of TOGS) $(id).setAttribute('aria-pressed', String(estado[k]));
    $('m-despertar').innerHTML = estado.par && estado.subido ? 'Volver a sedar <small>otra vez abajo</small>' : 'Despertar <small>soltar el lastre</small>';
    enRaiz('#inm-chips-estado button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    pintarTabla67();
}
function elegirPestana(tab) {
    enRaiz('.inm-dock-tabs button').forEach(o => o.setAttribute('aria-selected', String(o.dataset.inmTab === tab)));
    enRaiz('#inm-dock-explorar .inm-dock-panel').forEach(p => { p.hidden = p.dataset.inmPanel !== tab; });
}
function despertar() {
    if (estado.par && estado.subido) { cambiar(s => { s.par = false; s.subido = false; }); return; }
    if (!estado.sedante) { fraseActual = ''; decir('Sin sedante no hay lastre que soltar: elige uno en «Sedante».', ''); return; }
    cambiar(s => { s.par = true; s.subido = true; s.fijo = {}; });
}
function engancharDock() {
    enRaiz('.inm-dock-tabs button').forEach(b => b.addEventListener('click', () => elegirPestana(b.dataset.inmTab)));
    const segDock = (id, k, num) => $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (b) cambiar(s => { s[k] = num ? +b.dataset.v : b.dataset.v; s.fijo = {}; if (k === 'horas' || k === 'prof') s.subido = false; }); });
    segDock('m-estimulo', 'estimulo'); segDock('m-prof', 'prof'); segDock('m-horas', 'horas', true); segDock('m-renal', 'renal'); segDock('m-volemia', 'volemia');
    for (const [id, k] of TOGS) $(id).addEventListener('click', () => cambiar(s => { s[k] = !s[k]; s.fijo = {}; }));
    $('m-opioide').addEventListener('click', e => { const b = e.target.closest('[data-op]'); if (b) cambiar(s => { s.opioide = b.dataset.op || null; s.fijo = {}; }); });
    $('m-ahorro').addEventListener('click', e => { const b = e.target.closest('[data-ah]'); if (b) cambiar(s => { const k = b.dataset.ah; s.ahorro = s.ahorro.includes(k) ? s.ahorro.filter(x => x !== k) : [...s.ahorro, k]; s.fijo = {}; }); });
    $('m-sedante').addEventListener('click', e => { const b = e.target.closest('[data-sed]'); if (b) cambiar(s => { s.sedante = b.dataset.sed || null; s.fijo = {}; s.subido = false; if (!s.sedante) s.par = false; }); });
    $('m-reinicio').addEventListener('click', () => { aplicar(estadoBase(), { frase: false }); fraseActual = ''; decir(...FRASE_INICIO()); });
    $('m-despertar').addEventListener('click', despertar);
    $('m-llamar').addEventListener('click', () => {
        const habiaPar = estado.par;
        if (habiaPar) cambiar(s => { s.par = false; s.subido = false; }, { frase: false });
        setTimeout(() => decirVoz(llamar('voz')), habiaPar ? 400 : 0);
    });
    $('m-sacudir').addEventListener('click', () => decirVoz(llamar('fisico')));
    $('ir-despertar').addEventListener('click', () => { ponerEnEstado('despertar'); $('escena-bloque').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' }); });
    $('frase').addEventListener('click', ev => { if (ev.target.closest('[data-especialidad]')) return; $('frase').classList.toggle('inm-abierta'); });
    $('mar').addEventListener('click', tocarLamina);
    $('chips-estado').addEventListener('click', e => {
        const b = e.target.closest('[data-estado]'); if (!b) return;
        ponerEnEstado(b.dataset.estado);
        b.setAttribute('aria-pressed', 'true');
        $('escena-bloque').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' });
    });
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).addEventListener('click', () => setModo(k));
}
function pintarTabla67() {
    $('tabla67-viva').querySelector('tbody').innerHTML = Object.entries(TABLA_6_7).map(([k, t]) =>
        `<tr class="${+k === estado.horas && estado.sedante === 'propofol' ? 'inm-aqui' : ''}"><td>${t.n}</td><td class="inm-n">${t.lig}</td><td class="inm-n">${t.prof}</td></tr>`).join('');
}

/* ============================================================
   Modos: Explorar | Conceptos | Mayéutica
   ============================================================ */
let modo = 'explorar';
// Sube hasta el principio de la herramienta si se ha bajado de ella.
function alPrincipio() {
    const r = raiz.getBoundingClientRect();
    if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' });
}
function setModo(m) {
    modo = m;
    for (const k of ['explorar', 'conceptos', 'preguntas']) $('modo-' + k).setAttribute('aria-selected', String(k === m));
    raiz.classList.toggle('inm-estudio', m !== 'explorar');
    raiz.classList.toggle('inm-mayeutica', m === 'preguntas');   // la entradilla daría respuestas
    $('vista-explorar').hidden = m !== 'explorar'; $('vista-conceptos').hidden = m !== 'conceptos'; $('vista-preguntas').hidden = m !== 'preguntas';
    $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar';
    $('cama7').hidden = m !== 'explorar';
    if (m !== 'explorar') cama?.parar();
    mirar(null); setOcultos([], false);
    if (m === 'conceptos') Estudio.concepto(Estudio.c);
    else if (m === 'preguntas') Estudio.inicioPreguntas();
    else { aplicar(estado, { frase: false, inmediato: true }); fraseActual = ''; decir(...fraseDe(null, estado)); }
    alPrincipio();
}

/* ============================================================
   Capa de estudio: Conceptos y Mayéutica (recorrido, repaso de lo fallado y casos).
   ============================================================ */
const TIPO_TXT = { test: 'Test · piensa antes', destapa: 'Piensa y destapa', error: 'Encuentra el error' };
const GRUPO_TXT = { guia: 'Guía socrática', examen: 'Examen · nivel MIR' };
function ponerModelo(q) {
    setOcultos(q.ocultar || (q.tocar && q.tocar.ocultar) || [], false);
    aplicar(estadoDe(q.estado), { frase: false, inmediato: true });
    requestAnimationFrame(() => mirar(q.mirar || null));
}
function pintarDock(items, izq, der) {
    $('dock-pasos').innerHTML = items.map(c => `<i class="${c.split(' ').filter(Boolean).map(x => 'inm-' + x).join(' ')}"></i>`).join('');
    $('dock-est-izq').textContent = izq || ''; $('dock-est-der').textContent = der || '';
}
// Deja el elemento a la vista entre la escena fija de arriba y el dock de abajo (scrollIntoView no cuenta con el dock)
function asomar(el) {
    if (!el) return;
    const r = el.getBoundingClientRect(), abajo = innerHeight - $('dock').offsetHeight - 12;
    const arriba = raiz.classList.contains('inm-estudio') ? $('escena-bloque').getBoundingClientRect().bottom + 8 : 8;
    const d = r.bottom > abajo ? Math.min(r.bottom - abajo, r.top - arriba) : r.top < arriba ? r.top - arriba : 0;
    if (Math.abs(d) > 1) window.scrollBy({ top: d, behavior: REDUCIR ? 'auto' : 'smooth' });
}
function entrar(el) { el.classList.remove('inm-entra'); void el.offsetWidth; el.classList.add('inm-entra'); }

const SEGS = { estimulo: [['reposo', 'En reposo'], ['mover', 'Moverle en la cama']], prof: [['ligera', 'Ligera (−1/−2)'], ['profunda', 'Profunda (−4)']], horas: [['24', '24 h'], ['72', '72 h'], ['168', '7 días'], ['336', '14 días']] };
function mandoHTML(t) {
    const partes = [`<p class="inm-para"><b>Compruébalo en el modelo:</b> ${t.instruccion || ''}</p>`];
    for (const s of t.segs || []) partes.push(`<div class="inm-seg" role="group">${SEGS[s].map(([v, txt]) => `<button type="button" data-mando="seg" data-k="${s}" data-v="${v}" aria-pressed="${String(estado[s]) === v}">${txt}</button>`).join('')}</div>`);
    if (t.botones) partes.push(`<div class="inm-fila">${t.botones.map((b, i) => `<button type="button" class="inm-b" data-mando="boton" data-i="${i}" aria-pressed="false">${b.t}</button>`).join('')}</div>`);
    return partes.join('');
}
// Los mandos de la pregunta, iguales que el modelo
function botonHecho(b) {
    if (b.accion === 'despertar') return !!(estado.par && estado.subido);
    if (b.accion === 'llamar') return !!estado.llamado;
    return Object.entries(b.p || {}).every(([k, v]) => JSON.stringify(estado[k]) === JSON.stringify(v));
}
function sincMandoPreg(cont, q) {
    cont.querySelectorAll('[data-mando="seg"]').forEach(b => b.setAttribute('aria-pressed', String(String(estado[b.dataset.k]) === b.dataset.v)));
    cont.querySelectorAll('[data-mando="boton"]').forEach(b => b.setAttribute('aria-pressed', String(botonHecho(q.tocar.botones[+b.dataset.i]))));
}
function accionMando(m, cont, q) {
    if (m.dataset.mando === 'seg') {
        const k = m.dataset.k, v = k === 'horas' ? +m.dataset.v : m.dataset.v;
        cambiar(e => { e[k] = v; if (k === 'horas') e.subido = false; }, { frase: false });
    } else {
        const b = q.tocar.botones[+m.dataset.i];
        if (b.accion === 'llamar') llamar('voz');
        else if (b.accion === 'despertar') cambiar(e => { e.par = true; e.subido = true; }, { frase: false });
        else cambiar(e => Object.assign(e, copia(b.p)), { frase: false });
    }
    sincMandoPreg(cont, q);
    if (anilloObj) mirar(anilloObj);
}

/* ---------- Una pregunta (sirve para el recorrido, el repaso y los pasos de un caso) ---------- */
function pintarPregunta(cont, q, { cabecera = '', repaso = null, alFinal }) {
    ponerModelo(q);
    const res = { ok: true, faltan: [] };
    let h = cabecera;
    h += `<div class="inm-cab-preg">${q.num ? `<span class="inm-num">${q.num}</span>` : ''}${q.grupo ? `<span class="inm-serie inm-${q.grupo}">${GRUPO_TXT[q.grupo]}</span>` : ''}<span class="inm-tipo">${TIPO_TXT[q.tipo]}${q.tocar ? ' · predice y compruébalo' : ''}</span></div>`;
    h += `<p class="inm-pregunta">${q.enunciado}</p>`;
    if (q.calculadora) {
        const r = rutaDe(q.calculadora.ir);
        if (r) h += `<div class="inm-fila"><button type="button" class="inm-b inm-link" ${atributosFicha(r)}>🧮 Abrir la calculadora «${q.calculadora.nombre}»<small>el caso te espera aquí: vuelve por Libros → La inmersión</small></button></div>`;
    }
    h += '<div id="inm-fmt"></div><div id="inm-q-res"></div>';
    if (q.tocar) h += `<div class="inm-mando" id="inm-mando" hidden>${mandoHTML(q.tocar)}<div class="inm-fila"><button class="inm-b inm-prim" type="button" data-accion="comprobar">Comprobar</button></div><p class="inm-pista" id="inm-pista" hidden></p></div><div id="inm-q-fin"></div>`;
    cont.innerHTML = h; entrar(cont);
    const fmt = cont.querySelector('#inm-fmt');
    let intentos = 0, piePend = '', orden = null;
    // Las respuestas buenas no están en el HTML: se miran en los datos al contestar.
    if (q.tipo === 'test') {
        fmt.innerHTML = `<p class="inm-para">Piénsalo antes de ver las opciones.</p><div class="inm-fila"><button class="inm-b inm-prim" type="button" data-accion="ops">Ya lo tengo: ver opciones</button></div>
            <div class="inm-op" id="inm-ops" hidden></div>`;
    } else if (q.tipo === 'destapa') {
        const idx = repaso && repaso.faltan && repaso.faltan.length ? repaso.faltan : q.puntos.map((_, i) => i);
        fmt.innerHTML = `<p class="inm-para">${repaso && repaso.faltan && repaso.faltan.length ? `Vuelven solo los ${idx.length === 1 ? 'que te faltó' : idx.length + ' que te faltaron'}.` : `Contesta en la cabeza: son ${['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas', 'cinco cosas'][q.puntos.length]}. Luego destápalo.`}</p>
            <div class="inm-fila"><button class="inm-b inm-prim" type="button" data-accion="destapa">Ya lo tengo: destapar</button></div>
            <div class="inm-respuesta inm-entra" id="inm-pts" hidden data-idx="${idx.join(',')}"></div>`;
    } else {
        fmt.innerHTML = `<p class="inm-para">Toca las frases que creas falsas: puede haber 0, 1 o 2 errores.</p><div class="inm-op">${q.frases.map((f, i) =>
            `<button class="inm-frase-e" type="button" data-fr="${i}"><span class="inm-n">${i + 1}</span><span>${f.t}</span></button><div class="inm-correccion" id="inm-cfr${i}" hidden></div>`).join('')}</div>
            <div class="inm-fila"><button class="inm-b inm-prim" type="button" data-accion="corregir">Corregir</button></div>`;
    }
    const botonSig = () => `<div class="inm-fila"><button class="inm-b inm-prim" type="button" data-accion="sig">${q.ultimo ? 'Ver lo que te llevas' : 'Siguiente →'}</button></div>`;
    function cerrar(htmlRes) {
        const r = cont.querySelector('#inm-q-res');
        const pie = `${q.nota ? `<div class="inm-nota-fuentes">${q.nota}</div>` : ''}${verEnTexto(q.fuente)}`;
        if (q.tocar) {
            // primero se predice; ahora se comprueba en el modelo; las cifras tapadas se destapan al comprobar
            r.innerHTML = `<div class="inm-respuesta inm-entra">${htmlRes}</div>`;
            const m = cont.querySelector('#inm-mando'); m.hidden = false; entrar(m);
            mirar(q.tocar.mirar || q.mirar || null);
            asomar(m);
            piePend = pie; return;
        }
        if (q.despues) aplicar(estadoDe(q.despues), { frase: false });
        setOcultos([]);
        if (q.mirarDespues) mirar(q.mirarDespues);
        r.innerHTML = `<div class="inm-respuesta inm-entra">${htmlRes}${pie}${botonSig()}</div>`;
        asomar(r.querySelector('[data-accion="sig"]'));
    }
    function finComprobar(html) {
        setOcultos([]);
        cont.querySelectorAll('#inm-mando [data-mando]').forEach(b => { b.disabled = true; });
        const f = cont.querySelector('#inm-q-fin');
        f.innerHTML = `<div class="inm-respuesta inm-entra">${html}${piePend}${botonSig()}</div>`;
        asomar(f.querySelector('[data-accion="sig"]'));
    }
    cont.onclick = e => {
        const a = e.target.closest('[data-accion]')?.dataset.accion;
        if (a === 'comprobar') {
            const p = cont.querySelector('#inm-pista');
            if (q.tocar.comprobar(estado)) { p.hidden = true; e.target.closest('.inm-fila').remove(); finComprobar(`<span class="inm-ok">✓ Comprobado: ${q.tocar.confirma}</span>`); return; }
            intentos++; p.hidden = false;
            if (intentos < 2) { p.textContent = 'Aún no. ' + q.tocar.pista; return; }
            res.ok = false;   // no supo ponerlo en el modelo: cuenta como fallo y vuelve en el repaso
            aplicar(estadoDe(Object.assign({}, q.estado, q.tocar.bueno)), { frase: false });
            if (q.tocar.botones?.some(b => b.accion === 'llamar')) llamar('voz');
            sincMandoPreg(cont, q); mirar(q.tocar.mirar || q.mirar || null);
            p.textContent = q.tocar.pista + ' Te lo pongo en el modelo.';
            e.target.closest('.inm-fila').remove(); finComprobar(`<span class="inm-mal">Así queda (cuenta como fallo: vuelve en el repaso): ${q.tocar.confirma}</span>`); return;
        }
        if (a === 'ops') {
            orden = barajar(q.opciones, q.id);
            const ops = cont.querySelector('#inm-ops');
            ops.innerHTML = orden.map((o, k) => `<button class="inm-b" type="button" data-op="${k}">${o.t}</button>`).join('');
            ops.hidden = false; e.target.closest('.inm-fila').remove(); return;
        }
        if (a === 'destapa') {
            const pts = cont.querySelector('#inm-pts'), idx = pts.dataset.idx.split(',').map(Number);
            pts.innerHTML = `<p class="inm-para">Marca, uno a uno, lo que tenías:</p>${idx.map(i => `<label class="inm-punto"><input type="checkbox" data-p="${i}"> <span>${q.puntos[i]}</span></label>`).join('')}<div class="inm-fila"><button class="inm-b" type="button" data-accion="puntos">Hecho</button></div>`;
            pts.hidden = false; e.target.closest('.inm-fila').remove(); return;
        }
        if (a === 'puntos') {
            const cajas = [...cont.querySelectorAll('#inm-pts input')];
            const faltan = cajas.filter(c => !c.checked).map(c => +c.dataset.p);
            cajas.forEach(c => { c.disabled = true; }); e.target.closest('button').disabled = true;
            if (faltan.length) { res.ok = false; res.faltan = faltan; }
            const n = cajas.length - faltan.length;
            cerrar(`<span class="${faltan.length ? 'inm-mal' : 'inm-ok'}">${faltan.length ? `${n} de ${cajas.length}. Lo que te faltó vuelve en el repaso.` : `✓ ${cajas.length === 1 ? 'La tenías' : 'Todas'}. Esta no vuelve.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'corregir') {
            let bien = 0;
            cont.querySelectorAll('.inm-frase-e').forEach(b => {
                const f = q.frases[b.dataset.fr], m = b.classList.contains('inm-marcada'), ok = m === !!f.mal; if (ok) bien++;
                b.classList.remove('inm-marcada'); b.classList.add(ok ? 'inm-acierto' : 'inm-fallo'); b.disabled = true;
                if (f.mal) { const c = cont.querySelector('#inm-cfr' + b.dataset.fr); c.hidden = false; c.innerHTML = `<b>Era falsa.</b> ¿Cómo sería la frase buena? <button class="inm-b inm-link" type="button" data-ver="${b.dataset.fr}">Pensado: ver</button>`; }
            });
            e.target.closest('button').disabled = true;
            const nMal = q.frases.filter(f => f.mal).length;
            if (bien < q.frases.length) res.ok = false;
            cerrar(`<span class="${bien === q.frases.length ? 'inm-ok' : 'inm-mal'}">${bien} de ${q.frases.length} bien juzgadas. ${nMal === 0 ? 'No había ningún error.' : nMal === 1 ? `Había un error: la ${q.frases.findIndex(f => f.mal) + 1}.` : `Había ${nMal} errores: la ${q.frases.map((f, i) => f.mal ? i + 1 : 0).filter(Boolean).join(' y la ')}.`}</span>${q.explicacion ? `<p>${q.explicacion}</p>` : ''}`);
            return;
        }
        if (a === 'sig') { mirar(null); setOcultos([], false); alFinal(res); return; }
        const ver = e.target.closest('[data-ver]');
        if (ver) { ver.parentElement.innerHTML = '<b>Corrección:</b> ' + q.frases[ver.dataset.ver].c; asomar(cont.querySelector('[data-accion="sig"]')); return; }
        const fr = e.target.closest('[data-fr]');
        if (fr && !fr.disabled) { fr.classList.toggle('inm-marcada'); return; }
        const op = e.target.closest('[data-op]');
        if (op && !op.disabled && orden) {
            const o = orden[+op.dataset.op];
            cont.querySelectorAll('#inm-ops button').forEach(b => { b.disabled = true; });
            op.classList.add(o.ok ? 'inm-op-bien' : 'inm-op-mal');
            if (!o.ok) res.ok = false;
            cerrar(`<span class="${o.ok ? 'inm-ok' : 'inm-mal'}">${o.ok ? '✓ Bien' : '✗ Qué le pasaría al paciente'}</span>${o.ok ? '' : `<p>${o.porque}</p>`}<p>${q.explicacion}</p>`);
            return;
        }
        const m = e.target.closest('[data-mando]');
        if (m && !m.disabled) accionMando(m, cont, q);
    };
}

/* ---------- Aciertos y fallos guardados (como el quiz: solo en este dispositivo) ---------- */
const CLAVE_GUARDADO = 'inmersion-viva-mayeutica-v1';
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

// «Para profundizar»: lo que no se pregunta, con su sitio en la ficha y en el libro
const profundizarHTML = () => PROFUNDIZAR.map(p => `<section>${p.html} <span class="inm-fuente-p">${enlacesTexto(p.donde)} <a class="inm-pdf" href="${p.href}" target="_blank" rel="noopener">Ver en el libro (p. ${p.pag}) →</a></span></section>`).join('')
    + '<p class="inm-para">El recorrido completo de las dos fichas (Texto) cubre el resto.</p>';

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
        setOcultos([], false); aplicar(estadoDe(k.estado), { frase: false, inmediato: true });
        requestAnimationFrame(() => mirar(k.mirar || null));
        cont.innerHTML = `<div class="inm-cab-preg"><span class="inm-concepto-n">${this.c + 1}</span><h3>${k.titulo}</h3></div>
            <p class="inm-pregunta">${k.texto}</p>
            <div class="inm-mando"><p class="inm-para"><b>Tócalo:</b> ${k.hacer}</p><div class="inm-fila">${k.acciones.map((a, j) => `<button class="inm-b" type="button" data-acc="${j}" aria-pressed="false">${a.t}</button>`).join('')}</div></div>
            <p class="inm-para"><b>Mira:</b> ${k.mira}</p>
            ${verEnTexto(k.fuente)}
            <div class="inm-nav-c"><button class="inm-b" type="button" data-nav="-1" ${this.c === 0 ? 'disabled' : ''}>← Anterior</button><button class="inm-b inm-prim" type="button" data-nav="1">${this.c === CONCEPTOS.length - 1 ? 'A la Mayéutica →' : 'Siguiente →'}</button></div>`;
        entrar(cont);
        cont.onclick = e => {
            const a = e.target.closest('[data-acc]');
            if (a) {
                const ac = CONCEPTOS[this.c].acciones[+a.dataset.acc];
                if (ac.accion === 'llamar') llamar('voz'); else if (ac.accion === 'sacudir') llamar('fisico');
                else { aplicar(estadoDe(ac.p), { frase: false }); if (ac.subir) setTimeout(() => cambiar(x => { x.subido = true; }, { frase: false }), REDUCIR ? 0 : 500); }
                requestAnimationFrame(() => mirar(ac.mirar || k.mirar || null));
                cont.querySelectorAll('[data-acc]').forEach(b => b.setAttribute('aria-pressed', String(b === a)));
                return;
            }
            const n = e.target.closest('[data-nav]');
            if (n) { if (this.c === CONCEPTOS.length - 1 && +n.dataset.nav > 0) { setModo('preguntas'); return; } this.concepto(this.c + (+n.dataset.nav)); alPrincipio(); }
        };
        pintarDock(CONCEPTOS.map((_, j) => j < this.c ? 'on' : j === this.c ? 'on aqui' : ''), `Concepto ${this.c + 1} de ${CONCEPTOS.length}`, 'cada uno mueve el modelo');
    },

    /* ---------- Mayéutica ---------- */
    inicioPreguntas() {
        if (['caso', 'recorrido', 'repaso'].includes(this.fase)) { this.reanudar(); return; }
        this.fase = 'inicio';
        setOcultos([], false); aplicar(estadoBase(), { frase: false, inmediato: true });
        const cont = $('preg'), hechas = Object.keys(this.resultados).length;
        const bien = Object.values(this.resultados).filter(r => r === 'on').length;
        const nG = PREGUNTAS.filter(q => q.grupo === 'guia').length, nE = PREGUNTAS.filter(q => q.grupo === 'examen').length;
        cont.innerHTML = `<div><span class="inm-eyebrow">Mayéutica</span><h2 class="inm-h">Preguntas para pensar, como Sócrates</h2></div>
            <div class="inm-ruta"><span><b>1.</b> Recorrido, en el orden de las fichas (del dolor a la subida): <b>${nG} de guía socrática</b> (${PREGUNTAS.filter(q => q.tocar).length} se predicen y se comprueban en el modelo) y <b>${nE} de examen</b>, nivel MIR, con sus trampas.</span>
            <span><b>2.</b> Otra vez lo que fallaste o sabías a medias, solo eso.</span>
            <span><b>3.</b> Casos clínicos: ${CASOS.length} pacientes que evolucionan (y la entrada de otro, en el capilar).</span></div>
            <div class="inm-fila"><button class="inm-b inm-prim" type="button" data-ir="recorrido">${hechas ? `Seguir (${hechas} de ${PREGUNTAS.length})` : 'Empezar el recorrido'}</button><button class="inm-b" type="button" data-ir="casos">Ir a los casos</button></div>
            ${hechas ? `<p class="inm-para">Guardado en este dispositivo: ${bien} de ${hechas} bien a la primera. <button class="inm-b inm-link" type="button" data-ir="cero">Empezar de cero</button></p>` : ''}
            <p class="inm-para">El paciente de los casos se inventa; la medicina sale de las fichas, y cada pregunta dice dónde.</p>`;
        entrar(cont);
        cont.onclick = e => {
            const b = e.target.closest('[data-ir]'); if (!b) return;
            if (b.dataset.ir === 'cero') { borrarGuardado(); this.resultados = {}; this.fallos = {}; this.inicioPreguntas(); return; }
            b.dataset.ir === 'recorrido' ? this.recorrido(this.siguientePendiente()) : this.listaCasos();
        };
        pintarDock(PREGUNTAS.map(q => this.resultados[q.id] || ''), 'Mayéutica', '');
    },
    reanudar() { if (this.fase === 'caso') this.pasoCaso(); else if (this.fase === 'repaso') this.repaso(); else this.recorrido(this.i); },
    siguientePendiente() { const i = PREGUNTAS.findIndex(q => !this.resultados[q.id]); return i < 0 ? PREGUNTAS.length : i; },
    recorrido(i) {
        this.fase = 'recorrido'; this.i = i;
        if (i >= PREGUNTAS.length) { this.repaso(); return; }
        const q = PREGUNTAS[i], nFallos = Object.keys(this.fallos).length;
        pintarDock(PREGUNTAS.map((p, j) => (this.resultados[p.id] === 'mal' ? 'mal' : this.resultados[p.id] ? 'on' : '') + (j === i ? ' aqui' : '')), `${GRUPO_TXT[q.grupo]} · ${i + 1} de ${PREGUNTAS.length}`, nFallos ? `para repasar: ${nFallos}` : '');
        pintarPregunta($('preg'), { ...q, num: i + 1 }, { alFinal: r => {
            this.resultados[q.id] = r.ok ? 'on' : 'mal';
            if (!r.ok) this.fallos[q.id] = { faltan: r.faltan }; else delete this.fallos[q.id];
            guardar(q.id, r.ok, { resultado: this.resultados[q.id], fallo: this.fallos[q.id] });
            this.recorrido(i + 1); alPrincipio();
        } });
    },
    repaso() {
        this.fase = 'repaso';
        setOcultos([], false); aplicar(estadoBase(), { frase: false, inmediato: true });
        const ids = PREGUNTAS.filter(q => this.fallos[q.id]).map(q => q.id), cont = $('preg');
        pintarDock(ids.map(() => 'mal'), 'Otra vez lo que fallaste', ids.length ? `quedan ${ids.length}` : '');
        cont.innerHTML = !ids.length ? `<span class="inm-eyebrow">Repaso</span><h2 class="inm-h">No queda nada por repasar</h2><p class="inm-para">Has acertado todo, o ya lo repasaste.</p><div class="inm-fila"><button class="inm-b inm-prim" type="button" data-ir="casos">Ir a los casos clínicos →</button></div>`
            : `<span class="inm-eyebrow">Repaso</span><h2 class="inm-h">Otra vez lo que fallaste: ${ids.length}</h2>
                <p class="inm-para">Cada pregunta vuelve con el modelo en su estado. En las de destapar, solo vuelve lo que no marcaste. Un acierto la saca de la lista.</p>
                <div class="inm-repaso-chips">${ids.map(id => { const n = PREGUNTAS.findIndex(q => q.id === id); return `<button class="inm-b" type="button" data-rep="${id}">${n + 1} · ${PREGUNTAS[n].corto}</button>`; }).join('')}</div>
                <div class="inm-fila"><button class="inm-b inm-link" type="button" data-ir="casos">Saltar a los casos →</button></div>`;
        entrar(cont);
        cont.onclick = e => {
            const b = e.target.closest('[data-rep]');
            if (b) {
                const n = PREGUNTAS.findIndex(q => q.id === b.dataset.rep), q = PREGUNTAS[n];
                pintarPregunta(cont, { ...q, num: n + 1 }, { repaso: this.fallos[q.id], cabecera: '<span class="inm-eyebrow">Repaso</span>', alFinal: r => {
                    if (r.ok) delete this.fallos[q.id];
                    else if (q.tipo === 'destapa' && this.fallos[q.id].faltan?.length) this.fallos[q.id].faltan = r.faltan.length ? r.faltan : this.fallos[q.id].faltan;
                    else this.fallos[q.id] = { faltan: r.faltan };
                    guardar(q.id, r.ok, { fallo: this.fallos[q.id] });
                    this.repaso(); alPrincipio();
                } });
                return;
            }
            if (e.target.closest('[data-ir="casos"]')) this.listaCasos();
        };
    },

    /* ---------- Casos clínicos ---------- */
    listaCasos() {
        this.fase = 'casos';
        setOcultos([], false); aplicar(estadoBase(), { frase: false, inmediato: true });
        const cont = $('preg');
        cont.innerHTML = `<span class="inm-eyebrow">Casos clínicos</span><h2 class="inm-h">Pacientes que evolucionan</h2>
            <p class="inm-para">El modelo se mueve al estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.</p>
            <div class="inm-casos-lista">${CASOS.map((c, k) => `<button class="inm-b" type="button" data-caso="${k}">${c.titulo}<small>${c.sub} · ${c.pasos.length} pasos</small></button>`).join('')}</div>
            <p class="inm-eyebrow">Vive en el capilar y oxígeno; aquí, su entrada</p>
            <div class="inm-entrada"><b>Shock séptico: la ScvO₂ alta que no tranquiliza</b><span>Varón de 58 años, neumonía, noradrenalina, sedado con propofol.</span><span>Giro del día 3: lleva 60 h de propofol a más de 5 mg/kg/h, el umbral del síndrome de infusión. Ese giro abre esta escena en el estado «SIP».</span>
            <span class="inm-fila"><button class="inm-b" type="button" data-sip>Ver aquí el SIP</button><button class="inm-b inm-link" type="button" data-especialidad="libros" data-view="capilarVivo" data-capilar-vivo="sepsis">🩸 Abrir el capilar y oxígeno (la mitocondria) →</button></span>${verEnTexto('mar-sedacion#mar-pris')}</div>`;
        entrar(cont);
        pintarDock(CASOS.map(() => ''), 'Casos clínicos', '');
        cont.onclick = e => {
            const b = e.target.closest('[data-caso]'); if (b) { this.caso(+b.dataset.caso); return; }
            if (e.target.closest('[data-sip]')) { setModo('explorar'); ponerEnEstado('pris'); }
        };
    },
    caso(k) { this.fase = 'caso'; this.k = k; this.p = 0; this.ficha = {}; this.pasoCaso(); alPrincipio(); },
    pasoCaso() {
        const C0 = CASOS[this.k], paso = C0.pasos[this.p];
        if (this.p === 0) this.ficha = { ...C0.paciente };
        Object.assign(this.ficha, paso.datos || {});
        const nuevos = paso.nuevo || [];
        pintarDock(C0.pasos.map((_, j) => j < this.p ? 'on' : j === this.p ? 'on aqui' : ''), C0.corto, `paso ${this.p + 1} de ${C0.pasos.length}`);
        const cab = `<span class="inm-dia">${paso.momento}</span>
            <dl class="inm-paciente">${Object.entries(this.ficha).map(([kk, v]) => `<dt>${kk}</dt><dd class="${nuevos.includes(kk) ? 'inm-cambia' : ''}">${v}</dd>`).join('')}</dl>`;
        const q = { ...paso.pregunta, estado: paso.estado, mirar: paso.mirar, ultimo: this.p === C0.pasos.length - 1, calculadora: paso.calculadora };
        pintarPregunta($('preg'), q, { cabecera: cab, alFinal: r => {
            guardar(q.id, r.ok);
            if (this.p < C0.pasos.length - 1) { this.p++; this.pasoCaso(); alPrincipio(); } else this.finCaso();
        } });
    },
    finCaso() {
        const C0 = CASOS[this.k], cont = $('preg');
        this.fase = 'casos';
        aplicar(estadoDe(C0.volver.estado), { frase: false, inmediato: true });
        const r = rutaDe(C0.volver.ancla), ex = C0.extra?.ir;
        cont.innerHTML = `<div class="inm-respuesta inm-entra"><span class="inm-eyebrow">Lo que te llevas · ${C0.corto}</span>
            <ol class="inm-lleva">${C0.lleva.map(t => `<li>${t}</li>`).join('')}</ol>
            <div class="inm-fila">${r ? `<button class="inm-b inm-link" type="button" ${atributosFicha(r)}>📖 Repasar en la ficha: ${C0.volver.nombre}</button>` : ''}
            ${ex ? `<button class="inm-b inm-link" type="button" data-especialidad="${ex.especialidad}" data-view="${ex.view}" data-panel="${ex.panel}" data-tab="${ex.tab}">${C0.extra.texto}</button>` : ''}
            <button class="inm-b" type="button" data-fin="modelo">Abrir el modelo en el estado del paciente</button>
            <button class="inm-b" type="button" data-fin="otro">Otro caso</button></div></div>`;
        entrar(cont); alPrincipio();
        pintarDock(C0.pasos.map(() => 'on'), C0.corto, 'hecho');
        cont.onclick = e => {
            const a = e.target.closest('[data-fin]')?.dataset.fin;
            if (a === 'modelo') {
                setModo('explorar'); aplicar(estadoDe(C0.volver.estado));
                if (C0.volver.subir) setTimeout(() => cambiar(x => { x.subido = true; }), REDUCIR ? 0 : 700);
            }
            if (a === 'otro') this.listaCasos();
        };
    },
};

/* Revisión automática de la forma de las preguntas (REGLAS §8), para __inmPruebas() */
function revisarMayeutica() {
    const todas = [...PREGUNTAS, ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta))];
    const tests = todas.filter(x => x.tipo === 'test'), errores = todas.filter(x => x.tipo === 'error');
    const r = { fallos: [], tests: tests.length, correctaMasLarga: 0, correctaMasCorta: 0, posiciones: [0, 0, 0, 0], errores: errores.map(x => x.frases.filter(f => f.mal).length),
        destapas: todas.filter(x => x.tipo === 'destapa').length, guia: PREGUNTAS.filter(x => x.grupo === 'guia').length, examen: PREGUNTAS.filter(x => x.grupo === 'examen').length,
        casos: CASOS.length, predice: todas.filter(x => x.tocar).length, pasos: CASOS.map(c => c.pasos.length) };
    const largo = s => s.replace(/<[^>]+>/g, '').length;
    for (const x of tests) {
        const ok = x.opciones.find(o => o.ok), max = Math.max(...x.opciones.map(o => largo(o.t)));
        if (largo(ok.t) === max) r.correctaMasLarga++;
        if (largo(ok.t) === Math.min(...x.opciones.map(o => largo(o.t)))) r.correctaMasCorta++;
        r.posiciones[barajar(x.opciones, x.id).findIndex(o => o.ok)]++;
        if (x.opciones.filter(o => o.ok).length !== 1) r.fallos.push(x.id + ': una sola correcta');
        if (x.opciones.some(o => !o.ok && !(o.porque && o.porque.length > 40))) r.fallos.push(x.id + ': opción falsa sin «qué le pasaría»');
    }
    if (r.correctaMasLarga > tests.length / 3) r.fallos.push(`la correcta es la más larga en ${r.correctaMasLarga} de ${tests.length} (> 1/3)`);
    if (r.correctaMasCorta > tests.length / 3) r.fallos.push(`la correcta es la más corta en ${r.correctaMasCorta} de ${tests.length} (> 1/3)`);
    if (r.posiciones.filter(n => n > 0).length < 3) r.fallos.push('la correcta no varía de posición');
    if (r.errores.some(n => n > 2)) r.fallos.push('«encuentra el error» con más de 2 errores');
    if (!r.guia || !r.examen) r.fallos.push('faltan Guía o Examen');
    for (const c of CASOS) {
        const tipos = new Set(c.pasos.map(p => p.pregunta.tipo));
        if (!tipos.has('error') || !tipos.has('destapa')) r.fallos.push(c.id + ': falta error o destapa');
        if (c.lleva.length !== 3) r.fallos.push(c.id + ': «Lo que te llevas» no tiene 3 puntos');
        if (c.pasos.length < 5 || c.pasos.length > 8) r.fallos.push(c.id + ': de 5 a 8 pasos');
        if (!c.pasos.some(p => /giro/.test(p.momento))) r.fallos.push(c.id + ': sin giro');
        if (!rutaDe(c.volver.ancla)) r.fallos.push(c.id + ': «Repasar en la ficha» sin destino');
        for (const p of c.pasos) if (p.calculadora && !rutaDe(p.calculadora.ir)) r.fallos.push(c.id + ': calculadora sin destino');
    }
    if (todas.some(x => !x.fuente)) r.fallos.push('pregunta sin fuente');
    for (const x of [...todas, ...CONCEPTOS]) if (!idsDe(x.fuente).some(id => rutaDe(id))) r.fallos.push((x.id || x.titulo) + ': «Ver en el texto» sin destino');
    for (const x of [...todas, ...CONCEPTOS, ...PROFUNDIZAR.map(p => ({ id: p.html.slice(3, 30), fuente: p.donde }))]) for (const id of idsDe(x.fuente)) if (!document.getElementById(id)) r.fallos.push(`${x.id || x.titulo}: la fuente ${id} no existe`);
    const ids = todas.map(x => x.id); if (new Set(ids).size !== ids.length) r.fallos.push('ids de pregunta repetidos');
    for (const x of todas.filter(x => x.tocar)) { if (x.tocar.comprobar(estadoDe(x.estado))) r.fallos.push(x.id + ': el modelo ya enseña la respuesta antes de tocar'); if (!x.tocar.comprobar(estadoDe({ ...x.estado, ...x.tocar.bueno }))) r.fallos.push(x.id + ': «bueno» no pasa la comprobación'); }
    return r;
}

/* ============================================================
   Abrir en un estado (los chips de Explorar, los botones de las fichas, el menú de Libros y el buscador)
   ============================================================ */
const PESTANA_DE = { 'dolor-oculto': 'dolor', diazepam: 'sedante', fentanilo: 'analgesia', 'morfina-ir': 'paciente', hipernocicepcion: 'dolor', 'rass-objetivo': 'sedante',
    'profunda-72h': 'sedante', despertar: 'subida', 'midazolam-48h': 'sedante', 'lorazepam-pg': 'sedante', dexmedetomidina: 'subida', pris: 'sedante', delirio: 'delirio', haloperidol: 'delirio' };
let esperaSubida = null;
function ponerEnEstado(clave) {
    const s = ESTADOS[clave]; if (!s) return;
    clearTimeout(esperaSubida);
    aplicar(estadoDe(s.e), { frase: false });
    const [fh, ff] = clave === 'dolor-oculto'
        ? [`Sedado, con el monitor tranquilo (FC ${D.fc.txt})… y ${R('BPS 9')}: le duele. Mira la cara, no la FC.`, 'ficha · mar-bps-intro · mar-constantes-dolor · RASS del estado: ilustrativo']
        : fraseDe(estadoBase(), estado);
    fraseActual = '';
    decir(fh.startsWith(s.nombre) ? fh : `<b>${s.nombre}.</b> ` + fh, ff);
    elegirPestana(PESTANA_DE[clave] || 'dolor');
    if (s.subir) esperaSubida = setTimeout(() => { if (estado.par && !estado.subido) cambiar(x => { x.subido = true; }); }, REDUCIR ? 0 : 900);
}
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde otro modelo vivo (se conserva el que había; ver core/volver-ficha.js). Sin estado (menú o ventana de la
// cama): la cama 7 grande y su zoom de entrada; con estado, la cama compacta y la escena en ese estado.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('inm-volver'), raiz, origen);
    if (modo !== 'explorar') setModo('explorar');
    if (clave && ESTADOS[clave]) ponerEnEstado(clave);
    cama?.mostrar({ intro: !clave });
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

/* ============================================================
   Arranque (después de cargar los partials)
   ============================================================ */
function leyendas() {
    const ic = (vb, s) => `<svg viewBox="${vb}" width="26" height="26" aria-hidden="true" focusable="false">${s}</svg>`;
    const it = [
        [ic('-30 -30 60 60', caraGrabado(4, 'apretados', 3)), 'La cara del paciente, en el visor y en el medallón: la BPS (Tabla 6.1). De relajada a muecas; los puños, los miembros superiores.'],
        [ic('14 48 34 22', lastreSVG('plomo', 1, 24, false)), 'Propofol: lastre de plomo liso. Hunde rápido; al soltarlo, sube según la Tabla 6.7.'],
        [ic('14 46 34 28', lastreSVG('esponja', 1, 24, false)), 'Midazolam: esponja que en perfusión pesa cada vez más (se acumula; ≤48 h).'],
        [ic('14 46 34 48', lastreSVG('barril', 1, 24, false)), 'Lorazepam: con un barril de propilenglicol que gotea con dosis altas más de 48 h.'],
        [ic('14 46 34 28', lastreSVG('piedra', 1, 24, false)), 'Diazepam: piedra (vida media de 90 h). Hunde y no quita el dolor.'],
        [ic('-14 -18 28 28', '<ellipse rx="10" ry="6.5" style="fill:var(--accent-yellow)"/><path d="M-4 -6 V6 M3 -6.3 V6.3" style="stroke:var(--bg-main);stroke-width:2"/><path d="M0 -6.5 V-14" style="stroke:var(--text-dim)"/>'), 'Dexmedetomidina: boya. Se despierta al llamarle y vuelve solo (cooperativa).'],
        [ic('-14 -12 30 26', '<g transform="rotate(28)"><rect x="-9" y="-7" width="18" height="14" rx="4" style="fill:url(#inm-p-raya);stroke:var(--accent-blue)"/><path d="M9 -2 L20 -7 L20 -4 L10 2" style="fill:var(--accent-blue)"/></g>'), 'Opioide: aceite que calma la tormenta. Su rótulo da el inicio de la Tabla 6.2.'],
        [iconoParticula('lact', 22), 'Lactato (trípode, el mismo del capilar): del propilenglicol y del SIP.'],
        [iconoParticula('h', 22), 'H⁺ (cruz): la acidosis.'],
        [iconoParticula('cito', 22), 'Inflamación sistémica (trébol). La ficha nombra los prostanoides.'],
    ];
    $('leyenda').innerHTML = it.map(([s, t]) => `<li>${s}<span>${t}</span></li>`).join('');
    $('libro').innerHTML = LAMINAS.map(([f, n, c]) => `<div class="article-figure inm-lam"><img loading="lazy" src="js/modules/libros/img/${f}" alt="${n} del libro: ${c}"></div>`).join('')
        + `<p class="inm-para"><b>Lámina del libro · Fig. 6.1.</b> ¿El diazepam alivia el dolor? Contestó mal el <span class="hl-rojo">~80 % de los residentes</span> y el ~43 % de las enfermeras. Tócala para ampliarla. <span class="inm-org">ficha · p. 17</span></p>`;
    $('chips-estado').innerHTML = Object.entries(ESTADOS).map(([k, s]) => `<button type="button" data-estado="${k}" aria-pressed="false">${s.nombre}<small>${s.sub}</small></button>`).join('');
    $('prof-lista').innerHTML = profundizarHTML();
    $('prof-may').innerHTML = profundizarHTML();
}
export function init() {
    raiz = document.getElementById('inm-raiz');
    if (!raiz) return null;
    initEscena();
    chipsDock(); leyendas(); engancharDock();
    Estudio.cargar();
    aplicar(estadoBase(), { frase: false, inmediato: true }); decir(...FRASE_INICIO());
    // La cama 7: su zoom de entrada sumerge al paciente; el respirador es la tercera categoría de la BPS
    cama = montarCama7($('cama7'), 'inmersion');
    raiz.addEventListener('c7-entrada', () => { if (modo === 'explorar') sumergir(); fraseActual = ''; decir(...fraseDe(null, estado)); });
    raiz.addEventListener('c7-aparato', ev => { if (ev.detail === 'respirador') { fraseActual = ''; decir(`El respirador: «adaptación al ventilador» es una de las tres categorías de la BPS. Ahora: ${D.items.vent} (${['', 'lo tolera', 'tose, pero lo tolera', 'lucha', 'imposible controlarla'][D.items.vent]}).`, 'ficha · mar-bps-intro · mar-bps-calc'); } });

    // El dock mide lo que mide: la página deja ese hueco abajo (y el reloj del Modo Estudio sube).
    const dock = $('dock');
    new ResizeObserver(() => { if (dock.offsetHeight) document.documentElement.style.setProperty('--inm-dock-h', dock.offsetHeight + 'px'); }).observe(dock);
    // La vista se ve o deja de verse (todas las vistas están en el DOM): medir al aparecer.
    let anchoVisible = 0, motionPedido = false;
    const caja = $('escena');
    new ResizeObserver(() => {
        const a = Math.round(caja.clientWidth);
        document.body.classList.toggle('inm-activo', a > 0);
        if (!a) { anchoVisible = 0; cama?.parar(); return; }
        if (!anchoVisible) { const v = document.getElementById('inmersion-viva-view'); if (v && v.getBoundingClientRect().top < 0) v.scrollIntoView({ block: 'start' }); }
        anchoVisible = a;
        if (!motionPedido) { motionPedido = true; cargarMotion().catch(() => { /* sin Motion, sin subida animada */ }); }
        arrancar();
    }).observe(caja);
    new IntersectionObserver(es => ponerVisible(es[0].isIntersecting)).observe(caja);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });

    // Para las pruebas (Playwright): las cifras de cada estado, los estados pintados, la Mayéutica y el bucle.
    window.__inmPruebas = () => {
        const r = pruebasInmersion();
        // la voz: con dexmedetomidina sube a la superficie y te mira
        const ed = estadoDe(ESTADOS.dexmedetomidina.e), voz = respuestaVoz('voz', ed, derivar(ed));
        if (!(voz.y === SUPERFICIE && voz.mira)) { r.todoCoincide = false; r.fallos.push('dexmedetomidina: a la voz no sube a la superficie'); }
        r.mayeutica = revisarMayeutica();
        if (r.mayeutica.fallos.length) { r.todoCoincide = false; r.fallos.push(...r.mayeutica.fallos); }
        const celdas = [...raiz.querySelectorAll('#inm-tablero .inm-celda')].map(c => ({ k: c.querySelector('.inm-k').textContent, v: c.querySelector('b').textContent }));
        const relojes = [...raiz.querySelectorAll('#inm-g-relojes [data-reloj]')].map(g => ({ k: g.dataset.reloj, v: g.dataset.valor }));
        return { ...r, estado: copia(estado), D: { bps: D.bps, rass: D.rass, fc: D.fc, pa: D.pa, av: D.av, par: D.par }, modo, fase: Estudio.fase, ocultos: [...ocultos], celdas, relojes,
            bucle: estadoBucle(), vaciarFotogramas, guardado: leerGuardado(), cama: $('cama7').classList.contains('c7-compacta') ? 'compacta' : 'grande' };
    };

    return { abrir: abrirEstado };
}
