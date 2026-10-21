// El telar de la trombina: datos puros, sin DOM (Libros → Marino → Fundamentos, cap. 5: fichas X
// mar-tromboprofilaxis-farmacos y XI mar-tromboprofilaxis-escenarios). Escena de la pierna de «La cama 7».
// Viene de la maqueta aprobada autonomo/maquetas/b1-telar.html (vuelta 2, 20/10/2026; auditoría
// autonomo/bloques/b1/auditoria-cama7.md §2 y juicio-cama7.md §2).
// Toda la medicina sale de las fichas de js/modules/libros/marino-fundamentos.html y de
// docs/marino-2024-practicas-monitorizacion-caps5-9.pdf (el cap. 5 ocupa las págs. 1-15 del PDF: «p. N»). Cada cifra
// dice su origen: ficha, fisiología general o ilustrativo. El paciente de los casos se inventa; la medicina, no.
//
// Aquí: la hoja de órdenes (estado) y lo que se deriva de ella (derivar), la lógica de la calculadora
// #mar-profilaxis-calc (calcProfilaxis de marino-fundamentos.js, copiada tal cual: la prueba
// autonomo/pruebas/telar-vivo.mjs la coteja con la calculadora real), los estados con nombre (los que abre
// data-telar-vivo="<estado>"), los conceptos, la Mayéutica, los casos, «Para profundizar», las láminas y la prueba de
// las cifras (pruebasTelar). La escena vive en js/modules/libros/telar-vivo-escena.js y la interfaz en telar-vivo.js.
//
// Formato de `fuente`: «mar-elemento · mar-elemento (p. N)»; la interfaz lo convierte en «Ver en el texto» (enlaces a
// la ficha) y en el chip de origen («ficha · p. N»), sin ids a la vista.

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const copia = o => JSON.parse(JSON.stringify(o));
export const PDF = p => `docs/marino-2024-practicas-monitorizacion-caps5-9.pdf#page=${p}`;

/* ============================================================
   Riesgo (Tabla 5.1 y sus acordeones; Fig. 5.1 con lectura aproximada)
   ============================================================ */
export const RIESGOS = {
    ninguno: { nombre: 'Sin riesgo elegido' },
    cirugia: { nombre: 'Cirugía mayor', inflama: true, frase: 'Cirugía mayor (anestesia general o raquídea de más de 45 min): <span class="hl-rojo">un tercio de las muertes por ETV</span>. El riesgo dura 6-12 semanas, más allá del alta. Tromboplastina, inflamación, lesión vascular y reposo.', fuente: 'mar-tev-cirugia (p. 2)' },
    trauma: { nombre: 'Trauma grave', inflama: true, frase: 'Trauma grave sin profilaxis: <span class="hl-rojo">TVP en el 58 %</span>, el riesgo más alto. Tromboplastina e inflamación de la lesión, lesión vascular, lípidos de los huesos largos e inmovilidad.', fuente: 'mar-tev-trauma (p. 2)' },
    medica: { nombre: 'Enfermedad médica aguda', inflama: true, frase: 'Ingresar por una enfermedad médica aguda multiplica el riesgo <span class="hl-rojo">por 8</span>; son la mayoría (50-75 %) de las ETV del hospital. En la UCI se suman la ventilación &gt;48 h, la sepsis, el shock, los vasopresores y los catéteres.', fuente: 'mar-tev-medica · mar-tev-uci (p. 2-3)' },
    medular: { nombre: 'Lesión medular', inflama: true, frase: 'Lesión medular: el grupo de más ETV de la Fig. 5.1 (~60-80 %, lectura aproximada). Según el autor, el riesgo es alto <span class="hl">solo 3-4 semanas</span>.', fuente: 'mar-fig-5-1 (lectura aproximada) · mar-inmovilidad (p. 3, 13)' },
    at3: { nombre: 'Déficit de antitrombina III', inflama: false, frase: 'Déficit hereditario de antitrombina III: <span class="hl-rojo">riesgo × 14</span>. En la lupa, menos guardianas: quedan 2 escudos de 6 (ilustrativo).', fuente: 'mar-tev-uci (p. 3) · ilustrativo' },
};

// Qué corta cada fármaco en el telar (Fig. 5.2 y texto). «xa»/«iia»: qué hilo corta; vía: con o sin antitrombina.
export const FARMACOS = {
    hnf: { nombre: 'HNF', largo: 'HNF', via: 'at', xa: true, iia: 'pleno', fuente: 'mar-hnf · mar-img-5-2 (p. 4-6)' },
    enoxaparina: { nombre: 'Enoxaparina', largo: 'enoxaparina (HBPM)', via: 'at', xa: true, iia: 'poco', fuente: 'mar-hbpm · mar-img-5-2 (p. 6-7)' },
    dalteparina: { nombre: 'Dalteparina', largo: 'dalteparina (HBPM)', via: 'at', xa: true, iia: 'poco', fuente: 'mar-hbpm · mar-img-5-2 (p. 6-7)' },
    fondaparinux: { nombre: 'Fondaparinux', largo: 'fondaparinux', via: 'at', xa: true, iia: 'no', fuente: 'mar-fondaparinux · mar-img-5-2 (p. 6, 8)' },
    apixaban: { nombre: 'Apixabán', largo: 'apixabán', via: 'directa', xa: true, iia: 'no', fuente: 'mar-acod-puntos · mar-img-5-2 (p. 6, 8)' },
    rivaroxaban: { nombre: 'Rivaroxabán', largo: 'rivaroxabán', via: 'directa', xa: true, iia: 'no', fuente: 'mar-acod-puntos · mar-img-5-2 (p. 6, 8)' },
    dabigatran: { nombre: 'Dabigatrán', largo: 'dabigatrán', via: 'directa', xa: false, iia: 'pleno', fuente: 'mar-acod-puntos · mar-img-5-2 (p. 6, 8)' },
    warfarina: { nombre: 'Warfarina', largo: 'warfarina', via: 'lenta', xa: false, iia: 'no', fuente: 'mar-acod-puntos (p. 8)' },
};
export const ES_HBPM = f => f === 'enoxaparina' || f === 'dalteparina';
export const ES_HEPARINA = f => f === 'hnf' || ES_HBPM(f) || f === 'fondaparinux';
// Cuentas de cada cadena: solo las 5 del fondaparinux son de la ficha (el pentasacárido); el resto, ilustrativo
// (HNF: de 3.000 a 30.000 Da, algunas más cortas que la HBPM y otras mucho más largas).
export const CUENTAS = { hnf: [6, 12, 20, 9, 16, 14], hbpm: [9, 9, 9, 9, 9, 9], cinco: [5, 5, 5, 5, 5, 5] };
export const HEP = { hnfDa: [3000, 30000], hbpmDa: 4500, antiIIaVecesAntiXa: 10, biodisp: { hbpm: 90, hnf: [15, 30] }, tih: { hnf: 2.6, hbpm: 0.2 }, antiXa: [0.2, 0.5], fondaVida: 17 };
export const MEDIAS = { tobillo: 18, muslo: 8, gradiente: 10 };                   // mar-mecanica, p. 10
export const CNI = { tobillo: [35, 40], muslo: 20, ciclo: 10, porMinuto: 6 };    // mar-mecanica, mar-cni-pegas, p. 10
export const NEURO = { hnf: 12, enoxaparina: 24, apixaban: 24, rivaroxaban: 48, dabigatran: 48 };   // mar-neuroeje, p. 9-10
export const NEURO_NOMBRE = { hnf: 'HNF SC', enoxaparina: 'Enoxa 1/día', apixaban: 'Apixabán', rivaroxaban: 'Rivaroxabán', dabigatran: 'Dabigatrán' };
export const ORDEN_NEURO = ['hnf', 'enoxaparina', 'apixaban', 'rivaroxaban', 'dabigatran'];
export const GASTO_BAJO = 0.35;   // fracción del flujo con gasto bajo: ilustrativo (la estasis sí es fisiología general)

/* La lógica de la calculadora #mar-profilaxis-calc (js/modules/libros/marino-fundamentos.js, calcProfilaxis), copiada
   tal cual: solo cambia que devuelve el resultado en vez de pintarlo. La prueba la coteja con la calculadora real. */
export function profilaxis(f, clcr, imc) {
    const obeso = imc >= 40;
    let estado = 'ok', txt = '';
    switch (f) {
        case 'hnf': txt = obeso ? '<strong>7.500 U cada 8 h</strong> (obesidad, IMC ≥40).' : '<strong>5.000 U cada 8-12 h</strong>. Sin ajuste renal.'; break;
        case 'enoxaparina':
            if (clcr < 30) { estado = 'warn'; txt = '<strong>30 mg al día</strong>, o usar heparina no fraccionada (ClCr &lt;30).'; }
            else txt = obeso ? '<strong>40 mg cada 12 h</strong> (obesidad, IMC ≥40).' : '<strong>40 mg al día o 30 mg cada 12 h</strong>.';
            if (clcr < 30 && obeso) txt += ' La tabla no da una pauta para obesidad e insuficiencia renal a la vez.';
            break;
        case 'dalteparina':
            if (obeso) { estado = 'warn'; txt = '<strong>No bien estudiada</strong> en la obesidad (IMC ≥40).'; }
            else txt = '<strong>2.500-5.000 U al día</strong>. Sin ajuste renal.';
            break;
        case 'fondaparinux':
            if (clcr < 20) { estado = 'danger'; txt = '<strong>No usar</strong> (ClCr &lt;20, y también &lt;30 según la tabla).'; }
            else if (clcr < 35) { estado = 'warn'; txt = `<strong>La fuente no es clara aquí</strong> (ClCr ${clcr}): el texto da 1,5 mg al día entre 20 y 50; la Tabla 5.2 no dice nada para 30-35 (da 1,5 mg con 35-50 y prohíbe por debajo de 30).`; }
            else if (clcr <= 50) { estado = 'warn'; txt = '<strong>1,5 mg al día</strong> (ClCr 35-50).'; }
            else txt = '<strong>2,5 mg al día</strong>.';
            if (obeso) txt += ' En la obesidad, la tabla no da recomendaciones.';
            break;
        case 'dabigatran':
            if (clcr < 30) { estado = 'danger'; txt = '<strong>No usar</strong> (ClCr &lt;30).'; }
            else if (obeso) { estado = 'danger'; txt = '<strong>No usar</strong> si IMC ≥40 o peso &gt;120 kg.'; }
            else txt = '<strong>110 mg al inicio, luego 220 mg al día</strong>. No usar si el peso es &gt;120 kg.';
            break;
        case 'apixaban':
            txt = clcr < 15 ? '<strong>No usar</strong> (ClCr &lt;15).' : '<strong>2,5 mg cada 12 h</strong>; dosis estándar también en la obesidad.';
            if (clcr < 15) estado = 'danger';
            break;
        case 'rivaroxaban':
            txt = clcr < 15 ? '<strong>No usar</strong> (ClCr &lt;15).' : '<strong>10 mg al día</strong>; dosis estándar también en la obesidad.';
            if (clcr < 15) estado = 'danger';
            break;
        case 'warfarina': txt = '<strong>2,5-5 mg al día</strong>, ajustando a un INR de 1,5-2,5. Sin ajuste renal ni ajuste conocido en la obesidad.'; break;
    }
    const aviso15 = clcr < 15 ? '<p>El capítulo (pág. 11) dice que con ClCr &lt;15 solo se pueden usar HNF o warfarina.</p>' : '';
    if (aviso15 && estado === 'ok') estado = 'warn';
    return { estado, html: `${txt}${aviso15}`, corta: (txt.match(/<strong>(.*?)<\/strong>/) || [])[1] || '', aviso15: !!aviso15 };
}

/* ============================================================
   La hoja de órdenes y lo que se deriva de ella
   ============================================================ */
export function estadoBase() {
    return { vista: 'telar', riesgo: 'ninguno', inflamacion: false, inmovil: false, gastoBajo: false, tih: false,
        farmaco: null, antiXa: false, clcr: 90, imc: 25, mecanica: 'nada', diastolica: 70, filtro: false, horas: 6 };
}
export const estadoDe = parcial => Object.assign(estadoBase(), copia(parcial || {}));

// Todo lo que se ve sale de aquí (y la prueba lo comprueba)
export function derivar(e) {
    const D = {};
    const f = e.farmaco ? FARMACOS[e.farmaco] : null;
    D.f = f;
    D.velocidad = e.gastoBajo ? GASTO_BAJO : 1;            // la inmovilidad no la cambia: sistema cerrado, gasto = retorno venoso (mar-inmovilidad)
    D.flujoTxt = e.gastoBajo ? '35 %' : '100 %';
    D.atN = e.riesgo === 'at3' ? 2 : 6;
    // estímulo del telar: qué lo enciende es de la ficha; cuánto, ilustrativo
    D.estimulo = e.inflamacion ? 1 : e.riesgo === 'at3' ? 0.55 : e.gastoBajo ? 0.4 : 0;
    // qué hilo corta (ficha); cuánto frena (ilustrativo)
    D.corta = { xa: !!(f && f.xa), iia: f ? f.iia : 'no', viaAT: !!(f && f.via === 'at'), directa: !!(f && f.via === 'directa') };
    const bxa = !f ? 0 : f.via === 'lenta' ? 0 : f.xa ? (f.via === 'at' && e.riesgo === 'at3' ? 0.35 : 0.8) : 0;
    const biia = !f ? 0 : f.iia === 'pleno' ? 0.85 : f.iia === 'poco' ? 0.2 : 0;
    D.teje = +(D.estimulo * (1 - bxa) * (1 - biia)).toFixed(3);
    D.lisis = e.mecanica === 'cni';
    D.tendencia = D.lisis ? (D.teje > 0.3 ? 'frenada' : 'se deshace') : D.teje > 0.3 ? 'crece' : D.teje > 0.01 ? 'frenada' : 'quieta';
    D.atrapaEmbolos = e.filtro;
    // TIH (mar-hnf «Uniones», mar-hbpm). Los lazos son una imagen ilustrativa de «la heparina se une al FP4». Del
    // fondaparinux la ficha solo dice que puede usarse con TIH sospechada o previa y que el tratamiento aprobado de la
    // TIH es el argatrobán: no se dibuja ninguna relación con el FP4 (auditoría, G1).
    D.tih = { envuelve: e.farmaco === 'hnf' ? 'si' : ES_HBPM(e.farmaco) ? 'poco' : e.farmaco === 'fondaparinux' ? 'sin dato' : 'sin heparina',
        fondaUsoTihPrevia: e.farmaco === 'fondaparinux', tratamientoAprobado: 'argatrobán',
        incidencia: e.farmaco === 'hnf' ? HEP.tih.hnf : ES_HBPM(e.farmaco) ? HEP.tih.hbpm : null, dependeDosis: false };
    D.plaquetasCaen = e.tih && (e.farmaco === 'hnf' || ES_HBPM(e.farmaco));
    // la dosis: la calculadora de la ficha
    D.dosis = e.farmaco ? profilaxis(e.farmaco, e.clcr, e.imc) : null;
    // el vaso del riñón: el veredicto renal (con el IMC normal, para no mezclar la obesidad); su altura, ilustrativa
    D.renal = e.farmaco ? profilaxis(e.farmaco, e.clcr, 25) : null;
    D.vaso = !D.renal ? 0 : e.farmaco === 'hnf' || e.farmaco === 'warfarina' ? 0.18 : D.renal.estado === 'danger' ? 1 : D.renal.estado === 'warn' ? 0.62 : 0.18;
    D.notaFonda = e.farmaco === 'fondaparinux' && e.clcr >= 20 && e.clcr < 35;
    D.notaDalte = e.farmaco === 'dalteparina' && e.clcr < 15;
    // la profilaxis mecánica
    D.medias = e.mecanica === 'medias' ? { ...MEDIAS } : null;
    D.cni = e.mecanica === 'cni' ? { ...CNI, fibrinolisis: true, aprietaArteria: e.diastolica < CNI.tobillo[0] } : null;   // 35-40 mmHg frente a la PAD
    // el reloj neuroaxial
    D.reloj = Object.fromEntries(ORDEN_NEURO.map(k => [k, e.horas >= NEURO[k]]));
    D.antiXa = e.antiXa && ES_HBPM(e.farmaco) ? { objetivo: HEP.antiXa } : null;
    return D;
}

/* Estados con nombre: los que abre data-telar-vivo="<estado>" (fichas, menú, buscador y Mayéutica de las fichas).
   `clave`: la orden que define el estado (su frase es la de esa orden); `cifra`: lo que la prueba comprueba. */
export const ESTADOS = {
    sano: { nombre: 'Sano', e: {}, cifra: d => d.velocidad === 1 && d.teje === 0 },
    inflamacion: { nombre: 'Inflamación', clave: 'inflamacion', e: { inflamacion: true }, cifra: d => d.velocidad === 1 && d.tendencia === 'crece' },
    inmovil: { nombre: 'Inmóvil: la adivinanza', clave: 'inmovil', e: { inmovil: true }, cifra: d => d.velocidad === derivar(estadoBase()).velocidad && d.teje === 0 },
    hnf: { nombre: 'HNF', clave: 'farmaco', e: { inflamacion: true, farmaco: 'hnf' }, cifra: d => d.corta.xa && d.corta.iia === 'pleno' && d.dosis.corta === '5.000 U cada 8-12 h' },
    hbpm: { nombre: 'HBPM (enoxaparina)', clave: 'farmaco', e: { inflamacion: true, farmaco: 'enoxaparina' }, cifra: d => d.corta.xa && d.corta.iia === 'poco' && d.dosis.corta === '40 mg al día o 30 mg cada 12 h' },
    fondaparinux: { nombre: 'Fondaparinux', clave: 'farmaco', e: { inflamacion: true, farmaco: 'fondaparinux' }, cifra: d => d.corta.xa && d.corta.iia === 'no' && d.dosis.corta === '2,5 mg al día' },
    'xa-directo': { nombre: 'Xa directo (apixabán)', clave: 'farmaco', e: { inflamacion: true, farmaco: 'apixaban' }, cifra: d => d.corta.directa && d.corta.xa && d.dosis.corta === '2,5 mg cada 12 h' },
    dabigatran: { nombre: 'Dabigatrán', clave: 'farmaco', e: { inflamacion: true, farmaco: 'dabigatran' }, cifra: d => d.corta.directa && d.corta.iia === 'pleno' && d.dosis.corta === '110 mg al inicio, luego 220 mg al día' },
    tih: { nombre: 'TIH con HNF', clave: 'vista', e: { vista: 'tih', tih: true, farmaco: 'hnf' }, cifra: d => d.tih.envuelve === 'si' && d.tih.incidencia === 2.6 && !d.tih.dependeDosis },
    'tih-fondaparinux': { nombre: 'TIH y fondaparinux', clave: 'farmaco', e: { vista: 'tih', tih: true, farmaco: 'fondaparinux' }, cifra: d => d.tih.envuelve === 'sin dato' && d.tih.fondaUsoTihPrevia && d.tih.tratamientoAprobado === 'argatrobán' },
    'renal-25': { nombre: 'Enoxaparina, ClCr 25', clave: 'clcr', e: { farmaco: 'enoxaparina', clcr: 25 }, cifra: d => d.dosis.corta === '30 mg al día' && d.vaso > 0.5 },
    'fonda-32': { nombre: 'Fondaparinux, ClCr 32', clave: 'clcr', e: { farmaco: 'fondaparinux', clcr: 32 }, cifra: d => d.notaFonda && d.dosis.estado === 'warn' },
    'renal-12': { nombre: 'Dalteparina, ClCr 12', clave: 'clcr', e: { farmaco: 'dalteparina', clcr: 12 }, cifra: d => d.dosis.aviso15 && d.notaDalte },
    'obesidad-42': { nombre: 'Enoxaparina, IMC 42', clave: 'imc', e: { farmaco: 'enoxaparina', imc: 42 }, cifra: d => d.dosis.corta === '40 mg cada 12 h' },
    medias: { nombre: 'Medias', clave: 'mecanica', e: { mecanica: 'medias' }, cifra: d => d.medias.tobillo === 18 && d.medias.muslo === 8 && d.medias.gradiente === 10 },
    cni: { nombre: 'CNI', clave: 'mecanica', e: { mecanica: 'cni', inflamacion: true }, cifra: d => d.cni.ciclo === 10 && d.cni.muslo === 20 && d.cni.tobillo.join('-') === '35-40' && d.lisis },
    'cni-diastolica': { nombre: 'CNI y PAD 34', clave: 'diastolica', e: { mecanica: 'cni', diastolica: 34 }, cifra: d => d.cni.aprietaArteria },
    filtro: { nombre: 'Filtro de cava', clave: 'filtro', e: { filtro: true, inflamacion: true }, cifra: d => d.atrapaEmbolos && d.tendencia === 'crece' },
    neuroeje: { nombre: 'Reloj neuroaxial, 24 h', clave: 'horas', e: { vista: 'reloj', horas: 24 }, cifra: d => d.reloj.hnf && d.reloj.enoxaparina && d.reloj.apixaban && !d.reloj.rivaroxaban && !d.reloj.dabigatran },
};

/* ============================================================
   El chip de origen: «ficha», «fisiología general» o «ilustrativo», y la página del PDF. El id de la ficha nunca se ve.
   ============================================================ */
export const PAGINAS = { 'mar-tev-intro': '1', 'mar-tabla-5-1': '2', 'mar-tev-cirugia': '2', 'mar-tev-trauma': '2', 'mar-tev-medica': '2', 'mar-tev-uci': '3', 'mar-fig-5-1': '3', 'mar-img-5-1': '3',
    'mar-tev-contra-absolutas': '4', 'mar-tev-contra-relativas': '4', 'mar-tabla-5-2': '4', 'mar-profilaxis-calc': '4, 8-9', 'mar-hnf': '4-5', 'mar-hbpm': '6-7', 'mar-img-5-2': '6',
    'mar-fondaparinux': '8', 'mar-fondaparinux-errata': '4, 8', 'mar-nota-dalteparina-farmacos': '4, 7, 11', 'mar-tabla-5-3': '8-9', 'mar-acod-puntos': '8-9', 'mar-aspirina': '9',
    'mar-neuroeje': '9-10', 'mar-mecanica': '10', 'mar-cni-pegas': '10', 'mar-filtro-vci': '11', 'mar-esc-alto-riesgo': '11', 'mar-esc-especiales': '11', 'mar-esc-cirugia-general': '11',
    'mar-esc-bariatrica': '11-12', 'mar-esc-ortopedica': '12', 'mar-esc-neuro-cardio': '12', 'mar-esc-trauma': '12', 'mar-esc-tce': '12', 'mar-esc-medica': '13', 'mar-inmovilidad': '13' };
/* ============================================================
   La explicación guiada de cada estado con nombre (REGLAS §7.10; core/explicacion-guiada.js): 3-5 pasos cortos.
   Cada paso: { t, mirar (el anillo del telar: ANCLAS de telar-vivo-escena.js), resalta (un marco: una cifra del
   tablero o la caja de la dosis), e (cómo cambia la hoja de órdenes en ese paso), cita (core/citas.js: ficha,
   párrafo y página del PDF), org }. Todo sale de las fichas de la tromboprofilaxis (Marino, cap. 5).
   ============================================================ */
export const PDF_B = 'docs/marino-2024-practicas-monitorizacion-caps5-9.pdf';
const ESC = new Set(['mar-mecanica', 'mar-mecanica-intro', 'mar-cni-pegas', 'mar-filtro-vci', 'mar-esc-alto-riesgo', 'mar-esc-especiales', 'mar-esc-medica', 'mar-esc-trauma', 'mar-inmovilidad', 'mar-nota-dalteparina-escenarios']);
const TP = (id, pag = PAGINAS[id]) => ({ libro: 'Marino, cap. 5', ficha: ESC.has(id) ? 'mar-tromboprofilaxis-escenarios' : 'mar-tromboprofilaxis-farmacos', id, pag, pdf: PDF_B });
const CELDA = n => `#tel-tablero .tel-celda:nth-child(${n})`;
export const GUIAS = {
    sano: [
        { t: 'La enfermedad tromboembólica venosa es frecuente, a menudo oculta y corregible: se cita como <span class="hl-rojo">la primera causa de muerte evitable</span> en el hospital.', mirar: 'telar', cita: TP('mar-tev-intro') },
        { t: 'Los trombos se forman sobre todo en las venas femorales e ilíacas, y suelen ser silentes hasta que embolizan. Aquí, la femoral.', mirar: 'valvula', cita: TP('mar-tev-intro') },
        { t: 'Los hematíes suben al ritmo del gasto: con el gasto normal, el retorno venoso también lo es.', mirar: 'flujo', resalta: CELDA(1), cita: TP('mar-inmovilidad') },
        { t: 'Las antitrombinas, quietas: la heparina se une a la antitrombina y la activa.', mirar: 'telar', resalta: CELDA(3), cita: TP('mar-hnf'), org: 'cuántas antitrombinas: ilustrativo' },
    ],
    inflamacion: [
        { t: 'La inflamación y la coagulación están muy ligadas. En el telar: la tejedora, la trombina, trabaja y <span class="hl-rojo">la red de fibrina crece</span>.', mirar: 'telar', resalta: CELDA(2), cita: TP('mar-inmovilidad'), org: 'trombina y fibrina como mecanismo: fisiología general; el libro solo dice «muy ligadas»; el ritmo: ilustrativo' },
        { t: 'El flujo sigue intacto: no hay estasis. La red crece por la inflamación.', mirar: 'flujo', resalta: CELDA(1), cita: TP('mar-inmovilidad') },
        { t: 'Lo que dispararía la TVP en muchos pacientes de alto riesgo sería probablemente la inflamación (además de la lesión vascular en trauma y ortopedia).', mirar: 'telar', cita: TP('mar-inmovilidad'), org: 'opinión del autor' },
        { t: 'En la UCI se suman la inflamación sistémica (sepsis), el shock, los vasopresores, la ventilación prolongada (>48 h) y los catéteres centrales.', mirar: 'valvula', cita: TP('mar-tev-uci') },
    ],
    inmovil: [
        { t: 'La adivinanza del autor: si la inmovilidad es factor de riesgo, ¿por qué la TVP no es epidémica en ancianos encamados con contracturas?', mirar: 'flujo', cita: TP('mar-inmovilidad') },
        { t: 'La idea viene de la tríada de Virchow (estasis), pero <span class="hl">inmovilidad no es estasis</span>: en un sistema cerrado, si el gasto es normal, el retorno venoso también lo es.', mirar: 'flujo', resalta: CELDA(1), cita: TP('mar-inmovilidad') },
        { t: 'Tres semanas inmóvil, y los hematíes suben al mismo ritmo: el telar no teje.', mirar: 'telar', resalta: CELDA(2), cita: TP('mar-inmovilidad'), org: 'el telar quieto: ilustrativo' },
        { t: 'Según el autor, creer que la inmovilidad predispone a la TVP probablemente lleva a usar <span class="hl-rojo">anticoagulantes de más</span>.', mirar: 'flujo', cita: TP('mar-inmovilidad'), org: 'opinión del autor' },
    ],
    hnf: [
        { t: 'Heparina no fraccionada: una mezcla heterogénea de moléculas de tamaños distintos, de 3.000 a 30.000 daltons.', mirar: 'telar', cita: TP('mar-hnf') },
        { t: 'Se une a la antitrombina y la activa: <span class="hl">inhibe el Xa</span> (la rueda) y con ello la generación de trombina.', mirar: 'xa', cita: [TP('mar-hnf'), TP('mar-img-5-2')] },
        { t: 'También se une a la trombina (la tejedora): efecto anti-IIa, 10 veces el anti-Xa. Depende de la longitud de la cadena: <span class="hl-rojo">efecto variable</span>.', mirar: 'iia', resalta: CELDA(3), cita: TP('mar-hnf') },
        { t: 'La activación de la antitrombina es muy sensible: bastan dosis bajas. 5.000 U SC cada 8-12 h.', resalta: '#tel-dosis', cita: [TP('mar-hnf'), TP('mar-tabla-5-2')] },
    ],
    hbpm: [
        { t: 'Enoxaparina, una HBPM: heparina cortada, moléculas más pequeñas y uniformes (4.500 daltons de media).', mirar: 'telar', cita: TP('mar-hbpm') },
        { t: 'Inhibe el Xa, pero <span class="hl">se une menos a la trombina</span>: respuesta predecible, sin monitorizar de rutina.', mirar: 'xa', resalta: CELDA(3), cita: [TP('mar-hbpm'), TP('mar-img-5-2')] },
        { t: 'Frente a la HNF: biodisponibilidad del 90 % (15-30 %) y TIH en el 0,2 % (2,6 %).', mirar: 'iia', cita: TP('mar-hbpm') },
        { t: '40 mg al día, o 30 mg cada 12 h en el alto riesgo.', resalta: '#tel-dosis', cita: [TP('mar-hbpm'), TP('mar-tabla-5-2')] },
    ],
    fondaparinux: [
        { t: 'La «heparina diminuta»: un análogo sintético del pentasacárido que une la heparina a la antitrombina. Cinco cuentas.', mirar: 'telar', cita: TP('mar-fondaparinux') },
        { t: 'Es el primer inhibidor selectivo del Xa: <span class="hl">solo frena el Xa</span>.', mirar: 'xa', resalta: CELDA(3), cita: [TP('mar-fondaparinux'), TP('mar-img-5-2')] },
        { t: '2,5 mg SC al día, vida media de 17 h; lo elimina el riñón. No es popular ni se ha estudiado en la UCI.', resalta: '#tel-dosis', cita: [TP('mar-fondaparinux'), TP('mar-tabla-5-2')] },
    ],
    'xa-directo': [
        { t: 'Apixabán: inhibe el Xa <span class="hl">directamente, sin la antitrombina</span> (la X de la Fig. 5.2).', mirar: 'xa', resalta: CELDA(3), cita: [TP('mar-img-5-2'), TP('mar-acod-puntos')] },
        { t: 'Los anticoagulantes orales directos actúan en 1-4 h y no necesitan controles.', mirar: 'xa', cita: TP('mar-acod-puntos') },
        { t: 'Hoy solo se recomiendan en profilaxis para prótesis de cadera y rodilla; ahí el apixabán podría ser el preferido (dabigatrán y rivaroxabán sangran más en algunos estudios).', mirar: 'telar', cita: TP('mar-acod-puntos') },
        { t: '2,5 mg cada 12 h; no usar si el ClCr es <15 (Tabla 5.3).', resalta: '#tel-dosis', cita: TP('mar-tabla-5-3') },
    ],
    dabigatran: [
        { t: 'Dabigatrán: inhibidor directo de <span class="hl">la trombina</span> (IIa). La tejedora se para.', mirar: 'iia', resalta: CELDA(3), cita: [TP('mar-img-5-2'), TP('mar-acod-puntos')] },
        { t: '110 mg al inicio y luego 220 mg al día. No usar si el ClCr es <30, ni con IMC ≥40 o peso >120 kg.', resalta: '#tel-dosis', cita: TP('mar-tabla-5-3') },
        { t: 'En cadera y rodilla supera a la HBPM, pero en algunos estudios sangra más.', mirar: 'telar', cita: TP('mar-acod-puntos') },
    ],
    tih: [
        { t: 'La HNF también se une al <span class="hl">factor plaquetario 4</span> y forma un complejo antigénico.', mirar: 'fp4', cita: TP('mar-hnf') },
        { t: 'El complejo atrae anticuerpos IgG que activan las plaquetas: <span class="hl-rojo">trombosis y trombocitopenia</span> por consumo (TIH).', mirar: 'fp4', resalta: CELDA(1), cita: TP('mar-hnf') },
        { t: 'No depende de la dosis: puede darse con dosis profilácticas. Con HNF, en el 2,6 %.', resalta: [CELDA(2), CELDA(3)], cita: [TP('mar-hnf'), TP('mar-hbpm')] },
        { t: 'Con HBPM, en el 0,2 %: se une menos. Menos, no cero.', e: { farmaco: 'enoxaparina' }, resalta: CELDA(2), cita: TP('mar-hbpm') },
    ],
    'tih-fondaparinux': [
        { t: 'Con TIH sospechada o previa, el fondaparinux sirve para la profilaxis; se ha usado incluso en la confirmada.', resalta: CELDA(1), cita: [TP('mar-fondaparinux'), TP('mar-esc-especiales')] },
        { t: 'Pero el tratamiento aprobado de la TIH es el <span class="hl">argatrobán</span>.', resalta: CELDA(2), cita: TP('mar-fondaparinux') },
        { t: 'Cómo se relaciona el fondaparinux con el FP4, la ficha no lo dice: no se dibuja.', mirar: 'fp4', resalta: CELDA(3), cita: TP('mar-fondaparinux'), org: 'la fuente no lo dice' },
    ],
    'renal-25': [
        { t: 'Enoxaparina con ClCr 25: la Tabla 5.2 la ajusta en la insuficiencia renal.', mirar: 'rinon', cita: TP('mar-tabla-5-2'), org: 'el vaso que se llena: ilustrativo' },
        { t: 'Con ClCr <30, <span class="hl">30 mg al día</span>, o usar HNF.', resalta: '#tel-dosis', cita: [TP('mar-tabla-5-2'), TP('mar-hbpm')] },
        { t: 'Y con ClCr <20, la HNF parece la mejor opción. La HNF y la dalteparina van sin ajuste en la tabla.', mirar: 'rinon', cita: [TP('mar-hbpm'), TP('mar-tabla-5-2')] },
    ],
    'fonda-32': [
        { t: 'Fondaparinux con ClCr 32: lo elimina el riñón.', mirar: 'rinon', cita: TP('mar-fondaparinux') },
        { t: 'La Tabla 5.2: 1,5 mg al día con ClCr 35-50 y no usar con <30. Entre 30 y 35, la tabla calla.', resalta: '#tel-dosis', cita: [TP('mar-tabla-5-2'), TP('mar-fondaparinux-errata')] },
        { t: 'El texto del mismo capítulo: 1,5 mg con ClCr 20-50 y no usar con <20. <span class="hl-purpura">Las fuentes discrepan</span>: se dan las dos.', resalta: '#tel-dosis', cita: TP('mar-fondaparinux-errata'), org: 'las fuentes discrepan' },
    ],
    'renal-12': [
        { t: 'Dalteparina con ClCr 12.', mirar: 'rinon', cita: TP('mar-tabla-5-2') },
        { t: 'La Tabla 5.2 (p. 4) y el texto de la dalteparina (p. 7) dicen «sin ajuste renal».', resalta: '#tel-dosis', cita: [TP('mar-tabla-5-2'), TP('mar-hbpm')] },
        { t: 'Las recomendaciones generales (p. 11): con ClCr <15, solo HNF o warfarina. El capítulo no las concilia: <span class="hl-purpura">las fuentes discrepan</span>.', resalta: '#tel-dosis', cita: [TP('mar-nota-dalteparina-farmacos'), TP('mar-esc-especiales')], org: 'las fuentes discrepan' },
    ],
    'obesidad-42': [
        { t: 'Enoxaparina con IMC 42: en la obesidad mórbida, <span class="hl">40 mg cada 12 h</span>.', resalta: '#tel-dosis', cita: [TP('mar-tabla-5-2'), TP('mar-hbpm')] },
        { t: 'Si la dosis fija es dudosa (obesidad), el anti-Xa es útil: objetivo profiláctico, pico de 0,2-0,5 UI/mL.', e: { antiXa: true }, resalta: '#tel-dosis', cita: TP('mar-hbpm') },
        { t: 'La HNF también se ajusta: con IMC ≥40, 7.500 U cada 8 h previene mejor.', e: { farmaco: 'hnf' }, resalta: '#tel-dosis', cita: [TP('mar-hnf'), TP('mar-tabla-5-2')] },
    ],
    medias: [
        { t: 'La compresión externa de las piernas favorece el retorno venoso.', mirar: 'mangas', cita: TP('mar-mecanica-intro', 10) },
        { t: 'Medias de compresión gradual: <span class="hl">18 mmHg en el tobillo y 8 en el muslo</span>, un gradiente de 10.', mirar: 'mangas', cita: TP('mar-mecanica') },
        { t: 'Son el método menos eficaz: <span class="hl-rojo">nunca como único método</span> en el hospitalizado.', mirar: 'mangas', cita: TP('mar-mecanica') },
    ],
    cni: [
        { t: 'Compresión neumática intermitente: 2-3 cámaras que se inflan de distal a proximal, 35-40 mmHg en el tobillo y 20 en el muslo, cada 10 s.', mirar: 'mangas', cita: TP('mar-mecanica'), org: 'el reparto del ciclo: ilustrativo' },
        { t: 'Doble efecto: aumenta el flujo y <span class="hl-verde">la fibrinólisis</span> (los puntos verdes).', mirar: 'telar', resalta: CELDA(2), cita: TP('mar-mecanica') },
        { t: 'Puede ser tan eficaz como la anticoagulación y suma eficacia a ella: es el método mecánico estándar.', mirar: 'mangas', cita: TP('mar-mecanica') },
        { t: 'Sustituye a la anticoagulación si el paciente sangra o tiene alto riesgo de sangrar, o se suma a ella en el alto riesgo.', mirar: 'mangas', cita: TP('mar-mecanica-intro', 10) },
    ],
    'cni-diastolica': [
        { t: 'La CNI aprieta a 35-40 mmHg en el tobillo, y este paciente tiene una diastólica de 34.', mirar: 'mangas', cita: TP('mar-mecanica') },
        { t: 'La presión <span class="hl-rojo">nunca debe superar la diastólica</span>: comprimiría las arterias.', mirar: 'mangas', cita: TP('mar-cni-pegas'), org: 'el pie pálido: fisiología general' },
        { t: 'Además limita la movilidad, macera la piel y molesta al paciente despierto: retirarla en cuanto no haga falta.', mirar: 'mangas', cita: TP('mar-cni-pegas') },
    ],
    filtro: [
        { t: 'Filtro de vena cava inferior: atrapa los trombos que suben y reduce la embolia pulmonar.', mirar: 'filtro', cita: TP('mar-filtro-vci') },
        { t: 'Pero <span class="hl-rojo">no previene la TVP</span>: la red de abajo sigue creciendo.', mirar: 'telar', resalta: CELDA(2), cita: TP('mar-filtro-vci') },
        { t: 'Se usa a veces en la TVP que no se puede anticoagular; no se recomienda como profilaxis.', mirar: 'filtro', cita: TP('mar-filtro-vci') },
    ],
    neuroeje: [
        { t: 'Punciones y catéteres neuroaxiales: riesgo de <span class="hl-rojo">hematoma espinal y parálisis</span>. Cuenta las horas desde la última dosis.', mirar: 'reloj', resalta: CELDA(1), cita: TP('mar-neuroeje') },
        { t: 'A las 24 h ya se puede con HNF SC (≥12 h), enoxaparina una vez al día (≥24 h) y apixabán (≥24 h).', resalta: CELDA(2), cita: TP('mar-neuroeje') },
        { t: 'Dabigatrán y rivaroxabán, ≥48 h. Con función renal normal o algo reducida; más tiempo si la insuficiencia renal es más grave.', resalta: CELDA(3), cita: TP('mar-neuroeje') },
    ],
};
// Cada estado con nombre: su nombre y sus fuentes como lista (REGLAS §7.11), sin repetir, en el orden de la
// explicación. Otro libro puede añadir las suyas (ESTADOS[k].fuentes.push) sin rehacer el modelo; nunca se funden.
for (const [k, s] of Object.entries(ESTADOS)) {
    s.n = s.nombre;
    const vistos = new Set();
    s.fuentes = (GUIAS[k] || []).flatMap(p => [].concat(p.cita || []))
        .filter(c => { const id = `${c.ficha}#${c.id}`; if (vistos.has(id)) return false; vistos.add(id); return true; });
}

export function chipTxt(f) {
    if (!f) return '';
    const tipos = new Set();
    if (/ilustrativ/.test(f)) tipos.add('ilustrativo');
    if (/fisiología general/.test(f)) tipos.add('fisiología general');
    if (/mar-|Fig\.|Tabla|ficha|\bp\. \d/.test(f) || !tipos.size) tipos.add('ficha');
    let pags = []; const m = /\bp\. ([\d\-–, y]*\d)/.exec(f);
    if (m) pags = [m[1]]; else for (const [id, p] of Object.entries(PAGINAS)) if (new RegExp(id + '(?![\\w-])').test(f)) pags.push(p);
    pags = [...new Set(pags)];
    return ['ficha', 'fisiología general', 'ilustrativo'].filter(t => tipos.has(t)).join(' · ') + (tipos.has('ficha') && pags.length ? ' · p. ' + pags.join(', ') : '');
}

/* ============================================================
   Contenido de estudio. Toda la medicina sale de las fichas X y XI (fuente = id de la ficha, con su página del PDF);
   el paciente de los casos se inventa.
   ============================================================ */
export const CONCEPTOS = [
    { titulo: 'Donde nace el trombo', estado: {}, mirar: 'valvula',
        texto: 'Los trombos se forman sobre todo en las <span class="hl">venas femorales e ilíacas</span> y son <span class="hl-rojo">silentes hasta que embolizan</span>. La ETV se cita como la primera causa de muerte evitable en el hospital.',
        hacer: 'enciende la inflamación y espera a que la red se suelte; luego, con el filtro.',
        acciones: [{ t: 'Inflamación', e: { inflamacion: true }, mirar: 'telar' }, { t: 'Con filtro de cava', e: { inflamacion: true, filtro: true }, mirar: 'filtro' }],
        mira: 'la red crece en el bolsillo de la válvula; cuando un trozo se suelta, sube por la femoral hacia la cava y el pulmón. El filtro lo para, pero la red de abajo sigue.',
        fuente: 'mar-tev-intro · mar-filtro-vci (p. 1, 11)' },
    { titulo: 'El telar (Fig. 5.2)', estado: { inflamacion: true }, mirar: 'xa',
        texto: 'El <span class="hl">Xa</span> convierte la protrombina (II) en <span class="hl">trombina (IIa)</span>, y la trombina convierte el fibrinógeno en <span class="hl">fibrina</span>: la red. La <span class="hl-azul">antitrombina (AT)</span> es la guardiana; la heparina la despierta.',
        hacer: 'enciende el telar y después despierta la AT.',
        acciones: [{ t: 'Sin fármaco', e: {}, mirar: 'iia' }, { t: 'Con HNF', e: { farmaco: 'hnf' }, mirar: 'xa' }],
        mira: 'la rueda del Xa gira y manda protrombina al bolsillo; la tejedora (IIa) va y viene, y cada pasada es un hilo. Con la heparina, la AT se ilumina y para el Xa.',
        fuente: 'mar-hnf · mar-img-5-2 (p. 4-6)' },
    { titulo: 'La cadena larga: HNF', estado: { inflamacion: true, farmaco: 'hnf' }, mirar: 'iia',
        texto: 'Mezcla de cadenas de <span class="hl">3.000 a 30.000 Da</span>. Ata la AT (anti-Xa) y la trombina (anti-IIa, <span class="hl">10 veces</span> el anti-Xa). El anti-IIa depende del largo: <span class="hl-rojo">efecto variable</span>. Bastan dosis bajas: 5.000 U SC cada 8-12 h.',
        hacer: 'pon la HNF y mira la cadena que baja al bolsillo.',
        acciones: [{ t: 'HNF', e: { farmaco: 'hnf' } }, { t: 'IMC 42: 7.500 U cada 8 h', e: { farmaco: 'hnf', imc: 42 }, mirar: 'rinon' }],
        mira: 'una cadena larga ata a la vez la AT y la trombina: X en el Xa y X en la IIa. Las demás cadenas, cada una de un largo.',
        fuente: 'mar-hnf · mar-tabla-5-2 (p. 4-5)' },
    { titulo: 'La cadena corta: HBPM', estado: { inflamacion: true, farmaco: 'hnf' }, mirar: 'iia',
        texto: 'Cortada en trozos de <span class="hl">4.500 Da</span>, uniformes. Despierta la AT contra el Xa, pero <span class="hl">apenas alcanza la trombina</span>: respuesta predecible, sin monitorizar de rutina. Biodisponibilidad del 90 % frente al 15-30 %; dura más.',
        hacer: 'cambia la HNF por enoxaparina; mide el anti-Xa.',
        acciones: [{ t: 'Enoxaparina', e: { farmaco: 'enoxaparina' } }, { t: 'Anti-Xa (obesidad)', e: { farmaco: 'enoxaparina', imc: 42, antiXa: true }, mirar: 'rinon' }],
        mira: 'la cadena se queda corta antes de la trombina: «no llega». Anti-Xa: objetivo profiláctico, pico de 0,2-0,5 UI/mL, útil si la dosis fija es dudosa.',
        fuente: 'mar-hbpm (p. 6-7)' },
    { titulo: 'Cinco cuentas: fondaparinux', estado: { inflamacion: true, farmaco: 'fondaparinux' }, mirar: 'xa',
        texto: 'El <span class="hl">pentasacárido</span> que une la heparina a la AT: la «heparina diminuta». Solo frena el Xa. 2,5 mg SC al día; vida media de 17 h; lo elimina el riñón.',
        hacer: 'pon el fondaparinux.',
        acciones: [{ t: 'Fondaparinux', e: { farmaco: 'fondaparinux' } }, { t: 'Con ClCr 32', e: { farmaco: 'fondaparinux', clcr: 32 }, mirar: 'rinon' }],
        mira: 'cinco cuentas en cada AT; ninguna llega a la trombina. Con ClCr 32, la tabla no dice nada y el texto da 1,5 mg al día.',
        fuente: 'mar-fondaparinux · mar-fondaparinux-errata (p. 4, 8)' },
    { titulo: 'La TIH: FP4 e IgG', estado: { vista: 'tih', tih: true, farmaco: 'hnf' }, mirar: 'fp4',
        texto: 'La heparina se une al <span class="hl">factor plaquetario 4</span>: complejo antigénico → <span class="hl-rojo">IgG</span> → activación plaquetaria, <span class="hl-rojo">trombosis y trombocitopenia</span>. No depende de la dosis. 2,6 % con HNF, 0,2 % con HBPM. Del fondaparinux, el libro solo dice que puede usarse con TIH sospechada o previa.',
        hacer: 'cambia la heparina sobre la plaqueta.',
        acciones: [{ t: 'HNF', e: { farmaco: 'hnf' } }, { t: 'HBPM', e: { farmaco: 'enoxaparina' } }, { t: 'Fondaparinux', e: { farmaco: 'fondaparinux' } }],
        mira: 'con HNF, los lazos (una imagen de «se une») rodean los cuatro FP4, llegan las Y y la plaqueta saca espinas. Con HBPM, uno solo. Con fondaparinux, la lupa no dibuja ningún complejo: el libro no explica cómo se relaciona con el FP4.',
        fuente: 'mar-hnf · mar-hbpm · mar-fondaparinux (p. 5, 7-8)' },
    { titulo: 'Llaves sin AT: los ACOD', estado: { inflamacion: true, farmaco: 'apixaban' }, mirar: 'xa',
        texto: '<span class="hl">Apixabán y rivaroxabán</span> bloquean el Xa directamente; el <span class="hl">dabigatrán</span>, la trombina. Actúan en 1-4 h sin controles. La <span class="hl-rojo">warfarina</span> tarda 5-7 días. Hoy, los ACOD solo se recomiendan en prótesis de cadera y rodilla.',
        hacer: 'prueba las llaves.',
        acciones: [{ t: 'Apixabán', e: { farmaco: 'apixaban' }, mirar: 'xa' }, { t: 'Dabigatrán', e: { farmaco: 'dabigatran' }, mirar: 'iia' }, { t: 'Warfarina', e: { farmaco: 'warfarina' }, mirar: null }],
        mira: 'la llave entra sin despertar a ninguna AT. La warfarina solo deja su aviso: su mecanismo no está en la ficha.',
        fuente: 'mar-acod-puntos · mar-tabla-5-3 · mar-img-5-2 (p. 6, 8-9)' },
    { titulo: 'El riñón que acumula', estado: { farmaco: 'enoxaparina', clcr: 90 }, mirar: 'rinon',
        texto: 'La enoxaparina y el fondaparinux los elimina el riñón, y los ACOD no se usan en la insuficiencia renal grave. <span class="hl">Enoxaparina con ClCr &lt;30: 30 mg al día, o HNF</span>. Fondaparinux: la tabla y el texto discrepan. Con ClCr &lt;15, la p. 11 solo acepta HNF o warfarina.',
        hacer: 'baja el aclaramiento con cada fármaco.',
        acciones: [{ t: 'Enoxaparina, ClCr 25', e: { farmaco: 'enoxaparina', clcr: 25 } }, { t: 'Fondaparinux, ClCr 32', e: { farmaco: 'fondaparinux', clcr: 32 } }, { t: 'Dalteparina, ClCr 12', e: { farmaco: 'dalteparina', clcr: 12 } }, { t: 'Dabigatrán, ClCr 25', e: { farmaco: 'dabigatran', clcr: 25 } }],
        mira: 'el vaso se llena según el veredicto renal (altura ilustrativa) y la caja de la calculadora da la dosis, con sus notas.',
        fuente: 'mar-tabla-5-2 · mar-tabla-5-3 · mar-fondaparinux-errata · mar-nota-dalteparina-farmacos (p. 4, 7-9, 11)' },
    { titulo: 'Medias y CNI', estado: { inflamacion: true }, mirar: 'mangas',
        texto: 'Medias: <span class="hl">18 mmHg en el tobillo y 8 en el muslo</span>; nunca solas. CNI: <span class="hl">35-40 y 20 mmHg</span>, de distal a proximal, cada 10 s: <span class="hl-verde">flujo y fibrinólisis</span>. Nunca por encima de la diastólica.',
        hacer: 'ponle medias, luego la CNI, y baja la diastólica.',
        acciones: [{ t: 'Medias', e: { mecanica: 'medias' } }, { t: 'CNI', e: { mecanica: 'cni' } }, { t: 'CNI con PAD 34', e: { mecanica: 'cni', diastolica: 34 } }],
        mira: 'las cámaras se inflan de abajo arriba en un ciclo real de 10 s; los puntos verdes deshacen la red. Con PAD 34, la arteria se aprieta y el pie palidece.',
        fuente: 'mar-mecanica · mar-cni-pegas (p. 10)' },
    { titulo: 'El reloj neuroaxial', estado: { vista: 'reloj', horas: 6 }, mirar: 'reloj',
        texto: 'Antes de una punción o un catéter neuroaxial: <span class="hl">HNF ≥12 h</span>; enoxaparina una vez al día <span class="hl">≥24 h</span>; dabigatrán y rivaroxabán <span class="hl">≥48 h</span>; apixabán ≥24 h. Con más insuficiencia renal, más tiempo.',
        hacer: 'mueve la aguja del reloj.',
        acciones: [{ t: '12 h', e: { horas: 12 } }, { t: '24 h', e: { horas: 24 } }, { t: '48 h', e: { horas: 48 } }],
        mira: 'cada anillo se pone verde cuando la aguja pasa su umbral. La enoxaparina cada 12 h no tiene anillo: la ficha no da su cifra.',
        fuente: 'mar-neuroeje (p. 9-10)' },
    { titulo: 'La adivinanza', estado: {}, mirar: 'flujo',
        texto: 'Si la inmovilidad causara TVP, ¿por qué no es epidémica en los ancianos encamados? <span class="hl">Inmovilidad no es estasis</span>: con gasto normal, el retorno venoso también lo es. Lo que la dispara es probablemente <span class="hl-rojo">la inflamación</span>. Opinión del autor.',
        hacer: 'déjale inmóvil; luego, la inflamación; luego, el gasto bajo.',
        acciones: [{ t: 'Inmóvil 3 semanas', e: { inmovil: true }, mirar: 'flujo' }, { t: 'Inflamación', e: { inmovil: true, inflamacion: true }, mirar: 'telar' }, { t: 'Gasto bajo', e: { gastoBajo: true }, mirar: 'flujo' }],
        mira: 'inmóvil, los hematíes suben igual y el telar no teje. Con inflamación, la red crece con el flujo intacto. Solo el gasto bajo enlentece (fisiología general).',
        fuente: 'mar-inmovilidad · mar-tabla-5-1 (p. 2, 13)' },
];

// Las opciones se barajan con barajar() de core/mayeutica-motor.js (orden fijo por pregunta); la prueba comprueba que la
// buena no es la más larga ni la más corta en más de ⅓ de los tests y que cambia de sitio.
export const PREGUNTAS = [
    { id: 'tl-g1', grupo: 'guia', corto: 'la HNF', tipo: 'test', fuente: 'mar-hnf · mar-img-5-2 (p. 4-6)',
        estado: { inflamacion: true }, mirar: 'iia',
        tocar: { mandos: ['farmaco'], mirar: 'iia', ocultar: ['corta', 'red'], instruccion: 'pon la HNF y mira a quién ata.', comprobar: e => e.farmaco === 'hnf', pista: 'Pulsa «HNF».', bueno: { farmaco: 'hnf' }, confirma: 'la HNF despierta la AT contra el Xa y además ata la trombina: X en los dos. El anti-IIa, 10 veces el anti-Xa.' },
        enunciado: 'Predice. La HNF se une a la antitrombina. ¿Qué hilos del telar corta?',
        opciones: [
            { t: 'Solo el Xa, porque actúa a través de la antitrombina', ok: false, porque: 'También ata la trombina: su cadena larga une a la vez la AT y la IIa (anti-IIa, 10 veces el anti-Xa). Sin saberlo, no entenderías por qué la misma dosis anticoagula tan distinto a cada paciente.' },
            { t: 'Solo la trombina, igual que hace el dabigatrán', ok: false, porque: 'Eso es el dabigatrán, una llave sin AT. Si los confundes, elegirás mal el fármaco: el dabigatrán no se usa con ClCr <30 y la HNF no tiene ajuste renal.' },
            { t: 'El Xa por la antitrombina y, además, la trombina', ok: true }],
        explicacion: 'Dos acciones (Fig. 5.2): despierta la <span class="hl">antitrombina</span>, que frena el Xa, y se une a la <span class="hl">trombina</span>. El anti-IIa depende del <span class="hl-azul">largo de la cadena</span> y es 10 veces el anti-Xa. La activación de la AT es tan sensible que <span class="hl">bastan dosis bajas</span> (5.000 U SC cada 8-12 h).' },
    { id: 'tl-g2', grupo: 'guia', corto: 'la HBPM', tipo: 'test', fuente: 'mar-hbpm · mar-img-5-2 (p. 6-7)',
        estado: { inflamacion: true, farmaco: 'hnf' }, mirar: 'iia',
        tocar: { mandos: ['farmaco'], mirar: 'iia', ocultar: ['corta'], instruccion: 'cambia a enoxaparina (HBPM) y mira la cadena que iba a la trombina.', comprobar: e => e.farmaco === 'enoxaparina', pista: 'Pulsa «Enoxaparina».', bueno: { farmaco: 'enoxaparina' }, confirma: 'la cadena corta despierta la AT contra el Xa, pero se queda lejos de la trombina: «no llega».' },
        enunciado: 'Predice. La HBPM es la misma heparina, cortada en trozos de 4.500 Da de media. ¿Qué pierde?',
        opciones: [
            { t: 'Casi toda su acción sobre la trombina (el anti-IIa)', ok: true },
            { t: 'Su acción sobre el Xa: sin largo no despierta la AT', ok: false, porque: 'Las cadenas cortas siguen despertando la AT contra el Xa: es su efecto principal. Si creyeras que no lo frena, dejarías sin profilaxis eficaz a un paciente que la tiene.' },
            { t: 'Nada: es la misma molécula, solo que dura más', ok: false, porque: 'Al perder largo, apenas ata la trombina; por eso su respuesta es predecible y no se monitoriza de rutina. Si la trataras como la HNF, le pedirías controles que no necesita.' }],
        explicacion: 'Menos unión a la trombina: menos anti-IIa y <span class="hl">respuesta predecible</span>. Y se une menos a proteínas, endotelio, macrófagos y plaquetas: <span class="hl">biodisponibilidad del 90 %</span> (HNF, 15-30 %), dura más (menos dosis) y menos TIH.' },
    { id: 'tl-g3', grupo: 'guia', corto: 'efecto variable', tipo: 'destapa', fuente: 'mar-hnf (p. 4-5)',
        estado: { inflamacion: true, farmaco: 'hnf' }, mirar: 'telar',
        enunciado: 'Con la misma dosis de HNF, cada paciente se anticoagula distinto. ¿Por qué?',
        puntos: ['La HNF es una <span class="hl">mezcla de cadenas de 3.000 a 30.000 Da</span>: cada una mide distinto.',
            'El anti-IIa <span class="hl">depende del largo</span>: unas cadenas atan la trombina y otras no.',
            'Se une a <span class="hl">proteínas del plasma</span> (menos biodisponible), al endotelio y a los macrófagos (se aclara antes).'],
        explicacion: 'Por eso la HBPM, corta y uniforme, es predecible. En la lupa: cadenas de largos distintos (cuántas cuentas lleva cada una es ilustrativo).' },
    { id: 'tl-g4', grupo: 'guia', corto: 'la TIH', tipo: 'destapa', fuente: 'mar-hnf · mar-hbpm (p. 5, 7)',
        estado: { vista: 'tih', tih: true, farmaco: 'hnf' }, mirar: 'fp4', ocultar: ['tih'],
        enunciado: 'Día 6 con HNF profiláctica: las plaquetas caen. En la lupa, una plaqueta. ¿Qué ha pasado, y qué tiene de traicionero?',
        puntos: ['La heparina se une al <span class="hl">factor plaquetario 4</span> y forma un complejo antigénico.',
            'Aparecen <span class="hl-rojo">anticuerpos IgG</span> que activan las plaquetas: <span class="hl-rojo">trombosis y trombocitopenia</span> por consumo.',
            '<span class="hl-rojo">No depende de la dosis</span>: pasa también con las dosis profilácticas.'],
        explicacion: 'TIH: <span class="hl">2,6 % con HNF y 0,2 % con HBPM</span> (diez veces menos), porque la HBPM se une menos a las plaquetas. Los lazos del dibujo son una imagen; el libro dice «se une».' },
    { id: 'tl-g5', grupo: 'guia', corto: 'TIH previa', tipo: 'test', fuente: 'mar-fondaparinux · mar-esc-especiales (p. 8, 11)',
        estado: { vista: 'tih', tih: true, farmaco: 'hnf' }, despues: { vista: 'tih', tih: true, farmaco: 'fondaparinux' }, mirar: 'fp4', ocultar: ['tih'],
        enunciado: 'Un paciente con una TIH previa necesita profilaxis. ¿Qué le pones?',
        opciones: [
            { t: 'Enoxaparina: la HBPM casi no da TIH (0,2 %)', ok: false, porque: '0,2 % es poco, pero no cero: la HBPM sigue siendo heparina. Con una TIH previa, arriesgas otra trombosis y otra caída de plaquetas.' },
            { t: 'Fondaparinux, que el libro acepta en ese caso', ok: true },
            { t: 'HNF a dosis bajas, que con poca ya basta', ok: false, porque: 'La TIH no depende de la dosis: con 5.000 U se puede repetir. El paciente volvería a hacer trombosis y trombocitopenia.' }],
        explicacion: 'El capítulo: el fondaparinux <span class="hl">puede usarse para la profilaxis con TIH sospechada o previa</span>, y se ha usado en la confirmada; pero el tratamiento aprobado de la TIH es el <span class="hl">argatrobán</span>. El libro no explica por qué el fondaparinux sirve aquí: la lupa no lo dibuja.' },
    { id: 'tl-g6', grupo: 'guia', corto: 'el riñón', tipo: 'test', fuente: 'mar-tabla-5-2 · mar-hbpm (p. 4, 7)',
        estado: { farmaco: 'enoxaparina', clcr: 90 }, mirar: 'rinon',
        tocar: { mandos: ['clcr'], mirar: 'rinon', ocultar: ['dosis'], instruccion: 'baja el ClCr a 25 y mira el vaso y la dosis.', comprobar: e => e.clcr === 25, pista: 'Pulsa «25».', bueno: { clcr: 25 }, confirma: 'con ClCr 25 el vaso se llena: 30 mg al día, o HNF.' },
        enunciado: 'Predice. La enoxaparina se elimina por el riñón. Con un ClCr de 25 mL/min, ¿qué hace la Tabla 5.2?',
        opciones: [
            { t: 'Nada: las HBPM no necesitan ajuste renal', ok: false, porque: 'Eso vale para la dalteparina, no para la enoxaparina: con ClCr <30 se acumula. A dosis plena, el paciente podría sangrar.' },
            { t: 'No usar ninguna heparina por debajo de 30 mL/min', ok: false, porque: 'La HNF no tiene ajuste renal y es la alternativa (la mejor con ClCr <20). Dejarías al paciente sin profilaxis.' },
            { t: '30 mg al día, o pasar a heparina no fraccionada', ok: true }],
        explicacion: '<span class="hl">ClCr &lt;30: 30 mg al día, o HNF</span>; la HNF parece la mejor opción con ClCr &lt;20. La dalteparina no necesita ajuste (con la nota de la p. 11 si el ClCr es &lt;15).' },
    { id: 'tl-g7', grupo: 'guia', corto: 'la adivinanza', tipo: 'test', fuente: 'mar-inmovilidad · mar-tabla-5-1 (p. 2, 13)',
        estado: {}, mirar: 'flujo',
        tocar: { mandos: ['inmovil'], mirar: 'flujo', ocultar: ['flujo', 'red'], instruccion: 'déjale 3 semanas inmóvil y mira los hematíes de la femoral.', comprobar: e => e.inmovil, pista: 'Pulsa «Inmóvil, 3 semanas».', bueno: { inmovil: true }, confirma: 'los hematíes suben al mismo ritmo: con gasto normal, el retorno venoso es igual. El telar no teje.' },
        enunciado: 'Predice. Si la inmovilidad causara TVP, los ancianos encamados con contracturas la tendrían en epidemia. Tres semanas inmóvil en la cama, con el gasto normal: ¿qué le pasa a la sangre de la femoral?',
        opciones: [
            { t: 'Sigue subiendo al mismo ritmo que en un sano', ok: true },
            { t: 'Se estanca en el bolsillo: la estasis de Virchow', ok: false, porque: 'Es la intuición que el autor discute: en un sistema cerrado, con gasto normal, el retorno venoso también lo es. Si lo crees, anticoagularías de más a pacientes que solo están en la cama.' },
            { t: 'Va más lenta, pero solo si está sedado', ok: false, porque: 'La sedación no cambia el razonamiento: lo que decide es el gasto. Con el gasto normal no hay estasis, y anticoagularías sin necesidad.' }],
        explicacion: '<span class="hl">Inmovilidad no es estasis</span>: el aparato circulatorio es cerrado y, si el gasto es normal, los flujos arterial y venoso son iguales. Según el autor, creer lo contrario <span class="hl-rojo">lleva a usar anticoagulantes de más</span>.',
        nota: '<b>Nota de fuentes.</b> La Tabla 5.1 (p. 2) incluye la inmovilidad prolongada y la movilidad limitada entre los factores de riesgo; la reflexión final del autor (p. 13) la discute, con un «probablemente». Se muestran las dos: es su opinión, no una recomendación de guía.' },
    { id: 'tl-g8', grupo: 'guia', corto: 'la inflamación', tipo: 'test', fuente: 'mar-inmovilidad (p. 13)',
        estado: { inmovil: true }, mirar: 'telar',
        tocar: { mandos: ['inflamacion'], mirar: 'telar', ocultar: ['red'], instruccion: 'enciende la inflamación y mira el bolsillo de la válvula.', comprobar: e => e.inflamacion, pista: 'Pulsa «Inflamación».', bueno: { inflamacion: true }, confirma: 'con el flujo intacto, la tejedora se pone a trabajar y la red crece.' },
        enunciado: 'Predice. Entonces, según el autor, ¿qué dispara la TVP en muchos pacientes de alto riesgo?',
        opciones: [
            { t: 'La sedación, que para la bomba de la pantorrilla', ok: false, porque: 'El capítulo no la cita como desencadenante. Pensando en la sedación, anticoagularías por la cama y descuidarías lo que de verdad enciende el telar, como la sepsis.' },
            { t: 'La inflamación, que va muy unida a la coagulación', ok: true },
            { t: 'Los catéteres: la cama solo pesa con una vía femoral', ok: false, porque: 'Los catéteres son un factor de la UCI (Tabla 5.1), pero no la explicación del autor. Con esa idea, descuidarías al séptico sin vía, que sigue en riesgo.' }],
        explicacion: 'Inflamación y coagulación están muy unidas (además de la lesión vascular en el trauma y la ortopedia). Por eso, en la lesión medular el riesgo es alto <span class="hl">solo 3-4 semanas</span>.' },
    { id: 'tl-g9', grupo: 'guia', corto: 'la CNI', tipo: 'destapa', fuente: 'mar-mecanica · mar-cni-pegas (p. 10)',
        estado: { inflamacion: true, mecanica: 'cni' }, mirar: 'mangas',
        enunciado: '¿Qué hace la compresión neumática intermitente, y cuándo no la pones así?',
        puntos: ['Cámaras que se inflan <span class="hl">de distal a proximal</span>: 35-40 mmHg en el tobillo y 20 en el muslo, cada 10 s.',
            'Doble efecto: <span class="hl-verde">más flujo y más fibrinólisis</span> (los puntos que deshacen la red).',
            '<span class="hl-rojo">Nunca por encima de la presión diastólica</span>: comprimiría las arterias.'],
        explicacion: 'Puede ser tan eficaz como la anticoagulación y suma a ella: es el método mecánico estándar. Limita la movilidad, macera la piel y molesta al despierto: retirarla en cuanto no haga falta.' },
    { id: 'tl-e1', grupo: 'examen', corto: 'TIH y dosis', tipo: 'test', fuente: 'mar-hnf · mar-hbpm (p. 5, 7)',
        estado: { vista: 'tih', tih: true, farmaco: 'hnf' }, mirar: 'fp4', ocultar: ['tih'],
        enunciado: 'Varón de 70 años con HNF 5.000 U SC cada 12 h. Día 7: plaquetas de 220.000 a 90.000/µL. El R1 dice: «con dosis profilácticas no puede ser una TIH». ¿Qué le contestas?',
        opciones: [
            { t: 'Que tiene razón: la TIH pide dosis terapéuticas', ok: false, porque: 'La TIH no depende de la dosis. Si sigues con la heparina, el paciente puede hacer trombosis y seguir consumiendo plaquetas.' },
            { t: 'Solo si llevara HBPM, que se une más a las plaquetas', ok: false, porque: 'Es al revés: la HBPM se une menos (0,2 % frente a 2,6 %). Con ese error, pasarías a HNF y el paciente seguiría expuesto.' },
            { t: 'Que sí puede serlo: la TIH no depende de la dosis', ok: true }],
        explicacion: 'Complejo heparina-FP4 → IgG → activación plaquetaria: <span class="hl-rojo">trombosis y trombocitopenia</span>, también con dosis profilácticas. 2,6 % con HNF; 0,2 % con HBPM.' },
    { id: 'tl-e2', grupo: 'examen', corto: 'UCI médica', tipo: 'test', fuente: 'mar-esc-medica · mar-mecanica (p. 10, 13)',
        estado: { riesgo: 'medica', inflamacion: true }, despues: { riesgo: 'medica', inflamacion: true, farmaco: 'enoxaparina' }, mirar: 'telar',
        enunciado: 'Mujer de 58 años con neumonía y shock séptico en la UCI, sin sangrado. Función renal e IMC normales. ¿Qué profilaxis?',
        opciones: [
            { t: 'HBPM sola, sin añadir profilaxis mecánica', ok: true },
            { t: 'HBPM y CNI: en la UCI el riesgo es máximo y se suman', ok: false, porque: 'Para la enfermedad médica aguda, incluida la UCI, la guía del capítulo pide HBPM sin añadir mecánica. Le pondrías una CNI que limita la movilidad y macera la piel sin que la guía la pida aquí.' },
            { t: 'Medias, por si sangra con la sepsis', ok: false, porque: 'Las medias son el método menos eficaz y nunca se usan como único método en el hospitalizado. Sin sangrado, no hay motivo para dejarla sin anticoagulante: haría una ETV evitable.' }],
        explicacion: 'Enfermedad médica aguda de alto riesgo (<span class="hl">todo paciente de UCI</span>): <span class="hl">HBPM sola</span>, sin profilaxis mecánica, y sin prolongarla tras el alta.' },
    { id: 'tl-e3', grupo: 'examen', corto: 'neuroeje', tipo: 'error', fuente: 'mar-neuroeje (p. 9-10)',
        estado: { vista: 'reloj', horas: 24 }, mirar: 'reloj', ocultar: ['reloj'],
        enunciado: 'Le van a poner un catéter epidural. Notas del R1 sobre cuánto esperar tras la última dosis profiláctica (función renal normal).',
        frases: [
            { t: 'HNF subcutánea: al menos 12 horas.', mal: false },
            { t: 'Enoxaparina una vez al día: al menos 12 horas, como la HNF.', mal: true, c: 'Al menos <span class="hl">24 horas</span>.' },
            { t: 'Apixabán: al menos 24 horas.', mal: false },
            { t: 'Rivaroxabán: al menos 24 horas, como el apixabán.', mal: true, c: 'Rivaroxabán y dabigatrán: <span class="hl">al menos 48 horas</span>; el apixabán, 24.' },
            { t: 'Con una insuficiencia renal más grave, los ACOD necesitan más tiempo.', mal: false }],
        explicacion: 'El riesgo es un hematoma espinal que comprime la médula: parálisis. Estos tiempos son para una función renal normal o algo reducida.' },
    { id: 'tl-e4', grupo: 'examen', corto: 'filtro de cava', tipo: 'test', fuente: 'mar-filtro-vci · mar-mecanica (p. 10-11)',
        estado: { riesgo: 'trauma', inflamacion: true }, despues: { riesgo: 'trauma', inflamacion: true, filtro: true }, mirar: 'valvula', mirarDespues: 'filtro',
        enunciado: 'Politraumatizado con fractura de pelvis que todavía sangra: no se puede anticoagular. El R1 propone un filtro de vena cava «como profilaxis». ¿Qué le dices?',
        opciones: [
            { t: 'Bien: atrapa los trombos, así que previene la ETV', ok: false, porque: 'El filtro reduce la embolia pulmonar atrapando trombos, pero no previene la TVP: mira la red, que sigue creciendo. El paciente seguiría haciendo trombosis en la pierna.' },
            { t: 'Mejor CNI: el filtro de cava no es profilaxis', ok: true },
            { t: 'Mejor medias solas, que nunca hacen sangrar', ok: false, porque: 'Las medias son el método menos eficaz y nunca se usan solas en el hospitalizado. Dejarías al paciente casi sin protección.' }],
        explicacion: 'Cuando sangra o tiene alto riesgo de sangrar, la <span class="hl">CNI sustituye</span> a la anticoagulación. Los filtros de VCI <span class="hl-rojo">no previenen la TVP</span>: se usan a veces en la TVP que no se puede anticoagular, no como profilaxis.' },
    { id: 'tl-e5', grupo: 'examen', corto: 'ClCr <15', tipo: 'test', fuente: 'mar-esc-especiales · mar-nota-dalteparina-farmacos (p. 4, 7, 11)',
        estado: { farmaco: 'dalteparina', clcr: 12 }, mirar: 'rinon', ocultar: ['dosis'],
        enunciado: 'Paciente en hemodiálisis, con un ClCr de 12 mL/min. ¿Qué anticoagulantes acepta el capítulo para su profilaxis?',
        opciones: [
            { t: 'Apixabán o rivaroxabán, a dosis reducida', ok: false, porque: 'Con ClCr <15 no se usan (Tabla 5.3). Se acumularían y el paciente sangraría.' },
            { t: 'Enoxaparina 30 mg al día, el ajuste de la tabla', ok: false, porque: 'Ese ajuste es para ClCr <30; con <15 el capítulo solo acepta HNF o warfarina, y la HNF parece la mejor opción por debajo de 20. Se acumularía.' },
            { t: 'HNF o warfarina (la dalteparina, discutida)', ok: true }],
        explicacion: 'Recomendación general (p. 11): con ClCr &lt;15, <span class="hl">solo HNF o warfarina</span>. La warfarina es el único oral seguro en la insuficiencia renal grave.',
        nota: '<b>Nota de fuentes.</b> La Tabla 5.2 (p. 4) y el texto (p. 7) dicen que la dalteparina va «sin ajuste renal»; la p. 11 no la incluye entre las que se pueden usar con ClCr &lt;15. El capítulo no lo concilia: se muestran las dos.' },
];

export const CASOS = [
    { id: 'c-rosa', titulo: 'Rosa, 66 años: la enoxaparina que no era', corto: 'Rosa · UCI médica', sub: 'neumonía con sepsis, IMC 42, ClCr 25',
        paciente: { Edad: '66 años', Motivo: 'neumonía con sepsis; ingresa en la UCI', IMC: '42 kg/m²', ClCr: '25 mL/min' },
        pasos: [
            { momento: 'Ingreso', datos: {}, nuevo: [], estado: { riesgo: 'medica', inflamacion: true, farmaco: 'enoxaparina' }, mirar: 'rinon',
                calculadora: { nombre: '¿Qué dosis le toca?', ir: 'mar-profilaxis-calc' },
                pregunta: { id: 'tr-1', tipo: 'test', fuente: 'mar-tabla-5-2 · mar-hbpm · mar-profilaxis-calc (p. 4, 7)',
                    tocar: { mandos: ['clcr', 'imc'], mirar: 'rinon', ocultar: ['dosis'], instruccion: 'pon su ClCr (25) y su IMC (42) y lee la calculadora.', comprobar: e => e.clcr === 25 && e.imc === 42, pista: 'Pulsa «25» y «42».', bueno: { clcr: 25, imc: 42 }, confirma: 'por el riñón, 30 mg al día o HNF; por la obesidad, 40 mg cada 12 h; y «la tabla no da una pauta para obesidad e insuficiencia renal a la vez».' },
                    enunciado: 'Predice. Quieres enoxaparina. Por la obesidad tocarían 40 mg cada 12 h; por el riñón, 30 mg al día. ¿Qué dice la Tabla 5.2 para las dos cosas a la vez?',
                    opciones: [
                        { t: 'Gana la obesidad: 40 mg cada 12 h, sin más', ok: false, porque: 'Con ClCr 25 la enoxaparina se acumula; doblar la dosis sin un dato que lo apoye podría hacerla sangrar.' },
                        { t: 'Nada: no da una pauta para las dos a la vez', ok: true },
                        { t: 'Gana el riñón: 30 mg al día, y no hace falta más', ok: false, porque: 'La tabla no lo dice para la obesa: con 30 mg al día podría quedarse corta, porque en la obesidad la dosis fija es dudosa. Haría una ETV evitable.' }],
                    explicacion: 'La calculadora lo enseña: «la tabla no da una pauta para obesidad e insuficiencia renal a la vez». Lo que sí dice el capítulo: la <span class="hl">HNF</span> no tiene ajuste renal (7.500 U cada 8 h con IMC ≥40), y el <span class="hl">anti-Xa</span> es útil cuando la dosis fija de una HBPM es dudosa, como en la obesidad.' } },
            { momento: 'Ingreso · el plan', datos: { Profilaxis: 'HNF 7.500 U SC cada 8 h' }, nuevo: ['Profilaxis'], estado: { riesgo: 'medica', inflamacion: true, farmaco: 'hnf', imc: 42, clcr: 25, mecanica: 'medias' }, mirar: 'mangas',
                pregunta: { id: 'tr-2', tipo: 'error', fuente: 'mar-tabla-5-2 · mar-mecanica · mar-esc-medica (p. 4, 10, 13)',
                    enunciado: 'Plan del R1 de noche.',
                    frases: [
                        { t: 'Como la tabla no resuelve la obesidad con ClCr 25, uso HNF, que no tiene ajuste renal.', mal: false },
                        { t: 'HNF 7.500 U SC cada 8 h, por el IMC ≥40.', mal: false },
                        { t: 'Si empieza a sangrar, medias de compresión como único método.', mal: true, c: 'Las medias <span class="hl-rojo">nunca se usan como único método</span> en el hospitalizado: son el menos eficaz. Si sangra, la mecánica que sustituye a la anticoagulación es la <span class="hl">CNI</span>.' },
                        { t: 'Le añado CNI de rutina, porque en la UCI médica la guía del capítulo pide sumarla.', mal: true, c: 'Al revés: para la enfermedad médica aguda, incluida la UCI, la guía del capítulo pide HBPM <span class="hl">sin añadir profilaxis mecánica</span>. La CNI suma eficacia a la anticoagulación, pero aquí no se recomienda de rutina.' },
                        { t: 'No la prolongo tras el alta.', mal: false }],
                    explicacion: 'Los dos errores son la trampa clásica: las medias nunca solas y, en la UCI médica, nada de mecánica añadida de rutina.' } },
            { momento: 'Día 6', datos: { Plaquetas: '210.000 → 95.000/µL', Piernas: 'sin edemas ni dolor' }, nuevo: ['Plaquetas', 'Piernas'], estado: { vista: 'tih', tih: true, farmaco: 'hnf', imc: 42, clcr: 25 }, mirar: 'fp4',
                pregunta: { id: 'tr-3', tipo: 'destapa', fuente: 'mar-hnf · mar-hbpm (p. 5, 7)', ocultar: ['tih'],
                    enunciado: 'Las plaquetas caen a menos de la mitad. ¿Qué mecanismo sospechas, y por qué no te tranquiliza que la dosis fuera profiláctica?',
                    puntos: ['<span class="hl-rojo">TIH</span>: la heparina se une al FP4 y forma un complejo antigénico.', 'Los <span class="hl-rojo">IgG</span> activan las plaquetas: trombosis y trombocitopenia por consumo.', '<span class="hl">No depende de la dosis</span>: pasa con dosis profilácticas.'],
                    explicacion: 'Con HNF, 2,6 %; con HBPM, 0,2 %. El diagnóstico y el tratamiento de la TIH están en el cap. 13 del libro («Para profundizar»).' } },
            { momento: 'Día 6 · la profilaxis', datos: { Sospecha: 'TIH, sin trombosis por ahora' }, nuevo: ['Sospecha'], estado: { vista: 'tih', tih: true, farmaco: 'hnf', imc: 42, clcr: 25 }, mirar: 'fp4',
                pregunta: { id: 'tr-4', tipo: 'test', fuente: 'mar-fondaparinux · mar-esc-especiales (p. 8, 11)',
                    despues: { vista: 'tih', tih: true, farmaco: 'fondaparinux', imc: 42, clcr: 25 },
                    enunciado: 'Sospechas una TIH y sigue necesitando profilaxis. ¿Qué dice el capítulo?',
                    opciones: [
                        { t: 'Fondaparinux, aceptado si se sospecha TIH', ok: true },
                        { t: 'Enoxaparina: la HBPM da diez veces menos TIH', ok: false, porque: 'Da menos TIH (0,2 %), pero también la da: es heparina. Con una TIH en marcha, la seguirías exponiendo a trombosis.' },
                        { t: 'Seguir con HNF: a dosis baja la TIH no progresa', ok: false, porque: 'La TIH no depende de la dosis: con la HNF seguiría formando el complejo, con riesgo de trombosis y más caída de plaquetas.' }],
                    explicacion: 'El fondaparinux <span class="hl">puede usarse para la profilaxis con TIH sospechada o previa</span>. Si se confirma la TIH o aparece una trombosis, ya no es profilaxis: el tratamiento aprobado de la TIH es el <span class="hl-rojo">argatrobán</span> (cap. 13 del libro, fuera de esta ficha).' } },
            { momento: 'Día 6 · el giro', datos: { Plan: 'fondaparinux en profilaxis', ClCr: '25 mL/min' }, nuevo: ['Plan'], estado: { farmaco: 'fondaparinux', imc: 42, clcr: 25 }, mirar: 'rinon',
                pregunta: { id: 'tr-5', tipo: 'test', fuente: 'mar-fondaparinux · mar-fondaparinux-errata · mar-tabla-5-2 (p. 4, 8)', ocultar: ['dosis'],
                    enunciado: 'El fondaparinux lo elimina el riñón, y su ClCr es 25. ¿Qué dice el capítulo sobre su dosis?',
                    opciones: [
                        { t: '1,5 mg al día: tabla y texto coinciden entre 20 y 50', ok: false, porque: 'La tabla da 1,5 mg solo entre 35 y 50 y prohíbe por debajo de 30. Si no ves la discrepancia, le darías una dosis que una parte del libro prohíbe sin saberlo.' },
                        { t: '2,5 mg al día: el riñón no cambia su dosis', ok: false, porque: 'Se elimina por el riñón (vida media de 17 h): a dosis plena con ClCr 25 se acumularía y la paciente podría sangrar.' },
                        { t: 'Tabla: no usar si <30. Texto: 1,5 mg si 20-50', ok: true }],
                    explicacion: 'El libro se contradice y <span class="hl-rojo">no se elige ganadora</span>: la tabla (p. 4) da 1,5 mg con ClCr 35-50 y prohíbe por debajo de 30; el texto (p. 8), 1,5 mg con 20-50 y prohíbe por debajo de 20. La calculadora avisa en ese tramo.',
                    nota: '<b>Nota de fidelidad.</b> El texto cubre todo el tramo 20-50; la tabla calla entre 30 y 35 (ni ajuste ni «no usar»). Se reproducen las dos, como en la ficha.' } },
            { momento: 'Día 9', datos: { ClCr: '50 mL/min', Plaquetas: 'se recuperan' }, nuevo: ['ClCr', 'Plaquetas'], estado: { farmaco: 'fondaparinux', imc: 42, clcr: 25 }, mirar: 'rinon',
                pregunta: { id: 'tr-6', tipo: 'test', fuente: 'mar-fondaparinux · mar-tabla-5-2 (p. 4, 8)',
                    tocar: { mandos: ['clcr'], mirar: 'rinon', ocultar: ['dosis'], instruccion: 'sube el ClCr a 50 y lee la calculadora.', comprobar: e => e.clcr === 50, pista: 'Pulsa «50».', bueno: { clcr: 50 }, confirma: 'con ClCr 50, 1,5 mg al día: la tabla (35-50) y el texto (20-50) coinciden.' },
                    enunciado: 'Predice. El ClCr sube a 50. ¿Y la dosis de fondaparinux?',
                    opciones: [
                        { t: 'No usar: no se permite por debajo de 60', ok: false, porque: 'Ninguna parte del libro pone ese límite. La dejarías sin profilaxis con una TIH sospechada.' },
                        { t: '1,5 mg al día: aquí tabla y texto coinciden', ok: true },
                        { t: '2,5 mg al día: con 50 ya es como un riñón sano', ok: false, porque: 'Entre 35 (o 20) y 50, la tabla y el texto piden 1,5 mg. Con 2,5 mg se acumularía y podría sangrar.' }],
                    explicacion: 'Con ClCr <span class="hl">35-50: 1,5 mg al día</span> en la tabla; el texto lo da entre 20 y 50. Por encima de 50, 2,5 mg.' } },
        ],
        lleva: ['Con IMC ≥40 y ClCr &lt;30 a la vez, la Tabla 5.2 no da pauta para la enoxaparina; la HNF no tiene ajuste renal (7.500 U cada 8 h con IMC ≥40).',
            'En la UCI médica, HBPM sin mecánica añadida de rutina; las medias, nunca solas.',
            'TIH: FP4 + IgG, trombosis y trombocitopenia, sin depender de la dosis. Profilaxis con fondaparinux si se sospecha (con ClCr 25, la tabla y el texto discrepan); si se confirma o trombosa, el tratamiento aprobado es el argatrobán.'],
        volver: { nombre: 'Tabla 5.2', ancla: 'mar-tabla-5-2', estado: { farmaco: 'fondaparinux', imc: 42, clcr: 50 } } },

    { id: 'c-javier', titulo: 'Javier, 35 años: trauma con TCE', corto: 'Javier · TCE y fémur', sub: 'TCE y fractura de fémur',
        paciente: { Edad: '35 años', Motivo: 'accidente de moto: TCE con una contusión y fractura de fémur', TC: 'contusión frontal con sangrado' },
        pasos: [
            { momento: 'Ingreso', datos: {}, nuevo: [], estado: { riesgo: 'trauma', inflamacion: true }, mirar: 'valvula',
                pregunta: { id: 'tj-1', tipo: 'test', fuente: 'mar-esc-tce · mar-tev-contra-absolutas · mar-filtro-vci (p. 4, 11-12)',
                    despues: { riesgo: 'trauma', inflamacion: true, mecanica: 'cni' },
                    enunciado: 'Trauma grave con sangrado intracraneal. ¿Qué profilaxis empiezas hoy?',
                    opciones: [
                        { t: 'CNI hasta 24 h de TC sin sangrado ni progresión', ok: true },
                        { t: 'Enoxaparina 30 mg cada 12 h desde hoy mismo', ok: false, porque: 'La hemorragia intracraneal es contraindicación absoluta de anticoagular. Con TCE, CNI hasta que la TC no muestre sangrado ni progresión en 24 h; antes, la heparina podría hacer crecer el hematoma.' },
                        { t: 'Un filtro de cava, porque no se puede anticoagular', ok: false, porque: 'El filtro no previene la TVP y no se recomienda como profilaxis. El paciente seguiría haciendo trombos en la pierna.' }],
                    explicacion: 'TCE: <span class="hl">CNI hasta que la TC no muestre sangrado (o progresión) durante 24 h</span>; después se añade enoxaparina 30 mg SC cada 12 h.' } },
            { momento: 'Día 1 · noche', datos: { PA: '98/34 mmHg con noradrenalina' }, nuevo: ['PA'], estado: { riesgo: 'trauma', inflamacion: true, mecanica: 'cni', diastolica: 70 }, mirar: 'mangas',
                pregunta: { id: 'tj-2', tipo: 'test', fuente: 'mar-cni-pegas · mar-mecanica (p. 10)',
                    tocar: { mandos: ['diastolica'], mirar: 'mangas', ocultar: [], instruccion: 'pon su diastólica (34) con la CNI puesta y mira la arteria y el pie.', comprobar: e => e.diastolica === 34, pista: 'Pulsa «PAD 34».', bueno: { diastolica: 34 }, confirma: '35-40 mmHg en el tobillo por encima de una diastólica de 34: la CNI aprieta la arteria y el pie palidece.' },
                    enunciado: 'Predice. La CNI aprieta a 35-40 mmHg en el tobillo y su diastólica ha bajado a 34. ¿Qué pasa?',
                    opciones: [
                        { t: 'Nada: la CNI comprime las venas, nunca las arterias', ok: false, porque: 'Cuando la presión aplicada supera la diastólica, comprime también la arteria: la pierna se quedaría con menos riego.' },
                        { t: 'Mejor: con la PA baja hay estasis y la CNI la corrige', ok: false, porque: 'La CNI no puede pasar de la diastólica; con 34 mmHg apretaría la arteria y dejaría la pierna con menos riego.' },
                        { t: 'Que, por encima de su diastólica, aprieta la arteria', ok: true }],
                    explicacion: '<span class="hl-rojo">La presión nunca debe superar la diastólica</span> (comprimiría las arterias). Qué hacer con la CNI en ese momento, el libro no lo dice.' } },
            { momento: 'Día 2', datos: { TC: 'sin sangrado ni progresión en 24 h', PA: '118/64 mmHg' }, nuevo: ['TC', 'PA'], estado: { riesgo: 'trauma', inflamacion: true, mecanica: 'cni', farmaco: 'enoxaparina', antiXa: true }, mirar: 'telar',
                pregunta: { id: 'tj-3', tipo: 'destapa', fuente: 'mar-esc-trauma · mar-hbpm (p. 7, 12)',
                    enunciado: 'La TC lleva 24 h estable. ¿Qué pautas ahora, y qué vigilas?',
                    puntos: ['Se <span class="hl">añade</span> a la CNI la HBPM: <span class="hl">enoxaparina 30 mg SC cada 12 h</span>.', '<span class="hl">Anti-Xa</span>: recomendado en el trauma grave, porque la función renal cambia mucho.', 'Objetivo profiláctico: <span class="hl">pico de 0,2-0,5 UI/mL</span>.'],
                    explicacion: 'La enoxaparina es más eficaz que la HNF en el trauma grave.' } },
            { momento: 'Día 3 · el giro', datos: { Neurocirugía: 'drenaje lumbar mañana', 'Última enoxaparina': 'hace 12 h (pauta cada 12 h)' }, nuevo: ['Neurocirugía', 'Última enoxaparina'], estado: { vista: 'reloj', horas: 12, farmaco: 'enoxaparina', mecanica: 'cni' }, mirar: 'reloj',
                pregunta: { id: 'tj-4', tipo: 'test', fuente: 'mar-neuroeje (p. 9-10)', ocultar: ['reloj'],
                    enunciado: 'Le van a poner un drenaje lumbar. ¿Cuántas horas tras la enoxaparina? Ojo: lleva 30 mg cada 12 h. ¿Te da la ficha la cifra para su pauta?',
                    opciones: [
                        { t: 'Sí: ≥12 h, lo mismo que la HNF subcutánea', ok: false, porque: '12 h es la cifra de la HNF. Con la enoxaparina pincharías demasiado pronto: riesgo de hematoma espinal y parálisis.' },
                        { t: 'No: solo la da para la pauta de una vez al día', ok: true },
                        { t: 'Sí: ≥24 h, que vale para cualquier pauta', ok: false, porque: 'La ficha da ≥24 h solo para la pauta de una vez al día; para la de cada 12 h no da cifra. Si la extrapolas sin decirlo, decides sobre su médula con un dato que no está en la fuente.' }],
                    explicacion: 'Es un <span class="hl-rojo">hueco de la fuente</span>: la ventana de la enoxaparina cada 12 h no está en el capítulo. Lo honesto es decirlo: esa cifra hay que buscarla fuera de esta ficha.' } },
            { momento: 'Día 3 · el pase', datos: { Plan: 'enoxaparina, CNI y anti-Xa; se pidió un filtro de cava' }, nuevo: ['Plan'], estado: { riesgo: 'trauma', inflamacion: true, mecanica: 'cni', farmaco: 'enoxaparina', filtro: true }, mirar: 'filtro',
                pregunta: { id: 'tj-5', tipo: 'error', fuente: 'mar-esc-tce · mar-filtro-vci (p. 11-12)',
                    enunciado: 'Resumen del R1 para el pase.',
                    frases: [
                        { t: 'Al ingreso, CNI, porque había sangrado intracraneal.', mal: false },
                        { t: 'Debimos empezar la enoxaparina desde el ingreso: el trauma es el riesgo más alto.', mal: true, c: 'Con TCE, <span class="hl">CNI hasta 24 h de TC sin sangrado ni progresión</span>; la hemorragia intracraneal contraindica anticoagular.' },
                        { t: 'Hemos pedido un filtro de cava como profilaxis, por si acaso.', mal: true, c: 'Los filtros <span class="hl-rojo">no previenen la TVP</span> y no se recomiendan como profilaxis: mira la red, que sigue creciendo bajo el filtro.' },
                        { t: 'Vigilamos el anti-Xa porque su función renal puede cambiar.', mal: false }],
                    explicacion: 'Dos errores. El filtro reduce la embolia pulmonar atrapando trombos, pero la trombosis de la pierna sigue.' } },
        ],
        lleva: ['TCE: CNI hasta que la TC no muestre sangrado ni progresión en 24 h; después se añade enoxaparina 30 mg cada 12 h, con anti-Xa.',
            'La CNI nunca por encima de la diastólica; el filtro de cava no es profilaxis.',
            'Neuroeje: la ficha da ≥24 h solo para la enoxaparina una vez al día; para la de cada 12 h, es un hueco.'],
        volver: { nombre: 'Trauma grave', ancla: 'mar-esc-trauma', estado: { riesgo: 'trauma', inflamacion: true, mecanica: 'cni', farmaco: 'enoxaparina' } } },

    { id: 'c-tomas', titulo: 'Tomás, 40 años: la adivinanza', corto: 'Tomás · lesión medular', sub: 'lesión medular, paraplejía',
        paciente: { Edad: '40 años', Motivo: 'caída: lesión medular dorsal, paraplejía' },
        pasos: [
            { momento: 'Día 1', datos: { Columna: 'recién operada; el sangrado aún preocupa' }, nuevo: ['Columna'], estado: { riesgo: 'medular', inflamacion: true }, mirar: 'valvula',
                pregunta: { id: 'tt-1', tipo: 'test', fuente: 'mar-esc-trauma · mar-fig-5-1 (p. 3, 12)',
                    despues: { riesgo: 'medular', inflamacion: true, mecanica: 'cni' },
                    enunciado: 'Recién operado de la columna; el sangrado aún preocupa. ¿Qué empiezas ya?',
                    opciones: [
                        { t: 'Enoxaparina 30 mg cada 12 h, que es su pauta', ok: false, porque: 'La heparina se empieza en cuanto anticoagular sea seguro, y aún no lo es: podría sangrar en la columna recién operada.' },
                        { t: 'Nada, hasta que se pueda dar la heparina', ok: false, porque: 'La CNI se empieza cuanto antes: esperar a la heparina lo dejaría sin protección en el grupo de más ETV de la Fig. 5.1.' },
                        { t: 'CNI cuanto antes; la heparina, cuando sea seguro', ok: true }],
                    explicacion: 'Lesión medular: <span class="hl">CNI cuanto antes</span> y enoxaparina en cuanto anticoagular se considere seguro; después, juntas.' } },
            { momento: 'Día 3', datos: { Columna: 'el sangrado ya no preocupa' }, nuevo: ['Columna'], estado: { riesgo: 'medular', inflamacion: true, mecanica: 'cni' }, mirar: 'telar',
                pregunta: { id: 'tt-2', tipo: 'test', fuente: 'mar-esc-trauma (p. 12)',
                    despues: { riesgo: 'medular', inflamacion: true, mecanica: 'cni', farmaco: 'enoxaparina' },
                    enunciado: 'Ya se puede anticoagular. ¿Qué profilaxis le dejas?',
                    opciones: [
                        { t: 'Enoxaparina 30 mg cada 12 h, con la CNI', ok: true },
                        { t: 'Retirar la CNI y pasar a enoxaparina sola', ok: false, porque: 'En la lesión medular van juntas. Quitar la CNI le restaría eficacia en el grupo de más riesgo.' },
                        { t: 'Enoxaparina 40 mg al día y sin CNI, como en la UCI', ok: false, porque: 'Esa es la pauta de la enfermedad médica. En la lesión medular, 30 mg cada 12 h y CNI, juntas: con menos, quedaría infraprotegido.' }],
                    explicacion: 'Lesión medular: <span class="hl">enoxaparina 30 mg SC cada 12 h</span> en cuanto sea seguro, y <span class="hl">CNI</span>, juntas.' } },
            { momento: 'Semana 4 · el giro', datos: { Estado: 'cuatro semanas tras la lesión; sigue en la cama' }, nuevo: ['Estado'], estado: { riesgo: 'medular', inflamacion: true, inmovil: true }, mirar: 'telar',
                pregunta: { id: 'tt-3', tipo: 'test', fuente: 'mar-inmovilidad · mar-tabla-5-1 (p. 2, 13)',
                    tocar: { mandos: ['inflamacion'], mirar: 'telar', ocultar: ['red', 'flujo'], instruccion: 'apaga la inflamación (sigue inmóvil) y mira la red y los hematíes.', comprobar: e => !e.inflamacion, pista: 'Pulsa «Sin inflamación».', bueno: { inflamacion: false }, confirma: 'sin inflamación el telar se para, y los hematíes suben al mismo ritmo aunque siga en la cama.' },
                    enunciado: 'Predice. Pasadas 3-4 semanas, el libro ya no ve riesgo alto. Si lo que lo disparaba fuera la inflamación y no la cama, ¿qué haría el telar sin inflamación pero con el paciente inmóvil?',
                    opciones: [
                        { t: 'Teje más: cuatro semanas inmóvil es estasis máxima', ok: false, porque: 'Con gasto normal no hay estasis aunque no se mueva. Creerlo te llevaría a anticoagularle de más, con su riesgo de sangrado.' },
                        { t: 'Se para, aunque siga sin moverse de la cama', ok: true },
                        { t: 'Sigue igual: la paraplejía no cambia', ok: false, porque: 'Si fuera así, se haría profilaxis perpetua en la paraplejía, y no se hace: el riesgo es alto solo 3-4 semanas. Mantenerla le expondría al sangrado sin beneficio.' }],
                    explicacion: 'Según el autor, lo que dispara la TVP es probablemente la <span class="hl">inflamación</span>, no la cama: por eso el riesgo es alto solo 3-4 semanas y después se suspende la profilaxis.',
                    nota: '<b>Nota de fuentes.</b> La Tabla 5.1 (p. 2) sí incluye la inmovilidad prolongada entre los factores de riesgo; la reflexión del autor (p. 13) la discute y deduce, de que la profilaxis se suspenda, que la inmovilidad sola no es factor de riesgo. Es su opinión; el capítulo no dice que la inflamación haya cedido en este paciente.' } },
            { momento: 'Semana 6', datos: { Familia: '«si sigue sin moverse, ¿por qué le quitan la heparina?»' }, nuevo: ['Familia'], estado: { riesgo: 'medular', inmovil: true }, mirar: 'flujo',
                pregunta: { id: 'tt-4', tipo: 'destapa', fuente: 'mar-inmovilidad (p. 13)',
                    enunciado: 'La familia pregunta por qué le quitan la heparina si sigue sin moverse. ¿Qué les explicas?',
                    puntos: ['Tras la lesión medular, el riesgo de TVP es alto <span class="hl">solo 3-4 semanas</span>; luego se suspende la profilaxis y, según el autor, eso implica que la inmovilidad sola no es factor de riesgo (la Tabla 5.1 sí la lista).', '<span class="hl">Inmovilidad no es estasis</span>: con el gasto normal, la sangre de las piernas vuelve al mismo ritmo.', 'Lo que dispara la TVP es probablemente la <span class="hl">inflamación</span> de la lesión; la cama sola, no.'],
                    explicacion: 'Según el autor, creer que la inmovilidad predispone a la TVP lleva a usar anticoagulantes de más.',
                    nota: '<b>Nota de interpretación.</b> Es la reflexión final de Marino (p. 13), con su «probablemente»: se presenta como su opinión.' } },
            { momento: 'Semana 6 · el plan', datos: { Plan: 'revisar la profilaxis' }, nuevo: ['Plan'], estado: { riesgo: 'medular', inmovil: true, mecanica: 'medias' }, mirar: 'mangas',
                pregunta: { id: 'tt-5', tipo: 'error', fuente: 'mar-inmovilidad · mar-mecanica · mar-tabla-5-1 (p. 2, 10, 13)',
                    enunciado: 'Plan del R1.',
                    frases: [
                        { t: 'Según el libro, el riesgo alto dura 3-4 semanas tras la lesión, así que valoro suspender la enoxaparina.', mal: false },
                        { t: 'Le dejo las medias como único método, ya que no camina.', mal: true, c: 'Las medias <span class="hl-rojo">nunca se usan como único método</span> en el hospitalizado; y, según el autor, la inmovilidad sola no pide profilaxis.' },
                        { t: 'Si sigue encamado, la profilaxis debe ser indefinida.', mal: true, c: 'No se hace profilaxis perpetua en la paraplejía y, según el autor, <span class="hl">inmovilidad no es estasis</span>.' },
                        { t: 'Si aparece una sepsis, vuelvo a valorar el riesgo.', mal: false }],
                    explicacion: 'La sepsis es un factor de riesgo de la Tabla 5.1: la inflamación vuelve a encender el telar.' } },
        ],
        lleva: ['Lesión medular: CNI cuanto antes y enoxaparina 30 mg cada 12 h en cuanto sea seguro, juntas.',
            'El riesgo es alto solo 3-4 semanas tras la lesión; después se suspende la profilaxis, aunque siga sin caminar (el autor lo interpreta así; la Tabla 5.1 sí lista la inmovilidad).',
            'Inmovilidad no es estasis; lo que dispara la TVP es probablemente la inflamación (opinión del autor, frente a la Tabla 5.1). Creer lo contrario lleva a anticoagular de más.'],
        volver: { nombre: '¿La inmovilidad causa la TVP?', ancla: 'mar-inmovilidad', estado: { riesgo: 'medular', inmovil: true } } },
];

/* Para profundizar: lo que el modelo y la Mayéutica no cubren, con su sitio en la ficha y su página del PDF */
export const PROFUNDIZAR = [
    { html: '<b>Tabla 5.1 entera.</b> Cirugía (prótesis de cadera y rodilla, oncológica y bariátrica); trauma (TCE; fracturas de columna, pelvis, cadera o piernas; lesiones extensas y quemaduras); cáncer (páncreas y estómago, hematológicas, quimioterapia); enfermedad médica aguda (ictus con debilidad, insuficiencia cardíaca con edemas, COVID-19, sepsis, movilidad limitada); propios de la UCI (VM, bloqueo neuromuscular, catéteres centrales, shock, vasopresores, transfusión de plaquetas, inmovilidad prolongada) y del paciente (ETV previa, antecedentes familiares, genéticos, edad &gt;70, obesidad, embarazo o puerperio).', donde: 'mar-tabla-5-1 · p. 2', pag: 2 },
    { html: '<b>Fig. 5.1, en lectura aproximada.</b> Lesión medular ~60-80 %; trauma grave ~40-80 %; cadera o rodilla ~40-60 %; ictus ~20-50 %; cirugía general y neurocirugía ~15-40 %; enfermedad médica aguda ~10-30 %.', donde: 'mar-fig-5-1 · p. 3', pag: 3 },
    { html: '<b>Contraindicaciones.</b> Absolutas: hemorragia intracraneal y sangrado clínicamente importante (sistólica −20 mmHg, Hb −2 g/dL o ≥2 concentrados). Relativas: TCE o lesión medular, sangrado digestivo recurrente y coagulopatía grave (plaquetas &lt;50.000). La menstruación no lo es.', donde: 'mar-tev-contra-absolutas · mar-tev-contra-relativas · p. 4', pag: 4 },
    { html: '<b>El origen de la HNF y la pauta cada 8 h.</b> Un mucopolisacárido de los mastocitos (tradicionalmente, de intestino porcino o pulmón bovino). Cada 8 h es popular en el alto riesgo, pero la mayoría de estudios no ven diferencias de eficacia ni de sangrado con cada 12 h.', donde: 'mar-hnf · p. 4', pag: 4 },
    { html: '<b>Heparinas y obesidad.</b> En la obesidad (IMC ≥30), la dosis estándar de HNF se queda corta por el mayor volumen de distribución. La dalteparina no está bien estudiada: una recomendación, basada en la experiencia de un autor, es 200 U/kg al día (peso real).', donde: 'mar-hnf · mar-hbpm · p. 5, 7', pag: 5 },
    { html: '<b>La enoxaparina.</b> La primera HBPM aprobada en EE. UU. (1993) y la más usada; más eficaz que la HNF en la cirugía de cadera y rodilla y en el trauma grave.', donde: 'mar-hbpm · p. 7', pag: 7 },
    { html: '<b>El fondaparinux en el paciente médico.</b> Se recomienda (con la HNF y la HBPM) en los pacientes médicos hospitalizados, pero no es popular y no se ha estudiado en la UCI.', donde: 'mar-fondaparinux · p. 8', pag: 8 },
    { html: '<b>Los ACOD.</b> Solo para prótesis de cadera y rodilla (ahí superan a la HBPM; dabigatrán y rivaroxabán sangran más en algunos estudios y el apixabán podría ser el preferido); apixabán y rivaroxabán igual de eficaces en la obesidad mórbida; mejor no usarlos tras un bypass gástrico; el edoxabán no tiene dosis de profilaxis. El rivaroxabán está aprobado en la enfermedad médica aguda, pero un metaanálisis de los ACOD frente a HBPM en estos pacientes ve la misma eficacia con más sangrado.', donde: 'mar-acod-puntos · p. 8-9', pag: 9 },
    { html: '<b>La aspirina tras la artroplastia.</b> Recomendación condicional de la ASH, casi siempre a dosis bajas y a menudo combinada; como único fármaco tras una artroplastia no parece justificada.', donde: 'mar-aspirina · p. 9', pag: 9 },
    { html: '<b>Cirugía general mayor.</b> HNF o HBPM, con CNI añadida en el alto riesgo; en el alto riesgo son populares las dosis altas (HNF 5.000 U cada 8 h; enoxaparina 30 mg cada 12 h). Última dosis ≥6 h (HNF) o ≥12 h (HBPM) antes de operar; reanudar a las 6 y 12 h; en la oncológica de abdomen y pelvis de alto riesgo, hasta 4 semanas con HBPM.', donde: 'mar-esc-cirugia-general · p. 11', pag: 11 },
    { html: '<b>Cirugía bariátrica.</b> HBPM más CNI: enoxaparina 40 mg cada 12 h con IMC 30-49 y 60 mg cada 12 h con IMC ≥50. Cerca del 80 % de las ETV posoperatorias ocurren tras el alta, por eso se prolonga la HBPM unas 2 semanas en total (la duración no está bien estudiada).', donde: 'mar-esc-bariatrica · p. 12', pag: 12 },
    { html: '<b>Ortopedia.</b> ACOD en las prótesis de cadera y rodilla, con CNI al principio; HBPM en la fractura de cadera; prolongar hasta 35 días.', donde: 'mar-esc-ortopedica · p. 12', pag: 12 },
    { html: '<b>Neurocirugía y cirugía cardíaca.</b> Neurocirugía: CNI; cuando cede el riesgo de sangrado, HBPM en el alto riesgo y en la oncológica. Cardíaca: CNI si no se complica; CNI + HBPM si se complica o es de alto riesgo.', donde: 'mar-esc-neuro-cardio · p. 12', pag: 12 },
    { html: '<b>Trauma de órganos sólidos o extremidades.</b> Enoxaparina 40 mg SC cada 12 h cuando el sangrado no preocupe, idealmente a las 12-24 h; CNI en el alto riesgo si se tolera.', donde: 'mar-esc-trauma · p. 12', pag: 12 },
    { html: '<b>Cuando la profilaxis no basta.</b> El diagnóstico y el tratamiento de la TIH están en el cap. 13 del libro, y la embolia pulmonar, en el cap. 22. <button type="button" class="tel-org-ir" data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs" data-tab="neumo-ep-manejo">El tratamiento de la embolia pulmonar, en Merino Neumología →</button>', donde: 'mar-fondaparinux · p. 8', pag: 8 },
    { html: '<b>El mecanismo de la warfarina.</b> No está en la ficha: la lámina solo dice que tarda 5-7 días (hueco).', donde: 'mar-acod-puntos · p. 8', pag: 8 },
];

export const LAMINAS = [
    ['mar-fig5-1-prevalencia-etv.jpg', 'Fig. 5.1', 'Riesgo de ETV sin profilaxis en distintos grupos (sintomática y asintomática)'],
    ['mar-fig5-2-mecanismo-anticoagulantes.jpg', 'Fig. 5.2', 'Dónde actúa cada anticoagulante: HNF, HBPM y fondaparinux a través de la antitrombina; apixabán y rivaroxabán sobre el Xa; dabigatrán sobre la trombina. «X» = inhibición. El telar es esta figura hecha máquina'],
];

/* ============================================================
   Prueba de las cifras (sin DOM): window.__telPruebas() la amplía con los estados pintados y la Mayéutica
   ============================================================ */
export function pruebasTelar() {
    const r = { fallos: [], todoCoincide: true };
    const ok = (c, t) => { if (!c) { r.fallos.push(t); r.todoCoincide = false; } };
    const mezcla = p => estadoDe(p);
    // la adivinanza: inmóvil = mismo flujo; inflamación = el telar teje con el flujo intacto
    const sano = derivar(mezcla({})), inm = derivar(mezcla({ inmovil: true })), infl = derivar(mezcla({ inflamacion: true })), gb = derivar(mezcla({ gastoBajo: true }));
    r.adivinanza = { velSano: sano.velocidad, velInmovil: inm.velocidad, tejeInmovil: inm.teje, tejeInflamacion: infl.teje, velInflamacion: infl.velocidad, velGastoBajo: gb.velocidad };
    ok(inm.velocidad === sano.velocidad, 'inmóvil: la velocidad de los hematíes es la misma que en sano');
    ok(inm.teje === 0 && sano.teje === 0 && inm.tendencia === 'quieta', 'inmóvil: el telar no teje');
    ok(infl.teje > 0.3 && infl.velocidad === 1 && infl.tendencia === 'crece', 'inflamación: teje con el flujo intacto');
    ok(gb.velocidad < 1, 'gasto bajo: la única estasis');
    // qué hilo corta cada fármaco (Fig. 5.2)
    r.corta = Object.fromEntries(Object.keys(FARMACOS).map(k => [k, derivar(mezcla({ farmaco: k })).corta]));
    ok(r.corta.hnf.xa && r.corta.hnf.iia === 'pleno' && r.corta.hnf.viaAT, 'HNF: Xa y IIa, por la AT');
    ok(r.corta.enoxaparina.xa && r.corta.enoxaparina.iia === 'poco', 'HBPM: Xa, apenas IIa');
    ok(r.corta.fondaparinux.xa && r.corta.fondaparinux.iia === 'no' && r.corta.fondaparinux.viaAT, 'fondaparinux: solo Xa, por la AT');
    ok(r.corta.apixaban.directa && r.corta.apixaban.xa && r.corta.rivaroxaban.xa && r.corta.apixaban.iia === 'no', 'apixabán y rivaroxabán: Xa directo');
    ok(r.corta.dabigatran.directa && !r.corta.dabigatran.xa && r.corta.dabigatran.iia === 'pleno', 'dabigatrán: IIa directo');
    ok(CUENTAS.cinco.every(n => n === 5), 'fondaparinux: 5 cuentas');
    ok(new Set(CUENTAS.hnf).size > 1 && Math.min(...CUENTAS.hnf) < CUENTAS.hbpm[0] && Math.max(...CUENTAS.hnf) > 2 * CUENTAS.hbpm[0], 'HNF: mezcla de largos (más cortas y mucho más largas que la HBPM)');
    ok(new Set(CUENTAS.hbpm).size === 1 && CUENTAS.hbpm[0] > 5, 'HBPM: cortas y uniformes, más que 5');
    r.cifrasHeparina = { ...HEP };
    ok(HEP.antiIIaVecesAntiXa === 10 && HEP.hbpmDa === 4500 && HEP.hnfDa.join() === '3000,30000' && HEP.biodisp.hbpm === 90 && HEP.biodisp.hnf.join() === '15,30' && HEP.fondaVida === 17, 'HNF/HBPM: 10×, 4.500 Da, 3.000-30.000 Da, 90 % frente a 15-30 %; fondaparinux 17 h');
    // TIH
    const tih = derivar(mezcla({ vista: 'tih', tih: true, farmaco: 'hnf' })), tihF = derivar(mezcla({ vista: 'tih', tih: true, farmaco: 'fondaparinux' })), tihB = derivar(mezcla({ vista: 'tih', tih: true, farmaco: 'enoxaparina' }));
    r.tih = { hnf: tih.tih, fondaparinux: tihF.tih, hbpm: tihB.tih };
    ok(tih.tih.envuelve === 'si' && tih.tih.incidencia === 2.6 && tih.tih.dependeDosis === false && tih.plaquetasCaen, 'TIH con HNF: se une al FP4, 2,6 %, no depende de la dosis');
    ok(tihF.tih.envuelve === 'sin dato' && tihF.tih.fondaUsoTihPrevia && tihF.tih.tratamientoAprobado === 'argatrobán' && !tihF.plaquetasCaen, 'TIH y fondaparinux: solo lo que dice el libro (uso con TIH sospechada o previa; argatrobán)');
    ok(tihB.tih.incidencia === 0.2, 'TIH con HBPM: 0,2 %');
    // dosis: la calculadora
    const dosis = profilaxis;
    r.dosis = {
        enox90: dosis('enoxaparina', 90, 25).corta, enox25: dosis('enoxaparina', 25, 25).corta, enox42: dosis('enoxaparina', 90, 42).corta, enox25y42: dosis('enoxaparina', 25, 42).html,
        hnf: dosis('hnf', 90, 25).corta, hnf42: dosis('hnf', 90, 42).corta, dalte12: dosis('dalteparina', 12, 25), fonda32: dosis('fondaparinux', 32, 25), fonda25: dosis('fondaparinux', 25, 25), fonda50: dosis('fondaparinux', 50, 25).corta, fonda18: dosis('fondaparinux', 18, 25),
        dabi42: dosis('dabigatran', 90, 42), dabi25: dosis('dabigatran', 25, 25), apix12: dosis('apixaban', 12, 25), rivar90: dosis('rivaroxaban', 90, 25).corta, warf: dosis('warfarina', 12, 52).corta,
    };
    ok(r.dosis.enox90 === '40 mg al día o 30 mg cada 12 h', 'enoxaparina estándar');
    ok(r.dosis.enox25 === '30 mg al día', 'ClCr 25: 30 mg al día o HNF');
    ok(r.dosis.enox42 === '40 mg cada 12 h', 'IMC 42: 40 mg cada 12 h');
    ok(/no da una pauta para obesidad e insuficiencia renal a la vez/.test(r.dosis.enox25y42), 'IMC 42 y ClCr 25 chocan');
    ok(r.dosis.hnf === '5.000 U cada 8-12 h' && r.dosis.hnf42 === '7.500 U cada 8 h', 'HNF 5.000 y 7.500');
    ok(r.dosis.dalte12.aviso15 && r.dosis.dalte12.corta === '2.500-5.000 U al día', 'ClCr 12: dalteparina con la nota de la p. 11');
    ok(r.dosis.fonda32.estado === 'warn' && /no es clara/.test(r.dosis.fonda32.html) && /no es clara/.test(r.dosis.fonda25.html), 'fondaparinux con ClCr 25-32: la fuente no es clara');
    ok(r.dosis.fonda50 === '1,5 mg al día' && r.dosis.fonda18.estado === 'danger', 'fondaparinux con ClCr 50 y 18');
    ok(r.dosis.dabi42.estado === 'danger' && r.dosis.dabi25.estado === 'danger', 'dabigatrán: no con IMC ≥40 ni ClCr <30');
    ok(r.dosis.apix12.estado === 'danger' && r.dosis.rivar90 === '10 mg al día' && r.dosis.warf === '2,5-5 mg al día', 'apixabán, rivaroxabán y warfarina');
    ['dalte12', 'fonda32', 'fonda25', 'fonda18', 'dabi42', 'dabi25', 'apix12'].forEach(k => { r.dosis[k] = r.dosis[k].corta + ' · ' + r.dosis[k].estado; });
    r.dosis.enox25y42 = 'chocan';
    // el riñón: el vaso se llena según el veredicto renal
    r.vaso = { hnf12: derivar(mezcla({ farmaco: 'hnf', clcr: 12 })).vaso, enox25: derivar(mezcla({ farmaco: 'enoxaparina', clcr: 25 })).vaso, enox90: derivar(mezcla({ farmaco: 'enoxaparina', clcr: 90 })).vaso, dabi25: derivar(mezcla({ farmaco: 'dabigatran', clcr: 25 })).vaso };
    ok(r.vaso.enox90 < r.vaso.enox25 && r.vaso.enox25 < r.vaso.dabi25 && r.vaso.hnf12 === r.vaso.enox90, 'el vaso: sin ajuste < ajustar < no usar');
    // mecánica
    const med = derivar(mezcla({ mecanica: 'medias' })).medias, cni = derivar(mezcla({ mecanica: 'cni' })), cniD = derivar(mezcla({ mecanica: 'cni', diastolica: 34 }));
    r.medias = med; ok(med.tobillo === 18 && med.muslo === 8 && med.gradiente === 10, 'medias 18/8, gradiente 10');
    r.cni = { tobillo: cni.cni.tobillo.join('-'), muslo: cni.cni.muslo, ciclo: cni.cni.ciclo, porMinuto: cni.cni.porMinuto, fibrinolisis: cni.cni.fibrinolisis, pad70: cni.cni.aprietaArteria, pad34: cniD.cni.aprietaArteria };
    ok(r.cni.tobillo === '35-40' && r.cni.muslo === 20 && r.cni.ciclo === 10 && r.cni.porMinuto === 6 && r.cni.fibrinolisis, 'CNI 35-40/20, 10 s, fibrinólisis');
    ok(!r.cni.pad70 && r.cni.pad34, 'CNI: aprieta la arteria con PAD 34, no con 70');
    // filtro: atrapa émbolos, la red sigue
    const fil = derivar(mezcla({ filtro: true, inflamacion: true })); r.filtro = { atrapa: fil.atrapaEmbolos, tendencia: fil.tendencia };
    ok(fil.atrapaEmbolos && fil.tendencia === 'crece', 'filtro: no previene la TVP');
    // reloj neuroaxial
    r.reloj = Object.fromEntries([6, 12, 24, 48].map(h => [h, derivar(mezcla({ horas: h })).reloj]));
    ok(!r.reloj[6].hnf && r.reloj[12].hnf && !r.reloj[12].enoxaparina && r.reloj[24].enoxaparina && r.reloj[24].apixaban && !r.reloj[24].dabigatran && !r.reloj[24].rivaroxaban && r.reloj[48].dabigatran && r.reloj[48].rivaroxaban, 'reloj: 12 · 24 · 24 · 48 · 48 h');
    // estados con nombre: todos aplican y su cifra coincide
    r.estadosCifra = {};
    for (const [k, st] of Object.entries(ESTADOS)) { try { r.estadosCifra[k] = st.cifra(derivar(estadoDe(st.e))) === true; ok(r.estadosCifra[k], 'estado ' + k); } catch (err) { r.estadosCifra[k] = String(err); ok(false, 'estado ' + k); } }
    // los pasos de los casos: cada uno lleva un estado que aplica
    r.pasosCasos = CASOS.map(c => c.pasos.length);
    ok(CASOS.every(c => c.pasos.every(p => { try { derivar(estadoDe(p.estado)); return true; } catch { return false; } })), 'pasos de los casos');
    return r;
}
