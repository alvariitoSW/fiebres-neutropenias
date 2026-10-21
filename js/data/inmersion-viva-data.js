// La inmersión: datos puros, sin DOM (Libros → Marino → Fundamentos, cap. 6: mar-analgesia y mar-sedacion).
// Escena de la cabeza de «La cama 7». Viene de la maqueta aprobada autonomo/maquetas/b1-inmersion.html (vuelta 2,
// aprobada el 20/10/2026; auditoría autonomo/bloques/b1/auditoria-cama7.md §3 y juicio-cama7.md §3).
// Toda la medicina sale de las fichas de js/modules/libros/marino-fundamentos.html y de
// docs/marino-2024-practicas-monitorizacion-caps5-9.pdf (cap. 6, págs. 16-32 del PDF). Cada cifra dice su origen:
// ficha, fisiología general o ilustrativo. El paciente de los casos se inventa; la medicina, no.
//
// La metáfora: sedar es bajar bajo el agua (la RASS es el profundímetro); el dolor es la tormenta de la superficie
// (la BPS); los sedantes son lastres (propofol, plomo; midazolam, esponja; lorazepam, barril de propilenglicol;
// diazepam, piedra) y la dexmedetomidina, una boya; el opioide es el aceite que calma las olas.
// El modelo SALTA ENTRE LOS ESTADOS DE LAS TABLAS: ninguna farmacocinética inventada. La subida (Tabla 6.7) usa los
// ocho tiempos de la tabla tal cual; la velocidad de la animación, en escala logarítmica, es ilustrativa.
//
// Aquí: la hoja de órdenes (estado) y lo que se deriva de ella (derivar), los estados con nombre (los que abre
// data-inmersion-viva="<estado>"), los conceptos, la Mayéutica, los casos, «Para profundizar» y la prueba de las
// cifras (pruebasInmersion). La escena vive en js/modules/libros/inmersion-viva-escena.js y la interfaz en
// inmersion-viva.js.
//
// Formato de `fuente`: «ficha#elemento · #elemento · texto»; la interfaz lo convierte en «Ver en el texto» (enlaces a
// la ficha) y en el chip de origen («ficha · p. N»), sin ids a la vista.

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const copia = o => JSON.parse(JSON.stringify(o));
export const signo = r => r > 0 ? '+' + r : r < 0 ? '−' + Math.abs(r) : '0';

/* ============================================================
     Los fármacos (Tablas 6.2, 6.3 y 6.6 de la ficha)
     ============================================================ */
export const OPIOIDES = {   // Tabla 6.2 (p. 19) y acordeones de la ficha XII; vel: ritmo de la calma en la escena (ilustrativo)
      fentanilo: { n: 'Fentanilo', inicio: '1-2 min', vel: 0.8, irC: '¿evitar? (IR terminal)' },
      morfina: { n: 'Morfina', inicio: '5-10 min', vel: 2.4, irC: '↓50 % el mantenimiento' },
      hidromorfona: { n: 'Hidromorfona', inicio: '5-15 min', vel: 3.2, irC: 'sin ajuste' },
      remifentanilo: { n: 'Remifentanilo', inicio: '≈1 min', vel: 0.5, irC: 'sin ajuste (esterasas)' },
};
export const AHORRO = {     // Tabla 6.3 (p. 22)
      paracetamol: { n: 'Paracetamol', s: '1 g/6 h, ≤4 g/día' },
      ketorolaco: { n: 'Ketorolaco', s: '30 mg/6 h' },
      ketamina: { n: 'Ketamina', s: '60-120 µg/kg/h' },
};
export const SEDANTES = {
      propofol: { n: 'Propofol', s: 'plomo liso', lastre: 'plomo' },
      midazolam: { n: 'Midazolam', s: 'esponja', lastre: 'esponja' },
      lorazepam: { n: 'Lorazepam', s: 'con barril', lastre: 'barril' },
      dexmedetomidina: { n: 'Dexmedetomidina', s: 'boya', lastre: null },
      diazepam: { n: 'Diazepam', s: 'la trampa', lastre: 'piedra' },
};
export const BZD = ['midazolam', 'lorazepam', 'diazepam'];
export const TABLA_6_7 = {  // ficha · mar-tabla-6-7 (p. 29): tal cual
      24: { n: '24 horas', lig: '13 min', prof: '25 h', ligMin: 13, profMin: 1500 },
      72: { n: '72 horas', lig: '34 min', prof: '59 h', ligMin: 34, profMin: 3540 },
      168: { n: '7 días', lig: '3,3 h', prof: '71 h', ligMin: 198, profMin: 4260 },
      336: { n: '14 días', lig: '3,4 h', prof: '74 h', ligMin: 204, profMin: 4440 },
};
export const RASS_TERM = { 4: 'combativo', 3: 'muy agitado', 2: 'agitado', 1: 'inquieto', 0: 'alerta y tranquilo', '-1': 'somnoliento', '-2': 'sedación ligera', '-3': 'sedación moderada', '-4': 'sedación profunda', '-5': 'no despertable' };
export const BPS_TXT = {   // Tabla 6.1 (p. 18)
      cara: ['', 'relajada', 'parcialmente tensa', 'totalmente tensa', 'muecas'],
      brazos: ['', 'sin movimiento', 'parcialmente flexionados', 'totalmente flexionados', 'permanentemente retraídos'],
      vent: ['', 'tolera el ventilador', 'tose, pero lo tolera', 'lucha contra el ventilador', 'imposible controlar la ventilación'],
};
// La subida de los buzos: escala logarítmica de los minutos de la tabla (ilustrativo)
export const durSubida = min => Math.max(0.5, 1.15 * Math.log(min / 5));

/* ============================================================
     La hoja de órdenes y lo que se deriva de ella
     ============================================================ */
export function estadoBase() {
      return { estimulo: 'reposo', inflamacion: false, opioide: null, ahorro: [], sedante: null, prof: 'ligera', horas: 24, dosisAlta: false,
          renal: 'normal', volemia: 'normal', delirio: false, bradi: false, halo: false, qtcLargo: false, par: false, subido: false, llamado: false, fijo: {} };
}
export const estadoDe = parcial => Object.assign(estadoBase(), copia(parcial || {}));

// La BPS: 3 + intensidad (ilustrativo); el reparto en las 3 categorías de la Tabla 6.1 va cara → ventilador → brazos.
export function itemsBPS(d) {
      const it = { cara: 1, brazos: 1, vent: 1 }, orden = ['cara', 'vent', 'brazos'];
      for (let i = 0; i < d; i++) { const k = orden[i % 3]; if (it[k] < 4) it[k]++; }
      return it;
}
// La RASS de la escena (ilustrativo; la escala y el objetivo, de la ficha)
export function rassDe(e, bps) {
      if (e.fijo.rass != null) return e.fijo.rass;
      if (e.par && e.subido) return 0;
      if (e.delirio) { if (e.halo && !e.qtcLargo) return -1; if (e.sedante === 'dexmedetomidina') return -2; return 3; }
      if (e.sedante === 'diazepam') return -3;
      if (e.sedante === 'dexmedetomidina') return -2;
      if (e.sedante) { if (e.prof === 'profunda') return -4; if (e.sedante === 'midazolam' && e.horas > 48) return -3; return -2; }
      if (bps >= 9) return 2; if (bps >= 6) return 1;
      return e.opioide ? -1 : 0;
}
// Los buzos de la subida: Tabla 6.7 para el propofol; el estudio de la ficha para las BZD; Tabla 6.6 para la dexmedetomidina.
export function parDe(e) {
      if (!e.par) return null;
      if (e.sedante === 'propofol') {
          const t = TABLA_6_7[e.horas];
          return [{ k: 'ligera', rass: -2, lastre: 'plomo', t: t ? t.lig : null, min: t ? t.ligMin : null, suya: e.prof === 'ligera' },
              { k: 'profunda', rass: -4, lastre: 'plomo', t: t ? t.prof : null, min: t ? t.profMin : null, suya: e.prof === 'profunda' }];
      }
      if (e.sedante === 'midazolam' || e.sedante === 'lorazepam')
          return [{ k: 'midazolam', rass: -2, lastre: 'esponja', t: '30 h', min: 1800, suya: e.sedante === 'midazolam', estudio: true },
              { k: 'lorazepam', rass: -2, lastre: 'barril', t: '4-5 h', min: 270, suya: e.sedante === 'lorazepam', estudio: true }];
      if (e.sedante === 'dexmedetomidina') return [{ k: 'dexmedetomidina', rass: -2, lastre: null, boya: true, t: '6-10 min', min: 8, suya: true }];
      if (e.sedante === 'diazepam') return [{ k: 'diazepam', rass: -3, lastre: 'piedra', t: null, min: null, suya: true, nota: 'vida media de 90 h: sin cifra de despertar' }];
      return null;
}
export function derivar(e) {
      const f = e.fijo || {};
      const base = e.estimulo === 'mover' ? 6 : 2;                          // ilustrativo
      const dolor0 = Math.round(base * (e.inflamacion ? 1.4 : 1));           // hipernocicepción: el mismo gesto, más dolor (ilustrativo)
      const alivio = (e.opioide ? 6 : 0) + e.ahorro.length + (e.sedante === 'dexmedetomidina' ? 1 : 0);
      const d = clamp(dolor0 - alivio, 0, 9);
      const bps = f.bps ?? 3 + d;
      const items = itemsBPS(bps - 3);
      const rass = rassDe(e, bps);
      const hipoPA = e.volemia === 'hipovolemia' && ((e.opioide && BZD.includes(e.sedante)) || e.sedante === 'propofol');
      const dexm = e.sedante === 'dexmedetomidina';
      const pris = e.sedante === 'propofol' && e.dosisAlta && e.horas > 48;
      let fc;
      if (f.fc != null) fc = { v: f.fc, txt: String(f.fc), o: 'caso', fuera: f.fc < 60 };
      else if (e.bradi) fc = { v: null, txt: '↓↓', u: 'bradicardia · sin cifra', o: 'sin cifra', fuera: true };
      else if (dexm) fc = { v: null, txt: '↓', u: 'simpaticolítico · sin cifra', o: 'sin cifra' };
      else if (pris) fc = { v: null, txt: '—', u: 'sin cifra', o: 'sin cifra' };
      else fc = { v: 80 + Math.round((bps - 3) / 3), o: 'ilustr.' };
      if (fc.v != null && !fc.txt) fc.txt = String(fc.v);
      let pa;
      if (f.pa != null) pa = { txt: f.pa, o: 'caso', fuera: true };
      else if (pris) pa = { txt: '↓↓', u: 'IC brusca · sin cifra', o: 'sin cifra', fuera: true };
      else if (hipoPA) pa = { txt: '↓↓', u: 'caída marcada · sin cifra', o: 'sin cifra', fuera: true };
      else if (e.bradi || dexm) pa = { txt: '↓', u: 'baja · sin cifra', o: 'sin cifra', fuera: e.bradi };
      else pa = { txt: '125/70', o: 'ilustr.' };
      const av = {
          pris,
          pg: e.sedante === 'lorazepam' && e.dosisAlta && e.horas > 48,
          midaz: e.sedante === 'midazolam' && e.horas > 48,
          hipoPA,
          haloBloq: e.halo && e.qtcLargo,
          morfIR: e.opioide === 'morfina' && e.renal === 'ir',
          sinAnalgesia: !!e.sedante && e.sedante !== 'dexmedetomidina' && !e.opioide && bps >= 6,
          trampa: e.sedante === 'diazepam',
      };
      return { e, bps, d, items, rass, fc, pa, av, par: parDe(e), recomienda: e.delirio ? (e.bradi ? 'haloperidol' : 'dexmedetomidina') : null };
}

/* Estados con nombre: los que abre data-inmersion-viva="<estado>" (fichas, menú, buscador y Mayéutica).
     subir: al abrirlo, los buzos sueltan el lastre (la subida de la Tabla 6.7). */
export const ESTADOS = {
      'dolor-oculto': { nombre: 'Dolor oculto', sub: 'BPS 9 · RASS −3 · FC normal', e: { estimulo: 'mover', sedante: 'propofol', fijo: { rass: -3 } } },
      diazepam: { nombre: 'Diazepam', sub: 'hunde; la tormenta sigue', e: { estimulo: 'mover', sedante: 'diazepam' } },
      fentanilo: { nombre: 'Fentanilo', sub: 'calma', e: { estimulo: 'mover', opioide: 'fentanilo' } },
      'morfina-ir': { nombre: 'Morfina con IR', sub: '↓50 %', e: { estimulo: 'mover', opioide: 'morfina', renal: 'ir' } },
      hipernocicepcion: { nombre: 'Hipernocicepción', sub: 'inflamación', e: { estimulo: 'mover', inflamacion: true } },
      'rass-objetivo': { nombre: 'RASS objetivo', sub: 'ligera, −1/−2', e: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol', prof: 'ligera' } },
      'profunda-72h': { nombre: 'Profunda, 72 h', sub: 'RASS −4', e: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 72 } },
      despertar: { nombre: 'Despertar', sub: 'dos buzos, 72 h', subir: true, e: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 72, par: true } },
      'midazolam-48h': { nombre: 'Midazolam >48 h', sub: 'la esponja', e: { opioide: 'fentanilo', sedante: 'midazolam', horas: 72 } },
      'lorazepam-pg': { nombre: 'Lorazepam', sub: 'el barril gotea', e: { opioide: 'fentanilo', sedante: 'lorazepam', dosisAlta: true, horas: 72 } },
      dexmedetomidina: { nombre: 'Dexmedetomidina', sub: 'la boya', e: { opioide: 'fentanilo', sedante: 'dexmedetomidina' } },
      pris: { nombre: 'SIP', sub: 'propofol >5 mg/kg/h', e: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', dosisAlta: true, horas: 72 } },
      delirio: { nombre: 'Delirio', sub: 'agitación', e: { opioide: 'fentanilo', delirio: true } },
      haloperidol: { nombre: 'Haloperidol', sub: 'si no tolera la dexm.', e: { opioide: 'fentanilo', delirio: true, bradi: true, halo: true } },
};

/* ============================================================
     El chip de origen: «ficha», «fisiología general» o «ilustrativo», y la página del PDF. El id de la ficha nunca se ve.
     ============================================================ */
export const PAGINAS = { 'mar-dolor-intro': 16, 'mar-fig-6-1': 17, 'mar-hipernocicepcion': 17, 'mar-escala-numerica': 17, 'mar-bps-intro': 17, 'mar-bps-calc': 18,
      'mar-constantes-dolor': 18, 'mar-opioide-definiciones': '18-19', 'mar-opioide-dosis-individual': 19, 'mar-tabla-6-2': 19, 'mar-morfina': '19-20', 'mar-fentanilo': 20,
      'mar-hidromorfona': 20, 'mar-remifentanilo': 20, 'mar-meperidina': '20-21', 'mar-pca': 21, 'mar-opioide-respiratorio': 21,
      'mar-opioide-cardio': 21, 'mar-opioide-intestino': 21, 'mar-opioide-nauseas': 22, 'mar-tabla-6-3': 22, 'mar-analgesico-calc': 22, 'mar-ketamina-errata': 22,
      'mar-ketamina': 23, 'mar-neuropatico': 23, 'mar-ansiedad': 23, 'mar-tabla-6-4': 24, 'mar-rass-pasos': 24, 'mar-escalas-sedacion': 24, 'mar-bzd-intro': 25,
      'mar-midazolam': 25, 'mar-lorazepam': '25-26', 'mar-tabla-6-5': 26, 'mar-bzd-proscontras': 26, 'mar-bzd-prevencion': 27, 'mar-tabla-6-6': 27, 'mar-propofol': 28,
      'mar-propofol-calc': 28, 'mar-nota-propofol-240': 28, 'mar-pris': 28, 'mar-tabla-6-7': 29, 'mar-dexmedetomidina': '29-30', 'mar-haloperidol-intro': '30-31',
      'mar-tabla-6-8': '30-31', 'mar-halo-wizard': 30, 'mar-haloperidol-qtc': 31, 'mar-opiofobia': 31, 'mar-analgesia': 16, 'mar-sedacion': 23 };
/* ============================================================
   La explicación guiada de cada estado con nombre (REGLAS §7.10; core/explicacion-guiada.js): 3-5 pasos cortos.
   Cada paso: { t, mirar (el anillo de la escena o una cifra del tablero: ANCLAS de inmersion-viva-escena.js),
   resalta (un marco), e (cómo cambia la hoja de órdenes en ese paso), cita (core/citas.js: ficha, párrafo y página
   del PDF), org }. Todo sale de las fichas de analgesia y sedación (Marino, cap. 6).
   ============================================================ */
export const PDF_B = 'docs/marino-2024-practicas-monitorizacion-caps5-9.pdf';
const SED = new Set(['mar-ansiedad', 'mar-tabla-6-4', 'mar-rass-pasos', 'mar-escalas-sedacion', 'mar-bzd-intro', 'mar-tabla-6-5', 'mar-midazolam', 'mar-lorazepam', 'mar-bzd-proscontras', 'mar-bzd-prevencion',
    'mar-tabla-6-6', 'mar-propofol', 'mar-pris', 'mar-tabla-6-7', 'mar-tabla-6-7-mensaje', 'mar-dexmedetomidina', 'mar-haloperidol-intro', 'mar-tabla-6-8', 'mar-haloperidol-qtc']);
const AS = (id, pag = PAGINAS[id] ?? (id === 'mar-tabla-6-7-mensaje' ? 29 : undefined)) => ({ libro: 'Marino, cap. 6', ficha: SED.has(id) ? 'mar-sedacion' : 'mar-analgesia', id, pag, pdf: PDF_B });
export const GUIAS = {
    'dolor-oculto': [
        { t: 'Sedado (RASS −3) y con el monitor tranquilo: FC y PA normales.', mirar: 'monitor', cita: AS('mar-constantes-dolor'), org: 'FC, PA y RASS: ilustrativas' },
        { t: 'Pero la correlación entre la intensidad del dolor y los cambios de FC o PA es <span class="hl-rojo">mala</span>: hay que abandonar esa práctica.', mirar: 'fc', cita: AS('mar-constantes-dolor') },
        { t: 'Si no puede contestar, la escala conductual del dolor (BPS, Tabla 6.1): la cara, los miembros superiores y la adaptación al ventilador. De 3 a 12; ≥6 es dolor inaceptable.', mirar: 'medallon', cita: [AS('mar-bps-intro'), AS('mar-bps-calc')] },
        { t: 'Aquí, <span class="hl-rojo">BPS 9</span>: le duele. Mira la cara, no la FC.', mirar: 'bps', cita: AS('mar-bps-intro'), org: 'BPS 9: ilustrativa' },
    ],
    diazepam: [
        { t: 'Diazepam: le hunde (RASS −3), pero <span class="hl-rojo">la tormenta sigue</span>. No alivia el dolor.', mirar: 'buzo', cita: AS('mar-fig-6-1') },
        { t: 'En la Fig. 6.1 respondieron mal a si el diazepam alivia el dolor el ~80 % de los residentes y el ~43 % de las enfermeras de UCI.', mirar: 'medallon', cita: [AS('mar-fig-6-1'), AS('mar-img-6-1', 17)], org: 'Fig. 6.1: lectura aproximada' },
        { t: 'La cara sigue en BPS 9: dolor inaceptable (≥6).', mirar: 'bps', cita: AS('mar-bps-intro'), org: 'BPS 9: ilustrativa' },
        { t: 'Además, el diazepam se evita en vena: vida media de 90 h y metabolitos activos.', mirar: 'buzo', cita: AS('mar-bzd-intro') },
    ],
    fentanilo: [
        { t: 'Fentanilo: <span class="hl">calma la tormenta</span>. Inicio en 1-2 min (Tabla 6.2).', mirar: 'aceite', cita: AS('mar-tabla-6-2') },
        { t: 'Ha sustituido a la morfina como el opioide más usado en la UCI: 600 veces más liposoluble, sin liberar histamina (menos hipotensión) y sin metabolitos activos.', mirar: 'aceite', cita: AS('mar-fentanilo') },
        { t: 'Los opioides dan una sedación leve, sin amnesia: el paciente apenas baja.', mirar: 'rass', cita: AS('mar-opioide-definiciones'), org: 'RASS −1: ilustrativa' },
        { t: 'Su pega: por su lipofilia se acumula en el cerebro con el uso continuado.', mirar: 'buzo', cita: AS('mar-fentanilo') },
    ],
    'morfina-ir': [
        { t: 'Morfina con insuficiencia renal: <span class="hl-rojo">sus metabolitos activos se acumulan</span>.', mirar: 'aceite', cita: AS('mar-morfina') },
        { t: 'La morfina-3-glucurónido puede dar agitación con mioclonías y convulsiones; la 6-glucurónido es más analgésica que la propia morfina.', mirar: 'buzo', cita: AS('mar-morfina') },
        { t: 'Por eso, en la insuficiencia renal, <span class="hl">−50 %</span> la dosis de mantenimiento (Tabla 6.2).', mirar: 'aceite', cita: [AS('mar-tabla-6-2'), AS('mar-morfina')] },
        { t: 'Libera histamina: vasodilatación e hipotensión, sobre todo con el tono vascular alto. No causa broncoespasmo.', mirar: 'pa', cita: AS('mar-morfina') },
    ],
    hipernocicepcion: [
        { t: 'El dolor está amplificado en el crítico (<span class="hl-rojo">hipernocicepción</span>): algo menor se vuelve doloroso.', mirar: 'medallon', cita: AS('mar-hipernocicepcion') },
        { t: 'Se atribuye a la inflamación sistémica (prostanoides) y a la inmovilidad prolongada.', mirar: 'buzo', cita: AS('mar-hipernocicepcion') },
        { t: 'Una causa frecuente es simplemente moverle en la cama; y un 50 % tiene dolor en reposo, sobre todo lumbar y en las piernas.', mirar: 'bps', cita: AS('mar-hipernocicepcion') },
        { t: 'Sin analgesia ni sedante, la BPS sube a 11 y se agita (RASS +2).', mirar: 'rass', cita: [AS('mar-bps-intro'), AS('mar-tabla-6-4')], org: 'BPS y RASS: ilustrativas' },
    ],
    'rass-objetivo': [
        { t: 'La RASS va de +4 (combativo) a −5 (no despertable); <span class="hl-verde">el óptimo es 0</span>.', mirar: 'regla', cita: [AS('mar-tabla-6-4'), AS('mar-escalas-sedacion')] },
        { t: 'En perfusión de sedantes se titula a <span class="hl">RASS −1 a −2</span>: sedación ligera.', mirar: 'rass', cita: AS('mar-escalas-sedacion') },
        { t: 'Tres pasos: observar sin interactuar; la voz (su nombre en voz alta, que te mire); y el estímulo físico (sacudir el hombro, frotar el esternón).', mirar: 'buzo', cita: AS('mar-rass-pasos') },
        { t: 'Mantener una sedación ligera titulada con una escala favorece el destete y reduce el delirio.', mirar: 'regla', cita: AS('mar-bzd-prevencion') },
    ],
    'profunda-72h': [
        { t: 'Propofol 72 h en sedación profunda: <span class="hl-rojo">RASS −4</span>. No responde a la voz; se mueve con el estímulo físico.', mirar: 'rass', cita: AS('mar-tabla-6-4') },
        { t: 'Cuanto más hondo, más tarda en subir: tras 72 h, la profunda despierta en 59 h; la ligera, en 34 min (Tabla 6.7).', mirar: 'relojes', cita: AS('mar-tabla-6-7') },
        { t: 'Lo que más alarga el despertar es la profundidad: mantener una sedación ligera con propofol si es posible.', mirar: 'regla', cita: AS('mar-tabla-6-7-mensaje') },
    ],
    despertar: [
        { t: 'Dos buzos con propofol 72 h: uno en sedación ligera y otro en profunda. ¿Quién llega antes?', mirar: 'relojes', cita: AS('mar-tabla-6-7') },
        { t: 'Sueltan el lastre: la ligera despierta en <span class="hl-verde">34 min</span>; la profunda, en <span class="hl-rojo">59 horas</span>.', e: { subido: true }, mirar: 'reloj', cita: AS('mar-tabla-6-7') },
        { t: 'Con más duración, más tarda: tras 7 días, 3,3 h la ligera y 71 h la profunda.', e: { subido: true }, mirar: 'relojes', cita: AS('mar-tabla-6-7') },
        { t: 'La profundidad pesa más que la duración: mantener una sedación ligera con propofol si es posible.', e: { subido: true }, mirar: 'regla', cita: AS('mar-tabla-6-7-mensaje') },
    ],
    'midazolam-48h': [
        { t: 'Midazolam en perfusión: muy liposoluble, <span class="hl-rojo">se acumula en el SNC</span>.', mirar: 'buzo', cita: AS('mar-midazolam') },
        { t: 'Tras 72 h, la esponja pesa más y el paciente baja (RASS −3). Se recomienda limitar la perfusión a ≤48 h.', mirar: 'rass', cita: AS('mar-midazolam'), org: 'cuánto baja: ilustrativo' },
        { t: 'Lo metaboliza el citocromo P450 (el diltiazem o la eritromicina potencian su efecto) y tiene un metabolito activo que elimina el riñón.', mirar: 'buzo', cita: AS('mar-midazolam') },
        { t: 'Las guías más recientes: evitar las benzodiacepinas en la sedación prolongada del ventilado, si se puede.', mirar: 'regla', cita: AS('mar-bzd-prevencion') },
    ],
    'lorazepam-pg': [
        { t: 'Lorazepam: menos liposoluble y sin metabolitos activos, acumula menos.', mirar: 'buzo', cita: AS('mar-lorazepam') },
        { t: 'Su riesgo es el propilenglicol, el disolvente: con más de 0,1 mg/kg/h o 10 mg/h durante más de 48 h, <span class="hl-rojo">se convierte en ácido láctico</span>.', mirar: 'buzo', cita: AS('mar-lorazepam') },
        { t: 'Da acidosis láctica, alteración mental, inflamación sistémica e insuficiencia renal.', mirar: 'medallon', cita: AS('mar-lorazepam') },
        { t: 'El lactato no predice bien la toxicidad: vigila el hiato osmolar (>10 mOsm/kg H₂O se correlaciona con la acumulación).', mirar: 'buzo', cita: AS('mar-lorazepam') },
    ],
    dexmedetomidina: [
        { t: 'Dexmedetomidina, un agonista α2: sedante, amnésica y algo analgésica, <span class="hl-verde">sin depresión respiratoria</span>.', mirar: 'buzo', cita: AS('mar-dexmedetomidina') },
        { t: 'Sedación cooperativa: el paciente se despierta sin bajar la perfusión y, cuando ya no hace falta, vuelve solo a su sedación.', mirar: 'buzo', cita: AS('mar-dexmedetomidina') },
        { t: 'Si se para, despierta en 6-10 min (Tabla 6.6).', mirar: 'reloj', cita: AS('mar-tabla-6-6') },
        { t: 'Es simpaticolítica: <span class="hl-rojo">baja la FC y la PA</span>. Síndrome de retirada en el 30 %.', mirar: 'fc', cita: AS('mar-dexmedetomidina') },
    ],
    pris: [
        { t: 'Propofol a dosis alta (>80 µg/kg/min o >5 mg/kg/h) durante más de 48 h: <span class="hl-rojo">síndrome de infusión de propofol</span>.', mirar: 'buzo', cita: AS('mar-pris') },
        { t: 'Insuficiencia cardíaca sistólica brusca, acidosis láctica que no cede, rabdomiólisis, fracaso renal y fallo multiorgánico.', mirar: 'pa', cita: AS('mar-pris') },
        { t: 'Quizá por inhibición de la cadena de transporte de electrones mitocondrial. Incidencia del 3 %; mortalidad del 30-35 %.', mirar: 'buzo', cita: AS('mar-pris') },
        { t: 'El tratamiento es de soporte (ECMO en algún caso).', mirar: 'monitor', cita: AS('mar-pris') },
    ],
    delirio: [
        { t: 'La ansiedad, la agitación y el delirio aparecen en hasta el 85 % de los pacientes de UCI. El delirio es un estado confusional agudo.', mirar: 'medallon', cita: AS('mar-ansiedad') },
        { t: 'Muy agitado (RASS +3): se tira o se quita tubos o catéteres.', mirar: 'rass', cita: AS('mar-tabla-6-4'), org: 'RASS +3: ilustrativa' },
        { t: 'La dexmedetomidina es el fármaco de elección para el delirio de la UCI, que sufre un 40 % de los mayores de 65 años.', e: { sedante: 'dexmedetomidina' }, mirar: 'buzo', cita: AS('mar-dexmedetomidina') },
    ],
    haloperidol: [
        { t: 'Si la dexmedetomidina no se tolera por bradicardia o hipotensión, sirve el haloperidol.', mirar: 'fc', cita: AS('mar-haloperidol-intro') },
        { t: 'Antagonista dopaminérgico, el único antipsicótico que se da IV: seda sin depresión respiratoria. Efecto a los 10-20 min; dura 3-4 h.', mirar: 'buzo', cita: AS('mar-haloperidol-intro') },
        { t: '5 mg IV en bolo; si no responde, 10 mg; si responde, el 25 % de la dosis eficaz cada 6 h (el texto dice cada 4-6 h).', mirar: 'rass', cita: AS('mar-tabla-6-8') },
        { t: 'Alarga el QT y puede dar torsade de pointes: se ha descrito en el 3-4 % de los tratados con haloperidol IV, en la mayoría de los casos con QTc >500 ms o más de 35 mg al día. <span class="hl-rojo">No usar si el QTc es >500 ms</span>.', mirar: 'monitor', cita: AS('mar-haloperidol-qtc') },
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
      if (/mar-|Fig\.|Tabla|ficha|p\. \d/.test(f) || !tipos.size) tipos.add('ficha');
      const ids = [...String(f).matchAll(/mar-[a-z0-9-]+(?![a-z0-9#-])/g)].map(m => m[0]).filter(id => PAGINAS[id] != null);   // «ficha#elemento»: cuenta el elemento
      const pags = [...new Set(ids.map(id => String(PAGINAS[id])))].sort((a, b) => parseInt(a) - parseInt(b));
      const extra = [/sin cifra/.test(f) ? 'sin cifra' : '', /hueco/.test(f) ? 'hueco' : ''].filter(Boolean);
      return ['ficha', 'fisiología general', 'ilustrativo'].filter(t => tipos.has(t)).concat(extra).join(' · ') + (pags.length ? ' · p. ' + pags.join(', ') : '');
}

/* ============================================================
     Contenido de estudio. Toda la medicina sale de las fichas (fuente = ficha#elemento, con su página del PDF);
     el paciente de los casos se inventa. Conceptos, Mayéutica y casos, tal cual la maqueta aprobada.
     Pregunta: { id, grupo: 'guia'|'examen', tipo: 'test'|'destapa'|'error', fuente, estado, mirar, ocultar,
     tocar: { segs, botones, ocultar, instruccion, comprobar, pista, bueno, confirma }, despues,
     enunciado, opciones: [{ t, ok, porque }], puntos: [], frases: [{ t, mal, c }], explicacion, nota }
     ============================================================ */
export const CONCEPTOS = [
    { titulo: 'El sedante no quita el dolor',
      texto: '¿El diazepam alivia el dolor? Contestó mal el <span class="hl-rojo">~80 % de los residentes</span> y el ~43 % de las enfermeras (Fig. 6.1): la figura da por mala la respuesta «sí». Y el propofol no tiene efecto analgésico. Los dos <span class="hl">hunden al paciente, pero no calman la tormenta</span> (deducción de la figura, no una cita).',
      hacer: 'muévele en la cama; luego, ponle diazepam; luego, fentanilo.', estado: { estimulo: 'mover' }, mirar: 'medallon',
      acciones: [{ t: 'Moverle en la cama', p: { estimulo: 'mover' } }, { t: '+ Diazepam', p: { estimulo: 'mover', sedante: 'diazepam' } }, { t: '+ Fentanilo', p: { estimulo: 'mover', opioide: 'fentanilo' } }],
      mira: 'con diazepam, el paciente baja a RASS −3 y la cara del medallón sigue con las cejas apretadas: BPS 9. Con fentanilo, el mar se calma.',
      fuente: 'mar-analgesia#mar-fig-6-1 · mar-sedacion#mar-bzd-intro · mar-sedacion#mar-propofol' },
    { titulo: 'El monitor no mide el dolor: mira la cara',
      texto: 'Si puede responder, la escala numérica (>3 inaceptable). Si no, la <span class="hl">BPS</span>: cara, miembros superiores y adaptación al ventilador, de 3 a 12; <span class="hl-rojo">≥6 es dolor inaceptable</span>. La FC y la PA se correlacionan mal con el dolor: <span class="hl-rojo">abandona esa práctica</span>.',
      hacer: 'cambia el estímulo y mira a la vez el monitor y el medallón.', estado: {}, mirar: 'monitor',
      acciones: [{ t: 'En reposo', p: {} }, { t: 'Moverle', p: { estimulo: 'mover' } }, { t: 'Moverle + inflamación', p: { estimulo: 'mover', inflamacion: true } }],
      mira: 'la BPS va de 5 a 11; la FC del monitor, de 81 a 83 (ilustrativo): casi no se mueve.',
      fuente: 'mar-analgesia#mar-escala-numerica · #mar-bps-intro · #mar-constantes-dolor' },
    { titulo: 'El crítico siente más',
      texto: 'El dolor está <span class="hl-rojo">amplificado</span> (hipernocicepción): algo menor se vuelve doloroso. Moverle en la cama es una causa frecuente, y <span class="hl">un 50 % tiene dolor en reposo</span> (lumbar, piernas). Se atribuye a la inflamación sistémica (prostanoides) y a la inmovilidad.',
      hacer: 'deja al paciente en reposo y añade la inflamación.', estado: {}, mirar: 'bps',
      acciones: [{ t: 'Reposo', p: {} }, { t: 'Reposo + inflamación', p: { inflamacion: true } }, { t: 'Moverle + inflamación', p: { estimulo: 'mover', inflamacion: true } }],
      mira: 'en reposo, BPS 5; con la inflamación, 6: el mismo reposo cruza el umbral.',
      fuente: 'mar-analgesia#mar-hipernocicepcion' },
    { titulo: 'La dosis buena es la que responde',
      texto: 'Opioides de la Tabla 6.2: inicio del fentanilo <span class="hl">1-2 min</span>, morfina 5-10, hidromorfona 5-15. El fentanilo es 600 veces más liposoluble y no libera histamina. Dan sedación leve, <span class="hl">sin amnesia</span>. La dosis eficaz la marca <span class="hl">la respuesta del paciente</span>, no la tabla.',
      hacer: 'con el paciente con dolor, prueba cada opioide.', estado: { estimulo: 'mover', inflamacion: true }, mirar: 'aceite',
      acciones: [{ t: 'Fentanilo', p: { estimulo: 'mover', inflamacion: true, opioide: 'fentanilo' } }, { t: 'Morfina', p: { estimulo: 'mover', inflamacion: true, opioide: 'morfina' } }, { t: 'Hidromorfona', p: { estimulo: 'mover', inflamacion: true, opioide: 'hidromorfona' } }],
      mira: 'cuánto tarda en calmarse la tormenta (la velocidad es ilustrativa; el inicio, de la ficha). El paciente baja un poco: RASS −1.',
      fuente: 'mar-analgesia#mar-tabla-6-2 · #mar-opioide-definiciones · #mar-opioide-dosis-individual' },
    { titulo: 'El riñón cambia el opioide',
      texto: 'Con insuficiencia renal: <span class="hl-rojo">morfina −50 %</span> el mantenimiento (la M3G da agitación, mioclonías y convulsiones; la M6G es más analgésica que la morfina); <span class="hl">hidromorfona, sin ajuste</span>; fentanilo, «¿evitar?» en la enfermedad renal terminal (sin metabolitos activos, pero se acumula). La meperidina ya no se usa.',
      hacer: 'pon la insuficiencia renal y cambia de opioide.', estado: { estimulo: 'mover', renal: 'ir' }, mirar: 'aceite',
      acciones: [{ t: 'IR + morfina', p: { estimulo: 'mover', renal: 'ir', opioide: 'morfina' } }, { t: 'IR + hidromorfona', p: { estimulo: 'mover', renal: 'ir', opioide: 'hidromorfona' } }, { t: 'IR + fentanilo', p: { estimulo: 'mover', renal: 'ir', opioide: 'fentanilo' } }],
      mira: 'el rótulo del aceite: «↓50 %», «sin ajuste» o «¿evitar?».',
      fuente: 'mar-analgesia#mar-tabla-6-2 · #mar-morfina · #mar-fentanilo · #mar-hidromorfona' },
    { titulo: 'Ahorrar opioide',
      texto: 'Paracetamol 1 g IV/6 h (≤4 g/día). Ketorolaco 30 mg/6 h, <span class="hl">15 mg</span> con IR, ≥65 años o <50 kg: <span class="hl">reduce el opioide un 25-50 %</span>. Ketamina 60-120 µg/kg/h (la tabla imprime µg/h: errata); <span class="hl-rojo">en general, no en la isquemia miocárdica</span>.',
      hacer: 'añade los ahorradores al fentanilo.', estado: { estimulo: 'mover', inflamacion: true, opioide: 'fentanilo' }, mirar: 'aceite',
      acciones: [{ t: '+ Ketorolaco', p: { estimulo: 'mover', inflamacion: true, opioide: 'fentanilo', ahorro: ['ketorolaco'] } }, { t: '+ Paracetamol', p: { estimulo: 'mover', inflamacion: true, opioide: 'fentanilo', ahorro: ['ketorolaco', 'paracetamol'] } }],
      mira: 'el frasco de aceite se hace más pequeño con el ketorolaco: menos opioide para la misma calma.',
      fuente: 'mar-analgesia#mar-tabla-6-3 · #mar-ketamina-errata · #mar-ketamina' },
    { titulo: 'La RASS es el profundímetro',
      texto: 'De +4 (combativo) a −5 (no despertable). El óptimo es 0; en perfusión se titula a <span class="hl">−1 a −2</span>. Tres pasos: <span class="hl">observar</span>; si no está alerta, <span class="hl">la voz</span> (−1 a −3); si no responde, <span class="hl">el estímulo físico</span> (−4, −5).',
      hacer: 'llámale en sedación ligera; ponle en profunda y vuelve a llamarle; después, sacúdele el hombro.', estado: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol' }, mirar: 'regla',
      acciones: [{ t: 'Llamarle', accion: 'llamar' }, { t: 'Profunda', p: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda' } }, { t: 'Sacudirle el hombro', accion: 'sacudir' }],
      mira: 'a −2 se despierta un momento (<10 s) y te mira; a −4 no responde a la voz y solo se mueve con el estímulo físico.',
      fuente: 'mar-sedacion#mar-tabla-6-4 · #mar-rass-pasos · #mar-escalas-sedacion' },
    { titulo: 'Lo que más alarga el despertar es la profundidad',
      texto: 'Tabla 6.7, propofol: a las 24 h, <span class="hl">13 min</span> en ligera frente a <span class="hl-rojo">25 h</span> en profunda; a los 14 días, 3,4 h frente a 74 h. Mantener una <span class="hl">sedación ligera</span> con propofol si es posible.',
      hacer: 'elige la duración y suéltales el lastre a los dos.', estado: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', par: true }, mirar: 'relojes',
      acciones: [{ t: '24 h', p: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', par: true, horas: 24 }, subir: true }, { t: '72 h', p: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', par: true, horas: 72 }, subir: true }, { t: '14 días', p: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', par: true, horas: 336 }, subir: true }],
      mira: 'los relojes: el ligero llega enseguida; el profundo, días después. La subida va en escala logarítmica (ilustrativo).',
      fuente: 'mar-sedacion#mar-tabla-6-7' },
    { titulo: 'Las benzodiacepinas pesan',
      texto: 'Midazolam: muy liposoluble, <span class="hl-rojo">se acumula</span>: perfusión ≤48 h (y P450, metabolito activo renal). Lorazepam: acumula menos, pero su <span class="hl-rojo">propilenglicol</span> da acidosis láctica con >0,1 mg/kg/h o >10 mg/h más de 48 h; vigila el hiato osmolar (>10). En un estudio, 30 h frente a 4-5 h para despertar; pero las guías: <span class="hl">evitar las BZD</span> en el ventilado. De elección en la abstinencia de alcohol y opioides.',
      hacer: 'deja el midazolam 72 h; luego, el lorazepam a dosis alta; luego, despiértalos.', estado: { opioide: 'fentanilo', sedante: 'midazolam', horas: 24 }, mirar: 'buzo',
      acciones: [{ t: 'Midazolam 72 h', p: { opioide: 'fentanilo', sedante: 'midazolam', horas: 72 } }, { t: 'Lorazepam alto, 72 h', p: { opioide: 'fentanilo', sedante: 'lorazepam', horas: 72, dosisAlta: true } }, { t: 'Midazolam frente a lorazepam', p: { opioide: 'fentanilo', sedante: 'midazolam', par: true }, subir: true }],
      mira: 'la esponja crece y el paciente baja a −3; el barril gotea lactato (trípodes) y H⁺ (cruces).',
      fuente: 'mar-sedacion#mar-midazolam · #mar-lorazepam · #mar-bzd-proscontras · #mar-bzd-prevencion' },
    { titulo: 'La boya: dexmedetomidina',
      texto: 'Agonista α2: <span class="hl">sedación cooperativa</span>; se despierta sin bajar la perfusión y vuelve sola a su sitio. Sin depresión respiratoria; ahorra opioide; <span class="hl">menos delirio</span>, y es la de elección para tratarlo. Pegas: <span class="hl-rojo">baja la FC y la PA</span> (simpaticolítica) y retirada en el 30 %.',
      hacer: 'cámbiala por el propofol y llámale.', estado: { opioide: 'fentanilo', sedante: 'dexmedetomidina' }, mirar: 'buzo',
      acciones: [{ t: 'Llamarle', accion: 'llamar' }, { t: 'Con delirio', p: { opioide: 'fentanilo', sedante: 'dexmedetomidina', delirio: true } }],
      mira: 'sube a la superficie, abre los ojos y vuelve solo. El monitor: FC y PA con flecha hacia abajo (sin cifra).',
      fuente: 'mar-sedacion#mar-dexmedetomidina · #mar-tabla-6-6' },
    { titulo: 'El síndrome de infusión del propofol',
      texto: 'Con <span class="hl-rojo">>80 µg/kg/min o >5 mg/kg/h más de 48 h</span> (descrito incluso con 36 µg/kg/min): IC sistólica brusca, acidosis láctica que no cede, rabdomiólisis, fracaso renal. Quizá por bloqueo de la cadena de transporte de electrones. <span class="hl">3 %</span>; mortalidad <span class="hl-rojo">30-35 %</span>.',
      hacer: 'dosis alta a las 24 h; luego, a las 72 h.', estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', dosisAlta: true, horas: 24 }, mirar: 'buzo',
      acciones: [{ t: 'Dosis alta, 24 h', p: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', dosisAlta: true, horas: 24 } }, { t: 'Dosis alta, 72 h', p: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', dosisAlta: true, horas: 72 } }],
      mira: 'a las 24 h no pasa nada; a las 72 h el paciente suelta lactato. En el capilar vivo, el caso del shock séptico lo enseña en la mitocondria.',
      fuente: 'mar-sedacion#mar-pris' },
    { titulo: 'Delirio: dexmedetomidina; si no la tolera, haloperidol',
      texto: 'Haloperidol 5 mg IV (efecto en 10-20 min, dura 3-4 h); si no responde, <span class="hl">10 mg</span>; si responde, el 25 % de la dosis eficaz cada 6 h (el texto: 4-6 h). <span class="hl-rojo">QTc >500 ms: no</span> (torsade en el 3-4 %, sobre todo con QTc >500 o >35 mg/día). Ojo al síndrome neuroléptico maligno.',
      hacer: 'pon el delirio; la bradicardia; el haloperidol; y el QTc largo.', estado: { opioide: 'fentanilo', delirio: true }, mirar: 'buzo',
      acciones: [{ t: '+ Bradicardia', p: { opioide: 'fentanilo', delirio: true, bradi: true } }, { t: '+ Haloperidol', p: { opioide: 'fentanilo', delirio: true, bradi: true, halo: true } }, { t: '+ QTc >500', p: { opioide: 'fentanilo', delirio: true, bradi: true, halo: true, qtcLargo: true } }],
      mira: 'con haloperidol baja a −1; con QTc >500, el rótulo lo prohíbe y sigue agitado.',
      fuente: 'mar-sedacion#mar-haloperidol-intro · #mar-tabla-6-8 · #mar-haloperidol-qtc' }
];

export const PREGUNTAS = [
    // ---- Guía socrática · ficha XII (analgesia), en el orden del texto ----
    { id: 'in-g1', grupo: 'guia', corto: 'diazepam', tipo: 'test', fuente: 'mar-analgesia#mar-fig-6-1 · mar-sedacion#mar-bzd-intro',
      estado: { estimulo: 'mover' }, mirar: 'medallon',
      tocar: { ocultar: ['bps'], instruccion: 'ponle diazepam y mira la cara y la BPS.', botones: [{ t: 'Poner diazepam', p: { sedante: 'diazepam' } }], comprobar: e => e.sedante === 'diazepam', pista: 'Pulsa «Poner diazepam».', bueno: { sedante: 'diazepam' }, confirma: 'baja a RASS −3 y la BPS sigue en 9: la tormenta no se ha movido.' },
      enunciado: 'Se agita cada vez que le movéis en la cama. El R1 propone diazepam «para que esté tranquilo y no sufra». Antes de tocar nada: ¿qué le pasará a su dolor?',
      opciones: [
        { t: 'Se calmará: el diazepam alivia el dolor y, de paso, la agitación', ok: false, porque: 'Es la respuesta del ~80 % de los residentes (Fig. 6.1). Quedaría quieto y con la misma BPS: dolor sin tratar, y ahora sin poder quejarse.' },
        { t: 'Seguirá igual: le hunde, pero no le quita el dolor', ok: true },
        { t: 'Empeorará: las benzodiacepinas aumentan el dolor', ok: false, porque: 'La ficha no dice que aumenten el dolor: la Fig. 6.1 da por mala la respuesta «sí, lo alivia». Con esa idea seguirías sin dar analgesia por un motivo falso.' }],
      explicacion: 'Fig. 6.1: contestó mal el <span class="hl-rojo">~80 % de los residentes</span> y el ~43 % de las enfermeras. Sedar no es tratar el dolor; y el diazepam, además, se evita (vida media de 90 h, metabolitos activos).' },
    { id: 'in-g2', grupo: 'guia', corto: 'la FC', tipo: 'test', fuente: 'mar-analgesia#mar-constantes-dolor',
      estado: {}, mirar: 'monitor',
      tocar: { ocultar: ['bps', 'fc'], instruccion: 'muévele en la cama y compara el monitor con la BPS.', segs: ['estimulo'], comprobar: e => e.estimulo === 'mover', pista: 'Elige «Moverle en la cama».', bueno: { estimulo: 'mover' }, confirma: 'la BPS sube de 5 a 9; la FC, de 81 a 82 (ilustrativo).' },
      enunciado: 'Está intubado y no puede hablar. ¿Te sirve su FC para saber si le duele?',
      opciones: [
        { t: 'Sí: si el dolor fuera intenso, la FC subiría de forma clara', ok: false, porque: 'La correlación es mala: con una FC normal dejarías sin analgesia a un paciente con BPS 9.' },
        { t: 'Solo la PA: la FC la mueven demasiadas cosas', ok: false, porque: 'La PA tampoco: Marino pide abandonar esa práctica con las constantes. Una PA normal te tranquilizaría con el paciente sufriendo.' },
        { t: 'No: se correlaciona mal; abandona esa práctica', ok: true }],
      explicacion: 'La correlación entre la intensidad del dolor y los cambios de FC o PA es <span class="hl-rojo">mala</span>. Se mira la conducta: la BPS.' },
    { id: 'in-g3', grupo: 'guia', corto: 'BPS', tipo: 'destapa', fuente: 'mar-analgesia#mar-escala-numerica · #mar-bps-intro · #mar-bps-calc',
      estado: { estimulo: 'mover', sedante: 'diazepam' }, mirar: 'medallon', ocultar: ['bps'],
      enunciado: 'Bajo el agua no puede usar la escala numérica. ¿Cómo sabes si le duele y a partir de qué punto actúas? Son tres cosas.',
      puntos: ['Si puede responder, la autoevaluación es lo más exacto: la escala numérica, y <span class="hl-rojo">más de 3</span> es inaceptable.',
        'Si no puede, la <span class="hl">BPS</span>: expresión facial, miembros superiores y adaptación al ventilador, de 1 a 4 cada una (total de 3 a 12).',
        '<span class="hl-rojo">BPS ≥6</span> = dolor inaceptable: se trata con analgesia.'],
      explicacion: 'En el medallón: cejas totalmente tensas (3), brazos totalmente flexionados (3) y lucha con el ventilador (3): BPS 9.' },
    { id: 'in-g4', grupo: 'guia', corto: 'hipernocicepción', tipo: 'test', fuente: 'mar-analgesia#mar-hipernocicepcion',
      estado: {}, mirar: 'bps',
      tocar: { ocultar: ['bps'], instruccion: 'pon la inflamación sistémica sin moverle.', botones: [{ t: 'Inflamación sistémica', p: { inflamacion: true } }], comprobar: e => e.inflamacion, pista: 'Pulsa «Inflamación sistémica».', bueno: { inflamacion: true }, confirma: 'en reposo, la BPS pasa de 5 a 6: cruza el umbral sin que nadie le toque.' },
      enunciado: 'En reposo, su BPS es 5. Esta noche hace una sepsis, con inflamación sistémica. Sin tocarle, ¿qué esperas?',
      opciones: [
        { t: 'Nada: sin un estímulo nocivo no hay dolor', ok: false, porque: 'Un 50 % de los críticos tiene dolor en reposo, sobre todo lumbar y en las piernas. Lo dejarías sin analgesia.' },
        { t: 'Más dolor: la inflamación lo amplifica', ok: true },
        { t: 'Menos dolor: la sepsis embota la conciencia y lo nota menos', ok: false, porque: 'Es al revés: el dolor está amplificado en el crítico. No reconocerlo es causa de mal control del dolor.' }],
      explicacion: '<span class="hl-rojo">Hipernocicepción</span>: algo menor se vuelve doloroso. Se atribuye a la inflamación sistémica (prostanoides) y a la inmovilidad.' },
    { id: 'in-g5', grupo: 'guia', corto: 'dosis', tipo: 'test', fuente: 'mar-analgesia#mar-opioide-dosis-individual · #mar-tabla-6-2 · #mar-opioide-respiratorio',
      estado: { estimulo: 'mover', inflamacion: true }, despues: { estimulo: 'mover', inflamacion: true, opioide: 'fentanilo' }, mirar: 'aceite',
      enunciado: 'Empiezas fentanilo en perfusión. ¿Cuál es la dosis buena?',
      opciones: [
        { t: 'La de la Tabla 6.2: 0,7-10 µg/kg/h, sin pasar del techo', ok: false, porque: 'El rango orienta, pero las necesidades varían mucho: si te paras en la tabla con BPS 8, sigue con dolor.' },
        { t: 'La mínima, por miedo a la depresión respiratoria', ok: false, porque: 'La depresión respiratoria es rara a dosis habituales, y está ventilado: la dosis mínima le deja con dolor.' },
        { t: 'La que le calma: la marca su respuesta', ok: true }],
      explicacion: 'La dosis eficaz de un opioide la marca <span class="hl">la respuesta del paciente</span>, no la dosis recomendada. Míralo: la tormenta se calma en 1-2 min.' },
    // ---- Examen, nivel MIR · ficha XII ----
    { id: 'in-e1', grupo: 'examen', corto: 'morfina y asma', tipo: 'test', fuente: 'mar-analgesia#mar-morfina · #mar-tabla-6-2',
      estado: { estimulo: 'mover' },
      enunciado: 'Asmático intubado por una crisis grave, con dolor. Un compañero: «morfina no, que libera histamina y le cerrará los bronquios». ¿Qué le dices?',
      opciones: [
        { t: 'Tiene razón: está contraindicada en el asmático', ok: false, porque: 'No da broncoespasmo: se han dado 1,5 mg/kg a asmáticos sin problemas. Le negarías una analgesia válida por un mito.' },
        { t: 'No libera histamina: eso le pasa al fentanilo', ok: false, porque: 'Es al revés: la morfina libera histamina y el fentanilo no. Elegirías el fármaco por la razón equivocada.' },
        { t: 'Libera histamina, pero no da broncoespasmo; su riesgo es la hipotensión', ok: true }],
      explicacion: 'La histamina de la morfina da vasodilatación e <span class="hl-rojo">hipotensión</span>, sobre todo en estados hiperadrenérgicos; <span class="hl">no broncoespasmo</span>.' },
    { id: 'in-e2', grupo: 'examen', corto: 'ketorolaco', tipo: 'test', fuente: 'mar-analgesia#mar-tabla-6-3 · #mar-analgesico-calc',
      estado: { estimulo: 'mover', opioide: 'fentanilo' }, despues: { estimulo: 'mover', opioide: 'fentanilo', ahorro: ['ketorolaco'] }, mirar: 'aceite',
      enunciado: 'Varón de 70 años y 80 kg, posoperatorio, con fentanilo; su función renal es normal. Quieres ahorrar opioide con ketorolaco. ¿Qué pautas?',
      opciones: [
        { t: '30 mg IV cada 6 h: pesa más de 50 kg y su riñón está bien', ok: false, porque: 'Tiene 70 años: la edad ≥65 por sí sola pide 15 mg. Con 30 mg le doblas la dosis.' },
        { t: '15 mg IV cada 6 h', ok: true },
        { t: '15 mg IM cada 6 h, para no gastar otra vía', ok: false, porque: 'La dosis es la buena, pero la vía IM produce hematomas: mejor IV.' },
        { t: 'Nada de AINE: las complicaciones renales y gástricas son la norma', ok: false, porque: 'Son raras en tratamientos cortos a la dosis recomendada; perderías el ahorro del 25-50 % de opioide.' }],
      explicacion: 'Ketorolaco 30 mg/6 h; <span class="hl">15 mg/6 h</span> con insuficiencia renal, edad ≥65 o peso <50 kg. Junto a un opioide, lo reduce un 25-50 %.' },
    { id: 'in-e3', grupo: 'examen', corto: 'ketamina', tipo: 'test', fuente: 'mar-analgesia#mar-ketamina · #mar-ketamina-errata',
      estado: { estimulo: 'mover', inflamacion: true, opioide: 'fentanilo' },
      enunciado: 'Shock séptico con noradrenalina y dolor mal controlado con fentanilo. Tuvo un infarto hace 2 días. ¿Añades ketamina a 60-120 µg/kg/h?',
      opciones: [
        { t: 'Sí: sube la PA y la FC, útil en el shock', ok: false, porque: 'Ese efecto es justo el problema: en general no se aconseja en la isquemia miocárdica, y un infarto reciente lo es.' },
        { t: 'No: en general, no se aconseja en la isquemia', ok: true },
        { t: 'Sí, pero a 60-120 µg/h, que es lo que pone la tabla', ok: false, porque: 'Es una errata de la Tabla 6.3: el texto da 60-120 µg/<b>kg</b>/h. Y, en general, no en la isquemia.' }],
      explicacion: 'La ketamina sube la PA y la FC (útil en el shock) y broncodilata, pero <span class="hl-rojo">en general no se aconseja en la isquemia miocárdica</span>. La dosis buena es la del texto: µg/<b>kg</b>/h.' },
    // ---- Guía socrática · ficha XIII (sedación) ----
    { id: 'in-g6', grupo: 'guia', corto: 'la subida', tipo: 'test', fuente: 'mar-sedacion#mar-tabla-6-7',
      estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 24, par: true }, mirar: 'relojes',
      tocar: { ocultar: ['reloj'], instruccion: 'suéltales el lastre a los dos y mira los relojes.', botones: [{ t: 'Despertar: soltar el lastre', accion: 'despertar' }], comprobar: e => e.subido, pista: 'Pulsa «Despertar: soltar el lastre».', bueno: { subido: true }, confirma: 'a las 24 h, 13 min la ligera y 25 h la profunda.' },
      enunciado: 'Dos pacientes llevan 24 h con propofol: uno en sedación ligera y otro en profunda. Paras las dos perfusiones. ¿Cuánto tardan en despertar?',
      opciones: [
        { t: 'El ligero, 13 min; el profundo, 25 h', ok: true },
        { t: 'Los dos, unos 10-15 min: el propofol es de despertar rápido', ok: false, porque: 'Eso es la Tabla 6.6, «según la profundidad y la duración». Esperarías al profundo a los 15 min y le probarías el destete dormido.' },
        { t: 'El ligero, 13 min; el profundo, unas 3 h', ok: false, porque: 'Más de 3 h es lo del ligero tras 7 días. El profundo tarda 25 h: un día entero de destete retrasado.' }],
      explicacion: 'Tabla 6.7: <span class="hl">13 min</span> frente a <span class="hl-rojo">25 h</span> con solo un día de perfusión.' },
    { id: 'in-g7', grupo: 'guia', corto: 'qué pesa más', tipo: 'destapa', fuente: 'mar-sedacion#mar-tabla-6-7',
      estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 336, par: true }, mirar: 'relojes',
      enunciado: 'Mira la Tabla 6.7 viva (bajo la escena). ¿Qué pesa más en el despertar: cuánto tiempo o cuán hondo? Son dos cosas.',
      puntos: ['<span class="hl">La profundidad</span>: a las 24 h, 13 min en ligera frente a 25 h en profunda.',
        'El tiempo también alarga, pero menos: la ligera pasa de 13 min (24 h) a 3,4 h (14 días); la profunda, de 25 h a 74 h.'],
      explicacion: 'De ahí la regla de la ficha: <span class="hl">mantener una sedación ligera</span> con propofol si es posible.' },
    { id: 'in-g8', grupo: 'guia', corto: 'RASS objetivo', tipo: 'test', fuente: 'mar-sedacion#mar-escalas-sedacion · #mar-tabla-6-4',
      estado: { estimulo: 'mover', opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda' }, mirar: 'regla',
      tocar: { instruccion: 'pon la profundidad que has elegido y mira la franja dorada.', segs: ['prof'], comprobar: e => e.prof === 'ligera', pista: 'Elige «Ligera (−1/−2)».', bueno: { prof: 'ligera' }, confirma: 'el paciente queda en la franja dorada, RASS −2.' },
      enunciado: 'Va con fentanilo y propofol. ¿A qué RASS titulas la perfusión?',
      opciones: [
        { t: '−1 a −2: sedación ligera; el óptimo es 0', ok: true },
        { t: '−3, sedación moderada: así no se tirará del tubo', ok: false, porque: 'A −3 ya no tiene contacto visual a la voz. Más hondo es más tiempo para despertar (Tabla 6.7): retrasas el destete.' },
        { t: '−4 a −5 mientras siga intubado', ok: false, porque: 'Es sedación profunda: tras 72 h de propofol tardaría 59 h en despertar (Tabla 6.7).' }],
      explicacion: 'La RASS sirve de objetivo de la perfusión: <span class="hl">−1 a −2</span>. El óptimo es 0 (alerta y tranquilo).' },
    { id: 'in-g9', grupo: 'guia', corto: 'midazolam', tipo: 'test', fuente: 'mar-sedacion#mar-midazolam · #mar-lorazepam · #mar-bzd-intro',
      estado: { opioide: 'fentanilo', sedante: 'midazolam', horas: 24 }, despues: { opioide: 'fentanilo', sedante: 'midazolam', horas: 72 }, mirar: 'buzo',
      enunciado: 'Midazolam en perfusión desde hace 3 días. ¿Por qué tarda tanto en irse?',
      opciones: [
        { t: 'Su vida media es de 90 h', ok: false, porque: 'Eso es el diazepam, que por eso se evita. El midazolam es corto; si lo crees seguro, lo dejarías días y se acumularía.' },
        { t: 'Por el propilenglicol que lleva como disolvente', ok: false, porque: 'Eso es del lorazepam. Buscarías un hiato osmolar y se te pasaría la acumulación: sigue dormido días.' },
        { t: 'Es muy liposoluble: se acumula en el SNC', ok: true }],
      explicacion: 'Por eso se recomienda <span class="hl">limitar la perfusión a ≤48 h</span>. Además: P450 (diltiazem o eritromicina lo potencian) y un metabolito activo que elimina el riñón. Mira la esponja a las 72 h.' },
    { id: 'in-g10', grupo: 'guia', corto: 'cooperativa', tipo: 'test', fuente: 'mar-sedacion#mar-dexmedetomidina',
      estado: { opioide: 'fentanilo', sedante: 'propofol' }, mirar: 'buzo',
      tocar: { instruccion: 'cámbiale el sedante y llámale por su nombre.', botones: [{ t: 'Cambiar a dexmedetomidina', p: { sedante: 'dexmedetomidina' } }, { t: 'Llamarle por su nombre', accion: 'llamar' }], comprobar: e => e.sedante === 'dexmedetomidina' && e.llamado, pista: 'Cambia a dexmedetomidina y después llámale.', bueno: { sedante: 'dexmedetomidina', llamado: true }, confirma: 'con la boya, sube, te mira y vuelve solo a su sitio.' },
      enunciado: 'Un ictus que necesita sedación: quieres valorar su estado mental cada pocas horas sin parar la perfusión. ¿Qué sedante?',
      opciones: [
        { t: 'Propofol: despierta en 10-15 min al pararlo', ok: false, porque: 'Tendrías que pararlo cada vez, y tras días o en sedación profunda tarda horas (Tabla 6.7).' },
        { t: 'Midazolam en bolos: es corto', ok: false, porque: 'Acumula, da más delirio y las guías piden evitar las BZD en el ventilado; tampoco despierta sin retirarlo.' },
        { t: 'Dexmedetomidina: sedación cooperativa', ok: true }],
      explicacion: 'La dexmedetomidina deja que se despierte <span class="hl">sin bajar la perfusión</span> y vuelve sola a su sedación: útil en el destete y para valorar el estado mental (ictus, TCE).' },
    // ---- Examen, nivel MIR · ficha XIII ----
    { id: 'in-e4', grupo: 'examen', corto: 'lorazepam', tipo: 'test', fuente: 'mar-sedacion#mar-bzd-proscontras · #mar-bzd-prevencion · #mar-tabla-6-5',
      estado: { opioide: 'fentanilo', sedante: 'lorazepam', par: true }, mirar: 'relojes',
      enunciado: 'Ventilado para varios días. El R2, con la ficha en la mano: «el lorazepam es la benzodiacepina de elección en perfusión prolongada: 4-5 h para despertar frente a 30 h del midazolam». ¿Qué le contestas?',
      opciones: [
        { t: 'El capítulo lo dice, a partir de un estudio; pero las guías recientes piden evitar las BZD', ok: true },
        { t: 'Falso: el lorazepam se acumula más que el midazolam, porque es más liposoluble', ok: false, porque: 'Al revés: el midazolam es más liposoluble (+++ frente a ++) y tiene metabolito activo. El riesgo del lorazepam es el propilenglicol.' },
        { t: 'Correcto: lo dice el capítulo, y con eso basta', ok: false, porque: 'El mismo capítulo recoge que las guías piden evitar las BZD en el ventilado: le expondrías a acumulación, delirio y propilenglicol.' }],
      explicacion: 'Las dos frases son de Marino: <span class="hl">un estudio</span> (30 h frente a 4-5 h) y, después, <span class="hl-rojo">evitar las BZD</span> en la sedación prolongada del ventilado. Hay que leer las dos.' },
    { id: 'in-e5', grupo: 'examen', corto: 'SIP', tipo: 'error', fuente: 'mar-sedacion#mar-pris · #mar-propofol',
      estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', dosisAlta: true, horas: 72 }, mirar: 'buzo',
      enunciado: 'Nota de evolución, día 3: propofol a 6 mg/kg/h (peso ideal) desde hace 60 h.',
      frases: [
        { t: 'Lleva más de 5 mg/kg/h durante más de 48 h: está en la dosis de riesgo.', mal: false },
        { t: 'Lactato que no cede, rabdomiólisis y una insuficiencia cardíaca sistólica brusca: encaja con un síndrome de infusión de propofol.', mal: false },
        { t: 'Solo aparece por encima de 80 µg/kg/min: con dosis menores se descarta.', mal: true, c: 'Se ha descrito con <span class="hl-rojo">36 µg/kg/min</span>: una dosis moderada no lo descarta.' },
        { t: 'El tratamiento es el ECMO, en todos los casos.', mal: true, c: 'El manejo es de <span class="hl">soporte general</span>; el ECMO se ha usado solo en <span class="hl-rojo">unos pocos casos</span>.' },
        { t: 'Incidencia descrita del 3 % y mortalidad del 30-35 %.', mal: false }],
      explicacion: '6 mg/kg/h son 100 µg/kg/min: por encima de los dos umbrales (&gt;80 µg/kg/min o &gt;5 mg/kg/h, más de 48 h).' },
    { id: 'in-e6', grupo: 'examen', corto: 'haloperidol', tipo: 'error', fuente: 'mar-sedacion#mar-tabla-6-8 · #mar-haloperidol-qtc · #mar-haloperidol-intro',
      estado: { opioide: 'fentanilo', delirio: true, bradi: true, halo: true }, mirar: 'buzo',
      enunciado: 'Plan del R1 para un delirio que no es por abstinencia, en un paciente que no tolera la dexmedetomidina por bradicardia.',
      frases: [
        { t: 'Haloperidol 5 mg IV en bolo.', mal: false },
        { t: 'Si está muy agitado, añado midazolam 1-2 mg para que actúe antes.', mal: false },
        { t: 'Si a los 15-20 min no responde, 10 mg IV.', mal: false },
        { t: 'Si responde, mantengo con el 50 % de la dosis eficaz cada 4-6 h.', mal: true, c: 'El mantenimiento es el <span class="hl">25 %</span> de la dosis eficaz, cada 6 h (el texto: cada 4-6 h).' },
        { t: 'Su QTc es de 520 ms: lo vigilo, pero no lo contraindica.', mal: true, c: '<span class="hl-rojo">QTc &gt;500 ms: no se usa</span> el haloperidol IV (torsade de pointes en el 3-4 %).' }],
      explicacion: 'Tabla 6.8 y texto no coinciden en tres cifras (midazolam 1 o 1-2 mg; esperar 15 o 20 min; cada 6 o 4-6 h): las dos valen.',
      nota: 'Fidelidad: la Tabla 6.8 dice midazolam 1 mg, 15 min y cada 6 h; el texto, 1-2 mg, 20 min y cada 4-6 h.' }
];

export const E4_BASE = { estimulo: 'mover', renal: 'ir' };
export const CASOS = [
    { id: 'E4', titulo: 'El intubado que lucha', corto: 'El intubado que lucha', sub: 'neumonía, IR, delirio el día 4',
      paciente: { Edad: '62 años, varón', Motivo: 'Neumonía; intubado', Riñón: 'ClCr 25 mL/min' },
      volver: { nombre: 'La escala BPS', ancla: 'mar-bps-intro', estado: { estimulo: 'mover', renal: 'ir', opioide: 'fentanilo', sedante: 'propofol', prof: 'ligera' } },
      extra: { texto: '📖 Y en la ficha de sedación: la RASS y el delirio', ir: { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: 'mar-sedacion' } },
      lleva: ['Primero el dolor: BPS ≥6 es inaceptable, y la FC no lo mide. El diazepam no alivia el dolor.',
        'En la IR: fentanilo, o morfina con el mantenimiento al 50 %; la hidromorfona no se ajusta.',
        'Sedación ligera (RASS −1/−2). Delirio: dexmedetomidina; si no la tolera, haloperidol 5 mg con QTc ≤500.'],
      pasos: [
        { momento: 'Ingreso · 22:00', datos: { Conducta: 'cejas totalmente tensas; brazos totalmente flexionados; lucha con el ventilador', RASS: '+2 (asincronía)', FC: '82 lpm', PA: '125/70 mmHg' }, nuevo: ['Conducta', 'RASS', 'FC', 'PA'],
          estado: E4_BASE, mirar: 'medallon', calculadora: { nombre: 'BPS', ir: 'mar-bps-calc' },
          pregunta: { id: 'e4-1', tipo: 'test', fuente: 'mar-analgesia#mar-bps-intro · #mar-constantes-dolor', ocultar: ['bps'],
            enunciado: 'La enfermera: «la FC está bien, es que se pelea con el tubo». Puntúa la BPS con lo que ves. ¿Le duele?',
            opciones: [
              { t: 'Probablemente no: la FC de 82 es normal', ok: false, porque: 'La FC se correlaciona mal con el dolor. Le dejarías sin analgesia con un dolor inaceptable.' },
              { t: 'No se puede saber sin que lo diga', ok: false, porque: 'Para eso está la BPS. Sin poder autoevaluarse, 9 de 12 es dolor inaceptable.' },
              { t: 'Sí: BPS 9 (3 + 3 + 3), y ≥6 es inaceptable', ok: true }],
            explicacion: 'Cara totalmente tensa (3), miembros totalmente flexionados (3), lucha con el ventilador (3): <span class="hl-rojo">BPS 9</span>.' } },
        { momento: '22:05', datos: {}, nuevo: [], estado: E4_BASE, mirar: 'medallon',
          pregunta: { id: 'e4-2', tipo: 'test', fuente: 'mar-analgesia#mar-fig-6-1 · mar-sedacion#mar-propofol · #mar-bzd-intro',
            enunciado: 'El R1 de guardia: «diazepam, que está agitado». ¿Qué haces primero?',
            opciones: [
              { t: 'Diazepam: con la agitación controlada, el dolor ya se valorará', ok: false, porque: 'El diazepam no alivia el dolor (lo que enseña la Fig. 6.1): quedaría hundido con la misma tormenta. Y se evita: vida media de 90 h.' },
              { t: 'Primero analgesia (opioide); sedar, después y si hace falta', ok: true },
              { t: 'Propofol: seda rápido y deja despertar pronto', ok: false, porque: 'El propofol no tiene efecto analgésico: misma tormenta, bajo el agua.' }],
            explicacion: 'Su agitación (RASS +2) sale del dolor (BPS 9). <span class="hl">Analgesia primero</span>.' } },
        { momento: '22:10', datos: {}, nuevo: [], estado: E4_BASE, mirar: 'aceite',
          pregunta: { id: 'e4-3', tipo: 'test', fuente: 'mar-analgesia#mar-tabla-6-2 · #mar-morfina · #mar-fentanilo · #mar-hidromorfona',
            despues: { ...E4_BASE, opioide: 'fentanilo' },
            enunciado: 'Con su ClCr de 25 mL/min, ¿qué opioide y cómo?',
            opciones: [
              { t: 'Morfina a dosis plenas: es la clásica', ok: false, porque: 'Sus metabolitos se acumulan en la IR: la M3G da agitación con mioclonías y convulsiones. Hay que bajar el mantenimiento un 50 %.' },
              { t: 'Fentanilo; o morfina con el mantenimiento al 50 %', ok: true },
              { t: 'Hidromorfona al 50 %, como la morfina', ok: false, porque: 'La Tabla 6.2 no pide ajustar la hidromorfona en la IR: darle la mitad la dejaría infradosificada y con dolor.' }],
            explicacion: 'Fentanilo: sin metabolitos activos ni histamina, inicio en 1-2 min. Míralo calmar la tormenta.',
            nota: 'La ficha deja dudas: el fentanilo se acumula en la IR, y algunos aconsejan evitarlo en la enfermedad renal terminal («¿evitar?», Tabla 6.2); y la hidromorfona, sin ajuste en la IR según la misma tabla, sería otra opción posible. La pregunta solo descarta las dosis plenas de morfina y bajar la hidromorfona. Se enseña tal cual.' } },
        { momento: 'Día 2', datos: { Analgesia: 'fentanilo en perfusión', Conducta: 'cara relajada; tolera el ventilador', RASS: '+1 (ansioso, se desadapta)' }, nuevo: ['Analgesia', 'Conducta', 'RASS'],
          estado: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', fijo: { rass: 1 } }, mirar: 'regla', calculadora: { nombre: 'Propofol: dosis y riesgo', ir: 'mar-propofol-calc' },
          pregunta: { id: 'e4-4', tipo: 'destapa', fuente: 'mar-sedacion#mar-propofol · #mar-escalas-sedacion · #mar-tabla-6-6',
            despues: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', sedante: 'propofol', prof: 'ligera' },
            enunciado: 'Ya no le duele, pero necesita sedación para el ventilador. Vas a usar propofol. ¿Cómo lo pautas y por qué? Son cuatro cosas.',
            puntos: ['Sigue el fentanilo: el propofol <span class="hl-rojo">no tiene efecto analgésico</span>.',
              'Dosis por <span class="hl">peso ideal</span>; sin ajuste renal ni hepático (bien con su ClCr de 25).',
              '<span class="hl-rojo">Sin carga</span> si hay inestabilidad hemodinámica (vasodilatación).',
              'Titulado a <span class="hl">RASS −1 a −2</span>, no más hondo.'],
            explicacion: 'Mantenimiento de 5-50 µg/kg/min (Tabla 6.6); 1 kcal/mL, que cuenta en las calorías del día.' } },
        { momento: 'Día 4 · 08:00', datos: { RASS: '+3 (se tira del tubo)', Delirio: 'sí, no por abstinencia', Sedación: 'propofol, ligera' }, nuevo: ['RASS', 'Delirio', 'Sedación'],
          estado: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', sedante: 'propofol', prof: 'ligera', horas: 72, delirio: true }, mirar: 'buzo',
          pregunta: { id: 'e4-5', tipo: 'test', fuente: 'mar-sedacion#mar-dexmedetomidina · #mar-bzd-proscontras · #mar-tabla-6-7',
            despues: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', sedante: 'dexmedetomidina', delirio: true },
            enunciado: 'Delirio hiperactivo: se tira del tubo. ¿Qué haces con la sedación?',
            opciones: [
              { t: 'Subir el propofol hasta RASS −4', ok: false, porque: 'Más hondo: 59 h para despertar a las 72 h (Tabla 6.7). Y a dosis altas más de 48 h, riesgo de SIP.' },
              { t: 'Midazolam en perfusión: seda rápido', ok: false, porque: 'Las BZD se asocian a más delirio (quizá por el GABA), y las guías piden evitarlas en el ventilado.' },
              { t: 'Pasar a dexmedetomidina', ok: true }],
            explicacion: 'La dexmedetomidina es <span class="hl">la de elección para el delirio de la UCI</span> y da menos delirio que las BZD o el propofol.' } },
        { momento: 'Día 4 · 14:00 · el giro', datos: { Sedación: 'dexmedetomidina', FC: '44 lpm', PA: '84/48 mmHg', RASS: '+2 (sigue con delirio)', QTc: '470 ms' }, nuevo: ['Sedación', 'FC', 'PA', 'RASS', 'QTc'],
          estado: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', sedante: 'dexmedetomidina', delirio: true, bradi: true, fijo: { fc: 44, pa: '84/48', rass: 2 } }, mirar: 'monitor', calculadora: { nombre: 'Haloperidol paso a paso', ir: 'mar-halo-wizard' },
          pregunta: { id: 'e4-6', tipo: 'test', fuente: 'mar-sedacion#mar-haloperidol-intro · #mar-tabla-6-8 · #mar-haloperidol-qtc · #mar-dexmedetomidina',
            despues: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', delirio: true, bradi: true, halo: true },
            enunciado: 'Con la dexmedetomidina: FC 44 y PA 84/48. Sigue con delirio. QTc 470 ms. ¿Qué haces?',
            opciones: [
              { t: 'Haloperidol 5 mg IV; si a los 15-20 min no responde, 10 mg', ok: true },
              { t: 'Mantener la dexmedetomidina: la bradicardia no importa si está tranquilo', ok: false, porque: 'Es simpaticolítica: baja la FC, la PA y la noradrenalina. Con 44 y 84/48 compromete la perfusión.' },
              { t: 'Haloperidol no: la hipotensión lo contraindica siempre', ok: false, porque: 'Seda sin compromiso cardiovascular (hipotensión solo en el hipovolémico). Lo que lo contraindica es un QTc >500, y el suyo es 470.' }],
            explicacion: 'El haloperidol tiene su sitio cuando <span class="hl">no se tolera la dexmedetomidina</span> por bradicardia o hipotensión. Efecto a los 10-20 min, dura 3-4 h.',
            nota: 'Tabla 6.8: esperar 15 min; el texto, 20. Se dan las dos.' } },
        { momento: 'Día 4 · 21:00', datos: { Sedación: 'haloperidol 5 mg IV; respondió' }, nuevo: ['Sedación'],
          estado: { estimulo: 'reposo', renal: 'ir', opioide: 'fentanilo', delirio: true, bradi: true, halo: true }, mirar: 'buzo',
          pregunta: { id: 'e4-7', tipo: 'error', fuente: 'mar-analgesia#mar-constantes-dolor · #mar-fig-6-1 · #mar-tabla-6-2 · mar-sedacion#mar-tabla-6-8',
            enunciado: 'Antes de irse, el R1 deja su resumen escrito.',
            frases: [
              { t: 'Ingresó con BPS 9: dolor inaceptable, aunque la FC era normal.', mal: false },
              { t: 'Como la FC es normal, por la noche el dolor se controla mirando el monitor.', mal: true, c: 'La FC y la PA se correlacionan mal con el dolor: se mira la <span class="hl">BPS</span> (≥6 inaceptable).' },
              { t: 'Fentanilo en perfusión; si fuera morfina, con su ClCr de 25 iría al 50 %.', mal: false },
              { t: 'Si vuelve a agitarse, diazepam: calma el dolor y la agitación.', mal: true, c: 'El diazepam <span class="hl-rojo">no alivia el dolor</span> (lo que enseña la Fig. 6.1) y se evita (vida media de 90 h). En el delirio: dexmedetomidina o, si no se tolera, haloperidol.' },
              { t: 'Haloperidol: mantenimiento con el 25 % de la dosis eficaz cada 6 h.', mal: false }],
            explicacion: 'Dos errores: la FC como medida del dolor y el diazepam como analgésico.' } }
      ] },
    { id: 'E8', titulo: 'El despertar que no llega', corto: 'El despertar que no llega', sub: 'tres camas, tres sedantes',
      paciente: { Edad: '55 años, mujer', Motivo: 'SDRA; ventilada', Sedación: 'propofol, sedación profunda (RASS −4)', Tiempo: '72 h' },
      volver: { nombre: 'Tabla 6.7: el despertar', ancla: 'mar-tabla-6-7', estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 72, par: true }, subir: true },
      lleva: ['La profundidad pesa más que el tiempo: a las 72 h de propofol, 34 min en ligera frente a 59 h en profunda.',
        'Midazolam ≤48 h (se acumula). Lorazepam >10 mg/h o >0,1 mg/kg/h más de 48 h: propilenglicol; mira el hiato osmolar, no el lactato.',
        'Sedación ligera con escala; y con las BZD, interrupción diaria o, mejor, evitarlas en el ventilado.'],
      pasos: [
        { momento: 'Día 3 · 08:00 · predice', datos: {}, nuevo: [],
          estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 72, par: true }, mirar: 'relojes',
          pregunta: { id: 'e8-1', tipo: 'test', fuente: 'mar-sedacion#mar-tabla-6-7 · #mar-tabla-6-6',
            tocar: { ocultar: ['reloj'], instruccion: 'suelta el lastre de las dos camas.', botones: [{ t: 'Despertar: soltar el lastre', accion: 'despertar' }], comprobar: e => e.subido, pista: 'Pulsa «Despertar: soltar el lastre».', bueno: { subido: true }, confirma: 'a las 72 h: 34 min la ligera y 59 h la profunda.' },
            enunciado: 'Hoy toca prueba de destete. Si paras ya el propofol, ¿cuánto tardará en despertar? La cama de al lado lleva lo mismo, pero en sedación ligera.',
            opciones: [
              { t: 'Las dos, 10-15 min: es lo que dura el propofol', ok: false, porque: 'Es el despertar de la Tabla 6.6, «según la profundidad y la duración». Programarías el destete y seguiría dormida dos días.' },
              { t: 'Ella, unas 3,3 h; la de al lado, 13 min', ok: false, porque: 'Son otras filas: 3,3 h es la ligera a los 7 días y 13 min, la ligera a las 24 h.' },
              { t: 'Ella, unas 59 h; la de al lado, 34 min', ok: true }],
            explicacion: 'Tabla 6.7, 72 h: <span class="hl">34 min</span> frente a <span class="hl-rojo">59 h</span>.' } },
        { momento: 'Día 3 · 08:30', datos: { Destete: 'aplazado' }, nuevo: ['Destete'],
          estado: { opioide: 'fentanilo', sedante: 'propofol', prof: 'profunda', horas: 72, par: true, subido: true }, mirar: 'relojes',
          pregunta: { id: 'e8-2', tipo: 'destapa', fuente: 'mar-sedacion#mar-bzd-prevencion · #mar-tabla-6-7 · #mar-dexmedetomidina',
            enunciado: 'Para que a la próxima cama no le pase lo mismo, ¿qué harías desde el primer día? Son tres cosas.',
            puntos: ['<span class="hl">Sedación ligera</span> titulada con la RASS (−1 a −2): es lo que más acorta el despertar.',
              '<span class="hl">Interrupción diaria</span> de la perfusión («vacaciones de sedación»): acelera el destete (el libro la da para las perfusiones de BZD).',
              'O dexmedetomidina: se despierta sin bajarla y <span class="hl">evita las vacaciones de sedación</span>.'],
            explicacion: 'Las tres salen de la ficha de sedación; la sedación ligera, además, favorece el destete y reduce el delirio (lo dice de las BZD).' } },
        { momento: 'Día 3 · 09:00 · la cama 8', datos: { 'Cama 8': 'midazolam en perfusión desde hace 96 h; pedido: ligera; hoy, RASS −3' }, nuevo: ['Cama 8'],
          estado: { opioide: 'fentanilo', sedante: 'midazolam', prof: 'ligera', horas: 96 }, mirar: 'buzo',
          pregunta: { id: 'e8-3', tipo: 'test', fuente: 'mar-sedacion#mar-midazolam · #mar-lorazepam',
            enunciado: 'En la cama 8, el midazolam la deja más hondo de lo pedido. ¿Qué lo explica?',
            opciones: [
              { t: 'Acumulación en el SNC: había que limitarla a ≤48 h', ok: true },
              { t: 'Toxicidad por propilenglicol: pide un hiato osmolar', ok: false, porque: 'Eso es del lorazepam. Con el midazolam, el problema es la acumulación (muy liposoluble, con un metabolito activo renal).' },
              { t: 'Tolerancia: hay que subir la perfusión', ok: false, porque: 'Está más dormida de lo pedido, no menos: subirla alarga aún más el despertar.' }],
            explicacion: 'Muy liposoluble: <span class="hl-rojo">se acumula</span>. Perfusión ≤48 h; ojo con el diltiazem o la eritromicina (P450) y con la IR (metabolito activo).' } },
        { momento: 'Día 3 · 11:00 · el giro, la cama 9', datos: { 'Cama 9': 'lorazepam 12 mg/h desde hace 60 h', Gasometría: 'acidosis láctica nueva; confusa en las pausas', 'Hiato osmolar': '14 mOsm/kg H₂O' }, nuevo: ['Cama 9', 'Gasometría', 'Hiato osmolar'],
          estado: { opioide: 'fentanilo', sedante: 'lorazepam', prof: 'ligera', horas: 60, dosisAlta: true }, mirar: 'buzo',
          pregunta: { id: 'e8-4', tipo: 'test', fuente: 'mar-sedacion#mar-lorazepam · #mar-tabla-6-5',
            enunciado: '¿Qué piensas en la cama 9?',
            opciones: [
              { t: 'Sepsis: el lactato sube por hipoperfusión', ok: false, porque: 'No se descarta sin más, pero lleva >10 mg/h más de 48 h y un hiato >10: si solo piensas en sepsis, sigues infundiendo el tóxico.' },
              { t: 'Propilenglicol: >10 mg/h más de 48 h, hiato >10', ok: true },
              { t: 'Acumulación del lorazepam, que es la más liposoluble de las dos', ok: false, porque: 'El lorazepam es menos liposoluble (++ frente a +++) y no tiene metabolitos activos: acumula menos. Su riesgo grave es el disolvente.' }],
            explicacion: 'El propilenglicol se vuelve <span class="hl-rojo">ácido láctico</span>: acidosis, alteración mental, inflamación y fracaso renal. Un hiato osmolar <span class="hl">&gt;10</span> se correlaciona con su acumulación. Míralo gotear.' } },
        { momento: 'Día 3 · 12:00', datos: {}, nuevo: [],
          estado: { opioide: 'fentanilo', sedante: 'lorazepam', prof: 'ligera', horas: 60, dosisAlta: true }, mirar: 'buzo',
          pregunta: { id: 'e8-5', tipo: 'error', fuente: 'mar-sedacion#mar-lorazepam · #mar-bzd-proscontras · #mar-bzd-prevencion',
            enunciado: 'Plan de la cama 9 que escribe el R1.',
            frases: [
              { t: 'Lleva lorazepam por encima de 10 mg/h más de 48 h: riesgo de toxicidad por propilenglicol.', mal: false },
              { t: 'El hiato osmolar de 14 (>10) se correlaciona con su acumulación; lo seguiré vigilando.', mal: false },
              { t: 'Mañana pido un lactato: si es normal, descarto la toxicidad.', mal: true, c: 'El lactato <span class="hl-rojo">no predice bien</span> la toxicidad; lo que se vigila es el hiato osmolar.' },
              { t: 'El propilenglicol se convierte en ácido láctico y puede dar fracaso renal.', mal: false },
              { t: 'No cambio la perfusión: el lorazepam es la benzodiacepina de elección en perfusión prolongada.', mal: true, c: 'Marino lo escribe así a partir de un estudio, pero cita también que las guías recientes piden <span class="hl">evitar las BZD</span> en el ventilado. El error es no actuar ante la <span class="hl-rojo">dosis de riesgo</span> (&gt;10 mg/h más de 48 h), no la frase del libro.' }],
            explicacion: 'El primer error es la trampa del lactato; el segundo, quedarse con una sola de las dos frases del capítulo y dejar la perfusión en la dosis de riesgo.' } }
      ] }
];

const PROF = [
    ['Opiáceo, opioide y narcótico', 'Opiáceo: derivado natural del opio. Opioide: derivado natural o sintético que actúa sobre los receptores opioides (analgesia, sedación, euforia, miosis, depresión respiratoria, bradicardia, estreñimiento, náuseas, retención urinaria, prurito). Narcótico: término anticuado, y policial para el uso ilegal.', 'mar-opioide-definiciones', 18],
    ['Fentanilo e hidromorfona, más a fondo', 'El fentanilo, por su lipofilia, se acumula en el cerebro con el uso continuado; sin metabolitos activos, pero el fármaco se acumula en la IR. La hidromorfona es semisintética, quizá más analgésica que la morfina, preferida en el dolor oncológico y sin ventajas demostradas sobre el fentanilo.', 'mar-tabla-6-2', 20],
    ['Tabla 6.2: bolos e infusiones', 'Morfina: bolo de 2-4 mg cada 1-2 h; infusión de 2-30 mg/h. Hidromorfona: bolo de 0,2-0,6 mg cada 1-2 h; infusión de 0,5-3 mg/h. Fentanilo: bolo de 0,35-0,5 µg/kg cada 0,5-1 h; infusión de 0,7-10 µg/kg/h. El capítulo insiste en que la dosis eficaz la marca la respuesta de cada paciente, no la pauta recomendada.', 'mar-tabla-6-2', 19],
    ['Paracetamol IV y ketamina, de dónde vienen', 'El paracetamol IV se aprobó en 2010 para el dolor y la fiebre del posoperatorio que no puede tomarlo por boca; su gran pega, además de la hepatotoxicidad, es que no es antiinflamatorio. La ketamina es un derivado de la fenciclidina, anestésica y analgésica.', 'mar-tabla-6-3 · mar-ketamina', 22],
    ['Ketamina: otros efectos', 'Además de subir la PA y la FC y de broncodilatar, la ketamina da náuseas y vómitos e hipersalivación. A las dosis de ahorro de opioide, sus efectos no analgésicos disminuyen.', 'mar-ketamina', 23],
    ['Medidas no farmacológicas', 'El capítulo no las trata: remite a una guía de práctica clínica. Sí cita, como parte de sedar, el apoyo general: hablar a menudo con el paciente y con la familia.', 'mar-dolor-intro · mar-ansiedad', 16],
    ['Escalas de sedación', 'Las dos más fiables en la UCI: la escala de sedación-agitación (SAS) y la RASS. La RASS permite además seguir los cambios y servir de objetivo de la perfusión.', 'mar-escalas-sedacion', 24],
    ['Dexmedetomidina: dosis y más ventajas', 'Tabla 6.6: carga de 1 µg/kg en 10 min; inicio en 5-10 min; mantenimiento de 0,2-1,5 µg/kg/h; despertar en 6-10 min. Sirve en el paciente no ventilado (no deprime la respiración), y el EEG de su sedación se parece al del sueño natural.', 'mar-tabla-6-6 · mar-dexmedetomidina', 27],
    ['PCA (analgesia controlada por el paciente)', 'Para el despierto y capaz: pulsa y recibe un bolo; la bomba se bloquea un intervalo de cierre, cuyo mínimo lo marca el tiempo hasta el efecto máximo. En la orden: carga, intervalo y bolo (morfina 0,5-3 mg, 10-20 min; hidromorfona 0,1-0,5 mg, 5-15 min; fentanilo 15-75 µg, 3-10 min).', 'mar-analgesia#mar-pca', 21],
    ['Remifentanilo', '250 veces más potente que la morfina. Carga de 1,5 µg/kg y 0,5-15 µg/kg/h; efecto en un minuto que desaparece a los 10 min (esterasas plasmáticas, sin ajuste renal ni hepático). Útil en el TCE. El corte brusco puede precipitar abstinencia.', 'mar-analgesia#mar-remifentanilo', 20],
    ['Meperidina', 'Ya no se usa: la normeperidina tiene una vida media de 15-40 h y se acumula (agitación, mioclonías, delirio, convulsiones).', 'mar-analgesia#mar-meperidina', 20],
    ['Otros efectos de los opioides', 'Depresión respiratoria central, rara a dosis habituales (más riesgo con apnea del sueño o hipercapnia crónica). Estreñimiento y reflujo de la enteral; la metilnaltrexona 12 mg IV al día no mejoró la defecación en la UCI. Náuseas por la zona gatillo.', 'mar-analgesia#mar-opioide-respiratorio · #mar-opioide-intestino · #mar-opioide-nauseas', 21],
    ['Dolor neuropático', 'Suele necesitar analgesia no opioide: gabapentina 600 mg cada 8 h o carbamazepina 100 mg cada 6 h, por vía enteral.', 'mar-analgesia#mar-neuropatico', 23],
    ['Ansiedad, agitación y delirio', 'Hasta el 85 % de los pacientes de UCI. La UCI y la ventilación prolongada dejan recuerdos de dolor y ansiedad, y hasta estrés postraumático.', 'mar-sedacion#mar-ansiedad · mar-analgesia#mar-dolor-intro', 23],
    ['Tabla 6.5: benzodiacepinas IV', 'Midazolam: bolo 0,01-0,05 mg/kg, inicio 3-5 min, dura 1-2 h, perfusión 0,02-0,1 mg/kg/h. Lorazepam: bolo 0,02-0,04 mg/kg, inicio 5-15 min, dura 2-6 h, perfusión 0,01-0,1 mg/kg/h. Amnesia anterógrada (hasta un 40 % no recuerda la UCI).', 'mar-sedacion#mar-tabla-6-5 · #mar-bzd-proscontras', 26],
    ['Propofol: el preparado y sus otras pegas', 'Emulsión lipídica al 10 %: 1 kcal/mL. Carga 5 µg/kg/min en 5 min (Tabla 6.6). Hipertrigliceridemia, pancreatitis necrotizante (rara), reacciones anafilactoides y orina verdosa inocua. El límite de 240 µg/kg/min de la calculadora no es de Marino.', 'mar-sedacion#mar-propofol · #mar-tabla-6-6 · #mar-nota-propofol-240', 28],
    ['Haloperidol: el síndrome neuroléptico maligno', 'Hiperpirexia, rigidez intensa y rabdomiólisis; descrito con haloperidol IV y mortal si pasa desapercibido. Las reacciones extrapiramidales son poco frecuentes por vía IV.', 'mar-sedacion#mar-haloperidol-qtc', 31],
    ['De la opiofobia a la opiofilia, y vuelta', '81 recetas de opioides por cada 100 estadounidenses en 2010; unas 500.000 muertes por sobredosis entre 1999 y 2019. Hoy se frena su uso… otra vez por miedo a la adicción.', 'mar-sedacion#mar-opiofobia', 32]
];

/* «Para profundizar»: lo que la Mayéutica no pregunta, con su sitio en la ficha y en el libro */
export const PDF = p => `docs/marino-2024-practicas-monitorizacion-caps5-9.pdf#page=${p}`;
export const PROFUNDIZAR = PROF.map(([t, x, donde, pag]) => ({ html: `<b>${t}.</b> ${x}`, donde, pag, href: PDF(pag) }));

/* La lámina real del libro que acompaña a la escena (las Tablas 6.1, 6.4 y 6.7 se recrean vivas) */
export const LAMINAS = [
      ['mar-fig6-1-diazepam-dolor.jpg', 'Fig. 6.1', '¿El diazepam alivia el dolor? Porcentaje de médicos residentes y de enfermeras de UCI que contestaron mal (lectura aproximada: ~80 % y ~43 %).'],
];

/* ============================================================
     Prueba de las cifras (para __inmPruebas y autonomo/pruebas/inmersion-viva.mjs): cada estado con nombre da lo que
     dice la ficha; la Tabla 6.7, tal cual; el paciente posible en los extremos; y los casos.
     ============================================================ */
export function pruebasInmersion() {
      const r = { fallos: [], todoCoincide: true, tabla67: [], estados: {}, casos: [] };
      const mira = (grupo, k, valor, espera) => {
          const ok = JSON.stringify(valor) === JSON.stringify(espera);
          if (!ok) { r.todoCoincide = false; r.fallos.push(`${grupo}: ${k} (${JSON.stringify(valor)} frente a ${JSON.stringify(espera)})`); }
          (r.estados[grupo] ||= []).push({ k, valor, espera, ok });
      };
      // La subida: los relojes con las cifras exactas de la Tabla 6.7
      const ESPERA = { 24: ['13 min', '25 h'], 72: ['34 min', '59 h'], 168: ['3,3 h', '71 h'], 336: ['3,4 h', '74 h'] };
      for (const h of [24, 72, 168, 336]) {
          const par = derivar(estadoDe({ sedante: 'propofol', horas: h, par: true })).par;
          const ok = par[0].t === ESPERA[h][0] && par[1].t === ESPERA[h][1] && durSubida(par[1].min) > durSubida(par[0].min);
          if (!ok) { r.todoCoincide = false; r.fallos.push('Tabla 6.7 a las ' + h + ' h'); }
          r.tabla67.push({ horas: h, ligera: par[0].t, profunda: par[1].t, ok });
      }
      const E = k => derivar(estadoDe(ESTADOS[k].e));
      mira('dolor-oculto', 'BPS · RASS · FC', [E('dolor-oculto').bps, E('dolor-oculto').rass, E('dolor-oculto').fc.v], [9, -3, 82]);
      mira('diazepam', 'la tormenta sigue (BPS igual que sin sedante)', E('diazepam').bps, derivar(estadoDe({ estimulo: 'mover' })).bps);
      mira('diazepam', 'RASS', E('diazepam').rass, -3);
      mira('fentanilo', 'BPS <6', E('fentanilo').bps < 6, true);
      mira('morfina-ir', 'ajuste', OPIOIDES.morfina.irC, '↓50 % el mantenimiento');
      mira('morfina-ir', 'hidromorfona y fentanilo', [OPIOIDES.hidromorfona.irC, OPIOIDES.fentanilo.irC], ['sin ajuste', '¿evitar? (IR terminal)']);
      mira('hipernocicepcion', 'BPS moverle → con inflamación', [derivar(estadoDe({ estimulo: 'mover' })).bps, E('hipernocicepcion').bps], [9, 11]);
      mira('hipernocicepcion', 'reposo cruza el umbral', [derivar(estadoBase()).bps, derivar(estadoDe({ inflamacion: true })).bps], [5, 6]);
      mira('rass-objetivo', 'RASS en −1/−2', [-1, -2].includes(E('rass-objetivo').rass), true);
      mira('profunda-72h', 'RASS', E('profunda-72h').rass, -4);
      mira('despertar', 'relojes 72 h', E('despertar').par.map(c => c.t), ['34 min', '59 h']);
      mira('midazolam-48h', 'aviso a las 72 h · a las 24 h', [E('midazolam-48h').av.midaz, derivar(estadoDe({ sedante: 'midazolam', horas: 24 })).av.midaz], [true, false]);
      mira('lorazepam-pg', 'gotea · no a 24 h · no sin dosis alta', [E('lorazepam-pg').av.pg, derivar(estadoDe({ sedante: 'lorazepam', dosisAlta: true, horas: 24 })).av.pg, derivar(estadoDe({ sedante: 'lorazepam', horas: 72 })).av.pg], [true, false, false]);
      mira('dexmedetomidina', 'RASS · FC y PA bajan sin cifra', [E('dexmedetomidina').rass, E('dexmedetomidina').fc.txt, E('dexmedetomidina').pa.txt], [-2, '↓', '↓']);
      mira('pris', 'SIP · no a 24 h', [E('pris').av.pris, derivar(estadoDe({ sedante: 'propofol', dosisAlta: true, horas: 24 })).av.pris], [true, false]);
      mira('pris', 'la PA cae (sin cifra)', E('pris').pa.txt, '↓↓');
      mira('delirio', 'RASS · recomienda', [E('delirio').rass, E('delirio').recomienda], [3, 'dexmedetomidina']);
      mira('haloperidol', 'RASS · con QTc >500 bloqueado', [E('haloperidol').rass, derivar(estadoDe({ ...ESTADOS.haloperidol.e, qtcLargo: true })).av.haloBloq], [-1, true]);
      mira('hipovolemia', 'opioide + BZD: PA ↓↓', derivar(estadoDe({ opioide: 'fentanilo', sedante: 'midazolam', volemia: 'hipovolemia' })).pa.txt, '↓↓');
      // Paciente posible: la FC con cada combinación de dolor (BPS de 3 a 12) y las BPS dentro de la escala
      const fcs = [], bpss = [];
      for (const est of ['reposo', 'mover']) for (const inf of [false, true]) for (const op of [null, 'fentanilo']) for (const ah of [[], ['ketorolaco', 'paracetamol', 'ketamina']]) {
          const d = derivar(estadoDe({ estimulo: est, inflamacion: inf, opioide: op, ahorro: ah })); fcs.push(d.fc.v); bpss.push(d.bps);
      }
      r.extremos = { fc: [Math.min(...fcs), Math.max(...fcs)], bps: [Math.min(...bpss), Math.max(...bpss)] };
      mira('extremos', 'FC entre 60 y 100 con cualquier dolor', r.extremos.fc[0] >= 60 && r.extremos.fc[1] <= 100, true);
      mira('extremos', 'BPS entre 3 y 12', r.extremos.bps[0] >= 3 && r.extremos.bps[1] <= 12, true);
      // Los casos: lo que dice la ficha del paciente es lo que da el modelo en ese paso
      const pasoD = (c, i) => derivar(estadoDe(CASOS.find(x => x.id === c).pasos[i].estado));
      for (const [caso, paso, campo, valor, espera] of [
          ['E4', 1, 'BPS · RASS · FC', [pasoD('E4', 0).bps, pasoD('E4', 0).rass, pasoD('E4', 0).fc.v], [9, 2, 82]],
          ['E4', 4, 'RASS +1 (dato del caso)', pasoD('E4', 3).rass, 1],
          ['E4', 5, 'RASS con delirio', pasoD('E4', 4).rass, 3],
          ['E4', 6, 'FC · PA del caso', [pasoD('E4', 5).fc.txt, pasoD('E4', 5).pa.txt], ['44', '84/48']],
          ['E8', 1, 'relojes 72 h', pasoD('E8', 0).par.map(c => c.t), ['34 min', '59 h']],
          ['E8', 3, 'cama 8: RASS −3 a las 96 h', pasoD('E8', 2).rass, -3],
          ['E8', 4, 'cama 9: propilenglicol a 12 mg/h y 60 h', pasoD('E8', 3).av.pg, true]]) {
          const ok = JSON.stringify(valor) === JSON.stringify(espera);
          if (!ok) { r.todoCoincide = false; r.fallos.push(`${caso} paso ${paso}: ${campo}`); }
          r.casos.push({ caso, paso, campo, valor, espera, ok });
      }
      return r;
}
