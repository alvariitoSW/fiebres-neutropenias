// Apuesta, «encuentra el error» y caso. Las respuestas NO están en el HTML: viven aquí y se comprueban al tocar.
import { cita } from './datos.js';
export const APUESTA = { p: 'abundio', enun: 'Abundio, 23 años, traumatismo craneal: pupila derecha dilatada y fija, izquierda reactiva; retira el brazo izquierdo al dolor. ¿Dónde está la masa y qué pasará con la mano si no se opera?',
  ops: [['Derecha, del lado de la pupila fija; sin operar, la mano irá a flexión y luego a extensión.', true, 'La pupila fija es la del lado de la masa (uncus sobre el III par). Sin operar, la compresión baja por el tronco: flexión (tálamo) y después extensión (mesencéfalo-protuberancia alta).', 10, 'mn-coma-posturas'],
    ['Izquierda, del lado de la pupila que reacciona y del brazo que se mueve; la mano seguirá igual.', false, 'Operarías el lado equivocado. La pupila dilatada y fija es la del lado de la masa en expansión (Tabla 45.4).', 11, 'mn-tabla-45-4'],
    ['Derecha, pero la herniación se frena sola y la mano seguirá igual aunque no se opere.', false, 'La herniación no se detiene sola: si la masa sigue, el tronco se comprime y el paciente pasa a flexión, extensión y flaccidez.', 10, 'mn-coma-posturas']], fin: { masa: 77 } };
export const ERROR = { p: 'petronila', enun: 'Petronila, HSA, día 1. Hay 0, 1 o 2 frases falsas. Toca las que contienen un error; si crees que no hay más, pulsa «No hay más errores».', fr: [
  ['Nimodipino 60 mg cada 4 horas por vía oral, 3 semanas.', false, 'Correcto: por vía oral, no intravenosa, y 3 semanas.', 48, 'mn-hsa-nimodipino'],
  ['PAS ≤140 con labetalol hasta cerrar el aneurisma.', false, 'Correcto: reduce el riesgo de resangrado mientras el aneurisma sigue abierto.', 47, 'mn-hsa-inmediato'],
  ['Ácido tranexámico para evitar el resangrado.', true, 'Error: los antifibrinolíticos no son eficaces para prevenir el resangrado y no se recomiendan; lo que lo previene es cerrar el aneurisma.', 47, 'mn-hsa-aneurisma'],
  ['Enoxaparina 40 mg una vez cerrado el aneurisma.', false, 'Correcto: el riesgo de TEV es del 25 %; se empieza tras cerrarlo.', 48, 'mn-hsa-generales'],
  ['Doppler transcraneal para el vasoespasmo (días 4-14).', false, 'Correcto: el vasoespasmo aparece entre los días 4 y 14.', 48, 'mn-hsa-vigilar'],
  ['El aneurisma puede esperar hasta tres semanas: lo urgente es bajar la PIC.', true, 'Error: se cierra en los primeros 3 días y nunca más allá de 7-10; esperar tres semanas deja al paciente expuesto al resangrado, la complicación más grave de los primeros días.', 47, 'mn-hsa-aneurisma']], nada: ['Hay errores: una de las frases falsa sigue sin tocar. Vuelve a leerlas con calma.', 'Ahora sí: ya has encontrado los dos errores.'] };
// Caso Abundio 23: tres pasos; cada uno aplica un estado al modelo (cifras de paciente posible).
export const CASO = { p: 'abundio', pasos: [
  { e: { tipo: 'hematoma', masa: 68, pas: 136 }, enun: 'Paso 1 · TCE con hematoma. Pupila derecha fija, GCS 9, PAM 95. PIC 30, PPC 65. ¿Qué haces?', ops: [
    ['Bolo de salino hipertónico, elevar la cabecera y cirugía del hematoma.', true, 'Baja la PIC mientras se llega al quirófano; el hipertónico es más eficaz que el manitol en el ictus (p. 41, Tabla 47.3; aquí se extrapola, inferencia). Cabecera elevada 30°: Manual UMI.', 41, 'mn-isq-edema-manejo', { hiper: 1 }],
    ['Hiperventilar 24 horas para bajar la PIC.', false, 'Baja la PIC unos minutos pero también el flujo; no se mantiene (Manual UMI; la p. 35 de Marino trata de la presión positiva, no de esto).', 35, 'mn-isq-vm', { vent: 'hv' }],
    ['Observar y repetir el TC en 6 horas.', false, 'La pupila fija es una masa en expansión: esperar es llegar a la descerebración.', 11, 'mn-tabla-45-4', { masa: 82 }]] },
  { e: { tipo: 'hematoma', masa: 68, pas: 136 }, enun: 'Paso 2 · TC: hematoma temporal derecho de 55 mL con desplazamiento de la línea media de 8 mm; la pupila derecha sigue fija. ¿Qué decides?', ops: [
    ['Cirugía urgente: supera el umbral de volumen (>50 mL) y la pupila sigue fija.', true, 'El Manual UMI indica cirugía con hematoma >50 mL, o con GCS 6-8, >20 mL y >5 mm; Abundio tiene 55 mL y la pupila fija (p. 11, Tabla 45.4): no se espera. Los umbrales son del Manual UMI, no de Marino.', 11, 'mn-tabla-45-4', {}],
    ['Solo monitor de PIC y manitol, y repetir el TC mañana.', false, 'Con 55 mL y 8 mm la masa sigue comprimiendo el tronco; esperar es perder la ventana en la que se salva al paciente.', 11, 'mn-tabla-45-4', { masa: 82 }],
    ['Hemicraniectomía descompresiva sin evacuar el hematoma.', false, 'Descomprime la caja pero deja la masa que comprime el uncus; la hemicraniectomía descompresiva se plantea en el infarto maligno de la ACM (≤60 años, ≤48 h; fuente web RCEM), no en el hematoma. Marino p. 40 solo la nombra en la hemorragia tras tPA.', 40, 'mn-isq-edema-manejo', {}]] },
  { e: { tipo: 'hematoma', masa: 40, pas: 120 }, enun: 'Paso 3 · Tras la cirugía, con sensor: PIC 16, PAM 84, PPC 68. ¿Cómo lo lees?', ops: [
    ['Dentro de objetivo (PIC <20, PPC 50-70): vigilar y mantener.', true, 'PIC <20 y PPC 50-70 son los objetivos de la hemorragia intracerebral.', 45, 'mn-hic-ppc', {}],
    ['PIC alta: más salino hipertónico.', false, 'Con PIC 16 no hay indicación; sin indicación, el salino repetido empuja el Na⁺ hacia el límite de 155 (objetivo 145-155, p. 41; el efecto de cada bolo es ilustrativo).', 41, 'mn-isq-edema-manejo', { hiper: 1 }],
    ['PPC baja: subir la PAM hasta PPC 100.', false, 'La PPC ya está en 50-70; la ficha da 50-70 como objetivo y no respalda subirla más (inferencia sobre p. 45).', 45, 'mn-hic-ppc', {}]] },
  { e: { tipo: 'hematoma', masa: 100, pas: 110 }, enun: 'Paso 4 · Día 2, la PIC subió hasta igualar a la PAM. Pupilas medias y fijas, sin reflejos, sin esfuerzo respiratorio; 30 horas de la lesión, T 35,4 °C. ¿Muerte encefálica?', ops: [
    ['Aún no: faltan horas (≥48) y la temperatura es <36 °C.', true, 'Tabla 45.6: ≥48 h de la lesión y T >36 °C antes de explorar.', 14, 'mn-me-definicion', {}],
    ['Sí: sin reflejos ni respiración se declara ya.', false, 'Declararla sin cumplir las condiciones previas es un error que no se puede deshacer.', 14, 'mn-me-definicion', {}],
    ['Sí, y se confirma con EEG plano.', false, 'El EEG no figura entre las pruebas confirmatorias aceptadas (p. 16).', 16, 'mn-me-confirmatorias', {}]] },
  { e: { tipo: 'hematoma', masa: 100, pas: 110 }, enun: 'Paso 5 · Día 3: T 36,6 °C, sin sedantes (5 semividas). Vas a hacer el test de apnea. ¿Qué PAM exiges?', ops: [
    ['PAM ≥75 mmHg (o PAS ≥100).', true, 'Es la condición de la Tabla 45.6; con PAM más baja el test no es fiable.', 15, 'mn-me-pam', {}],
    ['PAM ≥60 mmHg.', false, 'Con 60 puede no haber perfusión suficiente para el test: sería un test no válido.', 15, 'mn-me-pam', {}],
    ['No importa la PAM, solo la PaCO₂.', false, 'La PAM es una condición del test: sin ella el resultado no vale.', 15, 'mn-me-pam', {}]] }] };
export const LLEVAS = [`Pupila fija = masa del mismo lado ${cita(11, 'mn-tabla-45-4')}`, `Flexión → extensión → flácido: el tronco se comprime ${cita(10, 'mn-coma-posturas')}`, `PIC <20 y PPC 50-70 ${cita(45, 'mn-hic-ppc')}`, `Muerte encefálica: ≥48 h, T >36 °C, PAM ≥75 ${cita(14, 'mn-me-definicion')}`];
export const html = (o) => o;
export { ERROR_SEG, CASO_SEG } from './pruebas-seg.js';
export { cita };
