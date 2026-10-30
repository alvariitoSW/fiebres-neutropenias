// Caso 4 del río y mar: Teresa, 45 años, melenas (hemorragia digestiva clase II). Es el «equivocarse sin guía»: en el
// paso 3 decide sin ayudas, ve la consecuencia en el estuario y solo después la explicación. Paciente inventada; la
// medicina sale de Marino (fluidoterapia, caps. 10-11, y shock, cap. 15). Cifras del estuario: las del monitor
// (derivar() de agua-viva-data.js), salvo las rotuladas «dato del caso» o «ilustrativo».
//
// Páginas: las del PDF. «fluidoterapia» = marino-2024-fluidoterapia-caps10-11.pdf; «shock» = marino-2024-shock-caps14-17.pdf.
//   Teresa (60 kg, mujer): río 2.000 mL (Tabla 10.1), volemia 60 mL/kg = 3,6 L, plasma 36 mL/kg = 2,16 L (shock p. 21 y 29).
//   Con hemorragia 20 %: pérdida 720 mL, río −400. Salino 1,3 L: río +358, marisma +1.073, mar −130 → Hto 40 % (monitor).
//   Ringer 1,3 L: río +260, marisma +1.040 (20/80, fluidoterapia p. 26).
//
// El estado de los pasos 4-6 es el del plan bueno (Ringer 1,3 L); si en el paso 3 eligió el salino, `estadoSalino` lo
// cambia (lo aplica agua-viva.js) y `tras` cuenta lo que ve el monitor.
const TERESA = { paciente: 'mujer', hemorragia: 20, reloj: '1h' };
const RINGER = [{ f: 'ringer', ml: 1300 }], SALINO = [{ f: 'salino', ml: 1300 }];

const CLAS = 'mc-hemorragico-clasificacion';
export const CASO_TERESA = {
  id: 'w-4', titulo: 'Teresa, 45 años: la guardia del salino', corto: 'Caso 4 · Teresa', sub: 'melenas, 60 kg',
  paciente: { Edad: '45 años', Peso: '60 kg (volemia ≈ 3,6 L)', Motivo: 'Melenas desde la madrugada' },
  pasos: [
    { momento: 'Urgencias · hora 0', datos: { FC: '112 lpm', PA: '112/68 mmHg', Diuresis: '40 mL/h (0,67 mL/kg/h)', Lactato: '1,4 mmol/L (dato del caso)' }, nuevo: ['FC', 'PA', 'Diuresis', 'Lactato'],
      estado: TERESA, mirar: 'herida',
      pregunta: { id: 'w4-1', tipo: 'test', fuente: `${CLAS}#mc-tabla-15-1 · #mc-clase-ii · mar-cristaloides#mar-cristaloide-reparto`,
        enunciado: 'Teresa pesa 60 kg y no sabes cuánto ha sangrado. Con la Tabla 15.1 en la cabeza: ¿qué clase de hemorragia es y con qué se reanima?',
        opciones: [
          { t: 'Clase I: el Hto es normal, así que perdió poco; observar', ok: false, porque: 'A la hora se pierde sangre entera y el Hto no cambia (shock p. 23): esperar deja sin reponer una pérdida que ya taquicardiza.' },
          { t: 'Clase II: taquicardia con PA mantenida; cristaloides', ok: true },
          { t: 'Clase III: una FC >100 ya es shock; pedir sangre ya', ok: false, porque: 'La clase III es la del shock, con lactato alto (Tabla 15.1, shock pp. 22-23); en la clase II la PA y la diuresis se mantienen o bajan poco. Transfundir aquí es tratar un shock que no tiene.' }],
        explicacion: 'Volemia 60 mL/kg → 3,6 L (shock p. 21). Clase II = 15-30 % (p. 22): FC ↑, PA sostenida por vasoconstricción (p. 23), lactato ↔ y diuresis sin oliguria. Se reanima con cristaloides (p. 26).',
        nota: '<b>Nota de fidelidad.</b> La Tabla 15.1 pone la FC ↑, pero la fluidoterapia (p. 27) matiza que la taquicardia en decúbito es insensible: falta en la mayoría de los pacientes con un déficit de hasta el 25 %.' } },
    { momento: 'Urgencias · hora 0', datos: { Pérdida: '20 % (clase II)', Hto: '45 % (monitor; la Fig. 15.1 parte de 45 %)' }, nuevo: ['Pérdida', 'Hto'],
      estado: TERESA, mirar: 'rio',
      pregunta: { id: 'w4-2', tipo: 'test', fuente: 'mc-hemorragico-fluidos#mc-tabla-15-4 · #mc-vr-fluido · mar-retorno-venoso#mar-deficit-pequeno',
        enunciado: 'Pérdida estimada: 20 % (clase II). Con la Tabla 15.4: ¿cuánto cristaloide se repone?',
        opciones: [
          { t: '≈ 430 mL de Ringer: lo mismo que el déficit de plasma', ok: false, porque: 'Eso es el volumen con coloide (×1); solo el 20-25 % del cristaloide se queda en el plasma (shock p. 29): repondrías ≈ 100 mL y el río seguiría vacío.' },
          { t: '3,6 L: su volemia', ok: false, porque: 'Confundes volemia (3,6 L) con plasma (2,16 L) y repones la volemia entera: sobrecarga y edema (el 80 % del cristaloide va al intersticio, fluidoterapia p. 26).' },
          { t: '≈ 1,3 L de cristaloide, o ≈ 430 mL de coloide', ok: true }],
        explicacion: 'Plasma = 36 × 60 = 2.160 mL; 20 % = 432 mL; ×3 = 1.296 mL ≈ 1,3 L; con coloide, ×1 (Tabla 15.4, shock p. 29).',
        nota: '<b>Nota de fuentes.</b> La Tabla 15.4 multiplica por 3 («estimación conservadora», shock p. 29); el cap. 11 calcula ×5 (fluidoterapia p. 26). Las dos son de Marino: no gana ninguna.' } },
    { momento: 'Urgencias · hora 1', datos: { Pérdida: '20 % (clase II)', Fluidos: 'aún ninguno' }, nuevo: ['Fluidos'],
      estado: TERESA, mirar: 'rio',
      pregunta: { id: 'w4-3', tipo: 'test', fuente: 'mc-hemorragico-fluidos#mc-tabla-15-4 · mar-cristaloides#mar-ringer',
        enunciado: 'Decide tú, sin pistas: ¿qué le pones ahora?',
        opciones: [
          { t: '≈ 1,3 L de salino 0,9 % a chorro', ok: false, porque: 'La cantidad es la de la Tabla 15.4, pero el fluido no: del salino solo queda en el plasma una parte pequeña; el resto pasa al intersticio y, con él, el exceso de cloro.',
            consecuencia: { estado: { ...TERESA, infusiones: SALINO }, mirar: 'marisma',
              texto: 'Los 1,3 L de salino se reparten por todo su extracelular: <span class="hl-rojo">el río gana solo ≈ 360 mL y el intersticio ≈ 1.070</span> (275 y 825 mL por litro, Fig. 10.1, fluidoterapia pp. 5-7; reparto proporcional, ilustrativo para 1,3 L); el marcador del río es neto: −400 por la sangre perdida y +358 por el salino, −42 en total. El Hto baja del 45 % al 40 % en el monitor sin que Teresa haya perdido más sangre, y el cloro del salino (154, frente a 103 del plasma) tiende a acidificarla: <span class="hl-rojo">acidosis hiperclorémica</span> (fluidoterapia pp. 4-7).',
              corto: 'el salino pasó al intersticio, el Hto bajó por dilución y el cloro la acidificó.',
              fuente: 'mar-cristaloides#mar-fig-10-1 · #mar-salino · #mar-tabla-10-2' } },
          { t: '≈ 1,3 L de Ringer lactato', ok: true },
          { t: '2 concentrados de hematíes', ok: false, porque: 'La sangre es de la clase III (Tabla 15.1, shock p. 22); en una clase II compensada los cristaloides bastan (p. 26) y transfundes sin indicación.' }],
        nota: '<b>Las fuentes discrepan.</b> Cuánto cristaloide queda en el plasma: 27,5 % (Fig. 10.1, fluidoterapia pp. 5-7), 20 % con 80 % al intersticio (cap. 11, p. 26) y 20-25 % (Tabla 15.4, shock p. 29). El estuario usa la Fig. 10.1 para el salino y el 20 % para el Ringer; no se elige ganadora. Y el plasma de Teresa es 2,16 L con 36 mL/kg (shock p. 29); la Tabla 10.1 lo redondea a 2 L (fluidoterapia p. 3), que es lo que dibuja el río.',
        explicacion: 'Tabla 15.4: 432 mL de déficit de plasma × 3 ≈ 1,3 L de cristaloide (shock p. 29). El Ringer lactato lleva Cl⁻ 109 y <span class="hl">no produce la acidosis hiperclorémica</span> del salino (fluidoterapia p. 7). En el monitor, 1,3 L de Ringer son ≈ +260 mL en el río y ≈ +1.040 en la marisma (20/80, p. 26).' } },
    { momento: 'Hora 4 · el giro', tras: 'Se le pusieron los 1,3 L de salino a chorro. El monitor lo muestra: Hto 40 % y el intersticio cargado de líquido; el cloro habrá subido.',
      datos: { FC: '112 lpm', PA: '112/68 mmHg (como al llegar)', Lactato: '1,6 mmol/L (dato del caso)' }, nuevo: ['Lactato'],
      estado: { ...TERESA, infusiones: RINGER }, estadoSalino: { ...TERESA, infusiones: SALINO }, mirar: 'lectura',
      pregunta: { id: 'w4-4', tipo: 'destapa', fuente: `${CLAS}#mc-hto-trampa · #mc-tabla-15-1 · mar-cristaloides#mar-salino · #mar-tabla-10-2`,
        enunciado: 'El R1 dice: «El Hto ha caído: ha resangrado y está acidótica por hipoperfusión». ¿Qué le contestas, con la ficha de cristaloides y la Tabla 15.1? (son tres cosas)',
        puntos: [
          'El Hto baja por <span class="hl">dilución</span>: el cristaloide expande el plasma y no los hematíes; en las primeras horas refleja la reanimación, no la pérdida (shock p. 23).',
          'Una acidosis tras litros de fluido es <span class="hl">hiperclorémica</span> si fue salino (Cl⁻ 154 frente a 103 del plasma, Tabla 10.2, fluidoterapia p. 4): en la Fig. 10.2 el pH bajó de 7,41 a 7,28 con salino a 30 mL/kg/h y no cambió con Ringer (p. 6; estudio en cirugía ginecológica, mujeres sanas).',
          'El <span class="hl">lactato casi no se mueve</span> (1,6 frente a 1,4) y FC y PA siguen como al llegar: en la clase II el lactato no sube (Tabla 15.1, shock p. 22) y la FC sola no es fiable (fluidoterapia p. 27). No hay dato de hipoperfusión.'],
        explicacion: 'Lo que más importa es la diferencia de cloro (fluidoterapia p. 4); el Ringer (Cl⁻ 109) no produce esta acidosis (p. 7). Aceptar «resangrado» por un Hto diluido lleva a pedir sangre y más fluidos sin motivo.' } },
    { momento: 'Hora 4 · plan de guardia', datos: { Plan: 'lo deja escrito el R1' }, nuevo: ['Plan'],
      estado: { ...TERESA, infusiones: RINGER }, estadoSalino: { ...TERESA, infusiones: SALINO }, mirar: 'rio',
      pregunta: { id: 'w4-5', tipo: 'error', fuente: `${CLAS}#mc-tabla-15-1 · #mc-hto-trampa · mar-cristaloides#mar-ringer`,
        enunciado: 'Plan que deja escrito el R1 a las 4 h. Puede haber 0, 1 o 2 errores.',
        frases: [
          { t: 'El Hto ha bajado: sigue sangrando; pido 2 concentrados ya.', mal: true, c: 'El Hto a las 4 h refleja los fluidos, no la pérdida (shock p. 23). La sangre es de la clase III (Tabla 15.1, p. 22); los cristaloides, de la II (p. 26).' },
          { t: 'Si hay que seguir reponiendo, mejor Ringer lactato que salino: su cloro (109) no produce acidosis hiperclorémica.', mal: false },
          { t: 'El Ringer no: lleva 28 mmol/L de lactato y le subirá el lactato lo bastante para confundir la clase II.', mal: true, c: 'Sube poco (0,9 mmol/L en sanos con 30 mL/kg, similar al del salino; fluidoterapia p. 8) y no es dato de hipoperfusión. El hígado aclara unos 100 mmol/h, lo que llevan 3,5 L de Ringer por hora (p. 8). Matiz: el aclaramiento con Ringer no se ha estudiado en críticos con shock o fallo hepático (p. 8), y Teresa es clase II, sin shock.' },
          { t: 'Si repito el lactato, no lo saco por la vía del Ringer: sale falsamente alto.', mal: false },
          { t: 'Si aparece lactato alto o signos de shock, pasa a clase III y se reanima con sangre.', mal: false }],
        explicacion: 'Dos errores: la sangre no es para la clase II, y el Ringer sube poco el lactato (0,9 mmol/L en sanos, similar al del salino; fluidoterapia p. 8), así que no es motivo para evitarlo en una paciente sin shock.' } },
    { momento: 'Día 2', datos: { Endoscopia: 'úlcera tratada, no sangra', FC: '88 lpm', PA: '120/70 mmHg', Hto: 'sigue bajando' }, nuevo: ['Endoscopia', 'FC', 'PA', 'Hto'],
      estado: { ...TERESA, reloj: 'dias', infusiones: RINGER }, estadoSalino: { ...TERESA, reloj: 'dias', infusiones: SALINO }, mirar: 'marisma',
      pregunta: { id: 'w4-6', tipo: 'test', fuente: `${CLAS}#mc-hto-reanimacion · #mc-hto-trampa`,
        enunciado: 'Día 2: ya no sangra y el Hto sigue bajando. ¿Por qué?',
        opciones: [
          { t: 'Resangrado oculto con FC y PA todavía normales: repetir la endoscopia', ok: false, porque: 'FC y PA son normales y la úlcera está tratada; el Hto tarda 8-12 h en notar el relleno y días en completarlo (shock p. 23): bajar al día siguiente es lo esperado y repetirías una prueba invasiva sin motivo.' },
          { t: 'Relleno transcapilar y retención de agua y sodio (ADH, aldosterona)', ok: true },
          { t: 'El suero de ayer sigue en el plasma y lo sigue diluyendo hoy', ok: false, porque: 'La mayor parte del cristaloide ya se fue al intersticio (80 %, fluidoterapia p. 26); lo que ahora diluye es el agua que pasa del intersticio al plasma (relleno, shock p. 21).' }],
        explicacion: 'En el modelo, la marisma cede agua al río y los discos se separan: es el relleno de la hemorragia, que puede añadir hasta 1 L al plasma (shock pp. 21-23).' } }
  ],
  objetivos: [
    { id: 'clase', texto: 'Clase y cantidad de la hemorragia', pasos: [0, 1], si: 'Clase II y ≈ 1,3 L de cristaloide por la Tabla 15.4.', no: 'La clase decide el fluido y la cantidad sale del plasma × % de pérdida × 3.', fuente: `${CLAS}#mc-tabla-15-1 · mc-hemorragico-fluidos#mc-tabla-15-4` },
    { id: 'fluido', texto: 'Elegir el fluido sin ayuda', pasos: [2], si: 'Ringer lactato en la cantidad justa, sin cloro de más.', no: 'El salino a chorro se queda poco en el río y acidifica; la sangre es de la clase III.', fuente: 'mar-cristaloides#mar-fig-10-1 · #mar-ringer' },
    { id: 'hto', texto: 'No leer el Hto de las primeras horas como pérdida', pasos: [3, 4, 5], si: 'El Hto refleja los fluidos y, al día siguiente, el relleno.', no: 'En las primeras horas el Hto mide la reanimación, no la pérdida; baja después por el relleno.', fuente: `${CLAS}#mc-hto-trampa · #mc-hto-reanimacion` }
  ],
  lleva: [
    'En la clase II la PA aguanta y el lactato no sube: cristaloides, y la cantidad la da la Tabla 15.4 (×3).',
    'Del salino solo queda en el plasma una parte pequeña (≈ 275 mL por litro; las fuentes discrepan, 20-27,5 %), y su cloro (154) acidifica: Ringer si va a haber litros.',
    'El Hto de las primeras horas mide la reanimación, no la pérdida; al día siguiente baja por el relleno.'],
  volver: { nombre: 'Shock hemorrágico', ficha: 'mc-hemorragico-clasificacion (Merino Cardiología)', estado: { ...TERESA, infusiones: RINGER }, pestana: 'sangrado' }
};
