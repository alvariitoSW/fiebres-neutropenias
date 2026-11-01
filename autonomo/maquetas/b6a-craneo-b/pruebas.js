// Apuesta, «encuentra el error» y caso. Las respuestas NO están en el HTML: viven aquí y se comprueban al tocar.
import { cita } from './datos.js';
export const APUESTA = { p: 'abundio', enun: 'Abundio, 23 años, traumatismo craneal: pupila derecha dilatada y fija, izquierda reactiva; retira el brazo izquierdo al dolor. ¿Dónde está la masa y qué pasará con la mano si no se opera?',
  ops: [['Derecha, del lado de la pupila fija. La mano pasará a flexión y luego a extensión según el tronco se comprime.', true, 'La pupila fija es la del lado de la masa (uncus sobre el III par). Sin operar, la compresión baja por el tronco: flexión (tálamo) y después extensión (mesencéfalo-protuberancia alta).', 10, 'mn-coma-posturas'],
    ['Izquierda, porque es la pupila que reacciona y el lado que se mueve.', false, 'Operarías el lado equivocado. La pupila dilatada y fija es la del lado de la masa en expansión (Tabla 45.4).', 11, 'mn-tabla-45-4'],
    ['Derecha, pero la mano se queda como está.', false, 'La herniación no se detiene sola: si la masa sigue, el tronco se comprime y el paciente pasa a flexión, extensión y flaccidez.', 10, 'mn-coma-posturas']], fin: { masa: 77 } };
export const ERROR = { p: 'petronila', enun: 'Petronila, HSA, día 1. Toca la frase que contiene el error.', fr: [
  ['Nimodipino 60 mg cada 4 horas por vía oral, 3 semanas.', false, 'Correcto: por vía oral, no intravenosa, y 3 semanas.', 48, 'mn-hsa-nimodipino'],
  ['PAS ≤140 con labetalol hasta cerrar el aneurisma.', false, 'Correcto: reduce el riesgo de resangrado mientras el aneurisma sigue abierto.', 47, 'mn-hsa-inmediato'],
  ['Ácido tranexámico para evitar el resangrado.', true, 'Error: los antifibrinolíticos no son eficaces para prevenir el resangrado y no se recomiendan; lo que lo previene es cerrar el aneurisma. Con tranexámico aumentas el riesgo de trombosis sin proteger al paciente.', 47, 'mn-hsa-aneurisma'],
  ['Enoxaparina 40 mg una vez cerrado el aneurisma.', false, 'Correcto: el riesgo de TEV es del 25 %; se empieza tras cerrarlo.', 48, 'mn-hsa-generales'],
  ['Doppler transcraneal diario desde el día 4.', false, 'Correcto: el vasoespasmo aparece entre los días 4 y 14.', 48, 'mn-hsa-vigilar']] };
// Caso Abundio 23: tres pasos; cada uno aplica un estado al modelo (cifras de paciente posible).
export const CASO = { p: 'abundio', pasos: [
  { e: { tipo: 'hematoma', masa: 68, pas: 136 }, enun: 'Paso 1 · TCE con hematoma. Pupila derecha fija, GCS 9, PAM 95. PIC 30, PPC 65. ¿Qué haces?', ops: [
    ['Bolo de salino hipertónico, elevar la cabecera y cirugía del hematoma.', true, 'Baja la PIC mientras se llega al quirófano; el hipertónico es más eficaz que el manitol.', 41, 'mn-isq-edema-manejo', { hiper: 1 }],
    ['Hiperventilar 24 horas para bajar la PIC.', false, 'Baja la PIC unos minutos pero también el flujo; no se mantiene (Manual UMI).', 35, 'mn-isq-vm', { vent: 'hv' }],
    ['Observar y repetir el TC en 6 horas.', false, 'La pupila fija es una masa en expansión: esperar es llegar a la descerebración.', 11, 'mn-tabla-45-4', { masa: 82 }]] },
  { e: { tipo: 'hematoma', masa: 100, pas: 110 }, enun: 'Paso 2 · Día 2, tras cirugía. Pupilas medias y fijas, sin reflejos, sin esfuerzo respiratorio; 30 horas de la lesión, T 35,4 °C. ¿Muerte encefálica?', ops: [
    ['Aún no: faltan horas (≥48) y la temperatura es <36 °C.', true, 'Tabla 45.6: ≥48 h de la lesión y T >36 °C antes de explorar.', 14, 'mn-me-definicion', {}],
    ['Sí: sin reflejos ni respiración se declara ya.', false, 'Declararla sin cumplir las condiciones previas es un error que no se puede deshacer.', 14, 'mn-me-definicion', {}],
    ['Sí, y se confirma con EEG plano.', false, 'El EEG no es una prueba confirmatoria aceptada; solo se pide si no se completa la exploración.', 16, 'mn-me-confirmatorias', {}]] },
  { e: { tipo: 'hematoma', masa: 100, pas: 110 }, enun: 'Paso 3 · Día 3: T 36,6 °C, sin sedantes (5 semividas). Vas a hacer el test de apnea. ¿Qué PAM exiges?', ops: [
    ['PAM ≥75 mmHg (o PAS ≥100).', true, 'Es la condición de la Tabla 45.6; con PAM más baja el test no es fiable.', 15, 'mn-me-pam', {}],
    ['PAM ≥60 mmHg.', false, 'Con 60 puede no haber perfusión suficiente para el test: sería un test no válido.', 15, 'mn-me-pam', {}],
    ['No importa la PAM, solo la PaCO₂.', false, 'La PAM es una condición del test: sin ella el resultado no vale.', 15, 'mn-me-pam', {}]] }] };
export const LLEVAS = ['Pupila fija = masa del mismo lado', 'Flexión → extensión → flácido: el tronco se comprime', 'PIC <20 y PPC 50-70 (p. 45)'];
export const html = (o) => o;
export { cita };
