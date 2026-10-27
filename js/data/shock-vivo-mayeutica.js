// La Mayéutica del shock vivo en el formato del motor común (core/mayeutica-motor.js): guía socrática, examen y el caso
// de Aurelio. El texto de las preguntas está en shock-vivo-data.js (PREGUNTAS y CASO, con sus citas); aquí solo se
// pasa al formato del motor. Las cifras de un enunciado o de unas opciones que dependen del monitor llevan, además, su
// función (`vivo`): al preguntar, el modelo se pone en el estado de la pregunta y el texto se escribe con sus cifras;
// el texto fijo de aquí solo sirve de reserva y para comprobar la forma del banco.
import { PREGUNTAS as RAW0, CASO as RAW_CASO, C } from './shock-vivo-data.js';
import { tempDe, pdfPagina } from './balon-temporizacion-data.js';

const CORTO = { G1: 'balón: cuándo se hincha', G4: 'balón 1:2', G5: 'el «Aumento» de la consola', G6: 'contraindicaciones del balón', B1: 'balón bien sincronizado', B2: 'pon los errores', B3: 'inflado precoz', B4: 'inflado tardío', B5: 'desinflado precoz o tardío', B6: 'corregir el balón', B7: 'frases del balón', G2: 'Impella a 5,5 L/min',
  G3: 'ECMO y el VI', E1: 'ScvO₂ en la sepsis', E2: 'sin balón', E3: 'pie sin pulso con balón', E4: 'complicación del Impella', E5: 'ventaja del ECMO VA' };
// ── Temporización del balón (Gillespie 2024, p. 8 «Timing errors» y pie de la Fig. 7, p. 6). Los textos salen de
// balon-temporizacion-data.js; los segundos de cada error son del modelo (ilustrativo). Marino (p. 45) da el balón; la
// temporización la da Gillespie, enlazada a su página en `org`.
const gp = (p) => `Gillespie 2024, <a class="cita-pdf" href="${pdfPagina(p)}" target="_blank" rel="noopener">PDF, p. ${p}</a>`;
const T = (k) => ({ tim: tempDe(k).tim, timK: k });
const PB = (k) => ({ pac: 'aurelio', ajuste: { soporte: 'balon', razon: 2, ...T(k) }, escena: 'balon' });
const CMP = (k, txt, mira) => ({ txt, ajuste: { razon: 2, ...T(k) }, mira, cifras: ['picoDia', 'picoNo', 'teleDia', 'teleNo'] });
const ILU = 'Los segundos de cada error son del modelo (ilustrativo): la fuente no da cifras de ms.';
const BALON_NUEVAS = [
  { id: 'B1', grupo: 'guia', predice: true, prepara: PB('ok'),
    enunciado: 'Aurelio lleva el balón en 1:2 y bien sincronizado. <b>Antes de mirar la curva: ¿dónde se hincha, qué forma deja y qué pasa con la telediastólica del latido asistido?</b>',
    opciones: [
      { t: 'En la muesca, con «V» marcada; el aumento supera la sistólica y la telediastólica baja.', ok: true },
      { t: 'Antes de la muesca, sobre el pico sistólico; así el aumento se suma a la sistólica y la telediastólica no cambia.', porque: 'Eso es el inflado precoz: se pierde la «V», el balón se hincha con la aórtica aún abierta y sube la poscarga. Aurelio tendría más consumo de oxígeno, no menos.' },
      { t: 'Mucho después de la muesca: la «V» se ve, pero el aumento queda por debajo de la sistólica.', porque: 'Eso es el inflado tardío: poca sangre extra a las coronarias. Aurelio no ganaría la perfusión que busca el balón.' },
      { t: 'En la muesca; la telediastólica asistida sale igual o mayor que la no asistida.', porque: 'Con la sincronización correcta baja; que no baje es la señal del desinflado tardío, con el balón aún hinchado cuando se abre la aórtica.' }],
    explica: 'Inflado en la muesca dícrota (cierre de la aórtica): «V» marcada, aumento por encima de la sistólica anterior y telediastólica asistida más baja; así el balón mejora la perfusión coronaria y baja la poscarga.', cita: C.iabp,
    org: gp(8) + ': la «V», el aumento más alto y la telediastólica 15-20 mmHg más baja. En este modelo baja menos de 15-20 mmHg: la fuente da la cifra, el modelo no la alcanza',
    comprueba: CMP('ok', 'Compruébalo: mira la curva en 1:2', 'Mira el latido asistido junto al no asistido: la «V» en la muesca, el aumento sobre la sistólica y la telediastólica más baja.') },
  { id: 'B2', grupo: 'guia', tipo: 'destapa', predice: false, prepara: PB('ok'),
    enunciado: 'Ahora juega con la consola: <b>pulsa «Inflado precoz» en «Temporización» y mira la curva.</b> ¿Qué dos cosas cambian? Son dos.',
    puntos: [
      { t: 'En la curva: el aumento <span class="hl-rojo">empieza antes de la muesca</span>, se pierde la «V» y se monta sobre el pico sistólico.', org: gp(8) + '; ' + ILU, c: C.iabp },
      { t: 'En el paciente: el balón se hincha con la aórtica abierta; la válvula cierra antes y suben la presión telediastólica del VI, la PCP y el consumo de oxígeno.', org: gp(8) + ': puede haber regurgitación aórtica y el gasto baja', c: C.iabp }],
    explica: 'Prueba después los otros tres botones: cada error deja una forma distinta en la curva.',
    comprueba: CMP('infPre', 'Pon «Inflado precoz» en la consola', 'Ve cómo el aumento se funde con el pico sistólico y se pierde la «V». Pulsa los otros tres botones de Temporización y compara.') },
  { id: 'B3', grupo: 'examen', prepara: PB('infPre'),
    enunciado: 'Aurelio, balón en 1:2. En la curva, el aumento empieza antes de la muesca dícrota, no hay «V» y los dos picos casi no se distinguen. <b>¿Qué error de temporización es y qué le hace al ventrículo?</b>',
    opciones: [
      { t: 'Inflado precoz: sube la poscarga y con ella la telediastólica del VI y la PCP.', ok: true },
      { t: 'Inflado tardío: la perfusión coronaria queda corta y el ventrículo no nota nada.', porque: 'En el inflado tardío la «V» sí se ve y el aumento es pequeño. Aquí el aumento se funde con la sistólica: Aurelio sufriría más poscarga, no solo menos coronarias.' },
      { t: 'Desinflado precoz: el balón casi no baja la poscarga.', porque: 'Ese error se ve como una caída en picado tras el pico del aumento, no como un aumento adelantado. Aurelio tendría la causa mal buscada y no corregirías el inflado.' },
      { t: 'Desinflado tardío: el balón sigue hinchado cuando abre la aórtica y el VI eyecta contra él.', porque: 'Ese error se ve con una telediastólica asistida igual o mayor que la no asistida y un pico ensanchado, no con el inicio adelantado del aumento.' }],
    explica: 'Inflado precoz: se hincha con la aórtica aún abierta; sube la poscarga y con ella el volumen y la presión telediastólica del VI, la PCP y el consumo de oxígeno.', cita: C.iabp,
    org: gp(8) + ' (y el pie de la Fig. 7, ' + gp(6).replace('Gillespie 2024, ', '') + '). ' + ILU,
    comprueba: CMP('infPre', 'Compruébalo en la consola', 'Mira cómo se monta el aumento sobre la sistólica del latido asistido.') },
  { id: 'B4', grupo: 'examen', prepara: PB('infTar'),
    enunciado: 'Aurelio, balón en 1:2. La muesca dícrota se ve bien y el balón se hincha mucho después de ella: la «V» desaparece y el aumento queda igual o por debajo de la sistólica sin asistir. <b>¿Qué pierde Aurelio?</b>',
    opciones: [
      { t: 'Flujo coronario: con un aumento tan pequeño llega poca sangre extra a las coronarias.', ok: true },
      { t: 'Vaciado ventricular: la aórtica cierra antes y sube la presión telediastólica del VI.', porque: 'Eso es el inflado precoz, con el balón hinchado antes de la muesca. Aquí la muesca se ve limpia; no sube la poscarga por ese motivo.' },
      { t: 'Nada: el balón sigue bajando la poscarga igual, solo cambia la forma de la curva.', porque: 'El beneficio queda lejos del de un balón bien sincronizado. Aurelio seguiría con un balón puesto y poco efecto en las coronarias.' },
      { t: 'Flujo carotídeo: el vacío de la mitad de la diástole invierte el flujo.', porque: 'Ese vacío lo describe la fuente para el desinflado precoz, no para el inflado tardío.' }],
    explica: 'Inflado tardío: la muesca se ve, pero el balón se hincha tarde; el aumento es menor y la perfusión coronaria, insuficiente, aunque quede algo de beneficio.', cita: C.iabp,
    org: gp(8) + '. ' + ILU,
    comprueba: CMP('infTar', 'Compruébalo en la consola', 'Mira la «V» limpia y el aumento pequeño del latido asistido.') },
  { id: 'B5', grupo: 'examen', prepara: PB('desTar'),
    enunciado: 'Aurelio, balón en 1:2. El latido asistido tiene la telediastólica igual o mayor que la del no asistido y el pico del aumento está ensanchado. <b>¿Qué error es y qué ocurre cuando se abre la aórtica?</b>',
    opciones: [
      { t: 'Desinflado precoz: el balón se vacía antes de la isovolumétrica y la presión cae en picado tras el aumento.', porque: 'En ese error la telediastólica asistida también es igual o menor, pero lo que lo delata es la caída en picado, no el pico ensanchado. Aurelio no tendría resistencia añadida a la eyección.' },
      { t: 'Desinflado tardío: sigue hinchado, el VI eyecta contra él, alarga la isovolumétrica y sube el consumo de oxígeno.', ok: true },
      { t: 'Inflado tardío: el aumento es pequeño y la «V» se pierde.', porque: 'Ese error cambia el aumento, no la telediastólica. Con un inflado tardío no verías el pico ensanchado ni la telediastólica sin bajar.' },
      { t: 'Correcto: la telediastólica asistida siempre queda igual a la no asistida.', porque: 'Bien sincronizado, la asistida baja. Dar por buena esa curva dejaría a Aurelio con más trabajo cardíaco.' }],
    explica: 'Desinflado tardío: el balón sigue hinchado cuando la aórtica ya se abre; en vez de bajar la poscarga, dificulta la eyección y alarga la contracción isovolumétrica.', cita: C.iabp,
    org: gp(8) + '. ' + ILU,
    comprueba: CMP('desTar', 'Compruébalo en la consola', 'Mira la telediastólica del latido asistido frente a la del no asistido.') },
  { id: 'B6', grupo: 'examen', prepara: PB('desPre'),
    enunciado: 'Aurelio, balón en 1:2. Tras el pico del aumento, la presión cae en picado; la sistólica asistida es igual o mayor que la no asistida. <b>¿Qué error es y qué ajustas en la consola?</b>',
    opciones: [
      { t: 'Desinflado tardío; acortas el tiempo de inflado.', porque: 'El desinflado tardío da la telediastólica asistida igual o mayor y el pico ensanchado, no una caída en picado. Acortar el inflado agravaría el vaciado precoz de Aurelio.' },
      { t: 'Inflado precoz; esperas a la muesca dícrota y desplazas el inicio.', porque: 'En el inflado precoz el aumento empieza antes de la muesca y se funde con la sistólica. Aquí el problema está al final del aumento, no al principio.' },
      { t: 'Desinflado precoz; alargas el tiempo de inflado o pasas al modo automático.', ok: true },
      { t: 'Desinflado precoz; apagas el balón, porque no tiene arreglo.', porque: 'Tiene arreglo: se alarga el inflado o se pasa al modo automático. Apagarlo dejaría a Aurelio sin ninguna asistencia.' }],
    explica: 'Desinflado precoz: el balón se vacía antes de la contracción isovolumétrica; se corrige alargando el tiempo de inflado. (El desinflado tardío se corrige al revés, acortándolo.)', cita: C.iabp,
    org: gp(8) + ': la caída en picado y la corrección. ' + ILU + ' Aviso: el vacío de la mitad de la diástole puede invertir el flujo en coronarias y carótidas (misma página)',
    comprueba: CMP('desPre', 'Compruébalo en la consola', 'Mira la caída en picado tras el pico del aumento y la telediastólica del latido asistido.') },
  { id: 'B7', grupo: 'examen', tipo: 'error', prepara: PB('infPre'),
    enunciado: 'El R1 anota lo que ve con el balón de Aurelio en 1:2 con «Inflado precoz». <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'Con el balón bien sincronizado, se hincha en la muesca dícrota y deja una «V» marcada.' },
      { t: 'Con inflado precoz, el aumento se monta sobre el pico sistólico y se pierde la «V».' },
      { t: 'El inflado precoz baja la poscarga y por eso baja el consumo de oxígeno.', mal: true, buena: 'El inflado precoz sube la poscarga: la aórtica cierra antes y suben la presión telediastólica del VI, la PCP y el consumo de oxígeno (' + 'Gillespie 2024, p. 8).', cita: C.iabp },
      { t: 'En el inflado tardío la «V» se ve, pero el aumento es menor.' }],
    explica: 'Solo la tercera es falsa: un inflado adelantado sube la poscarga, no la baja.', cita: C.iabp,
    org: gp(8) },
];
const RAW = [...RAW0];
const meter = (despuesDe, nuevas) => { const i = RAW.findIndex((q) => q.id === despuesDe); RAW.splice(i + 1, 0, ...nuevas); };
meter('G4', BALON_NUEVAS.slice(0, 2)); meter('E3', BALON_NUEVAS.slice(2));

// Una lectura de reserva: todo a 0 (no se ve nunca; el modelo da las cifras de verdad)
const R0 = new Proxy({}, { get: () => 0 });

function convertir(q, id, grupo) {
  const fn = (x) => typeof x === 'function';
  const o = { id, grupo, tipo: q.tipo === 'destapa' ? 'destapa' : q.tipo === 'error' ? 'error' : 'test', corto: CORTO[id] || id,
    modelo: q.prepara, predice: !!q.predice, comprobar: q.comprueba || null, org: q.org || '',
    enunciado: fn(q.enunciado) ? q.enunciado(R0) : q.enunciado };
  if (fn(q.enunciado) || fn(q.opciones)) o.vivo = { enunciado: fn(q.enunciado) ? q.enunciado : null, opciones: fn(q.opciones) ? q.opciones : null };
  if (o.tipo === 'destapa') {
    o.puntos = q.puntos.map((p) => p.t); o.puntosOrg = q.puntos.map((p) => p.org || ''); o.fuente = q.puntos.map((p) => p.c);
  } else if (o.tipo === 'error') {
    o.frases = q.frases.map((f) => ({ t: f.t, mal: !!f.mal, ...(f.mal ? { c: f.buena } : {}), fuente: f.cita }));
    o.fuente = [q.cita];
  } else {
    o.opciones = (fn(q.opciones) ? q.opciones(R0) : q.opciones).map((x) => ({ ...x }));
    o.fuente = [q.cita, q.cita2].filter(Boolean);
  }
  if (q.explica) o.explicacion = q.explica;
  return o;
}

export const PREGUNTAS = RAW.map((q) => convertir(q, q.id, q.grupo));

export const CASOS = [{
  titulo: RAW_CASO.titulo, sub: 'Un infarto anterior que se complica, de la hemodinámica al ECMO', corto: 'Aurelio', paciente: {},
  pasos: RAW_CASO.pasos.map((p, i) => ({ momento: p.dia, modelo: p.prepara, ficha: p.ficha, pregunta: convertir(p, `C${i + 1}`, 'caso') })),
  lleva: RAW_CASO.llevas,
  volver: { nombre: 'Shock cardiogénico: la hemodinámica', ancla: 'mc-cs-hemodinamica' },
}];
