// Maniobras de volumen sobre el motor del latido (sin DOM). No tocan la fisiología del latido: solo mueven sangre
// entre el volumen venoso «sin tensión» (que no empuja) y el que tiene tensión (el que crea la presión venosa y la Pms),
// o añaden volumen. Las usan los paneles «Guyton» de diagramas.mjs y las pruebas (pruebas/maniobras.test.mjs).

// Elevación pasiva de las piernas: «moviliza unos 300 mL de sangre hacia el corazón» (Marino, cap. 11; ficha
// #mar-epp, docs/marino-2024-fluidoterapia-caps10-11.pdf#page=33). Que esos 300 mL pasen del volumen sin tensión al que
// tiene tensión es el modelo de compartimentos de siempre: fisiología general.
export const EPP_ML = 300;
export const FUENTE_EPP = { texto: 'ficha · #mar-epp: «moviliza unos 300 mL» (Marino, cap. 11, p. 33)', sel: '#mar-epp', tab: 'mar-respuesta-fluidos', pagina: 33 };
// Sobrecarga de volumen: 250-500 mL (#mar-pms-fluidos, p. 23); la prueba estándar, 500 mL en 10-15 min
// (#mar-sobrecarga-prueba, p. 31)
export const BOLOS_ML = [250, 500];
export const FUENTE_BOLO = { texto: 'ficha · #mar-pms-fluidos (250-500 mL, Marino cap. 11, p. 23) y #mar-sobrecarga-prueba (500 mL en 10-15 min, p. 31)', sel: '#mar-pms-fluidos', tab: 'mar-retorno-venoso', pagina: 23 };

/** EPP activa (true) o quitada (false). Reversible y sin efecto si ya estaba así. Devuelve si quedó activa. */
export function epp(motor, on) {
  on = !!on;
  if (!!motor.p.epp === on) return on;
  motor.p.vuVen += on ? -EPP_ML : EPP_ML;
  motor.p.epp = on;
  return on;
}

/** Bolo de volumen (mL): entra en las venas (como los escenarios, que mueven m.s.vven). Devuelve el total infundido. */
export function bolo(motor, mL) {
  const v = Number(mL);
  if (!Number.isFinite(v) || v <= 0) return motor.p.boloTotal ?? 0;
  motor.s.vven += v;
  motor.p.boloTotal = (motor.p.boloTotal ?? 0) + v;
  return motor.p.boloTotal;
}

// Tras una maniobra, el panel deja correr el motor este tiempo (s) para que se vea ya el efecto, como hace un
// escenario elegido. El VS de la EPP llega a su pico en unos segundos y luego el barorreflejo lo recorta (en el
// cuerpo, «se disipa en minutos»). Ilustrativo.
export const SEGUNDOS_MANIOBRA = 10;

// La maniobra se hace sobre un VS basal estable (#mar-epp-pasos, paso 1). Un shock se ve a los 10 s de aplicarlo, con el
// barorreflejo todavía compensando (la venoconstricción tarda ~10 s): si la EPP se hiciera ahí, el VS subiría además por
// la propia compensación (en la hemorragia, +64 % en vez de +20 %; y en el fallo del VI, +15 %: «respondería»). Por eso, antes de
// la primera maniobra se deja correr al paciente hasta 40 s desde que empezó el escenario (desde que arrancó el motor, en
// el normal), el mismo tiempo que asienta una forma de enfermedad. Ilustrativo.
export const ASENTAR_MANIOBRA = 40;
/** Segundos que faltan para que el paciente esté asentado (0 si ya lo está). */
export function faltaParaAsentar(motor) {
  return Math.max(0, (motor.p.tEscenario ?? 0) + ASENTAR_MANIOBRA - motor.s.t);
}
