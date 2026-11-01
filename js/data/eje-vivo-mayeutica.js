// Las preguntas y los casos de la Mayéutica del eje hormonal vivo (Marino cap. 51, docs/marino-2024-nutricion-endocrino-caps45-53.pdf).
// Solo datos; el motor es js/core/mayeutica-motor.js. El contenido (apuestas, «encuentra el error», casos con giro) vive una sola vez
// en eje-vivo-pruebas.js y aquí se pone en la forma del motor. Las respuestas viven aquí: el HTML no las lleva hasta que se contesta.
// Cada cita es 'página|id del párrafo de la ficha'. Las cifras de la ficha del paciente salen del monitor (leer), nunca a mano.
import { APUESTAS, ERRORES, CASOS as CASOS_BRUTOS } from './eje-vivo-pruebas.js';
import { nuevo, leer, acthVals, lab } from '../modules/libros/eje-vivo/modelo.js';
import { PRES, cita } from './eje-vivo-data.js';
const coma = (v, d = 1) => (+v).toFixed(d).replace('.', ',');
const pg = (n) => ` (p. ${n})`;
const estadoDe = (e) => ({ ...nuevo(e.pac), ...(e.set || {}) });
const leerEn = (e) => leer(estadoDe(e));
const fuentes = (lista) => [...new Set(lista.map((o) => `${o[3]}|${o[4]}`))];
// Opción del motor: la buena sin texto (su porqué es la explicación); la mala, con lo que le pasaría al paciente y su página.
const op = (o) => (o[1] ? { t: o[0], ok: true } : { t: o[0], porque: o[2] + pg(o[3]) });
const buena = (ops) => ops.find((o) => o[1]);
const lab0 = (pac) => lab(nuevo(pac));
const EXP = {
  G3: 'El propranolol frena la taquicardia y, a dosis altas, la conversión de T4 a T3 (Tabla 51.3); la síntesis de T4 se frena con el antitiroideo (Tabla 51.4), por eso se dan juntos',
  G4: 'El etomidato y el ketoconazol inhiben la síntesis de cortisol y un cortisol aleatorio menor de 10 µg/dL es la mejor señal de supresión',
  G5: 'Con el basal menor de 10 ya hay supresión y la prueba de la ACTH es «popular pero a menudo innecesaria»; si se hace, un aumento menor de 9 µg/dL confirma la supresión',
  G6: 'La T3 y la T4 bajas con TSH normal son el eutiroideo enfermo, y la ficha dice que no se trata',
  G7: 'Antitiroideo, yodo, betabloqueante e hidrocortisona bajan la fiebre y el pulso de la tormenta, y hay que dar tiempo; los días y cuánto bajan son ilustrativos del modelo',
  G8: 'En la crisis de asma todos los betabloqueantes están contraindicados; el metoprolol es la alternativa solo con asma estable',
};
const CORTO = { G1: 'Toribio: PA 78/40', G2: 'Bibiana: cortisol 22', E1: 'nota de Obdulia', E2: 'nota de Lucrecia' };

// Guía socrática: las dos apuestas (predices y compruebas en el modelo).
const TOCAR = {
  toribio: { txt: 'Compruébalo: pon la hidrocortisona', patch: { pac: 'toribio', set: { hc: 1, hcD: 0 } },
    cuenta: (a, d) => `la PA de Toribio pasa de ${a.pas}/${a.pad} a ${d.pas}/${d.pad} con la noradrenalina igual (0,4 µg/kg/min) y 3 L de suero.` },
  bibiana: { txt: 'Compruébalo: haz la prueba de la ACTH', patch: { pac: 'bibiana', set: { acth: true } },
    cuenta: () => { const v = acthVals({ pac: 'bibiana' }); return `el cortisol de Bibiana pasa de ${v.b} a ${v.post} µg/dL: aumento de ${v.d}, menor de 9 µg/dL, la glándula no responde.`; } },
};
const guia = APUESTAS.map((A, i) => ({
  grupo: 'guia', num: 'G' + (i + 1), predice: true, corto: CORTO['G' + (i + 1)], estado: { pac: A.p, lup: PRES[A.p].lup, vista: A.vista },
  enunciado: A.enun.replace(/ Decide antes de ver qué pasa\.$/, '') + ' <b>Elige antes de ver nada.</b>',
  opciones: A.ops.map(op), explicacion: buena(A.ops)[2] + pg(buena(A.ops)[3]), fuente: fuentes(A.ops), tocar: TOCAR[A.p],
}));
// Examen: las dos notas con «encuentra el error».
const examen = ERRORES.map((E, i) => ({
  grupo: 'examen', num: 'E' + (i + 1), tipo: 'error', corto: CORTO['E' + (i + 1)], estado: { pac: E.p, lup: E.lup, vista: 'eje' },
  enunciado: E.enun.replace(/ Toca la.*$/, '') + ' <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
  frases: E.fr.map((f) => ({ t: f[0], mal: f[1], c: f[1] ? f[2].replace(/^Error: /, '') + pg(f[3]) : '' })), fuente: fuentes(E.fr),
}));
// Más guía y más examen (vuelta 2): los otros cuatro pacientes. Cada cifra sale de leer()/acthVals() del modelo; el sentido, de la ficha (Marino cap. 51).
const T4 = (pac, set) => leerEn({ pac, set });
const con = { atd: 'ptu', atdD: 0, yodo: true, yodoD: 0, bb: 'prop', bbD: 0, hc: 1, hcD: 0, dia: 7 };
const aE = acthVals({ pac: 'policarpo', farm: 'eto' }), aA = acthVals({ pac: 'policarpo', farm: 'amio' });
const guiaMas = [
  { num: 'G3', corto: 'Sinforoso: FC con propranolol', estado: { pac: 'sinforoso', lup: 'ti', vista: 'eje' },
    enunciado: 'Sinforoso, 82 años, letárgico y en fibrilación auricular a 128 lpm; TSH menor de 0,01 y T4 libre 2,9: tirotoxicosis apática. Le pones <b>propranolol oral</b>. ¿Qué cambia? <b>Elige antes de ver nada.</b>',
    ops: [
      ['Baja la FC y frena la conversión de T4 a T3; la T4 libre sigue alta y aún falta el antitiroideo.', true, '', 54, 'mu-tabla-51-3'],
      ['La T4 libre baja a lo normal en pocos días: el betabloqueante apaga la glándula y sobra el antitiroideo.', false, 'El propranolol no frena la síntesis de T4: eso lo hacen el metimazol o el propiltiouracilo (Tabla 51.4). Sin antitiroideo, la glándula sigue a toda marcha y la T4 libre queda en 2,9.', 55, 'mu-tabla-51-4'],
      ['La FC no cambia: en la fibrilación auricular el betabloqueante no actúa sobre el ritmo.', false, 'La Tabla 51.3 da el propranolol precisamente para frenar la taquicardia de la tirotoxicosis; no ponerlo deja a Sinforoso a 128 lpm.', 54, 'mu-tabla-51-3'],
    ], tocar: { txt: 'Compruébalo: pon el propranolol', patch: { pac: 'sinforoso', set: { bb: 'prop', bbD: 0 } },
      cuenta: (a, d) => `la FC de Sinforoso pasa de ${a.fc} a ${d.fc} lpm y la T4 libre sigue en 2,9 ng/dL: ha frenado el pulso, no la glándula.` } },
  { num: 'G4', corto: 'Policarpo: cortisol con etomidato', estado: { pac: 'policarpo', lup: 'sr', vista: 'eje' },
    enunciado: `Policarpo, 70 años, con amiodarona por una fibrilación auricular, necesitó <b>etomidato</b> para intubarlo. Su cortisol basal era de ${aA.b} µg/dL. ¿Qué esperas de un cortisol aleatorio ahora? <b>Elige antes de ver nada.</b>`,
    ops: [
      ['Cae por debajo de 10 µg/dL: el etomidato inhibe la síntesis de cortisol.', true, '', 50, 'mu-sr-causas'],
      ['Sube: el etomidato estimula la suprarrenal frente al estrés de la intubación.', false, 'El etomidato inhibe la síntesis de cortisol, no la estimula. Un cortisol alto te haría descartar una supresión real en un enfermo que puede necesitar hidrocortisona.', 50, 'mu-sr-causas'],
      ['No cambia: el etomidato solo actúa en el cerebro, como hipnótico.', false, 'La ficha lo cita, junto al ketoconazol, entre los fármacos que inhiben la síntesis de cortisol: pasarlo por alto retrasa el diagnóstico de la supresión.', 50, 'mu-sr-causas'],
    ], tocar: { txt: 'Compruébalo: pon el etomidato', patch: { pac: 'policarpo', set: { farm: 'eto' } },
      cuenta: () => `el cortisol aleatorio de Policarpo pasa de ${aA.b} a ${aE.b} µg/dL: menor de 10, supresión.` } },
  { num: 'G5', corto: 'Policarpo: prueba de la ACTH', estado: { pac: 'policarpo', lup: 'sr', vista: 'mapa', set: { farm: 'eto' } },
    enunciado: `Con el etomidato puesto, el cortisol aleatorio de Policarpo es de ${aE.b} µg/dL. Si haces la prueba de la ACTH con 250 µg, ¿qué cifra esperas a la hora y qué te dice? <b>Elige antes de ver nada.</b>`,
    ops: [
      ['Sube pocos puntos, menos de 9 µg/dL: es supresión, y con el basal ya bajo la prueba sobra.', true, '', 50, 'mu-sr-acth'],
      ['Sube 9 µg/dL o más: la respuesta normal descarta cualquier supresión, también la secundaria.', false, 'Un aumento de 9 o más es respuesta normal, pero no excluye la supresión secundaria por fallo hipotálamo-hipofisario: la diagnostica la ACTH plasmática.', 51, 'mu-sr-practica'],
      ['Hay que hacerla siempre antes de tratar: sin la prueba no se puede hablar de supresión.', false, 'Con el basal menor de 10 ya hay supresión y la ficha llama a la prueba «popular pero a menudo innecesaria»; esperarla retrasaría la hidrocortisona si hay hipotensión.', 50, 'mu-sr-acth'],
    ], tocar: { txt: 'Compruébalo: haz la prueba de la ACTH', patch: { pac: 'policarpo', set: { farm: 'eto', acth: true } },
      cuenta: () => `el cortisol de Policarpo pasa de ${aE.b} a ${aE.post} µg/dL: aumento de ${aE.d}, menor de 9 µg/dL.` } },
  { num: 'G6', corto: 'Fulgencio: ¿se trata?', estado: { pac: 'fulgencio', lup: 'ti', vista: 'mapa' },
    enunciado: 'Fulgencio, 66 años, neumonía en el día 5 de UCI: T3 libre y T4 libre bajas, TSH normal. ¿Qué haces con el tiroides? <b>Elige antes de ver nada.</b>',
    ops: [
      ['Levotiroxina 50-100 µg al día para subir la T4 libre.', false, 'Es un eutiroideo enfermo, sin hipotiroidismo clínico: la ficha dice que no se trata. Dar hormona sería tratar una cifra. El modelo lo para con un sello.', 57, 'mu-hipo-eutiroideo-tto'],
      ['Liotironina IV, porque la T3 es la baja.', false, 'La T3 baja con TSH normal es la peor conversión de T4 a T3 en los tejidos, no una falta de hormona: tampoco se trata (p. 57).', 56, 'mu-hipo-eutiroideo'],
      ['Nada: es un eutiroideo enfermo, no se trata.', true, '', 57, 'mu-hipo-eutiroideo-tto'],
    ], tocar: { txt: 'Compruébalo: intenta darle levotiroxina', patch: { pac: 'fulgencio', set: { intento: 'eutiro' } },
      cuenta: (a, d) => `el modelo para la hormona con el sello «Eutiroideo enfermo: no se trata»; la T4 libre sigue en ${coma(lab0('fulgencio').t4)} ng/dL y la TSH en ${coma(lab0('fulgencio').tsh)} mU/mL.` } },
  { num: 'G7', corto: 'Lucrecia a 7 días', estado: { pac: 'lucrecia', lup: 'ti', vista: 'eje' },
    enunciado: `Lucrecia, 31 años, Graves y neumonía: ${T4('lucrecia').t.toString().replace('.', ',')} °C y FC ${T4('lucrecia').fc}, tormenta tiroidea. Pones propiltiouracilo, yodo, propranolol e hidrocortisona. ¿Cómo estará a los <b>7 días</b>? <b>Elige antes de ver nada.</b>`,
    ops: [
      ['Casi igual: la hormona que ya circula sigue ahí y los fármacos solo frenan la glándula.', false, `Con antitiroideo, yodo, betabloqueante e hidrocortisona a la vez, la T y la FC bajan en días (sentido de la ficha, p. 53-55; el modelo pasa de ${T4('lucrecia').t} a ${T4('lucrecia', con).t} °C). Creerla sin respuesta te haría añadir fármacos de más.`, 55, 'mu-ti-tormenta'],
      [`Ya sin sello: la T baja a unos ${coma(T4('lucrecia', con).t)} °C y la FC a ${T4('lucrecia', con).fc}, pero ha hecho falta darle días.`, true, '', 55, 'mu-ti-tormenta'],
      ['Normal desde las primeras horas: el yodo bloquea la secreción de T4 al instante.', false, 'El yodo bloquea la síntesis y la secreción de T4 (p. 55), pero el modelo da la respuesta en días, no en horas (cifras ilustrativas): esperar un cambio inmediato lleva a doblar dosis sin necesidad.', 55, 'mu-ti-yodo'],
    ], tocar: { txt: 'Compruébalo: pon todo y avanza 7 días', patch: { pac: 'lucrecia', set: con },
      cuenta: (a, d) => `la temperatura de Lucrecia pasa de ${coma(a.t)} a ${coma(d.t)} °C y la FC de ${a.fc} a ${d.fc} lpm; el reloj corre ${con.dia} días (el sentido es el de la ficha; los días, ilustrativos).` } },
  { num: 'G8', corto: 'Lucrecia con asma', estado: { pac: 'lucrecia', lup: 'ti', vista: 'eje', set: { atd: 'ptu', atdD: 0 } },
    enunciado: 'Lucrecia entra en <b>crisis de asma</b> con el propiltiouracilo ya puesto y la FC alta. ¿Qué haces con el propranolol? <b>Elige antes de ver nada.</b>',
    ops: [
      ['Lo mantengo a la dosis alta: la taquicardia de la tormenta manda.', false, 'En la crisis de asma todos los betabloqueantes están contraindicados (Tabla 51.3); mantenerlo arriesga el broncoespasmo.', 54, 'mu-tabla-51-3'],
      ['Lo cambio por metoprolol, que sí es seguro en la crisis.', false, 'El metoprolol es la alternativa con asma, pero nunca en una crisis: en ella están contraindicados todos.', 54, 'mu-tabla-51-3'],
      ['No pongo ninguno: en la crisis todos están contraindicados.', true, '', 54, 'mu-tabla-51-3'],
    ], tocar: { txt: 'Compruébalo: activa la crisis y pon el propranolol', patch: { pac: 'lucrecia', set: { atd: 'ptu', atdD: 0, crisis: true, bb: 'prop', bbD: 0 } },
      cuenta: (a, d) => `el modelo sella el propranolol («Betabloqueantes contraindicados») con la FC en ${d.fc} lpm.` } },
].map((q, i) => ({ ...q, grupo: 'guia', predice: true, opciones: q.ops.map(op), explicacion: EXP[q.num] + pg(buena(q.ops)[3]), fuente: fuentes(q.ops) }));
const examenMas = [
  { num: 'E3', corto: 'nota de Policarpo', estado: { pac: 'policarpo', lup: 'ti', vista: 'eje' }, p: 'policarpo',
    enunciado: 'Lee la nota de evolución de Policarpo, 70 años, amiodarona por una fibrilación auricular y etomidato para la intubación.',
    fr: [
      ['T4 libre 2,4 ng/dL con TSH normal en un paciente con amiodarona: hipertiroxinemia eutiroidea, porque el fármaco bloquea el paso de T4 a T3.', false, '', 54, 'mu-ti-hipertiroxinemia'],
      ['El etomidato y el ketoconazol aceleran el metabolismo del cortisol y por eso baja.', true, 'Error: inhiben la síntesis de cortisol; los que aceleran su metabolismo son la fenitoína y la rifampicina.', 50, 'mu-sr-causas'],
      [`Cortisol aleatorio de ${aE.b} µg/dL: menor de 10, la mejor señal de supresión.`, false, '', 50, 'mu-sr-criterios'],
      [`Tras 250 µg de ACTH sube de ${aE.b} a ${aE.post} µg/dL; si el aumento fuese de 9 o más, descartaría cualquier supresión, también la secundaria.`, true, 'Error: un aumento de 9 o más es respuesta normal, pero no excluye la supresión secundaria; la diagnostica la ACTH plasmática.', 51, 'mu-sr-practica'],
      ['La heparina daría un patrón parecido de T4 alta, porque los ácidos grasos libres desplazan la T4 de sus proteínas.', false, '', 54, 'mu-ti-hipertiroxinemia'],
    ] },
  { num: 'E4', corto: 'nota de Fulgencio', estado: { pac: 'fulgencio', lup: 'ti', vista: 'mapa' }, p: 'fulgencio',
    enunciado: `Lee la nota de evolución de Fulgencio, 66 años, neumonía en el día 5 de UCI, con T ${coma(T4('fulgencio').t)} °C y FC ${T4('fulgencio').fc}.`,
    fr: [
      [`T4 libre ${coma(lab0('fulgencio').t4)} ng/dL, T3 libre baja y TSH ${coma(lab0('fulgencio').tsh)} mU/mL: eutiroideo enfermo, un patrón de hasta la mitad de los pacientes de UCI.`, false, '', 56, 'mu-hipo-eutiroideo'],
      ['Las desyodasas desvían la T4 hacia T3 inversa, que es inactiva.', false, '', 56, 'mu-hipo-eutiroideo'],
      ['Es un hipotiroidismo primario: la glándula falla y la TSH tendría que estar alta.', true, 'Error: en el primario la TSH está alta; aquí es normal, y por eso el patrón (T4 baja con TSH normal) es el del eutiroideo enfermo.', 53, 'mu-tabla-51-2'],
      ['Levotiroxina 50-100 µg al día para normalizar la T4 libre.', true, 'Error: el eutiroideo enfermo no se trata.', 57, 'mu-hipo-eutiroideo-tto'],
      ['La TSH normal es lo que lo separa del hipotiroidismo primario, donde está alta.', false, '', 56, 'mu-hipo-dx'],
    ] },
].map((E) => ({ grupo: 'examen', num: E.num, tipo: 'error', corto: E.corto, estado: E.estado,
  enunciado: E.enunciado + ' <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
  frases: E.fr.map((f) => ({ t: f[0], mal: f[1], c: f[1] ? f[2].replace(/^Error: /, '') + pg(f[3]) : '' })), fuente: fuentes(E.fr) }));
export const PREGUNTAS = [...guia, ...guiaMas, ...examen, ...examenMas].map((q) => ({ ...q, id: 'ejm-' + q.num.toLowerCase() + (q.num === 'G1' ? 'a' : ''), tipo: q.tipo || 'test' }));

// Casos: la ficha del paciente sale del monitor del modelo en cada paso.
const MOMENTOS = { obdulia: ['Día 0 · urgencias', 'Día 1 · el laboratorio', 'Día 2 · el cambio de turno', 'Día 3 · el mantenimiento'], toribio: ['Día 1 · el cortisol', 'Día 3 · la retirada', 'Día 5 · tras la retirada brusca'] };
const SUB = { obdulia: 'Del mixedema a la hormona y la hidrocortisona', toribio: 'Del shock séptico a la retirada de la hidrocortisona' };
const VUELTA = { obdulia: 'mu-hipo-coma-tto', toribio: 'mu-sr-retirada' };
const filas = (pac, e) => { const s = estadoDe({ pac, set: e }), L = leer(s);
  return [['PA', `${L.pas}/${L.pad} mmHg`], ['FC', `${L.fc} lpm`], ['T central', `${coma(L.t)} °C`], ['Na⁺', `${L.na} mEq/L`], ...(pac === 'toribio' ? [['Lactato', `${coma(L.lact)} mmol/L`], ['Noradrenalina', `${coma(s.na)} µg/kg/min`]] : []), ['Día', String(s.dia)]]; };
// Toribio, día 3: las cifras de la pregunta son las que da el monitor (leer), las mismas que el 6H (PA 104/53 con noradrenalina 0,1).
const enunToribio3 = (s) => { const L = leerEn({ pac: 'toribio', set: s.e }), na = coma(s.e.na ?? nuevo('toribio').na); return `Día 3: PA ${L.pas}/${L.pad} con noradrenalina ${na} y lactato ${coma(L.lact)}. ¿Qué haces con la hidrocortisona?`; };
export const CASOS = CASOS_BRUTOS.map((C) => {
  const dic = (f) => Object.fromEntries(f), P = PRES[C.pac];
  return {
    id: 'ejm-' + C.pac, titulo: C.titulo.replace(/ \(seguimiento\)$/, ''), sub: SUB[C.pac], corto: P.n, abrir: { pac: C.pac, paso: 0 },
    paciente: dic([['Paciente', `${P.n}, ${P.e} años · ${P.caso}`], ...filas(C.pac, C.pasos[0].e)]),
    pasos: C.pasos.map((s, i) => {
      const f = filas(C.pac, s.e), antes = i ? filas(C.pac, C.pasos[i - 1].e) : [];
      return {
        momento: MOMENTOS[C.pac][i], estado: { pac: C.pac, lup: C.lup, vista: s.vista, set: s.e }, datos: i ? dic(f) : {},
        nuevo: i ? f.filter(([k, v]) => k === 'Día' || antes.find((x) => x[0] === k)?.[1] !== v).map((x) => x[0]) : [],
        pregunta: { id: `ejm-${C.pac}-${i + 1}${C.pac === 'obdulia' && i < 2 ? 'a' : ''}`,   // la letra reparte la posición de la buena al barajar
         tipo: 'test', corto: `paso ${i + 1}`, enunciado: C.pac === 'toribio' && i === 1 ? enunToribio3(s) : s.enun, opciones: s.ops.map(op), explicacion: buena(s.ops)[2] + pg(buena(s.ops)[3]), fuente: fuentes(s.ops) },
      };
    }),
    lleva: C.llevas.map(([t, p, id]) => `${t} ${cita(p, id)}`), volver: { nombre: 'Suprarrenal y tiroides en el crítico (Marino, cap. 51)', ancla: VUELTA[C.pac] },
  };
});
