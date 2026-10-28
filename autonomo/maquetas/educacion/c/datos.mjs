// Maqueta C · contenido. Hoy = 04/11/2026 (fijo). Fuentes: F = fluidoterapia caps. 10-11, S = shock caps. 14-17 (página del PDF).
export const HOY = '2026-11-04';
export const PDF = {
  F: '../../../docs/marino-2024-fluidoterapia-caps10-11.pdf',
  S: '../../../docs/marino-2024-shock-caps14-17.pdf',
};

// Regla del repaso (decisión de diseño, sin ensayo): fallada -> 1 día; acertada: saldo 0-1 -> 3, 2 -> 7, >=3 -> 14.
export function intervalo(aciertos, fallos, ultimoFallo) {
  if (ultimoFallo) return 1;
  const saldo = aciertos - fallos;
  return saldo >= 3 ? 14 : saldo === 2 ? 7 : 3;
}
export function sumarDias(iso, n) {
  const [a, m, d] = iso.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d + n));
  return f.toISOString().slice(0, 10);
}
export const fechaES = iso => iso.split('-').reverse().join('/');

// ---------- Cinco de días atrás (copiadas de los bancos de la app) ----------
export const REPASO = [
  { id: 'hcl-e6', ficha: 'Hemorragia: clasificación', tipo: 'error', chip: 'Fallada hace 2 días', dias: 2, prev: [0, 1],
    enunciado: 'Notas de un compañero para la sesión. Encuentra los errores.',
    frases: [
      { t: 'Una mujer de 60 kg tiene unos 3,6 L de sangre.' },
      { t: 'Clase I: el relleno transcapilar la repone; no hace falta reanimar.' },
      { t: 'Clase II: diuresis por debajo de 0,5 mL/kg/h.', mal: true, c: 'En la Clase II la diuresis puede caer pero <span class="hl">no llega a oliguria</span> (<0,5); la oliguria es de la Clase III.' },
      { t: 'La Clase IV incluye la pérdida masiva de sangre.' },
      { t: 'Un Hto normal en urgencias descarta una pérdida grande.', mal: true, c: 'Al principio se pierde sangre entera y el Hto <span class="hl-rojo">no cambia</span>: un Hto normal no descarta nada.' }],
    explicacion: 'Dos errores: la oliguria es de la Clase III, y el Hto inicial no mide la pérdida.',
    fuentes: [['S', 22, 'la clase II no llega a oliguria'], ['S', 23, 'el Hto no cambia al principio']] },
  { id: 'rv-g7', ficha: 'Retorno venoso y volemia', tipo: 'test', chip: 'Fallada hace 1 día', dias: 1, prev: [0, 1],
    enunciado: 'Si la PVC no sirve como objetivo, ¿sirve al menos para saber si está seco?',
    opciones: [
      { t: 'Tampoco: no guarda relación con la volemia (r = 0,17)', ok: true },
      { t: 'Sí, si se mide al final de la espiración', porque: 'Medir al final de la espiración minimiza la presión intratorácica, pero la PEEP sigue influyendo y la distensibilidad del VD también la mueve. Decidir fluidos por ella es decidir a ciegas.' },
      { t: 'Sí, en ventilación espontánea, sin presión positiva que la falsee', porque: 'Aun sin presión positiva, la distensibilidad del VD la confunde (si baja, la PVC sube). La ficha es tajante: nunca debe usarse para decidir la fluidoterapia.' }],
    explicacion: 'Figura 11.4: 112 pares de medidas en postoperados, <span class="hl">r = 0,17 (p = 0,07)</span>: sin relación. La confunden la distensibilidad del VD y la presión intratorácica positiva. <span class="hl-rojo">Nunca debe usarse para decidir la fluidoterapia.</span>',
    fuentes: [['F', 27, 'Fig. 11.4 y «nunca debe usarse»']] },
  { id: 'rf-g5', ficha: 'Respuesta a fluidos', tipo: 'test', chip: 'Acertada hace 8 días · tocaba a los 7', dias: 8, prev: [2, 0],
    enunciado: 'Solo la mitad de los pacientes inestables responde a los fluidos (sube su volumen sistólico). Si uno responde, ¿está hipovolémico?',
    opciones: [
      { t: 'Sí: responder demuestra que le faltaba volumen', porque: 'Un normovolémico o hipervolémico también puede subir su VS con volumen. Leerlo como «estaba seco» te lleva a seguir dando bolos a quien ya le sobra agua.' },
      { t: 'No necesariamente: responde también el normovolémico', ok: true },
      { t: 'Sí, si además su PVC era baja antes del bolo', porque: 'La PVC no marca la volemia (r = 0,17, ficha anterior). Sumar una cifra que no informa no convierte la respuesta en un diagnóstico de hipovolemia.' }],
    explicacion: 'Responder <span class="hl">no significa estar hipovolémico</span>: un normovolémico o hipervolémico también puede responder. Evaluarlo antes de infundir debería reducir la sobrecarga.',
    fuentes: [['F', 31, 'responde la mitad']] },
  { id: 'rv-g5', ficha: 'Retorno venoso y volemia', tipo: 'destapa', chip: 'A medias hace 4 días · tocaba a los 3', dias: 4, prev: [1, 1],
    enunciado: 'Un varón de 75 kg pierde volumen. Sigue la cadena: ¿cuándo lo notarás, cuánto le falta entonces y cuánto Ringer hará falta para reponerlo? (son tres cosas)',
    puntos: [
      'La hipovolemia suele ser <span class="hl">silente hasta un déficit del 15 %</span>.',
      'En el varón medio eso son solo <span class="hl">450 mL</span> de plasma (300 en la mujer).',
      'Del Ringer, el 20 % queda en el plasma: <span class="hl">2,25 L</span>, y <span class="hl-rojo">1,8 L acaban en el intersticio</span>.'],
    explicacion: 'Plasma estimado: 40 mL/kg de peso magro en el varón y 36 en la mujer. No tener en cuenta lo pequeño que es el déficit lleva a infundir de más, y el cristaloide expande sobre todo el intersticio: favorece el edema.',
    notas: [
      ['Nota de fidelidad', 'El texto habla de un déficit del 15 % «de la volemia» (F pág. 25); la Tabla 11.1 aplica ese 15 % al plasma (450 mL de 3 L). La pregunta sigue la tabla.', [['F', 25]]],
      ['Nota de fuentes', 'El reparto del cristaloide no es el mismo en los dos capítulos: aquí, el cap. 11 (F pág. 26) dice que el 20 % va al plasma; la Figura 10.1 del cap. 10 (F pág. 6) da 275 mL por litro de salino (27,5 %). Se usa el 20 % del cap. 11; no se elige ganadora.', [['F', 26], ['F', 6]]]],
    fuentes: [['F', 25, 'silente hasta el 15 %'], ['F', 26, 'reparto del Ringer']] },
  { id: 'col-g4', ficha: 'Coloides y albúmina', tipo: 'test', chip: 'Acertada hace 3 días · tocaba a los 3', dias: 3, prev: [1, 0],
    enunciado: 'Sigue la cadena: 100 mL de albúmina al 25 % suben el plasma 300-400 mL. ¿De dónde sale el agua que sobra?',
    opciones: [
      { t: 'De las células, como con el salino hipertónico', porque: 'La albúmina tira con presión oncótica a través de la pared capilar: el agua sale del intersticio. Si crees que viene de las células, no verás que deja más seco un intersticio que quizá ya ha perdido líquido.' },
      { t: 'Del propio vial, que aporta más agua de la que parece', porque: 'El vial lleva 100 mL; los otros 200-300 los saca del intersticio. Creer que aporta volumen lleva a usarla para reponer pérdidas, y no sirve para eso.' },
      { t: 'Del intersticio: la mueve de sitio, no la repone', ok: true }],
    explicacion: 'Expande el plasma <span class="hl">sacando agua del intersticio</span>: el intersticio baja mientras el plasma sube. <span class="hl-rojo">No repone pérdidas, solo mueve líquido</span>.',
    fuentes: [['F', 13, 'albúmina 25 %'], ['F', 14, 'presión oncótica 70']] },
];

// ---------- Teresa ----------
const O = (t, ok, porque) => ok ? { t, ok: true } : { t, porque };
export const CASO = {
  P1: { tipo: 'test', piensa: true, id: 'P1',
    enunciado: 'Teresa pesa 60 kg y no sabes cuánto ha sangrado. Con la Tabla 15.1 en la cabeza: ¿qué clase de hemorragia es y con qué se reanima?',
    opciones: [
      O('Clase I: el Hto es normal, así que ha perdido poco; observar', false, 'A la hora se pierde sangre entera y el Hto no cambia (S pág. 23); esperar deja sin reponer una pérdida que ya taquicardiza.'),
      O('Clase II: taquicardia con PA mantenida y sin oliguria; cristaloides', true),
      O('Clase III: una FC >100 ya es shock; pedir sangre', false, 'La clase III es hipotensión, oliguria (<0,5 mL/kg/h, S pág. 2 y 17) y lactato alto (Tabla 15.1, S pág. 22-23); transfundir aquí es tratar un shock que no tiene.')],
    explicacion: 'Volemia 60 mL/kg → 3,6 L (S pág. 21). Clase II = 15-30 % (S pág. 22): FC ↑, PA sostenida por vasoconstricción, lactato ↔ (Tabla 15.1); la clase II no llega a oliguria (S pág. 23). Se reanima con cristaloides (S pág. 26). Se destapa el Hto: 45 %.',
    nota: ['Nota de fidelidad', 'La Tabla 15.1 pone FC ↑, pero F pág. 27 matiza que la taquicardia en decúbito es insensible: está ausente en la mayoría de los pacientes con déficit de hasta el 25 %.'],
    fuentes: [['S', 21], ['S', 22], ['S', 23], ['S', 26], ['F', 27]] },
  P2: { tipo: 'test', piensa: true, id: 'P2',
    enunciado: 'Pérdida estimada: 20 % (clase II). Con la Tabla 15.4: ¿cuánto cristaloide se repone?',
    opciones: [
      O('≈ 430 mL de Ringer: lo mismo que el déficit de plasma', false, 'Eso es el volumen con coloide (×1); solo el 20-25 % del cristaloide se queda en el plasma (S pág. 29): repondrías ≈ 100 mL.'),
      O('3,6 L: su volemia', false, 'Confundes volemia (3,6 L) con plasma (2,16 L) y repones la volemia entera: sobrecarga y edema (F pág. 26: el 80 % va al intersticio).'),
      O('≈ 1,3 L de cristaloide, o ≈ 430 mL de coloide', true)],
    explicacion: 'Plasma = 36 × 60 = 2.160 mL; 20 % = 432 mL; ×3 = 1.296 mL ≈ 1,3 L; coloide ×1 (Tabla 15.4, S pág. 29).',
    nota: ['Nota de fuentes', 'La Tabla 15.4 multiplica por 3 («estimación conservadora», S pág. 29); el cap. 11 calcula ×5 (F pág. 26). Las dos son de Marino: no gana ninguna.'],
    fuentes: [['S', 29], ['F', 26]] },
  P3: { tipo: 'test', piensa: true, id: 'P3',
    enunciado: 'Predice antes de tocar el modelo: de esos 2 L, ¿cuánto queda en el río de Teresa (su plasma mide 2 L, Tabla 10.1)?',
    opciones: [
      O('≈ 550 mL; unos 1.650 van a la marisma', true),
      O('2.000 mL: es isotónico y se queda en el vaso', false, 'El sodio se reparte por todo su extracelular (10 L); el plasma es solo una parte (F pág. 4-6).'),
      O('≈ 1.400 mL (70 %)', false, 'Eso lo hace la albúmina al 5 % (700 mL por litro, F pág. 13); la sal no se queda.')],
    explicacion: '275 mL por litro al plasma y 825 al intersticio (Fig. 10.1, F pág. 6), proporcional (ilustrativo para 2 L). El salino es algo hipertónico (308 mOsm/L) y saca agua de las células (F pág. 4-6).',
    confirma: 'Compruébalo en el modelo: río ≈ +550 mL, marisma ≈ +1.650, el mar baja ≈ 200. El marcador del río es neto: −400 por la sangre perdida y +550 por el salino, +150 en total.',
    fuentes: [['F', 4], ['F', 6], ['F', 13]] },
  P4: { tipo: 'destapa', id: 'P4',
    enunciado: 'El R1 dice: «Ha resangrado y está acidótica por hipoperfusión». ¿Qué le contestas, con la ficha de cristaloides y la Tabla 15.1? (son tres cosas)',
    puntos: [
      'El Hto baja por <span class="hl">dilución</span>: el cristaloide expande el plasma y no los hematíes; en las primeras horas refleja la reanimación, no la pérdida (S pág. 23).',
      'La acidosis es <span class="hl">hiperclorémica</span> por el cloro del salino (154 frente a 103 del plasma, Tabla 10.2, F pág. 4): en la Fig. 10.2 el pH bajó de 7,41 a 7,28 con salino a 30 mL/kg/h y no cambió con Ringer (F pág. 6).',
      'El <span class="hl">lactato es normal</span>: en la clase II el lactato no sube (Tabla 15.1, S pág. 22); no hay dato de hipoperfusión.'],
    explicacion: '«Lo que más importa es el cloro» (F pág. 6); el Ringer (Cl⁻ 109) no produce esta acidosis (F pág. 7).',
    fuentes: [['S', 23], ['F', 4], ['F', 6], ['S', 22], ['F', 7]] },
  P5: { tipo: 'error', id: 'P5',
    enunciado: 'Plan que deja escrito el R1 a las 4 h. Puede haber 0, 1 o 2 errores.',
    frases: [
      { t: 'Hto 38 %: sigue sangrando; pido 2 concentrados ya.', mal: true, c: 'El Hto a las 4 h refleja el salino, no la pérdida (S pág. 23). La sangre es de la clase III (Tabla 15.1, S pág. 22); los cristaloides, de la II (S pág. 26).' },
      { t: 'Cambio el salino por Ringer lactato: su cloro (109) no produce acidosis hiperclorémica.', f: [['F', 7]] },
      { t: 'El Ringer no: lleva 28 mmol/L de lactato y le subirá el lactato.', mal: true, c: 'El hígado aclara unos 100 mmol/h de lactato, lo que llevan 3,5 L de Ringer por hora (F pág. 8). Matiz: el aclaramiento con Ringer no se ha estudiado en críticos con shock o fallo hepático (F pág. 8), y Teresa es clase II, sin shock.' },
      { t: 'Si repito el lactato, no lo saco por la vía del Ringer: sale falsamente alto.', f: [['F', 8]] },
      { t: 'Si aparecen hipotensión, oliguria o lactato alto, pasa a clase III y se reanima con sangre.', f: [['S', 22]] }],
    explicacion: 'Dos errores: la sangre no es para la clase II, y el Ringer no sube el lactato en una paciente sin shock.',
    fuentes: [['S', 22], ['S', 23], ['F', 7], ['F', 8]] },
  P6: { tipo: 'test', piensa: true, id: 'P6',
    enunciado: 'Día 2: ya no sangra y el Hto sigue bajando. ¿Por qué?',
    opciones: [
      O('Resangrado oculto: hay que repetir la endoscopia', false, 'FC y PA son normales; el Hto tarda 8-12 h en notar el relleno y días en completarlo (S pág. 23): bajar al día siguiente es lo esperado.'),
      O('Relleno transcapilar (hasta 1 L) y retención de agua y sodio por ADH y aldosterona', true),
      O('El salino de ayer sigue en el plasma y lo diluye', false, 'El 80 % del cristaloide se fue al intersticio (F pág. 26); lo que ahora diluye es el agua que el intersticio y el riñón devuelven al plasma.')],
    explicacion: 'En el modelo, la marisma cede agua al río y los discos se separan: es el relleno de la hemorragia (S pág. 21-23).',
    fuentes: [['S', 21], ['S', 23], ['F', 26]] },
};

export const LLEVA = [
  'En la clase II la PA aguanta y el lactato no sube: cristaloides, y la cantidad la da la Tabla 15.4 (×3).',
  'Del salino solo ≈ 275 mL por litro quedan en el plasma, y su cloro (154) acidifica: Ringer si va a haber litros.',
  'El Hto de las primeras horas mide la reanimación, no la pérdida; al día siguiente baja por el relleno.'];
